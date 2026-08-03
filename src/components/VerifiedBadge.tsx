import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ShieldCheck, CheckCircle2, Award, Sparkles } from 'lucide-react';

interface VerifiedBadgeProps {
  type?: 'member' | 'business' | 'matrimonial' | 'admin';
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  customText?: string;
  className?: string;
  enableHeartbeat?: boolean;
}

export const VerifiedBadge: React.FC<VerifiedBadgeProps> = ({
  type = 'member',
  size = 'md',
  showText = false,
  customText,
  className = '',
  enableHeartbeat = true
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
          borderColor: 'border-amber-500/40',
          pingBg: 'bg-amber-400'
        };
      case 'matrimonial':
        return {
          label: customText || 'Verified Rishta Profile',
          tooltip: 'Family Background & Community Reference Verified',
          icon: Award,
          gradient: 'bg-gradient-to-r from-rose-500 to-amber-500 text-white',
          textColor: 'text-rose-500 dark:text-rose-400',
          borderColor: 'border-rose-500/40',
          pingBg: 'bg-rose-400'
        };
      case 'admin':
        return {
          label: customText || 'Trust Badge',
          tooltip: 'Official Community Administrator / Leader',
          icon: Sparkles,
          gradient: 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white',
          textColor: 'text-blue-500 dark:text-blue-400',
          borderColor: 'border-blue-500/40',
          pingBg: 'bg-blue-400'
        };
      case 'member':
      default:
        return {
          label: customText || 'Verified Member',
          tooltip: 'Verified Jain Sangha Member & Digital QR ID Card Holder',
          icon: CheckCircle2,
          gradient: 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white',
          textColor: 'text-emerald-500 dark:text-emerald-400',
          borderColor: 'border-emerald-500/40',
          pingBg: 'bg-emerald-400'
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
        <motion.span
          animate={
            enableHeartbeat
              ? {
                  scale: [1, 1.05, 1, 1.03, 1],
                }
              : {}
          }
          transition={{
            duration: 2.5,
            repeat: Infinity,
            repeatDelay: 1.5,
            ease: 'easeInOut',
          }}
          className={`relative inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-extrabold shadow-sm border ${details.borderColor} ${details.gradient} transition-transform group-hover:scale-105 overflow-hidden`}
        >
          {/* Heartbeat subtle halo aura effect */}
          {enableHeartbeat && (
            <motion.span
              className={`absolute inset-0 rounded-full ${details.pingBg} opacity-20 pointer-events-none`}
              animate={{
                scale: [1, 1.3, 1],
                opacity: [0.3, 0, 0.3],
              }}
              transition={{
                duration: 2.5,
                repeat: Infinity,
                repeatDelay: 1.5,
                ease: 'easeInOut',
              }}
            />
          )}

          <motion.span
            animate={
              enableHeartbeat
                ? {
                    scale: [1, 1.22, 1, 1.12, 1],
                  }
                : {}
            }
            transition={{
              duration: 2.5,
              repeat: Infinity,
              repeatDelay: 1.5,
              ease: 'easeInOut',
            }}
            className="inline-flex items-center justify-center shrink-0 z-10"
          >
            <IconComponent className={iconSizes[size]} />
          </motion.span>
          <span className="z-10">{details.label}</span>
        </motion.span>
      ) : (
        <motion.span
          animate={
            enableHeartbeat
              ? {
                  scale: [1, 1.2, 1, 1.1, 1],
                }
              : {}
          }
          transition={{
            duration: 2.5,
            repeat: Infinity,
            repeatDelay: 1.5,
            ease: 'easeInOut',
          }}
          className={`relative p-0.5 rounded-full ${details.textColor} hover:scale-125 transition-transform inline-flex items-center justify-center`}
          title={details.tooltip}
        >
          {enableHeartbeat && (
            <motion.span
              className={`absolute inset-0 rounded-full ${details.pingBg} opacity-30 pointer-events-none`}
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.4, 0, 0.4],
              }}
              transition={{
                duration: 2.5,
                repeat: Infinity,
                repeatDelay: 1.5,
                ease: 'easeInOut',
              }}
            />
          )}
          <IconComponent className={iconSizes[size]} />
        </motion.span>
      )}

      {/* Interactive Hover Tooltip */}
      {showTooltip && (
        <div className="absolute top-full left-0 mt-1.5 w-48 p-2.5 bg-slate-900 text-white text-[11px] rounded-xl shadow-2xl border border-slate-700 z-50 pointer-events-none space-y-1 drop-shadow-xl animate-fade-in">
          <div className="flex items-center gap-1.5 font-bold text-amber-300">
            <IconComponent className="w-3.5 h-3.5 shrink-0" />
            <span>{details.label}</span>
          </div>
          <p className="text-[10px] text-slate-300 leading-snug">{details.tooltip}</p>
          <div className="text-[9px] text-emerald-400 font-mono font-bold pt-0.5 border-t border-slate-800 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
            <span>Trust Verification Active</span>
          </div>
        </div>
      )}
    </div>
  );
};
