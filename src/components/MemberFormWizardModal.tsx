/**
 * Member Registration & Edit Multi-Step Wizard Modal
 * Step 1: Personal & Law 058/2021 Consent
 * Step 2: Family & Parents' Information
 * Step 3: Contact & Rwandan Administrative Address (Cascading)
 * Step 4: Church Information & Baptism Sacrament
 * Step 5: Emergency Contact & Verification Review
 */

import React, { useState, useEffect } from 'react';
import { useChurchData } from '../context/ChurchDataContext';
import { Member, RwandaAddress, Gender, MaritalStatus, EducationLevel, FamilyRole, ParentStatus } from '../types';
import {
  PROVINCES,
  getDistricts,
  getSectors,
  getCells,
  getVillages,
} from '../utils/rwandaLocations';
import {
  validateRwandanNationalId,
  validateRwandanPhone,
  formatNationalId,
} from '../utils/validation';
import {
  X,
  ChevronRight,
  ChevronLeft,
  CheckCircle,
  AlertCircle,
  ShieldCheck,
  User,
  Home,
  MapPin,
  Church,
  PhoneCall,
  Save,
  Database,
  Printer,
  Check,
  Music,
  Users,
  Edit3,
  Sparkles,
} from 'lucide-react';

export const PREDEFINED_ROLES = [
  { id: 'Member', label: 'Member', kinyarwanda: 'Umukirisitu', desc: 'Church communicant member' },
  { id: 'Deacon', label: 'Deacon', kinyarwanda: 'Diyakoni', desc: 'Church deacon & board member' },
  { id: 'Protocal', label: 'Protocal', kinyarwanda: 'Porotokole', desc: 'Protocol, ushers & reception' },
  { id: 'Worship Singer', label: 'Worship Singer', kinyarwanda: 'Umuhimbyi', desc: 'Worship team / choir vocalist' },
] as const;

interface MemberFormWizardModalProps {
  isOpen: boolean;
  onClose: () => void;
  memberToEdit?: Member | null;
}

export const MemberFormWizardModal: React.FC<MemberFormWizardModalProps> = ({
  isOpen,
  onClose,
  memberToEdit,
}) => {
  const { addMember, updateMember, families, ministries, t } = useChurchData();

  const [currentStep, setCurrentStep] = useState<number>(1);
  const [formError, setFormError] = useState<string | null>(null);
  const [storedSuccessMember, setStoredSuccessMember] = useState<Member | null>(null);

  // Form State
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [gender, setGender] = useState<Gender>('Male');
  const [dateOfBirth, setDateOfBirth] = useState('1995-01-01');
  const [nationalId, setNationalId] = useState('');
  const [maritalStatus, setMaritalStatus] = useState<MaritalStatus>('Single');
  const [spouseName, setSpouseName] = useState('');
  const [occupation, setOccupation] = useState('');
  const [educationLevel, setEducationLevel] = useState<EducationLevel>("Bachelor's");

  // Consent (Mandatory under Law 058/2021)
  const [consentAgreed, setConsentAgreed] = useState(true);

  // Family & Parents
  const [familyId, setFamilyId] = useState<string>('');
  const [familyRole, setFamilyRole] = useState<FamilyRole>('Head of Household');
  const [fatherName, setFatherName] = useState('');
  const [fatherStatus, setFatherStatus] = useState<ParentStatus>('Living');
  const [motherName, setMotherName] = useState('');
  const [motherStatus, setMotherStatus] = useState<ParentStatus>('Living');

  // Contact & Address
  const [phone, setPhone] = useState('+250 788 ');
  const [altPhone, setAltPhone] = useState('');
  const [email, setEmail] = useState('');

  const [province, setProvince] = useState('Kigali City');
  const [district, setDistrict] = useState('Gasabo');
  const [sector, setSector] = useState('Remera');
  const [cell, setCell] = useState('Rukiri I');
  const [village, setVillage] = useState('Amahoro');
  const [streetAddress, setStreetAddress] = useState('');
  const [isCustomVillage, setIsCustomVillage] = useState(false);

  // Church & Baptism
  const [membershipDate, setMembershipDate] = useState('2023-01-15');
  const [membershipStatus, setMembershipStatus] = useState<'Active' | 'Inactive' | 'Transferred'>('Active');
  const [ministryId, setMinistryId] = useState('min-1');
  const [churchRole, setChurchRole] = useState('Member');
  const [selectedRoleType, setSelectedRoleType] = useState<string>('Member');
  const [customRoleText, setCustomRoleText] = useState<string>('');

  const [isBaptized, setIsBaptized] = useState(true);
  const [baptismDate, setBaptismDate] = useState('2023-06-25');
  const [baptismPlace, setBaptismPlace] = useState('Remera Nazarene Sanctuary');
  const [baptizingPastor, setBaptizingPastor] = useState('Rev. Samuel Ndayisaba');
  const [certificateNumber, setCertificateNumber] = useState('');

  // Emergency Contact
  const [emergencyName, setEmergencyName] = useState('');
  const [emergencyRelationship, setEmergencyRelationship] = useState('Spouse');
  const [emergencyPhone, setEmergencyPhone] = useState('+250 788 ');
  const [emergencyAddress, setEmergencyAddress] = useState('');

  // Pre-fill if editing
  useEffect(() => {
    if (memberToEdit) {
      setFirstName(memberToEdit.firstName);
      setLastName(memberToEdit.lastName);
      setGender(memberToEdit.gender);
      setDateOfBirth(memberToEdit.dateOfBirth);
      setNationalId(memberToEdit.nationalId);
      setMaritalStatus(memberToEdit.maritalStatus);
      setSpouseName(memberToEdit.spouseName || '');
      setOccupation(memberToEdit.occupation || '');
      setEducationLevel(memberToEdit.educationLevel || "Bachelor's");

      setFamilyId(memberToEdit.familyId || '');
      setFamilyRole(memberToEdit.familyRole || 'Head of Household');
      setFatherName(memberToEdit.parents.fatherName);
      setFatherStatus(memberToEdit.parents.fatherStatus);
      setMotherName(memberToEdit.parents.motherName);
      setMotherStatus(memberToEdit.parents.motherStatus);

      setPhone(memberToEdit.phone);
      setAltPhone(memberToEdit.altPhone || '');
      setEmail(memberToEdit.email || '');

      setProvince(memberToEdit.address.province || 'Kigali City');
      setDistrict(memberToEdit.address.district || 'Gasabo');
      setSector(memberToEdit.address.sector || 'Remera');
      setCell(memberToEdit.address.cell || 'Rukiri I');
      setVillage(memberToEdit.address.village || 'Amahoro');
      setStreetAddress(memberToEdit.address.streetAddress || '');

      const existingVillages = getVillages(
        memberToEdit.address.province,
        memberToEdit.address.district,
        memberToEdit.address.sector,
        memberToEdit.address.cell
      );
      if (memberToEdit.address.village && !existingVillages.includes(memberToEdit.address.village)) {
        setIsCustomVillage(true);
      } else {
        setIsCustomVillage(false);
      }

      setMembershipDate(memberToEdit.churchInfo.membershipDate);
      setMembershipStatus(memberToEdit.churchInfo.membershipStatus as any);
      setMinistryId(memberToEdit.churchInfo.ministryId);

      const existingRole = memberToEdit.churchInfo.churchRole || 'Member';
      setChurchRole(existingRole);
      const isPredefined = PREDEFINED_ROLES.some(
        (r) => r.id.toLowerCase() === existingRole.trim().toLowerCase()
      );
      if (isPredefined) {
        const match = PREDEFINED_ROLES.find(
          (r) => r.id.toLowerCase() === existingRole.trim().toLowerCase()
        );
        setSelectedRoleType(match ? match.id : 'Member');
        setCustomRoleText('');
      } else {
        setSelectedRoleType('OTHER');
        setCustomRoleText(existingRole);
      }

      setIsBaptized(memberToEdit.churchInfo.baptism.isBaptized);
      setBaptismDate(memberToEdit.churchInfo.baptism.baptismDate || '');
      setBaptismPlace(memberToEdit.churchInfo.baptism.baptismPlace || '');
      setBaptizingPastor(memberToEdit.churchInfo.baptism.baptizingPastor || '');
      setCertificateNumber(memberToEdit.churchInfo.baptism.certificateNumber || '');

      setEmergencyName(memberToEdit.emergencyContact.fullName);
      setEmergencyRelationship(memberToEdit.emergencyContact.relationship);
      setEmergencyPhone(memberToEdit.emergencyContact.phone);
      setEmergencyAddress(memberToEdit.emergencyContact.address || '');

      setConsentAgreed(memberToEdit.privacyConsent.agreed);
    } else {
      // Default reset
      setCurrentStep(1);
      setFirstName('');
      setLastName('');
      setGender('Male');
      setDateOfBirth('1995-01-01');
      setNationalId('');
      setMaritalStatus('Single');
      setSpouseName('');
      setOccupation('');
      setConsentAgreed(true);
      setPhone('+250 788 ');
      setFatherName('');
      setMotherName('');
      setEmergencyName('');
      setEmergencyPhone('+250 788 ');
      setProvince('Kigali City');
      setDistrict('Gasabo');
      setSector('Remera');
      setCell('Rukiri I');
      setVillage('Amahoro');
      setIsCustomVillage(false);
      setMinistryId('min-1');
      setSelectedRoleType('Member');
      setChurchRole('Member');
      setCustomRoleText('');
      setStreetAddress('');
      setCertificateNumber('');
    }
  }, [memberToEdit, isOpen]);

  if (!isOpen) return null;

  // Cascading location options
  const districtList = getDistricts(province);
  const sectorList = getSectors(province, district);
  const cellList = getCells(province, district, sector);
  const villageList = getVillages(province, district, sector, cell);

  // Cascading location change handlers
  const handleProvinceChange = (newProv: string) => {
    setProvince(newProv);
    const dists = getDistricts(newProv);
    const newDist = dists.length > 0 ? dists[0] : '';
    setDistrict(newDist);

    const secs = getSectors(newProv, newDist);
    const newSec = secs.length > 0 ? secs[0] : '';
    setSector(newSec);

    const cells = getCells(newProv, newDist, newSec);
    const newCell = cells.length > 0 ? cells[0] : '';
    setCell(newCell);

    const vills = getVillages(newProv, newDist, newSec, newCell);
    const newVill = vills.length > 0 ? vills[0] : '';
    setVillage(newVill);
    setIsCustomVillage(false);
  };

  const handleDistrictChange = (newDist: string) => {
    setDistrict(newDist);

    const secs = getSectors(province, newDist);
    const newSec = secs.length > 0 ? secs[0] : '';
    setSector(newSec);

    const cells = getCells(province, newDist, newSec);
    const newCell = cells.length > 0 ? cells[0] : '';
    setCell(newCell);

    const vills = getVillages(province, newDist, newSec, newCell);
    const newVill = vills.length > 0 ? vills[0] : '';
    setVillage(newVill);
    setIsCustomVillage(false);
  };

  const handleSectorChange = (newSec: string) => {
    setSector(newSec);

    const cells = getCells(province, district, newSec);
    const newCell = cells.length > 0 ? cells[0] : '';
    setCell(newCell);

    const vills = getVillages(province, district, newSec, newCell);
    const newVill = vills.length > 0 ? vills[0] : '';
    setVillage(newVill);
    setIsCustomVillage(false);
  };

  const handleCellChange = (newCell: string) => {
    setCell(newCell);

    const vills = getVillages(province, district, sector, newCell);
    const newVill = vills.length > 0 ? vills[0] : '';
    setVillage(newVill);
    setIsCustomVillage(false);
  };

  // Role choice handlers
  const handleRoleChoice = (roleId: string) => {
    setSelectedRoleType(roleId);
    if (roleId === 'OTHER') {
      setChurchRole(customRoleText.trim());
    } else {
      setChurchRole(roleId);
    }
  };

  const handleCustomRoleChange = (val: string) => {
    setCustomRoleText(val);
    setChurchRole(val);
  };

  // Step 1 Validation
  const validateStep1 = (): boolean => {
    if (!firstName.trim() || !lastName.trim()) {
      setFormError('Please enter both First Name and Last Name.');
      return false;
    }

    if (!nationalId.trim()) {
      setFormError('Rwandan National ID (16 digits) is required.');
      return false;
    }

    const nidCheck = validateRwandanNationalId(nationalId, dateOfBirth, gender);
    if (!nidCheck.isValid) {
      setFormError(nidCheck.error || 'Invalid Rwandan National ID.');
      return false;
    }

    if (!consentAgreed) {
      setFormError('Consent under Rwanda Law No. 058/2021 is required for church record retention.');
      return false;
    }

    setFormError(null);
    return true;
  };

  // Step 2 Validation
  const validateStep2 = (): boolean => {
    if (!fatherName.trim() || !motherName.trim()) {
      setFormError("Please provide both Father's and Mother's names (or 'Unknown' if unavailable).");
      return false;
    }
    setFormError(null);
    return true;
  };

  // Step 3 Validation
  const validateStep3 = (): boolean => {
    const phoneCheck = validateRwandanPhone(phone);
    if (!phoneCheck.isValid) {
      setFormError(phoneCheck.error || 'Please enter a valid Rwandan phone number.');
      return false;
    }

    if (!province || !district || !sector || !cell || !village) {
      setFormError('Please complete all administrative location tiers (Province, District, Sector, Cell, Village).');
      return false;
    }

    setFormError(null);
    return true;
  };

  // Step 4 Validation
  const validateStep4 = (): boolean => {
    if (!membershipDate) {
      setFormError('Membership date is required.');
      return false;
    }

    if (!ministryId) {
      setFormError('Please select a church ministry.');
      return false;
    }

    if (selectedRoleType === 'OTHER' && !customRoleText.trim()) {
      setFormError('Please write your church role or select one of the available roles (Member, Deacon, Protocal, Worship Singer).');
      return false;
    }

    if (!churchRole.trim()) {
      setFormError('Please choose or write a church role.');
      return false;
    }

    if (isBaptized && !baptismDate) {
      setFormError('Please specify the date of baptism.');
      return false;
    }

    setFormError(null);
    return true;
  };

  // Step 5 Validation
  const validateStep5 = (): boolean => {
    if (!emergencyName.trim()) {
      setFormError('Emergency contact person name is required.');
      return false;
    }

    const phoneCheck = validateRwandanPhone(emergencyPhone);
    if (!phoneCheck.isValid) {
      setFormError('Please provide a valid Rwandan phone for emergency contact.');
      return false;
    }

    setFormError(null);
    return true;
  };

  const handleNext = () => {
    if (currentStep === 1 && !validateStep1()) return;
    if (currentStep === 2 && !validateStep2()) return;
    if (currentStep === 3 && !validateStep3()) return;
    if (currentStep === 4 && !validateStep4()) return;

    setFormError(null);
    setCurrentStep((prev) => Math.min(prev + 1, 5));
  };

  const handlePrevious = () => {
    setFormError(null);
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSubmit = () => {
    if (!validateStep5()) return;

    const payload = {
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      gender,
      dateOfBirth,
      nationalId: nationalId.replace(/\s+/g, ''),
      maritalStatus,
      spouseName: maritalStatus === 'Married' ? spouseName.trim() : undefined,
      occupation: occupation.trim() || undefined,
      educationLevel,
      familyId: undefined,
      familyRole: undefined,
      parents: {
        fatherName: fatherName.trim(),
        fatherStatus,
        motherName: motherName.trim(),
        motherStatus,
      },
      phone: phone.trim(),
      altPhone: altPhone.trim() || undefined,
      email: email.trim() || undefined,
      address: {
        province,
        district,
        sector,
        cell,
        village,
        streetAddress: streetAddress.trim() || undefined,
      },
      churchInfo: {
        membershipDate,
        membershipStatus,
        ministryId,
        churchRole: churchRole.trim() || 'Member',
        baptism: {
          isBaptized,
          baptismDate: isBaptized ? baptismDate : undefined,
          baptismPlace: isBaptized ? baptismPlace.trim() : undefined,
          baptizingPastor: isBaptized ? baptizingPastor.trim() : undefined,
          certificateNumber: isBaptized ? certificateNumber.trim() : undefined,
        },
      },
      emergencyContact: {
        fullName: emergencyName.trim(),
        relationship: emergencyRelationship,
        phone: emergencyPhone.trim(),
        address: emergencyAddress.trim() || undefined,
      },
      privacyConsent: {
        agreed: consentAgreed,
        consentDate: new Date().toISOString().split('T')[0],
        lawReference: 'Law No. 058/2021 on Personal Data Protection and Privacy',
        consentMethod: 'Written Signature',
      },
    };

    if (memberToEdit) {
      const res = updateMember(memberToEdit.id, payload as any);
      if (!res.success) {
        setFormError(res.error || 'Failed to update member.');
        return;
      }
      onClose();
    } else {
      const res = addMember(payload as any);
      if (!res.success) {
        setFormError(res.error || 'Failed to register member.');
        return;
      }
      setStoredSuccessMember(res.member || null);
    }
  };

  if (storedSuccessMember) {
    return (
      <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
        <div className="bg-white rounded-xl max-w-xl w-full border border-slate-200 shadow-2xl overflow-hidden my-auto text-xs">
          {/* Header */}
          <div className="bg-emerald-900 text-white px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-emerald-600 flex items-center justify-center text-white">
                <Database className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-base font-bold text-white tracking-tight">
                  Directly Stored in Nazarene Remera Database
                </h2>
                <p className="text-xs text-emerald-200 mt-0.5">
                  Church Member Record committed to permanent database storage
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded text-emerald-300 hover:text-white hover:bg-emerald-800 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Success Banner */}
          <div className="p-6 space-y-4">
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-lg flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="font-bold text-emerald-950 text-sm">
                  {storedSuccessMember.firstName} {storedSuccessMember.lastName} is now registered in the database!
                </p>
                <div className="flex items-center gap-2 pt-0.5">
                  <span className="text-emerald-800 text-xs">Assigned Member Code:</span>
                  <strong className="font-mono text-emerald-950 bg-white px-2 py-0.5 rounded border border-emerald-300 text-xs">
                    {storedSuccessMember.memberCode}
                  </strong>
                </div>
                <p className="text-[11px] text-emerald-700 leading-relaxed pt-1">
                  All member details (Personal, 16-Digit National ID, Rwanda Address hierarchy, Parents, Church Sacrament, and Emergency Contact) have been directly written and committed to the church database under Law No. 058/2021.
                </p>
              </div>
            </div>

            {/* Registered Data Summary Cards */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-slate-50 rounded border border-slate-200">
                <span className="text-slate-500 text-[10px] uppercase font-semibold block">Member Code</span>
                <span className="font-mono font-bold text-slate-900 text-sm">{storedSuccessMember.memberCode}</span>
              </div>
              <div className="p-3 bg-slate-50 rounded border border-slate-200">
                <span className="text-slate-500 text-[10px] uppercase font-semibold block">Rwandan National ID</span>
                <span className="font-mono font-bold text-slate-900 text-xs">
                  {formatNationalId(storedSuccessMember.nationalId)}
                </span>
              </div>
              <div className="p-3 bg-slate-50 rounded border border-slate-200">
                <span className="text-slate-500 text-[10px] uppercase font-semibold block">Administrative Residence</span>
                <span className="text-slate-900 font-medium">
                  {storedSuccessMember.address.village}, {storedSuccessMember.address.cell}, {storedSuccessMember.address.sector}
                </span>
              </div>
              <div className="p-3 bg-slate-50 rounded border border-slate-200">
                <span className="text-slate-500 text-[10px] uppercase font-semibold block">Water Baptism</span>
                <span className="text-slate-900 font-medium">
                  {storedSuccessMember.churchInfo.baptism.isBaptized ? 'Water Baptized' : 'Not Yet Baptized'}
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-4 border-t border-slate-200 flex flex-wrap items-center justify-between gap-2">
              <button
                onClick={() => window.print()}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded hover:bg-slate-50 transition-colors shadow-2xs"
              >
                <Printer className="w-3.5 h-3.5 text-slate-600" />
                <span>Print Confirmation</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setStoredSuccessMember(null);
                    setCurrentStep(1);
                    setFirstName('');
                    setLastName('');
                    setNationalId('');
                    setFatherName('');
                    setMotherName('');
                    setEmergencyName('');
                    setStreetAddress('');
                    setCertificateNumber('');
                  }}
                  className="px-3 py-1.5 text-xs font-semibold text-indigo-700 bg-indigo-50 border border-indigo-200 hover:bg-indigo-100 rounded transition-colors"
                >
                  + Register Another Member
                </button>
                <button
                  onClick={onClose}
                  className="px-4 py-1.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded transition-colors"
                >
                  Done (View Directory)
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-white rounded-xl max-w-2xl w-full border border-slate-200 shadow-2xl overflow-hidden my-auto">
        
        {/* Wizard Header */}
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold tracking-tight text-white">
              {memberToEdit ? 'Edit Church Member Record' : t('registerMember')}
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Church of the Nazarene, Remera · Step {currentStep} of 5
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Wizard Step Navigation Strip */}
        <div className="bg-slate-100 border-b border-slate-200 px-6 py-2 flex items-center justify-between text-xs overflow-x-auto">
          {[
            { num: 1, label: '1. Personal' },
            { num: 2, label: '2. Parents' },
            { num: 3, label: '3. Address' },
            { num: 4, label: '4. Church' },
            { num: 5, label: '5. Emergency' },
          ].map((st) => (
            <button
              key={st.num}
              onClick={() => {
                // allow clicking backwards or to valid steps
                if (st.num < currentStep) setCurrentStep(st.num);
              }}
              className={`flex items-center gap-1.5 py-1 px-2 rounded whitespace-nowrap transition-colors ${
                currentStep === st.num
                  ? 'bg-white text-indigo-700 font-bold shadow-2xs'
                  : currentStep > st.num
                  ? 'text-emerald-700 font-medium'
                  : 'text-slate-400'
              }`}
            >
              {currentStep > st.num ? (
                <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
              ) : (
                <span className="w-4 h-4 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center text-[10px] font-bold">
                  {st.num}
                </span>
              )}
              <span>{st.label}</span>
            </button>
          ))}
        </div>

        {/* Error Alert */}
        {formError && (
          <div className="mx-6 mt-4 p-3 bg-rose-50 border border-rose-200 rounded text-xs text-rose-700 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600" />
            <span>{formError}</span>
          </div>
        )}

        {/* Wizard Step Body */}
        <div className="p-6 max-h-[65vh] overflow-y-auto space-y-4 text-xs">
          
          {/* STEP 1: Personal & Law 058/2021 Consent */}
          {currentStep === 1 && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-medium text-slate-700 mb-1">
                    {t('firstName')} *
                  </label>
                  <input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="e.g. Jean-Paul"
                    className="w-full p-2 border border-slate-200 rounded focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-slate-700 mb-1">
                    {t('lastName')} *
                  </label>
                  <input
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="e.g. Habimana"
                    className="w-full p-2 border border-slate-200 rounded focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-medium text-slate-700 mb-1">
                    {t('gender')} *
                  </label>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value as Gender)}
                    className="w-full p-2 border border-slate-200 rounded bg-white focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                  >
                    <option value="Male">{t('male')}</option>
                    <option value="Female">{t('female')}</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-slate-700 mb-1">
                    {t('dateOfBirth')} *
                  </label>
                  <input
                    type="date"
                    value={dateOfBirth}
                    onChange={(e) => setDateOfBirth(e.target.value)}
                    className="w-full p-2 border border-slate-200 rounded focus:ring-1 focus:ring-indigo-500 focus:outline-none font-mono"
                  />
                </div>
              </div>

              {/* Rwandan National ID */}
              <div>
                <label className="block text-[11px] font-medium text-slate-700 mb-1">
                  {t('nationalId')} *
                </label>
                <input
                  type="text"
                  maxLength={16}
                  value={nationalId}
                  onChange={(e) => setNationalId(e.target.value.replace(/\D/g, ''))}
                  placeholder="1 1995 8 0012345 0 23 (16 digits)"
                  className="w-full p-2 border border-slate-200 rounded font-mono tracking-wider focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                />
                <span className="text-[10px] text-slate-400 mt-0.5 block">
                  Must start with 1, birth year (digits 2-5), and gender code (8 for Male, 7 for Female).
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-medium text-slate-700 mb-1">
                    {t('maritalStatus')}
                  </label>
                  <select
                    value={maritalStatus}
                    onChange={(e) => setMaritalStatus(e.target.value as MaritalStatus)}
                    className="w-full p-2 border border-slate-200 rounded bg-white focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                  >
                    <option value="Single">{t('single')}</option>
                    <option value="Married">{t('married')}</option>
                    <option value="Widowed">{t('widowed')}</option>
                    <option value="Divorced">{t('divorced')}</option>
                    <option value="Separated">{t('separated')}</option>
                  </select>
                </div>
                {maritalStatus === 'Married' && (
                  <div>
                    <label className="block text-[11px] font-medium text-slate-700 mb-1">
                      {t('spouseName')}
                    </label>
                    <input
                      type="text"
                      value={spouseName}
                      onChange={(e) => setSpouseName(e.target.value)}
                      placeholder="e.g. Marie Chantal Uwase"
                      className="w-full p-2 border border-slate-200 rounded focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                    />
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-medium text-slate-700 mb-1">
                    {t('occupation')}
                  </label>
                  <input
                    type="text"
                    value={occupation}
                    onChange={(e) => setOccupation(e.target.value)}
                    placeholder="e.g. Teacher, Civil Engineer, Entrepreneur"
                    className="w-full p-2 border border-slate-200 rounded focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-slate-700 mb-1">
                    {t('educationLevel')}
                  </label>
                  <select
                    value={educationLevel}
                    onChange={(e) => setEducationLevel(e.target.value as EducationLevel)}
                    className="w-full p-2 border border-slate-200 rounded bg-white focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                  >
                    <option value="None">None</option>
                    <option value="Primary">Primary School</option>
                    <option value="Secondary (O-Level)">Secondary (O-Level)</option>
                    <option value="Secondary (A-Level / TVET)">Secondary (A-Level / TVET)</option>
                    <option value="Bachelor's">Bachelor's Degree</option>
                    <option value="Master's">Master's Degree</option>
                    <option value="Doctorate">Doctorate (PhD)</option>
                  </select>
                </div>
              </div>

              {/* Rwanda Law No. 058/2021 Consent Box */}
              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-lg space-y-2">
                <div className="flex items-center gap-2 text-slate-800 font-semibold text-xs">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>{t('privacyConsentTitle')}</span>
                </div>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  {t('privacyConsentText')}
                </p>
                <label className="flex items-center gap-2 cursor-pointer pt-1 text-slate-800 font-medium">
                  <input
                    type="checkbox"
                    checked={consentAgreed}
                    onChange={(e) => setConsentAgreed(e.target.checked)}
                    className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500"
                  />
                  <span>{t('privacyConsentCheckbox')}</span>
                </label>
              </div>
            </div>
          )}

          {/* STEP 2: Parents' Information */}
          {currentStep === 2 && (
            <div className="space-y-4">
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg space-y-1">
                <div className="flex items-center gap-2 text-slate-800 font-semibold text-xs">
                  <User className="w-4 h-4 text-indigo-600" />
                  <span>Parents' Demographic Information</span>
                </div>
                <p className="text-[11px] text-slate-500">
                  Record maternal and paternal details and living status for pastoral care and church records.
                </p>
              </div>

              {/* Parents Information */}
              <div className="space-y-3">
                <h4 className="text-xs font-semibold text-slate-800 uppercase tracking-wider">
                  Parents' Information
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="sm:col-span-2">
                    <label className="block text-[11px] font-medium text-slate-700 mb-1">
                      {t('fatherName')} *
                    </label>
                    <input
                      type="text"
                      value={fatherName}
                      onChange={(e) => setFatherName(e.target.value)}
                      placeholder="e.g. Francois Habimana"
                      className="w-full p-2 border border-slate-200 rounded focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-slate-700 mb-1">
                      {t('fatherStatus')}
                    </label>
                    <select
                      value={fatherStatus}
                      onChange={(e) => setFatherStatus(e.target.value as ParentStatus)}
                      className="w-full p-2 border border-slate-200 rounded bg-white focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                    >
                      <option value="Living">{t('living')}</option>
                      <option value="Deceased">{t('deceased')}</option>
                      <option value="Unknown">{t('unknown')}</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="sm:col-span-2">
                    <label className="block text-[11px] font-medium text-slate-700 mb-1">
                      {t('motherName')} *
                    </label>
                    <input
                      type="text"
                      value={motherName}
                      onChange={(e) => setMotherName(e.target.value)}
                      placeholder="e.g. Esperance Mukandori"
                      className="w-full p-2 border border-slate-200 rounded focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-slate-700 mb-1">
                      {t('motherStatus')}
                    </label>
                    <select
                      value={motherStatus}
                      onChange={(e) => setMotherStatus(e.target.value as ParentStatus)}
                      className="w-full p-2 border border-slate-200 rounded bg-white focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                    >
                      <option value="Living">{t('living')}</option>
                      <option value="Deceased">{t('deceased')}</option>
                      <option value="Unknown">{t('unknown')}</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: Contact & Rwandan Administrative Address */}
          {currentStep === 3 && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-medium text-slate-700 mb-1">
                    {t('phone')} *
                  </label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+250 788 123 456"
                    className="w-full p-2 border border-slate-200 rounded font-mono focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-slate-700 mb-1">
                    {t('altPhone')}
                  </label>
                  <input
                    type="text"
                    value={altPhone}
                    onChange={(e) => setAltPhone(e.target.value)}
                    placeholder="+250 722 123 456"
                    className="w-full p-2 border border-slate-200 rounded font-mono focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-slate-700 mb-1">
                    {t('email')}
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="member@example.rw"
                    className="w-full p-2 border border-slate-200 rounded focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Rwandan Administrative Hierarchy Cascading Selectors */}
              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-lg space-y-3.5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 pb-2 border-b border-slate-200">
                  <div className="flex items-center gap-1.5 text-slate-800 font-semibold text-xs">
                    <MapPin className="w-4 h-4 text-indigo-600 shrink-0" />
                    <span>Rwanda Administrative Location (Urwego rw'Ubutegetsi mu Rwanda)</span>
                  </div>
                  <span className="text-[11px] text-slate-500">
                    Province › District › Sector › Cell › Village
                  </span>
                </div>

                {/* Live Breadcrumb / Active Address Summary */}
                <div className="bg-white border border-indigo-100 rounded-md p-2.5 shadow-xs">
                  <div className="text-[10px] uppercase font-bold tracking-wider text-slate-400 mb-1">
                    Current Selected Hierarchy:
                  </div>
                  <div className="flex items-center gap-1.5 flex-wrap text-xs">
                    <span className="font-semibold text-slate-800">Rwanda 🇷🇼</span>
                    <span className="text-slate-300">›</span>
                    <span className="bg-indigo-50 border border-indigo-100 text-indigo-700 px-2 py-0.5 rounded font-medium">
                      {province}
                    </span>
                    <span className="text-slate-300">›</span>
                    <span className="bg-indigo-50 border border-indigo-100 text-indigo-700 px-2 py-0.5 rounded font-medium">
                      {district}
                    </span>
                    <span className="text-slate-300">›</span>
                    <span className="bg-indigo-50 border border-indigo-100 text-indigo-700 px-2 py-0.5 rounded font-medium">
                      {sector}
                    </span>
                    <span className="text-slate-300">›</span>
                    <span className="bg-indigo-50 border border-indigo-100 text-indigo-700 px-2 py-0.5 rounded font-medium">
                      {cell}
                    </span>
                    <span className="text-slate-300">›</span>
                    <span className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-2 py-0.5 rounded font-semibold">
                      {village || 'Select Village'}
                    </span>
                  </div>
                </div>

                {/* Hierarchy Row 1: Province -> District -> Sector */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="flex items-center justify-between text-[11px] font-medium text-slate-700 mb-1">
                      <span>1. {t('province')} *</span>
                      <span className="text-[10px] text-slate-400 font-normal">({PROVINCES.length} Provinces)</span>
                    </label>
                    <select
                      value={province}
                      onChange={(e) => handleProvinceChange(e.target.value)}
                      className="w-full p-2 text-xs border border-slate-300 rounded bg-white font-medium text-slate-800 focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                    >
                      {PROVINCES.map((p) => (
                        <option key={p} value={p}>
                          {p}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="flex items-center justify-between text-[11px] font-medium text-slate-700 mb-1">
                      <span>2. {t('district')} *</span>
                      <span className="text-[10px] text-indigo-600 font-medium">({districtList.length} in {province})</span>
                    </label>
                    <select
                      value={district}
                      onChange={(e) => handleDistrictChange(e.target.value)}
                      className="w-full p-2 text-xs border border-slate-300 rounded bg-white font-medium text-slate-800 focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                    >
                      {districtList.map((d) => (
                        <option key={d} value={d}>
                          {d}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="flex items-center justify-between text-[11px] font-medium text-slate-700 mb-1">
                      <span>3. {t('sector')} *</span>
                      <span className="text-[10px] text-indigo-600 font-medium">({sectorList.length} in {district})</span>
                    </label>
                    <select
                      value={sector}
                      onChange={(e) => handleSectorChange(e.target.value)}
                      className="w-full p-2 text-xs border border-slate-300 rounded bg-white font-medium text-slate-800 focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                    >
                      {sectorList.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Hierarchy Row 2: Cell -> Village */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="flex items-center justify-between text-[11px] font-medium text-slate-700 mb-1">
                      <span>4. {t('cell')} *</span>
                      <span className="text-[10px] text-indigo-600 font-medium">({cellList.length} in {sector})</span>
                    </label>
                    <select
                      value={cell}
                      onChange={(e) => handleCellChange(e.target.value)}
                      className="w-full p-2 text-xs border border-slate-300 rounded bg-white font-medium text-slate-800 focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                    >
                      {cellList.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-[11px] font-medium text-slate-700">
                        <span>5. {t('village')} (Umudugudu) *</span>{' '}
                        <span className="text-[10px] text-indigo-600 font-medium">
                          ({villageList.length} in {cell})
                        </span>
                      </label>
                      <button
                        type="button"
                        onClick={() => setIsCustomVillage(!isCustomVillage)}
                        className="text-[10px] text-indigo-600 hover:text-indigo-800 underline font-medium"
                      >
                        {isCustomVillage ? '📋 Select from list' : '✏️ Enter custom name'}
                      </button>
                    </div>

                    {isCustomVillage ? (
                      <input
                        type="text"
                        value={village}
                        onChange={(e) => setVillage(e.target.value)}
                        placeholder="Type Umudugudu / Village name"
                        className="w-full p-2 text-xs border border-indigo-300 bg-white rounded font-medium focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                      />
                    ) : (
                      <select
                        value={village}
                        onChange={(e) => setVillage(e.target.value)}
                        className="w-full p-2 text-xs border border-slate-300 rounded bg-white font-medium text-slate-800 focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                      >
                        {villageList.map((v) => (
                          <option key={v} value={v}>
                            {v}
                          </option>
                        ))}
                      </select>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-slate-700 mb-1">
                    {t('streetAddress')}
                  </label>
                  <input
                    type="text"
                    value={streetAddress}
                    onChange={(e) => setStreetAddress(e.target.value)}
                    placeholder="e.g. KG 178 St, House 24 (Near Remera Nazarene Church)"
                    className="w-full p-2 text-xs border border-slate-300 rounded bg-white focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                  />
                  <p className="text-[10px] text-slate-400 mt-1">
                    Street code, road number, or notable landmark description in Rwanda.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: Church & Baptism */}
          {currentStep === 4 && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-medium text-slate-700 mb-1">
                    {t('membershipDate')} *
                  </label>
                  <input
                    type="date"
                    value={membershipDate}
                    onChange={(e) => setMembershipDate(e.target.value)}
                    className="w-full p-2 border border-slate-200 rounded font-mono focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-slate-700 mb-1">
                    {t('membershipStatus')} *
                  </label>
                  <select
                    value={membershipStatus}
                    onChange={(e) => setMembershipStatus(e.target.value as any)}
                    className="w-full p-2 border border-slate-200 rounded bg-white focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                  >
                    <option value="Active">{t('active')}</option>
                    <option value="Inactive">{t('inactive')}</option>
                    <option value="Transferred">{t('transferred')}</option>
                  </select>
                </div>
              </div>

              {/* Ministry Selection */}
              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-lg space-y-2.5">
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-800">
                    <Users className="w-4 h-4 text-indigo-600" />
                    <span>Church Ministry / Department *</span>
                  </label>
                  <span className="text-[10px] text-slate-500 font-medium">
                    Choose 1 Ministry
                  </span>
                </div>

                <p className="text-[11px] text-slate-600">
                  Select the member's primary ministry (e.g. Nazarene Youth_Remera, Men Followship, women ministries):
                </p>

                {/* Priority Selection Cards for ministries */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {ministries.map((min) => {
                    const isSelected = ministryId === min.id;
                    return (
                      <button
                        key={min.id}
                        type="button"
                        onClick={() => setMinistryId(min.id)}
                        className={`p-2.5 rounded-lg border text-left transition-all ${
                          isSelected
                            ? 'bg-indigo-50/90 border-indigo-500 shadow-xs ring-1 ring-indigo-500'
                            : 'bg-white border-slate-200 hover:border-indigo-300 hover:bg-slate-50'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-1">
                          <span className={`text-xs font-bold leading-tight ${isSelected ? 'text-indigo-900' : 'text-slate-800'}`}>
                            {min.name}
                          </span>
                          {isSelected && (
                            <CheckCircle className="w-3.5 h-3.5 text-indigo-600 shrink-0 mt-0.5" />
                          )}
                        </div>
                        <p className="text-[10px] text-slate-500 mt-1 line-clamp-1">
                          {min.meetingSchedule || min.description}
                        </p>
                      </button>
                    );
                  })}
                </div>

                {/* Dropdown alternative */}
                <div className="pt-1 flex items-center gap-2">
                  <span className="text-[11px] text-slate-500 shrink-0">Or choose from list:</span>
                  <select
                    value={ministryId}
                    onChange={(e) => setMinistryId(e.target.value)}
                    className="w-full p-1.5 text-xs border border-slate-300 rounded bg-white font-medium text-slate-800 focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                  >
                    {ministries.map((min) => (
                      <option key={min.id} value={min.id}>
                        {min.name} ({min.meetingSchedule})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Church Role Selection */}
              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-lg space-y-2.5">
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-800">
                    <Church className="w-4 h-4 text-indigo-600" />
                    <span>Church Role / Responsibility (Inshingano mu Itorero) *</span>
                  </label>
                  {churchRole && (
                    <span className="text-[11px] px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-800 font-bold border border-indigo-200">
                      Active: {churchRole}
                    </span>
                  )}
                </div>

                <p className="text-[11px] text-slate-600">
                  Choose one role from <strong>Member, Deacon, Protocal, Worship Singer</strong>, or write your own role if it is not in those:
                </p>

                {/* Predefined Role Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {PREDEFINED_ROLES.map((r) => {
                    const isSelected = selectedRoleType === r.id;
                    return (
                      <button
                        key={r.id}
                        type="button"
                        onClick={() => handleRoleChoice(r.id)}
                        className={`p-2.5 rounded-lg border text-left transition-all ${
                          isSelected
                            ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm ring-2 ring-indigo-300'
                            : 'bg-white text-slate-800 border-slate-200 hover:border-indigo-300 hover:bg-slate-50'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-bold text-xs">{r.label}</span>
                          {isSelected ? (
                            <CheckCircle className="w-3.5 h-3.5 text-white shrink-0" />
                          ) : (
                            <span className="w-3.5 h-3.5 rounded-full border border-slate-300 inline-block shrink-0" />
                          )}
                        </div>
                        <p className={`text-[10px] leading-tight ${isSelected ? 'text-indigo-100' : 'text-slate-500'}`}>
                          {r.kinyarwanda} · {r.desc}
                        </p>
                      </button>
                    );
                  })}
                </div>

                {/* Option to Write Custom Role */}
                <div className="pt-1">
                  <button
                    type="button"
                    onClick={() => handleRoleChoice('OTHER')}
                    className={`w-full p-2.5 rounded-lg border text-left flex items-center justify-between transition-all ${
                      selectedRoleType === 'OTHER'
                        ? 'bg-amber-50 border-amber-500 text-amber-950 ring-2 ring-amber-300'
                        : 'bg-white border-slate-200 hover:border-slate-300 text-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Edit3 className={`w-4 h-4 ${selectedRoleType === 'OTHER' ? 'text-amber-700' : 'text-slate-500'}`} />
                      <div>
                        <span className="text-xs font-bold block">
                          ✍️ Write Your Own Role (Kwandika Umurimo Wihariye)
                        </span>
                        <span className="text-[10px] text-slate-500">
                          Click here if the role is not (Member, Deacon, Protocal, Worship Singer)
                        </span>
                      </div>
                    </div>
                    {selectedRoleType === 'OTHER' ? (
                      <CheckCircle className="w-4 h-4 text-amber-700 shrink-0" />
                    ) : (
                      <span className="text-xs text-indigo-600 font-semibold underline">Click to write</span>
                    )}
                  </button>

                  {/* Custom Role Input Box */}
                  {selectedRoleType === 'OTHER' && (
                    <div className="mt-2.5 p-3 bg-amber-50/80 border border-amber-200 rounded-lg space-y-1.5 animate-fadeIn">
                      <label className="block text-[11px] font-semibold text-amber-950">
                        Write Your Specific Church Role (Andika umurimo ukora mu Itorero) *
                      </label>
                      <input
                        type="text"
                        value={customRoleText}
                        onChange={(e) => handleCustomRoleChange(e.target.value)}
                        placeholder="e.g. Pastor, Church Secretary, Sunday School Teacher, Audio Technician, Intercessor..."
                        className="w-full p-2 text-xs border border-amber-300 rounded bg-white font-medium text-slate-800 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                        autoFocus
                      />
                      <p className="text-[10px] text-amber-800">
                        This custom role will be recorded directly into the church database and member profile.
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Baptism Sacrament Details */}
              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-lg space-y-3">
                <label className="flex items-center gap-2 cursor-pointer font-semibold text-slate-800 text-xs">
                  <input
                    type="checkbox"
                    checked={isBaptized}
                    onChange={(e) => setIsBaptized(e.target.checked)}
                    className="w-4 h-4 text-sky-600 rounded focus:ring-sky-500"
                  />
                  <span>Member has received water baptism by immersion</span>
                </label>

                {isBaptized && (
                  <div className="space-y-3 pt-2 border-t border-slate-200">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-medium text-slate-700 mb-1">
                          {t('baptismDate')} *
                        </label>
                        <input
                          type="date"
                          value={baptismDate}
                          onChange={(e) => setBaptismDate(e.target.value)}
                          className="w-full p-2 border border-slate-200 rounded font-mono focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-medium text-slate-700 mb-1">
                          {t('baptizingPastor')}
                        </label>
                        <input
                          type="text"
                          value={baptizingPastor}
                          onChange={(e) => setBaptizingPastor(e.target.value)}
                          placeholder="e.g. Rev. Samuel Ndayisaba"
                          className="w-full p-2 border border-slate-200 rounded focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-medium text-slate-700 mb-1">
                          {t('baptismPlace')}
                        </label>
                        <input
                          type="text"
                          value={baptismPlace}
                          onChange={(e) => setBaptismPlace(e.target.value)}
                          placeholder="e.g. Remera Nazarene Sanctuary"
                          className="w-full p-2 border border-slate-200 rounded focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-medium text-slate-700 mb-1">
                          Certificate Number
                        </label>
                        <input
                          type="text"
                          value={certificateNumber}
                          onChange={(e) => setCertificateNumber(e.target.value)}
                          placeholder="e.g. BAP-REM-2023-042"
                          className="w-full p-2 border border-slate-200 rounded font-mono focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* STEP 5: Emergency Contact & Final Review */}
          {currentStep === 5 && (
            <div className="space-y-4">
              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-lg space-y-3">
                <div className="flex items-center gap-1.5 text-slate-800 font-semibold text-xs">
                  <PhoneCall className="w-4 h-4 text-indigo-600" />
                  <span>Designated Emergency Responder</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-medium text-slate-700 mb-1">
                      Emergency Contact Full Name *
                    </label>
                    <input
                      type="text"
                      value={emergencyName}
                      onChange={(e) => setEmergencyName(e.target.value)}
                      placeholder="e.g. Marie Chantal Uwase"
                      className="w-full p-2 border border-slate-200 rounded focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-slate-700 mb-1">
                      Relationship
                    </label>
                    <select
                      value={emergencyRelationship}
                      onChange={(e) => setEmergencyRelationship(e.target.value)}
                      className="w-full p-2 border border-slate-200 rounded bg-white focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                    >
                      <option value="Spouse">Spouse</option>
                      <option value="Parent">Parent (Father / Mother)</option>
                      <option value="Sibling">Sibling (Brother / Sister)</option>
                      <option value="Child">Child (Son / Daughter)</option>
                      <option value="Relative">Relative</option>
                      <option value="Church Leader">Church Cell Leader</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-medium text-slate-700 mb-1">
                      Emergency Phone (Rwanda) *
                    </label>
                    <input
                      type="text"
                      value={emergencyPhone}
                      onChange={(e) => setEmergencyPhone(e.target.value)}
                      placeholder="+250 788 123 456"
                      className="w-full p-2 border border-slate-200 rounded font-mono focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-slate-700 mb-1">
                      Emergency Address (Optional)
                    </label>
                    <input
                      type="text"
                      value={emergencyAddress}
                      onChange={(e) => setEmergencyAddress(e.target.value)}
                      placeholder="e.g. Remera, Rukiri I"
                      className="w-full p-2 border border-slate-200 rounded focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Review Summary Box */}
              <div className="p-3 bg-indigo-50/60 rounded border border-indigo-100 text-xs text-slate-700 space-y-1">
                <span className="font-semibold text-indigo-950 block">Registration Summary:</span>
                <p>
                  <strong>{firstName} {lastName}</strong> ({gender}, born {dateOfBirth}) · {maritalStatus}
                </p>
                <p>
                  <strong>NID:</strong> {formatNationalId(nationalId)}
                </p>
                <p>
                  <strong>Address:</strong> {village}, {cell}, {sector}, {district}, {province}
                </p>
                <p>
                  <strong>Ministry & Role:</strong> {ministries.find((m) => m.id === ministryId)?.name || 'Nazarene Ministry'} · <span className="text-indigo-700 font-bold">{churchRole}</span>
                </p>
                <p>
                  <strong>Church:</strong> {membershipStatus} · Baptism: {isBaptized ? 'Baptized' : 'Not Yet Baptized'}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Wizard Footer Buttons */}
        <div className="bg-slate-50 border-t border-slate-200 px-6 py-3 flex items-center justify-between">
          <div>
            {currentStep > 1 && (
              <button
                type="button"
                onClick={handlePrevious}
                className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded hover:bg-slate-100 transition-colors shadow-2xs"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
                <span>{t('previous')}</span>
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 text-xs text-slate-600 hover:text-slate-800"
            >
              {t('cancel')}
            </button>

            {currentStep < 5 ? (
              <button
                type="button"
                onClick={handleNext}
                className="flex items-center gap-1 px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded transition-colors shadow-xs"
              >
                <span>{t('next')}</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 rounded transition-colors shadow-xs"
              >
                <Save className="w-3.5 h-3.5" />
                <span>{memberToEdit ? t('save') : t('submit')}</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
