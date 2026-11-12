'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ZakatlyLogo } from '@/components/ZakatlyLogo'

type MockupTheme = 'color-blocked' | 'cinematic-editorial' | 'minimal-gallery'

function fmt(n: number) {
  return '$' + Math.round(n).toLocaleString('en-US')
}

export default function MockupsPage() {
  const [theme, setTheme] = useState<MockupTheme>('color-blocked')

  // Interactive simulator state
  const [simCash, setSimCash] = useState<number>(30000)
  const [simStocks, setSimStocks] = useState<number>(100000)
  const [simRetirement, setSimRetirement] = useState<number>(80000)

  const grossPortfolio = simCash + simStocks + simRetirement
  const naiveZakat = grossPortfolio * 0.025
  const scholarlyZakatableBase = simCash + simStocks * 0.3 + simRetirement * 0.68
  const scholarlyZakat = scholarlyZakatableBase * 0.025
  const effectiveRate = grossPortfolio > 0 ? (scholarlyZakat / grossPortfolio) * 100 : 0

  const sharedProps: SharedProps = {
    simCash,
    setSimCash,
    simStocks,
    setSimStocks,
    simRetirement,
    setSimRetirement,
    grossPortfolio,
    naiveZakat,
    scholarlyZakat,
    effectiveRate,
  }

  return (
    <div style={{ minHeight: '100vh', fontFamily: 'Open Sans, -apple-system, BlinkMacSystemFont, sans-serif' }}>
      {/* ── FLOATING CONCEPT SWITCHER ── */}
      <div
        style={{
          position: 'fixed',
          bottom: 22,
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 100,
          background: 'rgba(14, 20, 17, 0.94)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          borderRadius: 100,
          padding: '6px 8px',
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          boxShadow: '0 16px 48px rgba(0,0,0,0.4)',
          border: '1px solid rgba(255, 255, 255, 0.14)',
        }}
      >
        <span
          style={{
            fontSize: 11,
            fontWeight: 800,
            color: '#C5A059',
            letterSpacing: 1.4,
            textTransform: 'uppercase',
            padding: '0 12px 0 10px',
            borderRight: '1px solid rgba(255,255,255,0.14)',
          }}
        >
          Visual Mockups
        </span>
        {[
          { id: 'color-blocked', label: '01 · Shaded Sanctuary (Editorial & Warm)' },
          { id: 'cinematic-editorial', label: '02 · Cinematic Arch & Visual Bars' },
          { id: 'minimal-gallery', label: '03 · Minimalist Gallery & Bento' },
        ].map((t) => {
          const active = theme === t.id
          return (
            <button
              key={t.id}
              onClick={() => setTheme(t.id as MockupTheme)}
              style={{
                background: active ? '#183A21' : 'transparent',
                color: active ? '#FFFFFF' : 'rgba(255,255,255,0.7)',
                border: active ? '1px solid rgba(197, 160, 89, 0.5)' : '1px solid transparent',
                padding: '9px 18px',
                borderRadius: 100,
                fontSize: 12.5,
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'all 0.2s',
                whiteSpace: 'nowrap',
              }}
            >
              {t.label}
            </button>
          )
        })}
      </div>

      {theme === 'color-blocked' && <ColorBlockedMockup {...sharedProps} />}
      {theme === 'cinematic-editorial' && <CinematicEditorialMockup {...sharedProps} />}
      {theme === 'minimal-gallery' && <MinimalGalleryMockup {...sharedProps} />}
    </div>
  )
}

interface SharedProps {
  simCash: number
  setSimCash: (v: number) => void
  simStocks: number
  setSimStocks: (v: number) => void
  simRetirement: number
  setSimRetirement: (v: number) => void
  grossPortfolio: number
  naiveZakat: number
  scholarlyZakat: number
  effectiveRate: number
}

// ═════════════════════════════════════════════════════════════════════════════
// MOCKUP 01: SHADED SANCTUARY (Distinct Section Shading, Imagery, Minimal Text)
// ═════════════════════════════════════════════════════════════════════════════
function ColorBlockedMockup(props: SharedProps) {
  const {
    simCash,
    setSimCash,
    simStocks,
    setSimStocks,
    simRetirement,
    setSimRetirement,
    grossPortfolio,
    naiveZakat,
    scholarlyZakat,
    effectiveRate,
  } = props

  const constFOREST = '#16351F'
  const DARK_SECTION = '#102417'
  const ALABASTER = '#F7F5EF'
  const STONE_SHADE = '#EAE6DC'
  const INK = '#121614'
  const MUTED = '#5A625D'
  const BRASS = '#C5A059'

  return (
    <div style={{ background: ALABASTER, color: INK }}>
      {/* Clean Header */}
      <header
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 40,
          background: 'rgba(247, 245, 239, 0.92)',
          backdropFilter: 'blur(12px)',
          borderBottom: '1px solid #E2DFD5',
        }}
      >
        <div
          style={{
            maxWidth: 1200,
            margin: '0 auto',
            height: 70,
            padding: '0 28px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <ZakatlyLogo variant="rub-al-ushr" height={42} />
          <div style={{ display: 'flex', alignItems: 'center', gap: 28 }}>
            <a href="#rates" style={{ fontSize: 14, fontWeight: 600, color: MUTED, textDecoration: 'none' }}>
              Asset Rates
            </a>
            <a href="#estimator" style={{ fontSize: 14, fontWeight: 600, color: MUTED, textDecoration: 'none' }}>
              Estimator
            </a>
            <Link href="/partner" style={{ fontSize: 14, fontWeight: 600, color: MUTED, textDecoration: 'none' }}>
              For Mosques
            </Link>
            <Link
              href="/calculator"
              style={{
                background: constFOREST,
                color: '#FFFFFF',
                padding: '10px 22px',
                borderRadius: 8,
                fontSize: 14,
                fontWeight: 700,
                textDecoration: 'none',
              }}
            >
              Calculate Zakat →
            </Link>
          </div>
        </div>
      </header>

      {/* ── SECTION 1 (SHADE: WARM ALABASTER): VISUAL HERO WITH ARCH PHOTOGRAPHY ── */}
      <section style={{ padding: '72px 28px 88px', maxWidth: 1200, margin: '0 auto' }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 420px), 1fr))',
            gap: 56,
            alignItems: 'center',
          }}
        >
          {/* Left: Minimal, High-Impact Typography */}
          <div>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                background: STONE_SHADE,
                padding: '6px 14px',
                borderRadius: 100,
                fontSize: 12,
                fontWeight: 800,
                letterSpacing: 1.2,
                textTransform: 'uppercase',
                color: constFOREST,
                marginBottom: 24,
              }}
            >
              100% Private · AAOIFI &amp; AMJA Aligned
            </div>

            <h1
              style={{
                fontSize: 'clamp(42px, 5.2vw, 64px)',
                fontWeight: 800,
                lineHeight: 1.05,
                letterSpacing: '-1.8px',
                margin: '0 0 20px',
              }}
            >
              Not Everything You Own Is Taxed at 2.5%.
            </h1>

            <p style={{ fontSize: 19, color: MUTED, lineHeight: 1.6, margin: '0 0 36px', maxWidth: 480 }}>
              Index funds, 401(k)s, and jewelry each have their own scholarly rate. Calculate your exact Zakat in 2 minutes—privately in your browser.
            </p>

            <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
              <Link
                href="/calculator"
                style={{
                  background: constFOREST,
                  color: '#FFFFFF',
                  padding: '17px 34px',
                  borderRadius: 8,
                  fontSize: 16,
                  fontWeight: 700,
                  textDecoration: 'none',
                }}
              >
                Start 2-Minute Assessment →
              </Link>
              <a
                href="#rates"
                style={{
                  background: '#FFFFFF',
                  color: INK,
                  border: '1px solid #DCD8CE',
                  padding: '17px 26px',
                  borderRadius: 8,
                  fontSize: 16,
                  fontWeight: 700,
                  textDecoration: 'none',
                }}
              >
                See the 4 Rates
              </a>
            </div>
          </div>

          {/* Right: Editorial Arch Image + Floating Glass Summary Badge */}
          <div style={{ position: 'relative' }}>
            <div
              style={{
                borderRadius: 20,
                overflow: 'hidden',
                height: 460,
                boxShadow: '0 24px 60px rgba(18, 22, 20, 0.12)',
                position: 'relative',
              }}
            >
              <img
                src="/courtyard-arches.jpg"
                alt="Serene limestone courtyard"
                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
              />
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(to top, rgba(16,36,23,0.75) 0%, rgba(16,36,23,0.1) 55%, transparent 100%)',
                }}
              />

              {/* Floating Overlay Card inside Image */}
              <div
                style={{
                  position: 'absolute',
                  bottom: 24,
                  left: 24,
                  right: 24,
                  background: 'rgba(255, 255, 255, 0.95)',
                  backdropFilter: 'blur(12px)',
                  borderRadius: 14,
                  padding: '20px 24px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: 16,
                }}
              >
                <div>
                  <div style={{ fontSize: 11.5, fontWeight: 800, textTransform: 'uppercase', letterSpacing: 1, color: MUTED }}>
                    Sample $210,000 Portfolio
                  </div>
                  <div style={{ fontSize: 15, fontWeight: 700, color: INK, marginTop: 2 }}>
                    Generic Calculator: <span style={{ textDecoration: 'line-through', color: '#8A867E' }}>$5,250</span>
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: 11.5, fontWeight: 800, textTransform: 'uppercase', letterSpacing: 1, color: constFOREST }}>
                    True Scholarly Zakat
                  </div>
                  <div style={{ fontSize: 26, fontWeight: 900, color: constFOREST, lineHeight: 1.1 }}>
                    $2,860 <span style={{ fontSize: 13, fontWeight: 700, color: MUTED }}>(1.36%)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── SECTION 2 (SHADE: DEEP FOREST EMERALD): THE 4 RATES AT A GLANCE ── */}
      <section id="rates" style={{ background: DARK_SECTION, color: '#FFFFFF', padding: '88px 28px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 20, marginBottom: 48 }}>
            <div>
              <div style={{ fontSize: 12, fontWeight: 800, color: BRASS, letterSpacing: 1.6, textTransform: 'uppercase', marginBottom: 8 }}>
                Scholarly Clarity in 10 Seconds
              </div>
              <h2 style={{ fontSize: 'clamp(30px, 3.8vw, 44px)', fontWeight: 800, letterSpacing: '-1px', margin: 0 }}>
                Four Asset Types. Four Different Rules.
              </h2>
            </div>
            <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.68)', margin: 0, maxWidth: 400 }}>
              Zakat applies only to liquid, accessible wealth—never to factories, unvested taxes, or personal homes.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 260px), 1fr))', gap: 20 }}>
            {[
              {
                rate: '2.5%',
                label: 'Cash & Precious Metals',
                barPct: 100,
                caption: '100% liquid balance held for one lunar year.',
              },
              {
                rate: '0.75%',
                label: 'Passive Stocks & ETFs',
                barPct: 30,
                caption: 'Only 30% of corporate value is liquid cash & inventory.',
              },
              {
                rate: '2.5% Net',
                label: '401(k) & Traditional IRA',
                barPct: 68,
                caption: 'Assessed only after deducting taxes & 10% penalty.',
              },
              {
                rate: '0%',
                label: 'Primary Home & Cars',
                barPct: 4,
                caption: 'Personal living essentials are 100% exempt.',
              },
            ].map((item) => (
              <div
                key={item.label}
                style={{
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: 16,
                  padding: '28px 26px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  gap: 20,
                }}
              >
                <div>
                  <div style={{ fontSize: 40, fontWeight: 900, color: BRASS, letterSpacing: '-1px', marginBottom: 6 }}>
                    {item.rate}
                  </div>
                  <div style={{ fontSize: 18, fontWeight: 800, color: '#FFFFFF', marginBottom: 8 }}>
                    {item.label}
                  </div>
                  <p style={{ fontSize: 14.5, color: 'rgba(255,255,255,0.7)', lineHeight: 1.5, margin: 0 }}>
                    {item.caption}
                  </p>
                </div>

                {/* Visual Zakatable Base Bar */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11.5, color: 'rgba(255,255,255,0.55)', marginBottom: 6, fontWeight: 700 }}>
                    <span>ZAKATABLE PORTION</span>
                    <span>{item.barPct === 4 ? '0%' : `${item.barPct}%`}</span>
                  </div>
                  <div style={{ height: 6, background: 'rgba(255,255,255,0.12)', borderRadius: 100, overflow: 'hidden' }}>
                    <div style={{ width: `${item.barPct}%`, height: '100%', background: BRASS, borderRadius: 100 }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SECTION 3 (SHADE: WARM TRAVERTINE STONE): INTERACTIVE VISUAL ESTIMATOR ── */}
      <section id="estimator" style={{ background: STONE_SHADE, padding: '88px 28px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div
            style={{
              background: '#FFFFFF',
              borderRadius: 20,
              padding: 'clamp(28px, 5vw, 48px)',
              boxShadow: '0 16px 40px rgba(18, 22, 20, 0.05)',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 380px), 1fr))',
              gap: 48,
              alignItems: 'center',
            }}
          >
            <div>
              <div style={{ fontSize: 12, fontWeight: 800, color: BRASS, textTransform: 'uppercase', letterSpacing: 1.4, marginBottom: 8 }}>
                Live Simulator
              </div>
              <h3 style={{ fontSize: 30, fontWeight: 800, margin: '0 0 24px', letterSpacing: '-0.8px' }}>
                See How Much You Save From Overpaying
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 15, fontWeight: 700, marginBottom: 8 }}>
                    <span>Cash &amp; Checking <span style={{ color: MUTED, fontWeight: 500 }}>(2.5%)</span></span>
                    <span style={{ fontVariantNumeric: 'tabular-nums', fontWeight: 800 }}>{fmt(simCash)}</span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={150000}
                    step={5000}
                    value={simCash}
                    onChange={(e) => setSimCash(Number(e.target.value))}
                    style={{ width: '100%', accentColor: constFOREST, cursor: 'pointer' }}
                  />
                </div>

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 15, fontWeight: 700, marginBottom: 8 }}>
                    <span>Index ETFs &amp; Stocks <span style={{ color: constFOREST, fontWeight: 600 }}>(0.75% Eff.)</span></span>
                    <span style={{ fontVariantNumeric: 'tabular-nums', fontWeight: 800 }}>{fmt(simStocks)}</span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={300000}
                    step={10000}
                    value={simStocks}
                    onChange={(e) => setSimStocks(Number(e.target.value))}
                    style={{ width: '100%', accentColor: constFOREST, cursor: 'pointer' }}
                  />
                </div>

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 15, fontWeight: 700, marginBottom: 8 }}>
                    <span>401(k) &amp; IRA <span style={{ color: BRASS, fontWeight: 600 }}>(Net of Tax)</span></span>
                    <span style={{ fontVariantNumeric: 'tabular-nums', fontWeight: 800 }}>{fmt(simRetirement)}</span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={250000}
                    step={10000}
                    value={simRetirement}
                    onChange={(e) => setSimRetirement(Number(e.target.value))}
                    style={{ width: '100%', accentColor: constFOREST, cursor: 'pointer' }}
                  />
                </div>
              </div>
            </div>

            {/* Right Visual Result Box */}
            <div
              style={{
                background: ALABASTER,
                border: '1px solid #DFDCD2',
                borderRadius: 16,
                padding: '32px',
                display: 'flex',
                flexDirection: 'column',
                gap: 24,
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', borderBottom: '1px solid #DFDCD2', paddingBottom: 20 }}>
                <div>
                  <div style={{ fontSize: 12, fontWeight: 800, color: MUTED, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 6 }}>
                    True Scholarly Zakat
                  </div>
                  <div style={{ fontSize: 48, fontWeight: 900, color: constFOREST, lineHeight: 1, fontVariantNumeric: 'tabular-nums' }}>
                    {fmt(scholarlyZakat)}
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: MUTED, textTransform: 'uppercase', marginBottom: 4 }}>
                    Naive 2.5%
                  </div>
                  <div style={{ fontSize: 24, fontWeight: 800, color: '#8A867E', textDecoration: 'line-through', fontVariantNumeric: 'tabular-nums' }}>
                    {fmt(naiveZakat)}
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 15, fontWeight: 700 }}>
                <span style={{ color: MUTED }}>Effective Rate on {fmt(grossPortfolio)}:</span>
                <span style={{ color: INK }}>{effectiveRate.toFixed(2)}%</span>
              </div>

              <Link
                href="/calculator"
                style={{
                  background: constFOREST,
                  color: '#FFFFFF',
                  textAlign: 'center',
                  padding: '16px',
                  borderRadius: 10,
                  fontSize: 15,
                  fontWeight: 700,
                  textDecoration: 'none',
                }}
              >
                Open Full Guided Calculator →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── SECTION 4 (SHADE: PURE WHITE): STILL-LIFE IMAGE + 3 TRUST PILLARS ── */}
      <section style={{ background: '#FFFFFF', padding: '88px 28px' }}>
        <div
          style={{
            maxWidth: 1200,
            margin: '0 auto',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 400px), 1fr))',
            gap: 56,
            alignItems: 'center',
          }}
        >
          <div style={{ borderRadius: 20, overflow: 'hidden', height: 380, boxShadow: '0 16px 40px rgba(0,0,0,0.06)' }}>
            <img
              src="/wealth-geometry.jpg"
              alt="Minimalist travertine and brass geometry"
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
            />
          </div>

          <div>
            <div style={{ fontSize: 12, fontWeight: 800, color: BRASS, textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 10 }}>
              Built for Trust
            </div>
            <h2 style={{ fontSize: 36, fontWeight: 800, margin: '0 0 28px', letterSpacing: '-1px', lineHeight: 1.15 }}>
              Private by Default. Community First.
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              {[
                { title: '0 Bytes Stored in the Cloud', desc: 'Your numbers never leave your browser tab. No accounts, no tracking.' },
                { title: 'Instant PDF & Email Receipt', desc: 'Download a clean itemized record generated directly on your device.' },
                { title: 'Co-Branded for Local Mosques', desc: 'Mosques get a custom link so congregants donate 100% directly.' },
              ].map((p) => (
                <div key={p.title} style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
                  <div style={{ width: 28, height: 28, borderRadius: '50%', background: '#EDF3EE', color: constFOREST, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 2, fontWeight: 900, fontSize: 14 }}>
                    ✓
                  </div>
                  <div>
                    <div style={{ fontSize: 17, fontWeight: 800, marginBottom: 2 }}>{p.title}</div>
                    <div style={{ fontSize: 15, color: MUTED }}>{p.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

// ═════════════════════════════════════════════════════════════════════════════
// MOCKUP 02: CINEMATIC ARCH & VISUAL PROPORTION BARS
// Full-bleed mosque archway hero, horizontal visual bars, dark emerald vault
// ═════════════════════════════════════════════════════════════════════════════
function CinematicEditorialMockup(props: SharedProps) {
  const {
    simCash,
    setSimCash,
    simStocks,
    setSimStocks,
    simRetirement,
    setSimRetirement,
    scholarlyZakat,
    naiveZakat,
  } = props

  const SAND = '#F4F1EA'
  const FOREST = '#142E1C'
  const GOLD = '#D4AF63'
  const INK = '#141715'
  const MUTED = '#5C645E'

  return (
    <div style={{ background: SAND, color: INK, paddingBottom: 90 }}>
      {/* ── SECTION 1: CINEMATIC ARCHWAY PHOTOGRAPHY HERO ── */}
      <section
        style={{
          position: 'relative',
          minHeight: 620,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          color: '#FFFFFF',
          overflow: 'hidden',
        }}
      >
        <img
          src="/mosque-bg.png"
          alt="Architectural Mosque Arch"
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            zIndex: 0,
          }}
        />
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(180deg, rgba(10,22,14,0.82) 0%, rgba(10,22,14,0.72) 50%, rgba(10,22,14,0.94) 100%)',
            zIndex: 1,
          }}
        />

        {/* Top Nav inside Hero */}
        <div
          style={{
            position: 'relative',
            zIndex: 2,
            maxWidth: 1200,
            width: '100%',
            margin: '0 auto',
            padding: '24px 28px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <ZakatlyLogo variant="rub-al-ushr" inverted height={36} />
          <div style={{ display: 'flex', alignItems: 'center', gap: 28 }}>
            <Link href="/partner" style={{ color: 'rgba(255,255,255,0.8)', textDecoration: 'none', fontSize: 14, fontWeight: 600 }}>
              For Mosques
            </Link>
            <Link
              href="/calculator"
              style={{
                background: GOLD,
                color: '#0E1A12',
                padding: '10px 22px',
                borderRadius: 100,
                fontSize: 14,
                fontWeight: 800,
                textDecoration: 'none',
              }}
            >
              Begin Assessment →
            </Link>
          </div>
        </div>

        {/* Center Hero Statement */}
        <div
          style={{
            position: 'relative',
            zIndex: 2,
            maxWidth: 820,
            margin: '0 auto',
            padding: '60px 28px 80px',
            textAlign: 'center',
          }}
        >
          <div style={{ fontSize: 12, fontWeight: 800, color: GOLD, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 18 }}>
            Scholarly Zakat Fiduciary
          </div>
          <h1 style={{ fontSize: 'clamp(42px, 5.8vw, 70px)', fontWeight: 800, letterSpacing: '-1.8px', lineHeight: 1.05, margin: '0 0 20px' }}>
            Sacred Obligation.<br />Modern Precision.
          </h1>
          <p style={{ fontSize: 19, color: 'rgba(255,255,255,0.8)', maxWidth: 560, margin: '0 auto 36px', lineHeight: 1.6 }}>
            Stop overpaying on retirement accounts and index funds. Calculate your exact Zakat privately in 2 minutes.
          </p>
          <Link
            href="/calculator"
            style={{
              display: 'inline-block',
              background: GOLD,
              color: '#0E1A12',
              padding: '18px 40px',
              borderRadius: 100,
              fontSize: 16,
              fontWeight: 800,
              textDecoration: 'none',
            }}
          >
            Calculate My Zakat →
          </Link>
        </div>
      </section>

      {/* ── SECTION 2 (SHADE: WARM SAND): VISUAL PROPORTION BARS ── */}
      <section style={{ padding: '88px 28px', maxWidth: 1140, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 52 }}>
          <div style={{ fontSize: 12, fontWeight: 800, color: '#9A7836', letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 8 }}>
            Visual Fiqh Guide
          </div>
          <h2 style={{ fontSize: 38, fontWeight: 800, letterSpacing: '-1px', margin: 0 }}>
            How Much of Each Asset Is Actually Zakatable?
          </h2>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {[
            { name: 'Cash & Checking', pct: 100, rate: '2.50% Rate', note: '100% Liquid Currency' },
            { name: '18K Gold Jewelry', pct: 75, rate: '1.87% Eff.', note: '75% Pure Gold Content' },
            { name: '401(k) & Traditional IRA', pct: 68, rate: '2.5% on Net', note: '~68% Accessible After Tax & Penalty' },
            { name: 'Passive S&P 500 / Index ETFs', pct: 30, rate: '0.75% Eff.', note: '30% Corporate Liquid Assets (AAOIFI)' },
            { name: 'Primary Residence & Cars', pct: 0, rate: '0% Exempt', note: 'Personal Living Essentials' },
          ].map((row) => (
            <div
              key={row.name}
              style={{
                background: '#FFFFFF',
                borderRadius: 14,
                padding: '22px 28px',
                border: '1px solid #E2DDD2',
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 220px), 1fr))',
                gap: 20,
                alignItems: 'center',
              }}
            >
              <div>
                <div style={{ fontSize: 17, fontWeight: 800 }}>{row.name}</div>
                <div style={{ fontSize: 13.5, color: MUTED }}>{row.note}</div>
              </div>

              {/* Visual Bar */}
              <div style={{ background: '#ECE8DF', height: 14, borderRadius: 100, overflow: 'hidden' }}>
                <div style={{ width: `${Math.max(row.pct, 3)}%`, height: '100%', background: row.pct === 0 ? '#C5C0B5' : FOREST, borderRadius: 100 }} />
              </div>

              <div style={{ textAlign: 'right' }}>
                <span style={{ background: '#EDF3EE', color: FOREST, fontWeight: 800, padding: '7px 14px', borderRadius: 100, fontSize: 14 }}>
                  {row.rate}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── SECTION 3 (SHADE: DEEP OBSIDIAN EMERALD): LIVE SLIDERS + PHOTOGRAPHY ── */}
      <section style={{ background: FOREST, color: '#FFFFFF', padding: '88px 28px' }}>
        <div
          style={{
            maxWidth: 1140,
            margin: '0 auto',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 380px), 1fr))',
            gap: 48,
            alignItems: 'center',
          }}
        >
          <div>
            <div style={{ fontSize: 12, fontWeight: 800, color: GOLD, letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 10 }}>
              Quick Estimator
            </div>
            <h3 style={{ fontSize: 34, fontWeight: 800, margin: '0 0 28px', letterSpacing: '-0.8px' }}>
              Test Your Portfolio in Seconds
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 20, marginBottom: 32 }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 15, marginBottom: 6 }}>
                  <span>Cash (100% Base)</span>
                  <strong>{fmt(simCash)}</strong>
                </div>
                <input type="range" min={0} max={150000} step={5000} value={simCash} onChange={(e) => setSimCash(Number(e.target.value))} style={{ width: '100%', accentColor: GOLD }} />
              </div>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 15, marginBottom: 6 }}>
                  <span>Index ETFs (30% Base)</span>
                  <strong>{fmt(simStocks)}</strong>
                </div>
                <input type="range" min={0} max={300000} step={10000} value={simStocks} onChange={(e) => setSimStocks(Number(e.target.value))} style={{ width: '100%', accentColor: GOLD }} />
              </div>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 15, marginBottom: 6 }}>
                  <span>401(k) / IRA (Net Base)</span>
                  <strong>{fmt(simRetirement)}</strong>
                </div>
                <input type="range" min={0} max={250000} step={10000} value={simRetirement} onChange={(e) => setSimRetirement(Number(e.target.value))} style={{ width: '100%', accentColor: GOLD }} />
              </div>
            </div>

            <div style={{ display: 'flex', gap: 28, alignItems: 'baseline' }}>
              <div>
                <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase' }}>Scholarly Zakat</div>
                <div style={{ fontSize: 44, fontWeight: 900, color: GOLD }}>{fmt(scholarlyZakat)}</div>
              </div>
              <div>
                <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase' }}>Generic 2.5%</div>
                <div style={{ fontSize: 24, fontWeight: 700, textDecoration: 'line-through', color: 'rgba(255,255,255,0.45)' }}>{fmt(naiveZakat)}</div>
              </div>
            </div>
          </div>

          <div style={{ borderRadius: 20, overflow: 'hidden', height: 420 }}>
            <img src="/wealth-geometry.jpg" alt="Travertine and brass" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
          </div>
        </div>
      </section>
    </div>
  )
}

// ═════════════════════════════════════════════════════════════════════════════
// MOCKUP 03: MINIMALIST GALLERY & BENTO (Nordic Stone, Visual Cards, Zero Fluff)
// ═════════════════════════════════════════════════════════════════════════════
function MinimalGalleryMockup(props: SharedProps) {
  const {
    simCash,
    setSimCash,
    simStocks,
    setSimStocks,
    simRetirement,
    setSimRetirement,
    scholarlyZakat,
    naiveZakat,
  } = props

  const STONE_BG = '#EFECE4'
  const FOREST = '#183A21'
  const INK = '#121614'
  const MUTED = '#5A625D'

  return (
    <div style={{ background: STONE_BG, color: INK, paddingBottom: 90 }}>
      {/* Header */}
      <header style={{ maxWidth: 1240, margin: '0 auto', padding: '24px 28px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <ZakatlyLogo variant="rub-al-ushr" height={42} />
        <div style={{ display: 'flex', gap: 20, alignItems: 'center' }}>
          <Link href="/partner" style={{ fontSize: 14, fontWeight: 600, color: MUTED, textDecoration: 'none' }}>
            For Mosques
          </Link>
          <Link href="/calculator" style={{ background: INK, color: '#FFFFFF', padding: '10px 22px', borderRadius: 100, fontSize: 14, fontWeight: 700, textDecoration: 'none' }}>
            Start Calculator →
          </Link>
        </div>
      </header>

      {/* Hero Title */}
      <section style={{ maxWidth: 900, margin: '0 auto', padding: '44px 28px 48px', textAlign: 'center' }}>
        <h1 style={{ fontSize: 'clamp(42px, 5.6vw, 68px)', fontWeight: 800, letterSpacing: '-2px', lineHeight: 1.04, margin: '0 0 18px' }}>
          Zakat, Simplified to the Essentials.
        </h1>
        <p style={{ fontSize: 19, color: MUTED, maxWidth: 540, margin: '0 auto 32px' }}>
          Scholarly asset rates. Zero cloud tracking. Direct mosque giving.
        </p>
        <Link href="/calculator" style={{ display: 'inline-block', background: FOREST, color: '#FFFFFF', padding: '17px 38px', borderRadius: 100, fontSize: 16, fontWeight: 700, textDecoration: 'none' }}>
          Calculate in 2 Minutes →
        </Link>
      </section>

      {/* 3-Card Visual Bento Showcase */}
      <section style={{ maxWidth: 1240, margin: '0 auto', padding: '0 28px 72px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 350px), 1fr))', gap: 22 }}>
          {/* Card 1: Courtyard Image + Privacy Pill */}
          <div style={{ borderRadius: 24, overflow: 'hidden', position: 'relative', minHeight: 400, boxShadow: '0 12px 32px rgba(0,0,0,0.06)' }}>
            <img src="/courtyard-arches.jpg" alt="Courtyard" style={{ width: '100%', height: '100%', objectFit: 'cover', position: 'absolute', inset: 0 }} />
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(14,22,17,0.85) 0%, transparent 60%)' }} />
            <div style={{ position: 'absolute', bottom: 28, left: 28, right: 28, color: '#FFFFFF' }}>
              <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: 1.4, textTransform: 'uppercase', color: '#D4AF63', marginBottom: 6 }}>
                100% On-Device Privacy
              </div>
              <div style={{ fontSize: 24, fontWeight: 800, lineHeight: 1.2 }}>
                0 Bytes Stored on Servers. No Login Required.
              </div>
            </div>
          </div>

          {/* Card 2: Live Interactive Mini-Estimator */}
          <div style={{ background: '#FFFFFF', borderRadius: 24, padding: '32px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', boxShadow: '0 12px 32px rgba(0,0,0,0.04)' }}>
            <div>
              <div style={{ fontSize: 11.5, fontWeight: 800, textTransform: 'uppercase', letterSpacing: 1.2, color: FOREST, marginBottom: 6 }}>
                Interactive Rate Check
              </div>
              <div style={{ fontSize: 22, fontWeight: 800, marginBottom: 20 }}>
                Why Scholarly Rules Matter
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, fontWeight: 700, marginBottom: 4 }}>
                    <span>Cash (2.5%)</span>
                    <span>{fmt(simCash)}</span>
                  </div>
                  <input type="range" min={0} max={150000} step={5000} value={simCash} onChange={(e) => setSimCash(Number(e.target.value))} style={{ width: '100%', accentColor: FOREST }} />
                </div>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, fontWeight: 700, marginBottom: 4 }}>
                    <span>Index ETFs (0.75% Eff.)</span>
                    <span>{fmt(simStocks)}</span>
                  </div>
                  <input type="range" min={0} max={300000} step={10000} value={simStocks} onChange={(e) => setSimStocks(Number(e.target.value))} style={{ width: '100%', accentColor: FOREST }} />
                </div>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, fontWeight: 700, marginBottom: 4 }}>
                    <span>401(k) (Net of Tax)</span>
                    <span>{fmt(simRetirement)}</span>
                  </div>
                  <input type="range" min={0} max={250000} step={10000} value={simRetirement} onChange={(e) => setSimRetirement(Number(e.target.value))} style={{ width: '100%', accentColor: FOREST }} />
                </div>
              </div>
            </div>

            <div style={{ background: STONE_BG, borderRadius: 14, padding: '18px 20px', marginTop: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: 11, fontWeight: 700, color: MUTED, textTransform: 'uppercase' }}>True Zakat</div>
                <div style={{ fontSize: 30, fontWeight: 900, color: FOREST }}>{fmt(scholarlyZakat)}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: MUTED, textTransform: 'uppercase' }}>Naive 2.5%</div>
                <div style={{ fontSize: 18, fontWeight: 700, color: '#8A867E', textDecoration: 'line-through' }}>{fmt(naiveZakat)}</div>
              </div>
            </div>
          </div>

          {/* Card 3: Still Life Image + Mosque Co-Brand */}
          <div style={{ borderRadius: 24, overflow: 'hidden', position: 'relative', minHeight: 400, boxShadow: '0 12px 32px rgba(0,0,0,0.06)' }}>
            <img src="/wealth-geometry.jpg" alt="Wealth Geometry" style={{ width: '100%', height: '100%', objectFit: 'cover', position: 'absolute', inset: 0 }} />
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(14,22,17,0.85) 0%, transparent 60%)' }} />
            <div style={{ position: 'absolute', bottom: 28, left: 28, right: 28, color: '#FFFFFF' }}>
              <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: 1.4, textTransform: 'uppercase', color: '#D4AF63', marginBottom: 6 }}>
                Direct Community Giving
              </div>
              <div style={{ fontSize: 24, fontWeight: 800, lineHeight: 1.2 }}>
                100% Reaches Your Mosque. 0% Platform Fees.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Shaded White Section: 4 Big Typographic Rate Tiles */}
      <section style={{ background: '#FFFFFF', padding: '80px 28px' }}>
        <div style={{ maxWidth: 1240, margin: '0 auto' }}>
          <h2 style={{ fontSize: 32, fontWeight: 800, textAlign: 'center', margin: '0 0 44px', letterSpacing: '-0.8px' }}>
            Every Asset Rate, Explained in One Line
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 260px), 1fr))', gap: 20 }}>
            {[
              { rate: '2.5%', title: 'Cash & Gold', sub: 'On pure liquid balance' },
              { rate: '0.75%', title: 'Index ETFs', sub: '2.5% on 30% corporate liquid assets' },
              { rate: 'Net 2.5%', title: '401(k) & IRA', sub: 'After taxes & 10% withdrawal penalty' },
              { rate: '0%', title: 'Home & Cars', sub: 'Personal essentials are exempt' },
            ].map((t) => (
              <div key={t.title} style={{ background: STONE_BG, borderRadius: 20, padding: '32px 26px', textAlign: 'center' }}>
                <div style={{ fontSize: 44, fontWeight: 900, color: FOREST, letterSpacing: '-1.5px', marginBottom: 8 }}>{t.rate}</div>
                <div style={{ fontSize: 18, fontWeight: 800, marginBottom: 4 }}>{t.title}</div>
                <div style={{ fontSize: 14, color: MUTED }}>{t.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
