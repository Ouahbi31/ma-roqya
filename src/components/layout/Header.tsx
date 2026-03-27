import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Star, Menu, X, ChevronDown, LogOut, User } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';

export default function Header() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const { user, profile, logout } = useAuthStore();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  // Fermer le menu mobile quand on change de page
  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  // Bloquer le scroll quand le menu est ouvert
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  const navLinks = [
    { to: '/', label: t('nav.home') },
    { to: '/articles', label: t('nav.articles') },
    { to: '/douas', label: t('nav.douas') },
    { to: '/quiz', label: t('nav.quiz') },
    { to: '/forum', label: t('nav.forum') },
    { to: '/programme', label: 'Programme' },
    { to: '/tarifs', label: t('nav.pricing') },
  ];

  const switchLanguage = (lang: 'fr' | 'ar') => {
    i18n.changeLanguage(lang);
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
  };

  const handleLogout = async () => {
    await logout();
    setProfileOpen(false);
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-50 bg-cream border-b border-cream-dark">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <Star className="h-6 w-6 text-gold fill-gold" />
            <span className="font-heading text-xl font-bold text-green-islamic">
              MaRoqya
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`text-sm font-medium transition-colors ${
                  location.pathname === link.to
                    ? 'text-green-islamic'
                    : 'text-text-secondary hover:text-green-islamic'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right section desktop */}
          <div className="hidden md:flex items-center gap-3">
            <div className="flex items-center gap-1">
              <button
                onClick={() => switchLanguage('fr')}
                className={`px-2 py-1 text-xs rounded font-medium transition-colors ${
                  i18n.language === 'fr'
                    ? 'bg-green-islamic text-white'
                    : 'bg-cream-dark text-text-secondary hover:bg-cream-dark/80'
                }`}
              >
                FR
              </button>
              <button
                onClick={() => switchLanguage('ar')}
                className={`px-2 py-1 text-xs rounded font-medium transition-colors ${
                  i18n.language === 'ar'
                    ? 'bg-green-islamic text-white'
                    : 'bg-cream-dark text-text-secondary hover:bg-cream-dark/80'
                }`}
              >
                عر
              </button>
            </div>

            {user ? (
              <div className="relative">
                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-text-primary hover:bg-cream-dark transition-colors"
                >
                  <User className="h-4 w-4" />
                  <span>{profile?.prenom || t('nav.profile')}</span>
                  <ChevronDown className="h-3 w-3" />
                </button>

                {profileOpen && (
                  <div className="absolute end-0 mt-1 w-48 rounded-lg bg-white shadow-lg border border-cream-dark py-1 z-50">
                    <Link
                      to="/dashboard"
                      onClick={() => setProfileOpen(false)}
                      className="block px-4 py-2 text-sm text-text-primary hover:bg-cream transition-colors"
                    >
                      {t('nav.dashboard')}
                    </Link>
                    <Link
                      to="/profil"
                      onClick={() => setProfileOpen(false)}
                      className="block px-4 py-2 text-sm text-text-primary hover:bg-cream transition-colors"
                    >
                      {t('nav.profile')}
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="flex w-full items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-cream transition-colors"
                    >
                      <LogOut className="h-4 w-4" />
                      {t('nav.logout')}
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="rounded-lg px-4 py-2 text-sm font-medium text-green-islamic hover:bg-cream-dark transition-colors"
                >
                  {t('nav.login')}
                </Link>
                <Link
                  to="/register"
                  className="rounded-lg bg-green-islamic px-4 py-2 text-sm font-medium text-white hover:bg-green-islamic/90 transition-colors"
                >
                  {t('nav.register')}
                </Link>
              </div>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 text-text-primary z-50"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile fullscreen overlay menu */}
      <div
        className={`fixed inset-0 z-40 md:hidden bg-cream transition-all duration-300 ease-in-out ${
          mobileOpen
            ? 'opacity-100 translate-y-0 pointer-events-auto'
            : 'opacity-0 -translate-y-full pointer-events-none'
        }`}
      >
        <div className="flex flex-col h-full pt-20 pb-8 px-6">
          {/* Navigation links — grands et centrés */}
          <nav className="flex flex-col items-center gap-2 flex-1 justify-center">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`text-2xl font-heading font-bold transition-colors py-2 ${
                  location.pathname === link.to
                    ? 'text-green-islamic'
                    : 'text-text-primary hover:text-green-islamic'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Bottom section */}
          <div className="flex flex-col items-center gap-4 pt-6 border-t border-cream-dark">
            {user ? (
              <>
                <Link
                  to="/dashboard"
                  className="w-full max-w-xs rounded-lg bg-green-islamic px-6 py-3 text-center font-semibold text-white transition hover:opacity-90"
                >
                  {t('nav.dashboard')}
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 text-sm font-medium text-red-600"
                >
                  <LogOut className="h-4 w-4" />
                  {t('nav.logout')}
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/register"
                  className="w-full max-w-xs rounded-lg bg-green-islamic px-6 py-3 text-center font-semibold text-white transition hover:opacity-90"
                >
                  {t('nav.register')}
                </Link>
                <Link
                  to="/login"
                  className="text-sm font-semibold text-green-islamic hover:underline"
                >
                  {t('nav.login')}
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
