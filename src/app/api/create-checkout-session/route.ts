import { NextRequest } from 'next/server'
import { LEMON_SQUEEZY_STORE_ID, LEMON_SQUEEZY_VARIANT_IDS, type TierId } from '@/lib/tiers'
import { normalizeLanguage } from '@/lib/languages'

const VALID_TIERS = new Set(['basic', 'premium', 'supreme'])

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, title = '', tier, language: rawLanguage = 'English' } = body

    if (!name?.trim() || !tier || !VALID_TIERS.has(tier)) {
      return Response.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const language = normalizeLanguage(rawLanguage)
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://notstupidcert.com'

    const res = await fetch('https://api.lemonsqueezy.com/v1/checkouts', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.LEMONSQUEEZY_API_KEY}`,
        'Content-Type': 'application/vnd.api+json',
        Accept: 'application/vnd.api+json',
      },
      body: JSON.stringify({
        data: {
          type: 'checkouts',
          attributes: {
            product_options: {
              redirect_url: `${appUrl}/certificate`,
            },
            checkout_data: {
              custom: {
                name: name.trim(),
                title: title.trim(),
                tier,
                language,
              },
            },
          },
          relationships: {
            store: {
              data: { type: 'stores', id: LEMON_SQUEEZY_STORE_ID },
            },
            variant: {
              data: { type: 'variants', id: LEMON_SQUEEZY_VARIANT_IDS[tier as TierId] },
            },
          },
        },
      }),
    })

    if (!res.ok) {
      const err = await res.text()
      console.error('LS checkout error:', err)
      return Response.json({ error: 'Failed to create checkout session' }, { status: 500 })
    }

    const data = await res.json()
    const url = data?.data?.attributes?.url
    if (!url) return Response.json({ error: 'No checkout URL returned' }, { status: 500 })

    return Response.json({ url })
  } catch (error) {
    console.error('Checkout session error:', error)
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}
