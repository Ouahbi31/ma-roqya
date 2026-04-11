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
    if (!paymentIntentId || typeof paymentIntentId !== 'string') {
      return res.status(400).json({ error: 'paymentIntentId is required' });
    }

    // Sécurité : récupérer le payment intent côté Stripe pour valider le montant max
    const pi = await stripe.paymentIntents.retrieve(paymentIntentId);
    if (!pi) return res.status(404).json({ error: 'Payment intent not found' });
    if (pi.status !== 'succeeded') {
      return res.status(400).json({ error: `Cannot refund: payment status is ${pi.status}` });
    }

    const alreadyRefunded = pi.amount_received - (pi.amount_received - (pi.charges?.data?.[0]?.amount_refunded || 0));
    const maxRefundable = pi.amount_received - alreadyRefunded;

    const refundParams = { payment_intent: paymentIntentId };
    if (amount !== undefined && amount !== null) {
      if (!Number.isFinite(amount) || amount <= 0) {
        return res.status(400).json({ error: 'amount must be a positive number' });
      }
      const amountInt = Math.round(amount);
      if (amountInt > maxRefundable) {
        return res.status(400).json({
          error: `Refund amount (${amountInt / 100}€) exceeds refundable amount (${maxRefundable / 100}€)`,
        });
      }
      refundParams.amount = amountInt;
    }

    const refund = await stripe.refunds.create(refundParams);

    // Si une réservation Supabase est liée, on la passe en remboursee
    if (reservationId && typeof reservationId === 'string') {
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
    return res.status(500).json({ error: 'Refund processing error' });
  }
}
