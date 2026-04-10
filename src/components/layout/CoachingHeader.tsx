import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Star,
  ChevronDown,
  LogOut,
  User,
  Home,
  BookOpen,
  Briefcase,
  Calendar,
  MoreHorizontal,
  X,
  CreditCard,
} from 'lucide-react';
import { useAuthStore } from '../../store/authStore';

export default function CoachingHeader() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const { user, profile, logout } = useAuthStore();

  const [profileOpen, setProfileOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);

  useEffect(() => {
    setProfileOpen(false);
    setMoreOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    document.body.style.overflow = moreOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [moreOpen]);

  const desktopNavLinks = [
    { to: '/', label: 'Accueil' },
    { to: '/coaching/articles', label: 'Articles' },
    { to: '/coaching/services', label: 'Services' },
    { to: '/coaching/programmes', label: 'Programmes' },
    { to: '/qui-suis-je', label: 'Qui suis-je' },
    { to: '/coaching/tarifs', label: t('nav.pricing') },
  ];

  const bottomTabs = [
    { to: '/', label: 'Accueil', icon: Home },
    { to: '/coaching/articles', label: 'Articles', icon: BookOpen },
    { to: '/coaching/services', label: 'Services', icon: Briefcase },
    { to: '/coaching/programmes', label: 'Programmes', icon: Calendar },
  ];

  const moreLinks = [
    { to: '/qui-suis-je', label: 'Qui suis-je', icon: User },
    { to: '/coaching/tarifs', label: t('nav.pricing'), icon: CreditCard },
  ];

  const handleLogout = async () => {
    await logout();
    setProfileOpen(false);
    navigate('/');
  };

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  const isMoreActive = moreLinks.some((link) => isActive(link.to));

  return (
    <>
      {/* ===== TOP HEADER ===== */}
      <header className="sticky top-0 z-50 bg-cream border-b border-cream-dark">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-14 md:h-16 items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <Link
                to="/"
                className="hidden sm:flex items-center gap-1 rounded-lg border border-cream-dark px-2.5 py-1.5 text-xs font-semibold text-text-secondary hover:bg-cream-dark hover:text-text-primary transition"
              >
                <Home className="h-3.5 w-3.5" />
                Accueil
              </Link>
            <Link to="/coaching" className="flex items-center gap-2">
              <Star className="h-5 w-5 md:h-6 md:w-6 text-gold fill-gold" />
              <div className="flex flex-col leading-none">
                <span className="font-heading text-base md:text-lg font-bold text-gold">
                  CoachMyNefs
                </span>
                <span className="text-[10px] text-text-secondary font-medium tracking-wide uppercase">
                  Coaching
                </span>
              </div>
            </Link>
            </div>

            {/* Desktop nav */}
            <nav className="hidden md:flex items-center gap-6">
              {desktopNavLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`text-sm font-medium transition-colors ${
                    isActive(link.to)
                      ? 'text-gold'
                      : 'text-text-secondary hover:text-gold'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Mobile: icône profil uniquement */}
            <div className="flex md:hidden items-center gap-2">
              {user ? (
                <Link to="/dashboard" className="p-2 text-gold">
                  <User className="h-5 w-5" />
                </Link>
              ) : (
                <Link to="/login" className="p-2 text-gold">
                  <User className="h-5 w-5" />
                </Link>
              )}
            </div>

            {/* Desktop: Right section */}
            <div className="hidden md:flex items-center gap-3">
              {/* Bouton Réserver desktop */}
              <a
                href="https://cal.com/coachmynefs"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full bg-gold px-4 py-2 text-sm font-bold text-white shadow-sm transition hover:bg-gold/90"
              >
                Réserver une séance
              </a>

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
                      {profile?.role === 'admin' && (
                        <Link
                          to="/admin"
                          onClick={() => setProfileOpen(false)}
                          className="block px-4 py-2 text-sm font-medium text-gold hover:bg-cream transition-colors"
                        >
                          Administration
                        </Link>
                      )}
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
                    className="rounded-lg px-4 py-2 text-sm font-medium text-gold hover:bg-cream-dark transition-colors"
                  >
                    {t('nav.login')}
                  </Link>
                  <Link
                    to="/register"
                    className="rounded-lg bg-gold px-4 py-2 text-sm font-medium text-white hover:bg-gold/90 transition-colors"
                  >
                    {t('nav.register')}
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* ===== MOBILE BOTTOM TAB BAR ===== */}
      <nav className="fixed bottom-0 inset-x-0 z-50 md:hidden bg-white border-t border-gray-200 pb-[env(safe-area-inset-bottom)]">
        <div className="flex items-center justify-around h-16">
          {bottomTabs.map((tab) => {
            const Icon = tab.icon;
            const active = isActive(tab.to);
            return (
              <Link
                key={tab.to}
                to={tab.to}
                className={`flex flex-col items-center justify-center gap-0.5 flex-1 h-full transition-colors ${
                  active ? 'text-gold' : 'text-gray-400'
                }`}
              >
                <Icon className="h-5 w-5" strokeWidth={active ? 2.5 : 1.5} />
                <span className={`text-[10px] ${active ? 'font-semibold' : 'font-medium'}`}>
                  {tab.label}
                </span>
              </Link>
            );
          })}

          {/* "Plus" tab */}
          <button
            onClick={() => setMoreOpen(!moreOpen)}
            className={`flex flex-col items-center justify-center gap-0.5 flex-1 h-full transition-colors ${
              moreOpen || isMoreActive ? 'text-gold' : 'text-gray-400'
            }`}
          >
            <MoreHorizontal className="h-5 w-5" strokeWidth={moreOpen || isMoreActive ? 2.5 : 1.5} />
            <span className={`text-[10px] ${moreOpen || isMoreActive ? 'font-semibold' : 'font-medium'}`}>
              Plus
            </span>
          </button>
        </div>
      </nav>

      {/* ===== "PLUS" BOTTOM SHEET ===== */}
      {moreOpen && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/30 md:hidden"
            onClick={() => setMoreOpen(false)}
          />
          <div className="fixed bottom-16 inset-x-0 z-50 md:hidden bg-white rounded-t-2xl shadow-lg pb-[env(safe-area-inset-bottom)] animate-slide-up">
            <div className="flex items-center justify-between px-5 pt-4 pb-2">
              <h3 className="font-heading font-bold text-lg text-text-primary">Plus</h3>
              <button onClick={() => setMoreOpen(false)} className="p-1 text-gray-400">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="px-3 pb-4 space-y-1">
              {moreLinks.map((link) => {
                const Icon = link.icon;
                const active = isActive(link.to);
                return (
                  <Link
                    key={link.to}
                    to={link.to}
                    className={`flex items-center gap-4 rounded-xl px-4 py-3 transition-colors ${
                      active
                        ? 'bg-gold/10 text-gold'
                        : 'text-text-primary hover:bg-cream'
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    <span className="font-medium text-sm">{link.label}</span>
                  </Link>
                );
              })}

              <div className="border-t border-gray-100 my-2" />

              {user ? (
                <>
                  <Link
                    to="/dashboard"
                    className="flex items-center gap-4 rounded-xl px-4 py-3 text-text-primary hover:bg-cream transition-colors"
                  >
                    <Star className="h-5 w-5" />
                    <span className="font-medium text-sm">{t('nav.dashboard')}</span>
                  </Link>
                  {profile?.role === 'admin' && (
                    <Link
                      to="/admin"
                      className="flex items-center gap-4 rounded-xl px-4 py-3 text-gold hover:bg-gold/10 transition-colors"
                    >
                      <Star className="h-5 w-5" />
                      <span className="font-medium text-sm">Administration</span>
                    </Link>
                  )}
                  <button
                    onClick={handleLogout}
                    className="flex w-full items-center gap-4 rounded-xl px-4 py-3 text-red-500 hover:bg-red-50 transition-colors"
                  >
                    <LogOut className="h-5 w-5" />
                    <span className="font-medium text-sm">{t('nav.logout')}</span>
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/register"
                    className="flex items-center gap-4 rounded-xl px-4 py-3 bg-gold text-white transition-colors"
                  >
                    <User className="h-5 w-5" />
                    <span className="font-medium text-sm">{t('nav.register')}</span>
                  </Link>
                  <Link
                    to="/login"
                    className="flex items-center gap-4 rounded-xl px-4 py-3 text-gold hover:bg-cream transition-colors"
                  >
                    <LogOut className="h-5 w-5" />
                    <span className="font-medium text-sm">{t('nav.login')}</span>
                  </Link>
                </>
              )}
            </div>
          </div>
        </>
      )}
    </>
  );
}
