'use client'

const GROUPS = [
  { id: 'cash', label: 'Cash & Bank', steps: ['cash'] },
  { id: 'goldsilver', label: 'Gold & Silver', steps: ['goldsilver'] },
  { id: 'investments', label: 'Investments', steps: ['investment-selector', 'stocks', 'crypto', 'retirement', 'property', 'business'] },
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
    <div style={{ background: 'white', borderBottom: '1px solid #e8f5ed' }}>
      {/* Thin progress bar */}
      <div style={{ height: 3, background: '#e8f5ed' }}>
        <div style={{ height: '100%', width: `${progress}%`, background: '#2d7a4f', transition: 'width 0.5s ease' }} />
      </div>

      {/* Step dots */}
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '0 32px', overflowX: 'auto' }}>
        {GROUPS.map((group, i) => {
          const isActive = group.steps.includes(currentStepName)
          const isVisited = !isActive && group.steps.some(s => visitedSteps.includes(s))
          const isClickable = isVisited

          return (
            <div key={group.id} style={{ display: 'flex', alignItems: 'center' }}>
              <button
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
                  width: 30, height: 30, borderRadius: '50%',
                  background: isActive ? '#2d7a4f' : isVisited ? '#e8f5ed' : '#f4f4f4',
                  border: isActive ? 'none' : isVisited ? '2px solid #2d7a4f' : '2px solid #e0e0e0',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 12, fontWeight: 700,
                  color: isActive ? 'white' : isVisited ? '#2d7a4f' : '#ccc',
                  transition: 'all 0.3s',
                  flexShrink: 0,
                }}>
                  {isVisited ? '✓' : i + 1}
                </div>
                <span className="trail-label" style={{
                  fontWeight: isActive ? 600 : 400,
                  color: isActive ? '#0f2419' : isVisited ? '#2d7a4f' : '#bbb',
                  fontFamily: 'Open Sans, sans-serif', whiteSpace: 'nowrap',
                  letterSpacing: 0.2,
                }}>
                  {group.label}
                </span>
              </button>

              {i < GROUPS.length - 1 && (
                <div className="trail-connector" style={{
                  height: 1.5, borderRadius: 2,
                  background: isVisited ? '#2d7a4f' : '#e8e8e8',
                  transition: 'background 0.3s',
                  flexShrink: 0,
                  marginBottom: 18, // align with dot center
                }} />
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
