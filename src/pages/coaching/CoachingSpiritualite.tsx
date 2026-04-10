import { Link } from 'react-router-dom';
import { ArrowRight, Check, PlayCircle, Clock, Infinity, Sun, BookOpen, Star } from 'lucide-react';
import SEO from '../../components/SEO';
import { coachingProgrammes } from '../../data/coachingProgrammes';

const prog = coachingProgrammes.find(p => p.slug === 'transformation-nefs')!;

const defis = [
  {
    icon: Sun,
    titre: 'La prière est irrégulière',
    desc: 'Tu sais qu\'elle est obligatoire. Tu veux la faire. Mais quelque chose t\'empêche de t\'y tenir vraiment.',
  },
  {
    icon: BookOpen,
    titre: 'Tu te sens loin d\'Allah',
    desc: 'Un vide intérieur. Un sentiment que ta foi ne suffit plus à t\'ancrer. Tu cherches comment retrouver cette connexion.',
  },
  {
    icon: Star,
    titre: 'Les hauts et les bas de la foi',
    desc: 'Des moments de grande foi, puis de longs creux. Ce cycle d\'imân qui monte et descend sans que tu saches comment le stabiliser.',
  },
];

const promesses = [
  'Comprendre les mécanismes du cœur en Islam (ahwal al-qalb)',
  'Établir une pratique spirituelle régulière et authentique',
  'Surmonter la procrastination dans les adorations',
  'Nourrir ton imân de manière quotidienne et concrète',
  'Développer un rapport sincère et vivant avec le Coran',
  'Ancrer le dhikr et le souvenir d\'Allah dans ton quotidien',
];

const etapes = [
  {
    num: '01',
    titre: 'Comprendre ton cœur',
    desc: 'Identifier ce qui te bloque spirituellement. Comprendre la nature du cœur et de l\'imân.',
  },
  {
    num: '02',
    titre: 'Établir des bases solides',
    desc: 'Construire une pratique spirituelle régulière, pas à pas, avec des exercices quotidiens.',
  },
  {
    num: '03',
    titre: 'Transformer ton quotidien',
    desc: 'Faire d\'Allah le centre de ta vie — dans tes décisions, tes relations, ta façon d\'être.',
  },
];

export default function CoachingSpiritualite() {
  return (
    <div className="min-h-screen bg-cream">
      <SEO
        title="Transformation spirituelle islamique — Se rapprocher d'Allah | CoachMyNefs"
        description="Tu veux te rapprocher d'Allah mais tu n'y arrives pas ? Découvre notre programme de transformation spirituelle pour renforcer ton imân et vivre pleinement ta foi."
        keywords="spiritualité islam, imân, se rapprocher Allah, transformation islamique, tazkiya, dhikr, développement spirituel"
        url="/coaching/spiritualite"
      />

      {/* ═══ HERO ═══ */}
      <section className="relative overflow-hidden py-16 sm:py-24">
        <div className="islamic-pattern-bg absolute inset-0 z-0 opacity-40" />
        <div className="relative z-10 mx-auto max-w-2xl px-5 text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-gold/15 px-4 py-1.5 text-sm font-semibold text-gold mb-6">
            🌙 Transformation spirituelle
          </div>
          <h1 className="font-heading text-3xl sm:text-5xl font-bold text-text-primary leading-tight">
            Retrouver la paix intérieure et se rapprocher d'Allah
          </h1>
          <p className="mt-5 text-base sm:text-lg text-text-secondary leading-relaxed max-w-xl mx-auto">
            La foi n'est pas un état figé — elle grandit, elle fluctue, elle demande un travail sincère sur soi.
            Ce programme t'accompagne dans cette démarche intérieure avec sérieux et bienveillance.
          </p>

          <div className="mt-6 rounded-2xl bg-white/70 border border-gold/20 px-6 py-4 inline-block">
            <p className="text-arabic text-2xl sm:text-3xl text-gold leading-loose">
              أَلَا بِذِكْرِ اللَّهِ تَطْمَئِنُّ الْقُلُوبُ
            </p>
            <p className="mt-2 text-xs text-text-secondary italic">
              « C'est assurément par le rappel d'Allah que les cœurs se tranquillisent » — Sourate Ar-Ra'd, 13:28
            </p>
          </div>

          <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              to="#programme"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-gold px-8 py-4 font-bold text-white text-base hover:opacity-90 transition"
            >
              Voir le programme <ArrowRight className="h-5 w-5" />
            </Link>
            <a
              href="https://cal.com/coachmynefs/coaching-individuel"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-gold/40 px-8 py-4 font-semibold text-gold text-base hover:bg-gold/10 transition"
            >
              Réserver une séance
            </a>
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
            Ces difficultés sont partagées par beaucoup de croyants sincères — tu n'es pas seul(e)
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
            Une démarche spirituelle sérieuse, progressive et ancrée dans les sources
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

      {/* ═══ ÉTAPES ═══ */}
      <section className="py-12 sm:py-16">
        <div className="mx-auto max-w-4xl px-5">
          <h2 className="font-heading text-xl sm:text-2xl font-bold text-green-islamic text-center mb-10">
            Le chemin en 3 étapes
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

      {/* ═══ PROGRAMME ═══ */}
      <section id="programme" className="py-12 sm:py-16 scroll-mt-8">
        <div className="mx-auto max-w-2xl px-5">
          <h2 className="font-heading text-xl sm:text-2xl font-bold text-green-islamic text-center mb-8">
            Le programme
          </h2>
          {prog && (
            <div className="card-islamic p-6 sm:p-8 border-2 border-gold/30">
              {prog.badge && (
                <span className="inline-block mb-3 rounded-full bg-gold/10 border border-gold/30 px-3 py-1 text-xs font-semibold text-gold">
                  {prog.badge}
                </span>
              )}
              <h3 className="font-heading text-xl font-bold text-text-primary mb-2">
                {prog.title}
              </h3>
              <p className="text-sm text-text-secondary mb-5 leading-relaxed">{prog.description}</p>

              <div className="flex flex-wrap gap-3 text-xs text-text-secondary mb-6">
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

              <div className="space-y-2 mb-6">
                {prog.whatYouLearn.slice(0, 5).map((item) => (
                  <div key={item} className="flex items-start gap-2 text-sm text-text-primary">
                    <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-green-islamic/10 mt-0.5">
                      <Check className="h-3 w-3 text-green-islamic" />
                    </div>
                    {item}
                  </div>
                ))}
              </div>

              <div className="border-t border-cream-dark pt-5 flex items-center justify-between">
                <div>
                  <p className="font-heading text-3xl font-bold text-gold">{prog.price}€</p>
                  <p className="text-xs text-text-secondary">accès à vie</p>
                </div>
                <Link
                  to={`/coaching/programmes/${prog.slug}`}
                  className="inline-flex items-center gap-2 rounded-xl bg-gold px-6 py-3 text-sm font-bold text-white hover:opacity-90 transition"
                >
                  Voir le programme <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          )}
        </div>
      </section>

      <div className="arabesque-separator mx-auto max-w-lg" />

      {/* ═══ APPROCHE ═══ */}
      <section className="py-12 sm:py-16 bg-white/50">
        <div className="mx-auto max-w-2xl px-5 text-center">
          <h2 className="font-heading text-xl font-bold text-green-islamic mb-4">
            Une démarche sérieuse et bienveillante
          </h2>
          <p className="text-sm text-text-secondary leading-relaxed mb-4">
            Ce programme n'est pas une liste de bonnes résolutions ou une promesse de transformation facile.
            C'est un accompagnement structuré, ancré dans le Coran et la Sunnah, qui demande
            un engagement sincère de ta part.
          </p>
          <p className="text-sm text-text-secondary leading-relaxed">
            Le chemin vers Allah est une démarche de toute une vie. Ce programme te donne les outils
            pour avancer — avec sérieux, avec constance, et avec la miséricorde d'Allah comme horizon.
          </p>
        </div>
      </section>

      <div className="arabesque-separator mx-auto max-w-lg" />

      {/* ═══ CTA SÉANCE ═══ */}
      <section className="py-12 sm:py-16">
        <div className="mx-auto max-w-2xl px-5">
          <div className="rounded-2xl bg-white border-2 border-gold/20 p-8 text-center">
            <h2 className="font-heading text-xl font-bold text-green-islamic mb-3">
              Tu préfères un accompagnement individuel ?
            </h2>
            <p className="text-sm text-text-secondary mb-6 leading-relaxed">
              Une séance individuelle en visioconférence — 1h pour travailler sur ta spiritualité avec un accompagnement personnalisé et bienveillant.
            </p>
            <a
              href="https://cal.com/coachmynefs/coaching-individuel"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-xl bg-gold px-8 py-4 font-bold text-white text-base hover:opacity-90 transition"
            >
              Réserver une séance <ArrowRight className="h-5 w-5" />
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
