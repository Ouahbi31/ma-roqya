import { Link } from 'react-router-dom';
import { ChevronRight, BookOpen, Heart, Users, Shield, Zap, Star, ArrowRight } from 'lucide-react';
import SEO from '../../components/SEO';
import { coachingProgrammes } from '../../data/coachingProgrammes';

const douleurs = [
  { emoji: '💔', texte: 'Mon couple souffre et on n\'arrive plus à se comprendre' },
  { emoji: '🔁', texte: 'Je tourne en rond, les mêmes blocages reviennent toujours' },
  { emoji: '🙏', texte: 'Je veux me rapprocher d\'Allah mais je n\'y arrive pas' },
  { emoji: '😔', texte: 'Je manque de confiance, je me sens bloqué(e) dans ma vie' },
  { emoji: '⚡', texte: 'Les conflits familiaux m\'épuisent et je sais plus quoi faire' },
  { emoji: '🌱', texte: 'Je veux m\'épanouir et construire une vie alignée avec ma foi' },
];

const iconMap: Record<string, typeof Heart> = { Heart, Star, Shield, Users, Zap, BookOpen };

const etapes = [
  { num: '01', titre: 'Choisis ton programme', desc: 'Sélectionne celui qui correspond à ta situation parmi nos formations.' },
  { num: '02', titre: 'Accède à vie', desc: 'Vidéos, exercices pratiques et outils — disponibles quand tu veux, où tu veux.' },
  { num: '03', titre: 'Transforme ta vie', desc: 'Applique les outils jour après jour et vis le changement en profondeur.' },
];

export default function CoachingHome() {
  return (
    <div className="min-h-screen bg-cream">
      <SEO
        title="CoachMyNefs — Coaching islamique & développement personnel"
        description="Tu traverses une épreuve dans ton couple, ta famille ou ta foi ? Découvre nos programmes de coaching islamique pour aller mieux et t'épanouir."
        keywords="coaching islamique, couple musulman, développement personnel, confiance en soi, spiritualité islam"
        url="/coaching"
      />

      {/* ═══ HERO ═══ */}
      <section className="relative overflow-hidden py-14 sm:py-20 md:py-28">
        <div className="islamic-pattern-bg absolute inset-0 z-0" />
        <div className="relative z-10 mx-auto max-w-3xl px-5 sm:px-4 text-center">

          <div className="inline-flex items-center gap-2 rounded-full bg-gold/15 px-4 py-1.5 text-sm font-semibold text-gold mb-6">
            <span className="h-2 w-2 rounded-full bg-gold animate-pulse" />
            Coaching islamique & développement personnel
          </div>

          <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold text-text-primary leading-tight">
            Tu mérites d'aller mieux.{' '}
            <span className="text-gold">Maintenant.</span>
          </h1>

          <p className="mx-auto mt-5 max-w-xl text-base sm:text-lg text-text-secondary leading-relaxed">
            Que tu traverses une épreuve dans ton couple, ta famille ou ta foi —
            nos programmes te donnent les outils concrets pour te libérer et t'épanouir,
            ancrés dans les valeurs de l'Islam.
          </p>

          <div className="mt-4">
            <p className="text-arabic text-xl sm:text-2xl text-gold">
              وَعَلَى اللَّهِ فَتَوَكَّلُوا إِن كُنتُم مُّؤْمِنِينَ
            </p>
            <p className="mt-1 text-xs text-text-secondary italic">
              « Et placez votre confiance en Allah si vous êtes croyants » — Sourate Al-Ma'ida, 5:23
            </p>
          </div>

          <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              to="/coaching/programmes"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-gold px-8 py-4 font-bold text-white text-base transition hover:opacity-90 active:scale-[0.98]"
            >
              Voir les programmes
              <ArrowRight className="h-5 w-5" />
            </Link>
            <a
              href="https://cal.com/coachmynefs"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-gold/40 px-8 py-4 font-semibold text-gold text-base transition hover:bg-gold/10 active:scale-[0.98]"
            >
              Réserver une séance
            </a>
          </div>
        </div>
      </section>

      <div className="arabesque-separator mx-auto max-w-lg" />

      {/* ═══ DOULEURS ═══ */}
      <section className="py-10 sm:py-16">
        <div className="mx-auto max-w-4xl px-5 sm:px-4">
          <h2 className="font-heading text-center text-2xl sm:text-3xl font-bold text-green-islamic mb-3">
            Tu te reconnais dans l'une de ces situations ?
          </h2>
          <p className="text-center text-text-secondary mb-8 text-sm">
            Tu n'es pas seul(e). Ces situations sont plus courantes qu'on ne le pense.
          </p>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {douleurs.map((d) => (
              <div
                key={d.texte}
                className="flex items-start gap-3 rounded-xl bg-white border border-cream-dark p-4"
              >
                <span className="text-xl shrink-0">{d.emoji}</span>
                <p className="text-sm text-text-primary leading-relaxed">{d.texte}</p>
              </div>
            ))}
          </div>
          <div className="mt-6 text-center">
            <Link
              to="/coaching/programmes"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-gold hover:underline"
            >
              Trouve ton programme →
            </Link>
          </div>
        </div>
      </section>

      <div className="arabesque-separator mx-auto max-w-lg" />

      {/* ═══ PROGRAMMES ═══ */}
      <section className="py-10 sm:py-16">
        <div className="mx-auto max-w-5xl px-5 sm:px-4">
          <h2 className="font-heading text-center text-2xl sm:text-3xl font-bold text-green-islamic mb-3">
            Nos programmes
          </h2>
          <p className="text-center text-text-secondary mb-8 text-sm">
            Des formations accessibles, concrètes et ancrées dans l'Islam. Accès à vie dès l'achat.
          </p>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {coachingProgrammes.map((prog) => {
              const Icon = iconMap[prog.icon] ?? Star;
              return (
                <Link
                  key={prog.slug}
                  to={`/coaching/programmes/${prog.slug}`}
                  className="card-islamic flex flex-col p-5 gap-3 hover:-translate-y-0.5 transition-transform group"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cream-dark">
                      <Icon className={`h-5 w-5 ${prog.color}`} />
                    </div>
                    {prog.badge && (
                      <span className="rounded-full bg-gold/10 border border-gold/30 px-2 py-0.5 text-xs font-semibold text-gold">
                        {prog.badge}
                      </span>
                    )}
                  </div>
                  <div>
                    <h3 className="font-heading text-sm font-bold text-text-primary leading-snug">
                      {prog.title}
                    </h3>
                    <p className="mt-1 text-xs text-text-secondary">{prog.subtitle}</p>
                  </div>
                  <div className="mt-auto flex items-center justify-between pt-3 border-t border-cream-dark">
                    <span className="font-heading text-xl font-bold text-gold">{prog.price}€</span>
                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-gold group-hover:gap-2 transition-all">
                      Découvrir <ChevronRight className="h-3.5 w-3.5" />
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
          <div className="mt-6 text-center">
            <Link
              to="/coaching/programmes"
              className="inline-flex items-center gap-2 rounded-xl bg-gold px-8 py-3.5 font-semibold text-white text-sm transition hover:opacity-90"
            >
              Voir tous les programmes
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      <div className="arabesque-separator mx-auto max-w-lg" />

      {/* ═══ COMMENT ÇA MARCHE ═══ */}
      <section className="py-10 sm:py-16">
        <div className="mx-auto max-w-4xl px-5 sm:px-4">
          <h2 className="font-heading text-center text-2xl sm:text-3xl font-bold text-green-islamic mb-10">
            Comment ça marche ?
          </h2>
          <div className="grid gap-6 sm:grid-cols-3">
            {etapes.map((e) => (
              <div key={e.num} className="text-center">
                <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gold/10 mb-4">
                  <span className="font-heading text-xl font-bold text-gold">{e.num}</span>
                </div>
                <h3 className="font-heading text-base font-bold text-text-primary mb-2">{e.titre}</h3>
                <p className="text-sm text-text-secondary leading-relaxed">{e.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="arabesque-separator mx-auto max-w-lg" />

      {/* ═══ CTA FINAL ═══ */}
      <section className="py-10 sm:py-16">
        <div className="mx-auto max-w-2xl px-5 sm:px-4 text-center">
          <h2 className="font-heading text-2xl sm:text-3xl font-bold text-green-islamic mb-4">
            Prêt(e) à changer ta vie ?
          </h2>
          <p className="text-text-secondary leading-relaxed mb-8">
            Choisis ton programme et commence dès aujourd'hui. Chaque jour sans agir, c'est un jour de plus dans la même situation.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              to="/coaching/programmes"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-gold px-8 py-4 font-bold text-white text-base transition hover:opacity-90"
            >
              Je choisis mon programme
              <ArrowRight className="h-5 w-5" />
            </Link>
            <a
              href="https://cal.com/coachmynefs"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-xl border border-gold/40 px-8 py-4 font-semibold text-gold text-base transition hover:bg-gold/10"
            >
              Réserver une séance
            </a>
          </div>
        </div>
      </section>

    </div>
  );
}
