import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Megaphone,
  ExternalLink,
  Phone,
  MessageCircle,
  Tag,
  Calendar,
  Sparkles,
  Building2,
  ShieldCheck,
  ChevronRight,
  UserPlus
} from 'lucide-react';

export const FeaturedAdsSection: React.FC = () => {
  const { ads, setIsRegModalOpen, systemSettings } = useApp();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const activeAds = ads.filter((ad) => ad.isActive !== false);

  if (activeAds.length === 0) return null;

  return (
    <section className="bg-gradient-to-b from-amber-50/50 via-white to-slate-50 dark:from-slate-900/80 dark:via-slate-900 dark:to-slate-950 p-6 sm:p-8 rounded-3xl border border-amber-300/60 dark:border-amber-800/60 shadow-xl space-y-6 my-8">
      
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-amber-200 dark:border-amber-900/50">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-500/15 border border-amber-500/30 rounded-full text-amber-700 dark:text-amber-400 text-xs font-bold uppercase tracking-wider">
            <Megaphone className="w-3.5 h-3.5 text-amber-500 animate-bounce" />
            <span>PUBLIC FEATURED PROMOTIONS & ADS</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold font-serif text-slate-900 dark:text-white flex items-center gap-2">
            <span>Featured Jain Business Promotions</span>
            <Sparkles className="w-5 h-5 text-amber-500" />
          </h2>
          <p className="text-xs text-slate-600 dark:text-slate-300">
            Promoted banners and exclusive offers from verified Jain businesses, manufacturers, and service providers worldwide.
          </p>
        </div>

        <button
          onClick={() => setIsRegModalOpen(true)}
          className="px-5 py-2.5 bg-gradient-to-r from-amber-500 to-amber-700 hover:from-amber-600 hover:to-amber-800 text-amber-950 font-black text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-1.5 shrink-0"
        >
          <UserPlus className="w-4 h-4" />
          <span>Promote Your Business</span>
        </button>
      </div>

      {/* Ads Grid Display */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {activeAds.map((ad) => {
          const formattedPhone = ad.contactMobile || systemSettings.contactPhone || '9514237277';
          const cleanPhone = formattedPhone.replace(/[^0-9]/g, '');

          return (
            <div
              key={ad.id}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl hover:border-amber-500/60 transition-all duration-300 flex flex-col justify-between group"
            >
              <div>
                {/* Banner Image with Offer Tag */}
                <div className="relative h-48 sm:h-52 w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
                  <img
                    src={ad.imageUrl}
                    alt={ad.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                      // Fallback image if custom image URL fails
                      (e.target as HTMLImageElement).src =
                        'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=800&q=80';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />

                  {/* Position / Featured Badge */}
                  <div className="absolute top-3 left-3 bg-slate-950/80 backdrop-blur-md text-amber-400 border border-amber-500/50 px-2.5 py-1 rounded-full text-[10px] font-extrabold tracking-wider uppercase flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3 text-emerald-400" />
                    <span>{ad.sponsorName || 'Verified Sponsor'}</span>
                  </div>

                  {/* Offer Discount Badge */}
                  {ad.offerDiscount && (
                    <div className="absolute top-3 right-3 bg-gradient-to-r from-red-600 to-amber-600 text-white font-black text-xs px-3 py-1 rounded-full shadow-lg border border-white/20 flex items-center gap-1">
                      <Tag className="w-3 h-3" />
                      <span>{ad.offerDiscount}</span>
                    </div>
                  )}

                  {/* Title overlay at bottom of image */}
                  <div className="absolute bottom-3 left-3 right-3">
                    <h3 className="text-base font-bold font-serif text-white drop-shadow-md line-clamp-2">
                      {ad.title}
                    </h3>
                  </div>
                </div>

                {/* Ad Content Body */}
                <div className="p-4 space-y-3 text-xs">
                  {ad.description && (
                    <p className="text-slate-600 dark:text-slate-300 leading-relaxed line-clamp-3">
                      {ad.description}
                    </p>
                  )}

                  {/* Metadata Row */}
                  <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-500 dark:text-slate-400 pt-1 border-t border-slate-100 dark:border-slate-800">
                    <div className="flex items-center gap-1 text-amber-700 dark:text-amber-400 font-semibold">
                      <Building2 className="w-3.5 h-3.5" />
                      <span>{ad.sponsorName || 'Jain Enterprise'}</span>
                    </div>

                    <div className="flex items-center gap-1 text-emerald-600 font-bold">
                      <ShieldCheck className="w-3 h-3" />
                      <span>Verified Ad</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons Footer */}
              <div className="p-4 pt-0 grid grid-cols-2 gap-2 text-xs">
                <a
                  href={`tel:${cleanPhone}`}
                  className="py-2.5 px-3 bg-amber-50 dark:bg-amber-950/40 hover:bg-amber-100 dark:hover:bg-amber-900/60 text-amber-800 dark:text-amber-300 font-bold rounded-xl border border-amber-200 dark:border-amber-800 flex items-center justify-center gap-1.5 transition-all"
                >
                  <Phone className="w-3.5 h-3.5 text-amber-600" />
                  <span>Call Now</span>
                </a>

                <a
                  href={`https://wa.me/${cleanPhone}?text=Hello,%20I%20saw%20your%20advertisement%20on%20Jain%20Connect%20Global.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-2.5 px-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-md flex items-center justify-center gap-1.5 transition-all"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>WhatsApp</span>
                </a>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
