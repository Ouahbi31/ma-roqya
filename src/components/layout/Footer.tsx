import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Star } from 'lucide-react';

export default function Footer() {
  const { t } = useTranslation();

  const quickLinks = [
    { to: '/', label: t('nav.home') },
    { to: '/articles', label: t('nav.articles') },
    { to: '/douas', label: t('nav.douas') },
    { to: '/forum', label: t('nav.forum') },
  ];

  const legalLinks = [
    { to: '/mentions-legales', label: t('footer.legal') },
    { to: '/confidentialite', label: t('footer.privacy') },
    { to: '/cgu', label: t('footer.terms') },
  ];

  return (
    <footer className="bg-cream-dark">
      {/* Arabesque separator */}
      <div className="arabesque-separator" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Column 1: Logo + description */}
          <div className="sm:col-span-2 lg:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <Star className="h-5 w-5 text-gold fill-gold" />
              <span className="font-heading text-lg font-bold text-green-islamic">
                MaRoqya
              </span>
            </Link>
            <p className="text-sm text-text-secondary leading-relaxed">
              {t('footer.description')}
            </p>
          </div>

          {/* Column 2: Quick links */}
          <div>
            <h4 className="font-heading text-sm font-semibold text-text-primary mb-4">
              {t('footer.links')}
            </h4>
            <ul className="flex flex-col gap-2">
              {quickLinks.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-sm text-text-secondary hover:text-green-islamic transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Legal links */}
          <div>
            <h4 className="font-heading text-sm font-semibold text-text-primary mb-4">
              {t('footer.legal')}
            </h4>
            <ul className="flex flex-col gap-2">
              {legalLinks.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-sm text-text-secondary hover:text-green-islamic transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Contact */}
          <div>
            <h4 className="font-heading text-sm font-semibold text-text-primary mb-4">
              {t('footer.contact')}
            </h4>
            <p className="text-sm text-text-secondary leading-relaxed">
              contact@ma-roqya.fr
            </p>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-10 pt-6 border-t border-cream">
          <p className="text-center text-xs text-text-secondary">
            {t('footer.copyright')}
          </p>
        </div>
      </div>
    </footer>
  );
}
