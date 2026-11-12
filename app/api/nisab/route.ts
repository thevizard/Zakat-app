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

    const hasLiveGold = Boolean(goldData?.[0]?.price);
    const hasLiveSilver = Boolean(silverData?.[0]?.price);

    // metals.live returns price per troy oz — convert to per gram
    const goldPrice = hasLiveGold
      ? goldData[0].price / TROY_OZ_TO_GRAMS
      : FALLBACK_GOLD_PRICE;
    const silverPrice = hasLiveSilver
      ? silverData[0].price / TROY_OZ_TO_GRAMS
      : FALLBACK_SILVER_PRICE;

    const nisabData = calculateNisabThresholds(
      goldPrice,
      silverPrice,
      !(hasLiveGold && hasLiveSilver)
    );
    return NextResponse.json(nisabData);
  } catch {
    const nisabData = calculateNisabThresholds(
      FALLBACK_GOLD_PRICE,
      FALLBACK_SILVER_PRICE,
      true
    );
    return NextResponse.json(nisabData);
  }
}
