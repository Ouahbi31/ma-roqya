import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Star } from 'lucide-react';

export default function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="bg-cream-dark">
      <div className="arabesque-separator" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <img src="/images/logo-maroqya.png" alt="MaRoqya" className="h-7" />
          </Link>

          {/* Links */}
          <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-text-secondary">
            <Link to="/mentions-legales" className="hover:text-green-islamic transition-colors">{t('footer.legal')}</Link>
            <Link to="/confidentialite" className="hover:text-green-islamic transition-colors">{t('footer.privacy')}</Link>
            <Link to="/cgu" className="hover:text-green-islamic transition-colors">{t('footer.terms')}</Link>
            <a href="mailto:coaching.roqya@gmail.com" className="hover:text-green-islamic transition-colors">coaching.roqya@gmail.com</a>
          </div>
        </div>

        <p className="mt-4 text-center text-[11px] text-text-secondary/60">
          {t('footer.copyright')}
        </p>
      </div>
    </footer>
  );
}
