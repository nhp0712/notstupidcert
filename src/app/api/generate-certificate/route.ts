import { NextRequest } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import type { TierId } from '@/lib/tiers'
import { certLangInstruction } from '@/lib/translate'
import { normalizeLanguage } from '@/lib/languages'

function buildPrompt(tier: TierId, name: string, title: string, date: string, certNum: string, language: string): string {
  const titlePart = title ? `, ${title}` : ''
  const langNote = certLangInstruction(language)

  if (tier === 'basic') {
    return `Generate certificate content for a funny "Not Stupid" certificate.

Person: ${name}${titlePart}
Date: ${date}
Certificate #: ${certNum}

Return ONLY valid JSON (no markdown, no code blocks) with exactly these fields:
{
  "organization": "pompous fake org name",
  "subtitle": "formal certificate subtitle",
  "mainText": "2-3 sentences, formal but absurd, proving they are Not Stupid. Mention specific fake tests passed. Include their name${title ? ' and reference their role' : ''}.",
  "signatory": "fake official name and title",
  "seal": "short seal text max 5 words"
}${langNote}`
  }

  if (tier === 'premium') {
    return `Generate certificate content for a funny premium "Certified Genius" certificate.

Person: ${name}${titlePart}
Date: ${date}
Certificate #: ${certNum}

Return ONLY valid JSON (no markdown, no code blocks) with exactly these fields:
{
  "organization": "elaborate pompous multi-departmental fake institution name",
  "subtitle": "grand formal subtitle",
  "mainText": "3-4 sentences, very elaborate and formal but funny, comparing them to famous geniuses${title ? ', referencing their role as ' + title : ''}",
  "credentials": ["3 fake impressive honorary credentials"],
  "achievements": ["2 funny fake achievements"],
  "signatory": "fake official name with multiple titles",
  "seal": "elaborate seal text max 6 words"
}${langNote}`
  }

  return `Generate certificate content for a funny ultra-premium "Galaxy Brain Supreme" certificate.

Person: ${name}${titlePart}
Date: ${date}
Certificate #: ${certNum}

Return ONLY valid JSON (no markdown, no code blocks) with exactly these fields:
{
  "organization": "absolutely over-the-top ridiculous multi-departmental made-up institution",
  "subtitle": "most elaborate grand subtitle imaginable",
  "phd": "fake PhD title awarded",
  "mainText": "4-5 sentences, extremely elaborate formal text with fake scientific achievements, gentle funny roast of how others are comparatively less impressive${title ? ', prominently featuring their role as ' + title : ''}",
  "credentials": ["4 fake credentials including honorary memberships to made-up institutions"],
  "achievements": ["3 increasingly absurd achievements"],
  "roast": "one funny sentence about everyone who does NOT have this certificate",
  "signatory": "fake official name with an absurd list of titles",
  "seal": "most elaborate seal text max 7 words"
}${langNote}`
}

function extractJson(text: string): string {
  const stripped = text.replace(/```(?:json)?\n?/g, '').replace(/```/g, '').trim()
  const start = stripped.indexOf('{')
  const end = stripped.lastIndexOf('}')
  if (start === -1 || end === -1 || end <= start) throw new Error('No JSON object found')
  return stripped.slice(start, end + 1)
}

const VALID_TIERS = new Set(['basic', 'premium', 'supreme'])

async function verifyLemonSqueezyOrder(orderId: string): Promise<boolean> {
  const apiKey = process.env.LEMONSQUEEZY_API_KEY
  if (!apiKey) return false

  const res = await fetch(`https://api.lemonsqueezy.com/v1/orders/${orderId}`, {
    headers: {
      Authorization: `Bearer ${apiKey}`,
      Accept: 'application/vnd.api+json',
    },
  })
  if (!res.ok) return false

  const data = await res.json()
  return data?.data?.attributes?.status === 'paid'
}

export async function GET(request: NextRequest) {
  try {
    const anthropic = new Anthropic()
    const { searchParams } = new URL(request.url)

    const name = searchParams.get('name')?.trim()
    const title = searchParams.get('title')?.trim() ?? ''
    const tier = searchParams.get('tier') as TierId
    const rawLanguage = searchParams.get('language') ?? 'English'
    const orderId = searchParams.get('order_id')

    if (!name || !tier || !VALID_TIERS.has(tier)) {
      return Response.json({ error: 'Missing required fields: name and tier' }, { status: 400 })
    }

    if (!orderId) {
      return Response.json({ error: 'No order ID found. Please complete a purchase first.' }, { status: 402 })
    }

    const paid = await verifyLemonSqueezyOrder(orderId)
    if (!paid) {
      return Response.json({ error: 'Could not verify your payment. Please contact support@notstupidcert.com.' }, { status: 402 })
    }

    const language = normalizeLanguage(rawLanguage)
    const date = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
    const certNum = `CNS-${String(orderId).slice(-6).toUpperCase()}-${new Date().getFullYear()}`

    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 2048,
      messages: [{
        role: 'user',
        content: buildPrompt(tier, name, title, date, certNum, language),
      }],
    })

    const content = message.content[0]
    if (content.type !== 'text') {
      return Response.json({ error: 'Generation failed' }, { status: 500 })
    }

    let certData
    try {
      certData = JSON.parse(extractJson(content.text))
    } catch (e) {
      console.error('Parse failed. Raw response:', JSON.stringify(content.text))
      console.error('Parse error:', e)
      return Response.json({ error: 'Failed to parse certificate data' }, { status: 500 })
    }

    return Response.json({ name, title, tier, date, certNumber: certNum, ...certData })
  } catch (error) {
    console.error('Certificate generation error:', error)
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}
