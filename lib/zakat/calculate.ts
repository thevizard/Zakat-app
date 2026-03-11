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
  // Total assets
  const totalAssets =
    assets.cash +
    assets.gold +
    assets.silver +
    assets.stocks +
    assets.businessInventory +
    assets.rentalIncome +
    assets.moneyOwed +
    assets.otherAssets;

  // Subtract liabilities
  const zakatableWealth = Math.max(0, totalAssets - assets.liabilities);

  // Nisab threshold based on chosen standard
  const nisabThreshold =
    nisabStandard === "gold"
      ? NISAB_GOLD_GRAMS * nisabData.goldPriceUSD
      : NISAB_SILVER_GRAMS * nisabData.silverPriceUSD;

  // Does wealth meet nisab?
  const meetsNisab = zakatableWealth >= nisabThreshold;

  // Zakat is only due if nisab is met
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
