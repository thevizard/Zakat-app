"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ZakatResult, NisabStandard } from "@/types/zakat.types";

interface ZakatSummaryProps {
  result: ZakatResult;
  nisabStandard: NisabStandard;
  onReset: () => void;
}

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
}

export function ZakatSummary({
  result,
  nisabStandard,
  onReset,
}: ZakatSummaryProps) {
  return (
    <div className="space-y-4">
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Your Zakat Summary</h2>
          <Badge variant={result.meetsNisab ? "default" : "secondary"}>
            {result.meetsNisab ? "Zakat Due" : "Below Nisab"}
          </Badge>
        </div>

        <div className="space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Total Assets</span>
            <span>{formatCurrency(result.totalAssets)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Total Liabilities</span>
            <span>- {formatCurrency(result.totalLiabilities)}</span>
          </div>
          <div className="flex justify-between font-medium border-t pt-3">
            <span>Zakatable Wealth</span>
            <span>{formatCurrency(result.zakatableWealth)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">
              Nisab Threshold ({nisabStandard === "gold" ? "Gold" : "Silver"}{" "}
              standard)
            </span>
            <span>{formatCurrency(result.nisabThreshold)}</span>
          </div>
        </div>
      </Card>

      {result.meetsNisab && (
        <Card className="p-6 bg-primary text-primary-foreground">
          <p className="text-sm mb-1">Your Zakat Due</p>
          <p className="text-4xl font-bold">
            {formatCurrency(result.zakatDue)}
          </p>
          <p className="text-sm mt-2 opacity-80">
            2.5% of your zakatable wealth
          </p>
        </Card>
      )}

      {!result.meetsNisab && (
        <Card className="p-6 border-muted">
          <p className="text-sm text-muted-foreground">
            Your zakatable wealth of {formatCurrency(result.zakatableWealth)} is
            below the nisab threshold of {formatCurrency(result.nisabThreshold)}
            . No zakat is due at this time.
          </p>
        </Card>
      )}

      <Button variant="outline" className="w-full" onClick={onReset}>
        Start Over
      </Button>
    </div>
  );
}
