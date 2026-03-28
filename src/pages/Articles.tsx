import { useState, useEffect, useMemo, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  Search,
  Clock,
  ChevronLeft,
  ChevronRight,
  Play,
  Mail,
  TrendingUp,
  ArrowRight,
} from 'lucide-react';
import {
  sampleArticles,
  categoryMeta,
  type Article,
  type ArticleCategory,
} from '../data/articles';
import { supabase } from '../lib/supabase';
import SEO from '../components/SEO';

// ---------------------------------------------------------------------------
// Category filter definition
// ---------------------------------------------------------------------------

type FilterKey = 'all' | ArticleCategory;

const filterTabs: { key: FilterKey; label: string }[] = [
  { key: 'all', label: 'Tous' },
  { key: 'ruqya', label: 'Roqya & Guérison' },
  { key: 'psycho-roqya', label: 'Psycho-Roqya' },
  { key: 'ayn', label: "Mauvais Œil ('Ayn)" },
  { key: 'sihr', label: 'Sorcellerie (Sihr)' },
  { key: 'mass', label: 'Possession (Mass)' },
  { key: 'prevention', label: 'Prévention & Protection' },
  { key: 'conseils', label: 'Conseils Pratiques' },
  { key: 'temoignages', label: 'Témoignages' },
];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

function CategoryBadge({ category }: { category: ArticleCategory }) {
  const meta = categoryMeta[category];
  return (
    <span
      className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${meta.bg} ${meta.color}`}
    >
      {meta.label}
    </span>
  );
}

function ArticleImage({
  article,
  className = '',
}: {
  article: Article;
  className?: string;
}) {
  if (article.imageUrl) {
    return (
      <div className={`${className} relative overflow-hidden`}>
        <img
          src={article.imageUrl}
          alt={article.title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
      </div>
    );
  }

  return (
    <div
      className={`${article.imageGradient} ${className} relative flex items-center justify-center overflow-hidden`}
    >
      <div className="absolute inset-0 opacity-10">
        <svg
          className="h-full w-full"
          viewBox="0 0 200 200"
          xmlns="http://www.w3.org/2000/svg"
        >
          <pattern
            id="geo"
            x="0"
            y="0"
            width="40"
            height="40"
            patternUnits="userSpaceOnUse"
          >
            <circle cx="20" cy="20" r="8" fill="none" stroke="white" strokeWidth="0.5" />
            <rect
              x="12"
              y="12"
              width="16"
              height="16"
              fill="none"
              stroke="white"
              strokeWidth="0.5"
              transform="rotate(45 20 20)"
            />
          </pattern>
          <rect width="200" height="200" fill="url(#geo)" />
        </svg>
      </div>
      <span className="relative font-heading text-lg font-bold text-white/80 select-none">
        MaRoqya
      </span>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

/** Full-width hero banner for the featured article */
function HeroBanner({ article }: { article: Article }) {
  return (
    <Link
      to={`/articles/${article.slug}`}
      className="group relative block overflow-hidden rounded-2xl"
    >
      <ArticleImage
        article={article}
        className="h-72 w-full sm:h-96 transition-transform duration-500 group-hover:scale-105"
      />
      {/* overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-10">
        <CategoryBadge category={article.category} />
        <h2 className="mt-3 font-heading text-2xl font-bold leading-tight text-white sm:text-4xl">
          {article.title}
        </h2>
        <p className="mt-2 line-clamp-2 max-w-2xl text-sm text-white/80 sm:text-base">
          {article.excerpt}
        </p>
        <div className="mt-4 flex items-center gap-4 text-xs text-white/70 sm:text-sm">
          <span>{article.author.name}</span>
          <span className="opacity-50">|</span>
          <span>{formatDate(article.date)}</span>
          <span className="opacity-50">|</span>
          <span className="flex items-center gap-1">
            <Clock size={14} /> {article.readTime} min
          </span>
        </div>
      </div>
    </Link>
  );
}

/** Large card used in the first row (2-column) */
function LargeCard({ article }: { article: Article }) {
  return (
    <Link
      to={`/articles/${article.slug}`}
      className="card-islamic group flex flex-col overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
    >
      <ArticleImage article={article} className="h-48 w-full sm:h-56" />
      <div className="flex flex-1 flex-col p-5">
        <CategoryBadge category={article.category} />
        <h3 className="mt-3 font-heading text-lg font-bold leading-snug text-text-primary group-hover:text-green-islamic sm:text-xl">
          {article.title}
        </h3>
        <p className="mt-2 line-clamp-2 flex-1 text-sm text-text-secondary">
          {article.excerpt}
        </p>
        <div className="mt-4 flex items-center gap-3 text-xs text-text-secondary">
          <div className="flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-green-islamic/10 text-[10px] font-bold text-green-islamic">
              {article.author.name.charAt(0)}
            </div>
            <span>{article.author.name}</span>
          </div>
          <span className="opacity-40">|</span>
          <span>{formatDate(article.date)}</span>
          <span className="opacity-40">|</span>
          <span className="flex items-center gap-1">
            <Clock size={12} /> {article.readTime} min
          </span>
        </div>
      </div>
    </Link>
  );
}

/** Smaller card for the 3-column grid */
function SmallCard({ article }: { article: Article }) {
  return (
    <Link
      to={`/articles/${article.slug}`}
      className="card-islamic group flex flex-col overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
    >
      <ArticleImage article={article} className="h-40 w-full" />
      <div className="flex flex-1 flex-col p-4">
        <CategoryBadge category={article.category} />
        <h3 className="mt-2 font-heading text-base font-bold leading-snug text-text-primary group-hover:text-green-islamic">
          {article.title}
        </h3>
        <p className="mt-1.5 line-clamp-2 flex-1 text-sm text-text-secondary">
          {article.excerpt}
        </p>
        <div className="mt-3 flex items-center gap-2 text-xs text-text-secondary">
          <span>{article.author.name}</span>
          <span className="opacity-40">|</span>
          <span className="flex items-center gap-1">
            <Clock size={12} /> {article.readTime} min
          </span>
        </div>
      </div>
    </Link>
  );
}

/** Sidebar: popular articles */
function PopularArticles({ articles }: { articles: Article[] }) {
  const popular = articles.slice(0, 5);
  return (
    <div className="card-islamic p-5">
      <h3 className="flex items-center gap-2 font-heading text-lg font-bold text-text-primary">
        <TrendingUp size={18} className="text-gold" />
        Articles populaires
      </h3>
      <div className="mt-4 space-y-4">
        {popular.map((a, i) => (
          <Link
            key={a.id}
            to={`/articles/${a.slug}`}
            className="group flex gap-3"
          >
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-green-islamic/10 font-heading text-sm font-bold text-green-islamic">
              {i + 1}
            </span>
            <div className="min-w-0">
              <p className="line-clamp-2 text-sm font-semibold text-text-primary group-hover:text-green-islamic">
                {a.title}
              </p>
              <span className="mt-1 flex items-center gap-1 text-xs text-text-secondary">
                <Clock size={10} /> {a.readTime} min
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

/** Sidebar: categories list */
function CategoriesList({ articles }: { articles: Article[] }) {
  const counts = useMemo(() => {
    const m: Partial<Record<ArticleCategory, number>> = {};
    articles.forEach((a) => {
      m[a.category] = (m[a.category] || 0) + 1;
    });
    return m;
  }, [articles]);

  return (
    <div className="card-islamic p-5">
      <h3 className="font-heading text-lg font-bold text-text-primary">Catégories</h3>
      <ul className="mt-4 space-y-2">
        {(Object.keys(categoryMeta) as ArticleCategory[]).map((cat) => {
          const meta = categoryMeta[cat];
          return (
            <li key={cat}>
              <div className="flex items-center justify-between rounded-lg px-3 py-2 text-sm transition-colors hover:bg-cream-dark">
                <span className="text-text-primary">{meta.label}</span>
                <span
                  className={`rounded-full px-2 py-0.5 text-xs font-semibold ${meta.bg} ${meta.color}`}
                >
                  {counts[cat] || 0}
                </span>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

/** Sidebar: newsletter */
function NewsletterCard() {
  return (
    <div className="card-islamic overflow-hidden">
      <div className="bg-gradient-to-br from-green-islamic to-emerald-600 p-5 text-white">
        <Mail size={28} className="mb-3 opacity-80" />
        <h3 className="font-heading text-lg font-bold">Newsletter</h3>
        <p className="mt-1 text-sm text-white/80">
          Recevez nos articles et conseils directement dans votre boîte mail.
        </p>
      </div>
      <div className="p-5">
        <input
          type="email"
          placeholder="Votre adresse email"
          className="w-full rounded-lg border border-cream-dark bg-cream px-4 py-2.5 text-sm text-text-primary placeholder:text-text-secondary/60 focus:border-green-islamic focus:outline-none focus:ring-1 focus:ring-green-islamic"
        />
        <button className="mt-3 w-full rounded-lg bg-green-islamic px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-green-islamic/90">
          S'inscrire
        </button>
        <p className="mt-2 text-center text-xs text-text-secondary">
          Pas de spam. Désabonnement en un clic.
        </p>
      </div>
    </div>
  );
}

/** Sidebar: recent videos from Supabase */
function RecentVideos() {
  const [videos, setVideos] = useState<{ id: string; title: string; youtube_id: string }[]>([]);

  useEffect(() => {
    supabase
      .from('videos')
      .select('id, title, youtube_id')
      .order('created_at', { ascending: false })
      .limit(3)
      .then(({ data }) => {
        if (data) setVideos(data);
      });
  }, []);

  if (videos.length === 0) return null;

  return (
    <div className="card-islamic p-5">
      <h3 className="flex items-center gap-2 font-heading text-lg font-bold text-text-primary">
        <Play size={18} className="text-gold" />
        Vidéos récentes
      </h3>
      <div className="mt-4 space-y-4">
        {videos.map((v) => (
          <a
            key={v.id}
            href={`https://www.youtube.com/watch?v=${v.youtube_id}`}
            target="_blank"
            rel="noopener noreferrer"
            className="group block"
          >
            <div className="relative aspect-video overflow-hidden rounded-lg">
              <img
                src={`https://img.youtube.com/vi/${v.youtube_id}/mqdefault.jpg`}
                alt={v.title}
                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                loading="lazy"
              />
              <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/90 shadow transition-transform group-hover:scale-110">
                  <Play size={18} className="text-green-islamic ml-0.5" />
                </div>
              </div>
            </div>
            <p className="mt-2 text-sm font-medium text-text-primary group-hover:text-green-islamic">
              {v.title}
            </p>
          </a>
        ))}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main page component
// ---------------------------------------------------------------------------

const ARTICLES_PER_PAGE = 9;

export default function Articles() {
  const [activeFilter, setActiveFilter] = useState<FilterKey>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const tabsRef = useRef<HTMLDivElement>(null);

  // --- filter & search ---
  const filtered = useMemo(() => {
    let list = sampleArticles;
    if (activeFilter !== 'all') {
      list = list.filter((a) => a.category === activeFilter);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (a) =>
          a.title.toLowerCase().includes(q) ||
          a.excerpt.toLowerCase().includes(q) ||
          a.tags.some((t) => t.toLowerCase().includes(q)),
      );
    }
    return list;
  }, [activeFilter, searchQuery]);

  // --- featured article (always the first featured, regardless of filter) ---
  const featuredArticle = sampleArticles.find((a) => a.featured) ?? sampleArticles[0];

  // --- paginated articles (exclude the featured from the grid) ---
  const gridArticles = filtered.filter((a) => a.id !== featuredArticle.id);
  const totalPages = Math.max(1, Math.ceil(gridArticles.length / ARTICLES_PER_PAGE));
  const pagedArticles = gridArticles.slice(
    (page - 1) * ARTICLES_PER_PAGE,
    page * ARTICLES_PER_PAGE,
  );

  // split first 2 for large row, rest for small grid
  const largeRow = pagedArticles.slice(0, 2);
  const smallGrid = pagedArticles.slice(2);

  // scroll helpers for category tabs
  const scrollTabs = (dir: 'left' | 'right') => {
    tabsRef.current?.scrollBy({ left: dir === 'left' ? -200 : 200, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-cream">
      <SEO
        title="Articles & Conseils - Roqya, Psycho-Roqya, Guerison spirituelle"
        description="Decouvrez nos articles sur la roqya, la Psycho-Roqya, le mauvais oeil, la sorcellerie, la possession et les moyens de guerison selon le Coran et la Sunnah."
        keywords="articles roqya, blog islam guerison, mauvais oeil symptomes, sorcellerie islam, possession djinn signes, psycho-roqya, eau coranisee, sourate baqara"
        url="/articles"
      />
      {/* ── Search bar ────────────────────────────────────────────────── */}
      <div className="border-b border-cream-dark bg-white/60 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-3 sm:px-6 lg:px-8">
          <Search size={18} className="shrink-0 text-text-secondary" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setPage(1);
            }}
            placeholder="Rechercher un article, un sujet..."
            className="w-full bg-transparent text-sm text-text-primary placeholder:text-text-secondary/60 focus:outline-none"
          />
        </div>
      </div>

      {/* ── Category pills (sticky) ───────────────────────────────────── */}
      <div className="sticky top-16 z-30 border-b border-cream-dark bg-cream/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center gap-2 px-4 sm:px-6 lg:px-8">
          <button
            onClick={() => scrollTabs('left')}
            className="hidden shrink-0 text-text-secondary hover:text-green-islamic sm:block"
            aria-label="Scroll left"
          >
            <ChevronLeft size={20} />
          </button>
          <div
            ref={tabsRef}
            className="scrollbar-hide flex gap-2 overflow-x-auto py-3"
          >
            {filterTabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => {
                  setActiveFilter(tab.key);
                  setPage(1);
                }}
                className={`shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                  activeFilter === tab.key
                    ? 'bg-green-islamic text-white shadow-sm'
                    : 'bg-white text-text-secondary hover:bg-cream-dark'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
          <button
            onClick={() => scrollTabs('right')}
            className="hidden shrink-0 text-text-secondary hover:text-green-islamic sm:block"
            aria-label="Scroll right"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      {/* ── Main content ──────────────────────────────────────────────── */}
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Hero banner */}
        {activeFilter === 'all' && !searchQuery && (
          <section className="mb-10">
            <HeroBanner article={featuredArticle} />
          </section>
        )}

        {/* Two-column layout: content + sidebar */}
        <div className="flex flex-col gap-10 lg:flex-row">
          {/* ── Left: articles grid ─────────────────────────────── */}
          <div className="min-w-0 flex-1">
            {/* Large row */}
            {largeRow.length > 0 && (
              <div className="mb-8 grid gap-6 sm:grid-cols-2">
                {largeRow.map((a) => (
                  <LargeCard key={a.id} article={a} />
                ))}
              </div>
            )}

            {/* Small 3-col grid */}
            {smallGrid.length > 0 && (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {smallGrid.map((a) => (
                  <SmallCard key={a.id} article={a} />
                ))}
              </div>
            )}

            {/* empty state */}
            {pagedArticles.length === 0 && (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <Search size={48} className="mb-4 text-cream-dark" />
                <p className="font-heading text-lg font-semibold text-text-primary">
                  Aucun article trouvé
                </p>
                <p className="mt-1 text-sm text-text-secondary">
                  Essayez d'autres mots-clés ou changez de catégorie.
                </p>
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-10 flex items-center justify-center gap-2">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="rounded-lg border border-cream-dark px-3 py-2 text-sm text-text-secondary transition-colors hover:bg-cream-dark disabled:opacity-40"
                >
                  <ChevronLeft size={16} />
                </button>
                {Array.from({ length: totalPages }, (_, i) => (
                  <button
                    key={i}
                    onClick={() => setPage(i + 1)}
                    className={`h-9 w-9 rounded-lg text-sm font-medium transition-colors ${
                      page === i + 1
                        ? 'bg-green-islamic text-white'
                        : 'text-text-secondary hover:bg-cream-dark'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="rounded-lg border border-cream-dark px-3 py-2 text-sm text-text-secondary transition-colors hover:bg-cream-dark disabled:opacity-40"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            )}

            {/* Load more alternative */}
            {totalPages > 1 && page < totalPages && (
              <div className="mt-6 flex justify-center">
                <button
                  onClick={() => setPage((p) => p + 1)}
                  className="flex items-center gap-2 rounded-full bg-cream-dark px-6 py-2.5 text-sm font-medium text-text-primary transition-colors hover:bg-green-islamic hover:text-white"
                >
                  Charger plus <ArrowRight size={14} />
                </button>
              </div>
            )}
          </div>

          {/* ── Right: sidebar ──────────────────────────────────── */}
          <aside className="w-full shrink-0 space-y-6 lg:w-80">
            <PopularArticles articles={sampleArticles} />
            <CategoriesList articles={sampleArticles} />
            <NewsletterCard />
            <RecentVideos />
          </aside>
        </div>
      </div>
    </div>
  );
}
