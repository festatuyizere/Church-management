/**
 * Reports & Export Hub Component
 * Member lists, baptism reports, marital status summaries, and birthday lists.
 * Exportable to Excel/CSV and formatted printable PDF view with Remera parish letterhead.
 */

import React, { useState } from 'react';
import { useChurchData } from '../context/ChurchDataContext';
import { calculateAge, maskNationalId } from '../utils/validation';
import {
  FileSpreadsheet,
  Printer,
  Download,
  Calendar,
  Droplets,
  Heart,
  Users,
  ShieldCheck,
  Church,
} from 'lucide-react';

type ReportType =
  | 'MEMBER_DIRECTORY'
  | 'BAPTISM_REPORT'
  | 'MARITAL_SUMMARY'
  | 'BIRTHDAY_LIST'
  | 'MINISTRY_ROSTER';

export const ReportsHub: React.FC = () => {
  const { members, ministries, families, currentRole, logAuditAction, t } = useChurchData();

  const [activeReport, setActiveReport] = useState<ReportType>('MEMBER_DIRECTORY');
  const [selectedMonth, setSelectedMonth] = useState<number>(new Date().getMonth() + 1);
  const [selectedMinistryId, setSelectedMinistryId] = useState<string>('ALL');

  // Filtered members for report
  const reportData = React.useMemo(() => {
    switch (activeReport) {
      case 'MEMBER_DIRECTORY':
        return members.filter((m) => m.churchInfo.membershipStatus === 'Active');

      case 'BAPTISM_REPORT':
        return members.sort((a, b) => {
          if (a.churchInfo.baptism.isBaptized === b.churchInfo.baptism.isBaptized) return 0;
          return a.churchInfo.baptism.isBaptized ? -1 : 1;
        });

      case 'MARITAL_SUMMARY':
        return members;

      case 'BIRTHDAY_LIST':
        return members.filter((m) => {
          if (!m.dateOfBirth) return false;
          const month = parseInt(m.dateOfBirth.split('-')[1], 10);
          return month === selectedMonth;
        });

      case 'MINISTRY_ROSTER':
        if (selectedMinistryId === 'ALL') return members;
        return members.filter((m) => m.churchInfo.ministryId === selectedMinistryId);

      default:
        return members;
    }
  }, [members, activeReport, selectedMonth, selectedMinistryId]);

  // Export CSV Handler
  const handleExportCsv = () => {
    let csvContent = 'data:text/csv;charset=utf-8,';
    let headers: string[] = [];
    let rows: string[][] = [];

    if (activeReport === 'MEMBER_DIRECTORY') {
      headers = [
        'Member ID',
        'First Name',
        'Last Name',
        'Gender',
        'Date of Birth',
        'Age',
        'Phone',
        'Province',
        'District',
        'Sector',
        'Cell',
        'Village',
        'Ministry',
        'Church Role',
        'Status',
      ];
      rows = reportData.map((m) => {
        const { age } = calculateAge(m.dateOfBirth);
        const min = ministries.find((mi) => mi.id === m.churchInfo.ministryId);
        return [
          m.memberCode,
          `"${m.firstName}"`,
          `"${m.lastName}"`,
          m.gender,
          m.dateOfBirth,
          String(age),
          `"${m.phone}"`,
          `"${m.address.province}"`,
          `"${m.address.district}"`,
          `"${m.address.sector}"`,
          `"${m.address.cell}"`,
          `"${m.address.village}"`,
          `"${min?.name || ''}"`,
          `"${m.churchInfo.churchRole}"`,
          m.churchInfo.membershipStatus,
        ];
      });
    } else if (activeReport === 'BAPTISM_REPORT') {
      headers = [
        'Member ID',
        'Full Name',
        'Gender',
        'Baptism Status',
        'Baptism Date',
        'Baptism Place',
        'Officiating Pastor',
        'Certificate Number',
      ];
      rows = reportData.map((m) => [
        m.memberCode,
        `"${m.firstName} ${m.lastName}"`,
        m.gender,
        m.churchInfo.baptism.isBaptized ? 'Baptized (Immersion)' : 'Not Yet Baptized',
        m.churchInfo.baptism.baptismDate || '—',
        `"${m.churchInfo.baptism.baptismPlace || ''}"`,
        `"${m.churchInfo.baptism.baptizingPastor || ''}"`,
        m.churchInfo.baptism.certificateNumber || '—',
      ]);
    } else if (activeReport === 'BIRTHDAY_LIST') {
      headers = ['Member ID', 'Full Name', 'Birth Date', 'Birth Day/Month', 'Age', 'Phone', 'Sector', 'Cell'];
      rows = reportData.map((m) => {
        const { age } = calculateAge(m.dateOfBirth);
        const parts = m.dateOfBirth.split('-');
        return [
          m.memberCode,
          `"${m.firstName} ${m.lastName}"`,
          m.dateOfBirth,
          `${parts[2]}/${parts[1]}`,
          String(age),
          `"${m.phone}"`,
          `"${m.address.sector}"`,
          `"${m.address.cell}"`,
        ];
      });
    } else {
      headers = ['Member ID', 'Full Name', 'Marital Status', 'Spouse', 'Phone', 'Address', 'Role'];
      rows = reportData.map((m) => [
        m.memberCode,
        `"${m.firstName} ${m.lastName}"`,
        m.maritalStatus,
        `"${m.spouseName || ''}"`,
        `"${m.phone}"`,
        `"${m.address.sector}, ${m.address.cell}"`,
        `"${m.churchInfo.churchRole}"`,
      ]);
    }

    csvContent += headers.join(',') + '\r\n';
    rows.forEach((row) => {
      csvContent += row.join(',') + '\r\n';
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `NFDMS_${activeReport}_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    logAuditAction(
      'EXPORT_REPORT',
      'Report',
      `rep-${activeReport.toLowerCase()}`,
      activeReport,
      `Exported ${activeReport} containing ${reportData.length} records to CSV.`
    );
  };

  const handlePrint = () => {
    logAuditAction(
      'EXPORT_REPORT',
      'Report',
      `rep-${activeReport.toLowerCase()}`,
      activeReport,
      `Printed official parish report: ${activeReport}.`
    );
    window.print();
  };

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  return (
    <div className="space-y-4 max-w-7xl mx-auto pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-3 border-b border-slate-200">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900">
            {t('navReports')}
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Church registries, sacramental records, demographic summaries, and printable parish rosters.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCsv}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded hover:bg-slate-50 transition-colors shadow-2xs"
          >
            <Download className="w-3.5 h-3.5 text-emerald-600" />
            <span>{t('exportExcel')}</span>
          </button>
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded transition-colors shadow-xs"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>{t('exportPdf')}</span>
          </button>
        </div>
      </div>

      {/* Report Selection Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 overflow-x-auto pb-2 text-xs">
        {[
          { id: 'MEMBER_DIRECTORY', label: '1. Member Directory', icon: Users },
          { id: 'BAPTISM_REPORT', label: '2. Baptism & Sacraments', icon: Droplets },
          { id: 'MARITAL_SUMMARY', label: '3. Marital & Household', icon: Heart },
          { id: 'BIRTHDAY_LIST', label: '4. Birthday Follow-Up', icon: Calendar },
          { id: 'MINISTRY_ROSTER', label: '5. Ministry Rosters', icon: Church },
        ].map((rep) => {
          const Icon = rep.icon;
          const isActive = activeReport === rep.id;
          return (
            <button
              key={rep.id}
              onClick={() => setActiveReport(rep.id as ReportType)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-md font-medium transition-colors whitespace-nowrap ${
                isActive
                  ? 'bg-slate-900 text-white shadow-2xs'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{rep.label}</span>
            </button>
          );
        })}
      </div>

      {/* Sub-Filters for Specific Reports */}
      {activeReport === 'BIRTHDAY_LIST' && (
        <div className="flex items-center gap-2 p-3 bg-white rounded-lg border border-slate-200 text-xs">
          <span className="font-semibold text-slate-700">Filter by Month:</span>
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(parseInt(e.target.value, 10))}
            className="bg-slate-50 border border-slate-200 rounded px-2.5 py-1 text-xs font-medium focus:outline-none focus:ring-1 focus:ring-indigo-500"
          >
            {months.map((m, idx) => (
              <option key={m} value={idx + 1}>
                {m}
              </option>
            ))}
          </select>
          <span className="text-slate-400 font-mono text-[11px]">
            ({reportData.length} member birthdays in {months[selectedMonth - 1]})
          </span>
        </div>
      )}

      {activeReport === 'MINISTRY_ROSTER' && (
        <div className="flex items-center gap-2 p-3 bg-white rounded-lg border border-slate-200 text-xs">
          <span className="font-semibold text-slate-700">Select Department:</span>
          <select
            value={selectedMinistryId}
            onChange={(e) => setSelectedMinistryId(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded px-2.5 py-1 text-xs font-medium focus:outline-none focus:ring-1 focus:ring-indigo-500"
          >
            <option value="ALL">All Ministries & Congregational Rolls</option>
            {ministries.map((min) => (
              <option key={min.id} value={min.id}>
                {min.name}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Official Report Container (Styled for Screen & Clean Print View) */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-2xs p-6 print:border-none print:shadow-none print:p-0">
        
        {/* Official Church Letterhead */}
        <div className="text-center pb-6 mb-6 border-b-2 border-slate-800">
          <div className="inline-block p-1.5 rounded-full bg-slate-900 text-white mb-2">
            <Church className="w-6 h-6" />
          </div>
          <h2 className="text-lg font-bold text-slate-900 tracking-tight uppercase">
            Church of the Nazarene · Remera Parish
          </h2>
          <p className="text-xs text-slate-500">
            Gasabo District · Kigali City, Rwanda · KG 178 St
          </p>
          <div className="mt-3 inline-block px-4 py-1 bg-slate-100 rounded text-xs font-bold text-slate-800 uppercase tracking-wider">
            {activeReport.replace(/_/g, ' ')}
          </div>
          <div className="mt-2 text-[11px] text-slate-400 flex items-center justify-center gap-3">
            <span>Generated: {new Date().toLocaleDateString()}</span>
            <span>·</span>
            <span>Total Records: <strong className="font-mono text-slate-700">{reportData.length}</strong></span>
            <span>·</span>
            <span className="text-emerald-700 font-medium flex items-center gap-1">
              <ShieldCheck className="w-3 h-3" /> Law 058/2021 Compliant
            </span>
          </div>
        </div>

        {/* Report Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-[11px] font-semibold text-slate-600 uppercase">
                <th className="py-2 px-3">#</th>
                <th className="py-2 px-3">Code</th>
                <th className="py-2 px-3">Full Name</th>
                {activeReport === 'BAPTISM_REPORT' ? (
                  <>
                    <th className="py-2 px-3">Baptism Status</th>
                    <th className="py-2 px-3">Date</th>
                    <th className="py-2 px-3">Baptizing Pastor</th>
                    <th className="py-2 px-3">Certificate #</th>
                  </>
                ) : activeReport === 'BIRTHDAY_LIST' ? (
                  <>
                    <th className="py-2 px-3">Day / Month</th>
                    <th className="py-2 px-3">Age</th>
                    <th className="py-2 px-3">Phone</th>
                    <th className="py-2 px-3">Address</th>
                  </>
                ) : activeReport === 'MARITAL_SUMMARY' ? (
                  <>
                    <th className="py-2 px-3">Marital Status</th>
                    <th className="py-2 px-3">Spouse Name</th>
                    <th className="py-2 px-3">Phone</th>
                    <th className="py-2 px-3">Location</th>
                  </>
                ) : (
                  <>
                    <th className="py-2 px-3">Gender / Age</th>
                    <th className="py-2 px-3">Phone</th>
                    <th className="py-2 px-3">Location (Sector/Cell)</th>
                    <th className="py-2 px-3">Ministry & Role</th>
                  </>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {reportData.map((m, idx) => {
                const { age } = calculateAge(m.dateOfBirth);
                const min = ministries.find((mi) => mi.id === m.churchInfo.ministryId);
                const parts = m.dateOfBirth.split('-');

                return (
                  <tr key={m.id} className="hover:bg-slate-50">
                    <td className="py-2 px-3 font-mono text-slate-400 text-[11px]">
                      {idx + 1}
                    </td>
                    <td className="py-2 px-3 font-mono font-medium text-slate-700 whitespace-nowrap">
                      {m.memberCode}
                    </td>
                    <td className="py-2 px-3 font-semibold text-slate-900 whitespace-nowrap">
                      {m.firstName} {m.lastName}
                    </td>

                    {activeReport === 'BAPTISM_REPORT' ? (
                      <>
                        <td className="py-2 px-3">
                          {m.churchInfo.baptism.isBaptized ? (
                            <span className="text-sky-700 font-semibold flex items-center gap-1">
                              <Droplets className="w-3 h-3 text-sky-500" /> Baptized
                            </span>
                          ) : (
                            <span className="text-slate-400">Not Baptized</span>
                          )}
                        </td>
                        <td className="py-2 px-3 font-mono text-slate-700">
                          {m.churchInfo.baptism.baptismDate || '—'}
                        </td>
                        <td className="py-2 px-3 text-slate-700">
                          {m.churchInfo.baptism.baptizingPastor || '—'}
                        </td>
                        <td className="py-2 px-3 font-mono text-slate-700">
                          {m.churchInfo.baptism.certificateNumber || '—'}
                        </td>
                      </>
                    ) : activeReport === 'BIRTHDAY_LIST' ? (
                      <>
                        <td className="py-2 px-3 font-mono font-bold text-indigo-700">
                          {parts[2]} {months[parseInt(parts[1], 10) - 1]}
                        </td>
                        <td className="py-2 px-3 font-mono text-slate-700">
                          {age} yrs
                        </td>
                        <td className="py-2 px-3 font-mono text-slate-700 whitespace-nowrap">
                          {m.phone}
                        </td>
                        <td className="py-2 px-3 text-slate-600">
                          {m.address.sector}, {m.address.cell}
                        </td>
                      </>
                    ) : activeReport === 'MARITAL_SUMMARY' ? (
                      <>
                        <td className="py-2 px-3 font-medium text-slate-800">
                          {m.maritalStatus}
                        </td>
                        <td className="py-2 px-3 text-slate-700">
                          {m.spouseName || '—'}
                        </td>
                        <td className="py-2 px-3 font-mono text-slate-700 whitespace-nowrap">
                          {m.phone}
                        </td>
                        <td className="py-2 px-3 text-slate-600">
                          {m.address.sector}, {m.address.cell}
                        </td>
                      </>
                    ) : (
                      <>
                        <td className="py-2 px-3 text-slate-700">
                          {m.gender} · {age}y
                        </td>
                        <td className="py-2 px-3 font-mono text-slate-700 whitespace-nowrap">
                          {m.phone}
                        </td>
                        <td className="py-2 px-3 text-slate-600">
                          {m.address.sector}, {m.address.cell}
                        </td>
                        <td className="py-2 px-3 text-slate-700">
                          {min?.name || 'General'} ({m.churchInfo.churchRole})
                        </td>
                      </>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Report Sign-Off Section (for official church records) */}
        <div className="mt-8 pt-6 border-t border-slate-200 hidden print:grid grid-cols-2 gap-8 text-xs">
          <div>
            <p className="font-semibold text-slate-800">Prepared by:</p>
            <div className="mt-8 border-b border-slate-300 w-48"></div>
            <p className="text-slate-500 mt-1">Church Secretary / Data Officer</p>
          </div>
          <div className="text-right">
            <p className="font-semibold text-slate-800">Approved by:</p>
            <div className="mt-8 border-b border-slate-300 w-48 ml-auto"></div>
            <p className="text-slate-500 mt-1">Senior Pastor, Remera Parish</p>
          </div>
        </div>
      </div>
    </div>
  );
};
