import { useState } from 'react';
import { BookOpen, Clock } from 'lucide-react';
import SEO from '../../components/SEO';

const filters = [
  { id: 'all', label: 'Tous' },
  { id: 'couple', label: 'Couple' },
  { id: 'dev-perso', label: 'Développement personnel' },
  { id: 'motivation', label: 'Motivation' },
  { id: 'confiance', label: 'Confiance en Allah' },
];

export default function CoachingArticles() {
  const [activeFilter, setActiveFilter] = useState('all');

  return (
    <div className="min-h-screen bg-cream">
      <SEO
        title="Articles Coaching - CoachMyNefs"
        description="Articles sur le développement personnel, l'accompagnement de couple, la motivation et la confiance en Allah."
        keywords="articles coaching, développement personnel, couple, motivation, confiance en Allah"
        url="/coaching/articles"
      />

      {/* Hero */}
      <section className="relative overflow-hidden py-10 sm:py-16 md:py-20">
        <div className="islamic-pattern-bg absolute inset-0 z-0 opacity-50" />
        <div className="relative z-10 mx-auto max-w-4xl px-5 sm:px-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <BookOpen className="h-7 w-7 text-gold" />
          </div>
          <h1 className="font-heading text-3xl sm:text-4xl font-bold text-green-islamic md:text-5xl">
            Articles Coaching
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-base sm:text-lg text-text-secondary leading-relaxed">
            Développement personnel, couple et confiance en Allah
          </p>
        </div>
      </section>

      {/* Filters */}
      <section className="py-4 sm:py-6 border-b border-cream-dark sticky top-14 md:top-16 z-30 bg-cream">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="flex gap-2 overflow-x-auto pb-1 sm:pb-0 sm:flex-wrap sm:justify-center scrollbar-hide">
            {filters.map((filter) => (
              <button
                key={filter.id}
                onClick={() => setActiveFilter(filter.id)}
                className={`shrink-0 rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                  activeFilter === filter.id
                    ? 'bg-gold text-white'
                    : 'bg-white border border-cream-dark text-text-secondary hover:border-gold hover:text-gold'
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Empty state */}
      <section className="py-16 sm:py-24 md:py-32">
        <div className="mx-auto max-w-lg px-5 sm:px-4 text-center">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gold/10">
            <Clock className="h-10 w-10 text-gold" />
          </div>
          <h2 className="font-heading text-xl sm:text-2xl font-bold text-green-islamic mb-3">
            Articles à venir...
          </h2>
          <p className="text-text-secondary leading-relaxed text-sm sm:text-base">
            Les articles coaching sont en cours de rédaction. Revenez bientôt pour découvrir des contenus sur le développement personnel, le couple et la confiance en Allah.
          </p>
          <div className="mt-6 h-0.5 w-16 bg-gold/30 mx-auto" />
          <p className="mt-4 text-xs text-text-secondary opacity-70">
            En attendant, vous pouvez réserver une séance de coaching directement.
          </p>
        </div>
      </section>
    </div>
  );
}
