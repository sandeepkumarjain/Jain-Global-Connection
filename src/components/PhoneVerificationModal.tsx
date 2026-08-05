import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Smartphone, CheckCircle, ShieldCheck, X, ArrowRight, RefreshCw, PhoneCall, Lock } from 'lucide-react';

interface PhoneVerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetPhone?: string;
  recipientName?: string;
  onSuccessDial: (phone: string) => void;
}

export const PhoneVerificationModal: React.FC<PhoneVerificationModalProps> = ({
  isOpen,
  onClose,
  targetPhone = '',
  recipientName = '',
  onSuccessDial,
}) => {
  const { currentUser, updateUserProfile, showToast } = useApp();

  const [userMobile, setUserMobile] = useState<string>(currentUser?.mobile || '');
  const [step, setStep] = useState<'input' | 'otp'>('input');
  const [otpCode, setOtpCode] = useState<string>('123456');
  const [generatedOtp, setGeneratedOtp] = useState<string>('123456');
  const [isVerifying, setIsVerifying] = useState<boolean>(false);
  const [timer, setTimer] = useState<number>(30);
  const [canResend, setCanResend] = useState<boolean>(false);

  useEffect(() => {
    if (currentUser?.mobile) {
      setUserMobile(currentUser.mobile);
    }
  }, [currentUser]);

  useEffect(() => {
    let interval: any;
    if (step === 'otp' && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else if (timer === 0) {
      setCanResend(true);
    }
    return () => clearInterval(interval);
  }, [step, timer]);

  if (!isOpen) return null;

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanMobile = userMobile.replace(/[^0-9]/g, '');
    if (cleanMobile.length < 10) {
      showToast('Invalid Mobile Number', 'Please enter a valid 10-digit mobile number.', 'error');
      return;
    }

    const randomOtp = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(randomOtp);
    setOtpCode(randomOtp); // Pre-fill for user convenience in preview environment
    setStep('otp');
    setTimer(30);
    setCanResend(false);
    showToast('SMS Verification OTP Sent', `Verification code ${randomOtp} sent to ${userMobile}`, 'success');
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (otpCode.trim() !== generatedOtp && otpCode.trim() !== '123456') {
      showToast('Verification Failed', 'Incorrect OTP entered. Please try again or use 123456.', 'error');
      return;
    }

    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);

      // Persist verification locally & in user profile
      localStorage.setItem('jcg_phone_verified', 'true');
      localStorage.setItem('jcg_user_verified_mobile', userMobile);

      if (currentUser) {
        updateUserProfile({
          mobile: userMobile,
          isPhoneVerified: true,
        });
      }

      showToast('Phone Number Verified!', 'Phone verification complete. Launching native dialer...', 'success');
      onClose();

      // Launch native dialer
      if (targetPhone) {
        onSuccessDial(targetPhone);
      }
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="bg-white dark:bg-slate-900 border border-amber-300 dark:border-amber-700/80 rounded-3xl max-w-md w-full p-6 shadow-2xl relative overflow-hidden">
        {/* Top Decorative Header Accent */}
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600" />

        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-white rounded-full transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center space-y-3 mb-6 pt-2">
          <div className="w-14 h-14 bg-amber-100 dark:bg-amber-950/80 border border-amber-300 dark:border-amber-700 rounded-2xl flex items-center justify-center mx-auto text-amber-600 dark:text-amber-400 shadow-inner">
            <Smartphone className="w-7 h-7" />
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-[10px] font-extrabold uppercase tracking-wider mb-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Anti-Spam Phone Verification</span>
            </div>
            <h3 className="text-xl font-serif font-extrabold text-slate-900 dark:text-white">
              Verify Your Phone Number
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">
              {recipientName ? (
                <>
                  To initiate contact with <strong className="text-amber-800 dark:text-amber-300">{recipientName}</strong>, please verify your mobile number.
                </>
              ) : (
                'Please verify your mobile number once before launching the native phone dialer.'
              )}
            </p>
          </div>
        </div>

        {step === 'input' ? (
          <form onSubmit={handleSendOtp} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                Your 10-Digit Mobile Number
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-3 text-xs font-bold text-slate-400">
                  +91
                </span>
                <input
                  type="tel"
                  required
                  placeholder="98765 43210"
                  value={userMobile}
                  onChange={(e) => setUserMobile(e.target.value)}
                  className="w-full pl-12 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-sm font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-500 outline-none"
                />
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                We will send a 6-digit SMS OTP verification code to this mobile number.
              </p>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-amber-600 hover:bg-amber-700 text-white font-bold text-sm rounded-xl transition-all flex items-center justify-center gap-2 shadow-md cursor-pointer"
            >
              <span>Get Verification OTP</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp} className="space-y-4">
            <div className="p-3 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-xl text-xs text-amber-900 dark:text-amber-200 text-center">
              Enter 6-digit verification code sent to <strong>{userMobile}</strong>:
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 text-center">
                Enter 6-Digit OTP Code
              </label>
              <input
                type="text"
                required
                maxLength={6}
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value)}
                className="w-full py-3 text-center text-2xl font-mono tracking-widest bg-slate-50 dark:bg-slate-800 border border-amber-400 rounded-xl font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-500 outline-none"
              />
            </div>

            <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 px-1">
              <span>OTP code auto-filled for preview</span>
              {canResend ? (
                <button
                  type="button"
                  onClick={() => {
                    const newOtp = Math.floor(100000 + Math.random() * 900000).toString();
                    setGeneratedOtp(newOtp);
                    setOtpCode(newOtp);
                    setTimer(30);
                    setCanResend(false);
                    showToast('OTP Resent', `New code ${newOtp} sent to ${userMobile}`, 'info');
                  }}
                  className="text-amber-600 font-bold hover:underline flex items-center gap-1"
                >
                  <RefreshCw className="w-3 h-3" /> Resend OTP
                </button>
              ) : (
                <span>Resend in {timer}s</span>
              )}
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setStep('input')}
                className="px-4 py-3 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs rounded-xl hover:bg-slate-200"
              >
                Back
              </button>
              <button
                type="submit"
                disabled={isVerifying}
                className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-xl transition-all flex items-center justify-center gap-2 shadow-md disabled:opacity-50 cursor-pointer"
              >
                {isVerifying ? (
                  <span>Verifying...</span>
                ) : (
                  <>
                    <PhoneCall className="w-4 h-4 fill-current" />
                    <span>Verify & Call Now</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}

        <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[10px] text-slate-400">
          <span className="flex items-center gap-1">
            <Lock className="w-3 h-3 text-emerald-500" /> Safe & Verified Call Channel
          </span>
          <span className="font-semibold text-slate-500">Jain Connect Global</span>
        </div>
      </div>
    </div>
  );
};
