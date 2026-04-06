import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Clock,
  PlayCircle,
  ChevronRight,
  Heart,
  Star,
  Shield,
  Users,
  Zap,
  CalendarCheck,
  ArrowRight,
  Bell,
} from 'lucide-react';
import SEO from '../../components/SEO';
import { coachingProgrammes } from '../../data/coachingProgrammes';
import WaitlistModal from '../../components/coaching/WaitlistModal';
import type { LucideIcon } from 'lucide-react';

const iconMap: Record<string, LucideIcon> = {
  Heart,
  Star,
  Shield,
  Users,
  Zap,
};

export default function CoachingProgrammes() {
  const [waitlistProg, setWaitlistProg] = useState<{ slug: string; title: string } | null>(null);

  return (
    <div className="min-h-screen bg-cream">
      <SEO
        title="Nos programmes — CoachMyNefs"
        description="Des formations courtes, accessibles et ancrées dans l'Islam. Développement personnel, couple, confiance en soi — choisissez votre programme."
        keywords="programme coaching islamique, formation couple, confiance en soi, développement personnel musulman"
        url="/coaching/programmes"
      />

      {/* Hero */}
      <section className="relative overflow-hidden py-10 sm:py-16 md:py-20">
        <div className="islamic-pattern-bg absolute inset-0 z-0 opacity-50" />
        <div className="relative z-10 mx-auto max-w-4xl px-5 sm:px-4 text-center">
          <h1 className="font-heading text-3xl sm:text-4xl font-bold text-green-islamic md:text-5xl">
            Nos programmes
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-base sm:text-lg text-text-secondary leading-relaxed">
            Des formations courtes, accessibles et ancrées dans l'Islam
          </p>
        </div>
      </section>

      <div className="arabesque-separator mx-auto max-w-lg" />

      {/* ✅ Bannière coaching individuel — disponible maintenant */}
      <section className="py-8 sm:py-10">
        <div className="mx-auto max-w-4xl px-5 sm:px-4">
          <div className="relative overflow-hidden rounded-2xl bg-green-islamic px-6 py-8 sm:px-10 sm:py-10 shadow-lg">
            {/* Motif décoratif */}
            <div className="islamic-pattern-bg absolute inset-0 opacity-10" />
            <div className="relative z-10 flex flex-col sm:flex-row items-center gap-6 sm:gap-8">
              {/* Icône */}
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-white/20">
                <CalendarCheck className="h-8 w-8 text-white" />
              </div>
              {/* Texte */}
              <div className="flex-1 text-center sm:text-left">
                <span className="inline-block mb-2 rounded-full bg-white/20 px-3 py-1 text-xs font-bold text-white tracking-wide uppercase">
                  ✅ Disponible maintenant
                </span>
                <h2 className="font-heading text-xl sm:text-2xl font-bold text-white leading-snug">
                  Séance de coaching individuel
                </h2>
                <p className="mt-1.5 text-sm sm:text-base text-white/80 leading-relaxed">
                  Les programmes arrivent bientôt — en attendant, bénéficiez d'un accompagnement personnalisé en direct avec Dr Fère Muz.
                </p>
              </div>
              {/* CTA */}
              <Link
                to="/coaching/reserver"
                className="shrink-0 inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3.5 text-sm font-bold text-green-islamic shadow transition hover:bg-cream active:scale-[0.98]"
              >
                Réserver ma séance
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 🎁 Bannière promo early bird */}
      <section className="py-4 sm:py-6">
        <div className="mx-auto max-w-4xl px-5 sm:px-4">
          <div className="relative overflow-hidden rounded-2xl border border-gold/40 bg-gradient-to-r from-gold/10 via-amber-50 to-gold/10 px-6 py-5 sm:px-8 sm:py-6 shadow-sm">
            <div className="flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
              <div className="text-3xl shrink-0">🎁</div>
              <div className="flex-1">
                <p className="font-heading font-bold text-text-primary text-base sm:text-lg leading-snug">
                  Offre de lancement — programmes en ligne
                </p>
                <p className="mt-1 text-sm text-text-secondary leading-relaxed">
                  Soyez parmi les premiers à accéder aux <strong className="text-gold">programmes en ligne</strong> de Dr Frère Muz. Les <strong className="text-gold">10 premiers inscrits</strong> obtiennent <strong className="text-gold">-50%</strong> · Les <strong className="text-gold">50 premiers</strong> obtiennent <strong className="text-gold">-30%</strong>.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Grid des programmes */}
      <section className="py-10 sm:py-16 md:py-20">
        <div className="mx-auto max-w-6xl px-5 sm:px-4">
          <div className="grid gap-6 sm:gap-7 sm:grid-cols-2 lg:grid-cols-3">
            {coachingProgrammes.map((prog) => {
              const Icon = iconMap[prog.icon] ?? Star;
              return (
                <div
                  key={prog.slug}
                  className={`card-islamic flex flex-col p-6 gap-4 hover:-translate-y-0.5 transition-transform relative overflow-hidden${prog.comingSoon ? ' opacity-80' : ''}`}
                >
                  {/* Bandeau "Bientôt disponible" */}
                  {prog.comingSoon && (
                    <div className="absolute inset-0 overflow-hidden rounded-2xl pointer-events-none z-10">
                      <div className="absolute top-7 -right-10 w-48 bg-gray-500/75 text-white text-[10px] font-bold tracking-widest text-center py-1.5 rotate-45 uppercase shadow">
                        Bientôt disponible
                      </div>
                    </div>
                  )}

                  {/* Badge + icône */}
                  <div className="flex items-start justify-between">
                    <div className={`flex h-12 w-12 items-center justify-center rounded-xl bg-cream-dark`}>
                      <Icon className={`h-6 w-6 ${prog.color}`} />
                    </div>
                    {prog.badge && (
                      <span className="inline-block rounded-full bg-gold/10 border border-gold/30 px-2.5 py-0.5 text-xs font-semibold text-gold">
                        {prog.badge}
                      </span>
                    )}
                  </div>

                  {/* Titre + sous-titre */}
                  <div>
                    <h2 className="font-heading text-base sm:text-lg font-bold text-text-primary leading-snug">
                      {prog.title}
                    </h2>
                    <p className="mt-1 text-sm text-text-secondary leading-relaxed">
                      {prog.subtitle}
                    </p>
                  </div>

                  {/* Infos */}
                  <div className="flex flex-wrap gap-3 text-xs text-text-secondary">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5 text-gold" />
                      {prog.duration}
                    </span>
                    <span className="flex items-center gap-1">
                      <PlayCircle className="h-3.5 w-3.5 text-gold" />
                      {prog.videosCount} vidéos
                    </span>
                  </div>

                  {/* Prix + CTA */}
                  <div className="mt-auto flex items-center justify-between pt-4 border-t border-cream-dark">
                    <span className="font-heading text-2xl font-bold text-gold">
                      {prog.price}€
                    </span>
                    {prog.comingSoon ? (
                      <button
                        onClick={() => setWaitlistProg({ slug: prog.slug, title: prog.title })}
                        className="inline-flex items-center gap-1.5 rounded-xl bg-green-islamic px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90 active:scale-[0.98]"
                      >
                        <Bell className="h-3.5 w-3.5" />
                        Réserver ma place
                      </button>
                    ) : (
                      <Link
                        to={`/coaching/programmes/${prog.slug}`}
                        className="inline-flex items-center gap-1.5 rounded-xl bg-gold px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90 active:scale-[0.98]"
                      >
                        Découvrir
                        <ChevronRight className="h-4 w-4" />
                      </Link>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <div className="arabesque-separator mx-auto max-w-lg" />

      {/* CTA coaching individuel */}
      <section className="py-10 sm:py-16 md:py-20">
        <div className="mx-auto max-w-3xl px-5 sm:px-4 text-center">
          <span className="inline-block mb-4 rounded-full bg-gold/10 border border-gold/30 px-4 py-1.5 text-xs font-bold text-gold tracking-wide uppercase">
            ✅ Disponible maintenant
          </span>
          <h2 className="font-heading text-2xl sm:text-3xl font-bold text-green-islamic">
            Vous voulez être accompagné(e) dès aujourd'hui ?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-text-secondary leading-relaxed">
            Les programmes arrivent bientôt. En attendant, réservez une séance individuelle ou de couple avec Dr Frère Muz — un suivi personnalisé, en direct.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              to="/coaching/services"
              className="inline-block rounded-xl border border-gold/40 px-8 py-3.5 font-semibold text-gold text-base transition hover:bg-gold/10 active:scale-[0.98] text-center"
            >
              Voir les services
            </Link>
            <Link
              to="/coaching/reserver"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-gold px-8 py-3.5 font-semibold text-white text-base transition hover:opacity-90 active:scale-[0.98]"
            >
              <CalendarCheck className="h-5 w-5" />
              Réserver ma séance
            </Link>
          </div>
        </div>
      </section>

      {/* Modale waitlist */}
      {waitlistProg && (
        <WaitlistModal
          programmeTitle={waitlistProg.title}
          programmeSlug={waitlistProg.slug}
          onClose={() => setWaitlistProg(null)}
        />
      )}
    </div>
  );
}
