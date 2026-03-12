export interface AssetInputs {
  cash: number
  gold: number
  silver: number
  stocks: number
  passiveStocks: number
  crypto: number
  retirementAccounts: number
  investmentProperty: number
  businessInventory: number
  moneyOwed: number
  otherAssets: number
  liabilities: number
}

export type InvestmentType =
  | 'stocks'
  | 'crypto'
  | 'retirement'
  | 'property'
  | 'business'

export type NisabStandard = 'gold' | 'silver'

export interface NisabData {
  goldPriceUSD: number
  silverPriceUSD: number
}

export interface AssetBreakdownItem {
  label: string
  stepName: string
  entered: number
  zakatable: number
  zakatDue: number
}

export interface ZakatResult {
  totalAssets: number
  totalLiabilities: number
  zakatableWealth: number
  nisabThreshold: number
  nisabStandard: NisabStandard
  meetsNisab: boolean
  zakatDue: number
  breakdown: AssetBreakdownItem[]
}