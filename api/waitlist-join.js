import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const FROM = 'CoachMyNefs <noreply@ma-roqya.fr>';

// Noms complets des programmes
const PROGRAMME_NAMES = {
  'reprendre-confiance': 'Reprendre confiance en soi',
  'gestion-conflits': 'Gérer les conflits dans le couple',
  'preparer-mariage': 'Préparer son mariage',
  'transformation-nefs': 'Transformation Nefs — 30 jours',
  'education-enfants': 'Relation parents-enfants',
  'sexualite-islam': 'Sexualité en Islam',
};

function buildConfirmationEmail({ email, programmeTitle, position, discountPercent }) {
  const isFounder = position <= 10;
  const hasDiscount = discountPercent > 0;

  const badgeText = isFounder
    ? `🥇 Tarif Fondateur — ${discountPercent}% de remise garantie`
    : hasDiscount
    ? `🥈 Early Bird — ${discountPercent}% de remise garantie`
    : `✅ Vous êtes sur la liste d'attente`;

  const discountBlock = hasDiscount
    ? `
    <div style="background:#f5f0e8;border-left:4px solid #c9a84c;padding:16px 20px;border-radius:8px;margin:24px 0;">
      <p style="margin:0;font-size:15px;color:#6b4c11;font-weight:700;">${badgeText}</p>
      <p style="margin:8px 0 0;font-size:14px;color:#7a6040;">
        Dès que le programme sera disponible, vous recevrez un email avec votre code promo
        <strong>-${discountPercent}%</strong> — réservé uniquement aux ${isFounder ? '10 premiers' : '50 premiers'} inscrits.
      </p>
    </div>`
    : `
    <div style="background:#f0f7f0;border-left:4px solid #2d6a4f;padding:16px 20px;border-radius:8px;margin:24px 0;">
      <p style="margin:0;font-size:14px;color:#2d6a4f;">
        Vous serez parmi les <strong>premiers avertis</strong> dès que le programme sera en ligne.
      </p>
    </div>`;

  return `
<!DOCTYPE html>
<html lang="fr">
<head><meta charset="UTF-8"/></head>
<body style="margin:0;padding:0;background:#f9f6f0;font-family:Georgia,serif;">
  <div style="max-width:560px;margin:40px auto;background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">

    <!-- Header -->
    <div style="background:#2d6a4f;padding:32px 40px;text-align:center;">
      <p style="margin:0;font-size:13px;color:#a8d5be;letter-spacing:2px;text-transform:uppercase;">CoachMyNefs</p>
      <h1 style="margin:12px 0 0;font-size:22px;color:#fff;font-weight:700;">Votre place est réservée !</h1>
    </div>

    <!-- Body -->
    <div style="padding:36px 40px;">
      <p style="font-size:15px;color:#3d3325;line-height:1.7;">
        As-salamu alaykum,
      </p>
      <p style="font-size:15px;color:#3d3325;line-height:1.7;">
        Vous êtes bien inscrit(e) sur la liste d'attente du programme
        <strong style="color:#2d6a4f;">${programmeTitle}</strong>.
      </p>

      ${discountBlock}

      <p style="font-size:14px;color:#7a6e63;line-height:1.7;margin-top:24px;">
        Dès que le programme sera disponible, vous serez parmi les premiers à recevoir le lien
        ${hasDiscount ? 'avec votre code promo exclusif' : ''} — directement dans cette boîte mail.
      </p>

      <p style="font-size:14px;color:#7a6e63;line-height:1.7;">
        En attendant, n'oubliez pas que vous pouvez dès maintenant réserver une <strong>séance de coaching individuel</strong> avec Nefs.
      </p>

      <div style="text-align:center;margin:32px 0;">
        <a href="https://coachmynefs.com/coaching/reserver"
           style="display:inline-block;background:#c9a84c;color:#fff;padding:14px 32px;border-radius:12px;font-size:15px;font-weight:700;text-decoration:none;">
          Réserver une séance →
        </a>
      </div>

      <p style="font-size:13px;color:#b0a090;text-align:center;margin-top:8px;">
        Barakallahu fik 🌿
      </p>
    </div>

    <!-- Footer -->
    <div style="background:#f5f0e8;padding:20px 40px;text-align:center;">
      <p style="margin:0;font-size:12px;color:#a09080;">
        CoachMyNefs — <a href="https://coachmynefs.com" style="color:#c9a84c;text-decoration:none;">coachmynefs.com</a>
      </p>
    </div>
  </div>
</body>
</html>`;
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { email, programmeSlug } = req.body ?? {};

  if (!email || !programmeSlug) {
    return res.status(400).json({ error: 'email et programmeSlug sont requis' });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: 'Adresse email invalide' });
  }

  // Insérer dans la waitlist (le trigger calcule position + remise)
  const { data, error } = await supabase
    .from('waitlist')
    .insert({ email: email.toLowerCase().trim(), programme_slug: programmeSlug })
    .select('position, discount_percent')
    .single();

  if (error) {
    // Déjà inscrit
    if (error.code === '23505') {
      return res.status(409).json({ error: 'already_registered' });
    }
    console.error('Supabase error:', error);
    return res.status(500).json({ error: 'Erreur serveur' });
  }

  const { position, discount_percent } = data;
  const programmeTitle = PROGRAMME_NAMES[programmeSlug] ?? programmeSlug;

  // Envoyer l'email de confirmation
  try {
    await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: FROM,
        to: [email],
        subject: `✅ Votre place est réservée — ${programmeTitle}`,
        html: buildConfirmationEmail({ email, programmeTitle, position, discountPercent: discount_percent }),
      }),
    });
  } catch (emailErr) {
    // L'inscription est OK même si l'email échoue
    console.error('Email error:', emailErr);
  }

  return res.status(200).json({
    success: true,
    position,
    discountPercent: discount_percent,
  });
}
