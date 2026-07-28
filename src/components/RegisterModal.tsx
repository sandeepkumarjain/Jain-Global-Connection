import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
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
  Info,
  Upload,
  CheckCircle,
  User,
  Briefcase,
  GraduationCap,
  Sliders,
  Camera,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Copy,
  Check,
  Mail,
  Clock,
  ChevronDown
} from 'lucide-react';
import { FamilyMember } from '../types';

export const RegisterModal: React.FC = () => {
  const {
    isRegModalOpen,
    setIsRegModalOpen,
    regModalTab,
    addMatrimonial,
    addBusiness,
    addTemple,
    addCommunityMember,
    registerUser,
    showToast
  } = useApp();

  const [panelType, setPanelType] = useState<'matrimonial' | 'business' | 'temple' | 'family'>(regModalTab || 'business');
  const [submissionSuccessData, setSubmissionSuccessData] = useState<{
    appId: string;
    applicantName: string;
    registeredEmail: string;
    panelType: string;
  } | null>(null);
  const [copiedAppId, setCopiedAppId] = useState(false);
  const [showMatrimonialCelebration, setShowMatrimonialCelebration] = useState(false);
  const [celebrationCandidateData, setCelebrationCandidateData] = useState<{
    name: string;
    gender: string;
    city: string;
    photo: string;
  } | null>(null);

  useEffect(() => {
    if (isRegModalOpen && regModalTab) {
      setPanelType(regModalTab);
      setShowMatrimonialCelebration(false);
    }
  }, [isRegModalOpen, regModalTab]);

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
  const [createdFor, setCreatedFor] = useState('Self');
  const [candidateGender, setCandidateGender] = useState<'Groom' | 'Bride'>('Groom');
  const [candidateDob, setCandidateDob] = useState('');
  const [candidateAge, setCandidateAge] = useState('');
  const [candidateHeight, setCandidateHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [complexion, setComplexion] = useState('');
  const [bodyType, setBodyType] = useState('');
  const [physicalStatus, setPhysicalStatus] = useState('Normal');
  const [maritalStatus, setMaritalStatus] = useState('Never Married');
  const [motherTongue, setMotherTongue] = useState('Hindi');

  // 12-Hour Time Format
  const [tobHour, setTobHour] = useState('08');
  const [tobMinute, setTobMinute] = useState('30');
  const [tobAmpm, setTobAmpm] = useState<'AM' | 'PM'>('AM');
  const [tob, setTob] = useState('08:30 AM');

  useEffect(() => {
    setTob(`${tobHour}:${tobMinute} ${tobAmpm}`);
  }, [tobHour, tobMinute, tobAmpm]);

  // POB Location Search & Map Dropdown
  const [pob, setPob] = useState('');
  const [isPobDropdownOpen, setIsPobDropdownOpen] = useState(false);

  const POPULAR_JAIN_PLACES = [
    'Mumbai, Maharashtra',
    'Surat, Gujarat',
    'Ahmedabad, Gujarat',
    'Jaipur, Rajasthan',
    'Udaipur, Rajasthan',
    'Jodhpur, Rajasthan',
    'Pali, Rajasthan',
    'Patan, Gujarat',
    'Indore, Madhya Pradesh',
    'Kota, Rajasthan',
    'Ajmer, Rajasthan',
    'Pune, Maharashtra',
    'Delhi / NCR',
    'Bangalore, Karnataka',
    'Chennai, Tamil Nadu',
    'Kolkata, West Bengal',
    'Baroda / Vadodara, Gujarat',
    'Rajkot, Gujarat',
    'Hyderabad, Telangana',
    'Dubai, UAE',
    'London, UK',
    'New York, USA'
  ];

  // Auto calculate age when DOB changes
  useEffect(() => {
    if (candidateDob) {
      const birthDate = new Date(candidateDob);
      if (!isNaN(birthDate.getTime())) {
        const today = new Date();
        let calculatedAge = today.getFullYear() - birthDate.getFullYear();
        const m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
          calculatedAge--;
        }
        if (calculatedAge >= 10 && calculatedAge <= 100) {
          setCandidateAge(calculatedAge.toString());
        }
      }
    }
  }, [candidateDob]);

  // Jain Cultural & 4-Gotra System
  const [subSect, setSubSect] = useState('');
  const [motherGotra, setMotherGotra] = useState('');
  const [fatherMotherGotra, setFatherMotherGotra] = useState('');
  const [motherMotherGotra, setMotherMotherGotra] = useState('');
  const [nativePlace, setNativePlace] = useState('');

  // Religious Practices & Horoscope
  const [matDiet, setMatDiet] = useState<'Strict Jain' | 'Pure Veg' | 'Vegan'>('Strict Jain');
  const [dailyPuja, setDailyPuja] = useState(false);
  const [choviyar, setChoviyar] = useState(false);
  const [navkarshi, setNavkarshi] = useState(false);
  const [swadhyay, setSwadhyay] = useState(false);
  const [manglikStatus, setManglikStatus] = useState('Non-Manglik');
  const [kundaliMatchNeeded, setKundaliMatchNeeded] = useState('Required');
  const [rashi, setRashi] = useState('');
  const [nakshatra, setNakshatra] = useState('');

  // Academic & Profession
  const [degreeLevel, setDegreeLevel] = useState('');
  const [matQualification, setMatQualification] = useState('');
  const [instituteName, setInstituteName] = useState('');
  const [employedIn, setEmployedIn] = useState('');
  const [matOccupation, setMatOccupation] = useState('');
  const [matCompany, setMatCompany] = useState('');
  const [matAnnualIncome, setMatAnnualIncome] = useState('');
  const [willingToRelocate, setWillingToRelocate] = useState('Yes');

  // Family Background
  const [familyStatus, setFamilyStatus] = useState('');
  const [familyType, setFamilyType] = useState('Joint Family');
  const [familyValues, setFamilyValues] = useState('Traditional Jain');
  const [fatherName, setFatherName] = useState('');
  const [fatherOccupation, setFatherOccupation] = useState('');
  const [motherName, setMotherName] = useState('');
  const [motherOccupation, setMotherOccupation] = useState('');
  const [brothersCount, setBrothersCount] = useState('');
  const [marriedBrothersCount, setMarriedBrothersCount] = useState('');
  const [sistersCount, setSistersCount] = useState('');
  const [marriedSistersCount, setMarriedSistersCount] = useState('');
  const [familyProperty, setFamilyProperty] = useState('');
  const [matFamilyDetails, setMatFamilyDetails] = useState('');

  // Partner Expectations & Bio
  const [partnerAgeMin, setPartnerAgeMin] = useState('');
  const [partnerAgeMax, setPartnerAgeMax] = useState('');
  const [partnerHeightMin, setPartnerHeightMin] = useState('');
  const [partnerHeightMax, setPartnerHeightMax] = useState('');
  const [partnerMaritalStatus, setPartnerMaritalStatus] = useState('Never Married');
  const [partnerSect, setPartnerSect] = useState('Open to all Jain Sects');
  const [partnerEducation, setPartnerEducation] = useState('');
  const [partnerOccupation, setPartnerOccupation] = useState('');
  const [partnerLocation, setPartnerLocation] = useState('');
  const [partnerNotes, setPartnerNotes] = useState('');
  const [matAboutMe, setMatAboutMe] = useState('');

  // Photos & Guardian Contact
  const [matPhotoUrl, setMatPhotoUrl] = useState('');
  const [matGalleryPhotos, setMatGalleryPhotos] = useState<string[]>([]);
  const [photoUploadStatusMsg, setPhotoUploadStatusMsg] = useState('');
  const [guardianName, setGuardianName] = useState('');
  const [guardianRelation, setGuardianRelation] = useState('Father');
  const [guardianPhone, setGuardianPhone] = useState('');
  const [guardianEmail, setGuardianEmail] = useState('');

  // Active Tab for Matrimonial Application Wizard
  const [matActiveTab, setMatActiveTab] = useState<'basic' | 'religious' | 'education' | 'family' | 'expectations' | 'guardian'>('basic');

  // 2. BUSINESS SPECIFIC FIELDS
  const [businessName, setBusinessName] = useState('');
  const [bizCategory, setBizCategory] = useState('Jewellery & Gems');
  const [gstNumber, setGstNumber] = useState('');
  const [bizDescription, setBizDescription] = useState('');
  const [productsServices, setProductsServices] = useState('');
  const [googleMapUrl, setGoogleMapUrl] = useState('');
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [logoUrl, setLogoUrl] = useState('');
  const [galleryUrl, setGalleryUrl] = useState('');

  // 3. TEMPLE SPECIFIC FIELDS
  const [templeName, setTempleName] = useState('');
  const [mainDeity, setMainDeity] = useState('Lord Mahavira');
  const [templeMapUrl, setTempleMapUrl] = useState('');
  const [timings, setTimings] = useState('');
  const [aartiTimings, setAartiTimings] = useState('');
  const [pujaTimings, setPujaTimings] = useState('');
  const [templeHistory, setTempleHistory] = useState('');
  const [hasAccommodation, setHasAccommodation] = useState(false);
  const [dharamshalaRooms, setDharamshalaRooms] = useState('');
  const [hasFoodFacility, setHasFoodFacility] = useState(false);
  const [hasParking, setHasParking] = useState(false);
  const [trustPerson, setTrustPerson] = useState('');
  const [trustPhone, setTrustPhone] = useState('');
  const [donationUpi, setDonationUpi] = useState('');
  const [liveDarshanUrl, setLiveDarshanUrl] = useState('');
  const [templePhotoUrl, setTemplePhotoUrl] = useState('');

  // 4. JAIN FAMILY DIRECTORY SPECIFIC FIELDS
  const [bloodGroup, setBloodGroup] = useState('O+');
  const [familyHeadProfession, setFamilyHeadProfession] = useState('');
  const [familyHeadPhoto, setFamilyHeadPhoto] = useState('');
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

  const handleMainPhotoFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 8 * 1024 * 1024) {
      alert('Photo file size should be under 8MB');
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      setMatPhotoUrl(reader.result as string);
      setPhotoUploadStatusMsg('✨ Main Profile Photo uploaded successfully!');
      setTimeout(() => setPhotoUploadStatusMsg(''), 4000);
    };
    reader.readAsDataURL(file);
  };

  const handleGalleryPhotosUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []) as File[];
    if (!files.length) return;

    const remainingSlots = 5 - matGalleryPhotos.length;
    if (remainingSlots <= 0) {
      alert('Maximum 5 photos allowed in gallery.');
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
      setMatGalleryPhotos((prev) => [...prev, ...newPhotos].slice(0, 5));
      setPhotoUploadStatusMsg(`🎉 Successfully uploaded ${newPhotos.length} gallery photo(s)!`);
      setTimeout(() => setPhotoUploadStatusMsg(''), 4000);
    });
  };

  const handleSlotPhotoUpload = (slotIndex: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 8 * 1024 * 1024) {
      alert('Photo file size should be under 8MB');
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      const photoUrl = reader.result as string;
      setMatGalleryPhotos((prev) => {
        const next = [...prev];
        next[slotIndex] = photoUrl;
        return next.slice(0, 5);
      });
      setPhotoUploadStatusMsg(`📸 Photo Slot #${slotIndex + 1} successfully uploaded!`);
      setTimeout(() => setPhotoUploadStatusMsg(''), 4000);
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveGalleryPhoto = (index: number) => {
    setMatGalleryPhotos((prev) => prev.filter((_, i) => i !== index));
    setPhotoUploadStatusMsg(`Photo #${index + 1} removed.`);
    setTimeout(() => setPhotoUploadStatusMsg(''), 3000);
  };

  const handleSetMainPhotoFromGallery = (photoUrl: string) => {
    const oldMain = matPhotoUrl;
    setMatPhotoUrl(photoUrl);
    if (oldMain && oldMain !== photoUrl) {
      setMatGalleryPhotos((prev) => [...prev.filter((p) => p !== photoUrl), oldMain].slice(0, 5));
    } else {
      setMatGalleryPhotos((prev) => prev.filter((p) => p !== photoUrl));
    }
    setPhotoUploadStatusMsg('⭐ Set as Main Profile Photo!');
    setTimeout(() => setPhotoUploadStatusMsg(''), 3000);
  };

  // Real-time Field Validation Helper for Matrimonial Inputs
  const getMatFieldBorderClass = (
    val: string,
    isRequired = false,
    minLen = 1,
    isNum = false,
    numMin = 18,
    numMax = 80
  ) => {
    const baseTextClass = 'text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-400 font-medium';
    if (!val || val.trim() === '') {
      return isRequired
        ? `border-amber-400/90 dark:border-amber-600/90 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/30 ${baseTextClass}`
        : `border-slate-300 dark:border-slate-700 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/30 ${baseTextClass}`;
    }

    if (isNum) {
      const num = parseInt(val, 10);
      if (isNaN(num) || num < numMin || num > numMax) {
        return 'border-red-500 dark:border-red-500 bg-red-50/80 dark:bg-red-950/80 text-red-900 dark:text-red-100 placeholder-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-500/30 font-bold';
      }
      return 'border-emerald-500 dark:border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/60 text-slate-900 dark:text-slate-100 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/30 font-bold';
    }

    if (val.trim().length >= minLen) {
      return 'border-emerald-500 dark:border-emerald-500 bg-emerald-50/40 dark:bg-emerald-950/50 text-slate-900 dark:text-slate-100 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/30 font-semibold';
    }

    return 'border-red-500 dark:border-red-500 bg-red-50/80 dark:bg-red-950/80 text-red-900 dark:text-red-100 focus:border-red-500 focus:ring-2 focus:ring-red-500/30 font-semibold';
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    let generatedAppId = '';
    const applicantName = headFullName || 'Jain Applicant';
    const registeredEmail = email || 'registered@jainconnect.org';

    if (panelType === 'matrimonial') {
      const createdMat = addMatrimonial({
        fullName: headFullName || 'Jain Candidate',
        gender: candidateGender as any,
        dob: candidateDob,
        age: parseInt(candidateAge) || 26,
        height: candidateHeight || "5'8\"",
        maritalStatus: maritalStatus as any,
        sect: sect as any,
        subSect,
        gotra: gotra || 'Oswal',
        qualification: matQualification,
        occupation: matOccupation,
        company: matCompany,
        annualIncome: matAnnualIncome,
        city: city || 'Mumbai',
        state: state || 'Maharashtra',
        country: country || 'India',
        dietPreference: matDiet as any,
        aboutMe: matAboutMe || 'Culture-oriented Jain candidate seeking a traditional partner.',
        familyDetails: matFamilyDetails || 'Respected Jain family.',
        contactMobile: mobile || '+91 98000 00000',
        contactEmail: email || 'candidate@jainconnect.org',
        photoUrl: matPhotoUrl,
        additionalPhotos: matGalleryPhotos,
        isVerified: false,

        // Extended Details
        createdFor,
        tob,
        pob,
        weight,
        complexion,
        bodyType,
        physicalStatus,
        motherTongue,
        fourGotras: {
          selfGotra: gotra || 'Oswal',
          motherGotra: motherGotra || 'Kothari',
          dadiGotra: fatherMotherGotra || 'Shah',
          naniGotra: motherMotherGotra || 'Mehta',
        },
        nativePlace,
        religiousPractices: {
          dailyPuja,
          choviyar,
          navkarshi,
          swadhyay,
        },
        horoscopeDetails: {
          rashi,
          nakshatra,
          manglikStatus,
          kundaliMatchNeeded,
        },
        educationDetails: {
          degreeLevel: degreeLevel || matQualification,
          fieldOfStudy: matQualification,
          instituteName,
        },
        careerDetails: {
          occupation: matOccupation,
          company: matCompany,
          designation: matOccupation,
          workLocation: city ? `${city}, ${state}` : 'Mumbai',
          annualIncome: matAnnualIncome,
        },
        familyBackground: {
          fatherName,
          fatherOccupation,
          motherName,
          motherOccupation,
          brothersCount: parseInt(brothersCount) || 0,
          marriedBrothersCount: parseInt(marriedBrothersCount) || 0,
          sistersCount: parseInt(sistersCount) || 0,
          marriedSistersCount: parseInt(marriedSistersCount) || 0,
          familyProperty,
        },
        partnerExpectations: {
          ageMin: parseInt(partnerAgeMin) || 22,
          ageMax: parseInt(partnerAgeMax) || 28,
          heightMin: partnerHeightMin,
          heightMax: partnerHeightMax,
          maritalStatusPreferred: partnerMaritalStatus,
          sectPreferred: partnerSect,
          educationPreferred: partnerEducation,
          occupationPreferred: partnerOccupation,
          locationPreferred: partnerLocation,
          dietPreferred: matDiet,
          additionalNotes: partnerNotes,
        },
        guardianContact: {
          name: guardianName || fatherName || headFullName,
          relation: guardianRelation,
          phone: guardianPhone || mobile,
          email: guardianEmail || email,
        },
      });

      const registeredUsr = registerUser({
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

      generatedAppId = createdMat.applicationId || registeredUsr.applicationId || createdMat.id;
    } else if (panelType === 'business') {
      const createdBiz = addBusiness({
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
        isVerified: false,
      });

      const registeredUsr = registerUser({
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

      generatedAppId = createdBiz.applicationId || registeredUsr.applicationId || createdBiz.id;
    } else if (panelType === 'temple') {
      const createdTpl = addTemple({
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
        isVerified: false,
      });

      const registeredUsr = registerUser({
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

      generatedAppId = createdTpl.applicationId || registeredUsr.applicationId || createdTpl.id;
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

      const createdMem = addCommunityMember({
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
        isVerified: false,
      });

      const registeredUsr = registerUser({
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

      generatedAppId = createdMem.applicationId || registeredUsr.applicationId || createdMem.id;
    }

    // Trigger Celebratory Confetti
    try {
      confetti({
        particleCount: 180,
        spread: 110,
        origin: { y: 0.5 },
        colors: ['#f59e0b', '#ef4444', '#10b981', '#fbbf24', '#e11d48', '#3b82f6']
      });
    } catch (err) {
      console.error('Confetti trigger error:', err);
    }

    setSubmissionSuccessData({
      appId: generatedAppId,
      applicantName,
      registeredEmail,
      panelType,
    });
    showToast(`🎉 Application ${generatedAppId} Submitted Successfully!`);
  };

  if (!isRegModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md">
      <div className="bg-white dark:bg-slate-900 border border-amber-300 dark:border-amber-800 rounded-3xl w-full max-w-3xl p-5 sm:p-7 shadow-2xl relative space-y-5 text-slate-800 dark:text-slate-100 max-h-[92vh] overflow-y-auto">
        
        {/* Close Button */}
        <button
          onClick={() => {
            setShowMatrimonialCelebration(false);
            setIsRegModalOpen(false);
          }}
          className="absolute top-4 right-4 p-1.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 hover:text-slate-900 dark:hover:text-white transition-all z-20"
        >
          <X className="w-5 h-5" />
        </button>

        {submissionSuccessData ? (
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', damping: 22, stiffness: 260 }}
            className="flex flex-col items-center justify-center text-center space-y-6 py-6 px-4"
          >
            {/* Animated Big Success Badge */}
            <div className="relative">
              <motion.div
                animate={{ scale: [1, 1.08, 1] }}
                transition={{ repeat: Infinity, duration: 2.5, ease: 'easeInOut' }}
                className="w-20 h-20 bg-emerald-100 dark:bg-emerald-950/80 rounded-full flex items-center justify-center border-4 border-emerald-500 shadow-2xl mx-auto"
              >
                <CheckCircle2 className="w-12 h-12 text-emerald-600 dark:text-emerald-400" />
              </motion.div>
              <div className="absolute -top-1 -right-1 bg-amber-500 text-amber-950 p-1.5 rounded-full shadow-lg border border-white dark:border-slate-800">
                <Sparkles className="w-4 h-4" />
              </div>
            </div>

            {/* Title & Status */}
            <div className="space-y-2 max-w-lg">
              <span className="inline-block px-3.5 py-1 bg-amber-100 dark:bg-amber-900/60 text-amber-800 dark:text-amber-300 rounded-full text-xs font-black uppercase tracking-widest border border-amber-300 dark:border-amber-700">
                Status: Pending Admin Approval
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
                Application Submitted Successfully!
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300">
                Your application details have been saved in the database and sent to the Admin Panel for verification.
              </p>
            </div>

            {/* Generated Application ID Box */}
            <div className="w-full max-w-md bg-gradient-to-r from-amber-50 via-amber-100/70 to-amber-50 dark:from-slate-800 dark:via-amber-950/50 dark:to-slate-800 p-5 rounded-2xl border-2 border-amber-400 dark:border-amber-700 text-left shadow-xl space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider">
                  Your Application ID Number:
                </span>
                <span className="text-[10px] font-extrabold text-amber-800 dark:text-amber-300 bg-amber-200 dark:bg-amber-900/80 px-2 py-0.5 rounded uppercase">
                  {submissionSuccessData.panelType} Registration
                </span>
              </div>
              <div className="flex items-center justify-between gap-3 bg-white dark:bg-slate-900 p-3 rounded-xl border border-amber-300 dark:border-amber-800 shadow-inner">
                <span className="font-mono text-xl sm:text-2xl font-black text-amber-600 dark:text-amber-400 tracking-wider">
                  {submissionSuccessData.appId}
                </span>
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(submissionSuccessData.appId);
                    setCopiedAppId(true);
                    showToast('Application ID copied to clipboard!', '', 'success');
                    setTimeout(() => setCopiedAppId(false), 2000);
                  }}
                  className="px-3 py-2 bg-amber-500 hover:bg-amber-600 text-amber-950 rounded-lg text-xs font-bold transition flex items-center gap-1.5 shrink-0 shadow"
                >
                  {copiedAppId ? <Check className="w-4 h-4 text-emerald-950" /> : <Copy className="w-4 h-4" />}
                  <span>{copiedAppId ? 'Copied!' : 'Copy ID'}</span>
                </button>
              </div>
            </div>

            {/* Official Approval Email Notice */}
            <div className="w-full max-w-md bg-slate-50 dark:bg-slate-800/80 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 text-left space-y-2 shadow-sm">
              <div className="flex items-center gap-2 text-slate-900 dark:text-slate-100 font-bold text-xs">
                <Mail className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
                <span>Email Confirmation Notice</span>
              </div>
              <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed">
                Once reviewed & approved by <strong>Sandeep Bachhawat (Admin)</strong>, an official email notification will be automatically dispatched to your registered email: <strong>{submissionSuccessData.registeredEmail}</strong> from Company's Email ID: <strong className="text-amber-600 dark:text-amber-400 underline">skjtechworld@gmail.com</strong>.
              </p>
            </div>

            {/* Close / Proceed Button */}
            <div className="pt-2 w-full max-w-md">
              <button
                type="button"
                onClick={() => {
                  setSubmissionSuccessData(null);
                  setIsRegModalOpen(false);
                }}
                className="w-full py-3.5 bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 hover:from-amber-600 hover:to-amber-800 text-amber-950 font-black text-xs rounded-xl shadow-xl transition uppercase tracking-wider"
              >
                Done & Close Window
              </button>
            </div>
          </motion.div>
        ) : showMatrimonialCelebration ? (
          <motion.div
            initial={{ scale: 0.85, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', damping: 22, stiffness: 260 }}
            className="flex flex-col items-center justify-center text-center space-y-6 py-6 px-4"
          >
            {/* Animated Floating Badges & Icons */}
            <div className="relative">
              <motion.div
                animate={{ scale: [1, 1.12, 1], rotate: [0, 4, -4, 0] }}
                transition={{ repeat: Infinity, duration: 3.5, ease: 'easeInOut' }}
                className="w-24 h-24 rounded-full bg-gradient-to-tr from-amber-500 via-red-500 to-amber-400 p-1 shadow-2xl flex items-center justify-center relative"
              >
                <div className="w-full h-full rounded-full bg-white dark:bg-slate-900 flex items-center justify-center relative overflow-hidden">
                  {celebrationCandidateData?.photo ? (
                    <img
                      src={celebrationCandidateData.photo}
                      alt="Candidate"
                      className="w-full h-full object-cover rounded-full"
                    />
                  ) : (
                    <Heart className="w-12 h-12 text-red-500 fill-red-500 animate-pulse" />
                  )}
                </div>
              </motion.div>

              <motion.div
                animate={{ y: [-6, 6, -6] }}
                transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
                className="absolute -top-2 -right-2 bg-amber-500 text-slate-950 p-2 rounded-full shadow-lg border border-white dark:border-slate-800"
              >
                <Sparkles className="w-5 h-5 fill-slate-950 text-slate-950" />
              </motion.div>

              <motion.div
                animate={{ y: [6, -6, 6] }}
                transition={{ repeat: Infinity, duration: 2.5, ease: 'easeInOut' }}
                className="absolute -bottom-2 -left-2 bg-red-500 text-white p-2 rounded-full shadow-lg border border-white dark:border-slate-800"
              >
                <Heart className="w-4 h-4 fill-white" />
              </motion.div>
            </div>

            {/* Header Title */}
            <div className="space-y-2 max-w-lg">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/40 text-emerald-700 dark:text-emerald-300 text-xs font-black uppercase tracking-wider">
                <CheckCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>Application Officially Registered</span>
              </div>

              <h3 className="text-2xl sm:text-3xl font-extrabold font-serif text-slate-900 dark:text-white">
                🎉 Subho Vivah Biodata Registered!
              </h3>

              <p className="text-xs sm:text-sm font-semibold text-amber-700 dark:text-amber-400">
                Official Candidate Profile Indexed in JainConnect Global Directory
              </p>
            </div>

            {/* Candidate Summary Card */}
            <div className="w-full max-w-md bg-gradient-to-br from-amber-50/90 via-red-50/40 to-amber-50/90 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 p-4 rounded-2xl border border-amber-300 dark:border-amber-800/80 shadow-md text-left space-y-2 text-xs">
              <div className="flex items-center justify-between border-b border-amber-200/80 dark:border-amber-900/60 pb-2">
                <span className="font-bold text-slate-500 dark:text-slate-400">Candidate Name:</span>
                <span className="font-extrabold text-sm text-slate-900 dark:text-amber-300">
                  {celebrationCandidateData?.name}
                </span>
              </div>

              <div className="flex items-center justify-between border-b border-amber-200/80 dark:border-amber-900/60 pb-2">
                <span className="font-bold text-slate-500 dark:text-slate-400">Looking For:</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">
                  {celebrationCandidateData?.gender === 'Groom' ? 'Bride (Kanya)' : 'Groom (Var)'}
                </span>
              </div>

              <div className="flex items-center justify-between border-b border-amber-200/80 dark:border-amber-900/60 pb-2">
                <span className="font-bold text-slate-500 dark:text-slate-400">Location:</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">
                  {celebrationCandidateData?.city}
                </span>
              </div>

              <div className="flex items-center justify-between pt-1">
                <span className="font-bold text-slate-500 dark:text-slate-400">Verification Status:</span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-800 dark:text-emerald-300 font-extrabold text-[10px] flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                  Verified Jain Listing
                </span>
              </div>
            </div>

            {/* Jain Blessing text */}
            <p className="text-xs text-slate-600 dark:text-slate-300 italic max-w-md leading-relaxed">
              🙏🏻 "May Parmatma Mahavir Swami bless this noble endeavor with happiness, health, and a culturally harmonious life partnership."
            </p>

            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row items-center gap-3 w-full max-w-md pt-2">
              <button
                type="button"
                onClick={() => {
                  setShowMatrimonialCelebration(false);
                  setIsRegModalOpen(false);
                }}
                className="w-full py-3 px-5 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-black text-xs shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer uppercase tracking-wider"
              >
                <Heart className="w-4 h-4 fill-slate-950" />
                <span>Explore Matrimonial Directory</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setShowMatrimonialCelebration(false);
                  setIsRegModalOpen(false);
                }}
                className="w-full sm:w-auto py-3 px-5 rounded-2xl bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs transition-all cursor-pointer"
              >
                Close
              </button>
            </div>
          </motion.div>
        ) : (
          <>
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

          {/* PANEL 1: MATRIMONIAL FULL BASE APPLICATION FORM */}
          {panelType === 'matrimonial' && (
            <div className="bg-gradient-to-br from-amber-500/10 via-red-500/5 to-amber-500/10 p-5 rounded-3xl border border-amber-300 dark:border-amber-800 space-y-5 shadow-lg">
              {/* Form Header with Real-time Validation Progress Bar & Multi-Step Stepper */}
              {(() => {
                const isStep1Valid = !!headFullName.trim() && parseInt(candidateAge, 10) >= 18 && parseInt(candidateAge, 10) <= 80 && !!candidateHeight.trim();
                const isStep2Valid = !!gotra.trim() && !!sect.trim() && !!nativePlace.trim();
                const isStep3Valid = !!matQualification.trim() && !!matOccupation.trim() && !!matAnnualIncome.trim();
                const isStep4Valid = !!familyStatus.trim() || !!fatherName.trim();
                const isStep5Valid = !!partnerAgeMin.trim() || !!partnerEducation.trim();
                const isStep6Valid = !!guardianName.trim() && guardianPhone.replace(/\D/g, '').length >= 8 && !!matPhotoUrl.trim();

                const stepsList = [
                  { id: 'basic', shortLabel: 'Personal', fullTitle: 'Personal Details', icon: User, valid: isStep1Valid, num: 1 },
                  { id: 'religious', shortLabel: 'Religious', fullTitle: 'Religious & Gotras', icon: Sparkles, valid: isStep2Valid, num: 2 },
                  { id: 'education', shortLabel: 'Professional', fullTitle: 'Professional Info', icon: Briefcase, valid: isStep3Valid, num: 3 },
                  { id: 'family', shortLabel: 'Family', fullTitle: 'Family Background', icon: Users, valid: isStep4Valid, num: 4 },
                  { id: 'expectations', shortLabel: 'Preferences', fullTitle: 'Partner Preferences', icon: Sliders, valid: isStep5Valid, num: 5 },
                  { id: 'guardian', shortLabel: 'Contact', fullTitle: 'Contact & Photos', icon: Camera, valid: isStep6Valid, num: 6 }
                ];

                const currentStepObj = stepsList.find(s => s.id === matActiveTab) || stepsList[0];
                const validStepsCount = [isStep1Valid, isStep2Valid, isStep3Valid, isStep4Valid, isStep5Valid, isStep6Valid].filter(Boolean).length;
                const progressPct = Math.round((validStepsCount / 6) * 100);

                return (
                  <>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-amber-200 dark:border-amber-800/60">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-amber-500 text-slate-950">
                            Step {currentStepObj.num} of 6
                          </span>
                          <span className="text-xs font-bold text-amber-700 dark:text-amber-400">
                            {currentStepObj.fullTitle}
                          </span>
                        </div>
                        <h4 className="font-extrabold text-base text-slate-900 dark:text-white flex items-center gap-1.5 mt-1">
                          <Heart className="w-5 h-5 fill-red-500 text-red-500 shrink-0" />
                          <span>Jain Matrimonial Registration Stepper</span>
                        </h4>
                      </div>

                      <div className="flex flex-col items-start sm:items-end gap-1">
                        <div className="text-xs font-extrabold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                          <span>Form Progress:</span>
                          <span className={progressPct === 100 ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600 dark:text-amber-400'}>
                            {progressPct}% ({validStepsCount}/6 Verified)
                          </span>
                        </div>
                        <div className="w-40 h-2 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden border border-slate-300 dark:border-slate-700">
                          <div
                            className={`h-full transition-all duration-500 rounded-full ${
                              progressPct === 100 ? 'bg-emerald-500' : 'bg-gradient-to-r from-amber-500 via-amber-600 to-red-500'
                            }`}
                            style={{ width: `${progressPct}%` }}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Visual Active Step Progress Bar */}
                    <div className="space-y-1.5 bg-amber-50/80 dark:bg-slate-900/60 p-3 rounded-2xl border border-amber-200 dark:border-amber-900/40">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-extrabold text-slate-800 dark:text-slate-100 flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
                          <span>Active Step:</span>
                          <span className="text-amber-700 dark:text-amber-400 font-black">
                            Step {currentStepObj.num} of 6 — {currentStepObj.fullTitle}
                          </span>
                        </span>
                        <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400">
                          {Math.round((currentStepObj.num / 6) * 100)}% Step Flow
                        </span>
                      </div>

                      {/* 6-Segment Progress Track */}
                      <div className="grid grid-cols-6 gap-1.5 h-2.5 w-full bg-slate-200 dark:bg-slate-800 rounded-full p-0.5 border border-slate-300 dark:border-slate-700 overflow-hidden">
                        {stepsList.map((st) => {
                          const isActive = matActiveTab === st.id;
                          const isPast = st.num < currentStepObj.num;
                          const isValid = st.valid;

                          return (
                            <div
                              key={st.id}
                              className={`h-full rounded-full transition-all duration-300 ${
                                isActive
                                  ? 'bg-gradient-to-r from-amber-500 to-amber-600 shadow-md ring-1 ring-amber-400 animate-pulse'
                                  : isPast
                                  ? isValid
                                    ? 'bg-emerald-500'
                                    : 'bg-amber-400/80'
                                  : isValid
                                  ? 'bg-emerald-400/60'
                                  : 'bg-slate-300 dark:bg-slate-700'
                              }`}
                              title={`${st.num}. ${st.fullTitle} (${isActive ? 'Current' : isPast ? 'Completed' : 'Upcoming'})`}
                            />
                          );
                        })}
                      </div>

                      {/* Segment Labels */}
                      <div className="hidden sm:grid grid-cols-6 text-[10px] text-center font-bold text-slate-500 dark:text-slate-400 pt-0.5">
                        {stepsList.map((st) => (
                          <span
                            key={st.id}
                            className={`truncate px-0.5 ${
                              matActiveTab === st.id
                                ? 'text-amber-600 dark:text-amber-400 font-extrabold'
                                : st.valid
                                ? 'text-emerald-600 dark:text-emerald-400'
                                : ''
                            }`}
                          >
                            {st.shortLabel}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Interactive Multi-Step Stepper Navigation Bar */}
                    <div className="grid grid-cols-2 sm:grid-cols-6 gap-2 bg-amber-100/70 dark:bg-slate-900/90 p-2 rounded-2xl border border-amber-300/80 dark:border-amber-900/60 shadow-inner">
                      {stepsList.map((st) => {
                        const IconComponent = st.icon;
                        const isActive = matActiveTab === st.id;

                        return (
                          <button
                            key={st.id}
                            type="button"
                            onClick={() => setMatActiveTab(st.id as any)}
                            className={`p-2 rounded-xl transition-all text-left flex flex-col justify-between relative cursor-pointer ${
                              isActive
                                ? 'bg-amber-600 text-white shadow-lg ring-2 ring-amber-500 scale-[1.02]'
                                : st.valid
                                ? 'bg-emerald-100/90 dark:bg-emerald-950/50 text-emerald-900 dark:text-emerald-300 border border-emerald-400/60 dark:border-emerald-800 hover:bg-emerald-200 dark:hover:bg-emerald-900/60'
                                : 'bg-white/60 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 hover:bg-amber-200/60 dark:hover:bg-slate-700/80 border border-slate-200/60 dark:border-slate-700/60'
                            }`}
                          >
                            <div className="flex items-center justify-between w-full mb-1">
                              <div
                                className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black ${
                                  isActive
                                    ? 'bg-white text-amber-700'
                                    : st.valid
                                    ? 'bg-emerald-500 text-white'
                                    : 'bg-amber-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200'
                                }`}
                              >
                                {st.valid && !isActive ? '✓' : st.num}
                              </div>
                              <IconComponent className={`w-3.5 h-3.5 ${isActive ? 'text-white' : st.valid ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600 dark:text-amber-400'}`} />
                            </div>

                            <span className="font-extrabold text-xs truncate leading-tight">{st.shortLabel}</span>
                            <span className={`text-[9px] truncate leading-none mt-0.5 ${isActive ? 'text-amber-100' : 'text-slate-500 dark:text-slate-400'}`}>
                              {st.fullTitle}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </>
                );
              })()}

              {/* STEP 1: BASIC PROFILE */}
              {matActiveTab === 'basic' && (
                <div className="space-y-4 animate-fadeIn">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block font-bold text-xs mb-1 text-slate-700 dark:text-slate-200">Profile Created For *</label>
                      <select
                        value={createdFor}
                        onChange={(e) => setCreatedFor(e.target.value)}
                        className={`w-full p-2.5 rounded-xl bg-white dark:bg-slate-900 border text-xs font-bold ${getMatFieldBorderClass(createdFor, true)}`}
                      >
                        <option value="Self">Self</option>
                        <option value="Son">Son</option>
                        <option value="Daughter">Daughter</option>
                        <option value="Brother">Brother</option>
                        <option value="Sister">Sister</option>
                        <option value="Relative">Relative / Friend</option>
                      </select>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="block font-bold text-xs text-slate-700 dark:text-slate-200">Candidate Full Name *</label>
                        {headFullName.trim().length >= 2 ? (
                          <span className="text-[10px] font-extrabold text-emerald-600 dark:text-emerald-400">✓ Valid</span>
                        ) : (
                          <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400">⚠️ Required</span>
                        )}
                      </div>
                      <input
                        type="text"
                        placeholder="Candidate Full Name"
                        value={headFullName}
                        onChange={(e) => setHeadFullName(e.target.value)}
                        required
                        className={`w-full p-2.5 rounded-xl bg-white dark:bg-slate-900 border text-xs transition-all ${getMatFieldBorderClass(headFullName, true, 2)}`}
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-xs mb-1 text-slate-700 dark:text-slate-200">Gender *</label>
                      <select
                        value={candidateGender}
                        onChange={(e) => setCandidateGender(e.target.value as any)}
                        className={`w-full p-2.5 rounded-xl bg-white dark:bg-slate-900 border font-bold text-xs ${getMatFieldBorderClass(candidateGender, true)}`}
                      >
                        <option value="Groom">Groom (Looking for Bride)</option>
                        <option value="Bride">Bride (Looking for Groom)</option>
                      </select>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="block font-bold text-xs text-slate-700 dark:text-slate-200">Date of Birth *</label>
                        {candidateAge && (
                          <span className="text-[10px] font-extrabold text-amber-600 dark:text-amber-400">
                            Auto Calculated Age: <strong className="text-emerald-600 dark:text-emerald-400">{candidateAge} Yrs</strong>
                          </span>
                        )}
                      </div>
                      <input
                        type="date"
                        value={candidateDob}
                        onChange={(e) => setCandidateDob(e.target.value)}
                        className={`w-full p-2.5 rounded-xl bg-white dark:bg-slate-900 border text-xs font-bold ${getMatFieldBorderClass(candidateDob)}`}
                      />
                    </div>

                    {/* Time of Birth in 12 hrs format with AM/PM selector */}
                    <div>
                      <label className="block font-bold text-xs mb-1 text-slate-700 dark:text-slate-200">
                        Time of Birth (12 Hrs Format)
                      </label>
                      <div className="flex items-center gap-1.5 bg-slate-50 dark:bg-slate-900 p-1.5 rounded-xl border border-slate-200 dark:border-slate-800">
                        <Clock className="w-4 h-4 text-amber-500 shrink-0 ml-1" />
                        <select
                          value={tobHour}
                          onChange={(e) => setTobHour(e.target.value)}
                          className="p-1.5 rounded-lg bg-white dark:bg-slate-800 border text-xs font-bold text-slate-800 dark:text-slate-100 flex-1 outline-none"
                        >
                          {Array.from({ length: 12 }, (_, i) => {
                            const h = (i + 1).toString().padStart(2, '0');
                            return <option key={h} value={h}>{h}</option>;
                          })}
                        </select>
                        <span className="font-bold text-slate-500 text-xs">:</span>
                        <select
                          value={tobMinute}
                          onChange={(e) => setTobMinute(e.target.value)}
                          className="p-1.5 rounded-lg bg-white dark:bg-slate-800 border text-xs font-bold text-slate-800 dark:text-slate-100 flex-1 outline-none"
                        >
                          {Array.from({ length: 60 }, (_, i) => {
                            const m = i.toString().padStart(2, '0');
                            return <option key={m} value={m}>{m}</option>;
                          })}
                        </select>
                        <div className="flex items-center p-0.5 bg-slate-200 dark:bg-slate-800 rounded-lg shrink-0">
                          <button
                            type="button"
                            onClick={() => setTobAmpm('AM')}
                            className={`px-2 py-1 rounded-md text-[10px] font-black transition-all ${
                              tobAmpm === 'AM'
                                ? 'bg-amber-500 text-slate-950 shadow-sm'
                                : 'text-slate-600 dark:text-slate-400'
                            }`}
                          >
                            AM
                          </button>
                          <button
                            type="button"
                            onClick={() => setTobAmpm('PM')}
                            className={`px-2 py-1 rounded-md text-[10px] font-black transition-all ${
                              tobAmpm === 'PM'
                                ? 'bg-amber-500 text-slate-950 shadow-sm'
                                : 'text-slate-600 dark:text-slate-400'
                            }`}
                          >
                            PM
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Place of Birth with Map/Popular Location Dropdown */}
                    <div className="relative">
                      <label className="block font-bold text-xs mb-1 text-slate-700 dark:text-slate-200">
                        Place of Birth (City / Location)
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          placeholder="Type city or select from map list..."
                          value={pob}
                          onChange={(e) => {
                            setPob(e.target.value);
                            setIsPobDropdownOpen(true);
                          }}
                          onFocus={() => setIsPobDropdownOpen(true)}
                          className={`w-full pl-8 pr-8 py-2.5 rounded-xl bg-white dark:bg-slate-900 border text-xs ${getMatFieldBorderClass(pob)}`}
                        />
                        <MapPin className="w-4 h-4 text-amber-500 absolute left-2.5 top-3 shrink-0" />
                        <button
                          type="button"
                          onClick={() => setIsPobDropdownOpen(!isPobDropdownOpen)}
                          className="absolute right-2 top-2.5 p-1 text-slate-400 hover:text-amber-500"
                        >
                          <ChevronDown className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Dropdown suggestions */}
                      {isPobDropdownOpen && (
                        <div className="absolute left-0 right-0 mt-1 bg-white dark:bg-slate-900 border border-amber-300 dark:border-amber-800 rounded-xl shadow-xl z-30 max-h-48 overflow-y-auto p-1 text-xs">
                          <div className="px-2 py-1 text-[10px] font-bold uppercase text-amber-600 dark:text-amber-400 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                            <span>Select Place of Birth</span>
                            <button
                              type="button"
                              onClick={() => setIsPobDropdownOpen(false)}
                              className="text-slate-400 hover:text-slate-600"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                          {POPULAR_JAIN_PLACES.filter((place) =>
                            place.toLowerCase().includes(pob.toLowerCase())
                          ).map((place) => (
                            <button
                              key={place}
                              type="button"
                              onClick={() => {
                                setPob(place);
                                setIsPobDropdownOpen(false);
                              }}
                              className="w-full text-left px-2.5 py-1.5 hover:bg-amber-50 dark:hover:bg-amber-950/40 rounded-lg text-slate-800 dark:text-slate-200 flex items-center justify-between font-medium"
                            >
                              <span className="flex items-center gap-1.5">
                                <MapPin className="w-3 h-3 text-amber-500" />
                                {place}
                              </span>
                              {pob === place && <Check className="w-3.5 h-3.5 text-emerald-500" />}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="block font-bold text-xs text-slate-700 dark:text-slate-200">Age * (Auto Calculated) & Height *</label>
                        {(() => {
                          const numAge = parseInt(candidateAge, 10);
                          if (!candidateAge) return <span className="text-[10px] text-amber-600 font-bold">⚠️ Enter DOB</span>;
                          if (isNaN(numAge) || numAge < 18 || numAge > 80) return <span className="text-[10px] text-red-500 font-bold">❌ Age 18-80</span>;
                          return <span className="text-[10px] text-emerald-600 font-bold">✓ {candidateAge} Yrs</span>;
                        })()}
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <input
                          type="number"
                          placeholder="Age (Yrs)"
                          value={candidateAge}
                          onChange={(e) => setCandidateAge(e.target.value)}
                          className={`w-full p-2.5 rounded-xl bg-white dark:bg-slate-900 border text-xs font-bold transition-all ${getMatFieldBorderClass(candidateAge, true, 1, true, 18, 80)}`}
                        />
                        <input
                          type="text"
                          placeholder="e.g. 5'8&quot;"
                          value={candidateHeight}
                          onChange={(e) => setCandidateHeight(e.target.value)}
                          className={`w-full p-2.5 rounded-xl bg-white dark:bg-slate-900 border text-xs transition-all ${getMatFieldBorderClass(candidateHeight, true, 2)}`}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block font-bold text-xs mb-1 text-slate-700 dark:text-slate-200">Weight & Complexion</label>
                      <div className="grid grid-cols-2 gap-2">
                        <input
                          type="text"
                          placeholder="Weight (kg)"
                          value={weight}
                          onChange={(e) => setWeight(e.target.value)}
                          className="w-full p-2.5 rounded-xl bg-white dark:bg-slate-900 border text-xs"
                        />
                        <select
                          value={complexion}
                          onChange={(e) => setComplexion(e.target.value)}
                          className="w-full p-2.5 rounded-xl bg-white dark:bg-slate-900 border text-xs"
                        >
                          <option value="Fair">Fair</option>
                          <option value="Very Fair">Very Fair</option>
                          <option value="Wheatish">Wheatish</option>
                          <option value="Dark">Dark</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block font-bold text-xs mb-1 text-slate-700 dark:text-slate-200">Body Type & Physical Status</label>
                      <div className="grid grid-cols-2 gap-2">
                        <select
                          value={bodyType}
                          onChange={(e) => setBodyType(e.target.value)}
                          className="w-full p-2.5 rounded-xl bg-white dark:bg-slate-900 border text-xs"
                        >
                          <option value="Average">Average</option>
                          <option value="Slim">Slim</option>
                          <option value="Athletic">Athletic</option>
                          <option value="Heavy">Heavy</option>
                        </select>
                        <select
                          value={physicalStatus}
                          onChange={(e) => setPhysicalStatus(e.target.value)}
                          className="w-full p-2.5 rounded-xl bg-white dark:bg-slate-900 border text-xs"
                        >
                          <option value="Normal">Normal</option>
                          <option value="Physically Challenged">Physically Challenged</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block font-bold text-xs mb-1 text-slate-700 dark:text-slate-200">Marital Status & Mother Tongue *</label>
                      <div className="grid grid-cols-2 gap-2">
                        <select
                          value={maritalStatus}
                          onChange={(e) => setMaritalStatus(e.target.value)}
                          className="w-full p-2.5 rounded-xl bg-white dark:bg-slate-900 border text-xs font-bold"
                        >
                          <option value="Never Married">Never Married</option>
                          <option value="Divorced">Divorced</option>
                          <option value="Widowed">Widowed</option>
                          <option value="Awaiting Divorce">Awaiting Divorce</option>
                        </select>
                        <select
                          value={motherTongue}
                          onChange={(e) => setMotherTongue(e.target.value)}
                          className="w-full p-2.5 rounded-xl bg-white dark:bg-slate-900 border text-xs font-bold"
                        >
                          <option value="Hindi">Hindi</option>
                          <option value="Gujarati">Gujarati</option>
                          <option value="Marwari">Marwari</option>
                          <option value="Mewari">Mewari</option>
                          <option value="Kutchi">Kutchi</option>
                          <option value="Marathi">Marathi</option>
                          <option value="Tamil">Tamil</option>
                          <option value="Telugu">Telugu</option>
                          <option value="Kannada">Kannada</option>
                          <option value="Malayalam">Malayalam</option>
                          <option value="Bengali">Bengali</option>
                          <option value="Punjabi">Punjabi</option>
                          <option value="English">English</option>
                          <option value="Other">Other Language</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-amber-200/80 dark:border-amber-800/60">
                    <div className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                      Step 1 of 6 • Personal Details
                    </div>
                    <button
                      type="button"
                      onClick={() => setMatActiveTab('religious')}
                      className="px-5 py-2.5 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white rounded-xl text-xs font-extrabold shadow-md flex items-center gap-1.5 transition-all cursor-pointer"
                    >
                      <span>Next: Religious & 4-Gotras</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 2: JAIN RELIGION, CULTURAL & 4-GOTRA VERIFICATION */}
              {matActiveTab === 'religious' && (
                <div className="space-y-4 animate-fadeIn">
                  <div className="bg-amber-100/50 dark:bg-amber-950/30 p-3 rounded-2xl border border-amber-300 dark:border-amber-800/60 text-xs">
                    <h5 className="font-extrabold text-amber-800 dark:text-amber-300 flex items-center gap-1 mb-1">
                      <span>Sacred 4-Gotras System (Traditional Jain Verification)</span>
                    </h5>
                    <p className="text-slate-600 dark:text-slate-400">
                      In authentic Jain matrimonial traditions, 4-Gotra verification guarantees lineage clarity and ancestral respect.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="block font-bold text-xs text-slate-700 dark:text-slate-200">1. Self / Father's Gotra *</label>
                        {gotra.trim().length >= 2 ? (
                          <span className="text-[10px] font-extrabold text-emerald-600 dark:text-emerald-400">✓ Valid Gotra</span>
                        ) : (
                          <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400">⚠️ Gotra Required</span>
                        )}
                      </div>
                      <input
                        type="text"
                        placeholder="e.g. Oswal / Bachhawat / Porwal"
                        value={gotra}
                        onChange={(e) => setGotra(e.target.value)}
                        className={`w-full p-2.5 rounded-xl bg-white dark:bg-slate-900 border text-xs font-bold transition-all ${getMatFieldBorderClass(gotra, true, 2)}`}
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-xs mb-1 text-slate-700 dark:text-slate-200">2. Mother's Maiden Gotra</label>
                      <input
                        type="text"
                        placeholder="e.g. Kothari / Mehta"
                        value={motherGotra}
                        onChange={(e) => setMotherGotra(e.target.value)}
                        className={`w-full p-2.5 rounded-xl bg-white dark:bg-slate-900 border text-xs ${getMatFieldBorderClass(motherGotra)}`}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="block font-bold text-xs text-slate-700 dark:text-slate-200">Jain Sect *</label>
                        <span className="text-[10px] font-extrabold text-emerald-600 dark:text-emerald-400">✓ Selected</span>
                      </div>
                      <select
                        value={sect}
                        onChange={(e) => setSect(e.target.value)}
                        className={`w-full p-2.5 rounded-xl bg-white dark:bg-slate-900 border text-xs font-bold text-amber-700 dark:text-amber-400 ${getMatFieldBorderClass(sect, true)}`}
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
                      <label className="block font-bold text-xs mb-1 text-slate-700 dark:text-slate-200">Sub-Sect / Sampraday</label>
                      <input
                        type="text"
                        placeholder="e.g. Tapagachha / Kharatargachha"
                        value={subSect}
                        onChange={(e) => setSubSect(e.target.value)}
                        className={`w-full p-2.5 rounded-xl bg-white dark:bg-slate-900 border text-xs ${getMatFieldBorderClass(subSect)}`}
                      />
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="block font-bold text-xs text-slate-700 dark:text-slate-200">Native Place / Vatan / Gam *</label>
                        {nativePlace.trim().length >= 2 ? (
                          <span className="text-[10px] font-extrabold text-emerald-600 dark:text-emerald-400">✓ Valid Native</span>
                        ) : (
                          <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400">⚠️ Required</span>
                        )}
                      </div>
                      <input
                        type="text"
                        placeholder="e.g. Pali, Rajasthan / Patan, Gujarat"
                        value={nativePlace}
                        onChange={(e) => setNativePlace(e.target.value)}
                        className={`w-full p-2.5 rounded-xl bg-white dark:bg-slate-900 border text-xs transition-all ${getMatFieldBorderClass(nativePlace, true, 2)}`}
                      />
                    </div>
                  </div>

                  {/* Dietary & Religious Practices */}
                  <div className="space-y-2">
                    <label className="block font-bold text-xs text-slate-700 dark:text-slate-200">Dietary & Daily Spiritual Discipline *</label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <select
                          value={matDiet}
                          onChange={(e) => setMatDiet(e.target.value as any)}
                          className={`w-full p-2.5 rounded-xl bg-white dark:bg-slate-900 border font-bold text-xs ${getMatFieldBorderClass(matDiet, true)}`}
                        >
                          <option value="Strict Jain">Strict Jain (No Onion/Garlic/Root Veggies)</option>
                          <option value="Pure Veg">Pure Vegetarian</option>
                          <option value="Vegan">Vegan</option>
                        </select>
                      </div>

                      <div className="sm:col-span-2 grid grid-cols-2 gap-2 text-xs bg-white dark:bg-slate-900 p-2.5 rounded-xl border">
                        <label className="flex items-center gap-1.5 cursor-pointer font-medium">
                          <input
                            type="checkbox"
                            checked={dailyPuja}
                            onChange={(e) => setDailyPuja(e.target.checked)}
                            className="rounded text-amber-600 focus:ring-amber-500"
                          />
                          <span>Daily Navkar / Puja</span>
                        </label>
                        <label className="flex items-center gap-1.5 cursor-pointer font-medium">
                          <input
                            type="checkbox"
                            checked={choviyar}
                            onChange={(e) => setChoviyar(e.target.checked)}
                            className="rounded text-amber-600 focus:ring-amber-500"
                          />
                          <span>Follows Choviyar (Night Food restriction)</span>
                        </label>
                        <label className="flex items-center gap-1.5 cursor-pointer font-medium">
                          <input
                            type="checkbox"
                            checked={navkarshi}
                            onChange={(e) => setNavkarshi(e.target.checked)}
                            className="rounded text-amber-600 focus:ring-amber-500"
                          />
                          <span>Follows Navkarshi</span>
                        </label>
                        <label className="flex items-center gap-1.5 cursor-pointer font-medium">
                          <input
                            type="checkbox"
                            checked={swadhyay}
                            onChange={(e) => setSwadhyay(e.target.checked)}
                            className="rounded text-amber-600 focus:ring-amber-500"
                          />
                          <span>Swadhyay / Pathshala</span>
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* Horoscope & Kundali */}
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 border-t border-amber-200 dark:border-amber-800/40 pt-3">
                    <div>
                      <label className="block font-bold text-xs mb-1 text-slate-700 dark:text-slate-200">Manglik Status</label>
                      <select
                        value={manglikStatus}
                        onChange={(e) => setManglikStatus(e.target.value)}
                        className="w-full p-2 rounded-xl bg-white dark:bg-slate-900 border text-xs"
                      >
                        <option value="Non-Manglik">Non-Manglik</option>
                        <option value="Manglik">Manglik</option>
                        <option value="Anshik Manglik">Anshik Manglik</option>
                        <option value="Don't Know">Don't Know</option>
                      </select>
                    </div>

                    <div>
                      <label className="block font-bold text-xs mb-1 text-slate-700 dark:text-slate-200">Kundali Matching</label>
                      <select
                        value={kundaliMatchNeeded}
                        onChange={(e) => setKundaliMatchNeeded(e.target.value)}
                        className="w-full p-2 rounded-xl bg-white dark:bg-slate-900 border text-xs"
                      >
                        <option value="Required">Required</option>
                        <option value="Optional">Optional</option>
                        <option value="Not Needed">Not Needed</option>
                      </select>
                    </div>

                    <div>
                      <label className="block font-bold text-xs mb-1 text-slate-700 dark:text-slate-200">Rashi</label>
                      <input
                        type="text"
                        placeholder="e.g. Kanya / Simha"
                        value={rashi}
                        onChange={(e) => setRashi(e.target.value)}
                        className="w-full p-2 rounded-xl bg-white dark:bg-slate-900 border text-xs"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-xs mb-1 text-slate-700 dark:text-slate-200">Nakshatra</label>
                      <input
                        type="text"
                        placeholder="e.g. Hasta / Rohini"
                        value={nakshatra}
                        onChange={(e) => setNakshatra(e.target.value)}
                        className="w-full p-2 rounded-xl bg-white dark:bg-slate-900 border text-xs"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-amber-200/80 dark:border-amber-800/60">
                    <button
                      type="button"
                      onClick={() => setMatActiveTab('basic')}
                      className="px-4 py-2 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" />
                      <span>Back</span>
                    </button>
                    <div className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                      Step 2 of 6 • Religious & Gotras
                    </div>
                    <button
                      type="button"
                      onClick={() => setMatActiveTab('education')}
                      className="px-5 py-2.5 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white rounded-xl text-xs font-extrabold shadow-md flex items-center gap-1.5 transition-all cursor-pointer"
                    >
                      <span>Next: Professional Info</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 3: EDUCATION, CAREER & INCOME */}
              {matActiveTab === 'education' && (
                <div className="space-y-4 animate-fadeIn">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block font-bold text-xs mb-1 text-slate-700 dark:text-slate-200">Highest Education Degree</label>
                      <select
                        value={degreeLevel}
                        onChange={(e) => setDegreeLevel(e.target.value)}
                        className={`w-full p-2.5 rounded-xl bg-white dark:bg-slate-900 border text-xs font-bold ${getMatFieldBorderClass(degreeLevel, true)}`}
                      >
                        <option value="Doctorate">Doctorate / Ph.D.</option>
                        <option value="Post Graduate">Post Graduate (Master's)</option>
                        <option value="Bachelor's Degree">Bachelor's Degree</option>
                        <option value="Diploma">Diploma</option>
                        <option value="High School">High School</option>
                      </select>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="block font-bold text-xs text-slate-700 dark:text-slate-200">Field of Study / Degree Name *</label>
                        {matQualification.trim().length >= 2 ? (
                          <span className="text-[10px] font-extrabold text-emerald-600 dark:text-emerald-400">✓ Valid Degree</span>
                        ) : (
                          <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400">⚠️ Qualification Required</span>
                        )}
                      </div>
                      <input
                        type="text"
                        placeholder="e.g. CA / B.Tech Computer Science / MBA / MBBS"
                        value={matQualification}
                        onChange={(e) => setMatQualification(e.target.value)}
                        className={`w-full p-2.5 rounded-xl bg-white dark:bg-slate-900 border text-xs transition-all ${getMatFieldBorderClass(matQualification, true, 2)}`}
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-xs mb-1 text-slate-700 dark:text-slate-200">College / University Name</label>
                      <input
                        type="text"
                        placeholder="e.g. IIT Bombay / ICAI / Mumbai University"
                        value={instituteName}
                        onChange={(e) => setInstituteName(e.target.value)}
                        className={`w-full p-2.5 rounded-xl bg-white dark:bg-slate-900 border text-xs ${getMatFieldBorderClass(instituteName)}`}
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-xs mb-1 text-slate-700 dark:text-slate-200">Employment Sector</label>
                      <select
                        value={employedIn}
                        onChange={(e) => setEmployedIn(e.target.value)}
                        className={`w-full p-2.5 rounded-xl bg-white dark:bg-slate-900 border text-xs ${getMatFieldBorderClass(employedIn, true)}`}
                      >
                        <option value="Private Sector">Private Sector Company</option>
                        <option value="Government Sector">Government / Public Sector</option>
                        <option value="Family Business Owner">Family Business Owner</option>
                        <option value="Entrepreneur / Founder">Entrepreneur / Founder</option>
                        <option value="Self-Employed Professional">Self-Employed Professional (CA/Doctor/Lawyer)</option>
                        <option value="Not Working">Not Working / Homemaker</option>
                      </select>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="block font-bold text-xs text-slate-700 dark:text-slate-200">Designation / Occupation *</label>
                        {matOccupation.trim().length >= 2 ? (
                          <span className="text-[10px] font-extrabold text-emerald-600 dark:text-emerald-400">✓ Valid Occupation</span>
                        ) : (
                          <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400">⚠️ Occupation Required</span>
                        )}
                      </div>
                      <input
                        type="text"
                        placeholder="e.g. Senior Software Engineer / Partner CA"
                        value={matOccupation}
                        onChange={(e) => setMatOccupation(e.target.value)}
                        className={`w-full p-2.5 rounded-xl bg-white dark:bg-slate-900 border text-xs transition-all ${getMatFieldBorderClass(matOccupation, true, 2)}`}
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-xs mb-1 text-slate-700 dark:text-slate-200">Company / Enterprise Name</label>
                      <input
                        type="text"
                        placeholder="e.g. Google / Family Diamond Enterprise"
                        value={matCompany}
                        onChange={(e) => setMatCompany(e.target.value)}
                        className={`w-full p-2.5 rounded-xl bg-white dark:bg-slate-900 border text-xs ${getMatFieldBorderClass(matCompany)}`}
                      />
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="block font-bold text-xs text-slate-700 dark:text-slate-200">Annual Income Package *</label>
                        <span className="text-[10px] font-extrabold text-emerald-600 dark:text-emerald-400">✓ Selected</span>
                      </div>
                      <select
                        value={matAnnualIncome}
                        onChange={(e) => setMatAnnualIncome(e.target.value)}
                        className={`w-full p-2.5 rounded-xl bg-white dark:bg-slate-900 border text-xs font-bold ${getMatFieldBorderClass(matAnnualIncome, true)}`}
                      >
                        <option value="₹ 5-10 Lakhs">₹ 5-10 Lakhs</option>
                        <option value="₹ 10-20 Lakhs">₹ 10-20 Lakhs</option>
                        <option value="₹ 20-50 Lakhs">₹ 20-50 Lakhs</option>
                        <option value="₹ 50 Lakhs - 1 Crore">₹ 50 Lakhs - 1 Crore</option>
                        <option value="₹ 1 Crore+">₹ 1 Crore+</option>
                        <option value="USD $100k+">USD $100k+ (Overseas)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block font-bold text-xs mb-1 text-slate-700 dark:text-slate-200">Willing to Relocate?</label>
                      <select
                        value={willingToRelocate}
                        onChange={(e) => setWillingToRelocate(e.target.value)}
                        className="w-full p-2.5 rounded-xl bg-white dark:bg-slate-900 border text-xs"
                      >
                        <option value="Yes">Yes, willing to relocate</option>
                        <option value="No">No, fixed location</option>
                        <option value="Open to Discuss">Open to Discuss</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-amber-200/80 dark:border-amber-800/60">
                    <button
                      type="button"
                      onClick={() => setMatActiveTab('religious')}
                      className="px-4 py-2 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" />
                      <span>Back</span>
                    </button>
                    <div className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                      Step 3 of 6 • Professional Info
                    </div>
                    <button
                      type="button"
                      onClick={() => setMatActiveTab('family')}
                      className="px-5 py-2.5 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white rounded-xl text-xs font-extrabold shadow-md flex items-center gap-1.5 transition-all cursor-pointer"
                    >
                      <span>Next: Family Background</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 4: FAMILY BACKGROUND & WEALTH */}
              {matActiveTab === 'family' && (
                <div className="space-y-4 animate-fadeIn">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block font-bold text-xs mb-1 text-slate-700 dark:text-slate-200">Family Status</label>
                      <select
                        value={familyStatus}
                        onChange={(e) => setFamilyStatus(e.target.value)}
                        className="w-full p-2.5 rounded-xl bg-white dark:bg-slate-900 border text-xs"
                      >
                        <option value="Affluent">Affluent / High Net Worth</option>
                        <option value="Upper Middle Class">Upper Middle Class</option>
                        <option value="Middle Class">Middle Class</option>
                      </select>
                    </div>

                    <div>
                      <label className="block font-bold text-xs mb-1 text-slate-700 dark:text-slate-200">Family Type & Values</label>
                      <div className="grid grid-cols-2 gap-2">
                        <select
                          value={familyType}
                          onChange={(e) => setFamilyType(e.target.value)}
                          className="w-full p-2.5 rounded-xl bg-white dark:bg-slate-900 border text-xs"
                        >
                          <option value="Joint Family">Joint Family</option>
                          <option value="Nuclear Family">Nuclear Family</option>
                        </select>
                        <select
                          value={familyValues}
                          onChange={(e) => setFamilyValues(e.target.value)}
                          className="w-full p-2.5 rounded-xl bg-white dark:bg-slate-900 border text-xs"
                        >
                          <option value="Traditional Jain">Traditional Jain</option>
                          <option value="Moderate">Moderate</option>
                          <option value="Liberal">Liberal</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block font-bold text-xs mb-1 text-slate-700 dark:text-slate-200">Father's Name & Occupation *</label>
                      <div className="grid grid-cols-2 gap-2">
                        <input
                          type="text"
                          placeholder="Father Name"
                          value={fatherName}
                          onChange={(e) => setFatherName(e.target.value)}
                          className="w-full p-2.5 rounded-xl bg-white dark:bg-slate-900 border text-xs"
                        />
                        <select
                          value={fatherOccupation}
                          onChange={(e) => setFatherOccupation(e.target.value)}
                          className="w-full p-2.5 rounded-xl bg-white dark:bg-slate-900 border text-xs font-semibold"
                        >
                          <option value="">Select Occupation</option>
                          <option value="Business Owner / Industrialist">Business Owner / Industrialist</option>
                          <option value="Private Service / Corporate">Private Service / Corporate</option>
                          <option value="Government / Public Sector">Government / Public Sector</option>
                          <option value="Professional (CA / Doctor / Lawyer)">Professional (CA/Doctor/Lawyer)</option>
                          <option value="Real Estate / Builder / Trader">Real Estate / Builder / Trader</option>
                          <option value="Agriculture / Farming">Agriculture / Farming</option>
                          <option value="Retired">Retired</option>
                          <option value="Passed Away / Late">Passed Away / Late</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block font-bold text-xs mb-1 text-slate-700 dark:text-slate-200">Mother's Name & Occupation *</label>
                      <div className="grid grid-cols-2 gap-2">
                        <input
                          type="text"
                          placeholder="Mother Name"
                          value={motherName}
                          onChange={(e) => setMotherName(e.target.value)}
                          className="w-full p-2.5 rounded-xl bg-white dark:bg-slate-900 border text-xs"
                        />
                        <select
                          value={motherOccupation}
                          onChange={(e) => setMotherOccupation(e.target.value)}
                          className="w-full p-2.5 rounded-xl bg-white dark:bg-slate-900 border text-xs font-semibold"
                        >
                          <option value="Homemaker">Homemaker</option>
                          <option value="Business Owner / Entrepreneur">Business Owner / Entrepreneur</option>
                          <option value="Teacher / Academician">Teacher / Academician</option>
                          <option value="Private Service / Corporate">Private Service / Corporate</option>
                          <option value="Government Service">Government Service</option>
                          <option value="Professional (Doctor / CA / Lawyer)">Professional (Doctor/CA/Lawyer)</option>
                          <option value="Passed Away / Late">Passed Away / Late</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block font-bold text-xs mb-1 text-slate-700 dark:text-slate-200">Brothers (Total & Married)</label>
                      <div className="grid grid-cols-2 gap-2">
                        <input
                          type="number"
                          placeholder="Total Brothers"
                          value={brothersCount}
                          onChange={(e) => setBrothersCount(e.target.value)}
                          className="w-full p-2.5 rounded-xl bg-white dark:bg-slate-900 border text-xs"
                        />
                        <input
                          type="number"
                          placeholder="Married Brothers"
                          value={marriedBrothersCount}
                          onChange={(e) => setMarriedBrothersCount(e.target.value)}
                          className="w-full p-2.5 rounded-xl bg-white dark:bg-slate-900 border text-xs"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block font-bold text-xs mb-1 text-slate-700 dark:text-slate-200">Sisters (Total & Married)</label>
                      <div className="grid grid-cols-2 gap-2">
                        <input
                          type="number"
                          placeholder="Total Sisters"
                          value={sistersCount}
                          onChange={(e) => setSistersCount(e.target.value)}
                          className="w-full p-2.5 rounded-xl bg-white dark:bg-slate-900 border text-xs"
                        />
                        <input
                          type="number"
                          placeholder="Married Sisters"
                          value={marriedSistersCount}
                          onChange={(e) => setMarriedSistersCount(e.target.value)}
                          className="w-full p-2.5 rounded-xl bg-white dark:bg-slate-900 border text-xs"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-xs mb-1 text-slate-700 dark:text-slate-200">Family Assets, Residence & Property Details</label>
                    <textarea
                      rows={2}
                      placeholder="e.g. Own 3BHK flat in Juhu, Mumbai & commercial showroom in Surat..."
                      value={familyProperty}
                      onChange={(e) => setFamilyProperty(e.target.value)}
                      className="w-full p-2.5 rounded-xl bg-white dark:bg-slate-900 border text-xs"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-xs mb-1 text-slate-700 dark:text-slate-200">General Family Summary</label>
                    <textarea
                      rows={2}
                      placeholder="Describe family values, business history, respected standing in community..."
                      value={matFamilyDetails}
                      onChange={(e) => setMatFamilyDetails(e.target.value)}
                      className="w-full p-2.5 rounded-xl bg-white dark:bg-slate-900 border text-xs"
                    />
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-amber-200/80 dark:border-amber-800/60">
                    <button
                      type="button"
                      onClick={() => setMatActiveTab('education')}
                      className="px-4 py-2 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" />
                      <span>Back</span>
                    </button>
                    <div className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                      Step 4 of 6 • Family Background
                    </div>
                    <button
                      type="button"
                      onClick={() => setMatActiveTab('expectations')}
                      className="px-5 py-2.5 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white rounded-xl text-xs font-extrabold shadow-md flex items-center gap-1.5 transition-all cursor-pointer"
                    >
                      <span>Next: Partner Preferences</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 5: PARTNER EXPECTATIONS & CANDIDATE BIO */}
              {matActiveTab === 'expectations' && (
                <div className="space-y-4 animate-fadeIn">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block font-bold text-xs mb-1 text-slate-700 dark:text-slate-200">Desired Partner Age Range</label>
                      <div className="grid grid-cols-2 gap-2">
                        <input
                          type="number"
                          placeholder="Min Age"
                          value={partnerAgeMin}
                          onChange={(e) => setPartnerAgeMin(e.target.value)}
                          className="w-full p-2.5 rounded-xl bg-white dark:bg-slate-900 border text-xs"
                        />
                        <input
                          type="number"
                          placeholder="Max Age"
                          value={partnerAgeMax}
                          onChange={(e) => setPartnerAgeMax(e.target.value)}
                          className="w-full p-2.5 rounded-xl bg-white dark:bg-slate-900 border text-xs"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block font-bold text-xs mb-1 text-slate-700 dark:text-slate-200">Desired Height Range</label>
                      <div className="grid grid-cols-2 gap-2">
                        <input
                          type="text"
                          placeholder="Min e.g. 5'2&quot;"
                          value={partnerHeightMin}
                          onChange={(e) => setPartnerHeightMin(e.target.value)}
                          className="w-full p-2.5 rounded-xl bg-white dark:bg-slate-900 border text-xs"
                        />
                        <input
                          type="text"
                          placeholder="Max e.g. 5'10&quot;"
                          value={partnerHeightMax}
                          onChange={(e) => setPartnerHeightMax(e.target.value)}
                          className="w-full p-2.5 rounded-xl bg-white dark:bg-slate-900 border text-xs"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block font-bold text-xs mb-1 text-slate-700 dark:text-slate-200">Preferred Sect Choice</label>
                      <select
                        value={partnerSect}
                        onChange={(e) => setPartnerSect(e.target.value)}
                        className="w-full p-2.5 rounded-xl bg-white dark:bg-slate-900 border text-xs"
                      >
                        <option value="Open to all Jain Sects">Open to all Jain Sects</option>
                        <option value="Swetambar Murtipujak Only">Swetambar Murtipujak Only</option>
                        <option value="Swetambar Sthanakvasi Only">Swetambar Sthanakvasi Only</option>
                        <option value="Digambar Only">Digambar Only</option>
                      </select>
                    </div>

                    <div>
                      <label className="block font-bold text-xs mb-1 text-slate-700 dark:text-slate-200">Preferred Education & Profession</label>
                      <select
                        value={partnerEducation}
                        onChange={(e) => setPartnerEducation(e.target.value)}
                        className="w-full p-2.5 rounded-xl bg-white dark:bg-slate-900 border text-xs font-semibold text-slate-800 dark:text-slate-100"
                      >
                        <option value="Any Education / Profession Accepted">Any Education / Profession Accepted</option>
                        <option value="CA / CS / ICWA / Finance Professional">CA / CS / ICWA / Finance Professional</option>
                        <option value="Engineer / Software / IT Professional">Engineer / Software / IT Professional</option>
                        <option value="Doctor / Healthcare / Medical Professional">Doctor / Healthcare / Medical Professional</option>
                        <option value="MBA / Management / Corporate Executive">MBA / Management / Corporate Executive</option>
                        <option value="Business Owner / Industrialist">Business Owner / Industrialist</option>
                        <option value="Post Graduate (Master's Degree)">Post Graduate (Master's Degree)</option>
                        <option value="Graduate (Bachelor's Degree)">Graduate (Bachelor's Degree)</option>
                        <option value="Government / Civil Services">Government / Civil Services</option>
                      </select>
                    </div>

                    {/* Preferred Cities / Locations Multi-Select */}
                    <div className="sm:col-span-2">
                      <label className="block font-bold text-xs mb-1 text-slate-700 dark:text-slate-200">
                        Preferred Cities / Locations (Select Multiple Cities)
                      </label>
                      <div className="space-y-2 bg-slate-50 dark:bg-slate-900 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800">
                        {/* Quick multi-select city pills */}
                        <div className="flex flex-wrap gap-1.5">
                          {[
                            'Mumbai',
                            'Surat',
                            'Ahmedabad',
                            'Jaipur',
                            'Udaipur',
                            'Delhi NCR',
                            'Pune',
                            'Bangalore',
                            'Indore',
                            'Jodhpur',
                            'Kolkata',
                            'Gujarat (All)',
                            'Rajasthan (All)',
                            'Overseas / NRI',
                            'Any Location'
                          ].map((cityOption) => {
                            const isSelected = partnerLocation.includes(cityOption);
                            return (
                              <button
                                key={cityOption}
                                type="button"
                                onClick={() => {
                                  let currentList = partnerLocation
                                    ? partnerLocation.split(',').map((c) => c.trim()).filter(Boolean)
                                    : [];
                                  if (cityOption === 'Any Location') {
                                    currentList = ['Any Location'];
                                  } else {
                                    currentList = currentList.filter((c) => c !== 'Any Location');
                                    if (currentList.includes(cityOption)) {
                                      currentList = currentList.filter((c) => c !== cityOption);
                                    } else {
                                      currentList.push(cityOption);
                                    }
                                  }
                                  setPartnerLocation(currentList.join(', '));
                                }}
                                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all flex items-center gap-1 cursor-pointer ${
                                  isSelected
                                    ? 'bg-amber-500 text-slate-950 font-extrabold shadow-sm'
                                    : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-amber-400'
                                }`}
                              >
                                <span>{cityOption}</span>
                                {isSelected && <Check className="w-3 h-3 text-slate-950 shrink-0" />}
                              </button>
                            );
                          })}
                        </div>

                        {/* Custom location input */}
                        <div className="pt-1 border-t border-slate-200 dark:border-slate-800">
                          <input
                            type="text"
                            placeholder="Type additional cities separated by comma..."
                            value={partnerLocation}
                            onChange={(e) => setPartnerLocation(e.target.value)}
                            className="w-full p-2 rounded-lg bg-white dark:bg-slate-800 border text-xs text-slate-800 dark:text-slate-100 outline-none"
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block font-bold text-xs mb-1 text-slate-700 dark:text-slate-200">Preferred Marital Status</label>
                      <select
                        value={partnerMaritalStatus}
                        onChange={(e) => setPartnerMaritalStatus(e.target.value)}
                        className="w-full p-2.5 rounded-xl bg-white dark:bg-slate-900 border text-xs"
                      >
                        <option value="Never Married">Never Married</option>
                        <option value="Divorced / Widowed Acceptable">Divorced / Widowed Acceptable</option>
                        <option value="Any">Any</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-xs mb-1 text-slate-700 dark:text-slate-200">Candidate Self Description & Values</label>
                    <textarea
                      rows={2}
                      placeholder="Describe your personality, hobbies, goals, and values..."
                      value={matAboutMe}
                      onChange={(e) => setMatAboutMe(e.target.value)}
                      className="w-full p-2.5 rounded-xl bg-white dark:bg-slate-900 border text-xs"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-xs mb-1 text-slate-700 dark:text-slate-200">Special Notes on Partner Expectations</label>
                    <textarea
                      rows={2}
                      placeholder="Specify family values, lifestyle preferences, and spiritual expectations..."
                      value={partnerNotes}
                      onChange={(e) => setPartnerNotes(e.target.value)}
                      className="w-full p-2.5 rounded-xl bg-white dark:bg-slate-900 border text-xs"
                    />
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-amber-200/80 dark:border-amber-800/60">
                    <button
                      type="button"
                      onClick={() => setMatActiveTab('family')}
                      className="px-4 py-2 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" />
                      <span>Back</span>
                    </button>
                    <div className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                      Step 5 of 6 • Partner Preferences
                    </div>
                    <button
                      type="button"
                      onClick={() => setMatActiveTab('guardian')}
                      className="px-5 py-2.5 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white rounded-xl text-xs font-extrabold shadow-md flex items-center gap-1.5 transition-all cursor-pointer"
                    >
                      <span>Next: Contact & Photos</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 6: PHOTOS & GUARDIAN CONTACT VERIFICATION */}
              {matActiveTab === 'guardian' && (
                <div className="space-y-4 animate-fadeIn">
                  {/* Candidate Main Photo Upload from Local Folder / Gallery */}
                  <div className="p-4 bg-amber-50/70 dark:bg-amber-950/30 rounded-2xl border border-amber-200 dark:border-amber-800/60 space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="block font-extrabold text-xs text-amber-900 dark:text-amber-300">
                        📸 Candidate Main Profile Photo *
                      </label>
                      <span className="text-[11px] text-slate-500 font-medium">Select from Device Gallery / Local Folder</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-center">
                      <div className="sm:col-span-2 space-y-2">
                        <input
                          type="file"
                          id="matMainPhotoFile"
                          accept="image/*"
                          onChange={handleMainPhotoFileUpload}
                          className="hidden"
                        />
                        <label
                          htmlFor="matMainPhotoFile"
                          className="flex items-center justify-center gap-2 w-full p-3 bg-white dark:bg-slate-900 border-2 border-dashed border-amber-400 dark:border-amber-700 rounded-xl cursor-pointer hover:bg-amber-100/50 dark:hover:bg-amber-900/30 transition-all text-xs font-bold text-amber-800 dark:text-amber-300"
                        >
                          <svg className="w-5 h-5 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          <span>📁 Choose Main Photo from Gallery / Folder</span>
                        </label>

                        <div className="text-[10px] text-slate-500 flex items-center gap-1">
                          <span>Or paste image URL:</span>
                          <input
                            type="text"
                            placeholder="https://..."
                            value={matPhotoUrl.startsWith('data:') ? '' : matPhotoUrl}
                            onChange={(e) => setMatPhotoUrl(e.target.value)}
                            className="flex-1 p-1 px-2 rounded-lg bg-white dark:bg-slate-900 border text-[10px]"
                          />
                        </div>
                      </div>

                      <div className="flex flex-col items-center justify-center p-2 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 min-h-[90px]">
                        {matPhotoUrl ? (
                          <div className="relative group text-center">
                            <img
                              src={matPhotoUrl}
                              alt="Candidate Main Preview"
                              className="w-20 h-24 object-cover rounded-lg border-2 border-amber-400 shadow-md"
                            />
                            <button
                              type="button"
                              onClick={() => setMatPhotoUrl('')}
                              className="mt-1 text-[10px] text-red-600 font-bold hover:underline"
                            >
                              ✕ Remove
                            </button>
                          </div>
                        ) : (
                          <div className="text-center p-2">
                            <span className="text-2xl">👤</span>
                            <p className="text-[10px] text-slate-400 mt-1">No photo chosen</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Candidate Gallery Photos (5-Slot Grid Selection) */}
                  <div className="p-4 bg-slate-50 dark:bg-slate-900/60 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <label className="block font-extrabold text-xs text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                          <span>🖼️ Candidate Photo Gallery (5-Slot Grid Selection)</span>
                        </label>
                        <p className="text-[10px] text-slate-500">
                          Upload up to 5 photos (Portrait, Traditional, Family, Event). Previews update in real-time.
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <label
                          htmlFor="matBatchGalleryPhotosFile"
                          className="px-2.5 py-1 bg-amber-500/20 hover:bg-amber-500/30 text-amber-900 dark:text-amber-300 border border-amber-400/50 rounded-lg text-[10px] font-bold cursor-pointer transition-all flex items-center gap-1"
                        >
                          <Upload className="w-3 h-3 text-amber-600 dark:text-amber-400" />
                          <span>Batch Upload</span>
                          <input
                            type="file"
                            id="matBatchGalleryPhotosFile"
                            accept="image/*"
                            multiple
                            onChange={handleGalleryPhotosUpload}
                            className="hidden"
                          />
                        </label>
                        <span className="px-2.5 py-1 rounded-full bg-amber-100 dark:bg-amber-900/50 text-amber-800 dark:text-amber-300 text-[10px] font-extrabold">
                          {matGalleryPhotos.filter(Boolean).length} / 5 Slots Occupied
                        </span>
                      </div>
                    </div>

                    {/* Live Upload Status Feedback Alert Banner */}
                    {photoUploadStatusMsg && (
                      <div className="p-2.5 px-3 bg-emerald-500/15 border border-emerald-500/40 rounded-xl text-emerald-800 dark:text-emerald-300 text-xs font-bold flex items-center justify-between animate-fadeIn">
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                          <span>{photoUploadStatusMsg}</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => setPhotoUploadStatusMsg('')}
                          className="text-[10px] opacity-70 hover:opacity-100 font-bold p-0.5"
                        >
                          ✕
                        </button>
                      </div>
                    )}

                    {/* 5-SLOT PHOTO GRID */}
                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
                      {[0, 1, 2, 3, 4].map((slotIdx) => {
                        const photo = matGalleryPhotos[slotIdx];
                        const slotLabels = [
                          'Primary Portrait',
                          'Full Length',
                          'Traditional',
                          'Family / Event',
                          'Additional Photo'
                        ];
                        const isMain = matPhotoUrl && photo === matPhotoUrl;

                        return (
                          <div
                            key={slotIdx}
                            className={`relative flex flex-col rounded-2xl overflow-hidden border-2 transition-all aspect-[3/4] bg-white dark:bg-slate-950 ${
                              photo
                                ? 'border-amber-400 dark:border-amber-600 shadow-md'
                                : 'border-dashed border-slate-300 dark:border-slate-700 hover:border-amber-400 dark:hover:border-amber-600'
                            }`}
                          >
                            {photo ? (
                              /* OCCUPIED SLOT PREVIEW */
                              <div className="relative w-full h-full group">
                                <img
                                  src={photo}
                                  alt={`Candidate Photo Slot ${slotIdx + 1}`}
                                  className="w-full h-full object-cover"
                                />

                                {/* Top Badges */}
                                <div className="absolute top-1.5 left-1.5 right-1.5 flex items-center justify-between gap-1 pointer-events-none z-10">
                                  <span className="bg-slate-950/80 backdrop-blur-md text-amber-300 text-[9px] font-extrabold px-1.5 py-0.5 rounded-md shadow">
                                    Slot #{slotIdx + 1}
                                  </span>
                                  {isMain ? (
                                    <span className="bg-amber-500 text-slate-950 text-[9px] font-black px-1.5 py-0.5 rounded-md shadow flex items-center gap-0.5">
                                      ⭐ Main
                                    </span>
                                  ) : (
                                    <span className="bg-emerald-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-md shadow flex items-center gap-0.5">
                                      ✓ Ready
                                    </span>
                                  )}
                                </div>

                                {/* Slot descriptor label at bottom */}
                                <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-slate-950/90 via-slate-950/50 to-transparent p-1.5 pt-4 text-center z-10">
                                  <span className="text-[9px] text-amber-200 font-bold block truncate">
                                    {slotLabels[slotIdx]}
                                  </span>
                                </div>

                                {/* Hover Overlay Actions */}
                                <div className="absolute inset-0 bg-slate-950/80 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-1.5 p-2 z-20">
                                  {!isMain && (
                                    <button
                                      type="button"
                                      onClick={() => handleSetMainPhotoFromGallery(photo)}
                                      className="w-full py-1 bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold rounded-lg text-[10px] shadow"
                                    >
                                      Set Main
                                    </button>
                                  )}

                                  <label className="w-full text-center py-1 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-lg text-[10px] cursor-pointer shadow">
                                    Replace
                                    <input
                                      type="file"
                                      accept="image/*"
                                      onChange={(e) => handleSlotPhotoUpload(slotIdx, e)}
                                      className="hidden"
                                    />
                                  </label>

                                  <button
                                    type="button"
                                    onClick={() => handleRemoveGalleryPhoto(slotIdx)}
                                    className="w-full py-1 bg-red-600 hover:bg-red-500 text-white font-bold rounded-lg text-[10px] shadow"
                                  >
                                    Delete
                                  </button>
                                </div>
                              </div>
                            ) : (
                              /* EMPTY SLOT DROPZONE */
                              <label className="flex flex-col items-center justify-center w-full h-full p-2 cursor-pointer hover:bg-amber-50/50 dark:hover:bg-amber-950/20 transition-all text-center group">
                                <input
                                  type="file"
                                  accept="image/*"
                                  onChange={(e) => handleSlotPhotoUpload(slotIdx, e)}
                                  className="hidden"
                                />
                                <div className="w-8 h-8 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center font-extrabold text-sm mb-1 group-hover:scale-110 transition-transform border border-amber-300 dark:border-amber-700">
                                  +
                                </div>
                                <span className="text-[10px] font-extrabold text-slate-800 dark:text-slate-200">
                                  Slot #{slotIdx + 1}
                                </span>
                                <span className="text-[9px] text-amber-700 dark:text-amber-400 font-bold leading-tight mt-0.5">
                                  {slotLabels[slotIdx]}
                                </span>
                                <span className="text-[8px] text-slate-400 mt-1">
                                  Click to Select
                                </span>
                              </label>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Guardian Contact Information */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="block font-bold text-xs text-slate-700 dark:text-slate-200">Guardian / Parent Contact Person *</label>
                        {guardianName.trim().length >= 2 ? (
                          <span className="text-[10px] font-extrabold text-emerald-600 dark:text-emerald-400">✓ Valid Name</span>
                        ) : (
                          <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400">⚠️ Required</span>
                        )}
                      </div>
                      <input
                        type="text"
                        placeholder="Parent / Guardian Name"
                        value={guardianName}
                        onChange={(e) => setGuardianName(e.target.value)}
                        className={`w-full p-2.5 rounded-xl bg-white dark:bg-slate-900 border text-xs font-bold transition-all ${getMatFieldBorderClass(guardianName, true, 2)}`}
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-xs mb-1 text-slate-700 dark:text-slate-200">Relationship to Candidate</label>
                      <select
                        value={guardianRelation}
                        onChange={(e) => setGuardianRelation(e.target.value)}
                        className={`w-full p-2.5 rounded-xl bg-white dark:bg-slate-900 border text-xs font-bold ${getMatFieldBorderClass(guardianRelation, true)}`}
                      >
                        <option value="Father">Father</option>
                        <option value="Mother">Mother</option>
                        <option value="Brother">Brother</option>
                        <option value="Self">Self</option>
                        <option value="Guardian">Guardian</option>
                      </select>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="block font-bold text-xs text-slate-700 dark:text-slate-200">Guardian Contact Phone Number *</label>
                        {guardianPhone.replace(/\D/g, '').length >= 8 ? (
                          <span className="text-[10px] font-extrabold text-emerald-600 dark:text-emerald-400">✓ Valid Phone</span>
                        ) : (
                          <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400">⚠️ Phone Required</span>
                        )}
                      </div>
                      <input
                        type="text"
                        placeholder="e.g. +91 98200 12345"
                        value={guardianPhone}
                        onChange={(e) => setGuardianPhone(e.target.value)}
                        className={`w-full p-2.5 rounded-xl bg-white dark:bg-slate-900 border text-xs font-bold transition-all ${getMatFieldBorderClass(guardianPhone, true, 8)}`}
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-xs mb-1 text-slate-700 dark:text-slate-200">Guardian / Family Email Address</label>
                      <input
                        type="email"
                        placeholder="e.g. guardian@jainconnect.org"
                        value={guardianEmail}
                        onChange={(e) => setGuardianEmail(e.target.value)}
                        className={`w-full p-2.5 rounded-xl bg-white dark:bg-slate-900 border text-xs ${getMatFieldBorderClass(guardianEmail)}`}
                      />
                    </div>
                  </div>

                  <div className="p-3 bg-amber-100/60 dark:bg-amber-950/40 rounded-2xl border border-amber-300 dark:border-amber-800 text-xs text-slate-800 dark:text-slate-200">
                    <label className="flex items-start gap-2 cursor-pointer">
                      <input type="checkbox" defaultChecked required className="mt-0.5 rounded text-amber-600 focus:ring-amber-500" />
                      <span>
                        I declare that all information provided in this Jain Matrimonial Application is accurate and submitted with family consent for matrimonial purpose only.
                      </span>
                    </label>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-amber-200/80 dark:border-amber-800/60">
                    <button
                      type="button"
                      onClick={() => setMatActiveTab('expectations')}
                      className="px-4 py-2 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" />
                      <span>Back</span>
                    </button>
                    <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                      <span>All 6 Sections Ready for Verification</span>
                    </div>
                  </div>
                </div>
              )}
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
        </>
        )}
      </div>
    </div>
  );
};
