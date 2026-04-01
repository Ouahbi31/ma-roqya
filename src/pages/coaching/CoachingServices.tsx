import { Link } from 'react-router-dom';
import { User, Users, Clock, Tag } from 'lucide-react';
import SEO from '../../components/SEO';

const services = [
  {
    icon: User,
    title: 'Coaching individuel',
    description:
      'Travaillez sur vos blocages, votre confiance et votre développement personnel en séance individuelle.',
    duration: '1h',
    price: '50€',
    highlights: [
      'Travail sur vos blocages personnels',
      'Renforcement de la confiance en soi',
      'Développement personnel ancré dans la foi',
      'Outils pratiques et plan d\'action',
    ],
    accent: 'green-islamic',
  },
  {
    icon: Users,
    title: 'Coaching de couple',
    description:
      'Retrouvez l\'harmonie dans votre relation avec une séance dédiée aux deux partenaires.',
    duration: '1h',
    price: '50€',
    highlights: [
      'Communication bienveillante',
      'Gestion des conflits',
      'Projet de vie commun',
      'Reconnexion et harmonie',
    ],
    accent: 'gold',
  },
];

export default function CoachingServices() {
  return (
    <div className="min-h-screen bg-cream">
      <SEO
        title="Services de coaching — CoachMyNefs"
        description="Coaching individuel et coaching de couple. Des séances personnalisées de 1h à 50€ pour votre développement personnel et votre épanouissement."
        keywords="coaching individuel, coaching de couple, séance coaching, tarifs coaching"
        url="/coaching/services"
      />

      {/* Hero */}
      <section className="relative overflow-hidden py-10 sm:py-16 md:py-20">
        <div className="islamic-pattern-bg absolute inset-0 z-0 opacity-50" />
        <div className="relative z-10 mx-auto max-w-4xl px-5 sm:px-4 text-center">
          <h1 className="font-heading text-3xl sm:text-4xl font-bold text-green-islamic md:text-5xl">
            Mes services d'accompagnement
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-base sm:text-lg text-text-secondary leading-relaxed">
            Un accompagnement sur mesure, bienveillant et ancré dans vos valeurs, pour vous aider à avancer avec confiance.
          </p>
        </div>
      </section>

      <div className="arabesque-separator mx-auto max-w-lg" />

      {/* Services Cards — 2 cartes côte à côte */}
      <section className="py-10 sm:py-16 md:py-24">
        <div className="mx-auto max-w-3xl px-5 sm:px-4">
          <div className="grid gap-6 sm:gap-8 sm:grid-cols-2">
            {services.map((service) => {
              const Icon = service.icon;
              const isGold = service.accent === 'gold';
              return (
                <div
                  key={service.title}
                  className="card-islamic flex flex-col p-6 sm:p-8 gap-5"
                >
                  {/* Icon & Title */}
                  <div className="flex flex-col items-center text-center gap-3">
                    <div
                      className={`flex h-16 w-16 items-center justify-center rounded-2xl ${
                        isGold ? 'bg-gold/10' : 'bg-green-islamic/10'
                      }`}
                    >
                      <Icon
                        className={`h-8 w-8 ${isGold ? 'text-gold' : 'text-green-islamic'}`}
                      />
                    </div>
                    <h2
                      className={`font-heading text-xl font-bold ${
                        isGold ? 'text-gold' : 'text-green-islamic'
                      }`}
                    >
                      {service.title}
                    </h2>
                  </div>

                  {/* Description */}
                  <p className="text-sm text-text-secondary leading-relaxed text-center">
                    {service.description}
                  </p>

                  {/* Highlights */}
                  <ul className="space-y-2">
                    {service.highlights.map((item) => (
                      <li key={item} className="flex items-start gap-2 text-sm text-text-primary">
                        <span
                          className={`mt-1 h-1.5 w-1.5 shrink-0 rounded-full ${
                            isGold ? 'bg-gold' : 'bg-green-islamic'
                          }`}
                        />
                        {item}
                      </li>
                    ))}
                  </ul>

                  {/* Duration & Price */}
                  <div className="flex items-center justify-between mt-auto pt-4 border-t border-cream-dark">
                    <div className="flex items-center gap-1.5 text-sm text-text-secondary">
                      <Clock className="h-4 w-4" />
                      <span>{service.duration}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Tag className="h-4 w-4 text-gold" />
                      <span className="font-heading text-xl font-bold text-gold">
                        {service.price}
                      </span>
                    </div>
                  </div>

                  {/* CTA */}
                  <Link
                    to="/tarifs"
                    className={`w-full text-center rounded-xl px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90 active:scale-[0.98] ${
                      isGold ? 'bg-gold' : 'bg-green-islamic'
                    }`}
                  >
                    Réserver une séance
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <div className="arabesque-separator mx-auto max-w-lg" />

      {/* Final CTA */}
      <section className="py-10 sm:py-16 md:py-20">
        <div className="mx-auto max-w-2xl px-5 sm:px-4 text-center">
          <h2 className="font-heading text-xl sm:text-2xl font-bold text-green-islamic mb-3">
            Vous préférez avancer à votre rythme ?
          </h2>
          <p className="text-text-secondary text-sm sm:text-base leading-relaxed mb-6">
            Découvrez nos programmes en ligne : des formations courtes, accessibles et ancrées dans l'Islam.
          </p>
          <Link
            to="/coaching/programmes"
            className="inline-block rounded-xl bg-gold px-8 py-3.5 font-semibold text-white text-base transition hover:opacity-90"
          >
            Voir les programmes
          </Link>
        </div>
      </section>
    </div>
  );
}
