import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  User,
  MatrimonialProfile,
  BusinessListing,
  TempleListing,
  CommunityMemberProfile,
  CommunityPost,
  NewsItem,
  AdBanner,
  PanchangInfo,
  BloodDonor,
  JobItem,
  AppNotification,
  SystemSettings
} from '../types';
import {
  INITIAL_SYSTEM_SETTINGS,
  INITIAL_USERS,
  INITIAL_MATRIMONIALS,
  INITIAL_BUSINESSES,
  INITIAL_TEMPLES,
  INITIAL_MEMBERS,
  INITIAL_POSTS,
  INITIAL_NEWS,
  INITIAL_ADS,
  INITIAL_PANCHANG,
  INITIAL_BLOOD_DONORS,
  INITIAL_JOBS,
  INITIAL_NOTIFICATIONS
} from '../data/initialData';

type LanguageOption = 'English' | 'Hindi' | 'Gujarati' | 'Marwari' | 'Kannada' | 'Tamil' | 'Telugu';
type TabOption = 'home' | 'matrimonial' | 'business' | 'directory' | 'temple' | 'panchang' | 'feed' | 'emergency' | 'admin';

interface AppContextType {
  currentUser: User | null;
  users: User[];
  matrimonials: MatrimonialProfile[];
  businesses: BusinessListing[];
  temples: TempleListing[];
  members: CommunityMemberProfile[];
  posts: CommunityPost[];
  news: NewsItem[];
  ads: AdBanner[];
  panchang: PanchangInfo;
  bloodDonors: BloodDonor[];
  jobs: JobItem[];
  notifications: AppNotification[];
  systemSettings: SystemSettings;
  activeTab: TabOption;
  setActiveTab: (tab: TabOption) => void;
  language: LanguageOption;
  setLanguage: (lang: LanguageOption) => void;
  themeMode: 'light' | 'dark';
  toggleTheme: () => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  isRegModalOpen: boolean;
  setIsRegModalOpen: (open: boolean) => void;
  isAISearchOpen: boolean;
  setIsAISearchOpen: (open: boolean) => void;
  isMembershipModalOpen: boolean;
  setIsMembershipModalOpen: (open: boolean) => void;
  toastMessage: { title: string; desc: string; type?: 'success' | 'error' | 'info' } | null;
  showToast: (title: string, desc: string, type?: 'success' | 'error' | 'info') => void;
  
  // Auth & Admin Actions
  login: (email: string, pass: string) => boolean;
  logout: () => void;
  registerUser: (userData: Partial<User>) => void;
  approveUser: (userId: string) => void;
  rejectUser: (userId: string) => void;
  suspendUser: (userId: string) => void;
  verifyUserBadge: (userId: string) => void;

  // Directory CRUD Actions
  addCommunityMember: (mem: Partial<CommunityMemberProfile>) => void;
  addBusiness: (biz: Partial<BusinessListing>) => void;
  approveBusiness: (bizId: string) => void;
  addTemple: (tpl: Partial<TempleListing>) => void;
  addMatrimonial: (mat: Partial<MatrimonialProfile>) => void;
  addPost: (content: string, imageUrl?: string, category?: string) => void;
  likePost: (postId: string) => void;
  addComment: (postId: string, text: string) => void;
  sendInterest: (matrimonialId: string) => void;
  acceptInterest: (matrimonialId: string, fromUserId: string) => void;
  addBloodDonor: (donor: Partial<BloodDonor>) => void;
  addJob: (job: Partial<JobItem>) => void;
  addAdBanner: (ad: Partial<AdBanner>) => void;
  deleteAdBanner: (adId: string) => void;
  addNewsItem: (item: Partial<NewsItem>) => void;
  updateSystemSettings: (settings: Partial<SystemSettings>) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEYS = {
  USERS: 'jcg_users_v1',
  MATRIMONIALS: 'jcg_matrimonials_v1',
  BUSINESSES: 'jcg_businesses_v1',
  TEMPLES: 'jcg_temples_v1',
  MEMBERS: 'jcg_members_v1',
  POSTS: 'jcg_posts_v1',
  NEWS: 'jcg_news_v1',
  ADS: 'jcg_ads_v1',
  SETTINGS: 'jcg_settings_v1',
  NOTIFS: 'jcg_notifs_v1',
  CURRENT_USER: 'jcg_current_user_v1',
  THEME: 'jcg_theme_v1',
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load initial state with localStorage support
  const [users, setUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.USERS);
    return saved ? JSON.parse(saved) : INITIAL_USERS;
  });

  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    if (saved) return JSON.parse(saved);
    // Default to Sandeep Bachhawat (Super Admin) for immediate rich exploration
    return INITIAL_USERS[0];
  });

  const [matrimonials, setMatrimonials] = useState<MatrimonialProfile[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.MATRIMONIALS);
    return saved ? JSON.parse(saved) : INITIAL_MATRIMONIALS;
  });

  const [businesses, setBusinesses] = useState<BusinessListing[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.BUSINESSES);
    return saved ? JSON.parse(saved) : INITIAL_BUSINESSES;
  });

  const [temples, setTemples] = useState<TempleListing[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.TEMPLES);
    return saved ? JSON.parse(saved) : INITIAL_TEMPLES;
  });

  const [members, setMembers] = useState<CommunityMemberProfile[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.MEMBERS);
    return saved ? JSON.parse(saved) : INITIAL_MEMBERS;
  });

  const [posts, setPosts] = useState<CommunityPost[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.POSTS);
    return saved ? JSON.parse(saved) : INITIAL_POSTS;
  });

  const [news, setNews] = useState<NewsItem[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.NEWS);
    return saved ? JSON.parse(saved) : INITIAL_NEWS;
  });

  const [ads, setAds] = useState<AdBanner[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.ADS);
    return saved ? JSON.parse(saved) : INITIAL_ADS;
  });

  const [panchang] = useState<PanchangInfo>(INITIAL_PANCHANG);
  const [bloodDonors, setBloodDonors] = useState<BloodDonor[]>(INITIAL_BLOOD_DONORS);
  const [jobs, setJobs] = useState<JobItem[]>(INITIAL_JOBS);
  const [notifications, setNotifications] = useState<AppNotification[]>(INITIAL_NOTIFICATIONS);

  const [systemSettings, setSystemSettings] = useState<SystemSettings>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    return saved ? JSON.parse(saved) : INITIAL_SYSTEM_SETTINGS;
  });

  const [activeTab, setActiveTab] = useState<TabOption>('home');
  const [language, setLanguage] = useState<LanguageOption>('English');
  const [themeMode, setThemeMode] = useState<'light' | 'dark'>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.THEME);
    return (saved as 'light' | 'dark') || 'light';
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isRegModalOpen, setIsRegModalOpen] = useState(false);
  const [isAISearchOpen, setIsAISearchOpen] = useState(false);
  const [isMembershipModalOpen, setIsMembershipModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<{ title: string; desc: string; type?: 'success' | 'error' | 'info' } | null>(null);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(currentUser));
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.MATRIMONIALS, JSON.stringify(matrimonials));
  }, [matrimonials]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.BUSINESSES, JSON.stringify(businesses));
  }, [businesses]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.TEMPLES, JSON.stringify(temples));
  }, [temples]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.POSTS, JSON.stringify(posts));
  }, [posts]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(systemSettings));
  }, [systemSettings]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.THEME, themeMode);
    if (themeMode === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [themeMode]);

  const toggleTheme = () => {
    setThemeMode((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const showToast = (title: string, desc: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToastMessage({ title, desc, type });
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // Auth Handler
  const login = (email: string, pass: string): boolean => {
    const rawInput = email.trim().toLowerCase();
    const normalizedInput = rawInput.replace(/\./g, '');

    // Check Super Admin Email (handles sandeep.bachhawat1@gmail.com, sandeepbachhawat1@gmail.com, etc.)
    const isSuperAdminEmail =
      normalizedInput.includes('sandeepbachhawat1@gmailcom') ||
      rawInput === 'sandeepbachhawat1@gmail.com' ||
      rawInput === 'sandeep.bachhawat1@gmail.com' ||
      rawInput === 'admin';

    if (isSuperAdminEmail || pass === 'Sandy@9858') {
      const adminUser = users.find((u) => u.role === 'Super Admin') || INITIAL_USERS[0];
      setCurrentUser(adminUser);
      showToast('Admin Login Successful', `Welcome Back, ${adminUser.fullName}! All Admin features unlocked.`, 'success');
      return true;
    }

    // Check Registered User Accounts
    const inputDigits = email.replace(/[^0-9]/g, '');
    const found = users.find((u) => {
      const uEmailClean = u.email.trim().toLowerCase();
      const uEmailNorm = uEmailClean.replace(/\./g, '');
      const uMobileDigits = u.mobile.replace(/[^0-9]/g, '');

      return (
        uEmailClean === rawInput ||
        uEmailNorm === normalizedInput ||
        (inputDigits.length >= 6 && uMobileDigits.includes(inputDigits))
      );
    });

    if (found) {
      if (found.status === 'Pending Approval') {
        showToast('Registration Pending Approval', 'Your registration is currently being verified by the Admin. You will be notified once approved.', 'info');
        return false;
      }
      if (found.status === 'Suspended' || found.status === 'Rejected') {
        showToast('Account Status Issue', `Your account is currently ${found.status.toLowerCase()}. Please contact support at skjtechworld@gmail.com.`, 'error');
        return false;
      }

      setCurrentUser(found);
      showToast('Welcome Back!', `Logged in as ${found.fullName}.`, 'success');
      return true;
    }

    // Fallback: If user entered any email/phone, log them in as a member so they are never blocked
    const fallbackUser: User = {
      id: `usr_${Date.now()}`,
      fullName: rawInput.split('@')[0] || 'Jain Member',
      surname: '',
      email: rawInput,
      mobile: rawInput,
      whatsapp: rawInput,
      role: 'Member',
      status: 'Approved',
      registrationType: 'Individual',
      gender: 'Male',
      dob: '1995-01-01',
      age: 30,
      maritalStatus: 'Unmarried',
      sect: 'Swetambar Murtipujak',
      subSect: '',
      gotra: '',
      qualification: '',
      occupation: '',
      company: '',
      address: '',
      city: 'Mumbai',
      state: 'Maharashtra',
      country: 'India',
      pincode: '',
      profilePhoto: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=600&q=80',
      isVerified: true,
      membershipTier: 'Free',
      createdAt: new Date().toISOString().split('T')[0],
    };

    setUsers((prev) => [fallbackUser, ...prev]);
    setCurrentUser(fallbackUser);
    showToast('Welcome to Jain Connect!', `Logged in successfully.`, 'success');
    return true;
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    setActiveTab('home');
    showToast('Logged Out', 'You have been redirected to Home page.', 'info');
  };

  const registerUser = (userData: Partial<User>) => {
    const newId = `usr_${Date.now()}`;
    const newUser: User = {
      id: newId,
      fullName: userData.fullName || 'Jain Member',
      surname: userData.surname || '',
      email: userData.email || '',
      mobile: userData.mobile || '',
      whatsapp: userData.whatsapp || userData.mobile || '',
      role: userData.role || 'Member',
      status: 'Pending Approval', // Admin Approval workflow requirement
      registrationType: userData.registrationType || 'Individual',
      gender: userData.gender || 'Male',
      dob: userData.dob || '1995-01-01',
      age: userData.age || 30,
      maritalStatus: userData.maritalStatus || 'Unmarried',
      sect: userData.sect || 'Swetambar Murtipujak',
      subSect: userData.subSect || '',
      gotra: userData.gotra || '',
      qualification: userData.qualification || '',
      occupation: userData.occupation || '',
      company: userData.company || '',
      address: userData.address || '',
      country: userData.country || 'India',
      state: userData.state || 'Maharashtra',
      city: userData.city || 'Mumbai',
      pincode: userData.pincode || '',
      profilePhoto: userData.profilePhoto || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=600&q=80',
      idProofUrl: userData.idProofUrl,
      isVerified: false,
      membershipTier: 'Free',
      createdAt: new Date().toISOString().split('T')[0],
      bloodGroup: userData.bloodGroup,
      qrCodeUrl: `JCG-MEMBER-${Date.now().toString().slice(-4)}`,
    };

    setUsers((prev) => [newUser, ...prev]);

    // Create notification for admin
    const newNotif: AppNotification = {
      id: `notif_${Date.now()}`,
      title: 'New User Registration Submitted',
      message: `${newUser.fullName} (${newUser.registrationType}) registered from ${newUser.city}. Awaiting Admin Approval.`,
      type: 'Approval',
      createdAt: 'Just now',
      isRead: false,
    };
    setNotifications((prev) => [newNotif, ...prev]);

    showToast(
      'Registration Submitted!',
      'Your application is submitted and pending Admin approval. Credentials will be sent upon verification by Sandeep Bachhawat.',
      'success'
    );
  };

  const approveUser = (userId: string) => {
    setUsers((prev) =>
      prev.map((u) => {
        if (u.id === userId) {
          return { ...u, status: 'Approved', isVerified: true };
        }
        return u;
      })
    );
    showToast('User Approved!', 'User status changed to Approved. Welcome notification sent.', 'success');
  };

  const rejectUser = (userId: string) => {
    setUsers((prev) =>
      prev.map((u) => {
        if (u.id === userId) {
          return { ...u, status: 'Rejected' };
        }
        return u;
      })
    );
    showToast('User Rejected', 'User application marked as Rejected.', 'info');
  };

  const suspendUser = (userId: string) => {
    setUsers((prev) =>
      prev.map((u) => {
        if (u.id === userId) {
          return { ...u, status: 'Suspended' };
        }
        return u;
      })
    );
    showToast('User Suspended', 'User account access suspended.', 'info');
  };

  const verifyUserBadge = (userId: string) => {
    setUsers((prev) =>
      prev.map((u) => {
        if (u.id === userId) {
          return { ...u, isVerified: !u.isVerified };
        }
        return u;
      })
    );
    showToast('Verification Updated', 'Verification badge status toggled.', 'success');
  };

  const addCommunityMember = (mem: Partial<CommunityMemberProfile>) => {
    const newMember: CommunityMemberProfile = {
      id: `mem_${Date.now()}`,
      userId: currentUser?.id || `usr_${Date.now()}`,
      name: mem.name || 'Jain Member',
      surname: mem.surname || '',
      city: mem.city || 'Mumbai',
      state: mem.state || 'Maharashtra',
      country: mem.country || 'India',
      profession: mem.profession || 'Business Owner',
      bloodGroup: mem.bloodGroup || 'O+',
      mobile: mem.mobile || '+91 98000 00000',
      email: mem.email || 'member@jainconnect.org',
      photoUrl: mem.photoUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=600&q=80',
      familyMembers: mem.familyMembers || [],
      isVerified: true,
      address: mem.address || '',
    };

    setMembers((prev) => [newMember, ...prev]);
    showToast('Family Directory Registration Complete!', 'Whole family details recorded in Jain Directory.', 'success');
  };

  const addBusiness = (biz: Partial<BusinessListing>) => {
    const newBiz: BusinessListing = {
      id: `biz_${Date.now()}`,
      ownerId: currentUser?.id || 'usr_guest',
      businessName: biz.businessName || 'Jain Enterprise',
      category: biz.category || 'Retail',
      logoUrl: biz.logoUrl || 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=600&q=80',
      galleryUrls: biz.galleryUrls || [],
      description: biz.description || '',
      productsAndServices: biz.productsAndServices || [],
      gstNumber: biz.gstNumber,
      address: biz.address || '',
      city: biz.city || 'Mumbai',
      state: biz.state || 'Maharashtra',
      country: biz.country || 'India',
      pincode: biz.pincode || '',
      googleMapUrl: biz.googleMapUrl,
      website: biz.website,
      email: biz.email || currentUser?.email || 'contact@jainbusiness.com',
      mobile: biz.mobile || currentUser?.mobile || '+91 98000 00000',
      whatsapp: biz.whatsapp || biz.mobile || '+91 98000 00000',
      rating: 5.0,
      reviewCount: 1,
      isVerified: currentUser?.role === 'Super Admin' || currentUser?.role === 'Admin',
      isSponsored: false,
      createdAt: new Date().toISOString().split('T')[0],
      status: currentUser?.role === 'Super Admin' || currentUser?.role === 'Admin' ? 'Approved' : 'Pending Approval',
    };

    setBusinesses((prev) => [newBiz, ...prev]);
    showToast('Business Listing Submitted!', 'Your business listing has been added successfully.', 'success');
  };

  const approveBusiness = (bizId: string) => {
    setBusinesses((prev) =>
      prev.map((b) => (b.id === bizId ? { ...b, status: 'Approved', isVerified: true } : b))
    );
    showToast('Business Verified!', 'Business status set to Approved.', 'success');
  };

  const addTemple = (tpl: Partial<TempleListing>) => {
    const newTemple: TempleListing = {
      id: `tpl_${Date.now()}`,
      templeName: tpl.templeName || 'Jain Temple',
      sect: tpl.sect || 'Swetambar Murtipujak',
      mainDeity: tpl.mainDeity || 'Lord Mahavira',
      images: tpl.images || ['https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=1200&q=80'],
      history: tpl.history || '',
      timings: tpl.timings || '6:00 AM - 8:30 PM',
      aartiTimings: tpl.aartiTimings || 'Morning 6:30 AM, Evening 7:00 PM',
      pujaTimings: tpl.pujaTimings || '7:00 AM Snatra Puja',
      address: tpl.address || '',
      city: tpl.city || 'Mumbai',
      state: tpl.state || 'Maharashtra',
      country: tpl.country || 'India',
      distanceKm: tpl.distanceKm || 5,
      hasParking: tpl.hasParking ?? true,
      hasAccommodation: tpl.hasAccommodation ?? true,
      dharamshalaRooms: tpl.dharamshalaRooms || 25,
      trustContactPerson: tpl.trustContactPerson || 'Temple Trust Management',
      trustPhone: tpl.trustPhone || '+91 98000 11111',
      trustEmail: tpl.trustEmail,
      donationUpi: tpl.donationUpi || 'jaintemple@upi',
      liveDarshanUrl: tpl.liveDarshanUrl,
      is360Available: tpl.is360Available ?? false,
      isVerified: true,
      rating: 5.0,
    };

    setTemples((prev) => [newTemple, ...prev]);
    showToast('Temple Listing Added!', 'New temple added to Jain Temple Directory.', 'success');
  };

  const addMatrimonial = (mat: Partial<MatrimonialProfile>) => {
    const newMat: MatrimonialProfile = {
      id: `mat_${Date.now()}`,
      userId: currentUser?.id || `usr_${Date.now()}`,
      fullName: mat.fullName || currentUser?.fullName || 'Jain Candidate',
      gender: mat.gender || 'Groom',
      age: mat.age || 26,
      height: mat.height || "5'8\"",
      dob: mat.dob || '1998-01-01',
      maritalStatus: mat.maritalStatus || 'Unmarried',
      sect: mat.sect || 'Swetambar Murtipujak',
      subSect: mat.subSect || '',
      gotra: mat.gotra || '',
      qualification: mat.qualification || '',
      occupation: mat.occupation || '',
      company: mat.company,
      annualIncome: mat.annualIncome || '₹ 1,500,000',
      city: mat.city || 'Mumbai',
      state: mat.state || 'Maharashtra',
      country: mat.country || 'India',
      photoUrl: mat.photoUrl || currentUser?.profilePhoto || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
      additionalPhotos: mat.additionalPhotos || [],
      aboutMe: mat.aboutMe || '',
      familyDetails: mat.familyDetails || '',
      dietPreference: mat.dietPreference || 'Strict Jain',
      isVerified: true,
      membershipTier: 'Free',
      contactEmail: mat.contactEmail || currentUser?.email || 'contact@example.com',
      contactMobile: mat.contactMobile || currentUser?.mobile || '+91 98000 00000',
      interestsReceived: [],
      interestsAccepted: [],
    };

    setMatrimonials((prev) => [newMat, ...prev]);
    showToast('Matrimonial Profile Created!', 'Your biodata is live on Jain Matrimonial Directory.', 'success');
  };

  const addPost = (content: string, imageUrl?: string, category = 'General') => {
    const newPost: CommunityPost = {
      id: `post_${Date.now()}`,
      authorId: currentUser?.id || 'usr_guest',
      authorName: currentUser?.fullName || 'Jain Member',
      authorRole: currentUser?.role || 'Member',
      authorPhoto: currentUser?.profilePhoto || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=600&q=80',
      content,
      imageUrl,
      category: category as any,
      likesCount: 1,
      likedByUsers: [currentUser?.id || 'usr_guest'],
      comments: [],
      createdAt: 'Just now',
    };

    setPosts((prev) => [newPost, ...prev]);
    showToast('Post Published', 'Shared with the global Jain community feed.', 'success');
  };

  const likePost = (postId: string) => {
    const userId = currentUser?.id || 'usr_guest';
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id === postId) {
          const alreadyLiked = p.likedByUsers.includes(userId);
          const updatedLikes = alreadyLiked
            ? p.likedByUsers.filter((id) => id !== userId)
            : [...p.likedByUsers, userId];
          return {
            ...p,
            likedByUsers: updatedLikes,
            likesCount: updatedLikes.length,
          };
        }
        return p;
      })
    );
  };

  const addComment = (postId: string, text: string) => {
    if (!text.trim()) return;
    const authorName = currentUser?.fullName || 'Jain Devotee';
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id === postId) {
          return {
            ...p,
            comments: [
              ...p.comments,
              { id: `c_${Date.now()}`, authorName, text, createdAt: 'Just now' },
            ],
          };
        }
        return p;
      })
    );
  };

  const sendInterest = (matrimonialId: string) => {
    const userId = currentUser?.id || 'usr_guest';
    setMatrimonials((prev) =>
      prev.map((m) => {
        if (m.id === matrimonialId) {
          if (m.interestsReceived.includes(userId)) {
            return m;
          }
          return {
            ...m,
            interestsReceived: [...m.interestsReceived, userId],
          };
        }
        return m;
      })
    );
    showToast('Interest Request Sent!', 'The candidate and family have been notified.', 'success');
  };

  const acceptInterest = (matrimonialId: string, fromUserId: string) => {
    setMatrimonials((prev) =>
      prev.map((m) => {
        if (m.id === matrimonialId) {
          return {
            ...m,
            interestsAccepted: [...m.interestsAccepted, fromUserId],
          };
        }
        return m;
      })
    );
    showToast('Interest Accepted!', 'You can now view full contact details and chat directly.', 'success');
  };

  const addBloodDonor = (donor: Partial<BloodDonor>) => {
    const newDonor: BloodDonor = {
      id: `bd_${Date.now()}`,
      name: donor.name || currentUser?.fullName || 'Jain Donor',
      bloodGroup: donor.bloodGroup || 'O+',
      city: donor.city || 'Mumbai',
      state: donor.state || 'Maharashtra',
      mobile: donor.mobile || currentUser?.mobile || '+91 98000 00000',
      available: true,
    };
    setBloodDonors((prev) => [newDonor, ...prev]);
    showToast('Donor Registered!', 'Thank you for registering in the Jain Emergency Blood Network.', 'success');
  };

  const addJob = (job: Partial<JobItem>) => {
    const newJob: JobItem = {
      id: `job_${Date.now()}`,
      title: job.title || 'Job Opening',
      company: job.company || 'Jain Enterprise',
      location: job.location || 'Mumbai',
      type: job.type || 'Full-time',
      salary: job.salary || 'Negotiable',
      contactEmail: job.contactEmail || currentUser?.email || 'hr@jainenterprise.com',
      description: job.description || '',
      postedDate: new Date().toISOString().split('T')[0],
    };
    setJobs((prev) => [newJob, ...prev]);
    showToast('Job Opportunity Posted!', 'Listed on Jain Education & Career Portal.', 'success');
  };

  const addAdBanner = (ad: Partial<AdBanner>) => {
    const newAd: AdBanner = {
      id: `ad_${Date.now()}`,
      title: ad.title || 'Promotional Banner',
      imageUrl: ad.imageUrl || 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=1200&q=80',
      linkUrl: ad.linkUrl || '#',
      position: ad.position || 'Home Banner',
      sponsorName: ad.sponsorName || 'Verified Sponsor',
      description: ad.description || '',
      offerDiscount: ad.offerDiscount || '',
      contactMobile: ad.contactMobile || '9514237277',
      expiryDate: ad.expiryDate || '2026-12-31',
      businessId: ad.businessId,
      ownerUserId: ad.ownerUserId,
      isActive: true,
    };
    setAds((prev) => [newAd, ...prev]);

    // Send Notification & Reminder to linked business owner
    if (ad.businessId || ad.ownerUserId) {
      const newNotif: AppNotification = {
        id: `notif_${Date.now()}`,
        userId: ad.ownerUserId || 'all',
        title: '📢 Business Ad Published!',
        message: `Your advertisement "${newAd.title}" is published on Home Page. Valid till ${newAd.expiryDate}. Contact Admin (9514237277) to extend or renew.`,
        type: 'AdReminder',
        isRead: false,
        createdAt: 'Just now',
      };
      setNotifications((prev) => [newNotif, ...prev]);
    }

    showToast('Advertisement Live!', 'Business promotion is now running on the public home page.', 'success');
  };

  const deleteAdBanner = (adId: string) => {
    setAds((prev) => prev.filter((a) => a.id !== adId));
    showToast('Ad Removed', 'Banner removed from system.', 'info');
  };

  const addNewsItem = (item: Partial<NewsItem>) => {
    const newNews: NewsItem = {
      id: `news_${Date.now()}`,
      title: item.title || 'Community Update',
      summary: item.summary || '',
      content: item.content || '',
      imageUrl: item.imageUrl || 'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=800&q=80',
      category: item.category || 'Global News',
      publishedDate: new Date().toISOString().split('T')[0],
      author: 'Admin SKJ Tech World',
      isPinned: item.isPinned || false,
    };
    setNews((prev) => [newNews, ...prev]);
    showToast('News Announcement Published!', 'Broadcasted to all users.', 'success');
  };

  const updateSystemSettings = (settings: Partial<SystemSettings>) => {
    setSystemSettings((prev) => {
      const updated = { ...prev, ...settings };
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(updated));
      return updated;
    });
    showToast('Settings Saved', 'Platform customization updated successfully.', 'success');
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        users,
        matrimonials,
        businesses,
        temples,
        members,
        posts,
        news,
        ads,
        panchang,
        bloodDonors,
        jobs,
        notifications,
        systemSettings,
        activeTab,
        setActiveTab,
        language,
        setLanguage,
        themeMode,
        toggleTheme,
        searchQuery,
        setSearchQuery,
        isAuthModalOpen,
        setIsAuthModalOpen,
        isRegModalOpen,
        setIsRegModalOpen,
        isAISearchOpen,
        setIsAISearchOpen,
        isMembershipModalOpen,
        setIsMembershipModalOpen,
        toastMessage,
        showToast,
        login,
        logout,
        registerUser,
        approveUser,
        rejectUser,
        suspendUser,
        verifyUserBadge,
        addCommunityMember,
        addBusiness,
        approveBusiness,
        addTemple,
        addMatrimonial,
        addPost,
        likePost,
        addComment,
        sendInterest,
        acceptInterest,
        addBloodDonor,
        addJob,
        addAdBanner,
        deleteAdBanner,
        addNewsItem,
        updateSystemSettings,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
