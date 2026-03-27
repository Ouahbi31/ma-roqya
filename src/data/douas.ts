export interface Dua {
  id: string;
  titre: string;
  texte_arabe: string;
  transliteration: string;
  traduction: string;
  source: string;
  bienfaits: string;
  audio_url: string;
  categorie: 'daily' | 'healing' | 'sleep' | 'morning';
  created_at: string;
}

export const sampleDouas: Dua[] = [
  // ═══════════════════════════════════
  // PROTECTION QUOTIDIENNE
  // ═══════════════════════════════════
  {
    id: 'dua-001',
    titre: 'Ayat al-Kursi (Le Verset du Trône)',
    texte_arabe:
      'اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ ۚ لَا تَأْخُذُهُ سِنَةٌ وَلَا نَوْمٌ ۚ لَّهُ مَا فِي السَّمَاوَاتِ وَمَا فِي الْأَرْضِ ۗ مَن ذَا الَّذِي يَشْفَعُ عِندَهُ إِلَّا بِإِذْنِهِ ۚ يَعْلَمُ مَا بَيْنَ أَيْدِيهِمْ وَمَا خَلْفَهُمْ ۖ وَلَا يُحِيطُونَ بِشَيْءٍ مِّنْ عِلْمِهِ إِلَّا بِمَا شَاءَ ۚ وَسِعَ كُرْسِيُّهُ السَّمَاوَاتِ وَالْأَرْضَ ۖ وَلَا يَئُودُهُ حِفْظُهُمَا ۚ وَهُوَ الْعَلِيُّ الْعَظِيمُ',
    transliteration:
      "Allahu la ilaha illa huwal-Hayyul-Qayyum. La ta'khudhuhuu sinatun wa la nawm. Lahuu ma fis-samawati wa ma fil-ard. Man dhal-ladhi yashfa'u 'indahu illa bi-idhnih. Ya'lamu ma bayna aydihim wa ma khalfahum. Wa la yuhituna bi shay'in min 'ilmihi illa bima sha'. Wasi'a kursiyyuhus-samawati wal-ard. Wa la ya'uduhu hifdhuhumaa. Wa huwal-'Aliyyul-'Adhim.",
    traduction:
      "Allah ! Point de divinité à part Lui, le Vivant, Celui qui subsiste par Lui-même. Ni somnolence ni sommeil ne Le saisissent. A Lui appartient tout ce qui est dans les cieux et sur la terre. Qui peut intercéder auprès de Lui sans Sa permission ? Il connaît leur passé et leur futur. Et de Sa science, ils n'embrassent que ce qu'Il veut. Son Trône déborde les cieux et la terre, dont la garde ne Lui coûte aucune peine. Et Il est le Très Haut, le Très Grand.",
    source: 'Sourate Al-Baqara, 2:255',
    bienfaits: "Le Prophète ﷺ a dit : « Celui qui récite Ayat al-Kursi après chaque prière obligatoire, rien ne l'empêchera d'entrer au Paradis si ce n'est la mort. » (An-Nasa'i). C'est le plus grand verset du Coran et une protection puissante contre le mal.",
    audio_url: '',
    categorie: 'daily',
    created_at: '2025-11-01T08:00:00Z',
  },
  {
    id: 'dua-002',
    titre: 'Sourate Al-Falaq (L\'Aube naissante)',
    texte_arabe:
      'قُلْ أَعُوذُ بِرَبِّ الْفَلَقِ ﴿١﴾ مِن شَرِّ مَا خَلَقَ ﴿٢﴾ وَمِن شَرِّ غَاسِقٍ إِذَا وَقَبَ ﴿٣﴾ وَمِن شَرِّ النَّفَّاثَاتِ فِي الْعُقَدِ ﴿٤﴾ وَمِن شَرِّ حَاسِدٍ إِذَا حَسَدَ ﴿٥﴾',
    transliteration:
      "Qul a'udhu bi Rabbil-falaq. Min sharri ma khalaq. Wa min sharri ghasiqin idha waqab. Wa min sharrin-naffathati fil-'uqad. Wa min sharri hasidin idha hasad.",
    traduction:
      "Dis : Je cherche protection auprès du Seigneur de l'aube naissante, contre le mal des êtres qu'Il a créés, contre le mal de l'obscurité quand elle s'approfondit, contre le mal de celles qui soufflent sur les nœuds, et contre le mal de l'envieux quand il envie.",
    source: 'Sourate Al-Falaq, 113:1-5',
    bienfaits: "Fait partie des « Mu'awwidhatayn » (les deux protectrices). Le Prophète ﷺ les récitait 3 fois matin et soir et soufflait dans ses mains pour se protéger. Particulièrement efficace contre la sorcellerie et l'envie.",
    audio_url: '',
    categorie: 'daily',
    created_at: '2025-11-01T08:05:00Z',
  },
  {
    id: 'dua-003',
    titre: 'Sourate An-Nas (Les Hommes)',
    texte_arabe:
      'قُلْ أَعُوذُ بِرَبِّ النَّاسِ ﴿١﴾ مَلِكِ النَّاسِ ﴿٢﴾ إِلَٰهِ النَّاسِ ﴿٣﴾ مِن شَرِّ الْوَسْوَاسِ الْخَنَّاسِ ﴿٤﴾ الَّذِي يُوَسْوِسُ فِي صُدُورِ النَّاسِ ﴿٥﴾ مِنَ الْجِنَّةِ وَالنَّاسِ ﴿٦﴾',
    transliteration:
      "Qul a'udhu bi Rabbin-nas. Malikin-nas. Ilahin-nas. Min sharril-waswasil-khannas. Alladhi yuwaswisu fi sudurin-nas. Minal-jinnati wan-nas.",
    traduction:
      "Dis : Je cherche protection auprès du Seigneur des hommes, le Souverain des hommes, Dieu des hommes, contre le mal du mauvais conseiller, furtif, qui souffle le mal dans les poitrines des hommes, qu'il soit parmi les djinns ou parmi les hommes.",
    source: 'Sourate An-Nas, 114:1-6',
    bienfaits: "Complémentaire à Sourate Al-Falaq, elle protège contre les waswas (chuchotements) des djinns et des hommes. À réciter 3 fois matin et soir avec Al-Falaq et Al-Ikhlas.",
    audio_url: '',
    categorie: 'daily',
    created_at: '2025-11-01T08:10:00Z',
  },
  {
    id: 'dua-004',
    titre: "Sourate Al-Ikhlas (Le Monothéisme pur)",
    texte_arabe:
      'قُلْ هُوَ اللَّهُ أَحَدٌ ﴿١﴾ اللَّهُ الصَّمَدُ ﴿٢﴾ لَمْ يَلِدْ وَلَمْ يُولَدْ ﴿٣﴾ وَلَمْ يَكُن لَّهُ كُفُوًا أَحَدٌ ﴿٤﴾',
    transliteration:
      "Qul huwa Allahu ahad. Allahus-samad. Lam yalid wa lam yulad. Wa lam yakun lahu kufuwan ahad.",
    traduction:
      "Dis : Il est Allah, Unique. Allah, Le Seul à être imploré pour ce que nous désirons. Il n'a jamais engendré, n'a pas été engendré non plus. Et nul n'est égal à Lui.",
    source: 'Sourate Al-Ikhlas, 112:1-4',
    bienfaits: "Équivaut au tiers du Coran. Le Prophète ﷺ a dit que celui qui la récite 3 fois matin et soir sera suffisamment protégé. Elle affirme le tawhid (unicité d'Allah) qui est la base de toute protection spirituelle.",
    audio_url: '',
    categorie: 'daily',
    created_at: '2025-11-01T08:15:00Z',
  },
  {
    id: 'dua-005',
    titre: "Protection contre le mauvais œil ('ayn)",
    texte_arabe:
      'أَعُوذُ بِكَلِمَاتِ اللَّهِ التَّامَّةِ مِنْ كُلِّ شَيْطَانٍ وَهَامَّةٍ وَمِنْ كُلِّ عَيْنٍ لَامَّةٍ',
    transliteration:
      "A'udhu bi kalimatillahit-tammah, min kulli shaytanin wa hammah, wa min kulli 'aynin lammah.",
    traduction:
      "Je cherche refuge dans les paroles parfaites d'Allah, contre tout diable, tout animal nuisible, et contre tout mauvais œil.",
    source: 'Sahih Al-Bukhari, 3371',
    bienfaits: "Le Prophète ﷺ utilisait cette invocation pour protéger Al-Hassan et Al-Hussein. Ibrahim (عليه السلام) l'utilisait aussi pour protéger Isma'il et Ishaq. C'est LA dua de référence contre le mauvais œil.",
    audio_url: '',
    categorie: 'daily',
    created_at: '2025-11-02T09:00:00Z',
  },
  {
    id: 'dua-006',
    titre: 'Bismillah alladhi la yadurru...',
    texte_arabe:
      'بِسْمِ اللَّهِ الَّذِي لَا يَضُرُّ مَعَ اسْمِهِ شَيْءٌ فِي الْأَرْضِ وَلَا فِي السَّمَاءِ وَهُوَ السَّمِيعُ الْعَلِيمُ',
    transliteration:
      "Bismillahil-ladhi la yadurru ma'a ismihi shay'un fil-ardi wa la fis-sama'i wa huwas-Sami'ul-'Alim.",
    traduction:
      "Au nom d'Allah, Celui dont le nom protège de tout mal sur terre et dans le ciel, et Il est l'Audient, l'Omniscient.",
    source: "Sunan Abu Dawud, 5088 ; Sunan At-Tirmidhi, 3388",
    bienfaits: "Le Prophète ﷺ a dit : « Celui qui récite cette invocation 3 fois le matin et 3 fois le soir, rien ne lui nuira. » (Abu Dawud). Protection complète pour la journée et la nuit.",
    audio_url: '',
    categorie: 'morning',
    created_at: '2025-11-05T06:00:00Z',
  },

  // ═══════════════════════════════════
  // GUÉRISON (RUQYA)
  // ═══════════════════════════════════
  {
    id: 'dua-007',
    titre: 'Sourate Al-Fatiha (L\'Ouverture)',
    texte_arabe:
      'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ ﴿١﴾ الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ ﴿٢﴾ الرَّحْمَٰنِ الرَّحِيمِ ﴿٣﴾ مَالِكِ يَوْمِ الدِّينِ ﴿٤﴾ إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ ﴿٥﴾ اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ ﴿٦﴾ صِرَاطَ الَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ الْمَغْضُوبِ عَلَيْهِمْ وَلَا الضَّالِّينَ ﴿٧﴾',
    transliteration:
      "Bismillahir-Rahmanir-Rahim. Al-hamdu lillahi Rabbil-'alamin. Ar-Rahmanir-Rahim. Maliki yawmid-din. Iyyaka na'budu wa iyyaka nasta'in. Ihdinas-siratal-mustaqim. Siratal-ladhina an'amta 'alayhim, ghayril-maghdubi 'alayhim wa lad-dallin.",
    traduction:
      "Au nom d'Allah, le Tout Miséricordieux, le Très Miséricordieux. Louange à Allah, Seigneur de l'univers. Le Tout Miséricordieux, le Très Miséricordieux. Maître du Jour de la rétribution. C'est Toi seul que nous adorons, et c'est Toi seul dont nous implorons le secours. Guide-nous dans le droit chemin, le chemin de ceux que Tu as comblés de faveurs, non pas de ceux qui ont encouru Ta colère, ni des égarés.",
    source: 'Sourate Al-Fatiha, 1:1-7',
    bienfaits: "Aussi appelée « Ar-Roqya » (La Guérisseuse). Abu Sa'id Al-Khudri a rapporté qu'un compagnon a guéri un homme piqué par un scorpion en récitant Al-Fatiha. Le Prophète ﷺ lui a dit : « Comment savais-tu que c'était une roqya ? » (Sahih Al-Bukhari).",
    audio_url: '',
    categorie: 'healing',
    created_at: '2025-11-03T10:30:00Z',
  },
  {
    id: 'dua-008',
    titre: 'Dua de guérison du Prophète ﷺ',
    texte_arabe:
      'اللَّهُمَّ رَبَّ النَّاسِ أَذْهِبِ الْبَاسَ اشْفِهِ وَأَنْتَ الشَّافِي لَا شِفَاءَ إِلَّا شِفَاؤُكَ شِفَاءً لَا يُغَادِرُ سَقَمًا',
    transliteration:
      "Allahumma Rabban-nas, adh-hibil-ba's, ishfihi wa antash-Shafi, la shifa'a illa shifa'uk, shifa'an la yughadiru saqama.",
    traduction:
      "Ô Allah, Seigneur des hommes, ôte le mal, guéris-le, car Tu es le Guérisseur. Il n'y a de guérison que Ta guérison, une guérison qui ne laisse aucune maladie.",
    source: 'Sahih Al-Bukhari, 5675 ; Sahih Muslim, 2191',
    bienfaits: "Le Prophète ﷺ récitait cette dua en passant sa main sur le malade. Aisha (رضي الله عنها) rapporte que le Prophète ﷺ la récitait sur toute personne souffrante dans sa famille. C'est la dua de guérison par excellence.",
    audio_url: '',
    categorie: 'healing',
    created_at: '2025-11-03T10:00:00Z',
  },
  {
    id: 'dua-009',
    titre: 'Versets de guérison (Ayat Ash-Shifa)',
    texte_arabe:
      'وَيَشْفِ صُدُورَ قَوْمٍ مُّؤْمِنِينَ',
    transliteration:
      "Wa yashfi sudura qawmin mu'minin.",
    traduction:
      "Et qu'Il guérisse les poitrines des gens croyants.",
    source: 'Sourate At-Tawba, 9:14',
    bienfaits: "C'est l'un des 6 versets de guérison (Ayat Ash-Shifa) du Coran. Les savants recommandent de réciter les 6 versets ensemble lors de la roqya. Chacun mentionne le mot « shifa » (guérison) sous différentes formes.",
    audio_url: '',
    categorie: 'healing',
    created_at: '2025-11-03T11:00:00Z',
  },
  {
    id: 'dua-010',
    titre: "Roqya contre la douleur",
    texte_arabe:
      'بِسْمِ اللَّهِ أَرْقِيكَ مِنْ كُلِّ شَيْءٍ يُؤْذِيكَ مِنْ شَرِّ كُلِّ نَفْسٍ أَوْ عَيْنِ حَاسِدٍ اللَّهُ يَشْفِيكَ بِسْمِ اللَّهِ أَرْقِيكَ',
    transliteration:
      "Bismillahi arqika, min kulli shay'in yu'dhika, min sharri kulli nafsin aw 'ayni hasidin, Allahu yashfika, bismillahi arqika.",
    traduction:
      "Au nom d'Allah je te fais la roqya, contre tout ce qui te nuit, contre le mal de toute âme ou œil envieux. Qu'Allah te guérisse, au nom d'Allah je te fais la roqya.",
    source: 'Sahih Muslim, 2186',
    bienfaits: "C'est la roqya de Jibril (عليه السلام) qu'il a enseignée au Prophète ﷺ. On peut la réciter sur soi-même ou sur autrui. Elle couvre tous les types de maux : physiques, spirituels et liés au mauvais œil.",
    audio_url: '',
    categorie: 'healing',
    created_at: '2025-11-03T11:30:00Z',
  },
  {
    id: 'dua-011',
    titre: "Poser la main et invoquer Allah",
    texte_arabe:
      'بِسْمِ اللَّهِ ، بِسْمِ اللَّهِ ، بِسْمِ اللَّهِ ، أَعُوذُ بِاللَّهِ وَقُدْرَتِهِ مِنْ شَرِّ مَا أَجِدُ وَأُحَاذِرُ',
    transliteration:
      "Bismillah, bismillah, bismillah. A'udhu billahi wa qudratihi min sharri ma ajidu wa uhadhir.",
    traduction:
      "Au nom d'Allah (3 fois). Je cherche refuge auprès d'Allah et de Sa puissance contre le mal de ce que je ressens et de ce que je crains.",
    source: 'Sahih Muslim, 2202',
    bienfaits: "Le Prophète ﷺ a enseigné à 'Uthman ibn Abi Al-'As de poser la main sur l'endroit douloureux et de réciter cette invocation 7 fois. C'est une pratique simple et très efficace pour toute douleur localisée.",
    audio_url: '',
    categorie: 'healing',
    created_at: '2025-11-03T12:00:00Z',
  },

  // ═══════════════════════════════════
  // AVANT DE DORMIR
  // ═══════════════════════════════════
  {
    id: 'dua-012',
    titre: 'Dua avant de dormir',
    texte_arabe:
      'بِاسْمِكَ اللَّهُمَّ أَمُوتُ وَأَحْيَا',
    transliteration: 'Bismika Allahumma amutu wa ahya.',
    traduction:
      "C'est en Ton nom, ô Allah, que je meurs et que je vis.",
    source: 'Sahih Al-Bukhari, 6324',
    bienfaits: "Le Prophète ﷺ disait cette invocation chaque soir en posant sa main sous sa joue droite. Le sommeil est comparé à une petite mort, et cette dua rappelle qu'Allah est maître de notre vie et de notre mort.",
    audio_url: '',
    categorie: 'sleep',
    created_at: '2025-11-04T21:00:00Z',
  },
  {
    id: 'dua-013',
    titre: 'Les derniers versets de Sourate Al-Baqara',
    texte_arabe:
      'آمَنَ الرَّسُولُ بِمَا أُنزِلَ إِلَيْهِ مِن رَّبِّهِ وَالْمُؤْمِنُونَ ۚ كُلٌّ آمَنَ بِاللَّهِ وَمَلَائِكَتِهِ وَكُتُبِهِ وَرُسُلِهِ لَا نُفَرِّقُ بَيْنَ أَحَدٍ مِّن رُّسُلِهِ ۚ وَقَالُوا سَمِعْنَا وَأَطَعْنَا ۖ غُفْرَانَكَ رَبَّنَا وَإِلَيْكَ الْمَصِيرُ ﴿٢٨٥﴾ لَا يُكَلِّفُ اللَّهُ نَفْسًا إِلَّا وُسْعَهَا ۚ لَهَا مَا كَسَبَتْ وَعَلَيْهَا مَا اكْتَسَبَتْ ۗ رَبَّنَا لَا تُؤَاخِذْنَا إِن نَّسِينَا أَوْ أَخْطَأْنَا ۚ رَبَّنَا وَلَا تَحْمِلْ عَلَيْنَا إِصْرًا كَمَا حَمَلْتَهُ عَلَى الَّذِينَ مِن قَبْلِنَا ۚ رَبَّنَا وَلَا تُحَمِّلْنَا مَا لَا طَاقَةَ لَنَا بِهِ ۖ وَاعْفُ عَنَّا وَاغْفِرْ لَنَا وَارْحَمْنَا ۚ أَنتَ مَوْلَانَا فَانصُرْنَا عَلَى الْقَوْمِ الْكَافِرِينَ ﴿٢٨٦﴾',
    transliteration:
      "Amanar-Rasulu bima unzila ilayhi mir-Rabbihi wal-mu'minun. Kullun amana billahi wa mala'ikatihi wa kutubihi wa rusulih. La nufarriqu bayna ahadin mir-rusulih. Wa qalu sami'na wa ata'na ghufranaka Rabbana wa ilaykal-masir. La yukallifullahu nafsan illa wus'aha. Laha ma kasabat wa 'alayha maktasabat. Rabbana la tu'akhidhna in nasina aw akhta'na. Rabbana wa la tahmil 'alayna isran kama hamaltahu 'alal-ladhina min qablina. Rabbana wa la tuhammilna ma la taqata lana bih. Wa'fu 'anna waghfir lana warhamna. Anta Mawlana fansurna 'alal-qawmil-kafirin.",
    traduction:
      "Le Messager a cru en ce qu'on a fait descendre vers lui venant de son Seigneur, et aussi les croyants. Tous ont cru en Allah, en Ses anges, en Ses livres et en Ses messagers. Nous ne faisons aucune distinction entre Ses messagers. Et ils ont dit : Nous avons entendu et obéi. Ton pardon, notre Seigneur. Car c'est vers Toi le retour. Allah n'impose à aucune âme une charge supérieure à sa capacité. Elle sera récompensée du bien qu'elle aura fait, punie du mal qu'elle aura fait. Seigneur, ne nous châtie pas s'il nous arrive d'oublier ou de commettre une erreur. Seigneur, ne nous charge pas d'un fardeau lourd comme celui dont Tu as chargé ceux qui vécurent avant nous. Seigneur, ne nous impose pas ce que nous ne pouvons supporter. Efface nos fautes, pardonne-nous et fais-nous miséricorde. Tu es notre Maître, accorde-nous la victoire sur les peuples infidèles.",
    source: 'Sourate Al-Baqara, 2:285-286',
    bienfaits: "Le Prophète ﷺ a dit : « Celui qui récite les deux derniers versets de Sourate Al-Baqara la nuit, ils lui suffiront. » (Sahih Al-Bukhari, 5009). Ils protègent la maison et repoussent les shayatin.",
    audio_url: '',
    categorie: 'sleep',
    created_at: '2025-11-06T21:00:00Z',
  },
  {
    id: 'dua-014',
    titre: "Souffler dans les mains avec les 3 Qul",
    texte_arabe:
      'كَانَ النَّبِيُّ ﷺ إِذَا أَوَى إِلَى فِرَاشِهِ كُلَّ لَيْلَةٍ جَمَعَ كَفَّيْهِ ثُمَّ نَفَثَ فِيهِمَا فَقَرَأَ فِيهِمَا قُلْ هُوَ اللَّهُ أَحَدٌ وَ قُلْ أَعُوذُ بِرَبِّ الْفَلَقِ وَ قُلْ أَعُوذُ بِرَبِّ النَّاسِ ثُمَّ يَمْسَحُ بِهِمَا مَا اسْتَطَاعَ مِنْ جَسَدِهِ',
    transliteration:
      "Le Prophète ﷺ joignait ses mains, soufflait dedans, récitait les 3 Qul (Al-Ikhlas, Al-Falaq, An-Nas), puis passait ses mains sur tout son corps.",
    traduction:
      "Chaque nuit, le Prophète ﷺ joignait ses paumes, y soufflait, récitait les sourates Al-Ikhlas, Al-Falaq et An-Nas, puis passait ses mains sur tout son corps en commençant par la tête et le visage, et ce qu'il pouvait atteindre. Il le faisait 3 fois.",
    source: 'Sahih Al-Bukhari, 5017',
    bienfaits: "C'est la Sunnah du Prophète ﷺ avant de dormir chaque nuit. Aisha (رضي الله عنها) a rapporté qu'il ne manquait jamais de le faire. Quand il était malade, elle le faisait pour lui avec ses propres mains, cherchant la baraka de ses mains ﷺ.",
    audio_url: '',
    categorie: 'sleep',
    created_at: '2025-11-06T21:30:00Z',
  },

  // ═══════════════════════════════════
  // MATIN & SOIR
  // ═══════════════════════════════════
  {
    id: 'dua-015',
    titre: 'Adhkar du matin — Asbahna wa asbahal mulku lillah',
    texte_arabe:
      'أَصْبَحْنَا وَأَصْبَحَ الْمُلْكُ لِلَّهِ وَالْحَمْدُ لِلَّهِ لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ',
    transliteration:
      "Asbahna wa asbahal-mulku lillah, wal-hamdu lillah, la ilaha illallahu wahdahu la sharika lah, lahul-mulku wa lahul-hamdu wa huwa 'ala kulli shay'in qadir.",
    traduction:
      "Nous voici au matin et la royauté appartient à Allah. Louange à Allah. Il n'y a de divinité qu'Allah, Seul, sans associé. A Lui la royauté, à Lui la louange, et Il est Omnipotent.",
    source: "Sunan Abu Dawud, 5071",
    bienfaits: "Fait partie des adhkar essentiels du matin. Le soir, on remplace « Asbahna » par « Amsayna ». Cette invocation renouvelle chaque jour notre conscience de la souveraineté d'Allah sur toute chose.",
    audio_url: '',
    categorie: 'morning',
    created_at: '2025-11-05T06:30:00Z',
  },
  {
    id: 'dua-016',
    titre: "La hawla wa la quwwata illa billah",
    texte_arabe:
      'لَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللَّهِ',
    transliteration:
      "La hawla wa la quwwata illa billah.",
    traduction:
      "Il n'y a de force ni de puissance qu'en Allah.",
    source: 'Sahih Al-Bukhari, 4205 ; Sahih Muslim, 2704',
    bienfaits: "Le Prophète ﷺ l'a appelée « un trésor parmi les trésors du Paradis ». Cette parole puissante renforce la confiance en Allah et rappelle que toute force et tout changement ne viennent que de Lui. À répéter abondamment.",
    audio_url: '',
    categorie: 'morning',
    created_at: '2025-11-05T07:00:00Z',
  },
  {
    id: 'dua-017',
    titre: "Hasbiyallahu la ilaha illa huwa",
    texte_arabe:
      'حَسْبِيَ اللَّهُ لَا إِلَهَ إِلَّا هُوَ عَلَيْهِ تَوَكَّلْتُ وَهُوَ رَبُّ الْعَرْشِ الْعَظِيمِ',
    transliteration:
      "Hasbiyallahu la ilaha illa huwa, 'alayhi tawakkaltu wa huwa Rabbul-'arshil-'adhim.",
    traduction:
      "Allah me suffit, il n'y a de divinité que Lui. C'est en Lui que je place ma confiance, et Il est le Seigneur du Trône immense.",
    source: "Sourate At-Tawba, 9:129 ; Abu Dawud, 5081",
    bienfaits: "Le Prophète ﷺ a dit : « Celui qui dit cela 7 fois matin et soir, Allah lui suffira pour tout ce qui le préoccupe. » (Abu Dawud). C'est l'invocation du tawakkul (confiance en Allah) par excellence.",
    audio_url: '',
    categorie: 'morning',
    created_at: '2025-11-05T07:30:00Z',
  },

  // ═══════════════════════════════════
  // DOUAS DU DOCUMENT ROQYA (CITARAPPEL)
  // ═══════════════════════════════════
  {
    id: 'dua-018',
    titre: "Protection contre la colère d'Allah et les suggestions des diables",
    texte_arabe:
      'أَعُوذُ بِكَلِمَاتِ اللَّهِ التَّامَّاتِ مِنْ غَضَبِهِ وَعِقَابِهِ وَشَرِّ عِبَادِهِ وَمِنْ هَمَزَاتِ الشَّيَاطِينِ وَأَنْ يَحْضُرُونِ',
    transliteration:
      "A'udhu bi kalimatillahi at-tammati min ghadabihi wa 'iqabihi wa sharri 'ibadihi wa min hamazati ash-shayatini wa an yahdurun.",
    traduction:
      "Je prends refuge dans les paroles parfaites d'Allah contre Sa colère, Son châtiment, le mal de Ses serviteurs, les suggestions des diables et contre leur présence.",
    source: 'Sunan Abu Dawud, 3893 ; Sahih At-Tirmidhi, 3/171',
    bienfaits: "Le Prophète ﷺ a enseigné cette invocation à son compagnon. Elle protège contre les waswas (suggestions) des shayatin et leur présence. Particulièrement recommandée en cas de peur nocturne, de cauchemars ou de sensation de présence démoniaque.",
    audio_url: '',
    categorie: 'daily',
    created_at: '2025-11-07T08:00:00Z',
  },
  {
    id: 'dua-019',
    titre: "La grande protection — Paroles parfaites complètes",
    texte_arabe:
      'أَعُوذُ بِكَلِمَاتِ اللَّهِ التَّامَّاتِ الَّتِي لَا يُجَاوِزُهُنَّ بَرٌّ وَلَا فَاجِرٌ مِنْ شَرِّ مَا خَلَقَ وَبَرَأَ وَذَرَأَ وَمِنْ شَرِّ مَا يَنْزِلُ مِنَ السَّمَاءِ وَمِنْ شَرِّ مَا يَعْرُجُ فِيهَا وَمِنْ شَرِّ مَا ذَرَأَ فِي الْأَرْضِ وَمِنْ شَرِّ مَا يَخْرُجُ مِنْهَا وَمِنْ شَرِّ فِتَنِ اللَّيْلِ وَالنَّهَارِ وَمِنْ شَرِّ كُلِّ طَارِقٍ إِلَّا طَارِقًا يَطْرُقُ بِخَيْرٍ يَا رَحْمَنُ',
    transliteration:
      "A'udhu bi kalimatillahi at-tammati allati la yujawizuhunna barrun wa la fajirun min sharri ma khalaqa wa bara'a wa dhara'a, wa min sharri ma yanzilu mina as-sama'i wa min sharri ma ya'ruju fiha, wa min sharri ma dhara'a fil-ardi wa min sharri ma yakhruju minha, wa min sharri fitanil-layli wan-nahari, wa min sharri kulli tariqin illa tariqan yatruqu bi-khayrin ya Rahman.",
    traduction:
      "Je prends refuge dans les paroles parfaites d'Allah, celles que ne peut transgresser un pieux ni un dépravé, contre tout mal qu'Il a créé, façonné et multiplié, contre les méfaits de ce qui descend du ciel et de ce qui y remonte, contre les méfaits de ce qui accroît sur terre et de ce qui en ressort, contre les méfaits des tentations du jour comme de la nuit et contre les méfaits de tout visiteur, sauf s'il est porteur de bien — Ô le Miséricordieux.",
    source: "Muwatta de l'Imam Malik, 2/541 ; Musnad Ahmad",
    bienfaits: "C'est l'une des plus complètes invocations de protection. Elle couvre tous les types de mal : ce qui vient du ciel, de la terre, du jour et de la nuit. Ibn 'Arabi a dit que c'est une protection absolue. Particulièrement recommandée lors de voyages ou en cas de peur intense.",
    audio_url: '',
    categorie: 'daily',
    created_at: '2025-11-07T08:30:00Z',
  },
  {
    id: 'dua-020',
    titre: "Doua Roqya — Protection contre tout méfait",
    texte_arabe:
      'اللَّهُمَّ رَبَّ السَّمَاوَاتِ السَّبْعِ وَرَبَّ الْعَرْشِ الْعَظِيمِ رَبَّنَا وَرَبَّ كُلِّ شَيْءٍ فَالِقَ الْحَبِّ وَالنَّوَى وَمُنَزِّلَ التَّوْرَاةِ وَالْإِنْجِيلِ وَالْقُرْآنِ أَعُوذُ بِكَ مِنْ شَرِّ كُلِّ شَيْءٍ أَنْتَ آخِذٌ بِنَاصِيَتِهِ أَنْتَ الْأَوَّلُ فَلَيْسَ قَبْلَكَ شَيْءٌ وَأَنْتَ الْآخِرُ فَلَيْسَ بَعْدَكَ شَيْءٌ وَأَنْتَ الظَّاهِرُ فَلَيْسَ فَوْقَكَ شَيْءٌ وَأَنْتَ الْبَاطِنُ فَلَيْسَ دُونَكَ شَيْءٌ',
    transliteration:
      "Allahumma Rabba as-samawati as-sab'i wa Rabba al-'arshi al-'adhim, Rabbana wa Rabba kulli shay'in, faliqa al-habbi wan-nawa, wa munazzila at-Tawrati wal-Injili wal-Qur'an. A'udhu bika min sharri kulli shay'in anta akhidhun bi-nasiyatih. Anta al-Awwalu fa-laysa qablaka shay'un, wa anta al-Akhiru fa-laysa ba'daka shay'un, wa anta adh-Dhahiru fa-laysa fawqaka shay'un, wa anta al-Batinu fa-laysa dunaka shay'un.",
    traduction:
      "Ô Allah, Seigneur des sept cieux et du Trône Sublime, notre Seigneur et Seigneur de toute chose, Celui qui fend la graine et fait germer la semence, le Révélateur de la Torah, de l'Évangile et du Coran. Je prends refuge auprès de Toi contre les méfaits de toute chose dont Tu maîtrises la destinée. Tu es le Premier, rien ne Te précède ; Tu es le Dernier, rien ne Te succède ; Tu es l'Apparent, rien n'est au-dessus de Toi ; Tu es le Caché, rien n'est plus occulte que Toi.",
    source: 'Sahih Muslim, 2713',
    bienfaits: "Le Prophète ﷺ récitait cette invocation avant de dormir. Elle invoque les attributs sublimes d'Allah (Al-Awwal, Al-Akhir, Adh-Dhahir, Al-Batin) pour une protection totale. Muslim la rapporte dans le chapitre des adhkar du coucher. Une invocation extrêmement puissante pour la roqya.",
    audio_url: '',
    categorie: 'healing',
    created_at: '2025-11-07T09:00:00Z',
  },
  {
    id: 'dua-021',
    titre: "Doua contre la jalousie et le hassad",
    texte_arabe:
      'بِسْمِ اللَّهِ يُبْرِيكَ وَمِنْ كُلِّ دَاءٍ يَشْفِيكَ وَمِنْ شَرِّ حَاسِدٍ إِذَا حَسَدَ وَمِنْ شَرِّ كُلِّ ذِي عَيْنٍ',
    transliteration:
      "Bismillahi yubrika wa min kulli da'in yashfika wa min sharri hasidin idha hasada wa min sharri kulli dhi 'aynin.",
    traduction:
      "Au nom d'Allah, puisse-t-Il te purifier de toute maladie, te guérir, te protéger de tout envieux lorsqu'il envie et des méfaits de celui qui regarde jalousement.",
    source: 'Sahih Muslim, 2186',
    bienfaits: "Cette invocation est spécialement orientée contre le hassad (jalousie maladive) et le mauvais œil. Elle demande à Allah la purification complète du mal causé par l'envie d'autrui. À réciter sur soi ou sur la personne atteinte en passant la main sur l'endroit douloureux.",
    audio_url: '',
    categorie: 'healing',
    created_at: '2025-11-07T09:30:00Z',
  },
  {
    id: 'dua-022',
    titre: "Doua Roqya contre le hassad et la jalousie",
    texte_arabe:
      'بِسْمِ اللَّهِ أَرْقِيكَ مِنْ كُلِّ شَيْءٍ يُؤْذِيكَ مِنْ حَسَدِ حَاسِدٍ وَمِنْ كُلِّ ذِي عَيْنٍ اللَّهُ يَشْفِيكَ',
    transliteration:
      "Bismillahi arqika min kulli shay'in yu'dhika min hassadi hasidin wa min kulli dhi 'aynin, Allahu yashfika.",
    traduction:
      "Au nom d'Allah je te fais la roqya contre tout ce qui te nuit, contre l'envie d'un envieux et le regard d'un jaloux. Qu'Allah te guérisse.",
    source: 'Sahih Muslim, 2186 — variante',
    bienfaits: "Variante de la roqya de Jibril, spécifiquement ciblée contre le hassad (jalousie) et le 'ayn (mauvais œil). Le Prophète ﷺ a confirmé que le mauvais œil est une réalité et a encouragé la roqya pour s'en protéger. À réciter en posant la main sur le malade.",
    audio_url: '',
    categorie: 'healing',
    created_at: '2025-11-07T10:00:00Z',
  },
];
