import { getTier } from '@/lib/tiers'
import { getLanguage } from '@/lib/get-language'
import { getTranslations, tierFeatures } from '@/lib/translate'
import CheckoutForm from './CheckoutForm'
import Link from 'next/link'

interface Props {
  searchParams: Promise<{ tier?: string; cancelled?: string }>
}

export default async function CheckoutPage({ searchParams }: Props) {
  const [{ tier: tierId = 'basic', cancelled }, language] = await Promise.all([
    searchParams,
    getLanguage(),
  ])

  const [tier, tr] = await Promise.all([
    Promise.resolve(getTier(tierId)),
    getTranslations(language),
  ])

  if (!tier) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-gray-600 mb-4">{tr.checkout_invalid_tier}</p>
          <Link href="/" className="text-blue-600 hover:underline">{tr.checkout_back}</Link>
        </div>
      </div>
    )
  }

  const tierName = tr[`tier_${tier.id}_name` as keyof typeof tr] as string
  const tierTagline = tr[`tier_${tier.id}_tagline` as keyof typeof tr] as string
  const features = tierFeatures(tr, tier.id as 'basic' | 'premium' | 'supreme')

  return (
    <CheckoutForm
      tier={tier}
      cancelled={cancelled === 'true'}
      language={language}
      tr={tr}
      tierName={tierName}
      tierTagline={tierTagline}
      tierFeatures={features}
    />
  )
}
