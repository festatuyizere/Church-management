/**
 * Audit Logs View Component
 * Complete regulatory audit trail recording who created, viewed, edited, unmasked, deactivated, or exported any record.
 * Compliance with Rwanda Law No. 058/2021 on Personal Data Protection & Privacy.
 */

import React, { useState, useMemo } from 'react';
import { useChurchData } from '../context/ChurchDataContext';
import { AuditAction } from '../types';
import {
  History,
  Search,
  Filter,
  Download,
  ShieldCheck,
  Eye,
  UserPlus,
  Edit2,
  Trash2,
  FileSpreadsheet,
  Database,
  Lock,
} from 'lucide-react';

export const AuditLogsView: React.FC = () => {
  const { auditLogs, t } = useChurchData();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAction, setSelectedAction] = useState<string>('ALL');

  const filteredLogs = useMemo(() => {
    return auditLogs.filter((log) => {
      if (selectedAction !== 'ALL' && log.action !== selectedAction) {
        return false;
      }
      if (searchTerm.trim()) {
        const q = searchTerm.toLowerCase();
        return (
          log.userName.toLowerCase().includes(q) ||
          log.entityName.toLowerCase().includes(q) ||
          log.details.toLowerCase().includes(q) ||
          log.action.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [auditLogs, searchTerm, selectedAction]);

  const handleExportAuditCsv = () => {
    let csv = 'data:text/csv;charset=utf-8,';
    csv += 'Timestamp,User,Role,Action,Entity Type,Entity Name,Details\r\n';
    filteredLogs.forEach((l) => {
      csv += `"${l.timestamp}","${l.userName}","${l.userRole}","${l.action}","${l.entityType}","${l.entityName}","${l.details.replace(/"/g, '""')}"\r\n`;
    });

    const encoded = encodeURI(csv);
    const link = document.createElement('a');
    link.setAttribute('href', encoded);
    link.setAttribute('download', `NFDMS_Audit_Trail_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getActionBadge = (action: AuditAction) => {
    switch (action) {
      case 'CREATE_MEMBER':
      case 'CREATE_FAMILY':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">
            <UserPlus className="w-3 h-3" />
            <span>CREATE</span>
          </span>
        );
      case 'UPDATE_MEMBER':
      case 'UPDATE_FAMILY':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-100">
            <Edit2 className="w-3 h-3" />
            <span>UPDATE</span>
          </span>
        );
      case 'DEACTIVATE_MEMBER':
      case 'DELETE_FAMILY':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-100">
            <Trash2 className="w-3 h-3" />
            <span>DEACTIVATE</span>
          </span>
        );
      case 'UNMASK_NID':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-purple-700 bg-purple-50 px-2 py-0.5 rounded border border-purple-100">
            <Lock className="w-3 h-3" />
            <span>UNMASK NID</span>
          </span>
        );
      case 'EXPORT_REPORT':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-sky-700 bg-sky-50 px-2 py-0.5 rounded border border-sky-100">
            <FileSpreadsheet className="w-3 h-3" />
            <span>EXPORT</span>
          </span>
        );
      case 'BACKUP_DATABASE':
      case 'RESTORE_DATABASE':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100">
            <Database className="w-3 h-3" />
            <span>BACKUP / RESTORE</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center text-[11px] font-medium text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
            {action}
          </span>
        );
    }
  };

  return (
    <div className="space-y-4 max-w-7xl mx-auto pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-3 border-b border-slate-200">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900">
            {t('navAudit')}
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Immutable regulatory audit trail mandated by Rwanda Law No. 058/2021 on Personal Data Protection.
          </p>
        </div>

        <button
          onClick={handleExportAuditCsv}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded hover:bg-slate-50 transition-colors shadow-2xs"
        >
          <Download className="w-3.5 h-3.5 text-emerald-600" />
          <span>Export Audit Log (CSV)</span>
        </button>
      </div>

      {/* Regulatory Banner */}
      <div className="p-3.5 bg-slate-900 text-white rounded-lg flex items-start gap-3 shadow-2xs">
        <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
        <div className="text-xs space-y-0.5">
          <p className="font-semibold text-slate-100">
            Law No. 058/2021 Regulatory Compliance Engine
          </p>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            Every access, update, soft-delete, National ID unmasking, and report download is timestamped with the actor's system role. Church members retain the right under Article 28 to inspect processing logs of their records.
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-3 rounded-lg border border-slate-200 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search audit events, users, or targets..."
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded text-xs focus:ring-1 focus:ring-indigo-500 focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs text-slate-500 font-medium">Action:</span>
          <select
            value={selectedAction}
            onChange={(e) => setSelectedAction(e.target.value)}
            className="text-xs bg-slate-50 border border-slate-200 rounded px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          >
            <option value="ALL">All Actions</option>
            <option value="CREATE_MEMBER">Create Member</option>
            <option value="UPDATE_MEMBER">Update Member</option>
            <option value="DEACTIVATE_MEMBER">Deactivate Member</option>
            <option value="UNMASK_NID">Unmask National ID</option>
            <option value="CREATE_FAMILY">Create Family</option>
            <option value="EXPORT_REPORT">Export Report</option>
            <option value="BACKUP_DATABASE">Backup Database</option>
            <option value="RESTORE_DATABASE">Restore Database</option>
          </select>
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                <th className="py-2.5 px-3">Timestamp</th>
                <th className="py-2.5 px-3">User & Role</th>
                <th className="py-2.5 px-3">Action Type</th>
                <th className="py-2.5 px-3">Target Entity</th>
                <th className="py-2.5 px-3">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-2.5 px-3 font-mono tabular-nums text-slate-500 whitespace-nowrap text-[11px]">
                    {new Date(log.timestamp).toLocaleString()}
                  </td>
                  <td className="py-2.5 px-3 whitespace-nowrap">
                    <span className="font-semibold text-slate-900 block">{log.userName}</span>
                    <span className="text-[10px] text-slate-400 font-mono">{log.userRole}</span>
                  </td>
                  <td className="py-2.5 px-3 whitespace-nowrap">
                    {getActionBadge(log.action)}
                  </td>
                  <td className="py-2.5 px-3 whitespace-nowrap font-medium text-slate-800">
                    {log.entityName}
                    <span className="text-[10px] text-slate-400 block font-normal font-mono">
                      {log.entityType}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-slate-600 leading-relaxed text-[11px]">
                    {log.details}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
