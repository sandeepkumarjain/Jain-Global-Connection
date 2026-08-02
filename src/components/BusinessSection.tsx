import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { QRCodeSVG } from 'qrcode.react';
import { VerifiedBadge } from './VerifiedBadge';
import html2canvas from 'html2canvas';
import {
  Building2,
  Search,
  MapPin,
  Phone,
  MessageSquare,
  Globe,
  Star,
  ShieldCheck,
  QrCode,
  ExternalLink,
  Plus,
  CheckCircle,
  X,
  Share2,
  Download,
  Mail,
  Grid,
  RefreshCw,
  Briefcase,
  Navigation,
  Sparkles,
  Camera,
  Layers
} from 'lucide-react';
import { BusinessListing } from '../types';

const CARD_DESIGN_STYLES = [
  {
    name: 'Royal Gold & Obsidian',
    cardBg: 'bg-gradient-to-br from-slate-950 via-amber-950 to-slate-900',
    textColor: 'text-amber-100',
    titleColor: 'text-amber-300',
    accentBorder: 'border-2 border-amber-400/80',
    subText: 'text-amber-200/80',
    badgeBg: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
    iconColor: 'text-amber-400',
  },
  {
    name: 'Jain Heritage Saffron',
    cardBg: 'bg-gradient-to-br from-amber-600 via-amber-700 to-amber-900',
    textColor: 'text-white',
    titleColor: 'text-amber-100',
    accentBorder: 'border-2 border-amber-300',
    subText: 'text-amber-100/80',
    badgeBg: 'bg-white/20 text-white border-white/40',
    iconColor: 'text-amber-200',
  },
  {
    name: 'Emerald Executive',
    cardBg: 'bg-gradient-to-br from-emerald-950 via-teal-900 to-slate-950',
    textColor: 'text-emerald-100',
    titleColor: 'text-emerald-300',
    accentBorder: 'border-2 border-emerald-400',
    subText: 'text-emerald-200/80',
    badgeBg: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
    iconColor: 'text-emerald-400',
  },
  {
    name: 'Sapphire Tech & Corporate',
    cardBg: 'bg-gradient-to-br from-blue-950 via-indigo-900 to-slate-950',
    textColor: 'text-blue-100',
    titleColor: 'text-blue-300',
    accentBorder: 'border-2 border-blue-400',
    subText: 'text-blue-200/80',
    badgeBg: 'bg-blue-500/20 text-blue-300 border-blue-500/40',
    iconColor: 'text-blue-400',
  },
  {
    name: 'Pearl Minimalist Elegance',
    cardBg: 'bg-gradient-to-br from-amber-50 via-white to-amber-100/90',
    textColor: 'text-slate-800',
    titleColor: 'text-amber-900',
    accentBorder: 'border-2 border-amber-400',
    subText: 'text-slate-600',
    badgeBg: 'bg-amber-100 text-amber-900 border-amber-300',
    iconColor: 'text-amber-600',
  },
  {
    name: 'Velvet Ruby Premium',
    cardBg: 'bg-gradient-to-br from-rose-950 via-red-950 to-slate-950',
    textColor: 'text-rose-100',
    titleColor: 'text-rose-300',
    accentBorder: 'border-2 border-rose-400',
    subText: 'text-rose-200/80',
    badgeBg: 'bg-rose-500/20 text-rose-300 border-rose-500/40',
    iconColor: 'text-rose-400',
  },
];

export const BusinessSection: React.FC = () => {
  const { businesses, openRegistrationModal, showToast, openGmailModal, currentUser, setIsAuthModalOpen, addJob } = useApp();

  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [onlyGstVerified, setOnlyGstVerified] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'map'>('grid');

  // Visiting Card Studio Modal State
  const [visitingCardBusiness, setVisitingCardBusiness] = useState<BusinessListing | null>(null);
  const [cardDesignIndex, setCardDesignIndex] = useState(0);

  // Post Job Modal State
  const [showPostJobModal, setShowPostJobModal] = useState(false);
  const [jobTitle, setJobTitle] = useState('');
  const [jobCompany, setJobCompany] = useState('');
  const [jobLocation, setJobLocation] = useState('Mumbai');
  const [jobType, setJobType] = useState('Full-time');
  const [jobSalary, setJobSalary] = useState('₹30,000 - ₹50,000 / month');
  const [jobContactEmail, setJobContactEmail] = useState('');
  const [jobDescription, setJobDescription] = useState('');

  // Live GST Verification API state
  const [gstSearchInput, setGstSearchInput] = useState('');
  const [isVerifyingGst, setIsVerifyingGst] = useState(false);
  const [gstModalResult, setGstModalResult] = useState<any>(null);

  const categories = [
    'All',
    'Jewellery',
    'CA & Financial Advisory',
    'IT & Software',
    'Hospital & Healthcare',
    'Industrial & Machinery',
    'Wholesale & Retail',
    'Real Estate & Construction',
    'Textiles & Clothing',
    'Doctors & Consultants',
  ];

  const handleVerifyGstApi = async (gstinToVerify?: string) => {
    if (!currentUser) {
      showToast('Sign In Required', 'Please sign in or register to verify GST numbers.', 'info');
      setIsAuthModalOpen(true);
      return;
    }

    const input = gstinToVerify || gstSearchInput;
    if (!input || input.trim().length < 5) {
      showToast('Enter GST Number', 'Please enter a valid 15-character GST number (GSTIN) to verify.', 'error');
      return;
    }

    setIsVerifyingGst(true);
    try {
      const response = await fetch('/api/gst/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ gstin: input }),
      });

      const data = await response.json();
      if (data.success && data.verified) {
        setGstModalResult(data);
        showToast('GST Verification Successful', `GST Number ${data.gstin} is ACTIVE & Verified!`, 'success');
      } else {
        showToast('GST Lookup Warning', data.error || 'Could not verify GSTIN.', 'error');
      }
    } catch (err) {
      console.error('GST API Verification error:', err);
      showToast('GST Verification Failed', 'Server error while verifying GSTIN.', 'error');
    } finally {
      setIsVerifyingGst(false);
    }
  };

  // Filter businesses cleanly
  const filtered = businesses.filter((b) => {
    if (selectedCategory !== 'All' && b.category !== selectedCategory) return false;
    if (onlyGstVerified && (!b.gstNumber || !b.isVerified)) return false;
    if (
      searchTerm &&
      !b.businessName.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !b.city.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !b.description.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !(b.gstNumber && b.gstNumber.toLowerCase().includes(searchTerm.toLowerCase()))
    ) {
      return false;
    }
    return true;
  });

  const handleWhatsAppChat = (mobile: string, name: string) => {
    if (!currentUser) {
      showToast('Sign In Required', 'Please sign in or register to connect via WhatsApp.', 'info');
      setIsAuthModalOpen(true);
      return;
    }
    const cleanNum = mobile.replace(/[^0-9]/g, '');
    window.open(`https://wa.me/${cleanNum}?text=Jai%20Jinendra!%20Inquiring%20about%20${encodeURIComponent(name)}%20via%20Jain%20Connect%20Global.`, '_blank');
  };

  // Open Post Job Modal with auto-filled company info
  const handleOpenPostJobModal = () => {
    if (!currentUser) {
      showToast('Sign In Required', 'Please sign in or register to post a job opening.', 'info');
      setIsAuthModalOpen(true);
      return;
    }

    const myBusiness = businesses.find(
      (b) => b.ownerId === currentUser.id || (currentUser.email && b.email?.toLowerCase() === currentUser.email.toLowerCase())
    );

    const defaultCompany = myBusiness?.businessName || currentUser.company || currentUser.fullName || 'Jain Business Enterprise';
    const defaultEmail = myBusiness?.email || currentUser.email || 'hr@jainbusiness.org';
    const defaultCity = myBusiness?.city || currentUser.city || 'Mumbai';

    setJobCompany(defaultCompany);
    setJobContactEmail(defaultEmail);
    setJobLocation(defaultCity);
    setShowPostJobModal(true);
  };

  const handlePostJobSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!jobTitle.trim()) {
      showToast('Missing Job Title', 'Please enter a title for the job opening.', 'error');
      return;
    }

    addJob({
      title: jobTitle,
      company: jobCompany,
      location: jobLocation,
      type: jobType,
      salary: jobSalary,
      contactEmail: jobContactEmail,
      description: jobDescription,
    });

    setShowPostJobModal(false);
    setJobTitle('');
    setJobDescription('');
  };

  const handleDownloadVisitingCardJpg = async () => {
    const node = document.getElementById('visiting-card-studio-node');
    if (!node) return;
    try {
      showToast('Generating Card', 'Converting business card to JPG format...', 'info');
      const canvas = await html2canvas(node, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: null,
      });
      const dataUrl = canvas.toDataURL('image/jpeg', 0.95);
      const link = document.createElement('a');
      link.href = dataUrl;
      link.download = `Visiting_Card_${(visitingCardBusiness?.businessName || 'Jain_Business').replace(/\s+/g, '_')}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      showToast('Visiting Card Downloaded', 'Card saved as JPG image file.', 'success');
    } catch (err) {
      console.error('Error generating visiting card image:', err);
      showToast('Card Download Error', 'Unable to capture card image.', 'error');
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Main Banner */}
      <div className="bg-gradient-to-r from-amber-950 via-slate-900 to-emerald-950 text-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-amber-800/40 relative overflow-hidden">
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-500/20 border border-amber-500/40 rounded-full text-amber-300 text-xs font-bold uppercase tracking-wider">
            <Building2 className="w-3.5 h-3.5 text-amber-400" />
            <span>Jain Business Directory & Global Trade Network</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold font-serif text-white">
            Promote & Discover Verified Jain Businesses Worldwide
          </h2>

          <p className="text-xs sm:text-sm text-slate-300">
            Over 5,000+ Jain Industrialists, Jewelers, CA Professionals, Doctors, IT Founders, and Exporters. Trade with trust and brotherhood.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <button
              onClick={() => {
                if (!currentUser) {
                  showToast('Sign In Required', 'Please sign in or register to list your Jain business.', 'info');
                  setIsAuthModalOpen(true);
                  return;
                }
                openRegistrationModal('business');
              }}
              className="px-5 py-3 min-h-[44px] bg-gradient-to-r from-amber-500 to-amber-700 text-amber-950 font-extrabold text-xs rounded-xl shadow-lg hover:from-amber-600 hover:to-amber-800 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>List Your Jain Business</span>
            </button>

            <button
              onClick={handleOpenPostJobModal}
              className="px-5 py-3 min-h-[44px] bg-white/10 hover:bg-white/20 text-white font-extrabold text-xs rounded-xl border border-white/20 shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Briefcase className="w-4 h-4 text-amber-400" />
              <span>Post Job Opening (Hiring)</span>
            </button>
          </div>
        </div>
      </div>

      {/* Search, Category Filter & View Mode Controls */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Search Business Name, City, Product or Service..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-500 min-h-[44px]"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <label className="flex items-center gap-2 cursor-pointer text-amber-700 dark:text-amber-400 hover:text-amber-800 font-bold text-xs bg-amber-50 dark:bg-amber-950/40 p-2.5 rounded-xl border border-amber-200 dark:border-amber-800/50">
              <input
                type="checkbox"
                checked={onlyGstVerified}
                onChange={(e) => setOnlyGstVerified(e.target.checked)}
                className="w-4 h-4 rounded border-amber-300 text-amber-600 focus:ring-amber-500"
              />
              <span className="hidden sm:inline">GST Verified Only</span>
              <span className="sm:hidden">GST</span>
            </label>

            {/* View Mode Switcher */}
            <div className="bg-slate-100 dark:bg-slate-800 p-1 rounded-xl flex items-center border border-slate-200 dark:border-slate-700">
              <button
                onClick={() => setViewMode('grid')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 transition-all ${
                  viewMode === 'grid'
                    ? 'bg-amber-600 text-white shadow'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Grid className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Grid View</span>
              </button>

              <button
                onClick={() => setViewMode('map')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 transition-all ${
                  viewMode === 'map'
                    ? 'bg-amber-600 text-white shadow'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <MapPin className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Google Map</span>
              </button>
            </div>
          </div>
        </div>

        {/* Category Chips */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pt-1">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2.5 min-h-[44px] rounded-full text-xs font-bold whitespace-nowrap transition-all flex items-center justify-center ${
                selectedCategory === cat
                  ? 'bg-amber-600 text-white shadow-md'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* GOOGLE MAP VIEW */}
      {viewMode === 'map' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-4 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-amber-500" />
              <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">
                Interactive Google Map Directory ({filtered.length} Locations)
              </h3>
            </div>
            <span className="text-xs text-slate-500 italic">Click any location pin or business card for directions</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Embedded Google Map Frame */}
            <div className="lg:col-span-2 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-md h-[450px] relative bg-slate-100 dark:bg-slate-950">
              <iframe
                title="Google Maps Business Directory"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                loading="lazy"
                allowFullScreen
                src={`https://maps.google.com/maps?q=${encodeURIComponent(
                  filtered.length > 0
                    ? `${filtered[0].businessName}, ${filtered[0].address}, ${filtered[0].city}`
                    : 'Mumbai, India'
                )}&t=&z=12&ie=UTF8&iwloc=&output=embed`}
              />
              <div className="absolute top-3 left-3 bg-slate-900/90 backdrop-blur-md text-amber-300 px-3 py-1.5 rounded-xl border border-amber-500/40 text-[11px] font-bold shadow flex items-center gap-1.5">
                <Navigation className="w-3.5 h-3.5 text-amber-400" />
                <span>Showing locations in {selectedCategory === 'All' ? 'All Categories' : selectedCategory}</span>
              </div>
            </div>

            {/* Side List of Mapped Businesses */}
            <div className="space-y-3 max-h-[450px] overflow-y-auto pr-1">
              {filtered.map((b) => (
                <div
                  key={b.id}
                  className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 hover:border-amber-500 transition-all space-y-2 text-xs"
                >
                  <div className="flex items-start gap-2.5">
                    <img src={b.logoUrl} alt={b.businessName} className="w-10 h-10 rounded-lg object-cover border shrink-0" />
                    <div className="min-w-0 flex-1">
                      <h4 className="font-bold text-slate-900 dark:text-white truncate">{b.businessName}</h4>
                      <p className="text-[11px] text-amber-600 dark:text-amber-400 font-semibold">{b.category}</p>
                      <p className="text-[10px] text-slate-500 truncate">{b.address}, {b.city}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 pt-1 border-t border-slate-200 dark:border-slate-700/60">
                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${b.businessName} ${b.address} ${b.city}`)}`}
                      target="_blank"
                      rel="noreferrer"
                      className="flex-1 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-bold text-center text-[10px] flex items-center justify-center gap-1"
                    >
                      <Navigation className="w-3 h-3" />
                      <span>Directions</span>
                    </a>
                    <button
                      onClick={() => {
                        setVisitingCardBusiness(b);
                        setCardDesignIndex(0);
                      }}
                      className="px-2.5 py-1.5 bg-slate-900 dark:bg-slate-700 text-amber-300 rounded-lg font-bold text-[10px] flex items-center gap-1"
                    >
                      <QrCode className="w-3 h-3" />
                      <span>Card</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Business Cards Grid View */}
      {viewMode === 'grid' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((b) => (
            <div
              key={b.id}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-lg hover:border-amber-500/50 transition-all flex flex-col justify-between"
            >
              <div className="p-5 space-y-3">
                
                {/* Logo & Name */}
                <div className="flex items-start gap-3">
                  <img
                    src={b.logoUrl}
                    alt={b.businessName}
                    className="w-14 h-14 rounded-xl object-cover border border-amber-300 shadow-sm shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <h3 className="text-sm font-bold font-serif text-slate-900 dark:text-white truncate">
                        {b.businessName}
                      </h3>
                      {b.isVerified && (
                        <VerifiedBadge type="business" showText={true} size="sm" />
                      )}
                    </div>

                    <span className="inline-block mt-0.5 px-2 py-0.5 bg-amber-50 dark:bg-amber-950 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800 text-[10px] font-bold rounded">
                      {b.category}
                    </span>

                    <div className="flex items-center gap-1 mt-1 text-xs">
                      <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                      <span className="font-bold text-slate-800 dark:text-slate-200">{b.rating}</span>
                      <span className="text-[10px] text-slate-400">({b.reviewCount} reviews)</span>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2">
                  {b.description}
                </p>

                {/* Products/Services */}
                <div className="flex flex-wrap gap-1">
                  {b.productsAndServices.slice(0, 3).map((p, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-[10px] rounded font-medium"
                    >
                      • {p}
                    </span>
                  ))}
                </div>

                {/* Location & GST */}
                <div className="pt-2 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500 space-y-1">
                  <p className="flex items-center justify-between gap-1.5 truncate">
                    <span className="flex items-center gap-1 truncate">
                      <MapPin className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                      <span>{b.address}, {b.city}, {b.state}</span>
                    </span>
                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${b.businessName} ${b.address} ${b.city}`)}`}
                      target="_blank"
                      rel="noreferrer"
                      className="text-[10px] text-amber-600 dark:text-amber-400 font-bold hover:underline shrink-0 flex items-center gap-0.5"
                    >
                      <Navigation className="w-3 h-3" />
                      <span>Map</span>
                    </a>
                  </p>
                  {b.gstNumber ? (
                    <div className="flex items-center justify-between pt-0.5">
                      <span className="text-[10px] text-slate-400 font-mono">
                        GST: {b.gstNumber}
                      </span>
                      <button
                        onClick={() => handleVerifyGstApi(b.gstNumber)}
                        className="px-2 py-0.5 bg-amber-500/10 hover:bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/30 rounded text-[9px] font-bold flex items-center gap-1 transition-colors cursor-pointer"
                      >
                        <ShieldCheck className="w-3 h-3 text-amber-500" />
                        <span>Verify GST</span>
                      </button>
                    </div>
                  ) : (
                    <span className="text-[10px] text-slate-400 italic">GST Verification Pending</span>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="bg-slate-50 dark:bg-slate-800/60 p-3 border-t border-slate-200 dark:border-slate-800 grid grid-cols-4 gap-1.5 text-xs font-bold">
                <button
                  onClick={() => {
                    if (!currentUser) {
                      showToast('Sign In Required', 'Please sign in or register to view digital visiting cards & QR codes.', 'info');
                      setIsAuthModalOpen(true);
                      return;
                    }
                    setVisitingCardBusiness(b);
                    setCardDesignIndex(0);
                  }}
                  className="py-2.5 min-h-[44px] bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 rounded-lg hover:bg-slate-100 flex items-center justify-center gap-1 cursor-pointer"
                  title="Digital Visiting Card Studio"
                >
                  <QrCode className="w-3.5 h-3.5 text-amber-500" />
                  <span className="hidden sm:inline">Card</span>
                </button>

                <button
                  onClick={() => {
                    if (!currentUser) {
                      showToast('Sign In Required', 'Please sign in or register to connect via WhatsApp.', 'info');
                      setIsAuthModalOpen(true);
                      return;
                    }
                    handleWhatsAppChat(b.whatsapp, b.businessName);
                  }}
                  className="py-2.5 min-h-[44px] bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg flex items-center justify-center gap-1 shadow-sm cursor-pointer"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">WhatsApp</span>
                </button>

                <button
                  onClick={() => {
                    if (!currentUser) {
                      showToast('Sign In Required', 'Please sign in or register to send emails via Gmail.', 'info');
                      setIsAuthModalOpen(true);
                      return;
                    }
                    openGmailModal(b.email, `Inquiry regarding ${b.businessName}`, `Respected ${b.contactPerson || 'Vendor'},\n\nI found your business listing on Jain Connect Global.`);
                  }}
                  className="py-2.5 min-h-[44px] bg-sky-600 hover:bg-sky-700 text-white rounded-lg flex items-center justify-center gap-1 shadow-sm cursor-pointer"
                  title="Send Gmail"
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Gmail</span>
                </button>

                <button
                  onClick={() => {
                    if (!currentUser) {
                      showToast('Sign In Required', 'Please sign in or register to make direct phone calls.', 'info');
                      setIsAuthModalOpen(true);
                      return;
                    }
                    window.location.href = `tel:${b.mobile}`;
                  }}
                  className="py-2.5 min-h-[44px] bg-amber-600 hover:bg-amber-700 text-white rounded-lg flex items-center justify-center gap-1 shadow-sm cursor-pointer"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Call</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* DIGITAL VISITING CARD STUDIO MODAL WITH REGENERATE DESIGN & JPG DOWNLOAD */}
      {visitingCardBusiness && (() => {
        const currentStyle = CARD_DESIGN_STYLES[cardDesignIndex];
        const locationMapUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
          `${visitingCardBusiness.businessName} ${visitingCardBusiness.address} ${visitingCardBusiness.city}`
        )}`;

        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
            <div className="bg-white dark:bg-slate-900 border border-amber-500/50 rounded-3xl w-full max-w-lg p-6 shadow-2xl relative text-slate-800 dark:text-slate-100 space-y-5 my-auto">
              
              {/* Close Button */}
              <button
                onClick={() => setVisitingCardBusiness(null)}
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 dark:hover:text-white p-2 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-800 transition-colors z-20 cursor-pointer"
                title="Close Studio"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="text-center space-y-1">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-500/20 text-amber-700 dark:text-amber-300 font-extrabold text-[11px] rounded-full border border-amber-500/30 uppercase tracking-wider">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  <span>BEAUTIFUL VISITING CARD STUDIO</span>
                </div>
                <h3 className="text-xl font-bold font-serif text-slate-900 dark:text-white">
                  {visitingCardBusiness.businessName}
                </h3>
                <p className="text-xs text-slate-500">Design Preset #{cardDesignIndex + 1}: {currentStyle.name}</p>
              </div>

              {/* CARD PREVIEW NODE FOR JPG DOWNLOAD */}
              <div
                id="visiting-card-studio-node"
                className={`p-6 rounded-3xl shadow-2xl space-y-4 transition-all duration-300 relative overflow-hidden ${currentStyle.cardBg} ${currentStyle.accentBorder} ${currentStyle.textColor}`}
              >
                {/* Background Pattern */}
                <div className="absolute inset-0 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px] opacity-10 pointer-events-none" />

                {/* Top Header of Card */}
                <div className="flex items-start justify-between gap-3 relative z-10 border-b border-white/20 pb-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={visitingCardBusiness.logoUrl}
                      alt="Business Logo"
                      className="w-14 h-14 rounded-2xl object-cover border-2 border-white/40 shadow-lg shrink-0 bg-white"
                    />
                    <div>
                      <h4 className={`text-lg font-extrabold font-serif ${currentStyle.titleColor} leading-tight`}>
                        {visitingCardBusiness.businessName}
                      </h4>
                      <p className={`text-xs font-semibold ${currentStyle.subText}`}>
                        {visitingCardBusiness.category}
                      </p>
                      {visitingCardBusiness.isVerified && (
                        <span className={`inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-bold ${currentStyle.badgeBg}`}>
                          ✓ Verified Jain Business
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Contact & Address Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs relative z-10 pt-1">
                  <div className="space-y-1.5">
                    <p className="flex items-center gap-1.5">
                      <Phone className={`w-3.5 h-3.5 ${currentStyle.iconColor} shrink-0`} />
                      <span className="font-bold">{visitingCardBusiness.mobile}</span>
                    </p>
                    <p className="flex items-center gap-1.5">
                      <MessageSquare className={`w-3.5 h-3.5 ${currentStyle.iconColor} shrink-0`} />
                      <span>{visitingCardBusiness.whatsapp}</span>
                    </p>
                    <p className="flex items-center gap-1.5 truncate">
                      <Mail className={`w-3.5 h-3.5 ${currentStyle.iconColor} shrink-0`} />
                      <span className="truncate">{visitingCardBusiness.email}</span>
                    </p>
                  </div>

                  <div className="space-y-1.5">
                    <p className="flex items-start gap-1.5">
                      <MapPin className={`w-3.5 h-3.5 ${currentStyle.iconColor} shrink-0 mt-0.5`} />
                      <span className="text-[11px] leading-tight">
                        {visitingCardBusiness.address}, {visitingCardBusiness.city}, {visitingCardBusiness.state}
                      </span>
                    </p>
                    {visitingCardBusiness.gstNumber && (
                      <p className="text-[10px] font-mono opacity-90 pt-0.5">
                        GSTIN: <strong>{visitingCardBusiness.gstNumber}</strong>
                      </p>
                    )}
                  </div>
                </div>

                {/* Location QR Code Box */}
                <div className="bg-white/10 backdrop-blur-md p-3 rounded-2xl border border-white/20 flex items-center justify-between gap-3 relative z-10">
                  <div className="space-y-0.5">
                    <p className="text-xs font-bold flex items-center gap-1">
                      <Navigation className={`w-3.5 h-3.5 ${currentStyle.iconColor}`} />
                      <span>Location QR Code</span>
                    </p>
                    <p className="text-[10px] opacity-80 leading-tight">
                      Scan to open exact Google Maps location & directions.
                    </p>
                  </div>
                  <div className="w-16 h-16 bg-white p-1 rounded-xl shadow shrink-0 flex items-center justify-center">
                    <QRCodeSVG value={locationMapUrl} size={56} level="M" />
                  </div>
                </div>
              </div>

              {/* CONTROLS: REGENERATE DESIGN & DOWNLOAD JPG */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <button
                  onClick={() => setCardDesignIndex((prev) => (prev + 1) % CARD_DESIGN_STYLES.length)}
                  className="py-3 px-4 min-h-[44px] bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-100 font-extrabold text-xs rounded-2xl shadow border border-slate-300 dark:border-slate-700 flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <RefreshCw className="w-4 h-4 text-amber-500" />
                  <span>Regenerate Design</span>
                </button>

                <button
                  onClick={handleDownloadVisitingCardJpg}
                  className="py-3 px-4 min-h-[44px] bg-gradient-to-r from-amber-500 to-amber-700 text-amber-950 font-extrabold text-xs rounded-2xl shadow-lg hover:from-amber-600 hover:to-amber-800 flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Card (JPG)</span>
                </button>
              </div>
            </div>
          </div>
        );
      })()}

      {/* POST JOB OPENING MODAL FOR BUSINESS OWNERS */}
      {showPostJobModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 border border-amber-500/50 rounded-3xl w-full max-w-lg p-6 shadow-2xl relative text-slate-800 dark:text-slate-100 space-y-4 my-auto">
            
            <button
              onClick={() => setShowPostJobModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 dark:hover:text-white p-2 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-800 transition-colors z-10 cursor-pointer"
              title="Close"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center pt-1 space-y-1">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-500/20 text-amber-700 dark:text-amber-300 font-extrabold text-[11px] rounded-full border border-amber-500/30 uppercase tracking-wider">
                <Briefcase className="w-3.5 h-3.5 text-amber-500" />
                <span>BUSINESS RECRUITMENT PORTAL</span>
              </div>
              <h3 className="text-xl font-bold font-serif text-slate-900 dark:text-white">
                Post a New Job Opening
              </h3>
              <p className="text-xs text-slate-500">
                Data will be listed on Jain Services & saved to the Supabase database.
              </p>
            </div>

            <form onSubmit={handlePostJobSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold mb-1 text-slate-700 dark:text-slate-200">Job Opening Title *</label>
                <input
                  type="text"
                  placeholder="e.g. Senior Accountant / Sales Executive / Software Engineer"
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                  required
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border font-bold"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold mb-1 text-slate-700 dark:text-slate-200">Company Name (Auto Fetched)</label>
                  <input
                    type="text"
                    value={jobCompany}
                    onChange={(e) => setJobCompany(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border font-semibold text-slate-700 dark:text-slate-300"
                  />
                </div>
                <div>
                  <label className="block font-bold mb-1 text-slate-700 dark:text-slate-200">Location *</label>
                  <input
                    type="text"
                    placeholder="e.g. Mumbai, Surat, Remote"
                    value={jobLocation}
                    onChange={(e) => setJobLocation(e.target.value)}
                    required
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold mb-1 text-slate-700 dark:text-slate-200">Employment Type</label>
                  <select
                    value={jobType}
                    onChange={(e) => setJobType(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border font-bold"
                  >
                    <option value="Full-time">Full-time</option>
                    <option value="Part-time">Part-time</option>
                    <option value="Remote">Remote</option>
                    <option value="Contract">Contract</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold mb-1 text-slate-700 dark:text-slate-200">Salary Range</label>
                  <input
                    type="text"
                    placeholder="e.g. ₹30,000 - ₹50,000 / month"
                    value={jobSalary}
                    onChange={(e) => setJobSalary(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold mb-1 text-slate-700 dark:text-slate-200">Contact Email *</label>
                <input
                  type="email"
                  value={jobContactEmail}
                  onChange={(e) => setJobContactEmail(e.target.value)}
                  required
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border font-bold"
                />
              </div>

              <div>
                <label className="block font-bold mb-1 text-slate-700 dark:text-slate-200">Job Description & Requirements</label>
                <textarea
                  rows={3}
                  placeholder="Describe key responsibilities, experience required, and qualifications..."
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 min-h-[44px] bg-gradient-to-r from-amber-500 to-amber-700 text-amber-950 font-extrabold text-xs rounded-2xl shadow-lg hover:from-amber-600 hover:to-amber-800 transition-all cursor-pointer pt-2"
              >
                Save & Send Job Opening to Supabase
              </button>
            </form>
          </div>
        </div>
      )}

      {/* GST Verification Certificate Modal */}
      {gstModalResult && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 border border-amber-500/50 rounded-2xl w-full max-w-lg p-6 shadow-2xl relative text-slate-800 dark:text-slate-100 space-y-4 my-auto">
            <button
              onClick={() => setGstModalResult(null)}
              className="absolute top-3 right-3 text-slate-400 hover:text-slate-700 dark:hover:text-white p-2 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-800 transition-colors z-10 cursor-pointer"
              title="Close"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center pt-2 space-y-1.5">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 font-extrabold text-[11px] rounded-full border border-emerald-500/30 uppercase tracking-wider">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
                <span>GSTIN ACTIVE & OFFICIALLY VERIFIED</span>
              </div>
              <h3 className="text-xl font-bold font-serif text-slate-900 dark:text-white">
                {gstModalResult.tradeName || gstModalResult.legalName}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Official Taxpayer Verification Report from Indian GST Portal API
              </p>
            </div>

            <div className="bg-gradient-to-br from-amber-50 to-amber-100/60 dark:from-slate-800 dark:to-slate-800/80 border border-amber-300 dark:border-amber-700/50 p-4 rounded-xl space-y-2.5 text-xs">
              <div className="flex justify-between items-center border-b border-amber-200 dark:border-slate-700 pb-2">
                <span className="text-slate-500 dark:text-slate-400 font-semibold">GSTIN:</span>
                <span className="font-mono font-extrabold text-amber-700 dark:text-amber-400 text-sm">
                  {gstModalResult.gstin}
                </span>
              </div>

              <div className="flex justify-between items-center border-b border-amber-200 dark:border-slate-700 pb-2">
                <span className="text-slate-500 dark:text-slate-400 font-semibold">Legal Taxpayer Name:</span>
                <span className="font-bold text-slate-800 dark:text-slate-100 text-right max-w-[240px] truncate">
                  {gstModalResult.legalName}
                </span>
              </div>

              <div className="flex justify-between items-center border-b border-amber-200 dark:border-slate-700 pb-2">
                <span className="text-slate-500 dark:text-slate-400 font-semibold">Registration Status:</span>
                <span className="px-2 py-0.5 bg-emerald-600 text-white font-black text-[10px] rounded uppercase">
                  {gstModalResult.status}
                </span>
              </div>

              <div className="flex justify-between items-center border-b border-amber-200 dark:border-slate-700 pb-2">
                <span className="text-slate-500 dark:text-slate-400 font-semibold">Jurisdiction / State:</span>
                <span className="font-bold text-slate-800 dark:text-slate-100">
                  {gstModalResult.state}
                </span>
              </div>

              {(gstModalResult.city || gstModalResult.pincode) && (
                <div className="flex justify-between items-center border-b border-amber-200 dark:border-slate-700 pb-2">
                  <span className="text-slate-500 dark:text-slate-400 font-semibold">City / Pincode:</span>
                  <span className="font-bold text-slate-800 dark:text-slate-100">
                    {gstModalResult.city}{gstModalResult.pincode ? ` - ${gstModalResult.pincode}` : ''}
                  </span>
                </div>
              )}

              {gstModalResult.address && (
                <div className="flex flex-col gap-1 border-b border-amber-200 dark:border-slate-700 pb-2">
                  <span className="text-slate-500 dark:text-slate-400 font-semibold">Official Business Address:</span>
                  <span className="font-medium text-slate-700 dark:text-slate-200 text-xs bg-amber-50/50 dark:bg-slate-900/50 p-2 rounded-lg border border-amber-200/50 dark:border-slate-700/50">
                    {gstModalResult.address}
                  </span>
                </div>
              )}

              <div className="flex justify-between items-center border-b border-amber-200 dark:border-slate-700 pb-2">
                <span className="text-slate-500 dark:text-slate-400 font-semibold">Taxpayer Type:</span>
                <span className="font-medium text-slate-700 dark:text-slate-300">
                  {gstModalResult.taxpayerType}
                </span>
              </div>

              <div className="flex justify-between items-center pt-1">
                <span className="text-slate-500 dark:text-slate-400 font-semibold">Jain Chamber Registry:</span>
                <span className="font-bold text-amber-600 dark:text-amber-400 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-amber-500" />
                  <span>Verified Member</span>
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1">
              <span>API Key: {gstModalResult.apiKeyUsed}</span>
              <span>Source: {gstModalResult.source}</span>
            </div>

            <button
              onClick={() => {
                setSearchTerm(gstModalResult.gstin);
                setGstModalResult(null);
              }}
              className="w-full py-3 min-h-[44px] bg-amber-600 hover:bg-amber-700 text-white font-extrabold text-xs rounded-xl shadow-md transition-colors cursor-pointer"
            >
              Filter Business Directory by GSTIN
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
