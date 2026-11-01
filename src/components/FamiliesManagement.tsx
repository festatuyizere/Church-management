/**
 * Families & Households Management Component
 * Family groupings, household head and spouse links, children & dependents, cell group mapping.
 */

import React, { useState } from 'react';
import { useChurchData } from '../context/ChurchDataContext';
import { Family, Member, FamilyRole } from '../types';
import {
  Home,
  Plus,
  Users,
  Search,
  MapPin,
  Phone,
  Trash2,
  Edit2,
  UserPlus,
  Heart,
  ChevronRight,
  ShieldCheck,
  Building,
  X,
} from 'lucide-react';

interface FamiliesManagementProps {
  onSelectMember: (memberId: string) => void;
  onOpenRegisterModal: () => void;
}

export const FamiliesManagement: React.FC<FamiliesManagementProps> = ({
  onSelectMember,
  onOpenRegisterModal,
}) => {
  const {
    families,
    members,
    currentRole,
    addFamily,
    updateFamily,
    deleteFamily,
    updateMember,
    getFamilyMembers,
    t,
  } = useChurchData();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFamilyId, setSelectedFamilyId] = useState<string | null>(
    families[0]?.id || null
  );

  // Modal State for New / Edit Family
  const [isFamilyModalOpen, setIsFamilyModalOpen] = useState(false);
  const [editingFamily, setEditingFamily] = useState<Family | null>(null);

  const [familyName, setFamilyName] = useState('');
  const [headId, setHeadId] = useState('');
  const [spouseId, setSpouseId] = useState('');
  const [cellGroup, setCellGroup] = useState('Rukiri I Nazarene Home Cell');
  const [streetAddress, setStreetAddress] = useState('');
  const [sector, setSector] = useState('Remera');
  const [cell, setCell] = useState('Rukiri I');
  const [familyError, setFamilyError] = useState<string | null>(null);

  // Link member to family modal state
  const [isLinkMemberModalOpen, setIsLinkMemberModalOpen] = useState(false);
  const [memberToLink, setMemberToLink] = useState('');
  const [linkRole, setLinkRole] = useState<FamilyRole>('Child');

  // Filtered families
  const filteredFamilies = families.filter((f) => {
    if (!searchTerm.trim()) return true;
    const query = searchTerm.toLowerCase();
    return (
      f.familyName.toLowerCase().includes(query) ||
      f.familyCode.toLowerCase().includes(query) ||
      (f.cellGroup || '').toLowerCase().includes(query) ||
      (f.address?.sector || '').toLowerCase().includes(query)
    );
  });

  const selectedFamily = families.find((f) => f.id === selectedFamilyId) || families[0];
  const householdMembers = selectedFamily ? getFamilyMembers(selectedFamily.id) : [];

  const headMember = selectedFamily
    ? members.find((m) => m.id === selectedFamily.headOfFamilyMemberId)
    : undefined;

  const spouseMember = selectedFamily?.spouseMemberId
    ? members.find((m) => m.id === selectedFamily.spouseMemberId)
    : undefined;

  const childrenAndDependents = householdMembers.filter(
    (m) =>
      m.id !== selectedFamily?.headOfFamilyMemberId &&
      m.id !== selectedFamily?.spouseMemberId
  );

  const openCreateModal = () => {
    setEditingFamily(null);
    setFamilyName('');
    setHeadId('');
    setSpouseId('');
    setCellGroup('Rukiri I Nazarene Home Cell');
    setStreetAddress('');
    setSector('Remera');
    setCell('Rukiri I');
    setFamilyError(null);
    setIsFamilyModalOpen(true);
  };

  const openEditModal = (family: Family) => {
    setEditingFamily(family);
    setFamilyName(family.familyName);
    setHeadId(family.headOfFamilyMemberId || '');
    setSpouseId(family.spouseMemberId || '');
    setCellGroup(family.cellGroup || '');
    setStreetAddress(family.address?.streetAddress || '');
    setSector(family.address?.sector || 'Remera');
    setCell(family.address?.cell || 'Rukiri I');
    setFamilyError(null);
    setIsFamilyModalOpen(true);
  };

  const handleSaveFamily = () => {
    if (!familyName.trim()) {
      setFamilyError('Family name is required (e.g. The Habimana Household).');
      return;
    }

    const payload = {
      familyName: familyName.trim(),
      headOfFamilyMemberId: headId || undefined,
      spouseMemberId: spouseId || undefined,
      cellGroup: cellGroup.trim() || undefined,
      address: {
        province: 'Kigali City',
        district: 'Gasabo',
        sector,
        cell,
        village: 'Urumuri',
        streetAddress: streetAddress.trim() || undefined,
      },
    };

    if (editingFamily) {
      updateFamily(editingFamily.id, payload as any);
    } else {
      const res = addFamily(payload as any);
      if (res.success && res.family) {
        setSelectedFamilyId(res.family.id);
      }
    }

    setIsFamilyModalOpen(false);
  };

  const handleLinkMember = () => {
    if (!memberToLink || !selectedFamily) return;
    updateMember(memberToLink, {
      familyId: selectedFamily.id,
      familyRole: linkRole,
    });
    setIsLinkMemberModalOpen(false);
    setMemberToLink('');
  };

  const handleUnlinkMember = (memberId: string) => {
    updateMember(memberId, {
      familyId: undefined,
      familyRole: undefined,
    });
  };

  const unlinkedMembers = members.filter((m) => !m.familyId);

  return (
    <div className="space-y-4 max-w-7xl mx-auto pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-3 border-b border-slate-200">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900">
            {t('navFamilies')}
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Group members into households, assign heads of family, track dependents, and organize cell fellowships.
          </p>
        </div>

        {(currentRole === 'SUPER_ADMIN' || currentRole === 'DATA_ENTRY') && (
          <button
            onClick={openCreateModal}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded transition-colors shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{t('createFamily')}</span>
          </button>
        )}
      </div>

      {/* Main Grid: Left Family List, Right Interactive Household View */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Family Search & List */}
        <div className="space-y-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search families by name, code, or cell..."
              className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded text-xs focus:ring-1 focus:ring-indigo-500 focus:outline-none placeholder:text-slate-400"
            />
          </div>

          <div className="bg-white rounded-lg border border-slate-200 divide-y divide-slate-100 shadow-2xs overflow-hidden max-h-[70vh] overflow-y-auto">
            {filteredFamilies.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-400">
                {t('noFamiliesFound')}
              </div>
            ) : (
              filteredFamilies.map((fam) => {
                const isSelected = selectedFamily?.id === fam.id;
                const famMembers = getFamilyMembers(fam.id);
                return (
                  <div
                    key={fam.id}
                    onClick={() => setSelectedFamilyId(fam.id)}
                    className={`p-3.5 cursor-pointer transition-colors ${
                      isSelected
                        ? 'bg-indigo-50/70 border-l-3 border-indigo-600'
                        : 'hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-slate-900 text-xs truncate">
                        {fam.familyName}
                      </span>
                      <span className="font-mono text-[10px] text-slate-400 bg-white px-1.5 py-0.5 rounded border border-slate-200">
                        {fam.familyCode}
                      </span>
                    </div>

                    <div className="mt-1 flex items-center gap-2 text-[11px] text-slate-500">
                      <span>{famMembers.length} members</span>
                      <span aria-hidden="true">·</span>
                      <span className="truncate">{fam.cellGroup || 'General'}</span>
                    </div>

                    <div className="mt-1 text-[11px] text-slate-400 truncate flex items-center gap-1">
                      <MapPin className="w-3 h-3 shrink-0" />
                      <span>{fam.address.sector}, {fam.address.cell}</span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right 2 Columns: Detailed Household Card & Family Tree */}
        <div className="lg:col-span-2 space-y-4">
          {selectedFamily ? (
            <div className="bg-white rounded-lg border border-slate-200 p-6 shadow-2xs space-y-6">
              
              {/* Family Card Header */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-4 border-b border-slate-200">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg bg-indigo-50 text-indigo-700 flex items-center justify-center border border-indigo-100">
                    <Home className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-lg font-bold text-slate-900">
                        {selectedFamily.familyName}
                      </h2>
                      <span className="font-mono text-xs text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                        {selectedFamily.familyCode}
                      </span>
                    </div>
                    <div className="text-xs text-slate-500 flex items-center gap-2 mt-0.5">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      <span>
                        {selectedFamily.address.streetAddress || 'Remera, Kigali'} · {selectedFamily.address.sector}, {selectedFamily.address.cell}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {(currentRole === 'SUPER_ADMIN' || currentRole === 'DATA_ENTRY') && (
                    <>
                      <button
                        onClick={() => openEditModal(selectedFamily)}
                        className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded border border-slate-200 transition-colors"
                        title="Edit Family"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          if (confirm(`Delete ${selectedFamily.familyName}? Members will remain unlinked.`)) {
                            deleteFamily(selectedFamily.id);
                          }
                        }}
                        className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-slate-100 rounded border border-slate-200 transition-colors"
                        title="Delete Family"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </>
                  )}
                </div>
              </div>

              {/* Family Cell Fellowship Strip */}
              <div className="flex flex-wrap items-center justify-between gap-2 p-3 bg-slate-50 rounded border border-slate-200 text-xs">
                <div className="flex items-center gap-2">
                  <Building className="w-4 h-4 text-indigo-600" />
                  <span className="text-slate-500">Parish Home Cell:</span>
                  <span className="font-semibold text-slate-800">
                    {selectedFamily.cellGroup || 'Remera Sanctuary Zone'}
                  </span>
                </div>
                <div className="text-slate-500">
                  Registered: {new Date(selectedFamily.createdAt).toLocaleDateString()}
                </div>
              </div>

              {/* Family Tree / Household Hierarchy */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                    Household Hierarchy & Relational Tree
                  </h3>
                  {(currentRole === 'SUPER_ADMIN' || currentRole === 'DATA_ENTRY') && (
                    <button
                      onClick={() => setIsLinkMemberModalOpen(true)}
                      className="text-xs text-indigo-600 hover:text-indigo-800 font-semibold flex items-center gap-1"
                    >
                      <UserPlus className="w-3.5 h-3.5" />
                      <span>Link Member to Household</span>
                    </button>
                  )}
                </div>

                {/* Head & Spouse Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Head of Household */}
                  <div className="p-4 rounded-lg border border-indigo-200 bg-indigo-50/40 relative">
                    <span className="text-[10px] font-bold text-indigo-700 uppercase tracking-wider block mb-2">
                      Head of Family
                    </span>
                    {headMember ? (
                      <div
                        onClick={() => onSelectMember(headMember.id)}
                        className="cursor-pointer group"
                      >
                        <div className="flex items-center justify-between">
                          <h4 className="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors text-sm">
                            {headMember.firstName} {headMember.lastName}
                          </h4>
                          <span className="font-mono text-[11px] text-slate-500">
                            {headMember.memberCode}
                          </span>
                        </div>
                        <div className="mt-2 text-xs text-slate-600 space-y-1">
                          <div className="flex items-center gap-2">
                            <Phone className="w-3.5 h-3.5 text-slate-400" />
                            <span className="font-mono tabular-nums">{headMember.phone}</span>
                          </div>
                          <div>Role: {headMember.churchInfo.churchRole}</div>
                        </div>
                      </div>
                    ) : (
                      <p className="text-xs text-slate-400 italic">No head assigned yet.</p>
                    )}
                  </div>

                  {/* Spouse */}
                  <div className="p-4 rounded-lg border border-slate-200 bg-slate-50/50">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-2">
                      Spouse
                    </span>
                    {spouseMember ? (
                      <div
                        onClick={() => onSelectMember(spouseMember.id)}
                        className="cursor-pointer group"
                      >
                        <div className="flex items-center justify-between">
                          <h4 className="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors text-sm">
                            {spouseMember.firstName} {spouseMember.lastName}
                          </h4>
                          <span className="font-mono text-[11px] text-slate-500">
                            {spouseMember.memberCode}
                          </span>
                        </div>
                        <div className="mt-2 text-xs text-slate-600 space-y-1">
                          <div className="flex items-center gap-2">
                            <Phone className="w-3.5 h-3.5 text-slate-400" />
                            <span className="font-mono tabular-nums">{spouseMember.phone}</span>
                          </div>
                          <div>Ministry: {spouseMember.churchInfo.churchRole}</div>
                        </div>
                      </div>
                    ) : (
                      <p className="text-xs text-slate-400 italic">
                        {headMember?.maritalStatus === 'Single' ? 'Head is Single' : 'No spouse linked'}
                      </p>
                    )}
                  </div>
                </div>

                {/* Children & Dependents */}
                <div className="space-y-2 pt-2">
                  <span className="text-xs font-semibold text-slate-700 uppercase tracking-wider block">
                    Children & Dependents ({childrenAndDependents.length})
                  </span>

                  {childrenAndDependents.length === 0 ? (
                    <div className="p-4 bg-slate-50 rounded border border-dashed border-slate-200 text-center text-xs text-slate-400">
                      No children or dependents linked to this household yet.
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {childrenAndDependents.map((dep) => (
                        <div
                          key={dep.id}
                          className="p-3 bg-white rounded border border-slate-200 hover:border-slate-300 transition-all flex items-center justify-between"
                        >
                          <div
                            onClick={() => onSelectMember(dep.id)}
                            className="cursor-pointer group"
                          >
                            <div className="font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors text-xs">
                              {dep.firstName} {dep.lastName}
                            </div>
                            <div className="text-[11px] text-slate-400 flex items-center gap-1.5 mt-0.5">
                              <span className="text-indigo-600 font-medium">
                                {dep.familyRole || 'Dependent'}
                              </span>
                              <span>·</span>
                              <span className="font-mono tabular-nums">{dep.memberCode}</span>
                            </div>
                          </div>

                          {(currentRole === 'SUPER_ADMIN' || currentRole === 'DATA_ENTRY') && (
                            <button
                              onClick={() => handleUnlinkMember(dep.id)}
                              title="Unlink from household"
                              className="text-slate-400 hover:text-rose-600 p-1 text-xs"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-lg border border-slate-200 p-12 text-center text-xs text-slate-400">
              Select a family on the left to view the household card.
            </div>
          )}
        </div>
      </div>

      {/* Create / Edit Family Modal */}
      {isFamilyModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-lg w-full p-6 border border-slate-200 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">
                {editingFamily ? 'Edit Family Household' : t('createFamily')}
              </h3>
              <button
                onClick={() => setIsFamilyModalOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {familyError && (
              <div className="p-2.5 bg-rose-50 border border-rose-200 rounded text-xs text-rose-700">
                {familyError}
              </div>
            )}

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-[11px] font-medium text-slate-700 mb-1">
                  Family Name (e.g. The Habimana Family) *
                </label>
                <input
                  type="text"
                  value={familyName}
                  onChange={(e) => setFamilyName(e.target.value)}
                  placeholder="e.g. The Habimana Family"
                  className="w-full p-2 border border-slate-200 rounded focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-medium text-slate-700 mb-1">
                    Head of Family
                  </label>
                  <select
                    value={headId}
                    onChange={(e) => setHeadId(e.target.value)}
                    className="w-full p-2 border border-slate-200 rounded bg-white focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                  >
                    <option value="">Select Member...</option>
                    {members.map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.firstName} {m.lastName} ({m.memberCode})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-slate-700 mb-1">
                    Spouse
                  </label>
                  <select
                    value={spouseId}
                    onChange={(e) => setSpouseId(e.target.value)}
                    className="w-full p-2 border border-slate-200 rounded bg-white focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                  >
                    <option value="">None / Not Married</option>
                    {members.map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.firstName} {m.lastName} ({m.memberCode})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-700 mb-1">
                  Remera Parish Home Cell Fellowship
                </label>
                <input
                  type="text"
                  value={cellGroup}
                  onChange={(e) => setCellGroup(e.target.value)}
                  placeholder="e.g. Rukiri I Nazarene Home Cell"
                  className="w-full p-2 border border-slate-200 rounded focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-700 mb-1">
                  Street / House Address
                </label>
                <input
                  type="text"
                  value={streetAddress}
                  onChange={(e) => setStreetAddress(e.target.value)}
                  placeholder="e.g. KG 178 St, House 24"
                  className="w-full p-2 border border-slate-200 rounded focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                onClick={() => setIsFamilyModalOpen(false)}
                className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded"
              >
                {t('cancel')}
              </button>
              <button
                onClick={handleSaveFamily}
                className="px-4 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded transition-colors shadow-xs"
              >
                {t('save')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Link Member to Family Modal */}
      {isLinkMemberModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6 border border-slate-200 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900">
                Link Member to {selectedFamily?.familyName}
              </h3>
              <button
                onClick={() => setIsLinkMemberModalOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-[11px] font-medium text-slate-700 mb-1">
                  Select Unlinked Member
                </label>
                <select
                  value={memberToLink}
                  onChange={(e) => setMemberToLink(e.target.value)}
                  className="w-full p-2 border border-slate-200 rounded bg-white focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                >
                  <option value="">Choose Member...</option>
                  {unlinkedMembers.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.firstName} {m.lastName} ({m.memberCode})
                    </option>
                  ))}
                </select>
                {unlinkedMembers.length === 0 && (
                  <p className="text-[11px] text-slate-400 mt-1">
                    All members are currently linked to a family household.
                  </p>
                )}
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-700 mb-1">
                  Relationship / Role in Household
                </label>
                <select
                  value={linkRole}
                  onChange={(e) => setLinkRole(e.target.value as FamilyRole)}
                  className="w-full p-2 border border-slate-200 rounded bg-white focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                >
                  <option value="Child">Child (Son / Daughter)</option>
                  <option value="Dependent">Dependent / Relative</option>
                  <option value="Spouse">Spouse</option>
                  <option value="Other">Other Household Member</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                onClick={() => setIsLinkMemberModalOpen(false)}
                className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded"
              >
                {t('cancel')}
              </button>
              <button
                onClick={handleLinkMember}
                disabled={!memberToLink}
                className="px-4 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 rounded transition-colors shadow-xs"
              >
                Link to Household
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
