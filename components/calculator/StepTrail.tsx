'use client'

const GROUPS = [
  { id: 'cash', label: 'Cash & Bank', steps: ['cash'] },
  { id: 'goldsilver', label: 'Gold & Silver', steps: ['goldsilver'] },
  { id: 'investments', label: 'Investments', steps: ['investment-selector', 'stocks', 'crypto', 'retirement', 'business'] },
  { id: 'receivables', label: 'Money Owed', steps: ['receivables'] },
  { id: 'debts', label: 'Liabilities', steps: ['debts'] },
]

interface StepTrailProps {
  currentStepName: string
  visitedSteps: string[]
  onGoToStep: (step: string) => void
}

export function StepTrail({ currentStepName, visitedSteps, onGoToStep }: StepTrailProps) {
  const currentGroupIndex = GROUPS.findIndex(g => g.steps.includes(currentStepName))
  const progress = currentGroupIndex <= 0 ? 0 : (currentGroupIndex / GROUPS.length) * 100

  return (
    <div style={{ background: '#FFFFFF', borderBottom: '1px solid #E2E2D8' }}>
      {/* Thin progress bar */}
      <div style={{ height: 2, background: '#EAEAE2' }}>
        <div style={{ height: '100%', width: `${progress}%`, background: '#1E3F20', transition: 'width 0.4s ease' }} />
      </div>

      {/* Step dots */}
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '0 24px', overflowX: 'auto' }}>
        {GROUPS.map((group, i) => {
          const isActive = group.steps.includes(currentStepName)
          const isVisited = !isActive && group.steps.some(s => visitedSteps.includes(s))
          const isClickable = isVisited

          return (
            <div key={group.id} style={{ display: 'flex', alignItems: 'center' }}>
              <button
                type="button"
                onClick={() => isClickable && onGoToStep(group.steps[0])}
                disabled={!isClickable && !isActive}
                className="trail-dot-btn"
                style={{
                  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
                  background: 'none', border: 'none',
                  cursor: isClickable ? 'pointer' : 'default',
                }}
              >
                <div style={{
                  width: 28, height: 28, borderRadius: 6,
                  background: isActive ? '#1E3F20' : isVisited ? '#EBEBE5' : '#F5F5F0',
                  border: isActive ? 'none' : isVisited ? '1px solid #1E3F20' : '1px solid #DCDCD4',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 11, fontWeight: 700,
                  color: isActive ? '#FFFFFF' : isVisited ? '#1E3F20' : '#8A8A8A',
                  transition: 'all 0.2s',
                  flexShrink: 0,
                }}>
                  {isVisited ? (
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  ) : (
                    i + 1
                  )}
                </div>
                <span className="trail-label" style={{
                  fontWeight: isActive ? 700 : 500,
                  color: isActive ? '#141414' : isVisited ? '#1E3F20' : '#8A8A8A',
                  whiteSpace: 'nowrap',
                  letterSpacing: -0.2,
                }}>
                  {group.label}
                </span>
              </button>

              {i < GROUPS.length - 1 && (
                <div className="trail-connector" style={{
                  height: 1,
                  background: isVisited ? '#1E3F20' : '#E2E2D8',
                  transition: 'background 0.3s',
                  flexShrink: 0,
                  marginBottom: 16,
                }} />
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
