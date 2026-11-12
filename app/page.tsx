'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { TopNav } from '@/components/TopNav'
import { ZakatlyLogo } from '@/components/ZakatlyLogo'
import { useCalculatorStore } from '@/store/calculatorStore'
import { InvestmentType } from '@/types/zakat.types'

const FOREST = '#16351F'
const DARK_SECTION = '#102417'
const ALABASTER = '#F7F5EF'
const STONE_SHADE = '#EAE6DC'
const INK = '#121614'
const MUTED = '#5A625D'
const BRASS = '#C5A059'

function fmt(n: number) {
  return '$' + Math.round(n).toLocaleString('en-US')
}

export default function LandingPage() {
  const router = useRouter()
  const updateAssets = useCalculatorStore((s) => s.updateAssets)
  const setSelectedInvestments = useCalculatorStore((s) => s.setSelectedInvestments)
  const setSkipIntro = useCalculatorStore((s) => s.setSkipIntro)

  const [simCash, setSimCash] = useState<number>(30000)
  const [simStocks, setSimStocks] = useState<number>(100000)
  const [simRetirement, setSimRetirement] = useState<number>(80000)

  const grossPortfolio = simCash + simStocks + simRetirement
  const naiveZakat = grossPortfolio * 0.025
  const scholarlyZakatableBase = simCash + simStocks * 0.3 + simRetirement * 0.68
  const scholarlyZakat = scholarlyZakatableBase * 0.025
  const effectiveRate = grossPortfolio > 0 ? (scholarlyZakat / grossPortfolio) * 100 : 0

  useEffect(() => {
    if (typeof window === 'undefined') return
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-revealed')
          }
        })
      },
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    )

    const elements = document.querySelectorAll('.reveal-on-scroll')
    elements.forEach((el) => observer.observe(el))

    return () => observer.disconnect()
  }, [])

  function handleContinueWithSimulatorValues() {
    updateAssets({
      cash: simCash,
      passiveStocks: simStocks,
      retirementAccounts: simRetirement,
    })
    const invTypes: InvestmentType[] = []
    if (simStocks > 0) invTypes.push('passiveStocks')
    if (simRetirement > 0) invTypes.push('retirement')
    if (invTypes.length > 0) {
      setSelectedInvestments(invTypes)
    }
    setSkipIntro(true)
    router.push('/calculator')
  }

  return (
    <div
      style={{
        background: ALABASTER,
        color: INK,
        minHeight: '100vh',
        overflowX: 'hidden',
        fontFamily: 'Open Sans, -apple-system, BlinkMacSystemFont, sans-serif',
      }}
    >
      <TopNav />

      {/* ── SECTION 1 (SHADE: WARM ALABASTER): VISUAL HERO WITH ARCH PHOTOGRAPHY ── */}
      <section
        style={{
          padding: 'clamp(108px, 12vw, 136px) clamp(16px, 4vw, 28px) clamp(64px, 8vw, 88px)',
          maxWidth: 1200,
          margin: '0 auto',
        }}
      >
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 400px), 1fr))',
            gap: 'clamp(36px, 5vw, 56px)',
            alignItems: 'center',
          }}
        >
          {/* Left: Minimal, High-Impact Typography */}
          <div>
            <div
              className="animate-hero-1"
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
                color: FOREST,
                marginBottom: 24,
              }}
            >
              100% Private · AAOIFI &amp; AMJA Aligned
            </div>

            <h1
              className="animate-hero-2"
              style={{
                fontSize: 'clamp(40px, 5.2vw, 64px)',
                fontWeight: 800,
                lineHeight: 1.05,
                letterSpacing: '-1.8px',
                margin: '0 0 20px',
              }}
            >
              Not Everything You Own Is Taxed at 2.5%.
            </h1>

            <p
              className="animate-hero-3"
              style={{ fontSize: 19, color: MUTED, lineHeight: 1.6, margin: '0 0 36px', maxWidth: 480 }}
            >
              Index funds, 401(k)s, and jewelry each have their own scholarly rate. Calculate your exact Zakat privately in your browser.
            </p>

            <div className="animate-hero-4" style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
              <Link
                href="/calculator"
                style={{
                  background: FOREST,
                  color: '#FFFFFF',
                  padding: '17px 34px',
                  borderRadius: 8,
                  fontSize: 16,
                  fontWeight: 700,
                  textDecoration: 'none',
                }}
              >
                Start Assessment →
              </Link>
            </div>
          </div>

          {/* Right: Documentary Impact Image + Floating Glass Summary Badge */}
          <div className="animate-hero-image" style={{ position: 'relative' }}>
            <div
              style={{
                borderRadius: 20,
                overflow: 'hidden',
                height: 'clamp(360px, 46vw, 460px)',
                boxShadow: '0 24px 60px rgba(18, 22, 20, 0.12)',
                position: 'relative',
              }}
            >
              <img
                src="/real-children-joy.jpg"
                alt="Real 35mm film photograph of children smiling"
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
                  bottom: 20,
                  left: 20,
                  right: 20,
                  background: 'rgba(255, 255, 255, 0.95)',
                  backdropFilter: 'blur(12px)',
                  WebkitBackdropFilter: 'blur(12px)',
                  borderRadius: 14,
                  padding: '18px 22px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: 12,
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
                  <div style={{ fontSize: 11.5, fontWeight: 800, textTransform: 'uppercase', letterSpacing: 1, color: FOREST }}>
                    True Scholarly Zakat
                  </div>
                  <div style={{ fontSize: 26, fontWeight: 900, color: FOREST, lineHeight: 1.1 }}>
                    $2,860 <span style={{ fontSize: 13, fontWeight: 700, color: MUTED }}>(1.36%)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── SECTION 2 (SHADE: DEEP FOREST EMERALD): THE 4 RATES AT A GLANCE ── */}
      <section id="rates" style={{ background: DARK_SECTION, color: '#FFFFFF', padding: 'clamp(64px, 8vw, 88px) clamp(16px, 4vw, 28px)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div className="reveal-on-scroll" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 20, marginBottom: 48 }}>
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

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 250px), 1fr))', gap: 20 }}>
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
            ].map((item, idx) => (
              <div
                key={item.label}
                className={`reveal-on-scroll rate-card-hover stagger-${idx + 1}`}
                style={{
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: 16,
                  padding: '28px 26px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  gap: 20,
                  cursor: 'default',
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
      <section id="estimator" style={{ background: STONE_SHADE, padding: 'clamp(64px, 8vw, 88px) clamp(16px, 4vw, 28px)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div
            className="reveal-on-scroll"
            style={{
              background: '#FFFFFF',
              borderRadius: 20,
              padding: 'clamp(26px, 5vw, 48px)',
              boxShadow: '0 16px 40px rgba(18, 22, 20, 0.05)',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 360px), 1fr))',
              gap: 'clamp(32px, 5vw, 48px)',
              alignItems: 'center',
            }}
          >
            <div>
              <div style={{ fontSize: 12, fontWeight: 800, color: BRASS, textTransform: 'uppercase', letterSpacing: 1.4, marginBottom: 8 }}>
                Live Simulator
              </div>
              <h3 style={{ fontSize: 'clamp(26px, 3.2vw, 32px)', fontWeight: 800, margin: '0 0 24px', letterSpacing: '-0.8px' }}>
                See How Much You Save From Overpaying
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 15, fontWeight: 700, marginBottom: 8 }}>
                    <span>
                      Cash &amp; Checking <span style={{ color: MUTED, fontWeight: 500 }}>(2.5%)</span>
                    </span>
                    <span style={{ fontVariantNumeric: 'tabular-nums', fontWeight: 800 }}>{fmt(simCash)}</span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={150000}
                    step={5000}
                    value={simCash}
                    onChange={(e) => setSimCash(Number(e.target.value))}
                    style={{ width: '100%', accentColor: FOREST, cursor: 'pointer' }}
                  />
                </div>

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 15, fontWeight: 700, marginBottom: 8 }}>
                    <span>
                      Index ETFs &amp; Stocks <span style={{ color: FOREST, fontWeight: 600 }}>(0.75% Eff.)</span>
                    </span>
                    <span style={{ fontVariantNumeric: 'tabular-nums', fontWeight: 800 }}>{fmt(simStocks)}</span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={300000}
                    step={10000}
                    value={simStocks}
                    onChange={(e) => setSimStocks(Number(e.target.value))}
                    style={{ width: '100%', accentColor: FOREST, cursor: 'pointer' }}
                  />
                </div>

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 15, fontWeight: 700, marginBottom: 8 }}>
                    <span>
                      401(k) &amp; IRA <span style={{ color: BRASS, fontWeight: 600 }}>(Net of Tax)</span>
                    </span>
                    <span style={{ fontVariantNumeric: 'tabular-nums', fontWeight: 800 }}>{fmt(simRetirement)}</span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={250000}
                    step={10000}
                    value={simRetirement}
                    onChange={(e) => setSimRetirement(Number(e.target.value))}
                    style={{ width: '100%', accentColor: FOREST, cursor: 'pointer' }}
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
                padding: 'clamp(24px, 4vw, 32px)',
                display: 'flex',
                flexDirection: 'column',
                gap: 22,
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'baseline',
                  borderBottom: '1px solid #DFDCD2',
                  paddingBottom: 20,
                  flexWrap: 'wrap',
                  gap: 12,
                }}
              >
                <div>
                  <div style={{ fontSize: 12, fontWeight: 800, color: MUTED, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 6 }}>
                    True Scholarly Zakat
                  </div>
                  <div style={{ fontSize: 'clamp(38px, 5vw, 48px)', fontWeight: 900, color: FOREST, lineHeight: 1, fontVariantNumeric: 'tabular-nums' }}>
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

              <button
                type="button"
                onClick={handleContinueWithSimulatorValues}
                style={{
                  width: '100%',
                  background: FOREST,
                  color: '#FFFFFF',
                  border: 'none',
                  textAlign: 'center',
                  padding: '16px',
                  borderRadius: 10,
                  fontSize: 15,
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                Continue With These Values in Calculator →
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── SECTION 4 (SHADE: PURE WHITE): STILL-LIFE IMAGE + 3 TRUST PILLARS ── */}
      <section style={{ background: '#FFFFFF', padding: 'clamp(64px, 8vw, 88px) clamp(16px, 4vw, 28px)' }}>
        <div
          style={{
            maxWidth: 1200,
            margin: '0 auto',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 380px), 1fr))',
            gap: 'clamp(36px, 5vw, 56px)',
            alignItems: 'center',
          }}
        >
          <div
            className="reveal-on-scroll"
            style={{ borderRadius: 20, overflow: 'hidden', height: 'clamp(300px, 40vw, 380px)', boxShadow: '0 16px 40px rgba(0,0,0,0.06)' }}
          >
            <img
              src="/real-school-learning.jpg"
              alt="Real documentary photograph of children learning in a community classroom"
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
            />
          </div>

          <div className="reveal-on-scroll stagger-2">
            <div style={{ fontSize: 12, fontWeight: 800, color: BRASS, textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 10 }}>
              Built for Trust
            </div>
            <h2 style={{ fontSize: 'clamp(30px, 3.6vw, 38px)', fontWeight: 800, margin: '0 0 28px', letterSpacing: '-1px', lineHeight: 1.15 }}>
              Private by Default. Community First.
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 20, marginBottom: 28 }}>
              {[
                {
                  title: '0 Bytes Stored in the Cloud',
                  desc: 'Your numbers never leave your browser tab. No accounts, no tracking.',
                },
                {
                  title: 'Instant PDF & Email Receipt',
                  desc: 'Download a clean itemized record generated directly on your device.',
                },
                {
                  title: 'Co-Branded for Local Mosques',
                  desc: 'Mosques get a custom link so congregants donate 100% directly.',
                },
              ].map((p) => (
                <div key={p.title} style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
                  <div
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: '50%',
                      background: '#EDF3EE',
                      color: FOREST,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      marginTop: 2,
                    }}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </div>
                  <div>
                    <div style={{ fontSize: 17, fontWeight: 800, marginBottom: 2 }}>{p.title}</div>
                    <div style={{ fontSize: 15, color: MUTED }}>{p.desc}</div>
                  </div>
                </div>
              ))}
            </div>

            <Link
              href="/partner"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                fontSize: 15,
                fontWeight: 800,
                color: FOREST,
                textDecoration: 'none',
              }}
            >
              <span>Serve on a mosque board? Create your partner link</span>
              <span>→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* ── SECTION 5 (SHADE: DEEP OBSIDIAN): MINIMALIST FOOTER ── */}
      <footer
        style={{
          background: '#0E1210',
          padding: '52px clamp(16px, 4vw, 28px)',
          color: '#FFFFFF',
          borderTop: '1px solid rgba(255,255,255,0.08)',
        }}
      >
        <div
          style={{
            maxWidth: 1200,
            margin: '0 auto',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 24,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 20, flexWrap: 'wrap' }}>
            <ZakatlyLogo variant="rub-al-ushr" inverted height={44} />
            <span style={{ fontSize: 13.5, color: 'rgba(255,255,255,0.5)' }}>
              Private, scholarly Zakat assessment.
            </span>
          </div>

          <div style={{ display: 'flex', gap: 28, flexWrap: 'wrap', alignItems: 'center' }}>
            <Link href="/calculator" style={{ fontSize: 14, color: 'rgba(255,255,255,0.75)', textDecoration: 'none', fontWeight: 600 }}>
              Calculator
            </Link>
            <a href="#rates" style={{ fontSize: 14, color: 'rgba(255,255,255,0.75)', textDecoration: 'none', fontWeight: 600 }}>
              Asset Rates
            </a>
            <Link href="/partner" style={{ fontSize: 14, color: 'rgba(255,255,255,0.75)', textDecoration: 'none', fontWeight: 600 }}>
              For Mosques
            </Link>
            <span style={{ fontSize: 13.5, color: 'rgba(255,255,255,0.4)' }}>
              © 2026 Zakatly
            </span>
          </div>
        </div>
      </footer>
    </div>
  )
}
