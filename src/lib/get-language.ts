import { headers } from 'next/headers'
import { normalizeLanguage } from './languages'

export async function getLanguage(): Promise<string> {
  const h = await headers()
  return normalizeLanguage(h.get('x-language') ?? 'English')
}
