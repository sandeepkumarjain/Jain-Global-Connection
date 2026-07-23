import React from 'react';
import { useApp } from '../context/AppContext';
import {
  Crown,
  X,
  CheckCircle2,
  ShieldCheck,
  Zap,
  Sparkles
} from 'lucide-react';

export const MembershipModal: React.FC = () => {
  const { isMembershipModalOpen, setIsMembershipModalOpen, showToast } = useApp();

  if (!isMembershipModalOpen) return null;

  const handleSelectPlan = (planName: string) => {
    showToast('Membership Upgraded', `Thank you for subscribing to ${planName}. Gold Verified Badge active!`, 'success');
    setIsMembershipModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="bg-white dark:bg-slate-900 border border-amber-300 dark:border-amber-800 rounded-2xl w-full max-w-2xl p-6 shadow-2xl relative space-y-6 text-slate-800 dark:text-slate-100 max-h-[90vh] overflow-y-auto">
        
        <button
          onClick={() => setIsMembershipModalOpen(false)}
          className="absolute top-4 right-4 text-slate-400 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-amber-500 text-amber-950 flex items-center justify-center mx-auto shadow-lg">
            <Crown className="w-6 h-6 animate-bounce" />
          </div>
          <h3 className="text-2xl font-bold font-serif text-slate-900 dark:text-white">
            Jain Connect Global Verified Membership
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto">
            Get the Golden Verified Badge, Priority Matrimonial Contacts, Top Search Ranking for Business, and Exclusive Community Access.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          
          {/* Free Plan */}
          <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-3 text-xs flex flex-col justify-between">
            <div className="space-y-2">
              <h4 className="font-bold text-slate-800 dark:text-slate-200 text-sm">Community Basic</h4>
              <p className="text-2xl font-black text-slate-900 dark:text-white font-serif">Free</p>
              <ul className="space-y-1.5 text-slate-600 dark:text-slate-400">
                <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" /> Basic Directory Listing</li>
                <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" /> View Temples & Panchang</li>
                <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" /> Express Matrimonial Interest</li>
              </ul>
            </div>
            <button
              onClick={() => setIsMembershipModalOpen(false)}
              className="w-full py-2 bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold rounded-xl"
            >
              Current Plan
            </button>
          </div>

          {/* Gold Verified */}
          <div className="p-5 rounded-2xl bg-gradient-to-b from-amber-500/10 to-amber-600/20 border-2 border-amber-500 relative space-y-3 text-xs flex flex-col justify-between shadow-xl">
            <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 bg-amber-500 text-amber-950 font-black text-[9px] rounded-full uppercase tracking-wider">
              MOST POPULAR
            </span>

            <div className="space-y-2">
              <h4 className="font-bold text-amber-800 dark:text-amber-300 text-sm flex items-center gap-1">
                <ShieldCheck className="w-4 h-4 text-amber-500" />
                Gold Verified
              </h4>
              <p className="text-2xl font-black text-slate-900 dark:text-white font-serif">
                ₹ 999 <span className="text-xs font-normal text-slate-400">/ year</span>
              </p>
              <ul className="space-y-1.5 text-slate-700 dark:text-slate-300">
                <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-amber-500 shrink-0" /> Gold Verified Checkmark Badge</li>
                <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-amber-500 shrink-0" /> Direct Matrimonial Contact Numbers</li>
                <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-amber-500 shrink-0" /> Top Priority Business Search</li>
                <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-amber-500 shrink-0" /> Digital vCard & QR ID</li>
              </ul>
            </div>

            <button
              onClick={() => handleSelectPlan('Gold Verified Plan')}
              className="w-full py-2.5 bg-gradient-to-r from-amber-500 to-amber-700 text-amber-950 font-black rounded-xl shadow-lg hover:from-amber-600 hover:to-amber-800"
            >
              Upgrade to Gold
            </button>
          </div>

          {/* Royal Diamond */}
          <div className="p-5 rounded-2xl bg-slate-900 text-white border border-amber-500/40 space-y-3 text-xs flex flex-col justify-between">
            <div className="space-y-2">
              <h4 className="font-bold text-amber-400 text-sm flex items-center gap-1">
                <Crown className="w-4 h-4 text-amber-400" />
                Royal Diamond
              </h4>
              <p className="text-2xl font-black text-white font-serif">
                ₹ 2,499 <span className="text-xs font-normal text-slate-400">/ year</span>
              </p>
              <ul className="space-y-1.5 text-slate-300">
                <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0" /> All Gold Features Included</li>
                <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0" /> Homepage Banner Feature Ad</li>
                <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0" /> Personal Relationship Manager</li>
              </ul>
            </div>

            <button
              onClick={() => handleSelectPlan('Royal Diamond Plan')}
              className="w-full py-2 bg-amber-600 text-white font-bold rounded-xl hover:bg-amber-700"
            >
              Get Royal Diamond
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
