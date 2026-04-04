import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  httpClient: Stripe.createFetchHttpClient(),
  apiVersion: '2024-06-20',
});

export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { slug, price, title, email, userId } = req.body;
  if (!slug || !price || !email) return res.status(400).json({ error: 'Missing fields' });

  try {
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      customer_email: email,
      line_items: [
        {
          price_data: {
            currency: 'eur',
            product_data: {
              name: title || 'Programme Coaching',
              description: `Accès à vie au programme "${title}"`,
            },
            unit_amount: Math.round(price * 100),
          },
          quantity: 1,
        },
      ],
      success_url: `${req.headers.origin || 'https://ma-roqya.fr'}/coaching/programmes/${slug}?success=1`,
      cancel_url: `${req.headers.origin || 'https://ma-roqya.fr'}/coaching/programmes/${slug}`,
      metadata: { userId: userId || '', programmeSlug: slug },
    });

    return res.status(200).json({ url: session.url });
  } catch (err) {
    console.error('Coaching checkout error:', err.message);
    return res.status(500).json({ error: err.message });
  }
}
