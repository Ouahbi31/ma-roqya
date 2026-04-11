// Endpoint /api/admin/stripe-refund
// POST { paymentIntentId, amount? } → crée un refund Stripe
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';
import { requireAdmin, setCors } from '../_lib/admin-auth.js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  httpClient: Stripe.createFetchHttpClient(),
  apiVersion: '2024-06-20',
});
const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { persistSession: false } }
);

export default async function handler(req, res) {
  setCors(res);
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const auth = await requireAdmin(req);
  if (!auth.ok) return res.status(auth.status).json({ error: auth.error });

  try {
    const { paymentIntentId, amount, reservationId } = req.body || {};
    if (!paymentIntentId) return res.status(400).json({ error: 'paymentIntentId is required' });

    const refundParams = { payment_intent: paymentIntentId };
    if (amount && Number.isFinite(amount)) refundParams.amount = Math.round(amount);

    const refund = await stripe.refunds.create(refundParams);

    // Si une réservation Supabase est liée, on la passe en remboursee
    if (reservationId) {
      const { error: updErr } = await supabase
        .from('reservations')
        .update({ statut: 'remboursee' })
        .eq('id', reservationId);
      if (updErr) console.error('Failed to update reservation status:', updErr);
    }

    return res.status(200).json({
      success: true,
      refund: {
        id: refund.id,
        amount: refund.amount / 100,
        status: refund.status,
        currency: refund.currency,
        created: refund.created,
      },
    });
  } catch (err) {
    console.error('stripe-refund error:', err);
    return res.status(500).json({ error: err.message || 'Internal server error' });
  }
}
