'use client'

import { useState } from 'react'
import { AssetInputs, NisabData, NisabStandard, Madhhab, PassiveStockRate, RetirementMethodRate } from '@/types/zakat.types'
import { calculateZakat } from '@/lib/zakat/calculate'
import { useCalculatorStore } from '@/store/calculatorStore'

const GROUPS = [
  { id: 'cash', num: '01', label: 'Cash & Bank', steps: ['cash'] },
  { id: 'goldsilver', num: '02', label: 'Gold & Silver', steps: ['goldsilver'] },
  { id: 'investments', num: '03', label: 'Investments', steps: ['investment-selector', 'stocks', 'crypto', 'retirement', 'business'] },
  { id: 'receivables', num: '04', label: 'Money Owed', steps: ['receivables'] },
  { id: 'debts', num: '05', label: 'Liabilities', steps: ['debts'] },
]

const MADHHAB_LABELS: Record<Madhhab, string> = {
  hanafi: 'Hanafi',
  shafii: "Shafi'i",
  maliki_hanbali: 'Maliki & Hanbali',
  general: 'Standard (AMJA)',
}

function fmt(amount: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(amount)
}

interface StepTrailProps {
  currentStepName: string
  visitedSteps: string[]
  onGoToStep: (step: string) => void
  assets?: AssetInputs
  nisabData?: NisabData | null
  nisabStandard?: NisabStandard
  passiveInvestmentRate?: PassiveStockRate
  retirementRate?: RetirementMethodRate
}

export function StepTrail({
  currentStepName,
  visitedSteps,
  onGoToStep,
  assets,
  nisabData,
  passiveInvestmentRate = 0.3,
  retirementRate = 0.6,
}: StepTrailProps) {
  const madhhab = useCalculatorStore((s) => s.madhhab)
  const setMadhhab = useCalculatorStore((s) => s.setMadhhab)
  const nisabStandard = useCalculatorStore((s) => s.nisabStandard)
  const [showSchoolMenu, setShowSchoolMenu] = useState(false)

  const result =
    assets && nisabData
      ? calculateZakat(assets, nisabData, nisabStandard, passiveInvestmentRate, retirementRate)
      : null

  function getGroupAmount(id: string): string {
    if (!assets) return '—'
    if (id === 'cash') return assets.cash > 0 ? fmt(assets.cash) : '—'
    if (id === 'goldsilver') {
      const total = assets.gold + assets.silver
      return total > 0 ? fmt(total) : '—'
    }
    if (id === 'investments') {
      const total =
        assets.stocks +
        assets.passiveStocks * passiveInvestmentRate +
        assets.crypto +
        assets.retirementAccounts * retirementRate +
        assets.businessInventory
      return total > 0 ? fmt(total) : '—'
    }
    if (id === 'receivables') return assets.moneyOwed > 0 ? fmt(assets.moneyOwed) : '—'
    if (id === 'debts') return assets.liabilities > 0 ? `-${fmt(assets.liabilities)}` : '—'
    return '—'
  }

  return (
    <div
      style={{
        background: '#102417',
        color: '#FFFFFF',
        padding: 'clamp(22px, 3.5vw, 32px) clamp(18px, 3vw, 24px)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        gap: 24,
      }}
    >
      <div>
        {/* Active School of Thought Switcher Pill */}
        <div style={{ marginBottom: 20, position: 'relative' }}>
          <div
            style={{
              fontSize: 10,
              fontWeight: 800,
              color: 'rgba(255,255,255,0.48)',
              letterSpacing: 1.3,
              textTransform: 'uppercase',
              marginBottom: 6,
            }}
          >
            School of Thought (Fiqh)
          </div>
          <button
            type="button"
            onClick={() => setShowSchoolMenu((v) => !v)}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              background: 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(197, 160, 89, 0.35)',
              borderRadius: 10,
              padding: '9px 12px',
              color: '#FFFFFF',
              fontSize: 12.5,
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            <span style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
              <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#C5A059' }} />
              <span>{MADHHAB_LABELS[madhhab]}</span>
            </span>
            <span style={{ fontSize: 11, color: '#C5A059', fontWeight: 700 }}>
              {showSchoolMenu ? 'Close ▲' : 'Switch ▾'}
            </span>
          </button>

          {showSchoolMenu && (
            <div
              style={{
                marginTop: 6,
                background: '#16311F',
                border: '1px solid rgba(197, 160, 89, 0.4)',
                borderRadius: 10,
                padding: 6,
                display: 'flex',
                flexDirection: 'column',
                gap: 4,
              }}
            >
              {(['hanafi', 'shafii', 'maliki_hanbali', 'general'] as Madhhab[]).map((m) => {
                const active = madhhab === m
                return (
                  <button
                    key={m}
                    type="button"
                    onClick={() => {
                      setMadhhab(m)
                      setShowSchoolMenu(false)
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '8px 10px',
                      borderRadius: 7,
                      border: 'none',
                      background: active ? '#C5A059' : 'transparent',
                      color: active ? '#102417' : '#FFFFFF',
                      fontSize: 12,
                      fontWeight: active ? 800 : 600,
                      cursor: 'pointer',
                      textAlign: 'left',
                    }}
                  >
                    <span>{MADHHAB_LABELS[m]}</span>
                    {active && <span>✓</span>}
                  </button>
                )
              })}
            </div>
          )}
        </div>

        <div
          style={{
            fontSize: 11,
            fontWeight: 800,
            color: '#C5A059',
            letterSpacing: 1.5,
            textTransform: 'uppercase',
            marginBottom: 14,
          }}
        >
          Assessment Progress
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {GROUPS.map((group) => {
            const isActive = group.steps.includes(currentStepName)
            const isVisited = !isActive && group.steps.some((s) => visitedSteps.includes(s))
            const isClickable = isVisited
            const amount = getGroupAmount(group.id)

            return (
              <button
                key={group.id}
                type="button"
                onClick={() => isClickable && onGoToStep(group.steps[0])}
                disabled={!isClickable && !isActive}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '11px 13px',
                  borderRadius: 12,
                  background: isActive ? 'rgba(197, 160, 89, 0.16)' : 'transparent',
                  border: isActive
                    ? '1px solid rgba(197, 160, 89, 0.45)'
                    : '1px solid transparent',
                  cursor: isClickable ? 'pointer' : 'default',
                  textAlign: 'left',
                  transition: 'all 0.2s ease',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
                  <span
                    style={{
                      width: 22,
                      height: 22,
                      borderRadius: 6,
                      background: isVisited
                        ? '#22C55E'
                        : isActive
                        ? '#C5A059'
                        : 'rgba(255,255,255,0.1)',
                      color: isVisited || isActive ? '#102417' : 'rgba(255,255,255,0.5)',
                      fontSize: 11,
                      fontWeight: 800,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    {isVisited ? (
                      <svg
                        width="11"
                        height="11"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3.2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    ) : (
                      group.num
                    )}
                  </span>
                  <span
                    style={{
                      fontSize: 13.5,
                      fontWeight: isActive ? 800 : 600,
                      color: isActive
                        ? '#FFFFFF'
                        : isVisited
                        ? 'rgba(255,255,255,0.88)'
                        : 'rgba(255,255,255,0.55)',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    {group.label}
                  </span>
                </div>

                <span
                  style={{
                    fontSize: 12.5,
                    fontWeight: 700,
                    color: isActive
                      ? '#C5A059'
                      : amount !== '—'
                      ? 'rgba(255,255,255,0.85)'
                      : 'rgba(255,255,255,0.4)',
                    fontVariantNumeric: 'tabular-nums',
                    marginLeft: 8,
                    flexShrink: 0,
                  }}
                >
                  {amount}
                </span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Bottom Anchored Live Summary */}
      <div
        style={{
          background: 'rgba(255,255,255,0.06)',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: 14,
          padding: '18px',
        }}
      >
        <div
          style={{
            fontSize: 11,
            textTransform: 'uppercase',
            letterSpacing: 1,
            color: 'rgba(255,255,255,0.55)',
            fontWeight: 700,
            marginBottom: 4,
          }}
        >
          Zakat Due (2.5%)
        </div>
        <div
          style={{
            fontSize: 32,
            fontWeight: 900,
            color: '#86EFAC',
            lineHeight: 1.1,
            marginBottom: 8,
            fontVariantNumeric: 'tabular-nums',
          }}
        >
          {result ? fmt(result.zakatDue) : '$0'}
        </div>
        <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.65)' }}>
          Total Zakatable:{' '}
          <strong style={{ color: '#FFFFFF', fontVariantNumeric: 'tabular-nums' }}>
            {result ? fmt(result.zakatableWealth) : '$0'}
          </strong>
        </div>
      </div>
    </div>
  )
}
