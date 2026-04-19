'use client'

import { useState } from 'react'
import Link from 'next/link'
import type { Tier } from '@/lib/tiers'
import type { UiStrings } from '@/lib/i18n'
import { fill } from '@/lib/i18n'

interface Props {
  tier: Tier
  cancelled: boolean
  language: string
  tr: UiStrings
  tierName: string
  tierTagline: string
  tierFeatures: string[]
}

export default function CheckoutForm({ tier, cancelled, language, tr, tierName, tierTagline, tierFeatures }: Props) {
  const [name, setName] = useState('')
  const [title, setTitle] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return

    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.trim(), title: title.trim(), tier: tier.id, language }),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to create checkout session')
      window.location.href = data.url
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong.')
      setLoading(false)
    }
  }

  const accentRing =
    tier.id === 'supreme' ? 'focus:ring-purple-500'
    : tier.id === 'premium' ? 'focus:ring-amber-500'
    : 'focus:ring-blue-500'

  const btnClass =
    tier.id === 'supreme' ? 'bg-purple-600 hover:bg-purple-700 text-white'
    : tier.id === 'premium' ? 'bg-amber-400 text-black hover:bg-amber-500'
    : 'bg-blue-600 hover:bg-blue-700 text-white'

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-md mx-auto">
        {cancelled && (
          <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-xl text-yellow-800 text-sm">
            {tr.checkout_cancelled_msg}
          </div>
        )}

        <div className="bg-white rounded-2xl shadow-lg p-8">
          <div className="flex items-center gap-3 mb-6">
            <span className="text-3xl">{tier.emoji}</span>
            <div>
              <h1 className="text-xl font-black text-gray-900">{tr.checkout_title}</h1>
              <p className="text-gray-500 text-sm">{tierName} · {tier.price} · {tierTagline}</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                {tr.checkout_name_label} <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={tr.checkout_name_placeholder}
                className={`w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 ${accentRing} focus:border-transparent outline-none transition text-gray-900`}
                maxLength={80}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                {tr.checkout_title_label}{' '}
                <span className="text-gray-400 font-normal">{tr.checkout_title_hint}</span>
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder={tr.checkout_title_placeholder}
                className={`w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 ${accentRing} focus:border-transparent outline-none transition text-gray-900`}
                maxLength={80}
              />
              <p className="text-xs text-gray-400 mt-1">{tr.checkout_title_note}</p>
            </div>

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">{error}</div>
            )}

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className={`w-full ${btnClass} py-4 rounded-xl font-black text-base transition disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {loading ? tr.checkout_loading_btn : fill(tr.checkout_submit_btn, { price: tier.price })}
              </button>
            </div>

            <p className="text-xs text-gray-400 text-center">{tr.checkout_secure_note}</p>
          </form>

          <div className="mt-6 pt-6 border-t border-gray-100">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-3">
              {tr.checkout_included_label}
            </p>
            <ul className="space-y-1.5">
              {tierFeatures.map((f, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                  <span className="text-green-500 font-bold shrink-0 mt-0.5">✓</span>
                  {f}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <p className="text-center text-sm text-gray-400 mt-6">
          <Link href="/" className="hover:underline">{tr.checkout_back}</Link>
        </p>
      </div>
    </div>
  )
}
