-- SUPABASE DATABASE SCHEMA FOR JAIN CONNECT GLOBAL
-- Run this script in your Supabase SQL Editor (https://supabase.com/dashboard/project/_/sql)

-- 1. Users Table
CREATE TABLE IF NOT EXISTS public.users (
  id TEXT PRIMARY KEY,
  "fullName" TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  mobile TEXT,
  role TEXT DEFAULT 'User',
  status TEXT DEFAULT 'Active',
  city TEXT,
  state TEXT,
  country TEXT,
  gotra TEXT,
  sect TEXT,
  "profilePicture" TEXT,
  "createdAt" TIMESTAMPTZ DEFAULT NOW(),
  "isVerified" BOOLEAN DEFAULT FALSE
);

-- 2. Matrimonials Table
CREATE TABLE IF NOT EXISTS public.matrimonials (
  id TEXT PRIMARY KEY,
  "userId" TEXT,
  "fullName" TEXT NOT NULL,
  gender TEXT,
  age INT,
  "birthDate" TEXT,
  height TEXT,
  education TEXT,
  occupation TEXT,
  income TEXT,
  city TEXT,
  state TEXT,
  gotra TEXT,
  sect TEXT,
  diet TEXT,
  bio TEXT,
  photos JSONB DEFAULT '[]'::jsonb,
  "contactNumber" TEXT,
  "interestsReceived" JSONB DEFAULT '[]'::jsonb,
  "interestsAccepted" JSONB DEFAULT '[]'::jsonb,
  "isApproved" BOOLEAN DEFAULT TRUE,
  "createdAt" TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Businesses Table
CREATE TABLE IF NOT EXISTS public.businesses (
  id TEXT PRIMARY KEY,
  "ownerUserId" TEXT,
  "businessName" TEXT NOT NULL,
  category TEXT,
  description TEXT,
  city TEXT,
  state TEXT,
  address TEXT,
  mobile TEXT,
  email TEXT,
  website TEXT,
  "logoUrl" TEXT,
  "isVerified" BOOLEAN DEFAULT FALSE,
  status TEXT DEFAULT 'Approved',
  "createdAt" TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Temples Table
CREATE TABLE IF NOT EXISTS public.temples (
  id TEXT PRIMARY KEY,
  "templeName" TEXT NOT NULL,
  sect TEXT,
  city TEXT,
  state TEXT,
  address TEXT,
  pincode TEXT,
  "trustContact" TEXT,
  "imageUrls" JSONB DEFAULT '[]'::jsonb,
  description TEXT,
  timings TEXT,
  "isVerified" BOOLEAN DEFAULT TRUE,
  "createdAt" TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Members Table (Jain Directory)
CREATE TABLE IF NOT EXISTS public.members (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  city TEXT,
  state TEXT,
  mobile TEXT,
  email TEXT,
  gotra TEXT,
  sect TEXT,
  profession TEXT,
  "bloodGroup" TEXT,
  "createdAt" TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Posts Table (Community Feed)
CREATE TABLE IF NOT EXISTS public.posts (
  id TEXT PRIMARY KEY,
  "authorId" TEXT,
  "authorName" TEXT,
  "authorAvatar" TEXT,
  "authorRole" TEXT,
  content TEXT NOT NULL,
  "imageUrl" TEXT,
  category TEXT DEFAULT 'General',
  "createdAt" TIMESTAMPTZ DEFAULT NOW(),
  "likesCount" INT DEFAULT 0,
  "likedByUsers" JSONB DEFAULT '[]'::jsonb,
  comments JSONB DEFAULT '[]'::jsonb
);

-- 7. News Table
CREATE TABLE IF NOT EXISTS public.news (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  summary TEXT,
  content TEXT,
  category TEXT DEFAULT 'Global News',
  "imageUrl" TEXT,
  "publishedDate" TEXT,
  author TEXT,
  "isPinned" BOOLEAN DEFAULT FALSE
);

-- 8. Ads Table (Sponsorships)
CREATE TABLE IF NOT EXISTS public.ads (
  id TEXT PRIMARY KEY,
  "businessId" TEXT,
  "ownerUserId" TEXT,
  title TEXT NOT NULL,
  "imageUrl" TEXT,
  "sponsorName" TEXT,
  "offerDiscount" TEXT,
  "contactMobile" TEXT,
  "startDate" TEXT,
  "expiryDate" TEXT,
  "isActive" BOOLEAN DEFAULT TRUE,
  "clicksCount" INT DEFAULT 0
);

-- 9. Panchang Table
CREATE TABLE IF NOT EXISTS public.panchang (
  id TEXT PRIMARY KEY,
  date TEXT,
  tithi TEXT,
  sunrise TEXT,
  sunset TEXT,
  "choghadiyaDay" TEXT,
  "choghadiyaNight" TEXT,
  kalyanak TEXT,
  quote TEXT,
  pravachan TEXT,
  "updatedAt" TIMESTAMPTZ DEFAULT NOW()
);

-- 10. Blood Donors Table
CREATE TABLE IF NOT EXISTS public.blood_donors (
  id TEXT PRIMARY KEY,
  "userId" TEXT,
  name TEXT NOT NULL,
  "bloodGroup" TEXT NOT NULL,
  city TEXT,
  state TEXT,
  mobile TEXT NOT NULL,
  available BOOLEAN DEFAULT TRUE,
  "registeredDate" TEXT
);

-- 11. Jobs Table
CREATE TABLE IF NOT EXISTS public.jobs (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  company TEXT NOT NULL,
  location TEXT,
  type TEXT DEFAULT 'Full-Time',
  description TEXT,
  salary TEXT,
  "contactEmail" TEXT,
  "postedDate" TEXT
);

-- 12. Bhajans Table
CREATE TABLE IF NOT EXISTS public.bhajans (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  "hindiTitle" TEXT,
  category TEXT,
  "audioUrl" TEXT NOT NULL,
  singer TEXT,
  lyrics TEXT,
  "durationSeconds" INT DEFAULT 0,
  "isActive" BOOLEAN DEFAULT TRUE
);

-- 13. Dynamic Custom Pages Table
CREATE TABLE IF NOT EXISTS public.pages (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  category TEXT,
  "bannerImage" TEXT,
  content TEXT,
  "isPublished" BOOLEAN DEFAULT TRUE,
  "createdAt" TEXT,
  "updatedAt" TEXT
);

-- 14. Global Portal Settings Table
CREATE TABLE IF NOT EXISTS public.settings (
  id TEXT PRIMARY KEY,
  "appName" TEXT,
  tagline TEXT,
  "contactPhone" TEXT,
  "contactEmail" TEXT,
  address TEXT,
  "primaryColor" TEXT,
  "secondaryColor" TEXT,
  "enableMatrimonialApproval" BOOLEAN,
  "enableBusinessApproval" BOOLEAN,
  "updatedAt" TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security (RLS) & Grant Public Read/Write Access for Supabase
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public Users Access" ON public.users FOR ALL USING (true) WITH CHECK (true);

ALTER TABLE public.matrimonials ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public Matrimonials Access" ON public.matrimonials FOR ALL USING (true) WITH CHECK (true);

ALTER TABLE public.businesses ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public Businesses Access" ON public.businesses FOR ALL USING (true) WITH CHECK (true);

ALTER TABLE public.temples ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public Temples Access" ON public.temples FOR ALL USING (true) WITH CHECK (true);

ALTER TABLE public.members ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public Members Access" ON public.members FOR ALL USING (true) WITH CHECK (true);

ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public Posts Access" ON public.posts FOR ALL USING (true) WITH CHECK (true);

ALTER TABLE public.news ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public News Access" ON public.news FOR ALL USING (true) WITH CHECK (true);

ALTER TABLE public.ads ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public Ads Access" ON public.ads FOR ALL USING (true) WITH CHECK (true);

ALTER TABLE public.panchang ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public Panchang Access" ON public.panchang FOR ALL USING (true) WITH CHECK (true);

ALTER TABLE public.blood_donors ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public Blood Donors Access" ON public.blood_donors FOR ALL USING (true) WITH CHECK (true);

ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public Jobs Access" ON public.jobs FOR ALL USING (true) WITH CHECK (true);

ALTER TABLE public.bhajans ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public Bhajans Access" ON public.bhajans FOR ALL USING (true) WITH CHECK (true);

ALTER TABLE public.pages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public Pages Access" ON public.pages FOR ALL USING (true) WITH CHECK (true);

ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public Settings Access" ON public.settings FOR ALL USING (true) WITH CHECK (true);
