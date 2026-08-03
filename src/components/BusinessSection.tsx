import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { QRCodeSVG } from 'qrcode.react';
import { VerifiedBadge } from './VerifiedBadge';
import html2canvas from 'html2canvas';
import { BusinessSkeleton } from './Skeletons';
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
  Layers,
  Edit,
  Trash2,
  Printer,
  Copy,
  Check,
  Smartphone,
  Link,
  Upload,
  Image as ImageIcon
} from 'lucide-react';
import { BusinessListing, JobItem } from '../types';
import { BusinessMapView } from './BusinessMapView';

const BRANDING_COVER_PRESETS = [
  { name: 'Gold Shimmer', url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80' },
  { name: 'Diamond Facet', url: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?auto=format&fit=crop&w=800&q=80' },
  { name: 'Royal Emerald', url: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&w=800&q=80' },
  { name: 'Obsidian Velvet', url: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=800&q=80' },
];

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
  const {
    businesses,
    jobs,
    openRegistrationModal,
    showToast,
    openGmailModal,
    currentUser,
    setIsAuthModalOpen,
    addJob,
    updateJob,
    deleteJob,
    updateBusinessListing,
    isLoadingData
  } = useApp();

  // Logo & Cover Image Upload Handlers (Device Camera or System File)
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>, business: BusinessListing) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 8 * 1024 * 1024) {
      showToast('File Too Large', 'Please select an image smaller than 8MB.', 'error');
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      if (result) {
        updateBusinessListing(business.id, { logoUrl: result });
        if (visitingCardBusiness && visitingCardBusiness.id === business.id) {
          setVisitingCardBusiness({ ...visitingCardBusiness, logoUrl: result });
        }
        showToast('Logo Updated', 'Business card logo updated successfully from device.', 'success');
      }
    };
    reader.readAsDataURL(file);
  };

  const handleCoverUpload = (e: React.ChangeEvent<HTMLInputElement>, business: BusinessListing) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 8 * 1024 * 1024) {
      showToast('File Too Large', 'Please select an image smaller than 8MB.', 'error');
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      if (result) {
        updateBusinessListing(business.id, { coverImageUrl: result });
        if (visitingCardBusiness && visitingCardBusiness.id === business.id) {
          setVisitingCardBusiness({ ...visitingCardBusiness, coverImageUrl: result });
        }
        showToast('Cover Banner Updated', 'Card cover banner updated successfully.', 'success');
      }
    };
    reader.readAsDataURL(file);
  };

  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [onlyGstVerified, setOnlyGstVerified] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'map'>('grid');

  // Visiting Card Studio Modal State
  const [visitingCardBusiness, setVisitingCardBusiness] = useState<BusinessListing | null>(null);
  const [cardDesignIndex, setCardDesignIndex] = useState(0);

  // Business QR Code Standee / Poster Modal State
  const [qrModalBusiness, setQrModalBusiness] = useState<BusinessListing | null>(null);
  const [qrPayloadType, setQrPayloadType] = useState<'profile' | 'vcard' | 'whatsapp' | 'maps'>('profile');
  const [qrTheme, setQrTheme] = useState<'gold' | 'emerald' | 'saffron' | 'minimal'>('gold');
  const [isCopiedLink, setIsCopiedLink] = useState(false);

  // Post Job Modal State
  const [showPostJobModal, setShowPostJobModal] = useState(false);
  const [editingJob, setEditingJob] = useState<JobItem | null>(null);
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

  const isOwnerOfBusiness = (b: BusinessListing): boolean => {
    if (!currentUser) return false;
    if (currentUser.role === 'admin') return true;
    return (
      b.ownerId === currentUser.id ||
      b.applicationId === currentUser.id ||
      b.applicationId === currentUser.applicationId ||
      (currentUser.email && b.email?.toLowerCase() === currentUser.email.toLowerCase())
    );
  };

  const myBusinesses = businesses.filter((b) => isOwnerOfBusiness(b));

  const myJobs = jobs.filter((j) => {
    if (!currentUser) return false;
    if (currentUser.role === 'admin') return true;
    if (j.postedByUserId && j.postedByUserId === currentUser.id) return true;
    if (j.businessId && myBusinesses.some((b) => b.id === j.businessId)) return true;
    if (currentUser.email && j.contactEmail?.toLowerCase() === currentUser.email.toLowerCase()) return true;
    if (myBusinesses.some((b) => b.businessName.toLowerCase() === j.company?.toLowerCase())) return true;
    return false;
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

  const handleOpenEditJobModal = (jobToEdit: JobItem) => {
    setEditingJob(jobToEdit);
    setJobTitle(jobToEdit.title);
    setJobCompany(jobToEdit.company);
    setJobLocation(jobToEdit.location);
    setJobType(jobToEdit.type || 'Full-time');
    setJobSalary(jobToEdit.salary || '');
    setJobContactEmail(jobToEdit.contactEmail);
    setJobDescription(jobToEdit.description || '');
    setShowPostJobModal(true);
  };

  // Open Post Job Modal with auto-filled company info
  const handleOpenPostJobModal = () => {
    if (!currentUser) {
      showToast('Sign In Required', 'Please sign in or register to post a job opening.', 'info');
      setIsAuthModalOpen(true);
      return;
    }

    setEditingJob(null);
    const myBusiness = myBusinesses[0];

    const defaultCompany = myBusiness?.businessName || currentUser.company || currentUser.fullName || 'Jain Business Enterprise';
    const defaultEmail = myBusiness?.email || currentUser.email || 'hr@jainbusiness.org';
    const defaultCity = myBusiness?.city || currentUser.city || 'Mumbai';

    setJobTitle('');
    setJobDescription('');
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

    const myBusiness = myBusinesses[0];

    if (editingJob) {
      updateJob(editingJob.id, {
        title: jobTitle,
        company: jobCompany,
        location: jobLocation,
        type: jobType as any,
        salary: jobSalary,
        contactEmail: jobContactEmail,
        description: jobDescription,
        businessId: myBusiness?.id || editingJob.businessId,
        postedByUserId: currentUser?.id || editingJob.postedByUserId,
      });
    } else {
      addJob({
        businessId: myBusiness?.id,
        postedByUserId: currentUser?.id,
        title: jobTitle,
        company: jobCompany,
        location: jobLocation,
        type: jobType as any,
        salary: jobSalary,
        contactEmail: jobContactEmail,
        description: jobDescription,
      });
    }

    setShowPostJobModal(false);
    setEditingJob(null);
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

  const getQrValueForBusiness = (
    b: BusinessListing,
    type: 'profile' | 'vcard' | 'whatsapp' | 'maps'
  ) => {
    const origin = typeof window !== 'undefined' ? window.location.origin : 'https://jainconnectglobal.org';
    switch (type) {
      case 'profile':
        return `${origin}/#business-${b.id}`;
      case 'whatsapp': {
        const cleanNum = (b.whatsapp || b.mobile || '').replace(/\D/g, '');
        return `https://wa.me/${cleanNum}?text=${encodeURIComponent(`Hello ${b.businessName}, I found your listing on Jain Connect Global.`)}`;
      }
      case 'maps':
        return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${b.businessName} ${b.address} ${b.city}`)}`;
      case 'vcard':
        return `BEGIN:VCARD
VERSION:3.0
FN:${b.businessName}
ORG:${b.businessName}
TITLE:${b.category}
TEL;TYPE=CELL:${b.mobile}
TEL;TYPE=WORK,VOICE:${b.whatsapp || b.mobile}
EMAIL:${b.email}
ADR;TYPE=WORK:;;${b.address};${b.city};${b.state};;
NOTE:Jain Verified Business (ID: ${b.id})${b.gstNumber ? `. GSTIN: ${b.gstNumber}` : ''}
URL:${b.website || `${origin}/#business-${b.id}`}
END:VCARD`;
      default:
        return `${origin}/#business-${b.id}`;
    }
  };

  const handleDownloadQrPosterPng = async () => {
    const node = document.getElementById('business-qr-poster-node');
    if (!node || !qrModalBusiness) return;
    try {
      showToast('Rendering Poster', 'Generating high-resolution printable QR poster...', 'info');
      const canvas = await html2canvas(node, {
        scale: 3,
        useCORS: true,
        allowTaint: true,
        backgroundColor: null,
      });
      const dataUrl = canvas.toDataURL('image/png', 1.0);
      const link = document.createElement('a');
      link.href = dataUrl;
      link.download = `Business_QR_Poster_${qrModalBusiness.businessName.replace(/\s+/g, '_')}_${qrPayloadType}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      showToast('QR Poster Downloaded!', 'Saved as 3x high-res PNG file for printing.', 'success');
    } catch (err) {
      console.error('Error generating QR poster image:', err);
      showToast('Poster Download Failed', 'Unable to capture poster element.', 'error');
    }
  };

  const handleDownloadQrCodeOnly = () => {
    const svg = document.getElementById('business-qr-code-svg');
    if (!svg || !qrModalBusiness) return;
    try {
      const svgData = new XMLSerializer().serializeToString(svg);
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      img.onload = () => {
        canvas.width = 800;
        canvas.height = 800;
        if (ctx) {
          ctx.fillStyle = '#FFFFFF';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(img, 0, 0, 800, 800);
        }
        const pngUrl = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.href = pngUrl;
        link.download = `QR_Code_${qrModalBusiness.businessName.replace(/\s+/g, '_')}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        showToast('Pure QR Image Downloaded', 'Standalone high-res QR code saved.', 'success');
      };
      img.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svgData);
    } catch (err) {
      console.error('Error downloading QR image:', err);
      showToast('Download Failed', 'Unable to extract pure QR SVG.', 'error');
    }
  };

  const handleCopyQrPayload = (payload: string) => {
    navigator.clipboard.writeText(payload).then(() => {
      setIsCopiedLink(true);
      showToast('Payload Copied!', 'QR Code link / text copied to clipboard.', 'success');
      setTimeout(() => setIsCopiedLink(false), 2500);
    }).catch(() => {
      showToast('Copy Failed', 'Unable to copy text to clipboard.', 'error');
    });
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

      {/* BUSINESS OWNER PANES & JOB POSITION MANAGEMENT */}
      {currentUser && (
        <div className="bg-white dark:bg-slate-900 border-2 border-amber-400/60 dark:border-amber-900/60 rounded-3xl p-5 sm:p-6 shadow-xl space-y-5">
          {/* Pane Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2.5">
              <span className="p-2.5 bg-amber-500/20 text-amber-700 dark:text-amber-400 rounded-2xl border border-amber-500/40">
                <Building2 className="w-5 h-5 text-amber-500" />
              </span>
              <div>
                <h3 className="text-base font-extrabold uppercase tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
                  My Business Workspace & Job Management
                  <span className="text-[10px] px-2.5 py-0.5 bg-amber-500 text-slate-950 font-black rounded-full uppercase">
                    Business ID Pane
                  </span>
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Manage your registered business ID, access your digital visiting card, and post or delete job positions.
                </p>
              </div>
            </div>

            <button
              onClick={handleOpenPostJobModal}
              className="px-4 py-2.5 min-h-[44px] bg-amber-600 hover:bg-amber-700 text-white font-extrabold text-xs rounded-xl shadow transition-all flex items-center justify-center gap-2 shrink-0 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>+ Post New Job Position</span>
            </button>
          </div>

          {/* Section A: My Business Listing(s) */}
          {myBusinesses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {myBusinesses.map((b) => (
                <div
                  key={b.id}
                  className="p-4 rounded-2xl bg-amber-50/40 dark:bg-slate-800/80 border border-amber-300 dark:border-amber-800/60 space-y-3"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <img
                        src={b.logoUrl}
                        alt={b.businessName}
                        className="w-12 h-12 rounded-xl object-cover border border-amber-300 shrink-0 bg-white"
                      />
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">{b.businessName}</h4>
                          <span className="text-[10px] px-2 py-0.5 bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 font-bold rounded">
                            ID: {b.id}
                          </span>
                        </div>
                        <p className="text-xs text-amber-700 dark:text-amber-400 font-semibold">{b.category}</p>
                        <p className="text-[11px] text-slate-500">{b.city}, {b.state}</p>
                      </div>
                    </div>

                    {/* Digital Visiting Card Studio & QR Code Buttons */}
                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        onClick={() => {
                          setVisitingCardBusiness(b);
                          setCardDesignIndex(0);
                        }}
                        className="px-2.5 py-2 bg-slate-950 text-amber-300 dark:bg-amber-500 dark:text-slate-950 font-black text-xs rounded-xl shadow-md flex items-center gap-1 hover:scale-105 transition-all cursor-pointer"
                        title="Access Digital Visiting Card Studio"
                      >
                        <QrCode className="w-3.5 h-3.5" />
                        <span>Card</span>
                      </button>

                      <button
                        onClick={() => {
                          setQrModalBusiness(b);
                          setQrPayloadType('profile');
                          setQrTheme('gold');
                        }}
                        className="px-2.5 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs rounded-xl shadow-md flex items-center gap-1 hover:scale-105 transition-all cursor-pointer"
                        title="Generate & Download Printable QR Poster for Physical Spaces"
                      >
                        <Printer className="w-3.5 h-3.5" />
                        <span>QR Poster</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700 text-xs text-slate-600 dark:text-slate-300 flex flex-col sm:flex-row items-center justify-between gap-3">
              <p className="font-medium">
                You don't have a registered business listing associated with your profile yet. Register your business to generate your Business ID!
              </p>
              <button
                onClick={() => openRegistrationModal('business')}
                className="px-4 py-2.5 min-h-[44px] bg-slate-900 text-white rounded-xl font-extrabold whitespace-nowrap hover:bg-slate-800 transition-all cursor-pointer shrink-0"
              >
                List Business
              </button>
            </div>
          )}

          {/* Section B: Job Positions in His Pane */}
          <div className="space-y-3 pt-2 border-t border-slate-100 dark:border-slate-800">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-black uppercase tracking-wider text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                <Briefcase className="w-4 h-4 text-amber-500" />
                <span>Job Openings Posted by My Business ID ({myJobs.length})</span>
              </h4>
              <span className="text-[10px] text-slate-400 italic hidden sm:inline">
                Click trash icon to delete any position from your pane anytime
              </span>
            </div>

            {myJobs.length === 0 ? (
              <div className="p-6 text-center text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-dashed border-slate-200 dark:border-slate-700/80 space-y-2">
                <Briefcase className="w-8 h-8 text-amber-500/60 mx-auto" />
                <p className="text-xs font-bold text-slate-800 dark:text-slate-200">No Job Positions Currently Posted for your Business ID.</p>
                <p className="text-[11px]">Click "+ Post New Job Position" above to create a hiring post.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {myJobs.map((j) => (
                  <div
                    key={j.id}
                    className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 shadow-sm flex flex-col justify-between space-y-3"
                  >
                    <div className="space-y-1.5">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <h5 className="font-extrabold text-sm text-slate-900 dark:text-white truncate">{j.title}</h5>
                          <p className="text-xs text-amber-600 dark:text-amber-400 font-bold">{j.company}</p>
                        </div>
                        <span className="px-2 py-0.5 bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 font-extrabold text-[10px] rounded shrink-0">
                          {j.type}
                        </span>
                      </div>

                      <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2">{j.description}</p>

                      <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-500 pt-1">
                        <span>📍 {j.location}</span>
                        <span>• 💰 {j.salary}</span>
                        {j.businessId && (
                          <span className="font-mono text-[10px] text-slate-400">
                            • ID: {j.businessId}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Action buttons inside his pane */}
                    <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-200 dark:border-slate-700">
                      <span className="text-[10px] text-slate-400 font-mono">
                        Posted: {j.postedDate}
                      </span>

                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => handleOpenEditJobModal(j)}
                          className="px-2.5 py-1.5 bg-amber-100 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300 hover:bg-amber-200 font-bold text-xs rounded-xl transition-all flex items-center gap-1 cursor-pointer"
                          title="Edit/Update Job Position Details"
                        >
                          <Edit className="w-3.5 h-3.5" />
                          <span>Edit</span>
                        </button>

                        <button
                          onClick={() => {
                            if (window.confirm(`Are you sure you want to delete the job post "${j.title}"?`)) {
                              deleteJob(j.id);
                            }
                          }}
                          className="px-2.5 py-1.5 bg-red-100 text-red-700 dark:bg-red-950/80 dark:text-red-300 hover:bg-red-200 font-bold text-xs rounded-xl transition-all flex items-center gap-1 cursor-pointer"
                          title="Delete Job Post from your pane"
                        >
                          <Trash2 className="w-3.5 h-3.5 text-red-600 dark:text-red-400" />
                          <span>Delete</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

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

      {/* INTERACTIVE COMMERCIAL MAP VIEW */}
      {viewMode === 'map' && (
        <BusinessMapView
          businesses={businesses}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
          openGmailModal={openGmailModal}
          setVisitingCardBusiness={setVisitingCardBusiness}
          setQrModalBusiness={setQrModalBusiness}
          isOwnerOfBusiness={isOwnerOfBusiness}
          currentUser={currentUser}
          setIsAuthModalOpen={setIsAuthModalOpen}
          showToast={showToast}
        />
      )}

      {/* Business Cards Grid View or Skeleton Loading State */}
      {viewMode === 'grid' && (
        isLoadingData ? (
          <BusinessSkeleton />
        ) : (
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
              {(() => {
                const canManageCard = isOwnerOfBusiness(b);
                return (
                  <div className="bg-slate-50 dark:bg-slate-800/60 p-3 border-t border-slate-200 dark:border-slate-800 grid grid-cols-4 gap-1.5 text-xs font-bold">
                    {canManageCard ? (
                      <button
                        onClick={() => {
                          if (!currentUser) {
                            showToast('Sign In Required', 'Please sign in or register to view digital visiting cards.', 'info');
                            setIsAuthModalOpen(true);
                            return;
                          }
                          setVisitingCardBusiness(b);
                          setCardDesignIndex(0);
                        }}
                        className="py-2.5 min-h-[44px] bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 rounded-lg hover:bg-slate-100 flex items-center justify-center gap-1 cursor-pointer"
                        title="Digital Visiting Card Studio (Owner Only)"
                      >
                        <QrCode className="w-3.5 h-3.5 text-amber-500" />
                        <span className="hidden sm:inline">Card</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => {
                          setQrModalBusiness(b);
                          setQrPayloadType('profile');
                          setQrTheme('gold');
                        }}
                        className="py-2.5 min-h-[44px] bg-amber-500/10 hover:bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-500/30 rounded-lg flex items-center justify-center gap-1 cursor-pointer"
                        title="Generate & Download Unique QR Code for Business"
                      >
                        <QrCode className="w-3.5 h-3.5 text-amber-500" />
                        <span className="hidden sm:inline">QR Code</span>
                      </button>
                    )}

                    {canManageCard && (
                      <button
                        onClick={() => {
                          setQrModalBusiness(b);
                          setQrPayloadType('profile');
                          setQrTheme('gold');
                        }}
                        className="py-2.5 min-h-[44px] bg-amber-500/10 hover:bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-500/30 rounded-lg flex items-center justify-center gap-1 cursor-pointer"
                        title="Generate & Download Unique QR Poster"
                      >
                        <Printer className="w-3.5 h-3.5 text-amber-500" />
                        <span className="hidden sm:inline">QR Poster</span>
                      </button>
                    )}

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

                    {!canManageCard ? (
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
                    ) : (
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
                    )}
                  </div>
                );
              })()}
        </div>
      ))}
        </div>
        )
      )}

      {/* DIGITAL VISITING CARD STUDIO MODAL WITH REGENERATE DESIGN & JPG DOWNLOAD */}
      {visitingCardBusiness && (() => {
        if (!isOwnerOfBusiness(visitingCardBusiness)) {
          return (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md">
              <div className="bg-white dark:bg-slate-900 border border-red-500/50 rounded-3xl p-6 text-center max-w-md space-y-4 shadow-2xl">
                <div className="w-12 h-12 bg-red-100 text-red-600 dark:bg-red-950 dark:text-red-400 rounded-full flex items-center justify-center mx-auto">
                  <X className="w-6 h-6" />
                </div>
                <h3 className="font-extrabold text-lg text-slate-900 dark:text-white">Access Restricted</h3>
                <p className="text-xs text-slate-600 dark:text-slate-300">
                  The Digital Visiting Card option is only accessible to the verified owner of Business ID <span className="font-mono font-bold text-amber-600">{visitingCardBusiness.id}</span>.
                </p>
                <button
                  onClick={() => setVisitingCardBusiness(null)}
                  className="px-5 py-2.5 bg-slate-900 dark:bg-slate-700 text-white rounded-xl text-xs font-extrabold cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          );
        }

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
                {/* Background Cover Image Banner if set */}
                {visitingCardBusiness.coverImageUrl && (
                  <div
                    className="absolute inset-x-0 top-0 h-28 bg-cover bg-center opacity-30 mix-blend-overlay pointer-events-none"
                    style={{ backgroundImage: `url(${visitingCardBusiness.coverImageUrl})` }}
                  />
                )}

                {/* Background Pattern */}
                <div className="absolute inset-0 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px] opacity-10 pointer-events-none" />

                {/* Top Header of Card */}
                <div className="flex items-start justify-between gap-3 relative z-10 border-b border-white/20 pb-3">
                  <div className="flex items-center gap-3">
                    {/* Interactive Logo Picture with Camera Hover Overlay */}
                    <div className="relative group shrink-0" title="Click to update business logo from camera/gallery">
                      <img
                        src={visitingCardBusiness.logoUrl}
                        alt="Business Logo"
                        className="w-16 h-16 rounded-2xl object-cover border-2 border-white/60 shadow-lg bg-white"
                      />
                      <label className="absolute inset-0 bg-slate-950/70 rounded-2xl flex flex-col items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                        <Camera className="w-4 h-4 text-amber-300" />
                        <span className="text-[9px] font-black uppercase">Upload</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleLogoUpload(e, visitingCardBusiness)}
                          className="hidden"
                        />
                      </label>
                    </div>

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

              {/* BRANDING & MEDIA UPLOAD CONTROL STUDIO (OWNER ONLY) */}
              <div className="bg-slate-50 dark:bg-slate-800/80 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-extrabold text-xs text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
                    <Camera className="w-4 h-4 text-amber-500" />
                    <span>Card Branding & Media Upload</span>
                  </h4>
                  <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-extrabold bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/30">
                    Camera & Gallery Active
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {/* LOGO UPLOADER */}
                  <div className="p-2.5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 space-y-2">
                    <div className="flex items-center justify-between text-[11px] font-bold text-slate-800 dark:text-slate-200">
                      <span>1. Logo Photo</span>
                      <span className="text-[10px] text-slate-500 font-normal">Avatar</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <label className="flex-1 py-2 px-2 bg-amber-500/10 hover:bg-amber-500/20 text-amber-800 dark:text-amber-300 border border-amber-500/30 rounded-xl text-[10px] font-extrabold flex items-center justify-center gap-1 cursor-pointer transition-all shadow-sm">
                        <Camera className="w-3.5 h-3.5 text-amber-500" />
                        <span>Camera</span>
                        <input
                          type="file"
                          accept="image/*"
                          capture="environment"
                          onChange={(e) => handleLogoUpload(e, visitingCardBusiness)}
                          className="hidden"
                        />
                      </label>
                      <label className="flex-1 py-2 px-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 border border-slate-300 dark:border-slate-700 rounded-xl text-[10px] font-extrabold flex items-center justify-center gap-1 cursor-pointer transition-all shadow-sm">
                        <Upload className="w-3.5 h-3.5 text-slate-500" />
                        <span>Gallery File</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleLogoUpload(e, visitingCardBusiness)}
                          className="hidden"
                        />
                      </label>
                    </div>
                  </div>

                  {/* COVER BANNER UPLOADER */}
                  <div className="p-2.5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 space-y-2">
                    <div className="flex items-center justify-between text-[11px] font-bold text-slate-800 dark:text-slate-200">
                      <span>2. Card Cover Banner</span>
                      <span className="text-[10px] text-slate-500 font-normal">Header Background</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <label className="flex-1 py-2 px-2 bg-amber-500/10 hover:bg-amber-500/20 text-amber-800 dark:text-amber-300 border border-amber-500/30 rounded-xl text-[10px] font-extrabold flex items-center justify-center gap-1 cursor-pointer transition-all shadow-sm">
                        <Camera className="w-3.5 h-3.5 text-amber-500" />
                        <span>Camera Banner</span>
                        <input
                          type="file"
                          accept="image/*"
                          capture="environment"
                          onChange={(e) => handleCoverUpload(e, visitingCardBusiness)}
                          className="hidden"
                        />
                      </label>
                      <label className="flex-1 py-2 px-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 border border-slate-300 dark:border-slate-700 rounded-xl text-[10px] font-extrabold flex items-center justify-center gap-1 cursor-pointer transition-all shadow-sm">
                        <Upload className="w-3.5 h-3.5 text-slate-500" />
                        <span>Gallery Banner</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleCoverUpload(e, visitingCardBusiness)}
                          className="hidden"
                        />
                      </label>
                    </div>
                  </div>
                </div>

                {/* LUXURY COVER BANNER PRESETS */}
                <div className="pt-1 space-y-1">
                  <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 block">
                    Or select a curated Luxury Cover Banner Preset:
                  </span>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                    {BRANDING_COVER_PRESETS.map((p, idx) => (
                      <button
                        key={idx}
                        onClick={() => {
                          updateBusinessListing(visitingCardBusiness.id, { coverImageUrl: p.url });
                          setVisitingCardBusiness({ ...visitingCardBusiness, coverImageUrl: p.url });
                          showToast('Preset Applied', `Applied "${p.name}" cover banner.`, 'info');
                        }}
                        className="p-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 hover:border-amber-500 text-[10px] font-extrabold text-slate-800 dark:text-slate-200 truncate cursor-pointer flex items-center gap-1.5 shadow-sm transition-all"
                      >
                        <span
                          className="w-3.5 h-3.5 rounded-md bg-cover shrink-0 border border-white"
                          style={{ backgroundImage: `url(${p.url})` }}
                        />
                        <span className="truncate">{p.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* CONTROLS: REGENERATE DESIGN, QR POSTER & DOWNLOAD JPG */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-2">
                <button
                  onClick={() => setCardDesignIndex((prev) => (prev + 1) % CARD_DESIGN_STYLES.length)}
                  className="py-3 px-3 min-h-[44px] bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-100 font-extrabold text-xs rounded-2xl shadow border border-slate-300 dark:border-slate-700 flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                >
                  <RefreshCw className="w-4 h-4 text-amber-500" />
                  <span>Cycle Theme</span>
                </button>

                <button
                  onClick={() => {
                    if (visitingCardBusiness) {
                      setQrModalBusiness(visitingCardBusiness);
                      setQrPayloadType('profile');
                      setQrTheme('gold');
                    }
                  }}
                  className="py-3 px-3 min-h-[44px] bg-amber-500/10 hover:bg-amber-500/20 text-amber-700 dark:text-amber-300 font-extrabold text-xs rounded-2xl shadow border border-amber-500/30 flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                >
                  <Printer className="w-4 h-4 text-amber-500" />
                  <span>QR Poster</span>
                </button>

                <button
                  onClick={handleDownloadVisitingCardJpg}
                  className="py-3 px-3 min-h-[44px] bg-gradient-to-r from-amber-500 to-amber-700 text-amber-950 font-extrabold text-xs rounded-2xl shadow-lg hover:from-amber-600 hover:to-amber-800 flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>Card (JPG)</span>
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
                {editingJob ? 'Edit & Update Job Position' : 'Post a New Job Opening'}
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
                {editingJob ? 'Update Position in Database' : 'Save & Send Job Opening to Supabase'}
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

      {/* UNIQUE BUSINESS QR CODE STANDEE / POSTER MODAL */}
      {qrModalBusiness && (() => {
        const payload = getQrValueForBusiness(qrModalBusiness, qrPayloadType);

        const themeStyles = {
          gold: {
            name: 'Royal Gold & Obsidian',
            cardBg: 'bg-gradient-to-br from-slate-950 via-slate-900 to-amber-950 text-amber-100',
            borderColor: 'border-2 border-amber-400/80',
            titleColor: 'text-amber-300',
            subTextColor: 'text-amber-100/90',
            qrBgColor: '#FFFFFF',
            qrFgColor: '#0F172A',
            badgeClass: 'bg-amber-500/20 text-amber-300 border border-amber-500/40',
            accentText: 'text-amber-400',
          },
          emerald: {
            name: 'Emerald Trade Network',
            cardBg: 'bg-gradient-to-br from-emerald-950 via-slate-900 to-emerald-900 text-emerald-100',
            borderColor: 'border-2 border-emerald-400/80',
            titleColor: 'text-emerald-300',
            subTextColor: 'text-emerald-100/90',
            qrBgColor: '#FFFFFF',
            qrFgColor: '#064E3B',
            badgeClass: 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40',
            accentText: 'text-emerald-400',
          },
          saffron: {
            name: 'Jain Heritage Saffron',
            cardBg: 'bg-gradient-to-br from-amber-600 via-amber-700 to-amber-900 text-white',
            borderColor: 'border-2 border-amber-300',
            titleColor: 'text-amber-100',
            subTextColor: 'text-white/90',
            qrBgColor: '#FFFFFF',
            qrFgColor: '#78350F',
            badgeClass: 'bg-amber-900/40 text-amber-100 border border-amber-300/40',
            accentText: 'text-amber-200',
          },
          minimal: {
            name: 'Storefront Print White',
            cardBg: 'bg-white text-slate-900',
            borderColor: 'border-2 border-slate-900',
            titleColor: 'text-slate-900',
            subTextColor: 'text-slate-600',
            qrBgColor: '#FFFFFF',
            qrFgColor: '#000000',
            badgeClass: 'bg-amber-100 text-amber-900 border border-amber-300',
            accentText: 'text-amber-800',
          },
        };

        const currentTheme = themeStyles[qrTheme];

        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
            <div className="bg-white dark:bg-slate-900 border border-amber-500/50 rounded-3xl w-full max-w-xl p-5 sm:p-6 shadow-2xl relative text-slate-800 dark:text-slate-100 space-y-4 my-auto max-h-[90vh] overflow-y-auto">
              
              {/* Close Button */}
              <button
                onClick={() => setQrModalBusiness(null)}
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 dark:hover:text-white p-2 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-800 transition-colors z-20 cursor-pointer"
                title="Close Modal"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="text-center space-y-1 pr-8">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-500/20 text-amber-700 dark:text-amber-300 font-extrabold text-[11px] rounded-full border border-amber-500/30 uppercase tracking-wider">
                  <QrCode className="w-3.5 h-3.5 text-amber-500" />
                  <span>UNIQUE BUSINESS QR CODE GENERATOR</span>
                </div>
                <h3 className="text-xl font-bold font-serif text-slate-900 dark:text-white">
                  {qrModalBusiness.businessName}
                </h3>
                <p className="text-xs text-slate-500">
                  Custom printable QR code poster for physical storefronts, desks & marketing materials.
                </p>
              </div>

              {/* CONTROLS: PAYLOAD TYPE & THEME SELECTOR */}
              <div className="space-y-3 bg-slate-50 dark:bg-slate-800/60 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-700/80 text-xs">
                <div>
                  <label className="block font-extrabold text-slate-700 dark:text-slate-200 mb-1.5 flex items-center gap-1">
                    <Smartphone className="w-3.5 h-3.5 text-amber-500" />
                    <span>Scan Target / QR Payload Destination:</span>
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                    {[
                      { id: 'profile', label: '🌐 Digital Profile', desc: 'Web Card' },
                      { id: 'vcard', label: '📇 Phone vCard', desc: 'Save Contact' },
                      { id: 'whatsapp', label: '💬 WhatsApp', desc: 'Direct Chat' },
                      { id: 'maps', label: '🗺️ Google Maps', desc: 'Directions' },
                    ].map((item) => (
                      <button
                        key={item.id}
                        onClick={() => setQrPayloadType(item.id as any)}
                        className={`p-2 rounded-xl text-center border font-bold transition-all cursor-pointer ${
                          qrPayloadType === item.id
                            ? 'bg-amber-500 text-slate-950 border-amber-600 shadow-md scale-[1.02]'
                            : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700 hover:border-amber-400'
                        }`}
                      >
                        <div className="text-[11px] leading-tight">{item.label}</div>
                        <div className="text-[9px] opacity-75">{item.desc}</div>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block font-extrabold text-slate-700 dark:text-slate-200 mb-1.5 flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                    <span>Poster Theme Preset:</span>
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                    {[
                      { id: 'gold', label: '👑 Royal Gold' },
                      { id: 'emerald', label: '🌿 Emerald' },
                      { id: 'saffron', label: '🌅 Heritage Saffron' },
                      { id: 'minimal', label: '📄 Storefront White' },
                    ].map((theme) => (
                      <button
                        key={theme.id}
                        onClick={() => setQrTheme(theme.id as any)}
                        className={`p-2 rounded-xl text-center border text-[11px] font-extrabold transition-all cursor-pointer ${
                          qrTheme === theme.id
                            ? 'bg-slate-950 text-amber-300 dark:bg-amber-500 dark:text-slate-950 border-amber-500 shadow-md scale-[1.02]'
                            : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700 hover:border-amber-400'
                        }`}
                      >
                        {theme.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* PRINTABLE QR POSTER NODE */}
              <div
                id="business-qr-poster-node"
                className={`p-6 sm:p-8 rounded-3xl shadow-2xl space-y-5 transition-all duration-300 relative overflow-hidden ${currentTheme.cardBg} ${currentTheme.borderColor}`}
              >
                {/* Header Banner */}
                <div className="flex items-center justify-between gap-3 border-b border-white/20 pb-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={qrModalBusiness.logoUrl}
                      alt={qrModalBusiness.businessName}
                      className="w-14 h-14 rounded-2xl object-cover border-2 border-white/40 shadow-lg shrink-0 bg-white"
                    />
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <h4 className={`text-lg font-black font-serif ${currentTheme.titleColor} truncate`}>
                          {qrModalBusiness.businessName}
                        </h4>
                        {qrModalBusiness.isVerified && (
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${currentTheme.badgeClass}`}>
                            ✓ Verified Jain Business
                          </span>
                        )}
                      </div>
                      <p className={`text-xs font-semibold ${currentTheme.subTextColor}`}>
                        {qrModalBusiness.category} • ID: {qrModalBusiness.id}
                      </p>
                    </div>
                  </div>
                </div>

                {/* QR CODE DISPLAY BOX */}
                <div className="bg-white/95 backdrop-blur-md p-6 rounded-3xl shadow-2xl border border-white text-slate-900 text-center space-y-3 mx-auto max-w-sm">
                  <p className="text-xs font-black uppercase tracking-wider text-amber-800 flex items-center justify-center gap-1.5">
                    <QrCode className="w-4 h-4 text-amber-600" />
                    <span>SCAN WITH SMARTPHONE CAMERA</span>
                  </p>

                  <div className="bg-white p-3 rounded-2xl border-2 border-slate-900 inline-block shadow-inner">
                    <QRCodeSVG
                      id="business-qr-code-svg"
                      value={payload}
                      size={180}
                      level="H"
                      bgColor={currentTheme.qrBgColor}
                      fgColor={currentTheme.qrFgColor}
                      includeMargin={true}
                    />
                  </div>

                  <p className="text-[11px] font-bold text-slate-700 leading-snug px-2">
                    {qrPayloadType === 'profile' && 'Scans directly to view verified digital profile & catalog.'}
                    {qrPayloadType === 'vcard' && 'Scans to save complete contact card to phone contacts.'}
                    {qrPayloadType === 'whatsapp' && 'Scans to start direct WhatsApp conversation.'}
                    {qrPayloadType === 'maps' && 'Scans to open Google Maps directions to location.'}
                  </p>
                </div>

                {/* Business Details Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-1 border-t border-white/20">
                  <div className="space-y-1">
                    <p className="flex items-center gap-1.5">
                      <Phone className={`w-3.5 h-3.5 ${currentTheme.accentText}`} />
                      <span className="font-bold">{qrModalBusiness.mobile}</span>
                    </p>
                    <p className="flex items-center gap-1.5">
                      <MessageSquare className={`w-3.5 h-3.5 ${currentTheme.accentText}`} />
                      <span>{qrModalBusiness.whatsapp}</span>
                    </p>
                  </div>

                  <div className="space-y-1">
                    <p className="flex items-start gap-1.5">
                      <MapPin className={`w-3.5 h-3.5 ${currentTheme.accentText} shrink-0 mt-0.5`} />
                      <span className="text-[11px] leading-tight">
                        {qrModalBusiness.address}, {qrModalBusiness.city}, {qrModalBusiness.state}
                      </span>
                    </p>
                    {qrModalBusiness.gstNumber && (
                      <p className="text-[10px] font-mono opacity-90">
                        GSTIN: <strong>{qrModalBusiness.gstNumber}</strong>
                      </p>
                    )}
                  </div>
                </div>

                {/* Footer Tagline */}
                <div className="text-center pt-2 border-t border-white/10 text-[10px] uppercase font-bold tracking-widest opacity-80">
                  Jain Connect Global • Verified Commercial Network
                </div>
              </div>

              {/* ACTION TOOLBAR */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-2">
                <button
                  onClick={handleDownloadQrPosterPng}
                  className="py-3 px-3 min-h-[44px] bg-gradient-to-r from-amber-500 to-amber-700 text-amber-950 font-extrabold text-xs rounded-2xl shadow-lg hover:from-amber-600 hover:to-amber-800 flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Poster (PNG)</span>
                </button>

                <button
                  onClick={handleDownloadQrCodeOnly}
                  className="py-3 px-3 min-h-[44px] bg-slate-900 text-amber-300 dark:bg-amber-500 dark:text-slate-950 font-extrabold text-xs rounded-2xl shadow hover:opacity-90 flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                >
                  <QrCode className="w-4 h-4" />
                  <span>QR Code Only (PNG)</span>
                </button>

                <button
                  onClick={() => handleCopyQrPayload(payload)}
                  className="py-3 px-3 min-h-[44px] bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-100 font-extrabold text-xs rounded-2xl shadow border border-slate-300 dark:border-slate-700 flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                >
                  {isCopiedLink ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-500" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4 text-amber-500" />
                      <span>Copy Payload</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
};
