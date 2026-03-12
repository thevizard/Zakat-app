import { create } from 'zustand'
import { AssetInputs, NisabData, NisabStandard, ZakatResult, InvestmentType } from '@/types/zakat.types'

interface CalculatorState {
  currentStep: number
  nisabStandard: NisabStandard
  assets: AssetInputs
  nisabData: NisabData | null
  result: ZakatResult | null
  selectedInvestments: InvestmentType[]
  setStep: (step: number) => void
  setNisabStandard: (standard: NisabStandard) => void
  updateAssets: (updates: Partial<AssetInputs>) => void
  setNisabData: (data: NisabData) => void
  setResult: (result: ZakatResult) => void
  setSelectedInvestments: (types: InvestmentType[]) => void
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
  assets: defaultAssets,
  nisabData: null,
  result: null,
  selectedInvestments: [],
  setStep: (step) => set({ currentStep: step }),
  setNisabStandard: (standard) => set({ nisabStandard: standard }),
  updateAssets: (updates) =>
    set((state) => ({ assets: { ...state.assets, ...updates } })),
  setNisabData: (data) => set({ nisabData: data }),
  setResult: (result) => set({ result }),
  setSelectedInvestments: (types) => set({ selectedInvestments: types }),
  reset: () => set({
    currentStep: 1,
    assets: defaultAssets,
    result: null,
    selectedInvestments: [],
  }),
}))