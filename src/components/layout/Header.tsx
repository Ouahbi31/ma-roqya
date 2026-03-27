import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Star, Menu, X, ChevronDown, LogOut, User } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';

export default function Header() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { user, profile, logout } = useAuthStore();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

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
                className="text-sm font-medium text-text-secondary hover:text-green-islamic transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right section */}
          <div className="hidden md:flex items-center gap-3">
            {/* Language switcher */}
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
            className="md:hidden p-2 text-text-primary"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile slide-in sidebar */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          {/* Overlay */}
          <div
            className="fixed inset-0 bg-black/30"
            onClick={() => setMobileOpen(false)}
          />

          {/* Sidebar */}
          <div className="fixed inset-y-0 start-0 w-72 bg-cream shadow-xl overflow-y-auto">
            <div className="flex items-center justify-between p-4 border-b border-cream-dark">
              <Link
                to="/"
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-2"
              >
                <Star className="h-5 w-5 text-gold fill-gold" />
                <span className="font-heading text-lg font-bold text-green-islamic">
                  MaRoqya
                </span>
              </Link>
              <button
                onClick={() => setMobileOpen(false)}
                className="p-1 text-text-secondary"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <nav className="flex flex-col p-4 gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setMobileOpen(false)}
                  className="rounded-lg px-3 py-2.5 text-sm font-medium text-text-primary hover:bg-cream-dark transition-colors"
                >
                  {link.label}
                </Link>
              ))}

              {user && (
                <Link
                  to="/dashboard"
                  onClick={() => setMobileOpen(false)}
                  className="rounded-lg px-3 py-2.5 text-sm font-medium text-green-islamic hover:bg-cream-dark transition-colors"
                >
                  {t('nav.dashboard')}
                </Link>
              )}
            </nav>

            {/* Language switcher (mobile) */}
            <div className="px-4 py-3 border-t border-cream-dark">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => switchLanguage('fr')}
                  className={`flex-1 px-3 py-2 text-sm rounded-lg font-medium transition-colors ${
                    i18n.language === 'fr'
                      ? 'bg-green-islamic text-white'
                      : 'bg-cream-dark text-text-secondary'
                  }`}
                >
                  Fran\u00e7ais
                </button>
                <button
                  onClick={() => switchLanguage('ar')}
                  className={`flex-1 px-3 py-2 text-sm rounded-lg font-medium transition-colors ${
                    i18n.language === 'ar'
                      ? 'bg-green-islamic text-white'
                      : 'bg-cream-dark text-text-secondary'
                  }`}
                >
                  \u0639\u0631\u0628\u064a
                </button>
              </div>
            </div>

            {/* Auth section (mobile) */}
            <div className="px-4 py-3 border-t border-cream-dark">
              {user ? (
                <div className="flex flex-col gap-1">
                  <span className="px-3 py-2 text-sm font-medium text-text-secondary">
                    {profile?.prenom}
                  </span>
                  <button
                    onClick={() => {
                      handleLogout();
                      setMobileOpen(false);
                    }}
                    className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium text-red-600 hover:bg-cream-dark transition-colors"
                  >
                    <LogOut className="h-4 w-4" />
                    {t('nav.logout')}
                  </button>
                </div>
              ) : (
                <div className="flex flex-col gap-2">
                  <Link
                    to="/login"
                    onClick={() => setMobileOpen(false)}
                    className="rounded-lg px-3 py-2.5 text-center text-sm font-medium text-green-islamic border border-green-islamic hover:bg-cream-dark transition-colors"
                  >
                    {t('nav.login')}
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setMobileOpen(false)}
                    className="rounded-lg bg-green-islamic px-3 py-2.5 text-center text-sm font-medium text-white hover:bg-green-islamic/90 transition-colors"
                  >
                    {t('nav.register')}
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
