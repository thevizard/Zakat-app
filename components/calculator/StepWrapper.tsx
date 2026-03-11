'use client'

import { Progress } from '@/components/ui/progress'

interface StepWrapperProps {
  currentStep: number
  totalSteps: number
  title: string
  description: string
  children: React.ReactNode
}

export function StepWrapper({
  currentStep,
  totalSteps,
  title,
  description,
  children,
}: StepWrapperProps) {
  const progress = (currentStep / totalSteps) * 100

  return (
    <div className="max-w-xl mx-auto px-4 py-10">
      <div className="mb-6">
        <div className="flex justify-between text-sm text-muted-foreground mb-2">
          <span>Step {currentStep} of {totalSteps}</span>
          <span>{Math.round(progress)}% complete</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>
      <h1 className="text-2xl font-bold mb-1">{title}</h1>
      <p className="text-muted-foreground mb-8">{description}</p>
      {children}
    </div>
  )
}