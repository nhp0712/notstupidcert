import { notFound } from 'next/navigation'
import Link from 'next/link'
import { CERT_TYPES, getCertType } from '@/lib/cert-types'

interface Props {
  params: Promise<{ certType: string }>
}

export async function generateStaticParams() {
  return CERT_TYPES.map((c) => ({ certType: c.id }))
}

export default async function CertTypePage({ params }: Props) {
  const { certType: certTypeId } = await params
  const cert = getCertType(certTypeId)
  if (!cert) notFound()

  const accent = cert.cardAccent
  const isDark = cert.certColors.nameColor === '#ffffff' || cert.certColors.bg.startsWith('#0') || cert.certColors.bg === '#121212'

  const tierButtonStyle = (highlight: boolean) => ({
    background: highlight ? accent : 'transparent',
    color: highlight ? (isDark ? '#000000' : '#ffffff') : accent,
    border: `2px solid ${accent}`,
  })

  return (
    <div className="min-h-screen text-white" style={{ background: cert.cardBg }}>
      {/* Nav */}
      <div className="px-4 pt-4 pb-2">
        <div className="max-w-5xl mx-auto flex justify-between items-center">
          <Link href="/" className="text-sm opacity-60 hover:opacity-100 transition">
            ← All Certificates
          </Link>
        </div>
      </div>

      {/* Hero */}
      <section className="px-4 pt-12 pb-10 text-center">
        <div className="max-w-2xl mx-auto">
          <div className="text-6xl mb-4">{cert.emoji}</div>
          <h1 className="text-4xl sm:text-6xl font-black mb-4 leading-tight">
            <span style={{ color: accent }}>{cert.name}</span>
            <br />
            <span className="text-white text-3xl sm:text-4xl font-bold">Certificate</span>
          </h1>
          <p className="text-lg sm:text-xl opacity-80 mb-6 max-w-xl mx-auto leading-relaxed">
            {cert.description}
          </p>
          <div className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-bold tracking-widest uppercase mb-6"
            style={{ background: `${accent}22`, border: `1px solid ${accent}55`, color: accent }}>
            <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: accent }} />
            Uniquely Generated · Instant Delivery · From $2.99
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <a href="#tiers" className="w-full sm:w-auto inline-block font-black py-4 px-10 rounded-full text-lg transition-opacity hover:opacity-90 shadow-lg"
              style={{ background: accent, color: isDark ? '#000' : '#fff' }}>
              Get Certified →
            </a>
          </div>
        </div>
      </section>

      {/* Novelty disclaimer */}
      <section className="px-4 pb-8">
        <div className="max-w-2xl mx-auto rounded-2xl px-4 py-3 text-sm text-center"
          style={{ background: `${accent}15`, border: `1px solid ${accent}30`, color: `${accent}cc` }}>
          Novelty digital certificate for entertainment only. Not an academic, professional, or official credential.
        </div>
      </section>

      {/* Tiers */}
      <section id="tiers" className="px-4 pb-20">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-black text-center mb-2">
            Choose Your <span style={{ color: accent }}>Level</span>
          </h2>
          <p className="text-center opacity-60 mb-10 text-sm">One-time payment · Instant generation · Download & share</p>

          <div className="grid sm:grid-cols-3 gap-6 items-stretch">
            {cert.tiers.map((tier) => (
              <div key={tier.id} className="rounded-2xl p-6 flex flex-col relative"
                style={{
                  background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.3)',
                  border: tier.highlight ? `2px solid ${accent}` : '1px solid rgba(255,255,255,0.1)',
                  transform: tier.highlight ? 'scale(1.03)' : undefined,
                }}>
                {tier.highlight && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 text-black text-xs font-black px-4 py-1.5 rounded-full whitespace-nowrap"
                    style={{ background: accent }}>
                    Most Popular
                  </div>
                )}
                <div className="mb-4">
                  <h3 className="text-lg font-black mb-1">{tier.name}</h3>
                  <p className="opacity-60 text-sm">{tier.tagline}</p>
                </div>
                <div className="mb-5">
                  <span className="text-4xl font-black">{tier.price}</span>
                  <span className="opacity-40 text-sm ml-1">one-time</span>
                </div>
                <ul className="space-y-2 mb-8 flex-1">
                  {tier.features.map((f, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm opacity-80">
                      <span className="font-bold mt-0.5 shrink-0" style={{ color: accent }}>✓</span>
                      {f}
                    </li>
                  ))}
                </ul>
                <Link
                  href={`/checkout?certType=${cert.id}&tier=${tier.id}`}
                  className="w-full block text-center py-4 rounded-xl font-black transition-opacity hover:opacity-90 text-base"
                  style={tierButtonStyle(!!tier.highlight)}
                >
                  Get Certified →
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Social proof */}
      <section className="px-4 pb-20 text-center">
        <div className="max-w-md mx-auto">
          <div className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold"
            style={{ background: `${accent}15`, border: `1px solid ${accent}30`, color: accent }}>
            <span>⭐</span>
            <span>Trusted by 3,241+ certified humans</span>
            <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: accent }} />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="text-sm text-center py-8 border-t border-white/10 opacity-60">
        <div className="mb-3">
          Support: <a href="mailto:support@notstupidcert.com" className="underline">support@notstupidcert.com</a>
        </div>
        <div>
          <a href="/terms" className="mx-2 hover:opacity-100">Terms</a>
          <a href="/privacy" className="mx-2 hover:opacity-100">Privacy</a>
          <a href="/refunds" className="mx-2 hover:opacity-100">Refunds</a>
        </div>
      </footer>
    </div>
  )
}
