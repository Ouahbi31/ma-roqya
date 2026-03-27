import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '../store/authStore';

export default function Login() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { login, loginWithGoogle } = useAuthStore();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const result = await login(email, password);
    setLoading(false);

    if (result.error) {
      setError(result.error);
    } else {
      navigate('/dashboard');
    }
  };

  const handleGoogle = async () => {
    await loginWithGoogle();
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-cream px-4 py-12">
      <div className="card-islamic w-full max-w-md p-8">
        <h1 className="font-heading text-center text-3xl font-bold text-green-islamic">
          {t('auth.login_title')}
        </h1>

        {error && (
          <div className="mt-4 rounded-lg bg-red-50 p-3 text-center text-sm text-red-600">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-text-primary"
            >
              {t('auth.email')}
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full rounded-lg border border-cream-dark bg-white px-4 py-3 text-text-primary outline-none transition focus:border-green-islamic focus:ring-1 focus:ring-green-islamic"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-text-primary"
            >
              {t('auth.password')}
            </label>
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full rounded-lg border border-cream-dark bg-white px-4 py-3 text-text-primary outline-none transition focus:border-green-islamic focus:ring-1 focus:ring-green-islamic"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-green-islamic py-3 font-semibold text-white transition hover:opacity-90 disabled:opacity-50"
          >
            {loading ? t('common.loading') : t('auth.login_btn')}
          </button>
        </form>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-cream-dark" />
          </div>
          <div className="relative flex justify-center">
            <span className="bg-white px-3 text-sm text-text-secondary">ou</span>
          </div>
        </div>

        <button
          onClick={handleGoogle}
          className="flex w-full items-center justify-center gap-3 rounded-lg border-2 border-cream-dark bg-white py-3 font-semibold text-text-primary transition hover:border-green-islamic"
        >
          <svg className="h-5 w-5" viewBox="0 0 24 24">
            <path
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
              fill="#4285F4"
            />
            <path
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              fill="#34A853"
            />
            <path
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              fill="#FBBC05"
            />
            <path
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              fill="#EA4335"
            />
          </svg>
          {t('auth.google_btn')}
        </button>

        <p className="mt-6 text-center text-sm text-text-secondary">
          {t('auth.no_account')}{' '}
          <Link to="/register" className="font-semibold text-green-islamic hover:underline">
            {t('nav.register')}
          </Link>
        </p>

        <p className="mt-4 text-center text-xs text-text-secondary">
          {t('auth.privacy_note')}
        </p>
      </div>
    </div>
  );
}
