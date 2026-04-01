export interface CoachingProgramme {
  slug: string;
  title: string;
  subtitle: string;
  price: number; // en euros
  duration: string; // ex: "21 jours"
  videosCount: number;
  totalHours: string; // ex: "2h30"
  description: string;
  whatYouLearn: string[];
  modules: {
    title: string;
    lessons: string[];
  }[];
  forWho: string;
  icon: string; // nom icône lucide
  color: string; // classe tailwind pour la couleur accent
  badge?: string; // ex: "Best-seller", "Nouveau"
}

export const coachingProgrammes: CoachingProgramme[] = [
  {
    slug: 'communication-couple',
    title: 'Communication dans le couple',
    subtitle: "Retrouvez la connexion et l'harmonie dans votre relation",
    price: 47,
    duration: '21 jours',
    videosCount: 12,
    totalHours: '2h30',
    description:
      'Apprenez à communiquer avec bienveillance, écouter vraiment votre conjoint et désamorcer les tensions — avec des outils ancrés dans les valeurs islamiques.',
    whatYouLearn: [
      'Identifier vos schémas de communication inconscients',
      "Pratiquer l'écoute active et la Communication Non Violente",
      'Exprimer vos besoins sans blesser l\'autre',
      'Gérer les désaccords avec sagesse et rahma',
      'Renforcer la confiance et la connexion émotionnelle',
      'Ancrer votre communication dans les valeurs du Coran et de la Sunna',
    ],
    modules: [
      {
        title: 'Semaine 1 — Comprendre',
        lessons: [
          'Introduction : pourquoi on ne se comprend plus',
          'Les 4 styles de communication',
          'Identifier vos déclencheurs émotionnels',
          'La base islamique de la communication conjugale',
        ],
      },
      {
        title: 'Semaine 2 — Outils',
        lessons: [
          'La Communication Non Violente (CNV)',
          "L'écoute active : comment vraiment entendre",
          'Exprimer ses besoins sans accusation',
          'Script : comment aborder un sujet difficile',
        ],
      },
      {
        title: 'Semaine 3 — Ancrer',
        lessons: [
          'Rituals de connexion quotidiens',
          'Gérer les crises et retours en arrière',
          "Plan d'action à 90 jours",
          'Vidéo de clôture + dua pour le couple',
        ],
      },
    ],
    forWho:
      "Ce programme est pour vous si vous sentez que vous et votre conjoint vous parlez sans vraiment vous entendre, si les mêmes disputes reviennent en boucle, ou si vous voulez simplement renforcer votre lien.",
    icon: 'Heart',
    color: 'text-rose-500',
    badge: 'Best-seller',
  },
  {
    slug: 'reprendre-confiance',
    title: 'Reprendre confiance en soi',
    subtitle: 'Reconstruire une estime solide ancrée dans votre foi',
    price: 27,
    duration: '10 jours',
    videosCount: 7,
    totalHours: '1h20',
    description:
      "Un programme intense de 10 jours pour sortir du doute, du regard des autres et de l'auto-sabotage — en vous reconnectant à votre valeur en tant que musulman(e).",
    whatYouLearn: [
      'Comprendre les racines du manque de confiance',
      'Casser les croyances limitantes qui vous freinent',
      'Développer une image de soi positive et islamique',
      'Arrêter de chercher la validation des autres',
      'Agir malgré la peur avec la tawakkul',
      'Construire une routine de confiance quotidienne',
    ],
    modules: [
      {
        title: 'Phase 1 — Diagnostic (jours 1-3)',
        lessons: [
          "D'où vient mon manque de confiance ?",
          'Mes croyances limitantes : les identifier',
          "Ce que l'Islam dit de ta valeur intrinsèque",
        ],
      },
      {
        title: 'Phase 2 — Reconstruction (jours 4-7)',
        lessons: [
          'Reprogrammer les pensées négatives',
          'La tawakkul comme antidote à la peur',
          'Exercice : la lettre à toi-même',
          'Agir malgré le doute',
        ],
      },
      {
        title: 'Phase 3 — Ancrer (jours 8-10)',
        lessons: [
          'Ta routine confiance quotidienne',
          'Gérer les rechutes et le regard des autres',
          "Plan d'action + dua de clôture",
        ],
      },
    ],
    forWho:
      "Ce programme est pour vous si vous doutez constamment de vous-même, si vous avez du mal à prendre des décisions, si le regard des autres vous paralyse, ou si vous traversez une période de reconstruction après une épreuve.",
    icon: 'Star',
    color: 'text-gold',
    badge: undefined,
  },
  {
    slug: 'gestion-conflits',
    title: 'Gérer les conflits dans le couple',
    subtitle: 'Transformer les disputes en opportunités de rapprochement',
    price: 47,
    duration: '14 jours',
    videosCount: 10,
    totalHours: '2h',
    description:
      "Apprenez à désamorcer les conflits avant qu'ils ne dégénèrent, à réparer les blessures et à transformer chaque dispute en un pas vers plus de compréhension mutuelle.",
    whatYouLearn: [
      "Comprendre la mécanique d'un conflit conjugal",
      "Reconnaître les signaux d'alerte avant l'escalade",
      "Les 4 comportements toxiques à éliminer (Gottman)",
      'La technique de pause réparatrice',
      'Comment présenter des excuses sincères',
      'Reconstruire la confiance après une blessure',
    ],
    modules: [
      {
        title: 'Semaine 1 — Comprendre le conflit',
        lessons: [
          'Pourquoi on se dispute (vraiment)',
          "Les 4 cavaliers de l'Apocalypse (Gottman islamique)",
          'Identifier vos patterns de conflit',
          "La colère en Islam : ni refouler ni exploser",
          'Exercice : cartographier votre dernier conflit',
        ],
      },
      {
        title: 'Semaine 2 — Résoudre et réparer',
        lessons: [
          'La technique de pause : comment et quand l\'utiliser',
          "L'art des excuses sincères en Islam",
          'Reconstruire la confiance étape par étape',
          'Créer un accord de couple (pacte de paix)',
          "Plan de prévention pour l'avenir",
        ],
      },
    ],
    forWho:
      "Ce programme est pour les couples qui ont des disputes fréquentes et intenses, qui ont du mal à se réconcilier vraiment, ou qui veulent apprendre à gérer les désaccords de façon saine avant que ça ne s'aggrave.",
    icon: 'Shield',
    color: 'text-blue-500',
    badge: undefined,
  },
  {
    slug: 'preparer-mariage',
    title: 'Préparer son mariage',
    subtitle: 'Poser des fondations solides pour une union bénie',
    price: 57,
    duration: '21 jours',
    videosCount: 14,
    totalHours: '2h45',
    description:
      "Un programme complet pour les fiancés ou futurs mariés qui veulent aborder leur union avec maturité, connaissance et des outils concrets pour construire durablement.",
    whatYouLearn: [
      'Se connaître avant de construire à deux',
      'Aligner vos valeurs et votre vision de vie',
      'Parler des sujets difficiles avant le mariage (finances, famille, éducation)',
      'Les droits et devoirs islamiques dans le mariage',
      'Établir des règles saines dès le début',
      'Gérer les pressions familiales et sociales',
    ],
    modules: [
      {
        title: 'Module 1 — Se connaître soi-même',
        lessons: [
          'Qui suis-je vraiment ? Valeurs, besoins, limites',
          'Mes blessures passées et comment elles affectent mon futur',
          'Mes attentes : réalistes ou idéalisées ?',
          'Test de compatibilité islamique',
        ],
      },
      {
        title: 'Module 2 — Construire à deux',
        lessons: [
          'Aligner vos visions de vie',
          'Les conversations essentielles avant le mariage',
          "Finances, famille, éducation des enfants : on en parle",
          'Établir votre contrat de couple (non juridique)',
        ],
      },
      {
        title: 'Module 3 — Fondations islamiques',
        lessons: [
          'Les droits et devoirs en Islam',
          "La Sunna du mariage : ce qu'on oublie souvent",
          'Gérer belle-famille et pressions',
          'Votre plan des 6 premiers mois',
          'Vidéo de clôture + dua pour votre union',
        ],
      },
    ],
    forWho:
      "Ce programme est pour les personnes fiancées, en projet de mariage, ou même déjà mariées depuis peu qui veulent revenir aux bases et construire sur des fondations solides.",
    icon: 'Users',
    color: 'text-emerald-500',
    badge: 'Nouveau',
  },
  {
    slug: 'transformation-nefs',
    title: 'Transformation Nefs — 30 jours',
    subtitle: 'Le programme complet de développement personnel islamique',
    price: 97,
    duration: '30 jours',
    videosCount: 22,
    totalHours: '4h30',
    description:
      "Le programme phare de CoachMyNefs. 30 jours pour transformer en profondeur votre rapport à vous-même, à Allah et à votre vie — avec des méthodes éprouvées et une approche islamique unique.",
    whatYouLearn: [
      'Faire un bilan honnête de votre vie actuelle',
      'Identifier et dépasser vos blocages profonds',
      'Développer une confiance solide ancrée dans la foi',
      'Définir votre mission de vie (purpose)',
      'Créer des habitudes alignées avec vos valeurs',
      'Gérer vos émotions avec sagesse',
      'Construire des relations saines',
      'Repartir avec un plan de vie concret sur 1 an',
    ],
    modules: [
      {
        title: 'Semaine 1 — Bilan & Fondations',
        lessons: [
          'Bienvenue : comment tirer le maximum de ce programme',
          'Bilan de vie : où en suis-je vraiment ?',
          'Mes valeurs profondes',
          'Mes croyances limitantes',
          'La roue de la vie islamique',
          'Objectifs de transformation',
        ],
      },
      {
        title: 'Semaine 2 — Comprendre ses blocages',
        lessons: [
          "D'où viennent mes blocages ?",
          "Les blessures de l'enfance et leur impact",
          "L'ego et le nafs : comprendre sa psychologie",
          'Gestion des émotions difficiles',
          'Outil : le journal de décompression',
          'La tawbah comme outil de libération',
        ],
      },
      {
        title: 'Semaine 3 — Construire',
        lessons: [
          'Confiance en soi : les piliers islamiques',
          'Trouver sa mission de vie',
          'Définir sa vision à 5 ans',
          'Créer des habitudes qui durent',
          'Gérer son énergie et son temps',
          'Les relations qui vous élèvent',
        ],
      },
      {
        title: 'Semaine 4 — Ancrer & Projeter',
        lessons: [
          'Votre plan de vie sur 12 mois',
          'Anticiper les obstacles',
          'Rituels quotidiens pour maintenir la transformation',
          'Lettre à votre futur vous',
          'Vidéo de clôture',
          'Bonus : séance Q&A enregistrée',
          'Ressources complémentaires',
        ],
      },
    ],
    forWho:
      "Ce programme est pour vous si vous sentez que vous tournez en rond, que vous n'avancez pas malgré vos efforts, que vous manquez de clarté sur votre vie, ou que vous voulez une transformation profonde et durable.",
    icon: 'Zap',
    color: 'text-purple-500',
    badge: 'Programme phare',
  },
];
