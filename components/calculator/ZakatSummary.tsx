'use client'

import { useState, useEffect } from 'react'
import { ZakatResult, NisabStandard } from '@/types/zakat.types'

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

function AnimatedNumber({ value, duration = 1200 }: { value: number; duration?: number }) {
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
  }, [value])
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

export function ZakatSummary({ result, nisabStandard, onReset, onBack, onEdit }: ZakatSummaryProps) {
  const [visible, setVisible] = useState(false)
  const [activeSlice, setActiveSlice] = useState<number | null>(null)
  const [breakdownOpen, setBreakdownOpen] = useState(false)

  useEffect(() => {
    setTimeout(() => setVisible(true), 100)
  }, [])

  const total = result.totalAssets
  let cumulative = 0
  const slices = result.breakdown.map((item, i) => {
    const pct = item.entered / total
    const start = cumulative
    cumulative += pct
    return { ...item, pct, start, color: SLICE_COLORS[i % SLICE_COLORS.length] }
  })

  const waterfallSteps = [
    { label: 'Total Assets', value: result.totalAssets, type: 'positive', color: '#2d7a4f' },
    { label: 'Liabilities', value: -result.totalLiabilities, type: 'negative', color: '#e05252' },
    { label: 'Zakatable Wealth', value: result.zakatableWealth, type: 'result', color: '#1a3a2a' },
    { label: 'Zakat Due (2.5%)', value: result.zakatDue, type: 'zakat', color: '#68BA7F' },
  ]
  const maxVal = result.totalAssets || 1

  return (
    <div className="flex-1 overflow-y-auto bg-[#f0faf4]">
      <div style={{
        fontFamily: 'Georgia, serif',
        padding: '40px 24px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 20,
        maxWidth: 600,
        margin: '0 auto',
      }}>

        {/* Header */}
        <div style={{
          textAlign: 'center',
          opacity: visible ? 1 : 0,
          transform: visible ? 'translateY(0)' : 'translateY(20px)',
          transition: 'all 0.6s ease',
          width: '100%',
        }}>
          {result.meetsNisab ? (
            <>
              <p style={{ fontSize: 12, letterSpacing: 3, color: '#68BA7F', fontFamily: 'Open Sans, sans-serif', textTransform: 'uppercase', marginBottom: 8 }}>Zakat Due</p>
              <div style={{ fontSize: 56, fontWeight: 700, color: '#1a3a2a', lineHeight: 1 }}>
                <AnimatedNumber value={result.zakatDue} duration={1500} />
              </div>
              <p style={{ fontSize: 14, color: '#888', marginTop: 8, fontFamily: 'Open Sans, sans-serif' }}>2.5% of your zakatable wealth</p>
            </>
          ) : (
            <>
              <p style={{ fontSize: 12, letterSpacing: 3, color: '#aaa', fontFamily: 'Open Sans, sans-serif', textTransform: 'uppercase', marginBottom: 8 }}>No Zakat Due</p>
              <div style={{ fontSize: 40, fontWeight: 700, color: '#1a3a2a', lineHeight: 1 }}>Below Nisab</div>
              <p style={{ fontSize: 14, color: '#888', marginTop: 8, fontFamily: 'Open Sans, sans-serif' }}>
                Your zakatable wealth of {formatCurrency(result.zakatableWealth)} is below the nisab threshold of {formatCurrency(result.nisabThreshold)}.
              </p>
            </>
          )}
        </div>

        {/* Stat cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 12,
          width: '100%',
          opacity: visible ? 1 : 0,
          transition: 'all 0.6s ease 0.2s',
        }}>
          {[
            { label: 'Total Assets', value: result.totalAssets, color: '#2d7a4f' },
            { label: 'Zakatable Wealth', value: result.zakatableWealth, color: '#1a3a2a' },
            { label: 'Nisab Threshold', value: result.nisabThreshold, color: '#68BA7F' },
          ].map((stat) => (
            <div key={stat.label} style={{ background: 'white', borderRadius: 16, padding: '16px 14px', textAlign: 'center', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
              <div style={{ fontSize: 16, fontWeight: 700, color: stat.color, fontFamily: 'Open Sans, sans-serif' }}>{formatCurrency(stat.value)}</div>
              <div style={{ fontSize: 11, color: '#aaa', marginTop: 4, fontFamily: 'Open Sans, sans-serif' }}>{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Charts row */}
        {result.breakdown.length > 0 && (
          <div style={{ display: 'flex', gap: 16, width: '100%', flexWrap: 'wrap' }}>

            {/* Donut chart */}
            <div style={{
              flex: 1, minWidth: 200,
              background: 'white',
              borderRadius: 20,
              padding: 20,
              boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
              opacity: visible ? 1 : 0,
              transition: 'all 0.6s ease 0.3s',
            }}>
              <p style={{ fontSize: 11, fontWeight: 700, color: '#aaa', letterSpacing: 2, textTransform: 'uppercase', fontFamily: 'Open Sans, sans-serif', marginBottom: 16 }}>Asset Mix</p>
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <svg width="150" height="150" viewBox="0 0 160 160">
                  {slices.map((slice, i) => (
                    <path
                      key={i}
                      d={slicePath(80, 80, activeSlice === i ? 74 : 68, slice.start, slice.start + slice.pct)}
                      fill={slice.color}
                      opacity={activeSlice === null || activeSlice === i ? 1 : 0.4}
                      style={{ cursor: 'pointer', transition: 'all 0.2s' }}
                      onMouseEnter={() => setActiveSlice(i)}
                      onMouseLeave={() => setActiveSlice(null)}
                    />
                  ))}
                  <circle cx="80" cy="80" r="44" fill="white" />
                  <text x="80" y="76" textAnchor="middle" fontSize="10" fill="#aaa" fontFamily="Open Sans, sans-serif">Total</text>
                  <text x="80" y="93" textAnchor="middle" fontSize="11" fontWeight="700" fill="#1a3a2a" fontFamily="Open Sans, sans-serif">
                    {formatCurrency(total)}
                  </text>
                </svg>
              </div>
              <div style={{ marginTop: 10, display: 'flex', flexDirection: 'column', gap: 5 }}>
                {slices.map((slice, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, opacity: activeSlice === null || activeSlice === i ? 1 : 0.4, transition: 'opacity 0.2s', cursor: 'pointer' }}
                    onMouseEnter={() => setActiveSlice(i)}
                    onMouseLeave={() => setActiveSlice(null)}
                    onClick={() => onEdit(slice.stepName)}
                  >
                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: slice.color, flexShrink: 0 }} />
                    <span style={{ fontSize: 11, color: '#666', fontFamily: 'Open Sans, sans-serif', flex: 1 }}>{slice.label}</span>
                    <span style={{ fontSize: 11, fontWeight: 600, color: '#333', fontFamily: 'Open Sans, sans-serif' }}>{Math.round(slice.pct * 100)}%</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Waterfall */}
            <div style={{
              flex: 1, minWidth: 200,
              background: 'white',
              borderRadius: 20,
              padding: 20,
              boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
              opacity: visible ? 1 : 0,
              transition: 'all 0.6s ease 0.4s',
            }}>
              <p style={{ fontSize: 11, fontWeight: 700, color: '#aaa', letterSpacing: 2, textTransform: 'uppercase', fontFamily: 'Open Sans, sans-serif', marginBottom: 16 }}>How It's Calculated</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {waterfallSteps.map((step, i) => {
                  if (step.value === 0 && step.type === 'negative') return null
                  const barWidth = Math.abs(step.value) / maxVal * 100
                  return (
                    <div key={i}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                        <span style={{ fontSize: 12, color: '#666', fontFamily: 'Open Sans, sans-serif' }}>{step.label}</span>
                        <span style={{ fontSize: 12, fontWeight: 700, color: step.type === 'negative' ? '#e05252' : step.color, fontFamily: 'Open Sans, sans-serif' }}>
                          {step.type === 'negative' ? '−' : ''}{formatCurrency(Math.abs(step.value))}
                        </span>
                      </div>
                      <div style={{ height: 8, background: '#f5f5f5', borderRadius: 4, overflow: 'hidden' }}>
                        <div style={{
                          height: '100%',
                          width: visible ? `${barWidth}%` : '0%',
                          background: step.color,
                          borderRadius: 4,
                          transition: `width 1s ease ${0.5 + i * 0.15}s`,
                        }} />
                      </div>
                    </div>
                  )
                })}
              </div>
              {result.meetsNisab && (
                <div style={{ marginTop: 16, padding: '10px 14px', background: '#f0faf4', borderRadius: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#68BA7F', flexShrink: 0 }} />
                  <span style={{ fontSize: 12, color: '#2d7a4f', fontFamily: 'Open Sans, sans-serif' }}>
                    {formatCurrency(result.zakatableWealth - result.nisabThreshold)} above nisab
                  </span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Collapsible breakdown table */}
        <div style={{ background: 'white', borderRadius: 20, padding: 20, width: '100%', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
          <button
            onClick={() => setBreakdownOpen(!breakdownOpen)}
            style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
          >
            <span style={{ fontSize: 11, fontWeight: 700, color: '#aaa', letterSpacing: 2, textTransform: 'uppercase', fontFamily: 'Open Sans, sans-serif' }}>Assets Breakdown</span>
            <span style={{ fontSize: 12, color: '#aaa', fontFamily: 'Open Sans, sans-serif' }}>{breakdownOpen ? 'Hide ▲' : 'Show ▼'}</span>
          </button>

          {breakdownOpen && result.breakdown.length > 0 && (
            <div style={{ marginTop: 16, borderTop: '1px solid #f0f0f0', paddingTop: 12 }}>
              <div style={{ display: 'flex', padding: '0 0 8px', borderBottom: '1px solid #f0f0f0', marginBottom: 4 }}>
                <span style={{ flex: 1, fontSize: 10, fontWeight: 700, color: '#aaa', textTransform: 'uppercase', letterSpacing: 1, fontFamily: 'Open Sans, sans-serif' }}>Asset</span>
                <span style={{ width: 80, textAlign: 'right', fontSize: 10, fontWeight: 700, color: '#aaa', textTransform: 'uppercase', letterSpacing: 1, fontFamily: 'Open Sans, sans-serif' }}>Entered</span>
                <span style={{ width: 80, textAlign: 'right', fontSize: 10, fontWeight: 700, color: '#aaa', textTransform: 'uppercase', letterSpacing: 1, fontFamily: 'Open Sans, sans-serif' }}>Zakatable</span>
                <span style={{ width: 70, textAlign: 'right', fontSize: 10, fontWeight: 700, color: '#2d7a4f', textTransform: 'uppercase', letterSpacing: 1, fontFamily: 'Open Sans, sans-serif' }}>Zakat</span>
              </div>
              {result.breakdown.map((item, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid #f9f9f9' }}>
                  <button
                    onClick={() => onEdit(item.stepName)}
                    style={{ flex: 1, textAlign: 'left', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                  >
                    <span style={{ fontSize: 13, color: '#2d7a4f', fontFamily: 'Open Sans, sans-serif', textDecoration: 'underline' }}>{item.label}</span>
                  </button>
                  <span style={{ width: 80, textAlign: 'right', fontSize: 13, color: '#888', fontFamily: 'Open Sans, sans-serif' }}>{formatCurrency(item.entered)}</span>
                  <span style={{ width: 80, textAlign: 'right', fontSize: 13, fontWeight: 600, color: '#333', fontFamily: 'Open Sans, sans-serif' }}>{formatCurrency(item.zakatable)}</span>
                  <span style={{ width: 70, textAlign: 'right', fontSize: 13, fontWeight: 700, color: '#2d7a4f', fontFamily: 'Open Sans, sans-serif' }}>{formatCurrency(item.zakatDue)}</span>
                </div>
              ))}
            </div>
          )}

          <div style={{ marginTop: breakdownOpen ? 16 : 12, display: 'flex', flexDirection: 'column', gap: 8, borderTop: breakdownOpen ? '1px solid #f0f0f0' : 'none', paddingTop: breakdownOpen ? 12 : 0 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontSize: 14, fontWeight: 700, color: '#1a3a2a', fontFamily: 'Open Sans, sans-serif' }}>Total Assets</span>
              <span style={{ fontSize: 14, fontWeight: 700, color: '#1a3a2a', fontFamily: 'Open Sans, sans-serif' }}>{formatCurrency(result.totalAssets)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontSize: 13, color: '#888', fontFamily: 'Open Sans, sans-serif' }}>Total Liabilities</span>
              <span style={{ fontSize: 13, fontWeight: 600, color: '#e05252', fontFamily: 'Open Sans, sans-serif' }}>− {formatCurrency(result.totalLiabilities)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontSize: 14, fontWeight: 700, color: '#1a3a2a', fontFamily: 'Open Sans, sans-serif' }}>Zakatable Wealth</span>
              <span style={{ fontSize: 14, fontWeight: 700, color: '#1a3a2a', fontFamily: 'Open Sans, sans-serif' }}>{formatCurrency(result.zakatableWealth)}</span>
            </div>
          </div>
        </div>

        {/* Disclaimer */}
        <div style={{ background: '#fffbeb', border: '1px solid #fde68a', borderRadius: 16, padding: '12px 16px', width: '100%' }}>
          <p style={{ fontSize: 12, color: '#92400e', fontFamily: 'Open Sans, sans-serif', lineHeight: 1.6, margin: 0 }}>
            <strong>Note:</strong> This is an estimate. Please consult a qualified Islamic scholar for your specific situation.
          </p>
        </div>

        {/* Buttons */}
        <div style={{ display: 'flex', gap: 12, width: '100%' }}>
          <button onClick={onBack} style={{ flex: 1, background: 'white', color: '#1a3a2a', border: 'none', padding: '16px', borderRadius: 16, fontSize: 15, fontWeight: 600, cursor: 'pointer', boxShadow: '0 2px 12px rgba(0,0,0,0.06)', fontFamily: 'Open Sans, sans-serif' }}>
            ← Back
          </button>
          <button onClick={onReset} style={{ flex: 1, background: 'white', color: '#1a3a2a', border: 'none', padding: '16px', borderRadius: 16, fontSize: 15, fontWeight: 600, cursor: 'pointer', boxShadow: '0 2px 12px rgba(0,0,0,0.06)', fontFamily: 'Open Sans, sans-serif' }}>
            Start Over
          </button>
          <button style={{ flex: 1, background: '#1a3a2a', color: 'white', border: 'none', padding: '16px', borderRadius: 16, fontSize: 15, fontWeight: 600, cursor: 'pointer', boxShadow: '0 2px 12px rgba(0,0,0,0.06)', fontFamily: 'Open Sans, sans-serif' }}>
            Donate →
          </button>
        </div>

      </div>
    </div>
  )
}
