// Endpoint /api/admin/calcom-schedules
// GET : récupère le schedule par défaut (disponibilités)
// PATCH : met à jour le schedule (body: { availability: [{ days, startTime, endTime }] })
import { requireAdmin, setCors } from '../_lib/admin-auth.js';

const CALCOM_API = 'https://api.cal.com/v2';
const API_VERSION = '2024-06-11';

async function calFetch(path, init = {}) {
  return fetch(`${CALCOM_API}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${process.env.CALCOM_API_KEY}`,
      'cal-api-version': API_VERSION,
      'Content-Type': 'application/json',
      ...(init.headers || {}),
    },
  });
}

export default async function handler(req, res) {
  setCors(res);
  if (req.method === 'OPTIONS') return res.status(200).end();

  const auth = await requireAdmin(req);
  if (!auth.ok) return res.status(auth.status).json({ error: auth.error });

  try {
    if (req.method === 'GET') {
      const r = await calFetch('/schedules');
      if (!r.ok) {
        const errText = await r.text();
        return res.status(r.status).json({ error: 'Cal.com API error', details: errText.slice(0, 500) });
      }
      const data = await r.json();
      const schedules = data?.data || [];
      const defaultSchedule = schedules.find((s) => s.isDefault) || schedules[0] || null;
      return res.status(200).json({ schedules, defaultSchedule });
    }

    if (req.method === 'PATCH') {
      const { scheduleId, availability, name, timeZone } = req.body || {};
      if (!scheduleId) return res.status(400).json({ error: 'scheduleId is required' });

      const body = {};
      if (availability) body.availability = availability;
      if (name) body.name = name;
      if (timeZone) body.timeZone = timeZone;

      const r = await calFetch(`/schedules/${scheduleId}`, {
        method: 'PATCH',
        body: JSON.stringify(body),
      });
      if (!r.ok) {
        const errText = await r.text();
        return res.status(r.status).json({ error: 'Cal.com API error', details: errText.slice(0, 500) });
      }
      const data = await r.json();
      return res.status(200).json(data);
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    console.error('calcom-schedules error:', err);
    return res.status(500).json({ error: err.message || 'Internal server error' });
  }
}
