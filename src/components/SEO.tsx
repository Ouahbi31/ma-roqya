import { useEffect } from 'react';

interface SEOProps {
  title: string;
  description: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article';
  article?: {
    publishedTime?: string;
    author?: string;
    section?: string;
    tags?: string[];
  };
}

const SITE_NAME = 'MaRoqya';
const BASE_URL = 'https://ma-roqya.fr';
const DEFAULT_IMAGE = `${BASE_URL}/images/og-cover.png`;

function setMetaTag(property: string, content: string, isProperty = false) {
  const attr = isProperty ? 'property' : 'name';
  let el = document.querySelector(`meta[${attr}="${property}"]`) as HTMLMetaElement | null;
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, property);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

function removeMetaTag(property: string, isProperty = false) {
  const attr = isProperty ? 'property' : 'name';
  const el = document.querySelector(`meta[${attr}="${property}"]`);
  if (el) el.remove();
}

function setCanonical(url: string) {
  let el = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
  if (!el) {
    el = document.createElement('link');
    el.setAttribute('rel', 'canonical');
    document.head.appendChild(el);
  }
  el.setAttribute('href', url);
}

export default function SEO({
  title,
  description,
  keywords,
  image,
  url,
  type = 'website',
  article,
}: SEOProps) {
  useEffect(() => {
    // Page title
    document.title = `${title} | ${SITE_NAME}`;

    // Standard meta tags
    setMetaTag('description', description);
    if (keywords) {
      setMetaTag('keywords', keywords);
    }

    // Canonical URL
    const canonicalUrl = url ? `${BASE_URL}${url}` : BASE_URL;
    setCanonical(canonicalUrl);

    // Open Graph
    const ogImage = image || DEFAULT_IMAGE;
    setMetaTag('og:type', type, true);
    setMetaTag('og:url', canonicalUrl, true);
    setMetaTag('og:title', `${title} | ${SITE_NAME}`, true);
    setMetaTag('og:description', description, true);
    setMetaTag('og:image', ogImage.startsWith('http') ? ogImage : `${BASE_URL}${ogImage}`, true);
    setMetaTag('og:locale', 'fr_FR', true);
    setMetaTag('og:site_name', SITE_NAME, true);

    // Twitter Card
    setMetaTag('twitter:card', 'summary_large_image');
    setMetaTag('twitter:url', canonicalUrl);
    setMetaTag('twitter:title', `${title} | ${SITE_NAME}`);
    setMetaTag('twitter:description', description);
    setMetaTag('twitter:image', ogImage.startsWith('http') ? ogImage : `${BASE_URL}${ogImage}`);

    // Article-specific OG tags
    if (type === 'article' && article) {
      if (article.publishedTime) {
        setMetaTag('article:published_time', article.publishedTime, true);
      }
      if (article.author) {
        setMetaTag('article:author', article.author, true);
      }
      if (article.section) {
        setMetaTag('article:section', article.section, true);
      }
      if (article.tags) {
        // Remove old article:tag meta tags
        document.querySelectorAll('meta[property="article:tag"]').forEach((el) => el.remove());
        article.tags.forEach((tag) => {
          const el = document.createElement('meta');
          el.setAttribute('property', 'article:tag');
          el.setAttribute('content', tag);
          document.head.appendChild(el);
        });
      }
    }

    // Cleanup article meta tags on unmount if not article type
    return () => {
      removeMetaTag('article:published_time', true);
      removeMetaTag('article:author', true);
      removeMetaTag('article:section', true);
      document.querySelectorAll('meta[property="article:tag"]').forEach((el) => el.remove());
    };
  }, [title, description, keywords, image, url, type, article]);

  return null;
}
