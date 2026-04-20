#!/usr/bin/env node

import { mkdir, readFile, writeFile, access } from 'node:fs/promises'
import path from 'node:path'
import process from 'node:process'
import { createHash } from 'node:crypto'

const API_URL = 'https://api.anthropic.com/v1/messages'
const MODEL = 'claude-haiku-4-5-20251001'
const WORKSPACE = process.cwd()
const I18N_PATH = path.join(WORKSPACE, 'src/lib/i18n.ts')
const LANG_PATH = path.join(WORKSPACE, 'src/lib/languages.ts')
const OUT_DIR = path.join(WORKSPACE, 'src/lib/locales')
const META_PATH = path.join(OUT_DIR, '.translations-meta.json')

function slugifyLanguage(language) {
  return language
    .toLowerCase()
    .replace(/\((.*?)\)/g, '$1')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

async function extractEnglishBundle() {
  const source = await readFile(I18N_PATH, 'utf8')
  const marker = 'export const EN: UiStrings = '
  const start = source.indexOf(marker)
  if (start === -1) throw new Error('Could not find EN object in i18n.ts')
  const from = start + marker.length
  const end = source.indexOf('\n\n/** Replace {varName} placeholders', from)
  if (end === -1) throw new Error('Could not determine EN object end in i18n.ts')
  const objectLiteral = source.slice(from, end).trim()
  // eslint-disable-next-line no-new-func
  return Function(`"use strict"; return (${objectLiteral});`)()
}

async function extractSupportedLanguages() {
  const source = await readFile(LANG_PATH, 'utf8')
  const match = source.match(/export const SUPPORTED_LANGUAGES = \[([\s\S]*?)\] as const/)
  if (!match) throw new Error('Could not parse SUPPORTED_LANGUAGES')
  const raw = match[1]
  const langs = raw
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.startsWith("'"))
    .map((line) => line.replace(/['",]/g, ''))
  return langs
}

async function callAnthropic(apiKey, payload, language) {
  const prompt = `Translate all string values in this JSON object from English to ${language}.

Rules:
- Preserve {varName} placeholders exactly as-is (e.g., {price}, {name})
- Keep brand names in English: "Certified Not Stupid™", "notstupidcert.com", "Claude AI", "Paddle", "LinkedIn", "TikTok", "Instagram"
- Keep emoji exactly as-is
- Keep prices ($2.99 etc.) and URLs as-is
- Return ONLY valid JSON with identical keys — no markdown, no code blocks

${JSON.stringify(payload)}

Double-check your output before sending:
- It must be a complete JSON object.
- Every key from the input must exist exactly once.
- Every value must be a valid escaped JSON string.`

  const res = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      model: MODEL,
      max_tokens: 4096,
      messages: [{ role: 'user', content: prompt }],
    }),
  })

  if (!res.ok) {
    const body = await res.text()
    throw new Error(`Anthropic API error for ${language}: ${res.status} ${body}`)
  }

  const data = await res.json()
  const text = data?.content?.[0]?.text
  if (!text) throw new Error(`No text content for ${language}`)

  return parseTranslationPayload(text, language)
}

function parseTranslationPayload(rawText, language) {
  const stripped = rawText.replace(/```(?:json)?\n?/g, '').replace(/```/g, '').trim()
  const start = stripped.indexOf('{')
  const end = stripped.lastIndexOf('}')
  if (start === -1 || end === -1) throw new Error(`No JSON object in ${language} response`)
  const candidate = stripped.slice(start, end + 1)

  try {
    return JSON.parse(candidate)
  } catch (err) {
    // Common model failure: accidental unescaped line breaks in string values.
    const repaired = candidate.replace(/\r?\n/g, '\\n')
    try {
      return JSON.parse(repaired)
    } catch {
      throw err
    }
  }
}

function validateTranslationKeys(source, translated, language) {
  const englishKeys = Object.keys(source).sort()
  const translatedKeys = Object.keys(translated).sort()
  if (englishKeys.length !== translatedKeys.length) {
    throw new Error(
      `Key count mismatch for ${language}: expected ${englishKeys.length}, got ${translatedKeys.length}`
    )
  }
  for (let i = 0; i < englishKeys.length; i += 1) {
    if (englishKeys[i] !== translatedKeys[i]) {
      throw new Error(`Key mismatch for ${language}: expected ${englishKeys[i]}, got ${translatedKeys[i]}`)
    }
  }
}

async function translateWithRetry(apiKey, payload, language, maxAttempts = 3) {
  let lastError
  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    try {
      const translated = await callAnthropic(apiKey, payload, language)
      validateTranslationKeys(payload, translated, language)
      return translated
    } catch (err) {
      lastError = err
      if (attempt < maxAttempts) {
        console.warn(`Retrying ${language} (attempt ${attempt + 1}/${maxAttempts}) due to parse/shape error.`)
      }
    }
  }
  throw lastError
}

function splitObjectIntoChunks(source, chunkSize = 24) {
  const entries = Object.entries(source)
  const chunks = []
  for (let i = 0; i < entries.length; i += chunkSize) {
    chunks.push(Object.fromEntries(entries.slice(i, i + chunkSize)))
  }
  return chunks
}

async function translateInChunks(apiKey, english, language) {
  const chunks = splitObjectIntoChunks(english, 24)
  const merged = {}
  for (let i = 0; i < chunks.length; i += 1) {
    console.log(`  chunk ${i + 1}/${chunks.length}`)
    const translatedChunk = await translateWithRetry(apiKey, chunks[i], language)
    Object.assign(merged, translatedChunk)
  }
  validateTranslationKeys(english, merged, language)
  return merged
}

async function writeLocaleFile(language, bundle) {
  const slug = slugifyLanguage(language)
  const outPath = path.join(OUT_DIR, `${slug}.ts`)
  const content = `import type { UiStrings } from '../i18n'

const locale: UiStrings = ${JSON.stringify(bundle, null, 2)}

export default locale
`
  await writeFile(outPath, content, 'utf8')
  return { slug, outPath }
}

async function writeLocaleIndex(languages) {
  const entries = languages.map((language) => ({
    language,
    slug: slugifyLanguage(language),
    ident: `locale_${slugifyLanguage(language).replace(/-/g, '_')}`,
  }))

  const imports = entries
    .map(({ ident, slug }) => `import ${ident} from './${slug}'`)
    .join('\n')

  const map = entries
    .map(({ language, ident }) => `  '${language}': ${ident},`)
    .join('\n')

  const content = `import type { UiStrings } from '../i18n'
${imports}

export const STATIC_TRANSLATIONS: Record<string, UiStrings> = {
${map}
}
`

  await writeFile(path.join(OUT_DIR, 'index.ts'), content, 'utf8')
}

async function fileExists(filePath) {
  try {
    await access(filePath)
    return true
  } catch {
    return false
  }
}

function computeEnglishHash(english) {
  return createHash('sha256').update(JSON.stringify(english)).digest('hex')
}

async function loadMeta() {
  if (!(await fileExists(META_PATH))) return {}
  try {
    const raw = await readFile(META_PATH, 'utf8')
    return JSON.parse(raw)
  } catch {
    return {}
  }
}

async function saveMeta(meta) {
  await writeFile(META_PATH, `${JSON.stringify(meta, null, 2)}\n`, 'utf8')
}

async function main() {
  let apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) {
    const envLocalPath = path.join(WORKSPACE, '.env.local')
    if (await fileExists(envLocalPath)) {
      const envLocal = await readFile(envLocalPath, 'utf8')
      const match = envLocal.match(/^ANTHROPIC_API_KEY=(.*)$/m)
      if (match?.[1]) {
        apiKey = match[1].replace(/^['"]|['"]$/g, '').trim()
      }
    }
  }
  const english = await extractEnglishBundle()
  const englishHash = computeEnglishHash(english)
  const languages = await extractSupportedLanguages()
  await mkdir(OUT_DIR, { recursive: true })
  const shouldOverwrite = process.argv.includes('--overwrite') || process.env.OVERWRITE_TRANSLATIONS === '1'
  const shouldForceTranslate = process.argv.includes('--force-translate') || process.env.FORCE_TRANSLATE === '1'
  const onlyArg = process.argv.find((arg) => arg.startsWith('--only='))
  const onlyLanguage = onlyArg ? onlyArg.slice('--only='.length) : ''
  const targetLanguages = onlyLanguage ? languages.filter((lang) => lang === onlyLanguage) : languages
  if (onlyLanguage && targetLanguages.length === 0) {
    throw new Error(`Unknown language in --only: ${onlyLanguage}`)
  }
  const meta = await loadMeta()
  const sourceChanged = meta.englishHash !== englishHash
  const usingAnthropic = Boolean(apiKey)
  const hasTrustedTranslations = meta.englishHash === englishHash && meta.usedAnthropic === true

  console.log(`Using Anthropic: ${usingAnthropic ? 'YES' : 'NO'}`)
  if (!apiKey) {
    console.warn('ANTHROPIC_API_KEY not set; generating English fallback bundles for all languages.')
  } else if (hasTrustedTranslations && !shouldForceTranslate) {
    console.log('English source unchanged; skipping Anthropic translation calls.')
  }

  const failedLanguages = []
  for (const language of targetLanguages) {
    const slug = slugifyLanguage(language)
    const outPath = path.join(OUT_DIR, `${slug}.ts`)
    if (!apiKey && !shouldOverwrite && await fileExists(outPath)) {
      console.log(`Skipping ${language} (${slug}) - already exists`)
      continue
    }

    if (language === 'English') {
      await writeLocaleFile(language, english)
      console.log(`Wrote ${language}`)
      continue
    }

    if (!apiKey) {
      await writeLocaleFile(language, english)
      console.log(`Wrote ${language} (fallback)`)
      continue
    }

    if (hasTrustedTranslations && !shouldForceTranslate && await fileExists(outPath)) {
      console.log(`Skipping ${language} (${slug}) - source unchanged`)
      continue
    }

    console.log(`Translating ${language}...`)
    try {
      const translated = await translateInChunks(apiKey, english, language)
      await writeLocaleFile(language, translated)
      console.log(`Wrote ${language}`)
    } catch (err) {
      failedLanguages.push(language)
      console.error(`Failed ${language}:`, err instanceof Error ? err.message : err)
    }
  }

  await writeLocaleIndex(languages)
  await saveMeta({
    englishHash,
    updatedAt: new Date().toISOString(),
    usedAnthropic: usingAnthropic,
    model: MODEL,
    languages,
  })

  if (failedLanguages.length > 0) {
    throw new Error(`Translation failed for: ${failedLanguages.join(', ')}`)
  }

  console.log('Done generating locale files.')
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
