import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import {
  X,
  User,
  HeartHandshake,
  MapPin,
  Phone,
  Mail,
  ShieldCheck,
  Calendar,
  Building,
  CheckCircle2,
  AlertCircle,
  Save,
  Briefcase
} from 'lucide-react';

export const UserProfileModal: React.FC = () => {
  const {
    currentUser,
    isUserProfileModalOpen,
    setIsUserProfileModalOpen,
    updateUserProfile,
    bloodDonors,
  } = useApp();

  // Local form state initialized from currentUser
  const [fullName, setFullName] = useState('');
  const [mobile, setMobile] = useState('');
  const [email, setEmail] = useState('');
  const [city, setCity] = useState('Mumbai');
  const [state, setState] = useState('Maharashtra');
  const [address, setAddress] = useState('');
  const [occupation, setOccupation] = useState('');
  const [company, setCompany] = useState('');
  const [gotra, setGotra] = useState('');
  const [sect, setSect] = useState('Swetambar Murtipujak');

  // Blood Donor Settings
  const [isBloodDonor, setIsBloodDonor] = useState(false);
  const [bloodGroup, setBloodGroup] = useState('O+');
  const [donorCity, setDonorCity] = useState('Mumbai');
  const [donorState, setDonorState] = useState('Maharashtra');
  const [donorMobile, setDonorMobile] = useState('');
  const [donorAvailable, setDonorAvailable] = useState(true);
  const [lastDonatedDate, setLastDonatedDate] = useState('Ready to Donate');

  // Populate form state when currentUser or modal visibility changes
  useEffect(() => {
    if (currentUser) {
      const existingDonor = bloodDonors.find(
        (d) => d.userId === currentUser.id || d.name === currentUser.fullName
      );

      setFullName(currentUser.fullName || '');
      setMobile(currentUser.mobile || '');
      setEmail(currentUser.email || '');
      setCity(currentUser.city || 'Mumbai');
      setState(currentUser.state || 'Maharashtra');
      setAddress(currentUser.address || '');
      setOccupation(currentUser.occupation || '');
      setCompany(currentUser.company || '');
      setGotra(currentUser.gotra || '');
      setSect(currentUser.sect || 'Swetambar Murtipujak');

      setIsBloodDonor(currentUser.isBloodDonor ?? !!existingDonor ?? false);
      setBloodGroup(currentUser.bloodGroup || existingDonor?.bloodGroup || 'O+');
      setDonorCity(currentUser.donorCity || existingDonor?.city || currentUser.city || 'Mumbai');
      setDonorState(currentUser.donorState || existingDonor?.state || currentUser.state || 'Maharashtra');
      setDonorMobile(currentUser.donorMobile || existingDonor?.mobile || currentUser.mobile || '');
      setDonorAvailable(currentUser.donorAvailable ?? existingDonor?.available ?? true);
      setLastDonatedDate(currentUser.lastDonatedDate || existingDonor?.lastDonated || 'Ready to Donate');
    }
  }, [currentUser, isUserProfileModalOpen, bloodDonors]);

  if (!isUserProfileModalOpen || !currentUser) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    updateUserProfile(
      {
        fullName,
        mobile,
        email,
        city,
        state,
        address,
        occupation,
        company,
        gotra,
        sect,
        bloodGroup,
      },
      {
        isBloodDonor,
        bloodGroup,
        city: donorCity || city,
        state: donorState || state,
        mobile: donorMobile || mobile,
        available: donorAvailable,
        lastDonated: lastDonatedDate,
      }
    );

    setIsUserProfileModalOpen(false);
  };

  const bloodGroups = ['O+', 'A+', 'B+', 'AB+', 'O-', 'A-', 'B-', 'AB-'];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto animate-fade-in">
      <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 my-8 overflow-hidden">
        
        {/* Header */}
        <div className="p-5 sm:p-6 bg-gradient-to-r from-amber-600 via-amber-700 to-amber-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative w-12 h-12 rounded-full border-2 border-white/80 overflow-hidden shadow-md">
              <img
                src={currentUser.profilePhoto}
                alt={currentUser.fullName}
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold font-serif">{currentUser.fullName}</h2>
                {currentUser.isVerified && (
                  <span className="px-2 py-0.5 bg-emerald-500 text-white text-[10px] font-bold rounded-full flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3" /> Verified
                  </span>
                )}
              </div>
              <p className="text-xs text-amber-200 font-medium">
                {currentUser.role} • {currentUser.registrationType} Profile
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsUserProfileModalOpen(false)}
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-6 max-h-[80vh] overflow-y-auto">
          
          {/* Section 1: Basic Profile Info */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-amber-800 dark:text-amber-400 flex items-center gap-1.5 pb-2 border-b border-slate-100 dark:border-slate-800">
              <User className="w-4 h-4" />
              Member Profile Settings
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-medium"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Mobile Number *
                </label>
                <input
                  type="text"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  required
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-medium"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-medium"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  City *
                </label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => {
                    setCity(e.target.value);
                    if (!donorCity) setDonorCity(e.target.value);
                  }}
                  required
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-medium"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  State
                </label>
                <input
                  type="text"
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-medium"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Gotra / Family Lineage
                </label>
                <input
                  type="text"
                  value={gotra}
                  onChange={(e) => setGotra(e.target.value)}
                  placeholder="e.g. Bachhawat, Mehta, Shah"
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-medium"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Occupation / Profession
                </label>
                <input
                  type="text"
                  value={occupation}
                  onChange={(e) => setOccupation(e.target.value)}
                  placeholder="e.g. Software Engineer, Business Owner"
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-medium"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Jain Sect
                </label>
                <select
                  value={sect}
                  onChange={(e) => setSect(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-medium"
                >
                  <option value="Swetambar Murtipujak">Swetambar Murtipujak</option>
                  <option value="Swetambar Sthanakvasi">Swetambar Sthanakvasi</option>
                  <option value="Swetambar Terapanthi">Swetambar Terapanthi</option>
                  <option value="Digambar Bisapanthi">Digambar Bisapanthi</option>
                  <option value="Digambar Terapanthi">Digambar Terapanthi</option>
                  <option value="Digambar Taranpanthi">Digambar Taranpanthi</option>
                </select>
              </div>
            </div>
          </div>

          {/* Section 2: Blood Donor Registration & Settings */}
          <div className="p-5 bg-gradient-to-br from-red-50 via-white to-red-50/50 dark:from-red-950/40 dark:via-slate-900 dark:to-red-950/20 rounded-2xl border-2 border-red-200 dark:border-red-900/60 space-y-4">
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-red-200 dark:border-red-900/50">
              <div>
                <h3 className="text-sm font-extrabold text-red-900 dark:text-red-300 flex items-center gap-2">
                  <HeartHandshake className="w-5 h-5 text-red-600 animate-pulse" />
                  Jain Emergency Blood Donor Signup
                </h3>
                <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-0.5">
                  Save lives in your city during urgent medical emergencies.
                </p>
              </div>

              <label className="relative inline-flex items-center cursor-pointer shrink-0">
                <input
                  type="checkbox"
                  checked={isBloodDonor}
                  onChange={(e) => setIsBloodDonor(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-slate-600 peer-checked:bg-red-600"></div>
                <span className="ml-2 text-xs font-bold text-red-900 dark:text-red-200">
                  {isBloodDonor ? 'Active Blood Donor' : 'Not Registered'}
                </span>
              </label>
            </div>

            {isBloodDonor && (
              <div className="space-y-4 text-xs animate-fade-in pt-1">
                
                {/* Blood Group Selection Chips */}
                <div>
                  <label className="block font-bold text-slate-800 dark:text-slate-200 mb-2">
                    Select Your Blood Group *
                  </label>
                  <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
                    {bloodGroups.map((bg) => (
                      <button
                        type="button"
                        key={bg}
                        onClick={() => setBloodGroup(bg)}
                        className={`py-2 rounded-xl text-xs font-black transition-all ${
                          bloodGroup === bg
                            ? 'bg-red-600 text-white shadow-md ring-2 ring-red-400 scale-105'
                            : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 hover:bg-red-50 dark:hover:bg-red-950/40'
                        }`}
                      >
                        {bg}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Donor Contact & City Details */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Donor Location City *
                    </label>
                    <input
                      type="text"
                      value={donorCity}
                      onChange={(e) => setDonorCity(e.target.value)}
                      placeholder="e.g. Mumbai, Bikaner, Surat"
                      required
                      className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-medium"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Emergency Contact Phone Number *
                    </label>
                    <input
                      type="text"
                      value={donorMobile}
                      onChange={(e) => setDonorMobile(e.target.value)}
                      placeholder="+91 98000 00000"
                      required
                      className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-medium"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Availability Status
                    </label>
                    <div className="flex items-center gap-3 pt-1">
                      <button
                        type="button"
                        onClick={() => setDonorAvailable(true)}
                        className={`flex-1 py-2 px-3 rounded-xl border font-bold text-xs flex items-center justify-center gap-1.5 transition-all ${
                          donorAvailable
                            ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                            : 'bg-white dark:bg-slate-900 text-slate-600 border-slate-200 dark:border-slate-800'
                        }`}
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Available Now
                      </button>
                      <button
                        type="button"
                        onClick={() => setDonorAvailable(false)}
                        className={`flex-1 py-2 px-3 rounded-xl border font-bold text-xs flex items-center justify-center gap-1.5 transition-all ${
                          !donorAvailable
                            ? 'bg-amber-600 text-white border-amber-600 shadow-sm'
                            : 'bg-white dark:bg-slate-900 text-slate-600 border-slate-200 dark:border-slate-800'
                        }`}
                      >
                        <AlertCircle className="w-3.5 h-3.5" />
                        Temporarily Away
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Last Donated Date / Note
                    </label>
                    <input
                      type="text"
                      value={lastDonatedDate}
                      onChange={(e) => setLastDonatedDate(e.target.value)}
                      placeholder="e.g. 2026-05-10 or Ready First Time"
                      className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-medium"
                    />
                  </div>
                </div>

                <div className="p-3 bg-red-100/70 dark:bg-red-900/30 rounded-xl text-[11px] text-red-800 dark:text-red-200 flex items-start gap-2 border border-red-200 dark:border-red-800">
                  <ShieldCheck className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                  <span>
                    Your blood group and city will be listed in the Emergency Directory tab so community members in urgent need of blood can connect with you.
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Action Footer */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={() => setIsUserProfileModalOpen(false)}
              className="px-5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white font-bold text-xs shadow-lg flex items-center gap-2 transition-all"
            >
              <Save className="w-4 h-4" />
              <span>Save Profile & Donor Settings</span>
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};
