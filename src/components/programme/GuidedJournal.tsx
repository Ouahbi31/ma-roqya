import { useState, useEffect } from 'react';
import { BookOpen, CheckCircle2, ChevronDown, ChevronUp } from 'lucide-react';

// ═══════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════

interface JournalEntry {
  sleep: 'bon' | 'moyen' | 'mauvais' | '';
  dreamDescription: string;
  quranReaction: 'rien' | 'leger' | 'fort' | '';
  quranDetails: string;
  anxietyLevel: number;
  physicalSensations: string[];
  gratitude: [string, string, string];
  freeNotes: string;
}

const PHYSICAL_OPTIONS = [
  'Chaleur',
  'Froid',
  'Picotements',
  'Tremblements',
  'Douleurs',
  'Lourdeur',
  'Palpitations',
  'Bâillements',
  'Pleurs',
  'Rien de particulier',
];

const STORAGE_PREFIX = 'ruqya_journal_day_';

function loadJournal(day: number): JournalEntry {
  try {
    const raw = localStorage.getItem(STORAGE_PREFIX + day);
    if (raw) return JSON.parse(raw);
  } catch { /* ignore */ }
  return {
    sleep: '',
    dreamDescription: '',
    quranReaction: '',
    quranDetails: '',
    anxietyLevel: 5,
    physicalSensations: [],
    gratitude: ['', '', ''],
    freeNotes: '',
  };
}

function saveJournal(day: number, entry: JournalEntry): void {
  localStorage.setItem(STORAGE_PREFIX + day, JSON.stringify(entry));
}

// ═══════════════════════════════════════════════════════
// COMPONENT
// ═══════════════════════════════════════════════════════

interface GuidedJournalProps {
  currentDay: number;
}

export default function GuidedJournal({ currentDay }: GuidedJournalProps) {
  const [entry, setEntry] = useState<JournalEntry>(() => loadJournal(currentDay));
  const [expanded, setExpanded] = useState(true);
  const [saved, setSaved] = useState(false);

  // Recharger quand le jour change
  useEffect(() => {
    setEntry(loadJournal(currentDay));
    setSaved(false);
  }, [currentDay]);

  // Auto-save quand l'entrée change
  useEffect(() => {
    const timeout = setTimeout(() => {
      saveJournal(currentDay, entry);
    }, 500);
    return () => clearTimeout(timeout);
  }, [entry, currentDay]);

  const update = <K extends keyof JournalEntry>(key: K, value: JournalEntry[K]) => {
    setEntry((prev) => ({ ...prev, [key]: value }));
    setSaved(false);
  };

  const toggleSensation = (s: string) => {
    setEntry((prev) => ({
      ...prev,
      physicalSensations: prev.physicalSensations.includes(s)
        ? prev.physicalSensations.filter((x) => x !== s)
        : [...prev.physicalSensations, s],
    }));
  };

  const updateGratitude = (index: number, value: string) => {
    setEntry((prev) => {
      const g = [...prev.gratitude] as [string, string, string];
      g[index] = value;
      return { ...prev, gratitude: g };
    });
  };

  const handleSave = () => {
    saveJournal(currentDay, entry);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const isComplete = entry.sleep !== '' && entry.quranReaction !== '' && entry.gratitude[0] !== '';

  return (
    <div className="mb-6 rounded-2xl border border-green-islamic/15 bg-green-islamic/5 overflow-hidden">
      {/* Header cliquable */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex w-full items-center gap-2 p-5 text-left"
      >
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-islamic/10">
          <BookOpen className="h-4 w-4 text-green-islamic" />
        </div>
        <div className="flex-1">
          <h3 className="font-heading text-base font-bold text-green-islamic">
            Journal du jour {currentDay}
          </h3>
          <p className="text-xs text-text-secondary">
            {isComplete ? '✅ Complété' : 'Répondez aux questions pour suivre votre progression'}
          </p>
        </div>
        {expanded ? (
          <ChevronUp className="h-5 w-5 text-text-secondary" />
        ) : (
          <ChevronDown className="h-5 w-5 text-text-secondary" />
        )}
      </button>

      {expanded && (
        <div className="px-5 pb-5 space-y-5">

          {/* 1. Sommeil */}
          <div>
            <label className="block text-sm font-semibold text-text-primary mb-2">
              🌙 Comment était votre sommeil cette nuit ?
            </label>
            <div className="flex gap-2">
              {([
                { v: 'bon', emoji: '😊', label: 'Bon' },
                { v: 'moyen', emoji: '😐', label: 'Moyen' },
                { v: 'mauvais', emoji: '😴', label: 'Mauvais' },
              ] as const).map((opt) => (
                <button
                  key={opt.v}
                  onClick={() => update('sleep', opt.v)}
                  className={`flex-1 flex flex-col items-center gap-1 rounded-xl border py-3 text-sm transition ${
                    entry.sleep === opt.v
                      ? 'border-green-islamic bg-green-islamic/10 text-green-islamic font-semibold'
                      : 'border-cream-dark bg-white text-text-secondary hover:border-green-islamic/30'
                  }`}
                >
                  <span className="text-xl">{opt.emoji}</span>
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* 2. Rêves */}
          <div>
            <label className="block text-sm font-semibold text-text-primary mb-2">
              💭 Avez-vous fait un rêve cette nuit ?
            </label>
            <textarea
              className="w-full resize-none rounded-xl border border-cream-dark bg-white px-4 py-3 text-sm text-text-primary outline-none transition focus:border-green-islamic focus:ring-2 focus:ring-green-islamic/20"
              rows={2}
              placeholder="Décrivez brièvement votre rêve (ou laissez vide si aucun)..."
              value={entry.dreamDescription}
              onChange={(e) => update('dreamDescription', e.target.value)}
            />
          </div>

          {/* 3. Réaction au Coran */}
          <div>
            <label className="block text-sm font-semibold text-text-primary mb-2">
              📖 Avez-vous ressenti quelque chose pendant la récitation du Coran ?
            </label>
            <div className="flex gap-2">
              {([
                { v: 'rien', label: 'Rien', emoji: '😌' },
                { v: 'leger', label: 'Léger', emoji: '🤔' },
                { v: 'fort', label: 'Fort', emoji: '😣' },
              ] as const).map((opt) => (
                <button
                  key={opt.v}
                  onClick={() => update('quranReaction', opt.v)}
                  className={`flex-1 flex flex-col items-center gap-1 rounded-xl border py-3 text-sm transition ${
                    entry.quranReaction === opt.v
                      ? 'border-green-islamic bg-green-islamic/10 text-green-islamic font-semibold'
                      : 'border-cream-dark bg-white text-text-secondary hover:border-green-islamic/30'
                  }`}
                >
                  <span className="text-xl">{opt.emoji}</span>
                  {opt.label}
                </button>
              ))}
            </div>
            {entry.quranReaction && entry.quranReaction !== 'rien' && (
              <textarea
                className="mt-2 w-full resize-none rounded-xl border border-cream-dark bg-white px-4 py-3 text-sm text-text-primary outline-none transition focus:border-green-islamic focus:ring-2 focus:ring-green-islamic/20"
                rows={2}
                placeholder="Décrivez ce que vous avez ressenti..."
                value={entry.quranDetails}
                onChange={(e) => update('quranDetails', e.target.value)}
              />
            )}
          </div>

          {/* 4. Niveau d'anxiété */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-semibold text-text-primary">
                😰 Niveau d'anxiété aujourd'hui
              </label>
              <span className={`text-sm font-bold ${
                entry.anxietyLevel <= 3 ? 'text-green-islamic' : entry.anxietyLevel <= 6 ? 'text-gold' : 'text-red-600'
              }`}>
                {entry.anxietyLevel}/10
              </span>
            </div>
            <div className="flex gap-1">
              {Array.from({ length: 11 }, (_, i) => i).map((val) => (
                <button
                  key={val}
                  onClick={() => update('anxietyLevel', val)}
                  className={`flex-1 py-1.5 rounded text-xs font-medium transition-all ${
                    entry.anxietyLevel === val
                      ? val <= 3 ? 'bg-green-islamic text-white' : val <= 6 ? 'bg-gold text-white' : 'bg-red-500 text-white'
                      : 'bg-cream-dark/50 text-text-secondary hover:bg-cream-dark'
                  }`}
                >
                  {val}
                </button>
              ))}
            </div>
          </div>

          {/* 5. Sensations physiques */}
          <div>
            <label className="block text-sm font-semibold text-text-primary mb-2">
              🫀 Sensations physiques ressenties
            </label>
            <div className="flex flex-wrap gap-2">
              {PHYSICAL_OPTIONS.map((s) => (
                <button
                  key={s}
                  onClick={() => toggleSensation(s)}
                  className={`rounded-full px-3 py-1.5 text-xs font-medium transition ${
                    entry.physicalSensations.includes(s)
                      ? 'bg-green-islamic text-white'
                      : 'bg-cream-dark text-text-secondary hover:bg-cream-dark/80'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* 6. Gratitude */}
          <div>
            <label className="block text-sm font-semibold text-text-primary mb-2">
              🤲 3 bienfaits d'Allah pour lesquels vous êtes reconnaissant(e) aujourd'hui
            </label>
            <div className="space-y-2">
              {[0, 1, 2].map((i) => (
                <div key={i} className="flex items-center gap-2">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gold/10 text-xs font-bold text-gold">
                    {i + 1}
                  </span>
                  <input
                    type="text"
                    className="flex-1 rounded-lg border border-cream-dark bg-white px-3 py-2 text-sm text-text-primary outline-none transition focus:border-green-islamic focus:ring-1 focus:ring-green-islamic"
                    placeholder={
                      i === 0 ? 'ex: Ma santé' : i === 1 ? 'ex: Ma famille' : 'ex: La guidance d\'Allah'
                    }
                    value={entry.gratitude[i]}
                    onChange={(e) => updateGratitude(i, e.target.value)}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* 7. Notes libres */}
          <div>
            <label className="block text-sm font-semibold text-text-primary mb-2">
              ✏️ Notes supplémentaires (optionnel)
            </label>
            <textarea
              className="w-full resize-none rounded-xl border border-cream-dark bg-white px-4 py-3 text-sm text-text-primary outline-none transition focus:border-green-islamic focus:ring-2 focus:ring-green-islamic/20"
              rows={2}
              placeholder="Anything else que vous souhaitez noter..."
              value={entry.freeNotes}
              onChange={(e) => update('freeNotes', e.target.value)}
            />
          </div>

          {/* Bouton sauvegarder */}
          <button
            onClick={handleSave}
            className={`w-full rounded-xl py-3 font-semibold text-white transition ${
              saved ? 'bg-green-islamic/80' : 'bg-green-islamic hover:opacity-90'
            }`}
          >
            {saved ? (
              <span className="flex items-center justify-center gap-2">
                <CheckCircle2 className="h-4 w-4" />
                Sauvegardé !
              </span>
            ) : (
              'Sauvegarder mon journal'
            )}
          </button>
        </div>
      )}
    </div>
  );
}
