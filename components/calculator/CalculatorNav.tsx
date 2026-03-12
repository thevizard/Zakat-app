'use client'

import { InvestmentType } from '@/types/zakat.types'

interface CalculatorNavProps {
  steps: string[]
  currentStepName: string
  visitedSteps: string[]
  hasCompletedOnce: boolean
  selectedInvestments: InvestmentType[]
  onGoToStep: (step: string) => void
}

const STEP_META: Record<string, { label: string; sub?: boolean }> = {
  cash: { label: 'Cash & Bank' },
  goldsilver: { label: 'Gold & Silver' },
  'investment-selector': { label: 'Investments' },
  stocks: { label: 'Shares & Stocks', sub: true },
  crypto: { label: 'Cryptocurrency', sub: true },
  retirement: { label: 'Retirement', sub: true },
  property: { label: 'Investment Property', sub: true },
  business: { label: 'Business Inventory', sub: true },
  receivables: { label: 'Money Owed to You' },
debts: { label: 'Liabilities' },
  results: { label: 'Your Zakat' },
}

export function CalculatorNav({
  steps,
  currentStepName,
  visitedSteps,
  hasCompletedOnce,
  onGoToStep,
}: CalculatorNavProps) {
  function getStatus(stepId: string) {
    if (stepId === currentStepName) return 'active'
    if (visitedSteps.includes(stepId)) return 'visited'
    if (hasCompletedOnce) return 'available'
    return 'locked'
  }

  return (
    <div className="w-64 flex flex-col shrink-0" style={{ background: '#1a3a2a' }}>
      {/* Logo */}
      <div className="px-6 py-7 border-b border-white/10">
        <div className="text-xl font-bold text-white">Zakatly</div>
        <div className="text-xs text-white/40 mt-0.5">2025 Calculator</div>
      </div>

      {/* Steps — centered vertically */}
      <div className="flex-1 flex flex-col justify-center py-6">
        {steps.map((stepId) => {
          const meta = STEP_META[stepId]
          if (!meta) return null
          const status = getStatus(stepId)
          const isActive = stepId === currentStepName
          const isClickable = status !== 'locked'

          return (
            <button
              key={stepId}
              onClick={() => isClickable && onGoToStep(stepId)}
              disabled={!isClickable}
              className={`w-full flex items-center gap-3 text-left transition-all duration-150
                ${meta.sub ? 'pl-12 pr-5 py-2.5' : 'px-5 py-3'}
                ${isActive ? 'bg-white/10 border-l-[3px] border-[#68BA7F]' : 'border-l-[3px] border-transparent'}
                ${!isClickable ? 'opacity-30 cursor-default' : 'cursor-pointer hover:bg-white/5'}
                ${stepId === 'results' && !isActive ? 'bg-[#68BA7F]/20' : ''}
              `}
            >
              {/* Dot */}
              <div className={`rounded-full shrink-0 transition-all
                ${meta.sub ? 'w-1.5 h-1.5' : 'w-2.5 h-2.5'}
                ${isActive ? 'bg-[#68BA7F]' : status === 'visited' ? 'bg-[#68BA7F]/70' : 'bg-white/20'}
              `} />

              {/* Label */}
              <span className={`flex-1 transition-all
${meta.sub ? 'text-base' : 'text-lg'}
                ${isActive ? 'font-semibold text-white' : status === 'visited' ? 'font-normal text-white/70' : 'font-normal text-white/40'}
              `}>
                {meta.label}
              </span>

              {/* Status indicator */}
              {status === 'locked' && (
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="2">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                </svg>
              )}
              {status === 'visited' && !isActive && (
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#68BA7F" strokeWidth="3">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
              )}
            </button>
          )
        })}
      </div>

      {/* Progress */}
      <div className="px-6 py-5 border-t border-white/10">
        <div className="flex justify-between items-center mb-2">
          <span className="text-xs text-white/40">Progress</span>
          <span className="text-xs font-semibold text-white/60">
            {Math.round((visitedSteps.length / steps.length) * 100)}%
          </span>
        </div>
        <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
          <div
            className="h-1.5 bg-[#68BA7F] rounded-full transition-all duration-500"
            style={{ width: `${(visitedSteps.length / steps.length) * 100}%` }}
          />
        </div>
      </div>
    </div>
  )
}
