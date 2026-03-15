import { useCalculatorStore } from '@/store/calculatorStore'
import { calculateZakat } from '@/lib/zakat/calculate'
import { useNisab } from '@/hooks/useNisab'
import { InvestmentType } from '@/types/zakat.types'

type Step =
  | 'cash'
  | 'goldsilver'
  | 'investment-selector'
  | 'stocks'
  | 'crypto'
  | 'retirement'
  | 'property'
  | 'business'
  | 'receivables'
  | 'debts'
  | 'results'

export function useZakatCalculator() {
  const store = useCalculatorStore()
  const { data: nisabData, isLoading, isError } = useNisab()
  const passiveInvestmentRate = store.passiveInvestmentRate

  const steps: Step[] = [
  'cash',
  'goldsilver',
  'investment-selector',
  ...store.selectedInvestments.map((i) => i as Step),
  'receivables',
  'debts',
  'results',
]

  const totalSteps = steps.length
  const currentStepName = steps[store.currentStep - 1]

  function nextStep() {
    if (store.currentStep < totalSteps) {
      const nextStepName = steps[store.currentStep]
      store.addVisitedStep(nextStepName)
      store.setStep(store.currentStep + 1)
    }
  }

  function prevStep() {
    if (store.currentStep > 1) {
      store.setStep(store.currentStep - 1)
    }
  }

  function calculate() {
    if (!nisabData) return
    const result = calculateZakat(store.assets, nisabData, store.nisabStandard, passiveInvestmentRate)
    store.setResult(result)
    store.setIsEditing(false)
    store.setHasCompletedOnce(true)
    store.addVisitedStep('results')
    store.setStep(totalSteps)
  }

  function skipToEnd() {
    if (!nisabData) return
    const result = calculateZakat(store.assets, nisabData, store.nisabStandard, passiveInvestmentRate)
    store.setResult(result)
    store.setIsEditing(false)
    store.setHasCompletedOnce(true)
    store.addVisitedStep('results')
    store.setStep(totalSteps)
  }

  function goToStep(stepName: string) {
    const index = steps.indexOf(stepName as Step)
    if (index !== -1) {
      if (stepName === 'results' && nisabData) {
        const result = calculateZakat(store.assets, nisabData, store.nisabStandard, passiveInvestmentRate)
        store.setResult(result)
      }
      store.setStep(index + 1)
    }
  }

  function backToSummary() {
    if (!nisabData) return
    const result = calculateZakat(store.assets, nisabData, store.nisabStandard, passiveInvestmentRate)
    store.setResult(result)
    store.setIsEditing(false)
    store.setStep(totalSteps)
  }

  return {
    currentStep: store.currentStep,
    currentStepName,
    totalSteps,
    steps,
    assets: store.assets,
    result: store.result,
    nisabData,
    nisabStandard: store.nisabStandard,
    passiveInvestmentRate,
    setPassiveInvestmentRate: store.setPassiveInvestmentRate,
    selectedInvestments: store.selectedInvestments,
    isEditing: store.isEditing,
    hasCompletedOnce: store.hasCompletedOnce,
    visitedSteps: store.visitedSteps,
    isLoading,
    isError,
    nextStep,
    prevStep,
    calculate,
    skipToEnd,
    goToStep,
    backToSummary,
    updateAssets: store.updateAssets,
    setNisabStandard: store.setNisabStandard,
    setSelectedInvestments: store.setSelectedInvestments,
    reset: store.reset,
  }
}