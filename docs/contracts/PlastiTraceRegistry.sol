// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/// @title PlastiTrace Registry
/// @notice Minimal on-chain attestation layer for material identity, verification,
/// custody transitions, and evidence anchoring.
///
/// Operational data, PII, photos, pricing, and payout records stay off-chain.
/// This contract is intentionally a registry, not a marketplace or token.
/// Production deployment requires an independent audit, multisig administration,
/// a pause policy, chain-finality handling, and a documented upgrade policy.
contract PlastiTraceRegistry {
    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");
    bytes32 public constant VERIFIER_ROLE = keccak256("VERIFIER_ROLE");
    bytes32 public constant OPERATOR_ROLE = keccak256("OPERATOR_ROLE");

    enum LotState {
        Registered,
        InReview,
        Verified,
        InTransit,
        Received,
        Processed,
        Voided
    }

    struct MaterialLot {
        bytes32 lotId;
        bytes32 organizationId;
        bytes3 materialCode;
        uint64 quantityGrams;
        uint64 capturedAt;
        LotState state;
        address currentCustodian;
        bytes32 metadataHash;
        bytes32 latestEvidenceHash;
    }

    struct VerificationAttestation {
        bytes32 lotId;
        address verifier;
        bytes32 evidenceHash;
        bytes32 verificationHash;
        uint64 quantityGramsObserved;
        uint64 attestedAt;
        bool passed;
    }

    mapping(bytes32 => MaterialLot) private lots;
    mapping(bytes32 => VerificationAttestation[]) private attestations;
    mapping(bytes32 => mapping(bytes32 => bool)) private seenEvidence;
    mapping(bytes32 => bool) public lotExists;
    mapping(address => mapping(bytes32 => bool)) public hasRole;

    event RoleGranted(bytes32 indexed role, address indexed account);
    event RoleRevoked(bytes32 indexed role, address indexed account);
    event LotRegistered(
        bytes32 indexed lotId,
        bytes32 indexed organizationId,
        bytes3 materialCode,
        uint64 quantityGrams,
        bytes32 metadataHash,
        address indexed custodian
    );
    event EvidenceAnchored(bytes32 indexed lotId, bytes32 indexed evidenceHash, address indexed actor);
    event LotVerified(bytes32 indexed lotId, bool passed, bytes32 indexed verificationHash, address indexed verifier);
    event CustodyTransferred(bytes32 indexed lotId, address indexed from, address indexed to, LotState state);
    event LotStateChanged(bytes32 indexed lotId, LotState previousState, LotState newState, address indexed actor);
    event LotVoided(bytes32 indexed lotId, bytes32 indexed reasonHash, address indexed actor);

    error Unauthorized();
    error AlreadyExists();
    error UnknownLot();
    error InvalidState();
    error InvalidQuantity();
    error EvidenceAlreadySeen();
    error ZeroAddress();

    constructor(address initialAdmin) {
        if (initialAdmin == address(0)) revert ZeroAddress();
        hasRole[initialAdmin][ADMIN_ROLE] = true;
        emit RoleGranted(ADMIN_ROLE, initialAdmin);
    }

    modifier onlyRole(bytes32 role) {
        if (!hasRole[msg.sender][role] && !hasRole[msg.sender][ADMIN_ROLE]) revert Unauthorized();
        _;
    }

    function grantRole(bytes32 role, address account) external onlyRole(ADMIN_ROLE) {
        if (account == address(0)) revert ZeroAddress();
        hasRole[account][role] = true;
        emit RoleGranted(role, account);
    }

    function revokeRole(bytes32 role, address account) external onlyRole(ADMIN_ROLE) {
        hasRole[account][role] = false;
        emit RoleRevoked(role, account);
    }

    function registerLot(
        bytes32 lotId,
        bytes32 organizationId,
        bytes3 materialCode,
        uint64 quantityGrams,
        uint64 capturedAt,
        bytes32 metadataHash,
        address initialCustodian
    ) external onlyRole(OPERATOR_ROLE) {
        if (lotExists[lotId]) revert AlreadyExists();
        if (quantityGrams == 0 || initialCustodian == address(0)) revert InvalidQuantity();

        lotExists[lotId] = true;
        lots[lotId] = MaterialLot({
            lotId: lotId,
            organizationId: organizationId,
            materialCode: materialCode,
            quantityGrams: quantityGrams,
            capturedAt: capturedAt,
            state: LotState.Registered,
            currentCustodian: initialCustodian,
            metadataHash: metadataHash,
            latestEvidenceHash: bytes32(0)
        });

        emit LotRegistered(lotId, organizationId, materialCode, quantityGrams, metadataHash, initialCustodian);
    }

    function anchorEvidence(bytes32 lotId, bytes32 evidenceHash) external onlyRole(OPERATOR_ROLE) {
        _requireLot(lotId);
        if (seenEvidence[lotId][evidenceHash]) revert EvidenceAlreadySeen();
        seenEvidence[lotId][evidenceHash] = true;
        lots[lotId].latestEvidenceHash = evidenceHash;
        emit EvidenceAnchored(lotId, evidenceHash, msg.sender);
    }

    function submitVerification(
        bytes32 lotId,
        bytes32 evidenceHash,
        bytes32 verificationHash,
        uint64 quantityGramsObserved,
        bool passed
    ) external onlyRole(VERIFIER_ROLE) {
        _requireLot(lotId);
        MaterialLot storage lot = lots[lotId];
        if (lot.state != LotState.Registered && lot.state != LotState.InReview) revert InvalidState();
        if (quantityGramsObserved == 0) revert InvalidQuantity();

        lot.state = passed ? LotState.Verified : LotState.InReview;
        attestations[lotId].push(VerificationAttestation({
            lotId: lotId,
            verifier: msg.sender,
            evidenceHash: evidenceHash,
            verificationHash: verificationHash,
            quantityGramsObserved: quantityGramsObserved,
            attestedAt: uint64(block.timestamp),
            passed: passed
        }));

        emit LotVerified(lotId, passed, verificationHash, msg.sender);
        emit LotStateChanged(lotId, LotState.InReview, lot.state, msg.sender);
    }

    function transferCustody(bytes32 lotId, address nextCustodian) external onlyRole(OPERATOR_ROLE) {
        _requireLot(lotId);
        if (nextCustodian == address(0)) revert ZeroAddress();
        MaterialLot storage lot = lots[lotId];
        if (lot.state != LotState.Verified && lot.state != LotState.InTransit && lot.state != LotState.Received) revert InvalidState();
        address previousCustodian = lot.currentCustodian;
        lot.currentCustodian = nextCustodian;
        lot.state = LotState.InTransit;
        emit CustodyTransferred(lotId, previousCustodian, nextCustodian, lot.state);
    }

    function markReceived(bytes32 lotId) external onlyRole(OPERATOR_ROLE) {
        _requireLot(lotId);
        if (lots[lotId].state != LotState.InTransit) revert InvalidState();
        LotState previousState = lots[lotId].state;
        lots[lotId].state = LotState.Received;
        emit LotStateChanged(lotId, previousState, LotState.Received, msg.sender);
    }

    function markProcessed(bytes32 lotId, bytes32 outputMetadataHash) external onlyRole(OPERATOR_ROLE) {
        _requireLot(lotId);
        if (lots[lotId].state != LotState.Received) revert InvalidState();
        LotState previousState = lots[lotId].state;
        lots[lotId].state = LotState.Processed;
        lots[lotId].metadataHash = outputMetadataHash;
        emit LotStateChanged(lotId, previousState, LotState.Processed, msg.sender);
    }

    function voidLot(bytes32 lotId, bytes32 reasonHash) external onlyRole(ADMIN_ROLE) {
        _requireLot(lotId);
        if (lots[lotId].state == LotState.Processed || lots[lotId].state == LotState.Voided) revert InvalidState();
        lots[lotId].state = LotState.Voided;
        emit LotVoided(lotId, reasonHash, msg.sender);
    }

    function getLot(bytes32 lotId) external view returns (MaterialLot memory) {
        _requireLot(lotId);
        return lots[lotId];
    }

    function getAttestations(bytes32 lotId) external view returns (VerificationAttestation[] memory) {
        _requireLot(lotId);
        return attestations[lotId];
    }

    function _requireLot(bytes32 lotId) internal view {
        if (!lotExists[lotId]) revert UnknownLot();
    }
}
