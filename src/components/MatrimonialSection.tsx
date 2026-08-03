import React, { useState, useEffect } from 'react';
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
  Upload,
  Phone,
  Mail,
  Lock,
  Edit,
  Send,
  AlertCircle,
  Users
} from 'lucide-react';
import { MatrimonialProfile } from '../types';
import { generateBiodataPDF } from '../utils/pdfGenerator';
import { MatrimonialSkeleton } from './Skeletons';

export const MatrimonialSection: React.FC = () => {
  const {
    matrimonials,
    sendInterest,
    acceptInterest,
    currentUser,
    showToast,
    openRegistrationModal,
    updateMatrimonialProfile,
    addMatrimonial,
    matrimonialMessages,
    sendMatrimonialMessage,
    isLoadingData
  } = useApp();

  const [genderFilter, setGenderFilter] = useState<'All' | 'Bride' | 'Groom'>('All');
  const [sectFilter, setSectFilter] = useState<string>('All');
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState<MatrimonialProfile | null>(null);
  const [showBiodataModal, setShowBiodataModal] = useState(false);
  const [activePhotoIndex, setActivePhotoIndex] = useState<number>(0);
  const [downloadingPdfId, setDownloadingPdfId] = useState<string | null>(null);
  const [fullViewPhotoUrl, setFullViewPhotoUrl] = useState<string | null>(null);

  // Shortlist State & Persistence
  const [shortlistOnly, setShortlistOnly] = useState(false);
  const [shortlistedIds, setShortlistedIds] = useState<string[]>(() => {
    try {
      const key = currentUser ? `jcg_shortlisted_${currentUser.id}` : 'jcg_shortlisted_guest';
      const saved = localStorage.getItem(key);
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  // Sync shortlist state with localStorage
  useEffect(() => {
    try {
      const key = currentUser ? `jcg_shortlisted_${currentUser.id}` : 'jcg_shortlisted_guest';
      localStorage.setItem(key, JSON.stringify(shortlistedIds));
    } catch (e) {
      console.error('Failed to save shortlist', e);
    }
  }, [shortlistedIds, currentUser]);

  const toggleShortlist = (profileId: string, profileName: string) => {
    setShortlistedIds((prev) => {
      const exists = prev.includes(profileId);
      if (exists) {
        showToast('Removed from Shortlist', `${profileName} removed from your shortlisted profiles.`, 'info');
        return prev.filter((id) => id !== profileId);
      } else {
        showToast('Added to Shortlist ❤️', `${profileName} saved to your shortlisted profiles.`, 'success');
        return [...prev, profileId];
      }
    });
  };

  // Manage Candidate Photos Modal State
  const [showManagePhotosModal, setShowManagePhotosModal] = useState(false);
  const [targetProfileForPhotos, setTargetProfileForPhotos] = useState<MatrimonialProfile | null>(null);
  const [editMainPhoto, setEditMainPhoto] = useState('');
  const [editGalleryPhotos, setEditGalleryPhotos] = useState<string[]>([]);

  // Edit Profile Modal & Confirmation Popup State
  const [showEditProfileModal, setShowEditProfileModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [editFormData, setEditFormData] = useState<Partial<MatrimonialProfile>>({});
  const [showMyFullDetails, setShowMyFullDetails] = useState(false);
  const [activeEditTab, setActiveEditTab] = useState<'basic' | 'gotras' | 'education' | 'family' | 'spiritual' | 'expectations' | 'guardian'>('basic');

  // Chat Modal State
  const [showChatModal, setShowChatModal] = useState(false);
  const [chatTargetProfile, setChatTargetProfile] = useState<MatrimonialProfile | null>(null);
  const [chatMessageInput, setChatMessageInput] = useState('');

  // 1. Resolve logged in user's matrimonial profile
  const myProfile = currentUser
    ? matrimonials.find(
        (m) =>
          m.userId === currentUser.id ||
          (currentUser.email && m.contactEmail?.toLowerCase() === currentUser.email.toLowerCase()) ||
          (currentUser.mobile && m.contactMobile === currentUser.mobile) ||
          (currentUser.fullName && m.fullName.toLowerCase() === currentUser.fullName.toLowerCase() && currentUser.registrationType === 'Marriage Profile')
      )
    : null;

  // Determine user gender role
  const userGenderRole = myProfile?.gender || (currentUser?.gender === 'Male' ? 'Groom' : currentUser?.gender === 'Female' ? 'Bride' : null);
  const isGroomUser = userGenderRole === 'Groom';
  const isBrideUser = userGenderRole === 'Bride';

  // Automatically enforce opposite gender filter for logged-in Groom/Bride
  useEffect(() => {
    if (isGroomUser) {
      setGenderFilter('Bride');
    } else if (isBrideUser) {
      setGenderFilter('Groom');
    }
  }, [isGroomUser, isBrideUser]);

  // Open Edit Profile Modal populated with complete current user profile
  const handleOpenEditProfile = () => {
    const base = myProfile || {};
    const profToEdit: Partial<MatrimonialProfile> = {
      ...base,
      fullName: base.fullName || currentUser?.fullName || '',
      gender: (base.gender || (currentUser?.gender === 'Female' ? 'Bride' : 'Groom')) as any,
      dob: base.dob || currentUser?.dob || '1998-01-01',
      age: base.age || currentUser?.age || 26,
      height: base.height || "5'8\"",
      weight: base.weight || '65 kg',
      complexion: base.complexion || 'Fair',
      maritalStatus: base.maritalStatus || 'Unmarried',
      sect: (base.sect || currentUser?.sect || 'Swetambar Murtipujak') as any,
      subSect: base.subSect || currentUser?.subSect || 'Oswal',
      gotra: base.gotra || currentUser?.gotra || 'Jain',
      qualification: base.qualification || currentUser?.qualification || 'Graduate',
      occupation: base.occupation || currentUser?.occupation || 'Professional',
      company: base.company || currentUser?.company || 'Enterprise',
      annualIncome: base.annualIncome || '₹ 1,500,000',
      city: base.city || currentUser?.city || 'Mumbai',
      state: base.state || currentUser?.state || 'Maharashtra',
      country: base.country || currentUser?.country || 'India',
      dietPreference: base.dietPreference || 'Strict Jain',
      aboutMe: base.aboutMe || 'Culture-oriented Jain candidate seeking a traditional partner.',
      familyDetails: base.familyDetails || 'Respected Jain business family settled with high moral values.',
      contactMobile: base.contactMobile || currentUser?.mobile || '+91 98000 00000',
      contactEmail: base.contactEmail || currentUser?.email || 'candidate@jainconnect.org',
      photoUrl: base.photoUrl || currentUser?.profilePhoto || 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=80',
      createdFor: base.createdFor || 'Self / Family',
      nativePlace: base.nativePlace || 'Rajasthan',
      tob: base.tob || '08:30 AM',
      pob: base.pob || base.city || 'Mumbai',
      motherTongue: base.motherTongue || 'Gujarati / Hindi',
      applicationId: base.applicationId || (currentUser?.applicationId ? currentUser.applicationId : `JCG-MAT-2026-${Math.floor(1000 + Math.random() * 9000)}`),
      fourGotras: {
        selfGotra: base.fourGotras?.selfGotra || base.gotra || currentUser?.gotra || 'Jain',
        motherGotra: base.fourGotras?.motherGotra || 'Kothari',
        fatherMotherGotra: base.fourGotras?.fatherMotherGotra || 'Shah',
        motherMotherGotra: base.fourGotras?.motherMotherGotra || 'Mehta',
      },
      educationDetails: {
        degreeLevel: base.educationDetails?.degreeLevel || 'B.Tech / MBA',
        fieldOfStudy: base.educationDetails?.fieldOfStudy || 'Engineering / Business Management',
        instituteName: base.educationDetails?.instituteName || 'Top Tier University',
      },
      careerDetails: {
        employedIn: base.careerDetails?.employedIn || 'Private Sector / Own Venture',
        designation: base.careerDetails?.designation || base.occupation || 'Senior Professional / Director',
        companyName: base.careerDetails?.companyName || base.company || 'Enterprise',
        annualIncomeRange: base.careerDetails?.annualIncomeRange || base.annualIncome || '₹ 15 - 20 Lakhs',
        workLocation: base.careerDetails?.workLocation || `${base.city || 'Mumbai'}, ${base.state || 'Maharashtra'}`,
      },
      familyBackground: {
        familyStatus: base.familyBackground?.familyStatus || 'Upper Middle Class',
        familyType: base.familyBackground?.familyType || 'Joint Family',
        familyValues: base.familyBackground?.familyValues || 'Traditional & Cultural Jain',
        fatherName: base.familyBackground?.fatherName || 'Rameshji Jain',
        fatherOccupation: base.familyBackground?.fatherOccupation || 'Business / Industrialist',
        motherName: base.familyBackground?.motherName || 'Sunitadevi Jain',
        motherOccupation: base.familyBackground?.motherOccupation || 'Homemaker',
        brothersCount: base.familyBackground?.brothersCount ?? 1,
        marriedBrothersCount: base.familyBackground?.marriedBrothersCount ?? 1,
        sistersCount: base.familyBackground?.sistersCount ?? 1,
        marriedSistersCount: base.familyBackground?.marriedSistersCount ?? 0,
        familyProperty: base.familyBackground?.familyProperty || 'Own 3BHK Apartment & Commercial Property',
      },
      religiousPractices: {
        dailyPuja: base.religiousPractices?.dailyPuja ?? true,
        choviyar: base.religiousPractices?.choviyar ?? true,
        navkarshi: base.religiousPractices?.navkarshi ?? true,
        swadhyay: base.religiousPractices?.swadhyay ?? true,
      },
      horoscopeDetails: {
        manglikStatus: base.horoscopeDetails?.manglikStatus || 'Non-Manglik',
        kundaliMatchNeeded: base.horoscopeDetails?.kundaliMatchNeeded || 'Required',
        rashi: base.horoscopeDetails?.rashi || 'Vrishabha (Taurus)',
        nakshatra: base.horoscopeDetails?.nakshatra || 'Rohini',
      },
      partnerExpectations: {
        ageMin: base.partnerExpectations?.ageMin || 22,
        ageMax: base.partnerExpectations?.ageMax || 28,
        heightMin: base.partnerExpectations?.heightMin || "5'2\"",
        heightMax: base.partnerExpectations?.heightMax || "5'10\"",
        maritalStatusPreferred: base.partnerExpectations?.maritalStatusPreferred || 'Never Married',
        sectPreferred: base.partnerExpectations?.sectPreferred || 'Swetambar / Digambar (Open)',
        educationPreferred: base.partnerExpectations?.educationPreferred || 'Graduate / Post Graduate',
        occupationPreferred: base.partnerExpectations?.occupationPreferred || 'Professional / Business',
        locationPreferred: base.partnerExpectations?.locationPreferred || 'Mumbai / Metro Cities',
        dietPreferred: base.partnerExpectations?.dietPreferred || 'Strict Jain',
        additionalNotes: base.partnerExpectations?.additionalNotes || 'Looking for a cultured, well-educated partner with strong Jain family values.',
      },
      guardianContact: {
        name: base.guardianContact?.name || base.familyBackground?.fatherName || 'Rameshji Jain',
        relation: base.guardianContact?.relation || 'Father',
        phone: base.guardianContact?.phone || base.contactMobile || currentUser?.mobile || '+91 98000 00000',
        email: base.guardianContact?.email || base.contactEmail || currentUser?.email || 'guardian@jainconnect.org',
      },
    };

    setEditFormData(profToEdit);
    setActiveEditTab('basic');
    setShowEditProfileModal(true);
  };

  // Handle Save Profile Click -> Triggers Confirmation Popup Modal
  const handleInitiateSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editFormData.fullName?.trim()) {
      showToast('Validation Error', 'Please enter Full Candidate Name.', 'info');
      return;
    }
    // Open Confirmation Modal asking "Are you sure that edited data is correct?"
    setShowConfirmModal(true);
  };

  // Confirm & Save Profile Action
  const handleConfirmAndSaveProfile = () => {
    if (myProfile) {
      updateMatrimonialProfile(myProfile.id, editFormData);
    } else {
      addMatrimonial({
        ...editFormData,
        userId: currentUser?.id || `usr_mat_${Date.now()}`,
        isVerified: true,
        membershipTier: 'Premium',
        interestsReceived: [],
        interestsAccepted: [],
      });
    }
    setShowConfirmModal(false);
    setShowEditProfileModal(false);
    showToast('Profile Updated Successfully!', 'Your changes have been saved & published to the directory.', 'success');
  };

  // Check if contact info is unlocked (Accepted interest / Admin / Self)
  const isContactUnlocked = (p: MatrimonialProfile) => {
    if (!currentUser) return false;
    if (currentUser.role === 'Super Admin' || currentUser.role === 'Admin') return true;
    if (myProfile && (p.id === myProfile.id || p.userId === currentUser.id)) return true;

    const userInCandidateAccepted = p.interestsAccepted?.includes(currentUser.id) || (myProfile && p.interestsAccepted?.includes(myProfile.id));
    const candidateInUserAccepted = myProfile?.interestsAccepted?.includes(p.userId) || myProfile?.interestsAccepted?.includes(p.id);

    return Boolean(userInCandidateAccepted || candidateInUserAccepted);
  };

  // Handle Photo Manager Open
  const handleOpenPhotoManager = (p?: MatrimonialProfile) => {
    const prof = p || myProfile || matrimonials[0];
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
    showToast('Photos Updated', 'Candidate gallery updated successfully.', 'success');
  };

  // Filter profiles: EXCLUDE user's own profile + apply Groom/Bride role restrictions + Shortlist tab
  const filtered = matrimonials.filter((m) => {
    // 1. Exclude logged-in user's own profile card from search grid
    if (currentUser && (m.userId === currentUser.id || (myProfile && m.id === myProfile.id))) {
      return false;
    }

    // 2. Shortlisted tab filter
    if (shortlistOnly && !shortlistedIds.includes(m.id)) {
      return false;
    }

    // 3. Strict Role-based Groom/Bride Filtering
    if (isGroomUser) {
      if (m.gender !== 'Bride') return false;
    } else if (isBrideUser) {
      if (m.gender !== 'Groom') return false;
    } else if (genderFilter !== 'All' && m.gender !== genderFilter) {
      return false;
    }

    if (sectFilter !== 'All' && !m.sect.includes(sectFilter)) return false;
    if (verifiedOnly && !m.isVerified) return false;
    return true;
  });

  const handleDownloadBiodata = async (p: MatrimonialProfile) => {
    const unlocked = isContactUnlocked(p);
    try {
      setDownloadingPdfId(p.id);
      showToast('Generating PDF', `Preparing clean printable Biodata PDF for ${p.fullName}...`, 'info');
      await generateBiodataPDF(p, unlocked);
      showToast('Biodata Downloaded', `Generated formal Jain Biodata PDF for ${p.fullName}.`, 'success');
    } catch (err) {
      console.error('PDF generation error:', err);
      showToast('Download Error', 'Could not generate PDF. Please try again.', 'error');
    } finally {
      setDownloadingPdfId(null);
    }
  };

  // Open Direct Chat Modal
  const handleOpenChat = (p: MatrimonialProfile) => {
    setChatTargetProfile(p);
    setShowChatModal(true);
  };

  const handleSendChatMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatMessageInput.trim() || !chatTargetProfile) return;
    sendMatrimonialMessage(chatTargetProfile.userId || chatTargetProfile.id, chatTargetProfile.fullName, chatMessageInput.trim());
    setChatMessageInput('');
  };

  // Filter messages for current chat target
  const activeChatMessages = chatTargetProfile && currentUser
    ? matrimonialMessages.filter(
        (msg) =>
          (msg.senderId === currentUser.id && (msg.receiverId === chatTargetProfile.userId || msg.receiverId === chatTargetProfile.id)) ||
          ((msg.senderId === chatTargetProfile.userId || msg.senderId === chatTargetProfile.id) && msg.receiverId === currentUser.id)
      )
    : [];

  return (
    <div className="space-y-6">
      {/* Top Banner Header */}
      <div className="bg-gradient-to-r from-amber-950 via-amber-900 to-slate-950 p-6 sm:p-8 rounded-3xl text-white shadow-xl border border-amber-500/30 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 space-y-3 max-w-3xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[11px] font-bold rounded-full">
            <Heart className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <span>Sacred Jain Matrimonial Directory</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold font-serif text-white">
            Connecting Suitable Jain Brides & Grooms Worldwide
          </h2>

          <p className="text-xs sm:text-sm text-slate-300">
            Verified Jain profiles sorted by Sect, Gotra, Education, Profession, and Values. Admin Verification guarantees safety and authenticity.
          </p>

          <div className="pt-2 flex flex-wrap gap-2.5 items-center">
            {/* HIDE "Create Marriage Profile" if user is logged in or already has profile! */}
            {!currentUser && !myProfile ? (
              <button
                onClick={() => openRegistrationModal('matrimonial')}
                className="px-5 py-3 min-h-[44px] bg-gradient-to-r from-amber-500 to-amber-700 text-amber-950 font-bold text-xs rounded-xl shadow-lg hover:from-amber-600 hover:to-amber-800 transition-all flex items-center justify-center gap-2"
              >
                <Heart className="w-4 h-4 fill-amber-950" />
                <span>Create Marriage Profile</span>
              </button>
            ) : (
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={handleOpenEditProfile}
                  className="px-5 py-3 min-h-[44px] bg-amber-500 text-amber-950 font-extrabold text-xs rounded-xl shadow-lg hover:bg-amber-400 transition-all flex items-center justify-center gap-2"
                >
                  <Edit className="w-4 h-4 text-amber-950" />
                  <span>Edit Your Marriage Profile</span>
                </button>

                <button
                  onClick={() => handleOpenPhotoManager(myProfile || undefined)}
                  className="px-4 py-3 min-h-[44px] bg-slate-800/80 hover:bg-slate-800 border border-amber-500/40 text-amber-300 font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-2"
                >
                  <Upload className="w-4 h-4 text-amber-400" />
                  <span>Manage Photos</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* OWN ACTIVE PROFILE SUMMARY BAR WITH COMPLETE REGISTERED DETAILS */}
      {myProfile && (
        <div className="bg-amber-50/90 dark:bg-amber-950/40 border-2 border-amber-400/80 dark:border-amber-700 rounded-3xl p-5 shadow-lg space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-amber-200 dark:border-amber-900/60 pb-4">
            <div className="flex items-center gap-3.5">
              <div className="relative w-16 h-20 rounded-2xl overflow-hidden border-2 border-amber-500 shrink-0 shadow-md">
                <img src={myProfile.photoUrl} alt={myProfile.fullName} className="w-full h-full object-cover" />
                <span className={`absolute top-1 right-1 px-1.5 py-0.5 text-[9px] font-black uppercase rounded ${myProfile.gender === 'Groom' ? 'bg-blue-600 text-white' : 'bg-pink-600 text-white'}`}>
                  {myProfile.gender}
                </span>
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-base font-extrabold font-serif text-slate-900 dark:text-white">
                    {myProfile.fullName}
                  </h3>
                  <span className="px-2.5 py-0.5 bg-amber-500 text-amber-950 text-[10px] font-black rounded-full uppercase tracking-wider">
                    Your Profile
                  </span>
                  {myProfile.applicationId && (
                    <span className="px-2.5 py-0.5 bg-slate-900 text-amber-300 text-[10px] font-bold rounded-full border border-amber-500/30">
                      App ID: {myProfile.applicationId}
                    </span>
                  )}
                  {myProfile.isVerified && (
                    <span className="px-2.5 py-0.5 bg-emerald-600 text-white text-[10px] font-bold rounded-full">
                      ✓ Verified
                    </span>
                  )}
                </div>
                <p className="text-xs text-amber-800 dark:text-amber-300 font-bold mt-1">
                  {myProfile.age} Yrs • {myProfile.height} • {myProfile.sect} {myProfile.subSect ? `(${myProfile.subSect})` : ''} • {myProfile.city}, {myProfile.state}
                </p>
                <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">
                  Profession: <strong className="text-slate-900 dark:text-slate-100">{myProfile.occupation}</strong> ({myProfile.company || 'Enterprise'}) • Income: <strong className="text-amber-700 dark:text-amber-400">{myProfile.annualIncome}</strong>
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
              <button
                onClick={() => setShowMyFullDetails(!showMyFullDetails)}
                className="px-4 py-2.5 min-h-[44px] bg-amber-100 dark:bg-amber-900/60 border border-amber-400 dark:border-amber-700 text-amber-950 dark:text-amber-200 font-extrabold text-xs rounded-xl hover:bg-amber-200 dark:hover:bg-amber-800 transition-all flex items-center justify-center gap-1.5 flex-1 sm:flex-initial"
              >
                <FileText className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                <span>{showMyFullDetails ? 'Hide Complete Details' : 'Show Complete Registered Details'}</span>
              </button>

              <button
                onClick={handleOpenEditProfile}
                className="px-4 py-2.5 min-h-[44px] bg-amber-600 hover:bg-amber-700 text-white font-extrabold text-xs rounded-xl shadow transition-all flex items-center justify-center gap-1.5 flex-1 sm:flex-initial"
              >
                <Edit className="w-3.5 h-3.5" />
                <span>Edit Profile</span>
              </button>

              <button
                onClick={() => handleOpenPhotoManager(myProfile)}
                className="px-3.5 py-2.5 min-h-[44px] bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-all flex items-center justify-center gap-1.5"
              >
                <Upload className="w-3.5 h-3.5 text-amber-500" />
                <span>Photos</span>
              </button>

              <button
                onClick={() => {
                  setSelectedProfile(myProfile);
                  setShowBiodataModal(true);
                }}
                className="px-3.5 py-2.5 min-h-[44px] bg-slate-900 text-amber-400 font-bold text-xs rounded-xl hover:bg-slate-800 transition-all flex items-center justify-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                <span>PDF Biodata</span>
              </button>
            </div>
          </div>

          {/* EXPANDABLE FULL REGISTERED DETAILS VIEW */}
          {showMyFullDetails && (
            <div className="p-4 bg-white dark:bg-slate-900/80 rounded-2xl border border-amber-300 dark:border-amber-800/80 space-y-4 text-xs animate-fadeIn">
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2">
                <h4 className="font-extrabold text-amber-800 dark:text-amber-300 text-xs font-serif uppercase tracking-wider flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-500" />
                  Complete Registered Candidate Application Profile
                </h4>
                <span className="text-[10px] font-bold text-slate-500">
                  Application ID: {myProfile.applicationId || 'JCG-MAT-2026-REGISTERED'}
                </span>
              </div>

              {/* 1. Candidate Personal & Physical */}
              <div className="space-y-1.5">
                <p className="font-extrabold text-amber-700 dark:text-amber-400 text-[11px]">1. Candidate Basic & Physical Attributes</p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 bg-slate-50 dark:bg-slate-800/40 p-3 rounded-xl">
                  <p><span className="text-slate-500">Full Name:</span> <strong className="text-slate-900 dark:text-slate-100">{myProfile.fullName}</strong></p>
                  <p><span className="text-slate-500">Gender / Role:</span> <strong>{myProfile.gender}</strong></p>
                  <p><span className="text-slate-500">Date of Birth:</span> <strong>{myProfile.dob}</strong> ({myProfile.age} Yrs)</p>
                  <p><span className="text-slate-500">Height & Weight:</span> <strong>{myProfile.height} • {myProfile.weight || "5'8\""}</strong></p>
                  <p><span className="text-slate-500">Marital Status:</span> <strong>{myProfile.maritalStatus}</strong></p>
                  <p><span className="text-slate-500">Created For:</span> <strong>{myProfile.createdFor || 'Self / Family'}</strong></p>
                  <p><span className="text-slate-500">Complexion:</span> <strong>{myProfile.complexion || 'Fair'}</strong></p>
                  <p><span className="text-slate-500">Mother Tongue:</span> <strong>{myProfile.motherTongue || 'Gujarati'}</strong></p>
                </div>
              </div>

              {/* 2. Sacred 4-Gotra Lineage */}
              <div className="space-y-1.5">
                <p className="font-extrabold text-amber-700 dark:text-amber-400 text-[11px]">2. Jain Sect, Sacred 4-Gotras & Native Vatan</p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 bg-amber-50/60 dark:bg-amber-950/20 p-3 rounded-xl border border-amber-200 dark:border-amber-900/40">
                  <p><span className="text-slate-500">Jain Sect:</span> <strong className="text-slate-900 dark:text-slate-100">{myProfile.sect}</strong></p>
                  <p><span className="text-slate-500">Self/Father Gotra:</span> <strong className="text-amber-800 dark:text-amber-300">{myProfile.fourGotras?.selfGotra || myProfile.gotra}</strong></p>
                  <p><span className="text-slate-500">Mother Maiden Gotra:</span> <strong>{myProfile.fourGotras?.motherGotra || 'Kothari'}</strong></p>
                  <p><span className="text-slate-500">Dadi Gotra:</span> <strong>{myProfile.fourGotras?.fatherMotherGotra || 'Shah'}</strong></p>
                  <p><span className="text-slate-500">Nani Gotra:</span> <strong>{myProfile.fourGotras?.motherMotherGotra || 'Mehta'}</strong></p>
                  <p className="col-span-3"><span className="text-slate-500">Native Place / Vatan:</span> <strong className="text-amber-700 dark:text-amber-400">{myProfile.nativePlace || 'Rajasthan'}</strong></p>
                </div>
              </div>

              {/* 3. Education & Career */}
              <div className="space-y-1.5">
                <p className="font-extrabold text-amber-700 dark:text-amber-400 text-[11px]">3. Academic & Career Details</p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 bg-slate-50 dark:bg-slate-800/40 p-3 rounded-xl">
                  <p><span className="text-slate-500">Qualification:</span> <strong>{myProfile.qualification}</strong></p>
                  <p><span className="text-slate-500">Degree & Field:</span> <strong>{myProfile.educationDetails?.degreeLevel || 'B.Tech'} ({myProfile.educationDetails?.fieldOfStudy || 'Engineering'})</strong></p>
                  <p><span className="text-slate-500">Institute / College:</span> <strong>{myProfile.educationDetails?.instituteName || 'Top Tier University'}</strong></p>
                  <p><span className="text-slate-500">Occupation:</span> <strong>{myProfile.occupation}</strong></p>
                  <p><span className="text-slate-500">Company Name:</span> <strong>{myProfile.careerDetails?.companyName || myProfile.company || 'Enterprise'}</strong></p>
                  <p><span className="text-slate-500">Designation:</span> <strong>{myProfile.careerDetails?.designation || myProfile.occupation}</strong></p>
                  <p><span className="text-slate-500">Annual Income:</span> <strong className="text-amber-700 dark:text-amber-400">{myProfile.annualIncome}</strong></p>
                  <p><span className="text-slate-500">Work Location:</span> <strong>{myProfile.careerDetails?.workLocation || `${myProfile.city}, ${myProfile.state}`}</strong></p>
                </div>
              </div>

              {/* 4. Family Background */}
              <div className="space-y-1.5">
                <p className="font-extrabold text-amber-700 dark:text-amber-400 text-[11px]">4. Family Background & Relatives</p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 bg-slate-50 dark:bg-slate-800/40 p-3 rounded-xl">
                  <p><span className="text-slate-500">Father Name & Occ:</span> <strong>{myProfile.familyBackground?.fatherName || 'Rameshji Jain'} ({myProfile.familyBackground?.fatherOccupation || 'Business'})</strong></p>
                  <p><span className="text-slate-500">Mother Name & Occ:</span> <strong>{myProfile.familyBackground?.motherName || 'Sunitadevi Jain'} ({myProfile.familyBackground?.motherOccupation || 'Homemaker'})</strong></p>
                  <p><span className="text-slate-500">Brothers:</span> <strong>{myProfile.familyBackground?.brothersCount ?? 1} ({myProfile.familyBackground?.marriedBrothersCount ?? 1} Married)</strong></p>
                  <p><span className="text-slate-500">Sisters:</span> <strong>{myProfile.familyBackground?.sistersCount ?? 1} ({myProfile.familyBackground?.marriedSistersCount ?? 0} Married)</strong></p>
                  <p className="col-span-2"><span className="text-slate-500">Family Status & Values:</span> <strong>{myProfile.familyBackground?.familyStatus || 'Upper Middle Class'} • {myProfile.familyBackground?.familyValues || 'Traditional Jain'}</strong></p>
                  <p className="col-span-2"><span className="text-slate-500">Family Property / Assets:</span> <strong>{myProfile.familyBackground?.familyProperty || myProfile.familyDetails}</strong></p>
                </div>
              </div>

              {/* 5. Spiritual & Kundali */}
              <div className="space-y-1.5">
                <p className="font-extrabold text-amber-700 dark:text-amber-400 text-[11px]">5. Spiritual Discipline, Diet & Kundali</p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 bg-slate-50 dark:bg-slate-800/40 p-3 rounded-xl">
                  <p><span className="text-slate-500">Diet Preference:</span> <strong className="text-emerald-600 dark:text-emerald-400">{myProfile.dietPreference}</strong></p>
                  <p><span className="text-slate-500">Daily Puja & Choviyar:</span> <strong>{myProfile.religiousPractices?.dailyPuja ? 'Yes' : 'No'} Puja • {myProfile.religiousPractices?.choviyar ? 'Yes' : 'No'} Choviyar</strong></p>
                  <p><span className="text-slate-500">Manglik Status:</span> <strong>{myProfile.horoscopeDetails?.manglikStatus || 'Non-Manglik'}</strong></p>
                  <p><span className="text-slate-500">Kundali Match:</span> <strong>{myProfile.horoscopeDetails?.kundaliMatchNeeded || 'Required'}</strong></p>
                  <p><span className="text-slate-500">Birth Time & Place:</span> <strong>{myProfile.tob || '08:30 AM'} ({myProfile.pob || myProfile.city})</strong></p>
                  <p><span className="text-slate-500">Rashi & Nakshatra:</span> <strong>{myProfile.horoscopeDetails?.rashi || 'Vrishabha'} / {myProfile.horoscopeDetails?.nakshatra || 'Rohini'}</strong></p>
                </div>
              </div>

              {/* 6. Partner Expectations */}
              <div className="space-y-1.5">
                <p className="font-extrabold text-amber-700 dark:text-amber-400 text-[11px]">6. Desired Partner Expectations</p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 bg-slate-50 dark:bg-slate-800/40 p-3 rounded-xl">
                  <p><span className="text-slate-500">Age Preferred:</span> <strong>{myProfile.partnerExpectations?.ageMin || 22} - {myProfile.partnerExpectations?.ageMax || 28} Yrs</strong></p>
                  <p><span className="text-slate-500">Height Preferred:</span> <strong>{myProfile.partnerExpectations?.heightMin || "5'2\""} - {myProfile.partnerExpectations?.heightMax || "5'10\""}</strong></p>
                  <p><span className="text-slate-500">Sect Preferred:</span> <strong>{myProfile.partnerExpectations?.sectPreferred || 'Open'}</strong></p>
                  <p><span className="text-slate-500">Education & Occ:</span> <strong>{myProfile.partnerExpectations?.educationPreferred || 'Graduate'} • {myProfile.partnerExpectations?.occupationPreferred || 'Professional'}</strong></p>
                  <p className="col-span-4"><span className="text-slate-500">Additional Notes:</span> <em>"{myProfile.partnerExpectations?.additionalNotes || 'Looking for a cultured, traditional partner.'}"</em></p>
                </div>
              </div>

              {/* 7. Guardian & Contact */}
              <div className="space-y-1.5">
                <p className="font-extrabold text-amber-700 dark:text-amber-400 text-[11px]">7. Guardian & Direct Contact Details</p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 bg-amber-50/60 dark:bg-amber-950/20 p-3 rounded-xl border border-amber-200 dark:border-amber-900/40">
                  <p><span className="text-slate-500">Guardian Name:</span> <strong>{myProfile.guardianContact?.name || myProfile.fullName} ({myProfile.guardianContact?.relation || 'Guardian'})</strong></p>
                  <p><span className="text-slate-500">Guardian Phone:</span> <strong className="text-amber-800 dark:text-amber-300">{myProfile.guardianContact?.phone || myProfile.contactMobile}</strong></p>
                  <p><span className="text-slate-500">Candidate Mobile:</span> <strong>{myProfile.contactMobile}</strong></p>
                  <p><span className="text-slate-500">Candidate Email:</span> <strong>{myProfile.contactEmail}</strong></p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Role-Based Opposite Gender Filter Indicator */}
      {(isGroomUser || isBrideUser) && (
        <div className="bg-gradient-to-r from-blue-900/10 via-amber-500/10 to-pink-900/10 border border-amber-300 dark:border-amber-800/60 p-3.5 rounded-2xl flex items-center justify-between text-xs font-bold text-slate-800 dark:text-slate-200">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-500 shrink-0" />
            <span>
              {isGroomUser && `Logged in as Groom (${myProfile?.fullName || currentUser?.fullName}). Showing Jain Bride profiles only.`}
              {isBrideUser && `Logged in as Bride (${myProfile?.fullName || currentUser?.fullName}). Showing Jain Groom profiles only.`}
            </span>
          </div>
          <span className="px-2.5 py-1 rounded-full bg-amber-500 text-slate-950 font-black text-[10px]">
            {isGroomUser ? 'Brides Mode' : 'Grooms Mode'}
          </span>
        </div>
      )}

      {/* Filter Bar with Shortlisted Tab Switcher */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        {/* Main Tab Switcher: All Profiles vs Shortlisted Profiles */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShortlistOnly(false)}
              className={`px-4 py-2 min-h-[44px] rounded-xl text-xs font-extrabold transition-all flex items-center gap-2 ${
                !shortlistOnly
                  ? 'bg-amber-600 text-white shadow-md'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>All Candidate Profiles</span>
            </button>

            <button
              onClick={() => setShortlistOnly(true)}
              className={`px-4 py-2 min-h-[44px] rounded-xl text-xs font-extrabold transition-all flex items-center gap-2 ${
                shortlistOnly
                  ? 'bg-rose-600 text-white shadow-md'
                  : 'bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-900/60 hover:bg-rose-100'
              }`}
            >
              <Heart className={`w-4 h-4 ${shortlistedIds.length > 0 ? 'fill-rose-500 text-rose-500' : ''}`} />
              <span>Shortlisted ({shortlistedIds.length})</span>
            </button>
          </div>

          <div className="flex items-center gap-2 text-xs font-bold text-slate-600 dark:text-slate-300">
            <Filter className="w-4 h-4 text-amber-500" />
            <span>Showing {filtered.length} {shortlistOnly ? 'Shortlisted' : 'Candidate'} Profiles</span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-3 text-xs">
          {/* Gender Filter Pill (Locked if logged in as Groom/Bride) */}
          <div>
            <label className="block text-[11px] font-bold text-slate-500 mb-1">
              Looking For {isGroomUser ? '(Brides)' : isBrideUser ? '(Grooms)' : ''}
            </label>
            <div className="flex rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
              {isGroomUser ? (
                <button className="flex-1 py-2.5 min-h-[44px] font-bold bg-amber-600 text-white cursor-default">
                  Brides
                </button>
              ) : isBrideUser ? (
                <button className="flex-1 py-2.5 min-h-[44px] font-bold bg-amber-600 text-white cursor-default">
                  Grooms
                </button>
              ) : (
                ['All', 'Groom', 'Bride'].map((g) => (
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
                ))
              )}
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

      {/* Candidate Profiles Grid or Skeleton Loading State */}
      {isLoadingData ? (
        <MatrimonialSkeleton />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filtered.map((p) => {
          const hasInterest = currentUser && p.interestsReceived?.includes(currentUser.id);
          const unlocked = isContactUnlocked(p);
          const isShortlisted = shortlistedIds.includes(p.id);

          return (
            <div
              key={p.id}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-lg hover:border-amber-500/50 transition-all flex flex-col justify-between"
            >
              <div className="p-5 space-y-4">
                {/* Candidate Header Info */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-4 flex-1 min-w-0">
                    <div
                      onClick={() => setFullViewPhotoUrl(p.photoUrl)}
                      className="relative w-20 h-24 rounded-xl overflow-hidden border-2 border-amber-400 shrink-0 shadow-md cursor-pointer group/img hover:scale-105 transition-transform"
                      title="Click to view full photo"
                    >
                      <img src={p.photoUrl} alt={p.fullName} className="w-full h-full object-cover group-hover/img:brightness-105 transition-all" />
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
                        <span className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[10px] font-medium rounded">
                          Gotra: {p.gotra}
                        </span>
                        <span className="px-2 py-0.5 bg-emerald-50 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-[10px] font-medium rounded">
                          {p.dietPreference}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Shortlist Heart Icon Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleShortlist(p.id, p.fullName);
                    }}
                    className={`p-2.5 rounded-full transition-all flex items-center justify-center shrink-0 min-w-[44px] min-h-[44px] ${
                      isShortlisted
                        ? 'bg-rose-100 dark:bg-rose-950/70 text-rose-600 dark:text-rose-400 border border-rose-300 dark:border-rose-800 shadow-sm scale-105'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 border border-slate-200 dark:border-slate-700'
                    }`}
                    title={isShortlisted ? 'Remove from Shortlist' : 'Shortlist Profile'}
                    aria-label={isShortlisted ? 'Remove from Shortlist' : 'Shortlist Profile'}
                  >
                    <Heart className={`w-5 h-5 transition-transform ${isShortlisted ? 'fill-rose-500 text-rose-500 scale-110' : ''}`} />
                  </button>
                </div>

                {/* Candidate Quick Details */}
                <div className="grid grid-cols-2 gap-2 text-xs text-slate-600 dark:text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-1.5">
                    <GraduationCap className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                    <span className="truncate">{p.qualification}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Briefcase className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                    <span className="truncate">{p.occupation} ({p.annualIncome})</span>
                  </div>
                  <div className="flex items-center gap-1.5 col-span-2">
                    <MapPin className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                    <span className="truncate">{p.city}, {p.state}, {p.country}</span>
                  </div>
                </div>

                {/* BLURRED / UNLOCKED CONTACT NUMBER SECTION */}
                <div className="p-2.5 rounded-xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-900/40 text-xs">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-amber-600" />
                      <span className="font-bold text-slate-700 dark:text-slate-300">Contact:</span>
                      {unlocked ? (
                        <a
                          href={`tel:${p.contactMobile}`}
                          className="font-black text-amber-900 dark:text-amber-300 underline hover:text-amber-600"
                        >
                          {p.contactMobile}
                        </a>
                      ) : (
                        <span className="font-extrabold text-slate-400 filter blur-[3px] select-none">
                          +91 98*** ****77
                        </span>
                      )}
                    </div>

                    {!unlocked && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-800 dark:text-amber-300 bg-amber-100 dark:bg-amber-900/60 px-2 py-0.5 rounded-full shrink-0">
                        <Lock className="w-3 h-3 text-amber-600" />
                        <span>Blurred</span>
                      </span>
                    )}
                  </div>

                  {!unlocked && (
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-1">
                      <span>Express Interest & once Accepted, full contact number & direct chat unlocks.</span>
                    </p>
                  )}
                </div>

                <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl text-xs italic text-slate-600 dark:text-slate-300">
                  "{p.aboutMe}"
                </div>
              </div>

              {/* Candidate Action Footer */}
              <div className="bg-slate-50 dark:bg-slate-800/60 p-3 border-t border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-1.5 flex-1 min-w-0">
                  <button
                    onClick={() => {
                      setSelectedProfile(p);
                      setShowBiodataModal(true);
                    }}
                    className="px-2.5 sm:px-3 py-2 min-h-[44px] bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold rounded-xl hover:bg-slate-100 transition-colors flex items-center justify-center gap-1 shrink-0"
                    title="View candidate's full profile details"
                  >
                    <FileText className="w-3.5 h-3.5 text-amber-500" />
                    <span>Full Biodata</span>
                  </button>

                  <button
                    onClick={() => handleDownloadBiodata(p)}
                    disabled={downloadingPdfId === p.id}
                    className="px-2.5 sm:px-3 py-2 min-h-[44px] bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800 text-amber-900 dark:text-amber-200 text-xs font-bold rounded-xl hover:bg-amber-100 dark:hover:bg-amber-900/60 transition-colors flex items-center justify-center gap-1.5 shrink-0 shadow-xs disabled:opacity-50"
                    title="Download clean, printable PDF version of biodata"
                  >
                    <Download className={`w-3.5 h-3.5 text-amber-600 dark:text-amber-400 ${downloadingPdfId === p.id ? 'animate-bounce' : ''}`} />
                    <span>{downloadingPdfId === p.id ? 'Generating...' : 'PDF'}</span>
                  </button>

                  {/* DIRECT CHAT BUTTON (If interest is accepted) */}
                  {unlocked && (
                    <button
                      onClick={() => handleOpenChat(p)}
                      className="px-3 py-2 min-h-[44px] bg-emerald-600 text-white text-xs font-bold rounded-xl hover:bg-emerald-700 transition-colors flex items-center justify-center gap-1.5 shrink-0 shadow-sm"
                      title="Direct Chat with Candidate / Family"
                    >
                      <MessageCircle className="w-3.5 h-3.5 fill-current" />
                      <span>Chat Now</span>
                    </button>
                  )}
                </div>

                <button
                  onClick={() => sendInterest(p.id)}
                  className={`px-3 sm:px-4 py-2 min-h-[44px] rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-sm shrink-0 ${
                    hasInterest
                      ? 'bg-emerald-600 text-white'
                      : 'bg-gradient-to-r from-red-600 to-amber-600 text-white hover:from-red-700 hover:to-amber-700'
                  }`}
                >
                  <Heart className="w-3.5 h-3.5 fill-current" />
                  <span>{hasInterest ? 'Interest Sent' : 'Express Interest'}</span>
                </button>
              </div>
            </div>
          );
        })}
        </div>
      )}

      {/* Empty State when no profiles match or no profiles shortlisted */}
      {filtered.length === 0 && (
        <div className="p-10 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 text-center space-y-4 shadow-sm">
          <div className="w-16 h-16 rounded-full bg-rose-50 dark:bg-rose-950/60 text-rose-500 border border-rose-200 dark:border-rose-900/60 flex items-center justify-center mx-auto shadow-inner">
            <Heart className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              {shortlistOnly ? 'No Shortlisted Profiles Yet' : 'No Profiles Match Your Filters'}
            </h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
              {shortlistOnly
                ? 'Click the heart outline icon on any matrimonial candidate card to save profiles to your Shortlisted tab for quick review later.'
                : 'Try clearing or adjusting your filter criteria to explore more Jain candidate profiles.'}
            </p>
          </div>
          {shortlistOnly ? (
            <button
              onClick={() => setShortlistOnly(false)}
              className="px-5 py-2.5 min-h-[44px] bg-gradient-to-r from-amber-500 to-amber-700 text-slate-950 font-bold text-xs rounded-xl shadow hover:from-amber-600 hover:to-amber-800 transition-all inline-flex items-center gap-2"
            >
              <Users className="w-4 h-4" />
              <span>Browse All Profiles</span>
            </button>
          ) : (
            <button
              onClick={() => {
                setGenderFilter('All');
                setSectFilter('All');
                setVerifiedOnly(false);
              }}
              className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold rounded-xl hover:bg-slate-200 transition-all"
            >
              Reset All Filters
            </button>
          )}
        </div>
      )}

      {/* FULL BIODATA MODAL */}
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
              {/* Profile Header */}
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
                {(() => {
                  const allPhotos = [selectedProfile.photoUrl, ...(selectedProfile.additionalPhotos || [])].filter(Boolean);
                  const currentPhoto = allPhotos[activePhotoIndex] || selectedProfile.photoUrl;

                  return (
                    <div className="flex flex-col items-center gap-2 shrink-0">
                      <div
                        onClick={() => setFullViewPhotoUrl(currentPhoto)}
                        className="relative group cursor-pointer hover:scale-105 transition-transform"
                        title="Click for full view"
                      >
                        <img
                          src={currentPhoto}
                          alt={selectedProfile.fullName}
                          className="w-32 h-40 object-cover rounded-xl border-2 border-amber-400 shadow-md group-hover:brightness-110 transition-all"
                        />
                        <span className="absolute bottom-1 right-1 bg-black/70 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-md">
                          🔍 {activePhotoIndex + 1} / {allPhotos.length}
                        </span>
                      </div>

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
                  <p><span className="text-slate-500 font-medium">3. Dadi Gotra:</span> <strong className="text-slate-900 dark:text-slate-100">{selectedProfile.fourGotras?.fatherMotherGotra || 'Shah'}</strong></p>
                  <p><span className="text-slate-500 font-medium">4. Nani Gotra:</span> <strong className="text-slate-900 dark:text-slate-100">{selectedProfile.fourGotras?.motherMotherGotra || 'Mehta'}</strong></p>
                  <p className="col-span-2 border-t border-amber-200/60 dark:border-amber-900/40 pt-1.5"><span className="text-slate-500 font-medium">Native Place / Vatan:</span> <strong className="text-amber-700 dark:text-amber-400">{selectedProfile.nativePlace || 'Pali, Rajasthan'}</strong></p>
                </div>
              </div>

              {/* 2. Religion, Diet & Kundali */}
              <div className="space-y-2">
                <h5 className="font-bold text-amber-700 dark:text-amber-400 uppercase text-[11px] tracking-wider border-l-2 border-amber-500 pl-2">
                  2. Spiritual Discipline, Diet & Kundali Details
                </h5>
                <div className="grid grid-cols-2 gap-2 bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl border border-slate-200 dark:border-slate-700">
                  <p><span className="text-slate-500">Diet Preference:</span> <strong className="text-emerald-600 dark:text-emerald-400">{selectedProfile.dietPreference}</strong></p>
                  <p><span className="text-slate-500">Manglik Status:</span> <strong>{selectedProfile.horoscopeDetails?.manglikStatus || 'Non-Manglik'}</strong></p>
                  <p><span className="text-slate-500">Kundali Match:</span> <strong>{selectedProfile.horoscopeDetails?.kundaliMatchNeeded || 'Required'}</strong></p>
                  <p><span className="text-slate-500">Birth Details:</span> <strong>{selectedProfile.tob || '08:30 AM'} ({selectedProfile.pob || selectedProfile.city})</strong></p>
                </div>
              </div>

              {/* 3. Education & Profession */}
              <div className="space-y-2">
                <h5 className="font-bold text-amber-700 dark:text-amber-400 uppercase text-[11px] tracking-wider border-l-2 border-amber-500 pl-2">
                  3. Academic & Professional Credentials
                </h5>
                <div className="grid grid-cols-2 gap-2 bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl border border-slate-200 dark:border-slate-700">
                  <p><span className="text-slate-500">Qualification:</span> <strong>{selectedProfile.qualification}</strong></p>
                  <p><span className="text-slate-500">Occupation:</span> <strong>{selectedProfile.occupation}</strong></p>
                  <p><span className="text-slate-500">Annual Income:</span> <strong className="text-amber-700 dark:text-amber-400">{selectedProfile.annualIncome}</strong></p>
                  <p><span className="text-slate-500">Company:</span> <strong>{selectedProfile.company || 'Enterprise'}</strong></p>
                </div>
              </div>

              {/* 4. Guardian Contact Details (Blurred/Unlocked) */}
              <div className="space-y-2">
                <h5 className="font-bold text-amber-700 dark:text-amber-400 uppercase text-[11px] tracking-wider border-l-2 border-amber-500 pl-2">
                  4. Guardian & Contact Verification
                </h5>
                <div className="bg-amber-50/80 dark:bg-amber-950/30 p-3.5 rounded-xl border border-amber-300 dark:border-amber-800 space-y-2">
                  <div className="grid grid-cols-2 gap-2">
                    <p><span className="text-slate-500">Guardian Name:</span> <strong>{selectedProfile.guardianContact?.name || selectedProfile.fullName} ({selectedProfile.guardianContact?.relation || 'Guardian'})</strong></p>
                    <div>
                      <span className="text-slate-500 block">Mobile Phone:</span>
                      {isContactUnlocked(selectedProfile) ? (
                        <a href={`tel:${selectedProfile.contactMobile}`} className="font-black text-amber-800 dark:text-amber-300 underline">
                          {selectedProfile.contactMobile}
                        </a>
                      ) : (
                        <div className="flex items-center gap-1">
                          <span className="font-bold text-slate-400 filter blur-[3px] select-none">
                            +91 98*** ****77
                          </span>
                          <span className="px-1.5 py-0.5 bg-amber-200 dark:bg-amber-900 text-amber-900 dark:text-amber-200 text-[9px] font-bold rounded">
                            Locked
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {!isContactUnlocked(selectedProfile) && (
                    <div className="p-2 bg-amber-100/80 dark:bg-amber-900/40 rounded-lg text-[11px] text-amber-900 dark:text-amber-200 flex items-center gap-1.5 font-medium">
                      <Lock className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                      <span>Express interest and once candidate accepts, full contact number & chat will unlock.</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="p-4 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleDownloadBiodata(selectedProfile)}
                  className="px-4 py-2.5 min-h-[44px] bg-slate-900 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5"
                >
                  <Download className="w-4 h-4 text-amber-400" />
                  <span>Download PDF</span>
                </button>

                <button
                  onClick={() => toggleShortlist(selectedProfile.id, selectedProfile.fullName)}
                  className={`px-3.5 py-2.5 min-h-[44px] rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                    shortlistedIds.includes(selectedProfile.id)
                      ? 'bg-rose-100 dark:bg-rose-950/70 text-rose-600 dark:text-rose-400 border border-rose-300 dark:border-rose-800'
                      : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-700 hover:bg-rose-50 hover:text-rose-600'
                  }`}
                >
                  <Heart className={`w-4 h-4 ${shortlistedIds.includes(selectedProfile.id) ? 'fill-rose-500 text-rose-500' : ''}`} />
                  <span>{shortlistedIds.includes(selectedProfile.id) ? 'Shortlisted' : 'Shortlist'}</span>
                </button>
              </div>

              {isContactUnlocked(selectedProfile) ? (
                <button
                  onClick={() => {
                    setShowBiodataModal(false);
                    handleOpenChat(selectedProfile);
                  }}
                  className="px-5 py-2.5 min-h-[44px] bg-emerald-600 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5"
                >
                  <MessageCircle className="w-4 h-4 fill-current" />
                  <span>Start Direct Chat</span>
                </button>
              ) : (
                <button
                  onClick={() => {
                    sendInterest(selectedProfile.id);
                    setShowBiodataModal(false);
                  }}
                  className="px-5 py-2.5 min-h-[44px] bg-gradient-to-r from-red-600 to-amber-600 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5"
                >
                  <Heart className="w-4 h-4 fill-current" />
                  <span>Express Interest Now</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* EDIT MATRIMONIAL PROFILE MODAL (COMPLETE REGISTERED DETAILS FORM) */}
      {showEditProfileModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
          <div className="bg-white dark:bg-slate-900 border border-amber-400 dark:border-amber-800 rounded-3xl w-full max-w-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-amber-900 via-amber-950 to-slate-950 text-white p-4 sm:p-5 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-extrabold font-serif text-amber-300 flex items-center gap-2">
                    <Edit className="w-5 h-5 text-amber-400" />
                    Edit Complete Marriage Profile
                  </h3>
                  {editFormData.applicationId && (
                    <span className="px-2.5 py-0.5 bg-amber-500/20 text-amber-300 text-[10px] font-bold rounded-full border border-amber-500/40">
                      ID: {editFormData.applicationId}
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-amber-200/80 mt-0.5">
                  Update your candidate personal, gotras, career, family, Kundali, partner expectations & contacts
                </p>
              </div>
              <button
                onClick={() => setShowEditProfileModal(false)}
                className="p-2 min-w-[44px] min-h-[44px] text-amber-200 hover:text-white flex items-center justify-center rounded-xl"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Tab Navigation Controls */}
            <div className="bg-amber-950/40 border-b border-amber-800/40 p-2 overflow-x-auto flex items-center gap-1.5 scrollbar-none">
              {[
                { id: 'basic', label: '1. Basic & Bio' },
                { id: 'gotras', label: '2. Sect & 4-Gotras' },
                { id: 'education', label: '3. Education & Career' },
                { id: 'family', label: '4. Family Background' },
                { id: 'spiritual', label: '5. Spiritual & Kundali' },
                { id: 'expectations', label: '6. Partner Preferences' },
                { id: 'guardian', label: '7. Guardian & Contact' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveEditTab(tab.id as any)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                    activeEditTab === tab.id
                      ? 'bg-amber-500 text-slate-950 shadow-md font-extrabold'
                      : 'bg-slate-800/60 text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <form onSubmit={handleInitiateSaveProfile} className="p-5 sm:p-6 overflow-y-auto space-y-4 text-xs flex-1">
              {/* TAB 1: BASIC & BIO */}
              {activeEditTab === 'basic' && (
                <div className="space-y-3 animate-fadeIn">
                  <h4 className="font-extrabold text-amber-900 dark:text-amber-300 text-xs flex items-center justify-between border-b border-amber-200 dark:border-amber-900/60 pb-1">
                    <span>1. Candidate Basic Attributes & Bio</span>
                    <span className="text-[10px] text-slate-500 font-normal">Section 1 of 7</span>
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">Full Candidate Name</label>
                      <input
                        type="text"
                        value={editFormData.fullName || ''}
                        onChange={(e) => setEditFormData({ ...editFormData, fullName: e.target.value })}
                        className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 font-bold"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">Gender Role</label>
                      <select
                        value={editFormData.gender || 'Groom'}
                        onChange={(e) => setEditFormData({ ...editFormData, gender: e.target.value as any })}
                        className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 font-bold"
                      >
                        <option value="Groom">Groom (Male)</option>
                        <option value="Bride">Bride (Female)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">Date of Birth</label>
                      <input
                        type="date"
                        value={editFormData.dob || '1998-01-01'}
                        onChange={(e) => setEditFormData({ ...editFormData, dob: e.target.value })}
                        className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 font-bold"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">Age (Years) & Height</label>
                      <div className="grid grid-cols-2 gap-2">
                        <input
                          type="number"
                          placeholder="26"
                          value={editFormData.age || 26}
                          onChange={(e) => setEditFormData({ ...editFormData, age: parseInt(e.target.value) || 26 })}
                          className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 font-bold"
                        />
                        <input
                          type="text"
                          placeholder="5'8&quot;"
                          value={editFormData.height || "5'8\""}
                          onChange={(e) => setEditFormData({ ...editFormData, height: e.target.value })}
                          className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 font-bold"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">Weight & Complexion</label>
                      <div className="grid grid-cols-2 gap-2">
                        <input
                          type="text"
                          placeholder="65 kg"
                          value={editFormData.weight || '65 kg'}
                          onChange={(e) => setEditFormData({ ...editFormData, weight: e.target.value })}
                          className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 font-bold"
                        />
                        <input
                          type="text"
                          placeholder="Fair"
                          value={editFormData.complexion || 'Fair'}
                          onChange={(e) => setEditFormData({ ...editFormData, complexion: e.target.value })}
                          className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 font-bold"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">Marital Status & Profile Created By</label>
                      <div className="grid grid-cols-2 gap-2">
                        <select
                          value={editFormData.maritalStatus || 'Unmarried'}
                          onChange={(e) => setEditFormData({ ...editFormData, maritalStatus: e.target.value })}
                          className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 font-bold"
                        >
                          <option value="Unmarried">Unmarried</option>
                          <option value="Widowed">Widowed</option>
                          <option value="Divorced">Divorced</option>
                        </select>
                        <input
                          type="text"
                          placeholder="Self / Parents"
                          value={editFormData.createdFor || 'Self / Family'}
                          onChange={(e) => setEditFormData({ ...editFormData, createdFor: e.target.value })}
                          className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 font-bold"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">About Candidate / Bio</label>
                    <textarea
                      rows={3}
                      value={editFormData.aboutMe || ''}
                      onChange={(e) => setEditFormData({ ...editFormData, aboutMe: e.target.value })}
                      className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 font-medium"
                      placeholder="Share a brief personal description, goals, and values..."
                    />
                  </div>
                </div>
              )}

              {/* TAB 2: SECT & 4-GOTRAS */}
              {activeEditTab === 'gotras' && (
                <div className="space-y-3 animate-fadeIn">
                  <h4 className="font-extrabold text-amber-900 dark:text-amber-300 text-xs flex items-center justify-between border-b border-amber-200 dark:border-amber-900/60 pb-1">
                    <span>2. Jain Sect, Sacred 4-Gotras & Native Vatan</span>
                    <span className="text-[10px] text-slate-500 font-normal">Section 2 of 7</span>
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">Jain Sect</label>
                      <select
                        value={editFormData.sect || 'Swetambar Murtipujak'}
                        onChange={(e) => setEditFormData({ ...editFormData, sect: e.target.value })}
                        className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 font-bold"
                      >
                        <option value="Swetambar Murtipujak">Swetambar Murtipujak</option>
                        <option value="Swetambar Sthanakvasi">Swetambar Sthanakvasi</option>
                        <option value="Swetambar Terapanthi">Swetambar Terapanthi</option>
                        <option value="Digambar Bisapanthi">Digambar Bisapanthi</option>
                        <option value="Digambar Terapanthi">Digambar Terapanthi</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">Sub-Sect / Community</label>
                      <input
                        type="text"
                        placeholder="Oswal / Porwal / Agarwal"
                        value={editFormData.subSect || ''}
                        onChange={(e) => setEditFormData({ ...editFormData, subSect: e.target.value })}
                        className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 font-bold"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">1. Self / Father Gotra</label>
                      <input
                        type="text"
                        value={editFormData.gotra || editFormData.fourGotras?.selfGotra || ''}
                        onChange={(e) =>
                          setEditFormData({
                            ...editFormData,
                            gotra: e.target.value,
                            fourGotras: { ...editFormData.fourGotras, selfGotra: e.target.value },
                          })
                        }
                        className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 font-bold"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">2. Mother Maiden Gotra</label>
                      <input
                        type="text"
                        value={editFormData.fourGotras?.motherGotra || ''}
                        onChange={(e) =>
                          setEditFormData({
                            ...editFormData,
                            fourGotras: { ...editFormData.fourGotras, motherGotra: e.target.value },
                          })
                        }
                        className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 font-bold"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">3. Dadi (Paternal) Gotra</label>
                      <input
                        type="text"
                        value={editFormData.fourGotras?.fatherMotherGotra || ''}
                        onChange={(e) =>
                          setEditFormData({
                            ...editFormData,
                            fourGotras: { ...editFormData.fourGotras, fatherMotherGotra: e.target.value },
                          })
                        }
                        className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 font-bold"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">4. Nani (Maternal) Gotra</label>
                      <input
                        type="text"
                        value={editFormData.fourGotras?.motherMotherGotra || ''}
                        onChange={(e) =>
                          setEditFormData({
                            ...editFormData,
                            fourGotras: { ...editFormData.fourGotras, motherMotherGotra: e.target.value },
                          })
                        }
                        className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 font-bold"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">Native Place / Vatan</label>
                      <input
                        type="text"
                        placeholder="Pali, Rajasthan"
                        value={editFormData.nativePlace || ''}
                        onChange={(e) => setEditFormData({ ...editFormData, nativePlace: e.target.value })}
                        className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 font-bold"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">Mother Tongue</label>
                      <input
                        type="text"
                        placeholder="Gujarati / Hindi"
                        value={editFormData.motherTongue || 'Gujarati'}
                        onChange={(e) => setEditFormData({ ...editFormData, motherTongue: e.target.value })}
                        className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 font-bold"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: EDUCATION & CAREER */}
              {activeEditTab === 'education' && (
                <div className="space-y-3 animate-fadeIn">
                  <h4 className="font-extrabold text-amber-900 dark:text-amber-300 text-xs flex items-center justify-between border-b border-amber-200 dark:border-amber-900/60 pb-1">
                    <span>3. Academic Qualifications & Career Details</span>
                    <span className="text-[10px] text-slate-500 font-normal">Section 3 of 7</span>
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">Highest Qualification</label>
                      <input
                        type="text"
                        placeholder="B.Tech / MBA / CA / MD"
                        value={editFormData.qualification || ''}
                        onChange={(e) => setEditFormData({ ...editFormData, qualification: e.target.value })}
                        className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 font-bold"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">Degree Level & Field</label>
                      <div className="grid grid-cols-2 gap-2">
                        <input
                          type="text"
                          placeholder="Master's / Bachelor's"
                          value={editFormData.educationDetails?.degreeLevel || ''}
                          onChange={(e) =>
                            setEditFormData({
                              ...editFormData,
                              educationDetails: { ...editFormData.educationDetails, degreeLevel: e.target.value },
                            })
                          }
                          className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 font-bold"
                        />
                        <input
                          type="text"
                          placeholder="Computer Science / Finance"
                          value={editFormData.educationDetails?.fieldOfStudy || ''}
                          onChange={(e) =>
                            setEditFormData({
                              ...editFormData,
                              educationDetails: { ...editFormData.educationDetails, fieldOfStudy: e.target.value },
                            })
                          }
                          className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 font-bold"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">College / Institute Name</label>
                      <input
                        type="text"
                        placeholder="University Name"
                        value={editFormData.educationDetails?.instituteName || ''}
                        onChange={(e) =>
                          setEditFormData({
                            ...editFormData,
                            educationDetails: { ...editFormData.educationDetails, instituteName: e.target.value },
                          })
                        }
                        className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 font-bold"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">Occupation / Profession</label>
                      <input
                        type="text"
                        placeholder="Software Engineer / Business / CA"
                        value={editFormData.occupation || ''}
                        onChange={(e) => setEditFormData({ ...editFormData, occupation: e.target.value })}
                        className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 font-bold"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">Company / Enterprise Name</label>
                      <input
                        type="text"
                        placeholder="Company Name"
                        value={editFormData.company || editFormData.careerDetails?.companyName || ''}
                        onChange={(e) =>
                          setEditFormData({
                            ...editFormData,
                            company: e.target.value,
                            careerDetails: { ...editFormData.careerDetails, companyName: e.target.value },
                          })
                        }
                        className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 font-bold"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">Designation</label>
                      <input
                        type="text"
                        placeholder="Senior Manager / Managing Director"
                        value={editFormData.careerDetails?.designation || editFormData.occupation || ''}
                        onChange={(e) =>
                          setEditFormData({
                            ...editFormData,
                            careerDetails: { ...editFormData.careerDetails, designation: e.target.value },
                          })
                        }
                        className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 font-bold"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">Annual Income</label>
                      <input
                        type="text"
                        placeholder="₹ 18,00,000 / annum"
                        value={editFormData.annualIncome || ''}
                        onChange={(e) => setEditFormData({ ...editFormData, annualIncome: e.target.value })}
                        className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 font-bold"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">Work Location & City/State</label>
                      <div className="grid grid-cols-2 gap-2">
                        <input
                          type="text"
                          placeholder="City"
                          value={editFormData.city || ''}
                          onChange={(e) => setEditFormData({ ...editFormData, city: e.target.value })}
                          className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 font-bold"
                        />
                        <input
                          type="text"
                          placeholder="State"
                          value={editFormData.state || ''}
                          onChange={(e) => setEditFormData({ ...editFormData, state: e.target.value })}
                          className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 font-bold"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 4: FAMILY BACKGROUND */}
              {activeEditTab === 'family' && (
                <div className="space-y-3 animate-fadeIn">
                  <h4 className="font-extrabold text-amber-900 dark:text-amber-300 text-xs flex items-center justify-between border-b border-amber-200 dark:border-amber-900/60 pb-1">
                    <span>4. Family Background, Status & Relatives</span>
                    <span className="text-[10px] text-slate-500 font-normal">Section 4 of 7</span>
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">Father Name & Occupation</label>
                      <div className="grid grid-cols-2 gap-2">
                        <input
                          type="text"
                          placeholder="Rameshji Jain"
                          value={editFormData.familyBackground?.fatherName || ''}
                          onChange={(e) =>
                            setEditFormData({
                              ...editFormData,
                              familyBackground: { ...editFormData.familyBackground, fatherName: e.target.value },
                            })
                          }
                          className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 font-bold"
                        />
                        <input
                          type="text"
                          placeholder="Business / Industrialist"
                          value={editFormData.familyBackground?.fatherOccupation || ''}
                          onChange={(e) =>
                            setEditFormData({
                              ...editFormData,
                              familyBackground: { ...editFormData.familyBackground, fatherOccupation: e.target.value },
                            })
                          }
                          className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 font-bold"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">Mother Name & Occupation</label>
                      <div className="grid grid-cols-2 gap-2">
                        <input
                          type="text"
                          placeholder="Sunitadevi Jain"
                          value={editFormData.familyBackground?.motherName || ''}
                          onChange={(e) =>
                            setEditFormData({
                              ...editFormData,
                              familyBackground: { ...editFormData.familyBackground, motherName: e.target.value },
                            })
                          }
                          className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 font-bold"
                        />
                        <input
                          type="text"
                          placeholder="Homemaker"
                          value={editFormData.familyBackground?.motherOccupation || ''}
                          onChange={(e) =>
                            setEditFormData({
                              ...editFormData,
                              familyBackground: { ...editFormData.familyBackground, motherOccupation: e.target.value },
                            })
                          }
                          className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 font-bold"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">Brothers Count (Total / Married)</label>
                      <div className="grid grid-cols-2 gap-2">
                        <input
                          type="number"
                          placeholder="Total Brothers"
                          value={editFormData.familyBackground?.brothersCount ?? 1}
                          onChange={(e) =>
                            setEditFormData({
                              ...editFormData,
                              familyBackground: {
                                ...editFormData.familyBackground,
                                brothersCount: parseInt(e.target.value) || 0,
                              },
                            })
                          }
                          className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 font-bold"
                        />
                        <input
                          type="number"
                          placeholder="Married Brothers"
                          value={editFormData.familyBackground?.marriedBrothersCount ?? 1}
                          onChange={(e) =>
                            setEditFormData({
                              ...editFormData,
                              familyBackground: {
                                ...editFormData.familyBackground,
                                marriedBrothersCount: parseInt(e.target.value) || 0,
                              },
                            })
                          }
                          className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 font-bold"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">Sisters Count (Total / Married)</label>
                      <div className="grid grid-cols-2 gap-2">
                        <input
                          type="number"
                          placeholder="Total Sisters"
                          value={editFormData.familyBackground?.sistersCount ?? 1}
                          onChange={(e) =>
                            setEditFormData({
                              ...editFormData,
                              familyBackground: {
                                ...editFormData.familyBackground,
                                sistersCount: parseInt(e.target.value) || 0,
                              },
                            })
                          }
                          className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 font-bold"
                        />
                        <input
                          type="number"
                          placeholder="Married Sisters"
                          value={editFormData.familyBackground?.marriedSistersCount ?? 0}
                          onChange={(e) =>
                            setEditFormData({
                              ...editFormData,
                              familyBackground: {
                                ...editFormData.familyBackground,
                                marriedSistersCount: parseInt(e.target.value) || 0,
                              },
                            })
                          }
                          className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 font-bold"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">Family Status & Values</label>
                      <div className="grid grid-cols-2 gap-2">
                        <select
                          value={editFormData.familyBackground?.familyStatus || 'Upper Middle Class'}
                          onChange={(e) =>
                            setEditFormData({
                              ...editFormData,
                              familyBackground: { ...editFormData.familyBackground, familyStatus: e.target.value },
                            })
                          }
                          className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 font-bold"
                        >
                          <option value="Middle Class">Middle Class</option>
                          <option value="Upper Middle Class">Upper Middle Class</option>
                          <option value="High Class / Industrialist">High Class / Industrialist</option>
                        </select>
                        <select
                          value={editFormData.familyBackground?.familyValues || 'Traditional Jain'}
                          onChange={(e) =>
                            setEditFormData({
                              ...editFormData,
                              familyBackground: { ...editFormData.familyBackground, familyValues: e.target.value },
                            })
                          }
                          className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 font-bold"
                        >
                          <option value="Traditional Jain">Traditional Jain</option>
                          <option value="Moderate">Moderate</option>
                          <option value="Liberal">Liberal</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">Family Property / Assets</label>
                      <input
                        type="text"
                        placeholder="Own 3BHK Apartment in Mumbai & Office Space"
                        value={editFormData.familyBackground?.familyProperty || editFormData.familyDetails || ''}
                        onChange={(e) =>
                          setEditFormData({
                            ...editFormData,
                            familyDetails: e.target.value,
                            familyBackground: { ...editFormData.familyBackground, familyProperty: e.target.value },
                          })
                        }
                        className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 font-bold"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 5: SPIRITUAL & KUNDALI */}
              {activeEditTab === 'spiritual' && (
                <div className="space-y-3 animate-fadeIn">
                  <h4 className="font-extrabold text-amber-900 dark:text-amber-300 text-xs flex items-center justify-between border-b border-amber-200 dark:border-amber-900/60 pb-1">
                    <span>5. Spiritual Discipline, Diet & Kundali Horoscope</span>
                    <span className="text-[10px] text-slate-500 font-normal">Section 5 of 7</span>
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">Diet Preference</label>
                      <select
                        value={editFormData.dietPreference || 'Strict Jain'}
                        onChange={(e) => setEditFormData({ ...editFormData, dietPreference: e.target.value as any })}
                        className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 font-bold"
                      >
                        <option value="Strict Jain">Strict Jain (No Roots/Onion/Garlic)</option>
                        <option value="Pure Veg">Pure Veg</option>
                        <option value="Vegan">Vegan</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">Manglik Status</label>
                      <select
                        value={editFormData.horoscopeDetails?.manglikStatus || 'Non-Manglik'}
                        onChange={(e) =>
                          setEditFormData({
                            ...editFormData,
                            horoscopeDetails: { ...editFormData.horoscopeDetails, manglikStatus: e.target.value },
                          })
                        }
                        className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 font-bold"
                      >
                        <option value="Non-Manglik">Non-Manglik</option>
                        <option value="Manglik">Manglik</option>
                        <option value="Anshik Manglik">Anshik / Partial Manglik</option>
                        <option value="Don't Know">Don't Know</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">Kundali Match Requirement</label>
                      <select
                        value={editFormData.horoscopeDetails?.kundaliMatchNeeded || 'Required'}
                        onChange={(e) =>
                          setEditFormData({
                            ...editFormData,
                            horoscopeDetails: { ...editFormData.horoscopeDetails, kundaliMatchNeeded: e.target.value },
                          })
                        }
                        className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 font-bold"
                      >
                        <option value="Required">Kundali Match Required</option>
                        <option value="Optional">Kundali Match Optional</option>
                        <option value="Not Required">Not Required</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">Time & Place of Birth</label>
                      <div className="grid grid-cols-2 gap-2">
                        <input
                          type="text"
                          placeholder="08:30 AM"
                          value={editFormData.tob || ''}
                          onChange={(e) => setEditFormData({ ...editFormData, tob: e.target.value })}
                          className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 font-bold"
                        />
                        <input
                          type="text"
                          placeholder="Mumbai"
                          value={editFormData.pob || ''}
                          onChange={(e) => setEditFormData({ ...editFormData, pob: e.target.value })}
                          className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 font-bold"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">Rashi & Nakshatra</label>
                      <div className="grid grid-cols-2 gap-2">
                        <input
                          type="text"
                          placeholder="Vrishabha (Taurus)"
                          value={editFormData.horoscopeDetails?.rashi || ''}
                          onChange={(e) =>
                            setEditFormData({
                              ...editFormData,
                              horoscopeDetails: { ...editFormData.horoscopeDetails, rashi: e.target.value },
                            })
                          }
                          className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 font-bold"
                        />
                        <input
                          type="text"
                          placeholder="Rohini"
                          value={editFormData.horoscopeDetails?.nakshatra || ''}
                          onChange={(e) =>
                            setEditFormData({
                              ...editFormData,
                              horoscopeDetails: { ...editFormData.horoscopeDetails, nakshatra: e.target.value },
                            })
                          }
                          className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 font-bold"
                        />
                      </div>
                    </div>

                    <div className="p-3 bg-amber-50/60 dark:bg-amber-950/20 rounded-xl border border-amber-200 dark:border-amber-900/40 space-y-2 col-span-1 sm:col-span-2">
                      <p className="font-bold text-amber-900 dark:text-amber-300 text-[11px]">Daily Religious Habits:</p>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                        <label className="flex items-center gap-1.5 font-bold cursor-pointer">
                          <input
                            type="checkbox"
                            checked={editFormData.religiousPractices?.dailyPuja ?? true}
                            onChange={(e) =>
                              setEditFormData({
                                ...editFormData,
                                religiousPractices: { ...editFormData.religiousPractices, dailyPuja: e.target.checked },
                              })
                            }
                            className="rounded accent-amber-600"
                          />
                          <span>Daily Dev-Darshan / Puja</span>
                        </label>
                        <label className="flex items-center gap-1.5 font-bold cursor-pointer">
                          <input
                            type="checkbox"
                            checked={editFormData.religiousPractices?.choviyar ?? true}
                            onChange={(e) =>
                              setEditFormData({
                                ...editFormData,
                                religiousPractices: { ...editFormData.religiousPractices, choviyar: e.target.checked },
                              })
                            }
                            className="rounded accent-amber-600"
                          />
                          <span>Follows Choviyar</span>
                        </label>
                        <label className="flex items-center gap-1.5 font-bold cursor-pointer">
                          <input
                            type="checkbox"
                            checked={editFormData.religiousPractices?.navkarshi ?? true}
                            onChange={(e) =>
                              setEditFormData({
                                ...editFormData,
                                religiousPractices: { ...editFormData.religiousPractices, navkarshi: e.target.checked },
                              })
                            }
                            className="rounded accent-amber-600"
                          />
                          <span>Follows Navkarshi</span>
                        </label>
                        <label className="flex items-center gap-1.5 font-bold cursor-pointer">
                          <input
                            type="checkbox"
                            checked={editFormData.religiousPractices?.swadhyay ?? true}
                            onChange={(e) =>
                              setEditFormData({
                                ...editFormData,
                                religiousPractices: { ...editFormData.religiousPractices, swadhyay: e.target.checked },
                              })
                            }
                            className="rounded accent-amber-600"
                          />
                          <span>Regular Swadhyay</span>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 6: PARTNER EXPECTATIONS */}
              {activeEditTab === 'expectations' && (
                <div className="space-y-3 animate-fadeIn">
                  <h4 className="font-extrabold text-amber-900 dark:text-amber-300 text-xs flex items-center justify-between border-b border-amber-200 dark:border-amber-900/60 pb-1">
                    <span>6. Desired Partner Expectations & Preferences</span>
                    <span className="text-[10px] text-slate-500 font-normal">Section 6 of 7</span>
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">Preferred Age Range (Years)</label>
                      <div className="grid grid-cols-2 gap-2">
                        <input
                          type="number"
                          placeholder="Min Age (22)"
                          value={editFormData.partnerExpectations?.ageMin || 22}
                          onChange={(e) =>
                            setEditFormData({
                              ...editFormData,
                              partnerExpectations: {
                                ...editFormData.partnerExpectations,
                                ageMin: parseInt(e.target.value) || 20,
                              },
                            })
                          }
                          className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 font-bold"
                        />
                        <input
                          type="number"
                          placeholder="Max Age (28)"
                          value={editFormData.partnerExpectations?.ageMax || 28}
                          onChange={(e) =>
                            setEditFormData({
                              ...editFormData,
                              partnerExpectations: {
                                ...editFormData.partnerExpectations,
                                ageMax: parseInt(e.target.value) || 35,
                              },
                            })
                          }
                          className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 font-bold"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">Preferred Height Range</label>
                      <div className="grid grid-cols-2 gap-2">
                        <input
                          type="text"
                          placeholder="5'2&quot;"
                          value={editFormData.partnerExpectations?.heightMin || "5'2\""}
                          onChange={(e) =>
                            setEditFormData({
                              ...editFormData,
                              partnerExpectations: {
                                ...editFormData.partnerExpectations,
                                heightMin: e.target.value,
                              },
                            })
                          }
                          className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 font-bold"
                        />
                        <input
                          type="text"
                          placeholder="5'10&quot;"
                          value={editFormData.partnerExpectations?.heightMax || "5'10\""}
                          onChange={(e) =>
                            setEditFormData({
                              ...editFormData,
                              partnerExpectations: {
                                ...editFormData.partnerExpectations,
                                heightMax: e.target.value,
                              },
                            })
                          }
                          className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 font-bold"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">Preferred Sect & Qualification</label>
                      <div className="grid grid-cols-2 gap-2">
                        <input
                          type="text"
                          placeholder="Swetambar / Digambar (Open)"
                          value={editFormData.partnerExpectations?.sectPreferred || ''}
                          onChange={(e) =>
                            setEditFormData({
                              ...editFormData,
                              partnerExpectations: {
                                ...editFormData.partnerExpectations,
                                sectPreferred: e.target.value,
                              },
                            })
                          }
                          className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 font-bold"
                        />
                        <input
                          type="text"
                          placeholder="Graduate / Master's"
                          value={editFormData.partnerExpectations?.educationPreferred || ''}
                          onChange={(e) =>
                            setEditFormData({
                              ...editFormData,
                              partnerExpectations: {
                                ...editFormData.partnerExpectations,
                                educationPreferred: e.target.value,
                              },
                            })
                          }
                          className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 font-bold"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">Preferred Occupation & Location</label>
                      <div className="grid grid-cols-2 gap-2">
                        <input
                          type="text"
                          placeholder="Professional / Business"
                          value={editFormData.partnerExpectations?.occupationPreferred || ''}
                          onChange={(e) =>
                            setEditFormData({
                              ...editFormData,
                              partnerExpectations: {
                                ...editFormData.partnerExpectations,
                                occupationPreferred: e.target.value,
                              },
                            })
                          }
                          className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 font-bold"
                        />
                        <input
                          type="text"
                          placeholder="Mumbai / Metro Cities"
                          value={editFormData.partnerExpectations?.locationPreferred || ''}
                          onChange={(e) =>
                            setEditFormData({
                              ...editFormData,
                              partnerExpectations: {
                                ...editFormData.partnerExpectations,
                                locationPreferred: e.target.value,
                              },
                            })
                          }
                          className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 font-bold"
                        />
                      </div>
                    </div>

                    <div className="col-span-1 sm:col-span-2">
                      <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">Additional Expectations Notes</label>
                      <textarea
                        rows={3}
                        placeholder="Detail any specific expectations regarding family, values, location, or lifestyle..."
                        value={editFormData.partnerExpectations?.additionalNotes || ''}
                        onChange={(e) =>
                          setEditFormData({
                            ...editFormData,
                            partnerExpectations: {
                              ...editFormData.partnerExpectations,
                              additionalNotes: e.target.value,
                            },
                          })
                        }
                        className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 font-medium"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 7: GUARDIAN & CONTACT */}
              {activeEditTab === 'guardian' && (
                <div className="space-y-3 animate-fadeIn">
                  <h4 className="font-extrabold text-amber-900 dark:text-amber-300 text-xs flex items-center justify-between border-b border-amber-200 dark:border-amber-900/60 pb-1">
                    <span>7. Guardian Details & Direct Contact Information</span>
                    <span className="text-[10px] text-slate-500 font-normal">Section 7 of 7</span>
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">Guardian Full Name & Relation</label>
                      <div className="grid grid-cols-2 gap-2">
                        <input
                          type="text"
                          placeholder="Rameshji Jain"
                          value={editFormData.guardianContact?.name || ''}
                          onChange={(e) =>
                            setEditFormData({
                              ...editFormData,
                              guardianContact: { ...editFormData.guardianContact, name: e.target.value },
                            })
                          }
                          className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 font-bold"
                        />
                        <input
                          type="text"
                          placeholder="Father / Guardian"
                          value={editFormData.guardianContact?.relation || ''}
                          onChange={(e) =>
                            setEditFormData({
                              ...editFormData,
                              guardianContact: { ...editFormData.guardianContact, relation: e.target.value },
                            })
                          }
                          className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 font-bold"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">Guardian Contact Phone & Email</label>
                      <div className="grid grid-cols-2 gap-2">
                        <input
                          type="text"
                          placeholder="+91 98000 00000"
                          value={editFormData.guardianContact?.phone || ''}
                          onChange={(e) =>
                            setEditFormData({
                              ...editFormData,
                              guardianContact: { ...editFormData.guardianContact, phone: e.target.value },
                            })
                          }
                          className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 font-bold"
                        />
                        <input
                          type="email"
                          placeholder="guardian@email.com"
                          value={editFormData.guardianContact?.email || ''}
                          onChange={(e) =>
                            setEditFormData({
                              ...editFormData,
                              guardianContact: { ...editFormData.guardianContact, email: e.target.value },
                            })
                          }
                          className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 font-bold"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">Direct Candidate Contact Mobile</label>
                      <input
                        type="text"
                        placeholder="+91 98000 00000"
                        value={editFormData.contactMobile || ''}
                        onChange={(e) => setEditFormData({ ...editFormData, contactMobile: e.target.value })}
                        className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 font-bold"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">Direct Candidate Contact Email</label>
                      <input
                        type="email"
                        placeholder="candidate@jainconnect.org"
                        value={editFormData.contactEmail || ''}
                        onChange={(e) => setEditFormData({ ...editFormData, contactEmail: e.target.value })}
                        className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 font-bold"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Bottom Action Footer */}
              <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3">
                <div className="flex items-center gap-1">
                  {['basic', 'gotras', 'education', 'family', 'spiritual', 'expectations', 'guardian'].map((tabKey, idx) => (
                    <button
                      key={tabKey}
                      type="button"
                      onClick={() => setActiveEditTab(tabKey as any)}
                      className={`w-3 h-3 rounded-full transition-all ${
                        activeEditTab === tabKey ? 'bg-amber-500 scale-125' : 'bg-slate-300 dark:bg-slate-700'
                      }`}
                      title={`Step ${idx + 1}`}
                    />
                  ))}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setShowEditProfileModal(false)}
                    className="px-4 py-2.5 min-h-[44px] bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-bold rounded-xl"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="px-6 py-2.5 min-h-[44px] bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-amber-950 font-extrabold rounded-xl shadow-md flex items-center gap-1.5"
                  >
                    <CheckCircle className="w-4 h-4 text-amber-950" />
                    <span>Save & Publish Profile</span>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CONFIRMATION POPUP MODAL ("Are you sure that edited data is correct?") */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn">
          <div className="bg-white dark:bg-slate-900 border-2 border-amber-400 dark:border-amber-700 rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden p-6 space-y-5">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-100 dark:bg-amber-950 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
                <AlertCircle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-extrabold font-serif text-slate-900 dark:text-white">
                  Confirm Profile Verification
                </h3>
                <p className="text-xs font-bold text-amber-700 dark:text-amber-400">
                  Are you sure that the edited profile data is correct?
                </p>
              </div>
            </div>

            <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700 text-xs space-y-2">
              <p><span className="text-slate-500">Candidate Name:</span> <strong className="text-slate-900 dark:text-slate-100">{editFormData.fullName}</strong></p>
              <p><span className="text-slate-500">Role & Age:</span> <strong>{editFormData.gender} • {editFormData.age} Yrs • {editFormData.height}</strong></p>
              <p><span className="text-slate-500">Sect & Gotra:</span> <strong>{editFormData.sect} ({editFormData.gotra})</strong></p>
              <p><span className="text-slate-500">Qualification & Occupation:</span> <strong>{editFormData.qualification} • {editFormData.occupation}</strong></p>
              <p><span className="text-slate-500">Location:</span> <strong>{editFormData.city}, {editFormData.state}</strong></p>
              <p><span className="text-slate-500">Contact Mobile:</span> <strong className="text-amber-700 dark:text-amber-400">{editFormData.contactMobile}</strong></p>
            </div>

            <p className="text-[11px] text-slate-500 text-center">
              Please double check all Jain sect, gotra, and contact details before publishing.
            </p>

            <div className="flex items-center justify-end gap-3 pt-2">
              {/* Re-edit Button: returns to edit form */}
              <button
                type="button"
                onClick={() => setShowConfirmModal(false)}
                className="px-5 py-3 min-h-[44px] bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 text-slate-800 dark:text-slate-200 font-extrabold text-xs rounded-xl transition-all flex items-center justify-center gap-1.5"
              >
                <Edit className="w-4 h-4" />
                <span>Re-edit Form</span>
              </button>

              {/* Confirm & Save Button */}
              <button
                type="button"
                onClick={handleConfirmAndSaveProfile}
                className="px-6 py-3 min-h-[44px] bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white font-extrabold text-xs rounded-xl shadow-lg transition-all flex items-center justify-center gap-1.5"
              >
                <CheckCircle className="w-4 h-4" />
                <span>Confirm & Update</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MATRIMONIAL CHAT MODAL (Enabled once Interest is Accepted) */}
      {showChatModal && chatTargetProfile && currentUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
          <div className="bg-white dark:bg-slate-900 border border-emerald-500/50 rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col h-[85vh]">
            {/* Chat Header */}
            <div className="bg-gradient-to-r from-emerald-900 via-emerald-950 to-slate-950 text-white p-4 flex items-center justify-between shadow-md">
              <div className="flex items-center gap-3">
                <img
                  src={chatTargetProfile.photoUrl}
                  alt={chatTargetProfile.fullName}
                  className="w-11 h-11 object-cover rounded-full border-2 border-emerald-400"
                />
                <div>
                  <h3 className="text-sm font-extrabold text-white flex items-center gap-1.5">
                    <span>{chatTargetProfile.fullName}</span>
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  </h3>
                  <p className="text-[10px] text-emerald-200">
                    {chatTargetProfile.age} Yrs • {chatTargetProfile.sect} • {chatTargetProfile.city}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setShowChatModal(false)}
                className="p-2 min-w-[44px] min-h-[44px] text-emerald-200 hover:text-white flex items-center justify-center rounded-xl"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Chat Messages Thread */}
            <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-50 dark:bg-slate-950/60">
              <div className="text-center my-2">
                <span className="px-3 py-1 bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-[10px] font-extrabold rounded-full border border-emerald-300 dark:border-emerald-800">
                  🔒 Interest Accepted • Secure Direct Chat Active
                </span>
              </div>

              {activeChatMessages.length === 0 ? (
                <div className="text-center py-10 space-y-2 text-slate-400">
                  <MessageCircle className="w-8 h-8 mx-auto text-emerald-500/60" />
                  <p className="text-xs font-bold text-slate-600 dark:text-slate-300">Start your conversation!</p>
                  <p className="text-[10px]">Send a respectful greeting to {chatTargetProfile.fullName} and their family.</p>
                </div>
              ) : (
                activeChatMessages.map((msg) => {
                  const isMe = msg.senderId === currentUser.id;
                  return (
                    <div
                      key={msg.id}
                      className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                    >
                      <div
                        className={`max-w-[80%] p-3 rounded-2xl text-xs font-medium ${
                          isMe
                            ? 'bg-amber-600 text-white rounded-br-none shadow-sm'
                            : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 rounded-bl-none shadow-sm'
                        }`}
                      >
                        <p>{msg.text}</p>
                        <span
                          className={`text-[9px] block text-right mt-1 ${
                            isMe ? 'text-amber-100' : 'text-slate-400'
                          }`}
                        >
                          {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Quick Presets */}
            <div className="p-2 bg-slate-100 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex items-center gap-1.5 overflow-x-auto text-[10px]">
              <button
                type="button"
                onClick={() => setChatMessageInput('Jai Jinendra! Pleased to connect with your family.')}
                className="px-2.5 py-1 bg-white dark:bg-slate-800 border rounded-full whitespace-nowrap text-slate-700 dark:text-slate-300 hover:border-amber-500"
              >
                "Jai Jinendra! Pleased to connect..."
              </button>
              <button
                type="button"
                onClick={() => setChatMessageInput('Can we schedule a call with parents?')}
                className="px-2.5 py-1 bg-white dark:bg-slate-800 border rounded-full whitespace-nowrap text-slate-700 dark:text-slate-300 hover:border-amber-500"
              >
                "Can we schedule a call with parents?"
              </button>
            </div>

            {/* Message Input Footer */}
            <form onSubmit={handleSendChatMessage} className="p-3 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex items-center gap-2">
              <input
                type="text"
                placeholder={`Type message for ${chatTargetProfile.fullName}...`}
                value={chatMessageInput}
                onChange={(e) => setChatMessageInput(e.target.value)}
                className="flex-1 p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-slate-100 font-medium focus:ring-2 focus:ring-emerald-500/30"
              />
              <button
                type="submit"
                className="px-4 py-2.5 min-h-[44px] bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1 shadow-md shrink-0"
              >
                <Send className="w-4 h-4" />
                <span>Send</span>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* MANAGE CANDIDATE PHOTOS MODAL */}
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
              {/* Main Profile Photo Picker */}
              <div className="p-4 bg-amber-50/80 dark:bg-amber-950/30 rounded-2xl border border-amber-200 dark:border-amber-800/60 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="block font-bold text-xs text-amber-950 dark:text-amber-300">
                    📸 Main Candidate Profile Photo
                  </label>
                  <span className="text-[10px] text-slate-500">Select from Device Gallery</span>
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

              {/* Gallery Photos Uploader */}
              <div className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="block font-extrabold text-xs text-slate-900 dark:text-slate-100">
                      🖼️ Candidate Gallery Photos (Upload up to 5 Photos)
                    </label>
                    <p className="text-[10px] text-slate-500">Photos will be shown in the candidate's full biodata modal</p>
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

      {/* Full View Candidate Photo Lightbox */}
      {fullViewPhotoUrl && (
        <div
          onClick={() => setFullViewPhotoUrl(null)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md cursor-pointer animate-fade-in"
        >
          <div
            className="relative max-w-4xl max-h-[90vh] flex flex-col items-center"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setFullViewPhotoUrl(null)}
              className="absolute -top-12 right-0 text-white bg-slate-800/80 hover:bg-slate-700 p-2 rounded-full transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
            >
              <X className="w-6 h-6" />
            </button>
            <img
              src={fullViewPhotoUrl}
              alt="Candidate Full View"
              className="max-h-[82vh] w-auto object-contain rounded-2xl shadow-2xl border-2 border-amber-400"
            />
            <p className="text-xs text-amber-200 mt-2 font-medium bg-slate-900/80 px-3 py-1 rounded-full border border-amber-500/30">
              🔍 Full Resolution Candidate Image View
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
