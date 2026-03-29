import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Eye, Shield, Flame, MessageCircle, Play, Lock, Crown,
  ChevronLeft, ChevronRight, Sun, Moon, Star, CheckCircle2,
  Circle, BookOpen, AlertTriangle, Info, Sparkles
} from 'lucide-react';
import SymptomTracker, { shouldShowWeeklyCheck } from '../components/programme/SymptomTracker';
import SymptomChart from '../components/programme/SymptomChart';
import GuidedJournal from '../components/programme/GuidedJournal';
import { PhaseBanner, getCurrentPhase } from '../components/programme/PhaseSystem';
import { useAuthStore } from '../store/authStore';
import AuthModal from '../components/auth/AuthModal';
import SEO from '../components/SEO';


// ═══════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════

type AffectionType = 'ayn' | 'sihr' | 'mass' | 'waswas';
type DiagnosticProfile = 'occult' | 'psycho' | 'hybrid' | 'medical';
type View = 'landing' | 'questionnaire' | 'result' | 'tracker';

interface Scores {
  ayn: number;
  sihr: number;
  mass: number;
  waswas: number;
  psycho: number;
}

interface TreeOption {
  id: string;
  label: string;
  scores: Partial<Scores>;
  next: string | null;
  flag?: 'medical';
}

interface TreeQuestion {
  id: string;
  text: string;
  subtitle?: string;
  type: 'single' | 'multi';
  options: TreeOption[];
  defaultNext?: string;
}

interface VideoSlot {
  id: string;
  title: string;
  description: string;
  duration: string;
  url: null;
  thumbnail: string;
}

interface ChecklistItem {
  id: string;
  label: string;
  arabic?: string;
  repetitions?: string;
}

interface DayContent {
  theme: string;
  focus: string;
  morning: ChecklistItem[];
  evening: ChecklistItem[];
  bonus: ChecklistItem[];
  video?: VideoSlot;
  scholarNote?: string;
  isPsychoDay?: boolean;
}

interface DiagnosisResult {
  affectionType: AffectionType;
  profile: DiagnosticProfile;
  scores: Scores;
  dominantScore: number;
  psychoScore: number;
  totalDays: number;
  hasMedicalFlag: boolean;
  ctaTitle: string;
  ctaMessage: string;
  ctaButtonLabel: string;
}

interface ProgramState {
  affectionType: AffectionType;
  profile: DiagnosticProfile;
  startDate: string;
  currentDay: number;
  totalDays: number;
  dailyProgress: Record<number, { morning: string[]; evening: string[]; bonus: string[] }>;
}

// ═══════════════════════════════════════════════════════
// DECISION TREE
// ═══════════════════════════════════════════════════════

const QUESTIONS: TreeQuestion[] = [
  {
    id: 'q_duration',
    text: 'Depuis combien de temps ressentez-vous ces difficultés ?',
    type: 'single',
    options: [
      { id: 'q_duration_1', label: 'Quelques jours à quelques semaines', scores: { ayn: 3 }, next: 'q_reaction_coran' },
      { id: 'q_duration_2', label: '1 à 6 mois', scores: { sihr: 1, mass: 1 }, next: 'q_blocages' },
      { id: 'q_duration_3', label: '6 mois à 1 an', scores: { sihr: 2, mass: 2 }, next: 'q_blocages' },
      { id: 'q_duration_4', label: "Plus d'un an", scores: { sihr: 3, mass: 3 }, next: 'q_blocages' },
    ],
  },
  {
    id: 'q_reaction_coran',
    text: 'Avez-vous déjà ressenti une réaction forte (agitation, douleurs, pleurs involontaires) en écoutant le Coran ?',
    subtitle: 'Ceci est un signe important pour orienter votre accompagnement',
    type: 'single',
    options: [
      { id: 'q_reaction_coran_1', label: 'Oui, fortement — agitation, douleurs, vomissements', scores: { mass: 4, sihr: 2 }, next: 'q_sleep' },
      { id: 'q_reaction_coran_2', label: 'Oui, légère gêne ou malaise', scores: { mass: 2 }, next: 'q_sleep' },
      { id: 'q_reaction_coran_3', label: 'Non, aucune réaction particulière', scores: { ayn: 1, psycho: 1 }, next: 'q_sleep' },
      { id: 'q_reaction_coran_4', label: "Je ne sais pas / n'ai pas essayé", scores: {}, next: 'q_sleep' },
    ],
  },
  {
    id: 'q_sleep',
    text: 'Comment se passe votre sommeil ?',
    type: 'single',
    options: [
      { id: 'q_sleep_1', label: 'Cauchemars récurrents (serpents, chutes, personnes étranges)', scores: { mass: 3, sihr: 2 }, next: 'q_physique' },
      { id: 'q_sleep_2', label: 'Insomnie ou terreurs nocturnes fréquentes', scores: { ayn: 2, sihr: 1, psycho: 2 }, next: 'q_physique' },
      { id: 'q_sleep_3', label: 'Réveils brusques avec sensation de présence', scores: { mass: 4, sihr: 1 }, next: 'q_physique' },
      { id: 'q_sleep_4', label: 'Sommeil perturbé mais sans cauchemars précis', scores: { psycho: 2 }, next: 'q_physique' },
      { id: 'q_sleep_5', label: 'Sommeil normal', scores: {}, next: 'q_physique' },
    ],
  },
  {
    id: 'q_physique',
    text: 'Quels symptômes physiques ressentez-vous ? (plusieurs choix possibles)',
    type: 'multi',
    defaultNext: 'q_psychologique',
    options: [
      { id: 'q_physique_1', label: 'Maux de tête fréquents et inexpliqués', scores: { ayn: 2, psycho: 1 }, next: null },
      { id: 'q_physique_2', label: 'Douleurs dans le corps sans cause médicale', scores: { mass: 2, sihr: 1 }, next: null },
      { id: 'q_physique_3', label: 'Fatigue chronique profonde même après repos', scores: { sihr: 2, psycho: 2 }, next: null },
      { id: 'q_physique_4', label: 'Sensation de lourdeur ou pression sur la poitrine', scores: { mass: 3 }, next: null },
      { id: 'q_physique_5', label: 'Palpitations cardiaques sans cause cardiaque', scores: { ayn: 1, mass: 1, psycho: 2 }, next: null },
      { id: 'q_physique_6', label: 'Nausées ou douleurs abdominales inexpliquées', scores: { sihr: 1, mass: 1 }, next: null },
      { id: 'q_physique_7', label: 'Aucun symptôme physique notable', scores: {}, next: null },
    ],
  },
  {
    id: 'q_psychologique',
    text: 'Sur le plan émotionnel, vous reconnaissez-vous dans... ?',
    type: 'multi',
    defaultNext: 'q_waswas',
    options: [
      { id: 'q_psychologique_1', label: 'Tristesse profonde ou pleurs fréquents sans raison apparente', scores: { sihr: 2, psycho: 3 }, next: null },
      { id: 'q_psychologique_2', label: 'Anxiété permanente, peur ou angoisse inexpliquée', scores: { ayn: 1, psycho: 3 }, next: null },
      { id: 'q_psychologique_3', label: 'Pensées intrusives, idées répétitives indésirables', scores: { waswas: 3, psycho: 2 }, next: null },
      { id: 'q_psychologique_4', label: 'Irritabilité, accès de colère inexpliqués', scores: { mass: 2, psycho: 2 }, next: null },
      { id: 'q_psychologique_5', label: "Envie de s'isoler, de fuir les gens", scores: { sihr: 2, psycho: 2 }, next: null },
      { id: 'q_psychologique_6', label: "Difficultés de concentration, esprit embrumé", scores: { ayn: 1, waswas: 2 }, next: null },
      { id: 'q_psychologique_7', label: 'Aucun de ces éléments', scores: {}, next: null },
    ],
  },
  {
    id: 'q_waswas',
    text: 'Avez-vous des doutes ou pensées obsessionnelles concernant votre religion, votre pureté, ou des pensées mauvaises répétitives ?',
    subtitle: 'Ibn Taymiyya (r.a.) a traité ce sujet spécifiquement dans sa Risalat al-Waswas',
    type: 'single',
    options: [
      { id: 'q_waswas_1', label: 'Oui souvent — je remets en question mes ablutions, mes prières', scores: { waswas: 4 }, next: 'q_blocages' },
      { id: 'q_waswas_2', label: "Oui parfois — des pensées s'imposent contre ma volonté", scores: { waswas: 2, psycho: 1 }, next: 'q_blocages' },
      { id: 'q_waswas_3', label: 'Non, pas de ce type de pensées', scores: {}, next: 'q_blocages' },
    ],
  },
  {
    id: 'q_blocages',
    text: 'Avez-vous des blocages persistants dans un ou plusieurs domaines de votre vie ?',
    subtitle: "Mariage différé, emploi bloqué, projets qui n'aboutissent jamais...",
    type: 'single',
    options: [
      { id: 'q_blocages_1', label: 'Oui, plusieurs domaines bloqués depuis longtemps', scores: { sihr: 3 }, next: 'q_regard' },
      { id: 'q_blocages_2', label: 'Oui, un domaine spécifique', scores: { sihr: 1 }, next: 'q_regard' },
      { id: 'q_blocages_3', label: 'Non, pas de blocages particuliers', scores: {}, next: 'q_regard' },
    ],
  },
  {
    id: 'q_regard',
    text: "Avez-vous récemment été exposé(e) à de l'admiration, de la jalousie, ou un regard envieux ?",
    subtitle: "Le Prophète ﷺ a dit : 'L'œil (ayn) est une réalité' — Bukhari & Muslim",
    type: 'single',
    options: [
      { id: 'q_regard_1', label: "Oui, d'une personne précise que je soupçonne", scores: { ayn: 4 }, next: 'q_pratique' },
      { id: 'q_regard_2', label: 'Probablement, dans mon entourage il y a de la jalousie', scores: { ayn: 2 }, next: 'q_pratique' },
      { id: 'q_regard_3', label: 'Non ou je ne sais pas', scores: {}, next: 'q_pratique' },
    ],
  },
  {
    id: 'q_pratique',
    text: 'Quelle est votre pratique spirituelle actuelle ?',
    type: 'single',
    options: [
      { id: 'q_pratique_1', label: 'Je prie 5 fois/jour + adhkar matin et soir régulièrement', scores: { psycho: -1 }, next: 'q_trauma' },
      { id: 'q_pratique_2', label: 'Je prie parfois, irrégulièrement', scores: { psycho: 1, ayn: 1, sihr: 1 }, next: 'q_trauma' },
      { id: 'q_pratique_3', label: 'Je prie rarement', scores: { psycho: 2, mass: 1 }, next: 'q_trauma' },
      { id: 'q_pratique_4', label: 'Je ne fais pas la prière actuellement', scores: { psycho: 3, mass: 2 }, next: 'q_trauma' },
    ],
  },
  {
    id: 'q_trauma',
    text: 'Avez-vous vécu des événements douloureux non résolus ? (deuil, trahison, choc émotionnel, abus...)',
    subtitle: "L'occulte peut exploiter les blessures psychologiques non guéries",
    type: 'single',
    options: [
      { id: 'q_trauma_1', label: "Oui, un trauma récent que je n'ai pas surmonté", scores: { psycho: 4 }, next: 'q_medical' },
      { id: 'q_trauma_2', label: "Oui, des blessures du passé que je porte encore", scores: { psycho: 3 }, next: 'q_medical' },
      { id: 'q_trauma_3', label: "Oui, mais j'ai travaillé dessus et je m'en suis largement remis", scores: { psycho: 1 }, next: 'q_medical' },
      { id: 'q_trauma_4', label: 'Non, pas de trauma particulier', scores: {}, next: 'q_medical' },
    ],
  },
  {
    id: 'q_medical',
    text: 'Avez-vous consulté un médecin pour ces symptômes ?',
    subtitle: 'La roqya ne remplace pas le suivi médical',
    type: 'single',
    options: [
      { id: 'q_medical_1', label: 'Oui, tout est normal médicalement', scores: {}, next: null },
      { id: 'q_medical_2', label: 'Oui, certains symptômes ont une explication médicale', scores: { psycho: 2 }, flag: 'medical', next: null },
      { id: 'q_medical_3', label: "Non, je n'ai pas encore consulté", scores: {}, flag: 'medical', next: null },
      { id: 'q_medical_4', label: 'Ce sont clairement des symptômes spirituels, la médecine ne peut rien', scores: {}, next: null },
    ],
  },
];

// ═══════════════════════════════════════════════════════
// VIDEO CATALOG
// ═══════════════════════════════════════════════════════

const GOLD_THUMB = 'linear-gradient(135deg, #D4880A, #F5A623)';
const DARK_BLUE_THUMB = 'linear-gradient(135deg, #1A2942, #2E6AB8)';
const GREY_BLUE_THUMB = 'linear-gradient(135deg, #5A6B82, #2E6AB8)';
const GOLD_DARK_THUMB = 'linear-gradient(135deg, #D4880A, #1A2942)';
const PSYCHO_THUMB = 'linear-gradient(135deg, #2E6AB8, #D4880A)';
const INTRO_THUMB = 'linear-gradient(135deg, #2E6AB8, #4A90D9)';

const ALL_VIDEOS: Record<string, VideoSlot> = {
  v_intro: { id: 'v_intro', title: "Introduction : Votre guide d'accompagnement", description: "Comment utiliser ce programme étape par étape : navigation, objectifs, méthode de suivi", duration: '8 min', url: null, thumbnail: INTRO_THUMB },

  v_ayn_1: { id: 'v_ayn_1', title: "Comprendre le 'Ayn : réalité et portée", description: "Tutoriel pratique : reconnaître les symptômes du 'Ayn selon la Sunna et les signes concrets", duration: '12 min', url: null, thumbnail: GOLD_THUMB },
  v_ayn_2: { id: 'v_ayn_2', title: "Préparer l'eau coranisée contre le 'Ayn", description: "Démonstration : position, intention, quelles sourates réciter et comment souffler sur l'eau", duration: '10 min', url: null, thumbnail: GOLD_THUMB },
  v_ayn_3: { id: 'v_ayn_3', title: "Technique de récitation sur soi : fais avec moi", description: "Séance guidée complète : Al-Fatiha 7x, Ayat Al-Kursi, Mu'awwidhat — position et souffle corrects", duration: '15 min', url: null, thumbnail: GOLD_THUMB },
  v_ayn_4: { id: 'v_ayn_4', title: "Le Ghusl purificateur : protocole étape par étape", description: "Tutoriel complet du bain avec eau récitée : intention, ordre des étapes, doua finales", duration: '12 min', url: null, thumbnail: GOLD_THUMB },
  v_ayn_5: { id: 'v_ayn_5', title: "Identifier la source du 'Ayn et se protéger", description: "Méthode pratique pour identifier d'où vient le 'Ayn et établir une protection durable", duration: '10 min', url: null, thumbnail: GOLD_THUMB },
  v_ayn_6: { id: 'v_ayn_6', title: "Adhkar de protection quotidiens : récite avec moi", description: "Session d'adhkar matin et soir complets — récitation guidée, prononciation et sens", duration: '20 min', url: null, thumbnail: GOLD_THUMB },

  v_sihr_p1_1: { id: 'v_sihr_p1_1', title: "Le Sihr : comprendre sans angoisser", description: "Tutoriel : types de sihr, comment il agit, pourquoi la roqya est efficace — basé sur Ibn Qayyim (Zad al-Ma'ad)", duration: '15 min', url: null, thumbnail: DARK_BLUE_THUMB },
  v_sihr_p1_2: { id: 'v_sihr_p1_2', title: "Préparer votre eau coranisée anti-sihr", description: "Démonstration : Al-Fatiha + Kursi + Mu'awwidhat + versets de sihr (7:117) soufflés sur l'eau", duration: '12 min', url: null, thumbnail: DARK_BLUE_THUMB },
  v_sihr_p1_3: { id: 'v_sihr_p1_3', title: "Le bain au Sidr : protocole Ibn Qayyim", description: "Tutoriel étape par étape : préparer les feuilles, réciter dessus, effectuer le bain rituel", duration: '15 min', url: null, thumbnail: DARK_BLUE_THUMB },
  v_sihr_p1_4: { id: 'v_sihr_p1_4', title: "Préparer l'huile d'olive coranisée", description: "Démonstration complète : récitation sur l'huile, application sur le corps, interne vs externe", duration: '10 min', url: null, thumbnail: DARK_BLUE_THUMB },
  v_sihr_p1_5: { id: 'v_sihr_p1_5', title: "Tawba sincère : rituel guidé de repentance", description: "Séance guidée : comment faire une tawba profonde — étapes, douas, attitude intérieure", duration: '18 min', url: null, thumbnail: DARK_BLUE_THUMB },
  v_sihr_p2_1: { id: 'v_sihr_p2_1', title: "Écouter Sourate Al-Baqara activement", description: "Comment écouter Al-Baqara en thérapeutique : posture, concentration, que ressentir, journal de réactions", duration: '20 min', url: null, thumbnail: DARK_BLUE_THUMB },
  v_sihr_p2_2: { id: 'v_sihr_p2_2', title: "Les versets anti-sihr : récitation guidée", description: "Récitation guidée des sourates 7:117-122, 10:79-82, 20:65-70 — prononciation et intentions", duration: '20 min', url: null, thumbnail: DARK_BLUE_THUMB },
  v_sihr_p2_3: { id: 'v_sihr_p2_3', title: "Le trio thérapeutique : eau + miel + huile", description: "Protocole complet : comment préparer et utiliser quotidiennement les 3 remèdes prophétiques", duration: '12 min', url: null, thumbnail: DARK_BLUE_THUMB },
  v_sihr_p2_4: { id: 'v_sihr_p2_4', title: "Reconnaître les réactions pendant le traitement", description: "Tutoriel : quelles réactions sont normales (douleurs, rêves, émotions), que faire si c'est intense", duration: '15 min', url: null, thumbnail: DARK_BLUE_THUMB },
  v_sihr_p2_5: { id: 'v_sihr_p2_5', title: "Journal de suivi : noter ses rêves et réactions", description: "Guide pratique du journal de suivi : comment noter, quoi observer, interpréter ses progrès", duration: '10 min', url: null, thumbnail: DARK_BLUE_THUMB },
  v_sihr_p2_6: { id: 'v_sihr_p2_6', title: "Intensifier votre routine de mi-parcours", description: "Bilan de mi-parcours et ajustements : ajouter les adhkar supplémentaires recommandés par Ibn Baz", duration: '12 min', url: null, thumbnail: DARK_BLUE_THUMB },
  v_sihr_p3_1: { id: 'v_sihr_p3_1', title: "Pérenniser sa guérison : la protection durable", description: "Comment établir une routine de protection après la guérison — maintenir les acquis, prévenir les rechutes", duration: '15 min', url: null, thumbnail: DARK_BLUE_THUMB },
  v_sihr_p3_2: { id: 'v_sihr_p3_2', title: "Réciter les adhkar de protection : session complète", description: "Session guidée complète : récite avec moi tous les adhkar de protection selon la Sunna", duration: '25 min', url: null, thumbnail: DARK_BLUE_THUMB },
  v_sihr_p3_3: { id: 'v_sihr_p3_3', title: "Bilan final et plan de maintenance", description: "Comment évaluer sa guérison, que faire si certains symptômes persistent, quand consulter un raqi", duration: '12 min', url: null, thumbnail: DARK_BLUE_THUMB },
  v_sihr_p3_4: { id: 'v_sihr_p3_4', title: "Fortifier sa maison avec le Coran", description: "Tutoriel pratique : écouter Al-Baqara à la maison, purifier chaque pièce, protéger l'espace familial", duration: '15 min', url: null, thumbnail: DARK_BLUE_THUMB },

  v_mass_1: { id: 'v_mass_1', title: "Le Mass et les djinns : comprendre sans panique", description: "Tutoriel : types de mass, signaux diagnostiques (réaction au Coran), différence mass vs sihr vs psycho", duration: '15 min', url: null, thumbnail: GREY_BLUE_THUMB },
  v_mass_2: { id: 'v_mass_2', title: "Préparer votre séance de roqya audio à domicile", description: "Setup pratique : quelle récitation choisir, volume, position du corps, durée, que faire après", duration: '12 min', url: null, thumbnail: GREY_BLUE_THUMB },
  v_mass_3: { id: 'v_mass_3', title: "Réactions pendant la roqya : guide pratique", description: "Tutoriel : quelles réactions sont normales, lesquelles signalent une intensification, que faire dans chaque cas", duration: '15 min', url: null, thumbnail: GREY_BLUE_THUMB },
  v_mass_4: { id: 'v_mass_4', title: "Réciter sur eau et huile contre le Mass", description: "Démonstration complète : sourates + douas pour l'eau et l'huile spécifiques au mass djinni", duration: '15 min', url: null, thumbnail: GREY_BLUE_THUMB },
  v_mass_5: { id: 'v_mass_5', title: "Le bain Sidr contre le mass : protocole complet", description: "Tutoriel Ibn Qayyim adapté au mass : feuilles, récitations, intention, enchaînement des étapes", duration: '18 min', url: null, thumbnail: GREY_BLUE_THUMB },
  v_mass_6: { id: 'v_mass_6', title: "Maintenir les 5 prières : stratégies pratiques", description: "La prière comme bouclier contre le djinn : conseils pratiques pour maintenir la régularité même quand c'est difficile", duration: '12 min', url: null, thumbnail: GREY_BLUE_THUMB },
  v_mass_7: { id: 'v_mass_7', title: "Identifier les déclencheurs spirituels dans ta vie", description: "Méthode d'identification : quelles situations, personnes, lieux déclenchent les symptômes — garder un journal", duration: '10 min', url: null, thumbnail: GREY_BLUE_THUMB },
  v_mass_8: { id: 'v_mass_8', title: "Prières spéciales du soir pour la guérison", description: "Session guidée du soir : Al-Mulk + Mu'awwidhat + Ayat Al-Kursi + doua spéciale mass — récite avec moi", duration: '22 min', url: null, thumbnail: GREY_BLUE_THUMB },
  v_mass_9: { id: 'v_mass_9', title: "Évaluation de progression : mi-parcours", description: "Comment mesurer ta progression au jour 10 : checklist, critères d'amélioration, quand intensifier", duration: '10 min', url: null, thumbnail: GREY_BLUE_THUMB },
  v_mass_10: { id: 'v_mass_10', title: "Consolidation et protection finale", description: "Bilan final du programme mass : étapes de clôture, routine de protection longue durée, signaux d'alerte", duration: '15 min', url: null, thumbnail: GREY_BLUE_THUMB },

  v_waswas_1: { id: 'v_waswas_1', title: "Comprendre les waswas selon Ibn Taymiyya", description: "Tutoriel basé sur la Risalat al-Waswas : qu'est-ce que les waswas, d'où ils viennent, pourquoi c'est un test", duration: '15 min', url: null, thumbnail: GOLD_DARK_THUMB },
  v_waswas_2: { id: 'v_waswas_2', title: "La règle d'or : NE PAS répondre aux waswas", description: "Tutoriel pratique : pourquoi répondre renforce les waswas, la technique de l'indifférence islamique", duration: '12 min', url: null, thumbnail: GOLD_DARK_THUMB },
  v_waswas_3: { id: 'v_waswas_3', title: "Ta'awwudh en pratique : moment, méthode, intention", description: "Démonstration : quand et comment dire Ta'awwudh efficacement — les erreurs à éviter", duration: '10 min', url: null, thumbnail: GOLD_DARK_THUMB },
  v_waswas_4: { id: 'v_waswas_4', title: "Distinguer waswas spirituels vs trouble obsessionnel clinique", description: "Tutoriel critique : les différences importantes, quand consulter un médecin ou psychologue, les deux peuvent coexister", duration: '15 min', url: null, thumbnail: GOLD_DARK_THUMB },
  v_waswas_5: { id: 'v_waswas_5', title: "Technique de distraction intentionnelle islamique", description: "Méthode pratique : comment occuper l'esprit avec dhikr actif pour couper les waswas — exercices guidés", duration: '12 min', url: null, thumbnail: GOLD_DARK_THUMB },
  v_waswas_6: { id: 'v_waswas_6', title: "Journal des waswas : observer sans y répondre", description: "Tutoriel du journal de suivi spécial waswas : noter pour désamorcer, analyse hebdomadaire", duration: '10 min', url: null, thumbnail: GOLD_DARK_THUMB },
  v_waswas_7: { id: 'v_waswas_7', title: "Ayat Al-Kursi après chaque prière : pourquoi et comment", description: "Explication + démonstration : la protection post-prière quotidienne comme bouclier contre les waswas", duration: '8 min', url: null, thumbnail: GOLD_DARK_THUMB },
  v_waswas_8: { id: 'v_waswas_8', title: "Consolidation : récapitulatif et plan longue durée", description: "Session finale : ce que tu as accompli, les 5 habitudes à garder à vie, célébration de la victoire sur les waswas", duration: '15 min', url: null, thumbnail: GOLD_DARK_THUMB },

  v_psycho_1: { id: 'v_psycho_1', title: "Triangle Psycho-Roqya : le lien corps-âme-spirituel", description: "Tutoriel fondamental : comment le trauma fragilise, comment l'occulte exploite la psychologie, comment traiter les deux ensemble", duration: '20 min', url: null, thumbnail: PSYCHO_THUMB },
  v_psycho_2: { id: 'v_psycho_2', title: "Journal thérapeutique guidé : séance 1", description: "Séance d'écriture guidée : identifier et nommer ses blessures émotionnelles, libérer ce qui est bloqué intérieurement", duration: '25 min', url: null, thumbnail: PSYCHO_THUMB },
  v_psycho_3: { id: 'v_psycho_3', title: "Respiration ancrée dans le dhikr", description: "Technique de régulation émotionnelle islamique : inspiration/expiration avec SubhanAllah/Alhamdulillah — pratique guidée", duration: '15 min', url: null, thumbnail: PSYCHO_THUMB },
  v_psycho_4: { id: 'v_psycho_4', title: "Pardonner pour guérir : doua du pardon guidée", description: "Session de pardon guidée : pourquoi pardonner libère l'esprit des attaques, doua prophétique du pardon", duration: '20 min', url: null, thumbnail: PSYCHO_THUMB },
  v_psycho_5: { id: 'v_psycho_5', title: "Identifier les blessures qui fragilisent spirituellement", description: "Tutoriel d'auto-analyse : quel trauma ouvre une vulnérabilité, méthode islamique de reconstruction identitaire", duration: '18 min', url: null, thumbnail: PSYCHO_THUMB },
  v_psycho_6: { id: 'v_psycho_6', title: "Reconstruction de l'identité spirituelle après trauma", description: "Session guidée de reconnexion à Allah : dépasser la honte, restaurer la confiance en soi et en Allah", duration: '22 min', url: null, thumbnail: PSYCHO_THUMB },
};

// ═══════════════════════════════════════════════════════
// BASE CHECKLISTS
// ═══════════════════════════════════════════════════════

const BASE_MORNING: ChecklistItem[] = [
  { id: 'm_fatiha', label: 'Sourate Al-Fatiha', arabic: '\u0633\u0648\u0631\u0629 \u0627\u0644\u0641\u0627\u062a\u062d\u0629', repetitions: '7x' },
  { id: 'm_kursi', label: 'Ayat Al-Kursi', arabic: '\u0622\u064a\u0629 \u0627\u0644\u0643\u0631\u0633\u064a', repetitions: '3x' },
  { id: 'm_ikhlas', label: 'Sourate Al-Ikhlas', arabic: '\u0633\u0648\u0631\u0629 \u0627\u0644\u0625\u062e\u0644\u0627\u0635', repetitions: '3x' },
  { id: 'm_falaq', label: 'Sourate Al-Falaq', arabic: '\u0633\u0648\u0631\u0629 \u0627\u0644\u0641\u0644\u0642', repetitions: '3x' },
  { id: 'm_nas', label: 'Sourate An-Nas', arabic: '\u0633\u0648\u0631\u0629 \u0627\u0644\u0646\u0627\u0633', repetitions: '3x' },
  { id: 'm_adhkar', label: 'Adhkar du matin', arabic: '\u0623\u0630\u0643\u0627\u0631 \u0627\u0644\u0635\u0628\u0627\u062d' },
];

const BASE_EVENING: ChecklistItem[] = [
  { id: 'e_kursi', label: 'Ayat Al-Kursi', arabic: '\u0622\u064a\u0629 \u0627\u0644\u0643\u0631\u0633\u064a', repetitions: '1x' },
  { id: 'e_mulk', label: 'Sourate Al-Mulk', arabic: '\u0633\u0648\u0631\u0629 \u0627\u0644\u0645\u0644\u0643' },
  { id: 'e_3qul', label: '3 Qul soufflés sur les mains', arabic: '\u0633\u0648\u0631\u0629 \u0627\u0644\u0625\u062e\u0644\u0627\u0635\u060c \u0627\u0644\u0641\u0644\u0642\u060c \u0627\u0644\u0646\u0627\u0633', repetitions: '3x' },
  { id: 'e_adhkar', label: 'Adhkar du soir', arabic: '\u0623\u0630\u0643\u0627\u0631 \u0627\u0644\u0645\u0633\u0627\u0621' },
];

// ═══════════════════════════════════════════════════════
// PROGRAM CONTENT FUNCTIONS
// ═══════════════════════════════════════════════════════

function getAynDayContent(day: number): DayContent {
  const morning: ChecklistItem[] = [...BASE_MORNING];
  const evening: ChecklistItem[] = [...BASE_EVENING];

  if (day === 2 || day === 4 || day === 6) {
    morning.push({ id: 'm_dua_prot', label: 'Dua de protection', repetitions: '3x' });
  }
  if (day === 4) {
    morning.push({ id: 'm_istighfar', label: 'Istighfar', arabic: '\u0623\u0633\u062a\u063a\u0641\u0631 \u0627\u0644\u0644\u0647', repetitions: '33x' });
  }
  if (day === 6) {
    morning.push({ id: 'm_bismillah', label: 'Bismillahi alladhi la yadurru...', repetitions: '3x' });
  }

  const dayMap: Record<number, Partial<DayContent>> = {
    1: {
      theme: 'Comprendre et se préparer',
      focus: 'Poser les bases de votre guérison',
      bonus: [
        { id: 'b1_1', label: "Boire de l'eau coranisée", arabic: '\u0645\u0627\u0621 \u0645\u0642\u0631\u0648\u0621 \u0639\u0644\u064a\u0647' },
        { id: 'b1_2', label: 'Sadaqa (aumône)', arabic: '\u0635\u062f\u0642\u0629' },
      ],
      video: ALL_VIDEOS.v_ayn_1,
      scholarNote: "Ibn Qayyim (Zad al-Ma'ad) : 'L'œil est un trait lancé depuis l'âme envieuse vers la personne enviée'",
    },
    2: {
      theme: "Préparation de l'eau coranisée",
      focus: 'Apprendre à préparer votre outil de guérison',
      bonus: [
        { id: 'b2_1', label: "Préparer l'eau coranisée (Al-Fatiha 7x soufflée)", arabic: '\u0645\u0627\u0621 \u0645\u0642\u0631\u0648\u0621 \u0639\u0644\u064a\u0647' },
        { id: 'b2_2', label: 'Ghusl recommandé' },
      ],
      video: ALL_VIDEOS.v_ayn_2,
      scholarNote: "Le Prophète ﷺ a prescrit d'utiliser l'eau récitée pour le traitement du 'Ayn",
    },
    3: {
      theme: 'Technique de récitation sur soi',
      focus: 'Apprendre à se faire la roqya soi-même',
      bonus: [
        { id: 'b3_1', label: 'Se réciter Al-Fatiha 7x en soufflant sur ses mains', arabic: '\u0633\u0648\u0631\u0629 \u0627\u0644\u0641\u0627\u062a\u062d\u0629' },
        { id: 'b3_2', label: 'Passer les mains sur tout le corps après récitation' },
      ],
      video: ALL_VIDEOS.v_ayn_3,
      scholarNote: 'Ibn Baz (r.a.) : La ruqya sur soi-même est autorisée et recommandée',
    },
    4: {
      theme: 'Le Ghusl purificateur',
      focus: 'Effectuer le bain purifiant avec eau coranisée',
      bonus: [
        { id: 'b4_1', label: 'Ghusl complet avec eau récitée selon la méthode prophétique' },
        { id: 'b4_2', label: 'Sadaqa', arabic: '\u0635\u062f\u0642\u0629' },
      ],
      video: ALL_VIDEOS.v_ayn_4,
      scholarNote: "Al-Bukhari rapporte que le Prophète ﷺ ordonnait au fautif de faire ses ablutions pour le blessé",
    },
    5: {
      theme: 'Renforcement de la protection',
      focus: 'Consolider votre bouclier spirituel',
      bonus: [
        { id: 'b5_1', label: 'Miel le matin à jeun', arabic: '\u0639\u0633\u0644' },
        { id: 'b5_2', label: "Récitation sur huile d'olive", arabic: '\u0632\u064a\u062a \u0632\u064a\u062a\u0648\u0646 \u0645\u0642\u0631\u0648\u0621 \u0639\u0644\u064a\u0647' },
      ],
      video: ALL_VIDEOS.v_ayn_5,
    },
    6: {
      theme: 'Adhkar intensifs de protection',
      focus: 'Renforcer vos adhkar quotidiens',
      bonus: [
        { id: 'b6_1', label: 'Lire ou écouter Sourate Al-Baqara' },
        { id: 'b6_2', label: 'Dua Bismillah', repetitions: '3x' },
      ],
      video: ALL_VIDEOS.v_ayn_6,
    },
    7: {
      theme: 'Bilan et protection durable',
      focus: 'Évaluer votre progression et planifier la suite',
      bonus: [
        { id: 'b7_1', label: "Évaluer les symptômes et noter l'évolution" },
        { id: 'b7_2', label: 'Décider si une séance de suivi est nécessaire' },
        { id: 'b7_3', label: 'Sadaqa', arabic: '\u0635\u062f\u0642\u0629' },
      ],
      scholarNote: 'Ibn Qayyim : Si les symptômes persistent après ce programme, un raqi expérimenté peut être utile',
    },
  };

  const config = dayMap[day] ?? dayMap[7];
  return {
    theme: config.theme ?? `Jour ${day} — Roqya quotidienne`,
    focus: config.focus ?? 'Maintenir la routine de guérison',
    morning,
    evening,
    bonus: config.bonus ?? [],
    video: config.video,
    scholarNote: config.scholarNote,
  };
}

function getSihrDayContent(day: number): DayContent {
  const phase = day <= 7 ? 1 : day <= 21 ? 2 : 3;
  const morning: ChecklistItem[] = [...BASE_MORNING];
  const evening: ChecklistItem[] = [...BASE_EVENING];

  if (phase === 1) {
    morning.push({ id: 'm_istighfar', label: 'Istighfar', arabic: '\u0623\u0633\u062a\u063a\u0641\u0631 \u0627\u0644\u0644\u0647', repetitions: '100x' });
    evening.push({ id: 'e_istighfar', label: 'Istighfar', arabic: '\u0623\u0633\u062a\u063a\u0641\u0631 \u0627\u0644\u0644\u0647', repetitions: '33x' });
    evening.push({ id: 'e_doua_sommeil', label: 'Doua du sommeil', arabic: '\u0628\u0627\u0633\u0645\u0643 \u0627\u0644\u0644\u0647\u0645 \u0623\u0645\u0648\u062a \u0648\u0623\u062d\u064a\u0627' });
  } else if (phase === 2) {
    morning.push({ id: 'm_baqara', label: 'Al-Baqara v285-286' });
    morning.push({ id: 'm_versets_sihr', label: 'Versets anti-sihr (7:117, 10:79, 20:65)' });
    evening.push({ id: 'e_sajda', label: 'Sourate As-Sajda' });
    evening.push({ id: 'e_istighfar', label: 'Istighfar', arabic: '\u0623\u0633\u062a\u063a\u0641\u0631 \u0627\u0644\u0644\u0647', repetitions: '33x' });
    evening.push({ id: 'e_doua_sommeil', label: 'Doua du sommeil', arabic: '\u0628\u0627\u0633\u0645\u0643 \u0627\u0644\u0644\u0647\u0645 \u0623\u0645\u0648\u062a \u0648\u0623\u062d\u064a\u0627' });
  } else {
    morning.push({ id: 'm_dua_prot', label: 'Dua de protection', repetitions: '3x' });
    evening.push({ id: 'e_istighfar', label: 'Istighfar', arabic: '\u0623\u0633\u062a\u063a\u0641\u0631 \u0627\u0644\u0644\u0647', repetitions: '33x' });
    evening.push({ id: 'e_doua_sommeil', label: 'Doua du sommeil', arabic: '\u0628\u0627\u0633\u0645\u0643 \u0627\u0644\u0644\u0647\u0645 \u0623\u0645\u0648\u062a \u0648\u0623\u062d\u064a\u0627' });
  }

  const bonusP1: ChecklistItem[] = [
    { id: 'b_bain_sidr', label: 'Bain Sidr (1 fois/semaine minimum)', arabic: '\u0645\u0627\u0621 \u0627\u0644\u0633\u062f\u0631' },
    { id: 'b_eau', label: 'Eau coranisée quotidienne', arabic: '\u0645\u0627\u0621 \u0645\u0642\u0631\u0648\u0621 \u0639\u0644\u064a\u0647' },
    { id: 'b_tawba', label: 'Tawba sincère', arabic: '\u062a\u0648\u0628\u0629' },
    { id: 'b_sadaqa', label: 'Sadaqa', arabic: '\u0635\u062f\u0642\u0629' },
  ];
  const bonusP2: ChecklistItem[] = [
    { id: 'b_baqara_full', label: 'Sourate Al-Baqara complète (écoute)' },
    { id: 'b_trio', label: "Trio : eau + miel + huile d'olive", arabic: '\u0645\u0627\u0621 \u0645\u0642\u0631\u0648\u0621 \u0639\u0644\u064a\u0647\u060c \u0639\u0633\u0644\u060c \u0632\u064a\u062a \u0632\u064a\u062a\u0648\u0646 \u0645\u0642\u0631\u0648\u0621 \u0639\u0644\u064a\u0647' },
    { id: 'b_sadaqa', label: 'Sadaqa', arabic: '\u0635\u062f\u0642\u0629' },
  ];
  const bonusP3: ChecklistItem[] = [
    { id: 'b_dhikr', label: 'Dhikr intensif', repetitions: '100x' },
    { id: 'b_eau', label: 'Eau coranisée quotidienne', arabic: '\u0645\u0627\u0621 \u0645\u0642\u0631\u0648\u0621 \u0639\u0644\u064a\u0647' },
    { id: 'b_sadaqa', label: 'Sadaqa', arabic: '\u0635\u062f\u0642\u0629' },
    { id: 'b_quran', label: 'Lire une page de Coran' },
  ];

  const videoMap: Record<number, VideoSlot> = {
    1: ALL_VIDEOS.v_sihr_p1_1,
    2: ALL_VIDEOS.v_sihr_p1_2,
    3: ALL_VIDEOS.v_sihr_p1_3,
    4: ALL_VIDEOS.v_sihr_p1_4,
    5: ALL_VIDEOS.v_sihr_p1_5,
    8: ALL_VIDEOS.v_sihr_p2_1,
    9: ALL_VIDEOS.v_sihr_p2_2,
    10: ALL_VIDEOS.v_sihr_p2_3,
    12: ALL_VIDEOS.v_sihr_p2_4,
    14: ALL_VIDEOS.v_sihr_p2_5,
    21: ALL_VIDEOS.v_sihr_p2_6,
    22: ALL_VIDEOS.v_sihr_p3_1,
    25: ALL_VIDEOS.v_sihr_p3_2,
    27: ALL_VIDEOS.v_sihr_p3_4,
    30: ALL_VIDEOS.v_sihr_p3_3,
  };

  const themeMap: Record<number, string> = {
    1: 'Phase 1 : Purification — Comprendre le sihr',
    2: "Préparer l'eau coranisée",
    3: 'Le bain au Sidr',
    4: "L'huile d'olive coranisée",
    5: 'La Tawba purificatrice',
    6: 'Renforcement de la base spirituelle',
    7: 'Bilan de purification',
    8: 'Phase 2 : Traitement — Écouter Al-Baqara',
    9: 'Les versets anti-sihr',
    10: 'Le trio thérapeutique',
    11: 'Consolidation du traitement',
    12: 'Reconnaître les réactions de traitement',
    13: 'Consolidation du traitement',
    14: 'Première évaluation et journal',
    21: 'Mi-parcours : intensification',
    22: 'Phase 3 : Consolidation — Pérenniser la guérison',
    25: 'Adhkar complets de protection',
    27: 'Fortifier votre maison',
    30: 'Bilan final et plan de maintenance',
  };

  return {
    theme: themeMap[day] ?? `Phase ${phase} — Jour ${day} : Maintien du traitement intensif`,
    focus: phase === 1 ? 'Purification spirituelle quotidienne' : phase === 2 ? 'Traitement intensif par la roqya' : 'Consolidation et protection durable',
    morning,
    evening,
    bonus: phase === 1 ? bonusP1 : phase === 2 ? bonusP2 : bonusP3,
    video: videoMap[day],
  };
}

function getMassDayContent(day: number): DayContent {
  const morning: ChecklistItem[] = [
    ...BASE_MORNING,
    { id: 'm_versets_roqya', label: 'Versets de roqya', repetitions: '3x' },
    { id: 'm_dua_prot', label: 'Dua de protection' },
  ];
  const evening: ChecklistItem[] = [
    ...BASE_EVENING,
    { id: 'e_dua_mass', label: 'Dua spécifique mass' },
    { id: 'e_doua_sommeil', label: 'Doua du sommeil', arabic: '\u0628\u0627\u0633\u0645\u0643 \u0627\u0644\u0644\u0647\u0645 \u0623\u0645\u0648\u062a \u0648\u0623\u062d\u064a\u0627' },
  ];
  const bonus: ChecklistItem[] = [
    { id: 'b_bain_sidr', label: 'Bain Sidr (hebdomadaire)', arabic: '\u0645\u0627\u0621 \u0627\u0644\u0633\u062f\u0631' },
    { id: 'b_eau', label: 'Eau coranisée quotidienne', arabic: '\u0645\u0627\u0621 \u0645\u0642\u0631\u0648\u0621 \u0639\u0644\u064a\u0647' },
    { id: 'b_huile', label: "Huile d'olive récitée (application)", arabic: '\u0632\u064a\u062a \u0632\u064a\u062a\u0648\u0646 \u0645\u0642\u0631\u0648\u0621 \u0639\u0644\u064a\u0647' },
    { id: 'b_roqya_audio', label: 'Session de roqya audio (30 min minimum)' },
  ];

  const videoMap: Record<number, VideoSlot> = {
    1: ALL_VIDEOS.v_mass_1,
    2: ALL_VIDEOS.v_mass_2,
    3: ALL_VIDEOS.v_mass_3,
    4: ALL_VIDEOS.v_mass_4,
    7: ALL_VIDEOS.v_mass_5,
    10: ALL_VIDEOS.v_mass_9,
    14: ALL_VIDEOS.v_mass_7,
    17: ALL_VIDEOS.v_mass_8,
    21: ALL_VIDEOS.v_mass_10,
  };

  const themeMap: Record<number, string> = {
    1: 'Comprendre le mass et se préparer',
    2: 'Préparer la roqya audio à domicile',
    3: 'Comprendre les réactions de la roqya',
    4: "L'eau et l'huile coranisées",
    5: 'Renforcement de la routine',
    6: 'Intensification du traitement',
    7: 'Le bain Sidr',
    8: 'Maintien et régularité',
    9: 'Approfondissement de la roqya',
    10: 'Bilan de progression + identifier déclencheurs',
    14: 'Journal et déclencheurs spirituels',
    17: 'Prières spéciales du soir',
    21: 'Bilan final',
  };

  return {
    theme: themeMap[day] ?? `Jour ${day} — Traitement du mass`,
    focus: day <= 7 ? 'Établir la routine de traitement' : day <= 14 ? 'Intensification et suivi' : 'Consolidation et protection',
    morning,
    evening,
    bonus,
    video: videoMap[day],
  };
}

function getWaswasDayContent(day: number): DayContent {
  const morning: ChecklistItem[] = [
    { id: 'm_tawwudh', label: "Ta'awwudh", arabic: '\u0623\u0639\u0648\u0630 \u0628\u0627\u0644\u0644\u0647 \u0645\u0646 \u0627\u0644\u0634\u064a\u0637\u0627\u0646 \u0627\u0644\u0631\u062c\u064a\u0645' },
    { id: 'm_fatiha', label: 'Sourate Al-Fatiha', arabic: '\u0633\u0648\u0631\u0629 \u0627\u0644\u0641\u0627\u062a\u062d\u0629', repetitions: '3x' },
    { id: 'm_kursi', label: 'Ayat Al-Kursi', arabic: '\u0622\u064a\u0629 \u0627\u0644\u0643\u0631\u0633\u064a', repetitions: '3x' },
    { id: 'm_ikhlas', label: 'Sourate Al-Ikhlas', arabic: '\u0633\u0648\u0631\u0629 \u0627\u0644\u0625\u062e\u0644\u0627\u0635', repetitions: '3x' },
    { id: 'm_falaq', label: 'Sourate Al-Falaq', arabic: '\u0633\u0648\u0631\u0629 \u0627\u0644\u0641\u0644\u0642', repetitions: '3x' },
    { id: 'm_nas', label: 'Sourate An-Nas', arabic: '\u0633\u0648\u0631\u0629 \u0627\u0644\u0646\u0627\u0633', repetitions: '3x' },
    { id: 'm_adhkar', label: 'Adhkar du matin', arabic: '\u0623\u0630\u0643\u0627\u0631 \u0627\u0644\u0635\u0628\u0627\u062d' },
    { id: 'm_istighfar', label: 'Istighfar', arabic: '\u0623\u0633\u062a\u063a\u0641\u0631 \u0627\u0644\u0644\u0647', repetitions: '100x' },
  ];
  const evening: ChecklistItem[] = [
    { id: 'e_kursi_priere', label: 'Ayat Al-Kursi après chaque prière', arabic: '\u0622\u064a\u0629 \u0627\u0644\u0643\u0631\u0633\u064a' },
    { id: 'e_mulk', label: 'Sourate Al-Mulk', arabic: '\u0633\u0648\u0631\u0629 \u0627\u0644\u0645\u0644\u0643' },
    { id: 'e_3qul', label: '3 Qul', arabic: '\u0633\u0648\u0631\u0629 \u0627\u0644\u0625\u062e\u0644\u0627\u0635\u060c \u0627\u0644\u0641\u0644\u0642\u060c \u0627\u0644\u0646\u0627\u0633', repetitions: '3x' },
    { id: 'e_adhkar', label: 'Adhkar du soir', arabic: '\u0623\u0630\u0643\u0627\u0631 \u0627\u0644\u0645\u0633\u0627\u0621' },
    { id: 'e_istighfar', label: 'Istighfar', arabic: '\u0623\u0633\u062a\u063a\u0641\u0631 \u0627\u0644\u0644\u0647', repetitions: '33x' },
    { id: 'e_doua_sommeil', label: 'Doua du sommeil', arabic: '\u0628\u0627\u0633\u0645\u0643 \u0627\u0644\u0644\u0647\u0645 \u0623\u0645\u0648\u062a \u0648\u0623\u062d\u064a\u0627' },
  ];
  const bonus: ChecklistItem[] = [
    { id: 'b_ignore', label: 'Ignorer consciemment 1 waswas (noter dans journal)' },
    { id: 'b_quran', label: 'Lire 1 page de Coran' },
    { id: 'b_tawwudh_waswas', label: "Ta'awwudh à chaque waswas ressenti", arabic: '\u0623\u0639\u0648\u0630 \u0628\u0627\u0644\u0644\u0647 \u0645\u0646 \u0627\u0644\u0634\u064a\u0637\u0627\u0646 \u0627\u0644\u0631\u062c\u064a\u0645' },
  ];

  const videoMap: Record<number, VideoSlot> = {
    1: ALL_VIDEOS.v_waswas_1,
    2: ALL_VIDEOS.v_waswas_2,
    3: ALL_VIDEOS.v_waswas_3,
    4: ALL_VIDEOS.v_waswas_4,
    5: ALL_VIDEOS.v_waswas_5,
    7: ALL_VIDEOS.v_waswas_6,
    8: ALL_VIDEOS.v_waswas_7,
    14: ALL_VIDEOS.v_waswas_8,
  };

  const themeMap: Record<number, string> = {
    1: 'Comprendre les waswas — la vérité libératrice',
    2: "La règle d'or : ne pas répondre",
    3: "Ta'awwudh en pratique",
    4: 'Waswas spirituels vs trouble clinique',
    5: 'La distraction intentionnelle',
    6: "Pratique de l'indifférence islamique",
    7: 'Journal des waswas — observer sans répondre',
    8: 'Ayat Al-Kursi après chaque prière',
    14: 'Consolidation — félicitations pour votre victoire',
  };

  return {
    theme: themeMap[day] ?? `Jour ${day} — Maintien de la résistance`,
    focus: day <= 7 ? 'Apprendre à ignorer les waswas' : 'Consolider la victoire spirituelle',
    morning,
    evening,
    bonus,
    video: videoMap[day],
  };
}

function getDayContent(type: AffectionType, day: number): DayContent {
  switch (type) {
    case 'ayn': return getAynDayContent(day);
    case 'sihr': return getSihrDayContent(day);
    case 'mass': return getMassDayContent(day);
    case 'waswas': return getWaswasDayContent(day);
  }
}

// ═══════════════════════════════════════════════════════
// PROGRAM CONFIG
// ═══════════════════════════════════════════════════════

const PROGRAM_CONFIG = {
  ayn: { title: "Programme 'Ayn (Mauvais Œil)", duration: 7, icon: Eye, color: 'gold', description: "7 jours de roqya ciblée contre le mauvais œil selon la Sunna prophétique" },
  sihr: { title: 'Programme Sihr (Envoûtement)', duration: 30, icon: Flame, color: 'red-dark', description: '30 jours en 3 phases : purification, traitement intensif, consolidation — selon Ibn Qayyim' },
  mass: { title: 'Programme Mass (Djinn)', duration: 21, icon: Shield, color: 'blue-dark', description: '21 jours de roqya intensive avec suivi quotidien — basé sur la méthode des savants' },
  waswas: { title: 'Programme Waswas (Obsessions)', duration: 14, icon: MessageCircle, color: 'gold', description: '14 jours pour vaincre les waswas selon Ibn Taymiyya (Risalat al-Waswas)' },
} as const;

// ═══════════════════════════════════════════════════════
// DIAGNOSIS ENGINE
// ═══════════════════════════════════════════════════════

function computeScores(answersMap: Record<string, string[]>): Scores {
  const scores: Scores = { ayn: 0, sihr: 0, mass: 0, waswas: 0, psycho: 0 };
  for (const question of QUESTIONS) {
    const selectedIds = answersMap[question.id] ?? [];
    for (const optionId of selectedIds) {
      const option = question.options.find(o => o.id === optionId);
      if (option) {
        const s = option.scores;
        if (s.ayn !== undefined) scores.ayn += s.ayn;
        if (s.sihr !== undefined) scores.sihr += s.sihr;
        if (s.mass !== undefined) scores.mass += s.mass;
        if (s.waswas !== undefined) scores.waswas += s.waswas;
        if (s.psycho !== undefined) scores.psycho += s.psycho;
      }
    }
  }
  scores.ayn = Math.max(0, scores.ayn);
  scores.sihr = Math.max(0, scores.sihr);
  scores.mass = Math.max(0, scores.mass);
  scores.waswas = Math.max(0, scores.waswas);
  scores.psycho = Math.max(0, scores.psycho);
  return scores;
}

function buildDiagnosis(scores: Scores, medicalFlag: boolean): DiagnosisResult {
  const afflictionEntries: [AffectionType, number][] = [
    ['ayn', scores.ayn],
    ['sihr', scores.sihr],
    ['mass', scores.mass],
    ['waswas', scores.waswas],
  ];

  let dominantType: AffectionType = 'ayn';
  let dominantScore = 0;
  for (const [type, score] of afflictionEntries) {
    if (score > dominantScore) {
      dominantScore = score;
      dominantType = type;
    }
  }

  const psychoScore = scores.psycho;
  let profile: DiagnosticProfile;
  if (medicalFlag && dominantScore < 3) {
    profile = 'medical';
  } else if (psychoScore >= 6 && dominantScore < 4) {
    profile = 'psycho';
  } else if (psychoScore >= 4 && dominantScore >= 4) {
    profile = 'hybrid';
  } else {
    profile = 'occult';
  }

  const totalDays = PROGRAM_CONFIG[dominantType].duration;

  const ctaByType: Record<AffectionType, { ctaTitle: string; ctaMessage: string; ctaButtonLabel: string }> = {
    ayn: {
      ctaTitle: 'Un suivi personnalisé peut accélérer votre guérison',
      ctaMessage: "Si les symptômes du 'Ayn persistent après ce programme, une séance avec un raqi peut dissoudre ce qui reste plus rapidement.",
      ctaButtonLabel: "Réserver une consultation 'Ayn",
    },
    sihr: {
      ctaTitle: 'Le sihr nécessite parfois un accompagnement direct',
      ctaMessage: "Pour les cas de sihr complexes ou anciens, une séance avec un raqi spécialisé peut déverrouiller des blocages profonds que la roqya à domicile ne suffit pas à résoudre.",
      ctaButtonLabel: 'Réserver une séance anti-sihr',
    },
    mass: {
      ctaTitle: 'Une séance directe est fortement recommandée',
      ctaMessage: "Le mass djinni bénéficie grandement d'une séance de roqya avec contact direct ou audio intensif par un raqi expérimenté. Ne restez pas seul(e) dans ce combat.",
      ctaButtonLabel: 'Réserver une séance de roqya',
    },
    waswas: {
      ctaTitle: 'Accompagnement dual recommandé',
      ctaMessage: "Les waswas sévères bénéficient d'un double accompagnement : roqya spirituelle ET soutien psychologique. Un raqi formé peut vous orienter.",
      ctaButtonLabel: 'Réserver un accompagnement waswas',
    },
  };

  let { ctaTitle, ctaMessage, ctaButtonLabel } = ctaByType[dominantType];

  if (profile === 'psycho') {
    ctaTitle = 'Accompagnement psychologique recommandé';
    ctaMessage = "Vos difficultés semblent principalement liées à des blessures émotionnelles. Un accompagnement avec un professionnel de santé mentale et un suivi spirituel doux est conseillé.";
    ctaButtonLabel = 'Prendre rendez-vous';
  } else if (profile === 'hybrid') {
    ctaTitle = 'Approche intégrative nécessaire';
    ctaMessage = "Votre profil combine des dimensions spirituelles ET psychologiques. Une approche duale — roqya ET accompagnement émotionnel — donnera les meilleurs résultats.";
    ctaButtonLabel = 'Réserver une séance intégrative';
  } else if (profile === 'medical') {
    ctaTitle = 'Consultez un médecin en priorité';
    ctaMessage = "Avant toute chose, une consultation médicale complète est nécessaire pour éliminer les causes physiques. La roqya et la médecine sont complémentaires.";
    ctaButtonLabel = 'En savoir plus sur notre approche';
  }

  return {
    affectionType: dominantType,
    profile,
    scores,
    dominantScore,
    psychoScore,
    totalDays,
    hasMedicalFlag: medicalFlag,
    ctaTitle,
    ctaMessage,
    ctaButtonLabel,
  };
}

// ═══════════════════════════════════════════════════════
// STORAGE
// ═══════════════════════════════════════════════════════

const STORAGE_KEY = 'ruqya_v2_program_state';
const STORAGE_KEY_Q = 'ruqya_v2_questionnaire';

function loadProgramState(): ProgramState | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as ProgramState;
  } catch {
    return null;
  }
}

function saveProgramState(state: ProgramState) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

// ═══════════════════════════════════════════════════════
// TYPE / PROFILE LABELS
// ═══════════════════════════════════════════════════════

const TYPE_LABELS: Record<AffectionType, { label: string; color: string; bg: string; Icon: React.ElementType }> = {
  ayn: { label: "'Ayn — Mauvais Œil", color: 'text-amber-700', bg: 'bg-amber-50 border-amber-200', Icon: Eye },
  sihr: { label: 'Sihr — Envoûtement', color: 'text-red-700', bg: 'bg-red-50 border-red-200', Icon: Flame },
  mass: { label: 'Mass — Djinn', color: 'text-blue-700', bg: 'bg-blue-50 border-blue-200', Icon: Shield },
  waswas: { label: 'Waswas — Obsessions', color: 'text-purple-700', bg: 'bg-purple-50 border-purple-200', Icon: MessageCircle },
};

const PROFILE_LABELS: Record<DiagnosticProfile, { label: string; color: string; bg: string }> = {
  occult: { label: 'Profil Spirituel', color: 'text-green-700', bg: 'bg-green-50 border-green-200' },
  psycho: { label: 'Profil Psychologique', color: 'text-blue-700', bg: 'bg-blue-50 border-blue-200' },
  hybrid: { label: 'Double Cause', color: 'text-purple-700', bg: 'bg-purple-50 border-purple-200' },
  medical: { label: 'Urgence Médicale', color: 'text-orange-700', bg: 'bg-orange-50 border-orange-200' },
};

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
    const typeInfo = TYPE_LABELS[diagnosis.affectionType];
    const profileInfo = PROFILE_LABELS[diagnosis.profile];
    const config = PROGRAM_CONFIG[diagnosis.affectionType];
    const IconComp = config.icon;
    const showPsychoModule = diagnosis.profile === 'hybrid' || diagnosis.profile === 'psycho';

    return (
      <div className="min-h-screen bg-cream pb-20">
        <div className="max-w-lg mx-auto px-4 pt-8 space-y-5">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-text-primary">Votre diagnostic</h1>
            <p className="mt-1 text-sm text-text-secondary">Basé sur vos réponses</p>
          </div>

          {/* Badges + scores */}
          <div className="card-islamic p-5">
            <div className="flex flex-wrap gap-2 mb-4">
              <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-sm font-semibold ${typeInfo.bg} ${typeInfo.color}`}>
                <typeInfo.Icon className="h-4 w-4" />
                {typeInfo.label}
              </span>
              <span className={`inline-flex items-center rounded-full border px-3 py-1 text-sm font-medium ${profileInfo.bg} ${profileInfo.color}`}>
                {profileInfo.label}
              </span>
            </div>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-xs text-text-secondary mb-1">
                  <span>Score spirituel ({diagnosis.affectionType})</span>
                  <span className="font-semibold">{diagnosis.dominantScore}/15</span>
                </div>
                <div className="h-2.5 bg-bg-cream-dark rounded-full overflow-hidden">
                  <div className="h-full bg-green-islamic rounded-full" style={{ width: `${Math.min((diagnosis.dominantScore / 15) * 100, 100)}%` }} />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-xs text-text-secondary mb-1">
                  <span>Score psychologique</span>
                  <span className="font-semibold">{diagnosis.psychoScore}/15</span>
                </div>
                <div className="h-2.5 bg-bg-cream-dark rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500 rounded-full" style={{ width: `${Math.min((diagnosis.psychoScore / 15) * 100, 100)}%` }} />
                </div>
              </div>
            </div>
          </div>

          {/* Medical warning */}
          {diagnosis.profile === 'medical' && (
            <div className="rounded-xl border border-orange-200 bg-orange-50 p-4 flex gap-3">
              <AlertTriangle className="h-5 w-5 text-orange-600 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-orange-800">Consultation médicale recommandée avant de commencer</p>
                <p className="mt-1 text-xs text-orange-700">Certains de vos symptômes peuvent avoir une origine médicale. Consultez un médecin en priorité. La roqya et la médecine sont complémentaires.</p>
              </div>
            </div>
          )}

          {/* Psycho info */}
          {showPsychoModule && (
            <div className="rounded-xl border border-blue-200 bg-blue-50 p-4 flex gap-3">
              <Info className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-blue-800">Triangle Psycho-Roqya</p>
                <p className="mt-1 text-xs text-blue-700">
                  L'occulte peut exploiter les blessures psychologiques non guéries, et la psychologie peut être fragilisée par l'occulte. Une approche intégrative combinant roqya et accompagnement émotionnel vous donnera les meilleurs résultats.
                </p>
              </div>
            </div>
          )}

          {/* Program card */}
          <div className="card-islamic p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-islamic/10">
                <IconComp className="h-5 w-5 text-green-islamic" />
              </div>
              <div>
                <h3 className="font-bold text-text-primary text-sm">{config.title}</h3>
                <p className="text-xs text-text-secondary">{config.duration} jours</p>
              </div>
            </div>
            <p className="text-sm text-text-secondary">{config.description}</p>
            <ul className="mt-3 space-y-1.5">
              {[
                'Checklist quotidienne matin et soir',
                'Vidéos tutorielles guidées (bientôt disponibles)',
                'Suivi des symptômes hebdomadaire',
                'Notes des savants (Ibn Qayyim, Ibn Taymiyya, Ibn Baz)',
              ].map(item => (
                <li key={item} className="flex items-center gap-2 text-xs text-text-secondary">
                  <CheckCircle2 className="h-3.5 w-3.5 text-green-islamic shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Psycho module videos */}
          {showPsychoModule && (
            <div className="card-islamic p-5">
              <div className="flex items-center gap-2 mb-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-100">
                  <BookOpen className="h-4 w-4 text-purple-600" />
                </div>
                <h3 className="font-bold text-text-primary text-sm">Module Psycho-Roqya (inclus)</h3>
              </div>
              <p className="text-xs text-text-secondary mb-3">6 vidéos thérapeutiques spéciales pour traiter la dimension psychologique de votre condition</p>
              <div className="grid grid-cols-2 gap-2">
                {[ALL_VIDEOS.v_psycho_1, ALL_VIDEOS.v_psycho_2, ALL_VIDEOS.v_psycho_3, ALL_VIDEOS.v_psycho_4, ALL_VIDEOS.v_psycho_5, ALL_VIDEOS.v_psycho_6].map(v => (
                  <div key={v.id} className="rounded-lg border border-purple-100 bg-purple-50 p-2">
                    <p className="text-xs font-medium text-purple-800 line-clamp-2">{v.title}</p>
                    <p className="text-xs text-purple-600 mt-0.5">{v.duration}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* CTA */}
          <div className="rounded-2xl border-2 border-gold bg-amber-50 p-5">
            <h3 className="font-bold text-text-primary">{diagnosis.ctaTitle}</h3>
            <p className="mt-2 text-sm text-text-secondary">{diagnosis.ctaMessage}</p>
            <Link
              to="/tarifs"
              className="mt-4 inline-block bg-gold text-white rounded-full px-5 py-2.5 text-sm font-semibold hover:bg-gold/90 transition-colors"
            >
              {diagnosis.ctaButtonLabel}
            </Link>
          </div>

          {/* Start button */}
          <button
            onClick={handleStartProgram}
            className="w-full bg-green-islamic text-white rounded-2xl py-4 font-bold text-base hover:bg-green-islamic/90 transition-colors shadow-lg"
          >
            {user
              ? (isPremium ? 'Commencer mon programme' : 'Commencer (jours 1-3 gratuits)')
              : 'Commencer mon programme'
            }
          </button>

          {programState && (
            <button
              onClick={() => setView('tracker')}
              className="w-full border-2 border-green-islamic text-green-islamic rounded-2xl py-3.5 font-semibold text-sm hover:bg-green-islamic/5 transition-colors"
            >
              Reprendre mon programme en cours →
            </button>
          )}

          <div className="text-center">
            <button
              onClick={() => {
                setView('questionnaire');
                setCurrentQuestionId('q_duration');
                setQuestionPath(['q_duration']);
              }}
              className="text-xs text-text-secondary underline hover:text-text-primary"
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

    const phaseType = (affectionType === 'sihr' || affectionType === 'mass') ? 'intensive' : 'light';
    const currentPhase = getCurrentPhase(phaseType, viewingDay);
    const showWeeklyCheck = shouldShowWeeklyCheck(startDate);

    return (
      <div className="min-h-screen bg-cream pb-24">
        <div className="max-w-lg mx-auto px-4 pt-6 space-y-4">
          {/* Program header */}
          <div className="card-islamic p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-islamic/10">
                  <IconComp className="h-5 w-5 text-green-islamic" />
                </div>
                <div>
                  <h2 className="font-bold text-text-primary text-sm">{config.title}</h2>
                  <p className="text-xs text-text-secondary">Depuis le {new Date(startDate).toLocaleDateString('fr-FR')}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold text-green-islamic">J{currentDay}</p>
                <p className="text-xs text-text-secondary">/{totalDays}</p>
              </div>
            </div>
            <div className="mt-3">
              <div className="flex justify-between text-xs text-text-secondary mb-1">
                <span>Progression globale</span>
                <span>{Math.round(progressPct)}%</span>
              </div>
              <div className="h-2 bg-bg-cream-dark rounded-full overflow-hidden">
                <div className="h-full bg-green-islamic rounded-full" style={{ width: `${progressPct}%` }} />
              </div>
            </div>
          </div>

          {/* Phase banner for sihr */}
          {affectionType === 'sihr' && (
            <PhaseBanner programType={phaseType} currentDay={viewingDay} />
          )}

          {/* Day navigation */}
          <div className="flex items-center justify-between">
            <button
              onClick={() => setViewingDay(d => Math.max(1, d - 1))}
              disabled={viewingDay <= 1}
              className="flex items-center gap-1 text-sm text-text-secondary disabled:opacity-40 hover:text-text-primary transition-colors"
            >
              <ChevronLeft className="h-4 w-4" />
              Jour précédent
            </button>
            <div className="text-center">
              <span className="text-sm font-bold text-text-primary">Jour {viewingDay}</span>
              <span className="text-xs text-text-secondary ml-1">/ {totalDays}</span>
            </div>
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
              className="flex items-center gap-1 text-sm text-text-secondary disabled:opacity-40 hover:text-text-primary transition-colors"
            >
              Jour suivant
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>

          {/* Day content */}
          <div className="card-islamic p-5">
            <div className="mb-4">
              <h3 className="font-bold text-text-primary">{dayContent.theme}</h3>
              <p className="text-sm text-text-secondary mt-0.5">{dayContent.focus}</p>
            </div>

            {dayContent.video && !isLocked && (
              <div className="mb-4">
                <VideoCard video={dayContent.video} />
              </div>
            )}

            {currentPhase && affectionType !== 'sihr' && (
              <div className="mb-4 flex items-center gap-2 rounded-xl bg-bg-cream p-3">
                <div className="h-2.5 w-2.5 rounded-full bg-green-islamic/30" />
                <span className="text-xs font-medium text-text-secondary">{currentPhase.title} — {currentPhase.subtitle}</span>
              </div>
            )}

            {isLocked ? (
              <PremiumGate />
            ) : (
              <>
                <ChecklistSection
                  title="Adhkar du matin"
                  items={dayContent.morning}
                  completedIds={dayProgress.morning}
                  onToggle={(id) => handleToggleChecklist(viewingDay, 'morning', id)}
                  icon={<Sun className="h-4 w-4 text-gold" />}
                />
                <ChecklistSection
                  title="Adhkar du soir"
                  items={dayContent.evening}
                  completedIds={dayProgress.evening}
                  onToggle={(id) => handleToggleChecklist(viewingDay, 'evening', id)}
                  icon={<Moon className="h-4 w-4 text-green-islamic" />}
                />
                <ChecklistSection
                  title="Actions du jour"
                  items={dayContent.bonus}
                  completedIds={dayProgress.bonus}
                  onToggle={(id) => handleToggleChecklist(viewingDay, 'bonus', id)}
                  icon={<Star className="h-4 w-4 text-gold" />}
                />
                {dayContent.scholarNote && (
                  <div className="mt-4 rounded-xl border border-gold/30 bg-amber-50 p-4">
                    <div className="flex items-start gap-2">
                      <BookOpen className="h-4 w-4 text-gold shrink-0 mt-0.5" />
                      <p className="text-xs text-amber-800 italic">{dayContent.scholarNote}</p>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Weekly check */}
          {showWeeklyCheck && (
            <div className="card-islamic p-4">
              <h3 className="font-semibold text-text-primary mb-3 text-sm">Bilan hebdomadaire</h3>
              <SymptomTracker startDate={startDate} onComplete={() => {}} />
            </div>
          )}

          {/* Symptom chart */}
          <div className="card-islamic p-4">
            <h3 className="font-semibold text-text-primary mb-3 text-sm">Évolution des symptômes</h3>
            <SymptomChart />
          </div>

          {/* Psycho module */}
          {showPsychoModule && (
            <div className="card-islamic p-4">
              <div className="flex items-center gap-2 mb-3">
                <BookOpen className="h-4 w-4 text-purple-600" />
                <h3 className="font-semibold text-text-primary text-sm">Module Psycho-Roqya</h3>
              </div>
              {isLocked ? <PremiumGate /> : <GuidedJournal currentDay={viewingDay} />}
            </div>
          )}

          <div className="text-center pt-4">
            <button
              onClick={handleResetProgram}
              className="text-xs text-red-400 underline hover:text-red-600 transition-colors"
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
        title="Programme de Roqya Personnalisé | MaRoqya"
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
