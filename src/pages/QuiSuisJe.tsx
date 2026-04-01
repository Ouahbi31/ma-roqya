import { Link } from 'react-router-dom';
import { Heart, BookOpen, Shield, Users, ChevronRight } from 'lucide-react';
import SEO from '../components/SEO';

export default function QuiSuisJe() {
  return (
    <div className="min-h-screen bg-cream">
      <SEO
        title="Qui suis-je — Dr Frère Muz | MaRoqya"
        description="Praticien en Psycho-Roqya & Coach en développement personnel depuis plus de 15 ans. Découvrez mon parcours et mon approche unique alliant spiritualité et psychologie."
      />

      {/* ── HERO ── */}
      <section className="relative overflow-hidden bg-gradient-to-b from-green-islamic/5 to-cream pb-12 pt-8">
        <div className="mx-auto max-w-4xl px-4">
          <div className="flex flex-col items-center text-center md:flex-row md:items-start md:text-left md:gap-12">

            {/* Photo */}
            <div className="mb-6 md:mb-0 shrink-0">
              <div className="relative">
                <div className="absolute -inset-2 rounded-full bg-gradient-to-br from-green-islamic/20 to-gold/20 blur-lg" />
                <img
                  src="/images/frere-muz.jpg"
                  alt="Dr Frère Muz"
                  className="relative h-48 w-48 rounded-full object-cover object-top border-4 border-white shadow-xl md:h-56 md:w-56"
                />
              </div>
            </div>

            {/* Intro */}
            <div className="flex-1">
              <p className="text-sm font-semibold uppercase tracking-wider text-gold">Qui suis-je ?</p>
              <h1 className="font-heading mt-2 text-3xl font-bold text-green-islamic md:text-4xl">
                Dr Frère Muz
              </h1>
              <p className="mt-1 text-lg text-text-secondary">
                Praticien en Psycho-Roqya & Coach en développement personnel
              </p>
              <p className="mt-5 text-text-secondary leading-relaxed">
                Depuis plus de <strong className="text-green-islamic">15 ans</strong>, j'accompagne
                des hommes et des femmes en quête d'apaisement, de compréhension et de guérison,
                en reliant deux dimensions essentielles : la spiritualité et la psychologie.
              </p>
              <p className="mt-3 text-text-secondary leading-relaxed">
                Mon approche repose sur une conviction simple : on ne peut pas séparer le cœur,
                l'âme et le mental. C'est dans cet équilibre que commence la véritable transformation.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── MON PARCOURS ── */}
      <section className="py-12">
        <div className="mx-auto max-w-3xl px-4">
          <h2 className="font-heading text-2xl font-bold text-green-islamic mb-6">Mon parcours</h2>

          <div className="space-y-5 text-text-secondary leading-relaxed">
            <p className="italic text-text-primary font-medium">
              Mon chemin n'est pas né d'une ambition, mais d'une nécessité.
            </p>
            <p>
              À l'origine, je cherchais simplement à aider mes proches confrontés à des difficultés
              profondes, parfois inexpliquées. C'est dans ce contexte que j'ai découvert la roqya
              shar'iyya, et ses effets concrets sur certaines situations liées au mauvais œil,
              à la sorcellerie ou à des troubles spirituels plus lourds, comme certaines formes
              de possession.
            </p>
            <p>
              Très vite, les résultats ont parlé d'eux-mêmes. De proche en proche, le bouche-à-oreille
              m'a amené à accompagner de plus en plus de personnes, avec une responsabilité grandissante.
            </p>
            <p>
              Animé par le souci de bien faire, j'ai alors décidé de me former sérieusement. J'ai
              appris auprès de plusieurs raqis, notamment au{' '}
              <strong className="text-text-primary">Maroc</strong>, en{' '}
              <strong className="text-text-primary">Belgique</strong> et ailleurs, afin de confronter
              les approches, comprendre les subtilités du domaine et affiner ma pratique.
            </p>
            <p>
              Avec le temps, une évidence s'est imposée : beaucoup de personnes restent bloquées,
              non pas uniquement à cause du mal spirituel, mais aussi à cause de mécanismes
              psychologiques profonds — peurs, dépendances, schémas répétitifs, perte de repères,
              manque de confiance…
            </p>
            <p>
              C'est ce constat qui m'a poussé à élargir mon approche. Je me suis alors formé au{' '}
              <strong className="text-text-primary">développement personnel</strong>, à la{' '}
              <strong className="text-text-primary">communication non violente</strong>, à la{' '}
              <strong className="text-text-primary">gestion des conflits</strong> et aux techniques
              de motivation, afin d'apporter des solutions concrètes, durables et adaptées à la réalité
              de chacun.
            </p>
            <p>
              Encouragé par mon entourage, j'ai commencé à partager ce travail sur les réseaux sociaux,
              où j'ai pu toucher et aider des milliers de personnes.
            </p>
            <p>
              Aujourd'hui, entre consultations, accompagnements, conférences et contenus en ligne,
              je poursuis cette mission avec la même intention qu'au premier jour : être un moyen,
              avec sincérité et responsabilité.
            </p>
            <div className="rounded-xl border-l-4 border-gold bg-gold/5 px-5 py-4">
              <p className="text-text-primary font-medium italic">
                Car la guérison vient d'Allah, mais chacun a un rôle à jouer dans son propre cheminement.
              </p>
            </div>
          </div>
        </div>
      </section>

      <div className="arabesque-separator mx-auto max-w-lg" />

      {/* ── LA PSYCHO-ROQYA ── */}
      <section className="py-12">
        <div className="mx-auto max-w-3xl px-4">
          <h2 className="font-heading text-2xl font-bold text-green-islamic mb-2">La Psycho-Roqya</h2>
          <p className="text-text-secondary mb-6">
            Au fil des années, une approche s'est naturellement construite.
          </p>

          {/* Pour qui */}
          <div className="rounded-2xl bg-white border border-cream-dark p-6 shadow-sm mb-6">
            <p className="font-semibold text-text-primary mb-4">
              Elle s'adresse notamment aux personnes confrontées à :
            </p>
            <ul className="space-y-2">
              {[
                'Le mauvais œil',
                'La sorcellerie',
                'Certaines formes de possession',
                'Des blocages intérieurs profonds qui impactent leur vie quotidienne',
              ].map((item) => (
                <li key={item} className="flex items-start gap-3 text-text-secondary">
                  <ChevronRight size={16} className="mt-0.5 shrink-0 text-gold" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Explication */}
          <div className="space-y-4 text-text-secondary leading-relaxed mb-6">
            <p>
              Dans de nombreux cas, ces troubles s'appuient sur un terrain psychologique fragilisé :
              pensées envahissantes, peurs, doutes, culpabilité, dépendance affective ou perte de
              contrôle. C'est sur ce terrain que l'impact est souvent le plus fort.
            </p>
          </div>

          {/* Les deux niveaux */}
          <p className="font-semibold text-text-primary mb-4">
            La Psycho-Roqya consiste donc à agir à deux niveaux :
          </p>
          <div className="grid gap-4 sm:grid-cols-2 mb-6">
            {[
              {
                icon: BookOpen,
                title: 'Spirituel',
                desc: "Par la puissance du Coran et des invocations, mais aussi en créant et en raffermissant une connexion profonde et ancrée avec Allah — une relation solide, fondée sur la confiance en Allah et la certitude de Sa miséricorde.",
                color: 'text-green-islamic',
                bg: 'bg-green-islamic/10',
              },
              {
                icon: Heart,
                title: 'Psychologique',
                desc: 'En identifiant et en déconstruisant les mécanismes internes qui maintiennent la personne dans la souffrance.',
                color: 'text-gold',
                bg: 'bg-gold/10',
              },
            ].map(({ icon: Icon, title, desc, color, bg }) => (
              <div key={title} className="rounded-xl bg-white border border-cream-dark p-5 shadow-sm">
                <div className="flex items-center gap-3 mb-3">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${bg}`}>
                    <Icon size={20} className={color} />
                  </div>
                  <h3 className="font-heading text-lg font-bold text-text-primary">{title}</h3>
                </div>
                <p className="text-sm text-text-secondary leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>

          <div className="space-y-4 text-text-secondary leading-relaxed">
            <p>
              Chaque séance est pensée comme une étape vers plus de clarté, de stabilité et de
              maîtrise de soi.
            </p>
            <p>
              L'objectif est de vous transmettre des outils concrets, des compréhensions profondes
              et des repères solides, afin que vous puissiez avancer avec autonomie et sérénité.
            </p>
            <div className="rounded-xl border-l-4 border-green-islamic bg-green-islamic/5 px-5 py-4">
              <p className="text-text-primary font-medium">
                L'idée est simple : ne plus subir, mais comprendre, agir et reprendre pleinement
                le contrôle de sa vie, avec l'aide d'Allah.
              </p>
            </div>
          </div>
        </div>
      </section>

      <div className="arabesque-separator mx-auto max-w-lg" />

      {/* ── VALEURS ── */}
      <section className="py-12 bg-green-islamic/5">
        <div className="mx-auto max-w-4xl px-4">
          <h2 className="font-heading text-2xl font-bold text-green-islamic mb-8 text-center">Mes valeurs</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {[
              { icon: BookOpen, title: 'Coran & Sunna', desc: 'Chaque méthode utilisée est conforme aux enseignements du Coran et de la Sunna authentique. Pas de charlatanisme, pas de pratiques douteuses.' },
              { icon: Heart, title: 'Bienveillance', desc: "Chaque personne est accueillie avec respect et empathie, sans jugement. Votre souffrance est légitime et mérite une écoute sincère." },
              { icon: Shield, title: 'Confidentialité', desc: "Tout ce qui est partagé en séance reste strictement confidentiel. Votre vie privée est sacrée." },
              { icon: Users, title: 'Autonomie', desc: "Mon objectif n'est pas de créer une dépendance, mais de vous rendre acteur de votre propre guérison, bi idhnillah." },
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

      {/* ── CTA ── */}
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
              to="/tarifs?booking=1"
              className="rounded-xl bg-green-islamic px-8 py-3.5 text-sm font-semibold text-white transition hover:bg-gold shadow-md"
            >
              Réserver une séance
            </Link>
            <Link
              to="/quiz"
              className="rounded-xl border-2 border-green-islamic px-8 py-3.5 text-sm font-semibold text-green-islamic transition hover:bg-green-islamic/5"
            >
              Évaluer ma situation
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
