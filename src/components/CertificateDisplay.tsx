'use client'

import { forwardRef } from 'react'
import type { UiStrings } from '@/lib/i18n'

export interface CertificateData {
  name: string
  title?: string
  tier: 'basic' | 'premium' | 'supreme'
  date: string
  certNumber: string
  organization: string
  subtitle: string
  mainText: string
  signatory: string
  seal: string
  credentials?: string[]
  achievements?: string[]
  phd?: string
  roast?: string
}

interface Props {
  data: CertificateData
  tr: UiStrings
  language: string
}

const tierConfig = {
  basic: {
    outerBorder: '6px double #1e3a5f',
    innerBorder: '2px solid #2d5a8a',
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
    cornerColor: '#1e3a5f',
  },
  premium: {
    outerBorder: '6px double #b8860b',
    innerBorder: '2px solid #d4af37',
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
    cornerColor: '#d4af37',
  },
  supreme: {
    outerBorder: '6px double #7c3aed',
    innerBorder: '2px solid #a78bfa',
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
    cornerColor: '#7c3aed',
  },
}

export const CertificateDisplay = forwardRef<HTMLDivElement, Props>(({ data, tr, language }, ref) => {
  const cfg = tierConfig[data.tier]
  const isEnglish = language === 'English'
  const certificateFont = isEnglish
    ? 'var(--font-playfair), Georgia, "Times New Roman", serif'
    : 'var(--font-geist-sans), Arial, sans-serif'
  const headingLetterSpacing = isEnglish ? '0.05em' : '0.01em'
  const nameLetterSpacing = isEnglish ? '0.04em' : '0.01em'
  const bodyLineHeight = isEnglish ? '1.7' : '1.85'

  return (
    <div
      ref={ref}
      style={{
        background: cfg.bg,
        border: cfg.outerBorder,
        padding: '4px',
        maxWidth: '680px',
        width: '100%',
        margin: '0 auto',
        fontFamily: certificateFont,
        position: 'relative',
      }}
    >
      {/* Corner ornaments */}
      {(['top-0 left-0', 'top-0 right-0', 'bottom-0 left-0', 'bottom-0 right-0'] as const).map((pos, i) => (
        <div
          key={i}
          className={`absolute ${pos} w-8 h-8 pointer-events-none`}
          style={{
            borderTop: i < 2 ? `3px solid ${cfg.cornerColor}` : undefined,
            borderBottom: i >= 2 ? `3px solid ${cfg.cornerColor}` : undefined,
            borderLeft: i % 2 === 0 ? `3px solid ${cfg.cornerColor}` : undefined,
            borderRight: i % 2 === 1 ? `3px solid ${cfg.cornerColor}` : undefined,
          }}
        />
      ))}

      <div style={{ border: cfg.innerBorder, background: cfg.bgInner, padding: '32px 28px' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <p style={{ fontSize: '10px', fontFamily: 'var(--font-geist-sans), Arial, sans-serif', letterSpacing: '0.25em', textTransform: 'uppercase', color: cfg.orgColor, fontWeight: '700', marginBottom: '8px' }}>
            {data.organization}
          </p>
          <div style={{ borderTop: `1px solid ${cfg.dividerColor}`, margin: '8px 0' }} />
          <h1 style={{ fontSize: '22px', fontWeight: '700', color: cfg.subtitleColor, letterSpacing: headingLetterSpacing, margin: '0 0 4px' }}>
            {data.subtitle}
          </h1>
          {data.phd && (
            <p style={{ fontSize: '11px', fontStyle: 'italic', color: cfg.accentColor, margin: '4px 0 0' }}>
              {data.phd}
            </p>
          )}
          <div style={{ borderTop: `1px solid ${cfg.dividerColor}`, margin: '8px 0' }} />
        </div>

        {/* Body */}
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <p style={{ fontSize: '12px', color: cfg.textColor, marginBottom: '10px', fontStyle: 'italic' }}>
            {tr.cd_this_is_to}
          </p>
          <p style={{ fontSize: '36px', fontWeight: '900', color: cfg.nameColor, letterSpacing: nameLetterSpacing, margin: '0 0 4px', lineHeight: '1.15' }}>
            {data.name}
          </p>
          {data.title && (
            <p style={{ fontSize: '12px', fontStyle: 'italic', color: cfg.accentColor, margin: '2px 0 12px' }}>
              {data.title}
            </p>
          )}
          <p style={{ fontSize: '13px', lineHeight: bodyLineHeight, color: cfg.textColor, maxWidth: '520px', margin: '8px auto 0' }}>
            {data.mainText}
          </p>
        </div>

        {/* Credentials */}
        {data.credentials && data.credentials.length > 0 && (
          <div style={{ marginBottom: '16px', textAlign: 'center' }}>
            <div style={{ borderTop: `1px solid ${cfg.dividerColor}`, marginBottom: '10px' }} />
            <p style={{ fontSize: '9px', fontFamily: 'var(--font-geist-sans), Arial, sans-serif', letterSpacing: '0.2em', textTransform: 'uppercase', color: cfg.accentColor, fontWeight: '700', marginBottom: '6px' }}>
              {tr.cd_honors}
            </p>
            {data.credentials.map((c, i) => (
              <p key={i} style={{ fontSize: '11px', color: cfg.textColor, margin: '2px 0' }}>◆ {c}</p>
            ))}
          </div>
        )}

        {/* Achievements */}
        {data.achievements && data.achievements.length > 0 && (
          <div style={{ marginBottom: '16px', textAlign: 'center' }}>
            <p style={{ fontSize: '9px', fontFamily: 'var(--font-geist-sans), Arial, sans-serif', letterSpacing: '0.2em', textTransform: 'uppercase', color: cfg.accentColor, fontWeight: '700', marginBottom: '6px' }}>
              {tr.cd_achievements}
            </p>
            {data.achievements.map((a, i) => (
              <p key={i} style={{ fontSize: '11px', color: cfg.textColor, margin: '2px 0' }}>✓ {a}</p>
            ))}
          </div>
        )}

        {/* Roast */}
        {data.roast && (
          <div style={{ textAlign: 'center', borderTop: `1px solid ${cfg.dividerColor}`, paddingTop: '10px', marginBottom: '16px' }}>
            <p style={{ fontSize: '11px', fontStyle: 'italic', color: cfg.accentColor }}>⚡ {data.roast}</p>
          </div>
        )}

        {/* Footer */}
        <div style={{ borderTop: `1px solid ${cfg.dividerColor}`, paddingTop: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
          {/* Seal */}
          <div style={{ width: '80px', height: '80px', borderRadius: '50%', border: `3px solid ${cfg.sealBorder}`, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '8px', flexShrink: 0 }}>
            <div style={{ width: '60px', height: '60px', borderRadius: '50%', border: `1px solid ${cfg.sealBorder}`, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '6px' }}>
              <span style={{ fontSize: '7px', fontWeight: '800', lineHeight: '1.3', letterSpacing: '0.05em', color: cfg.sealColor, fontFamily: 'var(--font-geist-sans), Arial, sans-serif', textTransform: 'uppercase' }}>
                {data.seal}
              </span>
            </div>
          </div>

          {/* Date, cert#, signature */}
          <div style={{ textAlign: 'right' }}>
            <p style={{ fontSize: '10px', color: cfg.textColor, margin: '0 0 2px' }}>{tr.cd_issued} {data.date}</p>
            <p style={{ fontSize: '10px', color: cfg.textColor, margin: '0 0 14px' }}>{tr.cd_cert_num} {data.certNumber}</p>
            <div style={{ borderBottom: `1px solid ${cfg.dividerColor}`, width: '160px', marginBottom: '4px', marginLeft: 'auto' }} />
            <p style={{ fontSize: '10px', color: cfg.textColor, fontStyle: 'italic' }}>{data.signatory}</p>
          </div>
        </div>

        {/* Bottom tagline */}
        <div style={{ textAlign: 'center', marginTop: '12px' }}>
          <p style={{ fontSize: '8px', fontFamily: 'var(--font-geist-sans), Arial, sans-serif', letterSpacing: '0.15em', textTransform: 'uppercase', color: cfg.accentColor, opacity: 0.7 }}>
            {tr.cd_tagline}
          </p>
        </div>
      </div>
    </div>
  )
})

CertificateDisplay.displayName = 'CertificateDisplay'
