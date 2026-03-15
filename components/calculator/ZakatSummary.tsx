'use client'

import { useState, useEffect, useRef } from 'react'
import { ZakatResult, NisabStandard } from '@/types/zakat.types'
import { EmailReportModal } from './EmailReportModal'

interface ZakatSummaryProps {
  result: ZakatResult
  nisabStandard: NisabStandard
  onReset: () => void
  onBack: () => void
  onEdit: (stepName: string) => void
}

function formatCurrency(amount: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(amount)
}

function AnimatedNumber({ value, duration = 1400 }: { value: number; duration?: number }) {
  const [display, setDisplay] = useState(0)
  useEffect(() => {
    let start = 0
    const step = value / (duration / 16)
    const timer = setInterval(() => {
      start += step
      if (start >= value) { setDisplay(value); clearInterval(timer) }
      else setDisplay(Math.floor(start))
    }, 16)
    return () => clearInterval(timer)
  }, [value, duration])
  return <span>{formatCurrency(display)}</span>
}

function polarToCartesian(cx: number, cy: number, r: number, angle: number) {
  const rad = (angle - 90) * Math.PI / 180
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) }
}

function slicePath(cx: number, cy: number, r: number, startPct: number, endPct: number) {
  const s = polarToCartesian(cx, cy, r, startPct * 360)
  const e = polarToCartesian(cx, cy, r, endPct * 360)
  const large = endPct - startPct > 0.5 ? 1 : 0
  return `M ${cx} ${cy} L ${s.x} ${s.y} A ${r} ${r} 0 ${large} 1 ${e.x} ${e.y} Z`
}

const SLICE_COLORS = ['#2d7a4f', '#68BA7F', '#4a9e6b', '#8FD4A8', '#3d8f5f', '#57b07a', '#a8dbb8', '#1a5c38']

const CARD: React.CSSProperties = {
  background: 'white',
  border: '1px solid #e8f5ed',
  borderRadius: 20,
  padding: '36px 40px',
  boxShadow: '0 8px 40px rgba(45,122,79,0.13), 0 2px 12px rgba(0,0,0,0.06)',
}

const F = {
  eyebrow: 15,
  heroSub: 20,
  pillLabel: 16,
  pillValue: 18,
  cardHeader: 16,
  chartLabel: 17,
  tableHeader: 15,
  tableRow: 17,
  editBtn: 15,
  disclaimer: 17,
  actionBtn: 17,
}

export function ZakatSummary({ result, onReset, onBack, onEdit }: ZakatSummaryProps) {
  const [visible, setVisible] = useState(false)
  const [activeSlice, setActiveSlice] = useState<number | null>(null)
  const [heroInView, setHeroInView] = useState(true)
  const [showEmailModal, setShowEmailModal] = useState(false)
  const heroRef = useRef<HTMLElement>(null)

  useEffect(() => {
    setTimeout(() => setVisible(true), 80)
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      if (!heroRef.current) return
      const rect = heroRef.current.getBoundingClientRect()
      // hide sticky bar while any part of the hero is still below the TopNav (72px)
      setHeroInView(rect.bottom > 72)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll() // run once on mount
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const total = result.totalAssets
  let cumulative = 0
  const slices = result.breakdown.map((item, i) => {
    const pct = total > 0 ? item.entered / total : 0
    const start = cumulative
    cumulative += pct
    return { ...item, pct, start, color: SLICE_COLORS[i % SLICE_COLORS.length] }
  })

  const waterfallSteps = [
    { label: 'Total Assets',      value: result.totalAssets,      type: 'positive', color: '#0f2419' },
    { label: 'Liabilities',       value: -result.totalLiabilities, type: 'negative', color: '#c0392b' },
    { label: 'Zakatable Wealth',  value: result.zakatableWealth,  type: 'result',   color: '#0f2419' },
    { label: 'Zakat Due (2.5%)',  value: result.zakatDue,         type: 'zakat',    color: '#2d7a4f' },
  ]
  const maxVal = result.totalAssets || 1

  return (
    <div style={{ fontFamily: 'Open Sans, sans-serif', color: '#0f2419' }}>
      {showEmailModal && <EmailReportModal result={result} onClose={() => setShowEmailModal(false)} />}

      {/* ── STICKY COLLAPSED BAR ── */}
      <div style={{
        position: 'fixed',
        top: 72,
        left: 0, right: 0,
        zIndex: 45,
        background: '#0f2419',
        borderBottom: '1px solid rgba(255,255,255,0.1)',
        transform: heroInView ? 'translateY(-110%)' : 'translateY(0)',
        transition: 'transform 0.35s ease',
        boxShadow: '0 4px 24px rgba(0,0,0,0.25)',
      }}>
        <div style={{
          maxWidth: 960, margin: '0 auto',
          padding: 'clamp(10px, 2vw, 14px) clamp(16px, 3vw, 32px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          gap: 'clamp(14px, 3vw, 32px)',
        }}>
          <div style={{ display: 'flex', gap: 28, alignItems: 'center' }}>
            {[
              { label: 'Total Assets',     value: formatCurrency(result.totalAssets) },
              { label: 'Zakatable Wealth', value: formatCurrency(result.zakatableWealth) },
            ].map(s => (
              <div key={s.label} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 'clamp(9px, 1.5vw, 11px)', color: 'rgba(255,255,255,0.45)', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 2 }}>{s.label}</div>
                <div style={{ fontSize: 'clamp(13px, 2vw, 16px)', fontWeight: 600, color: 'rgba(255,255,255,0.85)' }}>{s.value}</div>
              </div>
            ))}
          </div>
          <div style={{ width: 1, height: 36, background: 'rgba(255,255,255,0.15)' }} />
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 'clamp(9px, 1.5vw, 11px)', fontWeight: 700, color: '#68BA7F', letterSpacing: 3, textTransform: 'uppercase', marginBottom: 2 }}>
              {result.meetsNisab ? 'Zakat Due' : 'No Zakat Due'}
            </div>
            <div style={{ fontSize: 'clamp(18px, 3.5vw, 26px)', fontWeight: 700, color: 'white', lineHeight: 1 }}>
              {result.meetsNisab ? formatCurrency(result.zakatDue) : formatCurrency(0)}
            </div>
          </div>
        </div>
      </div>

      {/* ── HERO ── */}
      <section ref={heroRef} style={{
        position: 'relative', minHeight: '54vh',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'url(/mosque-bg.png)', backgroundSize: 'cover', backgroundPosition: 'center' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(8, 22, 13, 0.74)' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, transparent 90%, white 100%)' }} />

        <div style={{
          position: 'relative', zIndex: 1, textAlign: 'center',
          padding: '64px 32px 96px',
          opacity: visible ? 1 : 0,
          transform: visible ? 'translateY(0)' : 'translateY(24px)',
          transition: 'opacity 0.8s ease, transform 0.8s ease',
        }}>
          {result.meetsNisab ? (
            <>
              <p style={{ color: '#68BA7F', fontSize: F.eyebrow, letterSpacing: 4, textTransform: 'uppercase', fontWeight: 700, marginBottom: 20 }}>
                Zakat Due This Year
              </p>
              <div style={{ fontSize: 'clamp(56px, 9vw, 88px)', fontWeight: 700, color: 'white', lineHeight: 1 }}>
                <AnimatedNumber value={result.zakatDue} duration={1500} />
              </div>
              <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: F.heroSub, marginTop: 16 }}>
                2.5% of your zakatable wealth
              </p>
            </>
          ) : (
            <>
              <p style={{ color: '#68BA7F', fontSize: F.eyebrow, letterSpacing: 4, textTransform: 'uppercase', fontWeight: 700, marginBottom: 20 }}>
                Assessment Complete
              </p>
              <div style={{ fontSize: 'clamp(40px, 6vw, 56px)', fontWeight: 700, color: 'white', lineHeight: 1 }}>
                No Zakat Due
              </div>
              <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: F.heroSub, marginTop: 16, maxWidth: 520, margin: '16px auto 0' }}>
                Your zakatable wealth of {formatCurrency(result.zakatableWealth)} is below the nisab threshold of {formatCurrency(result.nisabThreshold)}.
              </p>
            </>
          )}

          {/* Stat pills */}
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', marginTop: 40, flexWrap: 'wrap' }}>
            {[
              { label: 'Total Assets',      value: formatCurrency(result.totalAssets) },
              { label: 'Zakatable Wealth',  value: formatCurrency(result.zakatableWealth) },
              { label: 'Nisab Threshold',   value: formatCurrency(result.nisabThreshold) },
            ].map(stat => (
              <div key={stat.label} style={{
                background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(8px)',
                WebkitBackdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.2)',
                borderRadius: 50, padding: '12px 28px',
                display: 'flex', gap: 10, alignItems: 'center',
              }}>
                <span style={{ color: 'rgba(255,255,255,0.55)', fontSize: F.pillLabel }}>{stat.label}</span>
                <span style={{ color: 'white', fontWeight: 700, fontSize: F.pillValue }}>{stat.value}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CONTENT ── */}
      <section style={{ background: 'white', padding: '56px 24px 80px' }}>
        <div style={{
          maxWidth: 960, margin: '0 auto',
          display: 'flex', flexDirection: 'column', gap: 28,
          opacity: visible ? 1 : 0,
          transition: 'opacity 0.6s ease 0.3s',
        }}>

          {/* Charts row */}
          {result.breakdown.length > 0 && (
            <div className="summary-charts-grid">

              {/* Donut */}
              <div style={CARD}>
                <p style={{ fontSize: F.cardHeader, fontWeight: 700, color: '#2d7a4f', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 28 }}>
                  Asset Mix
                </p>
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 24 }}>
                  <svg width="280" height="280" viewBox="0 0 160 160">
                    {slices.map((slice, i) => (
                      <path
                        key={i}
                        d={slicePath(80, 80, activeSlice === i ? 75 : 68, slice.start, slice.start + slice.pct)}
                        fill={slice.color}
                        opacity={activeSlice === null || activeSlice === i ? 1 : 0.3}
                        style={{ cursor: 'pointer', transition: 'all 0.2s ease' }}
                        onMouseEnter={() => setActiveSlice(i)}
                        onMouseLeave={() => setActiveSlice(null)}
                      />
                    ))}
                    <circle cx="80" cy="80" r="44" fill="white" />
                    <text x="80" y="75" textAnchor="middle" fontSize="11" fill="#999" fontFamily="Open Sans, sans-serif">Total</text>
                    <text x="80" y="91" textAnchor="middle" fontSize="13" fontWeight="700" fill="#0f2419" fontFamily="Open Sans, sans-serif">
                      {formatCurrency(total)}
                    </text>
                  </svg>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  {slices.map((slice, i) => (
                    <div
                      key={i}
                      style={{
                        display: 'flex', alignItems: 'center', gap: 12,
                        cursor: 'pointer', padding: '9px 12px', borderRadius: 10,
                        background: activeSlice === i ? '#f7fdf9' : 'transparent',
                        transition: 'background 0.15s',
                      }}
                      onMouseEnter={() => setActiveSlice(i)}
                      onMouseLeave={() => setActiveSlice(null)}
                      onClick={() => onEdit(slice.stepName)}
                    >
                      <div style={{ width: 12, height: 12, borderRadius: 4, background: slice.color, flexShrink: 0 }} />
                      <span style={{ flex: 1, fontSize: F.chartLabel, color: '#444' }}>{slice.label}</span>
                      <span style={{ fontSize: F.chartLabel, fontWeight: 600, color: '#0f2419' }}>{Math.round(slice.pct * 100)}%</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Waterfall */}
              <div style={CARD}>
                <p style={{ fontSize: F.cardHeader, fontWeight: 700, color: '#2d7a4f', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 28 }}>
                  How It&apos;s Calculated
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
                  {waterfallSteps.map((step, i) => {
                    if (step.value === 0 && step.type === 'negative') return null
                    const barWidth = (Math.abs(step.value) / maxVal) * 100
                    const isNeg = step.type === 'negative'
                    return (
                      <div key={i}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
                          <span style={{ fontSize: F.chartLabel, color: '#555' }}>{step.label}</span>
                          <span style={{ fontSize: F.chartLabel, fontWeight: 700, color: isNeg ? '#c0392b' : step.color }}>
                            {isNeg ? '−' : ''}{formatCurrency(Math.abs(step.value))}
                          </span>
                        </div>
                        <div style={{ height: 10, background: '#f0f0f0', borderRadius: 5, overflow: 'hidden' }}>
                          <div style={{
                            height: '100%',
                            width: visible ? `${barWidth}%` : '0%',
                            background: isNeg ? '#c0392b' : step.color,
                            borderRadius: 5,
                            transition: `width 0.9s ease ${0.4 + i * 0.15}s`,
                          }} />
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Breakdown table */}
          {result.breakdown.length > 0 && (
            <div style={CARD}>
              <p style={{ fontSize: F.cardHeader, fontWeight: 700, color: '#2d7a4f', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 24 }}>
                Zakat Calculation Detail
              </p>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid #e8f5ed' }}>
                    {['Asset / Liability', 'Value', 'Zakatable', 'Zakat @ 2.5%', ''].map((h, i) => (
                      <th key={i} className={i === 1 ? 'summary-table-hide-mobile' : ''} style={{
                        textAlign: i === 0 ? 'left' : 'right',
                        fontSize: F.tableHeader, fontWeight: 700,
                        color: i === 3 ? '#2d7a4f' : '#aaa',
                        textTransform: 'uppercase', letterSpacing: 1,
                        paddingBottom: 14, width: i === 4 ? 72 : undefined,
                      }}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {/* Asset rows — always show 2.5% of zakatable regardless of nisab */}
                  {result.breakdown.map((item, i) => (
                    <tr key={i} style={{ borderBottom: '1px solid #f0f8f3' }}>
                      <td style={{ padding: '18px 0', fontSize: F.tableRow, color: '#333' }}>{item.label}</td>
                      <td className="summary-table-hide-mobile" style={{ padding: '18px 0', textAlign: 'right', fontSize: F.tableRow, color: '#888' }}>{formatCurrency(item.entered)}</td>
                      <td style={{ padding: '18px 0', textAlign: 'right', fontSize: F.tableRow, fontWeight: 600, color: '#333' }}>{formatCurrency(item.zakatable)}</td>
                      <td style={{ padding: '18px 0', textAlign: 'right', fontSize: F.tableRow, fontWeight: 700, color: '#2d7a4f' }}>{formatCurrency(item.zakatable * 0.025)}</td>
                      <td style={{ padding: '18px 0', textAlign: 'right' }}>
                        <button
                          onClick={() => onEdit(item.stepName)}
                          style={{
                            fontSize: F.editBtn, color: '#2d7a4f',
                            background: '#f0faf4', border: 'none',
                            borderRadius: 8, padding: '6px 16px',
                            cursor: 'pointer', fontWeight: 600,
                          }}
                        >
                          Edit
                        </button>
                      </td>
                    </tr>
                  ))}

                  {/* Liabilities row */}
                  {result.totalLiabilities > 0 && (
                    <tr style={{ borderBottom: '1px solid #f0f8f3' }}>
                      <td style={{ padding: '18px 0', fontSize: F.tableRow, color: '#c0392b', fontWeight: 600 }}>Liabilities</td>
                      <td className="summary-table-hide-mobile" style={{ padding: '18px 0', textAlign: 'right', fontSize: F.tableRow, color: '#c0392b', fontWeight: 600 }}>−{formatCurrency(result.totalLiabilities)}</td>
                      <td style={{ padding: '18px 0', textAlign: 'right', fontSize: F.tableRow, color: '#c0392b', fontWeight: 600 }}>−{formatCurrency(result.totalLiabilities)}</td>
                      <td style={{ padding: '18px 0', textAlign: 'right', fontSize: F.tableRow, color: '#c0392b', fontWeight: 600 }}>deducted</td>
                      <td style={{ padding: '18px 0', textAlign: 'right' }}>
                        <button
                          onClick={() => onEdit('debts')}
                          style={{
                            fontSize: F.editBtn, color: '#c0392b',
                            background: '#fdf0f0', border: 'none',
                            borderRadius: 8, padding: '6px 16px',
                            cursor: 'pointer', fontWeight: 600,
                          }}
                        >
                          Edit
                        </button>
                      </td>
                    </tr>
                  )}

                  {/* Net total row */}
                  <tr style={{ borderTop: '2px solid #e8f5ed' }}>
                    <td style={{ padding: '20px 0', fontSize: F.tableRow, fontWeight: 700, color: '#0f2419' }}>Net Zakatable Wealth</td>
                    <td />
                    <td style={{ padding: '20px 0', textAlign: 'right', fontSize: F.tableRow, fontWeight: 700, color: '#0f2419' }}>{formatCurrency(result.zakatableWealth)}</td>
                    <td style={{ padding: '20px 0', textAlign: 'right', fontSize: F.tableRow, fontWeight: 700, color: result.meetsNisab ? '#2d7a4f' : '#c0392b' }}>
                      {result.meetsNisab ? formatCurrency(result.zakatDue) : result.zakatableWealth === 0 ? 'Offset by liabilities' : 'Below nisab'}
                    </td>
                    <td />
                  </tr>
                </tbody>
              </table>
            </div>
          )}

          {/* Disclaimer */}
          <div style={{ background: '#f7fdf9', border: '1px solid #e0f0e8', borderRadius: 14, padding: '18px 24px' }}>
            <p style={{ fontSize: F.disclaimer, color: '#666', lineHeight: 1.7, margin: 0 }}>
              <strong style={{ color: '#0f2419' }}>Note:</strong> This is an estimate based on contemporary scholarly guidelines. Please consult a qualified Islamic scholar for your specific situation.
            </p>
          </div>

          {/* Action buttons */}
          <div className="summary-action-btns">
            <button onClick={onBack} style={{
              flex: 1, background: 'white', color: '#555',
              border: '1px solid #e0e0e0', padding: '16px 20px',
              borderRadius: 50, fontSize: F.actionBtn, fontWeight: 600, cursor: 'pointer',
            }}>
              ← Back
            </button>
            <button onClick={onReset} style={{
              flex: 1, background: 'white', color: '#555',
              border: '1px solid #e0e0e0', padding: '16px 20px',
              borderRadius: 50, fontSize: F.actionBtn, fontWeight: 600, cursor: 'pointer',
            }}>
              Start Over
            </button>
            <button
              onClick={() => setShowEmailModal(true)}
              style={{
                flex: 1, background: 'white', color: '#2d7a4f',
                border: '1.5px solid #2d7a4f', padding: '16px 20px',
                borderRadius: 50, fontSize: F.actionBtn, fontWeight: 600,
                cursor: 'pointer', transition: 'background 0.2s, color 0.2s',
              }}
              onMouseEnter={e => { e.currentTarget.style.background = '#f0faf4' }}
              onMouseLeave={e => { e.currentTarget.style.background = 'white' }}
            >
              ✉ Email Report
            </button>
            <button
              style={{
                flex: 2, background: '#2d7a4f', color: 'white',
                border: 'none', padding: '16px 20px',
                borderRadius: 50, fontSize: F.actionBtn, fontWeight: 600,
                cursor: 'pointer', transition: 'background 0.2s',
              }}
              onMouseEnter={e => (e.currentTarget.style.background = '#68BA7F')}
              onMouseLeave={e => (e.currentTarget.style.background = '#2d7a4f')}
            >
              Donate Your Zakat →
            </button>
          </div>

        </div>
      </section>
    </div>
  )
}
