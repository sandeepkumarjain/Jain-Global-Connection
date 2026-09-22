export type UserRole = 'Super Admin' | 'Admin' | 'Moderator' | 'Temple Admin' | 'Business Owner' | 'VerifiedBusiness' | 'Member' | 'Guest';

export type TabOption = 'home' | 'matrimonial' | 'business' | 'directory' | 'temple' | 'panchang' | 'feed' | 'emergency' | 'admin';

export type UserStatus = 'Pending Approval' | 'Approved' | 'Rejected' | 'Suspended';

export type RegistrationType = 'Individual' | 'Business' | 'Temple' | 'Marriage Profile' | 'NGO' | 'Trust';

export type JainSect = 'Swetambar Murtipujak' | 'Swetambar Sthanakvasi' | 'Swetambar Terapanthi' | 'Digambar Bisapanthi' | 'Digambar Terapanthi' | 'Digambar Taranpanthi' | 'Swetambar' | 'Digambar' | 'Sthanakvasi' | 'Terapanthi' | 'Swetambar & Digambar' | string;

export interface RolePermissions {
  canAccessAdmin: boolean;
  canManageUsers: boolean;
  canManageBusinesses: boolean;
  canManageTemples: boolean;
  canApproveProfiles: boolean;
  canCreateAds: boolean;
  canPublishNews: boolean;
  canManagePanchang: boolean;
}

export type MemberBadgeId =
  | 'Verified Donor'
  | 'Sangh Volunteer'
  | 'Long-time Member'
  | 'Community Leader'
  | 'Sangh Trustee'
  | 'Youth Ambassador'
  | 'Key Contributor'
  | 'Life Patron'
  | 'Verified';

export interface MemberBadgeDefinition {
  id: MemberBadgeId | string;
  name: string;
  tagline: string;
  description: string;
  category: 'Seva & Blood' | 'Community Service' | 'Tenure & Seniority' | 'Leadership' | 'Patronage';
  criteria: string;
  iconName: string;
  priority: number;
}

export interface User {
  id: string;
  applicationId?: string;
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
  isPhoneVerified?: boolean;
  membershipTier: 'Free' | 'Premium' | 'Elite';
  createdAt: string;
  bloodGroup?: string;
  isBloodDonor?: boolean;
  donorAvailable?: boolean;
  lastDonatedDate?: string;
  donorMobile?: string;
  donorCity?: string;
  donorState?: string;
  isVolunteer?: boolean;
  volunteerRole?: string;
  volunteerInterests?: string[];
  isLongTimeMember?: boolean;
  badges?: string[];
  qrCodeUrl?: string;
  themePreference?: 'auto' | 'light' | 'dark';
  password?: string;
  permissions?: string[];
  rolePermissions?: Partial<RolePermissions>;
  prayerReminderSettings?: PrayerReminderSettings;
  favoriteScripture?: string;
  motto?: string;
  nativePlace?: string;
  spiritualInterest?: string;
  digitalIdPrivacy?: 'public' | 'private';
  cardDisplayPreferences?: {
    showMotto?: boolean;
    mottoText?: string;
    showScripture?: boolean;
    scriptureText?: string;
    showGotra?: boolean;
    showLocation?: boolean;
    showBloodGroup?: boolean;
    showTier?: boolean;
    showOccupation?: boolean;
    occupationText?: string;
    showNativePlace?: boolean;
    nativePlaceText?: string;
    showSpiritualInterest?: boolean;
    spiritualInterestText?: string;
  };
  savedRituals?: SavedRitualItem[];
}

export interface SavedRitualItem {
  id: string; // guide key or custom id, e.g. "ashtaprakari_puja"
  title: string;
  hindiTitle?: string;
  tradition: string;
  category: string;
  durationMinutes?: number;
  totalSteps: number;
  savedAt: string;
  notes?: string;
  tags?: string[];
}

export interface PrayerReminderItem {
  id: string;
  name: string;
  hindiName?: string;
  category: 'samayik' | 'aarti' | 'pratikraman' | 'pachkan' | 'custom';
  time: string; // 24-hour "HH:MM", e.g. "07:00", "18:45"
  enabled: boolean;
  soundEnabled: boolean;
  description: string;
}

export interface PrayerReminderSettings {
  enabled: boolean;
  browserNotificationsAllowed: boolean;
  soundVolume: number; // 0.0 to 1.0
  reminders: PrayerReminderItem[];
  lastTriggeredDates?: Record<string, string>;
}

export interface MatrimonialProfile {
  id: string;
  applicationId?: string;
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

  // Extended Full Base Application Fields
  createdFor?: string;
  tob?: string;
  pob?: string;
  weight?: string;
  complexion?: string;
  bodyType?: string;
  physicalStatus?: string;
  motherTongue?: string;
  fourGotras?: {
    selfGotra?: string;
    motherGotra?: string;
    fatherMotherGotra?: string;
    motherMotherGotra?: string;
  };
  nativePlace?: string;
  religiousPractices?: {
    dailyPuja?: boolean;
    choviyar?: boolean;
    navkarshi?: boolean;
    swadhyay?: boolean;
  };
  horoscopeDetails?: {
    manglikStatus?: string;
    kundaliMatchNeeded?: string;
    rashi?: string;
    nakshatra?: string;
  };
  educationDetails?: {
    degreeLevel?: string;
    fieldOfStudy?: string;
    instituteName?: string;
  };
  careerDetails?: {
    employedIn?: string;
    designation?: string;
    companyName?: string;
    annualIncomeRange?: string;
    workLocation?: string;
    willingToRelocate?: string;
  };
  familyBackground?: {
    familyStatus?: string;
    familyType?: string;
    familyValues?: string;
    fatherName?: string;
    fatherOccupation?: string;
    motherName?: string;
    motherOccupation?: string;
    brothersCount?: number;
    marriedBrothersCount?: number;
    sistersCount?: number;
    marriedSistersCount?: number;
    familyProperty?: string;
  };
  partnerExpectations?: {
    ageMin?: number;
    ageMax?: number;
    heightMin?: string;
    heightMax?: string;
    maritalStatusPreferred?: string;
    sectPreferred?: string;
    educationPreferred?: string;
    occupationPreferred?: string;
    locationPreferred?: string;
    dietPreferred?: string;
    additionalNotes?: string;
  };
  guardianContact?: {
    name?: string;
    relation?: string;
    phone?: string;
    email?: string;
  };
}

export type EndorsementCategory = 'Reliability' | 'Ethics' | 'Service Quality';

export interface Endorsement {
  id: string;
  userId: string;
  userName: string;
  userPhotoUrl?: string;
  category: EndorsementCategory;
  createdAt: string;
  comment?: string;
}

export interface BusinessListing {
  id: string;
  applicationId?: string;
  ownerId: string;
  businessName: string;
  category: string; // Industrial, Wholesale, Retail, Doctor, CA, IT, Jewellery, Real Estate, etc.
  logoUrl: string;
  coverImageUrl?: string;
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
  endorsements?: Endorsement[];
}

export interface TempleReview {
  id: string;
  userId?: string;
  userName: string;
  userCity?: string;
  rating: number; // 1 to 5
  type: 'review' | 'suggestion';
  visitDate?: string;
  comment: string;
  category?: 'General' | 'Darshan' | 'Cleanliness' | 'Dharamshala' | 'Bhojanashala' | 'Yatra & Facilities';
  createdAt: string;
  isVerifiedVisitor?: boolean;
  helpfulCount?: number;
}

export interface TempleListing {
  id: string;
  applicationId?: string;
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
  reviews?: TempleReview[];
  upcomingEvents?: { title: string; date: string; description: string }[];
}

export interface FamilyMember {
  id?: string;
  name: string;
  relation: string;
  age: number;
  gender?: 'Male' | 'Female';
  occupation: string;
  mobile?: string;
  registerForMatrimonial?: boolean;
  matrimonialProfileCreated?: boolean;
  matrimonialProfileId?: string;
}

export interface MatrimonialSuccessStory {
  id: string;
  profileId?: string;
  brideName: string;
  groomName: string;
  marriageDate: string;
  matchSource: 'JainConnect Global' | 'Other Portal / Offline Match';
  feedback?: string;
  rating?: number;
  couplePhotoUrl?: string;
  city?: string;
  submittedBy: string;
  createdAt: string;
  isApproved?: boolean;
}

export interface CommunityMemberProfile {
  id: string;
  applicationId?: string;
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
  badges?: string[];
  membershipTier?: 'Free' | 'Premium' | 'Elite' | 'Trustee';
  isCommunityLeader?: boolean;
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
  businessId?: string;
  postedByUserId?: string;
  title: string;
  company: string;
  location: string;
  type: 'Full-time' | 'Part-time' | 'Remote' | 'Contract';
  salary: string;
  contactEmail: string;
  description: string;
  postedDate: string;
}

export type NotificationType = 
  | 'Approval' 
  | 'Matrimonial' 
  | 'Business' 
  | 'Temple' 
  | 'Broadcast' 
  | 'General' 
  | 'AdReminder'
  | 'ProfileView'
  | 'ConnectionRequest'
  | 'Announcement';

export interface AppNotification {
  id: string;
  userId?: string; // if targeted to specific user ID or 'all'/undefined for global broadcast
  title: string;
  message: string;
  type: NotificationType;
  createdAt: string;
  isRead: boolean;
  senderId?: string;
  senderName?: string;
  senderPhoto?: string;
  actionTab?: 'home' | 'matrimonial' | 'business' | 'directory' | 'temple' | 'panchang' | 'feed' | 'emergency' | 'admin' | 'pandit';
  actionEntityId?: string;
  connectionStatus?: 'Pending' | 'Accepted' | 'Declined';
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

export interface CustomPage {
  id: string;
  slug: string;
  title: string;
  category: 'Religious' | 'Community' | 'Services' | 'General' | 'Event';
  content: string;
  bannerImage?: string;
  isPublished: boolean;
  showInHeader: boolean;
  createdAt: string;
  updatedAt: string;
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
  termsAndConditions?: string;
  privacyPolicy?: string;
  themePrimaryColor?: 'amber' | 'emerald' | 'ruby' | 'sapphire' | 'saffron' | 'purple';
  
  // Page Control & Subtitles
  matrimonialSubtitle?: string;
  businessSubtitle?: string;
  templeSubtitle?: string;
  directorySubtitle?: string;
  panchangTitle?: string;
  panchangSubtitle?: string;
  feedTitle?: string;
  feedSubtitle?: string;
  servicesTitle?: string;
  servicesSubtitle?: string;
}

export interface MatrimonialMessage {
  id: string;
  senderId: string;
  senderName: string;
  receiverId: string;
  receiverName: string;
  text: string;
  timestamp: string;
  read?: boolean;
}

export type DashboardWidgetId =
  | 'panchang'
  | 'audio_player'
  | 'community_feed'
  | 'daily_wisdom'
  | 'sangh_highlights'
  | 'matrimonial_matches'
  | 'business_directory'
  | 'temple_directory'
  | 'vivah_stories'
  | 'ask_pandit';

export interface DashboardWidgetConfig {
  id: DashboardWidgetId;
  title: string;
  subtitle: string;
  description: string;
  category: 'Spiritual' | 'Media' | 'Community' | 'Directory';
  icon: string;
  isPinned: boolean;
  isVisible: boolean;
  order: number;
  badgeText?: string;
  badgeColor?: string;
}

export interface UserDashboardPreferences {
  userId: string;
  widgets: DashboardWidgetConfig[];
  updatedAt: string;
}

export type SuccessStoryCategory =
  | 'All'
  | 'Matrimonial'
  | 'Business'
  | 'Temple & Tirth'
  | 'Community & Seva'
  | 'Youth & Mentorship';

export interface MemberSuccessStory {
  id: string;
  memberName: string;
  memberSurname?: string;
  memberPhoto?: string;
  memberId?: string;
  city: string;
  state?: string;
  country: string;
  category: 'Matrimonial' | 'Business' | 'Temple & Tirth' | 'Community & Seva' | 'Youth & Mentorship';
  title: string;
  story: string;
  keyOutcome: string;
  rating: number;
  date: string;
  isVerifiedMember: boolean;
  sanghAffiliation?: string;
  likesCount?: number;
  featured?: boolean;
}

export type PanditTradition =
  | 'All Traditions'
  | 'Swetambar Murtipujak'
  | 'Digambar'
  | 'Sthanakvasi'
  | 'Terapanthi';

export type PanditCategory =
  | 'All'
  | 'Puja & Abhishek'
  | 'Agamas & Philosophy'
  | 'Pachkan & Fasting'
  | 'Samayik & Pratikraman'
  | 'Dietary & Kandmool'
  | 'Sanskars & Griha Pravesh';

export interface PanditMantra {
  name: string;
  verse: string;
  meaning: string;
}

export interface PanditPujaStep {
  stepNumber: number;
  title: string;
  subTitle?: string;
  description: string;
  bhavna?: string;
  icon?: string;
  mantraOrSutra?: string;
  itemsRequired?: string[];
  traditionNote?: string;
  imageUrl?: string;
  imageAlt?: string;
  imageCaption?: string;
  proceduralAnimation?:
    | 'lamp_flame'
    | 'aarti_circle'
    | 'jal_dhara'
    | 'chandan_touch'
    | 'dhoop_smoke'
    | 'akshat_swastika'
    | 'charavalo_sweep'
    | 'flower_petal'
    | 'bell_chime';
  animationLabel?: string;
}

export interface PanditStepGuide {
  title: string;
  subtitle?: string;
  procedureType: string;
  estimatedDuration?: string;
  preparations?: string[];
  rulesAndPurity?: string[];
  steps: PanditPujaStep[];
  concludingBhavna?: string;
  coverImageUrl?: string;
  coverImageAlt?: string;
  coverImageCaption?: string;
}

export interface PanditMessage {
  id: string;
  sender: 'user' | 'pandit';
  text: string;
  timestamp: string;
  tradition?: PanditTradition;
  category?: PanditCategory;
  scripturalReferences?: string[];
  recommendedPachkanOrVow?: string | null;
  mantras?: PanditMantra[];
  stepGuide?: PanditStepGuide | null;
  followUpQuestions?: string[];
  isLoading?: boolean;
}

export interface SavedPanditGuidance {
  id: string;
  question: string;
  reply: string;
  savedAt: string;
  scripturalReferences?: string[];
  tradition?: PanditTradition;
  category?: PanditCategory;
  stepGuide?: PanditStepGuide | null;
}

export type SanghaCategory =
  | 'Sangha'
  | 'Yuvak Mandal'
  | 'Mahila Mandal'
  | 'Jain Community Center'
  | 'Seva Trust'
  | 'Mahasangh';

export type SanghaTradition =
  | 'All Traditions'
  | 'Swetambar Murtipujak'
  | 'Digambar'
  | 'Sthanakvasi'
  | 'Terapanthi'
  | 'All Jains';

export interface JainSanghaMandal {
  id: string;
  name: string;
  hindiName?: string;
  category: SanghaCategory;
  tradition: SanghaTradition;
  city: string;
  state: string;
  country: string;
  address: string;
  lat: number;
  lng: number;
  contactPerson: string;
  contactRole: string;
  phone: string;
  mobile: string;
  email?: string;
  whatsapp?: string;
  website?: string;
  memberHouseholdsCount: number;
  establishedYear?: number;
  activities: string[];
  facilities: string[];
  isVerified: boolean;
  description: string;
  operatingHours?: string;
}

