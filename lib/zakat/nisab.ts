import { NISAB_GOLD_GRAMS, NISAB_SILVER_GRAMS } from "@/constants/zakat";
import { NisabData } from "@/types/zakat.types";

export function calculateNisabThresholds(
  goldPriceUSD: number,
  silverPriceUSD: number,
): NisabData {
  return {
    goldPriceUSD,
    silverPriceUSD,
    nisabGoldUSD: NISAB_GOLD_GRAMS * goldPriceUSD,
    nisabSilverUSD: NISAB_SILVER_GRAMS * silverPriceUSD,
    fetchedAt: new Date().toISOString(),
  };
}
