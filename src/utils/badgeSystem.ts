import React from 'react';
import {
  HeartHandshake,
  HandHelping,
  Clock,
  Crown,
  Landmark,
  ShieldCheck,
  Sparkles,
  Zap,
  Award,
  Star,
  CheckCircle2,
} from 'lucide-react';
import { User, CommunityMemberProfile, MemberBadgeDefinition } from '../types';

export interface BadgeVisualConfig {
  icon: React.ComponentType<{ className?: string }>;
  tagline: string;
  description: string;
  category: 'Seva & Blood' | 'Community Service' | 'Tenure & Seniority' | 'Leadership' | 'Patronage';
  criteria: string;
  priority: number;
  
  // Theme styles for Digital ID Card (Auspicious Gold / Obsidian)
  auspicious: {
    badgeBg: string;
    textColor: string;
    borderColor: string;
    glowColor: string;
    iconColor: string;
    chipBg: string;
  };
  
  // Theme styles for Digital ID Card (Light Minimal)
  light: {
    badgeBg: string;
    textColor: string;
    borderColor: string;
    glowColor: string;
    iconColor: string;
    chipBg: string;
  };

  // Directory & Standard Pill
  pill: {
    bg: string;
    text: string;
    border: string;
  };
}

export const BADGE_SYSTEM_REGISTRY: Record<string, BadgeVisualConfig> = {
  'Verified Donor': {
    icon: HeartHandshake,
    tagline: 'Blood & Seva Contributor',
    description: 'Recognized for active participation in the Jain blood donation network and critical community medical relief.',
    category: 'Seva & Blood',
    criteria: 'Registered Blood Donor or Emergency Seva Sponsor',
    priority: 1,
    auspicious: {
      badgeBg: 'bg-gradient-to-r from-rose-950/90 via-red-900/80 to-amber-950/80',
      textColor: 'text-rose-200',
      borderColor: 'border-rose-500/60 shadow-[0_0_12px_rgba(244,63,94,0.35)]',
      glowColor: 'shadow-red-950/60',
      iconColor: 'text-rose-400',
      chipBg: 'bg-rose-500/20 text-rose-300 border-rose-500/40',
    },
    light: {
      badgeBg: 'bg-gradient-to-r from-rose-50 to-red-100',
      textColor: 'text-rose-900',
      borderColor: 'border-rose-300 shadow-sm',
      glowColor: 'shadow-rose-100',
      iconColor: 'text-rose-600',
      chipBg: 'bg-rose-100 text-rose-800 border-rose-200',
    },
    pill: {
      bg: 'bg-rose-50 dark:bg-rose-950/60',
      text: 'text-rose-700 dark:text-rose-300',
      border: 'border-rose-300 dark:border-rose-800',
    },
  },

  'Sangh Volunteer': {
    icon: HandHelping,
    tagline: 'Active Seva & Event Samiti',
    description: 'Selfless volunteer dedicated to temple events, tirth yatras, Sadhamik Bhakti food drives, and youth shivirs.',
    category: 'Community Service',
    criteria: 'Active Volunteer Enrollment or Sangh Committee Seva',
    priority: 2,
    auspicious: {
      badgeBg: 'bg-gradient-to-r from-emerald-950/90 via-teal-900/80 to-amber-950/80',
      textColor: 'text-emerald-200',
      borderColor: 'border-emerald-400/60 shadow-[0_0_12px_rgba(52,211,153,0.35)]',
      glowColor: 'shadow-emerald-950/60',
      iconColor: 'text-emerald-300',
      chipBg: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
    },
    light: {
      badgeBg: 'bg-gradient-to-r from-emerald-50 to-teal-100',
      textColor: 'text-emerald-900',
      borderColor: 'border-emerald-300 shadow-sm',
      glowColor: 'shadow-emerald-100',
      iconColor: 'text-emerald-600',
      chipBg: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    },
    pill: {
      bg: 'bg-emerald-50 dark:bg-emerald-950/60',
      text: 'text-emerald-700 dark:text-emerald-300',
      border: 'border-emerald-300 dark:border-emerald-800',
    },
  },

  'Long-time Member': {
    icon: Clock,
    tagline: 'Sangh Heritage & Seniority',
    description: 'Honored veteran member with an enduring legacy of participation and devotion within the global Jain community.',
    category: 'Tenure & Seniority',
    criteria: 'Seniority and continuous active standing in the Sangh',
    priority: 3,
    auspicious: {
      badgeBg: 'bg-gradient-to-r from-amber-950/95 via-yellow-950/80 to-slate-950/90',
      textColor: 'text-amber-200',
      borderColor: 'border-amber-400/70 shadow-[0_0_14px_rgba(251,191,36,0.35)]',
      glowColor: 'shadow-amber-950/60',
      iconColor: 'text-amber-300',
      chipBg: 'bg-amber-500/20 text-amber-200 border-amber-400/40',
    },
    light: {
      badgeBg: 'bg-gradient-to-r from-amber-50 via-yellow-100 to-amber-100',
      textColor: 'text-amber-900',
      borderColor: 'border-amber-300 shadow-sm',
      glowColor: 'shadow-amber-100',
      iconColor: 'text-amber-700',
      chipBg: 'bg-amber-100 text-amber-900 border-amber-300',
    },
    pill: {
      bg: 'bg-amber-50 dark:bg-amber-950/60',
      text: 'text-amber-800 dark:text-amber-300',
      border: 'border-amber-300 dark:border-amber-800',
    },
  },

  'Community Leader': {
    icon: Crown,
    tagline: 'President & Sangh Organizer',
    description: 'Executive committee member or chapter head leading community initiatives, religious events, and youth empowerment.',
    category: 'Leadership',
    criteria: 'Sangh Committee Member, President, or Verified Chapter Leader',
    priority: 4,
    auspicious: {
      badgeBg: 'bg-gradient-to-r from-purple-950/90 via-indigo-950/80 to-amber-950/80',
      textColor: 'text-purple-200',
      borderColor: 'border-purple-400/60 shadow-[0_0_12px_rgba(192,132,252,0.35)]',
      glowColor: 'shadow-purple-950/60',
      iconColor: 'text-purple-300',
      chipBg: 'bg-purple-500/20 text-purple-200 border-purple-400/40',
    },
    light: {
      badgeBg: 'bg-gradient-to-r from-purple-50 to-indigo-100',
      textColor: 'text-purple-900',
      borderColor: 'border-purple-300 shadow-sm',
      glowColor: 'shadow-purple-100',
      iconColor: 'text-purple-700',
      chipBg: 'bg-purple-100 text-purple-900 border-purple-200',
    },
    pill: {
      bg: 'bg-purple-50 dark:bg-purple-950/60',
      text: 'text-purple-700 dark:text-purple-300',
      border: 'border-purple-300 dark:border-purple-800',
    },
  },

  'Sangh Trustee': {
    icon: Landmark,
    tagline: 'Temple & Trust Executive',
    description: 'Appointed board trustee overseeing temple governance, dharmashalas, and religious trust foundations.',
    category: 'Leadership',
    criteria: 'Registered Trustee of a Recognized Jain Derasar / Trust',
    priority: 5,
    auspicious: {
      badgeBg: 'bg-gradient-to-r from-amber-900/90 via-orange-950/80 to-yellow-950/90',
      textColor: 'text-yellow-100',
      borderColor: 'border-yellow-400/80 shadow-[0_0_16px_rgba(234,179,8,0.4)]',
      glowColor: 'shadow-yellow-950/60',
      iconColor: 'text-yellow-300',
      chipBg: 'bg-yellow-500/25 text-yellow-200 border-yellow-400/50',
    },
    light: {
      badgeBg: 'bg-gradient-to-r from-yellow-50 to-amber-100',
      textColor: 'text-yellow-900',
      borderColor: 'border-yellow-300 shadow-sm',
      glowColor: 'shadow-yellow-100',
      iconColor: 'text-yellow-700',
      chipBg: 'bg-yellow-100 text-yellow-900 border-yellow-300',
    },
    pill: {
      bg: 'bg-yellow-50 dark:bg-yellow-950/60',
      text: 'text-yellow-800 dark:text-yellow-300',
      border: 'border-yellow-300 dark:border-yellow-800',
    },
  },

  'Life Patron': {
    icon: Star,
    tagline: 'Lifetime Sangh Benefactor',
    description: 'Pillar patron offering foundational support and lifelong patronage to the global Jain Sangh movement.',
    category: 'Patronage',
    criteria: 'Life Patron or Grand Benefactor of the Sangh',
    priority: 6,
    auspicious: {
      badgeBg: 'bg-gradient-to-r from-amber-900/90 via-amber-800/80 to-yellow-900/90',
      textColor: 'text-amber-100',
      borderColor: 'border-amber-300/80 shadow-[0_0_14px_rgba(245,158,11,0.35)]',
      glowColor: 'shadow-amber-950/60',
      iconColor: 'text-amber-300',
      chipBg: 'bg-amber-500/20 text-amber-200 border-amber-300/40',
    },
    light: {
      badgeBg: 'bg-gradient-to-r from-amber-50 to-amber-100',
      textColor: 'text-amber-900',
      borderColor: 'border-amber-300 shadow-sm',
      glowColor: 'shadow-amber-100',
      iconColor: 'text-amber-700',
      chipBg: 'bg-amber-100 text-amber-900 border-amber-200',
    },
    pill: {
      bg: 'bg-amber-100 dark:bg-amber-950',
      text: 'text-amber-900 dark:text-amber-200',
      border: 'border-amber-400 dark:border-amber-700',
    },
  },

  'Youth Ambassador': {
    icon: Zap,
    tagline: 'Next-Gen Jain Leader',
    description: 'Dynamic youth pioneer advocating Ahimsa, vegetarianism, and cultural values in educational and professional spheres.',
    category: 'Community Service',
    criteria: 'Recognized Youth Organizer or Jain Student Council Lead',
    priority: 7,
    auspicious: {
      badgeBg: 'bg-gradient-to-r from-cyan-950/90 via-blue-950/80 to-amber-950/80',
      textColor: 'text-cyan-200',
      borderColor: 'border-cyan-400/60 shadow-[0_0_12px_rgba(34,211,238,0.35)]',
      glowColor: 'shadow-cyan-950/60',
      iconColor: 'text-cyan-300',
      chipBg: 'bg-cyan-500/20 text-cyan-300 border-cyan-400/40',
    },
    light: {
      badgeBg: 'bg-gradient-to-r from-cyan-50 to-blue-100',
      textColor: 'text-cyan-900',
      borderColor: 'border-cyan-300 shadow-sm',
      glowColor: 'shadow-cyan-100',
      iconColor: 'text-cyan-700',
      chipBg: 'bg-cyan-100 text-cyan-900 border-cyan-200',
    },
    pill: {
      bg: 'bg-cyan-50 dark:bg-cyan-950/60',
      text: 'text-cyan-700 dark:text-cyan-300',
      border: 'border-cyan-300 dark:border-cyan-800',
    },
  },

  'Key Contributor': {
    icon: Award,
    tagline: 'Distinguished Contributor',
    description: 'Valued contributor providing professional, intellectual, and logistical support to community events.',
    category: 'Community Service',
    criteria: 'Community project author, health camp coordinator, or event organizer',
    priority: 8,
    auspicious: {
      badgeBg: 'bg-gradient-to-r from-orange-950/90 via-amber-950/80 to-slate-950/90',
      textColor: 'text-orange-200',
      borderColor: 'border-orange-400/60 shadow-[0_0_12px_rgba(251,146,60,0.35)]',
      glowColor: 'shadow-orange-950/60',
      iconColor: 'text-orange-300',
      chipBg: 'bg-orange-500/20 text-orange-300 border-orange-400/40',
    },
    light: {
      badgeBg: 'bg-gradient-to-r from-orange-50 to-amber-100',
      textColor: 'text-orange-900',
      borderColor: 'border-orange-300 shadow-sm',
      glowColor: 'shadow-orange-100',
      iconColor: 'text-orange-700',
      chipBg: 'bg-orange-100 text-orange-900 border-orange-200',
    },
    pill: {
      bg: 'bg-orange-50 dark:bg-orange-950/60',
      text: 'text-orange-800 dark:text-orange-300',
      border: 'border-orange-300 dark:border-orange-800',
    },
  },

  'Verified': {
    icon: ShieldCheck,
    tagline: 'ID & Phone Verified',
    description: 'Identity and phone number independently verified by Jain Connect Global administration.',
    category: 'Leadership',
    criteria: 'Government ID or community verification document approved',
    priority: 9,
    auspicious: {
      badgeBg: 'bg-gradient-to-r from-emerald-950/80 via-slate-900 to-slate-950',
      textColor: 'text-emerald-300',
      borderColor: 'border-emerald-500/50 shadow-sm',
      glowColor: 'shadow-emerald-950/40',
      iconColor: 'text-emerald-400',
      chipBg: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
    },
    light: {
      badgeBg: 'bg-gradient-to-r from-emerald-50 to-emerald-100',
      textColor: 'text-emerald-800',
      borderColor: 'border-emerald-300 shadow-sm',
      glowColor: 'shadow-emerald-100',
      iconColor: 'text-emerald-600',
      chipBg: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    },
    pill: {
      bg: 'bg-emerald-50 dark:bg-emerald-950/50',
      text: 'text-emerald-700 dark:text-emerald-300',
      border: 'border-emerald-300 dark:border-emerald-700',
    },
  },
};

/**
 * Resolves all eligible badges for a registered user or directory member.
 * Combines explicitly assigned badges with earned dynamic qualifications.
 */
export function resolveUserBadges(
  user: Partial<User> | Partial<CommunityMemberProfile> | null | undefined
): string[] {
  if (!user) return [];

  const badgeSet = new Set<string>();

  // 1. Explicitly assigned badges in profile
  if (Array.isArray(user.badges)) {
    user.badges.forEach((b) => {
      if (typeof b === 'string' && b.trim()) {
        badgeSet.add(b.trim());
      }
    });
  }

  // 2. Dynamic Rule: 'Verified Donor'
  const isDonor =
    (user as any).isBloodDonor === true ||
    (user as any).donorAvailable === true ||
    Boolean((user as any).bloodGroup && (user as any).donorMobile) ||
    Boolean((user as any).lastDonatedDate && (user as any).lastDonatedDate !== '');
  if (isDonor) {
    badgeSet.add('Verified Donor');
  }

  // 3. Dynamic Rule: 'Sangh Volunteer'
  const isVolunteer =
    (user as any).isVolunteer === true ||
    Boolean((user as any).volunteerRole) ||
    Boolean((user as any).volunteerInterests && (user as any).volunteerInterests.length > 0) ||
    (user as any).role === 'Temple Admin';
  if (isVolunteer) {
    badgeSet.add('Sangh Volunteer');
  }

  // 4. Dynamic Rule: 'Long-time Member'
  const userAny = user as any;
  const isLongTime =
    userAny.isLongTimeMember === true ||
    userAny.membershipTier === 'Elite' ||
    user.id === 'usr_admin_sandeep' ||
    user.id === 'mem_001' ||
    user.id === 'usr_002' ||
    user.id === 'mem_002' ||
    (userAny.createdAt && new Date(userAny.createdAt).getFullYear() <= 2026 && (userAny.role === 'Super Admin' || userAny.role === 'Business Owner'));
  if (isLongTime) {
    badgeSet.add('Long-time Member');
  }

  // 5. Dynamic Rule: 'Community Leader'
  const isLeader =
    userAny.role === 'Super Admin' ||
    userAny.role === 'Admin' ||
    userAny.isCommunityLeader === true ||
    userAny.membershipTier === 'Trustee';
  if (isLeader) {
    badgeSet.add('Community Leader');
  }

  // 6. Dynamic Rule: 'Sangh Trustee'
  const isTrustee =
    userAny.membershipTier === 'Trustee' ||
    userAny.role === 'Super Admin' ||
    user.id === 'usr_admin_sandeep' ||
    user.id === 'mem_001';
  if (isTrustee) {
    badgeSet.add('Sangh Trustee');
  }

  // 7. Dynamic Rule: 'Verified'
  if (user.isVerified) {
    badgeSet.add('Verified');
  }

  // Sort by priority based on registry
  return Array.from(badgeSet).sort((a, b) => {
    const priorityA = BADGE_SYSTEM_REGISTRY[a]?.priority ?? 99;
    const priorityB = BADGE_SYSTEM_REGISTRY[b]?.priority ?? 99;
    return priorityA - priorityB;
  });
}

/**
 * Return visual configuration for any badge string, falling back gracefully
 */
export function getBadgeVisualConfig(badgeName: string): BadgeVisualConfig {
  if (BADGE_SYSTEM_REGISTRY[badgeName]) {
    return BADGE_SYSTEM_REGISTRY[badgeName];
  }

  // Fallback for custom or unmapped badges
  return {
    icon: Award,
    tagline: 'Community Honor',
    description: `Special honor and recognized standing for "${badgeName}" within Jain Connect Global.`,
    category: 'Community Service',
    criteria: 'Awarded by Jain Sangh community administration',
    priority: 50,
    auspicious: {
      badgeBg: 'bg-gradient-to-r from-amber-950/80 via-slate-900 to-slate-950',
      textColor: 'text-amber-200',
      borderColor: 'border-amber-400/50 shadow-sm',
      glowColor: 'shadow-amber-950/40',
      iconColor: 'text-amber-300',
      chipBg: 'bg-amber-500/20 text-amber-200 border-amber-400/30',
    },
    light: {
      badgeBg: 'bg-gradient-to-r from-slate-100 to-amber-50',
      textColor: 'text-slate-800',
      borderColor: 'border-amber-300 shadow-sm',
      glowColor: 'shadow-slate-100',
      iconColor: 'text-amber-700',
      chipBg: 'bg-amber-100 text-amber-900 border-amber-200',
    },
    pill: {
      bg: 'bg-amber-50 dark:bg-amber-950/50',
      text: 'text-amber-800 dark:text-amber-300',
      border: 'border-amber-300 dark:border-amber-700',
    },
  };
}
