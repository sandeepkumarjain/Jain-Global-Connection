import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  X,
  UserPlus,
  Heart,
  Building2,
  MapPin,
  Users,
  ShieldCheck,
  Plus,
  Trash2,
  Sparkles,
  Info
} from 'lucide-react';
import { FamilyMember } from '../types';

export const RegisterModal: React.FC = () => {
  const {
    isRegModalOpen,
    setIsRegModalOpen,
    addMatrimonial,
    addBusiness,
    addTemple,
    addCommunityMember,
    registerUser,
    showToast
  } = useApp();

  const [panelType, setPanelType] = useState<'matrimonial' | 'business' | 'temple' | 'family'>('matrimonial');

  // Common Contact Info
  const [headFullName, setHeadFullName] = useState('');
  const [surname, setSurname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mobile, setMobile] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('Maharashtra');
  const [country, setCountry] = useState('India');
  const [pincode, setPincode] = useState('');
  const [address, setAddress] = useState('');
  const [sect, setSect] = useState('Swetambar Murtipujak');
  const [gotra, setGotra] = useState('');

  // 1. MATRIMONIAL SPECIFIC FIELDS
  const [candidateGender, setCandidateGender] = useState<'Groom' | 'Bride'>('Groom');
  const [candidateDob, setCandidateDob] = useState('1998-05-15');
  const [candidateAge, setCandidateAge] = useState('26');
  const [candidateHeight, setCandidateHeight] = useState("5'8\"");
  const [maritalStatus, setMaritalStatus] = useState('Never Married');
  const [subSect, setSubSect] = useState('');
  const [matQualification, setMatQualification] = useState('B.Tech / Engineering');
  const [matOccupation, setMatOccupation] = useState('Software Engineer');
  const [matCompany, setMatCompany] = useState('');
  const [matAnnualIncome, setMatAnnualIncome] = useState('₹ 15-25 Lakhs');
  const [matDiet, setMatDiet] = useState<'Strict Jain' | 'Pure Veg' | 'Vegan'>('Strict Jain');
  const [matAboutMe, setMatAboutMe] = useState('');
  const [matFamilyDetails, setMatFamilyDetails] = useState('');
  const [matPhotoUrl, setMatPhotoUrl] = useState('https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80');

  // 2. BUSINESS SPECIFIC FIELDS
  const [businessName, setBusinessName] = useState('');
  const [bizCategory, setBizCategory] = useState('Jewellery & Gems');
  const [gstNumber, setGstNumber] = useState('');
  const [bizDescription, setBizDescription] = useState('');
  const [productsServices, setProductsServices] = useState('Gold Jewellery, Diamond Solitaires, Custom Ornaments');
  const [googleMapUrl, setGoogleMapUrl] = useState('');
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [logoUrl, setLogoUrl] = useState('https://images.unsplash.com/photo-1560179707-f14e90ef3623?auto=format&fit=crop&w=600&q=80');
  const [galleryUrl, setGalleryUrl] = useState('https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=1200&q=80');

  // 3. TEMPLE SPECIFIC FIELDS
  const [templeName, setTempleName] = useState('');
  const [mainDeity, setMainDeity] = useState('Lord Mahavira');
  const [templeMapUrl, setTempleMapUrl] = useState('');
  const [timings, setTimings] = useState('6:00 AM - 9:00 PM');
  const [aartiTimings, setAartiTimings] = useState('Morning 7:00 AM & Evening 7:30 PM');
  const [pujaTimings, setPujaTimings] = useState('8:00 AM Daily Pakshal & Snatra Puja');
  const [templeHistory, setTempleHistory] = useState('Historical Jain Tirth crafted in white marble with carved pillars and serene atmosphere.');
  const [hasAccommodation, setHasAccommodation] = useState(true);
  const [dharamshalaRooms, setDharamshalaRooms] = useState('25');
  const [hasFoodFacility, setHasFoodFacility] = useState(true);
  const [hasParking, setHasParking] = useState(true);
  const [trustPerson, setTrustPerson] = useState('');
  const [trustPhone, setTrustPhone] = useState('');
  const [donationUpi, setDonationUpi] = useState('shrijaintemple@upi');
  const [liveDarshanUrl, setLiveDarshanUrl] = useState('');
  const [templePhotoUrl, setTemplePhotoUrl] = useState('https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=1200&q=80');

  // 4. JAIN FAMILY DIRECTORY SPECIFIC FIELDS
  const [bloodGroup, setBloodGroup] = useState('O+');
  const [familyHeadProfession, setFamilyHeadProfession] = useState('');
  const [familyHeadPhoto, setFamilyHeadPhoto] = useState('https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=600&q=80');
  const [familyMembersList, setFamilyMembersList] = useState<
    { name: string; relation: string; gender: string; age: string; qualification: string; occupation: string; bloodGroup: string }[]
  >([
    {
      name: '',
      relation: 'Spouse',
      gender: 'Female',
      age: '',
      qualification: '',
      occupation: '',
      bloodGroup: 'O+',
    },
  ]);

  if (!isRegModalOpen) return null;

  const handleAddFamilyMember = () => {
    setFamilyMembersList((prev) => [
      ...prev,
      {
        name: '',
        relation: 'Son',
        gender: 'Male',
        age: '',
        qualification: '',
        occupation: '',
        bloodGroup: 'O+',
      },
    ]);
  };

  const handleRemoveFamilyMember = (index: number) => {
    setFamilyMembersList((prev) => prev.filter((_, i) => i !== index));
  };

  const handleUpdateFamilyMember = (index: number, field: string, val: string) => {
    setFamilyMembersList((prev) =>
      prev.map((m, i) => (i === index ? { ...m, [field]: val } : m))
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (panelType === 'matrimonial') {
      addMatrimonial({
        fullName: headFullName || 'Jain Candidate',
        gender: candidateGender,
        dob: candidateDob,
        age: parseInt(candidateAge) || 26,
        height: candidateHeight || "5'8\"",
        maritalStatus,
        sect,
        subSect,
        gotra,
        qualification: matQualification,
        occupation: matOccupation,
        company: matCompany,
        annualIncome: matAnnualIncome,
        city: city || 'Mumbai',
        state: state || 'Maharashtra',
        country: country || 'India',
        dietPreference: matDiet,
        aboutMe: matAboutMe || 'Culture-oriented Jain candidate seeking a traditional partner.',
        familyDetails: matFamilyDetails || 'Respected Jain family.',
        contactMobile: mobile || '+91 98000 00000',
        contactEmail: email || 'candidate@jainconnect.org',
        photoUrl: matPhotoUrl,
        isVerified: true,
      });

      registerUser({
        fullName: headFullName || 'Jain Candidate',
        surname,
        email,
        password,
        mobile,
        whatsapp: whatsapp || mobile,
        registrationType: 'Marriage Profile',
        city,
        state,
        country,
        sect,
      });
    } else if (panelType === 'business') {
      addBusiness({
        businessName: businessName || 'Jain Enterprise',
        category: bizCategory,
        gstNumber,
        description: bizDescription || 'Established business adhering to ethical Jain principles.',
        productsAndServices: productsServices.split(',').map((s) => s.trim()).filter(Boolean),
        address: address || 'Main Market Road',
        city: city || 'Mumbai',
        state: state || 'Maharashtra',
        country: country || 'India',
        pincode,
        googleMapUrl,
        mobile: mobile || '+91 98000 00000',
        whatsapp: whatsapp || mobile || '+91 98000 00000',
        email: email || 'info@jainbusiness.org',
        website: websiteUrl,
        logoUrl,
        galleryUrls: [galleryUrl],
        isVerified: true,
      });

      registerUser({
        fullName: headFullName || businessName || 'Business Representative',
        surname,
        email,
        password,
        mobile,
        whatsapp: whatsapp || mobile,
        registrationType: 'Business',
        company: businessName,
        city,
        state,
        country,
      });
    } else if (panelType === 'temple') {
      addTemple({
        templeName: templeName || 'Shri Jain Temple',
        mainDeity: mainDeity || 'Lord Mahavira',
        sect,
        address: address || 'Temple Road',
        city: city || 'Mumbai',
        state: state || 'Maharashtra',
        country: country || 'India',
        timings: timings || '6:00 AM - 9:00 PM',
        aartiTimings: aartiTimings || 'Morning 7:00 AM & Evening 7:30 PM',
        pujaTimings: pujaTimings || '8:00 AM Daily Pakshal',
        history: templeHistory,
        hasAccommodation,
        dharamshalaRooms: parseInt(dharamshalaRooms) || 20,
        hasFoodFacility,
        hasParking,
        trustContactPerson: trustPerson || headFullName || 'Temple Management Trust',
        trustPhone: trustPhone || mobile || '+91 98000 00000',
        trustEmail: email,
        donationUpi,
        liveDarshanUrl,
        images: [templePhotoUrl],
        isVerified: true,
      });

      registerUser({
        fullName: headFullName || templeName || 'Temple Trustee',
        surname,
        email,
        password,
        mobile,
        registrationType: 'Temple',
        city,
        state,
        country,
      });
    } else if (panelType === 'family') {
      const parsedFamilyMembers: FamilyMember[] = familyMembersList
        .filter((m) => m.name.trim().length > 0)
        .map((m) => ({
          name: m.name,
          relation: m.relation,
          age: parseInt(m.age) || 25,
          occupation: m.occupation || 'Private Service',
          mobile,
        }));

      addCommunityMember({
        name: headFullName || 'Jain Head Member',
        surname: surname || '',
        city: city || 'Mumbai',
        state: state || 'Maharashtra',
        country: country || 'India',
        profession: familyHeadProfession || 'Business Owner',
        bloodGroup,
        mobile: mobile || '+91 98000 00000',
        email: email || 'family@jainconnect.org',
        photoUrl: familyHeadPhoto,
        familyMembers: parsedFamilyMembers,
        address: address || '',
        isVerified: true,
      });

      registerUser({
        fullName: headFullName || 'Jain Family Head',
        surname,
        email,
        password,
        mobile,
        whatsapp: whatsapp || mobile,
        registrationType: 'Individual',
        city,
        state,
        country,
        sect,
      });
    }

    setIsRegModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md">
      <div className="bg-white dark:bg-slate-900 border border-amber-300 dark:border-amber-800 rounded-3xl w-full max-w-3xl p-5 sm:p-7 shadow-2xl relative space-y-5 text-slate-800 dark:text-slate-100 max-h-[92vh] overflow-y-auto">
        
        {/* Close Button */}
        <button
          onClick={() => setIsRegModalOpen(false)}
          className="absolute top-4 right-4 p-1.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 hover:text-slate-900 dark:hover:text-white transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-600 dark:text-amber-400 text-xs font-bold uppercase tracking-wider">
            <UserPlus className="w-3.5 h-3.5" />
            <span>Jain Connect Global Official Registration</span>
          </div>
          <h3 className="text-2xl font-extrabold font-serif text-slate-900 dark:text-white">
            Register Your Panel Listing
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Choose your category below. Each panel features specialized fields for authentic record management.
          </p>
        </div>

        {/* 4 Specialized Category Selector Tabs */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 p-1.5 bg-slate-100 dark:bg-slate-800/80 rounded-2xl text-xs font-bold">
          <button
            type="button"
            onClick={() => setPanelType('matrimonial')}
            className={`flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-xl transition-all ${
              panelType === 'matrimonial'
                ? 'bg-amber-600 text-white shadow-md'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            <Heart className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">Matrimonial</span>
          </button>

          <button
            type="button"
            onClick={() => setPanelType('business')}
            className={`flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-xl transition-all ${
              panelType === 'business'
                ? 'bg-amber-600 text-white shadow-md'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            <Building2 className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">Business</span>
          </button>

          <button
            type="button"
            onClick={() => setPanelType('temple')}
            className={`flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-xl transition-all ${
              panelType === 'temple'
                ? 'bg-amber-600 text-white shadow-md'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            <MapPin className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">Temple Directory</span>
          </button>

          <button
            type="button"
            onClick={() => setPanelType('family')}
            className={`flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-xl transition-all ${
              panelType === 'family'
                ? 'bg-amber-600 text-white shadow-md'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            <Users className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">Jain Directory</span>
          </button>
        </div>

        {/* Dynamic Form Body */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          
          {/* SECTION A: APPLICANT / HEAD REPRESENTATIVE CONTACT INFO (COMMON) */}
          <div className="bg-slate-50 dark:bg-slate-800/60 p-4 rounded-2xl border border-slate-200 dark:border-slate-700/60 space-y-3">
            <h4 className="font-extrabold text-sm text-amber-700 dark:text-amber-400 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4" />
              <span>
                {panelType === 'matrimonial' && 'Candidate / Primary Contact Info'}
                {panelType === 'business' && 'Business Owner / Representative Contact Info'}
                {panelType === 'temple' && 'Trustee / Temple Contact Person Info'}
                {panelType === 'family' && 'Head of Family Member Details'}
              </span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-bold mb-1 text-slate-700 dark:text-slate-200">
                  {panelType === 'family' ? 'Head Member First Name' : 'Full Name'} *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Parasmal Bachhawat"
                  value={headFullName}
                  onChange={(e) => setHeadFullName(e.target.value)}
                  required
                  className="w-full p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700"
                />
              </div>

              <div>
                <label className="block font-bold mb-1 text-slate-700 dark:text-slate-200">Surname / Caste *</label>
                <input
                  type="text"
                  placeholder="e.g. Bachhawat / Shah / Jain"
                  value={surname}
                  onChange={(e) => setSurname(e.target.value)}
                  required
                  className="w-full p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700"
                />
              </div>

              <div>
                <label className="block font-bold mb-1 text-slate-700 dark:text-slate-200">Contact Email *</label>
                <input
                  type="email"
                  placeholder="email@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700"
                />
              </div>

              <div>
                <label className="block font-bold mb-1 text-slate-700 dark:text-slate-200">Create Account Password *</label>
                <input
                  type="password"
                  placeholder="Create a strong password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700"
                />
              </div>

              <div>
                <label className="block font-bold mb-1 text-slate-700 dark:text-slate-200">Mobile Number *</label>
                <input
                  type="text"
                  placeholder="+91 98200 00000"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  required
                  className="w-full p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700"
                />
              </div>

              <div>
                <label className="block font-bold mb-1 text-slate-700 dark:text-slate-200">WhatsApp Number</label>
                <input
                  type="text"
                  placeholder="+91 98200 00000"
                  value={whatsapp}
                  onChange={(e) => setWhatsapp(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700"
                />
              </div>

              <div>
                <label className="block font-bold mb-1 text-slate-700 dark:text-slate-200">Jain Sect *</label>
                <select
                  value={sect}
                  onChange={(e) => setSect(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-bold text-amber-700 dark:text-amber-400"
                >
                  <option value="Swetambar Murtipujak">Swetambar Murtipujak</option>
                  <option value="Swetambar Sthanakvasi">Swetambar Sthanakvasi</option>
                  <option value="Swetambar Terapanthi">Swetambar Terapanthi</option>
                  <option value="Digambar Bisapanthi">Digambar Bisapanthi</option>
                  <option value="Digambar Terapanthi">Digambar Terapanthi</option>
                  <option value="Digambar Taranpanthi">Digambar Taranpanthi</option>
                  <option value="Other">Other Jain Sect</option>
                </select>
              </div>

              <div>
                <label className="block font-bold mb-1 text-slate-700 dark:text-slate-200">City *</label>
                <input
                  type="text"
                  placeholder="e.g. Mumbai / Surat / Jaipur"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  required
                  className="w-full p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700"
                />
              </div>

              <div>
                <label className="block font-bold mb-1 text-slate-700 dark:text-slate-200">State & Country</label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    placeholder="State"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700"
                  />
                  <input
                    type="text"
                    placeholder="Country"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* PANEL 1: MATRIMONIAL DETAILED FORM */}
          {panelType === 'matrimonial' && (
            <div className="bg-red-50/50 dark:bg-red-950/20 p-4 rounded-2xl border border-red-200 dark:border-red-900/50 space-y-3">
              <h4 className="font-extrabold text-sm text-red-700 dark:text-red-400 flex items-center gap-1.5">
                <Heart className="w-4 h-4 fill-red-500" />
                <span>Complete Candidate Biodata & Matrimonial Details</span>
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold mb-1 text-slate-700 dark:text-slate-200">Gender *</label>
                  <select
                    value={candidateGender}
                    onChange={(e) => setCandidateGender(e.target.value as any)}
                    className="w-full p-2.5 rounded-xl bg-white dark:bg-slate-900 border font-bold text-slate-800 dark:text-slate-100"
                  >
                    <option value="Groom">Groom (Looking for Bride)</option>
                    <option value="Bride">Bride (Looking for Groom)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold mb-1 text-slate-700 dark:text-slate-200">Date of Birth</label>
                  <input
                    type="date"
                    value={candidateDob}
                    onChange={(e) => setCandidateDob(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-white dark:bg-slate-900 border"
                  />
                </div>

                <div>
                  <label className="block font-bold mb-1 text-slate-700 dark:text-slate-200">Age & Height</label>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="number"
                      placeholder="Age (Yrs)"
                      value={candidateAge}
                      onChange={(e) => setCandidateAge(e.target.value)}
                      className="w-full p-2.5 rounded-xl bg-white dark:bg-slate-900 border"
                    />
                    <input
                      type="text"
                      placeholder="e.g. 5'8&quot;"
                      value={candidateHeight}
                      onChange={(e) => setCandidateHeight(e.target.value)}
                      className="w-full p-2.5 rounded-xl bg-white dark:bg-slate-900 border"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold mb-1 text-slate-700 dark:text-slate-200">Marital Status</label>
                  <select
                    value={maritalStatus}
                    onChange={(e) => setMaritalStatus(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-white dark:bg-slate-900 border"
                  >
                    <option value="Never Married">Never Married</option>
                    <option value="Divorced">Divorced</option>
                    <option value="Widowed">Widowed</option>
                    <option value="Awaiting Divorce">Awaiting Divorce</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold mb-1 text-slate-700 dark:text-slate-200">Gotra & Sub-Sect</label>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      placeholder="Gotra"
                      value={gotra}
                      onChange={(e) => setGotra(e.target.value)}
                      className="w-full p-2.5 rounded-xl bg-white dark:bg-slate-900 border"
                    />
                    <input
                      type="text"
                      placeholder="Sub-Sect"
                      value={subSect}
                      onChange={(e) => setSubSect(e.target.value)}
                      className="w-full p-2.5 rounded-xl bg-white dark:bg-slate-900 border"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold mb-1 text-slate-700 dark:text-slate-200">Diet Preference</label>
                  <select
                    value={matDiet}
                    onChange={(e) => setMatDiet(e.target.value as any)}
                    className="w-full p-2.5 rounded-xl bg-white dark:bg-slate-900 border font-bold"
                  >
                    <option value="Strict Jain">Strict Jain (No Root Vegetables)</option>
                    <option value="Pure Veg">Pure Vegetarian</option>
                    <option value="Vegan">Vegan</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold mb-1 text-slate-700 dark:text-slate-200">Highest Qualification</label>
                  <input
                    type="text"
                    placeholder="e.g. B.Tech / CA / MBA / MBBS"
                    value={matQualification}
                    onChange={(e) => setMatQualification(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-white dark:bg-slate-900 border"
                  />
                </div>

                <div>
                  <label className="block font-bold mb-1 text-slate-700 dark:text-slate-200">Occupation & Company</label>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      placeholder="Occupation"
                      value={matOccupation}
                      onChange={(e) => setMatOccupation(e.target.value)}
                      className="w-full p-2.5 rounded-xl bg-white dark:bg-slate-900 border"
                    />
                    <input
                      type="text"
                      placeholder="Company Name"
                      value={matCompany}
                      onChange={(e) => setMatCompany(e.target.value)}
                      className="w-full p-2.5 rounded-xl bg-white dark:bg-slate-900 border"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold mb-1 text-slate-700 dark:text-slate-200">Annual Income</label>
                  <select
                    value={matAnnualIncome}
                    onChange={(e) => setMatAnnualIncome(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-white dark:bg-slate-900 border font-bold"
                  >
                    <option value="₹ 5-10 Lakhs">₹ 5-10 Lakhs</option>
                    <option value="₹ 10-20 Lakhs">₹ 10-20 Lakhs</option>
                    <option value="₹ 20-50 Lakhs">₹ 20-50 Lakhs</option>
                    <option value="₹ 50 Lakhs - 1 Crore">₹ 50 Lakhs - 1 Crore</option>
                    <option value="₹ 1 Crore+">₹ 1 Crore+</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold mb-1 text-slate-700 dark:text-slate-200">About Candidate & Partner Expectations</label>
                <textarea
                  rows={2}
                  placeholder="Describe personality, values, hobbies, and partner expectations..."
                  value={matAboutMe}
                  onChange={(e) => setMatAboutMe(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-white dark:bg-slate-900 border"
                />
              </div>

              <div>
                <label className="block font-bold mb-1 text-slate-700 dark:text-slate-200">Family Background Details</label>
                <textarea
                  rows={2}
                  placeholder="Father's profession, Mother's profile, native town, business background..."
                  value={matFamilyDetails}
                  onChange={(e) => setMatFamilyDetails(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-white dark:bg-slate-900 border"
                />
              </div>

              <div>
                <label className="block font-bold mb-1 text-slate-700 dark:text-slate-200">Candidate Photo URL</label>
                <input
                  type="text"
                  placeholder="https://images.unsplash.com/..."
                  value={matPhotoUrl}
                  onChange={(e) => setMatPhotoUrl(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-white dark:bg-slate-900 border"
                />
              </div>
            </div>
          )}

          {/* PANEL 2: BUSINESS DIRECTORY DETAILED FORM */}
          {panelType === 'business' && (
            <div className="bg-amber-50/50 dark:bg-amber-950/20 p-4 rounded-2xl border border-amber-200 dark:border-amber-900/50 space-y-3">
              <h4 className="font-extrabold text-sm text-amber-800 dark:text-amber-400 flex items-center gap-1.5">
                <Building2 className="w-4 h-4 text-amber-500" />
                <span>Complete Business & Commercial Entity Details</span>
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className="block font-bold mb-1 text-slate-700 dark:text-slate-200">Business / Firm Name *</label>
                  <input
                    type="text"
                    placeholder="e.g. Shah Jewellers & Sons Pvt Ltd"
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    required
                    className="w-full p-2.5 rounded-xl bg-white dark:bg-slate-900 border font-bold"
                  />
                </div>

                <div>
                  <label className="block font-bold mb-1 text-slate-700 dark:text-slate-200">Category *</label>
                  <select
                    value={bizCategory}
                    onChange={(e) => setBizCategory(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-white dark:bg-slate-900 border font-bold text-amber-700 dark:text-amber-400"
                  >
                    <option value="Jewellery & Gems">Jewellery & Gems</option>
                    <option value="CA & Financial Advisory">CA & Financial Advisory</option>
                    <option value="IT & Software Services">IT & Software Services</option>
                    <option value="Real Estate & Construction">Real Estate & Construction</option>
                    <option value="Manufacturing & Industrial">Manufacturing & Industrial</option>
                    <option value="Textiles & Garments">Textiles & Garments</option>
                    <option value="Healthcare & Pharma">Healthcare & Pharma</option>
                    <option value="Food & Hospitality">Food & Hospitality</option>
                    <option value="Legal Services">Legal Services</option>
                    <option value="Retail & Supermarket">Retail & Supermarket</option>
                    <option value="Other">Other Category</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold mb-1 text-slate-700 dark:text-slate-200">GST Number</label>
                  <input
                    type="text"
                    placeholder="e.g. 27AAAAA0000A1Z5"
                    value={gstNumber}
                    onChange={(e) => setGstNumber(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-white dark:bg-slate-900 border font-mono"
                  />
                </div>

                <div>
                  <label className="block font-bold mb-1 text-slate-700 dark:text-slate-200">Website URL</label>
                  <input
                    type="text"
                    placeholder="https://www.jainbusiness.com"
                    value={websiteUrl}
                    onChange={(e) => setWebsiteUrl(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-white dark:bg-slate-900 border"
                  />
                </div>

                <div>
                  <label className="block font-bold mb-1 text-slate-700 dark:text-slate-200">Pincode</label>
                  <input
                    type="text"
                    placeholder="400001"
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-white dark:bg-slate-900 border"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold mb-1 text-slate-700 dark:text-slate-200">Full Business Address *</label>
                <input
                  type="text"
                  placeholder="Shop No. 12, Commercial Complex, Ring Road..."
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  required
                  className="w-full p-2.5 rounded-xl bg-white dark:bg-slate-900 border"
                />
              </div>

              <div>
                <label className="block font-bold mb-1 text-slate-700 dark:text-slate-200">Google Maps Location Link URL</label>
                <input
                  type="text"
                  placeholder="https://maps.google.com/..."
                  value={googleMapUrl}
                  onChange={(e) => setGoogleMapUrl(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-white dark:bg-slate-900 border"
                />
              </div>

              <div>
                <label className="block font-bold mb-1 text-slate-700 dark:text-slate-200">Business Description</label>
                <textarea
                  rows={2}
                  placeholder="Overview of business operations, history, specialities..."
                  value={bizDescription}
                  onChange={(e) => setBizDescription(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-white dark:bg-slate-900 border"
                />
              </div>

              <div>
                <label className="block font-bold mb-1 text-slate-700 dark:text-slate-200">Products & Services Offered (Comma-separated)</label>
                <input
                  type="text"
                  placeholder="e.g. Export, Wholesale, Custom Manufacturing, Advisory"
                  value={productsServices}
                  onChange={(e) => setProductsServices(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-white dark:bg-slate-900 border"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold mb-1 text-slate-700 dark:text-slate-200">Business Logo Image URL</label>
                  <input
                    type="text"
                    placeholder="https://..."
                    value={logoUrl}
                    onChange={(e) => setLogoUrl(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-white dark:bg-slate-900 border"
                  />
                </div>
                <div>
                  <label className="block font-bold mb-1 text-slate-700 dark:text-slate-200">Store / Gallery Image URL</label>
                  <input
                    type="text"
                    placeholder="https://..."
                    value={galleryUrl}
                    onChange={(e) => setGalleryUrl(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-white dark:bg-slate-900 border"
                  />
                </div>
              </div>
            </div>
          )}

          {/* PANEL 3: TEMPLE DIRECTORY DETAILED FORM WITH LOCATION */}
          {panelType === 'temple' && (
            <div className="bg-emerald-50/50 dark:bg-emerald-950/20 p-4 rounded-2xl border border-emerald-200 dark:border-emerald-900/50 space-y-3">
              <h4 className="font-extrabold text-sm text-emerald-800 dark:text-emerald-400 flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-emerald-500" />
                <span>Holy Jain Temple / Tirth Derasar Details with Location</span>
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className="block font-bold mb-1 text-slate-700 dark:text-slate-200">Temple / Tirth Name *</label>
                  <input
                    type="text"
                    placeholder="e.g. Shri Godiji Parshwanath Jain Derasar"
                    value={templeName}
                    onChange={(e) => setTempleName(e.target.value)}
                    required
                    className="w-full p-2.5 rounded-xl bg-white dark:bg-slate-900 border font-bold"
                  />
                </div>

                <div>
                  <label className="block font-bold mb-1 text-slate-700 dark:text-slate-200">Main Deity (Mulnayak) *</label>
                  <select
                    value={mainDeity}
                    onChange={(e) => setMainDeity(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-white dark:bg-slate-900 border font-bold text-emerald-700 dark:text-emerald-400"
                  >
                    <option value="Lord Mahavira">Lord Mahavira</option>
                    <option value="Lord Parshvanath">Lord Parshvanath</option>
                    <option value="Lord Adinath (Rishabhdev)">Lord Adinath (Rishabhdev)</option>
                    <option value="Lord Neminath">Lord Neminath</option>
                    <option value="Lord Shantinath">Lord Shantinath</option>
                    <option value="Lord Vasupujya">Lord Vasupujya</option>
                    <option value="Lord Chandraprabhu">Lord Chandraprabhu</option>
                    <option value="Other">Other Tirthankar</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold mb-1 text-slate-700 dark:text-slate-200">Complete Address & Location *</label>
                <input
                  type="text"
                  placeholder="Derasar Road, Near Railway Station..."
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  required
                  className="w-full p-2.5 rounded-xl bg-white dark:bg-slate-900 border"
                />
              </div>

              <div>
                <label className="block font-bold mb-1 text-slate-700 dark:text-slate-200">Google Maps / Geo Location URL *</label>
                <input
                  type="text"
                  placeholder="https://maps.google.com/..."
                  value={templeMapUrl}
                  onChange={(e) => setTempleMapUrl(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-white dark:bg-slate-900 border"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold mb-1 text-slate-700 dark:text-slate-200">Derasar Timings</label>
                  <input
                    type="text"
                    placeholder="e.g. 6:00 AM - 9:00 PM"
                    value={timings}
                    onChange={(e) => setTimings(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-white dark:bg-slate-900 border"
                  />
                </div>

                <div>
                  <label className="block font-bold mb-1 text-slate-700 dark:text-slate-200">Aarti Timings</label>
                  <input
                    type="text"
                    placeholder="e.g. Morning 7:00 AM & Evening 7:30 PM"
                    value={aartiTimings}
                    onChange={(e) => setAartiTimings(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-white dark:bg-slate-900 border"
                  />
                </div>

                <div>
                  <label className="block font-bold mb-1 text-slate-700 dark:text-slate-200">Puja / Pakshal Timings</label>
                  <input
                    type="text"
                    placeholder="e.g. 8:00 AM Daily Pakshal"
                    value={pujaTimings}
                    onChange={(e) => setPujaTimings(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-white dark:bg-slate-900 border"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold mb-1 text-slate-700 dark:text-slate-200">Temple History & Significance</label>
                <textarea
                  rows={2}
                  placeholder="Historical heritage, miracles, architecture, trust history..."
                  value={templeHistory}
                  onChange={(e) => setTempleHistory(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-white dark:bg-slate-900 border"
                />
              </div>

              {/* Temple Facilities Checklist */}
              <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border space-y-2">
                <span className="font-bold text-slate-800 dark:text-slate-200">Temple Facilities & Services</span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <label className="flex items-center gap-2 cursor-pointer font-semibold">
                    <input
                      type="checkbox"
                      checked={hasAccommodation}
                      onChange={(e) => setHasAccommodation(e.target.checked)}
                      className="rounded text-amber-600 w-4 h-4"
                    />
                    <span>Dharamshala / Lodging</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer font-semibold">
                    <input
                      type="checkbox"
                      checked={hasFoodFacility}
                      onChange={(e) => setHasFoodFacility(e.target.checked)}
                      className="rounded text-amber-600 w-4 h-4"
                    />
                    <span>Bhojanashala (Jain Food)</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer font-semibold">
                    <input
                      type="checkbox"
                      checked={hasParking}
                      onChange={(e) => setHasParking(e.target.checked)}
                      className="rounded text-amber-600 w-4 h-4"
                    />
                    <span>Parking Facility</span>
                  </label>
                </div>

                {hasAccommodation && (
                  <div className="pt-2">
                    <label className="block font-bold mb-1 text-slate-700 dark:text-slate-200">Number of Dharamshala Rooms</label>
                    <input
                      type="number"
                      value={dharamshalaRooms}
                      onChange={(e) => setDharamshalaRooms(e.target.value)}
                      className="w-full sm:w-48 p-2 rounded-lg bg-slate-50 dark:bg-slate-800 border"
                    />
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold mb-1 text-slate-700 dark:text-slate-200">Trust Contact Person</label>
                  <input
                    type="text"
                    placeholder="Name"
                    value={trustPerson}
                    onChange={(e) => setTrustPerson(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-white dark:bg-slate-900 border"
                  />
                </div>

                <div>
                  <label className="block font-bold mb-1 text-slate-700 dark:text-slate-200">Trust Phone / Mobile</label>
                  <input
                    type="text"
                    placeholder="+91..."
                    value={trustPhone}
                    onChange={(e) => setTrustPhone(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-white dark:bg-slate-900 border"
                  />
                </div>

                <div>
                  <label className="block font-bold mb-1 text-slate-700 dark:text-slate-200">Devotional Donation UPI ID</label>
                  <input
                    type="text"
                    placeholder="jaintemple@upi"
                    value={donationUpi}
                    onChange={(e) => setDonationUpi(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-white dark:bg-slate-900 border font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold mb-1 text-slate-700 dark:text-slate-200">Live Darshan Video Stream URL</label>
                  <input
                    type="text"
                    placeholder="https://youtube.com/..."
                    value={liveDarshanUrl}
                    onChange={(e) => setLiveDarshanUrl(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-white dark:bg-slate-900 border"
                  />
                </div>

                <div>
                  <label className="block font-bold mb-1 text-slate-700 dark:text-slate-200">Temple Photo URL</label>
                  <input
                    type="text"
                    placeholder="https://..."
                    value={templePhotoUrl}
                    onChange={(e) => setTemplePhotoUrl(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-white dark:bg-slate-900 border"
                  />
                </div>
              </div>
            </div>
          )}

          {/* PANEL 4: JAIN DIRECTORY (WHOLE FAMILY DETAILS) */}
          {panelType === 'family' && (
            <div className="bg-slate-100 dark:bg-slate-800/80 p-4 rounded-2xl border border-slate-300 dark:border-slate-700 space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-700">
                <h4 className="font-extrabold text-sm text-slate-900 dark:text-white flex items-center gap-1.5">
                  <Users className="w-4 h-4 text-amber-500" />
                  <span>Jain Directory Census & Whole Family Tree Details</span>
                </h4>
                <span className="text-[11px] bg-amber-500/20 text-amber-700 dark:text-amber-300 px-2 py-0.5 rounded font-bold">
                  {familyMembersList.length + 1} Total Family Members
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold mb-1 text-slate-700 dark:text-slate-200">Head Blood Group</label>
                  <select
                    value={bloodGroup}
                    onChange={(e) => setBloodGroup(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-white dark:bg-slate-900 border font-bold text-red-600"
                  >
                    {['O+', 'A+', 'B+', 'AB+', 'O-', 'A-', 'B-', 'AB-'].map((bg) => (
                      <option key={bg} value={bg}>
                        {bg}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold mb-1 text-slate-700 dark:text-slate-200">Head Profession / Occupation</label>
                  <input
                    type="text"
                    placeholder="e.g. Business Owner / CA / Engineer"
                    value={familyHeadProfession}
                    onChange={(e) => setFamilyHeadProfession(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-white dark:bg-slate-900 border"
                  />
                </div>

                <div>
                  <label className="block font-bold mb-1 text-slate-700 dark:text-slate-200">Gotra</label>
                  <input
                    type="text"
                    placeholder="Gotra Name"
                    value={gotra}
                    onChange={(e) => setGotra(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-white dark:bg-slate-900 border"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold mb-1 text-slate-700 dark:text-slate-200">Residential Address *</label>
                <input
                  type="text"
                  placeholder="Full Residential Address, Society, Street..."
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  required
                  className="w-full p-2.5 rounded-xl bg-white dark:bg-slate-900 border"
                />
              </div>

              <div>
                <label className="block font-bold mb-1 text-slate-700 dark:text-slate-200">Head Member Photo URL</label>
                <input
                  type="text"
                  placeholder="https://..."
                  value={familyHeadPhoto}
                  onChange={(e) => setFamilyHeadPhoto(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-white dark:bg-slate-900 border"
                />
              </div>

              {/* DYNAMIC FAMILY MEMBERS LIST */}
              <div className="space-y-3 pt-2 border-t border-slate-200 dark:border-slate-700">
                <div className="flex items-center justify-between">
                  <div>
                    <h5 className="font-extrabold text-xs text-amber-700 dark:text-amber-400 uppercase tracking-wider">
                      Family Members List ({familyMembersList.length})
                    </h5>
                    <p className="text-[10px] text-slate-500">Add all living family members residing with the household.</p>
                  </div>

                  <button
                    type="button"
                    onClick={handleAddFamilyMember}
                    className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-xl flex items-center gap-1 shadow-sm"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Family Member</span>
                  </button>
                </div>

                {familyMembersList.length === 0 ? (
                  <p className="text-slate-400 italic text-[11px] py-2 text-center">
                    No additional family members added yet. Click &quot;Add Family Member&quot; to include spouse, children, or parents.
                  </p>
                ) : (
                  <div className="space-y-3">
                    {familyMembersList.map((m, idx) => (
                      <div
                        key={idx}
                        className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 relative space-y-2.5 shadow-sm"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-slate-800 dark:text-slate-200 text-[11px]">
                            Member #{idx + 1}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleRemoveFamilyMember(idx)}
                            className="p-1 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-lg transition-colors"
                            title="Remove Member"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                          <div>
                            <label className="block text-[10px] font-bold text-slate-500">Member Name *</label>
                            <input
                              type="text"
                              placeholder="Full Name"
                              value={m.name}
                              onChange={(e) => handleUpdateFamilyMember(idx, 'name', e.target.value)}
                              required
                              className="w-full p-2 rounded-lg bg-slate-50 dark:bg-slate-800 border"
                            />
                          </div>

                          <div>
                            <label className="block text-[10px] font-bold text-slate-500">Relation to Head *</label>
                            <select
                              value={m.relation}
                              onChange={(e) => handleUpdateFamilyMember(idx, 'relation', e.target.value)}
                              className="w-full p-2 rounded-lg bg-slate-50 dark:bg-slate-800 border font-semibold"
                            >
                              <option value="Spouse">Spouse</option>
                              <option value="Son">Son</option>
                              <option value="Daughter">Daughter</option>
                              <option value="Father">Father</option>
                              <option value="Mother">Mother</option>
                              <option value="Brother">Brother</option>
                              <option value="Sister">Sister</option>
                              <option value="Daughter-in-law">Daughter-in-law</option>
                              <option value="Son-in-law">Son-in-law</option>
                              <option value="Grandchild">Grandchild</option>
                              <option value="Other">Other Relation</option>
                            </select>
                          </div>

                          <div>
                            <label className="block text-[10px] font-bold text-slate-500">Gender & Age</label>
                            <div className="grid grid-cols-2 gap-1">
                              <select
                                value={m.gender}
                                onChange={(e) => handleUpdateFamilyMember(idx, 'gender', e.target.value)}
                                className="w-full p-2 rounded-lg bg-slate-50 dark:bg-slate-800 border"
                              >
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                              </select>
                              <input
                                type="number"
                                placeholder="Age"
                                value={m.age}
                                onChange={(e) => handleUpdateFamilyMember(idx, 'age', e.target.value)}
                                className="w-full p-2 rounded-lg bg-slate-50 dark:bg-slate-800 border"
                              />
                            </div>
                          </div>

                          <div>
                            <label className="block text-[10px] font-bold text-slate-500">Qualification</label>
                            <input
                              type="text"
                              placeholder="Education"
                              value={m.qualification}
                              onChange={(e) => handleUpdateFamilyMember(idx, 'qualification', e.target.value)}
                              className="w-full p-2 rounded-lg bg-slate-50 dark:bg-slate-800 border"
                            />
                          </div>

                          <div>
                            <label className="block text-[10px] font-bold text-slate-500">Occupation</label>
                            <input
                              type="text"
                              placeholder="Profession / Student"
                              value={m.occupation}
                              onChange={(e) => handleUpdateFamilyMember(idx, 'occupation', e.target.value)}
                              className="w-full p-2 rounded-lg bg-slate-50 dark:bg-slate-800 border"
                            />
                          </div>

                          <div>
                            <label className="block text-[10px] font-bold text-slate-500">Blood Group</label>
                            <select
                              value={m.bloodGroup}
                              onChange={(e) => handleUpdateFamilyMember(idx, 'bloodGroup', e.target.value)}
                              className="w-full p-2 rounded-lg bg-slate-50 dark:bg-slate-800 border font-bold text-red-600"
                            >
                              {['O+', 'A+', 'B+', 'AB+', 'O-', 'A-', 'B-', 'AB-'].map((bg) => (
                                <option key={bg} value={bg}>
                                  {bg}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Admin Verification Notice */}
          <div className="p-3 bg-amber-50 dark:bg-amber-950/40 rounded-2xl border border-amber-300 dark:border-amber-800 text-[11px] text-amber-900 dark:text-amber-200 flex items-center gap-2.5 shadow-inner">
            <Info className="w-5 h-5 text-amber-500 shrink-0" />
            <span>
              All submissions are verified by Super Admin before public badge display.
            </span>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-3.5 bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 hover:from-amber-600 hover:to-amber-800 text-amber-950 font-black text-xs rounded-2xl shadow-xl transition-all flex items-center justify-center gap-2 uppercase tracking-wider"
          >
            <UserPlus className="w-4 h-4" />
            <span>Submit {panelType.toUpperCase()} Application for Verification</span>
          </button>
        </form>
      </div>
    </div>
  );
};
