import { NextRequest } from 'next/server'
import { Paddle } from '@paddle/paddle-node-sdk'
import { getTier } from '@/lib/tiers'
import { normalizeLanguage } from '@/lib/languages'

export async function POST(request: NextRequest) {
  try {
    const paddle = new Paddle(process.env.PADDLE_API_KEY!)

    const body = await request.json()
    const { name, title, tier: tierId, language: rawLanguage = 'English' } = body
    const language = normalizeLanguage(rawLanguage)

    if (!name?.trim() || !tierId) {
      return Response.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const tier = getTier(tierId)
    if (!tier) {
      return Response.json({ error: 'Invalid tier' }, { status: 400 })
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

    const transaction = await paddle.transactions.create({
      items: [{
        quantity: 1,
        price: {
          description: `Certified Not Stupid — ${tier.tagline}`,
          unitPrice: { amount: String(tier.priceInCents), currencyCode: 'USD' },
          product: { name: `${tier.emoji} ${tier.name}`, taxCategory: 'digital-goods' },
        },
      }],
      customData: {
        name: name.trim(),
        title: (title || '').trim(),
        tier: tierId,
        language,
      },
      checkout: {
        url: `${appUrl}/certificate`,
      },
    })

    return Response.json({ url: transaction.checkout?.url })
  } catch (error) {
    console.error('Checkout session error:', error)
    return Response.json({ error: 'Failed to create checkout session' }, { status: 500 })
  }
}
