import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { BookOpen, Heart, ClipboardList, Users, Crown } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { sampleArticles } from '../data/articles';

export default function Dashboard() {
  const { t } = useTranslation();
  const profile = useAuthStore((s) => s.profile);
  const prenom = profile?.prenom || t('dashboard.welcome');

  const quickLinks = [
    { icon: BookOpen, label: t('nav.articles'), to: '/articles', color: 'bg-green-islamic' },
    { icon: Heart, label: t('nav.douas'), to: '/douas', color: 'bg-gold' },
    { icon: ClipboardList, label: 'Programme', to: '/programme', color: 'bg-green-light' },
    { icon: Users, label: t('nav.forum'), to: '/forum', color: 'bg-green-islamic' },
  ];

  return (
    <div className="min-h-screen bg-cream px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        {/* Welcome */}
        <div className="mb-8">
          <h1 className="font-heading text-3xl font-bold text-green-islamic sm:text-4xl">
            {t('dashboard.welcome')}, {prenom}
          </h1>
          <p className="mt-2 text-lg text-text-secondary">{t('dashboard.welcome_msg')}</p>
        </div>

        {/* Quick Access */}
        <section className="mb-10">
          <h2 className="mb-4 font-heading text-xl font-semibold text-text-primary">
            {t('dashboard.quick_access')}
          </h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {quickLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="card-islamic flex flex-col items-center gap-2 sm:gap-3 p-4 sm:p-6 transition-transform hover:-translate-y-1 active:scale-[0.97]"
              >
                <div className={`${link.color} rounded-xl p-3 text-white`}>
                  <link.icon size={24} />
                </div>
                <span className="font-semibold text-text-primary">{link.label}</span>
              </Link>
            ))}
          </div>
        </section>

        {/* Latest Articles */}
        <section className="mb-10">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-heading text-xl font-semibold text-text-primary">
              {t('dashboard.latest_articles')}
            </h2>
            <Link to="/articles" className="text-sm font-medium text-green-islamic hover:text-gold">
              {t('common.see_all')} →
            </Link>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {sampleArticles.slice(0, 3).map((article) => (
              <Link
                key={article.id}
                to={`/articles/${article.id}`}
                className="card-islamic p-5 transition-transform hover:-translate-y-1"
              >
                <span className="mb-2 inline-block rounded-full bg-green-islamic/10 px-3 py-1 text-xs font-medium text-green-islamic">
                  {article.category}
                </span>
                <h3 className="mb-2 font-heading text-lg font-semibold text-text-primary">
                  {article.title}
                </h3>
                <p className="line-clamp-2 text-sm text-text-secondary">{article.excerpt}</p>
                <p className="mt-3 text-xs text-text-secondary">{article.readTime} {t('articles.read_time')}</p>
              </Link>
            ))}
          </div>
        </section>

        {/* Premium Banner */}
        {!profile?.is_premium && (
          <section className="card-islamic border-2 border-gold/30 bg-gradient-to-r from-cream to-cream-dark p-6 sm:p-8">
            <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-start gap-4">
                <div className="rounded-xl bg-gold/10 p-3">
                  <Crown className="text-gold" size={28} />
                </div>
                <div>
                  <h3 className="font-heading text-xl font-bold text-text-primary">
                    {t('dashboard.premium_banner_title')}
                  </h3>
                  <p className="mt-1 text-text-secondary">{t('dashboard.premium_banner_desc')}</p>
                </div>
              </div>
              <Link
                to="/tarifs"
                className="btn-primary shrink-0 whitespace-nowrap"
              >
                {t('dashboard.premium_banner_cta')}
              </Link>
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
