import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { QRCodeSVG } from 'qrcode.react';
import { VerifiedBadge } from './VerifiedBadge';
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
  Mail
} from 'lucide-react';
import { BusinessListing } from '../types';

export const BusinessSection: React.FC = () => {
  const { businesses, openRegistrationModal, showToast, openGmailModal } = useApp();

  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBusiness, setSelectedBusiness] = useState<BusinessListing | null>(null);
  const [showQRModal, setShowQRModal] = useState(false);
  const [onlyGstVerified, setOnlyGstVerified] = useState(false);

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
    const cleanNum = mobile.replace(/[^0-9]/g, '');
    window.open(`https://wa.me/${cleanNum}?text=Jai%20Jinendra!%20Inquiring%20about%20${encodeURIComponent(name)}%20via%20Jain%20Connect%20Global.`, '_blank');
  };

  return (
    <div className="space-y-6">
      
      {/* Banner */}
      <div className="bg-gradient-to-r from-amber-950 via-slate-900 to-emerald-950 text-white rounded-2xl p-6 sm:p-8 shadow-xl border border-amber-800/40 relative overflow-hidden">
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-500/20 border border-amber-500/40 rounded-full text-amber-300 text-xs font-bold uppercase tracking-wider">
            <Building2 className="w-3.5 h-3.5 text-amber-400" />
            <span>Jain Business Directory & Trade Network</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold font-serif text-white">
            Promote & Discover Verified Jain Businesses Worldwide
          </h2>

          <p className="text-xs sm:text-sm text-slate-300">
            Over 5,000+ Jain Industrialists, Jewelers, CA Professionals, Doctors, IT Founders, and Exporters. Trade with trust and brotherhood.
          </p>

          <div className="pt-2">
            <button
              onClick={() => openRegistrationModal('business')}
              className="px-5 py-3 min-h-[44px] bg-gradient-to-r from-amber-500 to-amber-700 text-amber-950 font-bold text-xs rounded-xl shadow-lg hover:from-amber-600 hover:to-amber-800 transition-all flex items-center justify-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span>List Your Jain Business</span>
            </button>
          </div>
        </div>
      </div>

      {/* Search & Category Filter */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
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

          <label className="flex items-center gap-2 cursor-pointer text-amber-700 dark:text-amber-400 hover:text-amber-800 font-bold text-xs shrink-0 bg-amber-50 dark:bg-amber-950/40 p-2.5 rounded-xl border border-amber-200 dark:border-amber-800/50">
            <input
              type="checkbox"
              checked={onlyGstVerified}
              onChange={(e) => setOnlyGstVerified(e.target.checked)}
              className="w-4 h-4 rounded border-amber-300 text-amber-600 focus:ring-amber-500"
            />
            <span>Show GST Verified Listings Only</span>
          </label>
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

      {/* Business Cards Grid */}
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
                <p className="flex items-center gap-1.5 truncate">
                  <MapPin className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                  <span>{b.address}, {b.city}, {b.state}</span>
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
                  setSelectedBusiness(b);
                  setShowQRModal(true);
                }}
                className="py-2.5 min-h-[44px] bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 rounded-lg hover:bg-slate-100 flex items-center justify-center gap-1"
                title="Digital Visiting Card"
              >
                <QrCode className="w-3.5 h-3.5 text-amber-500" />
                <span className="hidden sm:inline">Card</span>
              </button>

              <button
                onClick={() => handleWhatsAppChat(b.whatsapp, b.businessName)}
                className="py-2.5 min-h-[44px] bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg flex items-center justify-center gap-1 shadow-sm"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">WhatsApp</span>
              </button>

              <button
                onClick={() => openGmailModal(b.email, `Inquiry regarding ${b.businessName}`, `Respected ${b.contactPerson || 'Vendor'},\n\nI found your business listing on Jain Connect Global.`)}
                className="py-2.5 min-h-[44px] bg-sky-600 hover:bg-sky-700 text-white rounded-lg flex items-center justify-center gap-1 shadow-sm"
                title="Send Gmail"
              >
                <Mail className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Gmail</span>
              </button>

              <a
                href={`tel:${b.mobile}`}
                className="py-2.5 min-h-[44px] bg-amber-600 hover:bg-amber-700 text-white rounded-lg flex items-center justify-center gap-1 shadow-sm"
              >
                <Phone className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Call</span>
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* Visiting Card & QR Code Modal */}
      {showQRModal && selectedBusiness && (() => {
        const vCardData = `BEGIN:VCARD
VERSION:3.0
N:;${selectedBusiness.businessName};;;
FN:${selectedBusiness.businessName}
ORG:${selectedBusiness.businessName}
TITLE:${selectedBusiness.category}
TEL;TYPE=CELL:${selectedBusiness.mobile}
TEL;TYPE=WORK:${selectedBusiness.whatsapp}
EMAIL:${selectedBusiness.email}
ADR;TYPE=WORK:;;${selectedBusiness.address};${selectedBusiness.city};${selectedBusiness.state};;India
NOTE:GST: ${selectedBusiness.gstNumber || 'N/A'} - Verified Jain Business
END:VCARD`;

        const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(vCardData)}`;

        const handleDownloadVCard = () => {
          const blob = new Blob([vCardData], { type: 'text/vcard;charset=utf-8;' });
          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.setAttribute('download', `${selectedBusiness.businessName.replace(/\s+/g, '_')}_vCard.vcf`);
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          showToast('vCard Downloaded', `Saved contact file for ${selectedBusiness.businessName}.`, 'success');
        };

        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
            <div className="bg-white dark:bg-slate-900 border border-amber-400/60 dark:border-amber-700/60 rounded-2xl w-full max-w-md p-6 shadow-2xl relative text-slate-800 dark:text-slate-100 space-y-4 my-auto">
              
              {/* Close Button */}
              <button
                onClick={() => setShowQRModal(false)}
                className="absolute top-3 right-3 text-slate-400 hover:text-slate-700 dark:hover:text-white p-2 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-800 transition-colors z-10"
                title="Close"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="text-center pt-2 space-y-1.5">
                <span className="inline-block text-[10px] bg-amber-500/20 text-amber-700 dark:text-amber-300 font-extrabold px-3 py-1 rounded-full uppercase border border-amber-500/30 tracking-wider">
                  DIGITAL VISITING CARD
                </span>
                <h3 className="text-xl font-bold font-serif text-slate-900 dark:text-white pr-8 pl-8">
                  {selectedBusiness.businessName}
                </h3>
                <div className="flex items-center justify-center gap-1.5 flex-wrap">
                  <span className="text-xs text-amber-600 dark:text-amber-400 font-semibold">{selectedBusiness.category}</span>
                  {selectedBusiness.isVerified && <VerifiedBadge type="business" showText={true} size="sm" />}
                </div>
              </div>

              {/* QR Code Graphic Box */}
              <div className="bg-gradient-to-br from-amber-50/80 via-white to-amber-100/50 dark:from-slate-800 dark:via-slate-900 dark:to-slate-800 border-2 border-dashed border-amber-400/80 p-5 rounded-2xl flex flex-col items-center justify-center space-y-3 shadow-inner">
                <div className="w-44 h-44 bg-white p-3 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 flex items-center justify-center relative">
                  <QRCodeSVG
                    value={vCardData}
                    size={152}
                    bgColor="#FFFFFF"
                    fgColor="#0F172A"
                    level="M"
                  />
                </div>
                <p className="text-[11px] text-slate-600 dark:text-slate-400 text-center font-medium max-w-xs leading-tight">
                  Scan this QR code with any Smartphone Camera to instantly save contact details & GST information.
                </p>
              </div>

              {/* Business Details Info Card */}
              <div className="space-y-1.5 text-xs text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/80 p-3.5 rounded-xl border border-slate-200 dark:border-slate-700/60">
                <p className="flex justify-between border-b border-slate-200/60 dark:border-slate-700/60 pb-1">
                  <span className="text-slate-400 font-medium">City:</span>
                  <span className="font-bold text-slate-800 dark:text-slate-100">{selectedBusiness.city}, {selectedBusiness.state}</span>
                </p>
                <p className="flex justify-between border-b border-slate-200/60 dark:border-slate-700/60 py-1">
                  <span className="text-slate-400 font-medium">GST Number:</span>
                  <span className="font-mono font-bold text-amber-600 dark:text-amber-400">{selectedBusiness.gstNumber || 'Verified Jain Vendor'}</span>
                </p>
                <p className="flex justify-between border-b border-slate-200/60 dark:border-slate-700/60 py-1">
                  <span className="text-slate-400 font-medium">Phone / WhatsApp:</span>
                  <span className="font-bold text-slate-800 dark:text-slate-100">{selectedBusiness.mobile}</span>
                </p>
                <p className="flex justify-between pt-1">
                  <span className="text-slate-400 font-medium">Email:</span>
                  <span className="font-medium text-slate-800 dark:text-slate-100 truncate max-w-[200px]">{selectedBusiness.email}</span>
                </p>
              </div>

              {/* Modal Buttons */}
              <div className="grid grid-cols-2 gap-2 pt-1">
                <button
                  onClick={handleDownloadVCard}
                  className="py-2.5 min-h-[44px] bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 dark:hover:bg-slate-700 text-white font-bold text-xs rounded-xl shadow-md flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Download className="w-4 h-4 text-amber-400" />
                  <span>Download .vcf</span>
                </button>

                <button
                  onClick={() => {
                    navigator.clipboard?.writeText?.(window.location.href);
                    showToast('vCard Link Copied', 'Share this link with anyone on WhatsApp or email.', 'success');
                    setShowQRModal(false);
                  }}
                  className="py-2.5 min-h-[44px] bg-gradient-to-r from-amber-500 to-amber-700 text-amber-950 font-bold text-xs rounded-xl shadow-md hover:from-amber-600 hover:to-amber-800 flex items-center justify-center gap-1.5 transition-all"
                >
                  <Share2 className="w-4 h-4" />
                  <span>Share Card</span>
                </button>
              </div>
            </div>
          </div>
        );
      })()}

      {/* GST Verification Certificate Modal */}
      {gstModalResult && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 border border-amber-500/50 rounded-2xl w-full max-w-lg p-6 shadow-2xl relative text-slate-800 dark:text-slate-100 space-y-4 my-auto">
            {/* Close Button */}
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

            {/* Certificate Details Card */}
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
