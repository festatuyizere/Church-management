/**
 * Nazarene Family Data Management System (NFDMS)
 * Church of the Nazarene, Remera (Kigali, Rwanda)
 * Main Application Component
 */

import React, { useState } from 'react';
import { ChurchDataProvider, useChurchData } from './context/ChurchDataContext';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { MembersDirectory } from './components/MembersDirectory';
import { MemberProfileModal } from './components/MemberProfileModal';
import { MemberFormWizardModal } from './components/MemberFormWizardModal';
import { ReportsHub } from './components/ReportsHub';
import { BulkImportModal } from './components/BulkImportModal';
import { AuditLogsView } from './components/AuditLogsView';
import { DatabaseErdView } from './components/DatabaseErdView';
import { UserManualView } from './components/UserManualView';
import { BackupRestoreModal } from './components/BackupRestoreModal';
import { PublicMemberRegistrationPortal } from './components/PublicMemberRegistrationPortal';
import { StaffSecurityLogin } from './components/StaffSecurityLogin';
import { ShareLinkModal } from './components/ShareLinkModal';
import { Member } from './types';

const MainLayout: React.FC = () => {
  const { portalView, setPortalView, isAuthenticated } = useChurchData();
  const [activeTab, setActiveTab] = useState<string>('dashboard');

  // Modals state
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [memberToEdit, setMemberToEdit] = useState<Member | null>(null);
  const [selectedMemberId, setSelectedMemberId] = useState<string | null>(null);
  const [isBackupModalOpen, setIsBackupModalOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  // 1. PUBLIC MEMBER REGISTRATION PORTAL (via Shareable Link)
  if (portalView === 'public_register') {
    return <PublicMemberRegistrationPortal />;
  }

  // 2. CHURCH LEADERSHIP SECURITY LOGIN GATE
  // If not authenticated as church staff (Registrar / Secretary), block access to database management
  if (!isAuthenticated) {
    return (
      <StaffSecurityLogin
        onBackToMemberForm={() => setPortalView('public_register')}
      />
    );
  }

  // 3. AUTHENTICATED DATABASE MANAGEMENT SYSTEM
  const handleOpenRegister = () => {
    setMemberToEdit(null);
    setIsRegisterModalOpen(true);
  };

  const handleEditMember = (member: Member) => {
    setMemberToEdit(member);
    setIsRegisterModalOpen(true);
  };

  const handleSelectMember = (memberId: string) => {
    setSelectedMemberId(memberId);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900 selection:bg-indigo-100 selection:text-indigo-900">
      {/* Top Bar Header */}
      <Header
        activeTab={activeTab}
        onOpenRegisterModal={handleOpenRegister}
        onOpenBackupModal={() => setIsBackupModalOpen(true)}
        onOpenShareModal={() => setIsShareModalOpen(true)}
      />

      {/* Workspace Area: Sidebar + Main Content Viewport */}
      <div className="flex-1 flex max-w-[1600px] w-full mx-auto">
        <Sidebar
          activeTab={activeTab}
          setActiveTab={(tab) => {
            if (tab === 'import') {
              setIsImportModalOpen(true);
            } else {
              setActiveTab(tab);
            }
          }}
          onOpenBackupModal={() => setIsBackupModalOpen(true)}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          {activeTab === 'dashboard' && (
            <Dashboard
              onNavigate={(tab) => setActiveTab(tab)}
              onOpenRegisterModal={handleOpenRegister}
              onSelectMember={handleSelectMember}
            />
          )}

          {activeTab === 'members' && (
            <MembersDirectory
              onSelectMember={handleSelectMember}
              onEditMember={handleEditMember}
              onOpenRegisterModal={handleOpenRegister}
              onExportReports={() => setActiveTab('reports')}
              onOpenShareModal={() => setIsShareModalOpen(true)}
            />
          )}

          {activeTab === 'reports' && <ReportsHub />}

          {activeTab === 'audit' && <AuditLogsView />}

          {activeTab === 'database' && <DatabaseErdView />}

          {activeTab === 'usermanual' && <UserManualView />}
        </main>
      </div>

      {/* Member Registration & Edit Wizard Modal (Staff direct entry) */}
      <MemberFormWizardModal
        isOpen={isRegisterModalOpen}
        onClose={() => {
          setIsRegisterModalOpen(false);
          setMemberToEdit(null);
        }}
        memberToEdit={memberToEdit}
      />

      {/* Member Profile Detail Modal */}
      <MemberProfileModal
        memberId={selectedMemberId}
        onClose={() => setSelectedMemberId(null)}
        onEdit={(member) => {
          setSelectedMemberId(null);
          handleEditMember(member);
        }}
        onSelectMember={(newId) => setSelectedMemberId(newId)}
      />

      {/* Bulk CSV Import Modal */}
      <BulkImportModal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
      />

      {/* Backup & Restore Database Modal */}
      <BackupRestoreModal
        isOpen={isBackupModalOpen}
        onClose={() => setIsBackupModalOpen(false)}
      />

      {/* Share Member Registration Link Modal */}
      <ShareLinkModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
      />
    </div>
  );
};

export default function App() {
  return (
    <ChurchDataProvider>
      <MainLayout />
    </ChurchDataProvider>
  );
}
