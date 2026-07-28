-- SUPABASE DATABASE SCHEMA FOR JAIN CONNECT GLOBAL
-- Run this script in your Supabase SQL Editor (https://supabase.com/dashboard/project/_/sql)

-- 1. Users Table
CREATE TABLE IF NOT EXISTS public.users (
  id TEXT PRIMARY KEY,
  "applicationId" TEXT,
  "fullName" TEXT NOT NULL,
  surname TEXT,
  email TEXT,
  mobile TEXT,
  whatsapp TEXT,
  role TEXT DEFAULT 'Member',
  status TEXT DEFAULT 'Active',
  "registrationType" TEXT,
  gender TEXT,
  dob TEXT,
  age INT,
  "maritalStatus" TEXT,
  sect TEXT,
  "subSect" TEXT,
  gotra TEXT,
  qualification TEXT,
  occupation TEXT,
  company TEXT,
  address TEXT,
  country TEXT,
  state TEXT,
  city TEXT,
  pincode TEXT,
  "profilePicture" TEXT,
  "profilePhoto" TEXT,
  "idProofUrl" TEXT,
  "isVerified" BOOLEAN DEFAULT FALSE,
  "membershipTier" TEXT,
  "createdAt" TIMESTAMPTZ DEFAULT NOW(),
  "bloodGroup" TEXT,
  "qrCodeUrl" TEXT,
  "themePreference" TEXT,
  "extraData" JSONB DEFAULT '{}'::jsonb
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
  "createdAt" TIMESTAMPTZ DEFAULT NOW(),
  "extraData" JSONB DEFAULT '{}'::jsonb
);

-- 3. Businesses Table
CREATE TABLE IF NOT EXISTS public.businesses (
  id TEXT PRIMARY KEY,
  "ownerUserId" TEXT,
  "ownerId" TEXT,
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
  "createdAt" TIMESTAMPTZ DEFAULT NOW(),
  "productsAndServices" JSONB DEFAULT '[]'::jsonb,
  "galleryUrls" JSONB DEFAULT '[]'::jsonb,
  "isSponsored" BOOLEAN DEFAULT FALSE,
  rating NUMERIC DEFAULT 5.0,
  "reviewCount" INT DEFAULT 0,
  "extraData" JSONB DEFAULT '{}'::jsonb
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
  "createdAt" TIMESTAMPTZ DEFAULT NOW(),
  "dharamshalaAvailable" BOOLEAN DEFAULT FALSE,
  "bhojanalayaAvailable" BOOLEAN DEFAULT FALSE,
  "googleMapUrl" TEXT,
  "extraData" JSONB DEFAULT '{}'::jsonb
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
  "createdAt" TIMESTAMPTZ DEFAULT NOW(),
  "extraData" JSONB DEFAULT '{}'::jsonb
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
  comments JSONB DEFAULT '[]'::jsonb,
  "extraData" JSONB DEFAULT '{}'::jsonb
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
  "isPinned" BOOLEAN DEFAULT FALSE,
  "extraData" JSONB DEFAULT '{}'::jsonb
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
  "clicksCount" INT DEFAULT 0,
  "extraData" JSONB DEFAULT '{}'::jsonb
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
  "updatedAt" TIMESTAMPTZ DEFAULT NOW(),
  "extraData" JSONB DEFAULT '{}'::jsonb
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
  "registeredDate" TEXT,
  "extraData" JSONB DEFAULT '{}'::jsonb
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
  "postedDate" TEXT,
  "extraData" JSONB DEFAULT '{}'::jsonb
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
  "isActive" BOOLEAN DEFAULT TRUE,
  "extraData" JSONB DEFAULT '{}'::jsonb
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
  "updatedAt" TEXT,
  "extraData" JSONB DEFAULT '{}'::jsonb
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
  "updatedAt" TIMESTAMPTZ DEFAULT NOW(),
  "extraData" JSONB DEFAULT '{}'::jsonb
);

-- Enable Row Level Security (RLS) & Grant Public Access for all 14 tables
DO $$
DECLARE
  tbl TEXT;
  tables TEXT[] := ARRAY[
    'users', 'matrimonials', 'businesses', 'temples', 'members',
    'posts', 'news', 'ads', 'panchang', 'blood_donors',
    'jobs', 'bhajans', 'pages', 'settings'
  ];
BEGIN
  FOREACH tbl IN ARRAY tables LOOP
    EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY;', tbl);
    EXECUTE format('DROP POLICY IF EXISTS "Public Access %I" ON public.%I;', tbl, tbl);
    EXECUTE format('CREATE POLICY "Public Access %I" ON public.%I FOR ALL USING (true) WITH CHECK (true);', tbl, tbl);
  END LOOP;
END $$;
