export interface QuizQuestion {
  id: string;
  texte_fr: string;
  texte_ar: string;
  categorie: 'ayn' | 'sihr' | 'mass' | 'general';
  ordre: number;
  options: { label: string; value: number }[];
}

const defaultOptions: { label: string; value: number }[] = [
  { label: 'Jamais', value: 0 },
  { label: 'Rarement', value: 1 },
  { label: 'Parfois', value: 2 },
  { label: 'Souvent', value: 3 },
];

export const quizQuestions: QuizQuestion[] = [
  {
    id: 'q-001',
    texte_fr: 'Ressentez-vous des maux de tête fréquents sans cause médicale identifiée ?',
    texte_ar: 'هل تعاني من صداع متكرر بدون سبب طبي واضح؟',
    categorie: 'ayn',
    ordre: 1,
    options: defaultOptions,
  },
  {
    id: 'q-002',
    texte_fr: 'Éprouvez-vous une fatigue persistante malgré un repos suffisant ?',
    texte_ar: 'هل تشعر بتعب مستمر رغم الراحة الكافية؟',
    categorie: 'ayn',
    ordre: 2,
    options: defaultOptions,
  },
  {
    id: 'q-003',
    texte_fr: 'Faites-vous des cauchemars récurrents ou des rêves perturbants ?',
    texte_ar: 'هل تراودك كوابيس متكررة أو أحلام مزعجة؟',
    categorie: 'mass',
    ordre: 3,
    options: defaultOptions,
  },
  {
    id: 'q-004',
    texte_fr: 'Ressentez-vous une anxiété ou une angoisse inexpliquée, surtout le soir ?',
    texte_ar: 'هل تشعر بقلق أو ضيق غير مبرر، خاصة في المساء؟',
    categorie: 'general',
    ordre: 4,
    options: defaultOptions,
  },
  {
    id: 'q-005',
    texte_fr: 'Avez-vous des épisodes de tristesse profonde ou de désespoir sans raison apparente ?',
    texte_ar: 'هل تمر بنوبات حزن شديد أو يأس بدون سبب واضح؟',
    categorie: 'general',
    ordre: 5,
    options: defaultOptions,
  },
  {
    id: 'q-006',
    texte_fr: 'Avez-vous tendance à vous isoler et à éviter les rassemblements ?',
    texte_ar: 'هل تميل إلى العزلة وتجنب التجمعات؟',
    categorie: 'sihr',
    ordre: 6,
    options: defaultOptions,
  },
  {
    id: 'q-007',
    texte_fr: 'Éprouvez-vous une difficulté inhabituelle à accomplir vos prières ?',
    texte_ar: 'هل تجد صعوبة غير معتادة في أداء الصلاة؟',
    categorie: 'mass',
    ordre: 7,
    options: defaultOptions,
  },
  {
    id: 'q-008',
    texte_fr: 'Ressentez-vous un malaise ou une gêne en écoutant le Coran ?',
    texte_ar: 'هل تشعر بضيق أو انزعاج عند سماع القرآن؟',
    categorie: 'mass',
    ordre: 8,
    options: defaultOptions,
  },
  {
    id: 'q-009',
    texte_fr: 'Constatez-vous des conflits inhabituels et répétés dans votre couple ou votre famille ?',
    texte_ar: 'هل تلاحظ خلافات غير معتادة ومتكررة في حياتك الزوجية أو العائلية؟',
    categorie: 'sihr',
    ordre: 9,
    options: defaultOptions,
  },
  {
    id: 'q-010',
    texte_fr: 'Rencontrez-vous des blocages répétés dans votre vie professionnelle ou vos projets ?',
    texte_ar: 'هل تواجه عراقيل متكررة في حياتك المهنية أو مشاريعك؟',
    categorie: 'sihr',
    ordre: 10,
    options: defaultOptions,
  },
  {
    id: 'q-011',
    texte_fr: 'Ressentez-vous des douleurs physiques migrantes (qui changent d\'endroit) sans explication médicale ?',
    texte_ar: 'هل تشعر بآلام جسدية متنقلة بدون تفسير طبي؟',
    categorie: 'ayn',
    ordre: 11,
    options: defaultOptions,
  },
  {
    id: 'q-012',
    texte_fr: 'Avez-vous remarqué un changement soudain dans vos sentiments envers un proche ?',
    texte_ar: 'هل لاحظت تغيرًا مفاجئًا في مشاعرك تجاه شخص قريب منك؟',
    categorie: 'sihr',
    ordre: 12,
    options: defaultOptions,
  },
];
