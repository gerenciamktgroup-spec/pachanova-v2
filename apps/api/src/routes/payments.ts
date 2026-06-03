import { Hono } from 'hono';
import { createPaymentSession, stripe } from '../payments/stripe';

export const payments = new Hono();

payments.post('/checkout', async (c) => {
  try {
    const body = await c.req.json();
    const { amount, userId, successUrl, cancelUrl } = body;

    if (!amount || !userId || !successUrl || !cancelUrl) {
      return c.json({ error: 'Missing required fields' }, 400);
    }

    const session = await createPaymentSession(amount, userId, successUrl, cancelUrl);
    return c.json({ url: session.url });
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
});

payments.post('/webhook', async (c) => {
  const sig = c.req.header('stripe-signature');
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET || '';

  let event;
  try {
    const rawBody = await c.req.text();
    event = stripe.webhooks.constructEvent(rawBody, sig || '', endpointSecret);
  } catch (err: any) {
    return c.json({ error: `Webhook Error: ${err.message}` }, 400);
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as any;
    const userId = session.metadata.userId;
    const amountTotal = session.amount_total;
    // Here we would interact with the database/blockchain to mint tokens or update fiat balance.
    console.log(`Payment successful for user ${userId}: ${amountTotal}`);
  }

  return c.json({ received: true });
});
