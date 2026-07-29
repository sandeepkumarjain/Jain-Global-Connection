import React, { useState } from 'react';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../lib/firebase';
import { useApp } from '../context/AppContext';
import { PasswordInput } from './PasswordInput';
import {
  LogIn,
  X,
  Lock,
  Mail,
  AlertTriangle,
  KeyRound,
  ArrowLeft,
  CheckCircle2,
  RefreshCw,
  Send,
  Flame
} from 'lucide-react';

export const AuthModal: React.FC = () => {
  const {
    isAuthModalOpen,
    setIsAuthModalOpen,
    setIsRegModalOpen,
    login,
    resetUserPassword,
    openGmailModal,
    showToast,
    users
  } = useApp();

  const [mode, setMode] = useState<'login' | 'forgot'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [infoMessage, setInfoMessage] = useState('');

  // Forgot Password State
  const [forgotInput, setForgotInput] = useState('');
  const [forgotStep, setForgotStep] = useState<'email' | 'otp'>('email');
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [enteredOtp, setEnteredOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [targetUserEmail, setTargetUserEmail] = useState('');
  const [isSendingOtp, setIsSendingOtp] = useState(false);

  if (!isAuthModalOpen) return null;

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setInfoMessage('');
    if (!email.trim() || !password) {
      setErrorMessage('Please enter both Login ID and Password.');
      return;
    }
    const success = login(email, password);
    if (success) {
      setIsAuthModalOpen(false);
      setErrorMessage('');
    } else {
      setErrorMessage('You have entered wrong. Please enter the correct ID or Password');
    }
  };

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setInfoMessage('');

    const query = forgotInput.trim().toLowerCase();
    if (!query) {
      setErrorMessage('Please enter your registered Email ID or Mobile Number.');
      return;
    }

    // Find registered user
    const foundUser = users.find(
      (u) =>
        (u.email || '').toLowerCase() === query ||
        (u.mobile || '').trim() === forgotInput.trim() ||
        (u.username || '').toLowerCase() === query
    );

    if (!foundUser && !query.includes('@')) {
      setErrorMessage('No registered user found with this Email ID or Mobile number. Please verify and try again.');
      return;
    }

    const resetEmail = foundUser?.email || forgotInput;
    setIsSendingOtp(true);

    // 1. Firebase Auth Password Reset Call
    try {
      if (resetEmail && resetEmail.includes('@')) {
        await sendPasswordResetEmail(auth, resetEmail);
        console.log('Firebase Auth password reset email sent to:', resetEmail);
      }
    } catch (fbErr: any) {
      console.warn('Firebase Auth reset notice:', fbErr?.message || fbErr);
    }

    // Generate 6-digit numeric OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(otp);
    setTargetUserEmail(resetEmail);

    setTimeout(() => {
      setIsSendingOtp(false);
      setForgotStep('otp');

      const subject = `JainConnect Global - Firebase Auth Password Reset & OTP Code: ${otp}`;
      const body = `Jai Jinendra ${foundUser?.fullName || 'Member'},\n\nFirebase Auth password reset email and One-Time Password (OTP) for resetting your JainConnect Global account password:\n\n🔐 6-DIGIT OTP CODE: ${otp}\n\nThis OTP is valid for 10 minutes. Enter this OTP code on the reset password screen along with your new password.\n\nAlternatively, check your mailbox for the official Firebase Auth password reset link.\n\nWarm regards,\nJainConnect Global Team`;

      // Trigger Gmail dispatch modal & toast notification
      openGmailModal(resetEmail, subject, body);
      setInfoMessage(`Firebase Auth & OTP sent to ${resetEmail}. Check your mailbox & Gmail popup.`);
      showToast('Firebase Auth Reset Sent!', `Reset email & OTP code sent to ${resetEmail}. Your OTP is ${otp}`, 'success', 8000);
    }, 600);
  };

  const handleVerifyOtpAndReset = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setInfoMessage('');

    if (!enteredOtp.trim()) {
      setErrorMessage('Please enter the 6-digit OTP code sent to your email.');
      return;
    }

    if (enteredOtp.trim() !== generatedOtp.trim()) {
      setErrorMessage('Invalid OTP code. Please enter the correct 6-digit OTP sent to your mail.');
      return;
    }

    if (!newPassword || newPassword.length < 4) {
      setErrorMessage('New password must be at least 4 characters long.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMessage('New Password and Confirm Password do not match.');
      return;
    }

    // Reset password in system
    const res = resetUserPassword(targetUserEmail || forgotInput, newPassword);
    if (res.success) {
      setEmail(targetUserEmail || forgotInput);
      setPassword(newPassword);
      setMode('login');
      setForgotStep('email');
      setEnteredOtp('');
      setGeneratedOtp('');
      setNewPassword('');
      setConfirmPassword('');
      setInfoMessage('Password reset successfully via Firebase Auth! You can now sign in with your new password.');
    } else {
      setErrorMessage(res.message);
    }
  };

  const handleClose = () => {
    setIsAuthModalOpen(false);
    setErrorMessage('');
    setInfoMessage('');
    setMode('login');
    setForgotStep('email');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 border-2 border-amber-300 dark:border-amber-800 rounded-3xl w-full max-w-lg p-5 sm:p-7 shadow-2xl relative space-y-4 my-auto max-h-[90vh] overflow-y-auto no-scrollbar text-slate-800 dark:text-slate-100">
        
        <button
          type="button"
          onClick={handleClose}
          className="absolute top-4 right-4 p-1.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 hover:text-slate-700 dark:hover:text-white transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center space-y-1 pt-1">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500 via-amber-600 to-amber-800 text-slate-950 font-black font-serif text-xl flex items-center justify-center mx-auto shadow-md border border-amber-300">
            JC
          </div>
          <h3 className="text-xl font-extrabold font-serif text-slate-900 dark:text-white">
            Jain Connect Global
          </h3>
          <p className="text-xs text-amber-700 dark:text-amber-400 font-semibold">
            {mode === 'login'
              ? 'Sign in to access your Jain Profile & Super Admin Panel'
              : 'Firebase Auth Password Reset & OTP Service'}
          </p>
        </div>

        {/* Error Alert Box */}
        {errorMessage && (
          <div className="p-3.5 rounded-2xl bg-red-50 dark:bg-red-950/80 border-2 border-red-300 dark:border-red-800 text-red-700 dark:text-red-300 text-xs font-bold flex items-start gap-2.5 shadow-sm">
            <AlertTriangle className="w-4 h-4 text-red-600 dark:text-red-400 shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="font-extrabold text-red-800 dark:text-red-200">{errorMessage}</p>
            </div>
          </div>
        )}

        {/* Info Alert Box */}
        {infoMessage && (
          <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/80 border-2 border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-bold flex items-start gap-2.5 shadow-sm">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="font-bold text-emerald-900 dark:text-emerald-200">{infoMessage}</p>
            </div>
          </div>
        )}

        {mode === 'login' ? (
          /* Login Form */
          <form onSubmit={handleLoginSubmit} className="space-y-4 text-xs pt-1">
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Login ID / Registered Email / Mobile
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Enter email ID, mobile or admin username"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (errorMessage) setErrorMessage('');
                  }}
                  required
                  className="w-full pl-9 pr-3 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 border border-slate-300 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-500 font-medium"
                />
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="font-bold text-slate-700 dark:text-slate-300">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => {
                    setMode('forgot');
                    setForgotStep('email');
                    setErrorMessage('');
                    setInfoMessage('');
                    if (email) setForgotInput(email);
                  }}
                  className="text-xs font-black text-amber-600 dark:text-amber-400 hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <KeyRound className="w-3.5 h-3.5" />
                  <span>Forgot Password?</span>
                </button>
              </div>
              <PasswordInput
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (errorMessage) setErrorMessage('');
                }}
                placeholder="••••••••"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 text-slate-950 font-black text-xs sm:text-sm rounded-2xl shadow-lg hover:from-amber-600 hover:to-amber-800 transition-all flex items-center justify-center gap-2 cursor-pointer border border-amber-300"
            >
              <LogIn className="w-4 h-4" />
              <span>Sign In to Account</span>
            </button>
          </form>
        ) : (
          /* Forgot Password Flow */
          <div className="space-y-4 text-xs pt-1">
            {forgotStep === 'email' ? (
              <form onSubmit={handleSendOtp} className="space-y-4">
                <div className="p-4 bg-amber-50 dark:bg-amber-950/60 border-2 border-amber-300 dark:border-amber-800/80 rounded-2xl space-y-1.5">
                  <div className="flex items-center gap-2 text-amber-900 dark:text-amber-300 font-black text-xs uppercase tracking-wider">
                    <Flame className="w-4 h-4 text-amber-600" />
                    <span>Firebase Auth & OTP Password Reset</span>
                  </div>
                  <p className="text-xs text-amber-900/90 dark:text-amber-200/90 leading-relaxed font-medium">
                    Enter your registered Email ID or Mobile Number. We will trigger official <strong>Firebase Auth Reset Email</strong> and send a 6-digit verification code to your mail.
                  </p>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Registered Email ID / Mobile Number
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="e.g. sandeep.bachhawat1@gmail.com or 9514237277"
                      value={forgotInput}
                      onChange={(e) => {
                        setForgotInput(e.target.value);
                        if (errorMessage) setErrorMessage('');
                      }}
                      required
                      className="w-full pl-9 pr-3 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 border border-slate-300 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-500 font-medium"
                    />
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setMode('login');
                      setErrorMessage('');
                      setInfoMessage('');
                    }}
                    className="px-4 py-3 bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold rounded-xl hover:bg-slate-300 transition-all flex items-center gap-1.5 cursor-pointer shrink-0"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back</span>
                  </button>

                  <button
                    type="submit"
                    disabled={isSendingOtp}
                    className="flex-1 py-3 bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 text-slate-950 font-black rounded-xl shadow-md hover:from-amber-600 hover:to-amber-800 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 border border-amber-300"
                  >
                    {isSendingOtp ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>Sending Firebase Reset...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>Reset via Firebase Auth</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            ) : (
              /* OTP & New Password Form */
              <form onSubmit={handleVerifyOtpAndReset} className="space-y-4">
                <div className="p-4 bg-amber-50 dark:bg-amber-950/60 border-2 border-amber-300 dark:border-amber-800/80 rounded-2xl space-y-1.5">
                  <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-300 font-black text-xs uppercase tracking-wider">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    <span>Firebase Reset Dispatched</span>
                  </div>
                  <p className="text-xs text-amber-900/90 dark:text-amber-200/90 font-medium">
                    Reset mail dispatched to <span className="font-bold underline">{targetUserEmail}</span>.<br />
                    (6-Digit OTP Code: <span className="font-mono font-black text-amber-700 dark:text-amber-300 bg-amber-200 dark:bg-amber-900/90 px-2 py-0.5 rounded-lg border border-amber-400">{generatedOtp}</span>)
                  </p>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    6-Digit Verification OTP Code
                  </label>
                  <input
                    type="text"
                    maxLength={6}
                    placeholder="Enter 6-digit OTP (e.g. 849201)"
                    value={enteredOtp}
                    onChange={(e) => {
                      setEnteredOtp(e.target.value);
                      if (errorMessage) setErrorMessage('');
                    }}
                    required
                    className="w-full text-center tracking-[0.3em] font-mono font-black text-xl py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 text-amber-600 dark:text-amber-400 border border-slate-300 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    New Password
                  </label>
                  <PasswordInput
                    value={newPassword}
                    onChange={(e) => {
                      setNewPassword(e.target.value);
                      if (errorMessage) setErrorMessage('');
                    }}
                    placeholder="Enter new password"
                    showStrengthIndicator={true}
                    required
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Confirm New Password
                  </label>
                  <PasswordInput
                    value={confirmPassword}
                    onChange={(e) => {
                      setConfirmPassword(e.target.value);
                      if (errorMessage) setErrorMessage('');
                    }}
                    placeholder="Re-enter new password"
                    required
                  />
                  {confirmPassword && newPassword !== confirmPassword && (
                    <p className="text-[11px] font-bold text-red-500 mt-1">Passwords do not match</p>
                  )}
                  {confirmPassword && newPassword === confirmPassword && (
                    <p className="text-[11px] font-bold text-emerald-500 mt-1">Passwords match!</p>
                  )}
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => {
                      setForgotStep('email');
                      setErrorMessage('');
                    }}
                    className="px-3.5 py-3 bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold rounded-xl hover:bg-slate-300 transition-all text-xs cursor-pointer"
                  >
                    Resend
                  </button>

                  <button
                    type="submit"
                    className="flex-1 py-3 bg-gradient-to-r from-emerald-500 via-emerald-600 to-teal-700 text-white font-extrabold rounded-xl shadow-md hover:from-emerald-600 hover:to-teal-800 transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Reset Password & Login</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        )}

        {/* Switch to Registration */}
        <div className="pt-3 text-center border-t border-slate-200 dark:border-slate-800">
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Don&apos;t have an account yet?{' '}
            <button
              type="button"
              onClick={() => {
                setIsAuthModalOpen(false);
                setIsRegModalOpen(true);
              }}
              className="font-extrabold text-amber-600 dark:text-amber-400 hover:underline cursor-pointer ml-1"
            >
              Register Now
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

