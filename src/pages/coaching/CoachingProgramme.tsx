import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Lock, Crown, Circle, ChevronDown, ChevronUp } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import SEO from '../../components/SEO';

interface WeekDay {
  day: number;
  title: string;
  desc: string;
  free: boolean;
}

interface Week {
  number: number;
  theme: string;
  color: string;
  days: WeekDay[];
}

const weeks: Week[] = [
  {
    number: 1,
    theme: 'Connaissance de soi & bilan',
    color: 'green-islamic',
    days: [
      { day: 1, title: 'Qui suis-je vraiment ?', desc: 'Bilan de vie, valeurs et identité profonde.', free: true },
      { day: 2, title: 'Mes forces et ressources', desc: 'Identifier ce qui vous soutient et vous nourrit.', free: true },
      { day: 3, title: 'Ce que je veux changer', desc: 'Clarifier votre intention de transformation.', free: true },
      { day: 4, title: 'Ma relation à Allah', desc: 'Évaluer et renforcer votre lien spirituel.', free: false },
      { day: 5, title: 'Bilan émotionnel', desc: 'Comprendre vos émotions et réactions habituelles.', free: false },
      { day: 6, title: 'Mes croyances limitantes', desc: 'Repérer les pensées qui vous freinent.', free: false },
      { day: 7, title: 'Synthèse semaine 1', desc: 'Consolidation et intention pour la suite.', free: false },
    ],
  },
  {
    number: 2,
    theme: 'Identifier les blocages',
    color: 'gold',
    days: [
      { day: 8, title: 'Peurs et résistances', desc: 'Nommer ce qui vous empêche d\'avancer.', free: false },
      { day: 9, title: 'Schémas répétitifs', desc: 'Comprendre vos patterns comportementaux.', free: false },
      { day: 10, title: 'La procrastination', desc: 'Outils pour agir malgré la peur.', free: false },
      { day: 11, title: 'Relation à l\'échec', desc: 'Transformer l\'échec en apprentissage.', free: false },
      { day: 12, title: 'La confiance en soi', desc: 'Reconstruire l\'estime personnelle.', free: false },
      { day: 13, title: 'Communication difficile', desc: 'Exprimer ses besoins sans blesser.', free: false },
      { day: 14, title: 'Synthèse semaine 2', desc: 'Bilan des blocages identifiés.', free: false },
    ],
  },
  {
    number: 3,
    theme: 'Outils & stratégies',
    color: 'green-islamic',
    days: [
      { day: 15, title: 'La tawakkul au quotidien', desc: 'Intégrer la confiance en Allah concrètement.', free: false },
      { day: 16, title: 'Gestion du stress', desc: 'Techniques islamiques et psychologiques.', free: false },
      { day: 17, title: 'Objectifs SMART', desc: 'Fixer des objectifs clairs et atteignables.', free: false },
      { day: 18, title: 'Habitudes positives', desc: 'Construire des routines qui vous élèvent.', free: false },
      { day: 19, title: 'La gratitude', desc: 'Pratiquer le shukr pour changer de perspective.', free: false },
      { day: 20, title: 'Gestion du temps', desc: 'Organiser votre vie avec sagesse.', free: false },
      { day: 21, title: 'Synthèse semaine 3', desc: 'Votre boîte à outils personnelle.', free: false },
    ],
  },
  {
    number: 4,
    theme: 'Ancrage & projet de vie',
    color: 'gold',
    days: [
      { day: 22, title: 'Ma vision à 1 an', desc: 'Construire une vision claire et motivante.', free: false },
      { day: 23, title: 'Mon projet de vie', desc: 'Aligner vos actions avec vos valeurs.', free: false },
      { day: 24, title: 'Relations saines', desc: 'Cultiver des liens épanouissants.', free: false },
      { day: 25, title: 'Ancrage spirituel', desc: 'Faire de votre foi un pilier quotidien.', free: false },
      { day: 26, title: 'Gérer les rechutes', desc: 'Rester sur la voie malgré les obstacles.', free: false },
      { day: 27, title: 'Mon plan d\'action', desc: 'Structurer vos 90 prochains jours.', free: false },
      { day: 28, title: 'Célébration & projection', desc: 'Honorer le chemin parcouru et aller plus loin.', free: false },
    ],
  },
];

export default function CoachingProgramme() {
  const { profile } = useAuthStore();
  const isPremium = profile?.is_premium;
  const [expandedWeeks, setExpandedWeeks] = useState<Set<number>>(new Set([1]));

  const toggleWeek = (weekNumber: number) => {
    setExpandedWeeks((prev) => {
      const next = new Set(prev);
      if (next.has(weekNumber)) {
        next.delete(weekNumber);
      } else {
        next.add(weekNumber);
      }
      return next;
    });
  };

  return (
    <div className="min-h-screen bg-cream">
      <SEO
        title="Programme Coaching 30 jours - CoachMyNefs"
        description="Programme de coaching personnalisé sur 30 jours pour votre transformation. Connaissance de soi, identification des blocages, outils pratiques et ancrage durable."
        keywords="programme coaching, transformation personnelle, développement personnel, coaching 30 jours"
        url="/coaching/programme"
      />

      {/* Hero */}
      <section className="relative overflow-hidden py-10 sm:py-16 md:py-20">
        <div className="islamic-pattern-bg absolute inset-0 z-0 opacity-50" />
        <div className="relative z-10 mx-auto max-w-4xl px-5 sm:px-4 text-center">
          <h1 className="font-heading text-3xl sm:text-4xl font-bold text-green-islamic md:text-5xl">
            Programme Coaching 30 jours
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-base sm:text-lg text-text-secondary leading-relaxed">
            Votre parcours de transformation personnelle, semaine par semaine
          </p>
          {!isPremium && (
            <div className="mt-6 inline-flex items-center gap-2 rounded-xl bg-gold/10 border border-gold/20 px-4 py-2 text-sm text-gold">
              <Crown className="h-4 w-4" />
              <span>Jours 1–3 gratuits · Accès complet avec Premium</span>
            </div>
          )}
        </div>
      </section>

      <div className="arabesque-separator mx-auto max-w-lg" />

      {/* Weeks */}
      <section className="py-10 sm:py-16 md:py-20">
        <div className="mx-auto max-w-3xl px-5 sm:px-4 space-y-4">
          {weeks.map((week) => {
            const isExpanded = expandedWeeks.has(week.number);
            const isGold = week.color === 'gold';

            return (
              <div key={week.number} className="card-islamic overflow-hidden">
                {/* Week header */}
                <button
                  onClick={() => toggleWeek(week.number)}
                  className="w-full flex items-center justify-between p-5 sm:p-6 text-start"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-sm font-bold text-white ${
                        isGold ? 'bg-gold' : 'bg-green-islamic'
                      }`}
                    >
                      S{week.number}
                    </div>
                    <div>
                      <p className="text-xs text-text-secondary mb-0.5">Semaine {week.number}</p>
                      <h3 className={`font-heading font-bold text-base sm:text-lg ${isGold ? 'text-gold' : 'text-green-islamic'}`}>
                        {week.theme}
                      </h3>
                    </div>
                  </div>
                  {isExpanded ? (
                    <ChevronUp className="h-5 w-5 text-text-secondary shrink-0" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-text-secondary shrink-0" />
                  )}
                </button>

                {/* Week days */}
                {isExpanded && (
                  <div className="border-t border-cream-dark">
                    {week.days.map((dayItem) => {
                      const isLocked = !dayItem.free && !isPremium;
                      return (
                        <div
                          key={dayItem.day}
                          className={`flex items-start gap-3 px-5 sm:px-6 py-3.5 border-b border-cream-dark/50 last:border-0 ${
                            isLocked ? 'opacity-60' : ''
                          }`}
                        >
                          <div className="shrink-0 mt-0.5">
                            {isLocked ? (
                              <Lock className="h-4 w-4 text-text-secondary" />
                            ) : (
                              <Circle className="h-4 w-4 text-gold" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-text-secondary font-medium">
                                Jour {dayItem.day}
                              </span>
                              {dayItem.free && (
                                <span className="text-xs text-green-islamic font-semibold bg-green-islamic/10 px-1.5 py-0.5 rounded">
                                  Gratuit
                                </span>
                              )}
                            </div>
                            <p className="font-medium text-sm text-text-primary mt-0.5">
                              {dayItem.title}
                            </p>
                            <p className="text-xs text-text-secondary mt-0.5">
                              {dayItem.desc}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Premium CTA */}
        {!isPremium && (
          <div className="mx-auto max-w-3xl px-5 sm:px-4 mt-8">
            <div className="card-islamic p-6 sm:p-8 text-center border-2 border-gold/30">
              <Crown className="h-10 w-10 text-gold mx-auto mb-3" />
              <h3 className="font-heading text-lg sm:text-xl font-bold text-green-islamic mb-2">
                Accédez au programme complet
              </h3>
              <p className="text-sm text-text-secondary mb-5 max-w-md mx-auto leading-relaxed">
                Les 25 jours restants et l'ensemble du contenu coaching sont accessibles avec un abonnement Premium ou en réservant une séance d'accompagnement.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <a
                  href="https://cal.com/coachmynefs"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-xl bg-gold px-6 py-2.5 text-sm font-semibold text-white transition hover:opacity-90"
                >
                  Réserver une séance
                </a>
                <Link
                  to="/tarifs"
                  className="rounded-xl border border-gold/40 px-6 py-2.5 text-sm font-semibold text-gold transition hover:bg-gold/10"
                >
                  Voir les tarifs
                </Link>
              </div>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
