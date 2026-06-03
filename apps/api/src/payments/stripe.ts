import Stripe from 'stripe';

const stripeSecretKey = process.env.STRIPE_SECRET_KEY || '';
export const stripe = new Stripe(stripeSecretKey, {
  apiVersion: '2025-01-27.acacia' as any,
  appInfo: {
    name: 'PachaNova V2',
    version: '0.1.0',
  },
});

export const createPaymentSession = async (
  amountUsd: number,
  userId: string,
  successUrl: string,
  cancelUrl: string
) => {
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'PachaNova Fiat Deposit',
              description: 'Fund your PachaNova wallet to buy RWA Tokens',
            },
            unit_amount: amountUsd * 100, // in cents
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: successUrl,
      cancel_url: cancelUrl,
      client_reference_id: userId,
      metadata: {
        userId,
        type: 'FIAT_DEPOSIT'
      }
    });

    return session;
  } catch (error) {
    console.error('Error creating Stripe session:', error);
    throw new Error('Could not initialize payment session');
  }
};
