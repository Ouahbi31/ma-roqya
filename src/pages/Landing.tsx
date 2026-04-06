import { Link } from 'react-router-dom';
import {
  Star,
  HeartHandshake,
  Users,
  User,
  Video,
  Lock,
  Zap,
  ArrowRight,
  CalendarCheck,
} from 'lucide-react';
import SEO from '../components/SEO';

/* ─── Services ─────────────────────────────────────────────────────────────── */
const services = [
  {
    icon: HeartHandshake,
    title: 'Coaching Psycho-Roqya',
    desc: 'Blocages émotionnels, bien-être spirituel, ancrage dans la foi',
    price: '50€',
    accent: 'green' as const,
    href: 'https://cal.com/coachmynefs/coaching-individuel',
  },
  {
    icon: User,
    title: 'Coaching individuel',
    desc: 'Confiance, développement personnel et plan d\'action concret',
    price: '50€',
    accent: 'gold' as const,
    href: 'https://cal.com/coachmynefs/coaching-developpement-personnel',
  },
  {
    icon: Users,
    title: 'Coaching de couple',
    desc: 'Communication, gestion des conflits et harmonie conjugale',
    price: '65€',
    accent: 'gold' as const,
    href: 'https://cal.com/coachmynefs/coaching-de-couple',
  },
];

/* ─── Points de douleur ─────────────────────────────────────────────────────── */
const douleurs = [
  { emoji: '💔', texte: 'Mon couple souffre et on n\'arrive plus à se comprendre' },
  { emoji: '🔁', texte: 'Je tourne en rond, les mêmes blocages reviennent toujours' },
  { emoji: '🙏', texte: 'Je veux me rapprocher d\'Allah mais je n\'y arrive pas' },
  { emoji: '😔', texte: 'Je manque de confiance, je me sens bloqué(e)' },
];

/* ─── Réassurance ───────────────────────────────────────────────────────────── */
const reassurances = [
  { icon: Video, text: 'Séance en visio' },
  { icon: Lock, text: 'Paiement sécurisé' },
  { icon: Zap, text: 'Réponse sous 24h' },
];

export default function Landing() {
  return (
    <div className="min-h-screen bg-cream">
      <SEO
        title="CoachMyNefs — Coaching islamique & accompagnement personnalisé"
        description="Coaching individuel, de couple et Psycho-Roqya avec Dr Frère Muz. Séances en visio, ancrées dans les valeurs islamiques."
        keywords="coaching islamique, coaching de couple, psycho-roqya, développement personnel, Dr Frère Muz"
        url="/"
      />

      {/* ══════════════════════════════════════════════════════════════════════
          HERO
      ══════════════════════════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden">
        {/* Fond dégradé + motif */}
        <div className="absolute inset-0 bg-gradient-to-br from-green-islamic via-green-islamic/90 to-[#1a4a2e]" />
        <div className="islamic-pattern-bg absolute inset-0 opacity-10" />

        <div className="relative z-10 mx-auto max-w-lg px-5 py-12 sm:py-16 text-center">
          {/* Avatar */}
          <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-white/15 ring-4 ring-white/20 backdrop-blur-sm">
            <Star className="h-10 w-10 text-gold fill-gold" />
          </div>

          {/* Identité */}
          <h1 className="font-heading text-3xl sm:text-4xl font-bold text-white leading-tight">
            Dr Frère Muz
          </h1>
          <p className="mt-2 text-sm sm:text-base text-white/75 leading-relaxed">
            Praticien Psycho-Roqya · Coach de vie islamique
            <br />
            Médiation conjugale · Gestion de conflit familial
          </p>

          {/* Séparateur doré */}
          <div className="mx-auto my-5 h-px w-20 bg-gold/50" />

          {/* Verset */}
          <p className="text-arabic text-lg sm:text-xl text-gold leading-relaxed">
            وَعَلَى اللَّهِ فَتَوَكَّلُوا إِن كُنتُم مُّؤْمِنِينَ
          </p>
          <p className="mt-1.5 text-xs text-white/55 italic">
            « Et placez votre confiance en Allah si vous êtes croyants » — Al-Ma'ida 5:23
          </p>

          {/* CTAs */}
          <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <a
              href="https://cal.com/coachmynefs"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-gold px-7 py-3.5 font-bold text-white text-base shadow-lg transition hover:opacity-90 active:scale-[0.98]"
            >
              <CalendarCheck className="h-5 w-5" />
              Réserver une séance
            </a>
            <Link
              to="/coaching/services"
              className="inline-flex items-center justify-center gap-2 rounded-xl border-2 border-white/30 bg-white/10 px-7 py-3.5 font-semibold text-white text-base backdrop-blur-sm transition hover:bg-white/20 active:scale-[0.98]"
            >
              Voir les services
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          SERVICES
      ══════════════════════════════════════════════════════════════════════ */}
      <section className="py-10 sm:py-14">
        <div className="mx-auto max-w-lg px-5">
          <h2 className="font-heading text-xl sm:text-2xl font-bold text-green-islamic mb-1 text-center">
            Mes accompagnements
          </h2>
          <p className="text-center text-text-secondary text-sm mb-6">
            Choisissez la formule adaptée à votre situation
          </p>

          <div className="flex flex-col gap-4">
            {services.map((s) => {
              const Icon = s.icon;
              const isGreen = s.accent === 'green';
              return (
                <a
                  key={s.title}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="card-islamic flex items-center gap-4 p-4 sm:p-5 transition hover:shadow-md active:scale-[0.99] group"
                >
                  {/* Icône */}
                  <div
                    className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${
                      isGreen ? 'bg-green-islamic/10' : 'bg-gold/10'
                    }`}
                  >
                    <Icon
                      className={`h-6 w-6 ${isGreen ? 'text-green-islamic' : 'text-gold'}`}
                    />
                  </div>

                  {/* Texte */}
                  <div className="flex-1 min-w-0">
                    <p
                      className={`font-heading font-bold text-sm sm:text-base leading-tight ${
                        isGreen ? 'text-green-islamic' : 'text-gold'
                      }`}
                    >
                      {s.title}
                    </p>
                    <p className="text-xs text-text-secondary mt-0.5 leading-relaxed line-clamp-2">
                      {s.desc}
                    </p>
                  </div>

                  {/* Flèche */}
                  <div className="shrink-0">
                    <span className={`text-lg font-bold ${isGreen ? 'text-green-islamic' : 'text-gold'}`}>→</span>
                  </div>
                </a>
              );
            })}
          </div>
        </div>
      </section>

      <div className="arabesque-separator mx-auto max-w-lg" />

      {/* ══════════════════════════════════════════════════════════════════════
          DOULEURS
      ══════════════════════════════════════════════════════════════════════ */}
      <section className="py-10 sm:py-14">
        <div className="mx-auto max-w-lg px-5">
          <h2 className="font-heading text-xl sm:text-2xl font-bold text-green-islamic mb-1 text-center">
            Vous vous reconnaissez ?
          </h2>
          <p className="text-center text-text-secondary text-sm mb-6">
            Vous n'êtes pas seul(e). Ensemble, on peut avancer.
          </p>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {douleurs.map((d) => (
              <div
                key={d.texte}
                className="flex items-start gap-3 rounded-xl bg-white border border-cream-dark p-4 shadow-sm"
              >
                <span className="text-xl shrink-0 mt-0.5">{d.emoji}</span>
                <p className="text-sm text-text-primary leading-relaxed">{d.texte}</p>
              </div>
            ))}
          </div>

          <div className="mt-6 text-center">
            <a
              href="https://cal.com/coachmynefs"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-xl bg-green-islamic px-6 py-3 font-semibold text-white text-sm transition hover:opacity-90"
            >
              Je prends rendez-vous
              <ArrowRight className="h-4 w-4" />
            </a>
          </div>
        </div>
      </section>

      <div className="arabesque-separator mx-auto max-w-lg" />

      {/* ══════════════════════════════════════════════════════════════════════
          RÉASSURANCE
      ══════════════════════════════════════════════════════════════════════ */}
      <section className="py-8 sm:py-10">
        <div className="mx-auto max-w-lg px-5">
          <div className="flex items-center justify-around gap-2 rounded-2xl bg-white border border-cream-dark px-4 py-5 shadow-sm">
            {reassurances.map((r) => {
              const Icon = r.icon;
              return (
                <div key={r.text} className="flex flex-col items-center gap-1.5">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gold/10">
                    <Icon className="h-5 w-5 text-gold" />
                  </div>
                  <span className="text-[11px] font-semibold text-text-secondary text-center leading-tight">
                    {r.text}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          CTA FINAL — QUI SUIS-JE
      ══════════════════════════════════════════════════════════════════════ */}
      <section className="py-10 sm:py-14 pb-6">
        <div className="mx-auto max-w-lg px-5 text-center">
          <div className="rounded-2xl bg-gradient-to-br from-cream-dark to-white border border-cream-dark p-6 sm:p-8">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-green-islamic/10">
              <User className="h-7 w-7 text-green-islamic" />
            </div>
            <h2 className="font-heading text-lg sm:text-xl font-bold text-green-islamic mb-2">
              Qui est Dr Frère Muz ?
            </h2>
            <p className="text-text-secondary text-sm leading-relaxed mb-5">
              Praticien Psycho-Roqya, coach de vie islamique et médiateur conjugal.
              Découvrez mon parcours et ma démarche d'accompagnement.
            </p>
            <Link
              to="/qui-suis-je"
              className="inline-flex items-center gap-2 rounded-xl border border-green-islamic/30 bg-white px-6 py-2.5 text-sm font-semibold text-green-islamic transition hover:bg-green-islamic hover:text-white"
            >
              En savoir plus sur moi
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
