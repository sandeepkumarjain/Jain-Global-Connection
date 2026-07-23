import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  AlertCircle,
  HeartHandshake,
  Briefcase,
  Phone,
  Search,
  Plus,
  ShieldAlert,
  UserPlus
} from 'lucide-react';

export const EmergencyDirectory: React.FC = () => {
  const { bloodDonors, jobs, addBloodDonor, addJob, showToast } = useApp();

  const [selectedBloodGroup, setSelectedBloodGroup] = useState('All');
  const [donorName, setDonorName] = useState('');
  const [donorMobile, setDonorMobile] = useState('');
  const [donorCity, setDonorCity] = useState('');
  const [donorBloodGroup, setDonorBloodGroup] = useState('O+');
  const [showRegisterDonor, setShowRegisterDonor] = useState(false);

  const filteredDonors = bloodDonors.filter((d) => {
    if (selectedBloodGroup !== 'All' && d.bloodGroup !== selectedBloodGroup) return false;
    return true;
  });

  const handleRegisterDonor = (e: React.FormEvent) => {
    e.preventDefault();
    if (!donorName || !donorMobile) return;
    addBloodDonor({
      name: donorName,
      bloodGroup: donorBloodGroup,
      mobile: donorMobile,
      city: donorCity || 'Mumbai',
    });
    setDonorName('');
    setDonorMobile('');
    setDonorCity('');
    setShowRegisterDonor(false);
  };

  return (
    <div className="space-y-8">
      
      {/* Emergency Hotline Header */}
      <div className="bg-gradient-to-r from-red-950 via-slate-900 to-red-950 text-white p-6 sm:p-8 rounded-2xl border border-red-800/50 shadow-xl space-y-3">
        <div className="flex items-center gap-2 text-red-400 font-bold uppercase text-xs">
          <ShieldAlert className="w-5 h-5 animate-pulse" />
          <span>24/7 Jain Emergency Services & Blood Hotline</span>
        </div>
        <h2 className="text-2xl font-extrabold font-serif">
          Immediate Blood Donation & Medical Emergency Network
        </h2>
        <p className="text-xs text-slate-300">
          Connect directly with verified Jain blood donors and volunteer support teams across all major cities.
        </p>
      </div>

      {/* Blood Donor Search */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-lg space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-slate-100 dark:border-slate-800">
          <h3 className="text-sm font-bold uppercase text-slate-900 dark:text-white flex items-center gap-2">
            <HeartHandshake className="w-4 h-4 text-red-500" />
            Jain Emergency Blood Donor Search
          </h3>

          <button
            onClick={() => setShowRegisterDonor(!showRegisterDonor)}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-md"
          >
            <UserPlus className="w-4 h-4" />
            <span>Register as Blood Donor</span>
          </button>
        </div>

        {/* Blood Group Filter Chips */}
        <div className="flex flex-wrap gap-2">
          {['All', 'O+', 'A+', 'B+', 'AB+', 'O-', 'A-', 'B-', 'AB-'].map((bg) => (
            <button
              key={bg}
              onClick={() => setSelectedBloodGroup(bg)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                selectedBloodGroup === bg
                  ? 'bg-red-600 text-white shadow-md'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
              }`}
            >
              {bg}
            </button>
          ))}
        </div>

        {/* Register Form */}
        {showRegisterDonor && (
          <form onSubmit={handleRegisterDonor} className="p-4 bg-red-50 dark:bg-red-950/30 rounded-xl border border-red-200 dark:border-red-900/50 space-y-3 text-xs">
            <p className="font-bold text-red-900 dark:text-red-200">Register as a Volunteer Blood Donor</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <input
                type="text"
                placeholder="Full Name"
                value={donorName}
                onChange={(e) => setDonorName(e.target.value)}
                required
                className="p-2 rounded-lg bg-white dark:bg-slate-900 border"
              />
              <input
                type="text"
                placeholder="Mobile Number"
                value={donorMobile}
                onChange={(e) => setDonorMobile(e.target.value)}
                required
                className="p-2 rounded-lg bg-white dark:bg-slate-900 border"
              />
              <input
                type="text"
                placeholder="City (e.g. Mumbai)"
                value={donorCity}
                onChange={(e) => setDonorCity(e.target.value)}
                required
                className="p-2 rounded-lg bg-white dark:bg-slate-900 border"
              />
            </div>
            <button type="submit" className="px-4 py-2 bg-red-600 text-white font-bold rounded-lg">
              Save Donor Registration
            </button>
          </form>
        )}

        {/* Donor List */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
          {filteredDonors.map((d) => (
            <div
              key={d.id}
              className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2 text-xs"
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900 dark:text-white">{d.name}</span>
                <span className="px-2 py-0.5 bg-red-600 text-white font-black rounded text-[10px]">
                  {d.bloodGroup}
                </span>
              </div>

              <p className="text-slate-500">{d.city}, {d.state}</p>

              <a
                href={`tel:${d.mobile}`}
                className="w-full py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-bold flex items-center justify-center gap-1 shadow-sm mt-2"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>Call Donor</span>
              </a>
            </div>
          ))}
        </div>
      </div>

      {/* Career & Jobs Portal */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-lg space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <h3 className="text-sm font-bold uppercase text-slate-900 dark:text-white flex items-center gap-2">
            <Briefcase className="w-4 h-4 text-amber-500" />
            Jain Career & Job Opportunities
          </h3>
        </div>

        <div className="space-y-3">
          {jobs.map((j) => (
            <div
              key={j.id}
              className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs"
            >
              <div className="space-y-1">
                <h4 className="font-bold text-slate-900 dark:text-white text-sm">{j.title}</h4>
                <p className="text-amber-600 dark:text-amber-400 font-semibold">{j.company} • {j.location}</p>
                <p className="text-slate-500 text-[11px]">{j.description}</p>
                <span className="inline-block text-[10px] bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 px-2 py-0.5 rounded font-bold">
                  {j.salary}
                </span>
              </div>

              <a
                href={`mailto:${j.contactEmail}`}
                className="px-4 py-2 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 shrink-0 text-center"
              >
                Apply via Email
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
