'use client'

import { useEffect, useState, use } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { TopNav } from '@/components/TopNav'
import { getMasjidBySlug, parseCustomMasjid } from '@/lib/data/masajid'
import { useCalculatorStore } from '@/store/calculatorStore'
import { MosquePartner } from '@/types/masjid.types'

const BG = '#F5F5F0'
const TEXT_DARK = '#141414'
const FOREST = '#1E3F20'
const SUBTLE = '#6E6E6E'
const BORDER = '#E2E2D8'
const CARD_BG = '#FFFFFF'

export default function MosqueLandingPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const resolvedParams = use(params)
  const router = useRouter()
  const searchParams = useSearchParams()
  const setPartnerMasjid = useCalculatorStore((s) => s.setPartnerMasjid)
  const setSkipIntro = useCalculatorStore((s) => s.setSkipIntro)

  // Look up dynamic query params first, or fall back to seed masjid slug
  const initialMasjid: MosquePartner | null =
    parseCustomMasjid({
      name: searchParams.get('name'),
      city: searchParams.get('city'),
      portal: searchParams.get('portal'),
    }) || getMasjidBySlug(resolvedParams.slug)

  const [masjid, setMasjid] = useState<MosquePartner | null>(initialMasjid)

  useEffect(() => {
    if (!masjid && typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem('zakatly_saved_mosques')
        if (stored) {
          const list = JSON.parse(stored)
          const found = list.find((m: any) => m.slug.toLowerCase() === resolvedParams.slug.toLowerCase())
          if (found) {
            setMasjid({
              slug: found.slug,
              name: found.name,
              city: found.city,
              portalUrl: found.portalUrl,
              customMessage: found.customMsg,
            })
          }
        }
      } catch (e) {
        console.error(e)
      }
    }
  }, [masjid, resolvedParams.slug])

  useEffect(() => {
    if (masjid) {
      setPartnerMasjid(masjid)
    }
  }, [masjid, setPartnerMasjid])

  function handleStart() {
    if (masjid) {
      setPartnerMasjid(masjid)
    }
    setSkipIntro(false)
    router.push('/calculator')
  }

  if (!masjid) {
    return (
      <div style={{ background: BG, minHeight: '100vh', color: TEXT_DARK, fontFamily: 'Open Sans, sans-serif' }}>
        <TopNav />
        <div style={{ maxWidth: 600, margin: '140px auto 40px', padding: '0 24px', textAlign: 'center' }}>
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: '50%',
              background: '#EBEBE5',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 20px',
              color: FOREST,
            }}
          >
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 21h18M5 21V7l7-4 7 4v14M9 10a3 3 0 0 1 6 0v11H9V10z" />
            </svg>
          </div>
          <h1 style={{ fontSize: 28, fontWeight: 900, marginBottom: 12 }}>Masjid Link Not Found</h1>
          <p style={{ color: SUBTLE, fontSize: 15, lineHeight: 1.6, marginBottom: 28 }}>
            We couldn&apos;t find this specific mosque partner link. You can still calculate your Zakat accurately using our standard calculator or register your mosque.
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link
              href="/calculator"
              style={{
                background: FOREST,
                color: '#FFFFFF',
                padding: '13px 26px',
                borderRadius: 8,
                fontWeight: 700,
                textDecoration: 'none',
              }}
            >
              Open Standard Calculator →
            </Link>
            <Link
              href="/partner"
              style={{
                background: '#FFFFFF',
                border: `1px solid ${BORDER}`,
                color: TEXT_DARK,
                padding: '13px 22px',
                borderRadius: 8,
                fontWeight: 600,
                textDecoration: 'none',
              }}
            >
              Register a Mosque
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div style={{ background: BG, minHeight: '100vh', color: TEXT_DARK, fontFamily: 'Open Sans, -apple-system, BlinkMacSystemFont, sans-serif' }}>
      <TopNav />

      {/* Hero */}
      <section style={{ maxWidth: 840, margin: '0 auto', padding: '120px 24px 80px', textAlign: 'center' }}>
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            background: '#EBEBE5',
            border: `1px solid #DCDCD4`,
            borderRadius: 4,
            padding: '6px 14px',
            marginBottom: 24,
          }}
        >
          <div style={{ width: 6, height: 6, borderRadius: '50%', background: FOREST }} />
          <span style={{ fontSize: 11, letterSpacing: 1.8, color: FOREST, textTransform: 'uppercase', fontWeight: 800 }}>
            {masjid.city ? `${masjid.city} · Official Partner` : 'Official Community Partner'}
          </span>
        </div>

        <h1
          style={{
            fontSize: 'clamp(32px, 5.2vw, 56px)',
            fontWeight: 900,
            letterSpacing: '-1.4px',
            lineHeight: 1.08,
            marginBottom: 16,
            color: TEXT_DARK,
          }}
        >
          {masjid.name}
          <br />
          <span style={{ color: FOREST }}>Zakat Calculator</span>
        </h1>

        <p
          style={{
            fontSize: 17,
            color: SUBTLE,
            lineHeight: 1.7,
            maxWidth: 580,
            margin: '0 auto 32px',
          }}
        >
          Calculate your annual Zakat accurately with authentic scholarly guidance across cash, stocks, 401(k), and gold — and fulfill your obligation directly to our community fund.
        </p>

        {/* Custom Mosque Message Banner */}
        {masjid.customMessage && (
          <div
            style={{
              background: CARD_BG,
              border: `1px solid ${BORDER}`,
              borderRadius: 12,
              padding: '18px 24px',
              maxWidth: 620,
              margin: '0 auto 36px',
              textAlign: 'left',
              display: 'flex',
              alignItems: 'flex-start',
              gap: 14,
              boxShadow: '0 2px 12px rgba(20,20,20,0.03)',
            }}
          >
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: '50%',
                background: '#F2F5F2',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: FOREST,
                flexShrink: 0,
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
              </svg>
            </div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 800, color: FOREST, marginBottom: 2 }}>
                Local Community Fund
              </div>
              <div style={{ fontSize: 13, color: SUBTLE, lineHeight: 1.6 }}>
                {masjid.customMessage}
              </div>
            </div>
          </div>
        )}

        {/* Action Button */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: 14, flexWrap: 'wrap', marginBottom: 48 }}>
          <button
            type="button"
            onClick={handleStart}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              background: FOREST,
              color: '#FFFFFF',
              padding: '16px 36px',
              borderRadius: 8,
              fontSize: 15,
              fontWeight: 700,
              cursor: 'pointer',
              border: 'none',
              boxShadow: '0 4px 18px rgba(30,63,32,0.25)',
            }}
          >
            Start Mosque Zakat Calculator →
          </button>
          {masjid.portalUrl && (
            <a
              href={masjid.portalUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                background: '#FFFFFF',
                color: TEXT_DARK,
                border: `1px solid ${BORDER}`,
                padding: '16px 26px',
                borderRadius: 8,
                fontSize: 14,
                fontWeight: 600,
                textDecoration: 'none',
              }}
            >
              Already Know Your Number? Give Directly ↗
            </a>
          )}
        </div>

        {/* Feature Pills */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: 16,
            maxWidth: 720,
            margin: '0 auto',
            textAlign: 'left',
          }}
        >
          {[
            {
              title: '100% Private',
              desc: 'Calculations run in your browser. No login or banking credentials needed.',
              icon: (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={FOREST} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
              ),
            },
            {
              title: 'Authentic Fiqh Guidance',
              desc: 'Built on AMJA, AAOIFI, and contemporary consensus methodology.',
              icon: (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={FOREST} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m16 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z" />
                  <path d="m2 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z" />
                  <path d="M7 21h10" />
                  <path d="M12 3v18" />
                  <path d="M3 7h2c2 0 5-1 7-2 2 1 5 2 7 2h2" />
                </svg>
              ),
            },
            {
              title: 'Direct Local Impact',
              desc: `Seamlessly direct your Zakat to ${masjid.name} with zero deduction.`,
              icon: (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={FOREST} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 21h18M5 21V7l7-4 7 4v14M9 10a3 3 0 0 1 6 0v11H9V10z" />
                </svg>
              ),
            },
          ].map((item) => (
            <div
              key={item.title}
              style={{
                background: CARD_BG,
                border: `1px solid ${BORDER}`,
                borderRadius: 12,
                padding: '20px 20px',
                boxShadow: '0 2px 8px rgba(20,20,20,0.02)',
              }}
            >
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 8,
                  background: '#F2F5F2',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: 12,
                }}
              >
                {item.icon}
              </div>
              <div style={{ fontSize: 14, fontWeight: 800, color: TEXT_DARK, marginBottom: 4 }}>
                {item.title}
              </div>
              <div style={{ fontSize: 12, color: SUBTLE, lineHeight: 1.55 }}>
                {item.desc}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
