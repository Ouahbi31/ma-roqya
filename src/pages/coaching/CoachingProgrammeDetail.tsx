import { useState } from 'react';
import { useParams, Link, useSearchParams } from 'react-router-dom';
import {
  Heart,
  Star,
  Shield,
  Users,
  Zap,
  Check,
  ChevronDown,
  ChevronUp,
  Clock,
  PlayCircle,
  Timer,
  Infinity,
  ArrowLeft,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';
import SEO from '../../components/SEO';
import { coachingProgrammes } from '../../data/coachingProgrammes';
import { useAuthStore } from '../../store/authStore';
import type { LucideIcon } from 'lucide-react';

const iconMap: Record<string, LucideIcon> = {
  Heart,
  Star,
  Shield,
  Users,
  Zap,
};

export default function CoachingProgrammeDetail() {
  const { slug } = useParams<{ slug: string }>();
  const [searchParams] = useSearchParams();
  const { user, profile } = useAuthStore();

  const prog = coachingProgrammes.find((p) => p.slug === slug);

  const [openModules, setOpenModules] = useState<Set<number>>(new Set([0]));
  const [buying, setBuying] = useState(false);
  const [buyError, setBuyError] = useState<string | null>(null);

  const isSuccess = searchParams.get('success') === '1';

  if (!prog) {
    return (
      <div className="min-h-screen bg-cream flex flex-col items-center justify-center gap-4 px-5">
        <p className="font-heading text-xl font-bold text-text-primary">Programme introuvable</p>
        <Link
          to="/coaching/programmes"
          className="inline-flex items-center gap-2 text-sm text-gold hover:underline"
        >
          <ArrowLeft className="h-4 w-4" />
          Retour aux programmes
        </Link>
      </div>
    );
  }

  const Icon = iconMap[prog.icon] ?? Star;

  const toggleModule = (idx: number) => {
    setOpenModules((prev) => {
      const next = new Set(prev);
      if (next.has(idx)) next.delete(idx);
      else next.add(idx);
      return next;
    });
  };

  const handleBuy = async () => {
    if (!user) {
      window.location.href = `/login?redirect=/coaching/programmes/${prog.slug}`;
      return;
    }
    setBuying(true);
    setBuyError(null);
    try {
      const res = await fetch('/api/create-coaching-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          slug: prog.slug,
          price: prog.price,
          title: prog.title,
          email: user.email,
          userId: user.id,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.url) {
        setBuyError(data.error || 'Une erreur est survenue. Veuillez réessayer.');
        return;
      }
      window.location.href = data.url;
    } catch {
      setBuyError('Une erreur réseau est survenue. Veuillez réessayer.');
    } finally {
      setBuying(false);
    }
  };

  const hasPurchased =
    isSuccess ||
    (profile as unknown as { purchases?: string[] })?.purchases?.includes(prog.slug);

  return (
    <div className="min-h-screen bg-cream pb-24 md:pb-0">
      <SEO
        title={`${prog.title} — CoachMyNefs`}
        description={prog.description}
        keywords={`programme coaching, ${prog.title.toLowerCase()}, formation islamique`}
        url={`/coaching/programmes/${prog.slug}`}
      />

      {/* Fil d'Ariane */}
      <div className="mx-auto max-w-4xl px-5 sm:px-4 pt-6">
        <Link
          to="/coaching/programmes"
          className="inline-flex items-center gap-1.5 text-sm text-text-secondary hover:text-gold transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Tous les programmes
        </Link>
      </div>

      {/* ─── HERO ─── */}
      <section className="relative overflow-hidden py-10 sm:py-14 md:py-16">
        <div className="islamic-pattern-bg absolute inset-0 z-0 opacity-40" />
        <div className="relative z-10 mx-auto max-w-4xl px-5 sm:px-4">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
            <div className="flex-1">
              {/* Badge */}
              {prog.badge && (
                <span className="inline-block mb-3 rounded-full bg-gold/10 border border-gold/30 px-3 py-1 text-xs font-semibold text-gold">
                  {prog.badge}
                </span>
              )}

              {/* Icône + Titre */}
              <div className="flex items-center gap-3 mb-3">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white shadow-sm">
                  <Icon className={`h-6 w-6 ${prog.color}`} />
                </div>
                <h1 className="font-heading text-2xl sm:text-3xl md:text-4xl font-bold text-text-primary leading-tight">
                  {prog.title}
                </h1>
              </div>

              <p className="text-base sm:text-lg text-text-secondary leading-relaxed max-w-2xl">
                {prog.subtitle}
              </p>

              {/* Infos rapides */}
              <div className="mt-5 flex flex-wrap gap-4 text-sm text-text-secondary">
                <span className="flex items-center gap-1.5">
                  <Clock className="h-4 w-4 text-gold" />
                  {prog.duration}
                </span>
                <span className="flex items-center gap-1.5">
                  <PlayCircle className="h-4 w-4 text-gold" />
                  {prog.videosCount} vidéos
                </span>
                <span className="flex items-center gap-1.5">
                  <Timer className="h-4 w-4 text-gold" />
                  {prog.totalHours} de contenu
                </span>
                <span className="flex items-center gap-1.5">
                  <Infinity className="h-4 w-4 text-gold" />
                  Accès à vie
                </span>
              </div>
            </div>

            {/* CTA desktop */}
            <div className="hidden md:flex flex-col items-center gap-3 bg-white rounded-2xl shadow-md p-6 min-w-[220px]">
              <span className="font-heading text-4xl font-bold text-gold">{prog.price}€</span>
              <span className="text-xs text-text-secondary">Paiement unique — accès à vie</span>
              {prog.comingSoon ? (
                <div className="w-full text-center rounded-xl bg-gray-200 text-gray-500 px-5 py-3 text-sm font-semibold cursor-not-allowed">
                  🕐 Bientôt disponible
                </div>
              ) : hasPurchased ? (
                <div className="w-full text-center rounded-xl bg-green-islamic px-5 py-3 text-sm font-semibold text-white">
                  Accéder au programme
                </div>
              ) : (
                <button
                  onClick={handleBuy}
                  disabled={buying}
                  className="w-full rounded-xl bg-gold px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {buying ? 'Redirection…' : 'Commencer ce programme'}
                </button>
              )}
              {!prog.comingSoon && buyError && (
                <p className="text-xs text-red-500 flex items-start gap-1.5 mt-1">
                  <AlertCircle className="h-3.5 w-3.5 shrink-0 mt-0.5" />
                  {buyError}
                </p>
              )}
              {!prog.comingSoon && isSuccess && (
                <p className="text-xs text-green-islamic flex items-center gap-1.5">
                  <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />
                  Paiement confirmé !
                </p>
              )}
            </div>
          </div>
        </div>
      </section>

      <div className="arabesque-separator mx-auto max-w-lg" />

      {/* ─── CONTENU ─── */}
      <div className="mx-auto max-w-4xl px-5 sm:px-4 py-10 sm:py-14 space-y-12">

        {/* Description */}
        <section>
          <p className="text-base sm:text-lg text-text-secondary leading-relaxed">
            {prog.description}
          </p>
        </section>

        {/* Ce que vous allez apprendre */}
        <section>
          <h2 className="font-heading text-xl sm:text-2xl font-bold text-green-islamic mb-5">
            Ce que vous allez apprendre
          </h2>
          <div className="grid sm:grid-cols-2 gap-3">
            {prog.whatYouLearn.map((item) => (
              <div key={item} className="flex items-start gap-3">
                <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-gold/10 mt-0.5">
                  <Check className="h-3 w-3 text-gold" />
                </div>
                <p className="text-sm text-text-primary leading-relaxed">{item}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Contenu du programme (accordion) */}
        <section>
          <h2 className="font-heading text-xl sm:text-2xl font-bold text-green-islamic mb-5">
            Contenu du programme
          </h2>
          <div className="space-y-3">
            {prog.modules.map((mod, idx) => {
              const isOpen = openModules.has(idx);
              return (
                <div key={idx} className="card-islamic overflow-hidden">
                  <button
                    onClick={() => toggleModule(idx)}
                    className="w-full flex items-center justify-between p-4 sm:p-5 text-start"
                  >
                    <span className="font-heading font-bold text-sm sm:text-base text-text-primary">
                      {mod.title}
                    </span>
                    <span className="flex items-center gap-2 text-xs text-text-secondary shrink-0 ml-3">
                      <span>{mod.lessons.length} leçons</span>
                      {isOpen ? (
                        <ChevronUp className="h-4 w-4" />
                      ) : (
                        <ChevronDown className="h-4 w-4" />
                      )}
                    </span>
                  </button>
                  {isOpen && (
                    <div className="border-t border-cream-dark">
                      {mod.lessons.map((lesson, li) => (
                        <div
                          key={li}
                          className="flex items-center gap-3 px-4 sm:px-5 py-3 border-b border-cream-dark/50 last:border-0"
                        >
                          <PlayCircle className="h-4 w-4 shrink-0 text-gold/60" />
                          <span className="text-sm text-text-primary">{lesson}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* Pour qui ? */}
        <section className="card-islamic p-6 sm:p-8">
          <div className="flex items-start gap-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gold/10">
              <Users className="h-5 w-5 text-gold" />
            </div>
            <div>
              <h2 className="font-heading text-lg font-bold text-green-islamic mb-2">
                Pour qui est ce programme ?
              </h2>
              <p className="text-sm sm:text-base text-text-secondary leading-relaxed">
                {prog.forWho}
              </p>
            </div>
          </div>
        </section>

        {/* Infos pratiques */}
        <section>
          <h2 className="font-heading text-xl sm:text-2xl font-bold text-green-islamic mb-5">
            Infos pratiques
          </h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {[
              { icon: Clock, label: 'Durée', value: prog.duration },
              { icon: PlayCircle, label: 'Vidéos', value: `${prog.videosCount} vidéos` },
              { icon: Timer, label: 'Temps total', value: prog.totalHours },
              { icon: Infinity, label: 'Accès', value: 'À vie, sur tous vos appareils' },
            ].map(({ icon: ItemIcon, label, value }) => (
              <div key={label} className="flex items-center gap-3 card-islamic p-4">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gold/10">
                  <ItemIcon className="h-4.5 w-4.5 text-gold" />
                </div>
                <div>
                  <p className="text-xs text-text-secondary">{label}</p>
                  <p className="text-sm font-semibold text-text-primary">{value}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CTA final */}
        <section className="card-islamic p-6 sm:p-8 text-center border-2 border-gold/20">
          <span className="font-heading text-4xl font-bold text-gold block mb-1">
            {prog.price}€
          </span>
          <p className="text-sm text-text-secondary mb-5">Paiement unique — accès à vie</p>

          {prog.comingSoon ? (
            <div className="inline-block rounded-xl bg-gray-200 text-gray-500 px-10 py-4 font-semibold text-base cursor-not-allowed">
              🕐 Bientôt disponible
            </div>
          ) : hasPurchased ? (
            <div className="inline-block rounded-xl bg-green-islamic px-8 py-3.5 text-base font-semibold text-white">
              Accéder au programme
            </div>
          ) : (
            <button
              onClick={handleBuy}
              disabled={buying}
              className="inline-block rounded-xl bg-gold px-10 py-4 font-semibold text-white text-base transition hover:opacity-90 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {buying ? 'Redirection vers le paiement…' : 'Commencer ce programme'}
            </button>
          )}

          {!prog.comingSoon && buyError && (
            <p className="mt-3 text-sm text-red-500 flex items-center justify-center gap-1.5">
              <AlertCircle className="h-4 w-4 shrink-0" />
              {buyError}
            </p>
          )}
          {!prog.comingSoon && isSuccess && (
            <p className="mt-3 text-sm text-green-islamic flex items-center justify-center gap-1.5 font-medium">
              <CheckCircle2 className="h-4 w-4 shrink-0" />
              Paiement confirmé — bienvenue dans le programme !
            </p>
          )}

          {!prog.comingSoon && (
            <p className="mt-4 text-xs text-text-secondary">
              Paiement sécurisé par Stripe · Satisfait ou remboursé 7 jours
            </p>
          )}
        </section>
      </div>

      {/* CTA sticky mobile */}
      <div className="fixed bottom-0 inset-x-0 z-50 md:hidden bg-white border-t border-gray-200 p-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))]">
        <div className="flex items-center justify-between gap-3 max-w-md mx-auto">
          <span className="font-heading text-2xl font-bold text-gold">{prog.price}€</span>
          {prog.comingSoon ? (
            <div className="flex-1 text-center rounded-xl bg-gray-200 text-gray-500 px-4 py-3 text-sm font-semibold cursor-not-allowed">
              🕐 Bientôt disponible
            </div>
          ) : hasPurchased ? (
            <div className="flex-1 text-center rounded-xl bg-green-islamic px-4 py-3 text-sm font-semibold text-white">
              Accéder au programme
            </div>
          ) : (
            <button
              onClick={handleBuy}
              disabled={buying}
              className="flex-1 rounded-xl bg-gold px-4 py-3 text-sm font-semibold text-white transition hover:opacity-90 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {buying ? 'Redirection…' : 'Commencer ce programme'}
            </button>
          )}
        </div>
        {!prog.comingSoon && buyError && (
          <p className="mt-1 text-xs text-red-500 text-center">{buyError}</p>
        )}
      </div>
    </div>
  );
}
