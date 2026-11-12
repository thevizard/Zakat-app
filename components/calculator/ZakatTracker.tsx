'use client'

import { AssetInputs, NisabData, NisabStandard, PassiveStockRate, RetirementMethodRate } from '@/types/zakat.types'
import { calculateZakat } from '@/lib/zakat/calculate'

interface ZakatTrackerProps {
  assets: AssetInputs
  nisabData: NisabData | null
  nisabStandard?: NisabStandard
  passiveInvestmentRate?: PassiveStockRate
  retirementRate?: RetirementMethodRate
  onChangeNisabStandard?: (standard: NisabStandard) => void
}

function formatCurrency(amount: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(amount)
}

export function ZakatTracker({
  assets,
  nisabData,
  nisabStandard = 'silver',
  passiveInvestmentRate = 0.3,
  retirementRate = 0.6,
}: ZakatTrackerProps) {
  if (!nisabData) return null

  const result = calculateZakat(
    assets,
    nisabData,
    nisabStandard,
    passiveInvestmentRate,
    retirementRate
  )
  const hasAssets = result.totalAssets > 0

  const stats = [
    {
      label: 'Total Assets',
      value: formatCurrency(result.totalAssets),
      active: hasAssets,
      color: '#FFFFFF',
    },
    {
      label: 'Zakatable Wealth',
      value: formatCurrency(result.zakatableWealth),
      active: result.zakatableWealth > 0,
      color: '#FFFFFF',
    },
    {
      label: 'Zakat Due (2.5%)',
      value: formatCurrency(result.zakatDue),
      active: result.zakatDue > 0,
      color: '#86EFAC',
    },
  ]

  return (
    <div
      className="tracker-stat-pad"
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        gap: 8,
      }}
    >
      {stats.map((stat, i) => (
        <div key={stat.label} style={{ display: 'flex', alignItems: 'center' }}>
          <div className="tracker-stat-pad" style={{ textAlign: 'center' }}>
            <div
              className="tracker-stat-label"
              style={{
                fontWeight: 700,
                color: 'rgba(255,255,255,0.45)',
                textTransform: 'uppercase',
                marginBottom: 2,
              }}
            >
              {stat.label}
            </div>
            <div
              className="tracker-stat-value"
              style={{
                fontWeight: 800,
                color: stat.active ? stat.color : 'rgba(255,255,255,0.25)',
                transition: 'color 0.2s',
              }}
            >
              {stat.value}
            </div>
          </div>
          {i < stats.length - 1 && (
            <div style={{ width: 1, height: 28, background: 'rgba(255,255,255,0.12)', flexShrink: 0 }} />
          )}
        </div>
      ))}
    </div>
  )
}
