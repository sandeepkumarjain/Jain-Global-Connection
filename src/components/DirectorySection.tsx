import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Users,
  Search,
  MapPin,
  Briefcase,
  Phone,
  Mail,
  UserCheck,
  QrCode,
  ShieldCheck,
  Plus,
  X
} from 'lucide-react';
import { CommunityMemberProfile } from '../types';

export const DirectorySection: React.FC = () => {
  const { members, setIsRegModalOpen, showToast } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMember, setSelectedMember] = useState<CommunityMemberProfile | null>(null);
  const [showIDModal, setShowIDModal] = useState(false);

  const filtered = members.filter((m) => {
    if (
      searchTerm &&
      !m.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !m.surname.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !m.city.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !m.profession.toLowerCase().includes(searchTerm.toLowerCase())
    ) {
      return false;
    }
    return true;
  });

  return (
    <div className="space-y-6">
      
      {/* Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-amber-950 to-slate-950 text-white rounded-2xl p-6 sm:p-8 shadow-xl border border-amber-800/40 relative overflow-hidden">
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-500/20 border border-amber-500/40 rounded-full text-amber-300 text-xs font-bold uppercase tracking-wider">
            <Users className="w-3.5 h-3.5 text-amber-400" />
            <span>Jain Community Members Directory</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold font-serif text-white">
            Connecting Every Jain Family & Member Worldwide
          </h2>

          <p className="text-xs sm:text-sm text-slate-300">
            Find fellow Jains by City, Profession, Blood Group, and Family ties. Digital QR Community ID card verification for security.
          </p>

          <div className="pt-2">
            <button
              onClick={() => setIsRegModalOpen(true)}
              className="px-5 py-2.5 bg-gradient-to-r from-amber-500 to-amber-700 text-amber-950 font-bold text-xs rounded-xl shadow-lg hover:from-amber-600 hover:to-amber-800 transition-all flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span>Register Family Profile</span>
            </button>
          </div>
        </div>
      </div>

      {/* Search Input */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="relative">
          <input
            type="text"
            placeholder="Search Member Name, Profession, City or Blood Group..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
        </div>
      </div>

      {/* Member Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filtered.map((m) => (
          <div
            key={m.id}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-lg space-y-4 hover:border-amber-500/50 transition-all"
          >
            <div className="flex items-start gap-4">
              <img
                src={m.photoUrl}
                alt={m.name}
                className="w-16 h-16 rounded-full object-cover border-2 border-amber-400 shadow-md shrink-0"
              />

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <h3 className="text-base font-bold font-serif text-slate-900 dark:text-white truncate">
                    {m.name} {m.surname}
                  </h3>
                  {m.isVerified && (
                    <UserCheck className="w-4 h-4 text-emerald-500 shrink-0" title="Admin Verified" />
                  )}
                </div>

                <p className="text-xs font-bold text-amber-600 dark:text-amber-400 flex items-center gap-1 mt-0.5">
                  <Briefcase className="w-3.5 h-3.5" />
                  <span>{m.profession}</span>
                </p>

                <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1 mt-0.5">
                  <MapPin className="w-3.5 h-3.5 text-amber-500" />
                  <span>{m.city}, {m.state}, {m.country}</span>
                </p>

                {m.bloodGroup && (
                  <span className="inline-block mt-2 px-2 py-0.5 bg-red-50 dark:bg-red-950 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800 text-[10px] font-bold rounded">
                    Blood Group: {m.bloodGroup}
                  </span>
                )}
              </div>
            </div>

            {/* Family Members snippet */}
            {m.familyMembers && m.familyMembers.length > 0 && (
              <div className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl border border-slate-100 dark:border-slate-700 text-xs">
                <p className="font-bold text-slate-700 dark:text-slate-300 text-[11px] mb-1">
                  Family Members ({m.familyMembers.length}):
                </p>
                <div className="flex flex-wrap gap-1">
                  {m.familyMembers.map((fam, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded text-[10px]"
                    >
                      {fam.name} ({fam.relation})
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
              <button
                onClick={() => {
                  setSelectedMember(m);
                  setShowIDModal(true);
                }}
                className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-bold rounded-lg flex items-center gap-1 hover:bg-amber-100"
              >
                <QrCode className="w-3.5 h-3.5 text-amber-500" />
                <span>Digital ID Card</span>
              </button>

              <a
                href={`tel:${m.mobile}`}
                className="px-4 py-1.5 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-lg flex items-center gap-1 shadow-sm"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>Contact Member</span>
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* Digital ID Card Modal */}
      {showIDModal && selectedMember && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="bg-white dark:bg-slate-900 border border-amber-300 dark:border-amber-800 rounded-2xl w-full max-w-sm p-6 shadow-2xl relative text-slate-800 dark:text-slate-100 space-y-4 text-center">
            
            <button
              onClick={() => setShowIDModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            {/* ID Card Graphic */}
            <div className="bg-gradient-to-b from-amber-900 via-amber-950 to-slate-950 text-white p-5 rounded-2xl border border-amber-500/50 shadow-xl space-y-3">
              <div className="flex items-center justify-between border-b border-amber-500/30 pb-2">
                <span className="text-[10px] font-bold text-amber-400 tracking-wider">JAIN CONNECT GLOBAL</span>
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
              </div>

              <img
                src={selectedMember.photoUrl}
                alt={selectedMember.name}
                className="w-20 h-20 rounded-full mx-auto object-cover border-2 border-amber-400 shadow-md"
              />

              <div>
                <h4 className="text-lg font-bold font-serif">{selectedMember.name} {selectedMember.surname}</h4>
                <p className="text-xs text-amber-300">{selectedMember.profession}</p>
                <p className="text-[10px] text-slate-400 mt-0.5">{selectedMember.city}, {selectedMember.country}</p>
              </div>

              <div className="bg-white p-2 rounded-xl w-28 h-28 mx-auto flex items-center justify-center">
                <QrCode className="w-full h-full text-slate-950" />
              </div>

              <p className="text-[9px] text-amber-300 font-mono">
                MEMBER ID: JCG-MEM-{selectedMember.id.slice(-6).toUpperCase()}
              </p>
            </div>

            <button
              onClick={() => {
                showToast('ID Downloaded', 'Digital Jain Member ID saved to device.', 'success');
                setShowIDModal(false);
              }}
              className="w-full py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-xl shadow-md"
            >
              Save Digital ID Card
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
