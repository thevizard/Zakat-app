'use client'

import { useState } from 'react'
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
    maximumFractionDigits: 2,
  }).format(amount)
}

export function ZakatSummary({ result, nisabStandard, onReset, onBack, onEdit }: ZakatSummaryProps) {
  const [breakdownOpen, setBreakdownOpen] = useState(false)

  return (
    <div className="min-h-screen bg-[#68BA7F]/20 flex flex-col items-center justify-center px-6 py-12">
      <div className="w-full max-w-lg">

        {/* Header card */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 mb-4 text-center">
          {result.meetsNisab ? (
            <>
              <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#2d7a4f" strokeWidth="2">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
              </div>
              <p className="text-sm font-semibold text-gray-400 uppercase tracking-widest mb-1">Zakat Due</p>
              <p className="text-6xl font-bold text-gray-900 mb-1">{formatCurrency(result.zakatDue)}</p>
              <p className="text-sm text-gray-400">2.5% of your zakatable wealth</p>
            </>
          ) : (
            <>
              <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"/>
                  <line x1="12" y1="8" x2="12" y2="12"/>
                  <line x1="12" y1="16" x2="12.01" y2="16"/>
                </svg>
              </div>
              <p className="text-sm font-semibold text-gray-400 uppercase tracking-widest mb-1">No Zakat Due</p>
              <p className="text-3xl font-bold text-gray-900 mb-2">Below Nisab</p>
              <p className="text-sm text-gray-400 leading-relaxed">
                Your zakatable wealth of {formatCurrency(result.zakatableWealth)} is below
                the nisab threshold of {formatCurrency(result.nisabThreshold)}.
              </p>
            </>
          )}
        </div>

        {/* Assets breakdown card */}
        <div className="bg-white rounded-3xl shadow-2xl p-6 mb-4">

          {/* Collapsible header */}
          <button
            onClick={() => setBreakdownOpen(!breakdownOpen)}
            className="w-full flex items-center justify-between mb-4"
          >
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Assets Breakdown</p>
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-400">{breakdownOpen ? 'Hide' : 'Show'}</span>
              <svg
                width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2"
                className={`transition-transform duration-200 ${breakdownOpen ? 'rotate-180' : ''}`}
              >
                <polyline points="6 9 12 15 18 9"/>
              </svg>
            </div>
          </button>

          {/* Expanded breakdown */}
          {breakdownOpen && result.breakdown.length > 0 && (
            <div className="mb-4 border border-gray-100 rounded-2xl overflow-hidden">
              {/* Header row */}
              <div className="flex items-center px-4 py-2 bg-gray-50 border-b border-gray-100">
  <span className="text-xs font-bold text-gray-400 uppercase tracking-widest w-36">Asset</span>
  <span className="text-xs font-bold text-gray-400 uppercase tracking-widest flex-1 text-right">Entered</span>
  <span className="text-xs font-bold text-gray-400 uppercase tracking-widest w-28 text-right">Zakatable</span>
  <span className="text-xs font-bold text-[#2d7a4f] uppercase tracking-widest w-24 text-right">Zakat</span>
</div>

              {result.breakdown.map((item, index) => (
                <div key={index} className="flex items-center px-4 py-3 border-b border-gray-50 hover:bg-gray-50 transition-colors">
  <button
    onClick={() => onEdit(item.stepName)}
    className="w-36 text-left group flex items-center gap-1"
  >
    <span className="text-sm text-[#2d7a4f] font-medium group-hover:underline">{item.label}</span>
    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#2d7a4f" strokeWidth="2" className="opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
    </svg>
  </button>
  <span className="text-sm text-gray-500 flex-1 text-right">{formatCurrency(item.entered)}</span>
  <span className="text-sm font-medium text-gray-800 w-28 text-right">{formatCurrency(item.zakatable)}</span>
  <span className="text-sm font-semibold text-[#2d7a4f] w-24 text-right">{formatCurrency(item.zakatDue)}</span>
</div>
              ))}
            </div>
          )}

          {breakdownOpen && result.breakdown.length === 0 && (
            <p className="text-sm text-gray-400 mb-4">No assets entered.</p>
          )}

          {/* Summary totals always visible */}
          <div className="space-y-2">
            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-sm font-bold text-gray-900">Total Assets</span>
              <span className="text-sm font-bold text-gray-900">{formatCurrency(result.totalAssets)}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-sm text-gray-600">Total Liabilities</span>
              <span className="text-sm font-semibold text-red-500">− {formatCurrency(result.totalLiabilities)}</span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-sm font-bold text-gray-900">Zakatable Wealth</span>
              <span className="text-sm font-bold text-gray-900">{formatCurrency(result.zakatableWealth)}</span>
            </div>
          </div>
        </div>

        {/* Nisab info */}
        <div className="bg-white rounded-2xl shadow-md p-4 mb-4 flex justify-between items-center">
          <span className="text-sm text-gray-500">Nisab threshold ({nisabStandard === 'gold' ? 'Gold' : 'Silver'})</span>
          <span className="text-sm font-semibold text-gray-700">{formatCurrency(result.nisabThreshold)}</span>
        </div>

        {/* Disclaimer */}
        <div className="bg-yellow-50 border border-yellow-100 rounded-2xl p-4 mb-6">
          <p className="text-xs text-yellow-700 leading-relaxed">
            <span className="font-bold">Note:</span> This is an estimate. Please consult a qualified Islamic scholar for your specific situation.
          </p>
        </div>

        {/* Buttons */}
        <div className="flex gap-3">
          <button
            onClick={onBack}
            className="flex-1 bg-white text-gray-900 py-4 rounded-2xl text-base font-semibold hover:bg-gray-50 transition-colors shadow-lg"
          >
            ← Back
          </button>
          <button
            onClick={onReset}
            className="flex-1 bg-white text-gray-900 py-4 rounded-2xl text-base font-semibold hover:bg-gray-50 transition-colors shadow-lg"
          >
            Recalculate
          </button>
          <button
            className="flex-1 bg-black text-white py-4 rounded-2xl text-base font-semibold hover:bg-gray-800 transition-colors shadow-lg"
          >
            Donate →
          </button>
        </div>

      </div>
    </div>
  )
}
