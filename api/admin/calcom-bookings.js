// Endpoint /api/admin/calcom-bookings
// Liste les bookings Cal.com avec filtre par statut.
// Query params: status (upcoming|past|cancelled|unconfirmed), take (default 50)
import { requireAdmin, setCors } from '../_lib/admin-auth.js';

const CALCOM_API = 'https://api.cal.com/v2';

export default async function handler(req, res) {
  setCors(res);
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  const auth = await requireAdmin(req);
  if (!auth.ok) return res.status(auth.status).json({ error: auth.error });

  try {
    const status = (req.query.status || 'upcoming').toString();
    const take = Math.min(parseInt(req.query.take || '50', 10), 100);

    const calRes = await fetch(`${CALCOM_API}/bookings?status=${encodeURIComponent(status)}&take=${take}`, {
      headers: { Authorization: `Bearer ${process.env.CALCOM_API_KEY}` },
    });

    if (!calRes.ok) {
      const errText = await calRes.text();
      return res.status(calRes.status).json({ error: 'Cal.com API error', details: errText.slice(0, 500) });
    }

    const data = await calRes.json();
    const bookings = (data?.data?.bookings || []).map((b) => ({
      id: b.id,
      uid: b.uid,
      title: b.title,
      startTime: b.startTime,
      endTime: b.endTime,
      status: b.status,
      paid: b.paid,
      attendeeName: b.responses?.name || b.attendees?.[0]?.name,
      attendeeEmail: b.responses?.email || b.attendees?.[0]?.email,
      attendeePhone: b.responses?.attendeePhoneNumber || '',
      notes: b.responses?.notes || b.description || '',
      eventTitle: b.eventType?.title,
      eventSlug: b.eventType?.slug,
      price: b.eventType?.price ? b.eventType.price / 100 : null,
      currency: b.eventType?.currency,
      location: b.location,
      meetingUrl: b.meetingUrl,
      cancellationReason: b.cancellationReason,
      rejectionReason: b.rejectionReason,
    }));

    return res.status(200).json({ bookings });
  } catch (err) {
    console.error('calcom-bookings error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
