import { useParams, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Clock,
  Share2,
  Link2,
  Calendar,
  AlertTriangle,
  Lightbulb,
  Info,
} from 'lucide-react';
import {
  sampleArticles,
  categoryMeta,
  type Article,
  type ArticleBlock,
} from '../data/articles';
import SEO from '../components/SEO';

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

function copyLink() {
  navigator.clipboard.writeText(window.location.href);
}

function shareTwitter(title: string) {
  window.open(
    `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(window.location.href)}`,
    '_blank',
  );
}

function shareWhatsApp(title: string) {
  window.open(
    `https://wa.me/?text=${encodeURIComponent(title + ' ' + window.location.href)}`,
    '_blank',
  );
}

// ---------------------------------------------------------------------------
// Hero image (gradient placeholder with pattern)
// ---------------------------------------------------------------------------

function HeroImage({ article }: { article: Article }) {
  if (article.imageUrl) {
    return (
      <div className="relative h-64 w-full overflow-hidden sm:h-80 lg:h-96">
        <img
          src={article.imageUrl}
          alt={article.title}
          className="h-full w-full object-cover"
          loading="lazy"
        />
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/50 to-transparent" />
      </div>
    );
  }

  return (
    <div
      className={`${article.imageGradient} relative flex h-64 w-full items-center justify-center overflow-hidden sm:h-80 lg:h-96`}
    >
      <div className="absolute inset-0 opacity-10">
        <svg
          className="h-full w-full"
          viewBox="0 0 200 200"
          xmlns="http://www.w3.org/2000/svg"
        >
          <pattern
            id="geo-detail"
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
          <rect width="200" height="200" fill="url(#geo-detail)" />
        </svg>
      </div>
      <span className="relative font-heading text-2xl font-bold text-white/60 select-none">
        MaRoqya
      </span>
      <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/40 to-transparent" />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Content block renderers
// ---------------------------------------------------------------------------

function RenderBlock({ block }: { block: ArticleBlock }) {
  switch (block.type) {
    case 'paragraph':
      return (
        <p className="leading-relaxed text-text-primary">{block.text}</p>
      );

    case 'heading':
      if (block.level === 2) {
        return (
          <h2 className="mt-4 font-heading text-2xl font-bold text-green-islamic">
            {block.text}
          </h2>
        );
      }
      return (
        <h3 className="mt-3 font-heading text-xl font-semibold text-green-islamic/90">
          {block.text}
        </h3>
      );

    case 'arabic':
      return (
        <div className="my-4 rounded-xl border border-gold/20 bg-gradient-to-r from-gold/5 to-transparent p-5">
          <p
            className="text-center font-arabic text-2xl leading-loose text-text-primary"
            dir="rtl"
          >
            {block.text}
          </p>
          <p className="mt-3 text-center text-sm italic text-text-secondary">
            {block.translation}
          </p>
          <p className="mt-1 text-center text-xs font-semibold text-gold">
            — {block.source}
          </p>
        </div>
      );

    case 'quote':
      return (
        <blockquote className="my-4 border-l-4 border-gold bg-gold/5 py-3 pl-5 pr-4 italic text-text-primary">
          <p>{block.text}</p>
          {block.author && (
            <cite className="mt-2 block text-sm font-semibold not-italic text-gold">
              — {block.author}
            </cite>
          )}
        </blockquote>
      );

    case 'list': {
      const Tag = block.ordered ? 'ol' : 'ul';
      return (
        <Tag
          className={`my-2 space-y-1.5 pl-6 text-text-primary ${
            block.ordered ? 'list-decimal' : 'list-disc'
          }`}
        >
          {block.items.map((item, i) => (
            <li key={i} className="leading-relaxed">
              {item}
            </li>
          ))}
        </Tag>
      );
    }

    case 'video':
      return (
        <div className="my-4">
          <div className="relative aspect-video overflow-hidden rounded-xl">
            <iframe
              src={`https://www.youtube.com/embed/${block.youtubeId}`}
              title={block.caption || 'Vidéo'}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="absolute inset-0 h-full w-full border-0"
            />
          </div>
          {block.caption && (
            <p className="mt-2 text-center text-sm text-text-secondary">
              {block.caption}
            </p>
          )}
        </div>
      );

    case 'image':
      return (
        <figure className="my-4">
          <div className="overflow-hidden rounded-xl">
            <img
              src={block.url}
              alt={block.alt}
              className="h-auto w-full object-cover"
            />
          </div>
          {block.caption && (
            <figcaption className="mt-2 text-center text-sm text-text-secondary">
              {block.caption}
            </figcaption>
          )}
        </figure>
      );

    case 'callout': {
      const styles = {
        tip: {
          border: 'border-green-islamic/30',
          bg: 'bg-green-islamic/5',
          icon: <Lightbulb size={18} className="shrink-0 text-green-islamic" />,
        },
        warning: {
          border: 'border-amber-500/30',
          bg: 'bg-amber-50',
          icon: <AlertTriangle size={18} className="shrink-0 text-amber-600" />,
        },
        info: {
          border: 'border-blue-400/30',
          bg: 'bg-blue-50',
          icon: <Info size={18} className="shrink-0 text-blue-600" />,
        },
      };
      const s = styles[block.variant];
      return (
        <div
          className={`my-4 flex gap-3 rounded-xl border ${s.border} ${s.bg} p-4`}
        >
          {s.icon}
          <p className="text-sm leading-relaxed text-text-primary">{block.text}</p>
        </div>
      );
    }

    case 'separator':
      return <div className="arabesque-separator my-8" />;

    default:
      return null;
  }
}

// ---------------------------------------------------------------------------
// Related articles
// ---------------------------------------------------------------------------

function RelatedArticles({
  current,
}: {
  current: Article;
}) {
  const related = sampleArticles
    .filter(
      (a) =>
        a.id !== current.id &&
        (a.category === current.category ||
          a.tags.some((t) => current.tags.includes(t))),
    )
    .slice(0, 3);

  if (related.length === 0) return null;

  return (
    <section className="mt-12">
      <h2 className="mb-6 font-heading text-2xl font-bold text-text-primary">
        À lire aussi
      </h2>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {related.map((a) => {
          const meta = categoryMeta[a.category];
          return (
            <Link
              key={a.id}
              to={`/articles/${a.slug}`}
              className="card-islamic group flex flex-col overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
            >
              <div
                className={`${a.imageGradient} relative flex h-36 items-center justify-center overflow-hidden`}
              >
                <div className="absolute inset-0 opacity-10">
                  <svg className="h-full w-full" viewBox="0 0 200 200">
                    <pattern
                      id={`rel-${a.id}`}
                      x="0"
                      y="0"
                      width="40"
                      height="40"
                      patternUnits="userSpaceOnUse"
                    >
                      <circle
                        cx="20"
                        cy="20"
                        r="8"
                        fill="none"
                        stroke="white"
                        strokeWidth="0.5"
                      />
                    </pattern>
                    <rect width="200" height="200" fill={`url(#rel-${a.id})`} />
                  </svg>
                </div>
              </div>
              <div className="p-4">
                <span
                  className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${meta.bg} ${meta.color}`}
                >
                  {meta.label}
                </span>
                <h3 className="mt-2 font-heading text-base font-bold leading-snug text-text-primary group-hover:text-green-islamic">
                  {a.title}
                </h3>
                <span className="mt-2 flex items-center gap-1 text-xs text-text-secondary">
                  <Clock size={12} /> {a.readTime} min
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Author bio card
// ---------------------------------------------------------------------------

function AuthorBio({ article }: { article: Article }) {
  return (
    <div className="mt-10 card-islamic flex flex-col items-center gap-4 p-6 sm:flex-row sm:items-start">
      <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-green-islamic/10 font-heading text-2xl font-bold text-green-islamic">
        {article.author.name.charAt(0)}
      </div>
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-text-secondary">
          Écrit par
        </p>
        <p className="mt-1 font-heading text-lg font-bold text-text-primary">
          {article.author.name}
        </p>
        {article.author.bio && (
          <p className="mt-1 text-sm leading-relaxed text-text-secondary">
            {article.author.bio}
          </p>
        )}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Comments placeholder
// ---------------------------------------------------------------------------

function CommentsPlaceholder() {
  return (
    <div className="mt-12">
      <h2 className="mb-4 font-heading text-2xl font-bold text-text-primary">
        Commentaires
      </h2>
      <div className="card-islamic flex flex-col items-center justify-center py-12 text-center">
        <p className="text-text-secondary">
          La section commentaires sera bientôt disponible.
        </p>
        <p className="mt-1 text-sm text-text-secondary/70">
          Inscrivez-vous pour être notifié(e).
        </p>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main page
// ---------------------------------------------------------------------------

export default function ArticleDetail() {
  const { id } = useParams<{ id: string }>();

  // Support both slug and old id-based URLs
  const article =
    sampleArticles.find((a) => a.slug === id) ??
    sampleArticles.find((a) => a.id === id);

  if (!article) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-cream px-4">
        <h1 className="font-heading text-2xl font-bold text-text-primary">
          Article introuvable
        </h1>
        <p className="mt-2 text-text-secondary">
          L'article que vous recherchez n'existe pas ou a été déplacé.
        </p>
        <Link
          to="/articles"
          className="mt-6 inline-flex items-center gap-2 rounded-lg bg-green-islamic px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-green-islamic/90"
        >
          <ArrowLeft size={16} /> Retour aux articles
        </Link>
      </div>
    );
  }

  const meta = categoryMeta[article.category];

  // JSON-LD structured data for article
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.excerpt,
    image: article.imageUrl
      ? (article.imageUrl.startsWith('http') ? article.imageUrl : `https://ma-roqya.fr${article.imageUrl}`)
      : 'https://ma-roqya.fr/images/og-cover.png',
    author: {
      '@type': 'Person',
      name: article.author.name,
    },
    publisher: {
      '@type': 'Organization',
      name: 'MaRoqya',
      logo: {
        '@type': 'ImageObject',
        url: 'https://ma-roqya.fr/favicon.svg',
      },
    },
    datePublished: article.date,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://ma-roqya.fr/articles/${article.slug}`,
    },
  };

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Accueil',
        item: 'https://ma-roqya.fr/',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Articles',
        item: 'https://ma-roqya.fr/articles',
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: article.title,
        item: `https://ma-roqya.fr/articles/${article.slug}`,
      },
    ],
  };

  return (
    <div className="min-h-screen bg-cream">
      <SEO
        title={article.title}
        description={article.excerpt}
        keywords={article.tags.join(', ')}
        image={article.imageUrl || undefined}
        url={`/articles/${article.slug}`}
        type="article"
        article={{
          publishedTime: article.date,
          author: article.author.name,
          section: meta.label,
          tags: article.tags,
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      {/* ── Hero image ──────────────────────────────────────────────── */}
      <HeroImage article={article} />

      {/* ── Article wrapper ─────────────────────────────────────────── */}
      <article className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        {/* Back link */}
        <Link
          to="/articles"
          className="mt-6 inline-flex items-center gap-2 text-sm text-green-islamic transition-colors hover:text-gold"
        >
          <ArrowLeft size={16} /> Retour aux articles
        </Link>

        {/* ── Article header ──────────────────────────────────────── */}
        <header className="mt-6">
          <span
            className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${meta.bg} ${meta.color}`}
          >
            {meta.label}
          </span>

          <h1 className="mt-4 font-heading text-3xl font-bold leading-tight text-text-primary sm:text-4xl">
            {article.title}
          </h1>

          {/* Author row */}
          <div className="mt-5 flex flex-wrap items-center gap-4 text-sm text-text-secondary">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-islamic/10 text-xs font-bold text-green-islamic">
                {article.author.name.charAt(0)}
              </div>
              <span className="font-medium text-text-primary">
                {article.author.name}
              </span>
            </div>
            <span className="flex items-center gap-1">
              <Calendar size={14} /> {formatDate(article.date)}
            </span>
            <span className="flex items-center gap-1">
              <Clock size={14} /> {article.readTime} min de lecture
            </span>
          </div>

          {/* Share buttons */}
          <div className="mt-4 flex items-center gap-2">
            <span className="mr-1 text-xs font-medium text-text-secondary">
              <Share2 size={14} className="inline" /> Partager :
            </span>
            <button
              onClick={copyLink}
              className="rounded-lg border border-cream-dark p-2 text-text-secondary transition-colors hover:bg-cream-dark"
              title="Copier le lien"
            >
              <Link2 size={14} />
            </button>
            <button
              onClick={() => shareTwitter(article.title)}
              className="rounded-lg border border-cream-dark p-2 text-text-secondary transition-colors hover:bg-cream-dark"
              title="Partager sur Twitter"
            >
              <svg
                viewBox="0 0 24 24"
                className="h-3.5 w-3.5 fill-current"
              >
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </button>
            <button
              onClick={() => shareWhatsApp(article.title)}
              className="rounded-lg border border-cream-dark p-2 text-text-secondary transition-colors hover:bg-cream-dark"
              title="Partager sur WhatsApp"
            >
              <svg
                viewBox="0 0 24 24"
                className="h-3.5 w-3.5 fill-current"
              >
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
            </button>
          </div>
        </header>

        {/* ── Arabesque separator ─────────────────────────────────── */}
        <div className="arabesque-separator my-8" />

        {/* ── Article body ────────────────────────────────────────── */}
        <div className="space-y-4">
          {article.content.map((block, i) => (
            <RenderBlock key={i} block={block} />
          ))}
        </div>

        {/* ── Author bio ──────────────────────────────────────────── */}
        <AuthorBio article={article} />

        {/* ── Related articles ────────────────────────────────────── */}
        <RelatedArticles current={article} />

        {/* ── Comments ────────────────────────────────────────────── */}
        <CommentsPlaceholder />

        {/* bottom spacer */}
        <div className="h-16" />
      </article>
    </div>
  );
}
