import { NISAB_GOLD_GRAMS, NISAB_SILVER_GRAMS, HAWL_DAYS } from "@/constants/zakat";
import { NisabData } from "@/types/zakat.types";

export function calculateNisabThresholds(
  goldPriceUSD: number,
  silverPriceUSD: number,
  isFallback: boolean = false,
): NisabData {
  return {
    goldPriceUSD,
    silverPriceUSD,
    nisabGoldUSD: NISAB_GOLD_GRAMS * goldPriceUSD,
    nisabSilverUSD: NISAB_SILVER_GRAMS * silverPriceUSD,
    fetchedAt: new Date().toISOString(),
    isFallback,
  };
}

export function getNextHawlDate(fromDate: Date = new Date()): Date {
  const next = new Date(fromDate);
  next.setDate(next.getDate() + HAWL_DAYS);
  return next;
}

export function formatNextHawlDate(fromDate: Date = new Date()): string {
  return getNextHawlDate(fromDate).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}
