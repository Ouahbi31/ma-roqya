import { createClient } from '@supabase/supabase-js';
import { requireAdmin } from './_lib/admin-auth.js';

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Sécurité : seuls les admins peuvent envoyer des emails (sinon c'est un spammer paradise)
  const auth = await requireAdmin(req);
  if (!auth.ok) return res.status(auth.status).json({ error: auth.error });

  try {
    const { to, toAll, subject, html } = req.body;

    if (!subject || !html) {
      return res.status(400).json({ error: 'subject and html are required' });
    }

    if (!to && !toAll) {
      return res.status(400).json({ error: 'to or toAll is required' });
    }

    // Use onboarding@resend.dev until custom domain is verified
    const from = 'CoachMyNefs <noreply@coachmynefs.com>';

    if (toAll) {
      const { data: profiles, error: dbError } = await supabase
        .from('profiles')
        .select('email')
        .not('email', 'is', null);

      if (dbError) {
        return res.status(500).json({ error: 'Failed to fetch users' });
      }

      const emails = profiles
        .map((p) => p.email)
        .filter((e) => typeof e === 'string' && e.includes('@'));

      if (emails.length === 0) {
        return res.status(400).json({ error: 'No valid email addresses found' });
      }

      // Send individually
      const results = [];
      for (const email of emails) {
        const result = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ from, to: [email], subject, html }),
        });
        const data = await result.json();
        results.push({ email, status: result.ok ? 'sent' : 'failed', data });
      }

      return res.status(200).json({ success: true, count: emails.length, results });
    }

    // Single email
    const result = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ from, to: [to], subject, html }),
    });

    const data = await result.json();

    if (!result.ok) {
      console.error('Resend error:', data);
      return res.status(500).json({ error: data.message || 'Email send failed' });
    }

    return res.status(200).json({ success: true, data });
  } catch (err) {
    console.error('send-email error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
