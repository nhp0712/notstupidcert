const COUNTRY_TO_LANGUAGE: Record<string, string> = {
  // English-speaking (no translation needed)
  US: 'English', GB: 'English', AU: 'English', CA: 'English',
  NZ: 'English', IE: 'English', SG: 'English', ZA: 'English',
  GH: 'English', NG: 'English', PH: 'English',

  // Asia Pacific
  VN: 'Vietnamese',
  KR: 'Korean',
  JP: 'Japanese',
  CN: 'Chinese (Simplified)',
  TW: 'Chinese (Traditional)',
  HK: 'Chinese (Traditional)',
  TH: 'Thai',
  ID: 'Indonesian',
  MY: 'Malay',
  MM: 'Burmese',
  KH: 'Khmer',
  LA: 'Lao',

  // South Asia
  IN: 'Hindi',
  PK: 'Urdu',
  BD: 'Bengali',
  LK: 'Sinhala',
  NP: 'Nepali',

  // Middle East & North Africa
  SA: 'Arabic', AE: 'Arabic', EG: 'Arabic', IQ: 'Arabic',
  SY: 'Arabic', JO: 'Arabic', KW: 'Arabic', QA: 'Arabic',
  BH: 'Arabic', OM: 'Arabic', YE: 'Arabic', LB: 'Arabic',
  MA: 'Arabic', DZ: 'Arabic', TN: 'Arabic', LY: 'Arabic',
  IL: 'Hebrew',
  TR: 'Turkish',
  IR: 'Persian',

  // Europe — Western
  FR: 'French', BE: 'French', LU: 'French',
  DE: 'German', AT: 'German',
  CH: 'German',
  NL: 'Dutch',
  ES: 'Spanish',
  PT: 'Portuguese',
  IT: 'Italian',
  GR: 'Greek',

  // Europe — Nordic
  SE: 'Swedish',
  NO: 'Norwegian',
  DK: 'Danish',
  FI: 'Finnish',
  IS: 'Icelandic',

  // Europe — Eastern
  PL: 'Polish',
  RU: 'Russian',
  UA: 'Ukrainian',
  BY: 'Belarusian',
  CZ: 'Czech',
  SK: 'Slovak',
  HU: 'Hungarian',
  RO: 'Romanian',
  BG: 'Bulgarian',
  HR: 'Croatian',
  RS: 'Serbian',
  SI: 'Slovenian',

  // Americas — Latin
  BR: 'Portuguese (Brazilian)',
  MX: 'Spanish', AR: 'Spanish', CO: 'Spanish',
  CL: 'Spanish', PE: 'Spanish', VE: 'Spanish',
  EC: 'Spanish', BO: 'Spanish', PY: 'Spanish',
  UY: 'Spanish', GT: 'Spanish', HN: 'Spanish',
  SV: 'Spanish', NI: 'Spanish', CR: 'Spanish',
  PA: 'Spanish', DO: 'Spanish', CU: 'Spanish',

  // Africa — Sub-Saharan
  ET: 'Amharic',
  KE: 'Swahili',
  TZ: 'Swahili',
  UG: 'Swahili',
  SN: 'French',
  CI: 'French',
  CM: 'French',
  CD: 'French',
}

export function getLanguageFromCountry(countryCode: string): string {
  return COUNTRY_TO_LANGUAGE[countryCode] ?? 'English'
}
