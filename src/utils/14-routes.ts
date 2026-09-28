/**
 * Central route map for the single-page app.
 * Shared by the React client (URL <-> tab sync) and the Express server
 * (robots.txt, sitemap.xml and per-route SEO meta injection).
 *
 * Pure data + helpers only: no React, no Node APIs, safe to bundle anywhere.
 */

export type AppTab =
  | 'home'
  | 'matrimonial'
  | 'business'
  | 'directory'
  | 'temple'
  | 'panchang'
  | 'feed'
  | 'emergency'
  | 'pandit'
  | 'admin';

export interface RouteMeta {
  tab: AppTab;
  path: string;
  title: string;
  description: string;
  /** Short plain-text summary used for the crawlable pre-render block. */
  summary: string;
  /** Whether the route should be listed in sitemap.xml / allowed to index. */
  indexable: boolean;
}

export const ROUTES: RouteMeta[] = [
  {
    tab: 'home',
    path: '/',
    title: 'Jain Connect Global - One Platform for Every Jain, Business & Temple',
    description:
      'One Platform for Every Jain, Every Business, Every Temple, Every Family. Features Matrimonial, Business, Temple Directory, Panchang, and Ask a Pandit AI Scriptural Guide.',
    summary:
      'Jain Connect Global brings the worldwide Jain community together: a verified Jain matrimonial bureau, a Jain business directory, a holy temple and tirth directory, a global family census, daily Jain Panchang and tithi, community news, devotional bhajans, and an AI scriptural guide (Ask a Pandit).',
    indexable: true,
  },
  {
    tab: 'matrimonial',
    path: '/matrimonial',
    title: 'Jain Matrimonial | Jain Connect Global',
    description:
      'Find verified Jain matrimonial profiles across Digambar, Shwetambar, Sthanakvasi, and Terapanthi sects.',
    summary:
      'Browse a public preview of verified Jain brides and grooms across Digambar, Shwetambar, Sthanakvasi and Terapanthi traditions. Sign in to view full biodatas, family details and contact information.',
    indexable: true,
  },
  {
    tab: 'business',
    path: '/business',
    title: 'Jain Business Directory | Jain Connect Global',
    description:
      'Discover and connect with trusted Jain entrepreneurs, businesses, and digital visiting cards globally.',
    summary:
      'Discover verified Jain-owned businesses worldwide - jewellers, chartered accountants, IT firms, real estate, manufacturers and professional services - with GST verification and digital visiting cards.',
    indexable: true,
  },
  {
    tab: 'directory',
    path: '/directory',
    title: 'Global Member Directory | Jain Connect Global',
    description:
      'Search verified Jain members, community leaders, and local sanghs worldwide.',
    summary:
      'Search the global Jain family and community census, city-wise Jain mandals and sanghas on the Global Sangha Map. Contact details stay protected for registered members.',
    indexable: true,
  },
  {
    tab: 'temple',
    path: '/temples',
    title: 'Jain Temples & Teerth Directory | Jain Connect Global',
    description:
      'Explore holy Jain temples, teerthkshetras, dharmashalas, and trusts with photos and maps.',
    summary:
      'Explore sacred Jain derasars and teerthkshetras worldwide with aarti timings, dharamshala and bhojanalaya facilities, photos, maps and virtual tours.',
    indexable: true,
  },
  {
    tab: 'panchang',
    path: '/panchang',
    title: 'Jain Panchang & Daily Tithi | Jain Connect Global',
    description:
      'Access live Jain Panchang, Navkarshi, Chouvihar timings, Kalyanaks, and festive dates.',
    summary:
      'Daily Jain Panchang with tithi, Navkarshi and Chouvihar timings, Kalyanak dates, Paryushan and festival alerts, and daily Jain wisdom quotes.',
    indexable: true,
  },
  {
    tab: 'feed',
    path: '/feed',
    title: 'Community Feed & News | Jain Connect Global',
    description:
      'Read community posts, announcements, upcoming events, and spiritual articles from the global Jain sangh.',
    summary:
      'Community announcements, Jain events, spiritual articles and news from the global Jain sangh.',
    indexable: true,
  },
  {
    tab: 'emergency',
    path: '/emergency',
    title: 'Emergency Help & Blood Donors | Jain Connect Global',
    description:
      '24/7 Jain emergency contacts, blood donor network, medical aid, and sangh support.',
    summary:
      '24/7 Jain emergency help directory: blood donor network, medical aid contacts and sangh support services.',
    indexable: true,
  },
  {
    tab: 'pandit',
    path: '/pandit',
    title: 'Ask a Pandit (AI Scriptural Guide) | Jain Connect Global',
    description:
      'Instant scriptural answers on Jain rituals, Ashtaprakari Puja, Pachkan vows, and Agamas powered by Gemini.',
    summary:
      'Ask a Pandit: an AI scriptural guide for Jain rituals, puja vidhi, pachkan vows, mantras and Agama-based answers for Shwetambar and Digambar traditions.',
    indexable: true,
  },
  {
    tab: 'admin',
    path: '/admin',
    title: 'Admin Control Panel | Jain Connect Global',
    description: 'Restricted administration area for Jain Connect Global.',
    summary: 'Restricted administration area.',
    indexable: false,
  },
];

export const TAB_TO_PATH: Record<AppTab, string> = ROUTES.reduce(
  (acc, r) => ({ ...acc, [r.tab]: r.path }),
  {} as Record<AppTab, string>
);

const PATH_TO_ROUTE: Record<string, RouteMeta> = ROUTES.reduce(
  (acc, r) => ({ ...acc, [r.path]: r }),
  {} as Record<string, RouteMeta>
);

/** Resolve a URL pathname to its route meta. Returns undefined for unknown paths. */
export const routeFromPath = (pathname: string): RouteMeta | undefined => {
  const clean = (pathname || '/').replace(/\/+$/, '') || '/';
  return PATH_TO_ROUTE[clean];
};

/** Resolve a URL pathname to a tab id, or null when the path is unknown. */
export const tabFromPath = (pathname: string): AppTab | null => {
  return routeFromPath(pathname)?.tab ?? null;
};

/** Backwards-compatible per-tab meta lookup (used by the client Helmet tags). */
export const getTabMetaData = (tab: string): { title: string; description: string } => {
  const found = ROUTES.find((r) => r.tab === tab) || ROUTES[0];
  return { title: found.title, description: found.description };
};

/** Escape text for safe inclusion inside HTML. */
export const escapeHtml = (value: string): string =>
  String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
