import { useEffect, lazy, Suspense, Component, type ReactNode } from 'react';
import { Routes, Route } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from './store/authStore';
import Layout from './components/layout/Layout';
import ScrollToTop from './components/ScrollToTop';
import ProtectedRoute from './components/auth/ProtectedRoute';
import AdminRoute from './components/auth/AdminRoute';

// ─── Pages principales : chargées directement (pas de lazy)
// Évite le problème Service Worker / chunk hash périmé après déploiement
import Home from './pages/Home';
import Programme from './pages/Programme';
import Articles from './pages/Articles';
import Forum from './pages/Forum';
import Douas from './pages/Douas';
import Videos from './pages/Videos';
import Quiz from './pages/Quiz';
import Tarifs from './pages/Tarifs';

// ─── Pages secondaires : lazy (visitées moins souvent)
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const ArticleDetail = lazy(() => import('./pages/ArticleDetail'));
const QuizResultat = lazy(() => import('./pages/QuizResultat'));
const ForumPostPage = lazy(() => import('./pages/ForumPostPage'));
const Profil = lazy(() => import('./pages/Profil'));
const Admin = lazy(() => import('./pages/Admin'));
const ReservationConfirmee = lazy(() => import('./pages/ReservationConfirmee'));
const QuiSuisJe = lazy(() => import('./pages/QuiSuisJe'));
const PremiumSuccess = lazy(() => import('./pages/PremiumSuccess'));
const MentionsLegales = lazy(() => import('./pages/MentionsLegales'));
const PolitiqueConfidentialite = lazy(() => import('./pages/PolitiqueConfidentialite'));
const ConditionsUtilisation = lazy(() => import('./pages/ConditionsUtilisation'));

// ─── Spinner léger pour les pages secondaires
function PageLoader() {
  return (
    <div className="flex min-h-[50vh] items-center justify-center">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-cream-dark border-t-green-islamic" />
    </div>
  );
}

// ─── Error boundary : si un chunk lazy échoue (hash périmé après déploiement)
//     → reload automatique de la page pour récupérer le nouveau bundle
interface EBState { hasError: boolean }
class ChunkErrorBoundary extends Component<{ children: ReactNode }, EBState> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidCatch() {
    // Reload une seule fois pour récupérer le nouveau bundle
    if (!sessionStorage.getItem('chunk_reloaded')) {
      sessionStorage.setItem('chunk_reloaded', '1');
      window.location.reload();
    }
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-[50vh] items-center justify-center">
          <div className="text-center p-8">
            <p className="text-text-secondary text-sm">Chargement en cours…</p>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
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

  // Réinitialiser le flag de reload à chaque navigation réussie
  useEffect(() => {
    sessionStorage.removeItem('chunk_reloaded');
  }, []);

  return (
    <Layout>
      <ScrollToTop />
      <ChunkErrorBoundary>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            {/* Pages principales — chargement immédiat */}
            <Route path="/" element={<Home />} />
            <Route path="/programme" element={<Programme />} />
            <Route path="/articles" element={<Articles />} />
            <Route path="/articles/:id" element={<ArticleDetail />} />
            <Route path="/forum" element={<Forum />} />
            <Route path="/forum/:id" element={<ForumPostPage />} />
            <Route path="/douas" element={<Douas />} />
            <Route path="/videos" element={<Videos />} />
            <Route path="/quiz" element={<Quiz />} />
            <Route path="/quiz/resultat" element={<QuizResultat />} />
            <Route path="/tarifs" element={<Tarifs />} />

            {/* Pages secondaires — lazy */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/reservation-confirmee" element={<ReservationConfirmee />} />
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
      </ChunkErrorBoundary>
    </Layout>
  );
}
