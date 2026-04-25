'use client'

import { forwardRef, useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { CertificateDisplay, CertificateData } from '@/components/CertificateDisplay'
import type { UiStrings } from '@/lib/i18n'

interface Props {
  certType: string
  orderId: string
  tr: UiStrings
  language: string
}

const tierConfig = {
  basic: {
    bg: '#ffffff', bgInner: '#f8f9fc', orgColor: '#4a6fa5', subtitleColor: '#1e3a5f',
    nameColor: '#0f1e2e', textColor: '#2c3e50', accentColor: '#4a6fa5', dividerColor: '#b8cce4',
    sealBorder: '#1e3a5f', sealColor: '#1e3a5f', outerBorder: '6px double #1e3a5f',
  },
  premium: {
    bg: '#fffdf0', bgInner: '#fef9e7', orgColor: '#8b6914', subtitleColor: '#6b4f0a',
    nameColor: '#4a3000', textColor: '#5c4000', accentColor: '#b8860b', dividerColor: '#e8c84a',
    sealBorder: '#b8860b', sealColor: '#8b6914', outerBorder: '6px double #b8860b',
  },
  supreme: {
    bg: '#0f0a1e', bgInner: '#1a0f2e', orgColor: '#c4b5fd', subtitleColor: '#fbbf24',
    nameColor: '#fde68a', textColor: '#ddd6fe', accentColor: '#fbbf24', dividerColor: '#4c1d95',
    sealBorder: '#fbbf24', sealColor: '#fbbf24', outerBorder: '6px double #7c3aed',
  },
}

interface ShareCardProps { data: CertificateData; tr: UiStrings }

const ShareCard = forwardRef<HTMLDivElement, ShareCardProps>(({ data, tr }, ref) => {
  const cfg = tierConfig[data.tier]
  const funnyLine = data.roast || data.achievements?.[0] || data.mainText.substring(0, 130) + '…'
  return (
    <div ref={ref} style={{
      position: 'fixed', left: '-9999px', top: 0, width: '600px', height: '600px',
      background: cfg.bg, border: cfg.outerBorder, display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center', padding: '44px 48px',
      fontFamily: 'var(--font-geist-sans), Arial, sans-serif', textAlign: 'center', boxSizing: 'border-box',
    }}>
      <p style={{ fontSize: '9px', letterSpacing: '0.22em', textTransform: 'uppercase', color: cfg.orgColor, fontWeight: 700, marginBottom: '14px' }}>{data.organization}</p>
      <div style={{ borderTop: `1px solid ${cfg.dividerColor}`, width: '80%', marginBottom: '18px' }} />
      <p style={{ fontSize: '12px', color: cfg.textColor, marginBottom: '6px', fontStyle: 'italic' }}>{tr.cd_this_is_to}</p>
      <p style={{ fontSize: '38px', fontWeight: 900, color: cfg.nameColor, lineHeight: 1.15, marginBottom: '6px', fontFamily: 'Georgia, serif' }}>{data.name}</p>
      <p style={{ fontSize: '15px', fontWeight: 700, color: cfg.subtitleColor, marginBottom: '18px', letterSpacing: '0.03em' }}>{data.subtitle}</p>
      <div style={{ borderTop: `1px solid ${cfg.dividerColor}`, width: '50%', marginBottom: '18px' }} />
      <p style={{ fontSize: '13px', fontStyle: 'italic', color: cfg.accentColor, maxWidth: '440px', lineHeight: 1.65, marginBottom: '22px' }}>&ldquo;{funnyLine}&rdquo;</p>
      <div style={{ width: '64px', height: '64px', borderRadius: '50%', border: `3px solid ${cfg.sealBorder}`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '18px' }}>
        <div style={{ width: '48px', height: '48px', borderRadius: '50%', border: `1px solid ${cfg.sealBorder}`, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '5px' }}>
          <span style={{ fontSize: '6px', fontWeight: 800, color: cfg.sealColor, textTransform: 'uppercase', lineHeight: 1.3 }}>{data.seal}</span>
        </div>
      </div>
      <p style={{ fontSize: '9px', letterSpacing: '0.18em', textTransform: 'uppercase', color: cfg.accentColor, opacity: 0.55 }}>notstupidcert.com</p>
    </div>
  )
})
ShareCard.displayName = 'ShareCard'

export default function CertificateView({ certType: certTypeProp, orderId, tr, language }: Props) {
  const certRef = useRef<HTMLDivElement>(null)
  const shareCardRef = useRef<HTMLDivElement>(null)
  const [certData, setCertData] = useState<CertificateData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [downloading, setDownloading] = useState(false)
  const [downloadingFull, setDownloadingFull] = useState(false)
  const [sharing, setSharing] = useState(false)

  useEffect(() => {
    const name = sessionStorage.getItem('cert_name') ?? ''
    const title = sessionStorage.getItem('cert_title') ?? ''
    const tier = sessionStorage.getItem('cert_tier') ?? 'basic'
    const lang = sessionStorage.getItem('cert_language') ?? language
    const certType = certTypeProp || sessionStorage.getItem('cert_type') || 'not-stupid'
    const storedOrderId = sessionStorage.getItem('cert_order_id') ?? ''

    if (!name) {
      setError('Missing your name. Please start from the beginning.')
      setLoading(false)
      return
    }

    const params = new URLSearchParams({ name, title, tier, certType, language: lang })
    const resolvedOrderId = orderId || storedOrderId
    if (resolvedOrderId) params.set('order_id', resolvedOrderId)

    fetch(`/api/generate-certificate?${params}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.error) setError(data.error)
        else {
          setCertData(data as CertificateData)
          sessionStorage.removeItem('cert_name')
          sessionStorage.removeItem('cert_title')
          sessionStorage.removeItem('cert_tier')
          sessionStorage.removeItem('cert_type')
          sessionStorage.removeItem('cert_language')
          sessionStorage.removeItem('cert_order_id')
        }
        setLoading(false)
      })
      .catch(() => {
        setError('Failed to generate your certificate. Please refresh the page.')
        setLoading(false)
      })
  }, [orderId, language])

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
    } finally { setDownloading(false) }
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
    } finally { setDownloadingFull(false) }
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
    } catch { setSharing(false) }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center px-4">
          <div className="text-6xl mb-6 animate-spin-slow">🎓</div>
          <p className="text-gray-800 font-bold text-lg mb-2">{tr.cert_loading_title}</p>
          <p className="text-gray-500 text-sm max-w-xs mx-auto">{tr.cert_loading_subtitle}</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md px-4">
          <div className="text-5xl mb-4">🤔</div>
          <h1 className="text-xl font-bold text-gray-800 mb-2">{tr.cert_error_title}</h1>
          <p className="text-gray-600 mb-6 text-sm">{error}</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button onClick={() => window.location.reload()} className="bg-blue-600 text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-blue-700 transition">
              {tr.cert_try_again}
            </button>
            <Link href="/" className="bg-gray-200 text-gray-700 px-6 py-2.5 rounded-lg font-semibold hover:bg-gray-300 transition text-center">
              {tr.cert_back_home}
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-100 to-gray-200 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-black text-gray-900 mb-1">{tr.cert_success_title}</h1>
          <p className="text-gray-500 text-sm">{tr.cert_success_subtitle}</p>
        </div>

        {certData && <CertificateDisplay ref={certRef} data={certData} tr={tr} language={language} />}
        {certData && <ShareCard ref={shareCardRef} data={certData} tr={tr} />}

        <div className="flex flex-col sm:flex-row gap-3 mt-6">
          <button onClick={handleDownload} disabled={downloading} className="flex-1 bg-gray-900 text-white py-4 rounded-xl font-black hover:bg-gray-800 transition disabled:opacity-50 text-sm">
            {downloading ? tr.cert_downloading_btn : '⬇️ Download Share Card'}
          </button>
          <button onClick={handleShare} disabled={sharing} className="flex-1 bg-gradient-to-r from-pink-500 to-purple-600 text-white py-4 rounded-xl font-black hover:opacity-90 transition disabled:opacity-50 text-sm">
            {sharing ? tr.cert_sharing_btn : tr.cert_share_btn}
          </button>
        </div>

        <button onClick={handleDownloadFull} disabled={downloadingFull} className="w-full mt-3 bg-gray-200 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-300 transition disabled:opacity-50 text-sm">
          {downloadingFull ? '⏳ Saving...' : '🖼️ Download Full Certificate (Portrait)'}
        </button>

        <div className="flex items-center justify-center gap-4 mt-4">
          <a href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(tr.cert_twitter_text)}`} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-500 hover:underline">{tr.cert_share_twitter}</a>
          <span className="text-gray-300">·</span>
          <a href={`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent('https://notstupidcert.com')}`} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:underline">{tr.cert_share_linkedin}</a>
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
