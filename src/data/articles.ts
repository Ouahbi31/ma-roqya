// ---------------------------------------------------------------------------
// Article data model & sample articles for MaRoqya blog / magazine section
// ---------------------------------------------------------------------------

export type ArticleCategory =
  | 'ruqya'
  | 'psycho-roqya'
  | 'ayn'
  | 'sihr'
  | 'mass'
  | 'prevention'
  | 'conseils'
  | 'temoignages';

export interface ArticleAuthor {
  name: string;
  avatar?: string;
  bio?: string;
}

export type ArticleBlock =
  | { type: 'paragraph'; text: string }
  | { type: 'heading'; level: 2 | 3; text: string }
  | { type: 'arabic'; text: string; translation: string; source: string }
  | { type: 'quote'; text: string; author?: string }
  | { type: 'list'; items: string[]; ordered?: boolean }
  | { type: 'video'; youtubeId: string; caption?: string }
  | { type: 'image'; url: string; caption?: string; alt: string }
  | { type: 'callout'; variant: 'tip' | 'warning' | 'info'; text: string }
  | { type: 'separator' };

export interface Article {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  category: ArticleCategory;
  imageUrl: string;
  imageGradient: string;
  author: ArticleAuthor;
  date: string;
  readTime: number;
  featured: boolean;
  tags: string[];
  content: ArticleBlock[];
  videoUrl?: string;
}

// ---------------------------------------------------------------------------
// Category metadata
// ---------------------------------------------------------------------------

export const categoryMeta: Record<
  ArticleCategory,
  { label: string; color: string; bg: string }
> = {
  ruqya: {
    label: 'Roqya & Guérison',
    color: 'text-green-800',
    bg: 'bg-green-100',
  },
  'psycho-roqya': {
    label: 'Psycho-Roqya',
    color: 'text-amber-800',
    bg: 'bg-amber-100',
  },
  ayn: {
    label: "Mauvais Œil ('Ayn)",
    color: 'text-blue-700',
    bg: 'bg-blue-100',
  },
  sihr: {
    label: 'Sorcellerie (Sihr)',
    color: 'text-purple-700',
    bg: 'bg-purple-100',
  },
  mass: {
    label: 'Possession (Mass)',
    color: 'text-red-700',
    bg: 'bg-red-100',
  },
  prevention: {
    label: 'Prévention & Protection',
    color: 'text-emerald-700',
    bg: 'bg-emerald-100',
  },
  conseils: {
    label: 'Conseils Pratiques',
    color: 'text-amber-700',
    bg: 'bg-amber-100',
  },
  temoignages: {
    label: 'Témoignages',
    color: 'text-pink-700',
    bg: 'bg-pink-100',
  },
};

// ---------------------------------------------------------------------------
// Authors
// ---------------------------------------------------------------------------

const authorYoussef: ArticleAuthor = {
  name: 'Youssef El-Amrani',
  bio: "Spécialiste en Roqya Shar'iyya et accompagnement spirituel depuis plus de 10 ans. Formé auprès de savants reconnus.",
};

const authorFatima: ArticleAuthor = {
  name: 'Fatima Benali',
  bio: 'Psychologue clinicienne et chercheuse en psycho-roqya. Auteure de plusieurs ouvrages sur la santé mentale en islam.',
};

const authorAhmad: ArticleAuthor = {
  name: 'Ahmad Siddiq',
  bio: "Imam et enseignant en sciences islamiques. Spécialisé dans l'exégèse coranique et les sciences du hadith.",
};

// ---------------------------------------------------------------------------
// Sample articles
// ---------------------------------------------------------------------------

export const sampleArticles: Article[] = [
  // 1 -----------------------------------------------------------------------
  {
    id: 'art-ruqya-shariyya',
    slug: 'quest-ce-que-la-ruqya-shariyya',
    title: "Qu'est-ce que la Roqya Shar'iyya ?",
    excerpt:
      "Découvrez ce qu'est la roqya légitime selon le Coran et la Sunnah, ses conditions de validité et pourquoi elle reste le seul remède spirituel autorisé en islam.",
    category: 'ruqya',
    imageUrl: '/images/articles/ruqya-shariyya.png',
    imageGradient: 'bg-gradient-to-br from-green-700 via-green-600 to-emerald-500',
    author: authorYoussef,
    date: '2026-03-20',
    readTime: 10,
    featured: true,
    tags: ['ruqya', 'coran', 'sunnah', 'guérison'],
    content: [
      {
        type: 'paragraph',
        text: "La Roqya Shar'iyya est l'ensemble des invocations, récitations coraniques et supplications prophétiques utilisées pour guérir les maladies spirituelles et physiques. Elle constitue le seul moyen de guérison spirituelle autorisé en islam, et repose sur trois piliers fondamentaux : le Coran, la Sunnah et l'invocation d'Allah.",
      },
      { type: 'heading', level: 2, text: 'Les fondements coraniques' },
      {
        type: 'arabic',
        text: 'وَنُنَزِّلُ مِنَ الْقُرْآنِ مَا هُوَ شِفَاءٌ وَرَحْمَةٌ لِّلْمُؤْمِنِينَ',
        translation:
          'Nous faisons descendre du Coran ce qui est une guérison et une miséricorde pour les croyants.',
        source: 'Sourate Al-Isra, 17:82',
      },
      {
        type: 'paragraph',
        text: "Ce verset établit clairement que le Coran est une source de guérison. Les savants de l'islam, d'Ibn Qayyim al-Jawziyya à Ibn Taymiyya, ont unanimement reconnu l'efficacité de la roqya par le Coran comme remède contre le mauvais oeil, la sorcellerie et la possession.",
      },
      { type: 'heading', level: 2, text: 'Les trois conditions de validité' },
      {
        type: 'list',
        items: [
          "Elle doit être composée exclusivement de paroles d'Allah, de Ses noms et attributs, ou d'invocations prophétiques authentiques.",
          'Elle doit être prononcée en langue arabe ou dans une langue comprise par le malade.',
          "Le praticien et le malade doivent croire fermement que c'est Allah seul qui guérit, et non la roqya en elle-même.",
        ],
        ordered: true,
      },
      {
        type: 'callout',
        variant: 'tip',
        text: "Le Prophète (paix et salut sur lui) a dit : « Il n'y a pas de mal à pratiquer la roqya tant qu'elle ne contient pas de shirk (associationnisme). » — Rapporté par Muslim.",
      },
      { type: 'separator' },
      { type: 'heading', level: 2, text: 'Les versets principaux de la Roqya' },
      {
        type: 'paragraph',
        text: "Plusieurs sourates et versets sont particulièrement utilisés lors d'une séance de roqya :",
      },
      {
        type: 'list',
        items: [
          'Sourate Al-Fatiha — considérée comme la plus grande roqya.',
          "Ayat al-Kursi (Al-Baqara, 2:255) — protection contre les djinns et le shaytan.",
          'Les deux derniers versets de Sourate Al-Baqara (2:285-286).',
          'Sourates Al-Ikhlas, Al-Falaq et An-Nas (les Mu\'awwidhat).',
          'Les versets dits « de la sorcellerie » dans Al-A\'raf (7:117-122), Yunus (10:81-82) et Ta-Ha (20:69).',
        ],
      },
      {
        type: 'arabic',
        text: 'اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ',
        translation: 'Allah ! Point de divinité à part Lui, le Vivant, Celui qui subsiste par Lui-même.',
        source: 'Ayat al-Kursi, Al-Baqara 2:255',
      },
      { type: 'heading', level: 2, text: 'Mise en garde contre les charlatans' },
      {
        type: 'callout',
        variant: 'warning',
        text: "Méfiez-vous de tout praticien qui utilise des talismans, demande le nom de la mère du patient, brûle de l'encens avec des incantations obscures, ou demande des sommes excessives. Ces pratiques relèvent de la sorcellerie et sont strictement interdites en islam.",
      },
      {
        type: 'paragraph',
        text: "La roqya légitime se pratique au grand jour, avec des paroles connues du Coran et de la Sunnah. Le raqi (praticien) doit être une personne de confiance, connue pour sa piété et son attachement à la Sunnah. Et rappelez-vous : la meilleure roqya est celle que l'on fait sur soi-même.",
      },
    ],
  },

  // 2 -----------------------------------------------------------------------
  {
    id: 'art-signes-ayn',
    slug: 'comment-reconnaitre-signes-mauvais-oeil',
    title: "Comment reconnaître les signes du mauvais œil ('Ayn)",
    excerpt:
      "Le mauvais oeil est une réalité confirmée par le Coran et la Sunnah. Apprenez à identifier ses symptômes et les moyens prophétiques de s'en protéger.",
    category: 'ayn',
    imageUrl: '/images/articles/mauvais-oeil-ayn.png',
    imageGradient: 'bg-gradient-to-br from-blue-700 via-blue-500 to-sky-400',
    author: authorFatima,
    date: '2026-03-15',
    readTime: 8,
    featured: false,
    tags: ['ayn', 'mauvais oeil', 'protection', 'symptômes'],
    content: [
      {
        type: 'paragraph',
        text: "Le mauvais oeil (al-'ayn) est un phénomène spirituel reconnu unanimement par les savants de l'islam. Il survient lorsqu'une personne regarde quelque chose avec admiration, envie ou étonnement sans mentionner le nom d'Allah.",
      },
      {
        type: 'arabic',
        text: 'وَإِن يَكَادُ الَّذِينَ كَفَرُوا لَيُزْلِقُونَكَ بِأَبْصَارِهِمْ',
        translation:
          'Peu s\'en faut que ceux qui mécroient ne te fassent trébucher par leurs regards.',
        source: 'Sourate Al-Qalam, 68:51',
      },
      { type: 'heading', level: 2, text: 'Les symptômes souvent évoqués' },
      {
        type: 'callout',
        variant: 'warning',
        text: "Important : les symptômes listés ci-dessous sont issus de l'expérience de ceux qui pratiquent la roqya. Ce ne sont que des indications qui peuvent orienter, pas des certitudes. La majorité de ces symptômes peuvent avoir des causes totalement différentes (fatigue, stress, mode de vie, état émotionnel...). Il ne faut en aucun cas affirmer de façon catégorique que c'est du mauvais œil sur la base de ces seuls signes. Ce sont des hypothèses, pas des diagnostics.",
      },
      {
        type: 'list',
        items: [
          'Fatigue soudaine et inexpliquée, sensation de lourdeur permanente.',
          'Maux de tête persistants qui ne répondent pas aux remèdes classiques.',
          'Changement brutal de comportement, irritabilité inhabituelle.',
          'Pâleur du visage et teint terne.',
          'Perte soudaine de motivation ou de concentration.',
          'Problèmes récurrents dans les affaires, le travail ou les relations.',
          'Bâillements fréquents et larmoiement pendant la lecture du Coran.',
        ],
      },
      {
        type: 'paragraph',
        text: "Encore une fois, tous ces signes peuvent avoir des explications parfaitement naturelles. Ne vous enfermez pas dans un diagnostic hâtif. La roqya est bénéfique dans tous les cas — que l'on soit atteint ou non — car c'est avant tout du Coran et des invocations prophétiques.",
      },
      { type: 'heading', level: 2, text: 'Comment se protéger' },
      {
        type: 'paragraph',
        text: "Le Prophète (paix et salut sur lui) a enseigné plusieurs moyens de protection :",
      },
      {
        type: 'list',
        items: [
          "Réciter les adhkar du matin et du soir régulièrement.",
          "Dire « Ma sha Allah, la quwwata illa billah » devant ce qui nous plaît.",
          "Réciter les sourates Al-Falaq et An-Nas trois fois le matin et le soir.",
          "Réciter Ayat al-Kursi après chaque prière obligatoire.",
          "Faire des invocations pour autrui lorsqu'on admire quelque chose chez eux.",
        ],
        ordered: true,
      },
      { type: 'separator' },
      { type: 'heading', level: 2, text: 'Le programme de roqya' },
      {
        type: 'paragraph',
        text: "Si le mauvais oeil est confirmé, le programme consiste en la récitation du Coran sur la personne atteinte, le bain avec de l'eau coranisée et la persévérance dans les invocations. Si l'auteur du oeil est connu, il lui est demandé de faire ses ablutions et l'eau est versée sur le malade, comme l'a prescrit le Prophète (paix et salut sur lui).",
      },
      {
        type: 'callout',
        variant: 'tip',
        text: "Le Prophète (paix et salut sur lui) a dit : « Le mauvais oeil est une réalité. S'il y avait une chose qui pouvait devancer le destin, ce serait le mauvais oeil. » — Rapporté par Muslim.",
      },
    ],
  },

  // 3 -----------------------------------------------------------------------
  {
    id: 'art-psycho-roqya',
    slug: 'psycho-roqya-approche-revolutionnaire',
    title: 'La Psycho-Roqya : une approche révolutionnaire',
    excerpt:
      "Découvrez comment la psycho-roqya combine les sciences de la psychologie moderne avec la guérison spirituelle islamique pour une prise en charge holistique.",
    category: 'psycho-roqya',
    imageUrl: '/images/articles/psycho-roqya.png',
    imageGradient: 'bg-gradient-to-br from-amber-600 via-yellow-500 to-orange-400',
    author: authorFatima,
    date: '2026-03-10',
    readTime: 12,
    featured: true,
    tags: ['psycho-roqya', 'psychologie', 'thérapie', 'innovation'],
    content: [
      {
        type: 'paragraph',
        text: "La psycho-roqya est une approche novatrice qui allie la psychologie clinique aux pratiques de guérison spirituelle islamique. Elle part du constat que de nombreux troubles attribués à des causes surnaturelles ont en réalité des composantes psychologiques, et inversement.",
      },
      { type: 'heading', level: 2, text: 'Pourquoi cette approche ?' },
      {
        type: 'paragraph',
        text: "Trop souvent, les patients sont pris en charge de manière fragmentée : soit uniquement par la psychologie occidentale qui ignore la dimension spirituelle, soit uniquement par la roqya qui peut négliger les aspects psychologiques. La psycho-roqya propose une troisième voie, intégrative et respectueuse de la foi du patient.",
      },
      {
        type: 'callout',
        variant: 'info',
        text: "La psycho-roqya ne remplace ni la psychothérapie classique ni la roqya shar'iyya. Elle les complète en créant un pont entre les deux disciplines.",
      },
      { type: 'heading', level: 2, text: 'Les piliers de la psycho-roqya' },
      {
        type: 'list',
        items: [
          "L'écoute active et l'empathie — comprendre le vécu du patient dans sa globalité.",
          "Le diagnostic différentiel — distinguer ce qui relève du trouble psychologique, du mal spirituel, ou des deux.",
          "La thérapie cognitivo-comportementale islamique — restructurer les pensées négatives à la lumière du Coran.",
          "L'accompagnement spirituel — renforcer le lien avec Allah comme source de guérison.",
          "Le suivi holistique — combiner accompagnement psychologique et spirituel.",
        ],
        ordered: true,
      },
      { type: 'separator' },
      { type: 'heading', level: 2, text: 'Comment ça se passe en pratique' },
      {
        type: 'paragraph',
        text: "Une personne souffrant d'anxiété sévère peut présenter des symptômes qui ressemblent à ceux de la possession. L'approche Psycho-Roqya permet d'évaluer la part psychologique (peurs, traumatismes, schémas de pensée) et la part spirituelle (éloignement de la prière, abandon des adhkar) pour proposer un accompagnement adapté.",
      },
      {
        type: 'quote',
        text: "La guérison véritable passe par la paix de l'âme, et la paix de l'âme vient du rappel d'Allah.",
        author: 'Ibn Qayyim al-Jawziyya',
      },
      {
        type: 'arabic',
        text: 'أَلَا بِذِكْرِ اللَّهِ تَطْمَئِنُّ الْقُلُوبُ',
        translation: "N'est-ce point par le rappel d'Allah que se tranquillisent les coeurs ?",
        source: 'Sourate Ar-Ra\'d, 13:28',
      },
    ],
  },

  // 4 -----------------------------------------------------------------------
  {
    id: 'art-auto-ruqya',
    slug: 'conseils-ruqya-seul',
    title: 'Conseils pour ceux qui font leur Roqya seuls',
    excerpt:
      "Guide pratique et complet pour pratiquer l'auto-roqya chez soi de manière efficace et conforme à la Sunnah.",
    category: 'conseils',
    imageUrl: '/images/articles/ruqya-seul.png',
    imageGradient: 'bg-gradient-to-br from-amber-500 via-orange-400 to-yellow-300',
    author: authorYoussef,
    date: '2026-03-05',
    readTime: 9,
    featured: false,
    tags: ['auto-ruqya', 'guide', 'pratique', 'chez soi'],
    content: [
      {
        type: 'paragraph',
        text: "L'auto-roqya est non seulement permise mais encouragée en islam. Le Prophète (paix et salut sur lui) pratiquait la roqya sur lui-même en récitant les sourates protectrices et en soufflant dans ses mains avant de dormir. Voici un guide pour vous accompagner.",
      },
      { type: 'heading', level: 2, text: "L'essentiel avant tout : vous n'avez pas besoin d'être un savant" },
      {
        type: 'paragraph',
        text: "Avant de parler de programme et de sourates spécifiques, il faut briser un plafond de verre que beaucoup de gens ont : la croyance qu'il faut être un érudit, connaître le Coran par cœur, ou maîtriser des formules compliquées pour faire sa roqya. C'est faux.",
      },
      {
        type: 'callout',
        variant: 'tip',
        text: "Sourate Al-Fatiha seule suffit. Le Prophète ﷺ l'a appelée « la Guérisseuse » (Ash-Shafiya). Un Compagnon a guéri un homme piqué par un scorpion en récitant uniquement Al-Fatiha. Si vous ne connaissez rien d'autre, récitez Al-Fatiha avec conviction — c'est largement suffisant.",
      },
      {
        type: 'paragraph',
        text: "Et même au-delà : si vous ne connaissez même pas Al-Fatiha en entier, dites simplement « Bismillah » avec une intention sincère et la certitude qu'Allah vous guérit. Répétez-le. La roqya, ce n'est pas une formule magique réservée à une élite — c'est une connexion directe entre vous et Allah. Tout le monde y a accès. Le plus important, ce n'est pas la quantité de ce que vous récitez, c'est la sincérité de votre cœur et la certitude que la guérison vient d'Allah seul.",
      },
      {
        type: 'paragraph',
        text: "Ne laissez personne vous faire croire que vous avez besoin d'un intermédiaire pour parler à Allah ou pour que Sa Parole agisse sur vous. Vous êtes directement connecté à Lui. C'est ça, le vrai fondement de la roqya.",
      },
      { type: 'separator' },
      { type: 'heading', level: 2, text: 'Préparation spirituelle' },
      {
        type: 'list',
        items: [
          "Faites vos ablutions (wudu) avant de commencer.",
          "Choisissez un endroit calme et propre.",
          "Orientez-vous vers la Qibla si possible.",
          "Ayez l'intention sincère de chercher la guérison auprès d'Allah seul.",
          "Commencez par vous repentir de vos péchés et demander pardon à Allah.",
        ],
        ordered: true,
      },
      { type: 'heading', level: 2, text: 'Un programme pour ceux qui veulent aller plus loin' },
      {
        type: 'paragraph',
        text: "Si vous souhaitez structurer votre pratique, voici un programme quotidien que vous pouvez suivre. Mais rappelez-vous : même Al-Fatiha seule, récitée avec certitude, est une roqya complète. Ce qui suit est un plus, pas un minimum requis.",
      },
      {
        type: 'list',
        items: [
          "Sourate Al-Fatiha — 7 fois",
          "Ayat al-Kursi — 7 fois",
          "Les trois derniers versets de Sourate Al-Baqara — 3 fois",
          "Sourate Al-Ikhlas, Al-Falaq, An-Nas — 3 fois chacune",
          "Les versets de la sorcellerie (Al-A'raf 117-122, Yunus 81-82, Ta-Ha 69) — 3 fois",
        ],
      },
      {
        type: 'callout',
        variant: 'tip',
        text: "Placez votre main droite sur la zone douloureuse ou sur votre poitrine pendant la récitation. Soufflez légèrement dans vos mains après chaque sourate et passez-les sur votre corps.",
      },
      { type: 'separator' },
      { type: 'heading', level: 2, text: "L'eau coranisée en complément" },
      {
        type: 'paragraph',
        text: "Préparez de l'eau coranisée en récitant les versets ci-dessus sur une bouteille d'eau. Buvez-en régulièrement tout au long de la journée. Vous pouvez aussi vous en asperger ou en utiliser pour le bain. L'huile d'olive coranisée peut être appliquée sur le corps.",
      },
      {
        type: 'callout',
        variant: 'warning',
        text: "La persévérance est la clé. Ne vous découragez pas si les résultats ne sont pas immédiats. Certains programmes peuvent durer des semaines ou des mois. La guérison vient d'Allah et Il connaît le meilleur moment pour vous.",
      },
    ],
  },

  // 5 -----------------------------------------------------------------------
  {
    id: 'art-sourate-baqara',
    slug: 'sourate-al-baqara-bouclier-quotidien',
    title: 'Sourate Al-Baqara : votre bouclier quotidien',
    excerpt:
      "Les vertus immenses de la sourate Al-Baqara pour la protection du foyer et comment l'intégrer dans votre routine spirituelle.",
    category: 'prevention',
    imageUrl: '/images/articles/sourate-baqara.png',
    imageGradient: 'bg-gradient-to-br from-emerald-600 via-green-500 to-teal-400',
    author: authorAhmad,
    date: '2026-02-28',
    readTime: 7,
    featured: false,
    tags: ['al-baqara', 'protection', 'foyer', 'routine'],
    content: [
      {
        type: 'paragraph',
        text: "Sourate Al-Baqara occupe une place unique dans le Coran. C'est la plus longue sourate, et le Prophète (paix et salut sur lui) lui a attribué des vertus protectrices exceptionnelles pour le croyant et son foyer.",
      },
      {
        type: 'arabic',
        text: 'اقْرَؤُوا سُورَةَ الْبَقَرَةِ فَإِنَّ أَخْذَهَا بَرَكَةٌ وَتَرْكَهَا حَسْرَةٌ وَلَا تَسْتَطِيعُهَا الْبَطَلَةُ',
        translation:
          "Lisez sourate Al-Baqara, car sa lecture est une bénédiction, son abandon est un regret, et les sorciers ne peuvent rien contre elle.",
        source: 'Rapporté par Muslim',
      },
      { type: 'heading', level: 2, text: 'Les vertus reconnues' },
      {
        type: 'list',
        items: [
          "Le shaytan fuit la maison où elle est récitée.",
          "Elle protège contre la sorcellerie (les sorciers ne peuvent rien contre elle).",
          "Elle intercédera pour son lecteur le Jour du Jugement.",
          "Ayat al-Kursi (verset 255) est le plus grand verset du Coran.",
          "Les deux derniers versets suffisent à quiconque les récite la nuit.",
        ],
      },
      { type: 'heading', level: 2, text: "Comment l'intégrer à votre quotidien" },
      {
        type: 'paragraph',
        text: "Réciter les 286 versets en une seule fois peut sembler difficile. Voici un plan progressif :",
      },
      {
        type: 'list',
        items: [
          "Semaine 1-2 : Récitez 1 page par jour (la sourate fait environ 48 pages).",
          "Semaine 3-4 : Augmentez à 2-3 pages par jour.",
          "Objectif : Terminer la sourate complète en 3 jours.",
          "Alternative : Écoutez la récitation audio chaque jour dans votre maison.",
        ],
        ordered: true,
      },
      {
        type: 'callout',
        variant: 'tip',
        text: "Si vous ne pouvez pas la réciter en entier, les savants recommandent au minimum de réciter les 5 premiers versets, Ayat al-Kursi et les 3 derniers versets chaque jour.",
      },
      { type: 'separator' },
      {
        type: 'paragraph',
        text: "La régularité est plus importante que la quantité. Le Prophète (paix et salut sur lui) aimait les actes réguliers, même s'ils sont modestes. Commencez petit et augmentez progressivement. Votre foyer en ressentira les bienfaits, bi idhnillah.",
      },
    ],
  },

  // 6 -----------------------------------------------------------------------
  {
    id: 'art-sihr-psychologie',
    slug: 'sorcellerie-agit-psychologie',
    title: 'Comment la sorcellerie agit-elle sur la psychologie ?',
    excerpt:
      "Comprendre les mécanismes d'emprise psychologique de la sorcellerie et comment la roqya, associée à un suivi psychologique, permet de s'en libérer.",
    category: 'sihr',
    imageUrl: '/images/articles/sorcellerie-psychologie.png',
    imageGradient: 'bg-gradient-to-br from-purple-700 via-violet-600 to-fuchsia-500',
    author: authorFatima,
    date: '2026-02-20',
    readTime: 11,
    featured: false,
    tags: ['sorcellerie', 'psychologie', 'emprise', 'libération'],
    content: [
      {
        type: 'paragraph',
        text: "La sorcellerie (sihr) est une réalité mentionnée dans le Coran. Au-delà de sa dimension spirituelle, elle produit des effets concrets sur la psychologie de la personne atteinte : anxiété, dépression, confusion mentale, blocages inexpliqués. Comprendre ces mécanismes est essentiel pour une guérison complète.",
      },
      {
        type: 'arabic',
        text: 'وَاتَّبَعُوا مَا تَتْلُو الشَّيَاطِينُ عَلَىٰ مُلْكِ سُلَيْمَانَ',
        translation:
          'Et ils suivirent ce que les démons racontaient contre le règne de Soulayman.',
        source: 'Sourate Al-Baqara, 2:102',
      },
      { type: 'heading', level: 2, text: "Les effets souvent attribués à la sorcellerie" },
      {
        type: 'callout',
        variant: 'warning',
        text: "Attention : les signes ci-dessous proviennent de l'expérience des praticiens de roqya. Ce sont des indications, pas des preuves. Chacun de ces symptômes peut avoir une explication totalement différente : un problème de couple, du stress professionnel, un état dépressif, un traumatisme ancien... Il serait dangereux de tout mettre sur le compte de la sorcellerie sans recul. Ne vous enfermez pas dans cette grille de lecture.",
      },
      {
        type: 'list',
        items: [
          "Changement soudain de sentiments envers le conjoint (attribué au sihr de séparation).",
          "Anxiété et peurs irrationnelles sans cause identifiable.",
          "Cauchemars récurrents (serpents, chiens, chutes, poursuites).",
          "Aversion soudaine pour la prière et la lecture du Coran.",
          "Blocages répétés dans la vie professionnelle ou les projets.",
          "Isolement social progressif et perte de confiance en soi.",
        ],
      },
      {
        type: 'paragraph',
        text: "Tous ces signes méritent d'être pris au sérieux, mais avec discernement. La roqya est bénéfique dans tous les cas, mais il ne faut pas négliger les autres causes possibles ni s'enfermer dans la conviction d'être ensorcelé — car cette conviction elle-même peut devenir un blocage.",
      },
      { type: 'heading', level: 2, text: "L'approche intégrée de guérison" },
      {
        type: 'paragraph',
        text: "Ibn Qayyim al-Jawziyya expliquait que le sihr agit à la fois sur le corps et sur l'esprit. C'est pourquoi la guérison doit être elle aussi globale :",
      },
      {
        type: 'list',
        items: [
          "La roqya shar'iyya pour traiter la cause spirituelle.",
          "L'accompagnement psychologique pour traiter les séquelles émotionnelles.",
          "Le renforcement de la pratique religieuse pour reconstruire l'armure spirituelle.",
          "Le soutien social et familial pour sortir de l'isolement.",
        ],
        ordered: true,
      },
      {
        type: 'callout',
        variant: 'warning',
        text: "Il est strictement interdit de se rendre chez un sorcier pour annuler un sort. Le Prophète (paix et salut sur lui) a dit que celui qui se rend chez un devin et le croit a mécru en ce qui a été révélé à Muhammad.",
      },
      { type: 'separator' },
      {
        type: 'paragraph',
        text: "La patience et la persévérance sont vos meilleures alliées. La guérison du sihr peut prendre du temps, mais avec la confiance en Allah et les moyens légitimes, elle est tout à fait possible.",
      },
    ],
  },

  // 7 -----------------------------------------------------------------------
  {
    id: 'art-signes-guerison',
    slug: '5-signes-voie-guerison',
    title: '5 signes que vous êtes sur la voie de la guérison',
    excerpt:
      "Reconnaître les signes positifs de progrès dans votre parcours de roqya. Des indicateurs concrets qui montrent que vous avancez vers la guérison.",
    category: 'ruqya',
    imageUrl: '/images/articles/signes-guerison.png',
    imageGradient: 'bg-gradient-to-br from-green-500 via-emerald-400 to-lime-300',
    author: authorYoussef,
    date: '2026-02-10',
    readTime: 6,
    featured: false,
    tags: ['guérison', 'signes', 'espoir', 'progrès'],
    content: [
      {
        type: 'paragraph',
        text: "Le parcours de roqya peut sembler long et difficile. Il est facile de se décourager quand on ne voit pas de résultats immédiats. Pourtant, il existe des signes concrets qui indiquent que vous êtes sur la bonne voie. Apprendre à les reconnaître vous aidera à garder espoir et motivation.",
      },
      { type: 'heading', level: 2, text: '1. Le retour du plaisir dans la prière' },
      {
        type: 'paragraph',
        text: "L'un des premiers signes de guérison est la capacité retrouvée à se concentrer dans la prière et à y trouver de la sérénité. Si vous aviez une aversion pour la salat et que celle-ci diminue progressivement, c'est un signe très positif.",
      },
      { type: 'heading', level: 2, text: '2. La diminution des cauchemars' },
      {
        type: 'paragraph',
        text: "Les cauchemars récurrents sont un symptôme courant des maux spirituels. Leur diminution en fréquence et en intensité indique que le mal recule. Vous pouvez aussi commencer à voir des rêves agréables ou des rêves véridiques.",
      },
      { type: 'heading', level: 2, text: '3. Le retour de la motivation' },
      {
        type: 'paragraph',
        text: "La reprise des activités quotidiennes, l'envie de travailler, de sortir, de voir des proches — tout cela montre que la lourdeur se dissipe. L'énergie revient progressivement.",
      },
      { type: 'heading', level: 2, text: '4. Les réactions pendant la roqya changent' },
      {
        type: 'paragraph',
        text: "Au début, la récitation peut provoquer des réactions fortes (pleurs, douleurs, agitation). Avec le temps, ces réactions diminuent. Vous pouvez écouter le Coran avec plus de sérénité, ce qui signifie que le mal s'affaiblit.",
      },
      { type: 'heading', level: 2, text: '5. Un sentiment de paix intérieure' },
      {
        type: 'arabic',
        text: 'أَلَا بِذِكْرِ اللَّهِ تَطْمَئِنُّ الْقُلُوبُ',
        translation: "N'est-ce point par le rappel d'Allah que se tranquillisent les coeurs ?",
        source: "Sourate Ar-Ra'd, 13:28",
      },
      {
        type: 'paragraph',
        text: "Ce sentiment de paix, de tranquillité et de confiance en Allah est le signe le plus profond de la guérison. Vous sentez que votre coeur s'apaise et que votre relation avec Allah se renforce.",
      },
      {
        type: 'callout',
        variant: 'tip',
        text: "La guérison n'est pas toujours linéaire. Il peut y avoir des hauts et des bas. L'essentiel est la tendance générale : si vous progressez globalement, même lentement, vous êtes sur la bonne voie. Faites confiance à Allah.",
      },
    ],
  },

  // 8 -----------------------------------------------------------------------
  {
    id: 'art-eau-coranisee',
    slug: 'eau-coranisee-mode-emploi',
    title: "L'eau coranisée : mode d'emploi complet",
    excerpt:
      "Guide pratique et détaillé pour préparer et utiliser l'eau coranisée, un remède reconnu par les savants de l'islam.",
    category: 'conseils',
    imageUrl: '/images/articles/eau-coranisee.png',
    imageGradient: 'bg-gradient-to-br from-cyan-500 via-blue-400 to-indigo-300',
    author: authorAhmad,
    date: '2026-01-25',
    readTime: 8,
    featured: false,
    tags: ['eau coranisée', 'guide', 'pratique', 'remède'],
    content: [
      {
        type: 'paragraph',
        text: "L'eau coranisée (al-ma' al-maqru' 'alayh) est de l'eau sur laquelle on a récité des versets du Coran. C'est un moyen de guérison reconnu par les savants de l'islam, pratiqué depuis l'époque du Prophète (paix et salut sur lui) et de ses compagnons.",
      },
      { type: 'heading', level: 2, text: "Pas besoin de connaître des dizaines de sourates" },
      {
        type: 'paragraph',
        text: "Comme pour la roqya en général, il ne faut pas se mettre de barrière. Vous n'avez pas besoin de connaître le Coran par cœur pour coraniser votre eau. Sourate Al-Fatiha seule suffit. Et même si vous ne connaissez que Bismillah, dites-le avec conviction sur votre eau — c'est déjà une coranisation. Ce qui compte, c'est la sincérité de votre intention et votre certitude qu'Allah met la guérison dans Ses paroles.",
      },
      {
        type: 'callout',
        variant: 'tip',
        text: "Ce n'est pas réservé à l'eau ! Vous pouvez coraniser de l'huile d'olive et du miel exactement de la même manière. Le Prophète ﷺ a dit que l'huile d'olive provient d'un arbre béni (At-Tirmidhi), et le Coran mentionne que le miel contient une guérison pour les gens (An-Nahl 16:69). Récitez sur votre huile d'olive et votre miel, soufflez dessus, et utilisez-les : en massage, en application, ou en ingestion.",
      },
      { type: 'heading', level: 2, text: 'Comment préparer l\'eau coranisée' },
      {
        type: 'list',
        items: [
          "Prenez une bouteille d'eau propre (de préférence de l'eau de source Zamzam si disponible).",
          "Faites vos ablutions et ayez l'intention sincère de chercher la guérison.",
          "Approchez votre bouche de l'ouverture de la bouteille.",
          "Récitez sourate Al-Fatiha, Ayat al-Kursi, les Mu'awwidhat et les versets de roqya.",
          "Soufflez légèrement dans l'eau après chaque récitation.",
          "Refermez la bouteille. L'eau est prête à être utilisée.",
        ],
        ordered: true,
      },
      { type: 'heading', level: 2, text: "Les modes d'utilisation" },
      {
        type: 'heading',
        level: 3,
        text: 'En boisson',
      },
      {
        type: 'paragraph',
        text: "Buvez de l'eau coranisée régulièrement tout au long de la journée, en particulier à jeun le matin et avant de dormir. Dites « Bismillah » avant chaque gorgée.",
      },
      {
        type: 'heading',
        level: 3,
        text: 'En bain ou aspersion',
      },
      {
        type: 'paragraph',
        text: "Ajoutez de l'eau coranisée à l'eau de votre bain ou aspergez-vous-en après le ghusl.",
      },
      {
        type: 'callout',
        variant: 'info',
        text: "On entend souvent qu'il faut absolument recueillir l'eau usagée et la verser dans un jardin ou au pied d'un arbre. Si cela vous rassure, vous pouvez le faire, mais sachez que ce n'est en aucun cas une obligation — il n'existe aucun texte du Coran ou de la Sunnah qui l'impose. Vous pouvez tout à fait laisser l'eau couler normalement dans l'évacuation, sans aucun problème. Certains disent que ça « dérangerait les djinns dans les canalisations » — mais justement, s'il y a des djinns nuisibles qui reçoivent de l'eau coranisée, c'est plutôt une bonne chose ! Ne vous compliquez pas la vie avec des contraintes qui n'ont pas de fondement textuel. L'objectif est de vous faciliter la pratique, pas de la rendre difficile.",
      },
      {
        type: 'heading',
        level: 3,
        text: 'En vaporisation dans la maison',
      },
      {
        type: 'paragraph',
        text: "Utilisez un vaporisateur pour diffuser l'eau coranisée dans les coins de la maison, en particulier dans les chambres à coucher.",
      },
      {
        type: 'callout',
        variant: 'tip',
        text: "Vous pouvez multiplier votre eau coranisée en ajoutant de l'eau ordinaire à votre reste d'eau coranisée. Certains savants considèrent que la baraka se transmet. Renouvelez la récitation régulièrement.",
      },
      { type: 'separator' },
      {
        type: 'callout',
        variant: 'warning',
        text: "L'eau coranisée est un moyen spirituel reconnu en islam. Si vous avez des préoccupations de santé, n'hésitez pas à combiner les moyens spirituels avec les autres moyens qu'Allah a mis à notre disposition.",
      },
    ],
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // ARTICLE 9 — Le djinn amoureux : mythe ou réalité ?
  // ═══════════════════════════════════════════════════════════════════════════

  // ═══════════════════════════════════════════════════════════════════════════
  // ARTICLE 9 — Le Tqaf (blocage intime)
  // ═══════════════════════════════════════════════════════════════════════════

  {
    id: 'art-tqaf-vaginisme',
    slug: 'tqaf-blocage-intime-vaginisme',
    title: 'Le Tqaf et les blocages intimes : entre sorcellerie et vaginisme',
    excerpt:
      "Le Tqaf est l'un des motifs de consultation les plus fréquents en roqya. Mais derrière ce diagnostic se cache souvent un phénomène psychologique bien connu : le vaginisme. Analyse et solutions.",
    category: 'psycho-roqya',
    imageUrl: '/images/articles/tqaf-blocage-intime.jpg',
    imageGradient: 'bg-gradient-to-br from-rose-600 via-pink-500 to-fuchsia-400',
    author: authorYoussef,
    date: '2026-03-24',
    readTime: 11,
    featured: false,
    tags: ['tqaf', 'vaginisme', 'blocage intime', 'couple', 'psycho-roqya', 'sorcellerie'],
    content: [
      {
        type: 'paragraph',
        text: "Parmi les motifs de consultation les plus fréquents en roqya, le blocage physique de la femme lors des rapports intimes occupe une place importante. Dans la culture maghrébine, on appelle ce phénomène le Tqaf (التقاف) au Maroc — qui signifie « la fermeture, le cadenas » — le Rbat (الربط, « l'action d'attacher ») en Algérie, ou encore le Teskar en Tunisie. Beaucoup de couples arrivent désespérés, convaincus d'être victimes de sorcellerie.",
      },
      { type: 'heading', level: 2, text: 'Le rituel traditionnel du Tqaf' },
      {
        type: 'paragraph',
        text: "Le Tqaf est une pratique qui était très répandue au Maghreb. Elle consiste à « nouer » la sexualité d'une personne, soit dans l'intention de préserver la virginité d'une fille jusqu'au mariage, soit dans l'intention de nuire (empêcher les rapports conjugaux). Le rituel implique souvent un cadenas que l'on place sous la mariée, qu'on lui fait enjamber, ou des nœuds que l'on fait dans un tissu lors de la cérémonie.",
      },
      {
        type: 'paragraph',
        text: "Quand la nuit de noces se passe mal — quand la pénétration est impossible — le diagnostic tombe immédiatement : « On t'a fait le Tqaf. » Et c'est là que commence un long parcours de souffrance, de consultations chez des raqi, parfois chez des charlatans, et d'un sentiment d'impuissance totale.",
      },
      { type: 'heading', level: 2, text: 'Comprendre le vaginisme' },
      {
        type: 'paragraph',
        text: "Ce que vivent ces femmes a un nom : le vaginisme. C'est une contraction involontaire des muscles du plancher pelvien qui rend la pénétration difficile, douloureuse, voire impossible. Ce n'est ni rare, ni honteux, ni une fatalité — et surtout, on peut s'en libérer.",
      },
      {
        type: 'paragraph',
        text: "Les causes sont le plus souvent psychologiques : la peur de la douleur, une anxiété profonde liée à l'intimité, une éducation très stricte autour de la virginité (« ferme tes cuisses », « ne te touche pas »), des traumatismes passés, ou simplement un manque total d'information sur le fonctionnement du corps.",
      },
      {
        type: 'callout',
        variant: 'info',
        text: "Le vaginisme est un phénomène psychologique qui touche des femmes de toutes les cultures et de toutes les religions — pas seulement celles à qui on a « fait le Tqaf ».",
      },
      { type: 'heading', level: 2, text: 'Le piège du diagnostic « sorcellerie »' },
      {
        type: 'paragraph',
        text: "Quand on dit à une femme « tu es bloquée parce qu'on t'a fait de la sorcellerie », on lui envoie un message terrible : tu es victime, tu n'as aucun contrôle sur ton propre corps, c'est une force extérieure qui décide. Ce diagnostic — souvent posé sans aucune preuve — plonge la personne dans un état de désespoir, de peur et d'impuissance qui aggrave considérablement le blocage.",
      },
      {
        type: 'paragraph',
        text: "C'est un cercle vicieux : plus elle a peur, plus le corps se contracte, plus elle est convaincue que « c'est la sorcellerie qui est trop forte ». Et c'est là que réside le vrai danger — pas dans l'éventuelle sorcellerie, mais dans l'état psychologique dans lequel on enferme la personne en lui collant ce diagnostic.",
      },
      {
        type: 'callout',
        variant: 'warning',
        text: "Le désespoir et la conviction d'être « ensorcelée sans remède » sont souvent plus destructeurs que le blocage lui-même. Ne laissez personne vous enfermer dans cette impasse.",
      },
      { type: 'heading', level: 2, text: 'Notre approche : spirituelle, psychologique ET intime' },
      {
        type: 'paragraph',
        text: "Peut-il y avoir une influence du monde invisible ? Oui, on ne le nie pas. Mais même dans ce cas, la solution passe par un travail global sur trois dimensions :",
      },
      { type: 'heading', level: 3, text: 'Sur le plan spirituel' },
      {
        type: 'paragraph',
        text: "La récitation du Coran, les douas de protection, la roqya shar'iyya — cela traite toute forme d'atteinte, qu'elle soit nommée ou non. Pas besoin de savoir si c'est « un cadenas » ou autre chose : le Coran agit sur tout, bi idhnillah. Les versets contre la sorcellerie (sourate Al-Baqara, Al-A'raf 7:117-122, Yunus 10:81-82, Ta-Ha 20:69) sont particulièrement recommandés.",
      },
      { type: 'heading', level: 3, text: 'Sur le plan psychologique' },
      {
        type: 'paragraph',
        text: "Il faut déconstruire la peur. La femme doit comprendre que son corps lui appartient, que cette contraction est un mécanisme de protection naturel — pas une malédiction. Avec le bon accompagnement, elle peut apprendre à relâcher cette tension progressivement. La Psycho-Roqya permet d'identifier les croyances limitantes, les peurs profondes et les blocages émotionnels qui maintiennent le vaginisme en place.",
      },
      { type: 'heading', level: 3, text: 'Sur le plan intime — le rôle essentiel du mari' },
      {
        type: 'paragraph',
        text: "Et c'est peut-être le point le plus important, même si c'est un sujet délicat. Le rôle du mari est absolument central dans la guérison. La femme ne peut pas y arriver seule — elle a besoin d'un partenaire qui comprend, qui accompagne, et qui fait preuve de patience.",
      },
      {
        type: 'paragraph',
        text: "Concrètement, cela veut dire :",
      },
      {
        type: 'list',
        items: [
          "Communiquer ouvertement — briser le tabou du silence entre les époux sur ce sujet",
          "Y aller très progressivement, sans aucune pression, sans ultimatum, sans reproche",
          "Ne pas se focaliser sur la pénétration — privilégier la complicité, la tendresse, le bien-être mutuel",
          "Comprendre que la guérison peut prendre du temps — des semaines, parfois des mois — et que c'est normal",
          "Célébrer chaque petit progrès comme une victoire",
          "Être un allié et un accompagnateur, pas une source de stress supplémentaire",
          "Si nécessaire, se faire accompagner ensemble par un spécialiste bienveillant — il n'y a aucune honte à cela",
        ],
      },
      {
        type: 'callout',
        variant: 'tip',
        text: "Le Prophète ﷺ était le plus doux et le plus attentionné des époux. La tendresse et la patience ne sont pas des faiblesses — ce sont des qualités prophétiques. Le mari qui accompagne sa femme avec bienveillance dans cette épreuve est sur un chemin noble.",
      },
      { type: 'separator' },
      {
        type: 'paragraph',
        text: "Ce n'est peut-être pas le sujet le plus confortable à aborder, mais c'est en brisant ce tabou qu'on libère les couples. Des centaines de femmes ont surmonté ce blocage — par la roqya, par le travail psychologique, et par l'accompagnement bienveillant de leur époux. Vous n'êtes pas une exception, et ce n'est pas une fatalité. Qu'Allah vous accorde la guérison et l'épanouissement dans votre couple.",
      },
    ],
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // ARTICLE 10 — Le djinn amoureux : mythe ou réalité ?
  // ═══════════════════════════════════════════════════════════════════════════

  {
    id: 'art-djinn-amoureux',
    slug: 'djinn-amoureux-mythe-ou-realite',
    title: 'Le djinn amoureux : mythe ou réalité ?',
    excerpt:
      "On en parle beaucoup dans les milieux de la roqya, mais qu'en disent réellement les textes ? Analyse critique d'un phénomène sans fondement théologique solide.",
    category: 'mass',
    imageUrl: '/images/articles/djinn-amoureux.png',
    imageGradient: 'bg-gradient-to-br from-indigo-700 via-purple-600 to-violet-500',
    author: authorYoussef,
    date: '2026-03-25',
    readTime: 12,
    featured: true,
    tags: ['djinn amoureux', 'mass', 'analyse', 'théologie', 'psychologie', 'mythes'],
    content: [
      {
        type: 'paragraph',
        text: "Le « djinn amoureux » (al-'âshiq) est devenu l'un des diagnostics les plus répandus dans les cercles de roqya. On en parle sur les réseaux sociaux, dans les consultations, dans les livres modernes sur le sujet. Pourtant, quand on revient aux sources fondamentales de l'islam — le Coran et la Sunnah authentique — on ne trouve aucun texte qui vient confirmer l'existence de ce phénomène tel qu'il est décrit aujourd'hui.",
      },
      { type: 'heading', level: 2, text: 'Ce que disent réellement les textes' },
      {
        type: 'paragraph',
        text: "Soyons clairs dès le départ : les djinns existent, c'est une croyance fondamentale en islam. Le Coran leur consacre une sourate entière (sourate Al-Jinn). Leur capacité à voir les humains sans être vus est confirmée par le Coran :",
      },
      {
        type: 'arabic',
        text: 'إِنَّهُ يَرَاكُمْ هُوَ وَقَبِيلُهُ مِنْ حَيْثُ لَا تَرَوْنَهُمْ',
        translation: 'Il vous voit, lui et sa tribu, d\'où vous ne les voyez pas.',
        source: 'Sourate Al-A\'raf, 7:27',
      },
      {
        type: 'paragraph',
        text: "L'influence des djinns sur l'être humain est également attestée — le waswas (chuchotements), le mass (toucher/atteinte) sont des réalités coraniques. Mais le concept spécifique d'un djinn qui « tombe amoureux » d'un humain, qui s'attache à lui de façon romantique et qui provoque des symptômes très précis ? Cela ne repose sur aucun verset coranique, aucun hadith authentique (sahih), aucune parole des Compagnons.",
      },
      { type: 'heading', level: 2, text: 'D\'où vient ce concept alors ?' },
      {
        type: 'paragraph',
        text: "Le concept du djinn amoureux s'est construit au fil des siècles, d'histoire en histoire, de récit en récit. Il provient essentiellement de :",
      },
      {
        type: 'list',
        items: [
          "Récits populaires et folklore transmis oralement dans certaines cultures musulmanes",
          "Constats de praticiens de roqya qui ont interprété certains symptômes selon cette grille de lecture",
          "Livres modernes sur la roqya qui ont systématisé ce « diagnostic » sans toujours revenir aux textes fondateurs",
          "L'influence de traditions pré-islamiques et de croyances locales qui se sont mélangées avec l'islam au fil du temps",
        ],
      },
      {
        type: 'callout',
        variant: 'info',
        text: "Ce n'est pas parce qu'un phénomène est répandu dans les milieux de la roqya qu'il est automatiquement fondé théologiquement. La popularité d'une idée ne la rend pas authentique.",
      },
      { type: 'heading', level: 2, text: 'Les symptômes attribués : une autre explication' },
      {
        type: 'paragraph',
        text: "Les symptômes généralement attribués au « djinn amoureux » — rêves érotiques, blocages affectifs, difficultés à se marier, aversion pour le conjoint, troubles intimes — sont réels et la personne qui les vit souffre véritablement. Personne ne remet cela en question. Mais ces symptômes ont très souvent des explications psychologiques, physiologiques, ou liées au mode de vie :",
      },
      {
        type: 'list',
        items: [
          "Les rêves érotiques sont un phénomène physiologique naturel naturel et mentionné dans les hadiths sans aucun lien avec les djinns",
          "Les blocages affectifs et l'incapacité à s'engager relèvent souvent de blessures émotionnelles, de traumatismes passés ou de peurs inconscientes",
          "L'aversion pour le conjoint peut être liée à des problèmes relationnels non résolus, du stress, ou de la sorcellerie (sihr at-tafriq) — qui elle, est mentionnée dans le Coran",
          "Les troubles intimes ont très souvent une composante psychologique : anxiété de performance, stress, traumatismes",
          "Le fait de ne pas réussir à se marier peut s'expliquer par du mauvais œil, de la sorcellerie, ou tout simplement par le qadar d'Allah et des circonstances de vie",
        ],
      },
      { type: 'heading', level: 2, text: 'Le danger des théories sans textes' },
      {
        type: 'paragraph',
        text: "Bâtir des théories sur de simples suspicions ou des constats personnels, sans les ancrer dans un texte clair du Coran ou de la Sunnah, est une démarche dangereuse en islam. Le Prophète ﷺ nous a mis en garde contre le fait de parler du monde invisible (al-ghayb) sans science :",
      },
      {
        type: 'arabic',
        text: 'قُلْ إِنَّمَا حَرَّمَ رَبِّيَ الْفَوَاحِشَ مَا ظَهَرَ مِنْهَا وَمَا بَطَنَ وَالْإِثْمَ وَالْبَغْيَ بِغَيْرِ الْحَقِّ وَأَن تُشْرِكُوا بِاللَّهِ مَا لَمْ يُنَزِّلْ بِهِ سُلْطَانًا وَأَن تَقُولُوا عَلَى اللَّهِ مَا لَا تَعْلَمُونَ',
        translation: 'Dis : Mon Seigneur n\'a interdit que les turpitudes, apparentes ou cachées, le péché, la transgression sans droit, d\'associer à Allah ce pour quoi Il n\'a fait descendre aucune autorité, et de dire sur Allah ce que vous ne savez pas.',
        source: 'Sourate Al-A\'raf, 7:33',
      },
      {
        type: 'paragraph',
        text: "Dire « ce djinn est amoureux de toi » à une personne vulnérable, sans aucune preuve textuelle, peut avoir des conséquences graves : cela renforce l'anxiété, crée une dépendance au praticien, empêche la personne de chercher les vraies causes de ses problèmes (psychologiques ou relationnelles), et peut même la détourner de solutions concrètes.",
      },
      { type: 'heading', level: 2, text: 'Ce qu\'il faut croire et ce qu\'il faut nuancer' },
      {
        type: 'paragraph',
        text: "Pour résumer avec équilibre :",
      },
      {
        type: 'list',
        items: [
          "✅ Les djinns existent — c'est une croyance obligatoire en islam (Coran, Sunnah)",
          "✅ Les djinns peuvent influencer l'être humain — waswas, mass, possession (textes authentiques)",
          "✅ La sorcellerie (sihr) peut causer des blocages conjugaux, de l'aversion, de l'impuissance — le Coran le mentionne explicitement (Al-Baqara, 2:102)",
          "✅ Le mauvais œil ('ayn) est une réalité — « Le mauvais œil est une réalité » (Sahih Muslim)",
          "⚠️ Le concept de « djinn amoureux » tel qu'il est popularisé n'a aucun texte authentique pour le soutenir",
          "⚠️ Les symptômes attribués à ce phénomène ont souvent des explications psychologiques ou physiologiques naturelles",
          "⚠️ Bâtir un diagnostic sur des suppositions sans texte est contraire à la méthodologie islamique",
        ],
      },
      { type: 'separator' },
      { type: 'heading', level: 2, text: 'Notre approche : la Psycho-Roqya' },
      {
        type: 'paragraph',
        text: "C'est exactement pour cette raison que nous avons développé l'approche Psycho-Roqya. Plutôt que de coller des étiquettes invérifiables sur des souffrances bien réelles, nous préférons :",
      },
      {
        type: 'list',
        items: [
          "Réciter le Coran selon la Sunnah — cela suffit à traiter toute forme d'atteinte occulte, qu'on puisse la nommer précisément ou non",
          "Identifier les causes psychologiques et émotionnelles des blocages — car c'est souvent là que se trouve la clé",
          "Donner à la personne des outils concrets pour se libérer — plutôt que de la rendre dépendante d'un diagnostic effrayant",
          "Rester honnête intellectuellement — on ne dit pas ce qu'on ne sait pas, et on ne prétend pas connaître le ghayb",
        ],
      },
      {
        type: 'callout',
        variant: 'tip',
        text: "La guérison ne nécessite pas de connaître le nom exact de ce qui vous atteint. Récitez le Coran avec conviction, travaillez sur votre psychologie, et faites confiance à Allah. C'est la méthode du Prophète ﷺ, et elle suffit amplement.",
      },
      { type: 'separator' },
      {
        type: 'paragraph',
        text: "En conclusion, ne laissez personne vous effrayer avec des diagnostics qui n'ont aucune base textuelle. Votre souffrance est réelle, mais les réponses se trouvent dans le Coran, la Sunnah authentique, et un travail sincère sur vous-même — pas dans des théories bâties sur des suppositions. Qu'Allah vous guide et vous accorde la guérison.",
      },
    ],
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // ARTICLE 11 — Le henné spontané sur les mains et les pieds
  // ═══════════════════════════════════════════════════════════════════════════

  {
    id: 'art-henne-spontane',
    slug: 'henne-spontane-mains-pieds-mythe',
    title: 'Du henné apparaît sur vos mains ou vos pieds ? Pas de panique.',
    excerpt:
      "Beaucoup paniquent en voyant des taches de henné apparaître sur leurs mains ou pieds. Djinn amoureux, mariage invisible, ange... Les théories circulent. Voici la réalité.",
    category: 'psycho-roqya',
    imageUrl: '/images/articles/henne-spontane.png',
    imageGradient: 'bg-gradient-to-br from-orange-400 via-amber-300 to-yellow-200',
    author: authorYoussef,
    date: '2026-03-26',
    readTime: 7,
    featured: false,
    tags: ['henné', 'mythes', 'djinn', 'dermatologie', 'panique', 'psycho-roqya'],
    content: [
      {
        type: 'paragraph',
        text: "Vous vous réveillez un matin et vous remarquez des taches orangées, rougeâtres sur vos mains ou vos pieds — comme du henné. Parfois c'est sur les paumes, parfois sur la plante des pieds, et ça peut même apparaître avec des couleurs assez vives. Et le plus déstabilisant : il arrive même qu'il y ait l'odeur du henné. Là, forcément, c'est encore plus effrayant. Vous n'avez rien appliqué, et pourtant ça sent le henné. Vous allez sur Google. Et là, c'est la catastrophe : « djinn amoureux qui vous a marié », « un jinn qui a mis du henné sur vous la nuit », « c'est un signe de possession »... Certains vont même jusqu'à dire que c'est un ange. On trouve de tout sur internet, et malheureusement, ces théories plongent des gens dans une panique totale.",
      },
      {
        type: 'callout',
        variant: 'warning',
        text: "Arrêtez. Respirez. Ce phénomène n'est pas une preuve de quoi que ce soit de surnaturel. Il n'existe aucun texte — ni dans le Coran, ni dans la Sunnah — qui parle de henné posé par des djinns ou des anges sur les mains d'un être humain. Zéro. Rien. Nada.",
      },
      { type: 'heading', level: 2, text: 'Ce que c\'est vraiment' },
      {
        type: 'paragraph',
        text: "Ces taches qui ressemblent à du henné ont des explications tout à fait banales. En dermatologie, plusieurs phénomènes peuvent provoquer des colorations orangées ou brunâtres sur la peau :",
      },
      {
        type: 'list',
        items: [
          "Réactions allergiques — certains produits, aliments ou contacts peuvent provoquer des colorations cutanées temporaires",
          "Caroténodermie — une consommation excessive de carottes, patates douces ou certains fruits peut colorer la peau en orange, surtout les paumes et les plantes des pieds",
          "Dermatite de contact — le contact avec certaines plantes, épices (curcuma, safran) ou produits chimiques peut laisser des traces",
          "Hyperpigmentation — certaines zones de la peau peuvent se colorer naturellement suite à des frottements, de la transpiration ou des changements hormonaux",
          "Champignons cutanés — certaines mycoses provoquent des colorations brunâtres sur les extrémités",
        ],
      },
      { type: 'heading', level: 3, text: "Et l'odeur de henné alors ?" },
      {
        type: 'paragraph',
        text: "C'est souvent ce qui fait basculer les gens dans la panique : « il y a même l'odeur ! ». Mais là encore, c'est explicable. Certaines réactions cutanées, notamment les mycoses ou les dermatites, produisent des odeurs particulières que le cerveau peut associer à du henné — surtout quand on est déjà en état d'alerte et qu'on cherche des confirmations. La transpiration des paumes et des pieds, combinée à certains aliments ou produits, peut aussi produire des odeurs inhabituelles. Ce n'est pas agréable, mais ce n'est pas surnaturel.",
      },
      {
        type: 'paragraph',
        text: "Ce sont des phénomènes courants et qui n'ont absolument rien à voir avec le monde invisible.",
      },
      { type: 'heading', level: 2, text: 'Témoignage personnel' },
      {
        type: 'quote',
        text: "Ça m'est arrivé personnellement — deux fois. Une fois sur la main, une fois sur le pied. Des taches qui ressemblaient exactement à du henné. C'était il y a des années. Je n'ai jamais eu de djinn, pas de possession, pas de « mariage invisible ». Absolument rien de surnaturel. Alhamdoulillah, tout va bien. Si j'avais écouté les théories d'internet, j'aurais paniqué pour rien et peut-être gâché des mois de ma vie dans l'angoisse.",
      },
      { type: 'heading', level: 2, text: 'Pourquoi ces théories sont dangereuses' },
      {
        type: 'paragraph',
        text: "Le problème n'est pas le henné en lui-même — c'est la panique que ces théories provoquent. Quand quelqu'un est convaincu qu'un djinn l'a « marié » pendant la nuit, voici ce qui se passe :",
      },
      {
        type: 'list',
        items: [
          "L'anxiété explose — la personne vit dans la peur permanente",
          "Elle commence à interpréter chaque petit événement comme un « signe » supplémentaire",
          "Elle dépense de l'argent chez des gens qui profitent de sa peur",
          "Elle néglige les causes réelles (allergie, dermatologie) parce qu'elle est focalisée sur le surnaturel",
          "Son état psychologique se dégrade, ce qui peut créer de vrais symptômes psychosomatiques — et le cercle vicieux s'installe",
        ],
      },
      {
        type: 'callout',
        variant: 'info',
        text: "Rappel : Google n'est pas un savant. Les forums ne sont pas des sources de science islamique. Quand vous cherchez « henné mains islam djinn » sur internet, vous tombez sur les théories les plus alarmistes parce que ce sont celles qui génèrent le plus de clics. Ce n'est pas de la science, c'est du sensationnalisme.",
      },
      { type: 'heading', level: 2, text: 'La bonne attitude à avoir' },
      {
        type: 'list',
        items: [
          "Ne paniquez pas — c'est la règle numéro un",
          "Observez si les taches reviennent et dans quelles circonstances (après avoir mangé quelque chose, touché un produit, porté certaines chaussures...)",
          "Si ça persiste ou vous inquiète, consultez un dermatologue — il y a probablement une explication simple",
          "Faites vos adhkar quotidiens et votre roqya comme d'habitude — c'est bénéfique dans tous les cas, que vous soyez atteint de quelque chose ou non",
          "Ne laissez personne vous diagnostiquer un « djinn amoureux » ou un « mariage invisible » sur la base de taches sur vos mains — c'est irresponsable",
        ],
      },
      { type: 'separator' },
      {
        type: 'paragraph',
        text: "En résumé : oui, les djinns existent. Oui, les atteintes occultes existent. Mais tout n'est pas un signe de possession ou de sorcellerie. Parfois, du henné sur vos mains, c'est juste... du henné. Ou une réaction cutanée. Et c'est tout. Ne vous compliquez pas la vie avec des théories sans fondement textuel. Faites confiance à Allah, gardez vos adhkar, et vivez sereinement. Qu'Allah vous préserve.",
      },
    ],
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // ARTICLE 12 — Comment reconnaître les signes de la sorcellerie
  // ═══════════════════════════════════════════════════════════════════════════

  {
    id: 'art-signes-sorcellerie',
    slug: 'reconnaitre-signes-sorcellerie',
    title: 'Comment reconnaître les signes de la sorcellerie (sihr)',
    excerpt:
      "Les signes souvent associés à la sorcellerie dans les milieux de la roqya. Ce qu'il faut savoir, ce qu'il faut nuancer, et pourquoi il ne faut surtout pas s'enfermer dans un diagnostic.",
    category: 'sihr',
    imageUrl: '/images/articles/signes-sorcellerie.jpg',
    imageGradient: 'bg-gradient-to-br from-purple-700 via-violet-600 to-fuchsia-500',
    author: authorYoussef,
    date: '2026-03-23',
    readTime: 10,
    featured: false,
    tags: ['sorcellerie', 'sihr', 'signes', 'symptômes', 'discernement'],
    content: [
      {
        type: 'paragraph',
        text: "La sorcellerie (sihr) est une réalité mentionnée dans le Coran. Allah dit dans Sourate Al-Baqara qu'ils apprenaient ce qui sépare l'homme de son épouse (2:102). Le Prophète ﷺ lui-même a été atteint de sorcellerie, comme rapporté dans les hadiths authentiques (Bukhari, Muslim). Ce n'est donc pas un mythe — c'est une réalité de notre croyance.",
      },
      {
        type: 'paragraph',
        text: "Ceci étant dit, internet regorge de listes de « signes de sorcellerie » qui font peur à tout le monde et poussent des gens à croire qu'ils sont ensorcelés alors que ce n'est peut-être pas du tout le cas. Voici ce qu'on lit souvent, avec le recul nécessaire.",
      },
      {
        type: 'callout',
        variant: 'warning',
        text: "Avant de lire cette liste, gravez ceci dans votre esprit : ces signes sont issus de l'expérience de ceux qui pratiquent la roqya, pas de textes coraniques ou prophétiques qui les listeraient comme preuves de sorcellerie. Ce sont des hypothèses qui orientent, rien de plus. Chacun de ces signes peut avoir une explication parfaitement naturelle. Ne vous diagnostiquez pas tout seul et ne laissez personne vous enfermer dans la conviction d'être ensorcelé.",
      },
      { type: 'heading', level: 2, text: 'Les signes souvent cités sur internet' },
      { type: 'heading', level: 3, text: 'Blocages répétés dans la vie' },
      {
        type: 'paragraph',
        text: "C'est probablement le signe le plus cité : des échecs à répétition dans le travail, les projets, le mariage, les finances — malgré tous les efforts. On a l'impression que tout est bloqué, que rien n'avance, que chaque porte se ferme.",
      },
      {
        type: 'paragraph',
        text: "Mais soyons honnêtes : les blocages dans la vie, ça arrive à beaucoup de monde — croyants ou non, « ensorcelés » ou non. Ça peut être lié au qadar d'Allah, à un manque de compétences, à un mauvais timing, à de la procrastination, à des peurs inconscientes, ou simplement aux aléas de la vie. Ce n'est pas parce que ça ne marche pas que c'est forcément de la sorcellerie.",
      },
      { type: 'heading', level: 3, text: 'Problèmes conjugaux soudains' },
      {
        type: 'paragraph',
        text: "Un changement brutal de sentiments entre les époux — l'amour qui se transforme en haine du jour au lendemain, des disputes permanentes, une aversion physique pour le conjoint. C'est ce qu'on appelle le sihr at-tafriq (sorcellerie de séparation), qui est effectivement mentionné dans le Coran (Al-Baqara, 2:102).",
      },
      {
        type: 'paragraph',
        text: "Cependant, les problèmes de couple ont mille et une causes : communication défaillante, attentes irréalistes, blessures accumulées, manque d'investissement, routine, stress externe... Avant de penser à la sorcellerie, posez-vous la question : est-ce qu'on a vraiment essayé de travailler sur notre couple ?",
      },
      { type: 'heading', level: 3, text: 'Cauchemars récurrents' },
      {
        type: 'paragraph',
        text: "Des cauchemars avec des serpents, des chiens, des chutes, des poursuites, des cimetières, la mer — c'est un classique des listes de symptômes de sorcellerie sur internet.",
      },
      {
        type: 'paragraph',
        text: "La réalité : les cauchemars sont extrêmement courants. Le stress, l'anxiété, un repas lourd avant de dormir, un film regardé le soir, des pensées négatives avant le coucher — tout cela provoque des cauchemars. Rêver de serpents ne veut pas dire que vous êtes ensorcelé. Des millions de personnes rêvent de serpents sans avoir la moindre sorcellerie.",
      },
      { type: 'heading', level: 3, text: "Aversion pour la prière et le Coran" },
      {
        type: 'paragraph',
        text: "Ne plus avoir envie de prier, ressentir une lourdeur au moment de faire ses ablutions, ne pas supporter l'écoute du Coran — c'est un signe souvent associé à une atteinte occulte.",
      },
      {
        type: 'paragraph',
        text: "Mais la baisse de motivation spirituelle touche énormément de musulmans à un moment ou un autre de leur vie. La dépression, le burn-out, une épreuve difficile, un péché qui pèse sur le cœur, la routine — tout cela peut éloigner de la prière. Ce n'est pas toujours le signe d'une sorcellerie. Parfois, c'est juste un passage difficile qu'il faut traverser avec patience.",
      },
      { type: 'heading', level: 3, text: "Douleurs physiques migrantes" },
      {
        type: 'paragraph',
        text: "Des douleurs qui changent d'endroit dans le corps, qui n'ont pas de localisation fixe — aujourd'hui la tête, demain l'estomac, après-demain les jambes.",
      },
      {
        type: 'paragraph',
        text: "Là encore, les douleurs migrantes sont un phénomène connu en psychologie : le stress chronique, l'anxiété, la somatisation produisent exactement ce type de symptômes. Le corps exprime ce que l'esprit n'arrive pas à dire.",
      },
      { type: 'heading', level: 3, text: "Réaction à l'écoute du Coran" },
      {
        type: 'paragraph',
        text: "Pleurer, trembler, ressentir des douleurs, bâiller beaucoup ou s'endormir pendant l'écoute du Coran — c'est souvent présenté comme un signe d'atteinte.",
      },
      {
        type: 'paragraph',
        text: "Mais pleurer en écoutant le Coran, c'est aussi le signe d'un cœur sensible. Bâiller peut être lié à la fatigue ou à la relaxation. S'endormir peut être lié au manque de sommeil. Ce ne sont pas automatiquement des preuves de sorcellerie.",
      },
      { type: 'separator' },
      { type: 'heading', level: 2, text: "Et si c'est vraiment de la sorcellerie ?" },
      {
        type: 'paragraph',
        text: "Maintenant, soyons clairs : oui, ça peut être de la sorcellerie. On ne l'exclut pas. Mais même si c'est le cas — et c'est ça le point crucial à comprendre — ce n'est pas une fatalité. Ce n'est pas insurmontable. Ce n'est pas la fin.",
      },
      {
        type: 'paragraph',
        text: "Allah est infiniment plus puissant que toute sorcellerie. Toute la sorcellerie du monde ne peut rien face à la volonté d'Allah. Et le Coran est clair là-dessus : les sorciers ne réussissent pas (Ta-Ha, 20:69). Croire que la sorcellerie est une force invincible, que si on est atteint « c'est fini », que c'est trop puissant pour être défait — cette croyance-là est plus grave et plus destructrice que la sorcellerie elle-même.",
      },
      {
        type: 'callout',
        variant: 'warning',
        text: "La peur de la sorcellerie fait souvent plus de dégâts que la sorcellerie elle-même. C'est exactement l'objectif de ceux qui la pratiquent : vous intimider, vous paralyser, vous faire croire que vous êtes impuissant. Ne leur donnez pas cette victoire.",
      },
      {
        type: 'paragraph',
        text: "C'est pour ça que notre démarche en Psycho-Roqya ne consiste pas à donner de la force à la sorcellerie en en parlant constamment et en la présentant comme un monstre invincible. Au contraire : on déconstruit la peur, on casse l'intimidation, on refuse de laisser de la place à l'influence psychologique qu'exercent ces pratiques. Parce que c'est exactement comme ça qu'elles fonctionnent : par l'intimidation et la peur. Et quand vous retirez la peur, vous retirez leur arme principale.",
      },
      {
        type: 'paragraph',
        text: "Même si c'est réellement de la sorcellerie : Allah est plus grand. Le Coran est plus puissant. Votre certitude en Allah est plus forte que n'importe quel sort. En dédramatisant, en déconstruisant les croyances négatives, en refusant de se laisser intimider — vous paralysez les armes que les sorciers utilisent pour atteindre les gens. C'est un état d'esprit à adopter, et c'est en soi un acte de guérison.",
      },
      { type: 'heading', level: 2, text: "Concrètement, que faire ?" },
      {
        type: 'list',
        items: [
          "Faire sa roqya régulièrement — c'est bénéfique dans TOUS les cas, qu'on soit atteint ou non. C'est du Coran, ça ne fait que du bien",
          "Ne pas s'auto-diagnostiquer — cocher des cases sur internet n'est pas un diagnostic",
          "Refuser la peur — la panique est l'arme numéro un de la sorcellerie. Ne lui donnez pas ce pouvoir",
          "Travailler sur soi — beaucoup de « symptômes de sorcellerie » disparaissent quand on travaille sur sa psychologie, son mode de vie et sa spiritualité",
          "Renforcer sa certitude en Allah — c'est Lui le Guérisseur, et rien ne se passe sans Sa permission. Aucun sort ne peut résister à Sa volonté",
        ],
      },
      {
        type: 'callout',
        variant: 'tip',
        text: "La meilleure protection, c'est la constance dans les adhkar quotidiens, la lecture régulière du Coran et une relation sincère avec Allah. Pas besoin d'être un expert en sorcellerie pour se protéger — il suffit d'être un serviteur sincère d'Allah. Et surtout : ne laissez jamais la peur prendre le dessus. C'est exactement ce que le shaytane veut.",
      },
      { type: 'separator' },
      {
        type: 'paragraph',
        text: "En résumé : oui, la sorcellerie existe et oui, ça peut être votre cas. Mais ce n'est ni une fatalité, ni une force invincible. Allah est plus grand. Le Coran est la parole d'Allah. Votre certitude est votre bouclier. Ne donnez pas à la sorcellerie une place qu'elle ne mérite pas dans votre esprit. Faites votre roqya, travaillez sur vous-même, refusez l'intimidation, et remettez votre affaire entre les mains d'Allah. C'est ça, la vraie force. Qu'Allah vous préserve et vous protège.",
      },
    ],
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // ARTICLE 13 — Comment reconnaître les signes de la possession (mass)
  // ═══════════════════════════════════════════════════════════════════════════

  {
    id: 'art-signes-possession',
    slug: 'reconnaitre-signes-possession',
    title: 'Comment reconnaître les signes de la possession (mass)',
    excerpt:
      "La possession est souvent dramatisée. Comprendre ce que c'est vraiment, pourquoi c'est avant tout une manipulation psychologique, et comment s'en libérer avec discernement.",
    category: 'mass',
    imageUrl: '/images/articles/signes-possession.jpeg',
    imageGradient: 'bg-gradient-to-br from-slate-700 via-gray-600 to-zinc-500',
    author: authorYoussef,
    date: '2026-03-22',
    readTime: 12,
    featured: false,
    tags: ['possession', 'mass', 'djinn', 'manipulation', 'psychologie', 'discernement'],
    content: [
      {
        type: 'paragraph',
        text: "La possession par les djinns (al-mass) est un sujet qui fait peur. Les vidéos qui circulent sur internet montrent des scènes spectaculaires — des gens qui crient, qui se tordent, qui parlent avec une autre voix. Et naturellement, beaucoup de musulmans se demandent : « est-ce que ça pourrait m'arriver ? est-ce que je suis possédé ? ». Déconstruisons tout ça avec calme et discernement.",
      },
      { type: 'heading', level: 2, text: "Ce que disent les textes" },
      {
        type: 'paragraph',
        text: "Le Coran mentionne le fait que les djinns peuvent avoir une influence sur l'être humain. Allah dit dans Sourate Al-Baqara (2:275) que ceux qui consomment l'intérêt usuraire se lèvent comme se lève celui que le toucher (mass) du Shaytan a frappé. Les savants ont divergé sur l'interprétation de ce verset — certains y voient une preuve de la possession physique, d'autres considèrent qu'il s'agit d'une métaphore.",
      },
      {
        type: 'paragraph',
        text: "Ce qui est certain, c'est que l'influence des djinns sur l'être humain est une réalité islamique — le waswas (chuchotements), l'incitation au mal, l'influence sur les pensées et les émotions. Cela, personne ne le conteste. Mais la possession totale au sens où un djinn prend le contrôle complet du corps d'un humain — c'est un sujet sur lequel les savants ont des avis nuancés et il ne faut pas le présenter comme un fait absolu et indiscutable.",
      },
      { type: 'heading', level: 2, text: "La possession, c'est avant tout une manipulation psychologique" },
      {
        type: 'paragraph',
        text: "C'est là le point central qu'il faut comprendre. Un djinn, dans la plupart des cas qui semblent les plus avérés selon l'expérience des praticiens, n'agit pas comme dans les films d'horreur. Il agit comme un manipulateur.",
      },
      {
        type: 'paragraph',
        text: "Pensez au pervers narcissique : c'est un être humain qui, par la manipulation psychologique, arrive à prendre le contrôle sur un autre être humain — ses pensées, ses émotions, ses décisions, sa perception de la réalité. La victime finit par ne plus savoir qui elle est, ce qu'elle veut, ce qui est vrai et ce qui est faux. Elle est « possédée » psychologiquement, sans qu'il y ait quoi que ce soit de surnaturel.",
      },
      {
        type: 'paragraph',
        text: "Le djinn fait la même chose, mais avec des moyens supplémentaires : il est invisible, il peut agir sur les rêves, il peut souffler des pensées, il peut amplifier les émotions. Son terrain de jeu, c'est votre psychologie. Il ne « rentre » pas forcément dans votre corps comme dans un film — il s'infiltre dans votre esprit, dans vos pensées, dans vos peurs. Et le pire, c'est qu'il peut aller jusqu'à vous faire croire qu'il EST vous. Que ces pensées sont les vôtres. Que cette voix intérieure négative, c'est la vôtre. C'est la manipulation ultime.",
      },
      {
        type: 'callout',
        variant: 'warning',
        text: "La possession, dans la grande majorité des cas, c'est une emprise psychologique — pas une scène de film d'exorcisme. Et c'est justement parce que c'est psychologique qu'on peut la combattre avec des outils psychologiques ET spirituels.",
      },
      { type: 'heading', level: 2, text: "Les signes souvent évoqués" },
      {
        type: 'callout',
        variant: 'info',
        text: "Comme pour les autres atteintes : ces signes sont issus de l'expérience des praticiens de roqya. Ce ne sont que des indications, pas des preuves. Chacun peut avoir une explication naturelle. Ne vous auto-diagnostiquez pas et ne laissez personne vous enfermer dans un diagnostic de possession.",
      },
      { type: 'heading', level: 3, text: "Changements brusques de personnalité" },
      {
        type: 'paragraph',
        text: "La personne n'est « plus la même » — des sautes d'humeur extrêmes, un comportement qui change radicalement d'un moment à l'autre, des réactions disproportionnées. Mais cela peut aussi être le signe de stress intense, de dépression, de traumatismes non résolus, de troubles émotionnels ou simplement d'une période de vie difficile.",
      },
      { type: 'heading', level: 3, text: "Aversion forte pour le Coran et la prière" },
      {
        type: 'paragraph',
        text: "Ne pas supporter l'écoute du Coran, ressentir un malaise physique pendant la prière, une lourdeur extrême au moment de faire ses ablutions. C'est un signe souvent cité. Mais la baisse de foi, le burn-out spirituel, la culpabilité liée aux péchés — tout cela peut créer exactement les mêmes sensations sans qu'il y ait la moindre possession.",
      },
      { type: 'heading', level: 3, text: "Cauchemars intenses et récurrents" },
      {
        type: 'paragraph',
        text: "Des rêves terrifiants, des sensations de paralysie du sommeil, des cauchemars avec des animaux ou des poursuites. La paralysie du sommeil est un phénomène physiologique documenté qui touche des millions de personnes dans le monde. Les cauchemars sont souvent liés au stress, à l'anxiété ou à des traumatismes.",
      },
      { type: 'heading', level: 3, text: "Parler ou agir pendant le sommeil" },
      {
        type: 'paragraph',
        text: "Le somnambulisme et la somniloquie (parler en dormant) sont des troubles du sommeil courants et bien connus. Ce n'est pas automatiquement le signe d'une présence invisible.",
      },
      { type: 'heading', level: 3, text: "Voix intérieures ou pensées intrusives" },
      {
        type: 'paragraph',
        text: "Entendre des « voix » dans sa tête, avoir des pensées qui ne semblent pas être les siennes, des pensées blasphématoires ou négatives qui s'imposent. Le waswas (chuchotements du shaytan) est une réalité mentionnée dans le Coran. Mais les pensées intrusives sont aussi un phénomène psychologique extrêmement courant — surtout chez les personnes anxieuses ou qui traversent des épreuves.",
      },
      { type: 'separator' },
      { type: 'heading', level: 2, text: "Comment le djinn manipule : comprendre pour se libérer" },
      {
        type: 'paragraph',
        text: "Le point crucial à comprendre : le djinn se nourrit de votre peur. Littéralement. Plus vous avez peur, plus vous lui donnez de la force et de l'emprise sur vous. C'est un cercle vicieux : il vous fait peur → vous avez peur → votre peur le renforce → il a plus d'emprise → il vous fait encore plus peur. Et ainsi de suite. C'est exactement le mécanisme d'un manipulateur qui se nourrit de la vulnérabilité de sa victime.",
      },
      {
        type: 'callout',
        variant: 'warning',
        text: "Votre peur est son carburant. Chaque fois que vous paniquez, que vous vous dites « c'est fini, je suis possédé, je n'ai aucune chance » — vous lui offrez exactement ce qu'il veut. Vous le nourrissez. À l'inverse, chaque fois que vous refusez la peur et que vous placez votre confiance en Allah — vous l'affamez.",
      },
      {
        type: 'paragraph',
        text: "Le djinn utilise essentiellement trois armes, et elles tournent toutes autour de cette mécanique de la peur :",
      },
      {
        type: 'list',
        items: [
          "La peur — son arme numéro un, sa nourriture. Il vous fait croire qu'il est tout-puissant, que vous ne pouvez rien faire, que c'est fini pour vous. Plus vous y croyez, plus il se renforce. C'est de l'intimidation pure",
          "La confusion — il brouille vos pensées, vous fait douter de vous-même, vous fait croire que ses suggestions sont vos propres idées. C'est de la manipulation cognitive",
          "L'isolement — il vous pousse à vous éloigner des gens, de la prière, du Coran, de tout ce qui pourrait vous renforcer. Il coupe vos sources de force une par une pour que vous restiez seul avec votre peur",
        ],
      },
      {
        type: 'paragraph',
        text: "Quand vous comprenez ces mécanismes, vous comprenez aussi comment les neutraliser. Et surtout, vous comprenez que la clé de la libération c'est de casser le cercle de la peur. Chaque arme a son antidote :",
      },
      {
        type: 'list',
        items: [
          "Contre la peur → la certitude en Allah. Il est plus puissant que tout. Aucun djinn ne peut rien face à la volonté d'Allah",
          "Contre la confusion → le discernement. Apprendre à reconnaître ce qui vient de vous et ce qui ne vient pas de vous. C'est exactement ce que fait la Psycho-Roqya",
          "Contre l'isolement → se forcer à maintenir la prière, le dhikr, les liens sociaux. Même quand c'est difficile. Surtout quand c'est difficile",
        ],
      },
      { type: 'heading', level: 2, text: "Ce n'est pas une fatalité" },
      {
        type: 'paragraph',
        text: "Même si vous êtes réellement sous l'influence d'un djinn — et on ne l'exclut pas — sachez que ce n'est absolument pas une fatalité. Le Coran est la parole d'Allah et aucune créature ne peut résister à Sa parole. La roqya fonctionne, bi idhnillah. Mais au-delà de la roqya, c'est votre état d'esprit qui fait toute la différence.",
      },
      {
        type: 'paragraph',
        text: "L'objectif n'est pas de donner de la force à l'influence en en parlant constamment et en la dramatisant. C'est au contraire de la minimiser, de la déconstruire, de refuser de se laisser intimider. Parce que l'intimidation et la peur sont les armes principales de cette influence. Quand vous retirez la peur, vous retirez le pouvoir.",
      },
      {
        type: 'callout',
        variant: 'tip',
        text: "C'est exactement la démarche de la Psycho-Roqya : on ne nie pas l'existence de l'influence, mais on refuse de lui laisser de la place. On déconstruit les peurs, on casse les mécanismes de manipulation, on redonne à la personne le contrôle sur son propre esprit. Et on accompagne tout ça avec le Coran et les invocations prophétiques. C'est l'alliance de la spiritualité et de la psychologie qui libère.",
      },
      { type: 'separator' },
      {
        type: 'paragraph',
        text: "En résumé : la possession telle qu'elle est présentée sur internet est souvent exagérée et dramatisée. La réalité est plus subtile — c'est une manipulation psychologique avant tout. Et comme toute manipulation, elle se combat par la compréhension, le discernement, la foi et le refus de se laisser intimider. Vous n'êtes pas impuissant. Allah est avec vous. Et Sa parole est plus forte que toute créature. Qu'Allah vous libère et vous protège.",
      },
    ],
  },

  // 9 -----------------------------------------------------------------------
  {
    id: 'art-shaytan-ou-nafs',
    slug: 'shaytan-ou-nafs-comment-faire-la-difference',
    title: 'Est-ce le Shaytan ou ton Nafs ? Comment faire la différence',
    excerpt:
      "Tous les troubles ne sont pas d'origine spirituelle. Apprenez à distinguer ce qui relève du Shaytan de ce qui relève de votre propre nafs ou d'un trouble psychologique.",
    category: 'psycho-roqya',
    imageUrl: '/images/article-shaytan-nafs.jpg',
    imageGradient: '',
    author: authorYoussef,
    date: '2026-03-22',
    readTime: 10,
    featured: false,
    tags: ['psycho-roqya', 'nafs', 'shaytan', 'discernement', 'psychologie'],
    content: [
      {
        type: 'paragraph',
        text: "L'une des erreurs les plus fréquentes dans le monde de la roqya est de tout attribuer au Shaytan ou aux djinns. Chaque difficulté, chaque émotion négative, chaque blocage est immédiatement interprété comme une attaque spirituelle. Or, la réalité est bien plus nuancée que cela.",
      },
      { type: 'heading', level: 2, text: 'Le nafs : un ennemi intérieur souvent ignoré' },
      {
        type: 'paragraph',
        text: "Le Coran mentionne clairement que le nafs (l'âme) peut pousser l'être humain vers le mal. Ce n'est pas toujours le Shaytan qui est en cause. Parfois, ce sont nos propres penchants, nos blessures émotionnelles non résolues, nos traumas ou encore des troubles anxieux et dépressifs qui se manifestent.",
      },
      {
        type: 'arabic',
        text: 'إِنَّ النَّفْسَ لَأَمَّارَةٌ بِالسُّوءِ إِلَّا مَا رَحِمَ رَبِّي',
        translation: "Certes, l'âme est très instigatrice du mal, sauf celle que mon Seigneur protège par Sa miséricorde.",
        source: 'Sourate Youssouf, 12:53',
      },
      { type: 'heading', level: 2, text: "Les signes d'une cause spirituelle" },
      {
        type: 'paragraph',
        text: "Certains signes peuvent orienter vers une cause spirituelle : des réactions inhabituelles lors de la récitation du Coran, des cauchemars récurrents impliquant des animaux ou des poursuites, un changement brutal de comportement sans cause apparente, ou encore des blocages inexplicables dans la vie malgré tous les efforts déployés.",
      },
      { type: 'heading', level: 2, text: "Les signes d'une cause psychologique" },
      {
        type: 'paragraph',
        text: "En revanche, d'autres signes orientent davantage vers une cause psychologique : un historique de traumatismes, un environnement familial toxique, des symptômes progressifs et non soudains, ou une amélioration notable avec un suivi psychologique. L'anxiété, la dépression et le stress post-traumatique peuvent mimer des symptômes spirituels.",
      },
      {
        type: 'callout',
        variant: 'info',
        text: "La démarche recommandée est de consulter à la fois un raqi de confiance ET un psychologue compétent. La Psycho-Roqya combine les deux approches pour un accompagnement complet. Ne négligez ni l'une ni l'autre.",
      },
      { type: 'heading', level: 2, text: 'La méthode du discernement' },
      {
        type: 'paragraph',
        text: "Avant de conclure quoi que ce soit, prenez du recul. Analysez vos symptômes avec honnêteté. Demandez-vous : est-ce que ces troubles existaient avant un événement précis ? Est-ce que j'ai des antécédents familiaux de troubles psychologiques ? Est-ce que la récitation du Coran provoque des réactions physiques inhabituelles ? Le discernement est une qualité essentielle que tout musulman doit cultiver.",
      },
    ],
  },

  // 10 ----------------------------------------------------------------------
  {
    id: 'art-temoignages-roqya-transforme',
    slug: 'temoignages-quand-la-roqya-transforme-des-vies',
    title: 'Témoignages : quand la roqya transforme des vies',
    excerpt:
      "Des parcours de guérison inspirants qui montrent que la roqya, pratiquée avec foi et persévérance, peut transformer des vies brisées par les maux spirituels.",
    category: 'temoignages',
    imageUrl: '/images/articles/temoignages-roqya.png',
    imageGradient: 'bg-gradient-to-br from-pink-700 via-pink-500 to-rose-400',
    author: authorYoussef,
    date: '2026-03-24',
    readTime: 9,
    featured: false,
    tags: ['témoignages', 'guérison', 'roqya', 'espoir', 'persévérance'],
    content: [
      {
        type: 'paragraph',
        text: "Derrière chaque personne qui consulte un raqi, il y a une histoire de souffrance. Des nuits blanches, des relations brisées, une vie qui s'effondre sans explication apparente. Mais il y a aussi des histoires de renaissance. Des personnes qui ont traversé les ténèbres et retrouvé la lumière, bi idhnillah.",
      },
      { type: 'heading', level: 2, text: 'Le parcours de la guérison' },
      {
        type: 'paragraph',
        text: "La guérison par la roqya n'est pas un événement ponctuel : c'est un parcours. Un frère nous raconte qu'il a souffert pendant trois ans de blocages inexplicables dans sa vie professionnelle et conjugale. Malgré ses compétences, tout échouait. Après avoir entamé un programme de roqya shar'iyya combiné à un suivi psychologique, les choses ont progressivement changé.",
      },
      { type: 'heading', level: 2, text: "L'importance de la persévérance" },
      {
        type: 'paragraph',
        text: "Ce que tous ces témoignages ont en commun, c'est la persévérance. Aucune guérison n'a été instantanée. Il y a eu des hauts et des bas, des moments de doute, des rechutes. Mais ceux qui ont tenu bon, qui ont maintenu leurs adhkar, leur récitation quotidienne et leur confiance en Allah, ont fini par voir la lumière au bout du tunnel.",
      },
      {
        type: 'quote',
        text: "J'ai failli tout abandonner au bout de six mois. Je ne voyais aucune amélioration. Puis un jour, je me suis réveillée et j'ai senti que quelque chose avait changé. Le poids que je portais depuis des années avait disparu. Al-hamdoulillah.",
        author: 'Témoignage anonyme',
      },
      { type: 'heading', level: 2, text: 'La foi comme moteur' },
      {
        type: 'paragraph',
        text: "Chaque personne guérie insiste sur un point : c'est la relation avec Allah qui a fait la différence. Pas seulement la roqya comme acte technique, mais le retour sincère vers Allah, la prière de nuit, le repentir, l'abandon des péchés. La roqya est un moyen, mais c'est Allah qui guérit.",
      },
      {
        type: 'callout',
        variant: 'tip',
        text: "Si vous traversez une épreuve spirituelle, ne perdez jamais espoir. Chaque verset récité, chaque invocation prononcée avec sincérité est une arme puissante. La victoire appartient à ceux qui persévèrent. Allah ne laisse jamais Ses serviteurs sans secours.",
      },
    ],
  },

  // 11 ----------------------------------------------------------------------
  {
    id: 'art-protection-spirituelle-quotidien',
    slug: 'se-proteger-spirituellement-au-quotidien',
    title: 'Se protéger spirituellement au quotidien',
    excerpt:
      "Un guide pratique des actes de protection spirituelle à intégrer dans votre routine quotidienne pour vous prémunir contre le mauvais oeil, la sorcellerie et les influences négatives.",
    category: 'prevention',
    imageUrl: '/images/articles/protection-quotidienne.png',
    imageGradient: 'bg-gradient-to-br from-emerald-700 via-emerald-500 to-teal-400',
    author: authorYoussef,
    date: '2026-03-26',
    readTime: 8,
    featured: false,
    tags: ['protection', 'adhkar', 'prévention', 'routine', 'Al-Baqara'],
    content: [
      {
        type: 'paragraph',
        text: "La meilleure roqya est celle que l'on fait avant d'en avoir besoin. La prévention spirituelle est un devoir pour tout musulman. Le Prophète (paix et salut sur lui) nous a laissé un arsenal complet d'invocations et de pratiques pour nous protéger au quotidien. Le problème, c'est que beaucoup les négligent.",
      },
      { type: 'heading', level: 2, text: 'Les adhkar du matin et du soir' },
      {
        type: 'paragraph',
        text: "Les adhkar du matin (après Fajr) et du soir (après Asr) constituent votre bouclier spirituel principal. Ils incluent notamment Ayat al-Kursi, les trois dernières sourates du Coran (Al-Ikhlas, Al-Falaq, An-Nas) récitées trois fois, et les invocations prophétiques de protection. Ne les négligez jamais, même quand vous êtes pressé.",
      },
      {
        type: 'arabic',
        text: 'بِسْمِ اللَّهِ الَّذِي لَا يَضُرُّ مَعَ اسْمِهِ شَيْءٌ فِي الْأَرْضِ وَلَا فِي السَّمَاءِ وَهُوَ السَّمِيعُ الْعَلِيمُ',
        translation: "Au nom d'Allah, Celui dont le nom protège de tout mal sur terre et dans les cieux. Il est l'Audient, l'Omniscient.",
        source: 'Hadith rapporté par At-Tirmidhi et Abou Daoud — à réciter 3 fois matin et soir',
      },
      { type: 'heading', level: 2, text: "Le pouvoir de Sourate Al-Baqara" },
      {
        type: 'paragraph',
        text: "Le Prophète (paix et salut sur lui) a dit que le Shaytan fuit la maison dans laquelle on récite Sourate Al-Baqara. Faites-en une habitude : récitez-la chez vous au moins une fois tous les trois jours. Si vous ne pouvez pas la réciter en entier, écoutez-la en audio. L'essentiel est que cette sourate soit présente dans votre foyer.",
      },
      { type: 'heading', level: 2, text: 'Les péchés qui affaiblissent la protection' },
      {
        type: 'paragraph',
        text: "Il ne sert à rien de réciter des adhkar le matin si l'on passe la nuit dans le haram. Les péchés créent des brèches dans la protection spirituelle. La musique, le regard illicite, la médisance, la négligence des prières obligatoires : tout cela affaiblit votre bouclier et vous rend vulnérable aux attaques spirituelles.",
      },
      { type: 'heading', level: 2, text: 'Votre checklist de protection quotidienne' },
      {
        type: 'list',
        items: [
          'Adhkar du matin après Salat al-Fajr (Ayat al-Kursi, les 3 Qul, invocations prophétiques)',
          'Adhkar du soir après Salat al-Asr',
          'Bismillah avant de manger, de boire, de rentrer chez soi',
          "Récitation ou écoute de Sourate Al-Baqara dans la maison (au moins tous les 3 jours)",
          'Prières obligatoires accomplies à l\'heure',
          'Invocation avant de dormir et les 3 dernières sourates soufflées dans les mains',
          'Éviter les péchés majeurs et demander le pardon (istighfar) régulièrement',
          'Faire la prière de Witr avant de dormir',
        ],
      },
      {
        type: 'callout',
        variant: 'tip',
        text: "La régularité est plus importante que la quantité. Mieux vaut des adhkar courts mais constants que de longues récitations occasionnelles. Le Prophète (paix et salut sur lui) a dit que les actes les plus aimés d'Allah sont les plus réguliers, même s'ils sont peu nombreux.",
      },
    ],
  },

  // 12 ----------------------------------------------------------------------
  {
    id: 'art-15-ans-de-roqya',
    slug: 'ce-que-15-ans-de-roqya-mont-appris',
    title: "Ce que 15 ans de roqya m'ont appris",
    excerpt:
      "Après 15 ans de pratique de la roqya et d'accompagnement de centaines de patients, Dr Frère Muz partage les leçons les plus importantes de son parcours.",
    category: 'conseils',
    imageUrl: '/images/articles/15-ans-roqya.png',
    imageGradient: 'bg-gradient-to-br from-amber-700 via-amber-600 to-orange-500',
    author: authorYoussef,
    date: '2026-03-28',
    readTime: 12,
    featured: false,
    tags: ['conseils', 'expérience', 'psycho-roqya', 'charlatans', 'sagesse'],
    content: [
      {
        type: 'paragraph',
        text: "Quand j'ai commencé à pratiquer la roqya il y a quinze ans, je pensais que tout se résumait à réciter le Coran sur le malade et attendre qu'Allah fasse le reste. Avec le temps, j'ai compris que la réalité était infiniment plus complexe, et que la roqya seule ne suffisait pas toujours.",
      },
      { type: 'heading', level: 2, text: "La roqya n'est pas une baguette magique" },
      {
        type: 'paragraph',
        text: "La première leçon, et peut-être la plus importante, c'est que la roqya n'est pas un remède miracle instantané. J'ai vu trop de gens venir en espérant qu'une seule séance allait tout résoudre. La guérison est un processus qui demande du temps, de la patience et surtout un engagement personnel du malade dans sa propre guérison.",
      },
      { type: 'heading', level: 2, text: "Pourquoi j'ai intégré la psychologie" },
      {
        type: 'paragraph',
        text: "Au fil des années, j'ai réalisé qu'un pourcentage significatif des personnes qui venaient me voir pour de la roqya souffraient en réalité de troubles psychologiques. Anxiété, dépression, trauma, troubles de la personnalité. Les symptômes ressemblaient à s'y méprendre à ceux d'un mass ou d'un sihr. C'est pour cela que j'ai développé l'approche Psycho-Roqya : allier le soin spirituel au soin psychologique.",
      },
      { type: 'heading', level: 2, text: 'Les erreurs que je vois le plus souvent' },
      {
        type: 'list',
        items: [
          "Consulter des dizaines de raqis différents sans jamais suivre un programme complet avec un seul d'entre eux.",
          "Négliger les adhkar quotidiens tout en multipliant les séances de roqya — c'est comme prendre un médicament en salle de consultation puis ne plus rien faire chez soi.",
          "Attribuer chaque problème de la vie au sihr ou au 'ayn sans aucune remise en question personnelle.",
          "Refuser catégoriquement toute aide psychologique par peur du stigmate ou par méconnaissance.",
          "Tomber dans les filets de charlatans qui exploitent la détresse des gens.",
        ],
      },
      { type: 'heading', level: 2, text: 'Comment repérer un charlatan' },
      {
        type: 'callout',
        variant: 'warning',
        text: "Méfiez-vous de tout praticien qui : demande le nom de votre mère, utilise des talismans ou des écritures incompréhensibles, vous isole dans une pièce fermée, exige des sommes exorbitantes, prétend pouvoir diagnostiquer à distance avec certitude, ou vous rend dépendant de ses séances. Un vrai raqi vous apprend à vous soigner vous-même.",
      },
      { type: 'heading', level: 2, text: 'Mon conseil à ceux qui souffrent' },
      {
        type: 'paragraph',
        text: "Si je pouvais donner un seul conseil après ces quinze années, ce serait celui-ci : ne déléguez pas votre guérison. Le raqi est un accompagnant, pas un sauveur. C'est vous qui devez faire le travail : réciter vos adhkar, prier vos prières, abandonner les péchés, travailler sur vous-même. La roqya est un catalyseur, mais le vrai changement vient de votre relation personnelle avec Allah.",
      },
      {
        type: 'quote',
        text: "La roqya la plus puissante est celle que vous faites sur vous-même, avec sincérité, en pleine nuit, quand personne ne vous voit sauf Allah.",
        author: 'Dr Frère Muz',
      },
    ],
  },
];
