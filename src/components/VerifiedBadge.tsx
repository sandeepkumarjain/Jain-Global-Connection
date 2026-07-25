import React, { useState } from 'react';
import { ShieldCheck, CheckCircle2, Award, Sparkles } from 'lucide-react';

interface VerifiedBadgeProps {
  type?: 'member' | 'business' | 'matrimonial' | 'admin';
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  customText?: string;
  className?: string;
}

export const VerifiedBadge: React.FC<VerifiedBadgeProps> = ({
  type = 'member',
  size = 'md',
  showText = false,
  customText,
  className = ''
}) => {
  const [showTooltip, setShowTooltip] = useState(false);

  const getBadgeDetails = () => {
    switch (type) {
      case 'business':
        return {
          label: customText || 'Verified Business',
          tooltip: 'Verified Jain Chamber of Commerce & GST Listing',
          icon: ShieldCheck,
          gradient: 'bg-gradient-to-r from-amber-500 to-emerald-500 text-white',
          textColor: 'text-amber-500 dark:text-amber-400',
          borderColor: 'border-amber-500/40'
        };
      case 'matrimonial':
        return {
          label: customText || 'Verified Rishta Profile',
          tooltip: 'Family Background & Community Reference Verified',
          icon: Award,
          gradient: 'bg-gradient-to-r from-red-500 to-amber-500 text-white',
          textColor: 'text-red-500 dark:text-red-400',
          borderColor: 'border-red-500/40'
        };
      case 'admin':
        return {
          label: customText || 'Trust Badge',
          tooltip: 'Official Community Administrator / Leader',
          icon: Sparkles,
          gradient: 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white',
          textColor: 'text-blue-500 dark:text-blue-400',
          borderColor: 'border-blue-500/40'
        };
      case 'member':
      default:
        return {
          label: customText || 'Verified Jain Member',
          tooltip: 'Verified Jain Sangha Member & Digital QR ID Card Holder',
          icon: CheckCircle2,
          gradient: 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white',
          textColor: 'text-emerald-500 dark:text-emerald-400',
          borderColor: 'border-emerald-500/40'
        };
    }
  };

  const details = getBadgeDetails();
  const IconComponent = details.icon;

  const iconSizes = {
    sm: 'w-3.5 h-3.5',
    md: 'w-4 h-4',
    lg: 'w-5 h-5'
  };

  return (
    <div
      className={`relative inline-flex items-center group cursor-pointer ${className}`}
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
      onClick={(e) => {
        e.stopPropagation();
        setShowTooltip(!showTooltip);
      }}
    >
      {showText ? (
        <span
          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-extrabold shadow-sm border ${details.borderColor} ${details.gradient} transition-transform group-hover:scale-105`}
        >
          <IconComponent className={iconSizes[size]} />
          <span>{details.label}</span>
        </span>
      ) : (
        <span
          className={`p-0.5 rounded-full ${details.textColor} hover:scale-110 transition-transform inline-flex items-center justify-center`}
          title={details.tooltip}
        >
          <IconComponent className={iconSizes[size]} />
        </span>
      )}

      {/* Interactive Hover Tooltip */}
      {showTooltip && (
        <div className="absolute top-full left-0 mt-1.5 w-48 p-2.5 bg-slate-900 text-white text-[11px] rounded-xl shadow-2xl border border-slate-700 z-50 pointer-events-none space-y-1 drop-shadow-xl">
          <div className="flex items-center gap-1.5 font-bold text-amber-300">
            <IconComponent className="w-3.5 h-3.5 shrink-0" />
            <span>{details.label}</span>
          </div>
          <p className="text-[10px] text-slate-300 leading-snug">{details.tooltip}</p>
          <div className="text-[9px] text-emerald-400 font-mono font-bold pt-0.5 border-t border-slate-800 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>Trust Badge Active</span>
          </div>
        </div>
      )}
    </div>
  );
};
