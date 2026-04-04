import { Link } from 'react-router-dom';
import { ArrowRight, Check, PlayCircle, Clock, Infinity, Target, Compass, TrendingUp } from 'lucide-react';
import SEO from '../../components/SEO';
import { coachingProgrammes } from '../../data/coachingProgrammes';

const slugsIndividuel = ['reprendre-confiance', 'transformation-nefs'];
const programmes = coachingProgrammes.filter(p => slugsIndividuel.includes(p.slug));

const defis = [
  {
    icon: Target,
    titre: 'Le manque de confiance te freine',
    desc: 'Tu hésites, tu doutes de toi. Tu repousses ce que tu devrais faire parce que tu ne te sens pas à la hauteur.',
  },
  {
    icon: Compass,
    titre: 'Tu te sens bloqué(e) sans savoir pourquoi',
    desc: 'Tu tournes en rond. Les mêmes schémas reviennent. Tu veux avancer mais quelque chose t\'en empêche.',
  },
  {
    icon: TrendingUp,
    titre: 'Tu veux t\'épanouir dans ta foi',
    desc: 'Tu sens que ta vie n\'est pas alignée avec qui tu veux vraiment être. Tu cherches à te construire autrement.',
  },
];

const promesses = [
  'Identifier les croyances limitantes qui te bloquent',
  'Reprendre confiance en toi et en le Décret d\'Allah',
  'Développer une discipline intérieure ancrée dans la foi',
  'Apprendre à te connaître à travers le prisme du tazkiya',
  'Transformer tes échecs passés en leviers de croissance',
  'Construire une identité forte, alignée avec tes valeurs islamiques',
];

export default function CoachingIndividuel() {
  return (
    <div className="min-h-screen bg-cream">
      <SEO
        title="Développement personnel islamique — Confiance & épanouissement | CoachMyNefs"
        description="Tu te sens bloqué(e) ou tu manques de confiance ? Découvre nos programmes de développement personnel ancrés dans l'Islam pour te libérer et t'épanouir."
        keywords="coaching individuel musulman, développement personnel islam, confiance en soi, tazkiya, blocages"
        url="/coaching/individuel"
      />

      {/* ═══ HERO ═══ */}
      <section className="relative overflow-hidden py-16 sm:py-24">
        <div className="islamic-pattern-bg absolute inset-0 z-0 opacity-40" />
        <div className="relative z-10 mx-auto max-w-2xl px-5 text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-gold/15 px-4 py-1.5 text-sm font-semibold text-gold mb-6">
            👤 Développement personnel islamique
          </div>
          <h1 className="font-heading text-3xl sm:text-5xl font-bold text-text-primary leading-tight">
            Devenir la meilleure version de toi-même
          </h1>
          <p className="mt-5 text-base sm:text-lg text-text-secondary leading-relaxed max-w-xl mx-auto">
            Le développement personnel n'est pas étranger à l'Islam — c'est au cœur de la démarche du croyant.
            La tazkiya, la purification du cœur, est un chemin de toute une vie.
          </p>

          <div className="mt-6 rounded-2xl bg-white/70 border border-gold/20 px-6 py-4 inline-block">
            <p className="text-arabic text-2xl sm:text-3xl text-gold leading-loose">
              قَدْ أَفْلَحَ مَن زَكَّاهَا
            </p>
            <p className="mt-2 text-xs text-text-secondary italic">
              « A réussi celui qui la purifie » (en parlant de l'âme) — Sourate Ash-Shams, 91:9
            </p>
          </div>

          <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              to="#programmes"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-gold px-8 py-4 font-bold text-white text-base hover:opacity-90 transition"
            >
              Voir les programmes <ArrowRight className="h-5 w-5" />
            </Link>
            <Link
              to="/coaching/reserver?type=individuel"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-gold/40 px-8 py-4 font-semibold text-gold text-base hover:bg-gold/10 transition"
            >
              Réserver une séance individuelle
            </Link>
          </div>
        </div>
      </section>

      <div className="arabesque-separator mx-auto max-w-lg" />

      {/* ═══ DÉFIS ═══ */}
      <section className="py-12 sm:py-16">
        <div className="mx-auto max-w-4xl px-5">
          <h2 className="font-heading text-xl sm:text-2xl font-bold text-green-islamic text-center mb-2">
            Ces situations te parlent ?
          </h2>
          <p className="text-center text-sm text-text-secondary mb-10">
            Ces difficultés ne sont pas des faiblesses — elles font partie du chemin
          </p>
          <div className="grid gap-5 sm:grid-cols-3">
            {defis.map((d) => {
              const Icon = d.icon;
              return (
                <div key={d.titre} className="rounded-2xl bg-white border border-cream-dark p-5">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gold/10 mb-4">
                    <Icon className="h-5 w-5 text-gold" />
                  </div>
                  <h3 className="font-heading text-sm font-bold text-text-primary mb-2">{d.titre}</h3>
                  <p className="text-xs text-text-secondary leading-relaxed">{d.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <div className="arabesque-separator mx-auto max-w-lg" />

      {/* ═══ CE QUE TU DÉVELOPPERAS ═══ */}
      <section className="py-12 sm:py-16 bg-white/50">
        <div className="mx-auto max-w-3xl px-5">
          <h2 className="font-heading text-xl sm:text-2xl font-bold text-green-islamic text-center mb-2">
            Ce que tu vas développer
          </h2>
          <p className="text-center text-sm text-text-secondary mb-8">
            Des outils concrets, une démarche islamique, des résultats durables
          </p>
          <div className="grid gap-3 sm:grid-cols-2">
            {promesses.map((p) => (
              <div key={p} className="flex items-start gap-3 rounded-xl bg-white border border-cream-dark p-4">
                <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-green-islamic/10 mt-0.5">
                  <Check className="h-3 w-3 text-green-islamic" />
                </div>
                <p className="text-sm text-text-primary leading-relaxed">{p}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="arabesque-separator mx-auto max-w-lg" />

      {/* ═══ PROGRAMMES ═══ */}
      <section id="programmes" className="py-12 sm:py-16 scroll-mt-8">
        <div className="mx-auto max-w-3xl px-5">
          <h2 className="font-heading text-xl sm:text-2xl font-bold text-green-islamic text-center mb-2">
            Nos programmes développement personnel
          </h2>
          <p className="text-center text-sm text-text-secondary mb-8">
            Accès à vie dès l'achat — avance à ton rythme, sans pression
          </p>
          <div className="space-y-4">
            {programmes.map((prog) => (
              <div key={prog.slug} className="card-islamic p-5 sm:p-7 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    {prog.badge && (
                      <span className="inline-block mb-2 rounded-full bg-gold/10 border border-gold/30 px-2.5 py-0.5 text-xs font-semibold text-gold">
                        {prog.badge}
                      </span>
                    )}
                    <h3 className="font-heading text-base sm:text-lg font-bold text-text-primary">
                      {prog.title}
                    </h3>
                    <p className="mt-1 text-sm text-text-secondary">{prog.subtitle}</p>
                    <div className="mt-3 flex flex-wrap gap-3 text-xs text-text-secondary">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5 text-gold" />{prog.duration}
                      </span>
                      <span className="flex items-center gap-1">
                        <PlayCircle className="h-3.5 w-3.5 text-gold" />{prog.videosCount} vidéos
                      </span>
                      <span className="flex items-center gap-1">
                        <Infinity className="h-3.5 w-3.5 text-gold" />Accès à vie
                      </span>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="font-heading text-2xl font-bold text-gold">{prog.price}€</p>
                    <p className="text-xs text-text-secondary">accès à vie</p>
                  </div>
                </div>
                <div className="mt-5 pt-4 border-t border-cream-dark">
                  <Link
                    to={`/coaching/programmes/${prog.slug}`}
                    className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-gold px-6 py-3 text-sm font-bold text-white hover:opacity-90 transition"
                  >
                    Voir le programme <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="arabesque-separator mx-auto max-w-lg" />

      {/* ═══ APPROCHE ═══ */}
      <section className="py-12 sm:py-16 bg-white/50">
        <div className="mx-auto max-w-2xl px-5 text-center">
          <h2 className="font-heading text-xl font-bold text-green-islamic mb-4">
            Une approche enracinée dans la tradition islamique
          </h2>
          <p className="text-sm text-text-secondary leading-relaxed mb-4">
            Le développement personnel islamique ne se résume pas à se sentir bien — il s'agit
            de purifier le cœur, d'aligner ses actions avec ses valeurs, et de se rapprocher d'Allah.
          </p>
          <p className="text-sm text-text-secondary leading-relaxed">
            Nos programmes intègrent la notion de tazkiya an-nafs (purification de l'âme),
            le tawakkul (confiance en Allah), et des outils pratiques pour progresser
            de manière concrète et durable — sans jamais perdre de vue l'essentiel.
          </p>
        </div>
      </section>

      <div className="arabesque-separator mx-auto max-w-lg" />

      {/* ═══ CTA SÉANCE ═══ */}
      <section className="py-12 sm:py-16">
        <div className="mx-auto max-w-2xl px-5">
          <div className="rounded-2xl bg-white border-2 border-gold/20 p-8 text-center">
            <h2 className="font-heading text-xl font-bold text-green-islamic mb-3">
              Tu préfères un accompagnement sur mesure ?
            </h2>
            <p className="text-sm text-text-secondary mb-6 leading-relaxed">
              Une séance individuelle en visioconférence — 1h pour travailler sur ta situation spécifique avec un accompagnement personnalisé.
            </p>
            <Link
              to="/coaching/reserver?type=individuel"
              className="inline-flex items-center gap-2 rounded-xl bg-gold px-8 py-4 font-bold text-white text-base hover:opacity-90 transition"
            >
              Réserver une séance individuelle <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
