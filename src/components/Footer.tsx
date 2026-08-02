import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { PolicyModal } from './PolicyModal';
import {
  ShieldCheck,
  Heart,
  Building2,
  MapPin,
  Users,
  Phone,
  Mail,
  Lock,
  FileText,
  ArrowUp
} from 'lucide-react';

export const Footer: React.FC = () => {
  const { systemSettings, setActiveTab, setIsAuthModalOpen, isMatrimonialOnlyUser } = useApp();
  const [policyType, setPolicyType] = useState<'terms' | 'privacy' | null>(null);

  return (
    <footer className="bg-slate-950 text-slate-300 border-t border-amber-900/40 font-sans pt-12 pb-6 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 pb-10 border-b border-slate-800/80">
          
          {/* Column 1: Brand & Tagline */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-amber-700 p-0.5 shadow-lg">
                <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center font-serif text-amber-400 font-bold text-lg">
                  JC
                </div>
              </div>
              <div>
                <h3 className="text-lg font-serif font-bold text-white tracking-wide">JAIN CONNECT GLOBAL</h3>
                <p className="text-[10px] text-amber-400 font-medium">By SKJ Tech World</p>
              </div>
            </div>
            
            <p className="text-xs text-slate-400 leading-relaxed">
              {systemSettings.tagline} Connecting Jain families, businesses, temples, and NGOs globally under one sacred digital platform.
            </p>

            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-amber-950/60 border border-amber-800/40 rounded-lg text-amber-300 text-xs font-semibold">
              <ShieldCheck className="w-4 h-4 text-amber-400" />
              <span>Admin Approval Protected</span>
            </div>
          </div>

          {/* Column 2: Quick Directory Navigation */}
          <div>
            <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider mb-4 border-l-2 border-amber-500 pl-2">
              Global Directories
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <button
                  onClick={() => setActiveTab('matrimonial')}
                  className="hover:text-amber-400 transition-colors flex items-center gap-1.5"
                >
                  <Heart className="w-3.5 h-3.5 text-amber-500" />
                  <span>Jain Matrimonial Directory</span>
                </button>
              </li>
              {!isMatrimonialOnlyUser && (
                <>
                  <li>
                    <button
                      onClick={() => setActiveTab('business')}
                      className="hover:text-amber-400 transition-colors flex items-center gap-1.5"
                    >
                      <Building2 className="w-3.5 h-3.5 text-amber-500" />
                      <span>Jain Business Directory</span>
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => setActiveTab('temple')}
                      className="hover:text-amber-400 transition-colors flex items-center gap-1.5"
                    >
                      <MapPin className="w-3.5 h-3.5 text-amber-500" />
                      <span>Jain Temple Directory & Live Darshan</span>
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => setActiveTab('directory')}
                      className="hover:text-amber-400 transition-colors flex items-center gap-1.5"
                    >
                      <Users className="w-3.5 h-3.5 text-amber-500" />
                      <span>Jain Community Members Directory</span>
                    </button>
                  </li>
                </>
              )}
            </ul>
          </div>

          {/* Column 3: Features & Legal */}
          <div>
            <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider mb-4 border-l-2 border-amber-500 pl-2">
              Portals & Governance
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              {!isMatrimonialOnlyUser && (
                <>
                  <li>
                    <button
                      onClick={() => setActiveTab('panchang')}
                      className="hover:text-amber-400 transition-colors"
                    >
                      Jain Panchang & Choghadiya
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => setActiveTab('emergency')}
                      className="hover:text-amber-400 transition-colors"
                    >
                      Jain Emergency Blood Donor Directory
                    </button>
                  </li>
                </>
              )}
              <li>
                <button
                  onClick={() => setPolicyType('terms')}
                  className="hover:text-amber-400 text-slate-300 font-semibold transition-colors flex items-center gap-1.5"
                >
                  <FileText className="w-3.5 h-3.5 text-amber-500" />
                  <span>Terms & Conditions</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => setPolicyType('privacy')}
                  className="hover:text-amber-400 text-slate-300 font-semibold transition-colors flex items-center gap-1.5"
                >
                  <Lock className="w-3.5 h-3.5 text-amber-500" />
                  <span>Privacy Policy</span>
                </button>
              </li>
              <li className="pt-1">
                <button
                  onClick={() => setIsAuthModalOpen(true)}
                  className="text-amber-400 font-bold hover:underline flex items-center gap-1"
                >
                  <Lock className="w-3 h-3" />
                  <span>Admin Panel Login</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Column 4: Contact & Developed By */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider mb-4 border-l-2 border-amber-500 pl-2">
              Contact & Support
            </h4>
            <div className="text-xs text-slate-400 space-y-2">
              <p className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>{systemSettings.contactPhone}</span>
              </p>
              <p className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>{systemSettings.contactEmail}</span>
              </p>
              <p className="text-[11px] text-slate-500 mt-1">
                {systemSettings.address}
              </p>
            </div>

            <div className="pt-2">
              <p className="text-[11px] text-amber-300/80 font-bold">
                Developed by SKJ Tech World
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Bar Copyright & Policy Links */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-3">
          <p>© 2026 SKJ Tech World. All rights reserved.</p>
          <div className="flex items-center gap-4 text-xs font-medium">
            <button onClick={() => setPolicyType('terms')} className="hover:text-amber-400 transition">
              Terms & Conditions
            </button>
            <span>•</span>
            <button onClick={() => setPolicyType('privacy')} className="hover:text-amber-400 transition">
              Privacy Policy
            </button>
            <span>•</span>
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="text-amber-400 hover:text-amber-300 font-bold transition flex items-center gap-1 bg-amber-950/60 hover:bg-amber-900/80 px-2.5 py-1 rounded-full border border-amber-500/30"
            >
              <ArrowUp className="w-3.5 h-3.5" />
              <span>Back to Top</span>
            </button>
          </div>
        </div>
      </div>

      {/* Policy Modal Mount */}
      <PolicyModal
        isOpen={Boolean(policyType)}
        type={policyType}
        onClose={() => setPolicyType(null)}
      />
    </footer>
  );
};
