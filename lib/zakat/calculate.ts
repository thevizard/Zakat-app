import {
  ZAKAT_RATE,
  NISAB_GOLD_GRAMS,
  NISAB_SILVER_GRAMS,
} from "@/constants/zakat";
import {
  AssetInputs,
  NisabData,
  NisabStandard,
  ZakatResult,
} from "@/types/zakat.types";

export function calculateZakat(
  assets: AssetInputs,
  nisabData: NisabData,
  nisabStandard: NisabStandard = "gold",
): ZakatResult {
  // Retirement accounts: 60% zakatable as middle-ground ruling
  const zakatableRetirement = assets.retirementAccounts * 0.6;

  // Passive stocks: only zakatable assets portion (approx 25% of value)
  const zakatablePassiveStocks = assets.passiveStocks * 0.25;

  const totalAssets =
    assets.cash +
    assets.gold +
    assets.silver +
    assets.stocks +
    zakatablePassiveStocks +
    assets.crypto +
    zakatableRetirement +
    assets.investmentProperty +
    assets.businessInventory +
    assets.moneyOwed +
    assets.otherAssets;

  const zakatableWealth = Math.max(0, totalAssets - assets.liabilities);

  const nisabThreshold =
    nisabStandard === "gold"
      ? NISAB_GOLD_GRAMS * nisabData.goldPriceUSD
      : NISAB_SILVER_GRAMS * nisabData.silverPriceUSD;

  const meetsNisab = zakatableWealth >= nisabThreshold;
  const zakatDue = meetsNisab ? zakatableWealth * ZAKAT_RATE : 0;

  return {
    totalAssets,
    totalLiabilities: assets.liabilities,
    zakatableWealth,
    nisabThreshold,
    nisabStandard,
    meetsNisab,
    zakatDue,
  };
}
