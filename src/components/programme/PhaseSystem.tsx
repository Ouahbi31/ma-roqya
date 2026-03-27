import { Droplets, Flame, Shield } from 'lucide-react';

// ═══════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════

export type PhaseId = 'purification' | 'traitement' | 'consolidation';

export interface Phase {
  id: PhaseId;
  title: string;
  subtitle: string;
  description: string;
  icon: typeof Shield;
  color: string;
  bgColor: string;
  dailyTip: string;
}

export interface PhaseConfig {
  phases: { phase: Phase; startDay: number; endDay: number }[];
  totalDays: number;
}

// ═══════════════════════════════════════════════════════
// PHASES DEFINITIONS
// ═══════════════════════════════════════════════════════

const PHASES: Record<PhaseId, Phase> = {
  purification: {
    id: 'purification',
    title: 'Purification',
    subtitle: 'Nettoyage spirituel & préparation',
    description: 'Préparez votre cœur et votre corps. Repentance, nettoyage avec l\'eau de Sidr, mise en place des adhkar de base.',
    icon: Droplets,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    dailyTip: 'Concentrez-vous sur l\'intention (niyyah). Cette phase est celle du nettoyage intérieur. Faites le tawba (repentance), éloignez-vous des péchés, et commencez à ancrer les adhkar dans votre quotidien.',
  },
  traitement: {
    id: 'traitement',
    title: 'Traitement',
    subtitle: 'Roqya intensive & guérison',
    description: 'Phase principale : roqya quotidienne intensive, écoute de Sourate Al-Baqara, versets spécifiques selon votre condition.',
    icon: Flame,
    color: 'text-gold',
    bgColor: 'bg-gold/5',
    dailyTip: 'C\'est la phase la plus importante. Soyez régulier dans votre roqya, ne sautez aucun jour. Les réactions peuvent s\'intensifier — c\'est souvent un signe positif. Notez tout dans votre journal.',
  },
  consolidation: {
    id: 'consolidation',
    title: 'Consolidation',
    subtitle: 'Protection durable & prévention',
    description: 'Renforcez les acquis et prévenez les rechutes. Maintenez les adhkar, réduisez progressivement l\'intensité.',
    icon: Shield,
    color: 'text-green-islamic',
    bgColor: 'bg-green-islamic/5',
    dailyTip: 'Vous êtes sur la bonne voie. Maintenez vos adhkar quotidiens, ils sont votre bouclier permanent. La constance est plus aimée d\'Allah que l\'intensité ponctuelle.',
  },
};

// ═══════════════════════════════════════════════════════
// PHASE CONFIGURATION PER PROGRAM TYPE
// ═══════════════════════════════════════════════════════

export function getPhaseConfig(programType: 'prevention' | 'light' | 'intensive'): PhaseConfig {
  switch (programType) {
    case 'prevention':
      // 7 jours : 2 purification + 3 traitement + 2 consolidation
      return {
        totalDays: 7,
        phases: [
          { phase: PHASES.purification, startDay: 1, endDay: 2 },
          { phase: PHASES.traitement, startDay: 3, endDay: 5 },
          { phase: PHASES.consolidation, startDay: 6, endDay: 7 },
        ],
      };
    case 'light':
      // 15 jours : 4 purification + 7 traitement + 4 consolidation
      return {
        totalDays: 15,
        phases: [
          { phase: PHASES.purification, startDay: 1, endDay: 4 },
          { phase: PHASES.traitement, startDay: 5, endDay: 11 },
          { phase: PHASES.consolidation, startDay: 12, endDay: 15 },
        ],
      };
    case 'intensive':
      // 30 jours : 7 purification + 16 traitement + 7 consolidation
      return {
        totalDays: 30,
        phases: [
          { phase: PHASES.purification, startDay: 1, endDay: 7 },
          { phase: PHASES.traitement, startDay: 8, endDay: 23 },
          { phase: PHASES.consolidation, startDay: 24, endDay: 30 },
        ],
      };
  }
}

export function getCurrentPhase(programType: 'prevention' | 'light' | 'intensive', currentDay: number): Phase {
  const config = getPhaseConfig(programType);
  for (const p of config.phases) {
    if (currentDay >= p.startDay && currentDay <= p.endDay) {
      return p.phase;
    }
  }
  return PHASES.traitement; // fallback
}

export function getPhaseProgress(programType: 'prevention' | 'light' | 'intensive', currentDay: number): {
  phase: Phase;
  dayInPhase: number;
  totalDaysInPhase: number;
  phaseIndex: number;
} {
  const config = getPhaseConfig(programType);
  for (let i = 0; i < config.phases.length; i++) {
    const p = config.phases[i];
    if (currentDay >= p.startDay && currentDay <= p.endDay) {
      return {
        phase: p.phase,
        dayInPhase: currentDay - p.startDay + 1,
        totalDaysInPhase: p.endDay - p.startDay + 1,
        phaseIndex: i,
      };
    }
  }
  return {
    phase: PHASES.traitement,
    dayInPhase: 1,
    totalDaysInPhase: 1,
    phaseIndex: 1,
  };
}

// ═══════════════════════════════════════════════════════
// PHASE BANNER COMPONENT
// ═══════════════════════════════════════════════════════

interface PhaseBannerProps {
  programType: 'prevention' | 'light' | 'intensive';
  currentDay: number;
}

export function PhaseBanner({ programType, currentDay }: PhaseBannerProps) {
  const config = getPhaseConfig(programType);
  const progress = getPhaseProgress(programType, currentDay);
  const PhaseIcon = progress.phase.icon;

  return (
    <div className="mb-6 space-y-3">
      {/* Phase indicator pills */}
      <div className="flex gap-1.5">
        {config.phases.map((p, i) => {
          const isActive = i === progress.phaseIndex;
          const isDone = i < progress.phaseIndex;
          const PIcon = p.phase.icon;

          return (
            <div
              key={p.phase.id}
              className={`flex-1 rounded-xl border p-3 transition-all ${
                isActive
                  ? `${p.phase.bgColor} border-current ${p.phase.color}`
                  : isDone
                    ? 'bg-green-islamic/5 border-green-islamic/20'
                    : 'bg-cream-dark/30 border-cream-dark'
              }`}
            >
              <div className="flex items-center gap-1.5">
                <PIcon className={`h-3.5 w-3.5 ${isActive ? p.phase.color : isDone ? 'text-green-islamic' : 'text-text-secondary/40'}`} />
                <span className={`text-xs font-semibold ${isActive ? p.phase.color : isDone ? 'text-green-islamic' : 'text-text-secondary/40'}`}>
                  {p.phase.title}
                </span>
              </div>
              <p className="mt-0.5 text-[10px] text-text-secondary">
                J{p.startDay}→J{p.endDay}
              </p>
            </div>
          );
        })}
      </div>

      {/* Current phase detail card */}
      <div className={`rounded-xl border p-4 ${progress.phase.bgColor} border-current/10`}>
        <div className="flex items-center gap-2 mb-2">
          <PhaseIcon className={`h-5 w-5 ${progress.phase.color}`} />
          <div>
            <h3 className={`text-sm font-bold ${progress.phase.color}`}>
              Phase {progress.phaseIndex + 1} : {progress.phase.title}
            </h3>
            <p className="text-xs text-text-secondary">
              Jour {progress.dayInPhase}/{progress.totalDaysInPhase} de cette phase
            </p>
          </div>
        </div>
        <p className="text-xs text-text-secondary leading-relaxed">
          {progress.phase.dailyTip}
        </p>
      </div>
    </div>
  );
}
