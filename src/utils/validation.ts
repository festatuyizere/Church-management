/**
 * Validation & Formatting Utilities
 * Compliance with Rwanda Law No. 058/2021 on Personal Data Protection
 */

import { UserRole } from '../types';

/**
 * Validates a Rwandan National ID Number (Indangamuntu)
 * Specification:
 * - Exactly 16 digits
 * - Starts with 1 (indicating Rwandan citizen)
 * - Digits 2-5 represent year of birth (e.g. 1992)
 * - Digit 6 represents gender: 8 = Male, 7 = Female
 */
export interface NidValidationResult {
  isValid: boolean;
  error?: string;
  inferredBirthYear?: number;
  inferredGender?: 'Male' | 'Female';
}

export function validateRwandanNationalId(nid: string, expectedDob?: string, expectedGender?: string): NidValidationResult {
  const cleaned = nid.replace(/\s+/g, '');
  
  if (!cleaned) {
    return { isValid: false, error: 'National ID is required' };
  }

  if (!/^\d{16}$/.test(cleaned)) {
    return { isValid: false, error: 'National ID must be exactly 16 digits (e.g. 1 1985 8 0012345 0 23)' };
  }

  if (cleaned[0] !== '1') {
    return { isValid: false, error: 'Rwandan National ID must start with digit 1' };
  }

  const birthYear = parseInt(cleaned.substring(1, 5), 10);
  const currentYear = new Date().getFullYear();
  if (birthYear < 1910 || birthYear > currentYear) {
    return { isValid: false, error: `Invalid birth year in National ID (${birthYear})` };
  }

  const genderDigit = cleaned[5];
  let inferredGender: 'Male' | 'Female' | undefined;
  if (genderDigit === '8') {
    inferredGender = 'Male';
  } else if (genderDigit === '7') {
    inferredGender = 'Female';
  }

  if (expectedDob) {
    const expectedYear = parseInt(expectedDob.split('-')[0], 10);
    if (!isNaN(expectedYear) && expectedYear !== birthYear) {
      return {
        isValid: false,
        error: `Birth year in National ID (${birthYear}) does not match date of birth (${expectedYear})`,
      };
    }
  }

  if (expectedGender && inferredGender && expectedGender !== inferredGender) {
    return {
      isValid: false,
      error: `Gender in National ID indicates ${inferredGender}, but ${expectedGender} was selected`,
    };
  }

  return {
    isValid: true,
    inferredBirthYear: birthYear,
    inferredGender,
  };
}

/**
 * Formats a 16-digit Rwandan NID into spaced segments for readability:
 * 1 1995 8 0012345 0 23
 */
export function formatNationalId(nid: string): string {
  const cleaned = nid.replace(/\s+/g, '');
  if (cleaned.length !== 16) return nid;
  return `${cleaned.slice(0, 1)} ${cleaned.slice(1, 5)} ${cleaned.slice(5, 6)} ${cleaned.slice(6, 13)} ${cleaned.slice(13, 14)} ${cleaned.slice(14, 16)}`;
}

/**
 * Masks a Rwandan National ID according to Law No. 058/2021
 * Viewers and unauthorized users only see: "1 1995 • ••••••• • 23"
 */
export function maskNationalId(nid: string, role: UserRole, isUnmasked = false): string {
  if (!nid) return '—';
  const cleaned = nid.replace(/\s+/g, '');
  if (cleaned.length !== 16) return nid;

  if (isUnmasked && (role === 'SUPER_ADMIN' || role === 'DATA_ENTRY')) {
    return formatNationalId(cleaned);
  }

  // Masked format: show first 5 (1 + birth year) and last 2 digits
  const p1 = cleaned.slice(0, 5); // e.g. 11985
  const last2 = cleaned.slice(14, 16);
  return `${p1.slice(0, 1)} ${p1.slice(1, 5)} • ••••••• • ${last2}`;
}

/**
 * Validates and normalizes Rwandan phone numbers
 * Accepts:
 * - 0788123456
 * - +250788123456
 * - 250788123456
 * - 072/073/078/079
 */
export function validateRwandanPhone(phone: string): { isValid: boolean; normalized?: string; error?: string } {
  if (!phone) return { isValid: false, error: 'Phone number is required' };
  
  const cleaned = phone.replace(/[\s\-\(\)]/g, '');
  let digits = cleaned;
  
  if (digits.startsWith('+250')) {
    digits = digits.slice(4);
  } else if (digits.startsWith('250')) {
    digits = digits.slice(3);
  } else if (digits.startsWith('0')) {
    digits = digits.slice(1);
  }

  // Rwandan mobile prefixes: 78, 79 (MTN), 72, 73 (Airtel)
  if (!/^(78|79|72|73)\d{7}$/.test(digits)) {
    return {
      isValid: false,
      error: 'Please enter a valid Rwandan mobile number (MTN or Airtel, e.g. +250 788 123 456)',
    };
  }

  const prefix = digits.slice(0, 2);
  const part1 = digits.slice(2, 5);
  const part2 = digits.slice(5, 9);
  const normalized = `+250 ${prefix}${part1.slice(0, 1)} ${part1.slice(1)} ${part2}`;

  return {
    isValid: true,
    normalized,
  };
}

/**
 * Calculate age and age category from birth date
 */
export function calculateAge(dobString: string): { age: number; category: string } {
  if (!dobString) return { age: 0, category: 'Unknown' };
  const birth = new Date(dobString);
  const today = new Date();
  
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }

  if (age < 0) age = 0;

  let category = 'Adult (36-59)';
  if (age <= 12) category = 'Children (0-12)';
  else if (age <= 25) category = 'Youth (13-25)';
  else if (age <= 35) category = 'Young Adult (26-35)';
  else if (age <= 59) category = 'Adult (36-59)';
  else category = 'Elder / Senior (60+)';

  return { age, category };
}

/**
 * Generate Next Auto Member Code: NAZ-REM-0001
 */
export function generateMemberCode(existingCount: number): string {
  const nextNum = existingCount + 1;
  const padded = String(nextNum).padStart(4, '0');
  return `NAZ-REM-${padded}`;
}

/**
 * Generate Next Auto Family Code: FAM-REM-001
 */
export function generateFamilyCode(existingCount: number): string {
  const nextNum = existingCount + 1;
  const padded = String(nextNum).padStart(3, '0');
  return `FAM-REM-${padded}`;
}
