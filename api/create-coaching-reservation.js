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
      success_url: `${req.headers.origin || 'https://coachmynefs.com'}/coaching/reserver?success=1`,
      cancel_url: `${req.headers.origin || 'https://coachmynefs.com'}/coaching/reserver`,
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

    // Send notification email to admin (immediately on booking, even before payment)
    try {
      if (process.env.RESEND_API_KEY) {
        const montantEur = (montantCentimes / 100).toFixed(2);
        await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            from: 'CoachMyNefs <noreply@coachmynefs.com>',
            to: 'coachmynefs@gmail.com',
            subject: `🆕 Nouvelle réservation (en attente de paiement) — ${nom}`,
            html: `
              <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;padding:24px;color:#1a1a1a;">
                <h2 style="color:#2d6a4f;">Nouvelle demande de réservation</h2>
                <p>Un client vient de remplir le formulaire de réservation. Statut : <strong>en attente de paiement</strong>.</p>
                <div style="background:#f9f5ef;border-radius:12px;padding:20px;margin:20px 0;">
                  <p style="margin:6px 0;"><strong>👤 Client :</strong> ${nom}</p>
                  <p style="margin:6px 0;"><strong>📧 Email :</strong> ${email}</p>
                  ${telephone ? `<p style="margin:6px 0;"><strong>📞 Téléphone :</strong> ${telephone}</p>` : ''}
                  <p style="margin:6px 0;"><strong>📅 Date :</strong> ${dateFormatted}</p>
                  <p style="margin:6px 0;"><strong>🕐 Heure :</strong> ${heure}</p>
                  <p style="margin:6px 0;"><strong>💶 Montant :</strong> ${montantEur}€</p>
                  <p style="margin:6px 0;"><strong>📝 Type :</strong> Coaching ${type_seance === 'couple' ? 'de couple' : 'individuel'}</p>
                  ${notes ? `<p style="margin:6px 0;"><strong>💬 Notes :</strong> ${notes}</p>` : ''}
                </div>
                <p style="color:#888;font-size:13px;">Si le client paie via Stripe, le statut passera automatiquement à "payée". Sinon (PayPal, virement…), tu peux le marquer manuellement depuis l'admin.</p>
                <p><a href="https://coachmynefs.com/admin" style="display:inline-block;background:#2d6a4f;color:#fff;padding:10px 20px;border-radius:8px;text-decoration:none;font-weight:bold;">Voir dans l'administration →</a></p>
              </div>
            `,
          }),
        });
      }
    } catch (emailErr) {
      console.error('Admin email error (non-blocking):', emailErr);
    }

    return res.status(200).json({ url: session.url });
  } catch (err) {
    console.error('Stripe Error:', err);
    return res.status(500).json({ error: err.message });
  }
}
