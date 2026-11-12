'use client'

import { useState, useEffect, useRef } from 'react'
import { ZakatResult, NisabStandard } from '@/types/zakat.types'
import { EmailReportModal } from './EmailReportModal'
import { DonateModal } from './DonateModal'
import { useCalculatorStore } from '@/store/calculatorStore'

interface ZakatSummaryProps {
  result: ZakatResult
  nisabStandard?: NisabStandard
  onChangeNisabStandard?: (standard: NisabStandard) => void
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
      if (start >= value) {
        setDisplay(value)
        clearInterval(timer)
      } else {
        setDisplay(Math.floor(start))
      }
    }, 16)
    return () => clearInterval(timer)
  }, [value, duration])
  return <span>{formatCurrency(display)}</span>
}

function polarToCartesian(cx: number, cy: number, r: number, angle: number) {
  const rad = ((angle - 90) * Math.PI) / 180
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) }
}

function slicePath(cx: number, cy: number, r: number, startPct: number, endPct: number) {
  if (endPct - startPct >= 0.9999) {
    return `M ${cx} ${cy - r} A ${r} ${r} 0 1 1 ${cx - 0.01} ${cy - r} Z`
  }
  const s = polarToCartesian(cx, cy, r, startPct * 360)
  const e = polarToCartesian(cx, cy, r, endPct * 360)
  const large = endPct - startPct > 0.5 ? 1 : 0
  return `M ${cx} ${cy} L ${s.x} ${s.y} A ${r} ${r} 0 ${large} 1 ${e.x} ${e.y} Z`
}

const SLICE_COLORS = [
  '#1E3F20',
  '#2D5C31',
  '#3E7944',
  '#519659',
  '#67B370',
  '#84C88C',
  '#A3DCAB',
  '#C5ECCB',
]

const CARD: React.CSSProperties = {
  background: '#FFFFFF',
  border: '1px solid #E2E2D8',
  borderRadius: 14,
  padding: 'clamp(20px, 4vw, 32px) clamp(18px, 4vw, 36px)',
  boxShadow: '0 4px 20px rgba(20,20,20,0.03)',
}

const F = {
  eyebrow: 13,
  heroSub: 18,
  pillLabel: 13,
  pillValue: 16,
  cardHeader: 14,
  chartLabel: 14,
  tableHeader: 12,
  tableRow: 14,
  editBtn: 13,
  disclaimer: 14,
  actionBtn: 14,
}

export function ZakatSummary({
  result,
  nisabStandard,
  onChangeNisabStandard,
  onReset,
  onBack,
  onEdit,
}: ZakatSummaryProps) {
  const [visible, setVisible] = useState(false)
  const [activeSlice, setActiveSlice] = useState<number | null>(null)
  const [heroInView, setHeroInView] = useState(true)
  const [showEmailModal, setShowEmailModal] = useState(false)
  const [showDonateModal, setShowDonateModal] = useState(false)
  const [copiedAmount, setCopiedAmount] = useState(false)
  const partnerMasjid = useCalculatorStore((s) => s.partnerMasjid)
  const heroRef = useRef<HTMLElement>(null)

  useEffect(() => {
    setTimeout(() => setVisible(true), 60)
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      if (!heroRef.current) return
      const rect = heroRef.current.getBoundingClientRect()
      setHeroInView(rect.bottom > 64)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  async function handleDownloadPDF() {
    const { downloadZakatPDF } = await import('@/lib/zakat/generatePDF')
    downloadZakatPDF(result)
  }

  const total = result.totalAssets
  let cumulative = 0
  const slices = result.breakdown.map((item, i) => {
    const pct = total > 0 ? item.entered / total : 0
    const start = cumulative
    cumulative += pct
    return { ...item, pct, start, color: SLICE_COLORS[i % SLICE_COLORS.length] }
  })

  const waterfallSteps = [
    { label: 'Total Assets', value: result.totalAssets, type: 'positive', color: '#141414' },
    { label: 'Liabilities', value: -result.totalLiabilities, type: 'negative', color: '#B91C1C' },
    { label: 'Zakatable Wealth', value: result.zakatableWealth, type: 'result', color: '#141414' },
    { label: 'Zakat Due (2.5%)', value: result.zakatDue, type: 'zakat', color: '#1E3F20' },
  ]
  const maxVal = result.totalAssets || 1

  return (
    <div style={{ color: '#141414', background: '#F5F5F0', minHeight: '100vh' }}>
      {showEmailModal && (
        <EmailReportModal result={result} onClose={() => setShowEmailModal(false)} />
      )}
      {showDonateModal && (
        <DonateModal result={result} onClose={() => setShowDonateModal(false)} />
      )}

      {/* ── STICKY COLLAPSED BAR ── */}
      <div
        style={{
          position: 'fixed',
          top: 64,
          left: 0,
          right: 0,
          zIndex: 45,
          background: '#141414',
          borderBottom: '1px solid #2B2B2B',
          transform: heroInView ? 'translateY(-110%)' : 'translateY(0)',
          transition: 'transform 0.3s ease',
          boxShadow: '0 4px 20px rgba(0,0,0,0.18)',
        }}
      >
        <div
          style={{
            maxWidth: 960,
            margin: '0 auto',
            padding: '10px 24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 28,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center' }}>
            {[
              { label: 'Total Assets', value: formatCurrency(result.totalAssets) },
              { label: 'Zakatable Wealth', value: formatCurrency(result.zakatableWealth) },
            ].map((s, i) => (
              <div key={s.label} style={{ display: 'flex', alignItems: 'center' }}>
                <div style={{ textAlign: 'center', padding: '0 20px' }}>
                  <div
                    style={{
                      fontSize: 10,
                      color: 'rgba(255,255,255,0.45)',
                      letterSpacing: 1,
                      textTransform: 'uppercase',
                      marginBottom: 2,
                    }}
                  >
                    {s.label}
                  </div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: 'rgba(255,255,255,0.9)' }}>
                    {s.value}
                  </div>
                </div>
                {i === 0 && (
                  <div style={{ width: 1, height: 28, background: 'rgba(255,255,255,0.15)', flexShrink: 0 }} />
                )}
              </div>
            ))}
          </div>
          <div style={{ width: 1, height: 28, background: 'rgba(255,255,255,0.2)', flexShrink: 0 }} />
          <div style={{ textAlign: 'center', padding: '0 20px' }}>
            <div
              style={{
                fontSize: 10,
                fontWeight: 700,
                color: '#86EFAC',
                letterSpacing: 2,
                textTransform: 'uppercase',
                marginBottom: 2,
              }}
            >
              Zakat Due (2.5%)
            </div>
            <div style={{ fontSize: 20, fontWeight: 900, color: '#FFFFFF', lineHeight: 1 }}>
              {formatCurrency(result.zakatDue)}
            </div>
          </div>
        </div>
      </div>

      {/* ── HERO BANNER ── */}
      <section
        ref={heroRef}
        style={{
          background: '#141414',
          color: '#FFFFFF',
          padding: '60px 24px 70px',
          textAlign: 'center',
          position: 'relative',
        }}
      >
        <div
          style={{
            maxWidth: 820,
            margin: '0 auto',
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateY(0)' : 'translateY(16px)',
            transition: 'opacity 0.6s ease, transform 0.6s ease',
          }}
        >
          <p
            style={{
              color: '#86EFAC',
              fontSize: F.eyebrow,
              letterSpacing: 3,
              textTransform: 'uppercase',
              fontWeight: 800,
              marginBottom: 14,
            }}
          >
            Zakat Due This Year
          </p>
          <div
            style={{
              fontSize: 'clamp(52px, 8vw, 84px)',
              fontWeight: 900,
              color: '#FFFFFF',
              lineHeight: 1,
              letterSpacing: '-1.5px',
            }}
          >
            <AnimatedNumber value={result.zakatDue} duration={1200} />
          </div>
          <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: F.heroSub, marginTop: 14 }}>
            {result.zakatDue > 0
              ? '2.5% of your net zakatable wealth'
              : 'No Zakat due — liabilities offset your total assets'}
          </p>

          {/* Stat pills */}
          <div
            style={{
              display: 'flex',
              gap: 10,
              justifyContent: 'center',
              marginTop: 32,
              flexWrap: 'wrap',
            }}
          >
            {[
              { label: 'Total Assets', value: formatCurrency(result.totalAssets) },
              { label: 'Total Liabilities', value: formatCurrency(result.totalLiabilities) },
              { label: 'Net Zakatable Wealth', value: formatCurrency(result.zakatableWealth) },
            ].map((stat) => (
              <div
                key={stat.label}
                style={{
                  background: 'rgba(255,255,255,0.08)',
                  border: '1px solid rgba(255,255,255,0.15)',
                  borderRadius: 6,
                  padding: '9px 18px',
                  display: 'flex',
                  gap: 8,
                  alignItems: 'center',
                }}
              >
                <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: F.pillLabel }}>
                  {stat.label}
                </span>
                <span style={{ color: '#FFFFFF', fontWeight: 800, fontSize: F.pillValue }}>
                  {stat.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── MAIN CONTENT ── */}
      <section style={{ padding: '48px 24px 80px' }}>
        <div
          style={{
            maxWidth: 960,
            margin: '0 auto',
            display: 'flex',
            flexDirection: 'column',
            gap: 24,
            opacity: visible ? 1 : 0,
            transition: 'opacity 0.5s ease 0.2s',
          }}
        >
          {/* Charts Row */}
          {result.breakdown.length > 0 && (
            <div
              className="summary-charts-grid"
              style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}
            >
              {/* Donut */}
              <div style={CARD}>
                <p
                  style={{
                    fontSize: F.cardHeader,
                    fontWeight: 800,
                    color: '#1E3F20',
                    letterSpacing: 1.5,
                    textTransform: 'uppercase',
                    marginBottom: 24,
                  }}
                >
                  Asset Mix
                </p>
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 20 }}>
                  <svg width="240" height="240" viewBox="0 0 160 160">
                    {slices.map((slice, i) => (
                      <path
                        key={i}
                        d={slicePath(
                          80,
                          80,
                          activeSlice === i ? 74 : 68,
                          slice.start,
                          slice.start + slice.pct
                        )}
                        fill={slice.color}
                        opacity={activeSlice === null || activeSlice === i ? 1 : 0.25}
                        style={{ cursor: 'pointer', transition: 'all 0.2s ease' }}
                        onMouseEnter={() => setActiveSlice(i)}
                        onMouseLeave={() => setActiveSlice(null)}
                      />
                    ))}
                    <circle cx="80" cy="80" r="46" fill="#FFFFFF" />
                    <text x="80" y="74" textAnchor="middle" fontSize="11" fill="#888">
                      Total
                    </text>
                    <text x="80" y="90" textAnchor="middle" fontSize="13" fontWeight="800" fill="#141414">
                      {formatCurrency(total)}
                    </text>
                  </svg>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  {slices.map((slice, i) => (
                    <div
                      key={i}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 10,
                        cursor: 'pointer',
                        padding: '8px 10px',
                        borderRadius: 6,
                        background: activeSlice === i ? '#F5F5F0' : 'transparent',
                      }}
                      onMouseEnter={() => setActiveSlice(i)}
                      onMouseLeave={() => setActiveSlice(null)}
                      onClick={() => onEdit(slice.stepName)}
                    >
                      <div
                        style={{
                          width: 10,
                          height: 10,
                          borderRadius: 3,
                          background: slice.color,
                          flexShrink: 0,
                        }}
                      />
                      <span style={{ flex: 1, fontSize: F.chartLabel, color: '#3A3A3A' }}>
                        {slice.label}
                      </span>
                      <span style={{ fontSize: F.chartLabel, fontWeight: 700, color: '#141414' }}>
                        {Math.round(slice.pct * 100)}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Waterfall */}
              <div style={CARD}>
                <p
                  style={{
                    fontSize: F.cardHeader,
                    fontWeight: 800,
                    color: '#1E3F20',
                    letterSpacing: 1.5,
                    textTransform: 'uppercase',
                    marginBottom: 24,
                  }}
                >
                  Calculation Breakdown
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
                  {waterfallSteps.map((step, i) => {
                    if (step.value === 0 && step.type === 'negative') return null
                    const barWidth = (Math.abs(step.value) / maxVal) * 100
                    const isNeg = step.type === 'negative'
                    return (
                      <div key={i}>
                        <div
                          style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            marginBottom: 8,
                          }}
                        >
                          <span style={{ fontSize: F.chartLabel, color: '#4A4A4A' }}>{step.label}</span>
                          <span
                            style={{
                              fontSize: F.chartLabel,
                              fontWeight: 800,
                              color: isNeg ? '#B91C1C' : step.color,
                            }}
                          >
                            {isNeg ? '−' : ''}
                            {formatCurrency(Math.abs(step.value))}
                          </span>
                        </div>
                        <div
                          style={{
                            height: 8,
                            background: '#EAEAE2',
                            borderRadius: 4,
                            overflow: 'hidden',
                          }}
                        >
                          <div
                            style={{
                              height: '100%',
                              width: visible ? `${barWidth}%` : '0%',
                              background: isNeg ? '#B91C1C' : step.color,
                              borderRadius: 4,
                              transition: `width 0.8s ease ${0.3 + i * 0.12}s`,
                            }}
                          />
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Breakdown Table */}
          {result.breakdown.length > 0 && (
            <div style={CARD}>
              <p
                style={{
                  fontSize: F.cardHeader,
                  fontWeight: 800,
                  color: '#1E3F20',
                  letterSpacing: 1.5,
                  textTransform: 'uppercase',
                  marginBottom: 20,
                }}
              >
                Itemized Calculation
              </p>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 500 }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid #E2E2D8' }}>
                      {['Asset / Liability', 'Gross Value', 'Zakatable', 'Zakat @ 2.5%', ''].map(
                        (h, i) => (
                          <th
                            key={i}
                            className={i === 1 ? 'summary-col-value' : ''}
                            style={{
                              textAlign: i === 0 ? 'left' : 'right',
                              fontSize: F.tableHeader,
                              fontWeight: 800,
                              color: i === 3 ? '#1E3F20' : '#8A8A8A',
                              textTransform: 'uppercase',
                              letterSpacing: 0.8,
                              padding: '0 12px 12px',
                              paddingLeft: i === 0 ? 0 : 12,
                              paddingRight: i === 4 ? 0 : 12,
                              width: i === 4 ? 68 : undefined,
                              whiteSpace: 'nowrap',
                            }}
                          >
                            {h}
                          </th>
                        )
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {result.breakdown.map((item, i) => (
                      <tr key={i} style={{ borderBottom: '1px solid #F0F0EA' }}>
                        <td
                          style={{
                            padding: '14px 12px 14px 0',
                            fontSize: F.tableRow,
                            color: '#141414',
                          }}
                        >
                          {item.label}
                        </td>
                        <td
                          className="summary-col-value"
                          style={{
                            padding: '14px 12px',
                            textAlign: 'right',
                            fontSize: F.tableRow,
                            color: '#6E6E6E',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {formatCurrency(item.entered)}
                        </td>
                        <td
                          style={{
                            padding: '14px 12px',
                            textAlign: 'right',
                            fontSize: F.tableRow,
                            fontWeight: 600,
                            color: '#141414',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {formatCurrency(item.zakatable)}
                        </td>
                        <td
                          style={{
                            padding: '14px 12px',
                            textAlign: 'right',
                            fontSize: F.tableRow,
                            fontWeight: 800,
                            color: '#1E3F20',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {formatCurrency(item.zakatable * 0.025)}
                        </td>
                        <td style={{ padding: '14px 0 14px 12px', textAlign: 'right' }}>
                          <button
                            type="button"
                            onClick={() => onEdit(item.stepName)}
                            style={{
                              fontSize: F.editBtn,
                              color: '#1E3F20',
                              background: '#F0F0EA',
                              border: 'none',
                              borderRadius: 4,
                              padding: '5px 12px',
                              cursor: 'pointer',
                              fontWeight: 700,
                            }}
                          >
                            Edit
                          </button>
                        </td>
                      </tr>
                    ))}

                    {/* Liabilities */}
                    {result.totalLiabilities > 0 && (
                      <tr style={{ borderBottom: '1px solid #F0F0EA' }}>
                        <td
                          style={{
                            padding: '14px 12px 14px 0',
                            fontSize: F.tableRow,
                            color: '#B91C1C',
                            fontWeight: 600,
                          }}
                        >
                          Liabilities (Deducted)
                        </td>
                        <td
                          className="summary-col-value"
                          style={{
                            padding: '14px 12px',
                            textAlign: 'right',
                            fontSize: F.tableRow,
                            color: '#B91C1C',
                            fontWeight: 600,
                            whiteSpace: 'nowrap',
                          }}
                        >
                          −{formatCurrency(result.totalLiabilities)}
                        </td>
                        <td
                          style={{
                            padding: '14px 12px',
                            textAlign: 'right',
                            fontSize: F.tableRow,
                            color: '#B91C1C',
                            fontWeight: 600,
                            whiteSpace: 'nowrap',
                          }}
                        >
                          −{formatCurrency(result.totalLiabilities)}
                        </td>
                        <td
                          style={{
                            padding: '14px 12px',
                            textAlign: 'right',
                            fontSize: 12,
                            color: '#B91C1C',
                            fontWeight: 700,
                            whiteSpace: 'nowrap',
                          }}
                        >
                          Deducted
                        </td>
                        <td style={{ padding: '14px 0 14px 12px', textAlign: 'right' }}>
                          <button
                            type="button"
                            onClick={() => onEdit('debts')}
                            style={{
                              fontSize: F.editBtn,
                              color: '#B91C1C',
                              background: '#FEE2E2',
                              border: 'none',
                              borderRadius: 4,
                              padding: '5px 12px',
                              cursor: 'pointer',
                              fontWeight: 700,
                            }}
                          >
                            Edit
                          </button>
                        </td>
                      </tr>
                    )}

                    {/* Net Total Row */}
                    <tr style={{ borderTop: '2px solid #E2E2D8' }}>
                      <td
                        style={{
                          padding: '16px 12px 16px 0',
                          fontSize: F.tableRow,
                          fontWeight: 800,
                          color: '#141414',
                        }}
                      >
                        Net Zakatable Wealth
                      </td>
                      <td className="summary-col-value" />
                      <td
                        style={{
                          padding: '16px 12px',
                          textAlign: 'right',
                          fontSize: F.tableRow,
                          fontWeight: 800,
                          color: '#141414',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {formatCurrency(result.zakatableWealth)}
                      </td>
                      <td
                        style={{
                          padding: '16px 12px',
                          textAlign: 'right',
                          fontSize: F.tableRow,
                          fontWeight: 900,
                          color: result.zakatDue > 0 ? '#1E3F20' : '#141414',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {formatCurrency(result.zakatDue)}
                      </td>
                      <td />
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ── MINIMALIST 3-OPTION ACTION BAR (Email, Download, Donate) ── */}
          <div style={{ marginTop: 8 }}>
            <div
              className="summary-actions-grid"
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                gap: 12,
                alignItems: 'stretch',
              }}
            >
              {/* 1. Email Report */}
              <button
                type="button"
                onClick={() => setShowEmailModal(true)}
                style={{
                  background: '#FFFFFF',
                  color: '#141414',
                  border: '1px solid #DCDCD4',
                  borderRadius: 10,
                  padding: '16px 20px',
                  fontSize: 14,
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                  transition: 'all 0.15s ease',
                  boxShadow: '0 2px 8px rgba(20,20,20,0.02)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = '#141414'
                  e.currentTarget.style.background = '#FAFAF8'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = '#DCDCD4'
                  e.currentTarget.style.background = '#FFFFFF'
                }}
              >
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect width="20" height="16" x="2" y="4" rx="2" />
                  <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                </svg>
                <span>Email Report</span>
              </button>

              {/* 2. Download PDF */}
              <button
                type="button"
                onClick={handleDownloadPDF}
                style={{
                  background: '#FFFFFF',
                  color: '#141414',
                  border: '1px solid #DCDCD4',
                  borderRadius: 10,
                  padding: '16px 20px',
                  fontSize: 14,
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                  transition: 'all 0.15s ease',
                  boxShadow: '0 2px 8px rgba(20,20,20,0.02)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = '#141414'
                  e.currentTarget.style.background = '#FAFAF8'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = '#DCDCD4'
                  e.currentTarget.style.background = '#FFFFFF'
                }}
              >
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
                <span>Download PDF</span>
              </button>

              {/* 3. Donate (Primary) */}
              {partnerMasjid && partnerMasjid.portalUrl ? (
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(Math.round(result.zakatDue).toString())
                    setCopiedAmount(true)
                    window.open(partnerMasjid.portalUrl, '_blank')
                    setTimeout(() => setCopiedAmount(false), 4000)
                  }}
                  style={{
                    background: '#1E3F20',
                    color: '#FFFFFF',
                    border: 'none',
                    borderRadius: 10,
                    padding: '16px 24px',
                    fontSize: 15,
                    fontWeight: 800,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 8,
                    boxShadow: '0 4px 16px rgba(30,63,32,0.22)',
                    transition: 'all 0.15s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = '#163018'
                    e.currentTarget.style.transform = 'translateY(-1px)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = '#1E3F20'
                    e.currentTarget.style.transform = 'translateY(0)'
                  }}
                >
                  <span>
                    {copiedAmount
                      ? `Copied ${formatCurrency(result.zakatDue)} — Opening...`
                      : `Donate to ${partnerMasjid.name} →`}
                  </span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setShowDonateModal(true)}
                  style={{
                    background: '#1E3F20',
                    color: '#FFFFFF',
                    border: 'none',
                    borderRadius: 10,
                    padding: '16px 24px',
                    fontSize: 15,
                    fontWeight: 800,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 8,
                    boxShadow: '0 4px 16px rgba(30,63,32,0.22)',
                    transition: 'all 0.15s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = '#163018'
                    e.currentTarget.style.transform = 'translateY(-1px)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = '#1E3F20'
                    e.currentTarget.style.transform = 'translateY(0)'
                  }}
                >
                  <span>Donate Your Zakat →</span>
                </button>
              )}
            </div>

            {/* Subtle Minimalist Secondary Links */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                gap: 16,
                marginTop: 20,
              }}
            >
              <button
                type="button"
                onClick={onBack}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#6E6E6E',
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: 'pointer',
                  padding: '6px 8px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 4,
                  transition: 'color 0.15s ease',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = '#141414')}
                onMouseLeave={(e) => (e.currentTarget.style.color = '#6E6E6E')}
              >
                ← Back to edit
              </button>
              <span style={{ color: '#DCDCD4', fontSize: 12 }}>•</span>
              <button
                type="button"
                onClick={onReset}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#6E6E6E',
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: 'pointer',
                  padding: '6px 8px',
                  transition: 'color 0.15s ease',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = '#141414')}
                onMouseLeave={(e) => (e.currentTarget.style.color = '#6E6E6E')}
              >
                Start over
              </button>
            </div>
          </div>
        </div>
      </section>

      <style jsx>{`
        @media (max-width: 768px) {
          .summary-charts-grid {
            grid-template-columns: 1fr !important;
          }
          .summary-col-value {
            display: none !important;
          }
        }
      `}</style>
    </div>
  )
}
