export interface AssetInputs {
  cash: number;
  gold: number;
  silver: number;
  stocks: number;
  passiveStocks: number;
  crypto: number;
  retirementAccounts: number;
  investmentProperty: number;
  businessInventory: number;
  moneyOwed: number;
  otherAssets: number;
  liabilities: number;
}
export type InvestmentType =
  | "stocks"
  | "crypto"
  | "retirement"
  | "property"
  | "business";
