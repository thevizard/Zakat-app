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

  return (
    <div className="w-full max-w-lg mx-auto mt-4">
      <div className="bg-white rounded-2xl shadow-md border border-gray-100 px-6 py-4 flex items-center justify-between gap-4">

        {/* Total Assets */}
        <div className="flex-1 text-center">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-1">
            Total Assets
          </p>
          <p className={`text-xl font-bold transition-all duration-300 ${hasAssets ? 'text-gray-900' : 'text-gray-300'}`}>
            {formatCurrency(result.totalAssets)}
          </p>
        </div>

        {/* Divider */}
        <div className="w-px h-10 bg-gray-100" />

        {/* Zakatable Wealth */}
        <div className="flex-1 text-center">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-1">
            Zakatable
          </p>
          <p className={`text-xl font-bold transition-all duration-300 ${hasAssets ? 'text-gray-900' : 'text-gray-300'}`}>
            {formatCurrency(result.zakatableWealth)}
          </p>
        </div>

        {/* Divider */}
        <div className="w-px h-10 bg-gray-100" />

        {/* Zakat Due */}
        <div className="flex-1 text-center">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-1">
            Zakat Due
          </p>
          <p className={`text-xl font-bold transition-all duration-300 ${
            result.meetsNisab ? 'text-[#2d7a4f]' : result.zakatableWealth > 0 ? 'text-orange-400' : 'text-gray-300'
          }`}>
            {result.meetsNisab ? formatCurrency(result.zakatDue) : result.zakatableWealth > 0 ? 'Below Nisab' : '$0'}
          </p>
        </div>

      </div>
      {result.zakatableWealth > 0 && !result.meetsNisab && (
        <p className="text-xs text-center text-gray-400 mt-2">
          Nisab threshold: {formatCurrency(result.nisabThreshold)} — need {formatCurrency(result.nisabThreshold - result.zakatableWealth)} more
        </p>
      )}
    </div>
  )
}