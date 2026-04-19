import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getLanguageFromCountry } from './lib/country-to-language'

export function proxy(request: NextRequest) {
  // Priority: ?lang= URL param > existing cookie > Vercel geo header > Accept-Language > English
  const urlLang = request.nextUrl.searchParams.get('lang')
  const cookieLang = request.cookies.get('language')?.value
  const country = request.headers.get('x-vercel-ip-country') ?? ''
  const acceptLang = request.headers.get('accept-language') ?? ''

  let language: string

  if (urlLang) {
    // Allow explicit override: ?lang=Japanese
    language = urlLang
  } else if (cookieLang) {
    language = cookieLang
  } else if (country) {
    language = getLanguageFromCountry(country)
  } else {
    // Fallback: parse Accept-Language header (e.g., "vi-VN,vi;q=0.9" → "Vietnamese")
    const primaryLangCode = acceptLang.split(',')[0]?.split('-')[0]?.split(';')[0]?.trim() ?? ''
    language = LANG_CODE_TO_NAME[primaryLangCode] ?? 'English'
  }

  // Forward to server components via request header (same-request, no round trip)
  const requestHeaders = new Headers(request.headers)
  requestHeaders.set('x-language', language)

  const response = NextResponse.next({ request: { headers: requestHeaders } })

  // Persist in cookie so subsequent requests skip re-detection
  response.cookies.set('language', language, {
    path: '/',
    maxAge: 60 * 60 * 24 * 30,
    sameSite: 'lax',
  })

  return response
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}

// Maps browser language codes to full language names used in prompts
const LANG_CODE_TO_NAME: Record<string, string> = {
  vi: 'Vietnamese',
  ko: 'Korean',
  ja: 'Japanese',
  zh: 'Chinese (Simplified)',
  th: 'Thai',
  id: 'Indonesian',
  ms: 'Malay',
  fr: 'French',
  de: 'German',
  es: 'Spanish',
  pt: 'Portuguese',
  it: 'Italian',
  nl: 'Dutch',
  pl: 'Polish',
  ru: 'Russian',
  uk: 'Ukrainian',
  ar: 'Arabic',
  he: 'Hebrew',
  tr: 'Turkish',
  fa: 'Persian',
  hi: 'Hindi',
  bn: 'Bengali',
  sv: 'Swedish',
  no: 'Norwegian',
  da: 'Danish',
  fi: 'Finnish',
  cs: 'Czech',
  hu: 'Hungarian',
  ro: 'Romanian',
  el: 'Greek',
}
