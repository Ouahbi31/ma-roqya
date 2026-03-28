import { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from './store/authStore';
import Layout from './components/layout/Layout';
import ScrollToTop from './components/ScrollToTop';
import ProtectedRoute from './components/auth/ProtectedRoute';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Tarifs from './pages/Tarifs';
import Dashboard from './pages/Dashboard';
import Articles from './pages/Articles';
import ArticleDetail from './pages/ArticleDetail';
import Videos from './pages/Videos';
import Douas from './pages/Douas';
import Quiz from './pages/Quiz';
import QuizResultat from './pages/QuizResultat';
import Forum from './pages/Forum';
import ForumPostPage from './pages/ForumPostPage';
import Profil from './pages/Profil';
import Programme from './pages/Programme';
import Admin from './pages/Admin';
import AdminRoute from './components/auth/AdminRoute';
import ReservationConfirmee from './pages/ReservationConfirmee';
import QuiSuisJe from './pages/QuiSuisJe';
import PremiumSuccess from './pages/PremiumSuccess';
import MentionsLegales from './pages/MentionsLegales';
import PolitiqueConfidentialite from './pages/PolitiqueConfidentialite';
import ConditionsUtilisation from './pages/ConditionsUtilisation';

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
    </Layout>
  );
}
