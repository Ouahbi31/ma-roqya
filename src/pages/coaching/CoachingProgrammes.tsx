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
} from 'lucide-react';
import SEO from '../../components/SEO';
import { coachingProgrammes } from '../../data/coachingProgrammes';
import type { LucideIcon } from 'lucide-react';

const iconMap: Record<string, LucideIcon> = {
  Heart,
  Star,
  Shield,
  Users,
  Zap,
};

export default function CoachingProgrammes() {
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
                    <Link
                      to={`/coaching/programmes/${prog.slug}`}
                      className="inline-flex items-center gap-1.5 rounded-xl bg-gold px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90 active:scale-[0.98]"
                    >
                      Découvrir
                      <ChevronRight className="h-4 w-4" />
                    </Link>
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
          <h2 className="font-heading text-2xl sm:text-3xl font-bold text-green-islamic">
            Vous préférez un accompagnement personnalisé ?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-text-secondary leading-relaxed">
            Réservez une séance de coaching individuelle ou de couple pour un suivi sur mesure.
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
              className="inline-block rounded-xl bg-gold px-8 py-3.5 font-semibold text-white text-base transition hover:opacity-90 active:scale-[0.98] text-center"
            >
              Réserver une séance
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
