import { Link } from 'react-router-dom';
import { User, Users, Calendar, Clock, Tag } from 'lucide-react';
import SEO from '../../components/SEO';

const services = [
  {
    icon: User,
    title: 'Séance individuelle',
    description:
      'Un espace d\'écoute bienveillant pour travailler sur vos blocages personnels, renforcer votre confiance en vous et en Allah, et avancer avec clarté vers vos objectifs.',
    duration: '1h',
    price: '50€',
    highlights: [
      'Écoute active et bienveillante',
      'Identification de vos blocages',
      'Outils pratiques et exercices',
      'Suivi personnalisé',
    ],
    accent: 'green-islamic',
  },
  {
    icon: Users,
    title: 'Accompagnement de couple',
    description:
      'Une séance dédiée aux deux partenaires pour améliorer la communication, dépasser les conflits, se retrouver et construire ensemble un projet de vie épanouissant.',
    duration: '1h30',
    price: '80€',
    highlights: [
      'Communication bienveillante',
      'Gestion des conflits',
      'Réconciliation et confiance',
      'Projet de vie commun',
    ],
    accent: 'gold',
  },
  {
    icon: Calendar,
    title: 'Suivi mensuel',
    description:
      'Un programme complet sur un mois avec 4 séances pour transformer en profondeur votre vie personnelle ou votre relation de couple. Idéal pour des changements durables.',
    duration: '4 séances',
    price: '160€',
    highlights: [
      '4 séances sur 1 mois',
      'Programme personnalisé',
      'Suivi entre les séances',
      'Bilan et plan d\'action',
    ],
    accent: 'gold',
  },
];

export default function CoachingServices() {
  return (
    <div className="min-h-screen bg-cream">
      <SEO
        title="Services de coaching - CoachMyNefs"
        description="Séances individuelles, accompagnement de couple et suivi mensuel. Des services de coaching personnalisés pour votre développement personnel et votre épanouissement."
        keywords="coaching individuel, accompagnement de couple, suivi mensuel, séance coaching, tarifs coaching"
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

      {/* Services Cards */}
      <section className="py-10 sm:py-16 md:py-24">
        <div className="mx-auto max-w-5xl px-5 sm:px-4">
          <div className="grid gap-6 sm:gap-8 md:grid-cols-3">
            {services.map((service) => {
              const Icon = service.icon;
              const isGold = service.accent === 'gold';
              return (
                <div
                  key={service.title}
                  className="card-islamic flex flex-col p-6 sm:p-7 gap-5"
                >
                  {/* Icon & Title */}
                  <div className="flex flex-col items-center text-center gap-3">
                    <div
                      className={`flex h-14 w-14 items-center justify-center rounded-2xl ${
                        isGold ? 'bg-gold/10' : 'bg-green-islamic/10'
                      }`}
                    >
                      <Icon
                        className={`h-7 w-7 ${isGold ? 'text-gold' : 'text-green-islamic'}`}
                      />
                    </div>
                    <h2
                      className={`font-heading text-lg font-bold ${
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
                      <span className="font-heading text-lg font-bold text-gold">
                        {service.price}
                      </span>
                    </div>
                  </div>

                  {/* CTA */}
                  <Link
                    to="/tarifs?booking=1"
                    className={`w-full text-center rounded-xl px-5 py-2.5 text-sm font-semibold text-white transition hover:opacity-90 ${
                      isGold ? 'bg-gold' : 'bg-green-islamic'
                    }`}
                  >
                    Réserver
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
            Vous avez une question ?
          </h2>
          <p className="text-text-secondary text-sm sm:text-base leading-relaxed mb-6">
            N'hésitez pas à consulter la page tarifs pour plus d'informations ou à réserver directement une première séance découverte.
          </p>
          <Link
            to="/tarifs?booking=1"
            className="inline-block rounded-xl bg-gold px-8 py-3.5 font-semibold text-white text-base transition hover:opacity-90"
          >
            Réserver une séance
          </Link>
        </div>
      </section>
    </div>
  );
}
