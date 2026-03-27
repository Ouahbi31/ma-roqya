import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { nom, email, telephone, notes, date_reservation, heure, user_id } = req.body;

    if (!nom || !email || !date_reservation || !heure) {
      return res.status(400).json({ error: 'Champs obligatoires manquants' });
    }

    // Create reservation in DB with pending status
    const { data: reservation, error: dbError } = await supabase
      .from('reservations')
      .insert({
        nom,
        email,
        telephone: telephone || null,
        notes: notes || null,
        date_reservation,
        heure,
        user_id: user_id || null,
        statut: 'en_attente',
      })
      .select()
      .single();

    if (dbError) {
      console.error('DB Error:', dbError);
      return res.status(500).json({ error: 'Erreur de base de données' });
    }

    // Format date for display
    const dateObj = new Date(date_reservation + 'T00:00:00');
    const joursSemaine = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
    const mois = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'];
    const dateFormatted = `${joursSemaine[dateObj.getDay()]} ${dateObj.getDate()} ${mois[dateObj.getMonth()]} ${dateObj.getFullYear()}`;

    // Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      customer_email: email,
      line_items: [
        {
          price_data: {
            currency: 'eur',
            product_data: {
              name: 'Séance individuelle MaRoqya',
              description: `${dateFormatted} à ${heure} — Visioconférence / Appel vocal`,
            },
            unit_amount: 5000, // 50€ in cents
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${req.headers.origin || 'https://ma-roqya.fr'}/reservation-confirmee?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.origin || 'https://ma-roqya.fr'}/tarifs?cancelled=true`,
      metadata: {
        reservation_id: reservation.id,
        nom,
        date_reservation,
        heure,
      },
    });

    // Update reservation with Stripe session ID
    await supabase
      .from('reservations')
      .update({ stripe_session_id: session.id })
      .eq('id', reservation.id);

    return res.status(200).json({ url: session.url });
  } catch (err) {
    console.error('Stripe Error:', err);
    return res.status(500).json({ error: err.message });
  }
}
