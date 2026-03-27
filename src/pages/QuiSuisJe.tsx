import { Link } from 'react-router-dom';
import { Heart, BookOpen, Shield, MessageCircle, Award, Users } from 'lucide-react';

export default function QuiSuisJe() {
  return (
    <div className="min-h-screen bg-cream">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-b from-green-islamic/5 to-cream pb-12 pt-8">
        <div className="mx-auto max-w-4xl px-4">
          <div className="flex flex-col items-center text-center md:flex-row md:items-start md:text-left md:gap-12">
            {/* Photo */}
            <div className="mb-6 md:mb-0 shrink-0">
              <div className="relative">
                <div className="absolute -inset-2 rounded-full bg-gradient-to-br from-green-islamic/20 to-gold/20 blur-lg" />
                <img
                  src="/images/frere-muz.jpg"
                  alt="Frère Muz"
                  className="relative h-48 w-48 rounded-full object-cover border-4 border-white shadow-xl md:h-56 md:w-56"
                />
              </div>
            </div>

            {/* Intro */}
            <div className="flex-1">
              <p className="text-sm font-semibold uppercase tracking-wider text-gold">Qui suis-je ?</p>
              <h1 className="font-heading mt-2 text-3xl font-bold text-green-islamic md:text-4xl">
                Frère Muz
              </h1>
              <p className="mt-1 text-lg text-text-secondary">
                Praticien en Psycho-Roqya & Coach en développement personnel
              </p>
              <p className="mt-4 text-text-secondary leading-relaxed">
                Depuis plus de <strong className="text-green-islamic">15 ans</strong>, j'accompagne des hommes et des femmes
                sur le chemin de la guérison spirituelle et du bien-être psychologique,
                en alliant la puissance du Coran à une approche humaine et bienveillante.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Parcours */}
      <section className="py-12">
        <div className="mx-auto max-w-3xl px-4">
          <h2 className="font-heading text-2xl font-bold text-green-islamic mb-6">Mon parcours</h2>

          <div className="space-y-4 text-text-secondary leading-relaxed">
            <p>
              Tout a commencé par un besoin personnel. En cherchant à aider mes proches,
              j'ai découvert la roqya shar'iyya et ses effets concrets sur les personnes touchées
              par le mauvais oeil, la sorcellerie ou les troubles spirituels. Les résultats étaient là,
              et le bouche-à-oreille a fait le reste.
            </p>
            <p>
              Poussé par cette vocation, je me suis formé auprès de raqis reconnus au
              <strong className="text-text-primary"> Maroc</strong>, en
              <strong className="text-text-primary"> Belgique</strong> et dans plusieurs autres pays,
              pour comprendre les différentes approches et affiner ma méthode. Un ami m'a ensuite
              encouragé à partager mon travail sur les réseaux sociaux, où j'ai pu toucher
              des milliers de personnes.
            </p>
            <p>
              Au fil des années, j'ai enrichi mon approche en me formant au
              <strong className="text-text-primary"> coaching en développement personnel</strong>, à la
              <strong className="text-text-primary"> communication non violente</strong>, à la
              <strong className="text-text-primary"> gestion de conflits</strong> et aux techniques de
              <strong className="text-text-primary"> motivation</strong>. C'est de cette combinaison unique
              qu'est née la <strong className="text-green-islamic">Psycho-Roqya</strong>.
            </p>
            <p>
              J'ai ouvert un cabinet de consultations, donné des conférences sur la Psycho-Roqya
              et la reprise en main de sa vie, et aujourd'hui je continue d'accompagner
              chaque personne avec la même conviction : <em>la guérison vient d'Allah,
              mais Il nous a donné les moyens d'y travailler.</em>
            </p>
          </div>
        </div>
      </section>

      <div className="arabesque-separator mx-auto max-w-lg" />

      {/* Ma méthode */}
      <section className="py-12">
        <div className="mx-auto max-w-3xl px-4">
          <h2 className="font-heading text-2xl font-bold text-green-islamic mb-6">La Psycho-Roqya</h2>

          <div className="rounded-2xl bg-white border border-cream-dark p-6 shadow-sm">
            <p className="text-text-secondary leading-relaxed mb-4">
              La Psycho-Roqya est une méthode d'accompagnement que j'ai développée au fil de mes
              15 années d'expérience. Elle agit là où les forces occultes opèrent :
              <strong className="text-green-islamic"> sur le terrain psychologique</strong>.
            </p>
            <p className="text-text-secondary leading-relaxed mb-4">
              Le mode opératoire principal des djinns et de la sorcellerie passe par la manipulation
              psychologique. La Psycho-Roqya consiste à reprendre le contrôle sur ce terrain :
              identifier les mécanismes d'emprise, comprendre comment ils agissent sur vous,
              et acquérir des outils concrets pour vous en libérer.
            </p>
            <p className="text-text-secondary leading-relaxed">
              En combinant la puissance du Coran avec cette compréhension psychologique,
              vous brisez les carcans de l'intérieur et reprenez votre autonomie dans tous
              les domaines de votre vie.
            </p>
          </div>
        </div>
      </section>

      {/* Valeurs */}
      <section className="py-12 bg-green-islamic/5">
        <div className="mx-auto max-w-4xl px-4">
          <h2 className="font-heading text-2xl font-bold text-green-islamic mb-8 text-center">Mes valeurs</h2>

          <div className="grid gap-6 md:grid-cols-2">
            {[
              {
                icon: BookOpen,
                title: 'Coran & Sunna',
                desc: 'Chaque méthode utilisée est conforme aux enseignements du Coran et de la Sunna authentique. Pas de charlatanisme, pas de pratiques douteuses.',
              },
              {
                icon: Heart,
                title: 'Bienveillance',
                desc: "Chaque personne est accueillie avec respect et empathie, sans jugement. Votre souffrance est légitime et mérite une écoute sincère.",
              },
              {
                icon: Shield,
                title: 'Confidentialité',
                desc: "Tout ce qui est partagé en séance reste strictement confidentiel. Votre vie privée est sacrée.",
              },
              {
                icon: Users,
                title: 'Autonomie',
                desc: "Mon objectif n'est pas de créer une dépendance, mais de vous rendre acteur de votre propre guérison, bi idhnillah.",
              },
              {
                icon: Award,
                title: 'Expérience',
                desc: "+15 ans de pratique, des centaines de personnes accompagnées, et une formation continue pour toujours mieux vous servir.",
              },
              {
                icon: MessageCircle,
                title: 'Accessibilité',
                desc: "Consultations en visioconférence ou par appel vocal, accessibles où que vous soyez dans le monde.",
              },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="rounded-xl bg-white border border-cream-dark p-5 shadow-sm">
                <div className="flex items-center gap-3 mb-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-islamic/10">
                    <Icon size={20} className="text-green-islamic" />
                  </div>
                  <h3 className="font-heading text-lg font-bold text-text-primary">{title}</h3>
                </div>
                <p className="text-sm text-text-secondary leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16">
        <div className="mx-auto max-w-2xl px-4 text-center">
          <h2 className="font-heading text-2xl font-bold text-green-islamic mb-4">
            Prêt(e) à avancer ?
          </h2>
          <p className="text-text-secondary mb-8">
            Chaque parcours de guérison commence par un premier pas.
            Réservez votre séance et commençons ensemble, bi idhnillah.
          </p>
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link
              to="/tarifs"
              className="rounded-xl bg-green-islamic px-8 py-3.5 text-sm font-semibold text-white transition hover:bg-gold shadow-md"
            >
              Réserver une séance
            </Link>
            <Link
              to="/articles"
              className="rounded-xl border-2 border-green-islamic px-8 py-3.5 text-sm font-semibold text-green-islamic transition hover:bg-green-islamic/5"
            >
              Découvrir les articles
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
