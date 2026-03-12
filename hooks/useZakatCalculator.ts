import { useCalculatorStore } from "@/store/calculatorStore";
import { calculateZakat } from "@/lib/zakat/calculate";
import { useNisab } from "@/hooks/useNisab";
import { InvestmentType } from "@/types/zakat.types";

export function useZakatCalculator() {
  const store = useCalculatorStore();
  const { data: nisabData, isLoading, isError } = useNisab();

  const totalSteps = 6;

  function nextStep() {
    if (store.currentStep < totalSteps) {
      store.setStep(store.currentStep + 1);
    }
  }

  function prevStep() {
    if (store.currentStep > 1) {
      store.setStep(store.currentStep - 1);
    }
  }

  function calculate() {
    if (!nisabData) return;
    const result = calculateZakat(store.assets, nisabData, store.nisabStandard);
    store.setResult(result);
    store.setStep(totalSteps);
  }

  function setSelectedInvestments(types: InvestmentType[]) {
    store.setSelectedInvestments(types);
  }

  return {
    currentStep: store.currentStep,
    totalSteps,
    assets: store.assets,
    result: store.result,
    nisabData,
    nisabStandard: store.nisabStandard,
    selectedInvestments: store.selectedInvestments,
    isLoading,
    isError,
    nextStep,
    prevStep,
    calculate,
    updateAssets: store.updateAssets,
    setNisabStandard: store.setNisabStandard,
    setSelectedInvestments,
    reset: store.reset,
  };
}
