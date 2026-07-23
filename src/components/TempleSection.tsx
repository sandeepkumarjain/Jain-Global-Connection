import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  MapPin,
  Clock,
  Compass,
  Video,
  Heart,
  ParkingCircle,
  Home,
  Phone,
  Search,
  Plus,
  ExternalLink,
  ShieldCheck,
  X,
  Sparkles,
  DollarSign
} from 'lucide-react';
import { TempleListing } from '../types';

export const TempleSection: React.FC = () => {
  const { temples, setIsRegModalOpen, showToast } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTemple, setSelectedTemple] = useState<TempleListing | null>(null);
  const [showLiveDarshan, setShowLiveDarshan] = useState(false);
  const [showDonationModal, setShowDonationModal] = useState(false);
  const [donationAmount, setDonationAmount] = useState('1100');

  const filtered = temples.filter((t) => {
    if (
      searchTerm &&
      !t.templeName.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !t.city.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !t.mainDeity.toLowerCase().includes(searchTerm.toLowerCase())
    ) {
      return false;
    }
    return true;
  });

  const handleDonation = () => {
    showToast('Donation Successful!', `Thank you for donating ₹ ${donationAmount} to ${selectedTemple?.templeName}. Tax exemption 80G receipt issued.`, 'success');
    setShowDonationModal(false);
  };

  return (
    <div className="space-y-6">
      
      {/* Banner */}
      <div className="bg-gradient-to-r from-amber-950 via-amber-900 to-slate-950 text-white rounded-2xl p-6 sm:p-8 shadow-xl border border-amber-800/40 relative overflow-hidden">
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-500/20 border border-amber-500/40 rounded-full text-amber-300 text-xs font-bold uppercase tracking-wider">
            <MapPin className="w-3.5 h-3.5 text-amber-400" />
            <span>Sacred Jain Tirth & Temple Directory</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold font-serif text-white">
            Discover Holy Jain Tirths, Timings, Dharamshala & Live Darshan
          </h2>

          <p className="text-xs sm:text-sm text-slate-300">
            Palitana, Shikharji, Ranakpur, Pawapuri, Girnar, and hundreds of city Jain Mandirs with Aarti schedules, lodging, and Google Maps directions.
          </p>

          <div className="pt-2">
            <button
              onClick={() => setIsRegModalOpen(true)}
              className="px-5 py-2.5 bg-gradient-to-r from-amber-500 to-amber-700 text-amber-950 font-bold text-xs rounded-xl shadow-lg hover:from-amber-600 hover:to-amber-800 transition-all flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span>Register Your Local Temple</span>
            </button>
          </div>
        </div>
      </div>

      {/* Search Input */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="relative">
          <input
            type="text"
            placeholder="Search Temple Name, Main Deity, City, or Tirth..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
        </div>
      </div>

      {/* Temple Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filtered.map((t) => (
          <div
            key={t.id}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-lg hover:border-amber-500/50 transition-all flex flex-col justify-between"
          >
            <div>
              {/* Image Banner */}
              <div className="relative h-48 overflow-hidden bg-slate-950">
                <img
                  src={t.images[0]}
                  alt={t.templeName}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
                
                <div className="absolute bottom-3 left-3 right-3 text-white">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 bg-amber-500 text-amber-950 text-[10px] font-black uppercase rounded">
                      {t.sect}
                    </span>
                    {t.isVerified && (
                      <span className="px-2 py-0.5 bg-emerald-600 text-white text-[10px] font-bold rounded flex items-center gap-1">
                        <ShieldCheck className="w-3 h-3" /> Verified Tirth
                      </span>
                    )}
                  </div>
                  <h3 className="text-lg font-bold font-serif text-white mt-1 truncate">
                    {t.templeName}
                  </h3>
                  <p className="text-xs text-amber-300 font-medium">Main Deity: {t.mainDeity}</p>
                </div>
              </div>

              {/* Details Content */}
              <div className="p-5 space-y-3 text-xs text-slate-600 dark:text-slate-300">
                <p className="line-clamp-2 italic bg-amber-50/50 dark:bg-amber-950/20 p-2.5 rounded-xl border border-amber-200/50 dark:border-amber-900/40">
                  "{t.history}"
                </p>

                <div className="grid grid-cols-2 gap-2">
                  <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                    <p className="text-[10px] font-bold text-slate-400">Temple Timings</p>
                    <p className="font-semibold text-slate-800 dark:text-slate-200">{t.timings}</p>
                  </div>
                  <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                    <p className="text-[10px] font-bold text-slate-400">Aarti Timings</p>
                    <p className="font-semibold text-amber-600 dark:text-amber-400">{t.aartiTimings}</p>
                  </div>
                </div>

                {/* Facilities Pills */}
                <div className="flex flex-wrap items-center gap-2 pt-1">
                  {t.hasAccommodation && (
                    <span className="px-2 py-1 bg-blue-50 dark:bg-blue-950 text-blue-800 dark:text-blue-300 rounded-lg text-[10px] font-bold flex items-center gap-1">
                      <Home className="w-3 h-3" /> Dharamshala ({t.dharamshalaRooms} Rooms)
                    </span>
                  )}
                  {t.hasParking && (
                    <span className="px-2 py-1 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg text-[10px] font-bold flex items-center gap-1">
                      <ParkingCircle className="w-3 h-3" /> Parking Available
                    </span>
                  )}
                </div>

                <p className="flex items-center gap-1.5 text-slate-500 pt-1">
                  <MapPin className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                  <span>{t.address}, {t.city}, {t.state}</span>
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="bg-slate-50 dark:bg-slate-800/60 p-3 border-t border-slate-200 dark:border-slate-800 grid grid-cols-3 gap-2 text-xs font-bold">
              <button
                onClick={() => {
                  setSelectedTemple(t);
                  setShowLiveDarshan(true);
                }}
                className="py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg flex items-center justify-center gap-1 shadow-sm"
              >
                <Video className="w-3.5 h-3.5" />
                <span>Live Darshan</span>
              </button>

              <button
                onClick={() => {
                  setSelectedTemple(t);
                  setShowDonationModal(true);
                }}
                className="py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg flex items-center justify-center gap-1 shadow-sm"
              >
                <Heart className="w-3.5 h-3.5 fill-white" />
                <span>Donate</span>
              </button>

              <a
                href={`https://maps.google.com/?q=${encodeURIComponent(t.templeName + ' ' + t.city)}`}
                target="_blank"
                rel="noreferrer"
                className="py-1.5 bg-slate-900 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-white rounded-lg flex items-center justify-center gap-1 hover:bg-slate-800"
              >
                <Compass className="w-3.5 h-3.5 text-amber-400" />
                <span>Directions</span>
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* Live Darshan Modal */}
      {showLiveDarshan && selectedTemple && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md">
          <div className="bg-slate-900 border border-amber-500/40 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl text-white space-y-4 p-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <h3 className="text-base font-bold font-serif flex items-center gap-2 text-amber-400">
                <Video className="w-5 h-5 text-red-500 animate-pulse" />
                Live Darshan Feed: {selectedTemple.templeName}
              </h3>
              <button onClick={() => setShowLiveDarshan(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Video Player Box */}
            <div className="relative aspect-video bg-black rounded-xl overflow-hidden border border-amber-900/50 flex items-center justify-center">
              <img
                src={selectedTemple.images[0]}
                alt={selectedTemple.templeName}
                className="w-full h-full object-cover opacity-80"
              />
              <div className="absolute inset-0 bg-slate-950/40 flex flex-col items-center justify-center text-center p-4">
                <Sparkles className="w-12 h-12 text-amber-400 animate-spin mb-2" />
                <p className="text-sm font-bold font-serif text-white">
                  🙏 Mangal Bhakti Live Darshan Stream Active
                </p>
                <p className="text-xs text-amber-300 mt-1">
                  Daily Pakshal Puja & Sandhya Aarti Stream from {selectedTemple.city}
                </p>
              </div>
            </div>

            <div className="text-xs text-slate-300 bg-slate-950 p-3 rounded-xl space-y-1">
              <p><span className="font-bold text-amber-400">Aarti Timings:</span> {selectedTemple.aartiTimings}</p>
              <p><span className="font-bold text-amber-400">Puja Timings:</span> {selectedTemple.pujaTimings}</p>
            </div>
          </div>
        </div>
      )}

      {/* Donation Modal */}
      {showDonationModal && selectedTemple && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="bg-white dark:bg-slate-900 border border-amber-300 dark:border-amber-800 rounded-2xl w-full max-w-md p-6 shadow-2xl space-y-4 text-slate-800 dark:text-slate-100">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-base font-bold font-serif text-amber-600 dark:text-amber-400">
                Temple Donation / Dev Dravya
              </h3>
              <button onClick={() => setShowDonationModal(false)} className="text-slate-400">
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300">
              Contributing towards the maintenance and worship at <span className="font-bold text-slate-900 dark:text-white">{selectedTemple.templeName}</span>.
            </p>

            <div className="space-y-2">
              <label className="text-xs font-bold">Select Donation Amount (₹)</label>
              <div className="grid grid-cols-4 gap-2 text-xs font-bold">
                {['501', '1100', '5100', '11000'].map((amt) => (
                  <button
                    key={amt}
                    onClick={() => setDonationAmount(amt)}
                    className={`py-2 rounded-lg border transition-all ${
                      donationAmount === amt
                        ? 'bg-amber-600 text-white border-amber-600'
                        : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-300 dark:border-slate-700'
                    }`}
                  >
                    ₹ {amt}
                  </button>
                ))}
              </div>
            </div>

            <div className="p-3 bg-amber-50 dark:bg-amber-950/40 rounded-xl border border-amber-200 dark:border-amber-800 text-xs text-amber-900 dark:text-amber-200">
              <p className="font-bold">UPI ID: {selectedTemple.donationUpi || 'temple.trust@upi'}</p>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1">
                80G Tax Exemption receipt will be emailed automatically after contribution.
              </p>
            </div>

            <button
              onClick={handleDonation}
              className="w-full py-3 bg-gradient-to-r from-amber-500 to-amber-700 text-amber-950 font-bold text-xs rounded-xl shadow-lg hover:from-amber-600 hover:to-amber-800 transition-all"
            >
              Confirm & Pay ₹ {donationAmount}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
