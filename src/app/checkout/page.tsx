import { getCertType } from '@/lib/cert-types'
import type { TierId } from '@/lib/cert-types'
import { getLanguage } from '@/lib/get-language'
import { normalizeLanguage } from '@/lib/languages'
import CheckoutForm from './CheckoutForm'
import Link from 'next/link'

interface Props {
  searchParams: Promise<{ certType?: string; tier?: string; lang?: string }>
}

export default async function CheckoutPage({ searchParams }: Props) {
  const [{ certType: certTypeId = 'not-stupid', tier: tierId = 'basic', lang }, detectedLanguage] = await Promise.all([
    searchParams,
    getLanguage(),
  ])
  const language = normalizeLanguage(lang ?? detectedLanguage)
  const certType = getCertType(certTypeId)
  const tier = certType?.tiers.find((t) => t.id === tierId) ?? certType?.tiers[0]

  if (!certType || !tier) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Certificate type not found.</p>
          <Link href="/" className="text-blue-600 hover:underline">← Back to home</Link>
        </div>
      </div>
    )
  }

  return <CheckoutForm certType={certType} tier={tier} language={language} />
}
