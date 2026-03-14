'use client'

import { AssetInputs, NisabData, NisabStandard } from '@/types/zakat.types'
import { calculateZakat } from '@/lib/zakat/calculate'

interface ZakatTrackerProps {
  assets: AssetInputs
  nisabData: NisabData | null
  nisabStandard: NisabStandard
}

function formatCurrency(amount: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(amount)
}

export function ZakatTracker({ assets, nisabData, nisabStandard }: ZakatTrackerProps) {
  if (!nisabData) return null

  const result = calculateZakat(assets, nisabData, nisabStandard)
  const hasAssets = result.totalAssets > 0

  const stats = [
    {
      label: 'Total Assets',
      value: formatCurrency(result.totalAssets),
      active: hasAssets,
      color: 'white',
    },
    {
      label: 'Zakatable Wealth',
      value: formatCurrency(result.zakatableWealth),
      active: result.zakatableWealth > 0,
      color: 'white',
    },
    {
      label: 'Zakat Due',
      value: result.meetsNisab
        ? formatCurrency(result.zakatDue)
        : result.zakatableWealth > 0
        ? 'Below Nisab'
        : '$0',
      active: result.meetsNisab,
      color: result.meetsNisab ? '#68BA7F' : result.zakatableWealth > 0 ? '#f0b429' : 'white',
    },
  ]

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        padding: '0 32px',
      }}
    >
      {stats.map((stat, i) => (
        <div key={stat.label} style={{ display: 'flex', alignItems: 'center' }}>
          <div style={{ textAlign: 'center', padding: '0 32px' }}>
            <div
              style={{
                fontSize: 11,
                fontWeight: 600,
                color: 'rgba(255,255,255,0.45)',
                textTransform: 'uppercase',
                letterSpacing: 1.5,
                fontFamily: 'Open Sans, sans-serif',
                marginBottom: 3,
              }}
            >
              {stat.label}
            </div>
            <div
              style={{
                fontSize: 18,
                fontWeight: 700,
                color: stat.active ? stat.color : 'rgba(255,255,255,0.2)',
                fontFamily: 'Open Sans, sans-serif',
                transition: 'color 0.3s',
              }}
            >
              {stat.value}
            </div>
          </div>
          {i < stats.length - 1 && (
            <div style={{ width: 1, height: 32, background: 'rgba(255,255,255,0.12)', flexShrink: 0 }} />
          )}
        </div>
      ))}
    </div>
  )
}
