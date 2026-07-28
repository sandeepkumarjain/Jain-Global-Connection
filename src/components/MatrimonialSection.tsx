import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { VerifiedBadge } from './VerifiedBadge';
import {
  Heart,
  Filter,
  CheckCircle,
  FileText,
  MessageCircle,
  MapPin,
  Briefcase,
  GraduationCap,
  ShieldCheck,
  UserCheck,
  Search,
  Sparkles,
  Download,
  X,
  Upload
} from 'lucide-react';
import { MatrimonialProfile } from '../types';

export const MatrimonialSection: React.FC = () => {
  const { matrimonials, sendInterest, currentUser, showToast, openRegistrationModal, updateMatrimonialProfile } = useApp();

  const [genderFilter, setGenderFilter] = useState<'All' | 'Bride' | 'Groom'>('All');
  const [sectFilter, setSectFilter] = useState<string>('All');
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState<MatrimonialProfile | null>(null);
  const [showBiodataModal, setShowBiodataModal] = useState(false);
  const [activePhotoIndex, setActivePhotoIndex] = useState<number>(0);

  // Manage Candidate Photos Modal State
  const [showManagePhotosModal, setShowManagePhotosModal] = useState(false);
  const [targetProfileForPhotos, setTargetProfileForPhotos] = useState<MatrimonialProfile | null>(null);
  const [editMainPhoto, setEditMainPhoto] = useState('');
  const [editGalleryPhotos, setEditGalleryPhotos] = useState<string[]>([]);

  const handleOpenPhotoManager = (p?: MatrimonialProfile) => {
    const prof = p || matrimonials.find((m) => m.userId === currentUser?.id || m.contactEmail === currentUser?.email) || matrimonials[0];
    if (!prof) {
      showToast('No Profile Found', 'Please create a matrimonial profile first.', 'info');
      return;
    }
    setTargetProfileForPhotos(prof);
    setEditMainPhoto(prof.photoUrl || '');
    setEditGalleryPhotos(prof.additionalPhotos || []);
    setShowManagePhotosModal(true);
  };

  const handleUploadMainPhotoFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 8 * 1024 * 1024) {
      showToast('File Too Large', 'Please choose an image under 8MB.', 'info');
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      setEditMainPhoto(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleUploadGalleryPhotosFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []) as File[];
    if (!files.length) return;

    const remainingSlots = 5 - editGalleryPhotos.length;
    if (remainingSlots <= 0) {
      showToast('Gallery Full', 'You can upload up to 5 photos max in your gallery.', 'info');
      return;
    }

    const filesToUpload = files.slice(0, remainingSlots);
    const promises = filesToUpload.map((file) => {
      return new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.readAsDataURL(file);
      });
    });

    Promise.all<string>(promises).then((newPhotos) => {
      setEditGalleryPhotos((prev) => [...prev, ...newPhotos].slice(0, 5));
      showToast('Photos Added', `Added ${newPhotos.length} photo(s) to gallery. Click Save to apply.`, 'success');
    });
  };

  const handleSavePhotos = () => {
    if (!targetProfileForPhotos) return;
    updateMatrimonialProfile(targetProfileForPhotos.id, {
      photoUrl: editMainPhoto,
      additionalPhotos: editGalleryPhotos,
    });
    setShowManagePhotosModal(false);
  };

  const filtered = matrimonials.filter((m) => {
    if (genderFilter !== 'All' && m.gender !== genderFilter) return false;
    if (sectFilter !== 'All' && !m.sect.includes(sectFilter)) return false;
    if (verifiedOnly && !m.isVerified) return false;
    return true;
  });

  const handleDownloadBiodata = (p: MatrimonialProfile) => {
    const textContent = `================================================================
          OFFICIAL FORMAL JAIN MATRIMONIAL BIODATA
                    JainConnect Global Platform
================================================================

1. CANDIDATE PERSONAL DETAILS:
----------------------------------------------------------------
Full Name          : ${p.fullName}
Gender             : ${p.gender}
Profile Created By : ${p.createdFor || 'Self / Family'}
Date of Birth      : ${p.dob} ${p.tob ? `| Time: ${p.tob}` : ''}
Place of Birth     : ${p.pob || 'N/A'}
Age / Height       : ${p.age} Yrs | ${p.height}
Weight / Complexion: ${p.weight || 'N/A'} | ${p.complexion || 'N/A'}
Physical Status    : ${p.physicalStatus || 'Normal'}
Marital Status     : ${p.maritalStatus}
Mother Tongue      : ${p.motherTongue || 'Gujarati'}

2. SACRED JAIN CULTURAL & 4-GOTRA DETAILS:
----------------------------------------------------------------
Jain Sect          : ${p.sect}
Sub-Sect / Gachha  : ${p.subSect || 'N/A'}
Native Place/Vatan : ${p.nativePlace || 'N/A'}
1. Self/Father Gotra: ${p.fourGotras?.selfGotra || p.gotra || 'N/A'}
2. Mother Maiden    : ${p.fourGotras?.motherGotra || 'N/A'}
3. Dadi (Paternal)  : ${p.fourGotras?.fatherMotherGotra || 'N/A'}
4. Nani (Maternal)  : ${p.fourGotras?.motherMotherGotra || 'N/A'}
Diet Preference    : ${p.dietPreference}
Religious Routine  : ${p.religiousPractices?.dailyPuja ? 'Daily Puja [Yes] ' : ''}${p.religiousPractices?.choviyar ? 'Choviyar [Yes] ' : ''}${p.religiousPractices?.navkarshi ? 'Navkarshi [Yes]' : ''}

3. HOROSCOPE & KUNDALI DETAILS:
----------------------------------------------------------------
Manglik Status     : ${p.horoscopeDetails?.manglikStatus || 'Non-Manglik'}
Kundali Matching   : ${p.horoscopeDetails?.kundaliMatchNeeded || 'Required'}
Rashi / Nakshatra  : ${p.horoscopeDetails?.rashi || 'N/A'} / ${p.horoscopeDetails?.nakshatra || 'N/A'}

4. ACADEMIC & PROFESSIONAL CAREER:
----------------------------------------------------------------
Highest Degree     : ${p.educationDetails?.degreeLevel || 'Graduate'}
Qualification Field: ${p.qualification}
Institute Name     : ${p.educationDetails?.instituteName || 'N/A'}
Employment Sector  : ${p.careerDetails?.employedIn || 'Private Sector'}
Occupation / Post  : ${p.occupation}
Company / Business : ${p.company || 'N/A'}
Annual Income      : ${p.annualIncome}
Location / City    : ${p.city}, ${p.state}, ${p.country}

5. FAMILY BACKGROUND & WEALTH:
----------------------------------------------------------------
Family Status / Type: ${p.familyBackground?.familyStatus || 'Upper Middle Class'} | ${p.familyBackground?.familyType || 'Joint Family'}
Family Values      : ${p.familyBackground?.familyValues || 'Traditional Jain'}
Father's Name & Occ: ${p.familyBackground?.fatherName || 'N/A'} (${p.familyBackground?.fatherOccupation || 'N/A'})
Mother's Name & Occ: ${p.familyBackground?.motherName || 'N/A'} (${p.familyBackground?.motherOccupation || 'N/A'})
Siblings Summary   : ${p.familyBackground?.brothersCount ?? '0'} Brothers, ${p.familyBackground?.sistersCount ?? '0'} Sisters
Family Assets/Prop : ${p.familyBackground?.familyProperty || p.familyDetails}

6. PARTNER EXPECTATIONS & GUARDIAN CONTACT:
----------------------------------------------------------------
Preferred Age Range: ${p.partnerExpectations?.ageMin || 22} to ${p.partnerExpectations?.ageMax || 28} Yrs
Preferred Height   : ${p.partnerExpectations?.heightMin || "5'2\""} to ${p.partnerExpectations?.heightMax || "5'10\""}
Preferred Sect     : ${p.partnerExpectations?.sectPreferred || 'Open to all Jain Sects'}
Preferred Location : ${p.partnerExpectations?.locationPreferred || 'India or Abroad'}
Expectations Note  : ${p.partnerExpectations?.additionalNotes || 'Cultured Jain partner.'}
Candidate Bio      : ${p.aboutMe}

Guardian Contact   : ${p.guardianContact?.name || p.fullName} (${p.guardianContact?.relation || 'Guardian'})
Phone / WhatsApp   : ${p.guardianContact?.phone || p.contactMobile}
Email              : ${p.guardianContact?.email || p.contactEmail}

================================================================
Generated by JainConnect Official Portal - Verified Member Profile
================================================================`;

    const blob = new Blob([textContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Jain_Matrimonial_Biodata_${p.fullName.replace(/\s+/g, '_')}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    showToast('Biodata Downloaded', `Generated formal Jain Biodata document for ${p.fullName}.`, 'success');
  };

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-red-950 via-amber-950 to-slate-950 text-white rounded-2xl p-6 sm:p-8 shadow-xl border border-amber-900/50 relative overflow-hidden">
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-red-900/50 border border-red-500/40 rounded-full text-red-300 text-xs font-bold uppercase tracking-wider">
            <Heart className="w-3.5 h-3.5 text-red-400 fill-red-400" />
            <span>Sacred Jain Matrimonial Directory</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold font-serif text-white">
            Connecting Suitable Jain Brides & Grooms Worldwide
          </h2>

          <p className="text-xs sm:text-sm text-slate-300">
            Verified Jain profiles sorted by Sect, Gotra, Education, Profession, and Values. Admin Verification guarantees safety and authenticity.
          </p>

          <div className="pt-2 flex flex-wrap gap-2.5">
            <button
              onClick={() => openRegistrationModal('matrimonial')}
              className="px-5 py-3 min-h-[44px] bg-gradient-to-r from-amber-500 to-amber-700 text-amber-950 font-bold text-xs rounded-xl shadow-lg hover:from-amber-600 hover:to-amber-800 transition-all flex items-center justify-center gap-2"
            >
              <Heart className="w-4 h-4 fill-amber-950" />
              <span>Create Marriage Profile</span>
            </button>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-800 dark:text-slate-200">
            <Filter className="w-4 h-4 text-amber-500" />
            <span>Filter Matrimonial Profiles</span>
          </div>
          <span className="text-xs font-semibold text-amber-600 dark:text-amber-400">
            Showing {filtered.length} Profiles
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-3 text-xs">
          {/* Gender Pill Filter */}
          <div>
            <label className="block text-[11px] font-bold text-slate-500 mb-1">Looking For</label>
            <div className="flex rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
              {['All', 'Groom', 'Bride'].map((g) => (
                <button
                  key={g}
                  onClick={() => setGenderFilter(g as any)}
                  className={`flex-1 py-2.5 min-h-[44px] font-bold transition-colors flex items-center justify-center ${
                    genderFilter === g
                      ? 'bg-amber-600 text-white'
                      : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100'
                  }`}
                >
                  {g === 'Groom' ? 'Grooms' : g === 'Bride' ? 'Brides' : 'All'}
                </button>
              ))}
            </div>
          </div>

          {/* Sect Filter */}
          <div>
            <label className="block text-[11px] font-bold text-slate-500 mb-1">Jain Sect</label>
            <select
              value={sectFilter}
              onChange={(e) => setSectFilter(e.target.value)}
              className="w-full p-2.5 min-h-[44px] rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 font-medium"
            >
              <option value="All">All Jain Sects</option>
              <option value="Swetambar">Swetambar</option>
              <option value="Digambar">Digambar</option>
              <option value="Sthanakvasi">Sthanakvasi</option>
              <option value="Terapanthi">Terapanthi</option>
            </select>
          </div>

          {/* Verified Checkbox */}
          <div className="flex items-end pb-1">
            <label className="flex items-center gap-2 min-h-[44px] cursor-pointer font-bold text-slate-700 dark:text-slate-300 select-none">
              <input
                type="checkbox"
                checked={verifiedOnly}
                onChange={(e) => setVerifiedOnly(e.target.checked)}
                className="w-4 h-4 rounded text-amber-600 focus:ring-amber-500"
              />
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                Verified Badge Only
              </span>
            </label>
          </div>
        </div>
      </div>

      {/* Profiles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filtered.map((p) => {
          const hasInterest = currentUser && p.interestsReceived.includes(currentUser.id);

          return (
            <div
              key={p.id}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-lg hover:border-amber-500/50 transition-all flex flex-col justify-between"
            >
              <div className="p-5 space-y-4">
                {/* Header Info */}
                <div className="flex items-start gap-4">
                  <div className="relative w-20 h-24 rounded-xl overflow-hidden border-2 border-amber-400 shrink-0 shadow-md">
                    <img src={p.photoUrl} alt={p.fullName} className="w-full h-full object-cover" />
                    <span
                      className={`absolute top-1 right-1 px-1.5 py-0.5 rounded text-[9px] font-extrabold uppercase ${
                        p.gender === 'Groom' ? 'bg-blue-600 text-white' : 'bg-pink-600 text-white'
                      }`}
                    >
                      {p.gender}
                    </span>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <h3 className="text-base font-bold font-serif text-slate-900 dark:text-white truncate">
                        {p.fullName}
                      </h3>
                      {p.isVerified && (
                        <VerifiedBadge type="matrimonial" showText={true} size="sm" />
                      )}
                    </div>

                    <p className="text-xs text-amber-700 dark:text-amber-400 font-bold mt-0.5">
                      {p.age} Yrs • {p.height} • {p.maritalStatus}
                    </p>

                    <div className="flex flex-wrap gap-1 mt-2">
                      <span className="px-2 py-0.5 bg-amber-50 dark:bg-amber-950 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800 text-[10px] font-semibold rounded">
                        {p.sect}
                      </span>
                      {p.gotra && (
                        <span className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[10px] font-semibold rounded">
                          Gotra: {p.gotra}
                        </span>
                      )}
                      <span className="px-2 py-0.5 bg-emerald-50 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-[10px] font-semibold rounded">
                        {p.dietPreference}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Info List */}
                <div className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300 border-t border-slate-100 dark:border-slate-800 pt-3">
                  <p className="flex items-center gap-2">
                    <GraduationCap className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                    <span>{p.qualification}</span>
                  </p>
                  <p className="flex items-center gap-2">
                    <Briefcase className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                    <span>
                      {p.occupation} {p.company ? `at ${p.company}` : ''} ({p.annualIncome})
                    </span>
                  </p>
                  <p className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                    <span>
                      {p.city}, {p.state}, {p.country}
                    </span>
                  </p>
                </div>

                {/* About snippet */}
                <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 italic bg-slate-50 dark:bg-slate-800/40 p-2.5 rounded-xl border border-slate-100 dark:border-slate-700/50">
                  "{p.aboutMe}"
                </p>
              </div>

              {/* Action Footer */}
              <div className="bg-slate-50 dark:bg-slate-800/60 p-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between gap-2">
                <button
                  onClick={() => {
                    setSelectedProfile(p);
                    setShowBiodataModal(true);
                  }}
                  className="px-3.5 py-2.5 min-h-[44px] bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold rounded-xl hover:bg-slate-100 transition-colors flex items-center justify-center gap-1.5"
                >
                  <FileText className="w-4 h-4 text-amber-500" />
                  <span>Full Biodata</span>
                </button>

                <button
                  onClick={() => sendInterest(p.id)}
                  className={`px-4 py-2.5 min-h-[44px] rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-sm ${
                    hasInterest
                      ? 'bg-emerald-600 text-white'
                      : 'bg-gradient-to-r from-red-600 to-amber-600 text-white hover:from-red-700 hover:to-amber-700'
                  }`}
                >
                  <Heart className="w-4 h-4 fill-current" />
                  <span>{hasInterest ? 'Interest Sent' : 'Express Interest'}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Biodata Modal */}
      {showBiodataModal && selectedProfile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="bg-white dark:bg-slate-900 border border-amber-300 dark:border-amber-800 rounded-2xl w-full max-w-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            
            <div className="bg-gradient-to-r from-amber-900 to-amber-950 text-white p-4 flex items-center justify-between">
              <h3 className="text-sm font-bold font-serif flex items-center gap-2">
                <FileText className="w-4 h-4 text-amber-400" />
                Formal Jain Biodata: {selectedProfile.fullName}
              </h3>
              <button onClick={() => setShowBiodataModal(false)} className="text-amber-200 hover:text-white p-2 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-4 text-xs text-slate-800 dark:text-slate-200">
              {/* Profile Header with Multi-Photo Gallery Support */}
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
                {(() => {
                  const allPhotos = [selectedProfile.photoUrl, ...(selectedProfile.additionalPhotos || [])].filter(Boolean);
                  const currentPhoto = allPhotos[activePhotoIndex] || selectedProfile.photoUrl;

                  return (
                    <div className="flex flex-col items-center gap-2 shrink-0">
                      <div className="relative group">
                        <img
                          src={currentPhoto}
                          alt={selectedProfile.fullName}
                          className="w-32 h-40 object-cover rounded-xl border-2 border-amber-400 shadow-md"
                        />
                        <span className="absolute bottom-1 right-1 bg-black/70 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-md">
                          {activePhotoIndex + 1} / {allPhotos.length}
                        </span>
                      </div>

                      {/* Photo Thumbnails Selector (Up to 5 Photos) */}
                      {allPhotos.length > 1 && (
                        <div className="flex items-center gap-1.5 overflow-x-auto max-w-[150px] p-1 bg-slate-100 dark:bg-slate-800 rounded-lg">
                          {allPhotos.map((pUrl, idx) => (
                            <button
                              key={idx}
                              onClick={() => setActivePhotoIndex(idx)}
                              className={`w-7 h-9 rounded overflow-hidden border-2 transition-all shrink-0 ${
                                activePhotoIndex === idx
                                  ? 'border-amber-500 scale-105 shadow-sm'
                                  : 'border-transparent opacity-60 hover:opacity-100'
                              }`}
                            >
                              <img src={pUrl} alt={`Photo ${idx + 1}`} className="w-full h-full object-cover" />
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })()}

                <div className="text-center sm:text-left space-y-1 flex-1">
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-1.5">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-500 text-slate-950">
                      {selectedProfile.gender}
                    </span>
                    {selectedProfile.isVerified && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-500 text-white">
                        ✓ Verified Profile
                      </span>
                    )}
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                      Created for {selectedProfile.createdFor || 'Self/Family'}
                    </span>
                  </div>
                  <h4 className="text-xl font-bold font-serif text-slate-900 dark:text-white">
                    {selectedProfile.fullName}
                  </h4>
                  <p className="text-amber-600 dark:text-amber-400 font-bold">
                    {selectedProfile.age} Yrs | {selectedProfile.height} | {selectedProfile.maritalStatus}
                  </p>
                  <p className="text-slate-500">
                    Sect: <strong className="text-slate-800 dark:text-slate-200">{selectedProfile.sect}</strong> {selectedProfile.subSect ? `(${selectedProfile.subSect})` : ''}
                  </p>
                  <p className="text-slate-500">
                    Location: <strong className="text-slate-800 dark:text-slate-200">{selectedProfile.city}, {selectedProfile.state}, {selectedProfile.country}</strong>
                  </p>
                </div>
              </div>

              {/* 1. Sacred 4-Gotra Lineage */}
              <div className="space-y-2">
                <h5 className="font-bold text-amber-700 dark:text-amber-400 uppercase text-[11px] tracking-wider border-l-2 border-amber-500 pl-2">
                  1. Sacred Jain 4-Gotra Lineage & Native Vatan
                </h5>
                <div className="grid grid-cols-2 gap-2 bg-amber-50/60 dark:bg-amber-950/20 p-3 rounded-xl border border-amber-200 dark:border-amber-900/40">
                  <p><span className="text-slate-500 font-medium">1. Self/Father Gotra:</span> <strong className="text-slate-900 dark:text-slate-100">{selectedProfile.fourGotras?.selfGotra || selectedProfile.gotra || 'N/A'}</strong></p>
                  <p><span className="text-slate-500 font-medium">2. Mother Maiden Gotra:</span> <strong className="text-slate-900 dark:text-slate-100">{selectedProfile.fourGotras?.motherGotra || 'Kothari'}</strong></p>
                  <p><span className="text-slate-500 font-medium">3. Dadi (Paternal) Gotra:</span> <strong className="text-slate-900 dark:text-slate-100">{selectedProfile.fourGotras?.fatherMotherGotra || 'Shah'}</strong></p>
                  <p><span className="text-slate-500 font-medium">4. Nani (Maternal) Gotra:</span> <strong className="text-slate-900 dark:text-slate-100">{selectedProfile.fourGotras?.motherMotherGotra || 'Mehta'}</strong></p>
                  <p className="col-span-2 border-t border-amber-200/60 dark:border-amber-900/40 pt-1.5"><span className="text-slate-500 font-medium">Native Place / Vatan:</span> <strong className="text-amber-700 dark:text-amber-400">{selectedProfile.nativePlace || 'Pali, Rajasthan'}</strong></p>
                </div>
              </div>

              {/* 2. Religion, Diet & Kundali Horoscope */}
              <div className="space-y-2">
                <h5 className="font-bold text-amber-700 dark:text-amber-400 uppercase text-[11px] tracking-wider border-l-2 border-amber-500 pl-2">
                  2. Spiritual Discipline, Diet & Kundali Details
                </h5>
                <div className="grid grid-cols-2 gap-2 bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl border border-slate-200 dark:border-slate-700">
                  <p><span className="text-slate-500">Diet Preference:</span> <strong className="text-emerald-600 dark:text-emerald-400">{selectedProfile.dietPreference}</strong></p>
                  <p><span className="text-slate-500">Manglik Status:</span> <strong>{selectedProfile.horoscopeDetails?.manglikStatus || 'Non-Manglik'}</strong></p>
                  <p><span className="text-slate-500">Kundali Match:</span> <strong>{selectedProfile.horoscopeDetails?.kundaliMatchNeeded || 'Required'}</strong></p>
                  <p><span className="text-slate-500">Birth Time/Place:</span> <strong>{selectedProfile.tob || '08:30 AM'} ({selectedProfile.pob || selectedProfile.city})</strong></p>
                  <p><span className="text-slate-500">Rashi / Nakshatra:</span> <strong>{selectedProfile.horoscopeDetails?.rashi || 'Kanya'} / {selectedProfile.horoscopeDetails?.nakshatra || 'Hasta'}</strong></p>
                  <p><span className="text-slate-500">Physical Details:</span> <strong>{selectedProfile.weight || '68 kg'}, {selectedProfile.complexion || 'Fair'} ({selectedProfile.bodyType || 'Average'})</strong></p>
                </div>
              </div>

              {/* 3. Education & Professional Career */}
              <div className="space-y-2">
                <h5 className="font-bold text-amber-700 dark:text-amber-400 uppercase text-[11px] tracking-wider border-l-2 border-amber-500 pl-2">
                  3. Academic & Professional Credentials
                </h5>
                <div className="grid grid-cols-2 gap-2 bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl border border-slate-200 dark:border-slate-700">
                  <p><span className="text-slate-500">Qualification:</span> <strong>{selectedProfile.qualification}</strong></p>
                  <p><span className="text-slate-500">Degree Level:</span> <strong>{selectedProfile.educationDetails?.degreeLevel || "Bachelor's / Master's"}</strong></p>
                  <p><span className="text-slate-500">College / Institute:</span> <strong>{selectedProfile.educationDetails?.instituteName || 'IIT / Reputed University'}</strong></p>
                  <p><span className="text-slate-500">Occupation:</span> <strong>{selectedProfile.occupation}</strong></p>
                  <p><span className="text-slate-500">Company / Enterprise:</span> <strong>{selectedProfile.company || selectedProfile.careerDetails?.companyName || 'Corporate / Business'}</strong></p>
                  <p><span className="text-slate-500">Annual Income:</span> <strong className="text-amber-700 dark:text-amber-400">{selectedProfile.annualIncome}</strong></p>
                </div>
              </div>

              {/* 4. Family Background & Assets */}
              <div className="space-y-2">
                <h5 className="font-bold text-amber-700 dark:text-amber-400 uppercase text-[11px] tracking-wider border-l-2 border-amber-500 pl-2">
                  4. Family Background & Standing
                </h5>
                <div className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl border border-slate-200 dark:border-slate-700 space-y-2">
                  <p><span className="text-slate-500">Family Status & Values:</span> <strong>{selectedProfile.familyBackground?.familyStatus || 'Upper Middle Class'} | {selectedProfile.familyBackground?.familyType || 'Joint Family'} ({selectedProfile.familyBackground?.familyValues || 'Traditional Jain'})</strong></p>
                  <p><span className="text-slate-500">Father's Profile:</span> <strong>{selectedProfile.familyBackground?.fatherName || 'Father'} ({selectedProfile.familyBackground?.fatherOccupation || 'Business Owner'})</strong></p>
                  <p><span className="text-slate-500">Mother's Profile:</span> <strong>{selectedProfile.familyBackground?.motherName || 'Mother'} ({selectedProfile.familyBackground?.motherOccupation || 'Homemaker'})</strong></p>
                  <p><span className="text-slate-500">Siblings:</span> <strong>{selectedProfile.familyBackground?.brothersCount ?? 1} Brother(s), {selectedProfile.familyBackground?.sistersCount ?? 1} Sister(s)</strong></p>
                  <p className="text-slate-700 dark:text-slate-300 leading-relaxed pt-1 border-t border-slate-200 dark:border-slate-700">
                    {selectedProfile.familyBackground?.familyProperty || selectedProfile.familyDetails}
                  </p>
                </div>
              </div>

              {/* 5. About Candidate & Partner Expectations */}
              <div className="space-y-2">
                <h5 className="font-bold text-amber-700 dark:text-amber-400 uppercase text-[11px] tracking-wider border-l-2 border-amber-500 pl-2">
                  5. Candidate Personality & Partner Expectations
                </h5>
                <div className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl border border-slate-200 dark:border-slate-700 space-y-2">
                  <p><span className="text-slate-500 font-medium">Desired Age Range:</span> <strong>{selectedProfile.partnerExpectations?.ageMin || 22} to {selectedProfile.partnerExpectations?.ageMax || 28} Yrs</strong></p>
                  <p><span className="text-slate-500 font-medium">Desired Height:</span> <strong>{selectedProfile.partnerExpectations?.heightMin || "5'2\""} to {selectedProfile.partnerExpectations?.heightMax || "5'10\""}</strong></p>
                  <p><span className="text-slate-500 font-medium">Sect & Location Preference:</span> <strong>{selectedProfile.partnerExpectations?.sectPreferred || 'Open to all Jain Sects'} | {selectedProfile.partnerExpectations?.locationPreferred || 'India / Overseas'}</strong></p>
                  <p className="italic text-slate-700 dark:text-slate-300 pt-1 border-t border-slate-200 dark:border-slate-700">
                    "{selectedProfile.aboutMe}"
                  </p>
                </div>
              </div>

              {/* 6. Guardian Contact */}
              <div className="space-y-2">
                <h5 className="font-bold text-amber-700 dark:text-amber-400 uppercase text-[11px] tracking-wider border-l-2 border-amber-500 pl-2">
                  6. Guardian & Contact Verification
                </h5>
                <div className="grid grid-cols-2 gap-2 bg-amber-50/60 dark:bg-amber-950/20 p-3 rounded-xl border border-amber-200 dark:border-amber-900/40">
                  <p><span className="text-slate-500">Guardian Name:</span> <strong>{selectedProfile.guardianContact?.name || selectedProfile.fullName} ({selectedProfile.guardianContact?.relation || 'Father'})</strong></p>
                  <p><span className="text-slate-500">Contact Mobile:</span> <strong className="text-amber-700 dark:text-amber-400">{selectedProfile.guardianContact?.phone || selectedProfile.contactMobile}</strong></p>
                  <p className="col-span-2"><span className="text-slate-500">Email Address:</span> <strong>{selectedProfile.guardianContact?.email || selectedProfile.contactEmail}</strong></p>
                </div>
              </div>
            </div>

            <div className="p-4 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between gap-2">
              <button
                onClick={() => handleDownloadBiodata(selectedProfile)}
                className="px-4 py-2.5 min-h-[44px] bg-slate-900 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5"
              >
                <Download className="w-4 h-4 text-amber-400" />
                <span>Download Biodata PDF</span>
              </button>

              <button
                onClick={() => {
                  sendInterest(selectedProfile.id);
                  setShowBiodataModal(false);
                }}
                className="px-5 py-2.5 min-h-[44px] bg-gradient-to-r from-red-600 to-amber-600 text-white rounded-xl text-xs font-bold flex items-center justify-center"
              >
                Express Interest Now
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MANAGE CANDIDATE PHOTOS MODAL (UP TO 5 PHOTOS) */}
      {showManagePhotosModal && targetProfileForPhotos && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
          <div className="bg-white dark:bg-slate-900 border border-amber-400 dark:border-amber-800 rounded-3xl w-full max-w-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="bg-gradient-to-r from-amber-900 via-amber-950 to-slate-950 text-white p-4 sm:p-5 flex items-center justify-between">
              <div>
                <h3 className="text-base font-extrabold font-serif text-amber-300 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-amber-400" />
                  Candidate Photo Gallery Manager
                </h3>
                <p className="text-[11px] text-amber-200/80 mt-0.5">
                  Updating photos for: <strong className="text-white">{targetProfileForPhotos.fullName}</strong>
                </p>
              </div>
              <button
                onClick={() => setShowManagePhotosModal(false)}
                className="p-2 min-w-[44px] min-h-[44px] text-amber-200 hover:text-white flex items-center justify-center rounded-xl"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-5 text-xs text-slate-800 dark:text-slate-200">
              {/* 1. Main Profile Photo Picker */}
              <div className="p-4 bg-amber-50/80 dark:bg-amber-950/30 rounded-2xl border border-amber-200 dark:border-amber-800/60 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="block font-bold text-xs text-amber-950 dark:text-amber-300">
                    📸 Main Candidate Profile Photo
                  </label>
                  <span className="text-[10px] text-slate-500">Select from Device Gallery / Folder</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-center">
                  <div className="sm:col-span-2 space-y-2">
                    <input
                      type="file"
                      id="editMainPhotoFileInput"
                      accept="image/*"
                      onChange={handleUploadMainPhotoFile}
                      className="hidden"
                    />
                    <label
                      htmlFor="editMainPhotoFileInput"
                      className="flex items-center justify-center gap-2 w-full p-3 bg-white dark:bg-slate-900 border-2 border-dashed border-amber-400 dark:border-amber-700 rounded-xl cursor-pointer hover:bg-amber-100/50 dark:hover:bg-amber-900/40 transition-all font-bold text-xs text-amber-900 dark:text-amber-300"
                    >
                      <Upload className="w-4 h-4 text-amber-600" />
                      <span>Upload Main Photo from Device</span>
                    </label>

                    <div className="text-[10px] text-slate-500 flex items-center gap-1">
                      <span>Or Image URL:</span>
                      <input
                        type="text"
                        placeholder="https://..."
                        value={editMainPhoto.startsWith('data:') ? '' : editMainPhoto}
                        onChange={(e) => setEditMainPhoto(e.target.value)}
                        className="flex-1 p-1 px-2 rounded-lg bg-white dark:bg-slate-900 border text-[10px]"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col items-center justify-center p-2 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 min-h-[90px]">
                    {editMainPhoto ? (
                      <div className="relative text-center">
                        <img
                          src={editMainPhoto}
                          alt="Main Candidate"
                          className="w-20 h-24 object-cover rounded-lg border-2 border-amber-400 shadow-md"
                        />
                        <span className="text-[9px] text-emerald-600 font-bold block mt-1">Main Active</span>
                      </div>
                    ) : (
                      <span className="text-slate-400 text-[10px]">No Photo</span>
                    )}
                  </div>
                </div>
              </div>

              {/* 2. Gallery Photos Uploader (Up to 5 Photos) */}
              <div className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="block font-extrabold text-xs text-slate-900 dark:text-slate-100">
                      🖼️ Candidate Gallery Photos (Upload up to 5 Photos)
                    </label>
                    <p className="text-[10px] text-slate-500">Selected photos will be shown in the candidate's full biodata modal</p>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-amber-100 dark:bg-amber-900/50 text-amber-800 dark:text-amber-300 text-[10px] font-bold">
                    {editGalleryPhotos.length} / 5 Photos
                  </span>
                </div>

                <input
                  type="file"
                  id="editGalleryPhotosFileInput"
                  accept="image/*"
                  multiple
                  onChange={handleUploadGalleryPhotosFiles}
                  className="hidden"
                />

                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                  {editGalleryPhotos.map((photoUrl, idx) => (
                    <div key={idx} className="relative group rounded-xl overflow-hidden border border-slate-300 dark:border-slate-700 aspect-[3/4] bg-slate-100 dark:bg-slate-800">
                      <img src={photoUrl} alt={`Candidate ${idx + 1}`} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-slate-950/70 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-1 p-1">
                        <button
                          type="button"
                          onClick={() => {
                            const oldMain = editMainPhoto;
                            setEditMainPhoto(photoUrl);
                            setEditGalleryPhotos((prev) => [...prev.filter((_, i) => i !== idx), oldMain].filter(Boolean).slice(0, 5));
                          }}
                          className="px-2 py-1 bg-amber-500 text-slate-950 rounded-lg text-[9px] font-extrabold shadow"
                        >
                          Set Main
                        </button>
                        <button
                          type="button"
                          onClick={() => setEditGalleryPhotos((prev) => prev.filter((_, i) => i !== idx))}
                          className="px-2 py-1 bg-red-600 text-white rounded-lg text-[9px] font-extrabold shadow"
                        >
                          Delete
                        </button>
                      </div>
                      <span className="absolute bottom-1 left-1 bg-black/70 text-white text-[9px] px-1 rounded font-bold">
                        #{idx + 1}
                      </span>
                    </div>
                  ))}

                  {editGalleryPhotos.length < 5 && (
                    <label
                      htmlFor="editGalleryPhotosFileInput"
                      className="flex flex-col items-center justify-center p-3 border-2 border-dashed border-amber-400 dark:border-amber-700/60 rounded-xl cursor-pointer hover:bg-amber-50/50 dark:hover:bg-amber-950/30 transition-all aspect-[3/4] text-center"
                    >
                      <Upload className="w-5 h-5 text-amber-600 mb-1" />
                      <span className="text-[10px] font-bold text-amber-800 dark:text-amber-300">Choose Photos</span>
                      <span className="text-[9px] text-slate-400">from Device</span>
                    </label>
                  )}
                </div>
              </div>
            </div>

            <div className="p-4 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => setShowManagePhotosModal(false)}
                className="px-4 py-2.5 min-h-[44px] bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-xl text-xs font-bold"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleSavePhotos}
                className="px-6 py-2.5 min-h-[44px] bg-gradient-to-r from-amber-500 to-amber-700 text-amber-950 font-extrabold rounded-xl text-xs shadow-md hover:from-amber-600 hover:to-amber-800 transition-all flex items-center gap-2"
              >
                <CheckCircle className="w-4 h-4 text-amber-950" />
                <span>Save Candidate Photos</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
