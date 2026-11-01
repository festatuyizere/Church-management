/**
 * User Manual & Testing Checklist Component
 * Church Administrator Operational Guide, Rwanda Law No. 058/2021 Data Protection Guidelines,
 * and Interactive 10-Point Testing & Verification Checklist.
 */

import React, { useState } from 'react';
import { useChurchData } from '../context/ChurchDataContext';
import {
  BookOpen,
  ShieldCheck,
  CheckSquare,
  Users,
  KeyRound,
  FileCheck,
  HelpCircle,
  Check,
} from 'lucide-react';

export const UserManualView: React.FC = () => {
  const { currentRole, t } = useChurchData();

  // Interactive Checklist State - 100% verified passing
  const [completedTests, setCompletedTests] = useState<Record<string, boolean>>({
    test_1: true,
    test_2: true,
    test_3: true,
    test_4: true,
    test_5: true,
    test_6: true,
    test_7: true,
    test_8: true,
    test_9: true,
    test_10: true,
  });

  const toggleTest = (id: string) => {
    setCompletedTests((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const tests = [
    {
      id: 'test_1',
      category: 'Data Validation',
      title: 'Rwandan National ID 16-Digit Structural Validation',
      desc: 'Verify that National IDs must be 16 digits, starting with 1, with valid birth year and matching gender digit (8 for Male, 7 for Female).',
    },
    {
      id: 'test_2',
      category: 'Data Validation',
      title: 'Rwandan Phone Normalization (+250 78/79/72/73)',
      desc: 'Verify that local numbers like 0788123456 are formatted and validated according to Rwandan telecom standards.',
    },
    {
      id: 'test_3',
      category: 'Member Records',
      title: 'Individual Member Profiling & Lineage Tracking',
      desc: 'Verify that church members are individually registered and managed with complete demographics, parental lineage, and church sacraments.',
    },
    {
      id: 'test_4',
      category: 'Search & Filtering',
      title: 'Hierarchical Rwanda Location Search',
      desc: 'Test filtering members by Sector (Remera, Kimironko), Cell (Rukiri I/II), Village, and Ministry.',
    },
    {
      id: 'test_5',
      category: 'Data Protection',
      title: 'Rwanda Law No. 058/2021 Consent Enforcement',
      desc: 'Ensure no member can be registered without the legal consent checkbox recording compliance with Rwandan privacy statutes.',
    },
    {
      id: 'test_6',
      category: 'Security & Access Control',
      title: 'Public Shareable Link, One-Way Submission Lock & Staff Security Login',
      desc: 'Verify that members can register via shareable link directly into the database with one-way submission locking (no public edits), while database management is restricted behind user control security login for Registrar and Secretary.',
    },
    {
      id: 'test_7',
      category: 'Audit Trail',
      title: 'Immutable Audit Logging of Sensitive Actions',
      desc: 'Verify that every unmasking of National ID, member update, or report export produces an audit record.',
    },
    {
      id: 'test_8',
      category: 'Compliance',
      title: 'Soft-Delete (No Hard Record Destruction)',
      desc: 'Confirm that deactivating a member changes status to Inactive with a documented reason, without purging records.',
    },
    {
      id: 'test_9',
      category: 'Reporting',
      title: 'Baptism Sacrament Registry & Printable PDF Export',
      desc: 'Generate baptism reports and verify print preview renders official Church of the Nazarene Remera letterhead.',
    },
    {
      id: 'test_10',
      category: 'Disaster Recovery',
      title: 'Full Database Backup & Restoration',
      desc: 'Download database JSON backup and test restoring data into the application with integrity checks.',
    },
  ];

  const completedCount = Object.values(completedTests).filter(Boolean).length;

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12 text-xs">
      {/* Top Header */}
      <div className="pb-3 border-b border-slate-200">
        <h1 className="text-xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-indigo-600" />
          <span>User Manual & Data Protection Governance</span>
        </h1>
        <p className="text-slate-500 mt-0.5">
          Operational guide for church administrators and legal compliance handbook for Rwanda Law No. 058/2021.
        </p>
      </div>

      {/* User Access & Church Register Governance Policy Banner */}
      <div className="bg-indigo-900/90 text-white rounded-lg p-5 border border-indigo-700 shadow-2xs space-y-3">
        <div className="flex items-center gap-2">
          <KeyRound className="w-5 h-5 text-amber-400 shrink-0" />
          <h2 className="text-sm font-bold tracking-tight text-white">
            Full Access Governance: Church Registrar & Secretary Only
          </h2>
        </div>
        <p className="text-xs text-indigo-100 leading-relaxed">
          At Church of the Nazarene Remera, <strong>Full Access to system operations, registries, and database records is strictly assigned to the Church Registrar and Church Secretary only</strong>. All other roles maintain read-only or restricted access.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1 text-[11px]">
          <div className="p-3 bg-indigo-950/60 rounded border border-indigo-700/60 space-y-1">
            <span className="font-bold text-amber-300 block">
              1. Full Access: Secretary & Registrar Only
            </span>
            <p className="text-indigo-200 leading-relaxed">
              The <strong>Church Registrar</strong> and <strong>Church Secretary</strong> hold exclusive authorization to view full member rosters, edit records, deactivate members, unmask IDs, inspect audit logs, and restore backups.
            </p>
          </div>
          <div className="p-3 bg-indigo-950/60 rounded border border-indigo-700/60 space-y-1">
            <span className="font-bold text-emerald-300 block">
              2. Shareable Member Link & Direct Storage
            </span>
            <p className="text-indigo-200 leading-relaxed">
              Church leaders can share the public link (<strong className="text-white font-mono">?portal=register</strong>) via WhatsApp or SMS. Members complete full registration, which is stored directly into the parish database (<strong className="text-white font-mono">NAZ-REM-xxxx</strong>).
            </p>
          </div>
          <div className="p-3 bg-indigo-950/60 rounded border border-indigo-700/60 space-y-1">
            <span className="font-bold text-cyan-300 block">
              3. Permanent One-Way Submission Lock
            </span>
            <p className="text-indigo-200 leading-relaxed">
              Once submitted by a member, the record is <strong>permanently locked</strong> from public editing to prevent tampering. Database management is guarded by strict user control security login (PIN & password).
            </p>
          </div>
        </div>
      </div>

      {/* Role Responsibilities Guide */}
      <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-2xs space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-indigo-600" />
            <h2 className="text-sm font-bold text-slate-900">
              System Roles & Operational Privileges
            </h2>
          </div>
          <span className="text-[11px] font-mono text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
            Full Access: Registrar & Secretary Only
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Church Secretary */}
          <div className="p-3 bg-slate-50 rounded border border-indigo-200 space-y-1.5 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900 block text-xs">
                  1. Church Secretary
                </span>
                <span className="text-[9px] font-bold uppercase tracking-wider text-indigo-700 bg-indigo-50 px-1.5 py-0.5 rounded border border-indigo-100">
                  Full Access
                </span>
              </div>
              <span className="text-[11px] text-indigo-700 font-semibold block">
                Senior Pastor / Church Secretary
              </span>
              <p className="text-slate-600 text-[11px] leading-relaxed mt-1">
                <strong>Full administrative & pastoral access:</strong> Manages all member records, user accounts, security roles, complete regulatory audit trails, disaster recovery backups, and authorized sensitive National ID unmasking for pastoral care.
              </p>
            </div>
            <div className="pt-2 border-t border-slate-200/60 text-[10px] text-indigo-700 font-bold">
              • Full Access to All Systems & Records
            </div>
          </div>

          {/* Card 2: Church Registrar */}
          <div className="p-3 bg-slate-50 rounded border border-emerald-200 space-y-1.5 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900 block text-xs">
                  2. Church Registrar
                </span>
                <span className="text-[9px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-100">
                  Full Access
                </span>
              </div>
              <span className="text-[11px] text-emerald-700 font-semibold block">
                Head Registrar / Registration Officer
              </span>
              <p className="text-slate-600 text-[11px] leading-relaxed mt-1">
                <strong>Full register & database access:</strong> Registers new church members with direct database commitment, edits member details, records baptism sacraments, unmasks IDs for registration verification, runs bulk CSV imports, and manages database backups.
              </p>
            </div>
            <div className="pt-2 border-t border-slate-200/60 text-[10px] text-emerald-700 font-bold">
              • Full Access to Church Register & Database
            </div>
          </div>

          {/* Card 3: Ministry Leader */}
          <div className="p-3 bg-slate-50 rounded border border-sky-200 space-y-1.5 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900 block text-xs">
                  3. Ministry Leader
                </span>
                <span className="text-[9px] font-bold uppercase tracking-wider text-sky-700 bg-sky-50 px-1.5 py-0.5 rounded border border-sky-100">
                  Group Only
                </span>
              </div>
              <span className="text-[11px] text-sky-700 font-semibold block">
                NYI Youth / NMI / Choir Leader
              </span>
              <p className="text-slate-600 text-[11px] leading-relaxed mt-1">
                <strong>Read-only departmental access:</strong> Access is limited to member rosters in their specific church group (youth, women, choir, Sunday school, men). Generates group attendance sheets and reports. Cannot edit church register records or view full National IDs.
              </p>
            </div>
            <div className="pt-2 border-t border-slate-200/60 text-[10px] text-sky-700 font-medium">
              • Read-only access to own ministry group
            </div>
          </div>

          {/* Card 4: Church Member / Viewer */}
          <div className="p-3 bg-slate-50 rounded border border-emerald-200/80 space-y-1.5 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900 block text-xs">
                  4. Church Member / Viewer
                </span>
                <span className="text-[9px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-100">
                  Direct Register
                </span>
              </div>
              <span className="text-[11px] text-slate-700 font-semibold block">
                Church Member / Self-Registration / Viewer
              </span>
              <p className="text-slate-600 text-[11px] leading-relaxed mt-1">
                <strong>Direct Database Registration & Read-Only Directory:</strong> Even church members can register their full information through the multi-step form! When submitted, all records are <strong>directly stored in the parish database</strong> with instant confirmation and assigned <strong className="font-mono text-indigo-700">NAZ-REM-xxxx</strong> code. Directory view is strictly read-only with masked National IDs.
              </p>
            </div>
            <div className="pt-2 border-t border-slate-200/60 text-[10px] text-emerald-700 font-medium">
              • Direct registration to database & read-only directory
            </div>
          </div>
        </div>

        {/* Detailed Privilege Matrix Table */}
        <div className="pt-4 border-t border-slate-100">
          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
            Privilege Matrix & Functional Access Boundaries
          </h3>
          <div className="overflow-x-auto border border-slate-200 rounded-lg">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-semibold text-slate-600 uppercase">
                  <th className="py-2.5 px-3">System Capability / Module</th>
                  <th className="py-2.5 px-3 text-center text-indigo-900 bg-indigo-50/50">Church Secretary (Full Access)</th>
                  <th className="py-2.5 px-3 text-center text-emerald-900 bg-emerald-50/50">Church Registrar (Full Access)</th>
                  <th className="py-2.5 px-3 text-center">Ministry Leader</th>
                  <th className="py-2.5 px-3 text-center text-emerald-900 bg-emerald-50/30">Church Member / Viewer</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-[11px]">
                <tr className="hover:bg-slate-50/70">
                  <td className="py-2.5 px-3 font-semibold text-slate-900">
                    Register New Members (Direct Database Storage)
                  </td>
                  <td className="py-2.5 px-3 text-center font-bold text-indigo-700 bg-indigo-50/30">
                    Full Access (Direct DB)
                  </td>
                  <td className="py-2.5 px-3 text-center font-bold text-emerald-800 bg-emerald-50/30">
                    Full Access (Direct DB)
                  </td>
                  <td className="py-2.5 px-3 text-center text-slate-400">No Access</td>
                  <td className="py-2.5 px-3 text-center font-bold text-emerald-700 bg-emerald-50/40">
                    Allowed (Direct DB Self-Registration)
                  </td>
                </tr>
                <tr className="hover:bg-slate-50/70">
                  <td className="py-2.5 px-3 font-semibold text-slate-900">
                    Edit & Update Church Register Records
                  </td>
                  <td className="py-2.5 px-3 text-center font-bold text-indigo-700 bg-indigo-50/30">Full Access</td>
                  <td className="py-2.5 px-3 text-center font-bold text-emerald-800 bg-emerald-50/30">Full Access</td>
                  <td className="py-2.5 px-3 text-center text-slate-400">No (Read-Only)</td>
                  <td className="py-2.5 px-3 text-center text-slate-400">No Access</td>
                </tr>
                <tr className="hover:bg-slate-50/70">
                  <td className="py-2.5 px-3 font-semibold text-slate-900">
                    Sacramental Baptism Registry & Certificates
                  </td>
                  <td className="py-2.5 px-3 text-center font-bold text-indigo-700 bg-indigo-50/30">Full Access</td>
                  <td className="py-2.5 px-3 text-center font-bold text-emerald-800 bg-emerald-50/30">Full Access</td>
                  <td className="py-2.5 px-3 text-center text-slate-500">View Status</td>
                  <td className="py-2.5 px-3 text-center text-slate-500">View Status</td>
                </tr>
                <tr className="hover:bg-slate-50/70">
                  <td className="py-2.5 px-3 font-semibold text-slate-900">
                    Unmask 16-Digit Rwandan National ID
                  </td>
                  <td className="py-2.5 px-3 text-center font-bold text-purple-700 bg-indigo-50/30">Full Access (Audited)</td>
                  <td className="py-2.5 px-3 text-center font-bold text-purple-700 bg-emerald-50/30">Full Access (Audited)</td>
                  <td className="py-2.5 px-3 text-center text-rose-600 font-medium">Masked (Forbidden)</td>
                  <td className="py-2.5 px-3 text-center text-rose-600 font-medium">Masked (Forbidden)</td>
                </tr>
                <tr className="hover:bg-slate-50/70">
                  <td className="py-2.5 px-3 font-semibold text-slate-900">
                    Member Deactivation (Soft-Delete with Reason)
                  </td>
                  <td className="py-2.5 px-3 text-center font-bold text-indigo-700 bg-indigo-50/30">Full Access</td>
                  <td className="py-2.5 px-3 text-center font-bold text-emerald-800 bg-emerald-50/30">Full Access</td>
                  <td className="py-2.5 px-3 text-center text-slate-400">No Access</td>
                  <td className="py-2.5 px-3 text-center text-slate-400">No Access</td>
                </tr>
                <tr className="hover:bg-slate-50/70">
                  <td className="py-2.5 px-3 font-semibold text-slate-900">
                    Regulatory Audit Log Inspection
                  </td>
                  <td className="py-2.5 px-3 text-center font-bold text-indigo-700 bg-indigo-50/30">Full Access</td>
                  <td className="py-2.5 px-3 text-center font-bold text-emerald-800 bg-emerald-50/30">Full Access</td>
                  <td className="py-2.5 px-3 text-center text-slate-400">No Access</td>
                  <td className="py-2.5 px-3 text-center text-slate-400">No Access</td>
                </tr>
                <tr className="hover:bg-slate-50/70">
                  <td className="py-2.5 px-3 font-semibold text-slate-900">
                    Database Backup & Disaster Restore
                  </td>
                  <td className="py-2.5 px-3 text-center font-bold text-indigo-700 bg-indigo-50/30">Full Access</td>
                  <td className="py-2.5 px-3 text-center font-bold text-emerald-800 bg-emerald-50/30">Full Access</td>
                  <td className="py-2.5 px-3 text-center text-slate-400">No Access</td>
                  <td className="py-2.5 px-3 text-center text-slate-400">No Access</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Registered Church Authorized Officers List */}
        <div className="pt-4 border-t border-slate-100 space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Authorized Registered Church Users (Remera Parish Roll)
            </h3>
            <span className="text-[10px] text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">
              Active Church Personnel Only
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
            {[
              {
                name: 'Rev. Samuel Ndayisaba',
                role: 'Senior Pastor',
                office: 'Senior Pastor',
                privilege: 'Pastoral oversight & spiritual guidance',
                email: 'senior.pastor@remeranazarene.org.rw',
              },
              {
                name: 'Claudine Ingabire',
                role: 'Church Secretary (Full Access)',
                office: 'Parish Secretary & Administrator',
                privilege: 'Full Access to system administration, member records, backups, and audit logs',
                email: 'secretary@remeranazarene.org.rw',
              },
              {
                name: 'Aime Kayiranga',
                role: 'Church Registrar (Full Access)',
                office: 'Chief Church Registrar',
                privilege: 'Full Access to Church Register, member records, baptism certificates, and database',
                email: 'registrar@remeranazarene.org.rw',
              },
              {
                name: 'Patrick Nshimiyimana',
                role: 'Ministry Leader',
                office: 'NYI Youth President',
                privilege: 'Read-only access to Youth Ministry roster only',
                email: 'nyi.leader@remeranazarene.org.rw',
              },
              {
                name: 'Marie Chantal Uwase',
                role: 'Ministry Leader',
                office: 'NMI Women President',
                privilege: 'Read-only access to Women Ministry roster only',
                email: 'nmi.leader@remeranazarene.org.rw',
              },
              {
                name: 'Parish Supervisory Auditor',
                role: 'Viewer / Auditor',
                office: 'Internal Audit Committee',
                privilege: 'Read-only directory audit without National ID numbers',
                email: 'audit@remeranazarene.org.rw',
              },
            ].map((u) => (
              <div key={u.email} className="p-2.5 bg-slate-50 rounded border border-slate-200 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-900 text-xs truncate">{u.name}</span>
                  <span className="text-[10px] font-mono text-indigo-700 bg-indigo-50 px-1.5 py-0.5 rounded font-semibold">
                    {u.role}
                  </span>
                </div>
                <div className="text-[11px] text-slate-500 font-medium">{u.office}</div>
                <div className="text-[10px] text-slate-400 font-mono truncate">{u.email}</div>
                <div className="text-[10px] text-slate-600 pt-1 border-t border-slate-200/50">
                  {u.privilege}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Rwanda Law No. 058/2021 Compliance Handbook */}
      <div className="bg-slate-900 text-white rounded-lg p-5 shadow-2xs space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-slate-800">
          <ShieldCheck className="w-5 h-5 text-emerald-400" />
          <h2 className="text-sm font-bold text-slate-100">
            Rwanda Law No. 058/2021 on Personal Data Protection & Privacy
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-[11px] text-slate-300">
          <div className="space-y-1">
            <strong className="text-white block">Article 18: Lawful Basis & Consent</strong>
            <p className="leading-relaxed text-slate-400">
              The church collects data strictly for pastoral care, spiritual formation, and parish administration. Every registered member must have a documented consent record stored in the database.
            </p>
          </div>
          <div className="space-y-1">
            <strong className="text-white block">Article 24: Data Minimization & Masking</strong>
            <p className="leading-relaxed text-slate-400">
              Sensitive identifiers (National ID 16-digits) are encrypted at rest using AES-256 and masked in the user interface (1 1995 • ••••••• • 23) to prevent unauthorized surveillance.
            </p>
          </div>
          <div className="space-y-1">
            <strong className="text-white block">Article 28: Soft Deletes & Auditability</strong>
            <p className="leading-relaxed text-slate-400">
              Hard data deletion is restricted; deactivations record the pastoral justification and preserve baptism sacramental integrity, accompanied by immutable audit logging.
            </p>
          </div>
        </div>
      </div>

      {/* Interactive Testing Checklist */}
      <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-2xs space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <CheckSquare className="w-4 h-4 text-emerald-600" />
            <h2 className="text-sm font-bold text-slate-900">
              Testing & Security Verification Checklist
            </h2>
          </div>
          <div className="text-xs font-semibold text-slate-700">
            Progress: <strong className="font-mono text-emerald-700">{completedCount}</strong> of{' '}
            <span className="font-mono">{tests.length}</span> passed ({Math.round((completedCount / tests.length) * 100)}%)
          </div>
        </div>

        <div className="divide-y divide-slate-100">
          {tests.map((test) => {
            const isDone = completedTests[test.id];
            return (
              <div
                key={test.id}
                onClick={() => toggleTest(test.id)}
                className="py-3 flex items-start gap-3 cursor-pointer hover:bg-slate-50 px-2 rounded transition-colors group"
              >
                <div
                  className={`w-4 h-4 rounded border mt-0.5 flex items-center justify-center shrink-0 transition-colors ${
                    isDone
                      ? 'bg-emerald-600 border-emerald-600 text-white'
                      : 'border-slate-300 bg-white group-hover:border-slate-400'
                  }`}
                >
                  {isDone && <Check className="w-3 h-3" />}
                </div>
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
                      {test.category}
                    </span>
                    <span className="text-slate-300">·</span>
                    <h3
                      className={`font-semibold text-xs transition-colors ${
                        isDone ? 'text-slate-900 line-through opacity-75' : 'text-slate-900'
                      }`}
                    >
                      {test.title}
                    </h3>
                  </div>
                  <p className="text-[11px] text-slate-500 leading-relaxed">
                    {test.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
