import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  BookOpen,
  Shield,
  Heart,
  Book,
  MessageCircle,
  Video,
  ClipboardList,
  BarChart3,
  Users,
  Star,
} from 'lucide-react';
import SEO from '../components/SEO';

const stepIcons = [BookOpen, Shield, Heart];

const featureIcons = [Book, MessageCircle, Video, ClipboardList, BarChart3, Users];

const testimonials = [
  { name: 'Soeur F.', stars: 5, key: 'testimonial1' },
  { name: 'Frere M.', stars: 5, key: 'testimonial2' },
  { name: 'Soeur A.', stars: 4, key: 'testimonial3' },
];

export default function Home() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-cream">
      <SEO
        title="MaRoqya - Accompagnement spirituel islamique"
        description="MaRoqya vous accompagne dans votre parcours de gu&#233;rison spirituelle avec la roqya shar'iyya, la Psycho-Roqya et des programmes personnalis&#233;s bas&#233;s sur le Coran et la Sunnah."
        keywords="roqya, roqya shariya, guerison spirituelle islam, psycho-roqya, mauvais oeil, sorcellerie, possession, douas, protection islamique"
        url="/"
      />
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 md:py-32">
        <div className="islamic-pattern-bg absolute inset-0 z-0" />
        <div className="relative z-10 mx-auto max-w-4xl px-4 text-center">
          <h1 className="font-heading text-4xl font-bold text-green-islamic md:text-6xl">
            {t('home.hero_title')}
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-text-secondary md:text-xl">
            {t('home.hero_subtitle')}
          </p>

          <div className="mt-10">
            <p className="text-arabic text-3xl text-gold md:text-4xl">
              وَإِذَا مَرِضْتُ فَهُوَ يَشْفِينِ
            </p>
            <p className="mt-3 text-sm text-text-secondary italic">
              {t('home.hero_verse')}
            </p>
            <p className="mt-1 text-xs text-text-secondary">
              {t('home.hero_verse_ref')}
            </p>
          </div>

          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              to="/register"
              className="inline-block rounded-lg bg-green-islamic px-8 py-3 font-semibold text-white transition hover:opacity-90"
            >
              {t('home.cta_free')}
            </Link>
            <Link
              to="/tarifs"
              className="inline-block rounded-lg border-2 border-green-islamic px-8 py-3 font-semibold text-green-islamic transition hover:bg-green-islamic hover:text-white"
            >
              {t('home.cta_premium')}
            </Link>
          </div>
        </div>
      </section>

      <div className="arabesque-separator mx-auto max-w-lg" />

      {/* 3 Steps Section */}
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="font-heading text-center text-3xl font-bold text-green-islamic md:text-4xl">
            {t('home.steps_title')}
          </h2>
          <div className="mt-12 grid gap-8 md:grid-cols-3">
            {[1, 2, 3].map((step, idx) => {
              const Icon = stepIcons[idx];
              return (
                <div
                  key={step}
                  className="card-islamic flex flex-col items-center p-8 text-center"
                >
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-islamic/10">
                    <Icon className="h-8 w-8 text-green-islamic" />
                  </div>
                  <h3 className="font-heading mt-6 text-xl font-bold text-text-primary">
                    {t(`home.step${step}_title`)}
                  </h3>
                  <p className="mt-3 text-text-secondary">
                    {t(`home.step${step}_desc`)}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <div className="arabesque-separator mx-auto max-w-lg" />

      {/* Features Section */}
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="font-heading text-center text-3xl font-bold text-green-islamic md:text-4xl">
            {t('home.features_title')}
          </h2>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featureIcons.map((Icon, idx) => (
              <div
                key={idx}
                className="card-islamic flex items-start gap-4 p-6"
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-gold/10">
                  <Icon className="h-6 w-6 text-gold" />
                </div>
                <div>
                  <h3 className="font-heading text-lg font-bold text-text-primary">
                    {t(`home.feature${idx + 1}_title`)}
                  </h3>
                  <p className="mt-1 text-sm text-text-secondary">
                    {t(`home.feature${idx + 1}_desc`)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="arabesque-separator mx-auto max-w-lg" />

      {/* Testimonials Section */}
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="font-heading text-center text-3xl font-bold text-green-islamic md:text-4xl">
            {t('home.testimonials_title')}
          </h2>
          <div className="mt-12 grid gap-8 md:grid-cols-3">
            {testimonials.map((item) => (
              <div key={item.key} className="card-islamic p-8">
                <div className="flex gap-1">
                  {Array.from({ length: item.stars }).map((_, i) => (
                    <Star
                      key={i}
                      className="h-5 w-5 fill-gold text-gold"
                    />
                  ))}
                </div>
                <p className="mt-4 text-text-secondary italic">
                  "{t(`home.${item.key}`)}"
                </p>
                <p className="mt-4 font-semibold text-text-primary">
                  {item.name}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="arabesque-separator mx-auto max-w-lg" />

      {/* Stats Bar */}
      <section className="bg-green-islamic py-12">
        <div className="mx-auto flex max-w-4xl flex-col items-center justify-around gap-8 px-4 md:flex-row">
          {[
            { value: '50+', label: t('home.stats_articles') },
            { value: '30+', label: t('home.stats_douas') },
            { value: '1000+', label: t('home.stats_members') },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="font-heading text-4xl font-bold text-white md:text-5xl">
                {stat.value}
              </p>
              <p className="mt-2 text-lg text-white/80">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
