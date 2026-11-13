import { useCalculatorStore } from '@/store/calculatorStore'
import { calculateZakat } from '@/lib/zakat/calculate'
import { useNisab } from '@/hooks/useNisab'
import { NisabStandard } from '@/types/zakat.types'

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
  const retirementRate = store.retirementRate

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
  const currentStepName = steps[store.currentStep - 1] ?? 'cash'

  function computeResult(standard: NisabStandard = store.nisabStandard) {
    if (!nisabData) return null
    return calculateZakat(
      store.assets,
      nisabData,
      standard,
      passiveInvestmentRate,
      retirementRate
    )
  }

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
    const result = computeResult()
    if (!result) return
    store.setResult(result)
    store.setIsEditing(false)
    store.setHasCompletedOnce(true)
    store.addVisitedStep('results')
    store.setStep(totalSteps)
  }

  function skipToEnd() {
    calculate()
  }

  function goToStep(stepName: string, fromSummaryEdit: boolean = false) {
    const index = steps.indexOf(stepName as Step)
    if (index !== -1) {
      if (stepName === 'results') {
        const result = computeResult()
        if (result) store.setResult(result)
        store.setIsEditing(false)
      } else if (fromSummaryEdit) {
        store.setIsEditing(true)
      }
      store.setStep(index + 1)
    }
  }

  function editFromSummary(stepName: string) {
    goToStep(stepName, true)
  }

  function backToSummary() {
    const result = computeResult()
    if (!result) return
    store.setResult(result)
    store.setIsEditing(false)
    store.setStep(totalSteps)
  }

  function changeNisabStandard(standard: NisabStandard) {
    store.setNisabStandard(standard)
    if (nisabData && (store.result || currentStepName === 'results')) {
      const updated = calculateZakat(
        store.assets,
        nisabData,
        standard,
        passiveInvestmentRate,
        retirementRate
      )
      store.setResult(updated)
    }
  }

  return {
    currentStep: store.currentStep,
    currentStepName,
    totalSteps,
    steps,
    assets: store.assets,
    metalMeta: store.metalMeta,
    lineItems: store.lineItems,
    result: store.result,
    nisabData,
    madhhab: store.madhhab,
    setMadhhab: store.setMadhhab,
    includeWornJewelry: store.includeWornJewelry,
    setIncludeWornJewelry: store.setIncludeWornJewelry,
    nisabStandard: store.nisabStandard,
    passiveInvestmentRate,
    setPassiveInvestmentRate: store.setPassiveInvestmentRate,
    retirementRate,
    setRetirementRate: store.setRetirementRate,
    selectedInvestments: store.selectedInvestments,
    isEditing: store.isEditing,
    hasCompletedOnce: store.hasCompletedOnce,
    visitedSteps: store.visitedSteps,
    skipIntro: store.skipIntro,
    setSkipIntro: store.setSkipIntro,
    isLoading,
    isError,
    nextStep,
    prevStep,
    calculate,
    skipToEnd,
    goToStep,
    editFromSummary,
    backToSummary,
    updateAssets: store.updateAssets,
    setMetalMeta: store.setMetalMeta,
    setLineItems: store.setLineItems,
    setNisabStandard: changeNisabStandard,
    setSelectedInvestments: store.setSelectedInvestments,
    reset: store.reset,
  }
}
