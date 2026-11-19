import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  AlertTriangle,
  Building2,
  CheckCircle2,
  Compass,
  KeyRound,
  Link2,
  Mail,
  RefreshCw,
} from 'lucide-react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { useApp } from '../context/AppContext';
import { JainSanghaMandal, MandalAdmin } from '../types';
import { PasswordInput } from './PasswordInput';

interface MandalAdminLoginFormProps {
  onSuccess?: (admin: MandalAdmin, linkedMandal: JainSanghaMandal | null) => void;
  onForgotPassword?: (prefillEmail: string) => void;
  initialEmail?: string;
  className?: string;
}

export const MandalAdminLoginForm: React.FC<MandalAdminLoginFormProps> = ({
  onSuccess,
  onForgotPassword,
  initialEmail = '',
  className = '',
}) => {
  const {
    users,
    sanghas,
    authenticateMandalAdminRecord,
    showToast,
    addNotification,
  } = useApp();

  const [email, setEmail] = useState(initialEmail);
  const [password, setPassword] = useState('');
  const [selectedMandalId, setSelectedMandalId] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [authSuccessState, setAuthSuccessState] = useState<{
    admin: MandalAdmin;
    linkedMandal: JainSanghaMandal | null;
  } | null>(null);

  const successTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (successTimerRef.current) {
        clearTimeout(successTimerRef.current);
      }
    };
  }, []);

  // Preview Mandal profiles associated with entered registered email
  const matchingMandalsForEmail = useMemo(() => {
    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail || !cleanEmail.includes('@')) return [];

    const matchedOwnerIds = new Set(
      users
        .filter((u) => (u.email || '').trim().toLowerCase() === cleanEmail)
        .map((u) => u.id)
    );
    const managedIds = new Set(
      users
        .filter((u) => (u.email || '').trim().toLowerCase() === cleanEmail && u.managedMandalId)
        .map((u) => u.managedMandalId as string)
    );

    return sanghas.filter((s) => {
      const sAdmin = (s.adminEmail || '').trim().toLowerCase();
      const sEmail = (s.email || '').trim().toLowerCase();
      return (
        sAdmin === cleanEmail ||
        sEmail === cleanEmail ||
        managedIds.has(s.id) ||
        (s.ownerUserId && matchedOwnerIds.has(s.ownerUserId))
      );
    });
  }, [email, sanghas, users]);

  const fetchMatchingMandalAdmins = async (normalizedEmail: string): Promise<MandalAdmin[]> => {
    const adminsPath = 'mandal_admins';
    const matches: MandalAdmin[] = [];

    try {
      const exactQuery = query(
        collection(db, adminsPath),
        where('email', '==', normalizedEmail)
      );
      const exactSnap = await getDocs(exactQuery);
      exactSnap.forEach((docSnap) => {
        matches.push({ id: docSnap.id, ...(docSnap.data() as Omit<MandalAdmin, 'id'>) });
      });

      if (matches.length === 0) {
        const allSnap = await getDocs(collection(db, adminsPath));
        allSnap.forEach((docSnap) => {
          const data = docSnap.data() as Omit<MandalAdmin, 'id'>;
          const docEmail = (data.email || '').trim().toLowerCase();
          if (docEmail === normalizedEmail) {
            matches.push({ id: docSnap.id, ...data });
          }
        });
      }
    } catch (err) {
      try {
        handleFirestoreError(err, OperationType.LIST, adminsPath);
      } catch (structuredErr) {
        console.warn('Firestore mandal_admins lookup error:', structuredErr);
        throw new Error('Unable to reach the mandal_admins database collection. Please try again.');
      }
    }

    return matches;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setAuthSuccessState(null);

    const normalizedEmail = email.trim().toLowerCase();
    if (!normalizedEmail || !normalizedEmail.includes('@')) {
      setErrorMessage('Please enter a valid registered Mandal Admin email address.');
      return;
    }
    if (!password) {
      setErrorMessage('Please enter your Mandal Admin password.');
      return;
    }

    setIsSubmitting(true);
    try {
      const adminRecords = await fetchMatchingMandalAdmins(normalizedEmail);

      if (adminRecords.length === 0) {
        setErrorMessage(
          'No Mandal Admin account found for this email in the mandal_admins directory. Please verify your email or register your Local Mandal.'
        );
        return;
      }

      const preferredId =
        selectedMandalId && matchingMandalsForEmail.some((m) => m.id === selectedMandalId)
          ? selectedMandalId
          : matchingMandalsForEmail[0]?.id;

      const candidateRecord =
        (preferredId ? adminRecords.find((r) => r.mandalId === preferredId) : null) ||
        adminRecords.find((r) => r.password === password) ||
        adminRecords[0];

      if (candidateRecord.status === 'Suspended' || candidateRecord.status === 'Rejected') {
        setErrorMessage(
          `Your Mandal Admin account is currently ${candidateRecord.status.toLowerCase()}. Please contact support for assistance.`
        );
        return;
      }

      if (candidateRecord.password !== password) {
        setErrorMessage('Incorrect Mandal Admin password. Please verify your password and try again.');
        return;
      }

      const { linkedMandal } = await authenticateMandalAdminRecord(candidateRecord);

      const mandalDisplayName = linkedMandal?.name || candidateRecord.mandalName || 'Local Jain Mandal';
      const successTitle = 'Mandal Admin Authenticated';
      const successMessage = `Welcome back, ${candidateRecord.fullName}! Your session is verified and linked to ${mandalDisplayName}.`;

      showToast(successTitle, successMessage, 'success', 6000);
      addNotification({
        title: successTitle,
        message: successMessage,
        type: 'Approval',
      });

      setAuthSuccessState({
        admin: candidateRecord,
        linkedMandal,
      });

      if (onSuccess) {
        if (successTimerRef.current) {
          clearTimeout(successTimerRef.current);
        }
        successTimerRef.current = setTimeout(() => {
          onSuccess(candidateRecord, linkedMandal);
        }, 900);
      }
    } catch (err) {
      setErrorMessage(
        err instanceof Error
          ? err.message
          : 'Authentication failed while validating credentials against mandal_admins.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={`space-y-4 text-xs pt-1 ${className}`}>
      <div className="p-3.5 rounded-2xl bg-gradient-to-br from-amber-50 via-amber-50/70 to-emerald-50/60 dark:from-amber-950/50 dark:via-slate-900 dark:to-emerald-950/40 border border-amber-300/80 dark:border-amber-800/80 space-y-1.5">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 text-amber-900 dark:text-amber-300 font-black uppercase tracking-wider text-[11px]">
            <Building2 className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
            <span>Mandal Admin Lead Access</span>
          </div>
          <span className="px-2 py-0.5 rounded-md bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-400/40 text-[10px] font-extrabold">
            Mandal Directory
          </span>
        </div>
        <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed">
          Mandal Leads &amp; Office Bearers: sign in with your <strong>registered email</strong> and{' '}
          <strong>dedicated Mandal Admin password</strong> to authenticate and manage your Mandal profile.
        </p>
      </div>

      {/* Inline Error Notification */}
      {errorMessage && (
        <div
          role="alert"
          className="p-3.5 rounded-2xl bg-red-50 dark:bg-red-950/80 border-2 border-red-300 dark:border-red-800 text-red-700 dark:text-red-300 text-xs font-bold flex items-start gap-2.5 shadow-sm"
        >
          <AlertTriangle className="w-4 h-4 text-red-600 dark:text-red-400 shrink-0 mt-0.5" />
          <p className="font-extrabold text-red-800 dark:text-red-200">{errorMessage}</p>
        </div>
      )}

      {/* Inline Success Notification */}
      {authSuccessState && (
        <div
          role="status"
          className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/80 border-2 border-emerald-400 dark:border-emerald-700 text-emerald-900 dark:text-emerald-200 text-xs flex items-start gap-2.5 shadow-sm"
        >
          <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
          <div className="flex-1 space-y-1">
            <p className="font-black text-emerald-900 dark:text-emerald-100">
              Authentication Successful!
            </p>
            <p className="text-[11px] font-medium text-emerald-800 dark:text-emerald-300">
              Signed in as <strong>{authSuccessState.admin.fullName}</strong> • Linked to{' '}
              <strong>
                {authSuccessState.linkedMandal?.name || authSuccessState.admin.mandalName}
              </strong>
              .
            </p>
          </div>
        </div>
      )}

      <div>
        <label
          htmlFor="mandal-admin-email"
          className="block font-bold text-slate-700 dark:text-slate-300 mb-1"
        >
          Registered Mandal Admin Email *
        </label>
        <div className="relative">
          <input
            id="mandal-admin-email"
            type="email"
            autoComplete="email"
            placeholder="e.g. president@jainsanghmandal.org"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setSelectedMandalId('');
              if (errorMessage) setErrorMessage('');
            }}
            required
            className="w-full pl-9 pr-3 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 border border-slate-300 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-500 font-medium"
          />
          <Mail className="w-4 h-4 text-amber-500 absolute left-3 top-3.5" />
        </div>
      </div>

      {/* Dynamic Mandal Profile Link Preview / Selector */}
      {matchingMandalsForEmail.length === 1 && (
        <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-300 dark:border-emerald-800 flex items-center gap-2 text-[11px] text-emerald-800 dark:text-emerald-200">
          <Link2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
          <div className="min-w-0">
            <span className="font-bold">Target Mandal Profile: </span>
            <span className="font-extrabold truncate">{matchingMandalsForEmail[0].name}</span>
            <span className="text-emerald-700 dark:text-emerald-300">
              {' '}
              ({matchingMandalsForEmail[0].city})
            </span>
          </div>
        </div>
      )}

      {matchingMandalsForEmail.length > 1 && (
        <div>
          <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
            Select Mandal Profile to Link ({matchingMandalsForEmail.length} Found)
          </label>
          <select
            value={selectedMandalId || matchingMandalsForEmail[0]?.id}
            onChange={(e) => setSelectedMandalId(e.target.value)}
            className="w-full px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 border border-amber-300 dark:border-amber-700 focus:outline-none focus:ring-2 focus:ring-amber-500 font-bold"
          >
            {matchingMandalsForEmail.map((m) => (
              <option key={m.id} value={m.id}>
                {m.name} — {m.city}, {m.state}
              </option>
            ))}
          </select>
        </div>
      )}

      <div>
        <div className="flex items-center justify-between mb-1">
          <label
            htmlFor="mandal-admin-password"
            className="font-bold text-slate-700 dark:text-slate-300"
          >
            Mandal Admin Password *
          </label>
          {onForgotPassword && (
            <button
              type="button"
              onClick={() => onForgotPassword(email.trim())}
              className="text-xs font-black text-amber-600 dark:text-amber-400 hover:underline flex items-center gap-1 cursor-pointer"
            >
              <KeyRound className="w-3.5 h-3.5" />
              <span>Forgot Password?</span>
            </button>
          )}
        </div>
        <PasswordInput
          id="mandal-admin-password"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            if (errorMessage) setErrorMessage('');
          }}
          placeholder="Enter dedicated Mandal Admin password"
          required
        />
      </div>

      <button
        type="submit"
        disabled={isSubmitting || Boolean(authSuccessState)}
        className="w-full py-3.5 bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 text-slate-950 font-black text-xs sm:text-sm rounded-2xl shadow-lg hover:from-amber-600 hover:to-amber-800 transition-all flex items-center justify-center gap-2 cursor-pointer border border-amber-300 disabled:opacity-60"
      >
        {isSubmitting ? (
          <>
            <RefreshCw className="w-4 h-4 animate-spin" />
            <span>Validating Mandal Admin...</span>
          </>
        ) : authSuccessState ? (
          <>
            <CheckCircle2 className="w-4 h-4" />
            <span>Authenticated • Opening Mandal Portal...</span>
          </>
        ) : (
          <>
            <Compass className="w-4 h-4" />
            <span>Sign In &amp; Link Mandal Profile</span>
          </>
        )}
      </button>
    </form>
  );
};
