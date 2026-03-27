import { useState } from 'react';
import { CheckCircle2, ClipboardList } from 'lucide-react';

// ═══════════════════════════════════════════════════════
// TYPES & CONSTANTS
// ═══════════════════════════════════════════════════════

export interface SymptomEntry {
  date: string;
  week: number;
  scores: Record<string, number>;
}

const SYMPTOM_KEYS = [
  { id: 'fatigue', label: 'Fatigue / manque d\'énergie', emoji: '😴' },
  { id: 'anxiety', label: 'Anxiété / angoisse', emoji: '😰' },
  { id: 'sleep', label: 'Troubles du sommeil', emoji: '🌙' },
  { id: 'pain', label: 'Douleurs physiques', emoji: '💢' },
  { id: 'waswas', label: 'Pensées intrusives / waswas', emoji: '🌀' },
  { id: 'wellbeing', label: 'Bien-être général', emoji: '✨', inverted: true },
] as const;

export { SYMPTOM_KEYS };

// ═══════════════════════════════════════════════════════
// STORAGE
// ═══════════════════════════════════════════════════════

const STORAGE_KEY = 'ruqya_symptom_history';

export function loadSymptomHistory(): SymptomEntry[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveSymptomEntry(entry: SymptomEntry): SymptomEntry[] {
  const history = loadSymptomHistory();
  history.push(entry);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
  return history;
}

export function shouldShowWeeklyCheck(startDate: string): boolean {
  const start = new Date(startDate);
  const now = new Date();
  const daysSinceStart = Math.floor((now.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
  const currentWeek = Math.floor(daysSinceStart / 7) + 1;

  const history = loadSymptomHistory();
  const lastEntry = history[history.length - 1];

  // Toujours montrer si aucun bilan ou si nouvelle semaine
  if (!lastEntry) return daysSinceStart >= 0;
  return currentWeek > lastEntry.week;
}

export function getCurrentWeek(startDate: string): number {
  const start = new Date(startDate);
  const now = new Date();
  const daysSinceStart = Math.floor((now.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
  return Math.floor(daysSinceStart / 7) + 1;
}

// ═══════════════════════════════════════════════════════
// COMPONENT
// ═══════════════════════════════════════════════════════

interface SymptomTrackerProps {
  startDate: string;
  onComplete: () => void;
}

export default function SymptomTracker({ startDate, onComplete }: SymptomTrackerProps) {
  const week = getCurrentWeek(startDate);
  const [scores, setScores] = useState<Record<string, number>>(() => {
    const initial: Record<string, number> = {};
    SYMPTOM_KEYS.forEach((s) => { initial[s.id] = 5; });
    return initial;
  });
  const [saved, setSaved] = useState(false);

  const updateScore = (id: string, value: number) => {
    setScores((prev) => ({ ...prev, [id]: value }));
  };

  const handleSave = () => {
    const entry: SymptomEntry = {
      date: new Date().toISOString(),
      week,
      scores: { ...scores },
    };
    saveSymptomEntry(entry);
    setSaved(true);
    setTimeout(() => onComplete(), 2000);
  };

  if (saved) {
    return (
      <div className="card-islamic p-6 text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-green-islamic/10">
          <CheckCircle2 className="h-7 w-7 text-green-islamic" />
        </div>
        <h3 className="font-heading mt-4 text-lg font-bold text-green-islamic">
          Bilan sauvegardé !
        </h3>
        <p className="mt-2 text-sm text-text-secondary">
          Votre évaluation de la semaine {week} a été enregistrée. Consultez l'onglet Évolution pour voir votre progression.
        </p>
      </div>
    );
  }

  return (
    <div className="card-islamic p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gold/10">
          <ClipboardList className="h-5 w-5 text-gold" />
        </div>
        <div>
          <h3 className="font-heading text-lg font-bold text-text-primary">
            Bilan de la semaine {week}
          </h3>
          <p className="text-xs text-text-secondary">
            Évaluez chaque symptôme de 0 (absent) à 10 (très intense)
          </p>
        </div>
      </div>

      <div className="space-y-5">
        {SYMPTOM_KEYS.map((symptom) => (
          <div key={symptom.id}>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-text-primary">
                {symptom.emoji} {symptom.label}
              </label>
              <span className={`text-sm font-bold ${
                symptom.id === 'wellbeing'
                  ? scores[symptom.id] >= 7 ? 'text-green-islamic' : scores[symptom.id] >= 4 ? 'text-gold' : 'text-red-600'
                  : scores[symptom.id] <= 3 ? 'text-green-islamic' : scores[symptom.id] <= 6 ? 'text-gold' : 'text-red-600'
              }`}>
                {scores[symptom.id]}/10
              </span>
            </div>

            {/* Score buttons */}
            <div className="flex gap-1">
              {Array.from({ length: 11 }, (_, i) => i).map((val) => (
                <button
                  key={val}
                  onClick={() => updateScore(symptom.id, val)}
                  className={`flex-1 py-1.5 rounded text-xs font-medium transition-all ${
                    scores[symptom.id] === val
                      ? symptom.id === 'wellbeing'
                        ? val >= 7 ? 'bg-green-islamic text-white' : val >= 4 ? 'bg-gold text-white' : 'bg-red-500 text-white'
                        : val <= 3 ? 'bg-green-islamic text-white' : val <= 6 ? 'bg-gold text-white' : 'bg-red-500 text-white'
                      : 'bg-cream-dark/50 text-text-secondary hover:bg-cream-dark'
                  }`}
                >
                  {val}
                </button>
              ))}
            </div>

            {symptom.id === 'wellbeing' && (
              <p className="mt-1 text-xs text-text-secondary italic">
                10 = Je me sens très bien — 0 = Je me sens très mal
              </p>
            )}
          </div>
        ))}
      </div>

      <button
        onClick={handleSave}
        className="mt-6 w-full rounded-lg bg-green-islamic py-3 font-semibold text-white transition hover:opacity-90"
      >
        Sauvegarder mon bilan
      </button>
    </div>
  );
}
