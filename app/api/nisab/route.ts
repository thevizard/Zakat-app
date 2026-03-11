import { NextResponse } from "next/server";
import { calculateNisabThresholds } from "@/lib/zakat/nisab";

const FALLBACK_GOLD_PRICE = 85.0;
const FALLBACK_SILVER_PRICE = 1.05;

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

    const goldPrice = goldData?.[0]?.price ?? FALLBACK_GOLD_PRICE;
    const silverPrice = silverData?.[0]?.price ?? FALLBACK_SILVER_PRICE;

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
