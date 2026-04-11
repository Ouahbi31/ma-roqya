// Endpoint /api/admin/dashboard-stats
// Retourne les stats agrégées : revenus Stripe, balance, RDV Cal.com à venir, users, premium, waitlist, messages non lus.
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

const CALCOM_API = 'https://api.cal.com/v2';

export default async function handler(req, res) {
  setCors(res);
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  const auth = await requireAdmin(req);
  if (!auth.ok) return res.status(auth.status).json({ error: auth.error });

  try {
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const thirtyDaysAgoUnix = Math.floor(thirtyDaysAgo.getTime() / 1000);

    // ─── STRIPE ───
    const [balance, charges] = await Promise.all([
      stripe.balance.retrieve(),
      stripe.charges.list({ limit: 100, created: { gte: thirtyDaysAgoUnix } }),
    ]);

    const successfulCharges = charges.data.filter((c) => c.status === 'succeeded' && !c.refunded);
    const grossRevenue30d = successfulCharges.reduce((s, c) => s + c.amount, 0);

    // Build daily revenue series
    const dailyRevenue = {};
    for (let i = 0; i < 30; i++) {
      const d = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      dailyRevenue[d.toISOString().split('T')[0]] = 0;
    }
    successfulCharges.forEach((c) => {
      const day = new Date(c.created * 1000).toISOString().split('T')[0];
      if (dailyRevenue[day] !== undefined) dailyRevenue[day] += c.amount / 100;
    });
    const revenueSeries = Object.entries(dailyRevenue)
      .sort(([a], [b]) => (a < b ? -1 : 1))
      .map(([date, amount]) => ({ date, amount }));

    const pendingBalance = balance.pending.reduce((s, b) => s + b.amount, 0);
    const availableBalance = balance.available.reduce((s, b) => s + b.amount, 0);

    // ─── CAL.COM ───
    let upcomingBookings = [];
    let nextBooking = null;
    try {
      const calRes = await fetch(`${CALCOM_API}/bookings?status=upcoming&take=10`, {
        headers: { Authorization: `Bearer ${process.env.CALCOM_API_KEY}` },
      });
      if (calRes.ok) {
        const calData = await calRes.json();
        upcomingBookings = calData?.data?.bookings || [];
        nextBooking = upcomingBookings[0] || null;
      }
    } catch (e) {
      console.error('Cal.com fetch error:', e);
    }

    // ─── SUPABASE ───
    const [usersTotal, usersPremium, usersNew7d, waitlistTotal, unreadMessages] = await Promise.all([
      supabase.from('profiles').select('id', { count: 'exact', head: true }),
      supabase.from('profiles').select('id', { count: 'exact', head: true }).eq('is_premium', true),
      supabase
        .from('profiles')
        .select('id', { count: 'exact', head: true })
        .gte('created_at', new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString()),
      supabase.from('waitlist').select('id', { count: 'exact', head: true }),
      supabase.from('contact_messages').select('id', { count: 'exact', head: true }).eq('lu', false),
    ]);

    return res.status(200).json({
      stripe: {
        grossRevenue30d: grossRevenue30d / 100,
        chargesCount30d: successfulCharges.length,
        pendingBalance: pendingBalance / 100,
        availableBalance: availableBalance / 100,
        revenueSeries,
      },
      calcom: {
        upcomingCount: upcomingBookings.length,
        nextBooking: nextBooking
          ? {
              id: nextBooking.id,
              uid: nextBooking.uid,
              title: nextBooking.title,
              startTime: nextBooking.startTime,
              attendeeName: nextBooking.responses?.name || nextBooking.attendees?.[0]?.name,
              attendeeEmail: nextBooking.responses?.email || nextBooking.attendees?.[0]?.email,
              status: nextBooking.status,
              paid: nextBooking.paid,
              eventTitle: nextBooking.eventType?.title,
              meetingUrl: nextBooking.meetingUrl,
            }
          : null,
        upcomingBookings: upcomingBookings.slice(0, 5).map((b) => ({
          id: b.id,
          uid: b.uid,
          startTime: b.startTime,
          attendeeName: b.responses?.name || b.attendees?.[0]?.name,
          attendeeEmail: b.responses?.email || b.attendees?.[0]?.email,
          status: b.status,
          paid: b.paid,
          eventTitle: b.eventType?.title,
        })),
      },
      users: {
        total: usersTotal.count || 0,
        premium: usersPremium.count || 0,
        newLast7d: usersNew7d.count || 0,
      },
      waitlist: {
        total: waitlistTotal.count || 0,
      },
      messages: {
        unread: unreadMessages.count || 0,
      },
    });
  } catch (err) {
    console.error('dashboard-stats error:', err);
    return res.status(500).json({ error: err.message || 'Internal server error' });
  }
}
