import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { priceId, email, userId } = req.body;

  if (!priceId || !email) {
    return res.status(400).json({ error: 'Missing fields' });
  }

  try {
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      customer_email: email,
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${req.headers.origin || 'https://coachmynefs.com'}/premium-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.origin || 'https://coachmynefs.com'}/tarifs`,
      metadata: { userId: userId || '' },
    });

    return res.status(200).json({ url: session.url });
  } catch (err) {
    console.error('Stripe subscription error:', err.message);
    return res.status(500).json({ error: err.message });
  }
}
