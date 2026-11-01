/**
 * Members Directory Component
 * Advanced search & filtering by name, phone, Rwanda administrative location, marital status, baptism, ministry.
 * High-density table & card views with Law 058/2021 compliance.
 */

import React, { useState, useMemo } from 'react';
import { useChurchData } from '../context/ChurchDataContext';
import { Member } from '../types';
import { calculateAge, maskNationalId } from '../utils/validation';
import {
  Search,
  Filter,
  RotateCcw,
  UserCheck,
  UserX,
  Eye,
  Edit2,
  Download,
  LayoutGrid,
  List,
  Phone,
  MapPin,
  Droplets,
  ShieldCheck,
  Check,
  AlertCircle,
  Share2,
} from 'lucide-react';

interface MembersDirectoryProps {
  onSelectMember: (memberId: string) => void;
  onEditMember: (member: Member) => void;
  onOpenRegisterModal: () => void;
  onExportReports: () => void;
  onOpenShareModal?: () => void;
}

export const MembersDirectory: React.FC<MembersDirectoryProps> = ({
  onSelectMember,
  onEditMember,
  onOpenRegisterModal,
  onExportReports,
  onOpenShareModal,
}) => {
  const {
    members,
    ministries,
    currentRole,
    unmaskedNidMemberIds,
    deactivateMember,
    activateMember,
    t,
  } = useChurchData();

  // Filters State
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMinistry, setSelectedMinistry] = useState('ALL');
  const [selectedBaptism, setSelectedBaptism] = useState('ALL');
  const [selectedMarital, setSelectedMarital] = useState('ALL');
  const [selectedAgeGroup, setSelectedAgeGroup] = useState('ALL');
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');

  // Deactivate modal state
  const [deactivatingMember, setDeactivatingMember] = useState<Member | null>(null);
  const [deactivateReason, setDeactivateReason] = useState('');

  // Filtered members
  const filteredMembers = useMemo(() => {
    return members.filter((m) => {
      // 1. Search term (Name, Code, Phone, Address)
      if (searchTerm.trim()) {
        const query = searchTerm.toLowerCase();
        const fullName = `${m.firstName} ${m.lastName}`.toLowerCase();
        const code = m.memberCode.toLowerCase();
        const phone = m.phone.toLowerCase();
        const sector = (m.address?.sector || '').toLowerCase();
        const cell = (m.address?.cell || '').toLowerCase();
        const village = (m.address?.village || '').toLowerCase();
        const occupation = (m.occupation || '').toLowerCase();

        const matchesSearch =
          fullName.includes(query) ||
          code.includes(query) ||
          phone.includes(query) ||
          sector.includes(query) ||
          cell.includes(query) ||
          village.includes(query) ||
          occupation.includes(query) ||
          (m.churchInfo?.churchRole || '').toLowerCase().includes(query);

        if (!matchesSearch) return false;
      }

      // 2. Ministry
      if (selectedMinistry !== 'ALL' && m.churchInfo.ministryId !== selectedMinistry) {
        return false;
      }

      // 3. Baptism status
      if (selectedBaptism === 'BAPTIZED' && !m.churchInfo.baptism.isBaptized) {
        return false;
      }
      if (selectedBaptism === 'NOT_BAPTIZED' && m.churchInfo.baptism.isBaptized) {
        return false;
      }

      // 4. Marital status
      if (selectedMarital !== 'ALL' && m.maritalStatus !== selectedMarital) {
        return false;
      }

      // 5. Age category
      if (selectedAgeGroup !== 'ALL') {
        const { category } = calculateAge(m.dateOfBirth);
        if (category !== selectedAgeGroup) return false;
      }

      // 6. Membership Status
      if (selectedStatus !== 'ALL' && m.churchInfo.membershipStatus !== selectedStatus) {
        return false;
      }

      return true;
    });
  }, [
    members,
    searchTerm,
    selectedMinistry,
    selectedBaptism,
    selectedMarital,
    selectedAgeGroup,
    selectedStatus,
  ]);

  const resetAllFilters = () => {
    setSearchTerm('');
    setSelectedMinistry('ALL');
    setSelectedBaptism('ALL');
    setSelectedMarital('ALL');
    setSelectedAgeGroup('ALL');
    setSelectedStatus('ALL');
  };

  const handleConfirmDeactivate = () => {
    if (!deactivatingMember) return;
    deactivateMember(deactivatingMember.id, deactivateReason || 'Church administration deactivation');
    setDeactivatingMember(null);
    setDeactivateReason('');
  };

  return (
    <div className="space-y-4 max-w-7xl mx-auto pb-12">
      {/* Top Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-3 border-b border-slate-200">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900">
            {t('navMembers')}
          </h1>
          <div className="text-xs text-slate-500 mt-0.5 flex items-center gap-2">
            <span>
              Showing <strong className="font-mono tabular-nums text-slate-800">{filteredMembers.length}</strong> of{' '}
              <span className="font-mono tabular-nums">{members.length}</span> records
            </span>
            <span>·</span>
            <span>Remera Parish Roll</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Grid / Table Toggle */}
          <div className="flex items-center bg-slate-100 p-0.5 rounded border border-slate-200">
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded text-xs transition-colors ${
                viewMode === 'table' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500 hover:text-slate-800'
              }`}
              title="Table View"
            >
              <List className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded text-xs transition-colors ${
                viewMode === 'grid' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500 hover:text-slate-800'
              }`}
              title="Card Grid View"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
            </button>
          </div>

          <button
            onClick={onExportReports}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded hover:bg-slate-50 transition-colors shadow-2xs"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span>{t('exportExcel')}</span>
          </button>

          {onOpenShareModal && (
            <button
              onClick={onOpenShareModal}
              title="Share member self-registration link to church members"
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded transition-colors shadow-2xs"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Share Link</span>
            </button>
          )}

          {(currentRole === 'SUPER_ADMIN' || currentRole === 'DATA_ENTRY') && (
            <button
              onClick={onOpenRegisterModal}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded transition-colors shadow-xs"
            >
              <span>+ {t('registerMember')}</span>
            </button>
          )}
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white p-3 rounded-lg border border-slate-200 shadow-2xs space-y-3">
        {/* Search input line */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={t('searchPlaceholder')}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded text-xs focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 transition-colors placeholder:text-slate-400"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-3 top-2.5 text-xs text-slate-400 hover:text-slate-600"
            >
              Clear
            </button>
          )}
        </div>

        {/* Multi-Filter Dropdown Selectors */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 pt-1">
          {/* Ministry Filter */}
          <div>
            <label className="block text-[11px] font-medium text-slate-500 mb-1">
              {t('ministry')}
            </label>
            <select
              value={selectedMinistry}
              onChange={(e) => setSelectedMinistry(e.target.value)}
              className="w-full text-xs bg-white border border-slate-200 rounded px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            >
              <option value="ALL">All Ministries</option>
              {ministries.map((min) => (
                <option key={min.id} value={min.id}>
                  {min.name}
                </option>
              ))}
            </select>
          </div>

          {/* Baptism Status Filter */}
          <div>
            <label className="block text-[11px] font-medium text-slate-500 mb-1">
              {t('baptismStatus')}
            </label>
            <select
              value={selectedBaptism}
              onChange={(e) => setSelectedBaptism(e.target.value)}
              className="w-full text-xs bg-white border border-slate-200 rounded px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            >
              <option value="ALL">All Baptism States</option>
              <option value="BAPTIZED">Baptized (Immersion)</option>
              <option value="NOT_BAPTIZED">Not Yet Baptized</option>
            </select>
          </div>

          {/* Marital Status */}
          <div>
            <label className="block text-[11px] font-medium text-slate-500 mb-1">
              {t('maritalStatus')}
            </label>
            <select
              value={selectedMarital}
              onChange={(e) => setSelectedMarital(e.target.value)}
              className="w-full text-xs bg-white border border-slate-200 rounded px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            >
              <option value="ALL">All Statuses</option>
              <option value="Single">Single</option>
              <option value="Married">Married</option>
              <option value="Widowed">Widowed</option>
              <option value="Divorced">Divorced</option>
              <option value="Separated">Separated</option>
            </select>
          </div>

          {/* Age Category Filter */}
          <div>
            <label className="block text-[11px] font-medium text-slate-500 mb-1">
              Age Group
            </label>
            <select
              value={selectedAgeGroup}
              onChange={(e) => setSelectedAgeGroup(e.target.value)}
              className="w-full text-xs bg-white border border-slate-200 rounded px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            >
              <option value="ALL">All Age Groups</option>
              <option value="Children (0-12)">Children (0-12)</option>
              <option value="Youth (13-25)">Youth (13-25)</option>
              <option value="Young Adult (26-35)">Young Adult (26-35)</option>
              <option value="Adult (36-59)">Adult (36-59)</option>
              <option value="Elder / Senior (60+)">Elder / Senior (60+)</option>
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <label className="block text-[11px] font-medium text-slate-500 mb-1">
              {t('membershipStatus')}
            </label>
            <div className="flex items-center gap-1">
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full text-xs bg-white border border-slate-200 rounded px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              >
                <option value="ALL">All Statuses</option>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
                <option value="Transferred">Transferred</option>
              </select>
              <button
                onClick={resetAllFilters}
                title="Reset all filters"
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded hover:bg-slate-100"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content: Table or Grid */}
      {filteredMembers.length === 0 ? (
        <div className="bg-white rounded-lg border border-slate-200 p-12 text-center shadow-2xs">
          <AlertCircle className="w-8 h-8 text-slate-400 mx-auto mb-2" />
          <h3 className="text-sm font-semibold text-slate-900">{t('noMembersFound')}</h3>
          <p className="text-xs text-slate-500 mt-1">
            Try adjusting your search criteria or resetting filters.
          </p>
          <button
            onClick={resetAllFilters}
            className="mt-4 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded text-xs font-medium transition-colors"
          >
            {t('resetFilters')}
          </button>
        </div>
      ) : viewMode === 'table' ? (
        /* High-Density Responsive Table */
        <div className="bg-white rounded-lg border border-slate-200 shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                  <th className="py-2.5 px-3">Member ID</th>
                  <th className="py-2.5 px-3">Full Name & Demographics</th>
                  <th className="py-2.5 px-3">Rwandan Phone</th>
                  <th className="py-2.5 px-3">Rwanda Location</th>
                  <th className="py-2.5 px-3">Ministry & Role</th>
                  <th className="py-2.5 px-3 text-center">Baptism</th>
                  <th className="py-2.5 px-3 text-center">Status</th>
                  <th className="py-2.5 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredMembers.map((member) => {
                  const { age, category } = calculateAge(member.dateOfBirth);
                  const isUnmasked = unmaskedNidMemberIds.has(member.id);
                  const maskedNid = maskNationalId(member.nationalId, currentRole, isUnmasked);
                  const ministry = ministries.find((m) => m.id === member.churchInfo.ministryId);
                  const isActive = member.churchInfo.membershipStatus === 'Active';

                  return (
                    <tr
                      key={member.id}
                      className="hover:bg-slate-50/80 transition-colors group cursor-pointer"
                      onClick={() => onSelectMember(member.id)}
                    >
                      {/* Member Code */}
                      <td className="py-2.5 px-3 font-mono tabular-nums text-slate-600 font-medium whitespace-nowrap">
                        {member.memberCode}
                      </td>

                      {/* Name & Demographics */}
                      <td className="py-2.5 px-3">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center font-bold text-[11px] shrink-0">
                            {member.firstName[0]}
                            {member.lastName[0]}
                          </div>
                          <div>
                            <div className="font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors">
                              {member.firstName} {member.lastName}
                            </div>
                            <div className="text-[11px] text-slate-400 flex items-center gap-1.5 mt-0.5">
                              <span>{member.gender}</span>
                              <span aria-hidden="true">·</span>
                              <span className="font-mono tabular-nums">{age} yrs</span>
                              <span aria-hidden="true">·</span>
                              <span>{member.maritalStatus}</span>
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Phone */}
                      <td className="py-2.5 px-3 font-mono tabular-nums text-slate-700 whitespace-nowrap">
                        {member.phone}
                      </td>

                      {/* Rwanda Location */}
                      <td className="py-2.5 px-3 whitespace-nowrap">
                        <div className="text-slate-800 font-medium">
                          {member.address.sector || 'Remera'}, {member.address.cell || 'Rukiri'}
                        </div>
                        <div className="text-[11px] text-slate-400">
                          {member.address.district || 'Gasabo'} · {member.address.village || 'Urumuri'}
                        </div>
                      </td>

                      {/* Ministry & Role */}
                      <td className="py-2.5 px-3 whitespace-nowrap">
                        <div className="text-slate-800 font-medium">
                          {ministry?.name || 'General Congregation'}
                        </div>
                        <div className="text-[11px] text-slate-500">
                          {member.churchInfo.churchRole || 'Member'}
                        </div>
                      </td>

                      {/* Baptism */}
                      <td className="py-2.5 px-3 text-center whitespace-nowrap">
                        {member.churchInfo.baptism.isBaptized ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-medium text-sky-700 bg-sky-50 px-2 py-0.5 rounded border border-sky-100">
                            <Droplets className="w-3 h-3 text-sky-500" />
                            <span>Baptized</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center text-[11px] text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                            Not Yet
                          </span>
                        )}
                      </td>

                      {/* Status */}
                      <td className="py-2.5 px-3 text-center whitespace-nowrap">
                        <span
                          className={`inline-flex items-center text-[11px] font-medium px-2 py-0.5 rounded ${
                            isActive
                              ? 'text-emerald-700 bg-emerald-50 border border-emerald-100'
                              : 'text-amber-700 bg-amber-50 border border-amber-100'
                          }`}
                        >
                          {member.churchInfo.membershipStatus}
                        </span>
                      </td>

                      {/* Actions */}
                      <td
                        className="py-2.5 px-3 text-right whitespace-nowrap"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => onSelectMember(member.id)}
                            title={t('viewProfile')}
                            className="p-1 text-slate-400 hover:text-indigo-600 rounded hover:bg-slate-100"
                          >
                            <Eye className="w-4 h-4" />
                          </button>

                          {(currentRole === 'SUPER_ADMIN' || currentRole === 'DATA_ENTRY') && (
                            <button
                              onClick={() => onEditMember(member)}
                              title={t('edit')}
                              className="p-1 text-slate-400 hover:text-amber-600 rounded hover:bg-slate-100"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                          )}

                          {(currentRole === 'SUPER_ADMIN' || currentRole === 'DATA_ENTRY') && (
                            isActive ? (
                              <button
                                onClick={() => setDeactivatingMember(member)}
                                title={t('deactivate')}
                                className="p-1 text-slate-400 hover:text-rose-600 rounded hover:bg-slate-100"
                              >
                                <UserX className="w-4 h-4" />
                              </button>
                            ) : (
                              <button
                                onClick={() => activateMember(member.id)}
                                title={t('activate')}
                                className="p-1 text-slate-400 hover:text-emerald-600 rounded hover:bg-slate-100"
                              >
                                <UserCheck className="w-4 h-4" />
                              </button>
                            )
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Card Grid View */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredMembers.map((member) => {
            const { age } = calculateAge(member.dateOfBirth);
            const ministry = ministries.find((m) => m.id === member.churchInfo.ministryId);
            const isActive = member.churchInfo.membershipStatus === 'Active';

            return (
              <div
                key={member.id}
                onClick={() => onSelectMember(member.id)}
                className="bg-white rounded-lg border border-slate-200 p-4 shadow-2xs hover:border-slate-300 transition-all cursor-pointer group"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-slate-100 border border-slate-200 text-slate-700 flex items-center justify-center font-bold text-sm">
                      {member.firstName[0]}
                      {member.lastName[0]}
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors text-sm">
                        {member.firstName} {member.lastName}
                      </h4>
                      <p className="text-[11px] font-mono tabular-nums text-slate-400">
                        {member.memberCode} · {member.gender}, {age}y
                      </p>
                    </div>
                  </div>
                  <span
                    className={`text-[10px] font-medium px-2 py-0.5 rounded ${
                      isActive ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
                    }`}
                  >
                    {member.churchInfo.membershipStatus}
                  </span>
                </div>

                <div className="mt-3 pt-3 border-t border-slate-100 space-y-1.5 text-xs text-slate-600">
                  <div className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="font-mono tabular-nums">{member.phone}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">
                      {member.address.sector}, {member.address.cell} ({member.address.village})
                    </span>
                  </div>
                </div>

                <div className="mt-3 pt-2 flex items-center justify-between text-[11px] border-t border-slate-50 text-slate-500">
                  <span className="truncate">{ministry?.name || 'General'}</span>
                  {member.churchInfo.baptism.isBaptized ? (
                    <span className="text-sky-600 font-medium">Baptized</span>
                  ) : (
                    <span className="text-slate-400">Not Baptized</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Deactivation Modal */}
      {deactivatingMember && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-5 border border-slate-200 shadow-xl space-y-4">
            <div className="flex items-center gap-2 text-rose-600 font-semibold text-sm">
              <AlertCircle className="w-4 h-4" />
              <span>Deactivate Church Member</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Are you sure you want to deactivate{' '}
              <strong>
                {deactivatingMember.firstName} {deactivatingMember.lastName}
              </strong>{' '}
              ({deactivatingMember.memberCode})? Under Law No. 058/2021, church records are never hard-deleted; the status will change to Inactive with an audit log.
            </p>
            <div>
              <label className="block text-[11px] font-medium text-slate-700 mb-1">
                Deactivation Reason (Required for audit log)
              </label>
              <textarea
                value={deactivateReason}
                onChange={(e) => setDeactivateReason(e.target.value)}
                placeholder="e.g. Relocated to another district, transferred membership, or requested inactive status..."
                rows={3}
                className="w-full text-xs p-2 border border-slate-200 rounded focus:outline-none focus:ring-1 focus:ring-rose-500"
              />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setDeactivatingMember(null)}
                className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded"
              >
                {t('cancel')}
              </button>
              <button
                onClick={handleConfirmDeactivate}
                className="px-3.5 py-1.5 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded transition-colors"
              >
                Confirm Deactivation
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
