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
      if (e.key === 'Enter') onEnter()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onEnter])

  return (
    <div
      className="flex-1 flex flex-col overflow-y-auto"
      style={{ background: '#f7fdf9' }}
    >
      <div
        className="flex-1 flex flex-col items-center justify-center px-6"
        style={{ padding: '48px 24px' }}
      >
        <div
          className="w-full step-enter step-card"
          style={{
            maxWidth: 680,
            background: 'white',
            borderRadius: 24,
            borderLeft: '4px solid #2d7a4f',
            border: '1px solid #e0f0e8',
            borderLeftWidth: 4,
            borderLeftColor: '#2d7a4f',
            boxShadow: '0 4px 32px rgba(45, 122, 79, 0.07)',
          }}
        >
          <h1
            style={{
              fontSize: 'clamp(1.4rem, 4vw, 2rem)',
              fontWeight: 700,
              color: '#0f2419',
              marginBottom: 8,
              fontFamily: 'Open Sans, sans-serif',
              lineHeight: 1.2,
            }}
          >
            {title}
          </h1>
          {description && (
            <p
              style={{
                fontSize: '1rem',
                color: '#666',
                marginBottom: 32,
                lineHeight: 1.6,
                fontFamily: 'Open Sans, sans-serif',
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
