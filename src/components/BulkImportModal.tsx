/**
 * Bulk Import Modal Component
 * Excel / CSV bulk data upload with validation, duplicate detection, and sample template download.
 */

import React, { useState } from 'react';
import { useChurchData } from '../context/ChurchDataContext';
import {
  UploadCloud,
  FileSpreadsheet,
  Download,
  AlertTriangle,
  CheckCircle,
  X,
  FileText,
} from 'lucide-react';

interface BulkImportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const BulkImportModal: React.FC<BulkImportModalProps> = ({ isOpen, onClose }) => {
  const { importMembersBulk, t } = useChurchData();

  const [csvText, setCsvText] = useState('');
  const [importResult, setImportResult] = useState<{
    successCount: number;
    errors: string[];
  } | null>(null);

  if (!isOpen) return null;

  // Sample CSV template content
  const sampleCsvContent = `firstName,lastName,gender,dateOfBirth,nationalId,phone,maritalStatus,occupation,educationLevel,province,district,sector,cell,village,fatherName,motherName,emergencyName,emergencyPhone,isBaptized
Emmanuel,Tuyishime,Male,1994-05-12,1199480076543021,+250 788 111 222,Married,Accountant,Bachelor's,Kigali City,Gasabo,Remera,Rukiri I,Amahoro,Joseph Tuyishime,Colette Mukandori,Clarisse Uwera,+250 788 333 444,true
Clarisse,Uwera,Female,1996-09-18,1199670087654032,+250 788 333 444,Married,Nurse,Bachelor's,Kigali City,Gasabo,Remera,Rukiri I,Amahoro,Jean Rurangwa,Beata Mukamurenzi,Emmanuel Tuyishime,+250 788 111 222,true
Gisele,Niyonsaba,Female,2002-12-04,1200270098765043,+250 788 555 666,Single,Student,Secondary (A-Level / TVET),Kigali City,Gasabo,Remera,Rukiri II,Inyange,Antoine Niyonsaba,Esperance Mukankusi,Antoine Niyonsaba,+250 788 777 888,false`;

  const handleDownloadTemplate = () => {
    const encoded = encodeURI('data:text/csv;charset=utf-8,' + sampleCsvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encoded);
    link.setAttribute('download', 'NFDMS_Member_Import_Template.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleLoadSample = () => {
    setCsvText(sampleCsvContent);
    setImportResult(null);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      setCsvText(text);
      setImportResult(null);
    };
    reader.readAsText(file);
  };

  const handleProcessImport = () => {
    if (!csvText.trim()) return;

    const lines = csvText.trim().split(/\r\n|\n/);
    if (lines.length < 2) {
      setImportResult({
        successCount: 0,
        errors: ['CSV must contain at least a header row and one data row.'],
      });
      return;
    }

    const headers = lines[0].split(',').map((h) => h.trim().replace(/^"|"$/g, ''));
    const parsedRows = [];

    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;

      // Handle CSV with commas
      const values = line.split(',').map((v) => v.trim().replace(/^"|"$/g, ''));
      const rowObj: any = {};
      headers.forEach((h, index) => {
        rowObj[h] = values[index] || '';
      });
      parsedRows.push(rowObj);
    }

    const result = importMembersBulk(parsedRows);
    setImportResult(result);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-xl max-w-2xl w-full border border-slate-200 shadow-2xl overflow-hidden my-auto">
        
        {/* Header */}
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <UploadCloud className="w-5 h-5 text-indigo-400" />
            <div>
              <h2 className="text-base font-bold tracking-tight text-white">
                {t('navImport')}
              </h2>
              <p className="text-xs text-slate-400">
                Bulk upload church members from CSV / Excel with Rwandan validation
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
        <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto text-xs">
          
          {/* Action Row: Template & Sample */}
          <div className="flex flex-wrap items-center justify-between gap-2 p-3 bg-slate-50 border border-slate-200 rounded-lg">
            <div className="flex items-center gap-2">
              <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
              <span className="font-semibold text-slate-800">CSV Template</span>
              <span className="text-slate-400">·</span>
              <span className="text-slate-500">Includes all NFDMS required fields</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleLoadSample}
                className="px-2.5 py-1 text-slate-700 bg-white border border-slate-300 hover:bg-slate-100 rounded font-medium shadow-2xs"
              >
                Paste Fictional Sample
              </button>
              <button
                type="button"
                onClick={handleDownloadTemplate}
                className="flex items-center gap-1 px-3 py-1 bg-indigo-600 hover:bg-indigo-500 text-white rounded font-medium shadow-2xs"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download Template</span>
              </button>
            </div>
          </div>

          {/* File Upload Dropzone */}
          <div>
            <label className="block text-[11px] font-medium text-slate-700 mb-1">
              Select CSV File from Computer:
            </label>
            <input
              type="file"
              accept=".csv"
              onChange={handleFileUpload}
              className="w-full text-xs text-slate-500 file:mr-3 file:py-1.5 file:px-3 file:rounded file:border-0 file:text-xs file:font-semibold file:bg-slate-100 file:text-slate-700 hover:file:bg-slate-200 cursor-pointer border border-slate-200 rounded p-1"
            />
          </div>

          {/* Direct CSV Textarea */}
          <div>
            <label className="block text-[11px] font-medium text-slate-700 mb-1">
              Or paste CSV data directly:
            </label>
            <textarea
              value={csvText}
              onChange={(e) => {
                setCsvText(e.target.value);
                setImportResult(null);
              }}
              rows={8}
              placeholder="firstName,lastName,gender,dateOfBirth,nationalId,phone,maritalStatus..."
              className="w-full p-2.5 border border-slate-200 rounded font-mono text-[11px] focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          {/* Validation & Duplicate Detection Results */}
          {importResult && (
            <div className="space-y-3 pt-2">
              {importResult.successCount > 0 && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded flex items-center gap-2 text-emerald-800">
                  <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span className="font-semibold">
                    Successfully imported {importResult.successCount} new church member(s)!
                  </span>
                </div>
              )}

              {importResult.errors.length > 0 && (
                <div className="p-3 bg-amber-50 border border-amber-200 rounded space-y-1.5 text-amber-900">
                  <div className="flex items-center gap-1.5 font-bold text-xs text-amber-800">
                    <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                    <span>
                      {importResult.errors.length} Record(s) Skipped (Validation & Duplicate Checks):
                    </span>
                  </div>
                  <ul className="list-disc list-inside space-y-0.5 text-[11px] text-amber-800 max-h-32 overflow-y-auto pl-1">
                    {importResult.errors.map((err, idx) => (
                      <li key={idx}>{err}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-slate-50 border-t border-slate-200 px-6 py-3 flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-3 py-1.5 text-xs text-slate-600 hover:text-slate-800"
          >
            {t('close')}
          </button>
          <button
            onClick={handleProcessImport}
            disabled={!csvText.trim()}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 rounded transition-colors shadow-xs"
          >
            <UploadCloud className="w-3.5 h-3.5" />
            <span>Validate & Import Records</span>
          </button>
        </div>
      </div>
    </div>
  );
};
