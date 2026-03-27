import { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Heart, Play, ChevronDown, BookOpen, Shield, Moon, Sun } from 'lucide-react';
import { sampleDouas } from '../data/douas';
import type { Dua } from '../data/douas';
import SEO from '../components/SEO';

const categories = [
  { key: 'daily', icon: Shield, label: 'Protection quotidienne', count: 0, color: 'text-green-islamic', bg: 'bg-green-islamic/10' },
  { key: 'healing', icon: BookOpen, label: 'Guérison (Roqya)', count: 0, color: 'text-gold', bg: 'bg-gold/10' },
  { key: 'sleep', icon: Moon, label: 'Avant de dormir', count: 0, color: 'text-indigo-600', bg: 'bg-indigo-50' },
  { key: 'morning', icon: Sun, label: 'Matin & Soir', count: 0, color: 'text-amber-600', bg: 'bg-amber-50' },
] as const;

// Count douas per category
categories.forEach((cat) => {
  (cat as { count: number }).count = sampleDouas.filter((d) => d.categorie === cat.key).length;
});

export default function Douas() {
  const { t } = useTranslation();
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [expandedDua, setExpandedDua] = useState<Set<string>>(new Set());
  const sectionRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const toggleFavorite = (id: string) => {
    setFavorites((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleExpand = (id: string) => {
    setExpandedDua((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const expandAll = () => {
    setExpandedDua(new Set(sampleDouas.map((d) => d.id)));
  };

  const collapseAll = () => {
    setExpandedDua(new Set());
  };

  const scrollToSection = (key: string) => {
    sectionRefs.current[key]?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const groupedDouas = categories.map((cat) => ({
    ...cat,
    douas: sampleDouas.filter((d) => d.categorie === cat.key),
  }));

  return (
    <div className="min-h-screen bg-cream">
      <SEO
        title="Douas & Invocations de Roqya - Protection et Guerison"
        description="Bibliotheque complete de douas et invocations de roqya pour la protection et la guerison. Texte arabe, translitteration et traduction francaise."
        keywords="douas roqya, invocations protection islam, adhkar matin soir, ayat al kursi, sourate al fatiha guerison, douas protection mauvais oeil"
        url="/douas"
      />
      {/* Hero */}
      <div className="bg-gradient-to-b from-cream-dark/50 to-cream px-4 py-12 text-center sm:py-16">
        <h1 className="font-heading text-3xl font-bold text-green-islamic sm:text-4xl lg:text-5xl">
          {t('douas.title')}
        </h1>
        <p className="mx-auto mt-3 max-w-2xl text-text-secondary">{t('douas.subtitle')}</p>
        <p className="mt-2 text-sm text-text-secondary/70">
          {sampleDouas.length} invocations issues du Coran et de la Sunnah authentique
        </p>
      </div>

      <div className="mx-auto max-w-4xl px-4 pb-16">
        {/* ═══ SOMMAIRE ═══ */}
        <div className="mb-10 rounded-2xl border border-cream-dark bg-white/60 p-6 shadow-sm">
          <h2 className="mb-4 flex items-center gap-2 font-heading text-lg font-semibold text-green-islamic">
            <BookOpen size={20} />
            Sommaire
          </h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {categories.map((cat) => {
              const Icon = cat.icon;
              return (
                <button
                  key={cat.key}
                  onClick={() => scrollToSection(cat.key)}
                  className={`flex items-center gap-3 rounded-xl ${cat.bg} px-4 py-3 text-left transition-all hover:scale-[1.02] hover:shadow-sm`}
                >
                  <div className={`rounded-lg bg-white p-2 ${cat.color}`}>
                    <Icon size={20} />
                  </div>
                  <div>
                    <p className={`font-semibold ${cat.color}`}>{cat.label}</p>
                    <p className="text-xs text-text-secondary">{cat.count} invocation{cat.count > 1 ? 's' : ''}</p>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Expand / Collapse all */}
          <div className="mt-4 flex justify-center gap-4 border-t border-cream-dark pt-4">
            <button
              onClick={expandAll}
              className="text-sm font-medium text-green-islamic hover:underline"
            >
              Tout déplier
            </button>
            <span className="text-cream-dark">|</span>
            <button
              onClick={collapseAll}
              className="text-sm font-medium text-text-secondary hover:underline"
            >
              Tout replier
            </button>
          </div>
        </div>

        {/* ═══ SECTIONS PAR CATÉGORIE ═══ */}
        {groupedDouas.map((group) => {
          const Icon = group.icon;
          return (
            <div
              key={group.key}
              ref={(el) => { sectionRefs.current[group.key] = el; }}
              className="mb-10 scroll-mt-24"
            >
              {/* Section header */}
              <div className={`mb-4 flex items-center gap-3 rounded-xl ${group.bg} px-5 py-3`}>
                <Icon size={22} className={group.color} />
                <h2 className={`font-heading text-xl font-bold ${group.color}`}>
                  {group.label}
                </h2>
                <span className="ml-auto rounded-full bg-white px-3 py-0.5 text-xs font-medium text-text-secondary">
                  {group.douas.length} dua{group.douas.length > 1 ? 's' : ''}
                </span>
              </div>

              {/* Accordion list */}
              <div className="space-y-3">
                {group.douas.map((dua) => {
                  const isOpen = expandedDua.has(dua.id);
                  return (
                    <div
                      key={dua.id}
                      className={`overflow-hidden rounded-2xl border transition-all ${
                        isOpen
                          ? 'border-green-islamic/30 bg-white shadow-md'
                          : 'border-cream-dark bg-white/70 hover:border-green-islamic/20 hover:shadow-sm'
                      }`}
                    >
                      {/* Accordion header */}
                      <button
                        onClick={() => toggleExpand(dua.id)}
                        className="flex w-full items-center gap-3 px-5 py-4 text-left"
                      >
                        <ChevronDown
                          size={18}
                          className={`shrink-0 text-green-islamic transition-transform duration-300 ${
                            isOpen ? 'rotate-180' : ''
                          }`}
                        />
                        <div className="min-w-0 flex-1">
                          <h3 className="font-heading text-base font-semibold text-text-primary sm:text-lg">
                            {dua.titre}
                          </h3>
                          {!isOpen && (
                            <p className="mt-0.5 truncate text-sm text-text-secondary/70">
                              {dua.traduction.substring(0, 80)}...
                            </p>
                          )}
                        </div>
                        <div className="flex shrink-0 items-center gap-2">
                          {dua.audio_url && (
                            <span className="rounded-full bg-green-islamic/10 p-1.5">
                              <Play size={14} className="text-green-islamic" />
                            </span>
                          )}
                          <button
                            onClick={(e) => { e.stopPropagation(); toggleFavorite(dua.id); }}
                            className="rounded-full p-1.5 transition-colors hover:bg-cream-dark"
                          >
                            <Heart
                              size={16}
                              className={favorites.has(dua.id) ? 'fill-red-400 text-red-400' : 'text-text-secondary/50'}
                            />
                          </button>
                        </div>
                      </button>

                      {/* Accordion body */}
                      {isOpen && (
                        <div className="border-t border-cream-dark px-5 pb-5 pt-4">
                          {/* Arabic text */}
                          <div className="mb-5 rounded-xl bg-cream/80 p-5 text-center">
                            <p className="text-arabic text-2xl leading-[2.2] text-green-islamic sm:text-3xl">
                              {dua.texte_arabe}
                            </p>
                          </div>

                          {/* Transliteration */}
                          <div className="mb-4">
                            <p className="mb-1.5 text-xs font-bold uppercase tracking-widest text-green-islamic/60">
                              Translittération
                            </p>
                            <p className="leading-relaxed italic text-text-primary">
                              {dua.transliteration}
                            </p>
                          </div>

                          {/* Translation */}
                          <div className="mb-4">
                            <p className="mb-1.5 text-xs font-bold uppercase tracking-widest text-green-islamic/60">
                              Traduction
                            </p>
                            <p className="leading-relaxed text-text-secondary">
                              {dua.traduction}
                            </p>
                          </div>

                          {/* Source */}
                          <div className="mb-4 flex items-start gap-2 rounded-lg bg-gold/5 px-4 py-3">
                            <BookOpen size={16} className="mt-0.5 shrink-0 text-gold" />
                            <div>
                              <p className="text-xs font-bold uppercase tracking-widest text-gold/70">
                                Source
                              </p>
                              <p className="mt-0.5 text-sm font-medium text-text-primary">
                                {dua.source}
                              </p>
                            </div>
                          </div>

                          {/* Bienfaits */}
                          <div className="rounded-lg bg-green-islamic/5 px-4 py-3">
                            <p className="text-xs font-bold uppercase tracking-widest text-green-islamic/60">
                              Bienfaits & vertus
                            </p>
                            <p className="mt-1.5 text-sm leading-relaxed text-text-secondary">
                              {dua.bienfaits}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}

        {/* Disclaimer */}
        <div className="mt-8 rounded-xl bg-cream-dark/50 px-6 py-4 text-center">
          <p className="text-sm text-text-secondary">
            Ces invocations sont tirées du Coran et de la Sunnah authentique.
            N'hésitez pas à utiliser tous les moyens qu'Allah a mis à votre disposition.
            Qu'Allah vous accorde la guérison.
          </p>
        </div>
      </div>
    </div>
  );
}
