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
    const { nom, email, telephone, notes, date_reservation, heure, type_seance, user_id } = req.body;

    if (!nom || !email || !date_reservation || !heure || !type_seance) {
      return res.status(400).json({ error: 'Champs obligatoires manquants' });
    }

    if (!['individuel', 'couple'].includes(type_seance)) {
      return res.status(400).json({ error: 'Type de séance invalide' });
    }

    // Format date for display
    const dateObj = new Date(date_reservation + 'T00:00:00');
    const joursSemaine = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
    const mois = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'];
    const dateFormatted = `${joursSemaine[dateObj.getDay()]} ${dateObj.getDate()} ${mois[dateObj.getMonth()]} ${dateObj.getFullYear()}`;

    // Préparer les notes enrichies avec le type de séance si pas de colonne dédiée
    const notesEnriched = [
      `Type de séance : ${type_seance === 'couple' ? 'Coaching de couple' : 'Coaching individuel'}`,
      notes ? `\nNotes : ${notes}` : '',
    ].join('');

    // Prix en centimes
    const montantCentimes = type_seance === 'couple' ? 6500 : 5000;

    // Create reservation in DB with pending status
    const insertData = {
      nom,
      email,
      telephone: telephone || null,
      notes: notesEnriched,
      date_reservation,
      heure,
      user_id: user_id || null,
      statut: 'en_attente',
      montant: montantCentimes,
    };

    // Essayer d'insérer avec la colonne type_seance si elle existe
    let reservation;
    let dbError;

    const resultWithTypeSeance = await supabase
      .from('reservations')
      .insert({ ...insertData, type_seance })
      .select()
      .single();

    if (resultWithTypeSeance.error) {
      // Si erreur sur type_seance (colonne inexistante), insérer sans
      const resultWithout = await supabase
        .from('reservations')
        .insert(insertData)
        .select()
        .single();
      reservation = resultWithout.data;
      dbError = resultWithout.error;
    } else {
      reservation = resultWithTypeSeance.data;
      dbError = null;
    }

    if (dbError) {
      console.error('DB Error:', dbError);
      return res.status(500).json({ error: 'Erreur de base de données' });
    }

    const nomProduit = `Séance coaching ${type_seance === 'couple' ? 'de couple' : 'individuelle'} — CoachMyNefs`;

    // Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      customer_email: email,
      line_items: [
        {
          price_data: {
            currency: 'eur',
            product_data: {
              name: nomProduit,
              description: `${dateFormatted} à ${heure} — Visioconférence / Appel vocal`,
            },
            unit_amount: type_seance === 'couple' ? 6500 : 5000, // 65€ couple / 50€ individuel
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${req.headers.origin || 'https://ma-roqya.fr'}/coaching/reserver?success=1`,
      cancel_url: `${req.headers.origin || 'https://ma-roqya.fr'}/coaching/reserver`,
      metadata: {
        reservation_id: reservation.id,
        nom,
        email,
        date_reservation,
        heure,
        type_seance,
        admin_email: 'coachmynefs@gmail.com',
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
