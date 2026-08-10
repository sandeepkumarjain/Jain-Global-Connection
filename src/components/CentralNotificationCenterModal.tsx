import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useApp } from '../context/AppContext';
import {
  Bell,
  X,
  Check,
  CheckCheck,
  Trash2,
  Eye,
  UserPlus,
  Megaphone,
  ShieldCheck,
  Building2,
  Heart,
  Calendar,
  Sparkles,
  Search,
  ExternalLink,
  Clock,
  Filter,
  UserCheck,
  Send,
  AlertCircle
} from 'lucide-react';
import { NotificationType, AppNotification } from '../types';

interface CentralNotificationCenterModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CentralNotificationCenterModal: React.FC<CentralNotificationCenterModalProps> = ({
  isOpen,
  onClose
}) => {
  const {
    currentUser,
    notifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    deleteNotification,
    clearAllNotifications,
    respondToConnectionRequest,
    sendProfileViewAlert,
    sendConnectionRequestAlert,
    sendCommunityAnnouncement,
    setActiveTab,
    showToast,
    users
  } = useApp();

  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showSimulatePanel, setShowSimulatePanel] = useState<boolean>(false);

  // Filter notifications for the current user
  const userNotifications = useMemo(() => {
    if (!currentUser) return [];

    return notifications.filter((n) => {
      const isTargetedToUser = !n.userId || n.userId === 'all' || n.userId === currentUser.id;
      if (!isTargetedToUser) return false;

      // Category filter
      if (activeCategory === 'unread' && n.isRead) return false;
      if (activeCategory === 'profile_views' && n.type !== 'ProfileView') return false;
      if (activeCategory === 'connections' && n.type !== 'ConnectionRequest' && n.type !== 'Matrimonial') return false;
      if (activeCategory === 'announcements' && n.type !== 'Announcement' && n.type !== 'Broadcast') return false;

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const titleMatch = n.title.toLowerCase().includes(q);
        const msgMatch = n.message.toLowerCase().includes(q);
        const senderMatch = n.senderName?.toLowerCase().includes(q);
        return titleMatch || msgMatch || senderMatch;
      }

      return true;
    });
  }, [notifications, currentUser, activeCategory, searchQuery]);

  const unreadCount = useMemo(() => {
    if (!currentUser) return 0;
    return notifications.filter(
      (n) => (!n.userId || n.userId === 'all' || n.userId === currentUser.id) && !n.isRead
    ).length;
  }, [notifications, currentUser]);

  if (!isOpen) return null;

  const handleActionClick = (notif: AppNotification) => {
    markNotificationAsRead(notif.id);
    if (notif.actionTab) {
      setActiveTab(notif.actionTab);
      onClose();
    }
  };

  // Simulation test helpers
  const handleSimulateProfileView = () => {
    if (!currentUser) return;
    const sampleViewers = users.filter((u) => u.id !== currentUser.id);
    const randomViewer = sampleViewers[Math.floor(Math.random() * sampleViewers.length)] || {
      id: 'usr_sample',
      fullName: 'Shrenik Shah (Wholesale Jewelers)',
      profilePhoto: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80'
    };

    sendProfileViewAlert(currentUser.id, currentUser.fullName, randomViewer as any);
    showToast('Simulation Triggered', `Generated a live Profile View notification from ${randomViewer.fullName}.`, 'info');
  };

  const handleSimulateConnection = () => {
    if (!currentUser) return;
    const sampleUsers = users.filter((u) => u.id !== currentUser.id);
    const randomSender = sampleUsers[Math.floor(Math.random() * sampleUsers.length)] || {
      id: 'usr_conn',
      fullName: 'Meeta Kothari',
      profilePhoto: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80'
    };

    sendConnectionRequestAlert(
      currentUser.id,
      currentUser.fullName,
      randomSender as any,
      `Jai Jinendra ${currentUser.fullName}! I noticed your Jain directory profile and would love to connect for community networking.`
    );
  };

  const handleSimulateAnnouncement = () => {
    sendCommunityAnnouncement(
      'Special Sangh Satsang & Tirth Yatra Notice',
      '🙏 Jai Jinendra! Annual Tirth Yatra registration and Jinendra Snatra Puja arrangements are now open for all verified members.',
      'panchang'
    );
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-md overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 12 }}
          className="relative w-full max-w-3xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col max-h-[90vh] overflow-hidden my-auto"
        >
          {/* Header Banner */}
          <div className="p-4 sm:p-5 bg-gradient-to-r from-amber-600 via-amber-700 to-orange-700 text-white flex items-center justify-between shrink-0 shadow-md">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/15 backdrop-blur-sm flex items-center justify-center border border-white/20 shadow-inner">
                <Bell className="w-5 h-5 text-amber-100 animate-pulse" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-base sm:text-lg font-bold tracking-tight">
                    Centralized Member Alerts
                  </h2>
                  {unreadCount > 0 && (
                    <span className="px-2 py-0.5 text-xs font-extrabold bg-red-500 text-white rounded-full shadow">
                      {unreadCount} New
                    </span>
                  )}
                </div>
                <p className="text-xs text-amber-100/90 font-medium">
                  Real-time alerts for Profile Views, Connection Requests & Sangh Announcements
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-white/20 text-white/90 transition-colors"
              title="Close Notification Center"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Action Toolbar & Search Bar */}
          <div className="p-3 sm:p-4 bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 shrink-0">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Filter alerts by keyword or member name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-amber-500/40"
              />
            </div>

            {/* Quick Actions */}
            <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
              {unreadCount > 0 && (
                <button
                  onClick={markAllNotificationsAsRead}
                  className="px-2.5 py-1.5 text-xs font-semibold text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 rounded-lg hover:bg-amber-100 transition-colors flex items-center gap-1.5"
                >
                  <CheckCheck className="w-3.5 h-3.5" />
                  Mark All Read
                </button>
              )}

              {userNotifications.length > 0 && (
                <button
                  onClick={clearAllNotifications}
                  className="px-2.5 py-1.5 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg transition-colors flex items-center gap-1.5"
                  title="Clear all notification history"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Clear All
                </button>
              )}

              <button
                onClick={() => setShowSimulatePanel(!showSimulatePanel)}
                className={`px-2.5 py-1.5 text-xs font-bold rounded-lg border transition-colors flex items-center gap-1.5 ${
                  showSimulatePanel
                    ? 'bg-amber-600 text-white border-amber-600'
                    : 'bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-300 border-amber-300 dark:border-amber-700'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                Test Alerts
              </button>
            </div>
          </div>

          {/* Simulation Helper Panel */}
          <AnimatePresence>
            {showSimulatePanel && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="bg-amber-50/80 dark:bg-amber-950/30 border-b border-amber-200 dark:border-amber-900/50 p-3 shrink-0"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-amber-900 dark:text-amber-200 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                    Interactive Notification Test Panel
                  </span>
                  <span className="text-[10px] text-amber-700 dark:text-amber-400">
                    Click buttons to trigger real-time simulated alerts
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <button
                    onClick={handleSimulateProfileView}
                    className="p-2 text-xs font-semibold bg-white dark:bg-slate-900 border border-amber-300 dark:border-amber-800 text-amber-900 dark:text-amber-200 rounded-xl hover:bg-amber-100/60 dark:hover:bg-amber-900/50 transition-all flex items-center justify-center gap-1.5 text-center shadow-xs"
                  >
                    <Eye className="w-3.5 h-3.5 text-amber-600" />
                    Simulate Profile View
                  </button>

                  <button
                    onClick={handleSimulateConnection}
                    className="p-2 text-xs font-semibold bg-white dark:bg-slate-900 border border-amber-300 dark:border-amber-800 text-amber-900 dark:text-amber-200 rounded-xl hover:bg-amber-100/60 dark:hover:bg-amber-900/50 transition-all flex items-center justify-center gap-1.5 text-center shadow-xs"
                  >
                    <UserPlus className="w-3.5 h-3.5 text-emerald-600" />
                    Simulate Connection Request
                  </button>

                  <button
                    onClick={handleSimulateAnnouncement}
                    className="p-2 text-xs font-semibold bg-white dark:bg-slate-900 border border-amber-300 dark:border-amber-800 text-amber-900 dark:text-amber-200 rounded-xl hover:bg-amber-100/60 dark:hover:bg-amber-900/50 transition-all flex items-center justify-center gap-1.5 text-center shadow-xs"
                  >
                    <Megaphone className="w-3.5 h-3.5 text-amber-600" />
                    Simulate Sangh Notice
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Category Tabs */}
          <div className="px-4 pt-2 bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 flex items-center gap-1 overflow-x-auto shrink-0 scrollbar-none">
            <button
              onClick={() => setActiveCategory('all')}
              className={`px-3 py-2 text-xs font-bold border-b-2 transition-all whitespace-nowrap flex items-center gap-1.5 ${
                activeCategory === 'all'
                  ? 'border-amber-600 text-amber-600 dark:text-amber-400'
                  : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              <Bell className="w-3.5 h-3.5" />
              All Alerts ({userNotifications.length})
            </button>

            <button
              onClick={() => setActiveCategory('profile_views')}
              className={`px-3 py-2 text-xs font-bold border-b-2 transition-all whitespace-nowrap flex items-center gap-1.5 ${
                activeCategory === 'profile_views'
                  ? 'border-amber-600 text-amber-600 dark:text-amber-400'
                  : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              <Eye className="w-3.5 h-3.5 text-amber-500" />
              Profile Views
            </button>

            <button
              onClick={() => setActiveCategory('connections')}
              className={`px-3 py-2 text-xs font-bold border-b-2 transition-all whitespace-nowrap flex items-center gap-1.5 ${
                activeCategory === 'connections'
                  ? 'border-amber-600 text-amber-600 dark:text-amber-400'
                  : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              <UserPlus className="w-3.5 h-3.5 text-emerald-500" />
              Connections
            </button>

            <button
              onClick={() => setActiveCategory('announcements')}
              className={`px-3 py-2 text-xs font-bold border-b-2 transition-all whitespace-nowrap flex items-center gap-1.5 ${
                activeCategory === 'announcements'
                  ? 'border-amber-600 text-amber-600 dark:text-amber-400'
                  : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              <Megaphone className="w-3.5 h-3.5 text-orange-500" />
              Announcements
            </button>

            {unreadCount > 0 && (
              <button
                onClick={() => setActiveCategory('unread')}
                className={`px-3 py-2 text-xs font-bold border-b-2 transition-all whitespace-nowrap flex items-center gap-1.5 ${
                  activeCategory === 'unread'
                    ? 'border-red-500 text-red-600 dark:text-red-400'
                    : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-red-500"></span>
                Unread ({unreadCount})
              </button>
            )}
          </div>

          {/* Notifications Scroll List */}
          <div className="p-4 overflow-y-auto space-y-3 flex-1 min-h-[280px]">
            {userNotifications.length === 0 ? (
              <div className="py-12 text-center flex flex-col items-center justify-center">
                <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800/80 flex items-center justify-center mb-3 text-slate-400">
                  <Bell className="w-8 h-8 stroke-1" />
                </div>
                <p className="text-sm font-bold text-slate-700 dark:text-slate-300">
                  No notifications found
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm">
                  {searchQuery
                    ? 'Try searching with a different term or clear filters.'
                    : 'You are all caught up! New alerts regarding profile views, connection requests, or announcements will appear here.'}
                </p>
              </div>
            ) : (
              userNotifications.map((notif) => {
                const isProfileView = notif.type === 'ProfileView';
                const isConnection = notif.type === 'ConnectionRequest';
                const isAnnouncement = notif.type === 'Announcement' || notif.type === 'Broadcast';

                return (
                  <motion.div
                    key={notif.id}
                    layout
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className={`p-3.5 sm:p-4 rounded-xl border transition-all relative ${
                      !notif.isRead
                        ? 'bg-amber-50/50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-900/60 shadow-xs'
                        : 'bg-white dark:bg-slate-800/50 border-slate-100 dark:border-slate-800'
                    }`}
                  >
                    {!notif.isRead && (
                      <span className="absolute top-3.5 right-3.5 w-2.5 h-2.5 rounded-full bg-amber-500 ring-4 ring-amber-500/20 animate-pulse"></span>
                    )}

                    <div className="flex items-start gap-3">
                      {/* Avatar or Icon */}
                      <div className="shrink-0 pt-0.5">
                        {notif.senderPhoto ? (
                          <img
                            src={notif.senderPhoto}
                            alt={notif.senderName || 'Sender'}
                            className="w-10 h-10 rounded-full object-cover border border-amber-400/60 shadow-xs"
                          />
                        ) : (
                          <div
                            className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-xs ${
                              isProfileView
                                ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300'
                                : isConnection
                                ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300'
                                : isAnnouncement
                                ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/50 dark:text-orange-300'
                                : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                            }`}
                          >
                            {isProfileView && <Eye className="w-5 h-5" />}
                            {isConnection && <UserPlus className="w-5 h-5" />}
                            {isAnnouncement && <Megaphone className="w-5 h-5" />}
                            {!isProfileView && !isConnection && !isAnnouncement && (
                              <Bell className="w-5 h-5" />
                            )}
                          </div>
                        )}
                      </div>

                      {/* Content Body */}
                      <div className="flex-1 min-w-0 pr-4">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-100">
                            {notif.title}
                          </h4>

                          <span
                            className={`px-2 py-0.5 text-[10px] font-bold rounded-md ${
                              isProfileView
                                ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/60 dark:text-amber-300'
                                : isConnection
                                ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-300'
                                : isAnnouncement
                                ? 'bg-orange-100 text-orange-800 dark:bg-orange-900/60 dark:text-orange-300'
                                : 'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300'
                            }`}
                          >
                            {notif.type}
                          </span>
                        </div>

                        <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed mb-2">
                          {notif.message}
                        </p>

                        <div className="flex items-center justify-between gap-2 pt-1 border-t border-slate-100 dark:border-slate-800/80 mt-2">
                          <span className="text-[10px] text-slate-500 dark:text-slate-400 flex items-center gap-1">
                            <Clock className="w-3 h-3 text-slate-400" />
                            {notif.createdAt}
                          </span>

                          <div className="flex items-center gap-2">
                            {/* Connection Accept / Decline Buttons */}
                            {isConnection && notif.connectionStatus === 'Pending' && (
                              <div className="flex items-center gap-1.5">
                                <button
                                  onClick={() => respondToConnectionRequest(notif.id, 'Accepted')}
                                  className="px-2.5 py-1 text-[11px] font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors flex items-center gap-1 shadow-xs"
                                >
                                  <Check className="w-3 h-3" />
                                  Accept
                                </button>
                                <button
                                  onClick={() => respondToConnectionRequest(notif.id, 'Declined')}
                                  className="px-2.5 py-1 text-[11px] font-medium bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 text-slate-700 dark:text-slate-200 rounded-lg transition-colors"
                                >
                                  Decline
                                </button>
                              </div>
                            )}

                            {isConnection && notif.connectionStatus && notif.connectionStatus !== 'Pending' && (
                              <span className="text-[10px] font-extrabold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded-md border border-emerald-200 dark:border-emerald-800">
                                Status: {notif.connectionStatus}
                              </span>
                            )}

                            {/* View Action Link */}
                            {notif.actionTab && (
                              <button
                                onClick={() => handleActionClick(notif)}
                                className="px-2.5 py-1 text-[11px] font-semibold text-amber-700 dark:text-amber-400 hover:bg-amber-100 dark:hover:bg-amber-950/60 rounded-lg transition-colors flex items-center gap-1"
                              >
                                View Details
                                <ExternalLink className="w-3 h-3" />
                              </button>
                            )}

                            {/* Mark read toggle */}
                            {!notif.isRead && (
                              <button
                                onClick={() => markNotificationAsRead(notif.id)}
                                className="p-1 text-slate-400 hover:text-amber-600 transition-colors"
                                title="Mark as read"
                              >
                                <Check className="w-3.5 h-3.5" />
                              </button>
                            )}

                            {/* Delete single notif */}
                            <button
                              onClick={() => deleteNotification(notif.id)}
                              className="p-1 text-slate-400 hover:text-red-500 transition-colors"
                              title="Delete notification"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })
            )}
          </div>

          {/* Footer Info */}
          <div className="p-3 sm:p-4 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 shrink-0">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-amber-500" />
              Verified Jain Connect Global Security & Notification Engine
            </span>
            <button
              onClick={onClose}
              className="px-4 py-1.5 font-bold bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-200 rounded-xl transition-colors"
            >
              Close
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
