import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  LogIn,
  X,
  Lock,
  Mail,
  ShieldCheck,
  Sparkles,
  KeyRound
} from 'lucide-react';

export const AuthModal: React.FC = () => {
  const { isAuthModalOpen, setIsAuthModalOpen, setIsRegModalOpen, login, showToast } = useApp();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  if (!isAuthModalOpen) return null;

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    const success = login(email, password);
    if (success) {
      setIsAuthModalOpen(false);
    }
  };

  const fillAdminCredentials = () => {
    setEmail('sandeepbachhawat1@gmail.com');
    setPassword('Sandy@9858');
    showToast('Admin Credentials Pre-filled', 'Click "Sign In as Admin" to enter Super Admin Panel.', 'info');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="bg-white dark:bg-slate-900 border border-amber-300 dark:border-amber-800 rounded-2xl w-full max-w-md p-6 shadow-2xl relative space-y-5 text-slate-800 dark:text-slate-100">
        
        <button
          onClick={() => setIsAuthModalOpen(false)}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center space-y-1">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-amber-700 text-amber-950 font-black font-serif text-xl flex items-center justify-center mx-auto shadow-md">
            JC
          </div>
          <h3 className="text-xl font-bold font-serif text-slate-900 dark:text-white">
            Jain Connect Global
          </h3>
          <p className="text-xs text-slate-500">Sign in to access your Jain Profile & Admin Panel</p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleLoginSubmit} className="space-y-3 text-xs">
          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
              Email Address / Username
            </label>
            <div className="relative">
              <input
                type="email"
                placeholder="Enter your registered email ID"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 border border-slate-300 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
              Password
            </label>
            <div className="relative">
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 border border-slate-300 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 text-amber-950 font-extrabold text-xs rounded-xl shadow-lg hover:from-amber-600 hover:to-amber-800 transition-all flex items-center justify-center gap-1.5"
          >
            <LogIn className="w-4 h-4" />
            <span>Sign In to Account</span>
          </button>
        </form>

        {/* Switch to Registration */}
        <div className="pt-2 text-center border-t border-slate-200 dark:border-slate-800">
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Don&apos;t have an account yet?{' '}
            <button
              type="button"
              onClick={() => {
                setIsAuthModalOpen(false);
                setIsRegModalOpen(true);
              }}
              className="font-bold text-amber-600 dark:text-amber-400 hover:underline"
            >
              Register Now
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};
