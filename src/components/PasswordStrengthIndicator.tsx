import React from 'react';
import { Check, X, Shield, ShieldCheck, ShieldAlert } from 'lucide-react';
import { getPasswordStrengthScore } from '../utils/passwordStrength';

interface PasswordStrengthIndicatorProps {
  password: string;
  showCriteria?: boolean;
}

export const PasswordStrengthIndicator: React.FC<PasswordStrengthIndicatorProps> = ({
  password,
  showCriteria = true,
}) => {
  if (!password) return null;

  const strength = getPasswordStrengthScore(password);

  return (
    <div className="mt-2 space-y-1.5 transition-all">
      {/* Strength Header Bar */}
      <div className="flex items-center justify-between text-xs">
        <span className="font-bold text-slate-500 dark:text-slate-400 flex items-center gap-1">
          {strength.score >= 3 ? (
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
          ) : strength.score >= 2 ? (
            <Shield className="w-3.5 h-3.5 text-amber-500" />
          ) : (
            <ShieldAlert className="w-3.5 h-3.5 text-red-500" />
          )}
          Password Strength:
        </span>
        <span className={`font-black text-xs ${strength.color}`}>
          {strength.label}
        </span>
      </div>

      {/* Segmented Progress Bar */}
      <div className="grid grid-cols-4 gap-1.5 h-1.5 w-full">
        <div className={`h-full rounded-full transition-all duration-300 ${strength.score >= 1 ? strength.bgColor : 'bg-slate-200 dark:bg-slate-700'}`} />
        <div className={`h-full rounded-full transition-all duration-300 ${strength.score >= 2 ? strength.bgColor : 'bg-slate-200 dark:bg-slate-700'}`} />
        <div className={`h-full rounded-full transition-all duration-300 ${strength.score >= 3 ? strength.bgColor : 'bg-slate-200 dark:bg-slate-700'}`} />
        <div className={`h-full rounded-full transition-all duration-300 ${strength.score >= 4 ? strength.bgColor : 'bg-slate-200 dark:bg-slate-700'}`} />
      </div>

      {/* Criteria checklist */}
      {showCriteria && (
        <div className="grid grid-cols-2 gap-x-2 gap-y-1 pt-1 text-[11px]">
          <div className={`flex items-center gap-1 ${strength.criteria.minLength ? 'text-emerald-600 dark:text-emerald-400 font-semibold' : 'text-slate-400 dark:text-slate-500'}`}>
            {strength.criteria.minLength ? <Check className="w-3 h-3 shrink-0" /> : <X className="w-3 h-3 shrink-0" />}
            <span>8+ Characters</span>
          </div>
          <div className={`flex items-center gap-1 ${strength.criteria.hasUpper && strength.criteria.hasLower ? 'text-emerald-600 dark:text-emerald-400 font-semibold' : 'text-slate-400 dark:text-slate-500'}`}>
            {strength.criteria.hasUpper && strength.criteria.hasLower ? <Check className="w-3 h-3 shrink-0" /> : <X className="w-3 h-3 shrink-0" />}
            <span>Upper & Lowercase</span>
          </div>
          <div className={`flex items-center gap-1 ${strength.criteria.hasNumber ? 'text-emerald-600 dark:text-emerald-400 font-semibold' : 'text-slate-400 dark:text-slate-500'}`}>
            {strength.criteria.hasNumber ? <Check className="w-3 h-3 shrink-0" /> : <X className="w-3 h-3 shrink-0" />}
            <span>Number (0-9)</span>
          </div>
          <div className={`flex items-center gap-1 ${strength.criteria.hasSpecial ? 'text-emerald-600 dark:text-emerald-400 font-semibold' : 'text-slate-400 dark:text-slate-500'}`}>
            {strength.criteria.hasSpecial ? <Check className="w-3 h-3 shrink-0" /> : <X className="w-3 h-3 shrink-0" />}
            <span>Special Symbol (!@#$)</span>
          </div>
        </div>
      )}
    </div>
  );
};
