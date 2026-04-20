import { EN, UiStrings } from './i18n'
import { normalizeLanguage } from './languages'
import { STATIC_TRANSLATIONS } from './locales'

export { fill, tierFeatures } from './i18n'

/**
 * Static UI translation registry.
 *
 * NOTE:
 * Add language bundles here (or import from per-language files) to keep
 * page rendering deterministic and avoid runtime LLM latency.
 */
const STATIC_UI_TRANSLATIONS: Record<string, UiStrings> = STATIC_TRANSLATIONS

export async function getTranslations(language: string): Promise<UiStrings> {
  const canonicalLanguage = normalizeLanguage(language)
  return STATIC_UI_TRANSLATIONS[canonicalLanguage] ?? EN
}

/** Language instruction appended to Claude certificate generation prompts */
export function certLangInstruction(language: string): string {
  if (language === 'English') return ''
  return `\n\nIMPORTANT: Generate ALL certificate content in ${language}. Use formal, pompous, official-sounding ${language} that is also hilariously absurd.`
}
