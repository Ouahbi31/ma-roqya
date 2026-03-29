import { useLocation, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Shield, AlertTriangle, Heart, ArrowLeft, BookOpen, UserPlus } from 'lucide-react';
import { sampleArticles } from '../data/articles';
import { sampleDouas } from '../data/douas';
import { useAuthStore } from '../store/authStore';
import SEO from '../components/SEO';

export default function QuizResultat() {
  const { t } = useTranslation();
  const location = useLocation();
  const user = useAuthStore((s) => s.user);
  const { score = 0, total = 36 } = (location.state as { score: number; total: number }) || {};

  const percentage = Math.round((score / total) * 100);

  let level: 'low' | 'medium' | 'high';
  let color: string;
  let bgColor: string;
  let Icon: typeof Shield;

  if (percentage < 35) {
    level = 'low';
    color = 'text-green-islamic';
    bgColor = 'bg-green-islamic/10';
    Icon = Shield;
  } else if (percentage < 65) {
    level = 'medium';
    color = 'text-gold';
    bgColor = 'bg-gold/10';
    Icon = AlertTriangle;
  } else {
    level = 'high';
    color = 'text-orange-600';
    bgColor = 'bg-orange-100';
    Icon = Heart;
  }

  const recommendedArticles = sampleArticles.slice(0, 3);
  const recommendedDouas = sampleDouas.slice(0, 3);

  return (
    <div className="min-h-screen bg-cream px-4 py-8 sm:px-6 lg:px-8">
      <SEO title="Résultat de votre quiz — MaRoqya" description="Découvrez votre résultat d'auto-évaluation spirituelle et les recommandations personnalisées." />
      <div className="mx-auto max-w-2xl">
        <Link to="/quiz" className="mb-6 inline-flex items-center gap-2 text-sm text-green-islamic hover:text-gold">
          <ArrowLeft size={16} /> {t('common.back')}
        </Link>

        <div className="card-islamic p-6 text-center sm:p-8">
          <h1 className="mb-6 font-heading text-2xl font-bold text-text-primary sm:text-3xl">
            {t('quiz.result_title')}
          </h1>

          {/* Score circle */}
          <div className={`mx-auto mb-6 inline-flex h-32 w-32 items-center justify-center rounded-full ${bgColor}`}>
            <div className="text-center">
              <Icon size={28} className={color} />
              <p className={`mt-1 text-2xl font-bold ${color}`}>{score}/{total}</p>
            </div>
          </div>

          {/* Result message */}
          <div className={`mx-auto mb-6 max-w-lg rounded-xl ${bgColor} p-4`}>
            <p className={`font-medium ${color}`}>{t(`quiz.result_${level}`)}</p>
          </div>

          <div className="arabesque-separator mb-6" />

          {/* Recommended articles */}
          <div className="mb-6 text-left">
            <h2 className="mb-3 flex items-center gap-2 font-heading text-lg font-semibold text-text-primary">
              <BookOpen size={18} className="text-green-islamic" />
              {t('quiz.recommended_articles')}
            </h2>
            <div className="space-y-2">
              {recommendedArticles.map((a) => (
                <Link
                  key={a.id}
                  to={`/articles/${a.id}`}
                  className="block rounded-lg border border-cream-dark p-3 transition-colors hover:bg-cream-dark"
                >
                  <p className="font-medium text-text-primary">{a.title}</p>
                  <p className="text-sm text-text-secondary">{a.readTime} {t('articles.read_time')}</p>
                </Link>
              ))}
            </div>
          </div>

          {/* Recommended douas */}
          <div className="mb-6 text-left">
            <h2 className="mb-3 flex items-center gap-2 font-heading text-lg font-semibold text-text-primary">
              <Heart size={18} className="text-green-islamic" />
              {t('quiz.recommended_douas')}
            </h2>
            <div className="space-y-2">
              {recommendedDouas.map((d) => (
                <div key={d.id} className="rounded-lg border border-cream-dark p-3">
                  <p className="font-medium text-text-primary">{d.titre}</p>
                  <p className="text-arabic text-lg text-green-islamic">{d.texte_arabe}</p>
                </div>
              ))}
            </div>
          </div>

          {user ? (
            <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
              <button className="btn-primary">{t('quiz.save_results')}</button>
              <Link to="/dashboard" className="btn-secondary text-center">
                {t('nav.dashboard')}
              </Link>
            </div>
          ) : (
            <div className="mt-2 rounded-xl border border-green-islamic/20 bg-green-islamic/5 p-5 text-center">
              <UserPlus size={24} className="mx-auto mb-2 text-green-islamic" />
              <p className="font-medium text-text-primary">
                Créez un compte pour sauvegarder vos résultats
              </p>
              <Link
                to="/register"
                className="mt-3 inline-flex items-center gap-2 rounded-xl bg-green-islamic px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-gold"
              >
                Créer un compte
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
