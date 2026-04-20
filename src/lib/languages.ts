export const SUPPORTED_LANGUAGES = [
  'English',
  'Vietnamese',
  'Korean',
  'Japanese',
  'Chinese (Simplified)',
  'Chinese (Traditional)',
  'Thai',
  'Indonesian',
  'Malay',
  'Burmese',
  'Khmer',
  'Lao',
  'Hindi',
  'Urdu',
  'Bengali',
  'Sinhala',
  'Nepali',
  'Arabic',
  'Hebrew',
  'Turkish',
  'Persian',
  'French',
  'German',
  'Dutch',
  'Spanish',
  'Portuguese',
  'Portuguese (Brazilian)',
  'Italian',
  'Greek',
  'Swedish',
  'Norwegian',
  'Danish',
  'Finnish',
  'Icelandic',
  'Polish',
  'Russian',
  'Ukrainian',
  'Belarusian',
  'Czech',
  'Slovak',
  'Hungarian',
  'Romanian',
  'Bulgarian',
  'Croatian',
  'Serbian',
  'Slovenian',
  'Amharic',
  'Swahili',
] as const

export type SupportedLanguage = (typeof SUPPORTED_LANGUAGES)[number]

const LANGUAGE_SET = new Set<string>(SUPPORTED_LANGUAGES)

const LANGUAGE_ALIASES: Record<string, SupportedLanguage> = {
  'Portuguese (Brazilian)': 'Portuguese',
  'Chinese (Traditional)': 'Chinese (Simplified)',
}

export function normalizeLanguage(language: string): SupportedLanguage {
  const canonical = LANGUAGE_ALIASES[language] ?? language
  return LANGUAGE_SET.has(canonical) ? (canonical as SupportedLanguage) : 'English'
}
