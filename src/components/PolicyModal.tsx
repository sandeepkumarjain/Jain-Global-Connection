import React from 'react';
import { X, ShieldCheck, FileText, Lock, Copy, Check } from 'lucide-react';
import { useApp } from '../context/AppContext';

interface PolicyModalProps {
  isOpen: boolean;
  type: 'terms' | 'privacy' | null;
  onClose: () => void;
}

export const PolicyModal: React.FC<PolicyModalProps> = ({ isOpen, type, onClose }) => {
  const { systemSettings, showToast } = useApp();
  const [copied, setCopied] = React.useState(false);

  if (!isOpen || !type) return null;

  const isTerms = type === 'terms';
  const title = isTerms ? 'Terms & Conditions' : 'Privacy Policy';
  const content = isTerms
    ? systemSettings.termsAndConditions ||
      'Terms and conditions content is currently being updated by the administrator.'
    : systemSettings.privacyPolicy ||
      'Privacy policy content is currently being updated by the administrator.';

  const handleCopy = () => {
    navigator.clipboard.writeText(`${title} - ${systemSettings.appName}\n\n${content}`);
    setCopied(true);
    showToast('Copied to Clipboard', `${title} text copied.`, 'info');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 border border-amber-500/40 rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl space-y-6 relative my-8 text-slate-900 dark:text-slate-100">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 pb-4 border-b border-slate-200 dark:border-slate-800">
          <div className="p-3 bg-amber-500/10 rounded-2xl border border-amber-500/30 text-amber-500">
            {isTerms ? <FileText className="w-6 h-6" /> : <Lock className="w-6 h-6" />}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-widest text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950 px-2 py-0.5 rounded border border-amber-300">
                Official Legal Document
              </span>
              <span className="text-[10px] font-semibold text-slate-400">
                {systemSettings.appName}
              </span>
            </div>
            <h3 className="text-xl font-extrabold font-serif text-slate-900 dark:text-white mt-1">
              {title}
            </h3>
          </div>
        </div>

        {/* Modal Body / Text Content */}
        <div className="bg-slate-50 dark:bg-slate-800/60 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-700 dark:text-slate-300 space-y-4 max-h-[60vh] overflow-y-auto whitespace-pre-wrap leading-relaxed font-sans">
          {content}
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-800 gap-3">
          <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span>Authorized by {systemSettings.developerName} ({systemSettings.contactEmail})</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="px-3.5 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl font-bold text-xs flex items-center gap-1.5 transition"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'Copied' : 'Copy Text'}</span>
            </button>

            <button
              onClick={onClose}
              className="px-5 py-2 bg-amber-500 hover:bg-amber-600 text-amber-950 font-black text-xs rounded-xl shadow-md transition"
            >
              Close
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
