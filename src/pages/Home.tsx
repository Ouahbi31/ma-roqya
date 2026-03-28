import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Book,
  MessageCircle,
  Video,
  ClipboardList,
  BarChart3,
  Users,
  BookOpen,
  Heart,
  Play,
  ClipboardCheck,
  Calendar,
} from 'lucide-react';
import SEO from '../components/SEO';

const featureIcons = [Book, MessageCircle, Video, ClipboardList, BarChart3, Users];

const resourceCards = [
  { icon: BookOpen, label: 'Articles', desc: 'Comprendre la roqya', to: '/articles' },
  { icon: Heart, label: 'Douas', desc: 'Invocations de protection', to: '/douas' },
  { icon: MessageCircle, label: 'Forum', desc: 'Échangez avec la communauté', to: '/forum' },
  { icon: Play, label: 'Vidéos', desc: 'Contenus éducatifs', to: '/articles#videos' },
  { icon: ClipboardCheck, label: 'Quiz', desc: 'Évaluez votre situation', to: '/quiz' },
  { icon: Calendar, label: 'Programme', desc: 'Votre parcours de guérison', to: '/programme' },
];

export default function Home() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-cream">
      <SEO
        title="MaRoqya - Accompagnement spirituel islamique"
        description="MaRoqya vous accompagne dans votre parcours de guérison spirituelle avec la roqya shar'iyya, la Psycho-Roqya et des programmes personnalisés basés sur le Coran et la Sunnah."
        keywords="roqya, roqya shariya, guerison spirituelle islam, psycho-roqya, mauvais oeil, sorcellerie, possession, douas, protection islamique"
        url="/"
      />
      {/* Hero Section */}
      <section className="relative overflow-hidden py-12 sm:py-20 md:py-32">
        <div className="islamic-pattern-bg absolute inset-0 z-0" />
        <div className="relative z-10 mx-auto max-w-4xl px-5 sm:px-4 text-center">
          <h1 className="font-heading text-3xl sm:text-4xl font-bold text-green-islamic md:text-6xl leading-tight">
            {t('home.hero_title')}
          </h1>
          <p className="mx-auto mt-4 sm:mt-6 max-w-2xl text-base sm:text-lg text-text-secondary md:text-xl leading-relaxed">
            {t('home.hero_subtitle')}
          </p>

          <div className="mt-8 sm:mt-10">
            <p className="text-arabic text-2xl sm:text-3xl text-gold md:text-4xl">
              وَإِذَا مَرِضْتُ فَهُوَ يَشْفِينِ
            </p>
            <p className="mt-2 sm:mt-3 text-sm text-text-secondary italic">
              {t('home.hero_verse')}
            </p>
            <p className="mt-1 text-xs text-text-secondary">
              {t('home.hero_verse_ref')}
            </p>
          </div>

          <div className="mt-8 sm:mt-10 flex flex-col items-center justify-center gap-3 sm:gap-4 sm:flex-row px-2 sm:px-0">
            <a
              href="#ressources"
              className="w-full sm:w-auto inline-block rounded-xl bg-green-islamic px-6 sm:px-8 py-3.5 sm:py-3 font-semibold text-white text-base sm:text-base transition hover:opacity-90 active:scale-[0.98] text-center"
            >
              {t('home.cta_free')}
            </a>
            <Link
              to="/tarifs"
              className="w-full sm:w-auto inline-block rounded-xl border-2 border-green-islamic px-6 sm:px-8 py-3.5 sm:py-3 font-semibold text-green-islamic text-base sm:text-base transition hover:bg-green-islamic hover:text-white active:scale-[0.98]"
            >
              {t('home.cta_premium')}
            </Link>
            <Link
              to="/tarifs?booking=1"
              className="w-full sm:w-auto inline-block rounded-xl bg-gold px-6 sm:px-8 py-3.5 sm:py-3 font-semibold text-white text-base sm:text-base transition hover:opacity-90 active:scale-[0.98]"
            >
              Réserver une séance individuelle
            </Link>
          </div>
        </div>
      </section>

      <div className="arabesque-separator mx-auto max-w-lg" />

      {/* Resources Section */}
      <section id="ressources" className="py-10 sm:py-16 md:py-24 scroll-mt-8">
        <div className="mx-auto max-w-6xl px-5 sm:px-4">
          <h2 className="font-heading text-center text-2xl sm:text-3xl font-bold text-green-islamic md:text-4xl">
            Découvrez nos ressources
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-center text-text-secondary">
            Tout ce dont vous avez besoin pour votre parcours de guérison spirituelle
          </p>
          <div className="mt-8 sm:mt-12 grid gap-3 sm:gap-4 grid-cols-2 lg:grid-cols-3">
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
            {t('home.features_title')}
          </h2>
          <div className="mt-8 sm:mt-12 grid gap-3 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featureIcons.map((Icon, idx) => (
              <div
                key={idx}
                className="card-islamic flex items-start gap-3 sm:gap-4 p-4 sm:p-6"
              >
                <div className="flex h-10 w-10 sm:h-12 sm:w-12 shrink-0 items-center justify-center rounded-lg bg-gold/10">
                  <Icon className="h-5 w-5 sm:h-6 sm:w-6 text-gold" />
                </div>
                <div>
                  <h3 className="font-heading text-base sm:text-lg font-bold text-text-primary">
                    {t(`home.feature${idx + 1}_title`)}
                  </h3>
                  <p className="mt-1 text-sm text-text-secondary leading-relaxed">
                    {t(`home.feature${idx + 1}_desc`)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}
