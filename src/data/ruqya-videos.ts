// ═══ YouTube Videos for Roqya Programme ═══
// Ces vidéos seront intégrées dans le programme quotidien
// Pour ajouter vos propres vidéos : ajoutez simplement un objet avec videoId, title, etc.

export interface RuqyaVideo {
  videoId: string;
  title: string;
  titleAr?: string;
  reciter: string;
  duration: string;
  category: 'ruqya_complete' | 'sourate_baqara' | 'ayat_kursi' | 'adhkar_matin' | 'adhkar_soir' | 'ruqya_ayn' | 'ruqya_sihr' | 'douas' | 'custom';
  description?: string;
}

export const RUQYA_VIDEOS: RuqyaVideo[] = [
  // ═══ RUQYA COMPLÈTE ═══
  {
    videoId: '_x-MfPJVIE4',
    title: 'Roqya Shariya complète - Al Roqia Charia',
    titleAr: 'الرقية الشرعية كاملة بصوت مشاري راشد العفاسي',
    reciter: 'Mishary Rashid Alafasy',
    duration: '1h13',
    category: 'ruqya_complete',
    description: 'Roqya complète récitée par Sheikh Mishary Alafasy — 12M de vues',
  },
  {
    videoId: 'waxbAKa-9Fc',
    title: 'Roqya - Sheikh Mishary Alafasy (officiel)',
    titleAr: 'الرقية الشرعية | الشيخ مشاري راشد العفاسي',
    reciter: 'Mishary Rashid Alafasy',
    duration: '13min',
    category: 'ruqya_complete',
    description: 'Version courte officielle depuis la chaîne Alafasy — 26M de vues',
  },
  {
    videoId: 'SF3asJu891A',
    title: 'Roqya Shariya complète - Mashary Rashed',
    titleAr: 'الرقيه الشرعيه للشيخ مشاري العفاسي',
    reciter: 'Mishary Rashid Alafasy',
    duration: '1h13',
    category: 'ruqya_complete',
    description: 'Version complète — 5.4M de vues',
  },

  // ═══ SOURATE AL-BAQARA ═══
  {
    videoId: 'Y1M6hJHHrjM',
    title: 'Sourate Al-Baqara complète (Mushaf Murattal)',
    titleAr: 'سورة البقرة من المصحف المرتل الأول للشيخ مشاري راشد العفاسي',
    reciter: 'Mishary Rashid Alafasy',
    duration: '2h',
    category: 'sourate_baqara',
    description: 'Depuis la chaîne officielle Alafasy',
  },
  {
    videoId: 'WhJU-XK0vB0',
    title: 'Sourate Al-Baqara - Sheikh Mishary Alafasy',
    titleAr: 'سورة البقرة الشيخ مشاري العفاسي',
    reciter: 'Mishary Rashid Alafasy',
    duration: '2h06',
    category: 'sourate_baqara',
  },
  {
    videoId: 'znVp4E42_-c',
    title: 'Sourate Al-Baqara complète',
    titleAr: 'سورة البقرة كاملة للشيخ مشاري بن راشد العفاسي',
    reciter: 'Mishary Rashid Alafasy',
    duration: '2h',
    category: 'sourate_baqara',
  },

  // ═══ AYAT AL-KURSI EN BOUCLE ═══
  {
    videoId: 'teQ0srSk5iY',
    title: 'Ayat Al-Kursi - Roqya puissante',
    titleAr: 'آية الكرسي رقية نافعة بإذن الله وللتحصين من الشيطان',
    reciter: 'Alaa Aqel',
    duration: '59min',
    category: 'ayat_kursi',
    description: 'Répétition prolongée pour protection et roqya',
  },

  // ═══ ADHKAR DU MATIN ═══
  {
    videoId: 'xrZALrmabb0',
    title: 'Adhkar du matin et du soir',
    titleAr: 'أذكار الصباح والمساء | مشاري راشد العفاسي',
    reciter: 'Mishary Rashid Alafasy',
    duration: '17min',
    category: 'adhkar_matin',
    description: 'Depuis la chaîne officielle Alafasy — 3.6M de vues',
  },
  {
    videoId: 'iQ-r2LXQaN4',
    title: 'Adhkar du matin - HD',
    titleAr: 'أذكار الصباح العفاسي بدقة عالية',
    reciter: 'Mishary Rashid Alafasy',
    duration: '21min',
    category: 'adhkar_matin',
    description: 'Version haute qualité — 24M de vues',
  },

  // ═══ ADHKAR DU SOIR ═══
  {
    videoId: 'Iu_LnPAcHM8',
    title: 'Adhkar du soir - HD',
    titleAr: 'أذكار المساء بصوت الشيخ مشاري العفاسي بجودة عالية',
    reciter: 'Mishary Rashid Alafasy',
    duration: '22min',
    category: 'adhkar_soir',
    description: 'Version haute qualité — 5.1M de vues',
  },

  // ═══════════════════════════════════════════════
  // VOS VIDÉOS PERSONNELLES — Ajoutez-les ici !
  // ═══════════════════════════════════════════════
  // Exemple :
  // {
  //   videoId: 'VOTRE_ID_YOUTUBE',
  //   title: 'Mon introduction au programme',
  //   reciter: 'MaRoqya',
  //   duration: '10min',
  //   category: 'custom',
  //   description: 'Vidéo personnelle de présentation du programme',
  // },
];

// ═══ Helpers ═══

export function getVideosByCategory(category: RuqyaVideo['category']): RuqyaVideo[] {
  return RUQYA_VIDEOS.filter((v) => v.category === category);
}

export function getVideoById(videoId: string): RuqyaVideo | undefined {
  return RUQYA_VIDEOS.find((v) => v.videoId === videoId);
}

export function getEmbedUrl(videoId: string): string {
  return `https://www.youtube.com/embed/${videoId}`;
}

export function getThumbnailUrl(videoId: string): string {
  return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
}
