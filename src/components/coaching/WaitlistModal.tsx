import { useState } from 'react';
import { X, Bell, CheckCircle2, Loader2, AlertCircle } from 'lucide-react';

interface WaitlistModalProps {
  programmeTitle: string;
  programmeSlug: string;
  onClose: () => void;
}

export default function WaitlistModal({ programmeTitle, programmeSlug, onClose }: WaitlistModalProps) {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'already' | 'error'>('idle');
  const [result, setResult] = useState<{ position: number; discountPercent: number } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');

    try {
      const res = await fetch('/api/waitlist-join', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, programmeSlug }),
      });
      const data = await res.json();

      if (res.status === 409) {
        setStatus('already');
        return;
      }
      if (!res.ok) {
        setStatus('error');
        return;
      }

      setResult({ position: data.position, discountPercent: data.discountPercent });
      setStatus('success');
    } catch {
      setStatus('error');
    }
  };

  const getDiscountLabel = (_pos: number, pct: number) => {
    if (pct === 50) return { badge: '🥇 Tarif Fondateur', text: `Félicitations ! Vous êtes parmi les 10 premiers — vous bénéficierez de -50% au lancement.` };
    if (pct === 30) return { badge: '🥈 Early Bird', text: `Vous bénéficierez de -30% au lancement — réservé aux 50 premiers inscrits.` };
    return { badge: '✅ Inscrit(e)', text: `Vous serez parmi les premiers avertis dès que le programme sera disponible.` };
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden">

        {/* Header */}
        <div className="bg-green-islamic px-6 py-5">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white/70 hover:text-white transition"
          >
            <X className="h-5 w-5" />
          </button>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/20">
              <Bell className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="text-xs text-white/70 uppercase tracking-wide font-semibold">Avant-première</p>
              <h2 className="font-heading text-lg font-bold text-white leading-snug">{programmeTitle}</h2>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="px-6 py-6">

          {/* Idle / formulaire */}
          {(status === 'idle' || status === 'loading' || status === 'error') && (
            <>
              <p className="text-sm text-text-secondary leading-relaxed mb-1">
                Ce programme arrive bientôt. Inscrivez-vous maintenant pour être parmi les premiers avertis et recevoir une remise exclusive au lancement.
              </p>

              {/* Paliers */}
              <div className="mt-4 mb-5 space-y-2">
                <div className="flex items-center gap-2 text-xs text-text-secondary">
                  <span className="text-base">🥇</span>
                  <span><strong className="text-text-primary">10 premiers</strong> → <strong className="text-gold">-50%</strong> au lancement</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-text-secondary">
                  <span className="text-base">🥈</span>
                  <span><strong className="text-text-primary">Places 11 à 50</strong> → <strong className="text-gold">-30%</strong> au lancement</span>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-3">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="votre@email.com"
                  className="w-full rounded-xl border border-cream-dark bg-cream px-4 py-3 text-sm text-text-primary placeholder:text-text-secondary/60 focus:outline-none focus:ring-2 focus:ring-gold/40"
                />
                <button
                  type="submit"
                  disabled={status === 'loading'}
                  className="w-full flex items-center justify-center gap-2 rounded-xl bg-gold px-5 py-3 text-sm font-bold text-white transition hover:opacity-90 active:scale-[0.98] disabled:opacity-60"
                >
                  {status === 'loading' ? (
                    <><Loader2 className="h-4 w-4 animate-spin" /> Inscription…</>
                  ) : (
                    <><Bell className="h-4 w-4" /> Réserver ma place en avant-première</>
                  )}
                </button>
              </form>

              {status === 'error' && (
                <p className="mt-3 flex items-center gap-1.5 text-xs text-red-500">
                  <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                  Une erreur est survenue. Veuillez réessayer.
                </p>
              )}
            </>
          )}

          {/* Déjà inscrit */}
          {status === 'already' && (
            <div className="text-center py-4">
              <CheckCircle2 className="h-12 w-12 text-gold mx-auto mb-3" />
              <p className="font-heading font-bold text-text-primary">Vous êtes déjà inscrit(e) !</p>
              <p className="mt-2 text-sm text-text-secondary">Votre place sur la liste d'attente est bien enregistrée. Vous recevrez un email dès le lancement.</p>
              <button onClick={onClose} className="mt-5 text-sm text-gold font-semibold hover:underline">Fermer</button>
            </div>
          )}

          {/* Succès */}
          {status === 'success' && result && (() => {
            const { badge, text } = getDiscountLabel(result.position, result.discountPercent);
            return (
              <div className="text-center py-4">
                <CheckCircle2 className="h-12 w-12 text-green-islamic mx-auto mb-3" />
                <span className="inline-block rounded-full bg-gold/10 border border-gold/30 px-3 py-1 text-xs font-bold text-gold mb-3">
                  {badge}
                </span>
                <p className="font-heading text-lg font-bold text-text-primary">Votre place est réservée !</p>
                <p className="mt-2 text-sm text-text-secondary leading-relaxed">{text}</p>
                <p className="mt-3 text-xs text-text-secondary">Un email de confirmation vient d'être envoyé à <strong>{email}</strong>.</p>
                <button onClick={onClose} className="mt-5 text-sm text-gold font-semibold hover:underline">Fermer</button>
              </div>
            );
          })()}

        </div>
      </div>
    </div>
  );
}
