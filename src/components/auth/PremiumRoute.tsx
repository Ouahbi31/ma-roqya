import type { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '../../store/authStore';

interface PremiumRouteProps {
  children: ReactNode;
}

export default function PremiumRoute({ children }: PremiumRouteProps) {
  const { t } = useTranslation();
  const { user, profile, loading } = useAuthStore();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-cream-dark border-t-green-islamic" />
          <p className="text-sm text-text-secondary">{t('common.loading')}</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!profile?.is_premium) {
    return <Navigate to="/tarifs" replace />;
  }

  return <>{children}</>;
}
