import palitanaImg from '../assets/images/palitana_sacred_temple_1786668694828.jpg';
import ranakpurImg from '../assets/images/ranakpur_temple_pillars_1786668705618.jpg';
import shikharjiImg from '../assets/images/shikharji_holy_tirth_1786668718536.jpg';
import pawapuriImg from '../assets/images/pawapuri_jal_mandir_1786668729630.jpg';
import sanctumImg from '../assets/images/jain_sanctum_darshan_1786668740851.jpg';

export interface HolySiteTourSlide {
  id: string;
  title: string;
  subtitle: string;
  deity: string;
  location: string;
  state: string;
  sect: string;
  imageUrl: string;
  description: string;
  spiritualSignificance: string;
  architecturalFeature: string;
  dharamshalaInfo: string;
  timings: string;
  aartiTimings: string;
  templeId?: string;
}

export const GENERATED_TEMPLE_IMAGES = {
  palitana: palitanaImg,
  ranakpur: ranakpurImg,
  shikharji: shikharjiImg,
  pawapuri: pawapuriImg,
  sanctum: sanctumImg,
};

export const HOLY_SITE_VIRTUAL_TOUR_SLIDES: HolySiteTourSlide[] = [
  {
    id: 'tour_palitana',
    templeId: 'tpl_001',
    title: 'Palitana Shatrunjaya Mahatirth',
    subtitle: 'The Supreme Eternal Tirth of 863 Marble Temples',
    deity: 'Lord Adinath (Bhagwan Rishabhdev)',
    location: 'Palitana, Bhavnagar District',
    state: 'Gujarat',
    sect: 'Swetambar Murtipujak',
    imageUrl: palitanaImg,
    description:
      'Shatrunjaya Hill is hailed across Jain scriptures as the holiest sacred realm (Tirthraj), sanctified by millions of omniscient souls and 23 Tirthankaras who graced this holy summit for meditation and salvation.',
    spiritualSignificance:
      'Every stone on Shatrunjaya is sanctified with supreme spiritual energy. Devotees undertake the sacred 3,800-step ascent in complete silence and prayer to cleanse worldly karmas.',
    architecturalFeature:
      '863 white marble temples perched atop twin peaks, adorned with masterfully carved shikharas, toranas, and pillars reflecting sunlight like celestial vimanas.',
    dharamshalaInfo: 'Over 500+ air-conditioned dharamshala rooms and 12 grand Bhojanashalas in Taleti managed by Shri Anandji Kalyanji Pedhi.',
    timings: '5:30 AM – 7:00 PM (No night stay permitted on hill)',
    aartiTimings: 'Mangla Aarti 6:00 AM, Sandhya Aarti 6:30 PM',
  },
  {
    id: 'tour_ranakpur',
    templeId: 'tpl_002',
    title: 'Ranakpur Adinath Chaumukha Temple',
    subtitle: 'The Celestial Marvel of 1,444 Non-Identical Marble Pillars',
    deity: 'Lord Adinath (Chaumukha Mandir)',
    location: 'Desuri, Pali District',
    state: 'Rajasthan',
    sect: 'Swetambar Murtipujak',
    imageUrl: ranakpurImg,
    description:
      'Constructed in the 15th century by Seth Dhanna Shah under the patronage of Rana Kumbha, Ranakpur is globally revered for its awe-inspiring symmetry, intricate ceilings, and serene natural forest setting in the Aravalli hills.',
    spiritualSignificance:
      'The four-faced (Chaumukha) moolnayak idol symbolizes the Tirthankara presiding over all four quarters of the universe, radiating endless peace, compassion, and divine wisdom.',
    architecturalFeature:
      '1,444 uniquely carved white marble pillars where no two carvings are alike, complemented by a magnificent 6-foot single-stone marble Parshvanath sculpture with 108 snake hoods.',
    dharamshalaInfo: '120 spacious deluxe rooms with modern amenities and 100% pure Jain Bhojanalaya providing Sattvic meals.',
    timings: '6:00 AM – 7:00 PM',
    aartiTimings: 'Morning Aarti 6:30 AM, Evening Aarti 7:00 PM',
  },
  {
    id: 'tour_shikharji',
    templeId: 'tpl_003',
    title: 'Sammed Shikharji Parasnath Mahatirth',
    subtitle: 'The Nirvana Land of 20 Tirthankaras & Infinite Kevalis',
    deity: 'Lord Parshvanath & 20 Tirthankaras',
    location: 'Madhuban, Giridih District',
    state: 'Jharkhand',
    sect: 'Swetambar & Digambar',
    imageUrl: shikharjiImg,
    description:
      'Sammed Shikharji is the supreme spiritual pinnacle where 20 of the 24 Jain Tirthankaras, including Lord Parshvanath, attained eternal Moksha (liberation from the cycle of birth and death).',
    spiritualSignificance:
      'Performing the holy 27-kilometer mountain Parikrama barefoot through peaceful misty forests awakens profound inner detachment, devotion, and soul purification.',
    architecturalFeature:
      'Sacred Tonks (footprint shrines) built atop misty mountain peaks at an altitude of 4,429 ft, connected by stone mountain pathways across lush scenic ridges.',
    dharamshalaInfo: '1,000+ rooms across 40+ Dharamshalas in Madhuban base camp with 24-hour hot water, doli services, and uninterrupted Jain dining.',
    timings: '4:00 AM – 8:00 PM',
    aartiTimings: '5:00 AM & 7:00 PM at Madhuban Base',
  },
  {
    id: 'tour_pawapuri',
    templeId: 'tpl_004',
    title: 'Pawapuri Jal Mandir',
    subtitle: 'The Sacred Nirvana Sthal of Bhagwan Mahavira on the Lotus Lake',
    deity: 'Lord Mahavira (24th Tirthankara)',
    location: 'Pawapuri, Nalanda District',
    state: 'Bihar',
    sect: 'Swetambar & Digambar',
    imageUrl: pawapuriImg,
    description:
      'Pawapuri (Apapuri - the sinless land) is the hallowed site where the 24th Tirthankara, Bhagwan Mahavira, delivered his final divine discourse and attained Nirvana in 527 BCE on Diwali day.',
    spiritualSignificance:
      'The white marble Jal Mandir sits majestically in a 16.8-acre water reservoir teeming with red and pink lotus blossoms. The lake was formed when countless devotees took holy ash as sanctified prasad after Mahavira’s cremation.',
    architecturalFeature:
      'Exquisite single-span 600-foot stone bridge connecting the lake shore to the island temple, reflecting pristine white marble against the tranquil red lotus waters.',
    dharamshalaInfo: '200 modern rooms and Dharamshala complex offering tranquil stay and authentic pure Jain food arrangements.',
    timings: '6:00 AM – 8:30 PM',
    aartiTimings: 'Morning Aarti 6:30 AM, Evening Aarti 7:15 PM',
  },
  {
    id: 'tour_sanctum',
    templeId: 'tpl_005',
    title: 'Sacred Derasar Inner Sanctum (Garbhagriha)',
    subtitle: 'Divine Moolnayak Idol, Akhand Deepak & Padmasana Meditation',
    deity: 'Bhagwan Parshvanath & Navpad Aradhana',
    location: 'Malabar Hill & Ancient Heritage Derasars',
    state: 'Pan-India',
    sect: 'Swetambar & Digambar',
    imageUrl: sanctumImg,
    description:
      'The sanctum sanctorum radiates celestial silence and serenity, featuring pure Makrana marble Tirthankara idols in the Padmasana posture of supreme inner detachment (Vitaragata).',
    spiritualSignificance:
      'Witnessing the radiant eyes and peaceful countenance of the Jinendra Bhagwan inspires self-reflection, non-violence, forgiveness (Kshamavani), and mental tranquility.',
    architecturalFeature:
      'Solid silver Prabhavali archway, glowing Akhand Cow Ghee Deepaks, pure marble ashtamangal carvings, and celestial Torana domes resonating with sacred Navkar chanting.',
    dharamshalaInfo: 'Daily Pakshal, Snatra Puja rituals, and Navkarashi breakfast for morning pilgrims.',
    timings: '5:00 AM – 9:00 PM',
    aartiTimings: 'Mangla 6:00 AM, Dhup Aarti 11:30 AM, Sandhya Aarti 7:00 PM',
  },
];
