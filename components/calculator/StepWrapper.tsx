'use client'

import { useEffect } from 'react'

interface StepWrapperProps {
  currentStep: number
  totalSteps: number
  title: string
  description?: React.ReactNode
  children: React.ReactNode
  onEnter?: () => void
  tracker?: React.ReactNode
}

export function StepWrapper({
  currentStep,
  totalSteps,
  title,
  description,
  children,
  onEnter,
  tracker,
}: StepWrapperProps) {
  const progress = (currentStep / totalSteps) * 100

  useEffect(() => {
    if (!onEnter) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Enter') onEnter()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onEnter])

  return (
    <div className="flex-1 flex flex-col bg-white overflow-y-auto">
      {/* Header bar */}
      {/* Header bar */}
      <div className="w-full bg-white px-8 py-4 shrink-0" >
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-8 py-10">
        <div className="w-full max-w-lg">
          <div className="bg-white rounded-3xl shadow-2xl p-8 step-enter">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">{title}</h1>
            {description && (
              <p className="text-lg text-gray-500 mb-8 leading-relaxed">{description}</p>
            )}
            <div>{children}</div>
          </div>
          {tracker && <div className="mt-4">{tracker}</div>}
        </div>
      </div>
    </div>
  )
}