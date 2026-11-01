/**
 * Public Member Self-Registration Portal
 * Accessible via public shareable link: ?portal=register
 * Allows any church member to register full details directly into the Remera database.
 * Once submitted, the record is permanently locked from member edits.
 */

import React, { useState } from 'react';
import { useChurchData } from '../context/ChurchDataContext';
import { Member, Gender, MaritalStatus, EducationLevel, ParentStatus } from '../types';
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
  ShieldCheck,
  CheckCircle,
  AlertCircle,
  User,
  Home,
  MapPin,
  Church,
  PhoneCall,
  Save,
  Printer,
  Check,
  Lock,
  ArrowRight,
  ArrowLeft,
  Calendar,
  Heart,
  Droplets,
  Share2,
  Sparkles,
  RefreshCw,
} from 'lucide-react';

export const PUBLIC_ROLES = [
  { id: 'Member', label: 'Member', kinyarwanda: 'Umukirisitu', desc: 'Church communicant member' },
  { id: 'Deacon', label: 'Deacon', kinyarwanda: 'Diyakoni', desc: 'Church deacon & board member' },
  { id: 'Protocal', label: 'Protocal', kinyarwanda: 'Porotokole', desc: 'Protocol, ushers & reception' },
  { id: 'Worship Singer', label: 'Worship Singer', kinyarwanda: 'Umuhimbyi', desc: 'Worship team / choir vocalist' },
] as const;

export const PublicMemberRegistrationPortal: React.FC = () => {
  const { addMember, ministries, setPortalView, t } = useChurchData();

  const [currentStep, setCurrentStep] = useState<number>(1);
  const [formError, setFormError] = useState<string | null>(null);
  const [submittedMember, setSubmittedMember] = useState<Member | null>(null);

  // Form State: Step 1 - Personal & Law 058/2021 Consent
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [gender, setGender] = useState<Gender>('Male');
  const [dateOfBirth, setDateOfBirth] = useState('1995-01-01');
  const [nationalId, setNationalId] = useState('');
  const [maritalStatus, setMaritalStatus] = useState<MaritalStatus>('Single');
  const [spouseName, setSpouseName] = useState('');
  const [occupation, setOccupation] = useState('');
  const [educationLevel, setEducationLevel] = useState<EducationLevel>("Bachelor's");
  const [consentAgreed, setConsentAgreed] = useState(true);

  // Form State: Step 2 - Parents' Information
  const [fatherName, setFatherName] = useState('');
  const [fatherStatus, setFatherStatus] = useState<ParentStatus>('Living');
  const [motherName, setMotherName] = useState('');
  const [motherStatus, setMotherStatus] = useState<ParentStatus>('Living');

  // Form State: Step 3 - Contact & Rwanda Cascading Location
  const [phone, setPhone] = useState('+250 788 ');
  const [altPhone, setAltPhone] = useState('');
  const [email, setEmail] = useState('');
  const [province, setProvince] = useState('Kigali City');
  const [district, setDistrict] = useState('Gasabo');
  const [sector, setSector] = useState('Remera');
  const [cell, setCell] = useState('Rukiri I');
  const [village, setVillage] = useState('Urumuri');
  const [streetAddress, setStreetAddress] = useState('');

  // Form State: Step 4 - Church Ministry & Role
  const [membershipDate, setMembershipDate] = useState('2024-01-01');
  const [ministryId, setMinistryId] = useState<string>(ministries[0]?.id || 'min-1');
  const [selectedRoleType, setSelectedRoleType] = useState<string>('Member');
  const [customRoleText, setCustomRoleText] = useState('');
  const [churchRole, setChurchRole] = useState('Member');
  const [isBaptized, setIsBaptized] = useState(true);
  const [baptismDate, setBaptismDate] = useState('2020-08-15');
  const [baptismPlace, setBaptismPlace] = useState('Remera Nazarene Sanctuary');
  const [baptizingPastor, setBaptizingPastor] = useState('Rev. Emmanuel Sibomana');
  const [certificateNumber, setCertificateNumber] = useState('');

  // Form State: Step 5 - Emergency Contact Person
  const [emergencyName, setEmergencyName] = useState('');
  const [emergencyRelationship, setEmergencyRelationship] = useState('Spouse');
  const [emergencyPhone, setEmergencyPhone] = useState('+250 788 ');
  const [emergencyAddress, setEmergencyAddress] = useState('');

  // Cascading location options
  const availableDistricts = getDistricts(province);
  const availableSectors = getSectors(province, district);
  const availableCells = getCells(province, district, sector);
  const availableVillages = getVillages(province, district, sector, cell);

  // Handlers for cascading location
  const handleProvinceChange = (newProv: string) => {
    setProvince(newProv);
    const dists = getDistricts(newProv);
    const firstDist = dists[0] || '';
    setDistrict(firstDist);

    const sects = getSectors(newProv, firstDist);
    const firstSect = sects[0] || '';
    setSector(firstSect);

    const cls = getCells(newProv, firstDist, firstSect);
    const firstCell = cls[0] || '';
    setCell(firstCell);

    const vils = getVillages(newProv, firstDist, firstSect, firstCell);
    setVillage(vils[0] || '');
  };

  const handleDistrictChange = (newDist: string) => {
    setDistrict(newDist);
    const sects = getSectors(province, newDist);
    const firstSect = sects[0] || '';
    setSector(firstSect);

    const cls = getCells(province, newDist, firstSect);
    const firstCell = cls[0] || '';
    setCell(firstCell);

    const vils = getVillages(province, newDist, firstSect, firstCell);
    setVillage(vils[0] || '');
  };

  const handleSectorChange = (newSect: string) => {
    setSector(newSect);
    const cls = getCells(province, district, newSect);
    const firstCell = cls[0] || '';
    setCell(firstCell);

    const vils = getVillages(province, district, newSect, firstCell);
    setVillage(vils[0] || '');
  };

  const handleCellChange = (newCell: string) => {
    setCell(newCell);
    const vils = getVillages(province, district, sector, newCell);
    setVillage(vils[0] || '');
  };

  // Role selection sync
  const handleSelectPredefinedRole = (roleId: string) => {
    setSelectedRoleType(roleId);
    setChurchRole(roleId);
  };

  const handleCustomRoleChange = (text: string) => {
    setCustomRoleText(text);
    setChurchRole(text);
  };

  // Step 1 Validation
  const validateStep1 = (): boolean => {
    if (!firstName.trim() || !lastName.trim()) {
      setFormError('Please provide both First Name and Last Name.');
      return false;
    }

    const nidCheck = validateRwandanNationalId(nationalId, dateOfBirth, gender);
    if (!nidCheck.isValid) {
      setFormError(nidCheck.error || 'Please provide a valid 16-digit Rwandan National ID.');
      return false;
    }

    if (maritalStatus === 'Married' && !spouseName.trim()) {
      setFormError('Please enter your spouse name.');
      return false;
    }

    if (!consentAgreed) {
      setFormError('Consent is mandatory under Rwanda Law No. 058/2021 to register your data.');
      return false;
    }

    setFormError(null);
    return true;
  };

  // Step 2 Validation
  const validateStep2 = (): boolean => {
    if (!fatherName.trim() || !motherName.trim()) {
      setFormError("Please enter both Father's and Mother's names (or 'Unknown' if unavailable).");
      return false;
    }
    setFormError(null);
    return true;
  };

  // Step 3 Validation
  const validateStep3 = (): boolean => {
    const phoneCheck = validateRwandanPhone(phone);
    if (!phoneCheck.isValid) {
      setFormError(phoneCheck.error || 'Please enter a valid Rwandan phone number (+250 78/79/72/73).');
      return false;
    }

    if (!province || !district || !sector || !cell || !village) {
      setFormError('Please complete all Rwanda administrative location tiers.');
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
      setFormError('Please write your church role.');
      return false;
    }
    if (!churchRole.trim()) {
      setFormError('Please select or specify your church role.');
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
      setFormError('Please provide a valid Rwandan phone number for emergency contact.');
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

  // Submit to Database
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
        membershipStatus: 'Active',
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
        consentMethod: 'Digital Confirmation',
      },
    };

    const res = addMember(payload as any);
    if (!res.success) {
      setFormError(res.error || 'Failed to submit registration. Please check your data.');
      return;
    }

    setSubmittedMember(res.member || null);
  };

  const handleResetForAnotherMember = () => {
    setSubmittedMember(null);
    setCurrentStep(1);
    setFirstName('');
    setLastName('');
    setNationalId('');
    setSpouseName('');
    setFatherName('');
    setMotherName('');
    setPhone('+250 788 ');
    setAltPhone('');
    setEmail('');
    setStreetAddress('');
    setEmergencyName('');
    setEmergencyPhone('+250 788 ');
    setFormError(null);
  };

  // ----------------------------------------------------
  // SUBMISSION SUCCESS & PERMANENT LOCK SCREEN
  // ----------------------------------------------------
  if (submittedMember) {
    const ministryObj = ministries.find((m) => m.id === submittedMember.churchInfo.ministryId);

    return (
      <div className="min-h-screen bg-slate-900 flex flex-col justify-center items-center p-4 sm:p-6 text-slate-900 font-sans">
        <div className="max-w-2xl w-full bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-200">
          
          {/* Top Brand Banner */}
          <div className="bg-gradient-to-r from-emerald-900 via-slate-900 to-emerald-950 text-white px-6 py-6 text-center relative overflow-hidden">
            <div className="w-16 h-16 bg-emerald-600 rounded-full flex items-center justify-center text-white mx-auto mb-3 shadow-lg shadow-emerald-900/40 border-2 border-emerald-400/40">
              <CheckCircle className="w-9 h-9" />
            </div>
            <h1 className="text-xl font-bold tracking-tight text-white">
              Registration Successfully Submitted!
            </h1>
            <p className="text-xs text-emerald-300 mt-1">
              Church of the Nazarene, Remera · Kigali, Rwanda
            </p>
            <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-800/80 text-emerald-200 text-xs font-medium border border-emerald-600/50">
              <Lock className="w-3.5 h-3.5" />
              <span>Record Permanently Locked & Stored in Church Database</span>
            </div>
          </div>

          {/* Locked Notice Banner */}
          <div className="bg-amber-50 border-b border-amber-200 px-6 py-4 flex items-start gap-3">
            <Lock className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
            <div className="text-xs text-amber-900 space-y-1">
              <p className="font-bold">
                Congregant One-Way Lock Policy
              </p>
              <p className="leading-relaxed text-amber-800">
                Per Church of the Nazarene Remera governance and Rwanda Law No. 058/2021, this registration has been sealed into the parish database. <strong className="font-semibold text-amber-950">Submitted forms cannot be edited or deleted online by members.</strong> If you need any corrections, please contact the Church Registrar or Church Secretary during office hours.
              </p>
            </div>
          </div>

          {/* Member Registration Slip Preview */}
          <div className="p-6 space-y-5 text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div>
                <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
                  Official Member Code
                </span>
                <span className="text-xl font-mono font-bold text-indigo-700">
                  {submittedMember.memberCode}
                </span>
              </div>
              <div className="text-right">
                <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
                  Date Registered
                </span>
                <span className="text-xs font-mono text-slate-700">
                  {new Date(submittedMember.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>

            {/* Member Details Grid */}
            <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
              <div>
                <span className="text-slate-400 text-[10px] uppercase font-bold block">Full Name</span>
                <span className="font-semibold text-slate-800 text-sm">
                  {submittedMember.firstName} {submittedMember.lastName}
                </span>
              </div>
              <div>
                <span className="text-slate-400 text-[10px] uppercase font-bold block">Phone Number</span>
                <span className="font-mono text-slate-800 text-xs font-medium">
                  {submittedMember.phone}
                </span>
              </div>
              <div>
                <span className="text-slate-400 text-[10px] uppercase font-bold block">Church Ministry</span>
                <span className="font-semibold text-indigo-700 text-xs">
                  {ministryObj?.name || 'Nazarene Remera'}
                </span>
              </div>
              <div>
                <span className="text-slate-400 text-[10px] uppercase font-bold block">Assigned Role</span>
                <span className="font-semibold text-slate-800 text-xs">
                  {submittedMember.churchInfo.churchRole}
                </span>
              </div>
              <div>
                <span className="text-slate-400 text-[10px] uppercase font-bold block">Rwanda Residence</span>
                <span className="text-slate-700 text-xs">
                  {submittedMember.address.village}, {submittedMember.address.cell}, {submittedMember.address.sector}
                </span>
              </div>
              <div>
                <span className="text-slate-400 text-[10px] uppercase font-bold block">District & Province</span>
                <span className="text-slate-700 text-xs">
                  {submittedMember.address.district}, {submittedMember.address.province}
                </span>
              </div>
            </div>

            {/* Legal Notice */}
            <div className="text-[11px] text-slate-500 flex items-center gap-2 bg-slate-100/70 p-2.5 rounded-lg border border-slate-200">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>
                Personal data protected under Rwanda Law N° 058/2021. National ID encrypted at rest.
              </span>
            </div>

            {/* Action Buttons */}
            <div className="pt-2 flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => window.print()}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold rounded-xl border border-slate-300 transition-colors cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                <span>Print Registration Slip</span>
              </button>

              <button
                onClick={handleResetForAnotherMember}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl shadow-md transition-colors cursor-pointer"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Register Another Member</span>
              </button>
            </div>

            {/* Staff Login Link */}
            <div className="pt-3 text-center border-t border-slate-200">
              <button
                onClick={() => setPortalView('admin')}
                className="text-xs text-indigo-600 hover:text-indigo-800 font-semibold inline-flex items-center gap-1.5"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>Church Leadership & Staff Security Login →</span>
              </button>
            </div>

          </div>
        </div>
      </div>
    );
  }

  // ----------------------------------------------------
  // PUBLIC MULTI-STEP REGISTRATION FORM
  // ----------------------------------------------------
  return (
    <div className="min-h-screen bg-slate-900 text-slate-900 flex flex-col items-center justify-start p-3 sm:p-6 selection:bg-indigo-500 selection:text-white">
      
      {/* Top Header Bar */}
      <div className="w-full max-w-3xl mb-4 flex items-center justify-between text-white">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold text-base shadow-md">
            N
          </div>
          <div>
            <div className="font-bold text-sm tracking-tight text-white flex items-center gap-2">
              <span>Church of the Nazarene – Remera</span>
              <span className="text-slate-400 text-xs hidden sm:inline">· Kigali, Rwanda</span>
            </div>
            <div className="text-[11px] text-slate-400">
              Official Member Self-Registration Portal
            </div>
          </div>
        </div>

        {/* Church Leadership Login Switch */}
        <button
          onClick={() => setPortalView('admin')}
          className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-indigo-300 hover:text-white px-3 py-1.5 rounded-lg border border-slate-700 text-xs transition-colors"
        >
          <Lock className="w-3.5 h-3.5" />
          <span>Staff Login</span>
        </button>
      </div>

      {/* Main Registration Card */}
      <div className="w-full max-w-3xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden text-xs">
        
        {/* Banner with One-Way Submission Explanation */}
        <div className="bg-indigo-900 text-white px-6 py-4 flex items-start justify-between gap-4">
          <div>
            <h1 className="text-base font-bold text-white tracking-tight">
              Church Member Registration Form
            </h1>
            <p className="text-xs text-indigo-200 mt-0.5">
              Please enter your full information. Once submitted, your record is stored directly in the church database and permanently locked.
            </p>
          </div>
          <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded bg-indigo-800 text-[11px] text-emerald-300 shrink-0 font-medium">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Rwanda Law 058/2021</span>
          </div>
        </div>

        {/* Step Indicator */}
        <div className="bg-slate-50 border-b border-slate-200 px-6 py-3 flex items-center justify-between overflow-x-auto text-[11px]">
          {[
            { num: 1, label: 'Personal & Consent' },
            { num: 2, label: 'Parents' },
            { num: 3, label: 'Contact & Address' },
            { num: 4, label: 'Ministry & Role' },
            { num: 5, label: 'Emergency & Review' },
          ].map((st) => (
            <div
              key={st.num}
              className={`flex items-center gap-1.5 whitespace-nowrap px-2 py-1 rounded font-medium ${
                currentStep === st.num
                  ? 'text-indigo-900 bg-indigo-100 font-bold'
                  : currentStep > st.num
                  ? 'text-emerald-700'
                  : 'text-slate-400'
              }`}
            >
              <span
                className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                  currentStep === st.num
                    ? 'bg-indigo-600 text-white'
                    : currentStep > st.num
                    ? 'bg-emerald-600 text-white'
                    : 'bg-slate-200 text-slate-500'
                }`}
              >
                {currentStep > st.num ? '✓' : st.num}
              </span>
              <span>{st.label}</span>
            </div>
          ))}
        </div>

        {/* Error Callout */}
        {formError && (
          <div className="mx-6 mt-4 p-3 rounded-lg bg-rose-50 border border-rose-200 flex items-start gap-2.5 text-rose-800">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <div className="font-medium text-xs leading-relaxed">{formError}</div>
          </div>
        )}

        {/* Step Form Body */}
        <div className="p-6">
          
          {/* STEP 1: PERSONAL & LAW 058/2021 CONSENT */}
          {currentStep === 1 && (
            <div className="space-y-4">
              <div className="border-b border-slate-200 pb-2">
                <h2 className="font-bold text-sm text-slate-900">Step 1: Personal Information</h2>
                <p className="text-slate-500 text-[11px]">
                  Provide your primary identity details and mandatory Rwandan data privacy consent.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    First Name (Amazina y'Ububati) *
                  </label>
                  <input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="e.g. Jean-Paul"
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 text-xs focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Last Name (Izina ry'Umuryango) *
                  </label>
                  <input
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="e.g. Habimana"
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 text-xs focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Gender *</label>
                  <div className="grid grid-cols-2 gap-2">
                    {(['Male', 'Female'] as Gender[]).map((g) => (
                      <button
                        type="button"
                        key={g}
                        onClick={() => setGender(g)}
                        className={`py-2 px-3 rounded-lg border text-xs font-semibold transition-colors ${
                          gender === g
                            ? 'bg-indigo-600 text-white border-indigo-600'
                            : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                        }`}
                      >
                        {g === 'Male' ? 'Gabo (Male)' : 'Gore (Female)'}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Date of Birth *</label>
                  <input
                    type="date"
                    value={dateOfBirth}
                    onChange={(e) => setDateOfBirth(e.target.value)}
                    max={new Date().toISOString().split('T')[0]}
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 text-xs font-mono focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Rwandan National ID Number (16 Digits) *
                </label>
                <input
                  type="text"
                  value={nationalId}
                  onChange={(e) => setNationalId(formatNationalId(e.target.value))}
                  placeholder="1 1995 8 0012345 0 23"
                  maxLength={19}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-xs font-mono tracking-wider focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                />
                <p className="text-[10px] text-slate-500 mt-1">
                  16 digits: Starting with 1, birth year matching, 8 for Male, 7 for Female.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Marital Status *</label>
                  <select
                    value={maritalStatus}
                    onChange={(e) => setMaritalStatus(e.target.value as MaritalStatus)}
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 text-xs focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="Single">Single (Ingaragu)</option>
                    <option value="Married">Married (Yarashyingiranywe)</option>
                    <option value="Widowed">Widowed (Umupfakazi)</option>
                    <option value="Divorced">Divorced (Yatandukanye)</option>
                    <option value="Separated">Separated (Batandukanye)</option>
                  </select>
                </div>
                {maritalStatus === 'Married' && (
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Spouse's Name (Uwo Mwashyingiranywe) *
                    </label>
                    <input
                      type="text"
                      value={spouseName}
                      onChange={(e) => setSpouseName(e.target.value)}
                      placeholder="e.g. Marie Chantal Uwase"
                      className="w-full border border-slate-300 rounded-lg px-3 py-2 text-xs focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Occupation (Umwuga)</label>
                  <input
                    type="text"
                    value={occupation}
                    onChange={(e) => setOccupation(e.target.value)}
                    placeholder="e.g. Teacher, Civil Engineer, Entrepreneur"
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 text-xs"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Education Level</label>
                  <select
                    value={educationLevel}
                    onChange={(e) => setEducationLevel(e.target.value as EducationLevel)}
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 text-xs"
                  >
                    <option value="None">None</option>
                    <option value="Primary">Primary (Abanza)</option>
                    <option value="Secondary (O-Level)">Secondary (O-Level / Tronc Commun)</option>
                    <option value="Secondary (A-Level / TVET)">Secondary (A-Level / TVET)</option>
                    <option value="Bachelor's">Bachelor's Degree (Icyiciro cya 2 cya Kaminuza)</option>
                    <option value="Master's">Master's Degree</option>
                    <option value="Doctorate">Doctorate (PhD)</option>
                  </select>
                </div>
              </div>

              {/* Legal Privacy Consent Checkbox */}
              <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl space-y-2 mt-2">
                <label className="flex items-start gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={consentAgreed}
                    onChange={(e) => setConsentAgreed(e.target.checked)}
                    className="mt-0.5 rounded text-emerald-600 focus:ring-emerald-500 w-4 h-4 cursor-pointer"
                  />
                  <div className="text-slate-800 text-[11px] leading-relaxed">
                    <strong className="font-semibold text-emerald-950">
                      Rwanda Law No. 058/2021 Privacy Consent:
                    </strong>{' '}
                    I hereby consent to Church of the Nazarene, Remera recording and processing my personal data for pastoral care, church registries, and official fellowship activities.
                  </div>
                </label>
              </div>
            </div>
          )}

          {/* STEP 2: PARENTS' INFORMATION */}
          {currentStep === 2 && (
            <div className="space-y-4">
              <div className="border-b border-slate-200 pb-2">
                <h2 className="font-bold text-sm text-slate-900">Step 2: Parents' Lineage Information</h2>
                <p className="text-slate-500 text-[11px]">
                  Church genealogical record of father and mother for church sacraments and records.
                </p>
              </div>

              {/* Father */}
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-3">
                <div className="font-bold text-slate-800 text-xs">Father's Details (Data ya Se)</div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Father's Full Name *
                    </label>
                    <input
                      type="text"
                      value={fatherName}
                      onChange={(e) => setFatherName(e.target.value)}
                      placeholder="e.g. Celestin Rutayisire"
                      className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Status</label>
                    <select
                      value={fatherStatus}
                      onChange={(e) => setFatherStatus(e.target.value as ParentStatus)}
                      className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs"
                    >
                      <option value="Living">Living (Ariho)</option>
                      <option value="Deceased">Deceased (Yitabye Imana)</option>
                      <option value="Unknown">Unknown (Ntazwi)</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Mother */}
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-3">
                <div className="font-bold text-slate-800 text-xs">Mother's Details (Data ya Nyina)</div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Mother's Full Name *
                    </label>
                    <input
                      type="text"
                      value={motherName}
                      onChange={(e) => setMotherName(e.target.value)}
                      placeholder="e.g. Beatrice Mukagasana"
                      className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Status</label>
                    <select
                      value={motherStatus}
                      onChange={(e) => setMotherStatus(e.target.value as ParentStatus)}
                      className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs"
                    >
                      <option value="Living">Living (Ariho)</option>
                      <option value="Deceased">Deceased (Yitabye Imana)</option>
                      <option value="Unknown">Unknown (Ntazwi)</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: CONTACT & RWANDA CASCADING LOCATION */}
          {currentStep === 3 && (
            <div className="space-y-4">
              <div className="border-b border-slate-200 pb-2">
                <h2 className="font-bold text-sm text-slate-900">Step 3: Contact & Rwandan Residence</h2>
                <p className="text-slate-500 text-[11px]">
                  Rwandan cascading address: Select Province to immediately load Districts, Sectors, Cells, and Villages.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Primary Phone (Rwandan +250) *
                  </label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+250 788 123 456"
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 text-xs font-mono"
                  />
                  <p className="text-[10px] text-slate-500 mt-1">MTN (078/079) or Airtel (072/073)</p>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Alternative Phone</label>
                  <input
                    type="text"
                    value={altPhone}
                    onChange={(e) => setAltPhone(e.target.value)}
                    placeholder="+250 788 000 000 (Optional)"
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 text-xs font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.rw (Optional)"
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-xs"
                />
              </div>

              {/* Rwandan Administrative Structure Cascading Selection */}
              <div className="p-4 rounded-xl border border-indigo-100 bg-indigo-50/40 space-y-3">
                <div className="flex items-center gap-2 text-indigo-950 font-bold text-xs">
                  <MapPin className="w-4 h-4 text-indigo-600" />
                  <span>Rwanda Administrative Address (Aho Utuye)</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Province (Intara) *</label>
                    <select
                      value={province}
                      onChange={(e) => handleProvinceChange(e.target.value)}
                      className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs font-medium"
                    >
                      {PROVINCES.map((p) => (
                        <option key={p} value={p}>
                          {p}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">District (Akarere) *</label>
                    <select
                      value={district}
                      onChange={(e) => handleDistrictChange(e.target.value)}
                      className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs font-medium"
                    >
                      {availableDistricts.map((d) => (
                        <option key={d} value={d}>
                          {d}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Sector (Umurenge) *</label>
                    <select
                      value={sector}
                      onChange={(e) => handleSectorChange(e.target.value)}
                      className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs font-medium"
                    >
                      {availableSectors.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Cell (Akagari) *</label>
                    <select
                      value={cell}
                      onChange={(e) => handleCellChange(e.target.value)}
                      className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs font-medium"
                    >
                      {availableCells.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Village (Umudugudu) *</label>
                    <select
                      value={village}
                      onChange={(e) => setVillage(e.target.value)}
                      className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs font-medium"
                    >
                      {availableVillages.map((v) => (
                        <option key={v} value={v}>
                          {v}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Street Address / House Description
                  </label>
                  <input
                    type="text"
                    value={streetAddress}
                    onChange={(e) => setStreetAddress(e.target.value)}
                    placeholder="e.g. KG 178 St, Near Remera Catholic / Nazarene Sanctuary"
                    className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: CHURCH MINISTRY & ROLE */}
          {currentStep === 4 && (
            <div className="space-y-4">
              <div className="border-b border-slate-200 pb-2">
                <h2 className="font-bold text-sm text-slate-900">Step 4: Church Fellowship & Ministry</h2>
                <p className="text-slate-500 text-[11px]">
                  Select your active ministry at Remera Parish and your church role.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Date Joined Church *</label>
                  <input
                    type="date"
                    value={membershipDate}
                    onChange={(e) => setMembershipDate(e.target.value)}
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 text-xs font-mono"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Church Ministry (Departement / Amatsinda) *
                  </label>
                  <select
                    value={ministryId}
                    onChange={(e) => setMinistryId(e.target.value)}
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 text-xs font-semibold text-indigo-900"
                  >
                    {ministries.map((min) => (
                      <option key={min.id} value={min.id}>
                        {min.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Church Role Selector */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1.5">
                  Church Role (Hitamo Inshingano Ufite mu Itorero) *
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-3">
                  {PUBLIC_ROLES.map((r) => {
                    const isSelected = selectedRoleType === r.id;
                    return (
                      <button
                        type="button"
                        key={r.id}
                        onClick={() => handleSelectPredefinedRole(r.id)}
                        className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                            : 'bg-white hover:bg-slate-50 border-slate-300 text-slate-800'
                        }`}
                      >
                        <div className="font-bold text-xs">{r.label}</div>
                        <div className={`text-[10px] mt-0.5 ${isSelected ? 'text-indigo-100' : 'text-slate-500'}`}>
                          {r.kinyarwanda}
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Option to write custom role */}
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="roleType"
                      checked={selectedRoleType === 'OTHER'}
                      onChange={() => {
                        setSelectedRoleType('OTHER');
                        setChurchRole(customRoleText);
                      }}
                      className="text-indigo-600 focus:ring-indigo-500 w-3.5 h-3.5 cursor-pointer"
                    />
                    <span className="font-semibold text-xs text-slate-800">
                      ✍️ Or Write Your Own Specific Role (Andika indi nshingano)
                    </span>
                  </label>

                  {selectedRoleType === 'OTHER' && (
                    <input
                      type="text"
                      value={customRoleText}
                      onChange={(e) => handleCustomRoleChange(e.target.value)}
                      placeholder="e.g. Sunday School Teacher, Audio Technician, Treasurer"
                      className="w-full bg-white border border-indigo-300 rounded-lg px-3 py-2 text-xs text-slate-800 focus:ring-1 focus:ring-indigo-500"
                    />
                  )}
                </div>
              </div>

              {/* Baptism Sacrament */}
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Droplets className="w-4 h-4 text-sky-600" />
                    <span className="font-bold text-xs text-slate-800">
                      Sacrament of Holy Baptism (Umubatizo)
                    </span>
                  </div>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isBaptized}
                      onChange={(e) => setIsBaptized(e.target.checked)}
                      className="rounded text-sky-600 focus:ring-sky-500 w-4 h-4 cursor-pointer"
                    />
                    <span className="text-xs font-semibold text-slate-700">Baptized in Christ</span>
                  </label>
                </div>

                {isBaptized && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Baptism Date</label>
                      <input
                        type="date"
                        value={baptismDate}
                        onChange={(e) => setBaptismDate(e.target.value)}
                        className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs font-mono"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Place of Baptism</label>
                      <input
                        type="text"
                        value={baptismPlace}
                        onChange={(e) => setBaptismPlace(e.target.value)}
                        placeholder="e.g. Remera Nazarene Sanctuary"
                        className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* STEP 5: EMERGENCY CONTACT & FINAL REVIEW */}
          {currentStep === 5 && (
            <div className="space-y-4">
              <div className="border-b border-slate-200 pb-2">
                <h2 className="font-bold text-sm text-slate-900">Step 5: Emergency Contact & Verification</h2>
                <p className="text-slate-500 text-[11px]">
                  Provide a reliable contact person in case of medical or pastoral emergencies, then verify your details.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Emergency Contact Name *
                  </label>
                  <input
                    type="text"
                    value={emergencyName}
                    onChange={(e) => setEmergencyName(e.target.value)}
                    placeholder="e.g. Emmanuel Habumugisha"
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 text-xs"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Relationship</label>
                  <select
                    value={emergencyRelationship}
                    onChange={(e) => setEmergencyRelationship(e.target.value)}
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 text-xs"
                  >
                    <option value="Spouse">Spouse (Uwo bashyingiranywe)</option>
                    <option value="Parent">Parent (Umubyeyi)</option>
                    <option value="Sibling">Sibling (Umuvandimwe)</option>
                    <option value="Child">Child (Umwana)</option>
                    <option value="Relative">Relative (Uwo mu muryango)</option>
                    <option value="Friend">Friend / Neighbor (Inshuti)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Emergency Phone (+250) *
                </label>
                <input
                  type="text"
                  value={emergencyPhone}
                  onChange={(e) => setEmergencyPhone(e.target.value)}
                  placeholder="+250 788 000 000"
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-xs font-mono"
                />
              </div>

              {/* Summary Review Card */}
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-3">
                <div className="font-bold text-xs text-slate-800">Review Summary Before Direct Database Storage:</div>
                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <div>
                    <span className="text-slate-400 block">Name:</span>
                    <span className="font-semibold text-slate-800">{firstName} {lastName}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Phone:</span>
                    <span className="font-mono text-slate-800">{phone}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Residence:</span>
                    <span className="text-slate-800">{village}, {cell}, {sector} ({district})</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Ministry & Role:</span>
                    <span className="font-semibold text-indigo-700">
                      {ministries.find((m) => m.id === ministryId)?.name} · {churchRole}
                    </span>
                  </div>
                </div>
              </div>

              {/* Warning Notice Before Submission */}
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-3.5 flex items-start gap-3">
                <Lock className="w-4 h-4 text-amber-700 mt-0.5 shrink-0" />
                <div className="text-[11px] text-amber-900 leading-relaxed">
                  <strong className="font-semibold">Notice before submitting:</strong> Clicking "Submit Registration to Remera Database" will permanently save and seal your record. Submitted information cannot be edited by congregants.
                </div>
              </div>

            </div>
          )}

        </div>

        {/* Modal Wizard Navigation Footer */}
        <div className="bg-slate-50 px-6 py-4 border-t border-slate-200 flex items-center justify-between">
          {currentStep > 1 ? (
            <button
              type="button"
              onClick={handlePrevious}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg border border-slate-300 font-semibold text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>
          ) : (
            <div />
          )}

          {currentStep < 5 ? (
            <button
              type="button"
              onClick={handleNext}
              className="flex items-center gap-1.5 px-5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 font-semibold text-white shadow-sm transition-colors cursor-pointer"
            >
              <span>Continue</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              className="flex items-center gap-2 px-6 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 font-bold text-white shadow-md transition-colors cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>Submit Registration to Remera Database</span>
            </button>
          )}
        </div>

      </div>

      {/* Footer Branding */}
      <div className="mt-4 text-center text-[11px] text-slate-400">
        Church of the Nazarene · Remera Parish · KG 178 St, Gasabo, Kigali
      </div>

    </div>
  );
};
