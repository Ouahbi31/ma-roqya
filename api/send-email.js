import { Resend } from 'resend';
import { createClient } from '@supabase/supabase-js';

const resend = new Resend(process.env.RESEND_API_KEY);
const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(req, res) {
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
    const { to, toAll, subject, html } = req.body;

    if (!subject || !html) {
      return res.status(400).json({ error: 'subject and html are required' });
    }

    if (!to && !toAll) {
      return res.status(400).json({ error: 'to or toAll is required' });
    }

    const from = 'MaRoqya <noreply@ma-roqya.fr>';

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

      // Resend batch: send individually to each user (max 100 per batch call)
      const batches = [];
      for (let i = 0; i < emails.length; i += 100) {
        const chunk = emails.slice(i, i + 100);
        batches.push(
          resend.batch.send(
            chunk.map((email) => ({
              from,
              to: [email],
              subject,
              html,
            }))
          )
        );
      }

      await Promise.all(batches);

      return res.status(200).json({ success: true, count: emails.length });
    }

    // Single email
    const { error: sendError } = await resend.emails.send({
      from,
      to: [to],
      subject,
      html,
    });

    if (sendError) {
      return res.status(500).json({ error: sendError.message });
    }

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error('send-email error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
