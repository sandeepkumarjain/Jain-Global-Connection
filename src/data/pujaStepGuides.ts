import { PanditStepGuide } from '../types';
import ashtaprakariPujaImg from '../assets/images/jain_puja_ritual_1789381668485.jpg';
import jinendraAbhishekImg from '../assets/images/jinendra_abhishek_1789381696744.jpg';
import samayikSetupImg from '../assets/images/samayik_setup_1789381716579.jpg';
import aartiPrayerLampImg from '../assets/images/aarti_prayer_lamp_1789381749851.jpg';
import sanctumDarshanImg from '../assets/images/jain_sanctum_darshan_1786668740851.jpg';

export const COMMON_PUJA_STEP_GUIDES: Record<string, PanditStepGuide> = {
  ashtaprakari_puja: {
    title: 'Sacred Ashtaprakari Puja (८ प्रकार की पूजा)',
    subtitle: 'The 8-Fold Divine Worship of the Tirthankara Bhagwan',
    procedureType: 'Daily Derasar Puja',
    estimatedDuration: '25 - 35 mins',
    coverImageUrl: ashtaprakariPujaImg,
    coverImageAlt: 'Sacred Ashtaprakari Puja Altar Arrangement',
    coverImageCaption: 'Sacred Ashtaprakari Puja altar: unbroken akshat, fragrant sandalwood paste, pure water lota, pure ghee deepak, fresh flowers and sattvic naivedya in the Derasar sanctum.',
    preparations: [
      'Bathe with clean water and wear clean unstitched puja clothes (Puja Vastra).',
      'Observe Navkarshi (do not consume food or water before entering Derasar).',
      'Tie or hold a clean white Mukhapatti over the mouth while chanting near the idol.',
      'Recite "Nisihi" thrice: outside temple gate, inside hall, and at the sanctum sanctorum (Garbhagriha).'
    ],
    rulesAndPurity: [
      'Perform 3 clockwise circumambulations (Pradakshina) around the Jinendra idol meditating on Samyak Darshana, Jnana, and Caritra.',
      'Touch the sacred idol only with absolute gentle reverence using consecrated ring-finger paste.',
      'Keep metal puja thali and vessels spotless, pure, and dedicated solely for temple worship.'
    ],
    steps: [
      {
        stepNumber: 1,
        title: 'Jal Puja (जल पूजा - Water Offering)',
        subTitle: 'Cleansing the soul from karmic dust',
        description: 'Gentle bathing of the lotus feet of Tirthankara Bhagwan with pure filtered water mixed with subtle sandalwood or saffron using a consecrated lota or conch shell.',
        bhavna: 'Just as pure water removes dust from the body, may this holy water cleanse all karmic dirt of delusion (Moha), anger (Krodha), and worldly passions from my soul.',
        icon: 'water',
        mantraOrSutra: 'ॐ ह्रीं श्रीं अर्हं परमपुरुषाय परमेश्वराय जलं निर्वपामीति स्वाहा।',
        itemsRequired: ['Pure filtered water (Jal)', 'Silver or brass small Lota', 'Mukhapatti'],
        imageUrl: ashtaprakariPujaImg,
        imageAlt: 'Jal Puja Holy Vessel & Clean Altar',
        imageCaption: 'Holy Jal offering using consecrated lota and pure filtered water.',
        proceduralAnimation: 'jal_dhara',
        animationLabel: 'Akhand Jal Dhara Flow'
      },
      {
        stepNumber: 2,
        title: 'Chandan Puja (चंदन पूजा - Sandalwood Offering)',
        subTitle: 'Extinguishing the fires of anger and passion',
        description: 'Applying fragrant cooling sandalwood paste (Keshar Chandan) with the right ring finger to the 9 sacred body points (Nav-Anga): toes, knees, wrists, shoulders, crown of head, forehead, throat, chest, and navel.',
        bhavna: 'Sandalwood cools the fiercest summer heat. May this chandan extinguish the blazing heat of anger (Krodha) and grant my soul eternal peaceful composure (Shanti).',
        icon: 'sparkles',
        mantraOrSutra: 'ॐ ह्रीं श्रीं अर्हं परमपुरुषाय परमेश्वराय चन्दनं निर्वपामीति स्वाहा।',
        itemsRequired: ['Freshly ground Keshar Chandan', 'Silver vati or small cup'],
        imageUrl: ashtaprakariPujaImg,
        imageAlt: 'Sandalwood paste offering',
        imageCaption: 'Pure keshar chandan paste prepared for nine sacred body points.',
        proceduralAnimation: 'chandan_touch',
        animationLabel: 'Nav-Anga 9-Point Anointing'
      },
      {
        stepNumber: 3,
        title: 'Pushpa Puja (पुष्प पूजा - Flower Offering)',
        subTitle: 'Fragrance of virtue and spotless morality',
        description: 'Offering clean, naturally fallen fragrant flowers (or saffron-dyed unbroken rice for strict non-injury Ahimsa practice) at the auspicious lotus feet of the Jina.',
        bhavna: 'Flowers possess natural sweetness, softness, and fragrance. May my life blossom with fragrant moral conduct (Sheela) and boundless compassion (Karuna) for all beings.',
        icon: 'flower',
        mantraOrSutra: 'ॐ ह्रीं श्रीं अर्हं परमपुरुषाय परमेश्वराय पुष्पं निर्वपामीति स्वाहा।',
        itemsRequired: ['Naturally fallen clean flowers or Yellow Akshat', 'Puja plate'],
        proceduralAnimation: 'flower_petal',
        animationLabel: 'Fragrant Petal Devotion'
      },
      {
        stepNumber: 4,
        title: 'Dhoop Puja (धूप पूजा - Incense Offering)',
        subTitle: 'Incinerating the 8 binding karmas',
        description: 'Waving fragrant natural herbal dhoop or guggul in a traditional dhoop-dan before the Lord while gently ringing the bell in the sanctum.',
        bhavna: 'As the sacred incense burns away and its fragrant smoke ascends toward the heavens, may all my 8 dense binding karmas turn to ashes, allowing my soul to soar to Moksha.',
        icon: 'flame',
        mantraOrSutra: 'ॐ ह्रीं श्रीं अर्हं परमपुरुषाय परमेश्वराय धूपं निर्वपामीति स्वाहा।',
        itemsRequired: ['Natural herbal dhoop/guggul', 'Brass Dhoop-dan', 'Puja Ghanta (bell)'],
        proceduralAnimation: 'dhoop_smoke',
        animationLabel: 'Ascending Fragrant Dhoop'
      },
      {
        stepNumber: 5,
        title: 'Deep Puja (दीप पूजा - Lamp Offering)',
        subTitle: 'Igniting the light of Kevala Jnana',
        description: 'Waving a pure cow-ghee or camphor lamp in circular motion before the radiant countenance of the Arihant Bhagwan.',
        bhavna: 'The physical lamp banishes external gloom. May the supreme lamp of Kevala Jnana (Infinite Omniscience) ignite within me, dispelling the pitch darkness of false belief (Mithyatva).',
        icon: 'sun',
        mantraOrSutra: 'ॐ ह्रीं श्रीं अर्हं परमपुरुषाय परमेश्वराय दीपं निर्वपामीति स्वाहा।',
        itemsRequired: ['Pure cow-ghee Deepak or Aarti lamp', 'Aarti thali'],
        proceduralAnimation: 'lamp_flame',
        animationLabel: 'Lighting the Kevalgyan Lamp'
      },
      {
        stepNumber: 6,
        title: 'Akshat Puja (अक्षत पूजा - Rice Offering)',
        subTitle: 'Escaping rebirth across the four Gatis',
        description: 'Arranging unbroken, clean white rice grains on the wooden or silver patila to form the sacred Swastika (representing 4 Gatis: Hell, Animal, Human, Deva), 3 heaps (Ratnatraya), and a crescent with a dot (Siddha Shila).',
        bhavna: 'Akshat means unbroken and non-sprouting. Just as husked rice can never germinate again, may I never take birth again in Samsara and abide forever in the Siddha state.',
        icon: 'star',
        mantraOrSutra: 'ॐ ह्रीं श्रीं अर्हं परमपुरुषाय परमेश्वराय अक्षतं निर्वपामीति स्वाहा।',
        itemsRequired: ['Pure unbroken white rice (Akshat)', 'Puja Patila (wooden/silver board)'],
        imageUrl: ashtaprakariPujaImg,
        imageAlt: 'Akshat Rice Sacred Offering',
        imageCaption: 'Spotless unbroken rice (Akshat) arranged on the sacred puja patila board.',
        proceduralAnimation: 'akshat_swastika',
        animationLabel: 'Forming Sathiya & 3 Jewels'
      },
      {
        stepNumber: 7,
        title: 'Naivedya Puja (नैवेद्य पूजा - Sweet Offering)',
        subTitle: 'Conquering hunger and sensory desires',
        description: 'Placing pure, sattvic sweetmeat (prepared without eggs, animal gelatine, or artificial colors) onto the sacred Siddha Shila diagram on the patila.',
        bhavna: 'Food nourishes only the mortal physical vessel. By offering this naivedya, I aspire to cure the chronic disease of hunger (Kshudha Rog) and attain the eternal Anahari (foodless) state of Siddhas.',
        icon: 'heart',
        mantraOrSutra: 'ॐ ह्रीं श्रीं अर्हं परमपुरुषाय परमेश्वराय नैवेद्यं निर्वपामीति स्वाहा।',
        itemsRequired: ['Pure Jain sweet (e.g. laddu, peda, or mishri)']
      },
      {
        stepNumber: 8,
        title: 'Phal Puja (फल पूजा - Fruit Offering)',
        subTitle: 'Attaining the supreme fruit of liberation: Moksha',
        description: 'Offering fresh, sweet seasonal fruits (with intact skin and clean surface) on the patila as the crowning culmination of the Ashtaprakari Puja.',
        bhavna: 'All worldly accomplishments bear transient, bittersweet fruits. I offer this sacred fruit seeking only the supreme, imperishable fruit of human existence: Moksha Pada.',
        icon: 'shield',
        mantraOrSutra: 'ॐ ह्रीं श्रीं अर्हं परमपुरुषाय परमेश्वराय फलं निर्वपामीति स्वाहा।',
        itemsRequired: ['Fresh whole seasonal fruits (apple, pomegranate, banana, orange)']
      }
    ],
    concludingBhavna: 'Upon completing the 8 offerings, bow with Panchanga Pranama reciting "Ichchhami Khamasamano", chant Chaitya Vandan stuti, and remain absorbed in contemplation of the Vitaraga state.'
  },

  jinendra_abhishek_snatra: {
    title: 'Jinendra Abhishek & Snatra Puja (जिनेन्द्र अभिषेक एवं स्नात्र पूजा)',
    subtitle: 'Re-enacting Indra’s Celestial Bathing of the Tirthankara on Mount Meru',
    procedureType: 'Morning Abhishek & Festive Puja',
    estimatedDuration: '40 - 55 mins',
    coverImageUrl: jinendraAbhishekImg,
    coverImageAlt: 'Holy Jinendra Abhishek & Snatra Ceremony',
    coverImageCaption: 'Holy Jinendra Abhishek ceremony: twin consecrated silver kalash pots pouring a continuous crystal-pure stream (Jal Dhara) over the Meru throne.',
    preparations: [
      'Pure morning snan and spotless white dhoti/khes or unstitched vastra.',
      'Preparation of consecrated Gandhodak vessel and 108 Abhishek Kalash.',
      'Sandalwood, saffron, pure boiled-filtered water, and cow milk or Panchamrit (tradition specific).',
      'Chanting of Navkar Mahamantra 9 times to sanctify the Mandap.'
    ],
    rulesAndPurity: [
      'Maintain continuous reverent silence or participate in the chanting of Snattra hymns.',
      'Pour Abhishek water in a continuous, gentle unbroken stream (Dhara) without spilling outside the Gandhakuti or Jal-hari.',
      'Receive the sacred Gandhodak on forehead and eyes with utmost humility after completion.'
    ],
    steps: [
      {
        stepNumber: 1,
        title: 'Shuddhi & Pradakshina (शुद्धि एवं प्रदक्षिणा)',
        subTitle: 'Consecration of mind and space',
        description: 'Wash hands and feet, tie mukhapatti, and perform 3 clockwise rounds of the altar reciting Navkar Mahamantra.',
        bhavna: 'Purifying my speech, thoughts, and physical actions to become worthy of serving the supreme Vitaraga Lord.',
        icon: 'bell',
        mantraOrSutra: 'ॐ ह्रीं अर्हं णमो अरिहंताणं। ॐ ह्रीं श्रीं आत्मशुद्धये स्वाहा।'
      },
      {
        stepNumber: 2,
        title: 'Meru Sthapana & Kalash Sajjā (मेरु स्थापना एवं कलश सज्जा)',
        subTitle: 'Invoking the scene of Janma Kalyanak',
        description: 'Placing the Pratima on the silver Meru throne or Abhishek Peeth, arranging the consecrated water Kalash adorned with mango leaves.',
        bhavna: 'Meditating on the joyous moment when the 64 Indras celebrated the divine birth of Tirthankara Bhagwan on Mount Meru.',
        icon: 'sun',
        mantraOrSutra: 'ॐ ह्रीं श्रीं मेरुशिखरे सुरेन्द्रैः स्नापितस्य भगवतोऽर्हतः अभिषेकं करोम्यहम्।'
      },
      {
        stepNumber: 3,
        title: 'Jal Dhara & Pakshal (जल धारा एवं प्रक्षाल)',
        subTitle: 'The holy stream of consecrated water',
        description: 'Pouring pure fragrant water in an unbroken stream over the Pratima using two kalash held together, accompanied by resonant bell chimes.',
        bhavna: 'May this divine stream extinguish the fires of three worlds and dissolve my soul’s accumulated karmas.',
        icon: 'water',
        mantraOrSutra: 'ॐ ह्रीं श्रीं क्लीं ऐं अर्हं श्रीपार्श्वनाथाय (या स्व-तीर्थंकराय) नमः शान्तिं कुरु कुरु स्वाहा।',
        imageUrl: jinendraAbhishekImg,
        imageAlt: 'Holy Jal Dhara Bathing on Meru Throne',
        imageCaption: 'Twin consecrated kalash pouring an unbroken pure stream over the Meru throne.',
        proceduralAnimation: 'jal_dhara',
        animationLabel: 'Akhand Jal Dhara Streaming'
      },
      {
        stepNumber: 4,
        title: 'Gandhodak Grahan (गन्धोदक ग्रहण)',
        subTitle: 'Receiving the sanctified holy drops',
        description: 'Collecting the holy water passing over the idol (Gandhodak) in a silver katori and applying tiny drops to forehead, eyes, and crown with reverence.',
        bhavna: 'May this sacred water bless my intellect with clarity, cool my anger, and protect all living beings.',
        icon: 'sparkles',
        mantraOrSutra: 'निर्मलं निर्मलीकरणं पावनं पापनाशनम्। वन्दे श्री जिनगन्धोदकं सर्वोपद्रवशान्तये॥'
      },
      {
        stepNumber: 5,
        title: 'Anga Puchhan & Vastra Shringar (अंग पूंछन एवं श्रृंगार)',
        subTitle: 'Drying with spotless soft cloth',
        description: 'Gently drying the sacred idol with a clean, soft unbleached cotton cloth reserved solely for Jinendra seva, followed by applying fresh Keshar Chandan.',
        bhavna: 'Serving the Lord with the tender devotion of a loving servant cultivating detachment.',
        icon: 'feather'
      },
      {
        stepNumber: 6,
        title: 'Aarti & Mangal Divo (महा आरती एवं मंगल दीवो)',
        subTitle: 'Five-fold lamp of devotion',
        description: 'Waving the five-wick ghee lamp and single camphor lamp joyously, singing traditional Stuti and Mangal prayers.',
        bhavna: 'Rejoicing in the supreme detachment of the Arihant who has shown the timeless path across the ocean of Samsara.',
        icon: 'flame',
        mantraOrSutra: 'जय जय आरती आदि जिणंदा, नाभिराया कुल आनंद कंदा...',
        proceduralAnimation: 'aarti_circle',
        animationLabel: '7-Cycle Clockwise Aarti Waving'
      }
    ],
    concludingBhavna: 'End with Shanti Dhara Stotra, forgiving all beings with Michhami Dukkadam, and dedicating the merit of the puja for global harmony.'
  },

  samayik_vidhi: {
    title: 'Samayik & Muhpatti Padilehan Vidhi (सामायिक विधि)',
    subtitle: '48-Minute Practice of Supreme Equanimity and Soul Awareness',
    procedureType: 'Daily Spiritual Practice',
    estimatedDuration: '48 mins (1 Muhurta)',
    coverImageUrl: samayikSetupImg,
    coverImageAlt: 'Jain Samayik Equanimity Setup & Equipment',
    coverImageCaption: 'Authentic Samayik spiritual equipment: pristine white Katasanu insulation mat, gentle wool Charavalo brush, white Muhpatti veil, and Jaap mala beads.',
    preparations: [
      'Two clean, unstitched white cotton cloths (one for lower body, one for upper body).',
      'Katasanu (wool/cloth sitting mat to insulate spiritual energy).',
      'Charavalo or Ogho (soft cotton tassel brush to protect micro-insects without harm).',
      'Muhpatti (white cloth square to cover mouth during speech/chanting).'
    ],
    rulesAndPurity: [
      'Strictly avoid worldly talk, business calls, family gossip, or anger during the 48 minutes.',
      'Maintain physical stillness; inspect clothes gently before any movement to ensure Ahimsa.',
      'Engage exclusively in Navkar Jaap, reading Agamas, reciting Bhaktamar, or meditating on the 12 Bhavnas.'
    ],
    steps: [
      {
        stepNumber: 1,
        title: 'Iriyavahiya Sutra Recitation (इरियावहिया सूत्र)',
        subTitle: 'Repentance for path injury',
        description: 'Standing on the Katasanu, bow in Panchanga Pranama and recite the Iriyavahiya Sutra to seek forgiveness for any tiny organisms inadvertently touched or stepped on while walking.',
        bhavna: 'Sensitizing consciousness to universal life. Acknowledging that every microscopic insect possesses the same soul capacity as myself.',
        icon: 'heart',
        mantraOrSutra: 'इच्छामि पडिक्कमिउं इरियावहियाए, विराहणाए, गमणागमणे...'
      },
      {
        stepNumber: 2,
        title: 'Muhpatti Padilehan (मुहपत्ति पडिलेहण - 50 बोल)',
        subTitle: 'Mindful inspection of the mouth-veil',
        description: 'Hold the Muhpatti gently and perform the traditional systematic inspection (25 or 50 points based on tradition) to verify no insect is caught in the cloth.',
        bhavna: 'Training vigilant mindfulness (Apramatta). Just as I inspect this small cloth for hidden creatures, I must inspect my mind for hidden faults, anger, and ego.',
        icon: 'shield',
        mantraOrSutra: 'पडिलेहण सम्मं करेमि... अहिंसा सच्चं च अस्तेयं...',
        imageUrl: samayikSetupImg,
        imageAlt: 'Muhpatti inspection and Charavalo Ahimsa setup',
        imageCaption: 'Carefully inspecting the Muhpatti cloth and preparing the Katasanu for equanimity.',
        proceduralAnimation: 'charavalo_sweep',
        animationLabel: 'Charavalo Ahimsa Sweeping Motion'
      },
      {
        stepNumber: 3,
        title: 'Taking the Karemi Bhante Vow (करेमि भंते संकल्प)',
        subTitle: 'The solemn 48-minute pledge',
        description: 'Bowing with folded hands, recite the Karemi Bhante Sutra to formally renounce all sinful activities (Savajja Yoga) by mind, speech, and body.',
        bhavna: 'For these two gharis (48 minutes), I step out of worldly citizenship. I live like a gentle, harmless monk focused solely on the pure Atman.',
        icon: 'sparkles',
        mantraOrSutra: 'करेमि भंते ! सामाइयं, सावज्जं जोगं पच्चक्खामि, जाव नियमं पज्जुवासामि...'
      },
      {
        stepNumber: 4,
        title: 'Equanimity Meditation & Jaap (साम्यभाव ध्यान एवं स्वाध्याय)',
        subTitle: 'Abiding in pure soul awareness',
        description: 'Sit in Padmasana or Sukhasana. Chant the Navkar Mahamantra on mala beads, recite Logassa / Uvasaggaharam, or contemplate the 12 Bhavnas (Anitya, Asharana, Ekatva).',
        bhavna: 'Neither attachment to comfort nor hatred toward discomfort. Gold and stone, friend and adversary, praise and criticism are equal to the knowing soul.',
        icon: 'moon',
        mantraOrSutra: 'समभावो सामाइयं। णमो अरिहंताणं, णमो सिद्धाणं...'
      },
      {
        stepNumber: 5,
        title: 'Pariharana & Conclusion (सामायिक पारना)',
        subTitle: 'Releasing the vow with humble repentance',
        description: 'At the end of 48 minutes, perform Muhpatti Padilehan again, recite Namutthunam (Sakra Stava), and ask forgiveness for any lapses of posture or thought during the session.',
        bhavna: 'Grateful for 48 minutes of peaceful freedom from worldly turmoil. Seeking courage to extend this calm equanimity into daily actions.',
        icon: 'check-circle',
        mantraOrSutra: 'नमुत्थु णं अरिहंताणं भगवंताणं... तस्स मिच्छा मि दुक्कडं।'
      }
    ],
    concludingBhavna: 'Conclude with heartfelt "Michhami Dukkadam" to all beings in the cosmos.'
  },

  aarti_mangal_divo: {
    title: 'Evening Aarti & Mangal Divo Vidhi (आरती एवं मंगल दीवो विधि)',
    subtitle: 'Twilight Illumination and Protection of the Inner Lamp of Dharma',
    procedureType: 'Evening Temple & Home Prayer',
    estimatedDuration: '15 - 20 mins',
    coverImageUrl: aartiPrayerLampImg,
    coverImageAlt: 'Evening Aarti & Mangal Divo Ritual Lamp',
    coverImageCaption: 'Traditional Pancha-Pradeep Aarti five-wick ghee lamp and Mangal Divo illuminating the twilight darshan.',
    preparations: [
      'Pancha-pradeep Aarti vessel (five lamps) with pure cow-ghee cotton wicks.',
      'Single-wick Mangal Divo vessel with camphor or pure ghee.',
      'Clean bell (Ghanta), gong (Ghadiyal), and Aarti thali.',
      'Wash hands, rinse mouth, and wear clean evening garments.'
    ],
    rulesAndPurity: [
      'Perform during twilight (Sandhya Kaal) as day transitions into dusk.',
      'Wave the Aarti lamp in a clockwise elliptical orbit from feet to crown of the Pratima.',
      'Keep the flames steady; never extinguish a sacred wick by blowing breath.'
    ],
    steps: [
      {
        stepNumber: 1,
        title: 'Deepak Prajvalan (दीपक प्रज्वलन)',
        subTitle: 'Igniting the five flames',
        description: 'Light the five ghee wicks in the Aarti thali while chanting Navkar Mantra, representing the Five Supreme Souls (Pancha Parameshtis).',
        bhavna: 'May these five pure flames destroy the five dense karmic veils and guide my soul to the shelter of the Pancha Parameshtis.',
        icon: 'sun',
        mantraOrSutra: 'ॐ ह्रीं श्रीं पंचपरमेष्ठिभ्यो नमः। जय जिनेन्द्र दीपं समर्पयामि।',
        proceduralAnimation: 'lamp_flame',
        animationLabel: 'Igniting Sacred 5 Ghee Wicks'
      },
      {
        stepNumber: 2,
        title: 'Shri Jinendra Maha Aarti (श्री जिनेन्द्र महा आरती)',
        subTitle: 'Joyful musical offering',
        description: 'Wave the five-wick Aarti lamp clockwise in seven rhythmic cycles before the Lord, singing the traditional "Jai Jai Aarti Adi Jinanda" with bell accompaniment.',
        bhavna: 'Rejoicing in the supreme serenity of the Tirthankara whose aura illuminates the three realms without heat or shadow.',
        icon: 'flame',
        mantraOrSutra: 'जय जय आरती आदि जिणंदा, नाभिराया कुल आनंद कंदा...',
        imageUrl: aartiPrayerLampImg,
        imageAlt: 'Pancha-Pradeep Five Flame Aarti offering',
        imageCaption: 'Clockwise waving of the five-flame cow-ghee lamp in reverent rhythm.',
        proceduralAnimation: 'aarti_circle',
        animationLabel: 'Clockwise Aarti 7-Cycle Orbit'
      },
      {
        stepNumber: 3,
        title: 'Mangal Divo (मंगल दीवो)',
        subTitle: 'The lamp of eternal auspiciousness',
        description: 'Wave the single-wick Mangal Divo in slow, gentle clockwise circles while singing the sacred Mangal Divo stuti.',
        bhavna: 'Deepak signifies knowledge; Divo dispels darkness. May this auspicious lamp illuminate my home with peace, health, harmony, and spiritual wisdom.',
        icon: 'sparkles',
        mantraOrSutra: 'दीवो रे दीवो प्रभु मंगलिक दीवो, आरती उतारी ने बहु पुण्य लीधो...',
        proceduralAnimation: 'lamp_flame',
        animationLabel: 'Single Auspicious Camphor Flame'
      },
      {
        stepNumber: 4,
        title: 'Aarti Shanti Dhara & Grahan (आरती ग्रहण एवं शांति भावना)',
        subTitle: 'Warmth of divine grace',
        description: 'Gently hold palms over the Aarti flame warmth and touch eyes and forehead, sharing the blessed light with all family members.',
        bhavna: 'May the warmth of compassion warm my heart, and may the divine vision guide my eyes toward virtue and non-violence.',
        icon: 'heart'
      },
      {
        stepNumber: 5,
        title: 'Universal Shanti Patha (शान्ति पाठ)',
        subTitle: 'Prayer for cosmic peace',
        description: 'Stand with folded hands and recite the traditional Shanti Patha wishing peace for all kingdoms, nations, living creatures, and spiritual practitioners.',
        bhavna: 'May rain fall in proper season, may rulers govern with justice, may crops flourish, and may the Jain Dharma bring peace to all beings.',
        icon: 'moon',
        mantraOrSutra: 'शिवमस्तु सर्वजगतः, परहितनिरता भवन्तु भूतगणाः। दोषाः प्रयान्तु नाशं, सर्वत्र सुखीभवतु लोकः॥'
      }
    ],
    concludingBhavna: 'End with 9 Navkar recitations and strictly observe Chauvihar (no intake of food or water after sunset).'
  },

  griha_pravesh_shanti: {
    title: 'Jain Griha Pravesh & Shanti Vidhan (जैन गृह प्रवेश शांति विधान)',
    subtitle: 'Auspicious Consecration of a New Home into a Sanctuary of Dharma',
    procedureType: 'Householder Sanskar',
    estimatedDuration: '1.5 - 2 hours',
    preparations: [
      'Selection of Shubh Muhurta aligned with Jain Panchang (free from Bhadra and Rahu Kaal).',
      'Thorough eco-friendly cleaning of dwelling without insect-killing fumigation.',
      'Jinendra Pratima / Sacred Yantra in consecrated thali.',
      'Mangal Kalash filled with pure water, mango leaves, swastika, and coconut wrapped in red thread.',
      'Pure cow-ghee lamp, natural dhoop, unbroken rice (Akshat), and Vasakshep (scented sandalwood powder).'
    ],
    rulesAndPurity: [
      'Enter leading with the right foot while joyously chanting the Navkar Mahamantra.',
      'No non-vegetarian catering, alcohol, or leather items inside the newly consecrated premises.',
      'Place the home temple (Ghar Derasar) in the pure Ishan Kona (North-East direction).'
    ],
    steps: [
      {
        stepNumber: 1,
        title: 'Toran & Dwar Pujan (तोरण एवं द्वार पूजन)',
        subTitle: 'Consecration of the entrance threshold',
        description: 'Hang fresh mango or ashoka leaves at the main door. Draw a sacred Kumkum Swastika on both sides of the threshold and place unbroken rice.',
        bhavna: 'May this entrance welcome only positive vibrations, virtuous thoughts, revered monks, and sadharmik brothers and sisters.',
        icon: 'bell',
        mantraOrSutra: 'ॐ ह्रीं श्रीं सर्वविघ्नविनाशनाय द्वारदेवाय नमः।',
        proceduralAnimation: 'akshat_swastika',
        animationLabel: 'Threshold Swastika & Akshat Formation'
      },
      {
        stepNumber: 2,
        title: 'Mangal Pravesh with Kalash (मंगल प्रवेश)',
        subTitle: 'First sacred steps into the dwelling',
        description: 'The family head carries the Lord’s Pratima / Yantra, the lady of the house carries the Mangal Kalash on her head, stepping inside with the right foot chanting Navkar.',
        bhavna: 'We enter not merely into bricks and stone, but into a spiritual hermitage where non-violence, truth, and equanimity shall reign supreme.',
        icon: 'sun',
        mantraOrSutra: 'चत्तारि मंगलं, अरिहंता मंगलं, सिद्धा मंगलं, साहू मंगलं, केवलिपन्नत्तो धम्मो मंगलं...'
      },
      {
        stepNumber: 3,
        title: 'Ghar Derasar Sthapana (घर देरासर स्थापना)',
        subTitle: 'Enthroning Jinendra Bhagwan',
        description: 'Install the sacred idol or Yantra on a clean elevated wooden/marble mandir in the North-East (Ishan) corner. Light the initial cow-ghee lamp and herbal dhoop.',
        bhavna: 'May the divine presence of the Tirthankara continuously anchor our daily thoughts in moral righteousness and detachment.',
        icon: 'star',
        mantraOrSutra: 'ॐ ह्रीं श्रीं अर्हं जिनाय नमः। अत्र सन्निहिता भव भव वषट्।',
        proceduralAnimation: 'lamp_flame',
        animationLabel: 'First Ghar Derasar Ghee Lamp Lighting'
      },
      {
        stepNumber: 4,
        title: '108 Navkar Jaap & Uvasaggaharam (१०८ नवकार जाप एवं उवसग्गहरं)',
        subTitle: 'Sanctifying the ethereal atmosphere',
        description: 'Sit in circle with family and recite 108 rounds of the Navkar Mahamantra, followed by the Uvasaggaharam Stotra and Bhaktamar Stotra.',
        bhavna: 'Incinerating any lingering negative vibrations through the sonic resonance of the Pancha Parameshtis.',
        icon: 'sparkles',
        mantraOrSutra: 'उवसग्गहरं पासं, वंदामि कम्म-घण-मुक्कं। विसहर-विस-निन्नासं, मंगल-कल्लाण-आवासं॥'
      },
      {
        stepNumber: 5,
        title: 'Vasakshep Chhantav (वासक्षेप छिड़काव)',
        subTitle: 'Sandalwood blessing in all directions',
        description: 'Sprinkle consecrated fragrant Vasakshep powder in all four corners of each room, corridors, and kitchen.',
        bhavna: 'Invoking the blessings of the Arihantas and Gurudev to protect every living inhabitant and ward off all calamities.',
        icon: 'feather'
      },
      {
        stepNumber: 6,
        title: 'Sadharmik Bhakti & Vatsalya (साधार्मिक वात्सल्य)',
        subTitle: 'Sharing joyful hospitality with community',
        description: 'Offer pure, warm sattvic food to family and fellow community members (Sadharmik brothers), supporting the needy with charity.',
        bhavna: 'Wealth finds true fruition only when shared in devotion to Sadharmik brethren and the protection of living beings (Jivdaya).',
        icon: 'heart'
      }
    ],
    concludingBhavna: 'Conclude by pledging daily morning prayer and observance of evening Chauvihar within the newly blessed home.'
  },

  chaitya_vandan_vidhi: {
    title: 'Chaitya Vandan & Devavandan Vidhi (चैत्यवंदन विधि)',
    subtitle: 'Standard Temple Veneration Procedure in Front of the Jina',
    procedureType: 'Daily Derasar Devotion',
    estimatedDuration: '15 - 20 mins',
    coverImageUrl: sanctumDarshanImg,
    coverImageAlt: 'Reverent Sanctum Sanctorum Darshan for Chaitya Vandan',
    coverImageCaption: 'Sacred Garbhagriha inner sanctum darshan of the Vitaraga Bhagwan for deep meditative Chaitya Vandan.',
    preparations: [
      'Clean unstitched clothes or formal modest clothing.',
      'Recitation of 3 Nisihi and 3 Pradakshina.',
      'Mukhapatti held in front of mouth.'
    ],
    rulesAndPurity: [
      'Stand or sit in Kausagga (Kayotsarga) posture without fidgeting.',
      'Recite verses with rhythmic, reverent intonation without skipping syllables.'
    ],
    steps: [
      {
        stepNumber: 1,
        title: 'Khamasama & Nisihi (खमासमण एवं निसीही)',
        subTitle: 'Surrendering worldly arrogance',
        description: 'Bow down touching five limbs to the floor (Panchanga Pranama) twice, seeking permission to venerate.',
        bhavna: 'I humble my pride before the supreme conqueror of passions.',
        icon: 'bell',
        mantraOrSutra: 'इच्छामि खमासमणो ! वंदिउं जावणिज्जाए निसीहीआए...'
      },
      {
        stepNumber: 2,
        title: 'Chaitya Vandan Sutra (चैत्यवंदन सूत्र)',
        subTitle: 'Praising the 24 Tirthankaras',
        description: 'Recite "Jay Viyaray" or primary Chaityavandan stuti praising the virtues of the Jina and expressing devotion.',
        bhavna: 'Revering the Arihantas who have crossed the turbulent ocean of births and deaths.',
        icon: 'sun',
        mantraOrSutra: 'सकल कुशल वल्ली, उल्लास कल्पतरु... जय वीयराय जगगुरु...'
      },
      {
        stepNumber: 3,
        title: 'Jamkinchi & Namutthunam (जंकिंचि एवं नमुत्थु णं)',
        subTitle: 'Salutations to all sacred idols and Arihantas',
        description: 'Recite Jamkinchi to salute all Jinendra idols across the cosmos, followed by the majestic Namutthunam (Sakra Stava).',
        bhavna: 'I bow to every Tirthankara who has attained enlightenment in past, present, and future eras.',
        icon: 'sparkles',
        mantraOrSutra: 'जंकिंचि नाम तित्थं, सग्गे पायालि मणुस्से लोए... नमुत्थु णं अरिहंताणं भगवंताणं...'
      },
      {
        stepNumber: 4,
        title: 'Kausagga of Logassa (लोगस्स काउस्सग्ग)',
        subTitle: 'Statue-like absorption in silence',
        description: 'Stand in Kayotsarga posture for 25 breath counts reciting the Logassa Sutra mentally up to Chandesu Nimmalayara.',
        bhavna: 'Abandoning identification with the physical body for these minutes, meditating purely on the luminous self.',
        icon: 'moon',
        mantraOrSutra: 'लोगस्स उज्जोअगरे, धम्मतित्थयरे जिणे...'
      },
      {
        stepNumber: 5,
        title: 'Prakrit Stuti & Pranam (स्तवन एवं अंतिम नमन)',
        subTitle: 'Concluding lyrical offering',
        description: 'Sing melodious Stuti of the Mulnayak Tirthankara, perform final Khamasama, and dedicate the devotion for Right Faith.',
        bhavna: 'May my faith in the path of the Jina remain unshakeable till the attainment of Nirvana.',
        icon: 'check-circle'
      }
    ],
    concludingBhavna: 'Leave the sanctum walking backwards a few steps without turning your back disrespectfully to the Jina.'
  }
};
