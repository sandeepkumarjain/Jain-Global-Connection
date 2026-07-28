import React, { useState, useRef } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { useApp } from '../context/AppContext';
import { User } from '../types';
import {
  X,
  QrCode,
  ShieldCheck,
  Download,
  Copy,
  CheckCircle2,
  Printer,
  Sparkles,
  MapPin,
  Heart,
  Calendar,
  Share2,
  User as UserIcon,
  Award,
  Check,
  Scan,
  Palette,
  Sun
} from 'lucide-react';

interface MemberDigitalIdModalProps {
  userOverride?: User | null;
  isOpenOverride?: boolean;
  onCloseOverride?: () => void;
}

export const MemberDigitalIdModal: React.FC<MemberDigitalIdModalProps> = ({
  userOverride,
  isOpenOverride,
  onCloseOverride,
}) => {
  const {
    currentUser,
    isDigitalIdModalOpen,
    setIsDigitalIdModalOpen,
    showToast,
    themeMode,
  } = useApp();

  const user = userOverride || currentUser;
  const isOpen = isOpenOverride !== undefined ? isOpenOverride : isDigitalIdModalOpen;
  const handleClose = onCloseOverride || (() => setIsDigitalIdModalOpen(false));

  const [cardSide, setCardSide] = useState<'front' | 'qr'>('front');
  const [cardTheme, setCardTheme] = useState<'auspicious' | 'light'>('auspicious');
  const [eventTag, setEventTag] = useState<string>('Jain Sangh Community Pass');
  const [copiedId, setCopiedId] = useState(false);
  const [copiedPayload, setCopiedPayload] = useState(false);
  const [isSimulatingScan, setIsSimulatingScan] = useState(false);
  const [scanVerified, setScanVerified] = useState(false);

  const cardRef = useRef<HTMLDivElement>(null);

  if (!isOpen || !user) return null;

  // Generate unique standardized Member ID
  const memberCode = `JCG-2026-${(user.id || '108').toUpperCase().replace(/[^A-Z0-9]/g, '').slice(-6)}`;

  // Construct JSON profile verification payload for QR
  const qrDataObj = {
    platform: 'Jain Connect Global Sangh',
    memberId: memberCode,
    fullName: user.fullName,
    email: user.email,
    mobile: user.mobile,
    sect: user.sect || 'Swetambar Murtipujak',
    gotra: user.gotra || 'Jain Sangh',
    city: user.city || 'Mumbai',
    state: user.state || 'Maharashtra',
    role: user.role || 'Member',
    bloodGroup: user.bloodGroup || 'O+',
    isVerified: user.isVerified ?? true,
    verificationTimestamp: new Date().toISOString(),
    eventTag: eventTag,
  };

  const qrString = JSON.stringify(qrDataObj);

  const handleCopyMemberId = () => {
    navigator.clipboard.writeText(memberCode);
    setCopiedId(true);
    showToast('Member ID Copied', `Copied ${memberCode} to clipboard.`, 'success');
    setTimeout(() => setCopiedId(false), 2000);
  };

  const handleCopyPayload = () => {
    navigator.clipboard.writeText(qrString);
    setCopiedPayload(true);
    showToast('QR Data Copied', 'Encrypted member profile payload copied to clipboard.', 'success');
    setTimeout(() => setCopiedPayload(false), 2000);
  };

  const handlePrintCard = () => {
    window.print();
    showToast('Print Initiated', 'Sending Digital ID Card layout to system printer.', 'info');
  };

  const handleSimulateScan = () => {
    setIsSimulatingScan(true);
    setScanVerified(false);
    setTimeout(() => {
      setIsSimulatingScan(false);
      setScanVerified(true);
      showToast(
        'QR Code Verified! ✅',
        `Authenticated ${user.fullName} (${memberCode}) for ${eventTag}.`,
        'success'
      );
    }, 1200);
  };

  const EVENT_TAG_OPTIONS = [
    'Jain Sangh Community Pass',
    'Paryushan Mahaparv 2026 Access',
    'Jain Business Conclave Delegate',
    'Sangh Mahasabha Voting Member',
    'Emergency Medical & Blood ID',
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto animate-fade-in print:p-0 print:bg-white">
      <div className="relative w-full max-w-xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-amber-300/50 dark:border-amber-700/50 my-6 overflow-hidden print:shadow-none print:border-none print:my-0">
        
        {/* Header Modal Bar */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-amber-600 via-amber-700 to-amber-900 text-white flex items-center justify-between print:hidden">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20">
              <QrCode className="w-5 h-5 text-amber-200" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold font-serif leading-tight">Digital Member ID & QR Card</h2>
                <span className="px-2 py-0.5 rounded-full bg-amber-400 text-amber-950 text-[10px] font-extrabold uppercase tracking-wider">
                  Verified
                </span>
              </div>
              <p className="text-[11px] text-amber-200">
                Official Sangh ID for event check-in, directory sharing & verification
              </p>
            </div>
          </div>

          <button
            onClick={handleClose}
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content Body */}
        <div className="p-4 sm:p-6 space-y-5 max-h-[85vh] overflow-y-auto">

          {/* Event Pass Selector Pill & Card Theme Toggle */}
          <div className="print:hidden bg-amber-50 dark:bg-slate-800/80 p-3 rounded-2xl border border-amber-200/80 dark:border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <span className="font-bold text-amber-900 dark:text-amber-300 flex items-center gap-1.5 shrink-0">
                <Sparkles className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                Pass Type:
              </span>
              <select
                value={eventTag}
                onChange={(e) => setEventTag(e.target.value)}
                className="px-2.5 py-1.5 rounded-xl border border-amber-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 font-semibold focus:outline-none focus:ring-1 focus:ring-amber-500 text-xs"
              >
                {EVENT_TAG_OPTIONS.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </div>

            {/* Theme Toggle Pill */}
            <div className="flex items-center gap-1 bg-white dark:bg-slate-900 p-1 rounded-xl border border-amber-300/80 dark:border-slate-600 shrink-0">
              <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 px-1 flex items-center gap-1">
                <Palette className="w-3 h-3 text-amber-600 dark:text-amber-400" />
                Card Theme:
              </span>
              <button
                onClick={() => {
                  setCardTheme('light');
                  showToast('Card Theme Changed', 'Switched Digital ID theme to Light Minimal.', 'info');
                }}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
                  cardTheme === 'light'
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Sun className="w-3 h-3 text-amber-400" />
                <span>Light</span>
              </button>
              <button
                onClick={() => {
                  setCardTheme('auspicious');
                  showToast('Card Theme Changed', 'Switched Digital ID theme to Auspicious Gold.', 'info');
                }}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
                  cardTheme === 'auspicious'
                    ? 'bg-gradient-to-r from-amber-600 to-amber-700 text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Sparkles className="w-3 h-3 text-amber-200" />
                <span>Auspicious</span>
              </button>
            </div>
          </div>

          {/* View Toggle Tabs */}
          <div className="flex items-center justify-center p-1 bg-slate-100 dark:bg-slate-800 rounded-2xl print:hidden border border-slate-200 dark:border-slate-700">
            <button
              onClick={() => setCardSide('front')}
              className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                cardSide === 'front'
                  ? 'bg-amber-600 text-white shadow-md'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <UserIcon className="w-3.5 h-3.5" />
              <span>Digital ID Front</span>
            </button>
            <button
              onClick={() => setCardSide('qr')}
              className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                cardSide === 'qr'
                  ? 'bg-amber-600 text-white shadow-md'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <QrCode className="w-3.5 h-3.5" />
              <span>QR Code Verification</span>
            </button>
          </div>

          {/* Physical Digital ID Card Container */}
          <div
            ref={cardRef}
            className={`relative rounded-3xl p-5 sm:p-6 shadow-2xl border-2 overflow-hidden transition-all transform hover:scale-[1.01] ${
              cardTheme === 'auspicious'
                ? 'bg-gradient-to-br from-amber-600 via-amber-700 to-amber-900 text-white border-amber-300/60'
                : 'bg-gradient-to-br from-slate-50 via-white to-amber-50/50 text-slate-900 border-slate-300'
            }`}
          >
            {/* Background Decorative Elements */}
            <div
              className={`absolute -top-12 -right-12 w-40 h-40 rounded-full blur-2xl pointer-events-none ${
                cardTheme === 'auspicious' ? 'bg-white/10' : 'bg-amber-500/10'
              }`}
            />
            <div
              className={`absolute -bottom-12 -left-12 w-40 h-40 rounded-full blur-2xl pointer-events-none ${
                cardTheme === 'auspicious' ? 'bg-amber-400/20' : 'bg-slate-300/40'
              }`}
            />
            <div
              className={`absolute top-1/2 right-4 pointer-events-none text-9xl font-serif ${
                cardTheme === 'auspicious' ? 'opacity-10 text-white' : 'opacity-5 text-slate-900'
              }`}
            >
              🙏
            </div>

            {/* Top Brand Banner */}
            <div
              className={`flex items-center justify-between pb-3 mb-4 relative z-10 border-b ${
                cardTheme === 'auspicious' ? 'border-amber-300/30' : 'border-slate-200'
              }`}
            >
              <div className="flex items-center gap-2">
                <div
                  className={`w-8 h-8 rounded-xl font-black text-sm flex items-center justify-center shadow-md ${
                    cardTheme === 'auspicious'
                      ? 'bg-amber-400 text-amber-950'
                      : 'bg-slate-900 text-amber-400'
                  }`}
                >
                  JCG
                </div>
                <div>
                  <h3
                    className={`font-serif font-black text-sm tracking-wider uppercase ${
                      cardTheme === 'auspicious' ? 'text-amber-100' : 'text-slate-900'
                    }`}
                  >
                    Jain Connect Global
                  </h3>
                  <p
                    className={`text-[9px] tracking-widest uppercase font-semibold ${
                      cardTheme === 'auspicious' ? 'text-amber-200' : 'text-slate-500'
                    }`}
                  >
                    Global Jain Sangh Digital Card
                  </p>
                </div>
              </div>

              <div className="text-right">
                <span
                  className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-extrabold border uppercase ${
                    cardTheme === 'auspicious'
                      ? 'bg-amber-400/30 text-amber-100 border-amber-300/40'
                      : 'bg-amber-100 text-amber-900 border-amber-300'
                  }`}
                >
                  {eventTag}
                </span>
              </div>
            </div>

            {cardSide === 'front' ? (
              /* CARD FRONT VIEW */
              <div className="space-y-4 relative z-10">
                <div className="flex items-start gap-4">
                  <div className="relative shrink-0">
                    <img
                      src={user.profilePhoto || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250'}
                      alt={user.fullName}
                      className={`w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover border-2 shadow-xl ${
                        cardTheme === 'auspicious' ? 'border-amber-300' : 'border-slate-300'
                      }`}
                    />
                    {user.isVerified && (
                      <span
                        className="absolute -bottom-1 -right-1 p-1 bg-emerald-500 text-white rounded-full shadow-md"
                        title="Verified Member"
                      >
                        <ShieldCheck className="w-3.5 h-3.5" />
                      </span>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h2
                        className={`text-lg sm:text-xl font-serif font-black truncate ${
                          cardTheme === 'auspicious' ? 'text-white' : 'text-slate-900'
                        }`}
                      >
                        {user.fullName}
                      </h2>
                    </div>

                    <p
                      className={`text-xs font-semibold mt-0.5 ${
                        cardTheme === 'auspicious' ? 'text-amber-200' : 'text-slate-600'
                      }`}
                    >
                      {user.role || 'Sangh Member'} • {user.sect || 'Swetambar'}
                    </p>

                    <div
                      className={`mt-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-xl border text-xs font-mono font-bold tracking-wider ${
                        cardTheme === 'auspicious'
                          ? 'bg-amber-950/70 border-amber-300/50 text-amber-200'
                          : 'bg-slate-100 border-slate-300 text-slate-700'
                      }`}
                    >
                      <span>ID:</span>
                      <span
                        className={
                          cardTheme === 'auspicious'
                            ? 'text-amber-300 font-black'
                            : 'text-amber-700 font-black'
                        }
                      >
                        {memberCode}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Key Attributes Grid */}
                <div
                  className={`grid grid-cols-2 gap-2 text-xs pt-1 border-t ${
                    cardTheme === 'auspicious' ? 'border-amber-300/20' : 'border-slate-200'
                  }`}
                >
                  <div
                    className={`p-2 rounded-xl border ${
                      cardTheme === 'auspicious'
                        ? 'bg-amber-950/40 border-amber-300/20'
                        : 'bg-slate-50 border-slate-200'
                    }`}
                  >
                    <p
                      className={`text-[10px] font-bold uppercase ${
                        cardTheme === 'auspicious' ? 'text-amber-300/80' : 'text-slate-500'
                      }`}
                    >
                      Gotra / Family
                    </p>
                    <p
                      className={`font-semibold truncate ${
                        cardTheme === 'auspicious' ? 'text-white' : 'text-slate-900'
                      }`}
                    >
                      {user.gotra || 'Jain Family'}
                    </p>
                  </div>

                  <div
                    className={`p-2 rounded-xl border ${
                      cardTheme === 'auspicious'
                        ? 'bg-amber-950/40 border-amber-300/20'
                        : 'bg-slate-50 border-slate-200'
                    }`}
                  >
                    <p
                      className={`text-[10px] font-bold uppercase ${
                        cardTheme === 'auspicious' ? 'text-amber-300/80' : 'text-slate-500'
                      }`}
                    >
                      Location
                    </p>
                    <p
                      className={`font-semibold truncate flex items-center gap-1 ${
                        cardTheme === 'auspicious' ? 'text-white' : 'text-slate-900'
                      }`}
                    >
                      <MapPin
                        className={`w-3 h-3 shrink-0 ${
                          cardTheme === 'auspicious' ? 'text-amber-300' : 'text-amber-600'
                        }`}
                      />
                      {user.city || 'Mumbai'}, {user.state || 'MH'}
                    </p>
                  </div>

                  <div
                    className={`p-2 rounded-xl border ${
                      cardTheme === 'auspicious'
                        ? 'bg-amber-950/40 border-amber-300/20'
                        : 'bg-slate-50 border-slate-200'
                    }`}
                  >
                    <p
                      className={`text-[10px] font-bold uppercase ${
                        cardTheme === 'auspicious' ? 'text-amber-300/80' : 'text-slate-500'
                      }`}
                    >
                      Blood Group
                    </p>
                    <p
                      className={`font-semibold flex items-center gap-1 ${
                        cardTheme === 'auspicious' ? 'text-white' : 'text-slate-900'
                      }`}
                    >
                      <Heart className="w-3 h-3 text-red-500 fill-red-500 shrink-0" />
                      {user.bloodGroup || 'O+'} (Available)
                    </p>
                  </div>

                  <div
                    className={`p-2 rounded-xl border ${
                      cardTheme === 'auspicious'
                        ? 'bg-amber-950/40 border-amber-300/20'
                        : 'bg-slate-50 border-slate-200'
                    }`}
                  >
                    <p
                      className={`text-[10px] font-bold uppercase ${
                        cardTheme === 'auspicious' ? 'text-amber-300/80' : 'text-slate-500'
                      }`}
                    >
                      Membership Tier
                    </p>
                    <p
                      className={`font-semibold flex items-center gap-1 ${
                        cardTheme === 'auspicious' ? 'text-amber-300' : 'text-amber-700 font-bold'
                      }`}
                    >
                      <Award
                        className={`w-3 h-3 shrink-0 ${
                          cardTheme === 'auspicious' ? 'text-amber-400' : 'text-amber-600'
                        }`}
                      />
                      {user.membershipTier || 'Verified Member'}
                    </p>
                  </div>
                </div>

                {/* Micro Footer Notice */}
                <div
                  className={`text-[10px] flex items-center justify-between pt-1 ${
                    cardTheme === 'auspicious' ? 'text-amber-200/90' : 'text-slate-500'
                  }`}
                >
                  <span>Authentic Sangh Profile</span>
                  <span>Flip card for QR Verification</span>
                </div>
              </div>
            ) : (
              /* CARD QR BACK VIEW */
              <div className="flex flex-col items-center text-center space-y-3 relative z-10 py-1">
                <div
                  className={`p-3 bg-white rounded-2xl shadow-xl border-4 flex items-center justify-center ${
                    cardTheme === 'auspicious' ? 'border-amber-300' : 'border-slate-300'
                  }`}
                >
                  <QRCodeSVG
                    value={qrString}
                    size={160}
                    bgColor="#FFFFFF"
                    fgColor={cardTheme === 'auspicious' ? '#78350F' : '#0F172A'}
                    level="H"
                    includeMargin={true}
                  />
                </div>

                <div>
                  <p
                    className={`text-xs font-mono font-bold tracking-wider ${
                      cardTheme === 'auspicious' ? 'text-amber-200' : 'text-slate-800'
                    }`}
                  >
                    {memberCode}
                  </p>
                  <p
                    className={`text-[11px] font-medium mt-0.5 ${
                      cardTheme === 'auspicious' ? 'text-white' : 'text-slate-600'
                    }`}
                  >
                    Scan with any QR scanner or camera to verify authenticity
                  </p>
                </div>

                <div
                  className={`w-full pt-2 border-t flex items-center justify-around text-[10px] font-semibold ${
                    cardTheme === 'auspicious'
                      ? 'border-amber-300/30 text-amber-200'
                      : 'border-slate-200 text-slate-500'
                  }`}
                >
                  <span>🔒 Secure Sangh Encryption</span>
                  <span>✅ Instant Event Verification</span>
                </div>
              </div>
            )}
          </div>

          {/* Quick Actions & Sharing Toolbar */}
          <div className="space-y-3 print:hidden">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              <button
                onClick={handleCopyMemberId}
                className="px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-amber-100 dark:hover:bg-amber-950 text-slate-800 dark:text-slate-200 text-xs font-bold border border-slate-200 dark:border-slate-700 transition-all flex items-center justify-center gap-1.5"
              >
                {copiedId ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-amber-600" />}
                <span>{copiedId ? 'ID Copied' : 'Copy Member ID'}</span>
              </button>

              <button
                onClick={handleCopyPayload}
                className="px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-amber-100 dark:hover:bg-amber-950 text-slate-800 dark:text-slate-200 text-xs font-bold border border-slate-200 dark:border-slate-700 transition-all flex items-center justify-center gap-1.5"
              >
                {copiedPayload ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Share2 className="w-3.5 h-3.5 text-amber-600" />}
                <span>{copiedPayload ? 'QR Data Copied' : 'Copy QR Payload'}</span>
              </button>

              <button
                onClick={handlePrintCard}
                className="col-span-2 sm:col-span-1 px-3 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-sm"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Digital Card</span>
              </button>
            </div>

            {/* Simulated QR Check-in Tester for Event Organizers */}
            <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Scan className="w-4 h-4 text-amber-600 shrink-0" />
                <div>
                  <p className="text-xs font-bold text-slate-900 dark:text-white">Event Organizer QR Verification</p>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400">Test authenticating this digital card at sangh gates</p>
                </div>
              </div>

              <button
                onClick={handleSimulateScan}
                disabled={isSimulatingScan}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 shadow-xs ${
                  scanVerified
                    ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300'
                    : 'bg-slate-900 dark:bg-slate-700 text-white hover:bg-slate-800'
                }`}
              >
                {isSimulatingScan ? (
                  <Sparkles className="w-3.5 h-3.5 animate-spin text-amber-400" />
                ) : scanVerified ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                ) : (
                  <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                )}
                <span>
                  {isSimulatingScan ? 'Scanning...' : scanVerified ? 'Card Authenticated' : 'Simulate Check-in'}
                </span>
              </button>
            </div>
          </div>

        </div>

        {/* Footer Bar */}
        <div className="p-4 bg-slate-50 dark:bg-slate-900/90 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs print:hidden">
          <span className="text-slate-500 dark:text-slate-400 font-medium">
            Jain Connect Global • Sangh ID Engine
          </span>
          <button
            onClick={handleClose}
            className="px-4 py-1.5 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-bold hover:bg-slate-300 transition-colors"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
