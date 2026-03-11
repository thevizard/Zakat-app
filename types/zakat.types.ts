export type NisabStandard = "gold" | "silver";

export type Madhab = "general" | "hanafi";

export interface AssetInputs {
  cash: number;
  gold: number;
  silver: number;
  stocks: number;
  businessInventory: number;
  rentalIncome: number;
  moneyOwed: number;
  otherAssets: number;
  liabilities: number;
}

export interface NisabData {
  goldPriceUSD: number;
  silverPriceUSD: number;
  nisabGoldUSD: number;
  nisabSilverUSD: number;
  fetchedAt: string;
}

export interface ZakatResult {
  totalAssets: number;
  totalLiabilities: number;
  zakatableWealth: number;
  nisabThreshold: number;
  nisabStandard: NisabStandard;
  meetsNisab: boolean;
  zakatDue: number;
}
