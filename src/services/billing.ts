import { config } from '../config'

// Stripe billing service stub
// In production: create Stripe Checkout sessions, manage subscriptions,
// handle webhook events for payment success/failure/cancellation

export async function createCheckoutSession(userId: string, tier: 'pro' | 'team'): Promise<string> {
  // TODO: Implement with Stripe SDK
  // const stripe = new Stripe(config.stripe.secretKey)
  // const session = await stripe.checkout.sessions.create({...})
  // return session.url
  return `https://checkout.stripe.com/placeholder?user=${userId}&tier=${tier}`
}

export async function verifySubscription(userId: string): Promise<'free' | 'pro' | 'team' | 'enterprise'> {
  // TODO: Query Stripe for active subscription
  return 'free'
}

export async function handleWebhook(payload: Buffer, signature: string): Promise<void> {
  // TODO: Verify Stripe webhook signature and process events
  // const event = stripe.webhooks.constructEvent(payload, signature, config.stripe.webhookSecret)
}
