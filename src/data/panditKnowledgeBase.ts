import { PanditTradition, PanditCategory, PanditMantra, PanditStepGuide } from '../types';
import { COMMON_PUJA_STEP_GUIDES } from './pujaStepGuides';

export interface QuickPrompt {
  id: string;
  category: PanditCategory;
  question: string;
  tradition?: PanditTradition;
  description: string;
  icon: string;
}

export interface RitualGuide {
  id: string;
  title: string;
  subtitle: string;
  category: PanditCategory;
  tradition: string;
  primaryScripture: string;
  overview: string;
  steps: {
    stepNumber: number;
    name: string;
    description: string;
    bhavna: string;
    mantraOrSutra?: string;
  }[];
  materialsNeeded: string[];
  rulesAndPurity: string[];
}

export interface ScriptureOverview {
  title: string;
  author: string;
  period: string;
  tradition: string;
  coreTheme: string;
  keyChapters: string[];
  significance: string;
}

export const CURATED_PANDIT_PROMPTS: QuickPrompt[] = [
  {
    id: 'ashtaprakari_puja',
    category: 'Puja & Abhishek',
    question: 'How to perform morning Ashtaprakari Puja step-by-step with proper Bhavna?',
    description: 'Detailed vidhi for Jal, Chandan, Pushpa, Dhoop, Deep, Akshat, Naivedya & Phal puja.',
    icon: 'Flame'
  },
  {
    id: 'samayik_vidhi',
    category: 'Samayik & Pratikraman',
    question: 'What is the exact vidhi and rules for performing Samayik and Muhpatti Padilehan?',
    description: '48-minute equanimity practice, Karemi Bhante recitation, and 50-bol inspection.',
    icon: 'Sparkles'
  },
  {
    id: 'ayambil_navpad',
    category: 'Pachkan & Fasting',
    question: 'What are the strict rules and spiritual significance of Ayambil during Navpad Oli?',
    description: 'Guidelines on Vigai prohibition (no milk, curd, ghee, oil, sugar) and single-grain meal.',
    icon: 'Award'
  },
  {
    id: 'kandmool_reasons',
    category: 'Dietary & Kandmool',
    question: 'Why are root vegetables (kandmool like potato, onion, garlic) prohibited in Jain scriptures?',
    description: 'Scriptural explanation from Agamas and Tattvartha Sutra regarding infinite souls (Anantkay).',
    icon: 'ShieldAlert'
  },
  {
    id: 'pratikraman_guide',
    category: 'Samayik & Pratikraman',
    question: 'How is Pratikraman performed at home and what is the spiritual meaning of Michhami Dukkadam?',
    description: 'Morning and evening cleansing of karmic transgressions and universal forgiveness.',
    icon: 'Heart'
  },
  {
    id: 'griha_pravesh_vidhi',
    category: 'Sanskars & Griha Pravesh',
    question: 'What is the auspicious Jain vidhi for Griha Pravesh (entering a new house)?',
    description: 'Shanti Snatra, Navkar Mahamantra chanting, Mangal Kalash, and Jinendra stuti.',
    icon: 'Home'
  },
  {
    id: 'tattvartha_7_tattvas',
    category: 'Agamas & Philosophy',
    question: 'Can you explain the 7 Tattvas and 9 Padarthas from Acharya Umasvati’s Tattvartha Sutra?',
    description: 'Jiva, Ajiva, Asrava, Bandha, Samvara, Nirjara, and Moksha explained simply.',
    icon: 'BookOpen'
  },
  {
    id: '12_shravak_vratas',
    category: 'Agamas & Philosophy',
    question: 'What are the 12 Vratas (Anuvratas, Gunavratas, Shikshavratas) of a Jain Shravaka?',
    description: 'Daily vows for householders from Ratnakaranda Shravakachara.',
    icon: 'CheckCircle2'
  },
  {
    id: 'navkar_mantra_meaning',
    category: 'Agamas & Philosophy',
    question: 'What is the esoteric word-by-word meaning and power of the Navkar Mahamantra?',
    description: 'Salutations to the 5 Parameshtis, destroying all sins, foremost among auspicious mantras.',
    icon: 'Sun'
  },
  {
    id: 'pachkan_timings',
    category: 'Pachkan & Fasting',
    question: 'What is the difference between Navkarshi, Porshi, Purimaddh, and Chauvihar pachkan?',
    description: 'Morning and evening tithi vow timings calculated from local sunrise and sunset.',
    icon: 'Clock'
  },
  {
    id: 'swetambar_digambar_puja',
    category: 'Puja & Abhishek',
    question: 'What are the sacred similarities and subtle ritual differences between Swetambar and Digambar Puja?',
    description: 'Anga puja, Chhatra-chamar vs pure Digambar Abhishek and Vastra-rahit Jinendra worship.',
    icon: 'Compass'
  },
  {
    id: 'paryushan_das_lakshana',
    category: 'Pachkan & Fasting',
    question: 'What are the daily spiritual observances during Paryushan Parva and Das Lakshana?',
    description: 'The 10 Dharma virtues: Uttam Kshama, Mardava, Arjava, Shaucha, Satya, Sanyam, Tapa, Tyaga, Akinchanya, Brahmacharya.',
    icon: 'Calendar'
  }
];

export const ASHTAPRAKARI_PUJA_GUIDE: RitualGuide = {
  id: 'ashtaprakari_puja',
  title: 'Sacred Ashtaprakari Puja (८ प्रकार की पूजा)',
  subtitle: 'The 8-Fold Worship of the Tirthankara',
  category: 'Puja & Abhishek',
  tradition: 'Classical Jain Tradition (Swetambar & Digambar foundations)',
  primaryScripture: 'Yoga Shastra, Pravachanasara, and Traditional Puja Paddhati',
  overview: 'Ashtaprakari Puja is the supreme daily ritual performed by Jain householders (Shravakas and Shravikas) before the Pratima of the Arihant Bhagwan. Each of the eight offerings symbolizes the destruction of a specific karma and the attainment of pure spiritual virtues.',
  materialsNeeded: [
    'Pure filtered water (Jal) with small silver/brass lota',
    'Pure sandalwood paste (Keshar Chandan)',
    'Fresh unplucked or fallen fragrant flowers (or clean yellow akshat for Ahimsa practice)',
    'Pure natural herbal dhoop/incense stick',
    'Deepak (pure ghee or camphor lamp)',
    'Clean, unbroken white rice grains (Akshat)',
    'Pure sattvic sweetmeat prepared without animal rennet/eggs (Naivedya)',
    'Fresh sweet seasonal fruits with skin intact (Phal)'
  ],
  rulesAndPurity: [
    'Bathe with clean water and wear clean unstitched puja clothes (Puja vastra) kept strictly separate from street clothes.',
    'Fast or maintain Navkarshi (do not eat food before derasar puja).',
    'Tie a Mukhapatti or hold a clean white cloth over mouth while speaking or chanting to prevent warm breath reaching the sacred idol.',
    'Recite "Nisihi" thrice: 1st outside the temple gate (renouncing worldly tasks), 2nd inside the mandap (leaving family thoughts), and 3rd at the garbhagriha door (focusing only on the Jina).',
    'Circumambulate (Pradakshina) the sanctum three times clockwise, meditating on the Three Jewels: Samyak Darshana, Samyak Jnana, Samyak Caritra.'
  ],
  steps: [
    {
      stepNumber: 1,
      name: 'Jal Puja (जल पूजा - Water Offering)',
      description: 'Bathing the lotus feet of Jinendra with pure water using a conch shell or consecrated vessel.',
      bhavna: 'Just as pure water removes dust from the body, may this holy water wash away the dirt of attachment, anger, and delusion from my soul. I seek freedom from the cycle of birth and rebirth.',
      mantraOrSutra: 'ॐ ह्रीं श्रीं अर्हं परमपुरुषाय परमेश्वराय जलं निर्वपामीति स्वाहा।'
    },
    {
      stepNumber: 2,
      name: 'Chandan Puja (चंदन पूजा - Sandalwood Offering)',
      description: 'Applying fragrant cooling sandalwood paste mixed with saffron (keshar) to the 9 auspicious body points (Nav-Anga) of the Jina idol: toes, knees, wrists, shoulders, crown, forehead, throat, chest, and navel.',
      bhavna: 'Sandalwood cools the fiercest heat. May this chandan extinguish the three fires of suffering (Adhyatmik, Adhibhautik, Adhidaivik) and the blazing fire of Anger (Krodha) in my soul.',
      mantraOrSutra: 'ॐ ह्रीं श्रीं अर्हं परमपुरुषाय परमेश्वराय चन्दनं निर्वपामीति स्वाहा।'
    },
    {
      stepNumber: 3,
      name: 'Pushpa Puja (पुष्प पूजा - Flower Offering)',
      description: 'Offering fresh, naturally fragrant flowers (or saffron-tinted akshat) at the feet of the Lord.',
      bhavna: 'Flowers possess pure fragrance and gentle softness. May my life become fragrant with moral character (Sheela) and compassion for all living beings.',
      mantraOrSutra: 'ॐ ह्रीं श्रीं अर्हं परमपुरुषाय परमेश्वराय पुष्पं निर्वपामीति स्वाहा।'
    },
    {
      stepNumber: 4,
      name: 'Dhoop Puja (धूप पूजा - Incense Offering)',
      description: 'Waving fragrant herbal incense before the Lord while ringing the bell gently.',
      bhavna: 'As the incense burns and its smoke rises upward, may all 8 types of binding karmas be incinerated, and may my soul ascend upward to Moksha.',
      mantraOrSutra: 'ॐ ह्रीं श्रीं अर्हं परमपुरुषाय परमेश्वराय धूपं निर्वपामीति स्वाहा।'
    },
    {
      stepNumber: 5,
      name: 'Deep Puja (दीप पूजा - Lamp Offering)',
      description: 'Waving a bright pure lamp before the divine countenance of the Tirthankara.',
      bhavna: 'The lamp dispels outer darkness. May the light of Kevala Jnana (Infinite Omniscience) illuminate my consciousness and banish the darkness of ignorance (Mithyatva).',
      mantraOrSutra: 'ॐ ह्रीं श्रीं अर्हं परमपुरुषाय परमेश्वराय दीपं निर्वपामीति स्वाहा।'
    },
    {
      stepNumber: 6,
      name: 'Akshat Puja (अक्षत पूजा - Rice Offering)',
      description: 'Arranging unbroken white rice grains upon the patila into a sacred Swastika (representing the 4 states of existence: heavenly, human, animal, hellish), 3 heaps (Ratnatraya: Right Faith, Knowledge, Conduct), and a crescent with a dot (Siddha Shila).',
      bhavna: 'Akshat means indestructible/unbroken. Rice without husk cannot sprout again. May I never take birth again in the 4 gatis and attain the eternal abode of the Siddhas.',
      mantraOrSutra: 'ॐ ह्रीं श्रीं अर्हं परमपुरुषाय परमेश्वराय अक्षतं निर्वपामीति स्वाहा।'
    },
    {
      stepNumber: 7,
      name: 'Naivedya Puja (नैवेद्य पूजा - Sweet Offering)',
      description: 'Placing pure sweets or sacred food offering on the Siddha Shila diagram.',
      bhavna: 'Worldly food only satisfies the biological body temporarily. By offering this, I aspire to conquer the disease of hunger (Kshudha Rog) and attain the state of Anahari (the non-eating Siddha state).',
      mantraOrSutra: 'ॐ ह्रीं श्रीं अर्हं परमपुरुषाय परमेश्वराय नैवेद्यं निर्वपामीति स्वाहा।'
    },
    {
      stepNumber: 8,
      name: 'Phal Puja (फल पूजा - Fruit Offering)',
      description: 'Offering fresh delicious fruits as the crowning culmination of the worship.',
      bhavna: 'Actions yield fruits. Worldly accomplishments bear transient fruits. I offer this fruit seeking the supreme, imperishable fruit of liberation: Moksha Pada.',
      mantraOrSutra: 'ॐ ह्रीं श्रीं अर्हं परमपुरुषाय परमेश्वराय फलं निर्वपामीति स्वाहा।'
    }
  ]
};

export const JAIN_CLASSICAL_SCRIPTURES: ScriptureOverview[] = [
  {
    title: 'Tattvartha Sutra (Moksha Shastra)',
    author: 'Acharya Umasvati (Umasvami)',
    period: 'Circa 2nd - 4th Century CE',
    tradition: 'Universally revered by both Swetambar & Digambar traditions',
    coreTheme: 'The complete compendium of Jain metaphysics, ethics, epistemology, cosmology, and the path to liberation.',
    keyChapters: [
      'Chapter 1: Right Faith, Right Knowledge, Pramana & Naya',
      'Chapter 2: Nature of the Jiva (Soul) and its states',
      'Chapter 3-4: Cosmology (Lower, Middle, and Heavenly realms)',
      'Chapter 5: Ajiva (Non-soul substances: Pudgala, Dharma, Adharma, Akasha, Kala)',
      'Chapter 6-8: Asrava (Karmic inflow), Bandha (Bondage), and types of karmas',
      'Chapter 9-10: Samvara (Stoppage), Nirjara (Shedding), and Moksha (Liberation)'
    ],
    significance: 'Contains the timeless foundational aphorism "Parasparopagraho Jivanam" (Souls render service to one another) and the opening definition of the path to Moksha: "Samyag-darsana-jnana-caritrani moksamargah".'
  },
  {
    title: 'Samayasara (Essence of the Soul)',
    author: 'Acharya Kundakunda',
    period: 'Circa 1st - 2nd Century CE',
    tradition: 'Foremost text of Digambar Adhyatma & studied globally',
    coreTheme: 'The supreme spiritual nature of the pure soul (Shuddhatma) from the Nishchaya Naya (ultimate transcendental perspective).',
    keyChapters: [
      'Purvaranga: The pristine nature of the knower soul',
      'Jiva-Ajiva Adhikara: Discrimination between conscious self and matter',
      'Kartri-Karma Adhikara: The soul is the creator of its own feelings, not external matter',
      'Punya-Papa Adhikara: Both golden chains (good deeds) and iron chains (evil deeds) cause bondage',
      'Sarva-Vishuddha Jnana: The completely pure knowledge state'
    ],
    significance: 'Considered the crown jewel of Jain spiritual mysticism, guiding seekers to disidentify from karmic bodies and abide in the self-luminous pure soul.'
  },
  {
    title: 'Ratnakaranda Shravakachara',
    author: 'Acharya Samantabhadra',
    period: 'Circa 2nd - 5th Century CE',
    tradition: 'Foundational householder ethics code',
    coreTheme: 'The practical conduct, daily vows, and spiritual duties of a Jain Shravaka (householder).',
    keyChapters: [
      'Samyak Darshana: 8 angas of Right Faith and freedom from 8 prides and 3 super-delusions',
      'Anuvratas: The 5 partial vows (Ahimsa, Satya, Achaurya, Brahmacharya, Parigraha Parimana)',
      'Gunavratas & Shikshavratas: Digvrata, Deshavrata, Anarthadandavrata, Samayika, Proshadhopavasa, Bhogopabhoga Parimana, Atithi Samvibhaga',
      'Sallekhana: The peaceful, voluntary spiritual relinquishment of the body at the time of unavoidable death'
    ],
    significance: 'The definitive handbook for moral living in society while progressing along the 11 Pratimas of spiritual elevation.'
  },
  {
    title: 'Chhah Dhala (छह ढाला)',
    author: 'Pandit Daulatram Ji',
    period: '18th Century CE',
    tradition: 'Classical Hindi poetic scripture widely studied in every Jain home',
    coreTheme: 'A succinct, heart-touching presentation of the soul’s wanderings in Samsara and the stepwise journey to omniscience.',
    keyChapters: [
      '1st Dhala: Suffering of the soul in the 4 Gatis (Narak, Tiriyancha, Manushya, Deva)',
      '2nd Dhala: The root cause of suffering - Mithyadarsana, Mithyajnana, Mithyacharitra',
      '3rd Dhala: Attainment of Samyaktva and the 5 Anuvratas of a Shravak',
      '4th Dhala: 12 Vratas and 11 Pratimas of a householder',
      '5th Dhala: The 12 Bhavnas (Anitya, Asharana, Samsara, Ekatva, Anyatva, Ashaucha, Asrava, Samvara, Nirjara, Loka, Bodhidurlabha, Dharma)',
      '6th Dhala: The 28 Mulagunas of Digambar Muni and Kevala Jnana'
    ],
    significance: 'Revered as the "Pocket Gita of Jainism", making intricate metaphysical truths accessible through melodious rhyming verses.'
  },
  {
    title: 'Uttaradhyayana Sutra',
    author: 'Last oral sermon delivered by Bhagwan Mahavira on the night of His Nirvana',
    period: '6th Century BCE',
    tradition: 'Swetambar Agama Canon (Mula Sutra)',
    coreTheme: '36 chapters of sublime moral instruction, dialogues between kings and monks, parables on human fragility, and renunciation.',
    keyChapters: [
      'Chapter 1: Vinaya (Humility and reverence as the foundation of learning)',
      'Chapter 9: The renunciation of King Nami',
      'Chapter 10: "Khanam Jano Ma Pamayae" (Do not waste even a single moment in heedlessness)',
      'Chapter 23: Dialogue between Kesi (follower of Parshvanath) and Gautama (disciple of Mahavira), demonstrating unity of the 23rd and 24th Tirthankara traditions'
    ],
    significance: 'The final spiritual testament of Tirthankara Mahavira, recited by millions during Paryushan Parva.'
  }
];

export const SACRED_JAIN_MANTRAS: PanditMantra[] = [
  {
    name: 'Navkar Mahamantra (णमोकार महामंत्र)',
    verse: 'णमो अरिहंताणं ।\nणमो सिद्धाणं ।\nणमो आयरियाणं ।\nणमो उवज्झायाणं ।\nणमो लोए सव्व साहूणं ।\nएसोपञ्चणमोक्कारो, सव्वपावप्पणासणो ।\nमंगलाणं च सव्वेसिं, पढमं हवई मंगलं ॥',
    meaning: 'I bow to the Arihantas (supreme omniscient teachers). I bow to the Siddhas (liberated bodiless souls). I bow to the Acharyas (spiritual heads). I bow to the Upadhyayas (scriptural teachers). I bow to all the Sadhus (monks) in the universe. This fivefold salutation destroys all sins and is the foremost of all auspicious blessings.'
  },
  {
    name: 'Chattari Mangalam (चत्तारि मंगलं)',
    verse: 'चत्तारि मंगलं, अरिहंता मंगलं, सिद्धा मंगलं, साहू मंगलं, केवलिपन्नत्तो धम्मो मंगलं ।\nचत्तारि लोगुत्तमा, अरिहंता लोगुत्तमा, सिद्धा लोगुत्तमा, साहू लोगुत्तमा, केवलिपन्नत्तो धम्मो लोगुत्तमो ।\nचत्तारि सरणं पव्वज्जामि, अरिहंते सरणं पव्वज्जामि, सिद्धे सरणं पव्वज्जामि, साहू सरणं पव्वज्जामि, केवलिपन्नत्तं धम्मं सरणं पव्वज्जामि ॥',
    meaning: 'Four are auspicious: Arihantas, Siddhas, Sadhus, and the True Dharma preached by the Omniscients. Four are supreme in the universe. In these four alone do I take refuge.'
  },
  {
    name: 'Uvasaggaharam Stotra (उवसग्गहरं स्तोत्र)',
    verse: 'उवसग्गहरं पासं, वंदामि कम्म-घण-मुक्कं ।\nविसहर-विस-निन्नासं, मंगल-कल्लाण-आवासं ॥',
    meaning: 'I bow down to Lord Parshvanath, the dispeller of all obstacles (upadravas), freed from dense karmas, who neutralizes the deadliest serpent venom of passions, and is the sacred dwelling place of all auspiciousness and welfare.'
  },
  {
    name: 'Khamemi Savve Jive (Universal Forgiveness Shloka)',
    verse: 'खामेमि सव्व जीवे, सव्वे जीवा खमंतु मे ।\nमित्ती मे सव्व-भूएसु, वेरं मज्झं न केणइ ॥',
    meaning: 'I grant forgiveness to all living beings, and may all living beings forgive me. I have friendship with all entities in the cosmos, and enmity with none. (Michhami Dukkadam).'
  },
  {
    name: 'Karemi Bhante (Samayik Sankalp)',
    verse: 'करेमि भंते ! सामाइयं, सावज्जं जोगं पच्चक्खामि, जाव नियमं पज्जुवासामि, दुविहं तिविहेणं, मणेणं वायाए काएणं, न करेमि न कारवेमि, तस्स भंते ! पडिक्कमामि, निंदामि गरिहामि, अप्पाणं वोसिरामि ॥',
    meaning: 'O Revered Master! I take the vow of Samayika (equanimity). I renounce all sinful and hurtful activities for the fixed duration of 48 minutes, neither performing them myself nor causing others to perform them, by mind, speech, and body. I repent, censure my shortcomings, and surrender my soul to pure righteousness.'
  }
];

// Offline intelligent fallback answers when Gemini API key is not configured
export function getOfflinePanditAnswer(question: string, tradition?: PanditTradition, _category?: PanditCategory): {
  reply: string;
  scripturalReferences: string[];
  recommendedPachkanOrVow?: string;
  mantras?: PanditMantra[];
  followUpQuestions: string[];
  stepGuide?: PanditStepGuide | null;
} {
  const q = question.toLowerCase();

  if (q.includes('ashtaprakari') || q.includes('puja') || q.includes('8 prakar') || q.includes('abhishek') || q.includes('vidhi')) {
    return {
      reply: `🙏 **जय जिनेन्द्र! Jai Jinendra!**\n\n### The Sacred Eight-Fold Worship (अष्टप्रकारी पूजा)\n\nIn classical Jainism, **Ashtaprakari Puja** is the supreme daily worship offered to Tirthankara Bhagwan. It is not an act of asking worldly boons, but a contemplation (**Bhavna**) to purify the soul from the 8 binding karmas.\n\nHere is the comprehensive, step-by-step visual guide to performing each of the 8 sacred offerings, along with the precise Bhavna and mantra for each step:`,
      scripturalReferences: [
        'Yoga Shastra by Acharya Hemachandra',
        'Pravachanasara by Acharya Kundakunda',
        'Traditional Jain Puja Paddhati & Snattra Vidhi'
      ],
      recommendedPachkanOrVow: 'Navkarshi (Abstaining from food & water until 48 minutes after sunrise before entering Derasar)',
      mantras: [
        {
          name: 'Panchamrit Abhishek / Puja Pranam',
          verse: 'ॐ नमोऽर्हद्भ्यः सर्वज्ञेभ्यः परमवीतरागेभ्यः नमः।',
          meaning: 'Salutations to the Worthy Omniscient Beings who are completely detached from passion and aversion.'
        }
      ],
      stepGuide: COMMON_PUJA_STEP_GUIDES.ashtaprakari_puja,
      followUpQuestions: [
        'What are the 9 specific body points (Nav-Anga) where chandan is applied?',
        'What is the difference between Anga Puja and Agra Puja?',
        'What is the procedure for Snattra Puja during special occasions?'
      ]
    };
  }

  if (q.includes('samayik') || q.includes('muhpatti') || q.includes('padilehan') || q.includes('48')) {
    return {
      reply: `🙏 **जय जिनेन्द्र! Jai Jinendra!**\n\n### The Sacred Vidhi of Samayika (सामायिक साधना)\n\n**Samayika** is derived from *Samaya* (the pure conscious soul) and *Sama* (equanimity). For **48 minutes (one Muhurta / 2 Gharis)**, the Shravaka steps out of all worldly occupations, business, and family disputes to live like a monk (**Sadhu-tulya**).\n\nBelow is the structured step-by-step visual guide outlining the Katasanu asan, Muhpatti Padilehan, Karemi Bhante vow, meditation, and pariharana:`,
      scripturalReferences: [
        'Ratnakaranda Shravakachara, Chapter 4 (Shikshavratas)',
        'Tattvartha Sutra, Chapter 7, Sutra 21',
        'Dasavaikalika Sutra, Chapter 4'
      ],
      recommendedPachkanOrVow: 'Samayika Vrata (48 minutes equanimity pledge)',
      mantras: [
        {
          name: 'Karemi Bhante Sutra',
          verse: 'करेमि भंते ! सामाइयं, सावज्जं जोगं पच्चक्खामि...',
          meaning: 'I undertake equanimity and renounce all injurious and worldly conduct for the prescribed duration.'
        }
      ],
      stepGuide: COMMON_PUJA_STEP_GUIDES.samayik_vidhi,
      followUpQuestions: [
        'What are the 32 faults (Dosh) to avoid during Samayik?',
        'How does Samayik stop the influx of Asrava karmas?',
        'What should one read or chant during the 48 minutes?'
      ]
    };
  }

  if (q.includes('aarti') || q.includes('mangal divo') || q.includes('deepak')) {
    return {
      reply: `🙏 **जय जिनेन्द्र! Jai Jinendra!**\n\n### The Sacred Evening Aarti & Mangal Divo Vidhi (संध्या आरती एवं मंगल दीवो)\n\nIn Jain Derasars and homes, the evening Aarti is an uplifting celebration of light banishing darkness. The five wicks symbolize the Pancha Parameshtis (Arihant, Siddha, Acharya, Upadhyaya, Sadhu), while the Mangal Divo illuminates the path of spiritual welfare.\n\nHere is the step-by-step visual procedure to perform the evening illumination:`,
      scripturalReferences: [
        'Traditional Jain Stuti & Chaitya Vandan Paddhati',
        'Bhadrabahu Samhita',
        'Pravachanasara by Acharya Kundakunda'
      ],
      recommendedPachkanOrVow: 'Chauvihar (Renunciation of all food & water after sunset)',
      mantras: [
        {
          name: 'Shri Jinendra Mangal Divo Stuti',
          verse: 'दीवो रे दीवो प्रभु मंगलिक दीवो, आरती उतारी ने बहु पुण्य लीधो...',
          meaning: 'Auspicious is this sacred flame; by performing this prayer we awaken countless spiritual virtues.'
        }
      ],
      stepGuide: COMMON_PUJA_STEP_GUIDES.aarti_mangal_divo,
      followUpQuestions: [
        'What is the spiritual meaning behind the 5 wicks of the Aarti lamp?',
        'Why must Chauvihar be taken before the evening Aarti?',
        'How does waving the lamp protect the mind from worldly anxieties?'
      ]
    };
  }

  if (q.includes('chaitya') || q.includes('vandan') || q.includes('devavandan')) {
    return {
      reply: `🙏 **जय जिनेन्द्र! Jai Jinendra!**\n\n### Daily Chaitya Vandan Vidhi (चैत्यवंदन विधि)\n\nChaitya Vandan is the daily formal veneration offered before the Jinendra idol upon visiting a temple. It harmonizes speech, bodily prostrations, and inner meditation.\n\nHere is the structured step-by-step guide with Nisihi, Khamasama, Chaityavandan, Jamkinchi, Namutthunam, and Kausagga:`,
      scripturalReferences: [
        'Panchasutradhyayana',
        'Yoga Shastra by Acharya Hemachandra',
        'Vandittu Sutra & Pratikraman Paddhati'
      ],
      stepGuide: COMMON_PUJA_STEP_GUIDES.chaitya_vandan_vidhi,
      followUpQuestions: [
        'What are the 3 Nisihi recited while entering the Derasar?',
        'How many breath counts are observed during the Logassa Kausagga?',
        'What is the significance of reciting Jamkinchi?'
      ]
    };
  }

  if (q.includes('ayambil') || q.includes('oli') || q.includes('navpad') || q.includes('vigai')) {
    return {
      reply: `🙏 **जय जिनेन्द्र! Jai Jinendra!**\n\n### Navpad Oli & The Science of Ayambil (आयम्बिल)\n\n**Ayambil** is an austere spiritual penance celebrated twice a year for 9 days each during the **Chaitra and Ashvin months** (Navpad Oli). It honors the 9 sacred entities of the **Siddhachakra**:\n1. **Arihant** (Omniscient Masters)\n2. **Siddha** (Liberated Pure Souls)\n3. **Acharya** (Spiritual Leaders)\n4. **Upadhyaya** (Preceptors)\n5. **Sadhu** (All Monks)\n6. **Darsana** (Right Intuition/Faith)\n7. **Jnana** (Right Knowledge)\n8. **Caritra** (Right Conduct)\n9. **Tapa** (Spiritual Penance)\n\n#### The Strict Rules of Ayambil Food:\n- The seeker eats **only once a day**, seated in one posture (Asana).\n- The meal must be strictly free from the **6 Vigais (taste-stimulating substances)**:\n  1. Milk (Doodh)\n  2. Curd (Dahi)\n  3. Ghee (Clarified butter)\n  4. Oil (Tel)\n  5. Sugar/Jaggery (Gud/Shakkar)\n  6. Fried delicacies (Talela padartha)\n- Food consists of plain, single-grain boiled preparation (e.g. boiled wheat, rice, moong dal, or gram) seasoned only with minimal rock salt, without turmeric or hot spices.\n- Only boiled cooled water (Ukalevu Paani) is consumed, and strictly before sunset (Chauvihar).\n\n#### Inner Purpose (Bhavna):\nAyambil conquers the most difficult sense organ: **the tongue (Rasana Indriya)**. By shedding craving for taste, bodily passions (Kashayas) subside, mental agitations calm down, and deep karmas are incinerated through Tapa.`,
      scripturalReferences: [
        'Uttaradhyayana Sutra, Chapter 30 (Tapa Marga)',
        'Siddhachakra Mahatmya & Shripal Raja Charitra',
        'Yoga Shastra by Acharya Hemachandra'
      ],
      recommendedPachkanOrVow: 'Ayambil Pachkan & Chauvihar after sunset',
      mantras: [
        {
          name: 'Navpad Jaap Mantra',
          verse: 'ॐ ह्रीं श्रीं पदमप्रभ-सुपार्श्व-चन्द्रप्रभ-पुष्पदंत-शीतल-श्रेयांस-वासुपूज्य-विमल-अनंत-धर्म-शांति-कुंथु-अर-मल्लि-मुनिसुव्रत-नमि-नेमि-पार्श्व-वर्धमानाय नमः।',
          meaning: 'Reverent salutations to the 24 Tirthankaras and the 9 Padas of the sacred Siddhachakra.'
        }
      ],
      followUpQuestions: [
        'Which grain is assigned to which of the 9 Padas during Navpad Oli?',
        'What is the story of King Shripal and Mayanasundari associated with Ayambil?',
        'What are the health and detox benefits of Ayambil according to Ayurveda and modern science?'
      ]
    };
  }

  if (q.includes('kandmool') || q.includes('potato') || q.includes('onion') || q.includes('garlic') || q.includes('root') || q.includes('zaminkand')) {
    return {
      reply: `🙏 **जय जिनेन्द्र! Jai Jinendra!**\n\n### Why Root Vegetables (कंदमूल / जमीकंद) are Prohibited in Jainism\n\nJain dietary ethics are guided by the supreme principle: **"अहिंसा परमो धर्मः" (Non-violence is the supreme virtue)**. The prohibition of root vegetables (potatoes, onions, garlic, carrots, radish, ginger, beetroot, etc.) is based on meticulous biological and spiritual classification found in classical Jain Agamas.\n\n#### The Scriptural Foundation:\n1. **Sadharan Vanaspatikaya (Anantkay - Infinite Souls)**:\n   - Jain biology classifies plant life into two types: *Pratyeka* (one body, one soul, such as fruits, grains, apples, cucumbers) and *Sadharan* (one single physical body shared by infinite living souls, termed *Nigoda*).\n   - Root vegetables grow underground without exposure to sunlight. A single needle-tip of a potato or onion contains **countless microscopic souls (Ananta Jivas)** sharing the same body, breath, and nourishment.\n   - Plucking or eating a single root vegetable results in the destruction of infinite souls in an instant, attracting dense sinful karmas.\n\n2. **Tamasic & Passion-Inducing Effects (Tamasic Ahara)**:\n   - Onions and garlic, in addition to being Anantkay, are classified as *Tamasic* and *Rajasic*. They stimulate anger, lust, delusion, and mental agitation, obstructing meditation and inner equanimity.\n\n3. **Preservation of the Entire Organism**:\n   - When you harvest a tomato, pea pod, or apple, the parent tree continues living.\n   - When an underground root is uprooted, the entire root-plant organism is destroyed from its foundation along with all surrounding subterranean living insects.\n\n*Scriptural Reference:* In the **Tattvartha Sutra (Chapter 2)** and **Acharanga Sutra**, Bhagwan Mahavira explains the subtle life forms (*Sthavara Jivas*) and commands the seeker to cause minimum injury to the earth and plant kingdoms.`,
      scripturalReferences: [
        'Tattvartha Sutra by Acharya Umasvati, Chapter 2 (Classification of Jivas)',
        'Acharanga Sutra, Shrutaskandha 1 (Ahimsa Khanda)',
        'Pravachanasara by Acharya Kundakunda'
      ],
      recommendedPachkanOrVow: 'Kandmool Tyag Vrata (Renunciation of all underground root vegetables)',
      mantras: [
        {
          name: 'Ahimsa Mahavrata Shloka',
          verse: 'सव्वे पाणा न हंतव्वा, न परिघेत्तव्वा, न परितावेयव्वा।',
          meaning: 'All living beings should not be slain, should not be held in bondage, and should not be caused mental or physical torment.'
        }
      ],
      followUpQuestions: [
        'What are the alternatives to onion and garlic in Jain gourmet cooking?',
        'Why is green vegetable consumption avoided on tithis like Aatham and Chaudas?',
        'What is the difference between Pratyeka and Sadharan Vanaspati?'
      ]
    };
  }

  if (q.includes('griha pravesh') || q.includes('home entry') || q.includes('vastu') || q.includes('new house')) {
    return {
      reply: `🙏 **जय जिनेन्द्र! Jai Jinendra!**\n\n### Auspicious Jain Griha Pravesh Vidhi (जैन गृह प्रवेश विधि)\n\nIn Jain tradition, stepping into a new home is celebrated as an opportunity to consecrate the dwelling into a sanctuary of peace, non-violence, and spiritual harmony (**Dharma Sthan**).\n\nBelow is the structured step-by-step visual guide outlining the sacred procedure from Toran pujan to Ghar Derasar sthapana and Sadharmik vatsalya:`,
      scripturalReferences: [
        'Jain Sanskar Vidhi by Acharya Vijay Bhuvanbhanusuri',
        'Vastu Shastra in Jain Heritage (Bhadrabahu Samhita)',
        'Bhaktamara Stotra by Acharya Manatunga'
      ],
      recommendedPachkanOrVow: 'Navkar Mahamantra 108 Jaap & Shanti Snatra',
      mantras: [
        {
          name: 'Shanti Patha Mantra',
          verse: 'ॐ शान्तिः शान्तिः प्रशान्त सर्वोपद्रवाय नमः। ॐ ह्रीं श्रीं पार्श्वनाथाय नमः।',
          meaning: 'May supreme peace prevail, dispelling all calamities and bringing auspicious tranquility to this household.'
        }
      ],
      stepGuide: COMMON_PUJA_STEP_GUIDES.griha_pravesh_shanti,
      followUpQuestions: [
        'Which direction should the home derasar face according to Jain Vastu?',
        'What items should strictly never be kept inside a Jain home?',
        'How to perform Shanti Snatra at home?'
      ]
    };
  }

  // General fallback
  return {
    reply: `🙏 **जय जिनेन्द्र! Jai Jinendra!**\n\nRegarding your question about **"${question}"**${tradition ? ` according to **${tradition}** traditions` : ''}:\n\nJain scriptures guide householders to cultivate the three divine jewels: **Samyak Darshana (Right Intuition/Faith)**, **Samyak Jnana (Right Knowledge)**, and **Samyak Caritra (Right Conduct)**.\n\n### Key Scriptural Guidance:\n- **Foundational Principles**: Every ritual in Jainism is rooted in **Ahimsa** (Non-violence to all life forms), **Aparigraha** (Non-possessiveness and limitation of desires), and **Anekantavada** (Respect for multifaceted perspectives).\n- **Daily Duties of a Shravak (६ आवश्यक)**:\n  1. *Devapuja* (Worship of the 24 Tirthankaras)\n  2. *Gurupasana* (Devoted service and listening to revered Monks)\n  3. *Svadhyaya* (Daily scriptural study of Agamas and Tattvartha Sutra)\n  4. *Sanyama* (Restraint of the five senses and passions)\n  5. *Tapa* (Penance: fasting, Navkarshi, Chauvihar, Rasatyaga)\n  6. *Dana* (Charity: Ahara-dana, Aushadha-dana, Jnana-dana, Abhaya-dana)\n\n*Spiritual Reminder:* Rituals without inner Bhavna (pure sentiment) remain mere mechanical acts. When combined with deep compassion and detachment from ego, even a small act of devotion sheds lifetimes of karmic bondage.`,
    scripturalReferences: [
      'Tattvartha Sutra of Acharya Umasvati (Chapters 1 & 7)',
      'Ratnakaranda Shravakachara of Acharya Samantabhadra',
      'Chhah Dhala of Pandit Daulatram Ji'
    ],
    recommendedPachkanOrVow: 'Navkarshi & Evening Chauvihar (No food/water after sunset)',
    mantras: [
      {
        name: 'Navkar Mahamantra',
        verse: 'णमो अरिहंताणं । णमो सिद्धाणं । णमो आयरियाणं । णमो उवज्झायाणं । णमो लोए सव्व साहूणं ॥',
        meaning: 'Salutations to the Arihantas, Siddhas, Acharyas, Upadhyayas, and all Sadhus in the universe.'
      }
    ],
    followUpQuestions: [
      'How to perform morning Ashtaprakari Puja step-by-step?',
      'What are the 12 Vratas of a Jain Shravaka?',
      'Why are root vegetables (kandmool) prohibited in Jainism?'
    ]
  };
}
