import { create } from 'zustand'
import { AssetInputs, NisabData, NisabStandard, ZakatResult, InvestmentType } from '@/types/zakat.types'

interface CalculatorState {
  currentStep: number
  nisabStandard: NisabStandard
  passiveInvestmentRate: 0.3 | 1.0
  assets: AssetInputs
  nisabData: NisabData | null
  result: ZakatResult | null
  selectedInvestments: InvestmentType[]
  isEditing: boolean
  hasCompletedOnce: boolean
  visitedSteps: string[]
  setStep: (step: number) => void
  setNisabStandard: (standard: NisabStandard) => void
  setPassiveInvestmentRate: (rate: 0.3 | 1.0) => void
  updateAssets: (updates: Partial<AssetInputs>) => void
  setNisabData: (data: NisabData) => void
  setResult: (result: ZakatResult) => void
  setSelectedInvestments: (types: InvestmentType[]) => void
  setIsEditing: (val: boolean) => void
  setHasCompletedOnce: (val: boolean) => void
  addVisitedStep: (step: string) => void
  reset: () => void
}

const defaultAssets: AssetInputs = {
  cash: 0,
  gold: 0,
  silver: 0,
  stocks: 0,
  passiveStocks: 0,
  crypto: 0,
  retirementAccounts: 0,
  investmentProperty: 0,
  businessInventory: 0,
  moneyOwed: 0,
  otherAssets: 0,
  liabilities: 0,
}

export const useCalculatorStore = create<CalculatorState>((set) => ({
  currentStep: 1,
  nisabStandard: 'gold',
  passiveInvestmentRate: 0.3,
  assets: defaultAssets,
  nisabData: null,
  result: null,
  selectedInvestments: [],
  isEditing: false,
  hasCompletedOnce: false,
  visitedSteps: ['cash'],
  setStep: (step) => set({ currentStep: step }),
  setNisabStandard: (standard) => set({ nisabStandard: standard }),
  setPassiveInvestmentRate: (rate) => set({ passiveInvestmentRate: rate }),
  updateAssets: (updates) =>
    set((state) => ({ assets: { ...state.assets, ...updates } })),
  setNisabData: (data) => set({ nisabData: data }),
  setResult: (result) => set({ result }),
  setSelectedInvestments: (types) => set({ selectedInvestments: types }),
  setIsEditing: (val) => set({ isEditing: val }),
  setHasCompletedOnce: (val) => set({ hasCompletedOnce: val }),
  addVisitedStep: (step) => set((state) => ({
    visitedSteps: state.visitedSteps.includes(step)
      ? state.visitedSteps
      : [...state.visitedSteps, step],
  })),
  reset: () => set(() => ({
    currentStep: 1,
    passiveInvestmentRate: 0.3,
    assets: defaultAssets,
    result: null,
    selectedInvestments: [],
    isEditing: false,
    hasCompletedOnce: false,
    visitedSteps: ['cash'],
  })),
}))