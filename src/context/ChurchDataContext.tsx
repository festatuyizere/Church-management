/**
 * Nazarene Family Data Management System (NFDMS)
 * Central Application Context & Local Storage State Provider
 * Implements RBAC, Audit Logging, and Data Protection
 */

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  Member,
  Family,
  Ministry,
  AuditLog,
  UserRole,
  Language,
  AuditAction,
  DatabaseBackup,
  ChurchStaffUser,
} from '../types';
import {
  INITIAL_MEMBERS,
  INITIAL_FAMILIES,
  INITIAL_MINISTRIES,
  INITIAL_AUDIT_LOGS,
  INITIAL_STAFF_USERS,
} from '../data/seedData';
import { TRANSLATIONS } from '../utils/translations';
import { generateMemberCode, generateFamilyCode, validateRwandanNationalId, validateRwandanPhone } from '../utils/validation';

interface ChurchDataContextType {
  members: Member[];
  families: Family[];
  ministries: Ministry[];
  auditLogs: AuditLog[];
  currentRole: UserRole;
  setCurrentRole: (role: UserRole) => void;
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: keyof typeof TRANSLATIONS['en']) => string;
  unmaskedNidMemberIds: Set<string>;
  toggleUnmaskNid: (memberId: string) => boolean;
  addMember: (memberData: any) => { success: boolean; member?: Member; error?: string };
  updateMember: (id: string, updates: Partial<Member>) => { success: boolean; error?: string };
  deactivateMember: (id: string, reason: string) => void;
  activateMember: (id: string) => void;
  addFamily: (familyData: any) => { success: boolean; family?: Family; error?: string };
  updateFamily: (id: string, updates: Partial<Family>) => { success: boolean; error?: string };
  deleteFamily: (id: string) => void;
  logAuditAction: (action: AuditAction, entityType: any, entityId: string, entityName: string, details: string) => void;
  getFamilyMembers: (familyId: string) => Member[];
  getMemberFamily: (memberId: string) => Family | undefined;
  backupDatabase: () => string;
  restoreDatabase: (jsonContent: string) => { success: boolean; error?: string; count?: number };
  resetToInitialData: () => void;
  importMembersBulk: (importedList: any[]) => { successCount: number; errors: string[] };

  // Staff Authentication & Security Controls
  staffUsers: ChurchStaffUser[];
  currentStaffUser: ChurchStaffUser | null;
  isAuthenticated: boolean;
  login: (identifier: string, secret: string) => { success: boolean; error?: string };
  loginAsUser: (user: ChurchStaffUser) => void;
  logout: () => void;

  // Portal view management (Member public registration link vs Admin portal)
  portalView: 'admin' | 'public_register';
  setPortalView: (view: 'admin' | 'public_register') => void;
  shareableRegisterUrl: string;
}

const STORAGE_KEYS = {
  MEMBERS: 'nfdms_members_v1',
  FAMILIES: 'nfdms_families_v1',
  MINISTRIES: 'nfdms_ministries_v2',
  AUDIT_LOGS: 'nfdms_audit_logs_v1',
  ROLE: 'nfdms_role_v1',
  LANG: 'nfdms_lang_v1',
  AUTH_USER: 'nfdms_auth_user_v2',
};

const ChurchDataContext = createContext<ChurchDataContextType | undefined>(undefined);

export const ChurchDataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Members State
  const [members, setMembers] = useState<Member[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.MEMBERS);
      return stored ? JSON.parse(stored) : INITIAL_MEMBERS;
    } catch (e) {
      console.error('Failed to load stored members', e);
      return INITIAL_MEMBERS;
    }
  });

  // Families State
  const [families, setFamilies] = useState<Family[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.FAMILIES);
      return stored ? JSON.parse(stored) : INITIAL_FAMILIES;
    } catch (e) {
      console.error('Failed to load stored families', e);
      return INITIAL_FAMILIES;
    }
  });

  // Ministries State
  const [ministries] = useState<Ministry[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.MINISTRIES);
      return stored ? JSON.parse(stored) : INITIAL_MINISTRIES;
    } catch (e) {
      return INITIAL_MINISTRIES;
    }
  });

  // Audit Logs State
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.AUDIT_LOGS);
      return stored ? JSON.parse(stored) : INITIAL_AUDIT_LOGS;
    } catch (e) {
      return INITIAL_AUDIT_LOGS;
    }
  });

  // Staff Users State
  const [staffUsers] = useState<ChurchStaffUser[]>(INITIAL_STAFF_USERS);

  // Authenticated Staff User (Persisted in localStorage)
  const [currentStaffUser, setCurrentStaffUser] = useState<ChurchStaffUser | null>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.AUTH_USER);
      if (stored) {
        return JSON.parse(stored);
      }
      // Default to Church Registrar for initial convenience so administrator can immediately explore
      return INITIAL_STAFF_USERS[1]; // Registrar Aime Kayiranga
    } catch {
      return INITIAL_STAFF_USERS[1];
    }
  });

  // Role State (synced with currentStaffUser if logged in)
  const [currentRole, setCurrentRole] = useState<UserRole>(() => {
    try {
      const storedUser = localStorage.getItem(STORAGE_KEYS.AUTH_USER);
      if (storedUser) {
        return JSON.parse(storedUser).role;
      }
    } catch {}
    return (localStorage.getItem(STORAGE_KEYS.ROLE) as UserRole) || 'DATA_ENTRY';
  });

  // Portal View (Public member self-registration vs Church database management)
  const [portalView, setPortalViewState] = useState<'admin' | 'public_register'>(() => {
    if (typeof window !== 'undefined') {
      const searchParams = new URLSearchParams(window.location.search);
      if (searchParams.get('portal') === 'register' || searchParams.get('link') === 'register') {
        return 'public_register';
      }
    }
    return 'admin';
  });

  const setPortalView = (view: 'admin' | 'public_register') => {
    setPortalViewState(view);
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      if (view === 'public_register') {
        url.searchParams.set('portal', 'register');
      } else {
        url.searchParams.delete('portal');
        url.searchParams.delete('link');
      }
      window.history.replaceState({}, '', url.toString());
    }
  };

  const shareableRegisterUrl = typeof window !== 'undefined'
    ? `${window.location.origin}${window.location.pathname}?portal=register`
    : 'https://nazarene-remera.rw/?portal=register';

  // Language State
  const [language, setLanguage] = useState<Language>(() => {
    return (localStorage.getItem(STORAGE_KEYS.LANG) as Language) || 'en';
  });

  // Unmasked NID session set
  const [unmaskedNidMemberIds, setUnmaskedNidMemberIds] = useState<Set<string>>(new Set());

  // Save to LocalStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.MEMBERS, JSON.stringify(members));
  }, [members]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.FAMILIES, JSON.stringify(families));
  }, [families]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.AUDIT_LOGS, JSON.stringify(auditLogs));
  }, [auditLogs]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ROLE, currentRole);
  }, [currentRole]);

  useEffect(() => {
    if (currentStaffUser) {
      localStorage.setItem(STORAGE_KEYS.AUTH_USER, JSON.stringify(currentStaffUser));
    } else {
      localStorage.removeItem(STORAGE_KEYS.AUTH_USER);
    }
  }, [currentStaffUser]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.LANG, language);
  }, [language]);

  // Login handler
  const login = (identifier: string, secret: string): { success: boolean; error?: string } => {
    const cleanId = identifier.trim().toLowerCase();
    const cleanSec = secret.trim();

    const user = staffUsers.find(
      (u) =>
        u.email.toLowerCase() === cleanId ||
        u.name.toLowerCase().includes(cleanId) ||
        (cleanId === 'secretary' && u.role === 'SUPER_ADMIN') ||
        (cleanId === 'registrar' && u.role === 'DATA_ENTRY')
    );

    if (!user) {
      return {
        success: false,
        error: 'No staff account found with this email or username. Authorized accounts: Secretary, Registrar, Ministry Leader.',
      };
    }

    if (user.pin !== cleanSec && user.password !== cleanSec) {
      return {
        success: false,
        error: 'Invalid security PIN or password. Please re-enter the authorized PIN.',
      };
    }

    setCurrentStaffUser(user);
    setCurrentRole(user.role);
    setPortalViewState('admin');

    // Audit log
    const newLog: AuditLog = {
      id: `aud-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      timestamp: new Date().toISOString(),
      userId: user.id,
      userName: `${user.name} (${user.title})`,
      userRole: user.role,
      action: 'LOGIN_SUCCESS',
      entityType: 'System',
      entityId: user.id,
      entityName: user.name,
      details: `Successful authenticated staff sign-in to Remera Database Management as ${user.title}.`,
    };
    setAuditLogs((prev) => [newLog, ...prev]);

    return { success: true };
  };

  const loginAsUser = (user: ChurchStaffUser) => {
    setCurrentStaffUser(user);
    setCurrentRole(user.role);
    setPortalViewState('admin');

    const newLog: AuditLog = {
      id: `aud-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      timestamp: new Date().toISOString(),
      userId: user.id,
      userName: `${user.name} (${user.title})`,
      userRole: user.role,
      action: 'LOGIN_SUCCESS',
      entityType: 'System',
      entityId: user.id,
      entityName: user.name,
      details: `Quick login switch to ${user.title} session.`,
    };
    setAuditLogs((prev) => [newLog, ...prev]);
  };

  const logout = () => {
    if (currentStaffUser) {
      const newLog: AuditLog = {
        id: `aud-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        timestamp: new Date().toISOString(),
        userId: currentStaffUser.id,
        userName: currentStaffUser.name,
        userRole: currentStaffUser.role,
        action: 'LOGOUT',
        entityType: 'System',
        entityId: currentStaffUser.id,
        entityName: currentStaffUser.name,
        details: 'Staff logged out and terminal locked for security.',
      };
      setAuditLogs((prev) => [newLog, ...prev]);
    }

    setCurrentStaffUser(null);
    setCurrentRole('VIEWER');
    localStorage.removeItem(STORAGE_KEYS.AUTH_USER);
  };

  // Translation helper
  const t = (key: keyof typeof TRANSLATIONS['en']): string => {
    const langDict = TRANSLATIONS[language] || TRANSLATIONS.en;
    return (langDict as any)[key] || TRANSLATIONS.en[key] || key;
  };

  // Audit Logger
  const logAuditAction = (
    action: AuditAction,
    entityType: any,
    entityId: string,
    entityName: string,
    details: string
  ) => {
    const roleNames: Record<UserRole, string> = {
      SUPER_ADMIN: 'Super Admin (Pastor / Secretary)',
      DATA_ENTRY: 'Data Entry Officer',
      MINISTRY_LEADER: 'Ministry Leader',
      VIEWER: 'Viewer',
    };

    const newLog: AuditLog = {
      id: `aud-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      timestamp: new Date().toISOString(),
      userId: `usr-${currentRole.toLowerCase()}`,
      userName: roleNames[currentRole],
      userRole: currentRole,
      action,
      entityType,
      entityId,
      entityName,
      details,
    };

    setAuditLogs((prev) => [newLog, ...prev]);
  };

  // Toggle Unmasking National ID (Law No. 058/2021 audited feature)
  const toggleUnmaskNid = (memberId: string): boolean => {
    if (currentRole === 'VIEWER' || currentRole === 'MINISTRY_LEADER') {
      alert('Access restricted: Only Super Admin and Data Entry Officers can view full National ID numbers under Law No. 058/2021.');
      return false;
    }

    const member = members.find((m) => m.id === memberId);
    if (!member) return false;

    setUnmaskedNidMemberIds((prev) => {
      const next = new Set(prev);
      const isCurrentlyUnmasked = next.has(memberId);
      if (isCurrentlyUnmasked) {
        next.delete(memberId);
      } else {
        next.add(memberId);
        // Log sensitive unmask action
        logAuditAction(
          'UNMASK_NID',
          'Member',
          memberId,
          `${member.firstName} ${member.lastName}`,
          `Sensitive National ID unmasked for verified pastoral review.`
        );
      }
      return next;
    });

    return true;
  };

  // Add Member
  const addMember = (data: any) => {
    // Check duplicates: National ID & Phone
    const nidClean = data.nationalId ? data.nationalId.replace(/\s+/g, '') : '';
    const existingNid = members.find(
      (m) => m.nationalId.replace(/\s+/g, '') === nidClean && m.churchInfo.membershipStatus !== 'Deceased'
    );
    if (existingNid) {
      return {
        success: false,
        error: `A member with this National ID already exists: ${existingNid.firstName} ${existingNid.lastName} (${existingNid.memberCode})`,
      };
    }

    const newCode = generateMemberCode(members.length);
    const newMember: Member = {
      ...data,
      id: `mem-${Date.now()}`,
      memberCode: newCode,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: currentRole,
    };

    setMembers((prev) => [newMember, ...prev]);

    // If family is linked, update family or link
    if (newMember.familyId) {
      const targetFamily = families.find((f) => f.id === newMember.familyId);
      if (targetFamily && newMember.familyRole === 'Head of Household') {
        updateFamily(targetFamily.id, { headOfFamilyMemberId: newMember.id });
      } else if (targetFamily && newMember.familyRole === 'Spouse') {
        updateFamily(targetFamily.id, { spouseMemberId: newMember.id });
      }
    }

    logAuditAction(
      'CREATE_MEMBER',
      'Member',
      newMember.id,
      `${newMember.firstName} ${newMember.lastName}`,
      `Registered new church member with Member ID ${newMember.memberCode} and Law 058/2021 consent.`
    );

    return { success: true, member: newMember };
  };

  // Update Member
  const updateMember = (id: string, updates: Partial<Member>) => {
    const existing = members.find((m) => m.id === id);
    if (!existing) return { success: false, error: 'Member not found' };

    setMembers((prev) =>
      prev.map((m) => (m.id === id ? { ...m, ...updates, updatedAt: new Date().toISOString() } : m))
    );

    logAuditAction(
      'UPDATE_MEMBER',
      'Member',
      id,
      `${updates.firstName || existing.firstName} ${updates.lastName || existing.lastName}`,
      `Updated member profile and church records.`
    );

    return { success: true };
  };

  // Deactivate Member (Soft Delete)
  const deactivateMember = (id: string, reason: string) => {
    const existing = members.find((m) => m.id === id);
    if (!existing) return;

    setMembers((prev) =>
      prev.map((m) =>
        m.id === id
          ? {
              ...m,
              churchInfo: {
                ...m.churchInfo,
                membershipStatus: 'Inactive',
                deactivationReason: reason,
                deactivationDate: new Date().toISOString(),
              },
              updatedAt: new Date().toISOString(),
            }
          : m
      )
    );

    logAuditAction(
      'DEACTIVATE_MEMBER',
      'Member',
      id,
      `${existing.firstName} ${existing.lastName}`,
      `Deactivated member record. Reason: ${reason}`
    );
  };

  // Reactivate Member
  const activateMember = (id: string) => {
    const existing = members.find((m) => m.id === id);
    if (!existing) return;

    setMembers((prev) =>
      prev.map((m) =>
        m.id === id
          ? {
              ...m,
              churchInfo: {
                ...m.churchInfo,
                membershipStatus: 'Active',
                deactivationReason: undefined,
                deactivationDate: undefined,
              },
              updatedAt: new Date().toISOString(),
            }
          : m
      )
    );

    logAuditAction(
      'ACTIVATE_MEMBER',
      'Member',
      id,
      `${existing.firstName} ${existing.lastName}`,
      `Reactivated member to Active status.`
    );
  };

  // Add Family
  const addFamily = (familyData: any) => {
    const newCode = generateFamilyCode(families.length);
    const newFamily: Family = {
      ...familyData,
      id: `fam-${Date.now()}`,
      familyCode: newCode,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setFamilies((prev) => [newFamily, ...prev]);

    // If head of family provided, update member's familyId
    if (newFamily.headOfFamilyMemberId) {
      setMembers((prev) =>
        prev.map((m) =>
          m.id === newFamily.headOfFamilyMemberId
            ? { ...m, familyId: newFamily.id, familyRole: 'Head of Household' }
            : m
        )
      );
    }
    if (newFamily.spouseMemberId) {
      setMembers((prev) =>
        prev.map((m) =>
          m.id === newFamily.spouseMemberId
            ? { ...m, familyId: newFamily.id, familyRole: 'Spouse' }
            : m
        )
      );
    }

    logAuditAction(
      'CREATE_FAMILY',
      'Family',
      newFamily.id,
      newFamily.familyName,
      `Created new family household with Code ${newFamily.familyCode}.`
    );

    return { success: true, family: newFamily };
  };

  // Update Family
  const updateFamily = (id: string, updates: Partial<Family>) => {
    const existing = families.find((f) => f.id === id);
    if (!existing) return { success: false, error: 'Family not found' };

    setFamilies((prev) =>
      prev.map((f) => (f.id === id ? { ...f, ...updates, updatedAt: new Date().toISOString() } : f))
    );

    logAuditAction(
      'UPDATE_FAMILY',
      'Family',
      id,
      updates.familyName || existing.familyName,
      `Updated family details and household links.`
    );

    return { success: true };
  };

  // Delete Family
  const deleteFamily = (id: string) => {
    const existing = families.find((f) => f.id === id);
    if (!existing) return;

    // Unlink members from this family
    setMembers((prev) =>
      prev.map((m) => (m.familyId === id ? { ...m, familyId: undefined, familyRole: undefined } : m))
    );

    setFamilies((prev) => prev.filter((f) => f.id !== id));

    logAuditAction(
      'DELETE_FAMILY',
      'Family',
      id,
      existing.familyName,
      `Removed family record and unlinked members.`
    );
  };

  // Get members belonging to a family
  const getFamilyMembers = (familyId: string): Member[] => {
    return members.filter((m) => m.familyId === familyId);
  };

  // Get family of a member
  const getMemberFamily = (memberId: string): Family | undefined => {
    const member = members.find((m) => m.id === memberId);
    if (!member || !member.familyId) return undefined;
    return families.find((f) => f.id === member.familyId);
  };

  // Backup Database to JSON
  const backupDatabase = (): string => {
    const backup: DatabaseBackup = {
      version: '1.0.0',
      app: 'Nazarene Family Data Management System (NFDMS)',
      church: 'Church of the Nazarene, Remera (Kigali, Rwanda)',
      exportedAt: new Date().toISOString(),
      exportedBy: currentRole,
      members,
      families,
      ministries,
      auditLogs,
    };

    logAuditAction(
      'BACKUP_DATABASE',
      'System',
      'sys-backup',
      'Full Database Backup',
      `Exported full database backup (${members.length} members, ${families.length} families).`
    );

    return JSON.stringify(backup, null, 2);
  };

  // Restore Database from JSON
  const restoreDatabase = (jsonContent: string) => {
    try {
      const parsed: DatabaseBackup = JSON.parse(jsonContent);
      if (!parsed.members || !Array.isArray(parsed.members)) {
        return { success: false, error: 'Invalid backup file format: missing members array.' };
      }

      setMembers(parsed.members);
      if (parsed.families && Array.isArray(parsed.families)) setFamilies(parsed.families);
      if (parsed.auditLogs && Array.isArray(parsed.auditLogs)) setAuditLogs(parsed.auditLogs);

      logAuditAction(
        'RESTORE_DATABASE',
        'System',
        'sys-restore',
        'Database Restoration',
        `Restored database with ${parsed.members.length} members and ${parsed.families?.length || 0} families.`
      );

      return { success: true, count: parsed.members.length };
    } catch (e: any) {
      return { success: false, error: `JSON parsing error: ${e.message}` };
    }
  };

  // Reset to Initial Seed Data
  const resetToInitialData = () => {
    setMembers(INITIAL_MEMBERS);
    setFamilies(INITIAL_FAMILIES);
    setAuditLogs(INITIAL_AUDIT_LOGS);
    localStorage.removeItem(STORAGE_KEYS.MEMBERS);
    localStorage.removeItem(STORAGE_KEYS.FAMILIES);
    localStorage.removeItem(STORAGE_KEYS.AUDIT_LOGS);

    logAuditAction(
      'RESTORE_DATABASE',
      'System',
      'sys-reset',
      'Seed Data Reset',
      'Restored factory Remera parish seed dataset.'
    );
  };

  // Bulk Import Members
  const importMembersBulk = (importedList: any[]) => {
    let successCount = 0;
    const errors: string[] = [];

    const newMembersToAdd: Member[] = [];
    let currentCount = members.length;

    for (let i = 0; i < importedList.length; i++) {
      const row = importedList[i];
      const rowIndex = i + 1;

      if (!row.firstName || !row.lastName) {
        errors.push(`Row ${rowIndex}: First Name and Last Name are required.`);
        continue;
      }

      if (!row.nationalId) {
        errors.push(`Row ${rowIndex} (${row.firstName} ${row.lastName}): National ID is missing.`);
        continue;
      }

      const nidClean = String(row.nationalId).replace(/\s+/g, '');
      const nidValidation = validateRwandanNationalId(nidClean);
      if (!nidValidation.isValid) {
        errors.push(`Row ${rowIndex} (${row.firstName}): ${nidValidation.error}`);
        continue;
      }

      // Check duplicates
      const dupNid = [...members, ...newMembersToAdd].find(
        (m) => m.nationalId.replace(/\s+/g, '') === nidClean
      );
      if (dupNid) {
        errors.push(
          `Row ${rowIndex} (${row.firstName} ${row.lastName}): National ID ${nidClean} already exists in database (${dupNid.memberCode}).`
        );
        continue;
      }

      currentCount++;
      const code = generateMemberCode(currentCount - 1);

      const newM: Member = {
        id: `mem-${Date.now()}-${i}`,
        memberCode: code,
        firstName: row.firstName.trim(),
        lastName: row.lastName.trim(),
        gender: row.gender === 'Female' ? 'Female' : 'Male',
        dateOfBirth: row.dateOfBirth || '1995-01-01',
        nationalId: nidClean,
        maritalStatus: row.maritalStatus || 'Single',
        spouseName: row.spouseName || undefined,
        occupation: row.occupation || '',
        educationLevel: row.educationLevel || "Bachelor's",
        phone: row.phone ? String(row.phone) : '+250 788 000 000',
        altPhone: row.altPhone ? String(row.altPhone) : undefined,
        email: row.email || undefined,
        address: {
          province: row.province || 'Kigali City',
          district: row.district || 'Gasabo',
          sector: row.sector || 'Remera',
          cell: row.cell || 'Rukiri I',
          village: row.village || 'Urumuri',
          streetAddress: row.streetAddress || '',
        },
        parents: {
          fatherName: row.fatherName || 'Unknown',
          fatherStatus: row.fatherStatus || 'Living',
          motherName: row.motherName || 'Unknown',
          motherStatus: row.motherStatus || 'Living',
        },
        emergencyContact: {
          fullName: row.emergencyName || 'Church Elder',
          relationship: row.emergencyRelationship || 'Family',
          phone: row.emergencyPhone || '+250 788 123 456',
        },
        churchInfo: {
          membershipDate: row.membershipDate || new Date().toISOString().split('T')[0],
          membershipStatus: 'Active',
          ministryId: row.ministryId || 'min-1',
          churchRole: row.churchRole || 'Member',
          baptism: {
            isBaptized: row.isBaptized === true || String(row.isBaptized).toLowerCase() === 'true',
            baptismDate: row.baptismDate || undefined,
            baptismPlace: row.baptismPlace || 'Remera Nazarene Sanctuary',
            baptizingPastor: row.baptizingPastor || 'Rev. Samuel Ndayisaba',
          },
        },
        privacyConsent: {
          agreed: true,
          consentDate: new Date().toISOString().split('T')[0],
          lawReference: 'Law No. 058/2021 on Personal Data Protection and Privacy',
          consentMethod: 'Digital Confirmation',
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        createdBy: currentRole,
      };

      newMembersToAdd.push(newM);
      successCount++;
    }

    if (newMembersToAdd.length > 0) {
      setMembers((prev) => [...newMembersToAdd, ...prev]);
      logAuditAction(
        'IMPORT_MEMBERS',
        'System',
        'sys-import',
        'Bulk Member Import',
        `Imported ${newMembersToAdd.length} members successfully (${errors.length} failed rows).`
      );
    }

    return { successCount, errors };
  };

  return (
    <ChurchDataContext.Provider
      value={{
        members,
        families,
        ministries,
        auditLogs,
        currentRole,
        setCurrentRole,
        language,
        setLanguage,
        t,
        unmaskedNidMemberIds,
        toggleUnmaskNid,
        addMember,
        updateMember,
        deactivateMember,
        activateMember,
        addFamily,
        updateFamily,
        deleteFamily,
        logAuditAction,
        getFamilyMembers,
        getMemberFamily,
        backupDatabase,
        restoreDatabase,
        resetToInitialData,
        importMembersBulk,
        staffUsers,
        currentStaffUser,
        isAuthenticated: !!currentStaffUser,
        login,
        loginAsUser,
        logout,
        portalView,
        setPortalView,
        shareableRegisterUrl,
      }}
    >
      {children}
    </ChurchDataContext.Provider>
  );
};

export const useChurchData = () => {
  const context = useContext(ChurchDataContext);
  if (!context) {
    throw new Error('useChurchData must be used within a ChurchDataProvider');
  }
  return context;
};
