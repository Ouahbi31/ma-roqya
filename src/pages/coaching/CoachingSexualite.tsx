import { Link } from 'react-router-dom';
import { ArrowRight, Check, PlayCircle, Clock, Infinity, Heart, Shield, Sun } from 'lucide-react';
import SEO from '../../components/SEO';
import { coachingProgrammes } from '../../data/coachingProgrammes';

const prog = coachingProgrammes.find(p => p.slug === 'sexualite-islam')!;

const defis = [
  {
    icon: Shield,
    titre: 'La honte et le silence',
    desc: 'On t\'a jamais appris à en parler. Résultat : tu portes des questions seul(e), sans réponses, avec la culpabilité en plus.',
  },
  {
    icon: Heart,
    titre: 'La frustration qui pèse',
    desc: 'Célibataire ou marié(e), le désir est là mais tu ne sais pas comment le gérer dans le respect de ta foi.',
  },
  {
    icon: Sun,
    titre: 'L\'épanouissement qui manque',
    desc: 'Dans le mariage, l\'intimité est maladroite, silencieuse ou absente. Tu veux que ça change mais tu ne sais pas par où commencer.',
  },
];

const promesses = [
  "Comprendre ce que l'Islam dit vraiment sur la sexualité",
  'Dépasser la honte et les blocages liés à ton éducation',
  'Gérer la frustration avec les outils islamiques',
  'Construire une intimité épanouie dans le mariage',
  'Communiquer avec ton conjoint sur l\'intimité',
  'Appliquer les enseignements de la Sunna sur l\'intimité conjugale',
  'Garder tes limites dans le célibat sans te faire violence',
  'Passer du refoulement à un épanouissement sincère et halal',
];

const etapes = [
  {
    num: '01',
    titre: 'Comprendre',
    desc: 'Le désir, la honte apprise, le vrai regard de l\'Islam — sans tabou et sans exagération.',
  },
  {
    num: '02',
    titre: 'Le célibat et l\'attente',
    desc: 'Les outils concrets pour gérer la frustration et garder ses limites avec sérénité.',
  },
  {
    num: '03',
    titre: 'S\'épanouir dans le halal',
    desc: 'Droits, devoirs, communication intime — construire une vie conjugale saine et bénie.',
  },
];

export default function CoachingSexualite() {
  return (
    <div className="min-h-screen bg-cream">
      <SEO
        title="Sexualité en Islam — De la frustration à l'épanouissement | CoachMyNefs"
        description="La sexualité est une grâce d'Allah. Ce programme t'aide à dépasser la frustration, la honte et les blocages pour t'épanouir dans le halal — avec clarté et bienveillance."
        keywords="sexualité islam, frustration islam, intimité mariage islam, halal, désir islam, épanouissement conjugal"
        url="/coaching/sexualite"
      />

      {/* ═══ HERO ═══ */}
      <section className="relative overflow-hidden py-16 sm:py-24">
        <div className="islamic-pattern-bg absolute inset-0 z-0 opacity-40" />
        <div className="relative z-10 mx-auto max-w-2xl px-5 text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-gold/15 px-4 py-1.5 text-sm font-semibold text-gold mb-6">
            🌹 Sexualité en Islam
          </div>
          <h1 className="font-heading text-3xl sm:text-5xl font-bold text-text-primary leading-tight">
            De la frustration à l'épanouissement
          </h1>
          <p className="mt-5 text-base sm:text-lg text-text-secondary leading-relaxed max-w-xl mx-auto">
            La sexualité est une grâce d'Allah — mais personne ne nous a appris à en parler.
            Ce programme aborde le sujet avec clarté, bienveillance et les enseignements de l'Islam.
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
            Tu n'es pas seul(e) — et ce n'est pas une fatalité
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
            Une approche islamique, claire et sans jugement
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
            Le programme en 3 parties
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
                {prog.whatYouLearn.slice(0, 6).map((item) => (
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
                  Accéder au programme <ArrowRight className="h-4 w-4" />
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
            Une approche islamique, sans tabou ni débauche
          </h2>
          <p className="text-sm text-text-secondary leading-relaxed mb-4">
            Ce programme ne tombe ni dans le silence honteux ni dans l'excès. Il s'appuie sur
            le Coran, la Sunnah et les enseignements des savants pour aborder la sexualité
            telle qu'elle est : une grâce d'Allah, encadrée par Sa sagesse.
          </p>
          <p className="text-sm text-text-secondary leading-relaxed">
            L'objectif est simple : que tu passes de la confusion à la clarté, et de la frustration
            à un épanouissement sincère et halal.
          </p>
        </div>
      </section>

      <div className="arabesque-separator mx-auto max-w-lg" />

      {/* ═══ CTA SÉANCE ═══ */}
      <section className="py-12 sm:py-16">
        <div className="mx-auto max-w-2xl px-5">
          <div className="rounded-2xl bg-white border-2 border-gold/20 p-8 text-center">
            <h2 className="font-heading text-xl font-bold text-green-islamic mb-3">
              Tu préfères en parler de façon confidentielle ?
            </h2>
            <p className="text-sm text-text-secondary mb-6 leading-relaxed">
              Une séance individuelle en visioconférence — un espace confidentiel et bienveillant
              pour aborder ta situation personnelle.
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
