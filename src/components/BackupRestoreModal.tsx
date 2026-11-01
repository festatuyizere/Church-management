/**
 * Backup & Restore Modal Component
 * 1-click JSON database dump download, file upload restoration, and factory seed reset.
 */

import React, { useState } from 'react';
import { useChurchData } from '../context/ChurchDataContext';
import {
  Database,
  Download,
  Upload,
  RotateCcw,
  AlertTriangle,
  CheckCircle,
  X,
  ShieldCheck,
} from 'lucide-react';

interface BackupRestoreModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const BackupRestoreModal: React.FC<BackupRestoreModalProps> = ({ isOpen, onClose }) => {
  const {
    backupDatabase,
    restoreDatabase,
    resetToInitialData,
    members,
    families,
    auditLogs,
    t,
  } = useChurchData();

  const [restoreStatus, setRestoreStatus] = useState<{
    success: boolean;
    message: string;
  } | null>(null);

  if (!isOpen) return null;

  const handleDownloadBackup = () => {
    const jsonStr = backupDatabase();
    const encoded = encodeURI('data:application/json;charset=utf-8,' + jsonStr);
    const link = document.createElement('a');
    link.setAttribute('href', encoded);
    link.setAttribute(
      'download',
      `NFDMS_Backup_${new Date().toISOString().split('T')[0]}_${Date.now()}.json`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const res = restoreDatabase(content);
      if (res.success) {
        setRestoreStatus({
          success: true,
          message: `Successfully restored database! Loaded ${res.count} members.`,
        });
      } else {
        setRestoreStatus({
          success: false,
          message: res.error || 'Failed to restore database.',
        });
      }
    };
    reader.readAsText(file);
  };

  const handleResetSeed = () => {
    if (
      confirm(
        'Are you sure you want to restore the factory fictional seed dataset for Remera Parish? Any changes since last backup will be replaced.'
      )
    ) {
      resetToInitialData();
      setRestoreStatus({
        success: true,
        message: 'Database reset to original Remera Nazarene fictional seed records.',
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-xl max-w-lg w-full border border-slate-200 shadow-2xl overflow-hidden my-auto">
        
        {/* Header */}
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Database className="w-5 h-5 text-indigo-400" />
            <div>
              <h2 className="text-base font-bold tracking-tight text-white">
                {t('backupDb')} & {t('restoreDb')}
              </h2>
              <p className="text-xs text-slate-400">
                Data persistence, disaster recovery, and offline archives
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5 text-xs">
          
          {/* Current Stats */}
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-between">
            <div>
              <span className="font-bold text-slate-900 block">Database Footprint</span>
              <span className="text-[11px] text-slate-500">
                {members.length} members · {families.length} families · {auditLogs.length} audit logs
              </span>
            </div>
            <span className="text-[11px] font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              Healthy
            </span>
          </div>

          {/* Status Message */}
          {restoreStatus && (
            <div
              className={`p-3 rounded border flex items-start gap-2 ${
                restoreStatus.success
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                  : 'bg-rose-50 border-rose-200 text-rose-800'
              }`}
            >
              {restoreStatus.success ? (
                <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              ) : (
                <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              )}
              <span className="font-medium text-[11px]">{restoreStatus.message}</span>
            </div>
          )}

          {/* Option 1: Download Full Backup */}
          <div className="space-y-2">
            <h4 className="font-bold text-slate-900 text-xs">
              1. Download Full Database Backup (JSON)
            </h4>
            <p className="text-slate-500 text-[11px] leading-relaxed">
              Generates a snapshot containing all members, linked families, baptism dates, and audit trail logs.
            </p>
            <button
              onClick={handleDownloadBackup}
              className="flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded transition-colors shadow-xs"
            >
              <Download className="w-4 h-4" />
              <span>Download Backup File</span>
            </button>
          </div>

          {/* Option 2: Restore from Backup File */}
          <div className="space-y-2 pt-3 border-t border-slate-200">
            <h4 className="font-bold text-slate-900 text-xs">
              2. Restore Database from File
            </h4>
            <p className="text-slate-500 text-[11px] leading-relaxed">
              Upload a previously exported NFDMS backup JSON file to restore all records.
            </p>
            <label className="flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded cursor-pointer transition-colors border border-slate-300 w-fit">
              <Upload className="w-4 h-4 text-slate-600" />
              <span>Select Backup File to Restore</span>
              <input
                type="file"
                accept=".json"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>
          </div>

          {/* Option 3: Reset to Factory Seed Data */}
          <div className="space-y-2 pt-3 border-t border-slate-200">
            <h4 className="font-bold text-slate-900 text-xs">
              3. Factory Reset Seed Data
            </h4>
            <p className="text-slate-500 text-[11px] leading-relaxed">
              Replaces existing records with the default fictional Remera parish test data.
            </p>
            <button
              onClick={handleResetSeed}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-rose-600 hover:bg-rose-50 rounded transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset to Factory Fictional Seed</span>
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-slate-50 border-t border-slate-200 px-6 py-3 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-white rounded transition-colors"
          >
            {t('close')}
          </button>
        </div>
      </div>
    </div>
  );
};
