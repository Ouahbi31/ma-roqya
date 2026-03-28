import { Link } from 'react-router-dom';
import { Lock, X } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  action: string;
}

export default function AuthModal({ isOpen, onClose, action }: AuthModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-md rounded-xl bg-cream p-6 shadow-xl sm:p-8">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute right-3 top-3 rounded-lg p-1.5 text-text-secondary transition hover:bg-cream-dark"
        >
          <X size={20} />
        </button>

        <div className="flex flex-col items-center text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gold/10">
            <Lock className="h-7 w-7 text-gold" />
          </div>

          <h2 className="mt-4 font-heading text-xl font-bold text-green-islamic sm:text-2xl">
            Connectez-vous pour continuer
          </h2>

          <p className="mt-2 text-sm text-text-secondary leading-relaxed">
            Créez un compte gratuit pour {action}
          </p>

          <div className="mt-6 flex w-full flex-col gap-3 sm:flex-row">
            <Link
              to="/register"
              className="flex-1 rounded-xl bg-green-islamic px-6 py-3 text-center font-semibold text-white transition hover:opacity-90"
            >
              S'inscrire
            </Link>
            <Link
              to="/login"
              className="flex-1 rounded-xl border-2 border-green-islamic px-6 py-3 text-center font-semibold text-green-islamic transition hover:bg-green-islamic hover:text-white"
            >
              Se connecter
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
