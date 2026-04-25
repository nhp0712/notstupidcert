import { NextRequest } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import type { TierId, CertTypeId } from '@/lib/cert-types'
import { certLangInstruction } from '@/lib/translate'
import { normalizeLanguage } from '@/lib/languages'

function customFieldNote(certType: CertTypeId, value: string): string {
  if (!value) return ''
  switch (certType) {
    case 'not-stupid':
      return `\nCustom detail — their greatest achievement: "${value}". Weave this into the mainText naturally as "Notable intellectual achievement: ${value}" — make it sound impressive and absurd.`
    case 'rizz-master':
      return `\nCustom detail — their biggest flex: "${value}". Weave this into the mainText naturally as "Notable rizz achievement: ${value}" — make it sound incredibly charismatic.`
    case 'red-flag-free':
      return `\nCustom detail — their last relationship status/clean record: "${value}". Weave this into the mainText as "Clean record since: ${value}" — make it sound clinically impressive.`
    case 'delulu':
      return `\nCustom detail — their current manifestation: "${value}". Weave this into the mainText as "Currently manifesting: ${value} (it's already done)" — make it sound cosmically inevitable.`
    case 'not-your-ex':
      return `\nCustom detail — their ex's name: "${value}". Reference this ex by name naturally and humorously multiple times throughout the mainText and other fields — e.g., "bears zero resemblance to ${value}", "legally and emotionally distinct from ${value}", "unlike ${value}, this individual..."`
    default:
      return ''
  }
}

function buildPrompt(certType: CertTypeId, tier: TierId, name: string, custom: string, date: string, certNum: string, language: string): string {
  const langNote = certLangInstruction(language)
  const customNote = customFieldNote(certType, custom)

  if (certType === 'not-stupid') {
    if (tier === 'basic') {
      return `Generate certificate content for a funny "Not Stupid" certificate.
Person: ${name} | Date: ${date} | Certificate #: ${certNum}${customNote}
Return ONLY valid JSON (no markdown) with exactly these fields:
{"organization":"pompous fake org name","subtitle":"formal certificate subtitle","mainText":"2-3 sentences, formal but absurd, proving they are Not Stupid. Mention specific fake tests passed. Include their name. ${custom ? 'Naturally include their greatest achievement as described above.' : ''}","signatory":"fake official name and title","seal":"short seal text max 5 words"}${langNote}`
    }
    if (tier === 'premium') {
      return `Generate certificate content for a funny premium "Certified Genius" certificate.
Person: ${name} | Date: ${date} | Certificate #: ${certNum}${customNote}
Return ONLY valid JSON (no markdown) with exactly these fields:
{"organization":"elaborate pompous multi-departmental fake institution name","subtitle":"grand formal subtitle","mainText":"3-4 sentences, very elaborate and formal but funny, comparing them to famous geniuses. ${custom ? 'Naturally include their greatest achievement as described above.' : ''}","credentials":["3 fake impressive honorary credentials"],"achievements":["2 funny fake achievements"],"signatory":"fake official name with multiple titles","seal":"elaborate seal text max 6 words"}${langNote}`
    }
    return `Generate certificate content for a funny ultra-premium "Galaxy Brain Supreme" certificate.
Person: ${name} | Date: ${date} | Certificate #: ${certNum}${customNote}
Return ONLY valid JSON (no markdown) with exactly these fields:
{"organization":"absolutely over-the-top ridiculous multi-departmental made-up institution","subtitle":"most elaborate grand subtitle imaginable","phd":"fake PhD title awarded","mainText":"4-5 sentences, extremely elaborate formal text with fake scientific achievements. ${custom ? 'Naturally include their greatest achievement as described above.' : ''}","credentials":["4 fake credentials including honorary memberships to made-up institutions"],"achievements":["3 increasingly absurd achievements"],"roast":"one funny sentence about everyone who does NOT have this certificate","signatory":"fake official name with an absurd list of titles","seal":"most elaborate seal text max 7 words"}${langNote}`
  }

  if (certType === 'rizz-master') {
    if (tier === 'basic') {
      return `Generate certificate content for a funny "Basic Rizz Certificate".
Person: ${name} | Date: ${date} | Certificate #: ${certNum}${customNote}
Return ONLY valid JSON (no markdown) with exactly these fields:
{"organization":"pompous fake rizz academy name","subtitle":"Certificate of Supreme Rizz and Unmatched Charismatic Excellence","mainText":"2-3 sentences, formal but absurd, certifying their unparalleled ability to attract and captivate. Include their name. ${custom ? 'Naturally include their biggest flex as described above.' : ''}","signatory":"fake rizz authority name and title","seal":"short seal text max 5 words"}${langNote}`
    }
    if (tier === 'premium') {
      return `Generate certificate content for a funny premium "Certified Rizz Master" certificate.
Person: ${name} | Date: ${date} | Certificate #: ${certNum}${customNote}
Return ONLY valid JSON (no markdown) with exactly these fields:
{"organization":"elaborate fake international rizz authority","subtitle":"Certificate of Supreme Rizz and Unmatched Charismatic Excellence","mainText":"3-4 sentences, very formal but absurd, about their unparalleled magnetism. ${custom ? 'Naturally include their biggest flex as described above.' : ''}","credentials":["3 fake rizz-related honorary credentials"],"achievements":["2 funny fake heartbreaker achievements"],"signatory":"fake rizz grandmaster name with multiple titles","seal":"elaborate seal text max 6 words"}${langNote}`
    }
    return `Generate certificate content for a funny ultra-premium "Supreme Rizz Grandmaster" certificate.
Person: ${name} | Date: ${date} | Certificate #: ${certNum}${customNote}
Return ONLY valid JSON (no markdown) with exactly these fields:
{"organization":"absolutely ridiculous multi-continental fake rizz institution","subtitle":"Certificate of Supreme Rizz and Unmatched Charismatic Excellence","phd":"Ph.D. in Advanced Human Magnetism with Specialization in Effortless Attraction","mainText":"4-5 sentences, extremely formal and absurd, about their cosmic-level charisma. ${custom ? 'Naturally include their biggest flex as described above.' : ''}","credentials":["4 fake rizz credentials including honorary titles from made-up charisma institutes"],"achievements":["3 increasingly absurd heartbreaker achievements"],"roast":"one funny sentence about how everyone without this certificate is awkward and uncharismatic by comparison","signatory":"fake Rizz Supreme Commander name with an absurd list of titles","seal":"most elaborate seal text max 7 words"}${langNote}`
  }

  if (certType === 'red-flag-free') {
    if (tier === 'basic') {
      return `Generate certificate content for a funny "Red Flag Free Certificate".
Person: ${name} | Date: ${date} | Certificate #: ${certNum}${customNote}
Return ONLY valid JSON (no markdown) with exactly these fields:
{"organization":"International Bureau of Relationship Standards (fake)","subtitle":"Certificate of Complete Psychological Normalcy and Romantic Soundness","mainText":"2-3 sentences, formal but absurd, declaring zero red flags. Include their name. ${custom ? 'Naturally include their clean record detail as described above.' : ''}","signatory":"fake relationship standards authority name and title","seal":"short seal text max 5 words"}${langNote}`
    }
    if (tier === 'premium') {
      return `Generate certificate content for a funny premium "Certified Red Flag Free" certificate.
Person: ${name} | Date: ${date} | Certificate #: ${certNum}${customNote}
Return ONLY valid JSON (no markdown) with exactly these fields:
{"organization":"elaborate fake International Council of Relationship Wellness","subtitle":"Certificate of Complete Psychological Normalcy and Romantic Soundness","mainText":"3-4 sentences, very formal but absurd, about their impressive attachment style. ${custom ? 'Naturally include their clean record as described above.' : ''}","credentials":["Passed the 47-Point Attachment Style Assessment","Zero situationship relapses in the past 90 days","One fake therapy credential"],"achievements":["2 funny fake green-flag achievements"],"signatory":"fake relationship wellness grandmaster name with multiple titles","seal":"elaborate seal text max 6 words"}${langNote}`
    }
    return `Generate certificate content for a funny ultra-premium "Totally Normal Person" certificate.
Person: ${name} | Date: ${date} | Certificate #: ${certNum}${customNote}
Return ONLY valid JSON (no markdown) with exactly these fields:
{"organization":"absolutely ridiculous multi-departmental fake Global Wellness Authority","subtitle":"Certificate of Complete Psychological Normalcy and Romantic Soundness","phd":"fake PhD in Romantic Soundness and Advanced Green Flag Methodology","mainText":"4-5 sentences, extremely formal and absurd, declaring their complete normalcy and zero red flags — everyone they've dated was the problem. ${custom ? 'Naturally include their clean record as described above.' : ''}","credentials":["Passed the 47-Point Attachment Style Assessment","Zero situationship relapses in the past 90 days","Completed Advanced Emotional Availability Certification","One more elaborately fake credential"],"achievements":["3 increasingly absurd green-flag achievements"],"roast":"one funny sentence declaring everyone they've ever dated was the problem, not them","signatory":"fake Supreme Relationship Authority name with an absurd list of titles","seal":"most elaborate seal text max 7 words"}${langNote}`
  }

  if (certType === 'delulu') {
    if (tier === 'basic') {
      return `Generate certificate content for a funny "Delulu Certificate".
Person: ${name} | Date: ${date} | Certificate #: ${certNum}${customNote}
Return ONLY valid JSON (no markdown) with exactly these fields:
{"organization":"fake Institute of Manifestation Sciences","subtitle":"Certificate of Advanced Delusional Optimism and Reality-Optional Thinking","mainText":"2-3 sentences, formal but absurd, recognizing their ability to believe in impossible outcomes. Include their name. ${custom ? 'Naturally include their current manifestation as described above.' : ''}","signatory":"fake manifestation authority name and title","seal":"short seal text max 5 words"}${langNote}`
    }
    if (tier === 'premium') {
      return `Generate certificate content for a funny premium "Certified Delulu" certificate.
Person: ${name} | Date: ${date} | Certificate #: ${certNum}${customNote}
Return ONLY valid JSON (no markdown) with exactly these fields:
{"organization":"elaborate fake Global Academy of Manifestation and Delusional Sciences","subtitle":"Certificate of Advanced Delusional Optimism and Reality-Optional Thinking","mainText":"3-4 sentences, very formal but absurd, about their scientifically documented ability to manifest impossible outcomes. ${custom ? 'Naturally include their current manifestation as described above.' : ''}","credentials":["Ph.D. in Manifestation Science with Minor in Ignoring Red Flags Academically","2 more fake mystical credentials"],"achievements":["Successfully manifested 3 things that statistically should not have happened","Maintained hope during objectively hopeless situations"],"signatory":"fake Supreme Manifestation Authority name with multiple mystical titles","seal":"elaborate seal text max 6 words"}${langNote}`
    }
    return `Generate certificate content for a funny ultra-premium "Galaxy Delulu" certificate.
Person: ${name} | Date: ${date} | Certificate #: ${certNum}${customNote}
Return ONLY valid JSON (no markdown) with exactly these fields:
{"organization":"absolutely ridiculous Interdimensional Council of Manifestation and Cosmic Delusional Sciences","subtitle":"Certificate of Advanced Delusional Optimism and Reality-Optional Thinking","phd":"Ph.D. in Manifestation Science with Minor in Ignoring Red Flags Academically and Advanced Cosmic Delusion Theory","mainText":"4-5 sentences, extremely formal and mystical but absurd, about how their belief system bends reality itself. ${custom ? 'Naturally include their current manifestation as described above.' : ''}","credentials":["Ph.D. in Manifestation Science with Minor in Ignoring Red Flags Academically","Honorary Member of the Intergalactic Manifestation Council","2 more elaborately fake mystical credentials"],"achievements":["Successfully manifested 3 things that statistically should not have happened","Maintained hope during objectively hopeless situations","3rd achievement: most absurd manifestation ever recorded"],"roast":"one funny sentence about how everyone who isn't delulu is just scared to dream","signatory":"fake Cosmic Supreme Manifestor name with an absurd list of mystical titles","seal":"most elaborate mystical seal text max 7 words"}${langNote}`
  }

  // not-your-ex
  if (tier === 'basic') {
    return `Generate certificate content for a funny "Not Your Ex Certificate".
Person: ${name} | Date: ${date} | Certificate #: ${certNum}${customNote}
Return ONLY valid JSON (no markdown) with exactly these fields:
{"organization":"Global Council of Moving On Successfully (fake)","subtitle":"Certificate of Official Non-Association and Romantic Independence","mainText":"2-3 sentences, formal but cold and unbothered, declaring zero association with past partners. Include their name. ${custom ? 'Reference their ex by name naturally as described above.' : ''}","signatory":"fake independence authority name and title","seal":"short seal text max 5 words"}${langNote}`
  }
  if (tier === 'premium') {
    return `Generate certificate content for a funny premium "Certified Not Your Ex" certificate.
Person: ${name} | Date: ${date} | Certificate #: ${certNum}${customNote}
Return ONLY valid JSON (no markdown) with exactly these fields:
{"organization":"elaborate fake International Council of Moving On and Romantic Independence","subtitle":"Certificate of Official Non-Association and Romantic Independence","mainText":"3-4 sentences, very formal but cold and unbothered, about their successful healing and non-association with past partners. ${custom ? 'Reference their ex by name naturally as described above.' : ''}","credentials":["Completed the 90-Day Healing Protocol","Successfully deleted all old texts","Achieved full villain era certification"],"achievements":["2 funny glow-up achievements"],"signatory":"fake Supreme Independence Authority name with multiple cold titles","seal":"elaborate seal text max 6 words"}${langNote}`
  }
  return `Generate certificate content for a funny ultra-premium "Completely Over It" certificate.
Person: ${name} | Date: ${date} | Certificate #: ${certNum}${customNote}
Return ONLY valid JSON (no markdown) with exactly these fields:
{"organization":"absolutely ridiculous Global Supreme Council of Moving On, Thriving, and Romantic Non-Association","subtitle":"Certificate of Official Non-Association and Romantic Independence","phd":"Ph.D. in Moving On Successfully with Specialization in Not Looking Back","mainText":"4-5 sentences, extremely formal and cold, declaring complete non-association with past partners, legendary glow-up, and confirmed fact that their ex is still thinking about them. ${custom ? 'Reference their ex by name naturally and repeatedly as described above.' : ''}","credentials":["Completed the 90-Day Healing Protocol","Successfully deleted all old texts","Achieved full villain era certification","Honorary Member of the Global Council of Thriving"],"achievements":["3 increasingly cold glow-up achievements"],"roast":"one funny sentence about how their ex is still thinking about them at 2am","signatory":"fake Supreme Cold Unbothered Authority name with an absurd list of titles","seal":"most elaborate cold seal text max 7 words"}${langNote}`
}

function extractJson(text: string): string {
  const stripped = text.replace(/```(?:json)?\n?/g, '').replace(/```/g, '').trim()
  const start = stripped.indexOf('{')
  const end = stripped.lastIndexOf('}')
  if (start === -1 || end === -1 || end <= start) throw new Error('No JSON object found')
  return stripped.slice(start, end + 1)
}

const VALID_TIERS = new Set(['basic', 'premium', 'supreme'])
const VALID_CERT_TYPES = new Set(['not-stupid', 'rizz-master', 'red-flag-free', 'delulu', 'not-your-ex'])

async function verifyLemonSqueezyOrder(orderId: string): Promise<boolean> {
  const apiKey = process.env.LEMONSQUEEZY_API_KEY
  if (!apiKey) return false
  const res = await fetch(`https://api.lemonsqueezy.com/v1/orders/${orderId}`, {
    headers: { Authorization: `Bearer ${apiKey}`, Accept: 'application/vnd.api+json' },
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
    const custom = searchParams.get('title')?.trim() ?? ''
    const tier = searchParams.get('tier') as TierId
    const certType = (searchParams.get('certType') ?? 'not-stupid') as CertTypeId
    const rawLanguage = searchParams.get('language') ?? 'English'
    const orderId = searchParams.get('order_id')

    if (!name || !tier || !VALID_TIERS.has(tier) || !VALID_CERT_TYPES.has(certType)) {
      return Response.json({ error: 'Missing required fields' }, { status: 400 })
    }

    if (orderId) {
      const paid = await verifyLemonSqueezyOrder(orderId)
      if (!paid) {
        console.warn(`Order ${orderId} could not be verified — proceeding anyway (Checkout.Success already fired)`)
      }
    }

    const language = normalizeLanguage(rawLanguage)
    const date = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
    const certNum = `CNS-${Math.random().toString(36).slice(2, 8).toUpperCase()}-${new Date().getFullYear()}`

    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 2048,
      messages: [{ role: 'user', content: buildPrompt(certType, tier, name, custom, date, certNum, language) }],
    })

    const content = message.content[0]
    if (content.type !== 'text') return Response.json({ error: 'Generation failed' }, { status: 500 })

    let certData
    try {
      certData = JSON.parse(extractJson(content.text))
    } catch (e) {
      console.error('Parse failed:', JSON.stringify(content.text), e)
      return Response.json({ error: 'Failed to parse certificate data' }, { status: 500 })
    }

    return Response.json({ name, title: custom, tier, certType, date, certNumber: certNum, ...certData })
  } catch (error) {
    console.error('Certificate generation error:', error)
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}
