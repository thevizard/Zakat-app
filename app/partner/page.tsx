'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import QRCode from 'qrcode'
import { TopNav } from '@/components/TopNav'

const BG = '#F5F5F0'
const TEXT_DARK = '#141414'
const FOREST = '#1E3F20'
const SUBTLE = '#6E6E6E'
const BORDER = '#E2E2D8'
const CARD_BG = '#FFFFFF'

export default function MosquePartnerPage() {
  const [masjidName, setMasjidName] = useState('East Plano Islamic Center')
  const [city, setCity] = useState('Plano, TX')
  const [portalUrl, setPortalUrl] = useState('https://us.mohid.co/tx/dallas/epic/masjid/online/donation')
  const [customMsg, setCustomMsg] = useState('100% of your Zakat stays in our local community to support families in need.')
  const [qrDataUrl, setQrDataUrl] = useState('')
  const [copiedLink, setCopiedLink] = useState(false)

  // Auto-generate clean URL slug from mosque name
  const origin = typeof window !== 'undefined' ? window.location.origin : 'https://www.zakatly.app'
  const autoSlug =
    masjidName
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '') || 'masjid'

  const shareUrl = `${origin}/m/${autoSlug}?name=${encodeURIComponent(masjidName)}&city=${encodeURIComponent(city)}&portal=${encodeURIComponent(portalUrl)}`

  useEffect(() => {
    QRCode.toDataURL(shareUrl, {
      width: 400,
      margin: 2,
      color: {
        dark: '#141414',
        light: '#FFFFFF',
      },
    })
      .then((url) => setQrDataUrl(url))
      .catch((err) => console.error('QR generation error:', err))
  }, [shareUrl])

  function handleCopy() {
    navigator.clipboard.writeText(shareUrl)
    setCopiedLink(true)
    setTimeout(() => setCopiedLink(false), 2500)
  }

  function handlePrintFlyer() {
    window.print()
  }

  return (
    <div style={{ background: BG, minHeight: '100vh', color: TEXT_DARK, fontFamily: 'Open Sans, -apple-system, BlinkMacSystemFont, sans-serif' }}>
      <div className="no-print">
        <TopNav />
      </div>

      {/* ── SCREEN VIEW HEADER ── */}
      <section className="no-print" style={{ maxWidth: 1140, margin: '0 auto', padding: '110px 24px 40px' }}>
        <div style={{ textAlign: 'center', maxWidth: 760, margin: '0 auto 48px' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              background: '#EBEBE5',
              border: `1px solid #DCDCD4`,
              borderRadius: 4,
              padding: '6px 14px',
              marginBottom: 16,
            }}
          >
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: FOREST }} />
            <span style={{ fontSize: 11, letterSpacing: 1.8, color: FOREST, textTransform: 'uppercase', fontWeight: 800 }}>
              For Mosques &amp; Community Centers
            </span>
          </div>

          <h1
            style={{
              fontSize: 'clamp(32px, 4.8vw, 52px)',
              fontWeight: 900,
              letterSpacing: '-1.4px',
              lineHeight: 1.1,
              marginBottom: 16,
              color: TEXT_DARK,
            }}
          >
            Empower Your Congregation.
            <br />
            <span style={{ color: FOREST }}>Collect Local Zakat Directly.</span>
          </h1>

          <p style={{ fontSize: 16, color: SUBTLE, lineHeight: 1.7, margin: '0 auto' }}>
            Provide your community with an authentic, contemporary Zakat calculator co-branded for your masjid. At the results page, congregants can fulfill their obligation directly to your existing donation portal — with <strong>0% platform fees</strong>.
          </p>
        </div>

        {/* ── 2-COLUMN BUILDER / PREVIEW ── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 340px), 1fr))', gap: 32, alignItems: 'start' }}>
          {/* Left Column: Mosque Details Form */}
          <div
            style={{
              background: CARD_BG,
              border: `1px solid ${BORDER}`,
              borderRadius: 16,
              padding: '32px 28px',
              boxShadow: '0 4px 20px rgba(20,20,20,0.03)',
            }}
          >
            <h2 style={{ fontSize: 18, fontWeight: 800, marginBottom: 6, color: TEXT_DARK }}>
              1. Enter Mosque Information
            </h2>
            <p style={{ fontSize: 13, color: SUBTLE, marginBottom: 24, lineHeight: 1.5 }}>
              Enter your masjid name and existing donation links. Your custom link and printable flyer update instantly.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5, color: SUBTLE, marginBottom: 6 }}>
                  Mosque Name
                </label>
                <input
                  type="text"
                  value={masjidName}
                  onChange={(e) => setMasjidName(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '11px 14px',
                    borderRadius: 8,
                    border: `1px solid ${BORDER}`,
                    fontSize: 14,
                    outline: 'none',
                    background: '#FFFFFF',
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5, color: SUBTLE, marginBottom: 6 }}>
                  City, State
                </label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '11px 14px',
                    borderRadius: 8,
                    border: `1px solid ${BORDER}`,
                    fontSize: 14,
                    outline: 'none',
                    background: '#FFFFFF',
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5, color: SUBTLE, marginBottom: 6 }}>
                  Existing Zakat Donation Portal URL (Mohid, Donorbox, LaunchGood, etc.)
                </label>
                <input
                  type="url"
                  value={portalUrl}
                  onChange={(e) => setPortalUrl(e.target.value)}
                  placeholder="https://us.mohid.co/..."
                  style={{
                    width: '100%',
                    padding: '11px 14px',
                    borderRadius: 8,
                    border: `1px solid ${BORDER}`,
                    fontSize: 14,
                    outline: 'none',
                    background: '#FFFFFF',
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5, color: SUBTLE, marginBottom: 6 }}>
                  Local Fund Message (Shown to donors)
                </label>
                <textarea
                  rows={2}
                  value={customMsg}
                  onChange={(e) => setCustomMsg(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '11px 14px',
                    borderRadius: 8,
                    border: `1px solid ${BORDER}`,
                    fontSize: 13,
                    outline: 'none',
                    background: '#FFFFFF',
                    boxSizing: 'border-box',
                    fontFamily: 'inherit',
                  }}
                />
              </div>
            </div>
          </div>

          {/* Right Column: Sharable Link & Printable Flyer Preview */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            {/* Custom Sharable Link Card */}
            <div
              style={{
                background: CARD_BG,
                border: `1px solid ${BORDER}`,
                borderRadius: 16,
                padding: '28px 24px',
                boxShadow: '0 4px 20px rgba(20,20,20,0.03)',
              }}
            >
              <h2 style={{ fontSize: 18, fontWeight: 800, marginBottom: 6, color: TEXT_DARK }}>
                2. Your Co-Branded Mosque Link
              </h2>
              <p style={{ fontSize: 13, color: SUBTLE, marginBottom: 16 }}>
                Share this in your WhatsApp community groups, email newsletters, and Friday Khutbah announcements:
              </p>

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  background: '#F5F5F0',
                  border: `1px solid ${BORDER}`,
                  borderRadius: 8,
                  padding: '8px 12px',
                  marginBottom: 14,
                  gap: 8,
                }}
              >
                <span
                  style={{
                    flex: 1,
                    fontSize: 13,
                    fontWeight: 700,
                    color: FOREST,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {shareUrl}
                </span>
                <button
                  type="button"
                  onClick={handleCopy}
                  style={{
                    background: FOREST,
                    color: '#FFFFFF',
                    border: 'none',
                    borderRadius: 6,
                    padding: '8px 14px',
                    fontSize: 12,
                    fontWeight: 700,
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {copiedLink ? 'Copied!' : 'Copy Link'}
                </button>
              </div>

              <div style={{ display: 'flex', gap: 10 }}>
                <a
                  href={shareUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 6,
                    background: '#FFFFFF',
                    border: `1px solid ${BORDER}`,
                    color: TEXT_DARK,
                    padding: '9px 16px',
                    borderRadius: 6,
                    fontSize: 13,
                    fontWeight: 600,
                    textDecoration: 'none',
                  }}
                >
                  Open Live Mosque Landing Page ↗
                </a>
              </div>
            </div>

            {/* Printable Bulletin Flyer Card */}
            <div
              style={{
                background: CARD_BG,
                border: `1px solid ${BORDER}`,
                borderRadius: 16,
                padding: '28px 24px',
                boxShadow: '0 4px 20px rgba(20,20,20,0.03)',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <div>
                  <h2 style={{ fontSize: 18, fontWeight: 800, color: TEXT_DARK, margin: 0 }}>
                    3. Printable Jummu&apos;ah Flyer
                  </h2>
                  <p style={{ fontSize: 13, color: SUBTLE, margin: '4px 0 0' }}>
                    Print this for your lobby foyer, bulletin boards, and prayer halls.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handlePrintFlyer}
                  style={{
                    background: FOREST,
                    color: '#FFFFFF',
                    border: 'none',
                    borderRadius: 8,
                    padding: '10px 18px',
                    fontSize: 13,
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    boxShadow: '0 2px 10px rgba(30,63,32,0.2)',
                  }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="6 9 6 2 18 2 18 9" />
                    <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
                    <rect x="6" y="14" width="12" height="8" />
                  </svg>
                  <span>Print Flyer</span>
                </button>
              </div>

              {/* Flyer Mini-Preview */}
              <div
                style={{
                  background: '#FFFFFF',
                  border: `2px dashed ${BORDER}`,
                  borderRadius: 12,
                  padding: '24px',
                  textAlign: 'center',
                }}
              >
                <div style={{ fontSize: 11, fontWeight: 800, color: FOREST, letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 4 }}>
                  {masjidName} · {city}
                </div>
                <h3 style={{ fontSize: 18, fontWeight: 900, color: TEXT_DARK, margin: '0 0 8px' }}>
                  Fulfill Your Zakat al-Mal
                </h3>
                <p style={{ fontSize: 12, color: SUBTLE, maxWidth: 360, margin: '0 auto 16px', lineHeight: 1.5 }}>
                  Scan below with your phone camera to calculate your Zakat with authentic scholarly guidance and fulfill directly to our local Zakat fund.
                </p>

                {qrDataUrl ? (
                  <div style={{ display: 'inline-block', padding: 8, background: '#FFFFFF', border: `1px solid ${BORDER}`, borderRadius: 12, marginBottom: 12 }}>
                    <img src={qrDataUrl} alt="Zakatly Mosque QR Code" style={{ width: 160, height: 160, display: 'block' }} />
                  </div>
                ) : (
                  <div style={{ width: 160, height: 160, background: '#F5F5F0', margin: '0 auto 12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    Loading QR...
                  </div>
                )}

                <div style={{ fontSize: 11, fontWeight: 700, color: TEXT_DARK }}>
                  Powered by Zakatly · zakatly.app
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── PRINT ONLY FULL FLYER TEMPLATE (Rendered when user prints) ── */}
      <div className="print-only" style={{ display: 'none', padding: '40px', fontFamily: 'Open Sans, sans-serif', color: '#141414' }}>
        <div style={{ textAlign: 'center', border: '3px solid #1E3F20', borderRadius: 20, padding: '48px 36px', height: '90vh', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'inline-block', background: '#F2F5F2', padding: '6px 18px', borderRadius: 50, fontSize: 14, fontWeight: 800, color: '#1E3F20', textTransform: 'uppercase', letterSpacing: 2, marginBottom: 16 }}>
              {city} · Community Zakat Fund
            </div>
            <h1 style={{ fontSize: 38, fontWeight: 900, margin: '0 0 12px', color: '#141414', lineHeight: 1.15 }}>
              {masjidName}
            </h1>
            <h2 style={{ fontSize: 22, fontWeight: 700, color: '#1E3F20', margin: '0 0 20px' }}>
              Calculate Your Zakat with Scholarly Precision
            </h2>
            <p style={{ fontSize: 16, color: '#555555', maxWidth: 540, margin: '0 auto', lineHeight: 1.6 }}>
              Accurate guidance across cash, stocks (30% equity proxy), 401(k)/IRA, and gold &amp; silver karat weights.
            </p>
          </div>

          <div style={{ margin: '32px 0' }}>
            <div style={{ display: 'inline-block', padding: 16, background: '#FFFFFF', border: '3px solid #141414', borderRadius: 20 }}>
              {qrDataUrl && <img src={qrDataUrl} alt="Scan QR" style={{ width: 260, height: 260, display: 'block' }} />}
            </div>
            <div style={{ fontSize: 18, fontWeight: 900, marginTop: 16, color: '#141414' }}>
              Open Phone Camera &amp; Scan to Calculate
            </div>
            <div style={{ fontSize: 14, color: '#777777', marginTop: 4 }}>
              Direct link: {shareUrl}
            </div>
          </div>

          <div style={{ borderTop: '1px solid #E2E2D8', paddingTop: 20 }}>
            <div style={{ display: 'flex', justifyContent: 'space-around', fontSize: 13, color: '#444444', fontWeight: 600, flexWrap: 'wrap', gap: 12 }}>
              <span>• 100% Private (No Account Needed)</span>
              <span>• Authentic Fiqh Consensus</span>
              <span>• 100% Stays in Local Community</span>
            </div>
            <div style={{ fontSize: 12, color: '#888888', marginTop: 12 }}>
              Built for our community by Zakatly · www.zakatly.app
            </div>
          </div>
        </div>
      </div>

      {/* Global Print Styles */}
      <style jsx global>{`
        @media print {
          body {
            background: white !important;
            color: black !important;
          }
          .no-print {
            display: none !important;
          }
          .print-only {
            display: block !important;
          }
        }
      `}</style>
    </div>
  )
}
