import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  httpClient: Stripe.createFetchHttpClient(),
  apiVersion: '2024-06-20',
});
const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export const config = {
  api: {
    bodyParser: false,
  },
};

async function buffer(readable) {
  const chunks = [];
  for await (const chunk of readable) {
    chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk);
  }
  return Buffer.concat(chunks);
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const buf = await buffer(req);
  const sig = req.headers['stripe-signature'];

  let event;
  try {
    if (process.env.STRIPE_WEBHOOK_SECRET) {
      event = stripe.webhooks.constructEvent(buf, sig, process.env.STRIPE_WEBHOOK_SECRET);
    } else {
      event = JSON.parse(buf.toString());
    }
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).json({ error: `Webhook Error: ${err.message}` });
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;

    // ═══ SUBSCRIPTION: activate premium ═══
    if (session.mode === 'subscription') {
      const customerEmail = session.customer_email;
      if (customerEmail) {
        const { error: premiumError } = await supabase
          .from('profiles')
          .update({ is_premium: true })
          .eq('email', customerEmail);

        if (premiumError) {
          console.error('Premium activation error:', premiumError);
        } else {
          console.log(`Premium activated for ${customerEmail}`);
        }
      }
      // Don't process reservation logic for subscriptions
      return res.status(200).json({ received: true });
    }

    // ═══ RESERVATION: existing booking logic ═══
    // Update reservation status
    const { error } = await supabase
      .from('reservations')
      .update({
        statut: 'payee',
        stripe_payment_intent: session.payment_intent,
      })
      .eq('stripe_session_id', session.id);

    if (error) {
      console.error('DB update error:', error);
    }

    // Send notification email to admin
    try {
      const metadata = session.metadata || {};
      await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: 'CoachMyNefs <noreply@coachmynefs.com>',
          to: 'coachmynefs@gmail.com',
          subject: `✅ Nouvelle réservation — ${metadata.nom || 'Client'}`,
          html: `
            <h2>Nouvelle réservation confirmée</h2>
            <p><strong>Client :</strong> ${metadata.nom || 'N/A'}</p>
            <p><strong>Email :</strong> ${session.customer_email || 'N/A'}</p>
            <p><strong>Date :</strong> ${metadata.date_reservation || 'N/A'}</p>
            <p><strong>Heure :</strong> ${metadata.heure || 'N/A'}</p>
            <p><strong>Montant :</strong> ${(session.amount_total / 100).toFixed(2)}€</p>
            <hr />
            <p><a href="https://coachmynefs.com/admin">Voir dans l'administration</a></p>
          `,
        }),
      });
    } catch (emailErr) {
      console.error('Email error:', emailErr);
    }

    // Send confirmation email to client
    try {
      const metadata = session.metadata || {};
      const typeSeance = metadata.type_seance === 'couple' ? 'de couple' : 'individuelle';
      const montantEur = ((session.amount_total || 0) / 100).toFixed(2);
      await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: 'CoachMyNefs <noreply@coachmynefs.com>',
          to: session.customer_email,
          subject: 'Votre réservation CoachMyNefs est confirmée ✅',
          html: `
            <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;padding:24px;color:#1a1a1a;">
              <h2 style="color:#2d6a4f;">Assalamu alaykum ${metadata.nom || ''},</h2>
              <p>Votre séance de coaching <strong>${typeSeance}</strong> est confirmée. Voici le récapitulatif :</p>

              <div style="background:#f9f5ef;border-radius:12px;padding:20px;margin:20px 0;">
                <p style="margin:6px 0;"><strong>📅 Date :</strong> ${metadata.date_reservation || 'N/A'}</p>
                <p style="margin:6px 0;"><strong>🕐 Heure :</strong> ${metadata.heure || 'N/A'}</p>
                <p style="margin:6px 0;"><strong>⏱ Durée :</strong> 1 heure</p>
                <p style="margin:6px 0;"><strong>💶 Montant réglé :</strong> ${montantEur}€</p>
              </div>

              <div style="background:#fff8e1;border:2px solid #d4a017;border-radius:12px;padding:20px;margin:20px 0;text-align:center;">
                <p style="margin:0 0 12px;font-size:16px;font-weight:bold;">🎥 Rejoindre la séance Google Meet</p>
                <a href="https://meet.google.com/uat-dxgw-avc"
                   style="display:inline-block;background:#d4a017;color:#fff;padding:12px 28px;border-radius:8px;text-decoration:none;font-weight:bold;font-size:15px;">
                  Cliquez ici pour rejoindre →
                </a>
                <p style="margin:12px 0 0;font-size:12px;color:#666;">
                  Lien : https://meet.google.com/uat-dxgw-avc<br/>
                  Aucune application requise — fonctionne depuis votre navigateur
                </p>
              </div>

              <p style="color:#555;font-size:14px;">⚠️ Merci d'être disponible 5 minutes avant l'heure prévue.</p>
              <p>Qu'Allah vous bénisse dans votre démarche. 🤲</p>
              <p style="color:#888;font-size:13px;">— Dr Fère Muz · CoachMyNefs</p>
            </div>
          `,
        }),
      });
    } catch (emailErr) {
      console.error('Client email error:', emailErr);
    }
  }

  // ═══ SUBSCRIPTION DELETED: deactivate premium ═══
  if (event.type === 'customer.subscription.deleted') {
    const subscription = event.data.object;
    try {
      const customer = await stripe.customers.retrieve(subscription.customer);
      if (customer && customer.email) {
        const { error: deactivateError } = await supabase
          .from('profiles')
          .update({ is_premium: false })
          .eq('email', customer.email);

        if (deactivateError) {
          console.error('Premium deactivation error:', deactivateError);
        } else {
          console.log(`Premium deactivated for ${customer.email}`);
        }
      }
    } catch (err) {
      console.error('Error handling subscription deletion:', err);
    }
  }

  // ═══ INVOICE PAYMENT FAILED ═══
  if (event.type === 'invoice.payment_failed') {
    const invoice = event.data.object;
    console.error(`Payment failed for customer ${invoice.customer}, invoice ${invoice.id}`);
  }

  return res.status(200).json({ received: true });
}
