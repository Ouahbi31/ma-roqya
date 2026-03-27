import { useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function ReservationConfirmee() {
  useEffect(() => {
    // Scroll to top on mount
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-cream flex items-center justify-center px-4 py-20">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 text-center">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-green-islamic/10">
          <svg className="h-8 w-8 text-green-islamic" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>

        <h1 className="font-heading text-2xl font-bold text-green-islamic mb-2">
          Réservation confirmée !
        </h1>

        <p className="text-text-secondary mb-6">
          Assalamu alaykum, votre séance a été réservée avec succès.
          Vous allez recevoir un email de confirmation avec tous les détails.
        </p>

        <div className="rounded-xl bg-green-islamic/5 border border-green-islamic/15 p-4 mb-6 text-sm text-text-secondary">
          <p className="font-semibold text-green-islamic mb-2">Prochaines étapes :</p>
          <ul className="text-left space-y-2">
            <li>📧 Vérifiez votre boîte mail (et les spams)</li>
            <li>🔗 Le lien de la visioconférence vous sera envoyé avant la séance</li>
            <li>🤲 Préparez vos questions et faites des douas</li>
          </ul>
        </div>

        <Link
          to="/"
          className="inline-block rounded-xl bg-green-islamic px-6 py-3 text-sm font-semibold text-white transition hover:bg-gold"
        >
          Retour à l'accueil
        </Link>
      </div>
    </div>
  );
}
