import { create } from "zustand";
import {
  AssetInputs,
  NisabData,
  NisabStandard,
  ZakatResult,
} from "@/types/zakat.types";

interface CalculatorState {
  currentStep: number;
  nisabStandard: NisabStandard;
  assets: AssetInputs;
  nisabData: NisabData | null;
  result: ZakatResult | null;
  setStep: (step: number) => void;
  setNisabStandard: (standard: NisabStandard) => void;
  updateAssets: (updates: Partial<AssetInputs>) => void;
  setNisabData: (data: NisabData) => void;
  setResult: (result: ZakatResult) => void;
  reset: () => void;
}

const defaultAssets: AssetInputs = {
  cash: 0,
  gold: 0,
  silver: 0,
  stocks: 0,
  businessInventory: 0,
  rentalIncome: 0,
  moneyOwed: 0,
  otherAssets: 0,
  liabilities: 0,
};

export const useCalculatorStore = create<CalculatorState>((set) => ({
  currentStep: 1,
  nisabStandard: "gold",
  assets: defaultAssets,
  nisabData: null,
  result: null,
  setStep: (step) => set({ currentStep: step }),
  setNisabStandard: (standard) => set({ nisabStandard: standard }),
  updateAssets: (updates) =>
    set((state) => ({ assets: { ...state.assets, ...updates } })),
  setNisabData: (data) => set({ nisabData: data }),
  setResult: (result) => set({ result }),
  reset: () => set({ currentStep: 1, assets: defaultAssets, result: null }),
}));
