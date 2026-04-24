'use client'

import { forwardRef, useRef, useState } from 'react'
import Link from 'next/link'
import { CertificateDisplay, CertificateData } from '@/components/CertificateDisplay'
import type { UiStrings } from '@/lib/i18n'
import type { TierId } from '@/lib/tiers'

interface Props {
  tr: UiStrings
  language: string
  orderId?: string
}

// Share card config mirrors CertificateDisplay tierConfig
const tierConfig = {
  basic: {
    bg: '#ffffff',
    bgInner: '#f8f9fc',
    orgColor: '#4a6fa5',
    subtitleColor: '#1e3a5f',
    nameColor: '#0f1e2e',
    textColor: '#2c3e50',
    accentColor: '#4a6fa5',
    dividerColor: '#b8cce4',
    sealBorder: '#1e3a5f',
    sealColor: '#1e3a5f',
    outerBorder: '6px double #1e3a5f',
  },
  premium: {
    bg: '#fffdf0',
    bgInner: '#fef9e7',
    orgColor: '#8b6914',
    subtitleColor: '#6b4f0a',
    nameColor: '#4a3000',
    textColor: '#5c4000',
    accentColor: '#b8860b',
    dividerColor: '#e8c84a',
    sealBorder: '#b8860b',
    sealColor: '#8b6914',
    outerBorder: '6px double #b8860b',
  },
  supreme: {
    bg: '#0f0a1e',
    bgInner: '#1a0f2e',
    orgColor: '#c4b5fd',
    subtitleColor: '#fbbf24',
    nameColor: '#fde68a',
    textColor: '#ddd6fe',
    accentColor: '#fbbf24',
    dividerColor: '#4c1d95',
    sealBorder: '#fbbf24',
    sealColor: '#fbbf24',
    outerBorder: '6px double #7c3aed',
  },
}

interface ShareCardProps {
  data: CertificateData
  tr: UiStrings
}

const ShareCard = forwardRef<HTMLDivElement, ShareCardProps>(({ data, tr }, ref) => {
  const cfg = tierConfig[data.tier]
  const funnyLine = data.roast || data.achievements?.[0] || data.mainText.substring(0, 130) + '…'

  return (
    <div
      ref={ref}
      style={{
        position: 'fixed',
        left: '-9999px',
        top: 0,
        width: '600px',
        height: '600px',
        background: cfg.bg,
        border: cfg.outerBorder,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '44px 48px',
        fontFamily: 'var(--font-geist-sans), Arial, sans-serif',
        textAlign: 'center',
        boxSizing: 'border-box',
      }}
    >
      <p style={{ fontSize: '9px', letterSpacing: '0.22em', textTransform: 'uppercase', color: cfg.orgColor, fontWeight: 700, marginBottom: '14px' }}>
        {data.organization}
      </p>
      <div style={{ borderTop: `1px solid ${cfg.dividerColor}`, width: '80%', marginBottom: '18px' }} />
      <p style={{ fontSize: '12px', color: cfg.textColor, marginBottom: '6px', fontStyle: 'italic' }}>
        {tr.cd_this_is_to}
      </p>
      <p style={{ fontSize: '38px', fontWeight: 900, color: cfg.nameColor, lineHeight: 1.15, marginBottom: '6px', fontFamily: 'Georgia, serif' }}>
        {data.name}
      </p>
      <p style={{ fontSize: '15px', fontWeight: 700, color: cfg.subtitleColor, marginBottom: '18px', letterSpacing: '0.03em' }}>
        {data.subtitle}
      </p>
      <div style={{ borderTop: `1px solid ${cfg.dividerColor}`, width: '50%', marginBottom: '18px' }} />
      <p style={{ fontSize: '13px', fontStyle: 'italic', color: cfg.accentColor, maxWidth: '440px', lineHeight: 1.65, marginBottom: '22px' }}>
        &ldquo;{funnyLine}&rdquo;
      </p>
      {/* Seal */}
      <div style={{ width: '64px', height: '64px', borderRadius: '50%', border: `3px solid ${cfg.sealBorder}`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '18px' }}>
        <div style={{ width: '48px', height: '48px', borderRadius: '50%', border: `1px solid ${cfg.sealBorder}`, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '5px' }}>
          <span style={{ fontSize: '6px', fontWeight: 800, color: cfg.sealColor, textTransform: 'uppercase', lineHeight: 1.3 }}>
            {data.seal}
          </span>
        </div>
      </div>
      <p style={{ fontSize: '9px', letterSpacing: '0.18em', textTransform: 'uppercase', color: cfg.accentColor, opacity: 0.55 }}>
        notstupidcert.com
      </p>
    </div>
  )
})
ShareCard.displayName = 'ShareCard'

const TIER_LABELS: Record<TierId, string> = {
  basic: 'Not Stupid Certificate ($2.99)',
  premium: 'Certified Genius ($6.99)',
  supreme: 'Galaxy Brain Supreme ($12.99)',
}

export default function CertificateView({ tr, language, orderId }: Props) {
  const certRef = useRef<HTMLDivElement>(null)
  const shareCardRef = useRef<HTMLDivElement>(null)

  const [name, setName] = useState('')
  const [title, setTitle] = useState('')
  const [tier, setTier] = useState<TierId>('basic')
  const [certData, setCertData] = useState<CertificateData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [downloading, setDownloading] = useState(false)
  const [downloadingFull, setDownloadingFull] = useState(false)
  const [sharing, setSharing] = useState(false)

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return

    setLoading(true)
    setError('')

    const params = new URLSearchParams({
      name: name.trim(),
      title: title.trim(),
      tier,
      language,
      ...(orderId ? { order_id: orderId } : {}),
    })

    try {
      const res = await fetch(`/api/generate-certificate?${params}`)
      const data = await res.json()
      if (data.error) throw new Error(data.error)
      setCertData(data as CertificateData)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong.')
    } finally {
      setLoading(false)
    }
  }

  const captureElement = async (el: HTMLDivElement | null) => {
    if (!el) return null
    const html2canvas = (await import('html2canvas')).default
    return html2canvas(el, { scale: 2, useCORS: true, allowTaint: true, backgroundColor: null })
  }

  const handleDownload = async () => {
    setDownloading(true)
    try {
      const canvas = await captureElement(shareCardRef.current)
      if (!canvas) return
      const link = document.createElement('a')
      link.download = `certificate-${certData?.name?.replace(/\s+/g, '-').toLowerCase() ?? 'mine'}-share.png`
      link.href = canvas.toDataURL('image/png')
      link.click()
    } catch (err) {
      console.error(err)
    } finally {
      setDownloading(false)
    }
  }

  const handleDownloadFull = async () => {
    setDownloadingFull(true)
    try {
      const canvas = await captureElement(certRef.current)
      if (!canvas) return
      const link = document.createElement('a')
      link.download = `certificate-${certData?.name?.replace(/\s+/g, '-').toLowerCase() ?? 'mine'}-full.png`
      link.href = canvas.toDataURL('image/png')
      link.click()
    } catch (err) {
      console.error(err)
    } finally {
      setDownloadingFull(false)
    }
  }

  const handleShare = async () => {
    setSharing(true)
    try {
      const canvas = await captureElement(shareCardRef.current)
      if (!canvas) return
      canvas.toBlob(async (blob) => {
        if (!blob) return
        const file = new File([blob], 'certificate.png', { type: 'image/png' })
        const shareData = { title: 'Certified Not Stupid™', text: tr.cert_twitter_text, files: [file] }
        if (navigator.share && navigator.canShare(shareData)) {
          await navigator.share(shareData)
        } else {
          const link = document.createElement('a')
          link.download = 'certificate-share.png'
          link.href = canvas.toDataURL('image/png')
          link.click()
          setTimeout(() => alert(tr.cert_share_alert), 500)
        }
        setSharing(false)
      }, 'image/png')
    } catch (err) {
      console.error(err)
      setSharing(false)
    }
  }

  if (certData) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-100 to-gray-200 py-8 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-black text-gray-900 mb-1">{tr.cert_success_title}</h1>
            <p className="text-gray-500 text-sm">{tr.cert_success_subtitle}</p>
          </div>

          <CertificateDisplay ref={certRef} data={certData} tr={tr} language={language} />
          <ShareCard ref={shareCardRef} data={certData} tr={tr} />

          <div className="flex flex-col sm:flex-row gap-3 mt-6">
            <button
              onClick={handleDownload}
              disabled={downloading}
              className="flex-1 bg-gray-900 text-white py-4 rounded-xl font-black hover:bg-gray-800 transition disabled:opacity-50 text-sm"
            >
              {downloading ? tr.cert_downloading_btn : '⬇️ Download Share Card'}
            </button>
            <button
              onClick={handleShare}
              disabled={sharing}
              className="flex-1 bg-gradient-to-r from-pink-500 to-purple-600 text-white py-4 rounded-xl font-black hover:opacity-90 transition disabled:opacity-50 text-sm"
            >
              {sharing ? tr.cert_sharing_btn : tr.cert_share_btn}
            </button>
          </div>

          <button
            onClick={handleDownloadFull}
            disabled={downloadingFull}
            className="w-full mt-3 bg-gray-200 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-300 transition disabled:opacity-50 text-sm"
          >
            {downloadingFull ? '⏳ Saving...' : '🖼️ Download Full Certificate (Portrait)'}
          </button>

          <div className="flex items-center justify-center gap-4 mt-4">
            <a href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(tr.cert_twitter_text)}`} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-500 hover:underline">
              {tr.cert_share_twitter}
            </a>
            <span className="text-gray-300">·</span>
            <a href={`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent('https://notstupidcert.com')}`} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:underline">
              {tr.cert_share_linkedin}
            </a>
          </div>

          <div className="text-center mt-8 pt-6 border-t border-gray-300">
            <p className="text-gray-500 text-sm mb-3">{tr.cert_know_someone}</p>
            <Link href="/" className="inline-block bg-yellow-400 text-black font-black py-3 px-8 rounded-full hover:bg-yellow-300 transition text-sm">
              {tr.cert_get_another}
            </Link>
          </div>
        </div>
      </div>
    )
  }

  if (!orderId) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="max-w-md text-center">
          <div className="text-5xl mb-4">🔒</div>
          <h1 className="text-xl font-black text-gray-900 mb-2">Purchase Required</h1>
          <p className="text-gray-500 text-sm mb-6">
            This page is only accessible after completing a purchase. If you already paid and landed here by mistake, please contact{' '}
            <a href="mailto:support@notstupidcert.com" className="text-blue-600 underline">support@notstupidcert.com</a>.
          </p>
          <Link href="/" className="inline-block bg-yellow-400 text-black font-black py-3 px-8 rounded-full hover:bg-yellow-300 transition text-sm">
            Get Your Certificate →
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-md mx-auto">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <div className="text-center mb-6">
            <div className="text-4xl mb-3">🎓</div>
            <h1 className="text-xl font-black text-gray-900 mb-1">Generate Your Certificate</h1>
            <p className="text-gray-500 text-sm">Enter your details below to receive your personalized certificate.</p>
          </div>

          <form onSubmit={handleGenerate} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Your Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. John Smith"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition text-gray-900"
                maxLength={80}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Job Title{' '}
                <span className="text-gray-400 font-normal">(optional)</span>
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Senior Spreadsheet Wizard"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition text-gray-900"
                maxLength={80}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Certificate Tier <span className="text-red-500">*</span>
              </label>
              <select
                value={tier}
                onChange={(e) => setTier(e.target.value as TierId)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition text-gray-900 bg-white"
              >
                {(Object.entries(TIER_LABELS) as [TierId, string][]).map(([id, label]) => (
                  <option key={id} value={id}>{label}</option>
                ))}
              </select>
            </div>

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">{error}</div>
            )}

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading || !name.trim()}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-xl font-black text-base transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? '✨ Generating your certificate...' : '🎓 Generate My Certificate'}
              </button>
            </div>

            <p className="text-xs text-gray-400 text-center">Your unique AI-generated certificate will appear instantly.</p>
          </form>
        </div>

        <p className="text-center text-sm text-gray-400 mt-6">
          <Link href="/" className="hover:underline">← Back to home</Link>
        </p>
      </div>
    </div>
  )
}
