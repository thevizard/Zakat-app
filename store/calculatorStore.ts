import { create } from 'zustand'
import {
  AssetInputs,
  NisabData,
  NisabStandard,
  Madhhab,
  ZakatResult,
  InvestmentType,
  PassiveStockRate,
  RetirementMethodRate,
  MetalInputMeta,
  LineItem,
} from '@/types/zakat.types'
import { MosquePartner } from '@/types/masjid.types'
import { LogoVariant } from '@/components/ZakatlyLogo'

interface CalculatorState {
  currentStep: number
  madhhab: Madhhab
  includeWornJewelry: boolean
  nisabStandard: NisabStandard
  passiveInvestmentRate: PassiveStockRate
  retirementRate: RetirementMethodRate
  assets: AssetInputs
  metalMeta: {
    gold: MetalInputMeta
    silver: MetalInputMeta
  }
  lineItems: Record<string, LineItem[]>
  nisabData: NisabData | null
  result: ZakatResult | null
  selectedInvestments: InvestmentType[]
  isEditing: boolean
  hasCompletedOnce: boolean
  visitedSteps: string[]
  skipIntro: boolean
  partnerMasjid: MosquePartner | null
  logoVariant: LogoVariant
  setLogoVariant: (variant: LogoVariant) => void
  setStep: (step: number) => void
  setMadhhab: (madhhab: Madhhab) => void
  setIncludeWornJewelry: (val: boolean) => void
  setNisabStandard: (standard: NisabStandard) => void
  setPassiveInvestmentRate: (rate: PassiveStockRate) => void
  setRetirementRate: (rate: RetirementMethodRate) => void
  updateAssets: (updates: Partial<AssetInputs>) => void
  setMetalMeta: (metal: 'gold' | 'silver', meta: Partial<MetalInputMeta>) => void
  setLineItems: (fieldId: string, items: LineItem[]) => void
  setNisabData: (data: NisabData) => void
  setResult: (result: ZakatResult) => void
  setSelectedInvestments: (types: InvestmentType[]) => void
  setIsEditing: (val: boolean) => void
  setHasCompletedOnce: (val: boolean) => void
  addVisitedStep: (step: string) => void
  setSkipIntro: (val: boolean) => void
  setPartnerMasjid: (masjid: MosquePartner | null) => void
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

const defaultMetalMeta: { gold: MetalInputMeta; silver: MetalInputMeta } = {
  gold: { mode: 'usd', rawInput: '', karat: 24 },
  silver: { mode: 'usd', rawInput: '' },
}

export const useCalculatorStore = create<CalculatorState>((set) => ({
  currentStep: 1,
  madhhab: 'general',
  includeWornJewelry: false,
  nisabStandard: 'gold',
  passiveInvestmentRate: 0.3,
  retirementRate: 0.6,
  assets: defaultAssets,
  metalMeta: defaultMetalMeta,
  lineItems: {},
  nisabData: null,
  result: null,
  selectedInvestments: [],
  isEditing: false,
  hasCompletedOnce: false,
  visitedSteps: ['cash'],
  skipIntro: false,
  partnerMasjid: null,
  logoVariant: 'rub-al-ushr',
  setLogoVariant: (variant) => set({ logoVariant: variant }),
  setPartnerMasjid: (masjid) => set({ partnerMasjid: masjid }),
  setStep: (step) => set({ currentStep: step }),
  setMadhhab: (madhhab) =>
    set({
      madhhab,
      nisabStandard: madhhab === 'hanafi' ? 'silver' : 'gold',
      includeWornJewelry: madhhab === 'hanafi',
      passiveInvestmentRate: 0.3,
      retirementRate: 0.6,
    }),
  setIncludeWornJewelry: (val) => set({ includeWornJewelry: val }),
  setNisabStandard: (standard) => set({ nisabStandard: standard }),
  setPassiveInvestmentRate: (rate) => set({ passiveInvestmentRate: rate }),
  setRetirementRate: (rate) => set({ retirementRate: rate }),
  updateAssets: (updates) =>
    set((state) => ({ assets: { ...state.assets, ...updates } })),
  setMetalMeta: (metal, meta) =>
    set((state) => ({
      metalMeta: {
        ...state.metalMeta,
        [metal]: { ...state.metalMeta[metal], ...meta },
      },
    })),
  setLineItems: (fieldId, items) =>
    set((state) => ({
      lineItems: {
        ...state.lineItems,
        [fieldId]: items,
      },
    })),
  setNisabData: (data) => set({ nisabData: data }),
  setResult: (result) => set({ result }),
  setSelectedInvestments: (types) =>
    set((state) => {
      const updatedAssets = { ...state.assets }
      const updatedLineItems = { ...state.lineItems }
      if (!types.includes('stocks')) {
        updatedAssets.stocks = 0
        updatedAssets.passiveStocks = 0
        delete updatedLineItems.stocks
        delete updatedLineItems.passiveStocks
      }
      if (!types.includes('crypto')) {
        updatedAssets.crypto = 0
        delete updatedLineItems.crypto
      }
      if (!types.includes('retirement')) {
        updatedAssets.retirementAccounts = 0
        delete updatedLineItems.retirementAccounts
      }
      if (!types.includes('property')) {
        updatedAssets.investmentProperty = 0
        delete updatedLineItems.investmentProperty
      }
      if (!types.includes('business')) {
        updatedAssets.businessInventory = 0
        delete updatedLineItems.businessInventory
      }
      return {
        selectedInvestments: types,
        assets: updatedAssets,
        lineItems: updatedLineItems,
      }
    }),
  setIsEditing: (val) => set({ isEditing: val }),
  setHasCompletedOnce: (val) => set({ hasCompletedOnce: val }),
  addVisitedStep: (step) =>
    set((state) => ({
      visitedSteps: state.visitedSteps.includes(step)
        ? state.visitedSteps
        : [...state.visitedSteps, step],
    })),
  setSkipIntro: (val) => set({ skipIntro: val }),
  reset: () =>
    set(() => ({
      currentStep: 1,
      passiveInvestmentRate: 0.3,
      retirementRate: 0.6,
      assets: defaultAssets,
      metalMeta: defaultMetalMeta,
      lineItems: {},
      result: null,
      selectedInvestments: [],
      isEditing: false,
      hasCompletedOnce: false,
      visitedSteps: ['cash'],
      skipIntro: false,
    })),
}))
