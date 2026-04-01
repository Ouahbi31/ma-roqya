import { useEffect, lazy, Suspense, Component, type ReactNode } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from './store/authStore';
import Layout from './components/layout/Layout';
import CoachingLayout from './components/layout/CoachingLayout';
import ScrollToTop from './components/ScrollToTop';
import ProtectedRoute from './components/auth/ProtectedRoute';
import AdminRoute from './components/auth/AdminRoute';

// ─── Landing page : chargée directement (page principale, doit être instantanée)
import Landing from './pages/Landing';

// ─── Page Roqya principale : chargée directement
import Home from './pages/Home';

// ─── Pages Roqya secondaires : lazy
const Programme = lazy(() => import('./pages/Programme'));
const Articles = lazy(() => import('./pages/Articles'));
const Forum = lazy(() => import('./pages/Forum'));
const Douas = lazy(() => import('./pages/Douas'));
const Videos = lazy(() => import('./pages/Videos'));
const Tarifs = lazy(() => import('./pages/Tarifs'));
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const ArticleDetail = lazy(() => import('./pages/ArticleDetail'));
const ForumPostPage = lazy(() => import('./pages/ForumPostPage'));
const Profil = lazy(() => import('./pages/Profil'));
const Admin = lazy(() => import('./pages/Admin'));
const ReservationConfirmee = lazy(() => import('./pages/ReservationConfirmee'));
const QuiSuisJe = lazy(() => import('./pages/QuiSuisJe'));
const PremiumSuccess = lazy(() => import('./pages/PremiumSuccess'));
const MentionsLegales = lazy(() => import('./pages/MentionsLegales'));
const PolitiqueConfidentialite = lazy(() => import('./pages/PolitiqueConfidentialite'));
const ConditionsUtilisation = lazy(() => import('./pages/ConditionsUtilisation'));

// ─── Pages Coaching : lazy
const CoachingHome = lazy(() => import('./pages/coaching/CoachingHome'));
const CoachingArticles = lazy(() => import('./pages/coaching/CoachingArticles'));
const CoachingServices = lazy(() => import('./pages/coaching/CoachingServices'));
const CoachingProgrammes = lazy(() => import('./pages/coaching/CoachingProgrammes'));
const CoachingProgrammeDetail = lazy(() => import('./pages/coaching/CoachingProgrammeDetail'));
const CoachingReserver = lazy(() => import('./pages/coaching/CoachingReserver'));

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
    <>
      <ScrollToTop />
      <ChunkErrorBoundary>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            {/* ── Landing page (sans Layout) ── */}
            <Route path="/" element={<Landing />} />

            {/* ── Section Roqya (avec Layout existant) ── */}
            <Route
              path="/roqya"
              element={
                <Layout>
                  <Home />
                </Layout>
              }
            />
            <Route
              path="/programme"
              element={
                <Layout>
                  <Programme />
                </Layout>
              }
            />
            <Route
              path="/articles"
              element={
                <Layout>
                  <Articles />
                </Layout>
              }
            />
            <Route
              path="/articles/:id"
              element={
                <Layout>
                  <ArticleDetail />
                </Layout>
              }
            />
            <Route
              path="/forum"
              element={
                <Layout>
                  <Forum />
                </Layout>
              }
            />
            <Route
              path="/forum/:id"
              element={
                <Layout>
                  <ForumPostPage />
                </Layout>
              }
            />
            <Route
              path="/douas"
              element={
                <Layout>
                  <Douas />
                </Layout>
              }
            />
            <Route
              path="/videos"
              element={
                <Layout>
                  <Videos />
                </Layout>
              }
            />
            <Route
              path="/tarifs"
              element={
                <Layout>
                  <Tarifs />
                </Layout>
              }
            />
            <Route
              path="/qui-suis-je"
              element={
                <Layout>
                  <QuiSuisJe />
                </Layout>
              }
            />
            <Route
              path="/mentions-legales"
              element={
                <Layout>
                  <MentionsLegales />
                </Layout>
              }
            />
            <Route
              path="/confidentialite"
              element={
                <Layout>
                  <PolitiqueConfidentialite />
                </Layout>
              }
            />
            <Route
              path="/cgu"
              element={
                <Layout>
                  <ConditionsUtilisation />
                </Layout>
              }
            />

            {/* ── Section Coaching (avec CoachingLayout) ── */}
            <Route
              path="/coaching"
              element={
                <CoachingLayout>
                  <CoachingHome />
                </CoachingLayout>
              }
            />
            <Route
              path="/coaching/articles"
              element={
                <CoachingLayout>
                  <CoachingArticles />
                </CoachingLayout>
              }
            />
            <Route
              path="/coaching/services"
              element={
                <CoachingLayout>
                  <CoachingServices />
                </CoachingLayout>
              }
            />
            <Route
              path="/coaching/programme"
              element={<Navigate to="/coaching/programmes" replace />}
            />
            <Route
              path="/coaching/programmes"
              element={
                <CoachingLayout>
                  <CoachingProgrammes />
                </CoachingLayout>
              }
            />
            <Route
              path="/coaching/programmes/:slug"
              element={
                <CoachingLayout>
                  <CoachingProgrammeDetail />
                </CoachingLayout>
              }
            />
            <Route
              path="/coaching/reserver"
              element={
                <CoachingLayout>
                  <CoachingReserver />
                </CoachingLayout>
              }
            />
            {/* /coaching/tarifs → redirect vers /tarifs */}
            <Route path="/coaching/tarifs" element={<Navigate to="/tarifs" replace />} />

            {/* ── Pages communes (avec Layout) ── */}
            <Route
              path="/login"
              element={
                <Layout>
                  <Login />
                </Layout>
              }
            />
            <Route
              path="/register"
              element={
                <Layout>
                  <Register />
                </Layout>
              }
            />
            <Route
              path="/reservation-confirmee"
              element={
                <Layout>
                  <ReservationConfirmee />
                </Layout>
              }
            />
            <Route
              path="/premium-success"
              element={
                <Layout>
                  <PremiumSuccess />
                </Layout>
              }
            />
            <Route
              path="/dashboard"
              element={
                <Layout>
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                </Layout>
              }
            />
            <Route
              path="/profil"
              element={
                <Layout>
                  <ProtectedRoute>
                    <Profil />
                  </ProtectedRoute>
                </Layout>
              }
            />
            <Route
              path="/admin"
              element={
                <Layout>
                  <AdminRoute>
                    <Admin />
                  </AdminRoute>
                </Layout>
              }
            />
          </Routes>
        </Suspense>
      </ChunkErrorBoundary>
    </>
  );
}
