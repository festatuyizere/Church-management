/**
 * Nazarene Family Data Management System (NFDMS)
 * Church of the Nazarene, Remera (Kigali, Rwanda)
 * Data Models & Type Definitions
 */

export type UserRole = 'SUPER_ADMIN' | 'DATA_ENTRY' | 'MINISTRY_LEADER' | 'VIEWER';

export type Language = 'en' | 'rw' | 'fr';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  ministryId?: string; // If ministry leader
  title: string;
}

export interface ChurchStaffUser {
  id: string;
  name: string;
  email: string;
  pin: string;
  password?: string;
  role: UserRole;
  title: string;
  phone?: string;
  description: string;
}

export type Gender = 'Male' | 'Female';

export type MaritalStatus = 'Single' | 'Married' | 'Widowed' | 'Divorced' | 'Separated';

export type EducationLevel =
  | 'None'
  | 'Primary'
  | 'Secondary (O-Level)'
  | 'Secondary (A-Level / TVET)'
  | "Bachelor's"
  | "Master's"
  | 'Doctorate';

export type MembershipStatus = 'Active' | 'Inactive' | 'Transferred' | 'Deceased';

export type ParentStatus = 'Living' | 'Deceased' | 'Unknown';

export type FamilyRole = 'Head of Household' | 'Spouse' | 'Child' | 'Dependent' | 'Other';

export interface RwandaAddress {
  province: string; // e.g. "Kigali City"
  district: string; // e.g. "Gasabo"
  sector: string;   // e.g. "Remera"
  cell: string;     // e.g. "Rukiri I"
  village: string;  // e.g. "Urumuri"
  streetAddress?: string; // e.g. "KG 178 St, House 14"
}

export interface ParentInfo {
  fatherName: string;
  fatherStatus: ParentStatus;
  motherName: string;
  motherStatus: ParentStatus;
}

export interface EmergencyContact {
  fullName: string;
  relationship: string;
  phone: string;
  altPhone?: string;
  address?: string;
}

export interface BaptismRecord {
  isBaptized: boolean;
  baptismDate?: string; // YYYY-MM-DD
  baptismPlace?: string; // e.g. "Remera Nazarene Sanctuary"
  baptizingPastor?: string; // e.g. "Rev. Samuel Ndayisaba"
  certificateNumber?: string;
}

export interface ChurchInfo {
  membershipDate: string; // YYYY-MM-DD
  membershipStatus: MembershipStatus;
  deactivationReason?: string;
  deactivationDate?: string;
  ministryId: string; // references Ministry.id
  churchRole: string; // e.g. "Member", "Choir Member", "Deacon", "Sunday School Teacher"
  baptism: BaptismRecord;
}

export interface PrivacyConsent {
  agreed: boolean;
  consentDate: string;
  lawReference: string; // "Law No. 058/2021 on Personal Data Protection and Privacy"
  consentMethod: 'Written Signature' | 'Digital Confirmation' | 'Verbal Witnessed';
}

export interface Member {
  id: string;
  memberCode: string; // e.g. "NAZ-REM-0001"
  firstName: string;
  lastName: string;
  gender: Gender;
  dateOfBirth: string; // YYYY-MM-DD
  photoUrl?: string;
  nationalId: string; // 16 digits (e.g. "1198580012345023")
  isNationalIdMasked?: boolean;
  maritalStatus: MaritalStatus;
  spouseName?: string;
  spouseMemberId?: string;
  occupation?: string;
  educationLevel?: EducationLevel;
  phone: string; // Rwandan format: +250 78...
  altPhone?: string;
  email?: string;
  address: RwandaAddress;
  parents: ParentInfo;
  emergencyContact: EmergencyContact;
  churchInfo: ChurchInfo;
  familyId?: string; // references Family.id
  familyRole?: FamilyRole;
  privacyConsent: PrivacyConsent;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
}

export interface Family {
  id: string;
  familyCode: string; // e.g. "FAM-REM-001"
  familyName: string; // e.g. "The Habimana Family"
  headOfFamilyMemberId: string;
  spouseMemberId?: string;
  address: RwandaAddress;
  cellGroup?: string; // Small group / Cell fellowship
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Ministry {
  id: string;
  code: string;
  name: string;
  kinyarwandaName: string;
  description: string;
  leaderName: string;
  leaderPhone: string;
  meetingSchedule: string;
}

export type AuditAction =
  | 'CREATE_MEMBER'
  | 'UPDATE_MEMBER'
  | 'DEACTIVATE_MEMBER'
  | 'ACTIVATE_MEMBER'
  | 'VIEW_MEMBER'
  | 'UNMASK_NID'
  | 'CREATE_FAMILY'
  | 'UPDATE_FAMILY'
  | 'DELETE_FAMILY'
  | 'EXPORT_REPORT'
  | 'BACKUP_DATABASE'
  | 'RESTORE_DATABASE'
  | 'IMPORT_MEMBERS'
  | 'LOGIN_SUCCESS'
  | 'LOGOUT'
  | 'PUBLIC_SELF_REGISTRATION';

export interface AuditLog {
  id: string;
  timestamp: string;
  userId: string;
  userName: string;
  userRole: UserRole;
  action: AuditAction;
  entityType: 'Member' | 'Family' | 'Ministry' | 'System' | 'Report';
  entityId: string;
  entityName: string;
  details: string;
}

export interface DatabaseBackup {
  version: string;
  app: string;
  church: string;
  exportedAt: string;
  exportedBy: string;
  members: Member[];
  families: Family[];
  ministries: Ministry[];
  auditLogs: AuditLog[];
}
