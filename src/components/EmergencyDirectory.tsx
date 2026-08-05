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
  UserPlus,
  MapPin,
  MessageSquare,
  CheckCircle2,
  Filter,
  X,
  Mail,
  Trash2
} from 'lucide-react';

export const EmergencyDirectory: React.FC = () => {
  const {
    bloodDonors,
    jobs,
    addBloodDonor,
    deleteJob,
    businesses,
    currentUser,
    setIsUserProfileModalOpen,
    setIsAuthModalOpen,
    showToast,
    initiateCall
  } = useApp();

  const [selectedBloodGroup, setSelectedBloodGroup] = useState('All');
  const [selectedCity, setSelectedCity] = useState('All');
  const [citySearchInput, setCitySearchInput] = useState('');
  const [onlyAvailable, setOnlyAvailable] = useState(false);
  const [donorNameFilter, setDonorNameFilter] = useState('');

  const [donorName, setDonorName] = useState('');
  const [donorMobile, setDonorMobile] = useState('');
  const [donorCityInput, setDonorCityInput] = useState('');
  const [donorBloodGroup, setDonorBloodGroup] = useState('O+');
  const [showRegisterDonor, setShowRegisterDonor] = useState(false);

  // Extract unique cities from bloodDonors list
  const uniqueCities = Array.from(new Set(bloodDonors.map((d) => d.city).filter(Boolean)));

  const filteredDonors = bloodDonors.filter((d) => {
    // Blood Group Filter
    if (selectedBloodGroup !== 'All' && d.bloodGroup !== selectedBloodGroup) {
      return false;
    }
    // Selected City Pill Filter
    if (selectedCity !== 'All' && d.city.toLowerCase() !== selectedCity.toLowerCase()) {
      return false;
    }
    // City Search Box Filter
    if (citySearchInput.trim() && !d.city.toLowerCase().includes(citySearchInput.toLowerCase().trim())) {
      return false;
    }
    // Availability Filter
    if (onlyAvailable && !d.available) {
      return false;
    }
    // Name or Mobile Search
    if (donorNameFilter.trim()) {
      const q = donorNameFilter.toLowerCase().trim();
      const matchName = d.name.toLowerCase().includes(q);
      const matchCity = d.city.toLowerCase().includes(q);
      const matchMobile = d.mobile.includes(q);
      if (!matchName && !matchCity && !matchMobile) return false;
    }
    return true;
  });

  const handleRegisterDonor = (e: React.FormEvent) => {
    e.preventDefault();
    if (!donorName || !donorMobile) return;
    addBloodDonor({
      name: donorName,
      bloodGroup: donorBloodGroup,
      mobile: donorMobile,
      city: donorCityInput || 'Mumbai',
    });
    setDonorName('');
    setDonorMobile('');
    setDonorCityInput('');
    setShowRegisterDonor(false);
  };

  const handleOpenProfileSignup = () => {
    if (currentUser) {
      setIsUserProfileModalOpen(true);
    } else {
      setIsAuthModalOpen(true);
      showToast('Sign In Required', 'Please log in or register to set up your Blood Donor profile in settings.', 'info');
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* Emergency Hotline Header */}
      <div className="bg-gradient-to-r from-red-950 via-slate-900 to-red-950 text-white p-6 sm:p-8 rounded-3xl border border-red-800/50 shadow-2xl space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2 text-red-400 font-bold uppercase text-xs tracking-wider">
            <ShieldAlert className="w-5 h-5 animate-pulse text-red-500" />
            <span>24/7 Jain Emergency Services & Blood Hotline</span>
          </div>
          <span className="px-3 py-1 bg-red-900/80 text-red-200 border border-red-700/60 rounded-full text-[10px] font-bold uppercase tracking-widest">
            SKJ Tech Emergency Network
          </span>
        </div>

        <div className="space-y-2">
          <h2 className="text-2xl sm:text-3xl font-black font-serif tracking-tight">
            Immediate Blood Donation & Medical Emergency Network
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
            Connect directly with verified Jain blood donors and volunteer support teams across all major cities. Filter donors by blood group and city instantly.
          </p>
        </div>

        {/* Profile Settings Callout Banner */}
        <div className="p-4 bg-white/10 backdrop-blur-md rounded-2xl border border-white/15 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-red-600/80 flex items-center justify-center shrink-0">
              <HeartHandshake className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="font-bold text-white text-sm">Are you a Blood Donor?</p>
              <p className="text-slate-300 text-[11px]">
                Register or update your availability in your User Profile Settings to help save lives in your city.
              </p>
            </div>
          </div>

          <button
            onClick={handleOpenProfileSignup}
            className="w-full sm:w-auto px-5 py-3 min-h-[44px] bg-red-600 hover:bg-red-500 text-white font-bold rounded-xl text-xs transition-all shadow-lg shrink-0 flex items-center justify-center gap-2"
          >
            <UserPlus className="w-4 h-4" />
            <span>{currentUser ? 'Manage Donor in Profile' : 'Sign Up as Donor'}</span>
          </button>
        </div>
      </div>

      {/* Main Filtered Blood Donor Search Section */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xl space-y-6">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h3 className="text-base font-extrabold uppercase tracking-wide text-slate-900 dark:text-white flex items-center gap-2">
              <HeartHandshake className="w-5 h-5 text-red-600" />
              Emergency Blood Donor Search
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Filter by Blood Group & City to find active donors near you.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowRegisterDonor(!showRegisterDonor)}
              className="px-4 py-2.5 min-h-[44px] bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-800 dark:text-slate-200 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 border border-slate-200 dark:border-slate-700"
            >
              <Plus className="w-4 h-4 text-red-500" />
              <span>Quick Register Donor</span>
            </button>
          </div>
        </div>

        {/* Quick Registration Form */}
        {showRegisterDonor && (
          <form onSubmit={handleRegisterDonor} className="p-5 bg-red-50 dark:bg-red-950/30 rounded-2xl border border-red-200 dark:border-red-900/50 space-y-4 text-xs animate-fade-in">
            <div className="flex items-center justify-between">
              <p className="font-bold text-red-900 dark:text-red-200 text-sm flex items-center gap-1.5">
                <HeartHandshake className="w-4 h-4 text-red-600" />
                Quick Volunteer Blood Donor Registration
              </p>
              <button
                type="button"
                onClick={() => setShowRegisterDonor(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Full Name *</label>
                <input
                  type="text"
                  placeholder="e.g. Rahul Jain"
                  value={donorName}
                  onChange={(e) => setDonorName(e.target.value)}
                  required
                  className="w-full p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-medium"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Mobile Number *</label>
                <input
                  type="text"
                  placeholder="+91 98000 00000"
                  value={donorMobile}
                  onChange={(e) => setDonorMobile(e.target.value)}
                  required
                  className="w-full p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-medium"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">City *</label>
                <input
                  type="text"
                  placeholder="e.g. Mumbai, Bikaner, Surat"
                  value={donorCityInput}
                  onChange={(e) => setDonorCityInput(e.target.value)}
                  required
                  className="w-full p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-medium"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Blood Group *</label>
                <select
                  value={donorBloodGroup}
                  onChange={(e) => setDonorBloodGroup(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-bold"
                >
                  {['O+', 'A+', 'B+', 'AB+', 'O-', 'A-', 'B-', 'AB-'].map((bg) => (
                    <option key={bg} value={bg}>{bg}</option>
                  ))}
                </select>
              </div>
            </div>

            <button type="submit" className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl shadow-md">
              Save Blood Donor Registration
            </button>
          </form>
        )}

        {/* Filter Toolbar: Blood Group + City Filters */}
        <div className="space-y-4">
          
          {/* Filter Row 1: Blood Group Chips */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
              Filter by Blood Group:
            </label>
            <div className="flex flex-wrap gap-2">
              {['All', 'O+', 'A+', 'B+', 'AB+', 'O-', 'A-', 'B-', 'AB-'].map((bg) => (
                <button
                  key={bg}
                  onClick={() => setSelectedBloodGroup(bg)}
                  className={`px-4 py-2.5 min-h-[44px] rounded-xl text-xs font-extrabold transition-all flex items-center justify-center ${
                    selectedBloodGroup === bg
                      ? 'bg-red-600 text-white shadow-md ring-2 ring-red-400 scale-105'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-red-50 dark:hover:bg-red-950/40'
                  }`}
                >
                  {bg}
                </button>
              ))}
            </div>
          </div>

          {/* Filter Row 2: Search Inputs & City Pills */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            
            {/* City Search Bar */}
            <div className="relative">
              <input
                type="text"
                placeholder="Search City (e.g. Mumbai, Bikaner)..."
                value={citySearchInput}
                onChange={(e) => {
                  setCitySearchInput(e.target.value);
                  setSelectedCity('All');
                }}
                className="w-full pl-9 pr-8 py-3 min-h-[44px] text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-red-500/50"
              />
              <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
              {citySearchInput && (
                <button
                  onClick={() => setCitySearchInput('')}
                  className="absolute right-2.5 top-3 text-slate-400 hover:text-slate-600 p-1"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Donor Name or Phone Search */}
            <div className="relative">
              <input
                type="text"
                placeholder="Search Donor Name or Mobile..."
                value={donorNameFilter}
                onChange={(e) => setDonorNameFilter(e.target.value)}
                className="w-full pl-9 pr-8 py-3 min-h-[44px] text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-red-500/50"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
              {donorNameFilter && (
                <button
                  onClick={() => setDonorNameFilter('')}
                  className="absolute right-2.5 top-3 text-slate-400 hover:text-slate-600 p-1"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Availability Toggle */}
            <button
              onClick={() => setOnlyAvailable(!onlyAvailable)}
              className={`px-4 py-2.5 min-h-[44px] rounded-xl text-xs font-bold border transition-all flex items-center justify-center gap-2 ${
                onlyAvailable
                  ? 'bg-emerald-600 text-white border-emerald-600 shadow-md'
                  : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
              }`}
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{onlyAvailable ? 'Showing Available Now Only' : 'Filter Available Now'}</span>
            </button>
          </div>

          {/* Quick City Filter Pills */}
          <div className="flex flex-wrap items-center gap-1.5 pt-1 text-xs">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mr-1">Quick Cities:</span>
            {['All', ...uniqueCities].slice(0, 8).map((city) => (
              <button
                key={city}
                onClick={() => {
                  setSelectedCity(city);
                  setCitySearchInput('');
                }}
                className={`px-3.5 py-2 min-h-[44px] rounded-full text-[11px] font-semibold transition-all flex items-center justify-center ${
                  selectedCity === city && !citySearchInput
                    ? 'bg-slate-900 text-white dark:bg-amber-400 dark:text-slate-950 font-bold shadow-sm'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                }`}
              >
                {city}
              </button>
            ))}
          </div>
        </div>

        {/* Counter Header */}
        <div className="flex items-center justify-between text-xs font-bold text-slate-600 dark:text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800">
          <span>
            Found <strong className="text-red-600 dark:text-red-400">{filteredDonors.length}</strong> Registered Jain Blood Donors
            {selectedBloodGroup !== 'All' && ` (${selectedBloodGroup})`}
            {(selectedCity !== 'All' || citySearchInput) && ` in ${citySearchInput || selectedCity}`}
          </span>

          {(selectedBloodGroup !== 'All' || selectedCity !== 'All' || citySearchInput || donorNameFilter || onlyAvailable) && (
            <button
              onClick={() => {
                setSelectedBloodGroup('All');
                setSelectedCity('All');
                setCitySearchInput('');
                setDonorNameFilter('');
                setOnlyAvailable(false);
              }}
              className="text-red-600 dark:text-red-400 hover:underline flex items-center gap-1"
            >
              <X className="w-3.5 h-3.5" /> Clear All Filters
            </button>
          )}
        </div>

        {/* Filtered Donor Cards Grid */}
        {filteredDonors.length === 0 ? (
          <div className="p-8 text-center bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700 space-y-3">
            <AlertCircle className="w-8 h-8 text-slate-400 mx-auto" />
            <p className="font-bold text-slate-700 dark:text-slate-300 text-sm">
              No donors found matching selected blood group or city.
            </p>
            <p className="text-xs text-slate-500">
              Try changing your city or blood group filter, or register yourself as a volunteer blood donor.
            </p>
            <button
              onClick={handleOpenProfileSignup}
              className="px-4 py-2 bg-red-600 text-white font-bold text-xs rounded-xl inline-flex items-center gap-1.5 shadow-md"
            >
              <UserPlus className="w-4 h-4" />
              <span>Register as Volunteer Donor</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {filteredDonors.map((d) => (
              <div
                key={d.id}
                className="p-4 rounded-2xl bg-slate-50/80 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 hover:border-red-300 dark:hover:border-red-800 transition-all shadow-sm space-y-3 text-xs relative flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h4 className="font-bold text-slate-900 dark:text-white text-sm line-clamp-1">
                        {d.name}
                      </h4>
                      <p className="text-slate-500 dark:text-slate-400 text-[11px] flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3 h-3 text-red-500" />
                        {d.city}, {d.state}
                      </p>
                    </div>

                    <span className="px-2.5 py-1 bg-red-600 text-white font-black rounded-xl text-xs shadow-md shrink-0">
                      {d.bloodGroup}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 pt-1">
                    {d.available ? (
                      <span className="px-2 py-0.5 bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 font-bold rounded-md text-[10px] flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                        Available Now
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold rounded-md text-[10px]">
                        Temporarily Away
                      </span>
                    )}

                    {d.lastDonated && (
                      <span className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
                        • {d.lastDonated}
                      </span>
                    )}
                  </div>
                </div>

                {/* Communication Action Buttons */}
                <div className="grid grid-cols-2 gap-2 pt-3 border-t border-slate-200 dark:border-slate-700/60">
                  <button
                    onClick={() => initiateCall(d.mobile, d.name)}
                    className="py-2.5 min-h-[44px] bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold flex items-center justify-center gap-1 shadow-sm text-[11px] cursor-pointer"
                    title="Click to call emergency blood donor"
                  >
                    <Phone className="w-3.5 h-3.5 fill-current" />
                    <span>Call</span>
                  </button>

                  <a
                    href={`https://wa.me/${d.mobile.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Jai Jinendra ${d.name}, contacting you via Jain Connect Global Emergency Blood Network.`)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="py-2.5 min-h-[44px] bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold flex items-center justify-center gap-1 shadow-sm text-[11px]"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>WhatsApp</span>
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Career & Jobs Portal */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <h3 className="text-base font-extrabold uppercase tracking-wide text-slate-900 dark:text-white flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-amber-500" />
            Jain Career & Job Opportunities
          </h3>
        </div>

        <div className="space-y-3">
          {jobs.map((j) => {
            const myBusinesses = businesses.filter(
              (b) =>
                currentUser &&
                (b.ownerId === currentUser.id ||
                  (currentUser.email && b.email?.toLowerCase() === currentUser.email.toLowerCase()))
            );
            const isMyJob =
              currentUser &&
              (currentUser.role === 'admin' ||
                j.postedByUserId === currentUser.id ||
                (j.businessId && myBusinesses.some((b) => b.id === j.businessId)) ||
                (currentUser.email && j.contactEmail?.toLowerCase() === currentUser.email.toLowerCase()));

            return (
              <div
                key={j.id}
                className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-slate-900 dark:text-white text-sm">{j.title}</h4>
                    <span className="px-2 py-0.5 bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 font-bold text-[10px] rounded">
                      {j.type}
                    </span>
                  </div>
                  <p className="text-amber-600 dark:text-amber-400 font-semibold">{j.company} • {j.location}</p>
                  <p className="text-slate-500 text-[11px]">{j.description}</p>
                  <span className="inline-block text-[10px] bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 px-2 py-0.5 rounded font-bold">
                    {j.salary}
                  </span>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <a
                    href={`mailto:${j.contactEmail}`}
                    className="px-4 py-2.5 min-h-[44px] bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 text-center flex items-center justify-center gap-1.5"
                  >
                    <Mail className="w-3.5 h-3.5 text-amber-400" />
                    <span>Apply via Email</span>
                  </a>

                  {isMyJob && (
                    <button
                      onClick={() => {
                        if (window.confirm(`Are you sure you want to delete the job post "${j.title}"?`)) {
                          deleteJob(j.id);
                        }
                      }}
                      className="px-3 py-2.5 min-h-[44px] bg-red-100 text-red-700 dark:bg-red-950/80 dark:text-red-300 hover:bg-red-200 rounded-xl font-bold flex items-center justify-center gap-1 cursor-pointer"
                      title="Delete your job position"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Delete</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

