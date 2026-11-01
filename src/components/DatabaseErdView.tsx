/**
 * Database Schema & Visual ER Diagram Component
 * Production normalized relational schema (PostgreSQL 3NF), ER diagram,
 * architectural overview, and backend API endpoints specification.
 */

import React, { useState } from 'react';
import { POSTGRESQL_DDL_SCHEMA, ERD_TABLES, TableDefinition } from '../data/databaseSchemaSql';
import {
  Database,
  Key,
  Link as LinkIcon,
  Copy,
  Check,
  Server,
  Code,
  Shield,
  Layers,
  ArrowRight,
  Table,
} from 'lucide-react';

export const DatabaseErdView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'erd' | 'sql' | 'architecture' | 'api'>('erd');
  const [selectedTable, setSelectedTable] = useState<string>('members');
  const [copiedSql, setCopiedSql] = useState(false);

  const handleCopySql = () => {
    navigator.clipboard.writeText(POSTGRESQL_DDL_SCHEMA);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 2000);
  };

  const currentTable = ERD_TABLES.find((t) => t.name === selectedTable) || ERD_TABLES[0];

  const apiEndpoints = [
    {
      method: 'POST',
      path: '/api/v1/members',
      auth: 'SUPER_ADMIN, DATA_ENTRY',
      desc: 'Register new member with 16-digit Rwandan NID validation & Law 058/2021 consent verification.',
    },
    {
      method: 'GET',
      path: '/api/v1/members',
      auth: 'ALL_ROLES',
      desc: 'Multi-criteria search & filtering (name, phone, sector, cell, baptism, ministry). Returns masked NIDs for viewers.',
    },
    {
      method: 'GET',
      path: '/api/v1/members/:id',
      auth: 'ALL_ROLES',
      desc: 'Get full member profile. NID unmasking requires SUPER_ADMIN or DATA_ENTRY and logs audit event.',
    },
    {
      method: 'PUT',
      path: '/api/v1/members/:id',
      auth: 'SUPER_ADMIN, DATA_ENTRY',
      desc: 'Update member demographic, address, or sacramental record with automatic audit trail entry.',
    },
    {
      method: 'DELETE',
      path: '/api/v1/members/:id',
      auth: 'SUPER_ADMIN',
      desc: 'Soft-deactivates member record (sets status = Inactive, logs reason). Hard delete forbidden under Rwandan law.',
    },
    {
      method: 'POST',
      path: '/api/v1/families',
      auth: 'SUPER_ADMIN, DATA_ENTRY',
      desc: 'Create household and link head of family, spouse, and dependents.',
    },
    {
      method: 'GET',
      path: '/api/v1/families/:id/tree',
      auth: 'ALL_ROLES',
      desc: 'Retrieve full family household relational tree with all associated church members.',
    },
    {
      method: 'GET',
      path: '/api/v1/reports/:reportType',
      auth: 'SUPER_ADMIN, MINISTRY_LEADER',
      desc: 'Generate baptism sacrament lists, birthday rosters, or ministry rolls (CSV or PDF).',
    },
    {
      method: 'POST',
      path: '/api/v1/system/backup',
      auth: 'SUPER_ADMIN',
      desc: 'Create and download full database JSON/SQL backup archive.',
    },
    {
      method: 'POST',
      path: '/api/v1/system/restore',
      auth: 'SUPER_ADMIN',
      desc: 'Restore database from verified JSON/SQL backup file with integrity checks.',
    },
  ];

  return (
    <div className="space-y-4 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-3 border-b border-slate-200">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
            <Database className="w-5 h-5 text-indigo-600" />
            <span>Database Architecture & Entity-Relationship Schema</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Normalized 3NF PostgreSQL relational model, primary & foreign keys, pgcrypto data-at-rest encryption, and indexes.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {activeTab === 'sql' && (
            <button
              onClick={handleCopySql}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded transition-colors shadow-xs"
            >
              {copiedSql ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedSql ? 'Copied to Clipboard!' : 'Copy SQL Schema'}</span>
            </button>
          )}
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 text-xs overflow-x-auto pb-2">
        {[
          { id: 'erd', label: '1. Visual ER Diagram & Tables', icon: Layers },
          { id: 'sql', label: '2. PostgreSQL DDL SQL Schema', icon: Code },
          { id: 'architecture', label: '3. Architecture & Normalization', icon: Shield },
          { id: 'api', label: '4. Backend REST API Endpoints', icon: Server },
        ].map((t) => {
          const Icon = t.icon;
          const isActive = activeTab === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id as any)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-md font-medium transition-colors whitespace-nowrap ${
                isActive
                  ? 'bg-slate-900 text-white shadow-2xs'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{t.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: VISUAL ER DIAGRAM */}
      {activeTab === 'erd' && (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Table List Selector */}
          <div className="space-y-2">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
              Normalized Database Tables ({ERD_TABLES.length})
            </span>
            <div className="bg-white rounded-lg border border-slate-200 divide-y divide-slate-100 shadow-2xs overflow-hidden">
              {ERD_TABLES.map((table) => {
                const isSelected = selectedTable === table.name;
                return (
                  <button
                    key={table.name}
                    onClick={() => setSelectedTable(table.name)}
                    className={`w-full text-left p-3 transition-colors flex items-center justify-between ${
                      isSelected
                        ? 'bg-indigo-50/70 border-l-3 border-indigo-600'
                        : 'hover:bg-slate-50'
                    }`}
                  >
                    <div>
                      <span className="font-mono font-bold text-xs text-slate-900 block">
                        {table.name}
                      </span>
                      <span className="text-[11px] text-slate-500 line-clamp-1">
                        {table.description}
                      </span>
                    </div>
                    <ArrowRight
                      className={`w-3.5 h-3.5 shrink-0 ${
                        isSelected ? 'text-indigo-600' : 'text-slate-300'
                      }`}
                    />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Active Table Details & ERD Schema Card */}
          <div className="lg:col-span-3 space-y-4">
            <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-2xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pb-3 border-b border-slate-200">
                <div>
                  <div className="flex items-center gap-2">
                    <Table className="w-4 h-4 text-indigo-600" />
                    <h3 className="font-mono text-base font-bold text-slate-900">
                      public.{currentTable.name}
                    </h3>
                  </div>
                  <p className="text-xs text-slate-600 mt-1">
                    {currentTable.description}
                  </p>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-[11px] font-mono bg-amber-50 text-amber-800 px-2 py-0.5 rounded border border-amber-200">
                    PK: {currentTable.primaryKey}
                  </span>
                </div>
              </div>

              {/* Foreign Key Relations */}
              {currentTable.foreignKeys.length > 0 && (
                <div className="p-3 bg-slate-50 rounded border border-slate-200 text-xs">
                  <span className="font-semibold text-slate-700 block mb-1">
                    Foreign Key Constraints:
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {currentTable.foreignKeys.map((fk) => (
                      <span
                        key={fk}
                        className="inline-flex items-center gap-1 font-mono text-[11px] bg-white text-indigo-700 px-2 py-0.5 rounded border border-indigo-200"
                      >
                        <LinkIcon className="w-3 h-3" />
                        <span>{fk}</span>
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Column Definitions Table */}
              <div className="overflow-x-auto border border-slate-200 rounded-lg">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-semibold text-slate-600 uppercase">
                      <th className="py-2 px-3">Column Name</th>
                      <th className="py-2 px-3">Data Type</th>
                      <th className="py-2 px-3">Constraints & Attributes</th>
                      <th className="py-2 px-3">Description & Role</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-mono text-xs">
                    {currentTable.columns.map((col) => (
                      <tr key={col.name} className="hover:bg-slate-50/70">
                        <td className="py-2 px-3 font-bold text-slate-900">
                          <div className="flex items-center gap-1">
                            {col.constraints.includes('PK') && (
                              <span title="Primary Key">
                                <Key className="w-3 h-3 text-amber-500 shrink-0" />
                              </span>
                            )}
                            {col.constraints.includes('FK') && (
                              <span title="Foreign Key">
                                <LinkIcon className="w-3 h-3 text-indigo-500 shrink-0" />
                              </span>
                            )}
                            <span>{col.name}</span>
                          </div>
                        </td>
                        <td className="py-2 px-3 text-indigo-700">
                          {col.type}
                        </td>
                        <td className="py-2 px-3 text-slate-500 text-[11px]">
                          {col.constraints}
                        </td>
                        <td className="py-2 px-3 font-sans text-slate-700 text-xs">
                          {col.description}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: POSTGRESQL DDL SQL VIEWER */}
      {activeTab === 'sql' && (
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-500 pb-1">
            <span>Production DDL Script (PostgreSQL 15+ compatible with pgcrypto extension)</span>
            <span className="font-mono text-[11px]">UTF-8 · 3NF Normalized</span>
          </div>
          <div className="bg-slate-950 text-slate-200 p-4 rounded-lg font-mono text-xs leading-relaxed overflow-x-auto max-h-[70vh] border border-slate-800 shadow-inner">
            <pre>{POSTGRESQL_DDL_SCHEMA}</pre>
          </div>
        </div>
      )}

      {/* TAB 3: SYSTEM ARCHITECTURE & 3NF NORMALIZATION */}
      {activeTab === 'architecture' && (
        <div className="space-y-6 bg-white rounded-lg border border-slate-200 p-6 shadow-2xs text-xs">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              System Architecture & Database Normalization (3NF)
            </h3>
            <p className="text-slate-500 mt-1">
              Architectural decisions implemented in NFDMS for Church of the Nazarene, Remera.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 space-y-2">
              <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <Layers className="w-4 h-4 text-indigo-600" />
                <span>Third Normal Form (3NF) Design</span>
              </h4>
              <p className="text-slate-600 leading-relaxed">
                • <strong>First Normal Form (1NF):</strong> All fields are atomic (e.g. Rwandan NID, first name, last name, phone, dates). No repeating groups.
              </p>
              <p className="text-slate-600 leading-relaxed">
                • <strong>Second Normal Form (2NF):</strong> Every non-key attribute is fully functionally dependent on the primary key UUID. Normalized entities split addresses, sacramental records, and parents into dedicated tables.
              </p>
              <p className="text-slate-600 leading-relaxed">
                • <strong>Third Normal Form (3NF):</strong> No transitive dependencies. Address hierarchies and family relationships resolve through foreign keys without duplicate address text in the member entity.
              </p>
            </div>

            <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 space-y-2">
              <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <Shield className="w-4 h-4 text-emerald-600" />
                <span>Rwanda Law No. 058/2021 Security Architecture</span>
              </h4>
              <p className="text-slate-600 leading-relaxed">
                • <strong>Encryption at Rest:</strong> National ID numbers (Indangamuntu) are encrypted via AES-256 (`pgcrypto.pgp_sym_encrypt`) and masked in general views (`1 1985 • ••••••• • 23`).
              </p>
              <p className="text-slate-600 leading-relaxed">
                • <strong>Deterministic Search Hash:</strong> A SHA-256 hash (`national_id_hash`) allows instant $O(1)$ duplicate checking without decrypting the master vault.
              </p>
              <p className="text-slate-600 leading-relaxed">
                • <strong>Soft Deletes & Audit Trails:</strong> Members are never hard-deleted; their status transitions to Inactive or Transferred with immutable audit logs recording the exact reason and actor.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: BACKEND REST API SPECIFICATION */}
      {activeTab === 'api' && (
        <div className="space-y-4 bg-white rounded-lg border border-slate-200 p-6 shadow-2xs text-xs">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Backend REST API Endpoints & RBAC Validation Rules
            </h3>
            <p className="text-slate-500 mt-1">
              Specification of backend service layer endpoints, role restrictions, and validation logic.
            </p>
          </div>

          <div className="overflow-x-auto border border-slate-200 rounded-lg">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-semibold text-slate-600 uppercase">
                  <th className="py-2.5 px-3">Method</th>
                  <th className="py-2.5 px-3">Endpoint Path</th>
                  <th className="py-2.5 px-3">Required RBAC Role</th>
                  <th className="py-2.5 px-3">Functionality & Validation Rules</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-mono text-xs">
                {apiEndpoints.map((ep) => (
                  <tr key={ep.path} className="hover:bg-slate-50/70">
                    <td className="py-2.5 px-3">
                      <span
                        className={`px-2 py-0.5 rounded font-bold text-[10px] ${
                          ep.method === 'POST'
                            ? 'bg-emerald-100 text-emerald-800'
                            : ep.method === 'GET'
                            ? 'bg-sky-100 text-sky-800'
                            : ep.method === 'PUT'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {ep.method}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 font-bold text-slate-900">
                      {ep.path}
                    </td>
                    <td className="py-2.5 px-3 text-indigo-700 font-sans text-[11px]">
                      {ep.auth}
                    </td>
                    <td className="py-2.5 px-3 font-sans text-slate-700 text-xs">
                      {ep.desc}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
