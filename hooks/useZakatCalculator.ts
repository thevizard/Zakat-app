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
  | 'debts'
  | 'results'

export function useZakatCalculator() {
  const store = useCalculatorStore()
  const { data: nisabData, isLoading, isError } = useNisab()

  const steps: Step[] = [
    'cash',
    'goldsilver',
    'investment-selector',
    ...store.selectedInvestments.map((i) => i as Step),
    'debts',
    'results',
  ]

  const totalSteps = steps.length
  const currentStepName = steps[store.currentStep - 1]

  function nextStep() {
    if (store.currentStep < totalSteps) {
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
  const result = calculateZakat(store.assets, nisabData, store.nisabStandard)
  store.setResult(result)
  store.setIsEditing(false)
  store.setHasCompletedOnce(true)
  store.setStep(totalSteps)
}

function skipToEnd() {
  if (!nisabData) return
  const result = calculateZakat(store.assets, nisabData, store.nisabStandard)
  store.setResult(result)
  store.setIsEditing(false)
  store.setHasCompletedOnce(true)
  store.setStep(totalSteps)
}

  function goToStep(stepName: string) {
    const index = steps.indexOf(stepName as Step)
    if (index !== -1) {
      store.setStep(index + 1)
    }
  }

  function backToSummary() {
    if (!nisabData) return
    const result = calculateZakat(store.assets, nisabData, store.nisabStandard)
    store.setResult(result)
    store.setIsEditing(false)
    store.setStep(totalSteps)
  }

  return {
    currentStep: store.currentStep,
    currentStepName,
    totalSteps,
    assets: store.assets,
    result: store.result,
    nisabData,
    nisabStandard: store.nisabStandard,
    selectedInvestments: store.selectedInvestments,
    isEditing: store.isEditing,
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
    hasCompletedOnce: store.hasCompletedOnce,
  }
}