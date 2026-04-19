import { NextRequest } from 'next/server'
import { Paddle } from '@paddle/paddle-node-sdk'
import Anthropic from '@anthropic-ai/sdk'
import type { TierId } from '@/lib/tiers'
import { certLangInstruction } from '@/lib/translate'

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

export async function GET(request: NextRequest) {
  try {
    const paddle = new Paddle(process.env.PADDLE_API_KEY!)
    const anthropic = new Anthropic()

    const { searchParams } = new URL(request.url)
    const sessionId = searchParams.get('session_id')

    if (!sessionId) {
      return Response.json({ error: 'Missing session_id' }, { status: 400 })
    }

    const transaction = await paddle.transactions.get(sessionId)

    if (transaction.status !== 'completed') {
      return Response.json({ error: 'Payment not completed' }, { status: 402 })
    }

    const customData = transaction.customData as Record<string, string>
    const { name, title = '', tier, language = 'English' } = customData

    const date = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
    const certNum = `CNS-${sessionId.slice(-6).toUpperCase()}-${new Date().getFullYear()}`

    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 2048,
      messages: [{
        role: 'user',
        content: buildPrompt(tier as TierId, name, title, date, certNum, language),
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
