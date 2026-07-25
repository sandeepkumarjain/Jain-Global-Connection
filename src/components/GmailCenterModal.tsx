import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { initGoogleAuth, googleSignIn, getAccessToken, logoutGoogle } from '../lib/googleAuth';
import { fetchGmailProfile, listRecentEmails, sendGmailMessage, GmailProfile, GmailMessageSummary } from '../lib/gmail';
import { User } from 'firebase/auth';
import { Mail, Send, LogOut, RefreshCw, X, CheckCircle2, AlertTriangle, ShieldCheck, Inbox, UserCheck } from 'lucide-react';

interface GmailCenterModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultRecipient?: string;
  defaultSubject?: string;
  defaultBody?: string;
}

export const GmailCenterModal: React.FC<GmailCenterModalProps> = ({
  isOpen,
  onClose,
  defaultRecipient = '',
  defaultSubject = 'Greetings from Jain Connect Global Community',
  defaultBody = '',
}) => {
  const { showToast } = useApp();
  const [googleUser, setGoogleUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(false);
  const [gmailProfile, setGmailProfile] = useState<GmailProfile | null>(null);
  const [recentEmails, setRecentEmails] = useState<GmailMessageSummary[]>([]);
  const [isLoadingEmails, setIsLoadingEmails] = useState(false);

  // Email Compose State
  const [recipient, setRecipient] = useState(defaultRecipient);
  const [subject, setSubject] = useState(defaultSubject);
  const [bodyContent, setBodyContent] = useState(defaultBody);
  const [isSending, setIsSending] = useState(false);

  // Mandatory User Confirmation Dialog State for Sending Email
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  useEffect(() => {
    if (defaultRecipient) setRecipient(defaultRecipient);
    if (defaultSubject) setSubject(defaultSubject);
    if (defaultBody) setBodyContent(defaultBody);
  }, [defaultRecipient, defaultSubject, defaultBody]);

  useEffect(() => {
    const unsubscribe = initGoogleAuth(
      (user, token) => {
        setGoogleUser(user);
        setAccessToken(token);
        loadGmailData(token);
      },
      () => {
        setGoogleUser(null);
        setAccessToken(null);
        setGmailProfile(null);
        setRecentEmails([]);
      }
    );
    return () => unsubscribe();
  }, []);

  const loadGmailData = async (token: string) => {
    setIsLoadingEmails(true);
    try {
      const profile = await fetchGmailProfile(token);
      setGmailProfile(profile);

      const msgs = await listRecentEmails(token, 5);
      setRecentEmails(msgs);
    } catch (err: any) {
      console.error('Error loading Gmail data:', err);
    } finally {
      setIsLoadingEmails(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsAuthLoading(true);
    try {
      const res = await googleSignIn();
      if (res) {
        setGoogleUser(res.user);
        setAccessToken(res.accessToken);
        showToast('Connected to Gmail', `Authenticated as ${res.user.email}`, 'success');
        await loadGmailData(res.accessToken);
      }
    } catch (err: any) {
      console.error('Sign-in error:', err);
      showToast('Authentication Failed', err.message || 'Could not sign in with Google.', 'error');
    } finally {
      setIsAuthLoading(false);
    }
  };

  const handleLogout = async () => {
    await logoutGoogle();
    setGoogleUser(null);
    setAccessToken(null);
    setGmailProfile(null);
    setRecentEmails([]);
    showToast('Signed Out of Gmail', 'Your Google session has been cleared.', 'info');
  };

  const handleInitiateSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!recipient.trim() || !subject.trim() || !bodyContent.trim()) {
      showToast('Incomplete Form', 'Please fill in recipient, subject, and message.', 'error');
      return;
    }
    // Show mandatory confirmation prompt before sending
    setShowConfirmModal(true);
  };

  const handleConfirmSendEmail = async () => {
    setShowConfirmModal(false);
    const token = accessToken || getAccessToken();
    if (!token) {
      showToast('Authentication Required', 'Please sign in with Google to send emails.', 'error');
      return;
    }

    setIsSending(true);
    try {
      const htmlBody = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; rounded: 12px; background-color: #f8fafc;">
          <div style="background-color: #d97706; padding: 12px 20px; border-radius: 8px; color: #ffffff; font-weight: bold; font-size: 16px;">
            Jain Connect Global - Community Communication
          </div>
          <div style="padding: 20px 0; color: #1e293b; font-size: 14px; line-height: 1.6;">
            ${bodyContent.replace(/\n/g, '<br/>')}
          </div>
          <hr style="border: none; border-top: 1px solid #cbd5e1; margin: 20px 0;" />
          <p style="font-size: 11px; color: #64748b; text-align: center;">
            Sent securely via Jain Connect Global app using official Gmail API integration.
          </p>
        </div>
      `;

      await sendGmailMessage(token, recipient, subject, htmlBody);
      showToast('Email Sent via Gmail!', `Message sent successfully to ${recipient}.`, 'success');

      setSubject(defaultSubject);
      setBodyContent('');
      // Refresh inbox list
      loadGmailData(token);
    } catch (err: any) {
      console.error('Send error:', err);
      showToast('Email Failed', err.message || 'Could not send email via Gmail.', 'error');
    } finally {
      setIsSending(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 border border-amber-500/30 dark:border-amber-700/50 rounded-2xl w-full max-w-2xl p-6 shadow-2xl relative text-slate-800 dark:text-slate-100 my-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4 mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-gradient-to-br from-amber-500 to-amber-700 text-slate-950 shadow-md">
              <Mail className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold font-serif text-slate-900 dark:text-white flex items-center gap-2">
                Gmail Integration Center
                <span className="text-[10px] bg-amber-500/20 text-amber-700 dark:text-amber-300 px-2 py-0.5 rounded-full font-sans font-bold border border-amber-500/30">
                  OFFICIAL API
                </span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Send official community emails & view messages directly via your Gmail account.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 dark:hover:text-white rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Not Signed In View */}
        {!googleUser ? (
          <div className="py-8 text-center space-y-6">
            <div className="max-w-md mx-auto space-y-3">
              <div className="w-16 h-16 bg-amber-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto text-amber-600">
                <ShieldCheck className="w-8 h-8" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Connect your Google Account
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Authorize Gmail access with permission to communicate with registered Jain community members, vendors, and matrimonial contacts safely.
              </p>
            </div>

            {/* Material Styled Google Sign-In Button */}
            <div className="flex justify-center pt-2">
              <button
                onClick={handleGoogleSignIn}
                disabled={isAuthLoading}
                className="group relative flex items-center justify-center gap-3 px-6 py-3 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl shadow-md hover:shadow-lg transition-all text-slate-800 dark:text-slate-100 font-bold text-sm min-h-[48px] hover:bg-slate-50 dark:hover:bg-slate-750"
              >
                <svg className="w-5 h-5" viewBox="0 0 48 48">
                  <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
                  <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
                  <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
                  <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
                </svg>
                <span>{isAuthLoading ? 'Connecting...' : 'Sign in with Google'}</span>
              </button>
            </div>
          </div>
        ) : (
          /* Signed In View */
          <div className="space-y-5">
            {/* Connected User Badge */}
            <div className="bg-slate-50 dark:bg-slate-800/80 p-3 rounded-xl border border-slate-200 dark:border-slate-700/60 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-amber-500 text-amber-950 font-bold flex items-center justify-center text-sm">
                  {googleUser.email?.[0]?.toUpperCase() || 'G'}
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1">
                    {googleUser.displayName || 'Google Account'}
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 fill-emerald-500/20" />
                  </p>
                  <p className="text-[11px] text-slate-500 font-mono">{gmailProfile?.emailAddress || googleUser.email}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => loadGmailData(accessToken || '')}
                  disabled={isLoadingEmails}
                  className="p-2 text-slate-400 hover:text-amber-600 dark:hover:text-amber-400 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                  title="Refresh Gmail"
                >
                  <RefreshCw className={`w-4 h-4 ${isLoadingEmails ? 'animate-spin' : ''}`} />
                </button>
                <button
                  onClick={handleLogout}
                  className="p-2 text-slate-400 hover:text-red-500 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                  title="Sign Out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Email Composer Form */}
            <form onSubmit={handleInitiateSend} className="space-y-3 bg-slate-50/50 dark:bg-slate-800/40 p-4 rounded-xl border border-slate-200 dark:border-slate-800">
              <h3 className="text-xs font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5 uppercase tracking-wider">
                <Send className="w-3.5 h-3.5 text-amber-600" />
                Compose Email via Gmail
              </h3>

              <div>
                <label className="block text-[11px] font-semibold text-slate-500 mb-1">To Email Address</label>
                <input
                  type="email"
                  required
                  value={recipient}
                  onChange={(e) => setRecipient(e.target.value)}
                  placeholder="recipient@example.com"
                  className="w-full px-3 py-2 text-xs bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-500 mb-1">Subject</label>
                <input
                  type="text"
                  required
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="Subject title..."
                  className="w-full px-3 py-2 text-xs bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-500 mb-1">Message Content</label>
                <textarea
                  required
                  rows={4}
                  value={bodyContent}
                  onChange={(e) => setBodyContent(e.target.value)}
                  placeholder="Write your email body here..."
                  className="w-full px-3 py-2 text-xs bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={isSending}
                className="w-full py-2.5 bg-gradient-to-r from-amber-500 to-amber-700 text-amber-950 font-bold text-xs rounded-xl shadow-md hover:from-amber-600 hover:to-amber-800 transition-all flex items-center justify-center gap-2 min-h-[44px]"
              >
                <Send className="w-4 h-4" />
                <span>{isSending ? 'Preparing...' : 'Send Message via Gmail'}</span>
              </button>
            </form>

            {/* Recent Gmail Inbox Snippets */}
            {recentEmails.length > 0 && (
              <div className="space-y-2 pt-2">
                <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <Inbox className="w-3.5 h-3.5 text-amber-500" />
                  Recent Inbox Activity ({gmailProfile?.messagesTotal || recentEmails.length} messages)
                </h4>

                <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
                  {recentEmails.map((msg) => (
                    <div
                      key={msg.id}
                      className="p-2.5 bg-slate-50 dark:bg-slate-800/60 rounded-lg border border-slate-200 dark:border-slate-700/50 text-xs space-y-0.5"
                    >
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-slate-900 dark:text-white truncate max-w-[220px]">{msg.from}</span>
                        <span className="text-[10px] text-slate-400">{msg.date?.split(' ')[0] || ''}</span>
                      </div>
                      <p className="font-semibold text-amber-600 dark:text-amber-400 truncate">{msg.subject}</p>
                      <p className="text-[11px] text-slate-500 line-clamp-1">{msg.snippet}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Mandatory User Confirmation Dialog */}
        {showConfirmModal && (
          <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
            <div className="bg-white dark:bg-slate-900 border border-amber-500 rounded-2xl w-full max-w-md p-6 shadow-2xl space-y-4">
              <div className="flex items-center gap-3 text-amber-600">
                <div className="p-2 bg-amber-500/10 rounded-xl">
                  <AlertTriangle className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Confirm Gmail Delivery
                </h3>
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                You are about to send an email through your connected Google Account:
              </p>

              <div className="bg-slate-50 dark:bg-slate-800 p-3 rounded-xl border border-slate-200 dark:border-slate-700 text-xs space-y-1 font-mono">
                <p><span className="text-slate-400 font-sans font-semibold">To:</span> {recipient}</p>
                <p><span className="text-slate-400 font-sans font-semibold">Subject:</span> {subject}</p>
                <p className="truncate"><span className="text-slate-400 font-sans font-semibold">Message:</span> {bodyContent}</p>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <button
                  onClick={() => setShowConfirmModal(false)}
                  className="py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-800 dark:text-slate-200 font-bold text-xs rounded-xl"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmSendEmail}
                  className="py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-xl shadow-md"
                >
                  Confirm & Send Email
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
