/**
 * Sidebar Navigation Component
 * Single-line links, clean typography, badge counters, role-aware visibility
 */

import React from 'react';
import { useChurchData } from '../context/ChurchDataContext';
import {
  LayoutDashboard,
  Users,
  Home,
  FileSpreadsheet,
  UploadCloud,
  History,
  Database,
  BookOpen,
  Church,
  Download,
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenBackupModal: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  onOpenBackupModal,
}) => {
  const { members, families, auditLogs, currentRole, t } = useChurchData();

  const navItems = [
    {
      id: 'dashboard',
      label: t('navDashboard'),
      icon: LayoutDashboard,
      badge: null,
      visible: true,
    },
    {
      id: 'members',
      label: t('navMembers'),
      icon: Users,
      badge: members.filter((m) => m.churchInfo.membershipStatus === 'Active').length,
      visible: true,
    },
    {
      id: 'reports',
      label: t('navReports'),
      icon: FileSpreadsheet,
      badge: null,
      visible: true,
    },
    {
      id: 'import',
      label: t('navImport'),
      icon: UploadCloud,
      badge: null,
      visible: currentRole === 'SUPER_ADMIN' || currentRole === 'DATA_ENTRY',
    },
    {
      id: 'audit',
      label: t('navAudit'),
      icon: History,
      badge: auditLogs.length,
      visible: currentRole === 'SUPER_ADMIN' || currentRole === 'DATA_ENTRY',
    },
    {
      id: 'database',
      label: t('navDatabase'),
      icon: Database,
      badge: null,
      visible: true,
    },
    {
      id: 'usermanual',
      label: t('navUserManual'),
      icon: BookOpen,
      badge: null,
      visible: true,
    },
  ];

  return (
    <aside className="w-64 bg-white border-r border-slate-200 shrink-0 flex flex-col justify-between h-[calc(100vh-4rem)] sticky top-16 select-none">
      <div className="py-4 px-3 space-y-1 overflow-y-auto">
        <div className="px-3 pb-2 text-[11px] font-semibold tracking-wider text-slate-600 uppercase">
          Church Management
        </div>

        {navItems
          .filter((item) => item.visible)
          .map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2 text-xs font-medium rounded-md transition-colors text-left ${
                  isActive
                    ? 'bg-indigo-50 text-indigo-900 font-semibold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-2.5 truncate">
                  <Icon
                    className={`w-4 h-4 shrink-0 ${
                      isActive ? 'text-indigo-600' : 'text-slate-400'
                    }`}
                  />
                  <span className="truncate">{item.label}</span>
                </div>
                {item.badge !== null && (
                  <span className="text-[11px] tabular-nums font-mono text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
      </div>

      {/* Parish Footer & Backup Quick Link */}
      <div className="p-3 border-t border-slate-200 bg-slate-50 space-y-2">
        <button
          onClick={onOpenBackupModal}
          className="w-full flex items-center justify-center gap-2 px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded hover:bg-slate-100 hover:text-slate-900 transition-colors shadow-2xs"
        >
          <Download className="w-3.5 h-3.5 text-indigo-600" />
          <span>{t('backupDb')} / {t('restoreDb')}</span>
        </button>

        <div className="pt-2 px-1 flex items-start gap-2 text-[11px] text-slate-600">
          <Church className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
          <div className="leading-tight">
            <p className="font-semibold text-slate-700">Remera Parish</p>
            <p className="text-slate-600 text-[10px]">KG 178 St · Gasabo, Kigali</p>
          </div>
        </div>
      </div>
    </aside>
  );
};
