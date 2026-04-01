import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2, BookOpen, Shield, Crown } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import SEO from '../components/SEO';

// Simple CSS confetti using random colored spans
function Confetti() {
  const [particles] = useState(() =>
    Array.from({ length: 40 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 1.5,
      duration: 1.8 + Math.random() * 1.2,
      color: ['#2E6AB8', '#B8860B', '#2D6A4F', '#C0392B', '#8E44AD', '#16A085'][
        Math.floor(Math.random() * 6)
      ],
      size: 6 + Math.random() * 6,
      rotate: Math.random() * 360,
    }))
  );

  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden" aria-hidden="true">
      {particles.map((p) => (
        <span
          key={p.id}
          style={{
            position: 'absolute',
            left: `${p.left}%`,
            top: '-10px',
            width: p.size,
            height: p.size,
            background: p.color,
            borderRadius: Math.random() > 0.5 ? '50%' : '2px',
            transform: `rotate(${p.rotate}deg)`,
            animation: `confettiFall ${p.duration}s ${p.delay}s ease-in forwards`,
          }}
        />
      ))}
      <style>{`
        @keyframes confettiFall {
          0%   { transform: translateY(0) rotate(0deg); opacity: 1; }
          100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
        }
      `}</style>
    </div>
  );
}

export default function PremiumSuccess() {
  const fetchProfile = useAuthStore((s) => s.fetchProfile);
  const [showConfetti, setShowConfetti] = useState(true);

  // Re-fetch profile to get updated is_premium status
  useEffect(() => {
    fetchProfile();
    // Hide confetti after 4s
    const t = setTimeout(() => setShowConfetti(false), 4000);
    return () => clearTimeout(t);
  }, [fetchProfile]);

  return (
    <div className="min-h-screen bg-cream">
      <SEO
        title="Abonnement Premium activé - CoachMyNefs"
        description="Votre abonnement CoachMyNefs Premium est activé. Accédez à tous les programmes, douas et contenus exclusifs."
        noindex={true}
      />

      {showConfetti && <Confetti />}

      <div className="mx-auto max-w-2xl px-4 py-20 text-center">
        {/* Crown icon animated */}
        <div
          className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-gold/10"
          style={{ animation: 'bounceIn 0.6s ease-out' }}
        >
          <Crown className="h-10 w-10 text-gold" />
        </div>

        {/* Green checkmark */}
        <div
          className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-green-islamic/10"
          style={{ animation: 'bounceIn 0.6s 0.15s ease-out both' }}
        >
          <CheckCircle2 className="h-8 w-8 text-green-islamic" />
        </div>

        {/* Heading */}
        <h1
          className="font-heading text-3xl font-bold text-green-islamic sm:text-4xl"
          style={{ animation: 'fadeInUp 0.5s 0.3s ease-out both' }}
        >
          Bienvenue dans CoachMyNefs Premium !
        </h1>

        {/* Message */}
        <p
          className="mx-auto mt-4 max-w-md text-lg text-text-secondary"
          style={{ animation: 'fadeInUp 0.5s 0.45s ease-out both' }}
        >
          Votre abonnement est activé. Vous avez maintenant accès à tout le contenu exclusif.
        </p>

        {/* What's included */}
        <div
          className="mx-auto mt-8 max-w-sm space-y-2 text-left"
          style={{ animation: 'fadeInUp 0.5s 0.55s ease-out both' }}
        >
          {[
            'Programme complet 30 jours',
            'Toutes les douas débloquées',
            'Journal guidé & suivi d\'évolution',
            'Conseils personnalisés',
          ].map((item) => (
            <div key={item} className="flex items-center gap-3 rounded-xl bg-white/70 px-4 py-3">
              <CheckCircle2 className="h-5 w-5 shrink-0 text-green-islamic" />
              <span className="text-sm font-medium text-text-primary">{item}</span>
            </div>
          ))}
        </div>

        {/* Motivational quote */}
        <div
          className="mx-auto mt-8 max-w-md rounded-2xl border border-cream-dark bg-white/60 p-6"
          style={{ animation: 'fadeInUp 0.5s 0.7s ease-out both' }}
        >
          <p
            className="text-lg leading-relaxed text-green-islamic"
            dir="rtl"
            style={{ fontFamily: "'Amiri', 'Times New Roman', serif" }}
          >
            وَنُنَزِّلُ مِنَ الْقُرْآنِ مَا هُوَ شِفَاءٌ وَرَحْمَةٌ لِّلْمُؤْمِنِينَ
          </p>
          <p className="mt-2 text-sm italic text-text-secondary">Sourate Al-Isra, 17:82</p>
        </div>

        {/* CTA Buttons */}
        <div
          className="mt-10 flex flex-col gap-4 sm:flex-row sm:justify-center"
          style={{ animation: 'fadeInUp 0.5s 0.85s ease-out both' }}
        >
          <Link
            to="/programme"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-green-islamic px-8 py-3.5 font-semibold text-white transition hover:opacity-90"
          >
            <Shield size={20} />
            Accéder au Programme
          </Link>
          <Link
            to="/douas"
            className="inline-flex items-center justify-center gap-2 rounded-xl border-2 border-green-islamic px-8 py-3.5 font-semibold text-green-islamic transition hover:bg-green-islamic hover:text-white"
          >
            <BookOpen size={20} />
            Découvrir les Douas
          </Link>
        </div>
      </div>

      <style>{`
        @keyframes bounceIn {
          0%   { transform: scale(0.5); opacity: 0; }
          70%  { transform: scale(1.1); opacity: 1; }
          100% { transform: scale(1); }
        }
        @keyframes fadeInUp {
          from { transform: translateY(20px); opacity: 0; }
          to   { transform: translateY(0);    opacity: 1; }
        }
      `}</style>
    </div>
  );
}
