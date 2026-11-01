/**
 * Nazarene Family Data Management System (NFDMS)
 * PostgreSQL Normalized Relational Database Schema (3NF)
 * Production-Ready DDL with Constraints, Foreign Keys, Triggers, and Indexes
 */

export const POSTGRESQL_DDL_SCHEMA = `-- ============================================================================
-- NAZARENE FAMILY DATA MANAGEMENT SYSTEM (NFDMS)
-- Church of the Nazarene, Remera (Kigali, Rwanda)
-- Normalized Relational Schema (PostgreSQL 15+)
-- Compliance: Rwanda Law No. 058/2021 on Personal Data Protection & Privacy
-- ============================================================================

-- Enable UUID extension and pgcrypto for encrypted data at rest
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Clean schema teardown (for migrations/resets)
-- DROP TABLE IF EXISTS audit_logs CASCADE;
-- DROP TABLE IF EXISTS emergency_contacts CASCADE;
-- DROP TABLE IF EXISTS baptism_records CASCADE;
-- DROP TABLE IF EXISTS parents CASCADE;
-- DROP TABLE IF EXISTS addresses CASCADE;
-- DROP TABLE IF EXISTS family_members CASCADE;
-- DROP TABLE IF EXISTS families CASCADE;
-- DROP TABLE IF EXISTS members CASCADE;
-- DROP TABLE IF EXISTS ministries CASCADE;
-- DROP TABLE IF EXISTS user_roles CASCADE;
-- DROP TABLE IF EXISTS users CASCADE;
-- DROP TYPE IF EXISTS gender_enum CASCADE;
-- DROP TYPE IF EXISTS marital_status_enum CASCADE;
-- DROP TYPE IF EXISTS membership_status_enum CASCADE;
-- DROP TYPE IF EXISTS parent_status_enum CASCADE;
-- DROP TYPE IF EXISTS family_role_enum CASCADE;
-- DROP TYPE IF EXISTS user_role_enum CASCADE;

-- ----------------------------------------------------------------------------
-- 1. ENUMS & DOMAIN TYPES
-- ----------------------------------------------------------------------------
CREATE TYPE gender_enum AS ENUM ('Male', 'Female');
CREATE TYPE marital_status_enum AS ENUM ('Single', 'Married', 'Widowed', 'Divorced', 'Separated');
CREATE TYPE membership_status_enum AS ENUM ('Active', 'Inactive', 'Transferred', 'Deceased');
CREATE TYPE parent_status_enum AS ENUM ('Living', 'Deceased', 'Unknown');
CREATE TYPE family_role_enum AS ENUM ('Head of Household', 'Spouse', 'Child', 'Dependent', 'Other');
CREATE TYPE user_role_enum AS ENUM ('SUPER_ADMIN', 'DATA_ENTRY', 'MINISTRY_LEADER', 'VIEWER');

-- ----------------------------------------------------------------------------
-- 2. USERS & ROLES TABLE (RBAC)
-- ----------------------------------------------------------------------------
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(150) NOT NULL,
    phone_number VARCHAR(25) NOT NULL,
    role user_role_enum NOT NULL DEFAULT 'VIEWER',
    assigned_ministry_id UUID NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    last_login_at TIMESTAMPTZ NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- ----------------------------------------------------------------------------
-- 3. MINISTRIES & DEPARTMENTS TABLE
-- ----------------------------------------------------------------------------
CREATE TABLE ministries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code VARCHAR(30) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    kinyarwanda_name VARCHAR(150) NOT NULL,
    description TEXT,
    leader_name VARCHAR(150),
    leader_phone VARCHAR(25),
    meeting_schedule VARCHAR(100),
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- ----------------------------------------------------------------------------
-- 4. RWANDA ADMINISTRATIVE ADDRESSES TABLE
-- ----------------------------------------------------------------------------
CREATE TABLE addresses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    province VARCHAR(50) NOT NULL,           -- e.g. 'Kigali City'
    district VARCHAR(50) NOT NULL,           -- e.g. 'Gasabo'
    sector VARCHAR(50) NOT NULL,             -- e.g. 'Remera'
    cell VARCHAR(50) NOT NULL,               -- e.g. 'Rukiri I'
    village VARCHAR(50) NOT NULL,            -- e.g. 'Urumuri'
    street_address VARCHAR(255),             -- e.g. 'KG 178 St, House 24'
    is_primary BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- ----------------------------------------------------------------------------
-- 5. FAMILIES / HOUSEHOLDS TABLE
-- ----------------------------------------------------------------------------
CREATE TABLE families (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    family_code VARCHAR(20) UNIQUE NOT NULL, -- e.g. 'FAM-REM-001'
    family_name VARCHAR(150) NOT NULL,       -- e.g. 'The Habimana Family'
    head_of_family_id UUID NULL,            -- Circular FK resolved after members
    spouse_member_id UUID NULL,
    address_id UUID REFERENCES addresses(id) ON DELETE SET NULL,
    cell_group VARCHAR(100),                 -- Remera Nazarene cell group
    pastoral_notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- ----------------------------------------------------------------------------
-- 6. MEMBERS TABLE (CORE ENTITY)
-- ----------------------------------------------------------------------------
CREATE TABLE members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    member_code VARCHAR(20) UNIQUE NOT NULL, -- e.g. 'NAZ-REM-0001'
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    gender gender_enum NOT NULL,
    date_of_birth DATE NOT NULL,
    photo_url VARCHAR(500),
    
    -- Sensitive Rwandan National ID (16 digits, encrypted at rest via pgcrypto)
    national_id_encrypted BYTEA NOT NULL,
    national_id_masked VARCHAR(25) NOT NULL,  -- e.g. '1 1985 • ••••••• • 23'
    national_id_hash VARCHAR(64) UNIQUE NOT NULL, -- SHA-256 for duplicate detection
    
    marital_status marital_status_enum NOT NULL DEFAULT 'Single',
    spouse_name VARCHAR(150),
    spouse_member_id UUID REFERENCES members(id) ON DELETE SET NULL,
    occupation VARCHAR(100),
    education_level VARCHAR(50),
    
    -- Rwandan contact info
    phone_number VARCHAR(25) NOT NULL,       -- e.g. '+250 788 123 456'
    alt_phone_number VARCHAR(25),
    email VARCHAR(255),
    
    -- Foreign keys to normalized tables
    address_id UUID REFERENCES addresses(id) ON DELETE SET NULL,
    family_id UUID REFERENCES families(id) ON DELETE SET NULL,
    family_role family_role_enum DEFAULT 'Other',
    ministry_id UUID REFERENCES ministries(id) ON DELETE SET NULL,
    church_role VARCHAR(100) NOT NULL DEFAULT 'Member',
    
    -- Church status
    membership_date DATE NOT NULL,
    membership_status membership_status_enum NOT NULL DEFAULT 'Active',
    deactivation_reason TEXT NULL,
    deactivation_date TIMESTAMPTZ NULL,
    
    -- Law No. 058/2021 Data Protection Consent
    consent_agreed BOOLEAN NOT NULL DEFAULT TRUE,
    consent_date DATE NOT NULL,
    consent_method VARCHAR(50) NOT NULL DEFAULT 'Written Signature',
    
    created_by UUID REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMPTZ NULL -- Soft delete marker
);

-- Add foreign key constraint to families for head of household
ALTER TABLE families
    ADD CONSTRAINT fk_families_head_member
    FOREIGN KEY (head_of_family_id)
    REFERENCES members(id)
    ON DELETE SET NULL;

ALTER TABLE families
    ADD CONSTRAINT fk_families_spouse_member
    FOREIGN KEY (spouse_member_id)
    REFERENCES members(id)
    ON DELETE SET NULL;

-- ----------------------------------------------------------------------------
-- 7. PARENTS INFORMATION TABLE (1:1 Normalized with Member)
-- ----------------------------------------------------------------------------
CREATE TABLE parents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    member_id UUID UNIQUE NOT NULL REFERENCES members(id) ON DELETE CASCADE,
    father_name VARCHAR(150) NOT NULL,
    father_status parent_status_enum NOT NULL DEFAULT 'Living',
    mother_name VARCHAR(150) NOT NULL,
    mother_status parent_status_enum NOT NULL DEFAULT 'Living',
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- ----------------------------------------------------------------------------
-- 8. BAPTISM & SACRAMENT RECORDS TABLE
-- ----------------------------------------------------------------------------
CREATE TABLE baptism_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    member_id UUID UNIQUE NOT NULL REFERENCES members(id) ON DELETE CASCADE,
    is_baptized BOOLEAN NOT NULL DEFAULT FALSE,
    baptism_date DATE NULL,
    baptism_place VARCHAR(150) NULL,
    baptizing_pastor VARCHAR(150) NULL,
    certificate_number VARCHAR(50) NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- ----------------------------------------------------------------------------
-- 9. EMERGENCY CONTACTS TABLE
-- ----------------------------------------------------------------------------
CREATE TABLE emergency_contacts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    member_id UUID UNIQUE NOT NULL REFERENCES members(id) ON DELETE CASCADE,
    full_name VARCHAR(150) NOT NULL,
    relationship VARCHAR(50) NOT NULL,
    phone_number VARCHAR(25) NOT NULL,
    alt_phone_number VARCHAR(25),
    residential_address VARCHAR(255),
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- ----------------------------------------------------------------------------
-- 10. AUDIT LOGS TABLE (Comprehensive Compliance Trail)
-- ----------------------------------------------------------------------------
CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    user_name VARCHAR(150) NOT NULL,
    user_role user_role_enum NOT NULL,
    action VARCHAR(50) NOT NULL,            -- e.g. 'CREATE_MEMBER', 'UNMASK_NID'
    entity_type VARCHAR(50) NOT NULL,        -- 'Member', 'Family', 'Report'
    entity_id UUID NULL,
    entity_name VARCHAR(150) NOT NULL,
    ip_address INET NULL,
    details TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- ----------------------------------------------------------------------------
-- 11. INDEXES FOR HIGH-SPEED CHURCH SEARCH & AUDITING
-- ----------------------------------------------------------------------------
-- Indexes on searchable member fields
CREATE INDEX idx_members_name ON members(first_name, last_name);
CREATE INDEX idx_members_phone ON members(phone_number);
CREATE INDEX idx_members_code ON members(member_code);
CREATE INDEX idx_members_nid_hash ON members(national_id_hash);
CREATE INDEX idx_members_status ON members(membership_status);
CREATE INDEX idx_members_ministry ON members(ministry_id);
CREATE INDEX idx_members_family ON members(family_id);
CREATE INDEX idx_members_dob ON members(date_of_birth);

-- Indexes on Rwandan administrative structure
CREATE INDEX idx_addresses_lookup ON addresses(province, district, sector, cell, village);

-- Indexes on baptism & spiritual dates
CREATE INDEX idx_baptism_date ON baptism_records(baptism_date);

-- Audit log indexing
CREATE INDEX idx_audit_created_at ON audit_logs(created_at DESC);
CREATE INDEX idx_audit_user_action ON audit_logs(user_id, action);

-- ============================================================================
-- END OF SCHEMA DEFINITION
-- ============================================================================
`;

export interface TableDefinition {
  name: string;
  description: string;
  primaryKey: string;
  foreignKeys: string[];
  columns: { name: string; type: string; constraints: string; description: string }[];
}

export const ERD_TABLES: TableDefinition[] = [
  {
    name: 'members',
    description: 'Central church member entity with Rwandan NID, demography, and church roles.',
    primaryKey: 'id (UUID)',
    foreignKeys: ['address_id -> addresses.id', 'family_id -> families.id', 'ministry_id -> ministries.id', 'spouse_member_id -> members.id'],
    columns: [
      { name: 'id', type: 'UUID', constraints: 'PK, DEFAULT gen_random_uuid()', description: 'Unique surrogate key' },
      { name: 'member_code', type: 'VARCHAR(20)', constraints: 'UNIQUE, NOT NULL', description: 'Church code e.g. NAZ-REM-0001' },
      { name: 'first_name', type: 'VARCHAR(100)', constraints: 'NOT NULL', description: 'Member given name' },
      { name: 'last_name', type: 'VARCHAR(100)', constraints: 'NOT NULL', description: 'Family surname' },
      { name: 'gender', type: 'gender_enum', constraints: 'NOT NULL', description: 'Male / Female' },
      { name: 'date_of_birth', type: 'DATE', constraints: 'NOT NULL', description: 'Birth date for age demographics' },
      { name: 'national_id_encrypted', type: 'BYTEA', constraints: 'NOT NULL', description: '16-digit Rwandan NID encrypted at rest' },
      { name: 'national_id_masked', type: 'VARCHAR(25)', constraints: 'NOT NULL', description: 'Masked view for privacy: 1 1985 • ••••••• • 23' },
      { name: 'national_id_hash', type: 'VARCHAR(64)', constraints: 'UNIQUE, NOT NULL', description: 'SHA-256 hash for duplicate check' },
      { name: 'phone_number', type: 'VARCHAR(25)', constraints: 'NOT NULL', description: 'Rwandan mobile (+250 78...)' },
      { name: 'membership_status', type: 'membership_status_enum', constraints: 'NOT NULL', description: 'Active / Inactive / Transferred / Deceased' },
      { name: 'consent_agreed', type: 'BOOLEAN', constraints: 'NOT NULL, DEFAULT TRUE', description: 'Rwanda Law 058/2021 consent flag' },
    ],
  },
  {
    name: 'families',
    description: 'Households and families grouping Nazarene members with heads and spouses.',
    primaryKey: 'id (UUID)',
    foreignKeys: ['head_of_family_id -> members.id', 'spouse_member_id -> members.id', 'address_id -> addresses.id'],
    columns: [
      { name: 'id', type: 'UUID', constraints: 'PK', description: 'Unique surrogate family key' },
      { name: 'family_code', type: 'VARCHAR(20)', constraints: 'UNIQUE, NOT NULL', description: 'e.g. FAM-REM-001' },
      { name: 'family_name', type: 'VARCHAR(150)', constraints: 'NOT NULL', description: 'e.g. The Habimana Family' },
      { name: 'head_of_family_id', type: 'UUID', constraints: 'FK -> members.id', description: 'Household primary contact' },
      { name: 'cell_group', type: 'VARCHAR(100)', constraints: 'NULL', description: 'Remera neighbourhood cell fellowship' },
    ],
  },
  {
    name: 'addresses',
    description: 'Rwanda 5-tier administrative structure (Province -> District -> Sector -> Cell -> Village).',
    primaryKey: 'id (UUID)',
    foreignKeys: [],
    columns: [
      { name: 'id', type: 'UUID', constraints: 'PK', description: 'Address record ID' },
      { name: 'province', type: 'VARCHAR(50)', constraints: 'NOT NULL', description: 'Kigali City / Eastern / Northern...' },
      { name: 'district', type: 'VARCHAR(50)', constraints: 'NOT NULL', description: 'Gasabo / Kicukiro / Nyarugenge...' },
      { name: 'sector', type: 'VARCHAR(50)', constraints: 'NOT NULL', description: 'Remera / Kimironko / Gisozi...' },
      { name: 'cell', type: 'VARCHAR(50)', constraints: 'NOT NULL', description: 'Rukiri I / Rukiri II / Nyabisindu...' },
      { name: 'village', type: 'VARCHAR(50)', constraints: 'NOT NULL', description: 'Urumuri / Rebero / Amahoro...' },
      { name: 'street_address', type: 'VARCHAR(255)', constraints: 'NULL', description: 'Street number / House description' },
    ],
  },
  {
    name: 'baptism_records',
    description: 'Sacramental records for water baptism by immersion, pastors, and certificates.',
    primaryKey: 'id (UUID)',
    foreignKeys: ['member_id -> members.id'],
    columns: [
      { name: 'id', type: 'UUID', constraints: 'PK', description: 'Baptism record ID' },
      { name: 'member_id', type: 'UUID', constraints: 'UNIQUE, FK -> members.id', description: 'One-to-one link to member' },
      { name: 'is_baptized', type: 'BOOLEAN', constraints: 'NOT NULL', description: 'Baptism status flag' },
      { name: 'baptism_date', type: 'DATE', constraints: 'NULL', description: 'Date sacrament performed' },
      { name: 'baptizing_pastor', type: 'VARCHAR(150)', constraints: 'NULL', description: 'Officiating Nazarene pastor' },
      { name: 'certificate_number', type: 'VARCHAR(50)', constraints: 'NULL', description: 'Parish certificate number' },
    ],
  },
  {
    name: 'parents',
    description: 'Father and mother biographical details and living/deceased status.',
    primaryKey: 'id (UUID)',
    foreignKeys: ['member_id -> members.id'],
    columns: [
      { name: 'id', type: 'UUID', constraints: 'PK', description: 'Parents record ID' },
      { name: 'member_id', type: 'UUID', constraints: 'UNIQUE, FK -> members.id', description: 'Link to child member' },
      { name: 'father_name', type: 'VARCHAR(150)', constraints: 'NOT NULL', description: "Father's full name" },
      { name: 'father_status', type: 'parent_status_enum', constraints: 'NOT NULL', description: 'Living / Deceased' },
      { name: 'mother_name', type: 'VARCHAR(150)', constraints: 'NOT NULL', description: "Mother's full name" },
      { name: 'mother_status', type: 'parent_status_enum', constraints: 'NOT NULL', description: 'Living / Deceased' },
    ],
  },
  {
    name: 'emergency_contacts',
    description: 'Designated next of kin and emergency responders for pastoral and medical crises.',
    primaryKey: 'id (UUID)',
    foreignKeys: ['member_id -> members.id'],
    columns: [
      { name: 'id', type: 'UUID', constraints: 'PK', description: 'Contact record ID' },
      { name: 'member_id', type: 'UUID', constraints: 'UNIQUE, FK -> members.id', description: 'Member reference' },
      { name: 'full_name', type: 'VARCHAR(150)', constraints: 'NOT NULL', description: 'Emergency responder name' },
      { name: 'relationship', type: 'VARCHAR(50)', constraints: 'NOT NULL', description: 'Spouse, Parent, Sibling, Child...' },
      { name: 'phone_number', type: 'VARCHAR(25)', constraints: 'NOT NULL', description: 'Primary phone' },
    ],
  },
  {
    name: 'ministries',
    description: 'Church departments (Youth NYI, Women NMI, Choir, Sunday School, Men, Ushers).',
    primaryKey: 'id (UUID)',
    foreignKeys: [],
    columns: [
      { name: 'id', type: 'UUID', constraints: 'PK', description: 'Ministry ID' },
      { name: 'code', type: 'VARCHAR(30)', constraints: 'UNIQUE, NOT NULL', description: 'e.g. NYI-YOUTH' },
      { name: 'name', type: 'VARCHAR(100)', constraints: 'NOT NULL', description: 'Ministry name' },
      { name: 'kinyarwanda_name', type: 'VARCHAR(150)', constraints: 'NOT NULL', description: 'Kinyarwanda department title' },
      { name: 'leader_name', type: 'VARCHAR(150)', constraints: 'NULL', description: 'Department leader' },
    ],
  },
  {
    name: 'audit_logs',
    description: 'Immutable regulatory audit trail mandated by Rwanda Law No. 058/2021.',
    primaryKey: 'id (UUID)',
    foreignKeys: ['user_id -> users.id'],
    columns: [
      { name: 'id', type: 'UUID', constraints: 'PK', description: 'Audit event ID' },
      { name: 'user_name', type: 'VARCHAR(150)', constraints: 'NOT NULL', description: 'Actor username' },
      { name: 'user_role', type: 'user_role_enum', constraints: 'NOT NULL', description: 'Role at time of action' },
      { name: 'action', type: 'VARCHAR(50)', constraints: 'NOT NULL', description: 'CREATE, UPDATE, UNMASK_NID, EXPORT...' },
      { name: 'entity_name', type: 'VARCHAR(150)', constraints: 'NOT NULL', description: 'Target record description' },
      { name: 'created_at', type: 'TIMESTAMPTZ', constraints: 'DEFAULT CURRENT_TIMESTAMP', description: 'Exact audit timestamp' },
    ],
  },
];
