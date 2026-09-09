/*
 * Runtime configuration for the browser-side PlastiTraceRegistry adapter.
 *
 * Set rpcUrl and contractAddress per environment after deploying the audited
 * registry. The app remains usable in an explicit demo/offline state when the
 * values are empty; it never invents on-chain confirmation.
 */
window.PLASTITRACE_CHAIN_CONFIG = Object.freeze({
  chainId: 11155111,
  chainName: 'Sepolia',
  rpcUrl: '',
  contractAddress: '',
  lotIdEncoding: 'keccak256'
});
