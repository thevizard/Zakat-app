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
  const isResults = currentStepName === 'results'

  function getStatus(stepId: string) {
    if (stepId === currentStepName) return 'active'
    if (visitedSteps.includes(stepId)) return 'visited'
    if (hasCompletedOnce) return 'available'
    return 'locked'
  }

  const navBg = isResults
    ? 'rgba(255,255,255,0.25)'
    : '#68BA7F'

  const navBorder = isResults
    ? '1px solid rgba(255,255,255,0.4)'
    : 'none'

  const labelColor = isResults ? '#0f2419' : 'white'
  const activeLabelColor = '#1a3a2a'
  const progressTrackBg = isResults ? 'rgba(255,255,255,0.3)' : '#d4edda'
  const progressText = isResults ? '#1a3a2a' : '#fff'

  return (
   <div
      className="w-64 flex flex-col shrink-0"
      style={{
        background: navBg,
        backdropFilter: isResults ? 'blur(16px)' : undefined,
        WebkitBackdropFilter: isResults ? 'blur(16px)' : undefined,
        borderRight: navBorder,
        transition: 'all 0.4s ease',
        margin: isResults ? '16px 0 16px 16px' : undefined,
        borderRadius: isResults ? 20 : undefined,
        height: isResults ? 'calc(100vh - 32px)' : undefined,
        position: isResults ? 'sticky' : undefined,
        top: isResults ? 16 : undefined,
        overflowY: isResults ? 'auto' : undefined,
      }}
    >
      {/* Steps */}
      <div className="flex-1 flex flex-col justify-start py-4">
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
                ${!isClickable ? 'opacity-60 cursor-default' : 'cursor-pointer'}
              `}
              style={{
                borderLeft: isActive ? '3px solid #1a3a2a' : '3px solid transparent',
                background: isActive
                  ? isResults ? 'rgba(255,255,255,0.55)' : '#f0faf4'
                  : 'transparent',
              }}
              onMouseEnter={e => { if (isClickable && !isActive) e.currentTarget.style.background = isResults ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.25)' }}
              onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = 'transparent' }}
            >
              {/* Label */}
              <span style={{
                flex: 1,
                fontSize: meta.sub ? '0.95rem' : '1.05rem',
                fontWeight: isActive ? 600 : 400,
                color: isActive ? activeLabelColor : labelColor,
                fontFamily: 'Open Sans, sans-serif',
              }}>
                {meta.label}
              </span>

              {/* Status indicator */}
              {status === 'locked' && (
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={isResults ? '#888' : '#ccc'} strokeWidth="2">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                </svg>
              )}
              {status === 'visited' && !isActive && (
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={isResults ? '#2d7a4f' : '#d4f7e0'} strokeWidth="3">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
              )}
            </button>
          )
        })}
      </div>

      {/* Progress */}
      <div className="px-6 py-5" style={{ borderTop: isResults ? '1px solid rgba(255,255,255,0.3)' : '1px solid rgba(255,255,255,0.2)' }}>
        <div className="flex justify-between items-center mb-2">
          <span style={{ fontSize: 12, color: progressText, fontFamily: 'Open Sans, sans-serif' }}>Progress</span>
          <span style={{ fontSize: 12, fontWeight: 600, color: progressText, fontFamily: 'Open Sans, sans-serif' }}>
            {Math.round((visitedSteps.length / steps.length) * 100)}%
          </span>
        </div>
        <div style={{ height: 6, width: '100%', background: progressTrackBg, borderRadius: 4, overflow: 'hidden' }}>
          <div
            style={{
              height: '100%',
              width: `${(visitedSteps.length / steps.length) * 100}%`,
              background: '#2d7a4f',
              borderRadius: 4,
              transition: 'width 0.5s ease',
            }}
          />
        </div>
      </div>
    </div>
  )
}
