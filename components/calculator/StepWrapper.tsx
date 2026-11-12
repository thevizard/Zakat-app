'use client'

import { useEffect } from 'react'

interface StepWrapperProps {
  currentStep: number
  totalSteps: number
  title: string
  description?: React.ReactNode
  children: React.ReactNode
  onEnter?: () => void
}

export function StepWrapper({
  children,
  title,
  description,
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
      className="flex-1 flex flex-col overflow-y-auto"
      style={{ background: '#F5F5F0' }}
    >
      <div
        className="flex-1 flex flex-col items-center justify-center px-6"
        style={{ padding: '48px 24px' }}
      >
        <div
          className="w-full step-enter step-card"
          style={{
            maxWidth: 680,
            background: '#FFFFFF',
            borderRadius: 14,
            border: '1px solid #E2E2D8',
            borderLeft: '4px solid #1E3F20',
            boxShadow: '0 4px 24px rgba(20, 20, 20, 0.04)',
          }}
        >
          <h1
            style={{
              fontSize: 'clamp(1.35rem, 3.5vw, 1.85rem)',
              fontWeight: 800,
              color: '#141414',
              marginBottom: 8,
              letterSpacing: '-0.5px',
              lineHeight: 1.2,
            }}
          >
            {title}
          </h1>
          {description && (
            <p
              style={{
                fontSize: '0.95rem',
                color: '#6E6E6E',
                marginBottom: 28,
                lineHeight: 1.6,
              }}
            >
              {description}
            </p>
          )}
          <div>{children}</div>
        </div>
      </div>
    </div>
  )
}
