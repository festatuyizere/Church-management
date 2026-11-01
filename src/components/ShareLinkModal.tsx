/**
 * Share Registration Link Modal
 * Allows Church Leadership to share the official self-registration link to church members
 * via WhatsApp, direct link copy, or printable Sunday announcement.
 */

import React, { useState } from 'react';
import { useChurchData } from '../context/ChurchDataContext';
import {
  X,
  Share2,
  Copy,
  Check,
  ExternalLink,
  MessageCircle,
  Smartphone,
  ShieldCheck,
  QrCode,
  Printer,
  Sparkles,
} from 'lucide-react';

interface ShareLinkModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ShareLinkModal: React.FC<ShareLinkModalProps> = ({ isOpen, onClose }) => {
  const { shareableRegisterUrl, setPortalView, t } = useChurchData();
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(shareableRegisterUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const whatsappMessage = encodeURIComponent(
    `Muraho Bakristo bakundwa! Church of the Nazarene Remera (Kigali, Rwanda) irabasaba kwiyandikisha mu muryango w'Itorero mukoresheje iyi fishi: ${shareableRegisterUrl}\n\nDear Church Member, please submit your official registration into the Remera Nazarene church database here: ${shareableRegisterUrl}`
  );

  const handleOpenPublicPortal = () => {
    setPortalView('public_register');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-xl w-full border border-slate-200 shadow-2xl overflow-hidden my-auto animate-in fade-in duration-200 text-xs">
        
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-indigo-900 via-slate-900 to-indigo-950 text-white px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-md">
              <Share2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white tracking-tight">
                Share Church Member Registration Link
              </h2>
              <p className="text-xs text-indigo-200 mt-0.5">
                Church of the Nazarene, Remera · Kigali, Rwanda
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6">
          
          {/* Key Rule Callout */}
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-3.5 flex items-start gap-3 text-slate-700">
            <ShieldCheck className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
            <div className="space-y-1">
              <p className="font-semibold text-amber-900 text-xs">
                One-Way Submission & Database Protection
              </p>
              <p className="text-[11px] text-amber-800 leading-relaxed">
                When members open this link, they see the complete registration form directly. Once submitted, their records are stored into the Remera database and <strong className="font-semibold text-amber-950">permanently locked from member edits</strong>. Only authorized Church Leadership (Registrar & Secretary) can view, edit, or delete records.
              </p>
            </div>
          </div>

          {/* Shareable Link Box */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-slate-700">
              Official Public Registration URL
            </label>
            <div className="flex items-center gap-2">
              <div className="flex-1 bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs font-mono text-slate-800 truncate select-all">
                {shareableRegisterUrl}
              </div>
              <button
                onClick={handleCopy}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-lg font-semibold text-xs transition-colors shrink-0 shadow-sm ${
                  copied
                    ? 'bg-emerald-600 text-white'
                    : 'bg-indigo-600 hover:bg-indigo-500 text-white'
                }`}
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Link</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Quick Sharing Channels */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            {/* WhatsApp Direct Share */}
            <a
              href={`https://wa.me/?text=${whatsappMessage}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-3.5 rounded-xl border border-emerald-200 bg-emerald-50/50 hover:bg-emerald-50 text-emerald-900 transition-colors group"
            >
              <div className="w-9 h-9 rounded-lg bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-sm">
                <MessageCircle className="w-4 h-4" />
              </div>
              <div>
                <div className="font-semibold text-xs text-emerald-950 group-hover:text-emerald-700">
                  Share via WhatsApp
                </div>
                <div className="text-[11px] text-emerald-700 mt-0.5">
                  Send to church cell & fellowship groups
                </div>
              </div>
            </a>

            {/* Test Member Registration View */}
            <button
              onClick={handleOpenPublicPortal}
              className="flex items-center gap-3 p-3.5 rounded-xl border border-indigo-200 bg-indigo-50/50 hover:bg-indigo-50 text-indigo-900 transition-colors text-left group"
            >
              <div className="w-9 h-9 rounded-lg bg-indigo-600 text-white flex items-center justify-center shrink-0 shadow-sm">
                <ExternalLink className="w-4 h-4" />
              </div>
              <div>
                <div className="font-semibold text-xs text-indigo-950 group-hover:text-indigo-700">
                  Preview Congregant Form
                </div>
                <div className="text-[11px] text-indigo-700 mt-0.5">
                  Open registration portal as a church member
                </div>
              </div>
            </button>
          </div>

          {/* Sunday Bulletin Announcement Preview */}
          <div className="border border-slate-200 rounded-xl p-4 bg-slate-50/80 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                Sunday Service Bulletin Announcement (Sample)
              </span>
              <span className="text-[10px] text-slate-400">EN & RW</span>
            </div>
            <p className="text-xs text-slate-700 italic bg-white p-3 rounded-lg border border-slate-200 leading-relaxed font-sans">
              "Abakristo bose ba Nazarene Remera bakeneye kuzuza ifishi yo kwiyandikisha mu muryango w'Itorero. Kanda kuri iyi link yacu yo kwiyandikisha cyangwa uhe abakristo mu mudugudu: <span className="font-mono text-indigo-600 font-semibold">{shareableRegisterUrl}</span>. Data zose zirinzwe hashingiwe ku Mategeko y'u Rwanda No. 058/2021."
            </p>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="bg-slate-50 px-6 py-4 border-t border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2 text-slate-500 text-[11px]">
            <Smartphone className="w-3.5 h-3.5 text-indigo-600" />
            <span>Mobile-responsive registration for all smartphone users</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg font-semibold text-xs transition-colors"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
