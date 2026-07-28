export type LanguageCode = 'English' | 'Hindi' | 'Gujarati' | 'Marathi' | 'Kannada' | 'Tamil' | 'Telugu';

export const LANGUAGE_MAP: Record<LanguageCode, { langCode: string; native: string; label: string }> = {
  English: { langCode: 'en', native: 'English', label: 'English' },
  Hindi: { langCode: 'hi', native: 'हिन्दी', label: 'Hindi' },
  Gujarati: { langCode: 'gu', native: 'ગુજરાતી', label: 'Gujarati' },
  Marathi: { langCode: 'mr', native: 'मराठी', label: 'Marathi' },
  Kannada: { langCode: 'kn', native: 'ಕನ್ನಡ', label: 'Kannada' },
  Tamil: { langCode: 'ta', native: 'தமிழ்', label: 'Tamil' },
  Telugu: { langCode: 'te', native: 'తెలుగు', label: 'Telugu' },
};

export const NAV_TRANSLATIONS: Record<LanguageCode, Record<string, string>> = {
  English: {
    home: 'Home',
    matrimonial: 'Matrimonial',
    business: 'Business Directory',
    directory: 'Jain Directory',
    temple: 'Temple Directory',
    panchang: 'Panchang & Quotes',
    feed: 'Community Feed',
    emergency: 'Services & Emergency',
    bhajans: 'Bhajans & Songs',
    admin: 'Admin Panel',
  },
  Hindi: {
    home: 'मुख्य पृष्ठ',
    matrimonial: 'वैवाहिक',
    business: 'व्यापार निर्देशिका',
    directory: 'जैन निर्देशिका',
    temple: 'मंदिर निर्देशिका',
    panchang: 'पंचांग और विचार',
    feed: 'सामुदायिक फीड',
    emergency: 'सेवाएं एवं आपातकालीन',
    bhajans: 'भजन और स्तवन',
    admin: 'एडमिन पैनल',
  },
  Gujarati: {
    home: 'મુખ્ય પૃષ્ઠ',
    matrimonial: 'લગ્ન સમિતિ',
    business: 'વેપાર ડિરેક્ટરી',
    directory: 'જૈન ડિરેક્ટરી',
    temple: 'મંદિર ડિરેક્ટરી',
    panchang: 'પંચાંગ અને સુવિચાર',
    feed: 'સમુદાય ફીડ',
    emergency: 'સેવાઓ અને કટોકટી',
    bhajans: 'ભજન અને સ્તવન',
    admin: 'એડમિન પેનલ',
  },
  Marathi: {
    home: 'मुख्य पृष्ठ',
    matrimonial: 'मॅट्रिमोनिअल',
    business: 'व्यवसाय डिरेक्टरी',
    directory: 'जैन डिरेक्टरी',
    temple: 'मंदिर डिरेक्टरी',
    panchang: 'पंचांग आणि विचार',
    feed: 'समुदाय फीड',
    emergency: 'सेवा आणि आणीबाणी',
    bhajans: 'भजन आणि स्तवन',
    admin: 'ॲडमिन पॅनेल',
  },
  Kannada: {
    home: 'ಮುಖ್ಯ ಪುಟ',
    matrimonial: 'ವೈವಾಹಿಕ',
    business: 'ವ್ಯಾಪಾರ ಸೂಚಿ',
    directory: 'ಜೈನ ಸೂಚಿ',
    temple: 'ದೇವಾಲಯ ಸೂಚಿ',
    panchang: 'ಪಂಚಾಂಗ ಮತ್ತು ವಿಚಾರಗಳು',
    feed: 'ಸಮುದಾಯ ಫೀಡ್',
    emergency: 'ಸೇವೆಗಳು ಮತ್ತು ತುರ್ತು',
    bhajans: 'ಭಜನೆಗಳು ಮತ್ತು ಹಾಡುಗಳು',
    admin: 'ಅಡ್ಮಿನ್',
  },
  Tamil: {
    home: 'முகப்பு',
    matrimonial: 'திருமணம்',
    business: 'வணிக அடைவு',
    directory: 'ஜைன அடைவு',
    temple: 'கோவில் அடைவு',
    panchang: 'பஞ்சாங்கம்',
    feed: 'சமூக பதிவுகள்',
    emergency: 'சேவைகள் & அவசரநிலை',
    bhajans: 'பஜனைகள் & பாடல்கள்',
    admin: 'நிர்வாகி',
  },
  Telugu: {
    home: 'హోమ్',
    matrimonial: 'వైవాహికం',
    business: 'వ్యాపార డైరెక్టరీ',
    directory: 'జైన డైరెక్టరీ',
    temple: 'దేవాలయ డైరెక్టరీ',
    panchang: 'పంచాంగం',
    feed: 'కమ్యూనిటీ ఫీడ్',
    emergency: 'సేవలు & అత్యవసరం',
    bhajans: 'భజనలు & పాటలు',
    admin: 'అడ్మిన్',
  },
};

export const applyLanguageChange = (lang: LanguageCode) => {
  const langObj = LANGUAGE_MAP[lang] || LANGUAGE_MAP.English;
  const langCode = langObj.langCode;

  try {
    if (langCode === 'en') {
      // Clear translation cookies to restore original English
      document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
      document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; domain=${window.location.hostname}; path=/;`;
    } else {
      // Set googtrans cookie for Google Translate engine
      document.cookie = `googtrans=/en/${langCode}; path=/;`;
      document.cookie = `googtrans=/en/${langCode}; domain=${window.location.hostname}; path=/;`;
    }

    // Helper to find and trigger Google Translate select box
    const triggerCombo = (attemptsLeft = 10) => {
      const googleSelect = document.querySelector('.goog-te-combo') as HTMLSelectElement | null;
      if (googleSelect) {
        googleSelect.value = langCode;
        googleSelect.dispatchEvent(new Event('change', { bubbles: true }));
        googleSelect.dispatchEvent(new Event('input', { bubbles: true }));
      } else if (attemptsLeft > 0) {
        setTimeout(() => triggerCombo(attemptsLeft - 1), 300);
      }
    };

    triggerCombo();
  } catch (err) {
    console.error('Language change error:', err);
  }
};
