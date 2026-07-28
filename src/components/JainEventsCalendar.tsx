import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { createGoogleCalendarEvent, getGoogleCalendarWebUrl } from '../lib/googleCalendar';
import { getAccessToken, googleSignIn } from '../lib/googleAuth';
import {
  Calendar as CalendarIcon,
  Filter,
  Search,
  Sparkles,
  Info,
  Clock,
  CheckCircle,
  Copy,
  ChevronRight,
  Bookmark,
  Bell,
  Utensils,
  Award,
  CalendarCheck,
  CalendarPlus,
  ExternalLink,
  Check
} from 'lucide-react';

export type EventCategory = 'all' | 'parv' | 'kalyanak' | 'tithi' | 'vrata';

export interface JainEvent {
  id: string;
  title: string;
  hindiTitle: string;
  category: 'parv' | 'kalyanak' | 'tithi' | 'vrata';
  gregorianDate: string; // e.g. "2026-09-08"
  displayDate: string;   // e.g. "08 Sep 2026"
  jainTithi: string;     // e.g. "Bhadrapada Shukla Panchami"
  sect: 'Swetambar' | 'Digambar' | 'All Jains';
  significance: string;
  dietaryRule?: string;  // e.g. "Chouvihar & No Green Vegetables (Kandmool)"
  isMajor: boolean;
}

const JAIN_EVENTS_DATA: JainEvent[] = [
  {
    id: 'paryushan-2026',
    title: 'Paryushan Parv Begin (Swetambar)',
    hindiTitle: 'पर्युषण पर्व प्रारम्भ (श्वेतांबर)',
    category: 'parv',
    gregorianDate: '2026-09-08',
    displayDate: '08 Sep 2026',
    jainTithi: 'Bhadrapada Krishna Trayodashi',
    sect: 'Swetambar',
    significance: '8-day holy festival of self-purification, forgiveness, intense tapasya, and reading of Kalpa Sutra.',
    dietaryRule: 'Pure Sattvic food before sunset; strict avoidance of onions, garlic, potatoes, and green leafy vegetables.',
    isMajor: true
  },
  {
    id: 'samvatsari-2026',
    title: 'Samvatsari Kshamavani (Swetambar)',
    hindiTitle: 'संवत्सरी क्षमावाणी महापर्व',
    category: 'parv',
    gregorianDate: '2026-09-15',
    displayDate: '15 Sep 2026',
    jainTithi: 'Bhadrapada Shukla Panchami',
    sect: 'Swetambar',
    significance: 'Supreme Day of Forgiveness. Asking "Michhami Dukkadam" to all living beings in the universe.',
    dietaryRule: 'Strict Fasting (Upvas / Ekashana) & Chouvihar.',
    isMajor: true
  },
  {
    id: 'das-lakshana-2026',
    title: 'Das Lakshana Parv Begin (Digambar)',
    hindiTitle: 'दशलक्षण धर्म पर्व (दिगंबर)',
    category: 'parv',
    gregorianDate: '2026-09-16',
    displayDate: '16 Sep 2026',
    jainTithi: 'Bhadrapada Shukla Panchami',
    sect: 'Digambar',
    significance: '10 days celebrating Uttama Kshama, Mardava, Arjava, Satya, Shaucha, Sanyama, Tapa, Tyaga, Akinchanya, and Brahmacharya.',
    dietaryRule: 'Ekashana / Upvas with boil-water intake before sunset.',
    isMajor: true
  },
  {
    id: 'kshamavani-dig-2026',
    title: 'Ananta Chaturdashi & Digambar Kshamavani',
    hindiTitle: 'अनंत चतुर्दशी एवं क्षमावाणी',
    category: 'parv',
    gregorianDate: '2026-09-25',
    displayDate: '25 Sep 2026',
    jainTithi: 'Bhadrapada Shukla Chaturdashi',
    sect: 'Digambar',
    significance: 'Culmination of Das Lakshana Mahaparv & Universal Forgiveness seeking.',
    dietaryRule: 'Chouvihar Fasting & Siddha Bhakti.',
    isMajor: true
  },
  {
    id: 'mahavir-jayanti-2026',
    title: 'Mahavir Jayanti (Janma Kalyanak)',
    hindiTitle: 'भगवान महावीर जन्म कल्याणक',
    category: 'kalyanak',
    gregorianDate: '2026-03-31',
    displayDate: '31 Mar 2026',
    jainTithi: 'Chaitra Shukla Trayodashi',
    sect: 'All Jains',
    significance: 'Birth Kalyanak of 24th Tirthankara Bhagwan Mahavira. Rath Yatra and Ahimsa processions worldwide.',
    dietaryRule: 'Sattvic Bhojan & Snatra Puja.',
    isMajor: true
  },
  {
    id: 'diwali-mahavir-nirvana-2026',
    title: 'Mahavir Swami Nirvana Kalyanak (Diwali)',
    hindiTitle: 'भगवान महावीर निर्वाण महोत्सव (दीपावली)',
    category: 'kalyanak',
    gregorianDate: '2026-11-08',
    displayDate: '08 Nov 2026',
    jainTithi: 'Kartik Amavasya',
    sect: 'All Jains',
    significance: 'Moksha Kalyanak of Bhagwan Mahavira at Pawapuri Jal Mandir and attainment of Kevaljnana by Gautam Swami.',
    dietaryRule: 'Chouvihar, Jaap & Ladoo offerings.',
    isMajor: true
  },
  {
    id: 'akshaya-tritiya-2026',
    title: 'Akshaya Tritiya (Varshitap Parna)',
    hindiTitle: 'अक्षय तृतीया (वर्षीतप पारणा)',
    category: 'vrata',
    gregorianDate: '2026-04-19',
    displayDate: '19 Apr 2026',
    jainTithi: 'Vaishakha Shukla Tritiya',
    sect: 'All Jains',
    significance: 'First Tirthankara Lord Rishabhdev broke his 400-day fast with Sugarcane Juice (Ikshu Rasa) from King Shreyansa.',
    dietaryRule: 'Sugarcane Juice Parna for Varshitap Sadhaks.',
    isMajor: true
  },
  {
    id: 'oli-chaitra-2026',
    title: 'Chaitra Navpad Oli Vrata (9 Days)',
    hindiTitle: 'चैत्र नवपद ओली जी',
    category: 'vrata',
    gregorianDate: '2026-03-24',
    displayDate: '24 Mar - 01 Apr 2026',
    jainTithi: 'Chaitra Shukla Saptami to Purnima',
    sect: 'Swetambar',
    significance: '9-day Ayambil Tap honoring Navpad: Arihant, Siddha, Acharya, Upadhyay, Sadhu, Samyak Darshan, Jnana, Charitra, Tapa.',
    dietaryRule: 'Boiled single-grain food once a day without salt, ghee, milk, oil, or sugar (Ayambil).',
    isMajor: true
  },
  {
    id: 'oli-kartik-2026',
    title: 'Kartik Navpad Oli Vrata (9 Days)',
    hindiTitle: 'कार्तिक नवपद ओली जी',
    category: 'vrata',
    gregorianDate: '2026-10-25',
    displayDate: '25 Oct - 02 Nov 2026',
    jainTithi: 'Kartik Shukla Saptami to Purnima',
    sect: 'Swetambar',
    significance: 'Autumn Siddhachakra Aradhana and Ayambil Tapasya.',
    dietaryRule: 'Ayambil Tap Sadhana.',
    isMajor: true
  },
  {
    id: 'gyan-panchami-2026',
    title: 'Gyan Panchami (Saubhagya Panchami)',
    hindiTitle: 'ज्ञान पंचमी (श्रुत पंचमी)',
    category: 'parv',
    gregorianDate: '2026-11-13',
    displayDate: '13 Nov 2026',
    jainTithi: 'Kartik Shukla Panchami',
    sect: 'All Jains',
    significance: 'Day dedicated to veneration of sacred Agams, Jain Scriptures, Dev-Vani, and knowledge tools.',
    dietaryRule: 'Saraswati Jaap & Dev Vandan.',
    isMajor: false
  },
  {
    id: 'maun-ekadashi-2026',
    title: 'Maun Agiyaras / Maun Ekadashi',
    hindiTitle: 'मौन एकादशी महाव्रत',
    category: 'vrata',
    gregorianDate: '2026-12-20',
    displayDate: '20 Dec 2026',
    jainTithi: 'Margashirsha Shukla Ekadashi',
    sect: 'All Jains',
    significance: 'Day of silent contemplation (Maun Fasting). 150 Kalyanaks of past, present, and future Tirthankaras honored.',
    dietaryRule: 'Complete silence (Maun), Upvas / Paushadh.',
    isMajor: true
  },
  {
    id: 'adinath-janma-2026',
    title: 'Bhagwan Adinath Janma & Kevaljnana Kalyanak',
    hindiTitle: 'भगवान आदिनाथ जन्म एवं केवलज्ञान कल्याणक',
    category: 'kalyanak',
    gregorianDate: '2026-03-12',
    displayDate: '12 Mar 2026',
    jainTithi: 'Chaitra Krishna Navami',
    sect: 'All Jains',
    significance: 'Janma Kalyanak of First Tirthankara Bhagwan Rishabhdev (Adinath).',
    dietaryRule: 'Puja, Snatra, Sattvic Bhojan.',
    isMajor: false
  },
  {
    id: 'parshvanath-jayanti-2026',
    title: 'Bhagwan Parshvanath Janma Kalyanak',
    hindiTitle: 'भगवान पार्श्वनाथ जन्म कल्याणक',
    category: 'kalyanak',
    gregorianDate: '2026-01-03',
    displayDate: '03 Jan 2026',
    jainTithi: 'Pausha Krishna Dashami',
    sect: 'All Jains',
    significance: 'Birth Kalyanak of 23rd Tirthankara Bhagwan Parshvanath.',
    dietaryRule: 'Special Bhaktamar & Parshvanath Jaap.',
    isMajor: false
  },
  {
    id: 'ashtami-tithi-monthly',
    title: 'Monthly Ashtami Fasting Tithi (8th Day)',
    hindiTitle: 'मासिक अष्टमी तिथि उपवास / एकाशन',
    category: 'tithi',
    gregorianDate: 'Recurring Monthly',
    displayDate: 'Every Shukla & Krishna Ashtami',
    jainTithi: 'Ashtami (8th Tithi)',
    sect: 'All Jains',
    significance: 'Sacred monthly Tithi for spiritual restraint, Ekashana, or Upvas sadhana.',
    dietaryRule: 'Avoid green vegetables (Hari), root vegetables (Kandmool). Practice Chouvihar before sunset.',
    isMajor: false
  },
  {
    id: 'chaudas-tithi-monthly',
    title: 'Monthly Chaudas Fasting Tithi (14th Day)',
    hindiTitle: 'मासिक चौदस तिथि (चतुर्दशी)',
    category: 'tithi',
    gregorianDate: 'Recurring Monthly',
    displayDate: 'Every Shukla & Krishna Chaturdashi',
    jainTithi: 'Chaturdashi (14th Tithi)',
    sect: 'All Jains',
    significance: 'High spiritual energy Tithi preceding Poornima & Amavasya. Ideal for Samayik and Pratikraman.',
    dietaryRule: 'Strict avoidance of green/root vegetables; preferred Ekashana/Upvas.',
    isMajor: false
  },
  {
    id: 'pakshik-choumasi-2026',
    title: 'Kartiki Purnima & Chaumasi Chaudas',
    hindiTitle: 'कार्तिकी पूर्णिमा एवं चौमासी चौदस',
    category: 'parv',
    gregorianDate: '2026-11-24',
    displayDate: '24 Nov 2026',
    jainTithi: 'Kartik Shukla Purnima',
    sect: 'All Jains',
    significance: 'End of Chaturmas. Shatrunjaya Palitana Yatra opens for lakhs of devotees.',
    dietaryRule: 'Chouvihar & Special Sangh Puja.',
    isMajor: true
  }
];

export const JainEventsCalendar: React.FC = () => {
  const { showToast } = useApp();
  const [selectedCategory, setSelectedCategory] = useState<EventCategory>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showDietModal, setShowDietModal] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [syncedEvents, setSyncedEvents] = useState<Record<string, boolean>>({});
  const [isSyncingId, setIsSyncingId] = useState<string | null>(null);
  const [showAllEvents, setShowAllEvents] = useState(false);
  const [viewMode, setViewMode] = useState<'compact' | 'cards'>('compact');

  const handleSyncToCalendar = async (event: JainEvent) => {
    let token = getAccessToken();
    const eventDate = event.gregorianDate.includes('-') ? event.gregorianDate : new Date().toISOString().split('T')[0];
    const eventPayload = {
      title: `🙏 ${event.title} (${event.hindiTitle})`,
      description: `📿 Jain Tithi: ${event.jainTithi}\n✨ Significance: ${event.significance}\n🍽️ Dietary Rule: ${event.dietaryRule || 'Sattvic Chouvihar'}\n\nSaved via Jain Connect Global Community App`,
      startDate: eventDate,
      location: 'Jain Sangh Community',
    };

    setIsSyncingId(event.id);

    try {
      if (!token) {
        const authRes = await googleSignIn();
        if (authRes?.accessToken) {
          token = authRes.accessToken;
        }
      }

      if (token) {
        await createGoogleCalendarEvent(token, eventPayload);
        setSyncedEvents((prev) => ({ ...prev, [event.id]: true }));
        showToast(
          'Saved to Google Calendar!',
          `Successfully synchronized "${event.title}" to your primary Google Calendar.`,
          'success'
        );
      } else {
        const webUrl = getGoogleCalendarWebUrl(eventPayload);
        window.open(webUrl, '_blank');
        showToast('Opening Google Calendar', 'Redirecting to add event to Google Calendar.', 'info');
      }
    } catch (err: any) {
      console.warn('Calendar API sync warning, using web fallback:', err);
      const webUrl = getGoogleCalendarWebUrl(eventPayload);
      window.open(webUrl, '_blank');
      showToast('Calendar Sync', 'Opened Google Calendar event creation link.', 'info');
    } finally {
      setIsSyncingId(null);
    }
  };

  const filteredEvents = JAIN_EVENTS_DATA.filter((event) => {
    const matchesCategory = selectedCategory === 'all' || event.category === selectedCategory;
    const matchesSearch =
      event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.hindiTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.jainTithi.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.displayDate.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const displayedEvents = showAllEvents ? filteredEvents : filteredEvents.slice(0, 4);

  const handleCopyEvent = (event: JainEvent) => {
    const details = `🙏 JAIN EVENT REMINDER:\n📌 ${event.title} (${event.hindiTitle})\n📅 Date: ${event.displayDate}\n📿 Tithi: ${event.jainTithi}\n✨ Significance: ${event.significance}\n🍽️ Dietary Rule: ${event.dietaryRule || 'Sattvic Chouvihar'}\n\nShared via Jain Connect Global`;
    navigator.clipboard.writeText(details);
    setCopiedId(event.id);
    showToast('Event Details Copied!', 'Shared Jain calendar event copied to clipboard.', 'success');
    setTimeout(() => setCopiedId(null), 3000);
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 sm:p-5 shadow-lg border border-amber-300/60 dark:border-amber-900/60 transition-all">
      {/* Header Banner - Compact */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-amber-100 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-amber-700 dark:text-amber-400 font-bold text-[11px] uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Sacred Jain Panchang Events 2026</span>
          </div>
          <h2 className="text-lg sm:text-xl font-serif font-bold text-slate-900 dark:text-white flex items-center gap-2">
            Jain Festivals & Tithi Calendar
          </h2>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {/* View Mode Toggle */}
          <div className="bg-slate-100 dark:bg-slate-800 p-0.5 rounded-xl flex items-center border border-slate-200 dark:border-slate-700">
            <button
              onClick={() => setViewMode('compact')}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                viewMode === 'compact'
                  ? 'bg-amber-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              List View
            </button>
            <button
              onClick={() => setViewMode('cards')}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                viewMode === 'cards'
                  ? 'bg-amber-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Card View
            </button>
          </div>

          <button
            onClick={() => setShowDietModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-100/80 dark:bg-amber-950/80 hover:bg-amber-200 text-amber-900 dark:text-amber-200 text-xs font-bold border border-amber-300 dark:border-amber-700 transition-all"
            title="View Tithi Fasting Rules"
          >
            <Utensils className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
            <span className="hidden sm:inline">Fasting Guide</span>
          </button>
        </div>
      </div>

      {/* Filter Tabs & Search Bar - Compact */}
      <div className="mt-3 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2">
        {/* Category Filter Pills */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0 no-scrollbar">
          <button
            onClick={() => { setSelectedCategory('all'); setShowAllEvents(false); }}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-bold whitespace-nowrap transition-all ${
              selectedCategory === 'all'
                ? 'bg-amber-600 text-white shadow-sm'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-amber-100'
            }`}
          >
            All ({JAIN_EVENTS_DATA.length})
          </button>

          <button
            onClick={() => { setSelectedCategory('parv'); setShowAllEvents(false); }}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-bold whitespace-nowrap transition-all ${
              selectedCategory === 'parv'
                ? 'bg-amber-600 text-white shadow-sm'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-amber-100'
            }`}
          >
            Parv
          </button>

          <button
            onClick={() => { setSelectedCategory('kalyanak'); setShowAllEvents(false); }}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-bold whitespace-nowrap transition-all ${
              selectedCategory === 'kalyanak'
                ? 'bg-amber-600 text-white shadow-sm'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-amber-100'
            }`}
          >
            Kalyanaks
          </button>

          <button
            onClick={() => { setSelectedCategory('tithi'); setShowAllEvents(false); }}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-bold whitespace-nowrap transition-all ${
              selectedCategory === 'tithi'
                ? 'bg-amber-600 text-white shadow-sm'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-amber-100'
            }`}
          >
            Tithi (8th & 14th)
          </button>

          <button
            onClick={() => { setSelectedCategory('vrata'); setShowAllEvents(false); }}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-bold whitespace-nowrap transition-all ${
              selectedCategory === 'vrata'
                ? 'bg-amber-600 text-white shadow-sm'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-amber-100'
            }`}
          >
            Vrata & Tap
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative w-full sm:w-52 shrink-0">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search event..."
            value={searchTerm}
            onChange={(e) => { setSearchTerm(e.target.value); setShowAllEvents(true); }}
            className="w-full pl-8 pr-2.5 py-1 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-amber-500"
          />
        </div>
      </div>

      {/* Events Display */}
      {viewMode === 'compact' ? (
        /* COMPACT LIST VIEW - Super Sleek & Space Saving */
        <div className="mt-3 divide-y divide-slate-100 dark:divide-slate-800 border-t border-slate-100 dark:border-slate-800">
          {displayedEvents.map((event) => (
            <div
              key={event.id}
              className="py-2.5 px-2 hover:bg-amber-50/50 dark:hover:bg-slate-800/60 rounded-xl transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-2"
            >
              <div className="flex items-start sm:items-center gap-2.5 min-w-0">
                <span className="px-2 py-0.5 rounded-md text-[10px] font-extrabold bg-amber-100 dark:bg-amber-950 text-amber-900 dark:text-amber-200 shrink-0">
                  {event.displayDate}
                </span>

                <div className="min-w-0">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <h3 className="text-xs font-bold text-slate-900 dark:text-white truncate">
                      {event.title}
                    </h3>
                    <span className="text-[10px] font-serif text-amber-800 dark:text-amber-400 font-semibold shrink-0">
                      ({event.hindiTitle})
                    </span>
                    {event.isMajor && (
                      <span className="text-[9px] px-1.5 py-0.2 rounded font-bold bg-amber-500 text-white shrink-0">
                        Major
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate mt-0.5">
                    📿 {event.jainTithi} • {event.sect} {event.dietaryRule ? `• 🍽️ ${event.dietaryRule}` : ''}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1.5 shrink-0 self-end sm:self-center">
                <button
                  onClick={() => handleSyncToCalendar(event)}
                  disabled={isSyncingId === event.id}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-bold flex items-center gap-1 transition-all shadow-2xs ${
                    syncedEvents[event.id]
                      ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300'
                      : 'bg-amber-600 hover:bg-amber-700 text-white'
                  }`}
                  title="Save to Google Calendar"
                >
                  <CalendarPlus className={`w-3 h-3 ${isSyncingId === event.id ? 'animate-spin' : ''}`} />
                  <span>{syncedEvents[event.id] ? 'Synced' : 'Calendar'}</span>
                </button>

                <button
                  onClick={() => handleCopyEvent(event)}
                  className="p-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-amber-100 dark:hover:bg-amber-900/60 text-slate-600 dark:text-slate-300"
                  title="Copy Event Info"
                >
                  {copiedId === event.id ? <CheckCircle className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* CARD GRID VIEW */
        <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3">
          {displayedEvents.map((event) => (
            <div
              key={event.id}
              className={`p-3.5 rounded-xl border transition-all duration-200 flex flex-col justify-between ${
                event.isMajor
                  ? 'bg-gradient-to-br from-amber-50/90 via-orange-50/40 to-white dark:from-slate-800/90 dark:via-amber-950/20 dark:to-slate-900 border-amber-300 dark:border-amber-700/60'
                  : 'bg-white dark:bg-slate-800/80 border-slate-200 dark:border-slate-700'
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-1.5 mb-1.5">
                  <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-100 dark:bg-amber-950 text-amber-900 dark:text-amber-200">
                    {event.displayDate}
                  </span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded font-bold bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                    {event.sect}
                  </span>
                </div>

                <h3 className="text-sm font-serif font-bold text-slate-900 dark:text-white leading-tight">
                  {event.title} <span className="text-amber-800 dark:text-amber-400 font-normal">({event.hindiTitle})</span>
                </h3>

                <div className="text-[11px] font-medium text-slate-700 dark:text-slate-300 mt-1 flex items-center gap-1">
                  <CalendarIcon className="w-3 h-3 text-amber-600 shrink-0" />
                  <span>{event.jainTithi}</span>
                </div>

                <p className="text-[11px] text-slate-600 dark:text-slate-300 mt-1.5 line-clamp-2">
                  {event.significance}
                </p>
              </div>

              <div className="mt-3 pt-2 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between gap-2">
                <span className="text-[9px] text-slate-400 font-semibold uppercase">
                  {event.category}
                </span>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleSyncToCalendar(event)}
                    disabled={isSyncingId === event.id}
                    className={`px-2 py-1 rounded-lg text-[10px] font-bold flex items-center gap-1 transition-all ${
                      syncedEvents[event.id]
                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                        : 'bg-amber-600 hover:bg-amber-700 text-white'
                    }`}
                  >
                    <CalendarPlus className="w-3 h-3" />
                    <span>{syncedEvents[event.id] ? 'Synced' : 'Calendar'}</span>
                  </button>

                  <button
                    onClick={() => handleCopyEvent(event)}
                    className="p-1 rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300"
                  >
                    {copiedId === event.id ? <CheckCircle className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Show More / Show Less Toggle Button */}
      {filteredEvents.length > 4 && (
        <div className="mt-3 text-center border-t border-slate-100 dark:border-slate-800 pt-3">
          <button
            onClick={() => setShowAllEvents(!showAllEvents)}
            className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-amber-50 dark:bg-amber-950/60 hover:bg-amber-100 text-amber-900 dark:text-amber-200 text-xs font-bold border border-amber-200 dark:border-amber-800 transition-all"
          >
            {showAllEvents ? (
              <span>Show Top 4 Events</span>
            ) : (
              <span>View All {filteredEvents.length} Jain Events & Tithis</span>
            )}
            <ChevronRight className={`w-3.5 h-3.5 transition-transform ${showAllEvents ? '-rotate-90' : 'rotate-90'}`} />
          </button>
        </div>
      )}

      {filteredEvents.length === 0 && (
        <div className="py-8 text-center text-slate-500 dark:text-slate-400">
          <CalendarIcon className="w-8 h-8 mx-auto text-amber-400 opacity-60 mb-1" />
          <p className="text-xs font-semibold">No Jain events found matching "{searchTerm}"</p>
        </div>
      )}

      {/* Tithi Fasting Guidelines Drawer / Modal */}
      {showDietModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-lg w-full p-5 shadow-2xl border border-amber-400 dark:border-amber-700 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-amber-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <Utensils className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                <h3 className="text-base font-serif font-bold text-slate-900 dark:text-white">
                  Jain Tithi & Fasting Rules (आहार नियम)
                </h3>
              </div>
              <button
                onClick={() => setShowDietModal(false)}
                className="text-slate-400 hover:text-slate-700 dark:hover:text-white text-lg font-bold p-1"
              >
                ✕
              </button>
            </div>

            <div className="mt-3 space-y-3 text-xs text-slate-700 dark:text-slate-300">
              <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800">
                <h4 className="font-bold text-amber-900 dark:text-amber-200 flex items-center gap-1 text-xs">
                  <CalendarCheck className="w-3.5 h-3.5 text-amber-600" />
                  Ashtami (8th) & Chaudas (14th) Rules:
                </h4>
                <ul className="list-disc pl-4 mt-1.5 space-y-1 text-slate-700 dark:text-slate-300">
                  <li><strong>Avoid Green Vegetables (Hari Saggi):</strong> Abstain from fresh green leafy vegetables, coriander, mint, green chillies.</li>
                  <li><strong>Avoid Root Vegetables (Kandmool):</strong> Permanent avoidance of onions, garlic, potatoes, carrots, radishes, ginger.</li>
                  <li><strong>Chouvihar Sunset Rule:</strong> Finish dinner before sunset (Chouvihar) and drink boiled water.</li>
                  <li><strong>Observe Ekashana or Upvas:</strong> Take meals once a day or full day fasting.</li>
                </ul>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                <h4 className="font-bold text-slate-900 dark:text-white flex items-center gap-1 text-xs">
                  <Award className="w-3.5 h-3.5 text-amber-500" />
                  Paryushan & Navpad Oli Sadhana:
                </h4>
                <p className="mt-1 text-slate-600 dark:text-slate-300 leading-relaxed">
                  During Paryushan and Ayambil Oli, Sadhaks observe intense physical purity, recitation of Navkar Mantra, Samayik (48 mins quiet meditation), and daily Pratikraman.
                </p>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end">
              <button
                onClick={() => setShowDietModal(false)}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-600 to-amber-700 text-white font-bold text-xs hover:from-amber-500 transition-all shadow-md"
              >
                Got It, Jai Jinendra 🙏
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
