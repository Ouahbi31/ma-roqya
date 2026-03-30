import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2, BookOpen, Shield } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import SEO from '../components/SEO';

export default function PremiumSuccess() {
  const fetchProfile = useAuthStore((s) => s.fetchProfile);

  // Re-fetch profile to get updated is_premium status
  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  return (
    <div className="min-h-screen bg-cream">
      <SEO
        title="Abonnement Premium activé - MaRoqya"
        description="Votre abonnement MaRoqya Premium est activé. Accédez à tous les programmes, douas et contenus exclusifs."
        noindex={true}
      />
      <div className="mx-auto max-w-2xl px-4 py-20 text-center">
        {/* Green checkmark */}
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-islamic/10">
          <CheckCircle2 className="h-10 w-10 text-green-islamic" />
        </div>

        {/* Heading */}
        <h1 className="font-heading text-3xl font-bold text-green-islamic sm:text-4xl">
          Bienvenue dans MaRoqya Premium !
        </h1>

        {/* Message */}
        <p className="mx-auto mt-4 max-w-md text-lg text-text-secondary">
          Votre abonnement est activ&eacute;. Vous avez maintenant acc&egrave;s &agrave; tout le contenu.
        </p>

        {/* Motivational quote */}
        <div className="mx-auto mt-8 max-w-md rounded-2xl border border-cream-dark bg-white/60 p-6">
          <p className="text-lg leading-relaxed text-green-islamic" dir="rtl" style={{ fontFamily: "'Amiri', 'Times New Roman', serif" }}>
            {'\u0648\u064E\u0646\u064F\u0646\u064E\u0632\u0651\u0650\u0644\u064F \u0645\u0650\u0646\u064E \u0627\u0644\u0642\u064F\u0631\u0652\u0622\u0646\u0650 \u0645\u0627 \u0647\u064F\u0648\u064E \u0634\u0650\u0641\u0627\u0621\u064C \u0648\u064E\u0631\u064E\u062D\u0652\u0645\u064E\u0629\u064C \u0644\u0650\u0644\u0652\u0645\u064F\u0624\u0652\u0645\u0650\u0646\u064A\u0646\u064E'}
          </p>
          <p className="mt-2 text-sm italic text-text-secondary">
            Sourate Al-Isra, 17:82
          </p>
        </div>

        {/* CTA Buttons */}
        <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:justify-center">
          <Link
            to="/programme"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-green-islamic px-8 py-3.5 font-semibold text-white transition hover:opacity-90"
          >
            <Shield size={20} />
            Acc&eacute;der au Programme
          </Link>
          <Link
            to="/douas"
            className="inline-flex items-center justify-center gap-2 rounded-xl border-2 border-green-islamic px-8 py-3.5 font-semibold text-green-islamic transition hover:bg-green-islamic hover:text-white"
          >
            <BookOpen size={20} />
            D&eacute;couvrir les Douas
          </Link>
        </div>
      </div>
    </div>
  );
}
