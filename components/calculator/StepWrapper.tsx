'use client'

import { useEffect } from 'react'

interface StepWrapperProps {
  currentStep: number
  totalSteps: number
  title: string
  description?: React.ReactNode
  headerBadge?: React.ReactNode
  children: React.ReactNode
  onEnter?: () => void
}

export function StepWrapper({
  children,
  title,
  description,
  headerBadge,
  onEnter,
}: StepWrapperProps) {
  useEffect(() => {
    if (!onEnter) return
    const handler = (e: KeyboardEvent) => {
      if (e.key !== 'Enter') return
      const target = e.target as HTMLElement | null
      if (
        target &&
        (target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.tagName === 'BUTTON' ||
          target.tagName === 'SELECT')
      ) {
        return
      }
      onEnter()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onEnter])

  return (
    <div
      className="w-full step-enter"
      style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: 'clamp(24px, 4.5vw, 44px)',
        background: '#FFFFFF',
      }}
    >
      <div>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            gap: 12,
            flexWrap: 'wrap',
            marginBottom: 28,
          }}
        >
          <div>
            <h1
              style={{
                fontSize: 'clamp(1.45rem, 3.2vw, 1.85rem)',
                fontWeight: 800,
                color: '#121614',
                margin: '0 0 6px',
                letterSpacing: '-0.6px',
                lineHeight: 1.2,
              }}
            >
              {title}
            </h1>
            {description && (
              <p
                style={{
                  fontSize: '0.95rem',
                  color: '#5A625D',
                  margin: 0,
                  lineHeight: 1.6,
                }}
              >
                {description}
              </p>
            )}
          </div>
          {headerBadge && <div>{headerBadge}</div>}
        </div>
        <div>{children}</div>
      </div>
    </div>
  )
}
