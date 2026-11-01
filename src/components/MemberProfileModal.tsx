/**
 * Member Profile Modal Component
 * Comprehensive view of church member personal, family, address, sacramental, emergency, and consent details.
 * Law No. 058/2021 audited NID unmasking and printable membership record.
 */

import React from 'react';
import { useChurchData } from '../context/ChurchDataContext';
import { Member } from '../types';
import { calculateAge, maskNationalId, formatNationalId } from '../utils/validation';
import {
  X,
  ShieldCheck,
  Eye,
  EyeOff,
  Droplets,
  Home,
  Phone,
  Mail,
  MapPin,
  Calendar,
  UserCheck,
  Briefcase,
  GraduationCap,
  Heart,
  Printer,
  Edit2,
  Users,
} from 'lucide-react';

interface MemberProfileModalProps {
  memberId: string | null;
  onClose: () => void;
  onEdit: (member: Member) => void;
  onSelectMember: (memberId: string) => void;
}

export const MemberProfileModal: React.FC<MemberProfileModalProps> = ({
  memberId,
  onClose,
  onEdit,
  onSelectMember,
}) => {
  const {
    members,
    families,
    ministries,
    currentRole,
    unmaskedNidMemberIds,
    toggleUnmaskNid,
    getMemberFamily,
    getFamilyMembers,
    t,
  } = useChurchData();

  if (!memberId) return null;

  const member = members.find((m) => m.id === memberId);
  if (!member) return null;

  const { age, category } = calculateAge(member.dateOfBirth);
  const isUnmasked = unmaskedNidMemberIds.has(member.id);
  const displayNid = isUnmasked
    ? formatNationalId(member.nationalId)
    : maskNationalId(member.nationalId, currentRole, false);

  const ministry = ministries.find((m) => m.id === member.churchInfo.ministryId);
  const family = member.familyId ? families.find((f) => f.id === member.familyId) : undefined;
  const householdMembers = family ? getFamilyMembers(family.id) : [];

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-white rounded-xl max-w-3xl w-full border border-slate-200 shadow-2xl overflow-hidden my-auto">
        
        {/* Modal Top Bar */}
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-sm">
              {member.firstName[0]}
              {member.lastName[0]}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-white tracking-tight">
                  {member.firstName} {member.lastName}
                </h2>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                  {member.memberCode}
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Church of the Nazarene, Remera Parish · Member Record
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              title="Print Member Card / Record"
              className="p-1.5 rounded text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <Printer className="w-4 h-4" />
            </button>
            {(currentRole === 'SUPER_ADMIN' || currentRole === 'DATA_ENTRY') && (
              <button
                onClick={() => {
                  onClose();
                  onEdit(member);
                }}
                title={t('edit')}
                className="p-1.5 rounded text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <Edit2 className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 rounded text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto text-xs">
          
          {/* Section 1: Sensitive National ID & Rwanda Law 058/2021 Box */}
          <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <div className="flex items-center gap-1.5 text-slate-700 font-semibold text-xs">
                <ShieldCheck className="w-4 h-4 text-indigo-600" />
                <span>Rwandan National ID (Indangamuntu)</span>
              </div>
              <div className="mt-1 flex items-baseline gap-2">
                <span className="font-mono text-base font-bold text-slate-900 tracking-wider">
                  {displayNid}
                </span>
                <span className="text-[11px] text-slate-400 font-mono">16 Digits</span>
              </div>
              <p className="text-[10px] text-slate-400 mt-0.5">
                Encrypted at rest · Compliance with Rwanda Law N° 058/2021
              </p>
            </div>

            {/* Unmask toggle (Restricted to Super Admin & Data Entry with audit log) */}
            <div>
              {currentRole === 'SUPER_ADMIN' || currentRole === 'DATA_ENTRY' ? (
                <button
                  onClick={() => toggleUnmaskNid(member.id)}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded border border-slate-300 bg-white hover:bg-slate-100 text-slate-700 transition-colors shadow-2xs"
                >
                  {isUnmasked ? (
                    <>
                      <EyeOff className="w-3.5 h-3.5 text-slate-500" />
                      <span>{t('maskNid')}</span>
                    </>
                  ) : (
                    <>
                      <Eye className="w-3.5 h-3.5 text-indigo-600" />
                      <span>{t('unmaskNid')}</span>
                    </>
                  )}
                </button>
              ) : (
                <span className="text-[11px] text-slate-500 bg-slate-100 px-2.5 py-1 rounded border border-slate-200">
                  Protected field (Restricted)
                </span>
              )}
            </div>
          </div>

          {/* Section 2: Personal Information */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-1">
              Personal Information
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div>
                <span className="text-slate-400 block text-[11px]">{t('gender')}</span>
                <span className="font-medium text-slate-800">{member.gender}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">{t('dateOfBirth')}</span>
                <span className="font-mono font-medium text-slate-800">
                  {member.dateOfBirth} ({age} yrs)
                </span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">{t('maritalStatus')}</span>
                <span className="font-medium text-slate-800">{member.maritalStatus}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">{t('spouseName')}</span>
                <span className="font-medium text-slate-800">{member.spouseName || '—'}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">{t('occupation')}</span>
                <span className="font-medium text-slate-800">{member.occupation || '—'}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">{t('educationLevel')}</span>
                <span className="font-medium text-slate-800">{member.educationLevel || '—'}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">{t('phone')}</span>
                <span className="font-mono font-medium text-slate-800">{member.phone}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">{t('email')}</span>
                <span className="font-medium text-slate-800 truncate block">
                  {member.email || '—'}
                </span>
              </div>
            </div>
          </div>

          {/* Section 3: Rwandan Administrative Residence */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-1">
              Rwandan Administrative Address
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 p-3 bg-slate-50 rounded border border-slate-100">
              <div>
                <span className="text-slate-400 block text-[10px] uppercase">Province</span>
                <span className="font-semibold text-slate-800">{member.address.province}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase">District</span>
                <span className="font-semibold text-slate-800">{member.address.district}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase">Sector</span>
                <span className="font-semibold text-slate-800">{member.address.sector}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase">Cell</span>
                <span className="font-semibold text-slate-800">{member.address.cell}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase">Village</span>
                <span className="font-semibold text-slate-800">{member.address.village}</span>
              </div>
            </div>
            {member.address.streetAddress && (
              <div className="text-xs text-slate-600 flex items-center gap-2 px-1">
                <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span>
                  <strong>Street / House:</strong> {member.address.streetAddress}
                </span>
              </div>
            )}
          </div>

          {/* Section 4: Parents & Sacramental Record */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Parents Box */}
            <div className="p-3 bg-slate-50 rounded border border-slate-100 space-y-2">
              <h4 className="font-semibold text-slate-800 text-xs">Parents' Information</h4>
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-500">{t('fatherName')}:</span>
                  <span className="font-medium text-slate-900">
                    {member.parents.fatherName} ({member.parents.fatherStatus})
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">{t('motherName')}:</span>
                  <span className="font-medium text-slate-900">
                    {member.parents.motherName} ({member.parents.motherStatus})
                  </span>
                </div>
              </div>
            </div>

            {/* Baptism & Sacrament Box */}
            <div className="p-3 bg-slate-50 rounded border border-slate-100 space-y-2">
              <h4 className="font-semibold text-slate-800 text-xs flex items-center gap-1.5">
                <Droplets className="w-3.5 h-3.5 text-sky-600" />
                <span>Baptism & Sacraments</span>
              </h4>
              <div className="space-y-1 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-500">Status:</span>
                  <span className="font-bold text-slate-900">
                    {member.churchInfo.baptism.isBaptized ? 'Water Baptized' : 'Not Yet Baptized'}
                  </span>
                </div>
                {member.churchInfo.baptism.isBaptized && (
                  <>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Baptism Date:</span>
                      <span className="font-mono text-slate-800">
                        {member.churchInfo.baptism.baptismDate || '—'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Officiating Pastor:</span>
                      <span className="text-slate-800">
                        {member.churchInfo.baptism.baptizingPastor || '—'}
                      </span>
                    </div>
                    {member.churchInfo.baptism.certificateNumber && (
                      <div className="flex justify-between">
                        <span className="text-slate-500">Certificate #:</span>
                        <span className="font-mono text-slate-800">
                          {member.churchInfo.baptism.certificateNumber}
                        </span>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Section 6: Emergency Contact & Church Roles */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Church Roles */}
            <div className="p-3 bg-slate-50 rounded border border-slate-100 space-y-2">
              <h4 className="font-semibold text-slate-800 text-xs">Church Ministry & Membership</h4>
              <div className="space-y-1 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-500">Ministry:</span>
                  <span className="font-medium text-slate-900">{ministry?.name || '—'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Parish Role:</span>
                  <span className="font-medium text-slate-900">
                    {member.churchInfo.churchRole || 'Member'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Membership Date:</span>
                  <span className="font-mono text-slate-800">
                    {member.churchInfo.membershipDate}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Status:</span>
                  <span className="font-bold text-slate-900">
                    {member.churchInfo.membershipStatus}
                  </span>
                </div>
              </div>
            </div>

            {/* Emergency Contact */}
            <div className="p-3 bg-slate-50 rounded border border-slate-100 space-y-2">
              <h4 className="font-semibold text-slate-800 text-xs">Emergency Contact Person</h4>
              <div className="space-y-1 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-500">Full Name:</span>
                  <span className="font-medium text-slate-900">
                    {member.emergencyContact.fullName}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Relationship:</span>
                  <span className="font-medium text-slate-900">
                    {member.emergencyContact.relationship}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Contact Phone:</span>
                  <span className="font-mono font-medium text-slate-900">
                    {member.emergencyContact.phone}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Section 7: Law 058/2021 Consent Record */}
          <div className="p-3 bg-slate-50 rounded border border-slate-200 text-slate-600 flex items-start gap-2.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <div className="font-semibold text-slate-800">
                Data Protection Consent Recorded
              </div>
              <p className="text-[11px] leading-relaxed text-slate-500">
                Member formally consented on{' '}
                <strong className="font-mono text-slate-700">{member.privacyConsent.consentDate}</strong> via{' '}
                <strong className="text-slate-700">{member.privacyConsent.consentMethod}</strong> in full compliance with Rwanda Law No. 058/2021 on Personal Data Protection and Privacy.
              </p>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="bg-slate-50 border-t border-slate-200 px-6 py-3 flex items-center justify-between">
          <div className="text-[11px] text-slate-400">
            Last updated: {new Date(member.updatedAt).toLocaleDateString()}
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-white rounded transition-colors"
          >
            {t('close')}
          </button>
        </div>
      </div>
    </div>
  );
};
