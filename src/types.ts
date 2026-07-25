export type UserRole = 'Super Admin' | 'Admin' | 'Moderator' | 'Temple Admin' | 'Business Owner' | 'Member' | 'Guest';

export type UserStatus = 'Pending Approval' | 'Approved' | 'Rejected' | 'Suspended';

export type RegistrationType = 'Individual' | 'Business' | 'Temple' | 'Marriage Profile' | 'NGO' | 'Trust';

export type JainSect = 'Swetambar Murtipujak' | 'Swetambar Sthanakvasi' | 'Swetambar Terapanthi' | 'Digambar Bisapanthi' | 'Digambar Terapanthi' | 'Digambar Taranpanthi' | 'Swetambar' | 'Digambar' | 'Sthanakvasi' | 'Terapanthi' | 'Swetambar & Digambar' | string;

export interface User {
  id: string;
  fullName: string;
  surname: string;
  email: string;
  mobile: string;
  whatsapp?: string;
  role: UserRole;
  status: UserStatus;
  registrationType: RegistrationType;
  gender: 'Male' | 'Female' | 'Other';
  dob: string;
  age: number;
  maritalStatus: 'Unmarried' | 'Married' | 'Divorced' | 'Widowed';
  sect: JainSect;
  subSect: string;
  gotra: string;
  qualification: string;
  occupation: string;
  company?: string;
  address: string;
  country: string;
  state: string;
  city: string;
  pincode: string;
  profilePhoto: string;
  idProofUrl?: string;
  isVerified: boolean;
  membershipTier: 'Free' | 'Premium' | 'Elite';
  createdAt: string;
  bloodGroup?: string;
  isBloodDonor?: boolean;
  donorAvailable?: boolean;
  lastDonatedDate?: string;
  donorMobile?: string;
  donorCity?: string;
  donorState?: string;
  qrCodeUrl?: string;
}

export interface MatrimonialProfile {
  id: string;
  userId: string;
  fullName: string;
  gender: 'Bride' | 'Groom';
  age: number;
  height: string; // e.g. "5'8\""
  dob: string;
  maritalStatus: string;
  sect: JainSect;
  subSect: string;
  gotra: string;
  qualification: string;
  occupation: string;
  company?: string;
  annualIncome: string;
  city: string;
  state: string;
  country: string;
  photoUrl: string;
  additionalPhotos?: string[];
  aboutMe: string;
  familyDetails: string;
  dietPreference: 'Strict Jain' | 'Pure Veg' | 'Vegan';
  isVerified: boolean;
  membershipTier: 'Free' | 'Premium' | 'Elite';
  contactEmail: string;
  contactMobile: string;
  interestsReceived: string[]; // User IDs who expressed interest
  interestsAccepted: string[]; // User IDs accepted
}

export interface BusinessListing {
  id: string;
  ownerId: string;
  businessName: string;
  category: string; // Industrial, Wholesale, Retail, Doctor, CA, IT, Jewellery, Real Estate, etc.
  logoUrl: string;
  galleryUrls: string[];
  description: string;
  productsAndServices: string[];
  gstNumber?: string;
  address: string;
  city: string;
  state: string;
  country: string;
  pincode: string;
  googleMapUrl?: string;
  latitude?: number;
  longitude?: number;
  website?: string;
  email: string;
  mobile: string;
  whatsapp: string;
  rating: number; // e.g. 4.8
  reviewCount: number;
  isVerified: boolean;
  isSponsored: boolean;
  createdAt: string;
  status: 'Approved' | 'Pending Approval' | 'Rejected';
}

export interface TempleListing {
  id: string;
  templeName: string;
  sect: JainSect;
  mainDeity: string; // e.g., Lord Mahavira, Lord Adinath, Lord Parshvanath
  images: string[];
  history: string;
  timings: string; // e.g., "6:00 AM - 9:00 PM"
  aartiTimings: string; // e.g., "Morning 7:00 AM, Evening 7:30 PM"
  pujaTimings: string;
  address: string;
  city: string;
  state: string;
  country: string;
  lat?: number;
  lng?: number;
  distanceKm?: number;
  hasParking: boolean;
  hasAccommodation: boolean;
  dharamshalaRooms?: number;
  trustContactPerson: string;
  trustPhone: string;
  trustEmail?: string;
  donationUpi?: string;
  donationAccount?: string;
  liveDarshanUrl?: string; // Video URL or live stream link
  is360Available?: boolean;
  isVerified: boolean;
  rating: number;
  upcomingEvents?: { title: string; date: string; description: string }[];
}

export interface FamilyMember {
  name: string;
  relation: string;
  age: number;
  occupation: string;
  mobile?: string;
}

export interface CommunityMemberProfile {
  id: string;
  userId: string;
  name: string;
  surname: string;
  city: string;
  state: string;
  country: string;
  profession: string;
  bloodGroup: string;
  mobile: string;
  email: string;
  photoUrl: string;
  familyMembers: FamilyMember[];
  isVerified: boolean;
  address: string;
}

export interface CommunityPost {
  id: string;
  authorId: string;
  authorName: string;
  authorRole: string;
  authorPhoto: string;
  content: string;
  imageUrl?: string;
  category: 'General' | 'Event' | 'Temple' | 'News' | 'Matrimonial' | 'Business';
  likesCount: number;
  likedByUsers: string[];
  comments: { id: string; authorName: string; text: string; createdAt: string }[];
  createdAt: string;
}

export interface NewsItem {
  id: string;
  title: string;
  summary: string;
  content: string;
  imageUrl: string;
  category: string;
  publishedDate: string;
  author: string;
  isPinned?: boolean;
}

export interface AdBanner {
  id: string;
  title: string;
  imageUrl: string;
  linkUrl: string;
  position: 'Home Banner' | 'Sidebar' | 'Footer' | 'Sponsored Card';
  isActive: boolean;
  sponsorName?: string;
  description?: string;
  offerDiscount?: string;
  contactMobile?: string;
  expiryDate?: string;
  businessId?: string;
  ownerUserId?: string;
}

export interface PanchangInfo {
  date: string;
  tithi: string;
  paksha: string;
  month: string;
  sunrise: string;
  sunset: string;
  choghadiyaDay: { name: string; type: 'Auspicious' | 'Inauspicious' | 'Neutral'; time: string }[];
  dailyQuote: { text: string; source: string };
  upcomingFestivals: { name: string; date: string; description: string }[];
}

export interface BloodDonor {
  id: string;
  userId?: string;
  name: string;
  bloodGroup: string;
  city: string;
  state: string;
  mobile: string;
  available: boolean;
  lastDonated?: string;
}

export interface JobItem {
  id: string;
  title: string;
  company: string;
  location: string;
  type: 'Full-time' | 'Part-time' | 'Remote' | 'Contract';
  salary: string;
  contactEmail: string;
  description: string;
  postedDate: string;
}

export interface AppNotification {
  id: string;
  userId?: string; // if targeted or global
  title: string;
  message: string;
  type: 'Approval' | 'Matrimonial' | 'Business' | 'Temple' | 'Broadcast' | 'General' | 'AdReminder';
  createdAt: string;
  isRead: boolean;
}

export interface BhajanSong {
  id: string;
  title: string;
  hindiTitle?: string;
  category: 'Navkar Mantra' | 'Stavan' | 'Bhajan' | 'Aarti' | 'Bhaktamar' | 'Stuti';
  singer?: string;
  sect?: 'Swetambar' | 'Digambar' | 'All' | string;
  occasion?: 'Paryushan' | 'Mahavir Jayanti' | 'Morning Bhakti' | 'Diksha' | 'Diwali' | 'General' | string;
  audioUrl: string;
  lyrics?: string;
  isActive: boolean;
  addedBy?: string;
  createdAt?: string;
}

export interface SystemSettings {
  appName: string;
  tagline: string;
  developerName: string;
  heroHeadline: string;
  heroSubheadline: string;
  announcementTicker: string;
  enableRegistrations: boolean;
  requireAdminApproval: boolean;
  contactEmail: string;
  contactPhone: string;
  whatsappSupport: string;
  address: string;
  aboutTitle?: string;
  aboutDescription?: string;
  matrimonialHeading?: string;
  businessHeading?: string;
  templeHeading?: string;
  directoryHeading?: string;
  themePrimaryColor?: 'amber' | 'emerald' | 'ruby' | 'sapphire' | 'saffron' | 'purple';
}
