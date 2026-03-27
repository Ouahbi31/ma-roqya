import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { User, Crown, Lock } from 'lucide-react';
import { useAuthStore } from '../store/authStore';

export default function Profil() {
  const { t } = useTranslation();
  const profile = useAuthStore((s) => s.profile);
  const user = useAuthStore((s) => s.user);
  const [prenom, setPrenom] = useState(profile?.prenom || '');

  return (
    <div className="min-h-screen bg-cream px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-2xl">
        <h1 className="mb-8 font-heading text-3xl font-bold text-green-islamic">{t('profile.title')}</h1>

        {/* Profile info */}
        <div className="card-islamic mb-6 p-6">
          <div className="mb-6 flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-islamic/10">
              <User size={28} className="text-green-islamic" />
            </div>
            <div>
              <p className="font-heading text-xl font-bold text-text-primary">{profile?.prenom}</p>
              <p className="text-sm text-text-secondary">{user?.email}</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-text-secondary">{t('auth.firstname')}</label>
              <input
                type="text"
                value={prenom}
                onChange={(e) => setPrenom(e.target.value)}
                className="w-full rounded-lg border border-cream-dark bg-cream px-4 py-3 text-base text-text-primary outline-none focus:border-green-islamic"
              />
            </div>
            <button className="btn-primary text-sm">{t('profile.update')}</button>
          </div>
        </div>

        {/* Subscription */}
        <div className="card-islamic mb-6 p-6">
          <h2 className="mb-4 flex items-center gap-2 font-heading text-lg font-semibold text-text-primary">
            <Crown size={18} className="text-gold" />
            Abonnement
          </h2>
          {profile?.is_premium ? (
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-gold/10 px-4 py-1 text-sm font-medium text-gold">
                Premium actif
              </span>
              <button className="text-sm text-text-secondary hover:text-text-primary">
                {t('profile.manage_subscription')}
              </button>
            </div>
          ) : (
            <div>
              <span className="mb-3 inline-block rounded-full bg-cream-dark px-4 py-1 text-sm text-text-secondary">
                {t('pricing.free_title')}
              </span>
              <p className="mb-3 text-sm text-text-secondary">
                Passez au Premium pour un accompagnement personnalisé.
              </p>
              <Link to="/tarifs" className="btn-primary inline-block text-sm">
                {t('dashboard.premium_banner_cta')}
              </Link>
            </div>
          )}
        </div>

        {/* Change password */}
        <div className="card-islamic p-6">
          <h2 className="mb-4 flex items-center gap-2 font-heading text-lg font-semibold text-text-primary">
            <Lock size={18} className="text-text-secondary" />
            {t('profile.change_password')}
          </h2>
          <div className="space-y-3">
            <input
              type="password"
              placeholder="Nouveau mot de passe"
              className="w-full rounded-lg border border-cream-dark bg-cream px-4 py-3 text-base text-text-primary outline-none focus:border-green-islamic"
            />
            <input
              type="password"
              placeholder="Confirmer le mot de passe"
              className="w-full rounded-lg border border-cream-dark bg-cream px-4 py-3 text-base text-text-primary outline-none focus:border-green-islamic"
            />
            <button className="btn-primary text-sm">{t('profile.update')}</button>
          </div>
        </div>
      </div>
    </div>
  );
}
