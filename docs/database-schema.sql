-- Plastitrace operational schema
-- PostgreSQL 15+ / Supabase compatible
-- The database is the operational source of truth. The smart contract stores
-- compact attestations and state transitions, not sensitive operational data.

create extension if not exists pgcrypto;

create type organization_kind as enum ('network_operator', 'collector_group', 'verifier', 'processor', 'buyer', 'impact_partner');
create type member_role as enum ('owner', 'network_admin', 'verifier', 'collector', 'processor', 'buyer', 'viewer');
create type material_code as enum ('HDPE', 'PET', 'PP', 'LDPE_FILM', 'MIXED_PLASTICS');
create type lot_state as enum ('draft', 'in_review', 'verified', 'rejected', 'in_transit', 'received', 'processed', 'voided');
create type event_kind as enum ('intake_created', 'evidence_added', 'verification_submitted', 'verification_approved', 'verification_rejected', 'custody_transferred', 'received_at_processor', 'processed', 'voided');
create type verification_result as enum ('pass', 'fail', 'needs_review');
create type custody_party_kind as enum ('collector', 'hub', 'verifier', 'processor', 'buyer');
create type evidence_kind as enum ('weight_ticket', 'material_photo', 'geo_capture', 'collector_signature', 'quality_check', 'dispatch_note');
create type anchor_state as enum ('queued', 'submitted', 'confirmed', 'failed');
create type settlement_state as enum ('draft', 'approved', 'queued', 'paid', 'failed', 'reversed');
create type settlement_entry_kind as enum ('material_proceeds', 'collector_payout', 'hub_fee', 'verification_fee', 'impact_reserve', 'platform_fee', 'treasury_allocation', 'credit_sale');
create type impact_attribute_type as enum ('PRC_COLLECTION', 'PRC_RECYCLING', 'CIU');
create type credit_state as enum ('measured', 'reserved', 'issued', 'transferred', 'retired', 'reversed', 'cancelled');

-- Tenant boundary. Every operational record below belongs to one organization.
create table organizations (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  kind organization_kind not null,
  country_code char(2) not null default 'KE',
  created_at timestamptz not null default now()
);

create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null,
  phone_e164 text,
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table organization_members (
  organization_id uuid not null references organizations(id) on delete cascade,
  profile_id uuid not null references profiles(id) on delete cascade,
  role member_role not null,
  is_active boolean not null default true,
  joined_at timestamptz not null default now(),
  primary key (organization_id, profile_id)
);

create table recovery_hubs (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references organizations(id) on delete cascade,
  name text not null,
  code text not null,
  address text,
  county text,
  latitude numeric(9,6),
  longitude numeric(9,6),
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  unique (organization_id, code)
);

create table collectors (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references organizations(id) on delete cascade,
  profile_id uuid references profiles(id),
  collector_code text not null,
  display_name text not null,
  verification_level smallint not null default 0 check (verification_level between 0 and 3),
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  unique (organization_id, collector_code)
);

-- One recovery lot is the primary digital identity. lot_number is human-readable;
-- lot_uid is the stable identifier used by APIs and the contract adapter.
create table recovery_lots (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references organizations(id) on delete restrict,
  lot_number text not null,
  lot_uid uuid not null default gen_random_uuid() unique,
  material material_code not null,
  state lot_state not null default 'draft',
  source_label text not null,
  source_hub_id uuid references recovery_hubs(id) on delete set null,
  collector_id uuid references collectors(id) on delete set null,
  captured_at timestamptz not null default now(),
  quantity_grams integer not null check (quantity_grams > 0),
  estimated_value_minor bigint check (estimated_value_minor is null or estimated_value_minor >= 0),
  currency char(3) not null default 'KES',
  contamination_pct numeric(5,2) check (contamination_pct between 0 and 100),
  metadata jsonb not null default '{}'::jsonb,
  created_by uuid not null references profiles(id) on delete restrict,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, lot_number)
);

create index recovery_lots_org_state_idx on recovery_lots (organization_id, state, created_at desc);
create index recovery_lots_material_idx on recovery_lots (organization_id, material, captured_at desc);

create table lot_events (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references organizations(id) on delete restrict,
  lot_id uuid not null references recovery_lots(id) on delete restrict,
  kind event_kind not null,
  actor_id uuid references profiles(id) on delete set null,
  occurred_at timestamptz not null default now(),
  payload jsonb not null default '{}'::jsonb,
  idempotency_key text,
  created_at timestamptz not null default now(),
  unique (organization_id, idempotency_key)
);

create index lot_events_lot_time_idx on lot_events (lot_id, occurred_at asc);

create table evidence_assets (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references organizations(id) on delete restrict,
  lot_id uuid not null references recovery_lots(id) on delete restrict,
  kind evidence_kind not null,
  storage_path text not null,
  content_sha256 text not null check (content_sha256 ~ '^[a-f0-9]{64}$'),
  captured_at timestamptz,
  latitude numeric(9,6),
  longitude numeric(9,6),
  captured_by uuid references profiles(id) on delete set null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (lot_id, content_sha256)
);

create index evidence_assets_lot_idx on evidence_assets (lot_id, created_at desc);

create table verification_checks (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references organizations(id) on delete restrict,
  lot_id uuid not null references recovery_lots(id) on delete restrict,
  verifier_id uuid not null references profiles(id) on delete restrict,
  material_observed material_code,
  quantity_grams_observed integer check (quantity_grams_observed is null or quantity_grams_observed > 0),
  contamination_pct_observed numeric(5,2) check (contamination_pct_observed between 0 and 100),
  result verification_result not null,
  notes text,
  checked_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

create index verification_checks_lot_idx on verification_checks (lot_id, checked_at desc);

create table custody_transfers (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references organizations(id) on delete restrict,
  lot_id uuid not null references recovery_lots(id) on delete restrict,
  from_kind custody_party_kind,
  from_party_id uuid,
  to_kind custody_party_kind not null,
  to_party_id uuid not null,
  handoff_quantity_grams integer not null check (handoff_quantity_grams > 0),
  handoff_at timestamptz not null default now(),
  received_at timestamptz,
  receiver_id uuid references profiles(id) on delete set null,
  handoff_evidence_id uuid references evidence_assets(id) on delete set null,
  notes text,
  created_at timestamptz not null default now(),
  check (received_at is null or received_at >= handoff_at)
);

create index custody_transfers_lot_idx on custody_transfers (lot_id, handoff_at asc);

create table impact_calculations (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references organizations(id) on delete restrict,
  lot_id uuid not null references recovery_lots(id) on delete restrict,
  methodology_version text not null,
  co2e_avoided_grams bigint not null check (co2e_avoided_grams >= 0),
  water_saved_liters bigint check (water_saved_liters is null or water_saved_liters >= 0),
  calculated_at timestamptz not null default now(),
  inputs jsonb not null default '{}'::jsonb,
  unique (lot_id, methodology_version)
);

create table value_quotes (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references organizations(id) on delete restrict,
  lot_id uuid not null references recovery_lots(id) on delete restrict,
  buyer_id uuid not null references organizations(id) on delete restrict,
  price_minor_per_kg bigint not null check (price_minor_per_kg >= 0),
  currency char(3) not null default 'KES',
  valid_from timestamptz not null default now(),
  valid_until timestamptz,
  status text not null default 'draft' check (status in ('draft', 'offered', 'accepted', 'expired', 'cancelled')),
  created_at timestamptz not null default now(),
  check (valid_until is null or valid_until > valid_from)
);

create table payouts (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references organizations(id) on delete restrict,
  lot_id uuid not null references recovery_lots(id) on delete restrict,
  payee_organization_id uuid references organizations(id) on delete restrict,
  collector_id uuid references collectors(id) on delete restrict,
  amount_minor bigint not null check (amount_minor >= 0),
  currency char(3) not null default 'KES',
  status text not null default 'pending' check (status in ('pending', 'approved', 'paid', 'failed', 'reversed')),
  provider_reference text,
  paid_at timestamptz,
  created_at timestamptz not null default now()
);

-- Stores the bridge between a lot and an on-chain attestation. This table is
-- append-only from the application perspective; corrections create new rows.
create table blockchain_anchors (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references organizations(id) on delete restrict,
  lot_id uuid not null references recovery_lots(id) on delete restrict,
  network text not null default 'polygon-amoy',
  contract_address text not null,
  chain_lot_id bigint,
  payload_hash text not null check (payload_hash ~ '^[a-f0-9]{64}$'),
  transaction_hash text check (transaction_hash is null or transaction_hash ~ '^0x[a-fA-F0-9]{64}$'),
  state anchor_state not null default 'queued',
  submitted_at timestamptz,
  confirmed_at timestamptz,
  failure_reason text,
  created_at timestamptz not null default now(),
  unique (lot_id, payload_hash)
);

create index blockchain_anchors_state_idx on blockchain_anchors (organization_id, state, created_at asc);

create table audit_log (
  id bigserial primary key,
  organization_id uuid not null references organizations(id) on delete restrict,
  actor_id uuid references profiles(id) on delete set null,
  entity_type text not null,
  entity_id uuid not null,
  action text not null,
  before_json jsonb,
  after_json jsonb,
  request_id text,
  created_at timestamptz not null default now()
);

-- RLS policy direction:
-- 1. Enable RLS on every tenant table.
-- 2. A profile can read/write rows only when organization_members contains an
--    active membership for auth.uid() and the requested organization_id.
-- 3. Verifiers may insert verification_checks but may not edit intake evidence.
-- 4. blockchain_anchors and audit_log are insert-only for application roles.
-- 5. Service workers use a restricted service role for anchor retries only.
-- The exact policies should be added alongside the Supabase auth deployment.

comment on table recovery_lots is 'Primary digital identity for a recoverable material lot.';
comment on table evidence_assets is 'Evidence hashes and references; binary files live in object storage.';
comment on table blockchain_anchors is 'On-chain attestation bridge; contains no PII or raw evidence.';

-- Financial settlement is kept separate from the material identity registry.
-- Rules are versioned so historical payouts can be explained and recalculated.
create table settlement_rules (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references organizations(id) on delete restrict,
  version text not null,
  currency char(3) not null default 'KES',
  source_collector_bps integer not null check (source_collector_bps >= 0),
  hub_bps integer not null check (hub_bps >= 0),
  verification_bps integer not null check (verification_bps >= 0),
  impact_reserve_bps integer not null check (impact_reserve_bps >= 0),
  platform_bps integer not null check (platform_bps >= 0),
  treasury_bps integer not null check (treasury_bps >= 0),
  effective_from timestamptz not null default now(),
  effective_until timestamptz,
  created_by uuid not null references profiles(id) on delete restrict,
  created_at timestamptz not null default now(),
  unique (organization_id, version),
  check (source_collector_bps + hub_bps + verification_bps + impact_reserve_bps + platform_bps + treasury_bps = 10000),
  check (effective_until is null or effective_until > effective_from)
);

create table settlements (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references organizations(id) on delete restrict,
  lot_id uuid not null references recovery_lots(id) on delete restrict,
  rule_id uuid not null references settlement_rules(id) on delete restrict,
  gross_amount_minor bigint not null check (gross_amount_minor >= 0),
  currency char(3) not null default 'KES',
  state settlement_state not null default 'draft',
  payment_provider text,
  provider_reference text,
  calculation_inputs jsonb not null default '{}'::jsonb,
  calculation_snapshot jsonb not null default '{}'::jsonb,
  approved_by uuid references profiles(id) on delete set null,
  paid_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (lot_id, rule_id)
);

create index settlements_org_state_idx on settlements (organization_id, state, created_at desc);

create table settlement_entries (
  id uuid primary key default gen_random_uuid(),
  settlement_id uuid not null references settlements(id) on delete restrict,
  kind settlement_entry_kind not null,
  account_party_id uuid,
  amount_minor bigint not null check (amount_minor >= 0),
  currency char(3) not null default 'KES',
  created_at timestamptz not null default now()
);

create index settlement_entries_settlement_idx on settlement_entries (settlement_id, kind);

create table impact_allocations (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references organizations(id) on delete restrict,
  lot_id uuid not null references recovery_lots(id) on delete restrict,
  attribute_type impact_attribute_type not null,
  methodology_version text not null,
  eligible_grams bigint not null check (eligible_grams >= 0),
  allocated_grams bigint not null check (allocated_grams >= 0),
  allocation_root text not null check (allocation_root ~ '^[a-f0-9]{64}$'),
  state credit_state not null default 'measured',
  beneficiary_organization_id uuid references organizations(id) on delete restrict,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (lot_id, attribute_type, methodology_version),
  check (allocated_grams <= eligible_grams)
);

create table credit_series (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references organizations(id) on delete restrict,
  series_code text not null,
  attribute_type impact_attribute_type not null,
  methodology_version text not null,
  vintage smallint not null check (vintage between 2000 and 2200),
  unit_grams integer not null default 1000 check (unit_grams > 0),
  allocation_root text not null check (allocation_root ~ '^[a-f0-9]{64}$'),
  issued_units bigint not null default 0 check (issued_units >= 0),
  retired_units bigint not null default 0 check (retired_units >= 0),
  state credit_state not null default 'measured',
  contract_address text,
  chain_series_id bigint,
  created_at timestamptz not null default now(),
  unique (organization_id, series_code),
  check (retired_units <= issued_units)
);

create table credit_events (
  id uuid primary key default gen_random_uuid(),
  series_id uuid not null references credit_series(id) on delete restrict,
  event_type text not null check (event_type in ('measured', 'reserved', 'issued', 'transferred', 'retired', 'reversed', 'cancelled')),
  units bigint not null check (units > 0),
  from_organization_id uuid references organizations(id) on delete restrict,
  to_organization_id uuid references organizations(id) on delete restrict,
  retirement_reason text,
  transaction_hash text check (transaction_hash is null or transaction_hash ~ '^0x[a-fA-F0-9]{64}$'),
  created_by uuid references profiles(id) on delete set null,
  created_at timestamptz not null default now()
);

create table credit_retirements (
  id uuid primary key default gen_random_uuid(),
  series_id uuid not null references credit_series(id) on delete restrict,
  beneficiary_organization_id uuid not null references organizations(id) on delete restrict,
  units bigint not null check (units > 0),
  claim_text text not null,
  claim_period_start date,
  claim_period_end date,
  retirement_certificate_hash text not null check (retirement_certificate_hash ~ '^[a-f0-9]{64}$'),
  retired_at timestamptz not null default now(),
  created_by uuid references profiles(id) on delete set null,
  check (claim_period_end is null or claim_period_end >= claim_period_start)
);

create index impact_allocations_lot_idx on impact_allocations (lot_id, attribute_type, state);
create index credit_events_series_idx on credit_events (series_id, created_at asc);
create index credit_retirements_series_idx on credit_retirements (series_id, retired_at desc);
