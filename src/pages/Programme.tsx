import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Play, Lock, Crown,
  ChevronLeft, ChevronRight, Sun, Moon, Star, CheckCircle2,
  Circle, BookOpen, AlertTriangle, Sparkles, Download, ExternalLink
} from 'lucide-react';
import SymptomTracker, { shouldShowWeeklyCheck } from '../components/programme/SymptomTracker';
import SymptomChart from '../components/programme/SymptomChart';
import GuidedJournal from '../components/programme/GuidedJournal';
// PhaseSystem kept for future use
// import { PhaseBanner, getCurrentPhase } from '../components/programme/PhaseSystem';
import { useAuthStore } from '../store/authStore';
import AuthModal from '../components/auth/AuthModal';
import SEO from '../components/SEO';
import type {
  AffectionType,
  View,
  VideoSlot,
  ChecklistItem,
  DiagnosisResult,
  ProgramState,
} from '../components/programme/ProgrammeData';
import {
  QUESTIONS,
  getDayContent,
  PROGRAM_CONFIG,
  TYPE_LABELS,
  computeScores,
  buildDiagnosis,
  STORAGE_KEY,
  STORAGE_KEY_Q,
  loadProgramState,
  saveProgramState,
} from '../components/programme/ProgrammeData';


// ═══════════════════════════════════════════════════════
// SUB-COMPONENTS
// ═══════════════════════════════════════════════════════

function VideoCard({ video }: { video: VideoSlot }) {
  return (
    <div className="card-islamic overflow-hidden">
      <div style={{ background: video.thumbnail }} className="relative h-32 flex items-center justify-center">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
            <Play className="h-6 w-6 text-white ml-1" />
          </div>
        </div>
        <div className="absolute bottom-2 right-2 bg-black/60 text-white text-xs px-2 py-0.5 rounded">
          {video.duration}
        </div>
      </div>
      <div className="p-3">
        <p className="text-xs font-semibold text-text-primary">{video.title}</p>
        <p className="mt-1 text-xs text-text-secondary">{video.description}</p>
        <div className="mt-2 flex items-center gap-1">
          <div className="h-1.5 w-1.5 rounded-full bg-gold" />
          <span className="text-xs text-gold">Vidéo disponible bientôt</span>
        </div>
      </div>
    </div>
  );
}

interface ChecklistSectionProps {
  title: string;
  items: ChecklistItem[];
  completedIds: string[];
  onToggle: (id: string) => void;
  icon: React.ReactNode;
}

function ChecklistSection({ title, items, completedIds, onToggle, icon }: ChecklistSectionProps) {
  return (
    <div className="mt-4">
      <div className="flex items-center gap-2 mb-2">
        {icon}
        <h4 className="text-sm font-semibold text-text-primary">{title}</h4>
      </div>
      <div className="space-y-2">
        {items.map(item => {
          const done = completedIds.includes(item.id);
          return (
            <button
              key={item.id}
              onClick={() => onToggle(item.id)}
              className={`w-full flex items-start gap-3 rounded-xl p-3 text-left transition-all ${
                done ? 'bg-green-50 border border-green-200' : 'bg-white border border-gray-100 hover:border-green-islamic/30'
              }`}
            >
              <div className="mt-0.5 shrink-0">
                {done
                  ? <CheckCircle2 className="h-4 w-4 text-green-600" />
                  : <Circle className="h-4 w-4 text-gray-300" />
                }
              </div>
              <div className="flex-1 min-w-0">
                <span className={`text-sm ${done ? 'line-through text-text-secondary' : 'text-text-primary'}`}>
                  {item.label}
                </span>
                {item.arabic && (
                  <p className="text-xs text-text-secondary mt-0.5" dir="rtl">{item.arabic}</p>
                )}
              </div>
              {item.repetitions && (
                <span className={`shrink-0 text-xs font-semibold px-2 py-0.5 rounded-full ${
                  done ? 'bg-green-100 text-green-700' : 'bg-gold/10 text-gold'
                }`}>
                  {item.repetitions}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function PremiumGate() {
  return (
    <div className="relative rounded-xl overflow-hidden">
      <div className="pointer-events-none select-none blur-sm opacity-40 p-4 space-y-2">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="flex items-center gap-3 bg-white border border-gray-100 rounded-xl p-3">
            <Circle className="h-4 w-4 text-gray-300 shrink-0" />
            <div className="flex-1">
              <div className="h-3 bg-gray-200 rounded w-3/4" />
              <div className="h-2 bg-gray-100 rounded w-1/2 mt-1" />
            </div>
          </div>
        ))}
      </div>
      <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/90 rounded-xl">
        <Crown className="h-5 w-5 text-gold absolute top-3 right-3" />
        <Lock className="h-8 w-8 text-gold mb-3" />
        <p className="text-sm font-bold text-text-primary">Contenu Premium</p>
        <p className="mt-1 text-xs text-text-secondary text-center px-4">
          Les jours 4 et suivants sont accessibles avec un abonnement Premium
        </p>
        <Link
          to="/tarifs"
          className="mt-3 rounded-full bg-gold px-4 py-2 text-sm font-semibold text-white hover:bg-gold/90 transition-colors"
        >
          Débloquer — 9,99€/mois
        </Link>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════

export default function Programme() {
  const { user, profile } = useAuthStore();
  const isPremium = profile?.is_premium ?? false;

  const [view, setView] = useState<View>('landing');
  const [currentQuestionId, setCurrentQuestionId] = useState('q_duration');
  const [questionPath, setQuestionPath] = useState<string[]>(['q_duration']);
  const [answers, setAnswers] = useState<Record<string, string[]>>({});
  const [medicalFlag, setMedicalFlag] = useState(false);
  const [diagnosis, setDiagnosis] = useState<DiagnosisResult | null>(null);
  const [programState, setProgramState] = useState<ProgramState | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [viewingDay, setViewingDay] = useState(1);
  const [showEvolution, setShowEvolution] = useState(false);

  useEffect(() => {
    // Purge anciens localStorage de l'ancienne version du programme
    localStorage.removeItem('ruqya_program_state');
    localStorage.removeItem('ruqya_questionnaire_answers');

    // Charger l'état sauvegardé v2 (sans changer la vue — on reste sur landing)
    const saved = loadProgramState();
    if (saved) {
      setProgramState(saved);
      setViewingDay(saved.currentDay);
    }
    // NE PAS charger les réponses partielles — on repart toujours proprement
  }, []);

  const currentQuestion = QUESTIONS.find(q => q.id === currentQuestionId);
  const currentIndex = questionPath.indexOf(currentQuestionId);

  function handleSingleAnswer(optionId: string) {
    if (!currentQuestion) return;
    const option = currentQuestion.options.find(o => o.id === optionId);
    if (!option) return;

    const newAnswers = { ...answers, [currentQuestionId]: [optionId] };
    setAnswers(newAnswers);
    localStorage.setItem(STORAGE_KEY_Q, JSON.stringify({ answers: newAnswers }));

    const willSetMedical = option.flag === 'medical';
    const nextMedicalFlag = medicalFlag || willSetMedical;
    if (willSetMedical) setMedicalFlag(true);

    if (option.next === null) {
      const finalScores = computeScores(newAnswers);
      const diag = buildDiagnosis(finalScores, nextMedicalFlag);
      setDiagnosis(diag);
      setView('result');
    } else {
      const nextId = option.next;
      setQuestionPath(prev => {
        const idx = prev.indexOf(currentQuestionId);
        const newPath = prev.slice(0, idx + 1);
        if (!newPath.includes(nextId)) newPath.push(nextId);
        return newPath;
      });
      setCurrentQuestionId(nextId);
    }
  }

  function handleMultiToggle(optionId: string) {
    const current = answers[currentQuestionId] ?? [];
    const newSelected = current.includes(optionId)
      ? current.filter(id => id !== optionId)
      : [...current, optionId];
    const newAnswers = { ...answers, [currentQuestionId]: newSelected };
    setAnswers(newAnswers);
    localStorage.setItem(STORAGE_KEY_Q, JSON.stringify({ answers: newAnswers }));
  }

  function handleMultiContinue() {
    if (!currentQuestion?.defaultNext) return;
    const nextId = currentQuestion.defaultNext;
    setQuestionPath(prev => {
      const idx = prev.indexOf(currentQuestionId);
      const newPath = prev.slice(0, idx + 1);
      if (!newPath.includes(nextId)) newPath.push(nextId);
      return newPath;
    });
    setCurrentQuestionId(nextId);
  }

  function handleBack() {
    if (currentIndex <= 0) return;
    setCurrentQuestionId(questionPath[currentIndex - 1]);
  }

  function handleStartProgram() {
    if (!diagnosis) return;
    if (!user) {
      setShowAuthModal(true);
      return;
    }
    const state: ProgramState = {
      affectionType: diagnosis.affectionType,
      profile: diagnosis.profile,
      startDate: new Date().toISOString().split('T')[0],
      currentDay: 1,
      totalDays: diagnosis.totalDays,
      dailyProgress: {},
    };
    setProgramState(state);
    setViewingDay(1);
    saveProgramState(state);
    setView('tracker');
  }

  function handleToggleChecklist(day: number, section: 'morning' | 'evening' | 'bonus', itemId: string) {
    if (!programState) return;
    const dayProgress = programState.dailyProgress[day] ?? { morning: [], evening: [], bonus: [] };
    const current = dayProgress[section] ?? [];
    const updated = current.includes(itemId)
      ? current.filter(id => id !== itemId)
      : [...current, itemId];
    const newState: ProgramState = {
      ...programState,
      dailyProgress: {
        ...programState.dailyProgress,
        [day]: { ...dayProgress, [section]: updated },
      },
    };
    setProgramState(newState);
    saveProgramState(newState);
  }

  function handleResetProgram() {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(STORAGE_KEY_Q);
    setProgramState(null);
    setDiagnosis(null);
    setAnswers({});
    setMedicalFlag(false);
    setCurrentQuestionId('q_duration');
    setQuestionPath(['q_duration']);
    setView('landing');
  }

  // ══════════════════════════════════════════
  // QUESTIONNAIRE VIEW
  // ══════════════════════════════════════════
  // LANDING VIEW
  // ══════════════════════════════════════════

  function renderLanding() {
    const typeConfig = programState ? TYPE_LABELS[programState.affectionType] : null;
    const ResumeIcon = typeConfig?.Icon;

    return (
      <div className="min-h-screen bg-cream pb-20">
        <div className="max-w-lg mx-auto px-4 pt-10">

          {/* Bandeau bientôt disponible */}
          <div className="mb-6 rounded-xl bg-gray-100 border border-gray-200 px-4 py-3 text-center">
            <span className="text-sm font-semibold text-gray-500">🕐 Programme bientôt disponible — </span>
            <Link to="/tarifs#psycho-roqya" className="text-sm font-semibold text-green-islamic underline underline-offset-2">
              Réserver une séance dès maintenant →
            </Link>
          </div>

          {/* Hero */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-green-islamic/10 mb-4">
              <Sparkles className="h-8 w-8 text-green-islamic" />
            </div>
            <h1 className="text-2xl font-bold text-text-primary">
              Programme de Roqya Personnalisé
            </h1>
            <p className="mt-3 text-sm text-text-secondary leading-relaxed max-w-sm mx-auto">
              Un diagnostic adaptatif de 11 questions pour vous orienter vers le programme qui correspond à votre situation — 'Ayn, Sihr, Mass ou Waswas.
            </p>
          </div>

          {/* Points clés */}
          <div className="card-islamic p-5 mb-5 space-y-3">
            {[
              { icon: '🎯', text: 'Diagnostic personnalisé basé sur vos symptômes réels' },
              { icon: '📖', text: 'Programmes basés sur Ibn Qayyim, Ibn Taymiyya, Ibn Baz' },
              { icon: '🎬', text: 'Vidéos tutos "fais avec moi" à chaque étape' },
              { icon: '📊', text: 'Suivi de votre évolution semaine par semaine' },
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-3">
                <span className="text-lg">{item.icon}</span>
                <p className="text-sm text-text-primary">{item.text}</p>
              </div>
            ))}
          </div>

          {/* Reprendre si programme existant */}
          {programState && typeConfig && ResumeIcon && (
            <div className="card-islamic border-green-islamic/30 p-4 mb-4">
              <p className="text-xs text-text-secondary mb-2">Programme en cours</p>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-islamic/10">
                    <ResumeIcon className="h-5 w-5 text-green-islamic" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-text-primary">{typeConfig.label}</p>
                    <p className="text-xs text-text-secondary">
                      Jour {programState.currentDay} / {programState.totalDays}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setView('tracker')}
                  className="rounded-full bg-green-islamic px-4 py-2 text-xs font-semibold text-white"
                >
                  Reprendre
                </button>
              </div>
            </div>
          )}

          {/* CTA principal */}
          <button
            onClick={() => {
              // Repart toujours propre
              setAnswers({});
              setMedicalFlag(false);
              setCurrentQuestionId('q_duration');
              setQuestionPath(['q_duration']);
              setDiagnosis(null);
              localStorage.removeItem(STORAGE_KEY_Q);
              setView('questionnaire');
            }}
            className="w-full rounded-2xl bg-green-islamic py-4 text-base font-bold text-white hover:bg-green-islamic/90 active:scale-[0.98] transition-all shadow-lg shadow-green-islamic/20"
          >
            {programState ? 'Refaire le diagnostic' : 'Commencer le diagnostic'}
          </button>

          <p className="mt-4 text-center text-xs text-text-secondary">
            Gratuit · 3–5 minutes · Résultats immédiats
          </p>

          {/* Verset */}
          <div className="mt-8 card-islamic p-4 text-center">
            <p className="font-arabic text-lg text-text-primary leading-loose">
              وَنُنَزِّلُ مِنَ الْقُرْآنِ مَا هُوَ شِفَاءٌ وَرَحْمَةٌ لِلْمُؤْمِنِينَ
            </p>
            <p className="mt-2 text-xs text-text-secondary italic">
              "Nous faisons descendre du Coran ce qui est guérison et miséricorde pour les croyants."
            </p>
            <p className="mt-1 text-xs text-gold">Sourate Al-Isra, 17:82</p>
          </div>
        </div>
      </div>
    );
  }

  // ══════════════════════════════════════════

  function renderQuestionnaire() {
    if (!currentQuestion) return null;
    const selectedIds = answers[currentQuestionId] ?? [];
    const totalSteps = Math.max(questionPath.length, 11);
    const progress = (currentIndex / totalSteps) * 100;

    return (
      <div className="min-h-screen bg-cream pb-20">
        <div className="max-w-lg mx-auto px-4 pt-8">
          <div className="text-center mb-6">
            <div className="inline-flex items-center gap-2 bg-green-islamic/10 text-green-islamic rounded-full px-4 py-1.5 text-sm font-medium mb-3">
              <Sparkles className="h-4 w-4" />
              Diagnostic personnalisé
            </div>
            <h1 className="text-2xl font-bold text-text-primary">Votre programme sur mesure</h1>
            <p className="mt-1 text-sm text-text-secondary">Répondez honnêtement pour un diagnostic précis</p>
          </div>

          <div className="mb-6">
            <div className="flex justify-between text-xs text-text-secondary mb-1.5">
              <span>Question {currentIndex + 1}</span>
              <span>{Math.round(progress)}% complété</span>
            </div>
            <div className="h-2 bg-bg-cream-dark rounded-full overflow-hidden">
              <div
                className="h-full bg-green-islamic rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          <div className="card-islamic p-6">
            <h2 className="text-lg font-bold text-text-primary leading-snug">{currentQuestion.text}</h2>
            {currentQuestion.subtitle && (
              <p className="mt-2 text-sm italic text-green-islamic">{currentQuestion.subtitle}</p>
            )}

            <div className="mt-5 space-y-2.5">
              {currentQuestion.type === 'single'
                ? currentQuestion.options.map(option => (
                  <button
                    key={option.id}
                    onClick={() => handleSingleAnswer(option.id)}
                    className={`w-full text-left rounded-xl border-2 p-4 transition-all hover:border-green-islamic/50 hover:bg-green-islamic/5 ${
                      selectedIds.includes(option.id)
                        ? 'border-green-islamic bg-green-islamic/10 text-green-islamic font-medium'
                        : 'border-gray-100 bg-white text-text-primary'
                    }`}
                  >
                    <span className="text-sm">{option.label}</span>
                  </button>
                ))
                : currentQuestion.options.map(option => {
                  const isSelected = selectedIds.includes(option.id);
                  return (
                    <button
                      key={option.id}
                      onClick={() => handleMultiToggle(option.id)}
                      className={`w-full text-left rounded-xl border-2 p-4 transition-all ${
                        isSelected
                          ? 'border-green-islamic bg-green-islamic/10'
                          : 'border-gray-100 bg-white hover:border-green-islamic/40'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`h-5 w-5 rounded border-2 flex items-center justify-center shrink-0 ${
                          isSelected ? 'border-green-islamic bg-green-islamic' : 'border-gray-300'
                        }`}>
                          {isSelected && <CheckCircle2 className="h-3.5 w-3.5 text-white" />}
                        </div>
                        <span className={`text-sm ${isSelected ? 'text-green-islamic font-medium' : 'text-text-primary'}`}>
                          {option.label}
                        </span>
                      </div>
                    </button>
                  );
                })
              }
            </div>

            {currentQuestion.type === 'multi' && (
              <button
                onClick={handleMultiContinue}
                className="mt-5 w-full bg-green-islamic text-white rounded-xl py-3.5 font-semibold text-sm hover:bg-green-islamic/90 transition-colors"
              >
                Continuer →
              </button>
            )}
          </div>

          {currentIndex > 0 && (
            <button
              onClick={handleBack}
              className="mt-4 flex items-center gap-1.5 text-sm text-text-secondary hover:text-text-primary transition-colors"
            >
              <ChevronLeft className="h-4 w-4" />
              Question précédente
            </button>
          )}

          <div className="mt-8 text-center">
            <p className="text-base text-green-islamic" dir="rtl">وَنُنَزِّلُ مِنَ الْقُرْآنِ مَا هُوَ شِفَاءٌ وَرَحْمَةٌ لِلْمُؤْمِنِينَ</p>
            <p className="mt-1 text-xs text-text-secondary italic">
              "Nous faisons descendre du Coran ce qui est une guérison et une miséricorde pour les croyants" — 17:82
            </p>
          </div>
        </div>
      </div>
    );
  }

  // ══════════════════════════════════════════
  // RESULT VIEW
  // ══════════════════════════════════════════

  function renderResult() {
    if (!diagnosis) return null;
    const config = PROGRAM_CONFIG[diagnosis.affectionType];
    const IconComp = config.icon;

    // Explication en langage simple selon le type
    const plainExplanations: Record<AffectionType, string> = {
      ayn: "D'après vos réponses, vous présentez des signes compatibles avec le Mauvais Œil ('Ayn). Ce programme de 7 jours vous guide chaque matin et soir avec les adhkar et pratiques du Prophète ﷺ pour vous en protéger et vous en guérir.",
      sihr: "Vos réponses indiquent des symptômes pouvant correspondre à un envoûtement (Sihr). Ce programme de 30 jours en 3 phases vous accompagne progressivement : purification, traitement, consolidation.",
      mass: "Vos réponses — notamment votre réaction au Coran et vos troubles du sommeil — peuvent indiquer la présence d'un djinn (Mass). Ce programme de 21 jours vous accompagne quotidiennement.",
      waswas: "Vous présentez des pensées obsessionnelles que l'Islam appelle Waswas. Ce programme de 14 jours basé sur Ibn Taymiyya vous aide à les vaincre par le dhikr et l'indifférence volontaire.",
    };

    // Niveau d'urgence
    const urgency: Record<string, { label: string; color: string; bg: string; icon: string }> = {
      occult_ayn:    { label: 'Traitable à domicile',            color: 'text-green-700',  bg: 'bg-green-50 border-green-200',  icon: '✓' },
      occult_waswas: { label: 'Traitable à domicile',            color: 'text-green-700',  bg: 'bg-green-50 border-green-200',  icon: '✓' },
      occult_sihr:   { label: 'Séance conseillée en parallèle',  color: 'text-amber-700',  bg: 'bg-amber-50 border-amber-200',  icon: '!' },
      occult_mass:   { label: 'Séance directe recommandée',      color: 'text-red-700',    bg: 'bg-red-50 border-red-200',      icon: '!' },
      psycho:        { label: 'Accompagnement doux recommandé',  color: 'text-blue-700',   bg: 'bg-blue-50 border-blue-200',    icon: 'ℹ' },
      hybrid:        { label: 'Approche combinée conseillée',    color: 'text-blue-700',   bg: 'bg-blue-50 border-blue-200',    icon: 'ℹ' },
      medical:       { label: 'Consultez un médecin d\'abord',   color: 'text-orange-700', bg: 'bg-orange-50 border-orange-200', icon: '⚠' },
    };
    const urgencyKey = diagnosis.profile !== 'occult'
      ? diagnosis.profile
      : `occult_${diagnosis.affectionType}`;
    const urg = urgency[urgencyKey] ?? urgency['occult_ayn'];

    return (
      <div className="min-h-screen bg-cream pb-20">
        <div className="max-w-lg mx-auto px-4 pt-8 space-y-4">

          {/* Titre */}
          <div className="text-center">
            <div className="inline-flex items-center justify-center h-14 w-14 rounded-full bg-green-islamic/10 mb-3">
              <IconComp className="h-7 w-7 text-green-islamic" />
            </div>
            <h1 className="text-xl font-bold text-text-primary">{config.title}</h1>
            <p className="mt-1 text-xs text-text-secondary">{config.duration} jours · programme personnalisé</p>
          </div>

          {/* Explication simple */}
          <div className="card-islamic p-5">
            <p className="text-sm text-text-primary leading-relaxed">
              {plainExplanations[diagnosis.affectionType]}
            </p>
          </div>

          {/* Niveau d'urgence */}
          <div className={`rounded-xl border p-3 flex items-center gap-3 ${urg.bg}`}>
            <span className={`text-lg font-bold ${urg.color}`}>{urg.icon}</span>
            <p className={`text-sm font-medium ${urg.color}`}>{urg.label}</p>
          </div>

          {/* Avertissement médical */}
          {diagnosis.hasMedicalFlag && (
            <div className="rounded-xl border border-orange-200 bg-orange-50 p-4 flex gap-3">
              <AlertTriangle className="h-5 w-5 text-orange-600 shrink-0 mt-0.5" />
              <p className="text-sm text-orange-800">
                Vous n'avez pas encore consulté de médecin. Avant de commencer, une visite médicale est recommandée pour écarter toute cause physique.
              </p>
            </div>
          )}

          {/* Ce que contient le programme — minimaliste */}
          <div className="card-islamic p-5">
            <h3 className="text-sm font-semibold text-text-primary mb-3">Ce que vous ferez chaque jour</h3>
            <div className="space-y-2.5">
              {[
                { icon: '🌅', text: 'Adhkar du matin — récitations guidées avec répétitions' },
                { icon: '🌙', text: 'Adhkar du soir — protection avant le coucher' },
                { icon: '🎬', text: 'Vidéo tuto du jour — "fais avec moi" à chaque étape clé' },
                { icon: '✅', text: 'Checklist à cocher — pour ne rien oublier' },
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-3">
                  <span className="text-base">{item.icon}</span>
                  <p className="text-sm text-text-secondary">{item.text}</p>
                </div>
              ))}
            </div>
          </div>

          {/* CTA séance — simple, discret */}
          {(diagnosis.affectionType === 'mass' || diagnosis.affectionType === 'sihr') && (
            <div className="text-center">
              <p className="text-xs text-text-secondary mb-2">{diagnosis.ctaMessage}</p>
              <Link
                to="/tarifs"
                className="inline-block text-sm font-semibold text-gold underline"
              >
                {diagnosis.ctaButtonLabel} →
              </Link>
            </div>
          )}

          {/* Bouton principal */}
          <button
            onClick={handleStartProgram}
            className="w-full bg-green-islamic text-white rounded-2xl py-4 font-bold text-base hover:bg-green-islamic/90 transition-colors shadow-lg shadow-green-islamic/20"
          >
            Commencer le programme
          </button>

          <div className="text-center">
            <button
              onClick={() => {
                setView('questionnaire');
                setCurrentQuestionId('q_duration');
                setQuestionPath(['q_duration']);
              }}
              className="text-xs text-text-secondary underline"
            >
              Refaire le questionnaire
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ══════════════════════════════════════════
  // TRACKER VIEW
  // ══════════════════════════════════════════

  function renderTracker() {
    if (!programState) {
      return (
        <div className="min-h-screen bg-cream flex items-center justify-center">
          <div className="text-center p-8">
            <p className="text-text-secondary mb-4">Aucun programme actif.</p>
            <button
              onClick={() => setView('questionnaire')}
              className="bg-green-islamic text-white rounded-xl px-6 py-3 font-semibold"
            >
              Commencer le diagnostic
            </button>
          </div>
        </div>
      );
    }

    const { affectionType, profile: diagProfile, startDate, currentDay, totalDays, dailyProgress } = programState;
    const config = PROGRAM_CONFIG[affectionType];
    const IconComp = config.icon;
    const dayContent = getDayContent(affectionType, viewingDay);
    const dayProgress = dailyProgress[viewingDay] ?? { morning: [], evening: [], bonus: [] };
    const isLocked = !isPremium && viewingDay >= 4;
    const progressPct = ((currentDay - 1) / totalDays) * 100;
    const showPsychoModule = diagProfile === 'hybrid' || diagProfile === 'psycho';

    const showWeeklyCheck = shouldShowWeeklyCheck(startDate);

    return (
      <div className="min-h-screen bg-cream pb-24">
        <div className="max-w-lg mx-auto px-4 pt-6 space-y-4">

          {/* En-tête compact */}
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-2">
              <IconComp className="h-5 w-5 text-green-islamic" />
              <span className="text-sm font-semibold text-text-primary">{config.title}</span>
            </div>
            <span className="text-sm font-bold text-green-islamic">
              Jour {currentDay} <span className="font-normal text-text-secondary">/ {totalDays}</span>
            </span>
          </div>

          {/* Barre de progression */}
          <div className="h-1.5 bg-cream-dark rounded-full overflow-hidden">
            <div className="h-full bg-green-islamic rounded-full transition-all duration-500" style={{ width: `${progressPct}%` }} />
          </div>

          {/* Navigation entre les jours */}
          <div className="flex items-center justify-between">
            <button
              onClick={() => setViewingDay(d => Math.max(1, d - 1))}
              disabled={viewingDay <= 1}
              className="flex items-center gap-1 rounded-lg px-3 py-2 text-sm text-text-secondary disabled:opacity-30 hover:bg-cream-dark transition-colors"
            >
              <ChevronLeft className="h-4 w-4" />
              Précédent
            </button>
            <span className="text-sm font-bold text-text-primary">Jour {viewingDay}</span>
            <button
              onClick={() => {
                const nextDay = Math.min(totalDays, viewingDay + 1);
                setViewingDay(nextDay);
                if (nextDay > currentDay) {
                  const newState = { ...programState, currentDay: nextDay };
                  setProgramState(newState);
                  saveProgramState(newState);
                }
              }}
              disabled={viewingDay >= totalDays}
              className="flex items-center gap-1 rounded-lg px-3 py-2 text-sm text-text-secondary disabled:opacity-30 hover:bg-cream-dark transition-colors"
            >
              Suivant
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>

          {/* Carte du jour */}
          <div className="card-islamic p-5">
            {/* Thème du jour */}
            <div className="mb-4 pb-4 border-b border-cream-dark">
              <p className="text-xs text-text-secondary uppercase tracking-wide">Jour {viewingDay}</p>
              <h3 className="mt-1 text-base font-bold text-text-primary">{dayContent.theme}</h3>
              <p className="text-sm text-text-secondary mt-0.5">{dayContent.focus}</p>
            </div>

            {/* Vidéo du jour */}
            {dayContent.video && !isLocked && (
              <div className="mb-4">
                <VideoCard video={dayContent.video} />
              </div>
            )}

            {isLocked ? (
              <PremiumGate />
            ) : (
              <>
                <ChecklistSection
                  title="Matin"
                  items={dayContent.morning}
                  completedIds={dayProgress.morning}
                  onToggle={(id) => handleToggleChecklist(viewingDay, 'morning', id)}
                  icon={<Sun className="h-4 w-4 text-gold" />}
                />
                <ChecklistSection
                  title="Soir"
                  items={dayContent.evening}
                  completedIds={dayProgress.evening}
                  onToggle={(id) => handleToggleChecklist(viewingDay, 'evening', id)}
                  icon={<Moon className="h-4 w-4 text-green-islamic" />}
                />
                <ChecklistSection
                  title="À faire aussi"
                  items={dayContent.bonus}
                  completedIds={dayProgress.bonus}
                  onToggle={(id) => handleToggleChecklist(viewingDay, 'bonus', id)}
                  icon={<Star className="h-4 w-4 text-gold" />}
                />
                {dayContent.scholarNote && (
                  <div className="mt-4 rounded-xl border border-gold/30 bg-amber-50 p-3">
                    <div className="flex items-start gap-2">
                      <BookOpen className="h-4 w-4 text-gold shrink-0 mt-0.5" />
                      <p className="text-xs text-amber-800 italic">{dayContent.scholarNote}</p>
                    </div>
                  </div>
                )}

                {/* Téléchargement PDF des invocations complémentaires */}
                <div className="mt-4 rounded-xl border border-green-islamic/20 bg-green-islamic/5 p-4">
                  <p className="text-xs font-semibold text-green-islamic mb-1">📄 Invocations complémentaires</p>
                  <p className="text-xs text-text-secondary mb-3">
                    Toutes les invocations de votre programme en arabe, phonétique et traduction française.
                  </p>
                  <div className="flex gap-2 flex-wrap">
                    <a
                      href={`/pdf/${affectionType}-invocations.pdf`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 rounded-lg bg-green-islamic px-4 py-2 text-sm font-semibold text-white hover:opacity-90 transition-opacity"
                    >
                      <ExternalLink className="h-4 w-4" />
                      Consulter le PDF
                    </a>
                    <a
                      href={`/pdf/${affectionType}-invocations.pdf`}
                      download
                      className="inline-flex items-center gap-2 rounded-lg border border-green-islamic/40 px-4 py-2 text-sm font-semibold text-green-islamic hover:bg-green-islamic/10 transition-colors"
                    >
                      <Download className="h-4 w-4" />
                      Télécharger
                    </a>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Bilan hebdomadaire — seulement quand c'est le moment */}
          {showWeeklyCheck && !isLocked && (
            <div className="card-islamic p-4">
              <h3 className="font-semibold text-text-primary text-sm mb-3">📋 Bilan de la semaine</h3>
              <SymptomTracker startDate={startDate} onComplete={() => {}} />
            </div>
          )}

          {/* Bouton "Voir mon évolution" — discret, optionnel */}
          {!isLocked && (
            <button
              onClick={() => setShowEvolution(v => !v)}
              className="w-full text-sm text-text-secondary text-center py-2 hover:text-text-primary transition-colors"
            >
              {showEvolution ? '▲ Masquer l\'évolution' : '📊 Voir mon évolution'}
            </button>
          )}
          {showEvolution && !isLocked && (
            <div className="card-islamic p-4">
              <SymptomChart />
              {showPsychoModule && <GuidedJournal currentDay={viewingDay} />}
            </div>
          )}

          {/* Reset — très discret en bas */}
          <div className="text-center pt-2">
            <button
              onClick={handleResetProgram}
              className="text-xs text-text-secondary/50 hover:text-red-400 transition-colors"
            >
              Réinitialiser le programme
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ══════════════════════════════════════════
  // ROOT RENDER
  // ══════════════════════════════════════════

  return (
    <>
      <SEO
        title="Programme de Roqya Personnalisé | CoachMyNefs"
        description="Programme adaptatif de roqya selon votre diagnostic : 'Ayn, Sihr, Mass, Waswas. Basé sur Ibn Qayyim, Ibn Taymiyya, Ibn Baz."
      />

      {/* Nav tabs — only show when past landing */}
      {view !== 'landing' && (
        <div className="sticky top-0 z-10 bg-white border-b border-gray-100 shadow-sm">
          <div className="max-w-lg mx-auto flex">
            {(['questionnaire', 'result', 'tracker'] as Array<Exclude<View, 'landing'>>).map(v => {
              const labels = { questionnaire: 'Diagnostic', result: 'Résultat', tracker: 'Mon Programme' };
              const disabled = (v === 'result' && !diagnosis) || (v === 'tracker' && !programState);
              return (
                <button
                  key={v}
                  disabled={disabled}
                  onClick={() => { if (!disabled) setView(v); }}
                  className={`flex-1 py-3 text-sm font-medium border-b-2 transition-colors disabled:opacity-40 ${
                    view === v ? 'border-green-islamic text-green-islamic' : 'border-transparent text-text-secondary hover:text-text-primary'
                  }`}
                >
                  {labels[v]}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {view === 'landing' && renderLanding()}
      {view === 'questionnaire' && renderQuestionnaire()}
      {view === 'result' && renderResult()}
      {view === 'tracker' && renderTracker()}

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        action="login"
      />
    </>
  );
}
