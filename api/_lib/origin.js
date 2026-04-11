// Helper de sécurité : valide l'origin d'une requête contre une whitelist
// Utilisé pour empêcher les open redirects sur les endpoints Stripe checkout.

const ALLOWED_ORIGINS = [
  'https://coachmynefs.com',
  'https://www.coachmynefs.com',
  'https://ma-roqya.fr',
  'https://www.ma-roqya.fr',
  'http://localhost:5173',
  'http://localhost:3000',
];

const DEFAULT_ORIGIN = 'https://coachmynefs.com';

/**
 * Retourne une origin sûre pour construire les URLs de redirection.
 * Si l'origin de la requête est dans la whitelist, on l'utilise.
 * Sinon on renvoie l'origin par défaut.
 */
export function safeOrigin(req) {
  const origin = req.headers?.origin || req.headers?.Origin;
  if (origin && ALLOWED_ORIGINS.includes(origin)) {
    return origin;
  }
  return DEFAULT_ORIGIN;
}
