import { useState, useEffect, useCallback } from 'react';
import {
  ChevronRight,
  ChevronLeft,
  Check,
  CheckCircle2,
  Circle,
  Calendar,
  Shield,
  Heart,
  Flame,
  RotateCcw,
  Sparkles,
  Sun,
  Moon,
  Star,
  BookOpen,
  Droplets,
  Play,
} from 'lucide-react';
import SEO from '../components/SEO';

// ═══════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════

type View = 'questionnaire' | 'result' | 'tracker';
type ProgramType = 'prevention' | 'light' | 'intensive';
type Severity = 'leger' | 'modere' | 'severe';

interface QuestionnaireAnswers {
  duration: string;
  previousRuqya: string;
  prayer: string;
  quran: string;
  physicalSymptoms: string[];
  psychologicalSymptoms: string[];
  specificSymptoms: string[];
  suspectedCause: string;
  consultedDoctor: string;
}

interface DiagnosisDetails {
  score: number;
  totalSymptoms: number;
  dominantCondition: 'ayn' | 'sihr' | 'mass' | 'general';
  aynIndicators: number;
  sihrIndicators: number;
  massIndicators: number;
}

interface DayProgress {
  morning: string[];
  evening: string[];
  bonus: string[];
}

interface ProgramState {
  type: ProgramType;
  severity: Severity;
  startDate: string;
  currentDay: number;
  totalDays: number;
  dailyProgress: Record<number, DayProgress>;
}

// ═══════════════════════════════════════════════════════
// CONSTANTS
// ═══════════════════════════════════════════════════════

const PHYSICAL_SYMPTOMS = [
  'Maux de tête fréquents et inexpliqués',
  'Douleurs dans le corps sans cause apparente',
  'Fatigue chronique et manque d\'énergie',
  'Troubles du sommeil (insomnie, cauchemars récurrents)',
  'Sensation de lourdeur dans le corps',
  'Palpitations cardiaques sans raison',
  'Sensation d\'étouffement ou de pression sur la poitrine',
  'Nausées ou douleurs abdominales inexpliquées',
];

const PSYCHOLOGICAL_SYMPTOMS = [
  'Anxiété ou angoisse permanente',
  'Tristesse profonde sans raison apparente',
  'Pensées obsessionnelles ou intrusives',
  'Éloignement de la prière et du Coran',
  'Irritabilité ou colère excessive',
  'Envie de s\'isoler des gens',
  'Difficultés de concentration',
  'Waswas (chuchotements/doutes) fréquents',
];

const SPECIFIC_SYMPTOMS = [
  'Cauchemars avec serpents, chiens, ou chutes',
  'Réaction forte à l\'écoute du Coran (pleurs, tremblements, douleurs)',
  'Blocages dans la vie (mariage, travail, projets)',
  'Sensation de présence autour de vous',
  'Changement soudain de comportement',
  'Problèmes relationnels récurrents (couple, famille)',
  'Malchance répétée et échecs inexpliqués',
  'Aversion pour certains lieux ou personnes',
];

const MOTIVATIONAL_QUOTES = [
  {
    arabic: '\u0648\u064E\u0646\u064F\u0646\u064E\u0632\u0651\u0650\u0644\u064F \u0645\u0650\u0646\u064E \u0627\u0644\u0642\u064F\u0631\u0652\u0622\u0646\u0650 \u0645\u0627 \u0647\u064F\u0648\u064E \u0634\u0650\u0641\u0627\u0621\u064C \u0648\u064E\u0631\u064E\u062D\u0652\u0645\u064E\u0629\u064C \u0644\u0650\u0644\u0652\u0645\u064F\u0624\u0652\u0645\u0650\u0646\u064A\u0646\u064E',
    french: 'Nous faisons descendre du Coran ce qui est guérison et miséricorde pour les croyants.',
    source: 'Sourate Al-Isra, 17:82',
  },
  {
    arabic: '\u0623\u064E\u0644\u0627 \u0628\u0650\u0630\u0650\u0643\u0652\u0631\u0650 \u0627\u0644\u0644\u0651\u064E\u0647\u0650 \u062A\u064E\u0637\u0652\u0645\u064E\u0626\u0650\u0646\u0651\u064F \u0627\u0644\u0642\u064F\u0644\u064F\u0648\u0628\u064F',
    french: 'N\'est-ce point par l\'évocation d\'Allah que se tranquillisent les coeurs ?',
    source: 'Sourate Ar-Ra\'d, 13:28',
  },
  {
    arabic: '\u0648\u064E\u0625\u0650\u0630\u064E\u0627 \u0645\u064E\u0631\u0650\u0636\u0652\u062A\u064F \u0641\u064E\u0647\u064F\u0648\u064E \u064A\u064E\u0634\u0652\u0641\u0650\u064A\u0646\u0650',
    french: 'Et quand je suis malade, c\'est Lui qui me guérit.',
    source: 'Sourate Ash-Shu\'ara, 26:80',
  },
  {
    arabic: '\u062D\u064E\u0633\u0652\u0628\u064F\u0646\u064E\u0627 \u0627\u0644\u0644\u0651\u064E\u0647\u064F \u0648\u064E\u0646\u0650\u0639\u0652\u0645\u064E \u0627\u0644\u0648\u064E\u0643\u0650\u064A\u0644\u064F',
    french: 'Allah nous suffit, Il est notre meilleur Garant.',
    source: 'Sourate Al-Imran, 3:173',
  },
];

// ═══════════════════════════════════════════════════════
// PROGRAM DATA
// ═══════════════════════════════════════════════════════

interface ChecklistItem {
  id: string;
  label: string;
  arabic?: string;
  repetitions?: string;
}

function getMorningRoutine(type: ProgramType): ChecklistItem[] {
  const base: ChecklistItem[] = [
    { id: 'fatiha', label: 'Al-Fatiha', arabic: '\u0633\u0648\u0631\u0629 \u0627\u0644\u0641\u0627\u062A\u062D\u0629', repetitions: type === 'intensive' ? '7x' : '3x' },
    { id: 'kursi', label: 'Ayat Al-Kursi', arabic: '\u0622\u064A\u0629 \u0627\u0644\u0643\u0631\u0633\u064A', repetitions: type === 'prevention' ? '1x' : '3x' },
    { id: 'ikhlas', label: 'Sourate Al-Ikhlas', arabic: '\u0633\u0648\u0631\u0629 \u0627\u0644\u0625\u062E\u0644\u0627\u0635', repetitions: '3x' },
    { id: 'falaq', label: 'Sourate Al-Falaq', arabic: '\u0633\u0648\u0631\u0629 \u0627\u0644\u0641\u0644\u0642', repetitions: '3x' },
    { id: 'nas', label: 'Sourate An-Nas', arabic: '\u0633\u0648\u0631\u0629 \u0627\u0644\u0646\u0627\u0633', repetitions: '3x' },
    { id: 'adhkar-matin', label: 'Adhkar du matin', arabic: '\u0623\u0630\u0643\u0627\u0631 \u0627\u0644\u0635\u0628\u0627\u062D' },
  ];

  if (type !== 'prevention') {
    base.splice(2, 0, {
      id: 'baqara-end',
      label: 'Sourate Al-Baqara v. 285-286',
      arabic: '\u062E\u0648\u0627\u062A\u064A\u0645 \u0633\u0648\u0631\u0629 \u0627\u0644\u0628\u0642\u0631\u0629',
      repetitions: '1x',
    });
  }

  if (type === 'intensive') {
    base.push(
      { id: 'ruqya-verses', label: 'Versets de roqya spécifiques', arabic: '\u0622\u064A\u0627\u062A \u0627\u0644\u0631\u0642\u064A\u0629', repetitions: '3x' },
      { id: 'dua-protection', label: 'Doua de protection du matin', arabic: '\u0628\u0650\u0633\u0652\u0645\u0650 \u0627\u0644\u0644\u0651\u064E\u0647\u0650 \u0627\u0644\u0651\u064E\u0630\u0650\u064A \u0644\u0627 \u064A\u064E\u0636\u064F\u0631\u0651\u064F \u0645\u064E\u0639\u064E \u0627\u0633\u0652\u0645\u0650\u0647\u0650 \u0634\u064E\u064A\u0652\u0621\u064C', repetitions: '3x' }
    );
  }

  return base;
}

function getEveningRoutine(type: ProgramType): ChecklistItem[] {
  const base: ChecklistItem[] = [
    { id: 'kursi-soir', label: 'Ayat Al-Kursi avant de dormir', arabic: '\u0622\u064A\u0629 \u0627\u0644\u0643\u0631\u0633\u064A', repetitions: '1x' },
    { id: 'mulk', label: 'Sourate Al-Mulk', arabic: '\u0633\u0648\u0631\u0629 \u0627\u0644\u0645\u0644\u0643', repetitions: '1x' },
    { id: '3qul', label: 'Les 3 Qul (souffler dans les mains)', arabic: '\u0627\u0644\u0645\u0639\u0648\u0630\u0627\u062A', repetitions: '3x' },
    { id: 'adhkar-soir', label: 'Adhkar du soir', arabic: '\u0623\u0630\u0643\u0627\u0631 \u0627\u0644\u0645\u0633\u0627\u0621' },
  ];

  if (type !== 'prevention') {
    base.push({
      id: 'dua-ruqya',
      label: 'Douas spécifiques de roqya',
      arabic: '\u0623\u064E\u0639\u064F\u0648\u0630\u064F \u0628\u0650\u0643\u064E\u0644\u0650\u0645\u064E\u0627\u062A\u0650 \u0627\u0644\u0644\u0651\u064E\u0647\u0650 \u0627\u0644\u062A\u0651\u064E\u0627\u0645\u0651\u064E\u0627\u062A\u0650 \u0645\u0650\u0646\u0652 \u0634\u064E\u0631\u0651\u0650 \u0645\u064E\u0627 \u062E\u064E\u0644\u064E\u0642\u064E',
    });
  }

  if (type === 'intensive') {
    base.push(
      { id: 'sajda', label: 'Sourate As-Sajda', arabic: '\u0633\u0648\u0631\u0629 \u0627\u0644\u0633\u062C\u062F\u0629', repetitions: '1x' },
      { id: 'dua-sleep', label: 'Doua avant le sommeil', arabic: '\u0628\u0627\u0633\u0645\u0643 \u0627\u0644\u0644\u0647\u0645 \u0623\u0645\u0648\u062A \u0648\u0623\u062D\u064A\u0627' }
    );
  }

  return base;
}

function getBonusActions(type: ProgramType): ChecklistItem[] {
  if (type === 'prevention') {
    return [
      { id: 'bonus-sadaqa', label: 'Faire une sadaqa (aumône)', arabic: '\u0635\u062F\u0642\u0629' },
      { id: 'bonus-dhikr', label: 'Dhikr supplémentaire (100x SubhanAllah, Alhamdulillah, Allahu Akbar)', arabic: '\u0630\u0643\u0631' },
    ];
  }

  if (type === 'light') {
    return [
      { id: 'bonus-baqara', label: 'Écouter Sourate Al-Baqara', arabic: '\u0633\u0648\u0631\u0629 \u0627\u0644\u0628\u0642\u0631\u0629' },
      { id: 'bonus-eau', label: 'Boire de l\'eau coranisée', arabic: '\u0645\u0627\u0621 \u0645\u0642\u0631\u0648\u0621 \u0639\u0644\u064A\u0647' },
      { id: 'bonus-huile', label: 'Se masser avec huile d\'olive coranisée', arabic: '\u0632\u064A\u062A \u0632\u064A\u062A\u0648\u0646 \u0645\u0642\u0631\u0648\u0621 \u0639\u0644\u064A\u0647' },
      { id: 'bonus-sadaqa', label: 'Faire une sadaqa (aumône)', arabic: '\u0635\u062F\u0642\u0629' },
    ];
  }

  // intensive
  return [
    { id: 'bonus-baqara', label: 'Lire/écouter Sourate Al-Baqara en entier', arabic: '\u0633\u0648\u0631\u0629 \u0627\u0644\u0628\u0642\u0631\u0629 \u0643\u0627\u0645\u0644\u0629' },
    { id: 'bonus-eau', label: 'Boire de l\'eau coranisée', arabic: '\u0645\u0627\u0621 \u0645\u0642\u0631\u0648\u0621 \u0639\u0644\u064A\u0647' },
    { id: 'bonus-huile', label: 'Se masser avec huile d\'olive coranisée', arabic: '\u0632\u064A\u062A \u0632\u064A\u062A\u0648\u0646 \u0645\u0642\u0631\u0648\u0621 \u0639\u0644\u064A\u0647' },
    { id: 'bonus-miel', label: 'Prendre du miel pur le matin à jeun', arabic: '\u0639\u0633\u0644' },
    { id: 'bonus-sidr', label: 'Bain avec eau de Sidr (feuilles de jujubier)', arabic: '\u0645\u0627\u0621 \u0627\u0644\u0633\u062F\u0631' },
    { id: 'bonus-sadaqa', label: 'Faire une sadaqa (aumône)', arabic: '\u0635\u062F\u0642\u0629' },
  ];
}

const PROGRAM_INFO: Record<ProgramType, { title: string; duration: number; description: string; icon: typeof Shield }> = {
  prevention: {
    title: 'Programme Prévention',
    duration: 7,
    description: 'Un programme de 7 jours pour renforcer votre protection spirituelle quotidienne et prévenir les afflictions.',
    icon: Shield,
  },
  light: {
    title: 'Programme Guérison Légère',
    duration: 15,
    description: 'Un programme de 15 jours adapté aux symptômes modérés, avec des pratiques ciblées pour le mauvais oeil et les afflictions légères.',
    icon: Heart,
  },
  intensive: {
    title: 'Programme Guérison Intensive',
    duration: 30,
    description: 'Un programme complet de 30 jours pour les cas plus sévères, avec des pratiques intensives de roqya shar\'iyya.',
    icon: Flame,
  },
};

const SEVERITY_LABELS: Record<Severity, { label: string; color: string; bg: string }> = {
  leger: { label: 'Léger', color: 'text-green-islamic', bg: 'bg-green-islamic/10' },
  modere: { label: 'Modéré', color: 'text-gold', bg: 'bg-gold/10' },
  severe: { label: 'Sévère', color: 'text-red-700', bg: 'bg-red-50' },
};

const COMPLETION_MESSAGES = [
  'MashaAllah ! Continuez ainsi.',
  'Qu\'Allah vous accorde la guérison.',
  'Chaque effort compte auprès d\'Allah.',
  'La constance est la clé de la réussite.',
  'Qu\'Allah vous facilite ce chemin.',
  'BarakAllahu fikum, persévérez.',
];

// ═══════════════════════════════════════════════════════
// STORAGE HELPERS
// ═══════════════════════════════════════════════════════

const STORAGE_KEYS = {
  answers: 'ruqya_questionnaire_answers',
  program: 'ruqya_program_state',
};

function loadFromStorage<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function saveToStorage<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // silently ignore
  }
}

// ═══════════════════════════════════════════════════════
// DIAGNOSIS ENGINE
// ═══════════════════════════════════════════════════════

function diagnose(answers: QuestionnaireAnswers): { type: ProgramType; severity: Severity; details: DiagnosisDetails } {
  const totalPhysical = answers.physicalSymptoms.length;
  const totalPsych = answers.psychologicalSymptoms.length;
  const totalSpecific = answers.specificSymptoms.length;
  const totalSymptoms = totalPhysical + totalPsych + totalSpecific;

  // ── Score computation ──
  let score = 0;

  // Duration weight (0-3)
  if (answers.duration === '>1an') score += 3;
  else if (answers.duration === '6-12') score += 2;
  else if (answers.duration === '1-6') score += 1;

  // Prayer & Quran practice — lower practice = slightly more vulnerable (0-4)
  if (answers.prayer === 'rarement') score += 2;
  else if (answers.prayer === 'parfois') score += 1;
  if (answers.quran === 'jamais') score += 2;
  else if (answers.quran === 'rarement') score += 1;

  // Symptom counts — scaled to keep proportional (max ~24 raw)
  // Divide to avoid score explosion with many checkboxes
  score += totalPhysical * 0.8;
  score += totalPsych * 0.8;
  score += totalSpecific * 1.2;

  // Suspected cause (0-3)
  if (answers.suspectedCause === 'mass') score += 3;
  else if (answers.suspectedCause === 'sihr') score += 2;
  else if (answers.suspectedCause === 'ayn') score += 1;

  // ── Detect dominant condition ──
  // Key specific symptoms that point to each condition
  const aynIndicators = ['headaches', 'fatigue', 'heaviness', 'palpitations'].filter(s => answers.physicalSymptoms.includes(s)).length;
  const sihrIndicators = ['blockages', 'relationshipProblems', 'badLuck', 'behaviorChange'].filter(s => answers.specificSymptoms.includes(s)).length
    + (['nightmares'].filter(s => answers.specificSymptoms.includes(s)).length);
  const massIndicators = ['quranReaction', 'presence', 'behaviorChange'].filter(s => answers.specificSymptoms.includes(s)).length
    + (['isolation', 'avoidPrayer'].filter(s => answers.psychologicalSymptoms.includes(s)).length);

  let dominantCondition: 'ayn' | 'sihr' | 'mass' | 'general' = 'general';
  if (answers.suspectedCause === 'ayn' || answers.suspectedCause === 'sihr' || answers.suspectedCause === 'mass') {
    dominantCondition = answers.suspectedCause;
  } else {
    // Auto-detect from symptoms
    const maxInd = Math.max(aynIndicators, sihrIndicators, massIndicators);
    if (maxInd >= 2) {
      if (massIndicators === maxInd) dominantCondition = 'mass';
      else if (sihrIndicators === maxInd) dominantCondition = 'sihr';
      else dominantCondition = 'ayn';
    }
  }

  // ── Determine program ──
  // Prevention: very few symptoms OR user selected prevention
  if (answers.suspectedCause === 'prevention' || (totalSymptoms <= 2 && score < 5)) {
    return {
      type: 'prevention', severity: 'leger',
      details: { score, totalSymptoms, dominantCondition, aynIndicators, sihrIndicators, massIndicators },
    };
  }

  // Light: mild to moderate (score 0-10, symptoms ≤8)
  if (score < 10 || (totalSymptoms <= 5 && score < 13)) {
    return {
      type: 'light', severity: 'modere',
      details: { score, totalSymptoms, dominantCondition, aynIndicators, sihrIndicators, massIndicators },
    };
  }

  // Intensive: everything above
  return {
    type: 'intensive', severity: 'severe',
    details: { score, totalSymptoms, dominantCondition, aynIndicators, sihrIndicators, massIndicators },
  };
}

// ═══════════════════════════════════════════════════════
// COMPONENTS
// ═══════════════════════════════════════════════════════

function StepProgressBar({ current, total }: { current: number; total: number }) {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-2">
        {Array.from({ length: total }, (_, i) => (
          <div key={i} className="flex items-center flex-1 last:flex-none">
            <div
              className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold transition-all duration-300 ${
                i < current
                  ? 'bg-green-islamic text-white'
                  : i === current
                    ? 'bg-gold text-white ring-4 ring-gold/20'
                    : 'bg-cream-dark text-text-secondary'
              }`}
            >
              {i < current ? <Check className="h-4 w-4" /> : i + 1}
            </div>
            {i < total - 1 && (
              <div className="flex-1 mx-2">
                <div className="h-0.5 w-full rounded bg-cream-dark">
                  <div
                    className="h-full rounded bg-green-islamic transition-all duration-500"
                    style={{ width: i < current ? '100%' : '0%' }}
                  />
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function QuoteCard({ index }: { index: number }) {
  const quote = MOTIVATIONAL_QUOTES[index % MOTIVATIONAL_QUOTES.length];
  return (
    <div className="my-8 rounded-2xl border border-green-islamic/10 bg-green-islamic/5 p-6 text-center">
      <p className="text-xl leading-loose text-green-islamic" style={{ fontFamily: "'Amiri', 'Times New Roman', serif" }} dir="rtl">
        {quote.arabic}
      </p>
      <p className="mt-3 text-sm italic text-text-secondary">{quote.french}</p>
      <p className="mt-1 text-xs font-medium text-gold">{quote.source}</p>
    </div>
  );
}

// ═══════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════

export default function Programme() {
  // Determine initial view from localStorage
  const [view, setView] = useState<View>(() => {
    const program = loadFromStorage<ProgramState>(STORAGE_KEYS.program);
    if (program && program.startDate) return 'tracker';
    const answers = loadFromStorage<QuestionnaireAnswers>(STORAGE_KEYS.answers);
    if (answers && answers.suspectedCause) return 'result';
    return 'questionnaire';
  });

  const [step, setStep] = useState(0);
  const [completionMsg, setCompletionMsg] = useState<string | null>(null);

  const [answers, setAnswers] = useState<QuestionnaireAnswers>(() => {
    const saved = loadFromStorage<QuestionnaireAnswers>(STORAGE_KEYS.answers);
    return saved || {
      duration: '',
      previousRuqya: '',
      prayer: '',
      quran: '',
      physicalSymptoms: [],
      psychologicalSymptoms: [],
      specificSymptoms: [],
      suspectedCause: '',
      consultedDoctor: '',
    };
  });

  const [program, setProgram] = useState<ProgramState>(() => {
    const saved = loadFromStorage<ProgramState>(STORAGE_KEYS.program);
    return saved || {
      type: 'prevention',
      severity: 'leger',
      startDate: '',
      currentDay: 1,
      totalDays: 7,
      dailyProgress: {},
    };
  });

  // Save answers when they change
  useEffect(() => {
    saveToStorage(STORAGE_KEYS.answers, answers);
  }, [answers]);

  // Save program when it changes
  useEffect(() => {
    saveToStorage(STORAGE_KEYS.program, program);
  }, [program]);

  // Calculate current day from start date
  useEffect(() => {
    if (program.startDate) {
      const start = new Date(program.startDate);
      const today = new Date();
      start.setHours(0, 0, 0, 0);
      today.setHours(0, 0, 0, 0);
      const diff = Math.floor((today.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
      const currentDay = Math.max(1, Math.min(diff, program.totalDays));
      if (currentDay !== program.currentDay) {
        setProgram((prev) => ({ ...prev, currentDay }));
      }
    }
  }, [program.startDate, program.totalDays, program.currentDay]);

  // ═══ QUESTIONNAIRE HANDLERS ═══

  const updateAnswer = useCallback(<K extends keyof QuestionnaireAnswers>(key: K, value: QuestionnaireAnswers[K]) => {
    setAnswers((prev) => ({ ...prev, [key]: value }));
  }, []);

  const toggleSymptom = useCallback((key: 'physicalSymptoms' | 'psychologicalSymptoms' | 'specificSymptoms', symptom: string) => {
    setAnswers((prev) => {
      const arr = prev[key];
      return {
        ...prev,
        [key]: arr.includes(symptom) ? arr.filter((s) => s !== symptom) : [...arr, symptom],
      };
    });
  }, []);

  const canGoNext = (): boolean => {
    if (step === 0) return !!(answers.duration && answers.previousRuqya && answers.prayer && answers.quran);
    if (step === 1) return true; // checkboxes are optional
    if (step === 2) return true;
    if (step === 3) return true;
    if (step === 4) return !!(answers.suspectedCause && answers.consultedDoctor);
    return false;
  };

  const [diagnosisDetails, setDiagnosisDetails] = useState<DiagnosisDetails | null>(null);

  const handleFinishQuestionnaire = () => {
    const { type, severity, details } = diagnose(answers);
    const info = PROGRAM_INFO[type];
    setDiagnosisDetails(details);
    setProgram({
      type,
      severity,
      startDate: '',
      currentDay: 1,
      totalDays: info.duration,
      dailyProgress: {},
    });
    setView('result');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleStartProgram = () => {
    const today = new Date().toISOString().split('T')[0];
    setProgram((prev) => ({ ...prev, startDate: today, currentDay: 1 }));
    setView('tracker');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleRestart = () => {
    localStorage.removeItem(STORAGE_KEYS.answers);
    localStorage.removeItem(STORAGE_KEYS.program);
    setAnswers({
      duration: '',
      previousRuqya: '',
      prayer: '',
      quran: '',
      physicalSymptoms: [],
      psychologicalSymptoms: [],
      specificSymptoms: [],
      suspectedCause: '',
      consultedDoctor: '',
    });
    setProgram({
      type: 'prevention',
      severity: 'leger',
      startDate: '',
      currentDay: 1,
      totalDays: 7,
      dailyProgress: {},
    });
    setStep(0);
    setView('questionnaire');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // ═══ TRACKER HANDLERS ═══

  const toggleChecklist = (category: 'morning' | 'evening' | 'bonus', itemId: string) => {
    const day = program.currentDay;
    setProgram((prev) => {
      const dayProgress = prev.dailyProgress[day] || { morning: [], evening: [], bonus: [] };
      const current = dayProgress[category];
      const updated = current.includes(itemId)
        ? current.filter((id) => id !== itemId)
        : [...current, itemId];

      if (!current.includes(itemId)) {
        setCompletionMsg(COMPLETION_MESSAGES[Math.floor(Math.random() * COMPLETION_MESSAGES.length)]);
        setTimeout(() => setCompletionMsg(null), 2500);
      }

      return {
        ...prev,
        dailyProgress: {
          ...prev.dailyProgress,
          [day]: { ...dayProgress, [category]: updated },
        },
      };
    });
  };

  const getDayProgress = (day: number): DayProgress => {
    return program.dailyProgress[day] || { morning: [], evening: [], bonus: [] };
  };

  const getDayCompletionPercent = (day: number): number => {
    const progress = getDayProgress(day);
    const morningItems = getMorningRoutine(program.type);
    const eveningItems = getEveningRoutine(program.type);
    const bonusItems = getBonusActions(program.type);
    const total = morningItems.length + eveningItems.length + bonusItems.length;
    if (total === 0) return 0;
    const done = progress.morning.length + progress.evening.length + progress.bonus.length;
    return Math.round((done / total) * 100);
  };

  const getOverallProgress = (): number => {
    let totalDone = 0;
    let totalItems = 0;
    const morningItems = getMorningRoutine(program.type);
    const eveningItems = getEveningRoutine(program.type);
    const bonusItems = getBonusActions(program.type);
    const perDay = morningItems.length + eveningItems.length + bonusItems.length;

    for (let d = 1; d <= program.totalDays; d++) {
      totalItems += perDay;
      const progress = getDayProgress(d);
      totalDone += progress.morning.length + progress.evening.length + progress.bonus.length;
    }
    if (totalItems === 0) return 0;
    return Math.round((totalDone / totalItems) * 100);
  };

  // ═══════════════════════════════════════════════════════
  // RENDER: QUESTIONNAIRE
  // ═══════════════════════════════════════════════════════

  const STEP_TITLES = [
    { title: 'Informations générales', subtitle: 'Aidez-nous à mieux comprendre votre situation actuelle.' },
    { title: 'Symptômes physiques', subtitle: 'Cochez les symptômes physiques que vous ressentez.' },
    { title: 'Symptômes psychologiques', subtitle: 'Cochez les symptômes émotionnels ou psychologiques ressentis.' },
    { title: 'Symptômes spécifiques', subtitle: 'Certains signes peuvent orienter vers un type d\'affliction.' },
    { title: 'Contexte', subtitle: 'Quelques informations complémentaires pour affiner l\'orientation.' },
  ];

  function RadioOption({ name, value, checked, label, onChange }: {
    name: string; value: string; checked: boolean; label: string; onChange: () => void;
  }) {
    return (
      <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-cream-dark bg-white/70 px-4 py-3.5 transition-all hover:border-green-islamic/30 hover:bg-white has-[:checked]:border-green-islamic has-[:checked]:bg-green-islamic/5 has-[:checked]:ring-1 has-[:checked]:ring-green-islamic/20">
        <input
          type="radio"
          name={name}
          value={value}
          checked={checked}
          onChange={onChange}
          className="h-4 w-4 accent-green-islamic"
        />
        <span className="text-sm font-medium text-text-primary">{label}</span>
      </label>
    );
  }

  function CheckboxOption({ checked, label, onChange }: {
    checked: boolean; label: string; onChange: () => void;
  }) {
    return (
      <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-cream-dark bg-white/70 px-4 py-3.5 transition-all hover:border-green-islamic/30 hover:bg-white has-[:checked]:border-green-islamic has-[:checked]:bg-green-islamic/5 has-[:checked]:ring-1 has-[:checked]:ring-green-islamic/20">
        <input
          type="checkbox"
          checked={checked}
          onChange={onChange}
          className="h-4 w-4 shrink-0 rounded accent-green-islamic"
        />
        <span className="text-sm font-medium text-text-primary">{label}</span>
      </label>
    );
  }

  function renderStep() {
    switch (step) {
      case 0:
        return (
          <div className="space-y-6">
            <div>
              <label className="mb-2 block text-sm font-semibold text-text-primary">
                Depuis combien de temps ressentez-vous ces symptômes ?
              </label>
              <div className="grid gap-2 sm:grid-cols-2">
                {[
                  { v: '<1mois', l: 'Moins d\'un mois' },
                  { v: '1-6', l: '1 à 6 mois' },
                  { v: '6-12', l: '6 à 12 mois' },
                  { v: '>1an', l: 'Plus d\'un an' },
                ].map((opt) => (
                  <RadioOption
                    key={opt.v}
                    name="duration"
                    value={opt.v}
                    checked={answers.duration === opt.v}
                    label={opt.l}
                    onChange={() => updateAnswer('duration', opt.v)}
                  />
                ))}
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-text-primary">
                Avez-vous déjà fait une roqya auparavant ?
              </label>
              <div className="grid gap-2 sm:grid-cols-2">
                <RadioOption name="previousRuqya" value="oui" checked={answers.previousRuqya === 'oui'} label="Oui" onChange={() => updateAnswer('previousRuqya', 'oui')} />
                <RadioOption name="previousRuqya" value="non" checked={answers.previousRuqya === 'non'} label="Non" onChange={() => updateAnswer('previousRuqya', 'non')} />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-text-primary">
                Pratiquez-vous vos 5 prières quotidiennes ?
              </label>
              <div className="grid gap-2 sm:grid-cols-2">
                {[
                  { v: 'toujours', l: 'Toujours' },
                  { v: 'souvent', l: 'Souvent' },
                  { v: 'parfois', l: 'Parfois' },
                  { v: 'rarement', l: 'Rarement' },
                ].map((opt) => (
                  <RadioOption
                    key={opt.v}
                    name="prayer"
                    value={opt.v}
                    checked={answers.prayer === opt.v}
                    label={opt.l}
                    onChange={() => updateAnswer('prayer', opt.v)}
                  />
                ))}
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-text-primary">
                Lisez-vous le Coran régulièrement ?
              </label>
              <div className="grid gap-2 sm:grid-cols-2">
                {[
                  { v: 'quotidiennement', l: 'Quotidiennement' },
                  { v: 'hebdomadaire', l: 'Hebdomadaire' },
                  { v: 'rarement', l: 'Rarement' },
                  { v: 'jamais', l: 'Jamais' },
                ].map((opt) => (
                  <RadioOption
                    key={opt.v}
                    name="quran"
                    value={opt.v}
                    checked={answers.quran === opt.v}
                    label={opt.l}
                    onChange={() => updateAnswer('quran', opt.v)}
                  />
                ))}
              </div>
            </div>
          </div>
        );

      case 1:
        return (
          <div className="space-y-2">
            <p className="mb-3 text-xs italic text-text-secondary/80 rounded-lg bg-gold/5 border border-gold/15 px-3 py-2">
              ⚠️ Ces symptômes sont des indications basées sur l'expérience des praticiens de roqya. Ce ne sont que des hypothèses qui orientent — chacun de ces signes peut avoir une cause totalement différente. Ne vous enfermez pas dans un diagnostic.
            </p>
            {PHYSICAL_SYMPTOMS.map((s) => (
              <CheckboxOption
                key={s}
                checked={answers.physicalSymptoms.includes(s)}
                label={s}
                onChange={() => toggleSymptom('physicalSymptoms', s)}
              />
            ))}
          </div>
        );

      case 2:
        return (
          <div className="space-y-2">
            <p className="mb-3 text-xs italic text-text-secondary/80 rounded-lg bg-gold/5 border border-gold/15 px-3 py-2">
              ⚠️ Ces symptômes peuvent avoir des causes parfaitement naturelles (stress, fatigue, épreuves de la vie...). Cochez ce qui vous concerne, le programme s'adaptera à votre situation.
            </p>
            {PSYCHOLOGICAL_SYMPTOMS.map((s) => (
              <CheckboxOption
                key={s}
                checked={answers.psychologicalSymptoms.includes(s)}
                label={s}
                onChange={() => toggleSymptom('psychologicalSymptoms', s)}
              />
            ))}
          </div>
        );

      case 3:
        return (
          <div className="space-y-2">
            <p className="mb-3 text-xs italic text-text-secondary/80 rounded-lg bg-gold/5 border border-gold/15 px-3 py-2">
              ⚠️ Rappel : aucun de ces signes ne constitue une preuve d'atteinte occulte. Ce sont des indications qui nous orientent, rien de plus. La roqya est bénéfique dans tous les cas, que l'on soit atteint ou non.
            </p>
            {SPECIFIC_SYMPTOMS.map((s) => (
              <CheckboxOption
                key={s}
                checked={answers.specificSymptoms.includes(s)}
                label={s}
                onChange={() => toggleSymptom('specificSymptoms', s)}
              />
            ))}
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div>
              <label className="mb-2 block text-sm font-semibold text-text-primary">
                Pensez-vous être atteint(e) de :
              </label>
              <div className="grid gap-2 sm:grid-cols-2">
                {[
                  { v: 'ayn', l: 'Mauvais oeil (\'ayn)' },
                  { v: 'sihr', l: 'Sorcellerie (sihr)' },
                  { v: 'mass', l: 'Possession (mass)' },
                  { v: 'unknown', l: 'Je ne sais pas' },
                  { v: 'prevention', l: 'Prévention uniquement' },
                ].map((opt) => (
                  <RadioOption
                    key={opt.v}
                    name="suspectedCause"
                    value={opt.v}
                    checked={answers.suspectedCause === opt.v}
                    label={opt.l}
                    onChange={() => updateAnswer('suspectedCause', opt.v)}
                  />
                ))}
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-text-primary">
                Avez-vous déjà cherché d'autres moyens pour résoudre ces symptômes ?
              </label>
              <div className="grid gap-2 sm:grid-cols-2">
                <RadioOption name="consultedDoctor" value="oui" checked={answers.consultedDoctor === 'oui'} label="Oui" onChange={() => updateAnswer('consultedDoctor', 'oui')} />
                <RadioOption name="consultedDoctor" value="non" checked={answers.consultedDoctor === 'non'} label="Non" onChange={() => updateAnswer('consultedDoctor', 'non')} />
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  }

  // ═══════════════════════════════════════════════════════
  // RENDER: RESULT
  // ═══════════════════════════════════════════════════════

  function renderResult() {
    const info = PROGRAM_INFO[program.type];
    const sev = SEVERITY_LABELS[program.severity];
    const IconComp = info.icon;

    return (
      <div className="mx-auto max-w-2xl">
        <div className="text-center">
          <h1 className="font-heading text-3xl font-bold text-green-islamic md:text-4xl">
            Votre programme personnalisé
          </h1>
          <p className="mt-3 text-text-secondary">
            Basé sur vos réponses, voici le programme recommandé pour vous.
          </p>
        </div>

        <QuoteCard index={1} />

        {/* Diagnosis summary */}
        <div className="mt-6 rounded-2xl border border-cream-dark bg-white/80 p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-islamic/10">
              <IconComp className="h-6 w-6 text-green-islamic" />
            </div>
            <div>
              <h2 className="font-heading text-xl font-bold text-text-primary">{info.title}</h2>
              <div className="flex items-center gap-2 mt-1">
                <span className={`inline-block rounded-full px-3 py-0.5 text-xs font-semibold ${sev.color} ${sev.bg}`}>
                  {sev.label}
                </span>
                <span className="text-sm text-text-secondary">{info.duration} jours</span>
              </div>
            </div>
          </div>

          <p className="text-sm leading-relaxed text-text-secondary">
            {info.description}
          </p>

          {/* ── Analyse détaillée ── */}
          {diagnosisDetails && (
            <div className="mt-5 rounded-xl border border-cream-dark bg-cream p-4">
              <h3 className="mb-3 text-sm font-semibold text-text-primary">Analyse de vos réponses</h3>
              <div className="grid gap-3 sm:grid-cols-3">
                <div className="rounded-lg bg-white/70 px-3 py-2.5 text-center">
                  <div className="text-2xl font-bold text-green-islamic">{diagnosisDetails.totalSymptoms}</div>
                  <div className="text-[11px] text-text-secondary">symptômes identifiés</div>
                </div>
                <div className="rounded-lg bg-white/70 px-3 py-2.5 text-center">
                  <div className="text-2xl font-bold text-gold">
                    {answers.duration === '>1an' ? '+1 an' : answers.duration === '6-12' ? '6-12 mois' : answers.duration === '1-6' ? '1-6 mois' : '<1 mois'}
                  </div>
                  <div className="text-[11px] text-text-secondary">durée des symptômes</div>
                </div>
                <div className="rounded-lg bg-white/70 px-3 py-2.5 text-center">
                  <div className="text-2xl font-bold text-green-islamic">
                    {diagnosisDetails.dominantCondition === 'ayn' ? "Mauvais œil" :
                     diagnosisDetails.dominantCondition === 'sihr' ? "Sorcellerie" :
                     diagnosisDetails.dominantCondition === 'mass' ? "Possession" : "Général"}
                  </div>
                  <div className="text-[11px] text-text-secondary">orientation probable</div>
                </div>
              </div>

              {/* Indicateurs par type */}
              <div className="mt-3 space-y-1.5">
                {diagnosisDetails.aynIndicators > 0 && (
                  <div className="flex items-center gap-2">
                    <div className="h-2 rounded-full bg-green-islamic/20 flex-1">
                      <div className="h-full rounded-full bg-green-islamic transition-all" style={{ width: `${Math.min(diagnosisDetails.aynIndicators / 4 * 100, 100)}%` }} />
                    </div>
                    <span className="w-24 text-[11px] text-text-secondary">Mauvais œil ({diagnosisDetails.aynIndicators}/4)</span>
                  </div>
                )}
                {diagnosisDetails.sihrIndicators > 0 && (
                  <div className="flex items-center gap-2">
                    <div className="h-2 rounded-full bg-gold/20 flex-1">
                      <div className="h-full rounded-full bg-gold transition-all" style={{ width: `${Math.min(diagnosisDetails.sihrIndicators / 5 * 100, 100)}%` }} />
                    </div>
                    <span className="w-24 text-[11px] text-text-secondary">Sorcellerie ({diagnosisDetails.sihrIndicators}/5)</span>
                  </div>
                )}
                {diagnosisDetails.massIndicators > 0 && (
                  <div className="flex items-center gap-2">
                    <div className="h-2 rounded-full bg-red-200 flex-1">
                      <div className="h-full rounded-full bg-red-500 transition-all" style={{ width: `${Math.min(diagnosisDetails.massIndicators / 5 * 100, 100)}%` }} />
                    </div>
                    <span className="w-24 text-[11px] text-text-secondary">Possession ({diagnosisDetails.massIndicators}/5)</span>
                  </div>
                )}
              </div>

              {/* Conseil personnalisé */}
              <p className="mt-3 text-xs italic text-text-secondary leading-relaxed">
                {diagnosisDetails.dominantCondition === 'ayn' && "Vos symptômes orientent vers un possible mauvais œil ('ayn). Ce programme met l'accent sur les sourates protectrices (Al-Falaq, An-Nas) et les adhkar quotidiens."}
                {diagnosisDetails.dominantCondition === 'sihr' && "Vos symptômes montrent des signes pouvant être liés à de la sorcellerie (sihr). Le programme inclut les versets spécifiques contre la sorcellerie et l'écoute régulière de Sourate Al-Baqara."}
                {diagnosisDetails.dominantCondition === 'mass' && "Vos symptômes indiquent une possible atteinte par un djinn (mass). Le programme intensif inclut l'écoute quotidienne de Sourate Al-Baqara et des versets puissants contre la possession."}
                {diagnosisDetails.dominantCondition === 'general' && "Vos symptômes ne pointent pas vers une cause spécifique. Ce programme général renforcera votre protection spirituelle de manière globale, insha'Allah."}
              </p>
            </div>
          )}

          {/* Summary of what program includes */}
          <div className="mt-6 space-y-3">
            <h3 className="text-sm font-semibold text-text-primary">Ce programme comprend :</h3>
            <div className="grid gap-2 sm:grid-cols-2">
              <div className="flex items-start gap-2 rounded-xl bg-cream px-3 py-2.5">
                <Sun className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
                <span className="text-sm text-text-primary">Routine du matin ({getMorningRoutine(program.type).length} actions)</span>
              </div>
              <div className="flex items-start gap-2 rounded-xl bg-cream px-3 py-2.5">
                <Moon className="mt-0.5 h-4 w-4 shrink-0 text-green-islamic" />
                <span className="text-sm text-text-primary">Routine du soir ({getEveningRoutine(program.type).length} actions)</span>
              </div>
              <div className="flex items-start gap-2 rounded-xl bg-cream px-3 py-2.5">
                <Star className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
                <span className="text-sm text-text-primary">Actions bonus ({getBonusActions(program.type).length} actions)</span>
              </div>
              <div className="flex items-start gap-2 rounded-xl bg-cream px-3 py-2.5">
                <Calendar className="mt-0.5 h-4 w-4 shrink-0 text-green-islamic" />
                <span className="text-sm text-text-primary">Suivi quotidien sur {info.duration} jours</span>
              </div>
            </div>
          </div>
        </div>

        {/* Reminder */}
        {answers.consultedDoctor === 'non' && (
          <div className="mt-4 rounded-xl border border-gold/30 bg-gold/5 px-4 py-3">
            <p className="text-xs leading-relaxed text-text-secondary">
              <span className="font-semibold text-gold">Rappel :</span> N'hésitez pas à combiner ce programme spirituel avec tous les moyens qu'Allah a mis à votre disposition pour votre bien-être. La guérison vient d'Allah, et Il nous a donné de multiples voies pour y parvenir.
            </p>
          </div>
        )}

        {/* Actions */}
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <button
            onClick={handleStartProgram}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-green-islamic px-8 py-3.5 font-semibold text-white shadow-md transition hover:bg-gold"
          >
            <Sparkles className="h-5 w-5" />
            Commencer mon programme
          </button>
          <button
            onClick={handleRestart}
            className="inline-flex items-center justify-center gap-2 rounded-xl border-2 border-cream-dark px-6 py-3 text-sm font-medium text-text-secondary transition hover:border-green-islamic hover:text-green-islamic"
          >
            <RotateCcw className="h-4 w-4" />
            Refaire le questionnaire
          </button>
        </div>

        {/* Disclaimer */}
        <p className="mt-8 text-center text-xs text-text-secondary/70">
          Ce questionnaire est un outil d'orientation et ne constitue pas un diagnostic certifié.
        </p>
      </div>
    );
  }

  // ═══════════════════════════════════════════════════════
  // RENDER: TRACKER
  // ═══════════════════════════════════════════════════════

  function renderTracker() {
    const info = PROGRAM_INFO[program.type];
    const morningItems = getMorningRoutine(program.type);
    const eveningItems = getEveningRoutine(program.type);
    const bonusItems = getBonusActions(program.type);
    const dayProgress = getDayProgress(program.currentDay);
    const overallPercent = getOverallProgress();
    const dayPercent = getDayCompletionPercent(program.currentDay);

    function ChecklistRow({ item, category, checked }: {
      item: ChecklistItem;
      category: 'morning' | 'evening' | 'bonus';
      checked: boolean;
    }) {
      return (
        <button
          onClick={() => toggleChecklist(category, item.id)}
          className={`flex w-full items-start gap-3 rounded-xl border px-4 py-3 text-left transition-all ${
            checked
              ? 'border-green-islamic/20 bg-green-islamic/5'
              : 'border-cream-dark bg-white/70 hover:border-green-islamic/30 hover:bg-white'
          }`}
        >
          {checked ? (
            <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-green-islamic" />
          ) : (
            <Circle className="mt-0.5 h-5 w-5 shrink-0 text-text-secondary/40" />
          )}
          <div className="flex-1 min-w-0">
            <div className="flex items-baseline gap-2">
              <span className={`text-sm font-medium ${checked ? 'text-green-islamic line-through' : 'text-text-primary'}`}>
                {item.label}
              </span>
              {item.repetitions && (
                <span className="shrink-0 rounded-full bg-cream-dark px-2 py-0.5 text-[10px] font-bold text-text-secondary">
                  {item.repetitions}
                </span>
              )}
            </div>
            {item.arabic && (
              <p className="mt-0.5 text-base text-green-islamic/70" style={{ fontFamily: "'Amiri', 'Times New Roman', serif" }} dir="rtl">
                {item.arabic}
              </p>
            )}
          </div>
        </button>
      );
    }

    return (
      <div className="mx-auto max-w-2xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-2">
          <div>
            <h1 className="font-heading text-2xl font-bold text-green-islamic md:text-3xl">
              {info.title}
            </h1>
            <p className="mt-1 text-sm text-text-secondary">
              Jour {program.currentDay} sur {program.totalDays}
            </p>
          </div>
          <button
            onClick={handleRestart}
            className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-medium text-text-secondary transition hover:bg-cream-dark hover:text-green-islamic"
            title="Recommencer"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Nouveau
          </button>
        </div>

        {/* Overall progress */}
        <div className="rounded-2xl border border-cream-dark bg-white/80 p-4 shadow-sm mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-semibold text-text-primary">Progression globale</span>
            <span className="text-sm font-bold text-green-islamic">{overallPercent}%</span>
          </div>
          <div className="h-2.5 w-full overflow-hidden rounded-full bg-cream-dark">
            <div
              className="h-full rounded-full bg-green-islamic transition-all duration-500"
              style={{ width: `${overallPercent}%` }}
            />
          </div>
        </div>

        {/* Calendar overview */}
        <div className="rounded-2xl border border-cream-dark bg-white/80 p-4 shadow-sm mb-6">
          <div className="flex items-center gap-2 mb-3">
            <Calendar className="h-4 w-4 text-green-islamic" />
            <span className="text-sm font-semibold text-text-primary">Calendrier</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {Array.from({ length: program.totalDays }, (_, i) => {
              const day = i + 1;
              const percent = getDayCompletionPercent(day);
              const isCurrent = day === program.currentDay;
              const isDone = percent === 100;
              const isStarted = percent > 0;

              return (
                <button
                  key={day}
                  onClick={() => setProgram((prev) => ({ ...prev, currentDay: day }))}
                  className={`flex h-8 w-8 items-center justify-center rounded-lg text-xs font-semibold transition-all ${
                    isCurrent
                      ? 'bg-gold text-white ring-2 ring-gold/30'
                      : isDone
                        ? 'bg-green-islamic text-white'
                        : isStarted
                          ? 'bg-green-islamic/20 text-green-islamic'
                          : 'bg-cream-dark text-text-secondary'
                  }`}
                  title={`Jour ${day} — ${percent}%`}
                >
                  {isDone ? <Check className="h-3.5 w-3.5" /> : day}
                </button>
              );
            })}
          </div>
          <div className="mt-3 flex items-center gap-4 text-[10px] text-text-secondary">
            <span className="flex items-center gap-1"><span className="inline-block h-2.5 w-2.5 rounded bg-green-islamic" /> Terminé</span>
            <span className="flex items-center gap-1"><span className="inline-block h-2.5 w-2.5 rounded bg-green-islamic/20" /> En cours</span>
            <span className="flex items-center gap-1"><span className="inline-block h-2.5 w-2.5 rounded bg-gold" /> Aujourd'hui</span>
            <span className="flex items-center gap-1"><span className="inline-block h-2.5 w-2.5 rounded bg-cream-dark" /> À venir</span>
          </div>
        </div>

        {/* Day progress indicator */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-heading text-lg font-bold text-text-primary">
            Jour {program.currentDay}
          </h2>
          <span className={`rounded-full px-3 py-0.5 text-xs font-semibold ${
            dayPercent === 100
              ? 'bg-green-islamic/10 text-green-islamic'
              : dayPercent > 0
                ? 'bg-gold/10 text-gold'
                : 'bg-cream-dark text-text-secondary'
          }`}>
            {dayPercent}% complété
          </span>
        </div>

        {/* Completion toast */}
        {completionMsg && (
          <div className="mb-4 animate-pulse rounded-xl border border-green-islamic/20 bg-green-islamic/5 px-4 py-2.5 text-center text-sm font-medium text-green-islamic">
            {completionMsg}
          </div>
        )}

        {/* ═══ PREPARATION SPIRITUELLE ═══ */}
        <div className="mb-6 rounded-2xl border border-gold/20 bg-gold/5 p-5">
          <div className="flex items-center gap-2 mb-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gold/10">
              <Heart className="h-4 w-4 text-gold" />
            </div>
            <h3 className="font-heading text-base font-bold text-gold">Préparation avant la séance</h3>
          </div>
          <p className="text-sm text-text-secondary mb-3">
            La préparation spirituelle est essentielle. Prenez le temps de bien vous installer avant de commencer.
          </p>
          <div className="space-y-2 text-sm text-text-secondary">
            <div className="flex items-start gap-2.5">
              <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-green-islamic/10 text-[10px] font-bold text-green-islamic">1</span>
              <span><strong className="text-text-primary">S'allonger confortablement</strong> — mettez des écouteurs si possible (recommandé mais pas obligatoire), dans un endroit calme où personne ne vous dérangera.</span>
            </div>
            <div className="flex items-start gap-2.5">
              <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-green-islamic/10 text-[10px] font-bold text-green-islamic">2</span>
              <span><strong className="text-text-primary">Choisir le bon moment</strong> — un moment de la journée où vous êtes le plus concentré(e) et disponible mentalement.</span>
            </div>
            <div className="flex items-start gap-2.5">
              <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-green-islamic/10 text-[10px] font-bold text-green-islamic">3</span>
              <span><strong className="text-text-primary">Mettre l'intention (niyyah)</strong> — c'est LE plus important. Ayez la certitude qu'Allah va pulvériser tout le mal qui est en vous. La conviction fait toute la différence.</span>
            </div>
            <div className="flex items-start gap-2.5">
              <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-green-islamic/10 text-[10px] font-bold text-green-islamic">4</span>
              <span><strong className="text-text-primary">Préparer l'eau et l'huile</strong> — ouvrez un pack de bouteilles d'eau + une bouteille d'huile d'olive et placez-les à côté de vous pendant l'écoute. L'eau et l'huile reçoivent la baraka de la récitation.</span>
            </div>
            <div className="flex items-start gap-2.5">
              <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-green-islamic/10 text-[10px] font-bold text-green-islamic">5</span>
              <span><strong className="text-text-primary">Rester concentré(e)</strong> — suivez la récitation avec le cœur, ne vous laissez pas distraire. Fermez les yeux et écoutez chaque verset.</span>
            </div>
          </div>
        </div>

        {/* ═══ SÉANCE DE ROQYA (Vidéo YouTube) ═══ */}
        <div className="mb-6 rounded-2xl border border-cream-dark bg-white/80 p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-islamic/10">
              <Play className="h-4 w-4 text-green-islamic" />
            </div>
            <h3 className="font-heading text-base font-bold text-text-primary">Séance de Roqya du jour</h3>
          </div>
          <p className="text-sm text-text-secondary mb-4">
            Installez-vous selon les consignes ci-dessus, puis lancez la récitation.
          </p>
          <div className="aspect-video overflow-hidden rounded-xl bg-black">
            <iframe
              src={`https://www.youtube.com/embed/${
                program.type === 'intensive'
                  ? '_x-MfPJVIE4'
                  : program.type === 'light'
                    ? 'waxbAKa-9Fc'
                    : 'waxbAKa-9Fc'
              }?rel=0`}
              title="Séance de Roqya"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="h-full w-full"
            />
          </div>
          <p className="mt-3 text-xs text-text-secondary text-center">
            {program.type === 'intensive'
              ? 'Roqya Shariya complète — Sheikh Mishary Alafasy (1h13)'
              : 'Roqya — Sheikh Mishary Alafasy (chaîne officielle)'}
          </p>
        </div>

        {/* ═══ APRÈS LA SÉANCE — Questionnaire de ressenti ═══ */}
        <div className="mb-6 rounded-2xl border border-green-islamic/15 bg-green-islamic/5 p-5">
          <div className="flex items-center gap-2 mb-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-islamic/10">
              <BookOpen className="h-4 w-4 text-green-islamic" />
            </div>
            <h3 className="font-heading text-base font-bold text-green-islamic">Après la séance — Notez vos ressentis</h3>
          </div>
          <p className="text-sm text-text-secondary mb-3">
            Il est très important de noter ce que vous avez ressenti pendant la roqya. Cela aide à suivre votre progression.
          </p>
          <div className="space-y-2 text-sm text-text-secondary">
            <p>• Avez-vous ressenti des <strong className="text-text-primary">sensations physiques</strong> (chaleur, froid, picotements, douleurs, tremblements) ?</p>
            <p>• Avez-vous eu des <strong className="text-text-primary">pensées ou images</strong> particulières pendant l'écoute ?</p>
            <p>• Avez-vous <strong className="text-text-primary">pleuré, baillé</strong> ou ressenti de l'émotion ?</p>
            <p>• Vous êtes-vous <strong className="text-text-primary">endormi(e)</strong> pendant la séance ?</p>
          </div>
          <textarea
            className="mt-3 w-full resize-y rounded-xl border border-cream-dark bg-cream px-4 py-3 text-sm text-text-primary outline-none transition focus:border-green-islamic focus:ring-2 focus:ring-green-islamic/20"
            rows={3}
            placeholder="Décrivez ce que vous avez ressenti aujourd'hui..."
            onBlur={(e) => {
              if (e.target.value) {
                const key = `ruqya_notes_day_${program.currentDay}`;
                localStorage.setItem(key, e.target.value);
              }
            }}
            defaultValue={localStorage.getItem(`ruqya_notes_day_${program.currentDay}`) || ''}
          />
        </div>

        <div className="arabesque-separator mx-auto max-w-xs mb-6" />

        {/* Morning routine */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gold/10">
              <Sun className="h-4 w-4 text-gold" />
            </div>
            <h3 className="font-heading text-base font-bold text-text-primary">Routine du matin</h3>
            <span className="ml-auto text-xs text-text-secondary">
              {dayProgress.morning.length}/{morningItems.length}
            </span>
          </div>
          <div className="space-y-2">
            {morningItems.map((item) => (
              <ChecklistRow
                key={item.id}
                item={item}
                category="morning"
                checked={dayProgress.morning.includes(item.id)}
              />
            ))}
          </div>
        </div>

        <QuoteCard index={program.currentDay} />

        {/* Evening routine */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-islamic/10">
              <Moon className="h-4 w-4 text-green-islamic" />
            </div>
            <h3 className="font-heading text-base font-bold text-text-primary">Routine du soir</h3>
            <span className="ml-auto text-xs text-text-secondary">
              {dayProgress.evening.length}/{eveningItems.length}
            </span>
          </div>
          <div className="space-y-2">
            {eveningItems.map((item) => (
              <ChecklistRow
                key={item.id}
                item={item}
                category="evening"
                checked={dayProgress.evening.includes(item.id)}
              />
            ))}
          </div>
        </div>

        {/* Bonus actions */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gold/10">
              <Sparkles className="h-4 w-4 text-gold" />
            </div>
            <h3 className="font-heading text-base font-bold text-text-primary">Actions bonus</h3>
            <span className="ml-auto text-xs text-text-secondary">
              {dayProgress.bonus.length}/{bonusItems.length}
            </span>
          </div>
          <div className="space-y-2">
            {bonusItems.map((item) => (
              <ChecklistRow
                key={item.id}
                item={item}
                category="bonus"
                checked={dayProgress.bonus.includes(item.id)}
              />
            ))}
          </div>
        </div>

        {/* Tips section */}
        <div className="mt-8 rounded-2xl border border-green-islamic/10 bg-green-islamic/5 p-5">
          <div className="flex items-center gap-2 mb-3">
            <BookOpen className="h-4 w-4 text-green-islamic" />
            <h3 className="text-sm font-semibold text-green-islamic">Conseils du jour</h3>
          </div>
          <ul className="space-y-2 text-sm text-text-secondary">
            {program.type === 'intensive' && (
              <>
                <li className="flex items-start gap-2">
                  <Droplets className="mt-0.5 h-4 w-4 shrink-0 text-green-islamic/50" />
                  <span>Récitez les versets sur l'eau avant de la boire. L'eau coranisée est une sunna thérapeutique reconnue.</span>
                </li>
                <li className="flex items-start gap-2">
                  <Droplets className="mt-0.5 h-4 w-4 shrink-0 text-green-islamic/50" />
                  <span>Pour l'huile d'olive, récitez Al-Fatiha et les 3 Qul dessus, puis massez les zones douloureuses.</span>
                </li>
              </>
            )}
            <li className="flex items-start gap-2">
              <Droplets className="mt-0.5 h-4 w-4 shrink-0 text-green-islamic/50" />
              <span>La régularité est plus importante que la quantité. Mieux vaut peu mais constant.</span>
            </li>
            <li className="flex items-start gap-2">
              <Droplets className="mt-0.5 h-4 w-4 shrink-0 text-green-islamic/50" />
              <span>Faites vos invocations avec certitude et confiance en Allah.</span>
            </li>
          </ul>
        </div>

        {/* Disclaimer */}
        <p className="mt-6 text-center text-xs text-text-secondary/70">
          Ce programme est un outil d'accompagnement spirituel basé sur le Coran et la Sunnah.
          Il ne se substitue pas aux autres moyens qu'Allah a mis à notre disposition.
        </p>
      </div>
    );
  }

  // ═══════════════════════════════════════════════════════
  // MAIN RENDER
  // ═══════════════════════════════════════════════════════

  return (
    <div className="min-h-screen bg-cream py-16 md:py-24">
      <SEO
        title="Programme de Roqya personnalise - MaRoqya"
        description="Obtenez un programme de roqya personnalise selon vos symptomes. Questionnaire, suivi quotidien, videos de roqya et checklist d'adhkar."
        keywords="programme roqya personnalise, auto-roqya, roqya seul, adhkar quotidien, douas guerison, sourate protection"
        url="/programme"
      />
      <div className="mx-auto max-w-5xl px-4">
        {view === 'questionnaire' && (
          <div className="mx-auto max-w-2xl">
            {/* Page header */}
            <div className="text-center mb-8">
              <h1 className="font-heading text-3xl font-bold text-green-islamic md:text-4xl">
                Programme de Roqya personnalisé
              </h1>
              <p className="mt-3 text-text-secondary">
                Répondez à quelques questions pour recevoir un programme adapté à votre situation.
              </p>
            </div>

            {/* Progress */}
            <StepProgressBar current={step} total={5} />

            {/* Step content */}
            <div className="rounded-2xl border border-cream-dark bg-white/80 p-6 shadow-sm md:p-8">
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-1">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-green-islamic text-xs font-bold text-white">
                    {step + 1}
                  </span>
                  <h2 className="font-heading text-xl font-bold text-text-primary">
                    {STEP_TITLES[step].title}
                  </h2>
                </div>
                <p className="ml-8 text-sm text-text-secondary">{STEP_TITLES[step].subtitle}</p>
              </div>

              {renderStep()}

              {/* Navigation */}
              <div className="mt-8 flex items-center justify-between border-t border-cream-dark pt-5">
                <button
                  onClick={() => { setStep((s) => s - 1); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  disabled={step === 0}
                  className="flex items-center gap-1 text-sm font-medium text-text-secondary transition hover:text-green-islamic disabled:opacity-30 disabled:hover:text-text-secondary"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Précédent
                </button>

                {step < 4 ? (
                  <button
                    onClick={() => { setStep((s) => s + 1); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                    disabled={!canGoNext()}
                    className="flex items-center gap-1 rounded-xl bg-green-islamic px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-gold disabled:opacity-40"
                  >
                    Suivant
                    <ChevronRight className="h-4 w-4" />
                  </button>
                ) : (
                  <button
                    onClick={handleFinishQuestionnaire}
                    disabled={!canGoNext()}
                    className="flex items-center gap-2 rounded-xl bg-green-islamic px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-gold disabled:opacity-40"
                  >
                    <Sparkles className="h-4 w-4" />
                    Voir mon programme
                  </button>
                )}
              </div>
            </div>

            {/* Motivational quote between steps */}
            {step > 0 && step < 4 && <QuoteCard index={step} />}

            {/* Disclaimer */}
            <p className="mt-6 text-center text-xs text-text-secondary/70">
              Ce questionnaire est un outil d'orientation et ne constitue pas un diagnostic certifié.
            </p>
          </div>
        )}

        {view === 'result' && renderResult()}

        {view === 'tracker' && renderTracker()}
      </div>
    </div>
  );
}
