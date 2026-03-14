import { NextResponse } from "next/server";
import { calculateNisabThresholds } from "@/lib/zakat/nisab";

const TROY_OZ_TO_GRAMS = 31.1035;
const FALLBACK_GOLD_PRICE = 161.9;  // USD per gram (~$5,035/oz)
const FALLBACK_SILVER_PRICE = 2.68; // USD per gram (~$83/oz)

export async function GET() {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 3000); // 3 second timeout

    const [goldRes, silverRes] = await Promise.all([
      fetch("https://api.metals.live/v1/spot/gold", {
        signal: controller.signal,
        next: { revalidate: 3600 },
      }),
      fetch("https://api.metals.live/v1/spot/silver", {
        signal: controller.signal,
        next: { revalidate: 3600 },
      }),
    ]);

    clearTimeout(timeout);

    const goldData = await goldRes.json();
    const silverData = await silverRes.json();

    // metals.live returns price per troy oz — convert to per gram
    const goldPrice = goldData?.[0]?.price
      ? goldData[0].price / TROY_OZ_TO_GRAMS
      : FALLBACK_GOLD_PRICE;
    const silverPrice = silverData?.[0]?.price
      ? silverData[0].price / TROY_OZ_TO_GRAMS
      : FALLBACK_SILVER_PRICE;

    const nisabData = calculateNisabThresholds(goldPrice, silverPrice);
    return NextResponse.json(nisabData);
  } catch {
    const nisabData = calculateNisabThresholds(
      FALLBACK_GOLD_PRICE,
      FALLBACK_SILVER_PRICE,
    );
    return NextResponse.json(nisabData);
  }
}
