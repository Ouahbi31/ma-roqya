import { useState, useMemo, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  MessageCircle,
  Clock,
  Video,
  Globe,
  X,
  CalendarDays,
} from 'lucide-react';
import SEO from '../components/SEO';

// ═══ Slots (in production → Supabase) ═══
const WEEKLY_SLOTS: Record<number, string[]> = {
  1: ['09:00', '10:00', '14:00', '15:00', '16:00'],
  2: ['09:00', '10:00', '14:00', '15:00', '16:00'],
  3: ['09:00', '10:00', '14:00', '15:00', '16:00'],
  4: ['09:00', '10:00', '14:00', '15:00', '16:00'],
  5: ['09:00', '10:00', '14:00', '15:00', '16:00'],
  6: ['09:00', '10:00'],
};

function getSlotsForDate(dateStr: string): string[] {
  const d = new Date(dateStr + 'T00:00:00');
  return WEEKLY_SLOTS[d.getDay()] ?? [];
}

const DAYS_FR = ['DIM', 'LUN', 'MAR', 'MER', 'JEU', 'VEN', 'SAM'];
const MONTHS_FR = [
  'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
  'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre',
];

function toLocalKey(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function addEndTime(slot: string): string {
  const [h, m] = slot.split(':').map(Number);
  const endM = m + 45;
  const endH = h + Math.floor(endM / 60);
  return `${String(endH).padStart(2, '0')}:${String(endM % 60).padStart(2, '0')}`;
}

export default function Tarifs() {
  const { t } = useTranslation();
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  // ═══ Modal booking state ═══
  const [searchParams] = useSearchParams();
  const [modalOpen, setModalOpen] = useState(false);

  // Auto-open modal if ?booking=1 in URL
  useEffect(() => {
    if (searchParams.get('booking') === '1') {
      setModalOpen(true);
    }
  }, [searchParams]);
  const [step, setStep] = useState<'calendar' | 'form'>('calendar');
  const [currentMonth, setCurrentMonth] = useState(() => {
    const now = new Date();
    return { year: now.getFullYear(), month: now.getMonth() };
  });
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);

  // Form fields
  const [formName, setFormName] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formNotes, setFormNotes] = useState('');
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // ═══ Calendar logic ═══
  const calendarDays = useMemo(() => {
    const { year, month } = currentMonth;
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startOffset = firstDay.getDay(); // Sunday = 0

    const days: Array<{ date: Date; key: string; isCurrentMonth: boolean; hasSlots: boolean }> = [];

    for (let i = startOffset - 1; i >= 0; i--) {
      const d = new Date(year, month, -i);
      days.push({ date: d, key: toLocalKey(d), isCurrentMonth: false, hasSlots: false });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const minBooking = new Date(today);
    minBooking.setDate(today.getDate() + 1);

    for (let i = 1; i <= lastDay.getDate(); i++) {
      const d = new Date(year, month, i);
      const key = toLocalKey(d);
      const dayOfWeek = d.getDay();
      const hasSlotsForDay = d >= minBooking && dayOfWeek !== 0 && !!WEEKLY_SLOTS[dayOfWeek];
      days.push({ date: d, key, isCurrentMonth: true, hasSlots: hasSlotsForDay });
    }

    const remaining = 7 - (days.length % 7);
    if (remaining < 7) {
      for (let i = 1; i <= remaining; i++) {
        const d = new Date(year, month + 1, i);
        days.push({ date: d, key: toLocalKey(d), isCurrentMonth: false, hasSlots: false });
      }
    }

    return days;
  }, [currentMonth]);

  const slots = selectedDate ? getSlotsForDate(selectedDate) : [];

  function openModal() {
    setModalOpen(true);
    setStep('calendar');
    setSelectedDate(null);
    setSelectedSlot(null);
    setFormName('');
    setFormEmail('');
    setFormNotes('');
    setAcceptTerms(false);
    setSubmitted(false);
  }

  function closeModal() {
    setModalOpen(false);
  }

  function goToPrevMonth() {
    setCurrentMonth((prev) => {
      const m = prev.month - 1;
      return m < 0 ? { year: prev.year - 1, month: 11 } : { year: prev.year, month: m };
    });
    setSelectedDate(null);
    setSelectedSlot(null);
  }

  function goToNextMonth() {
    setCurrentMonth((prev) => {
      const m = prev.month + 1;
      return m > 11 ? { year: prev.year + 1, month: 0 } : { year: prev.year, month: m };
    });
    setSelectedDate(null);
    setSelectedSlot(null);
  }

  function selectDate(key: string, hasSlots: boolean) {
    if (!hasSlots) return;
    setSelectedDate(key);
    setSelectedSlot(null);
  }

  function selectSlot(slot: string) {
    setSelectedSlot(slot);
    setStep('form');
  }

  function formatDate(dateStr: string) {
    const d = new Date(dateStr + 'T00:00:00');
    const dayName = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'][d.getDay()];
    return `${dayName} ${d.getDate()} ${MONTHS_FR[d.getMonth()]} ${d.getFullYear()}`;
  }

  function formatDateShort(dateStr: string) {
    const d = new Date(dateStr + 'T00:00:00');
    const dayName = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'][d.getDay()];
    return `${dayName} ${d.getDate()}`;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1000));
    setLoading(false);
    setSubmitted(true);
  }

  const freeFeatures = [
    'Accès à tous les articles éducatifs',
    'Bibliothèque complète de douas & roqya',
    "Quiz d'auto-évaluation",
    'Forum communautaire',
  ];

  const premiumFeatures = [
    'Tout le contenu gratuit',
    'Chat privé avec un conseiller',
    'Programme de roqya personnalisé',
    'Suivi émotionnel hebdomadaire',
    'Emails de motivation avec versets & hadiths',
    'Tarif préférentiel sur les séances de Psycho-Roqya',
  ];

  const faqItems = [
    {
      q: 'Puis-je annuler à tout moment ?',
      a: "Oui, vous pouvez résilier votre abonnement à tout moment. Votre accès premium reste actif jusqu'à la fin de la période payée. Aucun engagement, aucune surprise.",
    },
    {
      q: 'Le paiement est-il sécurisé ?',
      a: 'Absolument. Nous utilisons Stripe, le leader mondial du paiement en ligne. Vos données bancaires ne transitent jamais par nos serveurs.',
    },
    {
      q: 'Qui sont les conseillers ?',
      a: "Nos conseillers sont des personnes formées en sciences islamiques et en accompagnement spirituel. Ils pratiquent la roqya shar'iyya selon le Coran et la Sunnah, avec bienveillance et respect de votre intimité.",
    },
    {
      q: "Qu'est-ce que la Psycho-Roqya ?",
      a: "La Psycho-Roqya est une méthode d'accompagnement qui agit là où les forces occultes opèrent : sur le terrain psychologique. Il faut comprendre que le mode opératoire principal des djinns et de la sorcellerie passe par la manipulation psychologique — c'est par ce biais qu'ils influencent l'être humain, altèrent ses pensées, ses émotions et peuvent aller jusqu'à exercer une véritable emprise sur lui. La Psycho-Roqya consiste à reprendre le contrôle sur ce terrain. Durant la séance, vous apprenez à identifier les mécanismes d'emprise, à comprendre comment ils agissent sur vous, et surtout à acquérir des outils concrets pour vous en libérer. En combinant la puissance du Coran avec cette compréhension psychologique, vous brisez les carcans de l'intérieur et reprenez votre autonomie dans tous les domaines de votre vie : spirituel, familial, professionnel et personnel. Ce n'est pas une simple récitation : c'est un véritable apprentissage qui vous rend acteur de votre propre guérison, bi idhnillah.",
    },
    {
      q: "Quelle est la politique d'annulation pour les séances ?",
      a: "Vous pouvez annuler ou reporter votre séance gratuitement jusqu'à 24 heures avant le rendez-vous. Passé ce délai, nous nous réservons le droit de ne pas procéder au remboursement, car le créneau vous était réservé et ne peut plus être attribué à quelqu'un d'autre. Nous vous encourageons à bien vérifier vos disponibilités avant de confirmer.",
    },
  ];

  return (
    <div className="min-h-screen bg-cream py-8 md:py-24">
      <SEO
        title="Tarifs & Seances de Psycho-Roqya - MaRoqya"
        description="Decouvrez nos formules d'accompagnement et reservez une seance de Psycho-Roqya. Approche unique combinant roqya et accompagnement psychologique."
        keywords="seance psycho-roqya, consultation roqya, prix roqya, accompagnement spirituel islam, psycho-roqya tarif"
        url="/tarifs"
      />
      <div className="mx-auto max-w-5xl px-4">
        {/* Header */}
        <div className="text-center">
          <h1 className="font-heading text-4xl font-bold text-green-islamic md:text-5xl">
            {t('pricing.title')}
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-lg text-text-secondary">
            {t('pricing.subtitle')}
          </p>
        </div>

        {/* ═══ PRICING CARDS ═══ */}
        <div className="mt-8 md:mt-14 grid gap-6 md:gap-8 md:grid-cols-2">
          {/* Free */}
          <div className="card-islamic flex flex-col p-6 md:p-8 text-center md:text-left">
            <h2 className="font-heading text-2xl font-bold text-text-primary">Gratuit</h2>
            <div className="mt-4 flex items-baseline gap-1">
              <span className="font-heading text-4xl font-bold text-green-islamic">0€</span>
              <span className="text-text-secondary">pour toujours</span>
            </div>
            <p className="mt-3 text-sm text-text-secondary">
              Tout ce qu'il faut pour comprendre et commencer votre parcours de protection.
            </p>
            <ul className="mt-8 flex-1 space-y-4">
              {freeFeatures.map((f, i) => (
                <li key={i} className="flex items-start gap-3">
                  <Check className="mt-0.5 h-5 w-5 shrink-0 text-green-islamic" />
                  <span className="text-text-primary">{f}</span>
                </li>
              ))}
            </ul>
            <Link
              to="/register"
              className="mt-8 block rounded-xl border-2 border-green-islamic py-3 text-center font-semibold text-green-islamic transition hover:bg-green-islamic hover:text-white"
            >
              Commencer gratuitement
            </Link>
          </div>

          {/* Premium */}
          <div className="card-islamic relative flex flex-col border-2 border-gold p-8">
            <div className="absolute -top-3 right-6 rounded-full bg-gold px-4 py-1 text-xs font-bold text-white">
              Premium
            </div>
            <h2 className="font-heading text-2xl font-bold text-text-primary">Premium</h2>
            <div className="mt-4 flex items-baseline gap-1">
              <span className="font-heading text-4xl font-bold text-gold">9,90€</span>
              <span className="text-text-secondary">/mois</span>
            </div>
            <p className="mt-3 text-sm text-text-secondary">
              Un accompagnement personnalisé pour avancer avec sérénité sur votre chemin.
            </p>
            <ul className="mt-8 flex-1 space-y-4">
              {premiumFeatures.map((f, i) => (
                <li key={i} className="flex items-start gap-3">
                  <Check className="mt-0.5 h-5 w-5 shrink-0 text-gold" />
                  <span className="text-text-primary">{f}</span>
                </li>
              ))}
            </ul>
            <Link
              to="/register"
              className="mt-8 block rounded-xl bg-gold py-3 text-center font-semibold text-white transition hover:opacity-90"
            >
              S'abonner au Premium
            </Link>
          </div>
        </div>

        {/* ═══ SECTION PSYCHO-ROQYA ═══ */}
        <div id="psycho-roqya" className="mt-24 scroll-mt-20">
          <div className="arabesque-separator mx-auto max-w-lg" />

          <div className="mx-auto mt-14 max-w-3xl">
            {/* Header */}
            <div className="text-center">
              <span className="inline-block rounded-full bg-green-islamic/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-green-islamic">
                Nouveau
              </span>
              <h2 className="mt-4 font-heading text-3xl font-bold text-green-islamic md:text-4xl">
                Séances de Psycho-Roqya
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-lg text-text-secondary">
                Une approche unique qui allie la puissance du Coran à un accompagnement
                psychologique pour une guérison profonde et durable.
              </p>
            </div>

            {/* Cards des bénéfices */}
            <div className="mt-10 grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-cream-dark bg-white/80 p-5 shadow-sm">
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-green-islamic/10">
                  <svg className="h-5 w-5 text-green-islamic" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <h3 className="font-heading text-base font-bold text-text-primary">Pulvériser les blocages</h3>
                <p className="mt-1.5 text-sm text-text-secondary">
                  Identifier et détruire les blocages spirituels et psychologiques qui vous empêchent d'avancer dans votre vie.
                </p>
              </div>

              <div className="rounded-2xl border border-cream-dark bg-white/80 p-5 shadow-sm">
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-gold/10">
                  <svg className="h-5 w-5 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </div>
                <h3 className="font-heading text-base font-bold text-text-primary">Renforcer la confiance en Allah</h3>
                <p className="mt-1.5 text-sm text-text-secondary">
                  Raviver le lien avec Allah, développer le tawakkul et retrouver une sérénité profonde au quotidien.
                </p>
              </div>

              <div className="rounded-2xl border border-cream-dark bg-white/80 p-5 shadow-sm">
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-green-islamic/10">
                  <svg className="h-5 w-5 text-green-islamic" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="font-heading text-base font-bold text-text-primary">Reprendre sa vie en main</h3>
                <p className="mt-1.5 text-sm text-text-secondary">
                  Retrouver la motivation, la clarté d'esprit et l'énergie pour avancer dans vos projets personnels et professionnels.
                </p>
              </div>

              <div className="rounded-2xl border border-cream-dark bg-white/80 p-5 shadow-sm">
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-gold/10">
                  <svg className="h-5 w-5 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h3 className="font-heading text-base font-bold text-text-primary">Guérison corps et esprit</h3>
                <p className="mt-1.5 text-sm text-text-secondary">
                  Soigner le mal à la racine en combinant récitation coranique et outils psychologiques éprouvés.
                </p>
              </div>
            </div>

            {/* Comment ça se passe */}
            <div className="mt-10 rounded-2xl border border-green-islamic/15 bg-green-islamic/5 p-6">
              <h3 className="font-heading text-lg font-bold text-green-islamic mb-4">Comment se déroule une séance ?</h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-green-islamic text-xs font-bold text-white">1</span>
                  <p className="text-sm text-text-secondary"><strong className="text-text-primary">Écoute et diagnostic</strong> — On commence par comprendre votre situation en profondeur : symptômes, contexte, vécu.</p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-green-islamic text-xs font-bold text-white">2</span>
                  <p className="text-sm text-text-secondary"><strong className="text-text-primary">Travail psychologique</strong> — Identification des schémas de pensée négatifs, des peurs et des croyances limitantes liées à votre épreuve.</p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-green-islamic text-xs font-bold text-white">3</span>
                  <p className="text-sm text-text-secondary"><strong className="text-text-primary">Plan d'action personnalisé</strong> — Programme de douas ciblées, conseils personnalisés et suivi pour maintenir les résultats.</p>
                </div>
              </div>
            </div>

            {/* ── Cadre "C'est pour vous si..." + CTA ── */}
            <div className="mt-10 rounded-2xl border-2 border-gold/30 bg-white/80 p-6 shadow-sm">
              <h3 className="font-heading text-lg font-bold text-text-primary mb-4">
                Cette séance est faite pour vous si…
              </h3>
              <div className="grid gap-2.5 sm:grid-cols-2">
                {[
                  "Vous ressentez des blocages dans votre vie sans explication logique",
                  "Vous avez l'impression de ne pas avancer malgré vos efforts",
                  "Vous souffrez d'angoisses, de peurs ou de pensées envahissantes",
                  "Vous traversez des difficultés relationnelles ou familiales récurrentes",
                  "Vous souhaitez vous libérer intérieurement et retrouver votre sérénité",
                  "Vous avez besoin d'une écoute bienveillante et d'un regard spirituel sur votre situation",
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-2.5">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
                    <span className="text-sm text-text-secondary">{item}</span>
                  </div>
                ))}
              </div>

              <div className="mt-6 text-center">
                <p className="mb-4 text-sm italic text-text-secondary">
                  N'attendez pas que la situation s'aggrave. Faites le premier pas vers votre libération, bi idhnillah.
                </p>
                <button
                  onClick={openModal}
                  className="inline-flex items-center gap-2.5 rounded-full bg-green-islamic px-10 py-4 text-lg font-semibold text-white shadow-lg transition hover:bg-gold hover:shadow-xl"
                >
                  <CalendarDays size={22} />
                  Réserver ma séance
                </button>
                <p className="mt-3 text-xs text-text-secondary">
                  45 min · Visioconférence · Confidentiel et bienveillant
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ═══ FAQ ═══ */}
        <div className="mt-20">
          <h2 className="font-heading text-center text-3xl font-bold text-green-islamic">
            Questions fréquentes
          </h2>
          <div className="mx-auto mt-10 max-w-2xl space-y-4">
            {faqItems.map((item, idx) => (
              <div key={idx} className="overflow-hidden rounded-2xl border border-cream-dark bg-white/70">
                <button
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="flex w-full items-center justify-between p-5 text-left"
                >
                  <span className="font-semibold text-text-primary">{item.q}</span>
                  <ChevronDown
                    className={`h-5 w-5 shrink-0 text-text-secondary transition-transform ${
                      openFaq === idx ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {openFaq === idx && (
                  <div className="border-t border-cream-dark px-5 pb-5 pt-3">
                    <p className="leading-relaxed text-text-secondary">{item.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════
          MODAL BOOKING (style Cal.com / Zawajdeen)
         ═══════════════════════════════════════════════ */}
      {modalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
          onClick={(e) => { if (e.target === e.currentTarget) closeModal(); }}
        >
          <div className="relative flex max-h-[90vh] w-full max-w-4xl overflow-hidden rounded-2xl bg-cream shadow-2xl">
            {/* Close button */}
            <button
              onClick={closeModal}
              className="absolute right-4 top-4 z-10 rounded-full p-1.5 text-text-secondary transition hover:bg-cream-dark hover:text-text-primary"
            >
              <X size={20} />
            </button>

            {submitted ? (
              /* ═══ SUCCESS ═══ */
              <div className="flex flex-1 flex-col items-center justify-center p-10 text-center">
                <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-green-islamic/10">
                  <Check size={32} className="text-green-islamic" />
                </div>
                <h3 className="font-heading text-2xl font-bold text-text-primary">
                  Réservation confirmée
                </h3>
                <p className="mx-auto mt-3 max-w-sm text-text-secondary">
                  Vous recevrez un email de confirmation avec le lien de visioconférence.
                  Qu'Allah vous facilite ce chemin vers la guérison.
                </p>
                <div className="mt-5 rounded-xl bg-cream-dark px-5 py-3 text-sm text-text-primary">
                  <span className="font-medium">{selectedDate && formatDate(selectedDate)}</span>
                  {' · '}
                  <span>{selectedSlot} – {selectedSlot && addEndTime(selectedSlot)}</span>
                </div>
                <button
                  onClick={closeModal}
                  className="mt-8 rounded-xl bg-green-islamic px-8 py-3 font-semibold text-white transition hover:bg-gold"
                >
                  Fermer
                </button>
              </div>
            ) : step === 'calendar' ? (
              /* ═══ STEP 1: LEFT INFO + CALENDAR + SLOTS ═══ */
              <div className="flex flex-1 flex-col md:flex-row">
                {/* Left panel — info */}
                <div className="border-b border-cream-dark p-6 md:w-72 md:border-b-0 md:border-r">
                  <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-green-islamic/10">
                    <MessageCircle size={18} className="text-green-islamic" />
                  </div>
                  <p className="text-sm font-medium text-green-islamic">MaRoqya</p>
                  <h3 className="mt-1 font-heading text-xl font-bold text-text-primary">
                    Séance individuelle
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-text-secondary">
                    La Psycho-Roqya agit là où les forces occultes opèrent : sur le terrain psychologique. Vous apprenez à identifier les mécanismes d'emprise, à comprendre comment ils agissent sur vous, et à acquérir des outils pour vous en libérer et reprendre votre autonomie.
                  </p>
                  <div className="mt-5 flex items-baseline gap-1">
                    <span className="font-heading text-2xl font-bold text-gold">50€</span>
                    <span className="text-sm text-text-secondary">/ séance</span>
                  </div>
                  <div className="mt-4 space-y-3 text-sm text-text-secondary">
                    <div className="flex items-center gap-2.5">
                      <Clock size={16} className="shrink-0 text-green-islamic" />
                      <span>45 min</span>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <Video size={16} className="shrink-0 text-green-islamic" />
                      <span>Visioconférence</span>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <Globe size={16} className="shrink-0 text-green-islamic" />
                      <span>Europe/Paris</span>
                    </div>
                  </div>
                </div>

                {/* Right panel — calendar + slots */}
                <div className="flex flex-1 flex-col overflow-y-auto p-6 md:flex-row">
                  {/* Calendar */}
                  <div className="flex-1">
                    {/* Month nav */}
                    <div className="mb-4 flex items-center justify-between">
                      <h4 className="font-heading text-lg font-semibold text-text-primary">
                        {MONTHS_FR[currentMonth.month]}{' '}
                        <span className="text-gold">{currentMonth.year}</span>
                      </h4>
                      <div className="flex gap-1">
                        <button onClick={goToPrevMonth} className="rounded-lg p-1.5 hover:bg-cream-dark">
                          <ChevronLeft size={18} className="text-text-secondary" />
                        </button>
                        <button onClick={goToNextMonth} className="rounded-lg p-1.5 hover:bg-cream-dark">
                          <ChevronRight size={18} className="text-text-secondary" />
                        </button>
                      </div>
                    </div>

                    {/* Day headers */}
                    <div className="mb-1 grid grid-cols-7 text-center">
                      {DAYS_FR.map((d) => (
                        <div key={d} className="py-1.5 text-[11px] font-semibold uppercase tracking-wider text-text-secondary">
                          {d}
                        </div>
                      ))}
                    </div>

                    {/* Days grid */}
                    <div className="grid grid-cols-7 gap-0.5">
                      {calendarDays.map((day, idx) => {
                        const isSelected = selectedDate === day.key;
                        const isToday = day.key === toLocalKey(new Date());
                        return (
                          <button
                            key={idx}
                            onClick={() => selectDate(day.key, day.hasSlots)}
                            disabled={!day.hasSlots}
                            className={`relative rounded-lg py-2 text-sm transition-all ${
                              !day.isCurrentMonth
                                ? 'text-text-secondary/20'
                                : isSelected
                                  ? 'bg-gold font-bold text-white shadow-sm'
                                  : day.hasSlots
                                    ? 'font-medium text-text-primary hover:bg-gold/10'
                                    : 'text-text-secondary/30'
                            } ${isToday && !isSelected ? 'font-bold' : ''}`}
                          >
                            {day.date.getDate()}
                            {day.hasSlots && !isSelected && (
                              <span className="absolute bottom-0.5 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-gold" />
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Time slots column */}
                  {selectedDate && (
                    <div className="mt-5 border-t border-cream-dark pt-5 md:ml-5 md:mt-0 md:w-36 md:border-l md:border-t-0 md:pl-5 md:pt-0">
                      <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-text-secondary">
                        {formatDateShort(selectedDate)}
                      </p>
                      <div className="flex flex-wrap gap-2 md:flex-col">
                        {slots.length === 0 ? (
                          <p className="text-xs text-text-secondary">Aucun créneau</p>
                        ) : (
                          slots.map((slot) => (
                            <button
                              key={slot}
                              onClick={() => selectSlot(slot)}
                              className="rounded-lg border border-cream-dark px-3 py-2 text-sm font-medium text-text-primary transition hover:border-green-islamic hover:bg-green-islamic/5"
                            >
                              <span className="mr-1.5 inline-block h-2 w-2 rounded-full bg-green-islamic" />
                              {slot}
                            </button>
                          ))
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              /* ═══ STEP 2: RECAP + FORM ═══ */
              <div className="flex flex-1 flex-col md:flex-row">
                {/* Left recap */}
                <div className="border-b border-cream-dark p-6 md:w-72 md:border-b-0 md:border-r">
                  <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-green-islamic/10">
                    <MessageCircle size={18} className="text-green-islamic" />
                  </div>
                  <p className="text-sm font-medium text-green-islamic">MaRoqya</p>
                  <h3 className="mt-1 font-heading text-xl font-bold text-text-primary">
                    Séance individuelle
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-text-secondary">
                    La Psycho-Roqya agit là où les forces occultes opèrent : sur le terrain psychologique. Vous apprenez à identifier les mécanismes d'emprise, à comprendre comment ils agissent sur vous, et à acquérir des outils pour vous en libérer et reprendre votre autonomie.
                  </p>
                  <div className="mt-6 space-y-3 text-sm text-text-secondary">
                    <div className="flex items-center gap-2.5">
                      <CalendarDays size={16} className="shrink-0 text-green-islamic" />
                      <span className="font-medium text-text-primary">
                        {selectedDate && formatDate(selectedDate)}
                      </span>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <Clock size={16} className="shrink-0 text-green-islamic" />
                      <span>
                        {selectedSlot} – {selectedSlot && addEndTime(selectedSlot)}
                      </span>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <Video size={16} className="shrink-0 text-green-islamic" />
                      <span>Visioconférence</span>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <Globe size={16} className="shrink-0 text-green-islamic" />
                      <span>Europe/Paris</span>
                    </div>
                  </div>
                </div>

                {/* Right form */}
                <div className="flex-1 overflow-y-auto p-6">
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-text-primary">
                        Votre nom <span className="text-gold">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={formName}
                        onChange={(e) => setFormName(e.target.value)}
                        className="w-full rounded-xl border border-cream-dark bg-white px-4 py-3 text-sm text-text-primary outline-none transition focus:border-green-islamic focus:ring-2 focus:ring-green-islamic/20"
                        placeholder="Votre prénom"
                      />
                    </div>

                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-text-primary">
                        Adresse email <span className="text-gold">*</span>
                      </label>
                      <input
                        type="email"
                        required
                        value={formEmail}
                        onChange={(e) => setFormEmail(e.target.value)}
                        className="w-full rounded-xl border border-cream-dark bg-white px-4 py-3 text-sm text-text-primary outline-none transition focus:border-green-islamic focus:ring-2 focus:ring-green-islamic/20"
                        placeholder="votre@email.com"
                      />
                    </div>

                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-text-primary">
                        Notes complémentaires
                      </label>
                      <textarea
                        rows={3}
                        value={formNotes}
                        onChange={(e) => setFormNotes(e.target.value)}
                        className="w-full resize-y rounded-xl border border-cream-dark bg-white px-4 py-3 text-sm text-text-primary outline-none transition focus:border-green-islamic focus:ring-2 focus:ring-green-islamic/20"
                        placeholder="Décrivez brièvement votre situation pour préparer l'entretien..."
                      />
                    </div>

                    {/* Price */}
                    <div className="rounded-xl bg-green-islamic/5 border border-green-islamic/15 px-4 py-3 text-center">
                      <span className="font-heading text-2xl font-bold text-green-islamic">50€</span>
                      <span className="ml-1 text-sm text-text-secondary">/ séance</span>
                      <p className="mt-1 text-xs text-text-secondary">45 min · Paiement sécurisé via Stripe</p>
                    </div>

                    {/* Cancellation policy */}
                    <div className="rounded-xl bg-gold/5 border border-gold/20 px-4 py-3">
                      <p className="text-xs font-semibold text-gold mb-1">Politique d'annulation</p>
                      <p className="text-xs leading-relaxed text-text-secondary">
                        Toute annulation effectuée moins de 24 heures avant le rendez-vous
                        ne pourra faire l'objet d'un remboursement. Au-delà de ce délai,
                        le remboursement intégral est garanti.
                      </p>
                    </div>

                    {/* Terms checkbox */}
                    <label className="flex items-start gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={acceptTerms}
                        onChange={(e) => setAcceptTerms(e.target.checked)}
                        className="mt-0.5 h-4 w-4 shrink-0 rounded border-cream-dark accent-green-islamic"
                      />
                      <span className="text-xs leading-relaxed text-text-secondary">
                        En confirmant, j'accepte les{' '}
                        <a href="/conditions" className="text-green-islamic underline hover:text-gold">
                          conditions d'utilisation
                        </a>{' '}
                        et la{' '}
                        <a href="/confidentialite" className="text-green-islamic underline hover:text-gold">
                          politique de confidentialité
                        </a>
                        , ainsi que la politique d'annulation ci-dessus. Le paiement sera
                        effectué à l'avance via Stripe.
                      </span>
                    </label>

                    <div className="flex items-center justify-between border-t border-cream-dark pt-5">
                      <button
                        type="button"
                        onClick={() => setStep('calendar')}
                        className="text-sm font-medium text-text-secondary transition hover:text-green-islamic"
                      >
                        ← Retour
                      </button>
                      <button
                        type="submit"
                        disabled={loading || !formName || !formEmail || !acceptTerms}
                        className="rounded-xl bg-green-islamic px-8 py-3 text-sm font-semibold text-white transition hover:bg-gold disabled:opacity-50"
                      >
                        {loading ? 'Redirection vers le paiement...' : 'Payer 50€ et réserver'}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
