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
      color: '#0f2419',
    },
    {
      label: 'Zakatable Wealth',
      value: formatCurrency(result.zakatableWealth),
      active: result.zakatableWealth > 0,
      color: '#0f2419',
    },
    {
      label: 'Zakat Due',
      value: result.meetsNisab
        ? formatCurrency(result.zakatDue)
        : result.zakatableWealth > 0
        ? 'Below Nisab'
        : '$0',
      active: result.meetsNisab,
      color: result.meetsNisab ? '#2d7a4f' : result.zakatableWealth > 0 ? '#c07a00' : '#0f2419',
    },
  ]

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 0,
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
                color: '#999',
                textTransform: 'uppercase',
                letterSpacing: 1,
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
                color: stat.active ? stat.color : '#ccc',
                fontFamily: 'Open Sans, sans-serif',
                transition: 'color 0.3s',
              }}
            >
              {stat.value}
            </div>
          </div>
          {i < stats.length - 1 && (
            <div style={{ width: 1, height: 32, background: '#e8f5ed', flexShrink: 0 }} />
          )}
        </div>
      ))}
    </div>
  )
}
