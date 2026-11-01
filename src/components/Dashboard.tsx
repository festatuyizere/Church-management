/**
 * Dashboard Component
 * Church metrics: Total members, families, baptism ratio, demographics, upcoming birthdays, recent audit events
 */

import React from 'react';
import { useChurchData } from '../context/ChurchDataContext';
import { calculateAge } from '../utils/validation';
import {
  Users,
  Droplets,
  Calendar,
  Cake,
  TrendingUp,
  UserPlus,
  ArrowRight,
  ShieldCheck,
  ChevronRight,
  Building2,
} from 'lucide-react';

interface DashboardProps {
  onNavigate: (tab: string) => void;
  onOpenRegisterModal: () => void;
  onSelectMember: (memberId: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  onNavigate,
  onOpenRegisterModal,
  onSelectMember,
}) => {
  const { members, ministries, auditLogs, t, currentRole } = useChurchData();

  // 1. Core KPIs
  const totalMembersCount = members.length;
  const activeMembersCount = members.filter((m) => m.churchInfo.membershipStatus === 'Active').length;
  const inactiveMembersCount = totalMembersCount - activeMembersCount;

  const baptizedCount = members.filter((m) => m.churchInfo.baptism.isBaptized).length;
  const unbaptizedCount = totalMembersCount - baptizedCount;
  const baptizedPercentage = totalMembersCount > 0 ? Math.round((baptizedCount / totalMembersCount) * 100) : 0;

  // New members this month
  const now = new Date();
  const currentYearMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  const newMembersThisMonth = members.filter((m) => {
    return m.churchInfo.membershipDate?.startsWith(currentYearMonth) || m.createdAt?.startsWith(currentYearMonth);
  }).length;

  // 2. Gender distribution
  const maleCount = members.filter((m) => m.gender === 'Male').length;
  const femaleCount = members.filter((m) => m.gender === 'Female').length;
  const malePct = totalMembersCount > 0 ? Math.round((maleCount / totalMembersCount) * 100) : 0;
  const femalePct = totalMembersCount > 0 ? 100 - malePct : 0;

  // 3. Age Groups
  const ageStats = {
    children: 0,   // 0-12
    youth: 0,      // 13-25
    youngAdults: 0,// 26-35
    adults: 0,     // 36-59
    seniors: 0,    // 60+
  };

  members.forEach((m) => {
    const { age } = calculateAge(m.dateOfBirth);
    if (age <= 12) ageStats.children++;
    else if (age <= 25) ageStats.youth++;
    else if (age <= 35) ageStats.youngAdults++;
    else if (age <= 59) ageStats.adults++;
    else ageStats.seniors++;
  });

  // 4. Upcoming Birthdays (within next 30 days)
  const today = new Date();
  const upcomingBirthdays = members
    .filter((m) => m.churchInfo.membershipStatus === 'Active' && m.dateOfBirth)
    .map((m) => {
      const parts = m.dateOfBirth.split('-');
      const birthMonth = parseInt(parts[1], 10) - 1;
      const birthDay = parseInt(parts[2], 10);

      const thisYearBirthday = new Date(today.getFullYear(), birthMonth, birthDay);
      if (thisYearBirthday < today) {
        thisYearBirthday.setFullYear(today.getFullYear() + 1);
      }

      const diffTime = thisYearBirthday.getTime() - today.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return {
        member: m,
        daysUntil: diffDays,
        turningAge: thisYearBirthday.getFullYear() - parseInt(parts[0], 10),
        birthdayDateStr: `${parts[1]}/${parts[2]}`,
      };
    })
    .filter((item) => item.daysUntil >= 0 && item.daysUntil <= 30)
    .sort((a, b) => a.daysUntil - b.daysUntil)
    .slice(0, 5);

  // 5. Ministry membership breakdown
  const ministryCounts = ministries.map((min) => {
    const count = members.filter((m) => m.churchInfo.ministryId === min.id).length;
    return { ...min, count };
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Title & Quick Action Strip */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            {t('navDashboard')}
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Parish records, baptism sacraments, and member spiritual care tracking for Remera Nazarene Church.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {(currentRole === 'SUPER_ADMIN' || currentRole === 'DATA_ENTRY') && (
            <button
              onClick={onOpenRegisterModal}
              className="flex items-center gap-1.5 px-3 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded text-xs font-semibold shadow-xs transition-colors"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>{t('registerMember')}</span>
            </button>
          )}
        </div>
      </div>

      {/* Primary KPI 4-Card Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Members */}
        <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-2xs hover:border-slate-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">
              {t('totalMembers')}
            </span>
            <Users className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-bold font-mono tabular-nums text-slate-900">
              {totalMembersCount}
            </span>
            <span className="text-xs text-emerald-600 font-medium">
              {activeMembersCount} {t('active').toLowerCase()}
            </span>
          </div>
          <div className="mt-2 flex items-center gap-2 text-xs text-slate-400">
            <span>{inactiveMembersCount} {t('inactive').toLowerCase()}</span>
            <span aria-hidden="true">·</span>
            <span className="text-slate-500">100% indexed</span>
          </div>
        </div>

        {/* Church Ministries */}
        <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-2xs hover:border-slate-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">
              Active Ministries
            </span>
            <Building2 className="w-4 h-4 text-amber-600" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-bold font-mono tabular-nums text-slate-900">
              {ministries.length}
            </span>
            <span className="text-xs text-slate-500">
              Departments
            </span>
          </div>
          <div className="mt-2 text-xs text-slate-400">
            NYI Youth, NMI Women, Choir, Men, Sunday School
          </div>
        </div>

        {/* Baptized vs Unbaptized */}
        <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-2xs hover:border-slate-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">
              {t('baptizedMembers')}
            </span>
            <Droplets className="w-4 h-4 text-sky-600" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-bold font-mono tabular-nums text-slate-900">
              {baptizedCount}
            </span>
            <span className="text-xs font-semibold text-sky-600 tabular-nums">
              {baptizedPercentage}%
            </span>
          </div>
          <div className="mt-2 flex items-center gap-2 text-xs text-slate-400">
            <span>{unbaptizedCount} {t('notBaptized').toLowerCase()}</span>
            <span aria-hidden="true">·</span>
            <span className="text-slate-500">Water immersion</span>
          </div>
        </div>

        {/* New Members This Month */}
        <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-2xs hover:border-slate-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">
              {t('newMembersThisMonth')}
            </span>
            <Calendar className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-bold font-mono tabular-nums text-slate-900">
              {newMembersThisMonth}
            </span>
            <span className="text-xs text-emerald-600 flex items-center font-medium">
              <TrendingUp className="w-3 h-3 mr-0.5" /> Growth
            </span>
          </div>
          <div className="mt-2 text-xs text-slate-400">
            Consent recorded under Law 058/2021
          </div>
        </div>
      </div>

      {/* Middle Section: Demographics & Ministries */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Gender & Age Demographics (2 cols) */}
        <div className="lg:col-span-2 bg-white rounded-lg border border-slate-200 p-5 shadow-2xs space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h2 className="text-sm font-semibold text-slate-900">
                Church Member Demographics & Age Groups
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Congregational breakdown for pastoral care and discipleship programs
              </p>
            </div>
            <button
              onClick={() => onNavigate('reports')}
              className="text-xs text-indigo-600 hover:text-indigo-800 font-medium flex items-center gap-1"
            >
              <span>View Full Report</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          {/* Gender Ratio Bar */}
          <div>
            <div className="flex justify-between items-center text-xs font-medium mb-1.5">
              <span className="text-slate-700">
                Male: <strong className="font-mono tabular-nums text-slate-900">{maleCount}</strong> ({malePct}%)
              </span>
              <span className="text-slate-700">
                Female: <strong className="font-mono tabular-nums text-slate-900">{femaleCount}</strong> ({femalePct}%)
              </span>
            </div>
            <div className="w-full h-3 bg-slate-100 rounded overflow-hidden flex">
              <div
                style={{ width: `${malePct}%` }}
                className="bg-indigo-600 h-full transition-all duration-500"
                title={`Male: ${maleCount}`}
              />
              <div
                style={{ width: `${femalePct}%` }}
                className="bg-rose-400 h-full transition-all duration-500"
                title={`Female: ${femaleCount}`}
              />
            </div>
          </div>

          {/* Age Distribution Breakdown */}
          <div className="space-y-3 pt-2">
            <div className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
              Age Categories
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              {[
                { label: 'Children (0-12)', count: ageStats.children, color: 'bg-emerald-500' },
                { label: 'Youth (13-25)', count: ageStats.youth, color: 'bg-indigo-500' },
                { label: 'Young Adults (26-35)', count: ageStats.youngAdults, color: 'bg-sky-500' },
                { label: 'Adults (36-59)', count: ageStats.adults, color: 'bg-amber-500' },
                { label: 'Seniors (60+)', count: ageStats.seniors, color: 'bg-purple-500' },
              ].map((cat) => {
                const pct = totalMembersCount > 0 ? Math.round((cat.count / totalMembersCount) * 100) : 0;
                return (
                  <div key={cat.label} className="p-3 bg-slate-50 rounded border border-slate-100 text-center">
                    <span className="block text-[11px] font-medium text-slate-600 truncate">
                      {cat.label}
                    </span>
                    <span className="block text-xl font-bold font-mono tabular-nums text-slate-900 mt-1">
                      {cat.count}
                    </span>
                    <span className="block text-[11px] text-slate-400 font-mono mt-0.5">
                      {pct}%
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Ministry Department Roster Progress */}
          <div className="pt-2 border-t border-slate-100 space-y-3">
            <div className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
              Ministries & Departments
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {ministryCounts.map((m) => (
                <div key={m.id} className="p-2.5 rounded border border-slate-100 hover:bg-slate-50 transition-colors">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-medium text-slate-800 truncate pr-2">{m.name}</span>
                    <span className="font-mono tabular-nums font-semibold text-slate-900 bg-slate-100 px-1.5 py-0.5 rounded text-[11px]">
                      {m.count}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-400 mt-1 flex items-center justify-between">
                    <span>{m.leaderName}</span>
                    <span className="text-slate-500 font-mono">{m.leaderPhone}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Upcoming Birthdays & Quick Pastoral Actions */}
        <div className="space-y-6">
          {/* Upcoming Birthdays Card */}
          <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-2xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Cake className="w-4 h-4 text-rose-500" />
                <h3 className="text-xs font-semibold text-slate-900 uppercase tracking-wider">
                  {t('upcomingBirthdays')}
                </h3>
              </div>
              <span className="text-[11px] text-slate-400 tabular-nums font-mono">Next 30 Days</span>
            </div>

            {upcomingBirthdays.length === 0 ? (
              <div className="py-8 text-center text-xs text-slate-400">
                No member birthdays in the next 30 days.
              </div>
            ) : (
              <div className="divide-y divide-slate-100 mt-2">
                {upcomingBirthdays.map((item) => (
                  <div
                    key={item.member.id}
                    onClick={() => onSelectMember(item.member.id)}
                    className="py-2.5 flex items-center justify-between group cursor-pointer hover:bg-slate-50 px-1.5 rounded transition-colors"
                  >
                    <div>
                      <div className="text-xs font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors">
                        {item.member.firstName} {item.member.lastName}
                      </div>
                      <div className="text-[11px] text-slate-400 flex items-center gap-2 mt-0.5">
                        <span>Turning {item.turningAge}</span>
                        <span>·</span>
                        <span className="font-mono">{item.member.phone}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-medium font-mono text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">
                        {item.daysUntil === 0 ? 'Today!' : `in ${item.daysUntil}d`}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Recent Audit Activities (Regulatory Trail) */}
          <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-2xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-indigo-600" />
                <h3 className="text-xs font-semibold text-slate-900 uppercase tracking-wider">
                  Recent Audit Events
                </h3>
              </div>
              <button
                onClick={() => onNavigate('audit')}
                className="text-[11px] text-indigo-600 hover:text-indigo-800 font-medium"
              >
                {t('viewAll')}
              </button>
            </div>

            <div className="divide-y divide-slate-100 mt-2 space-y-2">
              {auditLogs.slice(0, 4).map((log) => (
                <div key={log.id} className="pt-2 text-xs">
                  <div className="flex items-center justify-between text-slate-500 text-[11px]">
                    <span className="font-medium text-slate-700">{log.action.replace('_', ' ')}</span>
                    <span className="font-mono text-slate-400">
                      {new Date(log.timestamp).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="text-slate-900 font-medium text-xs mt-0.5">
                    {log.entityName}
                  </div>
                  <p className="text-[11px] text-slate-500 truncate mt-0.5">
                    {log.details}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
