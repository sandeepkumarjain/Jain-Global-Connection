import React, { useState } from 'react';
import {
  ChevronDown,
  ChevronUp,
  Filter,
  Info,
  RotateCcw,
  Sparkles,
  Building2,
  Landmark,
  Check,
  Compass,
} from 'lucide-react';
import { TempleListing } from '../types';

export type TempleSignificanceTier = 'supreme' | 'major' | 'heritage' | 'community';
export type LegendColorMode = 'significance' | 'sect';

export interface SignificanceTierConfig {
  id: TempleSignificanceTier;
  title: string;
  hindiTitle: string;
  primaryColor: string;
  secondaryColor: string;
  glowColor: string;
  borderColor: string;
  pinSize: number;
  sizeCategory: string;
  roomsRange: string;
  description: string;
  examples: string;
  significanceNote: string;
}

export const SIGNIFICANCE_TIERS: Record<TempleSignificanceTier, SignificanceTierConfig> = {
  supreme: {
    id: 'supreme',
    title: 'Supreme Maha-Tirth',
    hindiTitle: 'महातीर्थ',
    primaryColor: '#dc2626', // Crimson Ruby
    secondaryColor: '#991b1b',
    glowColor: 'rgba(220, 38, 38, 0.65)',
    borderColor: '#fca5a5',
    pinSize: 40,
    sizeCategory: 'Apex Pilgrimage Complex',
    roomsRange: '200+ Pilgrim Rooms',
    description: 'Supreme all-India Nirvana & Kalyanak sacred sanctuaries with massive pilgrim capacity.',
    examples: 'Shatrunjaya (Palitana), Sammed Shikharji, Pawapuri Jal Mandir',
    significanceNote: 'Supreme spiritual status where Tirthankaras attained Nirvana; apex yatra destinations.',
  },
  major: {
    id: 'major',
    title: 'Major Pilgrimage Hub',
    hindiTitle: 'प्रमुख तीर्थ',
    primaryColor: '#d97706', // Royal Amber / Saffron
    secondaryColor: '#b45309',
    glowColor: 'rgba(217, 119, 6, 0.65)',
    borderColor: '#fcd34d',
    pinSize: 34,
    sizeCategory: 'Large Tirth Complex',
    roomsRange: '50–199 Guest Rooms',
    description: 'Major regional pilgrimage centers featuring daily Snatra Puja, bhojanashala & extensive stay.',
    examples: 'Ranakpur Adinath, Shravanabelagola Bahubali, Sanganer Sanghiji',
    significanceNote: 'Prominent atishay kshetra with extensive infrastructure, housing thousands of pilgrims annually.',
  },
  heritage: {
    id: 'heritage',
    title: 'Historic Heritage Tirth',
    hindiTitle: 'ऐतिहासिक तीर्थ',
    primaryColor: '#7c3aed', // Royal Amethyst
    secondaryColor: '#6d28d9',
    glowColor: 'rgba(124, 58, 237, 0.65)',
    borderColor: '#d8b4fe',
    pinSize: 30,
    sizeCategory: 'Heritage Monument',
    roomsRange: '20–49 Guest Rooms',
    description: 'Centuries-old sacred monuments celebrated for architectural wonder, marble carvings & ancient relics.',
    examples: 'Hutheesing Temple Ahmedabad, Lal Mandir Delhi',
    significanceNote: 'Monuments of extraordinary artistic, sculptural, and historical importance spanning 100+ years.',
  },
  community: {
    id: 'community',
    title: 'City Mandir & Derasar',
    hindiTitle: 'स्थानीय जिनालय',
    primaryColor: '#059669', // Sacred Emerald Jade
    secondaryColor: '#047857',
    glowColor: 'rgba(5, 150, 105, 0.6)',
    borderColor: '#6ee7b7',
    pinSize: 26,
    sizeCategory: 'Urban Community Shrine',
    roomsRange: '< 20 Rooms / Day Darshan',
    description: 'Urban city and neighborhood temples dedicated to daily Pakshal, Aarti, Samayik & community satsang.',
    examples: 'Walkeshwar Derasar Mumbai, local city mandirs',
    significanceNote: 'Vital spiritual hubs anchoring daily community practice, morning puja, and evening pratikraman.',
  },
};

export const SECT_LEGEND_CONFIG = {
  swetambar: {
    label: 'Swetambar',
    hindi: 'श्वेताम्बर',
    color: '#d97706',
    desc: 'Murtipujak, Sthanakvasi, & Terapanthi',
  },
  digambar: {
    label: 'Digambar',
    hindi: 'दिगम्बर',
    color: '#059669',
    desc: 'Bisapanthi, Terapanthi, & Taranpanthi',
  },
  joint: {
    label: 'Joint Tirth',
    hindi: 'संयुक्त तीर्थ',
    color: '#7c3aed',
    desc: 'Swetambar & Digambar Joint Sanctum',
  },
};

/**
 * Determine a temple's significance tier based on rooms, history, and sacred standing
 */
export function getTempleSignificanceTier(temple: TempleListing): TempleSignificanceTier {
  const rooms = temple.dharamshalaRooms || 0;
  const name = temple.templeName.toLowerCase();
  const hist = (temple.history || '').toLowerCase();

  // Supreme Maha-Tirth (Apex holy sites or 200+ rooms)
  if (
    rooms >= 200 ||
    name.includes('palitana') ||
    name.includes('shatrunjaya') ||
    name.includes('shikharji') ||
    name.includes('sammed') ||
    name.includes('pawapuri') ||
    name.includes('girnar') ||
    hist.includes('nirvana') && rooms >= 100
  ) {
    return 'supreme';
  }

  // Major Pilgrimage Hub (50-199 rooms or prominent atishay kshetra)
  if (
    rooms >= 50 ||
    name.includes('ranakpur') ||
    name.includes('bahubali') ||
    name.includes('shravanabelagola') ||
    name.includes('sanganer')
  ) {
    return 'major';
  }

  // Historic Heritage (Centuries old, joint sects, or 20-49 rooms)
  if (
    rooms >= 20 ||
    name.includes('hutheesing') ||
    name.includes('lal mandir') ||
    temple.sect.includes('&') ||
    hist.includes('century') ||
    hist.includes('ancient') ||
    hist.includes('heritage')
  ) {
    return 'heritage';
  }

  // City & Community Mandir
  return 'community';
}

export interface TempleMapLegendProps {
  temples: TempleListing[];
  colorMode: LegendColorMode;
  onColorModeChange: (mode: LegendColorMode) => void;
  activeTierFilter: TempleSignificanceTier | 'all';
  onTierFilterChange: (tier: TempleSignificanceTier | 'all') => void;
  hoveredTier: TempleSignificanceTier | null;
  onHoverTier: (tier: TempleSignificanceTier | null) => void;
  userLocation: { lat: number; lng: number } | null;
  className?: string;
}

export const TempleMapLegend: React.FC<TempleMapLegendProps> = ({
  temples,
  colorMode,
  onColorModeChange,
  activeTierFilter,
  onTierFilterChange,
  hoveredTier,
  onHoverTier,
  userLocation,
  className = '',
}) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [showCriteriaModal, setShowCriteriaModal] = useState(false);

  // Compute counts per tier from current temple collection
  const tierCounts = React.useMemo(() => {
    const counts: Record<TempleSignificanceTier, number> = {
      supreme: 0,
      major: 0,
      heritage: 0,
      community: 0,
    };
    temples.forEach((t) => {
      const tier = getTempleSignificanceTier(t);
      counts[tier] = (counts[tier] || 0) + 1;
    });
    return counts;
  }, [temples]);

  // Compute sect counts
  const sectCounts = React.useMemo(() => {
    let swetambar = 0;
    let digambar = 0;
    let joint = 0;
    temples.forEach((t) => {
      const isSwet = t.sect.toLowerCase().includes('swetambar');
      const isDig = t.sect.toLowerCase().includes('digambar');
      if (isSwet && isDig) joint++;
      else if (isDig) digambar++;
      else swetambar++;
    });
    return { swetambar, digambar, joint };
  }, [temples]);

  const activeTierConfig = activeTierFilter !== 'all' ? SIGNIFICANCE_TIERS[activeTierFilter] : null;

  return (
    <div
      id="leaflet-interactive-temple-legend"
      className={`select-none pointer-events-auto transition-all duration-300 font-sans ${className}`}
      onMouseDown={(e) => e.stopPropagation()}
      onClick={(e) => e.stopPropagation()}
      onDoubleClick={(e) => e.stopPropagation()}
      onWheel={(e) => e.stopPropagation()}
      onTouchStart={(e) => e.stopPropagation()}
    >
      {/* Collapsed Pill View */}
      {!isExpanded ? (
        <button
          type="button"
          onClick={() => setIsExpanded(true)}
          className="flex items-center gap-2 px-3 py-2 bg-slate-950/90 hover:bg-slate-900 backdrop-blur-md border border-amber-500/50 hover:border-amber-400 text-white rounded-xl shadow-2xl transition-all group cursor-pointer"
          title="Click to expand interactive temple marker legend"
        >
          <div className="flex items-center -space-x-1.5">
            <span className="w-3 h-3 rounded-full bg-red-600 border border-white shadow-xs" />
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 border border-white shadow-xs" />
            <span className="w-2 h-2 rounded-full bg-purple-600 border border-white shadow-xs" />
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 border border-white shadow-xs" />
          </div>

          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-100">
            <span>Map Legend</span>
            {activeTierFilter !== 'all' && (
              <span className="px-1.5 py-0.2 bg-amber-500 text-slate-950 rounded text-[10px] font-black">
                {activeTierConfig?.hindiTitle}
              </span>
            )}
          </div>

          <ChevronUp className="w-3.5 h-3.5 text-amber-400 group-hover:translate-y-[-1px] transition-transform ml-0.5" />
        </button>
      ) : (
        /* Expanded Card View */
        <div className="w-[300px] sm:w-[325px] bg-slate-950/95 backdrop-blur-md border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden text-slate-100 text-xs">
          {/* Header */}
          <div className="px-3.5 py-2.5 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-1 bg-amber-500/20 text-amber-400 rounded-lg border border-amber-500/40">
                <Compass className="w-3.5 h-3.5" />
              </div>
              <div>
                <h4 className="font-bold text-[12px] text-white flex items-center gap-1.5 leading-none">
                  <span>Marker Color & Size Guide</span>
                </h4>
                <p className="text-[10px] text-amber-400/90 font-medium mt-0.5">
                  Interactive Tirth Significance
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setShowCriteriaModal(!showCriteriaModal)}
                className={`p-1 rounded-lg transition-colors cursor-pointer ${
                  showCriteriaModal
                    ? 'bg-amber-500 text-slate-950 font-bold'
                    : 'text-slate-400 hover:text-amber-300 hover:bg-slate-800'
                }`}
                title="View classification criteria"
              >
                <Info className="w-3.5 h-3.5" />
              </button>

              <button
                type="button"
                onClick={() => setIsExpanded(false)}
                className="p-1 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                title="Minimize legend overlay"
              >
                <ChevronDown className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Color Mode Switcher Tab */}
          <div className="px-3 pt-2 pb-1.5 flex items-center justify-between border-b border-slate-800/80 bg-slate-900/50">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Color Coded By:
            </span>
            <div className="flex items-center bg-slate-800/80 p-0.5 rounded-lg border border-slate-700/60">
              <button
                type="button"
                onClick={() => onColorModeChange('significance')}
                className={`px-2 py-0.5 text-[10px] font-bold rounded-md transition-all cursor-pointer ${
                  colorMode === 'significance'
                    ? 'bg-amber-500 text-slate-950 shadow-xs'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                Size & Significance
              </button>
              <button
                type="button"
                onClick={() => onColorModeChange('sect')}
                className={`px-2 py-0.5 text-[10px] font-bold rounded-md transition-all cursor-pointer ${
                  colorMode === 'sect'
                    ? 'bg-amber-500 text-slate-950 shadow-xs'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                Jain Sect
              </button>
            </div>
          </div>

          {/* Significance Classification Criteria Sub-Banner (Toggleable) */}
          {showCriteriaModal && (
            <div className="p-3 bg-amber-950/40 border-b border-amber-500/30 space-y-1.5 animate-fadeIn text-[11px]">
              <div className="flex items-center gap-1.5 text-amber-300 font-bold">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>How are markers sized & colored?</span>
              </div>
              <p className="text-slate-300 leading-relaxed text-[10px]">
                Marker pin dimensions (26px to 40px) and vibrant colors correspond directly to pilgrim volume capacity (Dharamshala rooms), ancient architectural scale, and supreme Nirvana/Kalyanak tirth significance.
              </p>
            </div>
          )}

          {/* Body Content */}
          <div className="p-2.5 space-y-1.5 max-h-[260px] overflow-y-auto no-scrollbar">
            {colorMode === 'significance' ? (
              /* SIZE & SIGNIFICANCE TIERS */
              (Object.keys(SIGNIFICANCE_TIERS) as TempleSignificanceTier[]).map((tierKey) => {
                const tier = SIGNIFICANCE_TIERS[tierKey];
                const count = tierCounts[tierKey] || 0;
                const isFiltered = activeTierFilter === tierKey;
                const isHovered = hoveredTier === tierKey;

                return (
                  <div
                    key={tier.id}
                    onClick={() => {
                      // Toggle filtering on click
                      if (activeTierFilter === tierKey) {
                        onTierFilterChange('all');
                      } else {
                        onTierFilterChange(tierKey);
                      }
                    }}
                    onMouseEnter={() => onHoverTier(tierKey)}
                    onMouseLeave={() => onHoverTier(null)}
                    className={`group relative p-2 rounded-xl border transition-all cursor-pointer ${
                      isFiltered
                        ? 'bg-amber-500/15 border-amber-400 shadow-md ring-1 ring-amber-400/50'
                        : isHovered
                        ? 'bg-slate-800/80 border-slate-600'
                        : 'bg-slate-900/60 hover:bg-slate-800/50 border-slate-800/90'
                    }`}
                    title={`Click to filter map to only show ${tier.title}`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      {/* Color Dot & Pin Preview */}
                      <div className="flex items-start gap-2.5">
                        <div className="relative pt-0.5">
                          {/* Visual Pin Marker Miniature */}
                          <div
                            className="rounded-full flex items-center justify-center shadow-md border-2 border-white transition-transform group-hover:scale-110"
                            style={{
                              width: `${Math.max(18, Math.round(tier.pinSize * 0.58))}px`,
                              height: `${Math.max(18, Math.round(tier.pinSize * 0.58))}px`,
                              backgroundColor: tier.primaryColor,
                              boxShadow: `0 0 10px ${tier.glowColor}`,
                            }}
                          >
                            {tier.id === 'supreme' ? (
                              <Building2 className="w-2.5 h-2.5 text-white" />
                            ) : (
                              <Landmark className="w-2.5 h-2.5 text-white" />
                            )}
                          </div>
                        </div>

                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="font-extrabold text-[11px] text-white group-hover:text-amber-300 transition-colors">
                              {tier.title}
                            </span>
                            <span className="text-[10px] font-serif text-amber-400/80">
                              ({tier.hindiTitle})
                            </span>
                          </div>

                          <div className="flex items-center gap-2 mt-0.5 text-[10px]">
                            <span
                              className="font-bold px-1.5 py-0.2 rounded-md border text-[9px]"
                              style={{
                                color: tier.primaryColor,
                                borderColor: `${tier.primaryColor}55`,
                                backgroundColor: `${tier.primaryColor}15`,
                              }}
                            >
                              {tier.roomsRange}
                            </span>
                            <span className="text-slate-400 text-[10px]">
                              Pin: {tier.pinSize}px
                            </span>
                          </div>

                          <p className="text-[9.5px] text-slate-400 mt-1 line-clamp-1 leading-snug">
                            {tier.examples}
                          </p>
                        </div>
                      </div>

                      {/* Count Badge & Selection Indicator */}
                      <div className="flex flex-col items-end gap-1 shrink-0">
                        <span
                          className={`px-2 py-0.5 text-[10px] font-black rounded-lg transition-all ${
                            isFiltered
                              ? 'bg-amber-500 text-slate-950 shadow-xs'
                              : 'bg-slate-800 text-slate-300 group-hover:bg-slate-700'
                          }`}
                        >
                          {count} {count === 1 ? 'Tirth' : 'Tirths'}
                        </span>

                        {isFiltered && (
                          <span className="text-[9px] text-amber-400 font-extrabold flex items-center gap-0.5">
                            <Check className="w-2.5 h-2.5" /> Active Filter
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              /* JAIN SECT MODE */
              <div className="space-y-1.5">
                <div className="p-2 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="w-4 h-4 rounded-full bg-amber-500 border-2 border-white shadow-xs" />
                    <div>
                      <span className="font-bold text-white text-[11px]">
                        {SECT_LEGEND_CONFIG.swetambar.label} ({SECT_LEGEND_CONFIG.swetambar.hindi})
                      </span>
                      <p className="text-[9.5px] text-slate-400">
                        {SECT_LEGEND_CONFIG.swetambar.desc}
                      </p>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 bg-slate-800 text-slate-300 text-[10px] font-bold rounded-lg">
                    {sectCounts.swetambar}
                  </span>
                </div>

                <div className="p-2 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="w-4 h-4 rounded-full bg-emerald-600 border-2 border-white shadow-xs" />
                    <div>
                      <span className="font-bold text-white text-[11px]">
                        {SECT_LEGEND_CONFIG.digambar.label} ({SECT_LEGEND_CONFIG.digambar.hindi})
                      </span>
                      <p className="text-[9.5px] text-slate-400">
                        {SECT_LEGEND_CONFIG.digambar.desc}
                      </p>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 bg-slate-800 text-slate-300 text-[10px] font-bold rounded-lg">
                    {sectCounts.digambar}
                  </span>
                </div>

                <div className="p-2 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="w-4 h-4 rounded-full bg-purple-600 border-2 border-white shadow-xs" />
                    <div>
                      <span className="font-bold text-white text-[11px]">
                        {SECT_LEGEND_CONFIG.joint.label} ({SECT_LEGEND_CONFIG.joint.hindi})
                      </span>
                      <p className="text-[9.5px] text-slate-400">
                        {SECT_LEGEND_CONFIG.joint.desc}
                      </p>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 bg-slate-800 text-slate-300 text-[10px] font-bold rounded-lg">
                    {sectCounts.joint}
                  </span>
                </div>
              </div>
            )}

            {/* GPS Marker Guide if Location active */}
            {userLocation && (
              <div className="pt-1 flex items-center justify-between text-[10px] text-slate-400 border-t border-slate-800/80 px-1">
                <span className="flex items-center gap-1.5">
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-sky-500" />
                  </span>
                  <span>Your GPS Location</span>
                </span>
                <span className="text-[9px] text-sky-400 font-mono">Live Beacon</span>
              </div>
            )}
          </div>

          {/* Interactive Footer & Filter Actions */}
          <div className="px-3 py-2 bg-slate-900/90 border-t border-slate-800 flex items-center justify-between text-[10px]">
            <span className="text-slate-400 font-medium">
              {activeTierFilter !== 'all' ? (
                <span className="text-amber-300 font-bold flex items-center gap-1">
                  <Filter className="w-3 h-3" />
                  Showing {tierCounts[activeTierFilter]} {activeTierConfig?.title}
                </span>
              ) : (
                <span>Showing all {temples.length} temples</span>
              )}
            </span>

            {activeTierFilter !== 'all' ? (
              <button
                type="button"
                onClick={() => onTierFilterChange('all')}
                className="px-2 py-0.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black rounded-md flex items-center gap-1 transition-colors cursor-pointer"
                title="Reset tier filter to show all temples"
              >
                <RotateCcw className="w-2.5 h-2.5" />
                <span>Show All</span>
              </button>
            ) : (
              <span className="text-slate-500 italic text-[9.5px]">
                Click any tier to filter
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
