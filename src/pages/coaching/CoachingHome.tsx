import { Link } from 'react-router-dom';
import {
  BookOpen,
  Briefcase,
  Calendar,
  Heart,
  Users,
  Sparkles,
  TrendingUp,
  Shield,
} from 'lucide-react';
import SEO from '../../components/SEO';

const resourceCards = [
  { icon: BookOpen, label: 'Articles', desc: 'Développement personnel & couple', to: '/coaching/articles' },
  { icon: Briefcase, label: 'Services', desc: 'Séances individuelles et de couple', to: '/coaching/services' },
  { icon: Calendar, label: 'Programme', desc: 'Votre parcours en 30 jours', to: '/coaching/programme' },
  { icon: Heart, label: 'Réserver', desc: 'Prenez rendez-vous', to: '/tarifs?booking=1' },
];

const features = [
  {
    icon: Users,
    title: 'Accompagnement de couple',
    desc: 'Communication bienveillante, réconciliation et construction d\'un projet de vie commun ancré dans vos valeurs.',
  },
  {
    icon: TrendingUp,
    title: 'Développement personnel',
    desc: 'Identifier et dépasser vos blocages, renforcer la confiance en vous et avancer avec clarté.',
  },
  {
    icon: Shield,
    title: 'Confiance en Allah',
    desc: 'Intégrer la tawakkul dans votre quotidien, trouver la sérénité et agir avec foi et détermination.',
  },
  {
    icon: Sparkles,
    title: 'Transformation durable',
    desc: 'Des outils concrets et un suivi personnalisé pour ancrer des changements positifs dans votre vie.',
  },
];

export default function CoachingHome() {
  return (
    <div className="min-h-screen bg-cream">
      <SEO
        title="Coaching & Accompagnement - CoachMyNefs"
        description="Coaching de couple, développement personnel et accompagnement spirituel. Renforcez votre confiance en Allah, surmontez vos blocages et construisez une vie épanouie."
        keywords="coaching islamique, accompagnement de couple, développement personnel, confiance en Allah, tawakkul, coaching musulman"
        url="/coaching"
      />

      {/* Hero Section */}
      <section className="relative overflow-hidden py-12 sm:py-20 md:py-32">
        <div className="islamic-pattern-bg absolute inset-0 z-0" />
        <div className="relative z-10 mx-auto max-w-4xl px-5 sm:px-4 text-center">
          <h1 className="font-heading text-3xl sm:text-4xl font-bold text-gold md:text-6xl leading-tight">
            Coaching & Accompagnement de Couple
          </h1>
          <p className="mx-auto mt-4 sm:mt-6 max-w-2xl text-base sm:text-lg text-text-secondary md:text-xl leading-relaxed">
            Développement personnel, accompagnement de couple et confiance en Allah. Identifiez vos blocages, retrouvez la sérénité et construisez une vie épanouie.
          </p>

          <div className="mt-8 sm:mt-10">
            <p className="text-arabic text-2xl sm:text-3xl text-gold md:text-4xl">
              وَعَلَى اللَّهِ فَتَوَكَّلُوا إِن كُنتُم مُّؤْمِنِينَ
            </p>
            <p className="mt-2 sm:mt-3 text-sm text-text-secondary italic">
              « Et placez votre confiance en Allah si vous êtes croyants »
            </p>
            <p className="mt-1 text-xs text-text-secondary">
              Sourate Al-Ma'ida, 5:23
            </p>
          </div>

          <div className="mt-8 sm:mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row px-2 sm:px-0">
            <Link
              to="/tarifs?booking=1"
              className="w-full sm:w-auto inline-block rounded-xl bg-gold px-8 py-3.5 font-semibold text-white text-base transition hover:opacity-90 active:scale-[0.98] text-center"
            >
              Réserver une séance
            </Link>
            <Link
              to="/coaching/programme"
              className="w-full sm:w-auto inline-block rounded-xl border border-gold/40 px-8 py-3.5 font-semibold text-gold text-base transition hover:bg-gold/10 active:scale-[0.98] text-center"
            >
              Voir le programme
            </Link>
          </div>
        </div>
      </section>

      <div className="arabesque-separator mx-auto max-w-lg" />

      {/* Resources Section */}
      <section id="ressources" className="py-10 sm:py-16 md:py-24 scroll-mt-8">
        <div className="mx-auto max-w-6xl px-5 sm:px-4">
          <h2 className="font-heading text-center text-2xl sm:text-3xl font-bold text-green-islamic md:text-4xl">
            Votre espace coaching
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-center text-text-secondary">
            Tout ce dont vous avez besoin pour votre transformation personnelle
          </p>
          <div className="mt-8 sm:mt-12 grid gap-3 sm:gap-4 grid-cols-2 lg:grid-cols-4">
            {resourceCards.map((card) => (
              <Link
                key={card.label}
                to={card.to}
                className="card-islamic flex flex-col items-center gap-2 p-5 sm:p-6 text-center transition-transform hover:-translate-y-0.5"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gold/10">
                  <card.icon className="h-6 w-6 text-gold" />
                </div>
                <h3 className="font-heading text-base font-bold text-text-primary">
                  {card.label}
                </h3>
                <p className="text-sm text-text-secondary leading-relaxed">
                  {card.desc}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <div className="arabesque-separator mx-auto max-w-lg" />

      {/* Features Section */}
      <section className="py-10 sm:py-16 md:py-24">
        <div className="mx-auto max-w-6xl px-5 sm:px-4">
          <h2 className="font-heading text-center text-2xl sm:text-3xl font-bold text-green-islamic md:text-4xl">
            Ce que vous offre le coaching
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-center text-text-secondary">
            Un accompagnement personnalisé, bienveillant et ancré dans vos valeurs
          </p>
          <div className="mt-8 sm:mt-12 grid gap-3 sm:gap-6 sm:grid-cols-2 lg:grid-cols-2">
            {features.map((feature, idx) => (
              <div
                key={idx}
                className="card-islamic flex items-start gap-3 sm:gap-4 p-4 sm:p-6"
              >
                <div className="flex h-10 w-10 sm:h-12 sm:w-12 shrink-0 items-center justify-center rounded-lg bg-gold/10">
                  <feature.icon className="h-5 w-5 sm:h-6 sm:w-6 text-gold" />
                </div>
                <div>
                  <h3 className="font-heading text-base sm:text-lg font-bold text-text-primary">
                    {feature.title}
                  </h3>
                  <p className="mt-1 text-sm text-text-secondary leading-relaxed">
                    {feature.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="arabesque-separator mx-auto max-w-lg" />

      {/* CTA Section */}
      <section className="py-10 sm:py-16 md:py-24">
        <div className="mx-auto max-w-3xl px-5 sm:px-4 text-center">
          <h2 className="font-heading text-2xl sm:text-3xl font-bold text-green-islamic md:text-4xl">
            Prêt(e) à commencer votre transformation ?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-text-secondary leading-relaxed">
            Réservez une première séance de coaching et faites le premier pas vers une vie plus épanouie, plus sereine, avec la barakah d'Allah.
          </p>
          <div className="mt-8">
            <Link
              to="/tarifs?booking=1"
              className="inline-block rounded-xl bg-gold px-10 py-4 font-semibold text-white text-base transition hover:opacity-90 active:scale-[0.98]"
            >
              Réserver une séance
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
