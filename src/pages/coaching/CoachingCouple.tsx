import { Link } from 'react-router-dom';
import { ArrowRight, Check, PlayCircle, Clock, Infinity, Heart, MessageCircle, Shield } from 'lucide-react';
import SEO from '../../components/SEO';
import { coachingProgrammes } from '../../data/coachingProgrammes';

const slugsCouple = ['gestion-conflits', 'preparer-mariage'];
const programmes = coachingProgrammes.filter(p => slugsCouple.includes(p.slug));

const defis = [
  {
    icon: MessageCircle,
    titre: 'Les mots blessent plus qu\'ils ne rapprochent',
    desc: 'Les disputes tournent en rond. On se dit des choses qu\'on regrette. La communication s\'est perdue.',
  },
  {
    icon: Heart,
    titre: 'La distance s\'est installée',
    desc: 'Vous vivez sous le même toit mais vous vous sentez loin l\'un de l\'autre. L\'intimité et la tendresse manquent.',
  },
  {
    icon: Shield,
    titre: 'Vous aimez toujours — mais vous ne savez plus comment avancer',
    desc: 'Le couple est toujours là, mais quelque chose s\'est cassé. Vous voulez réparer sans savoir par où commencer.',
  },
];

const promesses = [
  'Comprendre les dynamiques de communication dans le couple islamique',
  'Désamorcer les conflits avant qu\'ils ne s\'enveniment',
  'Retrouver la tendresse et le respect mutuel (mawadda wa rahma)',
  'Construire des rituels de couple ancrés dans votre foi',
  'Apprendre à exprimer vos besoins sans blesser',
  'Transformer les désaccords en opportunités de rapprochement',
];

const valeurs = [
  { ar: 'مَوَدَّة', fr: 'Affection', desc: 'L\'amour sincère comme fondation du foyer' },
  { ar: 'رَحْمَة', fr: 'Miséricorde', desc: 'La douceur et la bienveillance dans chaque échange' },
  { ar: 'سَكَن', fr: 'Sérénité', desc: 'Votre foyer comme lieu de paix et de repos' },
];

export default function CoachingCouple() {
  return (
    <div className="min-h-screen bg-cream">
      <SEO
        title="Coaching couple islamique — Communication & harmonie | CoachMyNefs"
        description="Votre couple traverse une période difficile ? Retrouvez la communication, le respect et l'harmonie grâce à nos programmes de coaching ancré dans les valeurs de l'Islam."
        keywords="coaching couple musulman, programme couple islam, communication couple, conflits couple, mawadda rahma"
        url="/coaching/couple"
      />

      {/* ═══ HERO ═══ */}
      <section className="relative overflow-hidden py-16 sm:py-24">
        <div className="islamic-pattern-bg absolute inset-0 z-0 opacity-40" />
        <div className="relative z-10 mx-auto max-w-2xl px-5 text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-gold/15 px-4 py-1.5 text-sm font-semibold text-gold mb-6">
            👫 Coaching couple islamique
          </div>
          <h1 className="font-heading text-3xl sm:text-5xl font-bold text-text-primary leading-tight">
            Reconstruire l'harmonie dans votre couple
          </h1>
          <p className="mt-5 text-base sm:text-lg text-text-secondary leading-relaxed max-w-xl mx-auto">
            L'Islam a posé des fondements magnifiques pour le couple : mawadda, rahma, sakan.
            Nos programmes vous aident à retrouver ces piliers lorsque la vie les a ébranlés.
          </p>

          <div className="mt-6 rounded-2xl bg-white/70 border border-gold/20 px-6 py-4 inline-block">
            <p className="text-arabic text-2xl sm:text-3xl text-gold leading-loose">
              وَمِنْ آيَاتِهِ أَنْ خَلَقَ لَكُم مِّنْ أَنفُسِكُمْ أَزْوَاجًا لِّتَسْكُنُوا إِلَيْهَا
            </p>
            <p className="mt-2 text-xs text-text-secondary italic">
              « Parmi Ses signes, Il vous a créé des épouses issues de vous-mêmes pour que vous trouviez la sérénité auprès d'elles » — Sourate Ar-Rûm, 30:21
            </p>
          </div>

          <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              to="#programmes"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-gold px-8 py-4 font-bold text-white text-base hover:opacity-90 transition"
            >
              Découvrir les programmes <ArrowRight className="h-5 w-5" />
            </Link>
            <a
              href="https://cal.com/coachmynefs/coaching-de-couple"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-gold/40 px-8 py-4 font-semibold text-gold text-base hover:bg-gold/10 transition"
            >
              Réserver une séance couple
            </a>
          </div>
        </div>
      </section>

      <div className="arabesque-separator mx-auto max-w-lg" />

      {/* ═══ VALEURS ISLAMIQUES ═══ */}
      <section className="py-12 sm:py-16">
        <div className="mx-auto max-w-4xl px-5">
          <h2 className="font-heading text-xl sm:text-2xl font-bold text-green-islamic text-center mb-2">
            Les trois piliers du couple en Islam
          </h2>
          <p className="text-center text-sm text-text-secondary mb-10">
            Ces concepts coraniques guident chacun de nos programmes
          </p>
          <div className="grid gap-5 sm:grid-cols-3">
            {valeurs.map((v) => (
              <div key={v.fr} className="card-islamic p-6 text-center">
                <p className="text-arabic text-3xl text-gold mb-3">{v.ar}</p>
                <h3 className="font-heading text-base font-bold text-text-primary mb-1">{v.fr}</h3>
                <p className="text-xs text-text-secondary leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="arabesque-separator mx-auto max-w-lg" />

      {/* ═══ DÉFIS ═══ */}
      <section className="py-12 sm:py-16">
        <div className="mx-auto max-w-4xl px-5">
          <h2 className="font-heading text-xl sm:text-2xl font-bold text-green-islamic text-center mb-2">
            Ces situations vous parlent ?
          </h2>
          <p className="text-center text-sm text-text-secondary mb-10">
            Ces difficultés sont normales — et elles peuvent être surmontées avec les bons outils.
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

      {/* ═══ CE QUE VOUS APPRENDREZ ═══ */}
      <section className="py-12 sm:py-16 bg-white/50">
        <div className="mx-auto max-w-3xl px-5">
          <h2 className="font-heading text-xl sm:text-2xl font-bold text-green-islamic text-center mb-2">
            Ce que vous allez développer
          </h2>
          <p className="text-center text-sm text-text-secondary mb-8">
            Des compétences concrètes, ancrées dans les valeurs islamiques
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
            Nos programmes couple
          </h2>
          <p className="text-center text-sm text-text-secondary mb-8">
            Accès à vie dès l'achat — commencez à votre rythme, depuis chez vous
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
            Une approche éthique et islamique
          </h2>
          <p className="text-sm text-text-secondary leading-relaxed mb-4">
            Nos programmes ne s'appuient pas sur des théories importées sans discernement.
            Ils intègrent les enseignements du Coran et de la Sunnah avec des outils pratiques
            de communication validés — pour vous aider à construire un couple sain, dans la dignité et le respect.
          </p>
          <p className="text-sm text-text-secondary leading-relaxed">
            L'objectif n'est pas la perfection, mais la progression — ensemble, avec la baraka d'Allah.
          </p>
        </div>
      </section>

      <div className="arabesque-separator mx-auto max-w-lg" />

      {/* ═══ CTA SÉANCE ═══ */}
      <section className="py-12 sm:py-16">
        <div className="mx-auto max-w-2xl px-5">
          <div className="rounded-2xl bg-white border-2 border-gold/20 p-8 text-center">
            <h2 className="font-heading text-xl font-bold text-green-islamic mb-3">
              Vous préférez un accompagnement personnalisé ?
            </h2>
            <p className="text-sm text-text-secondary mb-6 leading-relaxed">
              Une séance de coaching de couple en visioconférence — 1h pour travailler sur votre situation spécifique avec un accompagnement sur mesure.
            </p>
            <a
              href="https://cal.com/coachmynefs/coaching-de-couple"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-xl bg-gold px-8 py-4 font-bold text-white text-base hover:opacity-90 transition"
            >
              Réserver une séance couple <ArrowRight className="h-5 w-5" />
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
