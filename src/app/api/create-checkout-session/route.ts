import { NextRequest } from 'next/server'
import Stripe from 'stripe'
import { getTier } from '@/lib/tiers'

export async function POST(request: NextRequest) {
  try {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

    const body = await request.json()
    const { name, title, tier: tierId, language = 'English' } = body

    if (!name?.trim() || !tierId) {
      return Response.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const tier = getTier(tierId)
    if (!tier) {
      return Response.json({ error: 'Invalid tier' }, { status: 400 })
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items: [{
        price_data: {
          currency: 'usd',
          product_data: {
            name: `${tier.emoji} ${tier.name}`,
            description: `Certified Not Stupid — ${tier.tagline}`,
          },
          unit_amount: tier.priceInCents,
        },
        quantity: 1,
      }],
      metadata: {
        name: name.trim(),
        title: (title || '').trim(),
        tier: tierId,
        language,
      },
      success_url: `${appUrl}/certificate?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${appUrl}/checkout?tier=${tierId}&cancelled=true`,
    })

    return Response.json({ url: session.url })
  } catch (error) {
    console.error('Checkout session error:', error)
    return Response.json({ error: 'Failed to create checkout session' }, { status: 500 })
  }
}
