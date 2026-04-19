'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { CertificateDisplay, CertificateData } from '@/components/CertificateDisplay'
import type { UiStrings } from '@/lib/i18n'

interface Props {
  sessionId: string
  tr: UiStrings
}

export default function CertificateView({ sessionId, tr }: Props) {
  const certRef = useRef<HTMLDivElement>(null)
  const [certData, setCertData] = useState<CertificateData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [downloading, setDownloading] = useState(false)
  const [sharing, setSharing] = useState(false)

  useEffect(() => {
    if (!sessionId) {
      setError('No session ID found. Did you complete the payment?')
      setLoading(false)
      return
    }

    fetch(`/api/generate-certificate?session_id=${encodeURIComponent(sessionId)}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.error) setError(data.error)
        else setCertData(data as CertificateData)
        setLoading(false)
      })
      .catch(() => {
        setError('Failed to load your certificate. Please refresh the page.')
        setLoading(false)
      })
  }, [sessionId])

  const captureCanvas = async () => {
    if (!certRef.current) return null
    const html2canvas = (await import('html2canvas')).default
    return html2canvas(certRef.current, { scale: 2, useCORS: true, allowTaint: true, backgroundColor: null })
  }

  const handleDownload = async () => {
    setDownloading(true)
    try {
      const canvas = await captureCanvas()
      if (!canvas) return
      const link = document.createElement('a')
      link.download = `certificate-${certData?.name?.replace(/\s+/g, '-').toLowerCase() ?? 'mine'}.png`
      link.href = canvas.toDataURL('image/png')
      link.click()
    } catch (err) {
      console.error(err)
    } finally {
      setDownloading(false)
    }
  }

  const handleShare = async () => {
    setSharing(true)
    try {
      const canvas = await captureCanvas()
      if (!canvas) return
      canvas.toBlob(async (blob) => {
        if (!blob) return
        const file = new File([blob], 'certificate.png', { type: 'image/png' })
        const shareData = { title: 'Certified Not Stupid™', text: tr.cert_twitter_text, files: [file] }
        if (navigator.share && navigator.canShare(shareData)) {
          await navigator.share(shareData)
        } else {
          const link = document.createElement('a')
          link.download = 'certificate.png'
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

        {certData && <CertificateDisplay ref={certRef} data={certData} tr={tr} />}

        <div className="flex flex-col sm:flex-row gap-3 mt-6">
          <button
            onClick={handleDownload}
            disabled={downloading}
            className="flex-1 bg-gray-900 text-white py-4 rounded-xl font-black hover:bg-gray-800 transition disabled:opacity-50 text-sm"
          >
            {downloading ? tr.cert_downloading_btn : tr.cert_download_btn}
          </button>
          <button
            onClick={handleShare}
            disabled={sharing}
            className="flex-1 bg-gradient-to-r from-pink-500 to-purple-600 text-white py-4 rounded-xl font-black hover:opacity-90 transition disabled:opacity-50 text-sm"
          >
            {sharing ? tr.cert_sharing_btn : tr.cert_share_btn}
          </button>
        </div>

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
