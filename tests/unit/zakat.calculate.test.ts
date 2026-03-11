import { describe, it, expect } from "vitest";
import { calculateZakat } from "@/lib/zakat/calculate";
import { AssetInputs, NisabData } from "@/types/zakat.types";

const mockNisabData: NisabData = {
  goldPriceUSD: 60,
  silverPriceUSD: 0.75,
  nisabGoldUSD: 85 * 60, // $5,100
  nisabSilverUSD: 595 * 0.75, // $446.25
  fetchedAt: new Date().toISOString(),
};

const baseAssets: AssetInputs = {
  cash: 10000,
  gold: 0,
  silver: 0,
  stocks: 0,
  businessInventory: 0,
  rentalIncome: 0,
  moneyOwed: 0,
  otherAssets: 0,
  liabilities: 0,
};

describe("calculateZakat", () => {
  it("calculates zakat correctly when wealth meets nisab", () => {
    const result = calculateZakat(baseAssets, mockNisabData, "gold");
    expect(result.meetsNisab).toBe(true);
    expect(result.zakatDue).toBe(10000 * 0.025); // $250
  });

  it("returns zero zakat when wealth is below nisab", () => {
    const assets = { ...baseAssets, cash: 100 };
    const result = calculateZakat(assets, mockNisabData, "gold");
    expect(result.meetsNisab).toBe(false);
    expect(result.zakatDue).toBe(0);
  });

  it("deducts liabilities from zakatable wealth", () => {
    const assets = { ...baseAssets, cash: 20000, liabilities: 5000 };
    const result = calculateZakat(assets, mockNisabData, "gold");
    expect(result.zakatableWealth).toBe(15000);
    expect(result.zakatDue).toBe(15000 * 0.025); // $375
  });

  it("zakatable wealth never goes below zero", () => {
    const assets = { ...baseAssets, cash: 100, liabilities: 50000 };
    const result = calculateZakat(assets, mockNisabData, "gold");
    expect(result.zakatableWealth).toBe(0);
    expect(result.zakatDue).toBe(0);
  });

  it("uses silver nisab standard when selected", () => {
    const assets = { ...baseAssets, cash: 1000 };
    const result = calculateZakat(assets, mockNisabData, "silver");
    expect(result.meetsNisab).toBe(true); // $1000 > $446.25
    expect(result.nisabStandard).toBe("silver");
  });
});
