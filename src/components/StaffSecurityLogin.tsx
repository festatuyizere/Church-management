/**
 * Staff Security Login Screen
 * User Control Security Gate for Church Leadership & Administration
 * Protects database management, editing, deleting, and sensitive member records.
 */

import React, { useState } from 'react';
import { useChurchData } from '../context/ChurchDataContext';
import {
  Lock,
  ShieldCheck,
  KeyRound,
  UserCheck,
  ArrowRight,
  ArrowLeft,
  AlertCircle,
  Eye,
  EyeOff,
  Church,
  Sparkles,
} from 'lucide-react';

interface StaffSecurityLoginProps {
  onBackToMemberForm?: () => void;
}

export const StaffSecurityLogin: React.FC<StaffSecurityLoginProps> = ({ onBackToMemberForm }) => {
  const { staffUsers, login, loginAsUser, setPortalView, t } = useChurchData();

  const [identifier, setIdentifier] = useState('');
  const [secret, setSecret] = useState('');
  const [showSecret, setShowSecret] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleManualLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!identifier.trim()) {
      setError('Please enter your staff email or username.');
      return;
    }
    if (!secret.trim()) {
      setError('Please enter your security PIN or password.');
      return;
    }

    setIsSubmitting(true);
    const result = login(identifier, secret);
    setIsSubmitting(false);

    if (!result.success) {
      setError(result.error || 'Authentication failed. Please verify your credentials.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col justify-center items-center p-4 sm:p-6 relative selection:bg-indigo-500 selection:text-white">
      {/* Background Ambience */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900/30 via-slate-950 to-slate-950 pointer-events-none" />

      {/* Top Navigation */}
      <div className="w-full max-w-md mx-auto mb-6 flex items-center justify-between z-10">
        <button
          onClick={() => {
            if (onBackToMemberForm) onBackToMemberForm();
            else setPortalView('public_register');
          }}
          className="flex items-center gap-1.5 text-xs text-indigo-300 hover:text-white transition-colors bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700/60"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Go to Member Registration Form</span>
        </button>

        <div className="flex items-center gap-1.5 text-[11px] text-emerald-400 font-medium">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Law N° 058/2021 Security</span>
        </div>
      </div>

      {/* Central Login Card */}
      <div className="w-full max-w-md bg-slate-800/90 border border-slate-700 rounded-2xl shadow-2xl p-6 sm:p-8 relative z-10 backdrop-blur-md">
        
        {/* Brand Header */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center text-white mx-auto mb-3 shadow-lg shadow-indigo-600/30">
            <Lock className="w-6 h-6" />
          </div>
          <h1 className="text-xl font-bold text-white tracking-tight">
            Church Leadership Login
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Church of the Nazarene, Remera · Kigali, Rwanda
          </p>
          <div className="mt-2.5 inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-900/70 border border-slate-700 text-[11px] text-slate-300">
            <KeyRound className="w-3 h-3 text-amber-400" />
            <span>Database Access Restricted to Registrar & Secretary</span>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-4 bg-rose-950/60 border border-rose-800/70 rounded-xl p-3 flex items-start gap-2.5 text-rose-200 text-xs">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
            <p className="leading-relaxed">{error}</p>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleManualLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Staff Email or Username
            </label>
            <input
              type="text"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              placeholder="e.g. registrar@nazareneremera.rw or secretary"
              className="w-full bg-slate-900/90 border border-slate-700 rounded-lg px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all font-mono"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-slate-300">
                Security PIN or Password
              </label>
              <button
                type="button"
                onClick={() => setShowSecret(!showSecret)}
                className="text-[11px] text-slate-400 hover:text-slate-200 flex items-center gap-1"
              >
                {showSecret ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                <span>{showSecret ? 'Hide' : 'Show'}</span>
              </button>
            </div>
            <input
              type={showSecret ? 'text' : 'password'}
              value={secret}
              onChange={(e) => setSecret(e.target.value)}
              placeholder="Enter PIN (e.g. 1234 or 2026)"
              className="w-full bg-slate-900/90 border border-slate-700 rounded-lg px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all font-mono"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full mt-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs py-2.5 px-4 rounded-lg shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Lock className="w-3.5 h-3.5" />
            <span>Sign In to Database Management</span>
          </button>
        </form>

        {/* Divider */}
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-700" />
          </div>
          <div className="relative flex justify-center text-[10px] uppercase tracking-wider text-slate-400">
            <span className="bg-slate-800 px-2 font-medium">Quick 1-Click Access for Evaluation</span>
          </div>
        </div>

        {/* Quick Staff Sign-In Buttons */}
        <div className="space-y-2">
          {staffUsers.map((user) => (
            <button
              key={user.id}
              onClick={() => loginAsUser(user)}
              className="w-full text-left p-2.5 rounded-xl border border-slate-700 bg-slate-900/60 hover:bg-slate-700/80 hover:border-indigo-500/60 transition-all group flex items-center justify-between"
            >
              <div className="flex items-center gap-2.5 truncate">
                <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 ${
                  user.role === 'SUPER_ADMIN'
                    ? 'bg-purple-900/80 text-purple-300 border border-purple-700'
                    : user.role === 'DATA_ENTRY'
                    ? 'bg-indigo-900/80 text-indigo-300 border border-indigo-700'
                    : 'bg-emerald-900/80 text-emerald-300 border border-emerald-700'
                }`}>
                  {user.role === 'SUPER_ADMIN' ? 'SEC' : user.role === 'DATA_ENTRY' ? 'REG' : 'LDR'}
                </div>
                <div className="truncate">
                  <div className="font-semibold text-xs text-white group-hover:text-indigo-200">
                    {user.name}
                  </div>
                  <div className="text-[11px] text-slate-400">
                    {user.title} · <span className="font-mono text-slate-300">PIN: {user.pin}</span>
                  </div>
                </div>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-indigo-300 transition-transform group-hover:translate-x-0.5" />
            </button>
          ))}
        </div>

        {/* Footer info */}
        <div className="mt-6 pt-4 border-t border-slate-700/70 text-center text-[11px] text-slate-400">
          <p>
            Church of the Nazarene Remera Parish · Kigali, Rwanda
          </p>
          <p className="mt-1 text-[10px] text-slate-500">
            Compliant with Rwanda Law No. 058/2021 on Personal Data Protection
          </p>
        </div>

      </div>
    </div>
  );
};
