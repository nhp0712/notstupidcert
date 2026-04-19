import Anthropic from '@anthropic-ai/sdk'
import { EN, UiStrings } from './i18n'

export { fill, tierFeatures } from './i18n'

// In-memory cache: lives for the lifetime of the server process.
// Warm for top languages quickly; cold-starts pay ~1-2s once per language per instance.
const cache = new Map<string, UiStrings>([['English', EN]])

export async function getTranslations(language: string): Promise<UiStrings> {
  if (cache.has(language)) return cache.get(language)!

  try {
    const anthropic = new Anthropic()
    const message = await anthropic.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 4096,
      messages: [
        {
          role: 'user',
          content: `Translate all string values in this JSON object from English to ${language}.

Rules:
- Preserve {varName} placeholders exactly as-is (e.g., {price}, {name})
- Keep brand names in English: "Certified Not Stupid™", "notstupidcert.com", "Claude AI", "Stripe", "LinkedIn", "TikTok", "Instagram"
- Keep emoji exactly as-is
- Keep prices ($2.99 etc.) and URLs as-is
- Return ONLY valid JSON with identical keys — no markdown, no code blocks

${JSON.stringify(EN)}`,
        },
      ],
    })

    const raw = message.content[0]
    if (raw.type !== 'text') throw new Error('Unexpected response type')

    const stripped = raw.text.replace(/```(?:json)?\n?/g, '').replace(/```/g, '').trim()
    const start = stripped.indexOf('{')
    const end = stripped.lastIndexOf('}')
    if (start === -1 || end === -1) throw new Error('No JSON found in response')

    let parsed: UiStrings
    try {
      parsed = JSON.parse(stripped.slice(start, end + 1))
    } catch {
      throw new Error('Failed to parse translation JSON')
    }

    cache.set(language, parsed)
    return parsed
  } catch (err) {
    console.error(`Translation failed for ${language}, falling back to English:`, err)
    return EN
  }
}

/** Language instruction appended to Claude certificate generation prompts */
export function certLangInstruction(language: string): string {
  if (language === 'English') return ''
  return `\n\nIMPORTANT: Generate ALL certificate content in ${language}. Use formal, pompous, official-sounding ${language} that is also hilariously absurd.`
}
