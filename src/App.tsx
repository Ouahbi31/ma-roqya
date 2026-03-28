import { useEffect, lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from './store/authStore';
import Layout from './components/layout/Layout';
import ScrollToTop from './components/ScrollToTop';
import ProtectedRoute from './components/auth/ProtectedRoute';
import AdminRoute from './components/auth/AdminRoute';

// Lazy loading — chaque page est chargée uniquement quand on y navigue
const Home = lazy(() => import('./pages/Home'));
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const Tarifs = lazy(() => import('./pages/Tarifs'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Articles = lazy(() => import('./pages/Articles'));
const ArticleDetail = lazy(() => import('./pages/ArticleDetail'));
const Videos = lazy(() => import('./pages/Videos'));
const Douas = lazy(() => import('./pages/Douas'));
const Quiz = lazy(() => import('./pages/Quiz'));
const QuizResultat = lazy(() => import('./pages/QuizResultat'));
const Forum = lazy(() => import('./pages/Forum'));
const ForumPostPage = lazy(() => import('./pages/ForumPostPage'));
const Profil = lazy(() => import('./pages/Profil'));
const Programme = lazy(() => import('./pages/Programme'));
const Admin = lazy(() => import('./pages/Admin'));
const ReservationConfirmee = lazy(() => import('./pages/ReservationConfirmee'));
const QuiSuisJe = lazy(() => import('./pages/QuiSuisJe'));
const PremiumSuccess = lazy(() => import('./pages/PremiumSuccess'));
const MentionsLegales = lazy(() => import('./pages/MentionsLegales'));
const PolitiqueConfidentialite = lazy(() => import('./pages/PolitiqueConfidentialite'));
const ConditionsUtilisation = lazy(() => import('./pages/ConditionsUtilisation'));

// Spinner de transition léger
function PageLoader() {
  return (
    <div className="flex min-h-[50vh] items-center justify-center">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-cream-dark border-t-green-islamic" />
    </div>
  );
}

export default function App() {
  const { i18n } = useTranslation();
  const initialize = useAuthStore((s) => s.initialize);

  useEffect(() => {
    initialize();
  }, [initialize]);

  useEffect(() => {
    document.documentElement.dir = i18n.language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = i18n.language;
  }, [i18n.language]);

  return (
    <Layout>
      <ScrollToTop />
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/tarifs" element={<Tarifs />} />
          <Route path="/reservation-confirmee" element={<ReservationConfirmee />} />
          <Route path="/articles" element={<Articles />} />
          <Route path="/articles/:id" element={<ArticleDetail />} />
          <Route path="/videos" element={<Videos />} />
          <Route path="/douas" element={<Douas />} />
          <Route path="/forum" element={<Forum />} />
          <Route path="/forum/:id" element={<ForumPostPage />} />
          <Route path="/programme" element={<Programme />} />
          <Route path="/qui-suis-je" element={<QuiSuisJe />} />
          <Route path="/premium-success" element={<PremiumSuccess />} />
          <Route path="/mentions-legales" element={<MentionsLegales />} />
          <Route path="/confidentialite" element={<PolitiqueConfidentialite />} />
          <Route path="/cgu" element={<ConditionsUtilisation />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route path="/quiz" element={<Quiz />} />
          <Route path="/quiz/resultat" element={<QuizResultat />} />
          <Route
            path="/profil"
            element={
              <ProtectedRoute>
                <Profil />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <AdminRoute>
                <Admin />
              </AdminRoute>
            }
          />
        </Routes>
      </Suspense>
    </Layout>
  );
}
