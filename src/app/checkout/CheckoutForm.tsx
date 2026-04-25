'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import type { CertTypeConfig, CertTierConfig } from '@/lib/cert-types'

declare global {
  interface Window {
    createLemonSqueezy?: () => void
    LemonSqueezy?: {
      Url: { Open: (url: string) => void }
      Setup: (config: { eventHandler: (event: LsEvent) => void }) => void
    }
  }
}

interface LsEvent {
  event: string
  data?: { order?: { data?: { id?: number | string } } }
}

interface Props {
  certType: CertTypeConfig
  tier: CertTierConfig
  language: string
}

export default function CheckoutForm({ certType, tier, language }: Props) {
  const [name, setName] = useState('')
  const [title, setTitle] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const accent = certType.cardAccent
  const isDark = certType.certColors.bg.startsWith('#0') || certType.certColors.bg === '#121212'

  useEffect(() => {
    if (typeof window === 'undefined') return
    if (window.createLemonSqueezy) window.createLemonSqueezy()

    window.LemonSqueezy?.Setup({
      eventHandler: (event) => {
        if (event.event === 'Checkout.Success') {
          const orderId = event.data?.order?.data?.id
          sessionStorage.setItem('cert_name', name)
          sessionStorage.setItem('cert_title', title)
          sessionStorage.setItem('cert_tier', tier.id)
          sessionStorage.setItem('cert_type', certType.id)
          sessionStorage.setItem('cert_language', language)
          if (orderId) sessionStorage.setItem('cert_order_id', String(orderId))
          window.location.href = `/certificate?certType=${certType.id}${orderId ? `&order_id=${orderId}` : ''}`
        }
      },
    })
  }, [name, title, tier.id, certType.id, language])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return
    setLoading(true)
    setError('')
    if (!window.LemonSqueezy) {
      setError('Payment system not loaded yet. Please refresh and try again.')
      setLoading(false)
      return
    }
    window.LemonSqueezy.Url.Open(tier.checkoutUrl)
    setLoading(false)
  }

  return (
    <div className="min-h-screen py-12 px-4" style={{ background: certType.cardBg }}>
      <div className="max-w-md mx-auto">
        <div className="rounded-2xl shadow-2xl p-8" style={{ background: 'rgba(255,255,255,0.05)', border: `1px solid ${accent}44` }}>
          <div className="flex items-center gap-3 mb-6">
            <span className="text-3xl">{certType.emoji}</span>
            <div>
              <h1 className="text-xl font-black text-white">{certType.name} Certificate</h1>
              <p className="text-sm" style={{ color: accent }}>{tier.name} · {tier.price}</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-white/80 mb-1.5">
                Your Name <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="The name to put on your certificate"
                className="w-full px-4 py-3 border rounded-xl outline-none transition text-white placeholder-white/30 bg-white/10"
                style={{ borderColor: `${accent}55` }}
                maxLength={80}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-white/80 mb-1.5">
                {certType.customField.label} <span className="text-white/40 font-normal">(optional)</span>
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder={certType.customField.placeholder}
                className="w-full px-4 py-3 border rounded-xl outline-none transition text-white placeholder-white/30 bg-white/10"
                style={{ borderColor: `${accent}55` }}
                maxLength={80}
              />
            </div>

            {error && (
              <div className="p-3 bg-red-900/40 border border-red-500/50 rounded-lg text-red-300 text-sm">{error}</div>
            )}

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading || !name.trim()}
                className="w-full py-4 rounded-xl font-black text-base transition disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ background: accent, color: isDark ? '#fff' : '#000' }}
              >
                {loading ? 'Opening checkout...' : `Pay ${tier.price} & Get Certified →`}
              </button>
            </div>

            <p className="text-xs text-white/40 text-center">Secure checkout by Lemon Squeezy · Instant delivery</p>
          </form>

          <div className="mt-6 pt-6 border-t border-white/10">
            <p className="text-xs font-semibold text-white/40 uppercase tracking-widest mb-3">Included</p>
            <ul className="space-y-1.5">
              {tier.features.map((f, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-white/60">
                  <span className="font-bold shrink-0 mt-0.5" style={{ color: accent }}>✓</span>
                  {f}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <p className="text-center text-sm text-white/40 mt-6">
          <Link href={`/certificate/${certType.id}`} className="hover:text-white/70 transition">← Back</Link>
        </p>
      </div>
    </div>
  )
}
