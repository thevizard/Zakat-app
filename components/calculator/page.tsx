"use client";

import { useZakatCalculator } from "@/hooks/useZakatCalculator";
import { StepWrapper } from "@/components/calculator/StepWrapper";
import { AssetInput } from "@/components/calculator/AssetInput";
import { ZakatSummary } from "@/components/calculator/ZakatSummary";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function CalculatorPage() {
  const {
    currentStep,
    totalSteps,
    assets,
    result,
    nisabStandard,
    isLoading,
    isError,
    nextStep,
    prevStep,
    calculate,
    updateAssets,
    setNisabStandard,
    reset,
  } = useZakatCalculator();

  if (isLoading) {
    return (
      <div className="max-w-xl mx-auto px-4 py-10 text-center">
        <p className="text-muted-foreground">
          Fetching current gold & silver prices...
        </p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="max-w-xl mx-auto px-4 py-10 text-center">
        <p className="text-muted-foreground">
          Could not fetch live prices. Using fallback values.
        </p>
        <Button className="mt-4" onClick={nextStep}>
          Continue Anyway
        </Button>
      </div>
    );
  }

  if (result && currentStep === totalSteps) {
    return (
      <div className="max-w-xl mx-auto px-4 py-10">
        <ZakatSummary
          result={result}
          nisabStandard={nisabStandard}
          onReset={reset}
        />
      </div>
    );
  }

  return (
    <>
      {currentStep === 1 && (
        <StepWrapper
          currentStep={1}
          totalSteps={totalSteps}
          title="Cash & Bank Accounts"
          description="Enter the total amount of money you have in cash, checking, and savings accounts."
        >
          <AssetInput
            id="cash"
            label="Cash & Bank Balances"
            tooltip="Include all checking, savings, and cash on hand."
            value={assets.cash}
            onChange={(val) => updateAssets({ cash: val })}
          />
          <div className="flex justify-end mt-6">
            <Button onClick={nextStep}>Next</Button>
          </div>
        </StepWrapper>
      )}

      {currentStep === 2 && (
        <StepWrapper
          currentStep={2}
          totalSteps={totalSteps}
          title="Investments & Business"
          description="Enter the value of your stocks, retirement accounts, gold, silver, and business inventory."
        >
          <AssetInput
            id="stocks"
            label="Stocks & Active Investments"
            tooltip="Current market value of stocks, mutual funds, and crypto held as investments."
            value={assets.stocks}
            onChange={(val) => updateAssets({ stocks: val })}
          />
          <AssetInput
            id="retirementAccounts"
            label="Retirement Accounts (401k, IRA)"
            tooltip="Scholars differ on this. We apply 60% of the balance as zakatable wealth as a middle-ground ruling accounting for early withdrawal penalties and taxes."
            value={assets.retirementAccounts}
            onChange={(val) => updateAssets({ retirementAccounts: val })}
          />
          <AssetInput
            id="gold"
            label="Gold (USD value)"
            tooltip="Investment gold only. Personal jewelry ruling is debated — include if unsure."
            value={assets.gold}
            onChange={(val) => updateAssets({ gold: val })}
          />
          <AssetInput
            id="silver"
            label="Silver (USD value)"
            value={assets.silver}
            onChange={(val) => updateAssets({ silver: val })}
          />
          <AssetInput
            id="businessInventory"
            label="Business Inventory"
            tooltip="Market value of goods held for sale."
            value={assets.businessInventory}
            onChange={(val) => updateAssets({ businessInventory: val })}
          />
          <div className="flex justify-between mt-6">
            <Button variant="outline" onClick={prevStep}>
              Back
            </Button>
            <Button onClick={nextStep}>Next</Button>
          </div>
        </StepWrapper>
      )}

      {currentStep === 3 && (
        <StepWrapper
          currentStep={3}
          totalSteps={totalSteps}
          title="Other Assets & Liabilities"
          description="Enter any remaining assets and debts you owe."
        >
          <AssetInput
            id="moneyOwed"
            label="Money Owed To You"
            tooltip="Loans you have given out that are likely to be repaid."
            value={assets.moneyOwed}
            onChange={(val) => updateAssets({ moneyOwed: val })}
          />
          <AssetInput
            id="otherAssets"
            label="Other Assets"
            value={assets.otherAssets}
            onChange={(val) => updateAssets({ otherAssets: val })}
          />
          <AssetInput
            id="liabilities"
            label="Debts & Liabilities"
            tooltip="Money you owe others — loans, credit card balances, etc."
            value={assets.liabilities}
            onChange={(val) => updateAssets({ liabilities: val })}
          />

          <Card className="p-4 mt-4 bg-muted">
            <p className="text-sm font-medium mb-2">Nisab Standard</p>
            <div className="flex gap-3">
              <Button
                size="sm"
                variant={nisabStandard === "gold" ? "default" : "outline"}
                onClick={() => setNisabStandard("gold")}
              >
                Gold
              </Button>
              <Button
                size="sm"
                variant={nisabStandard === "silver" ? "default" : "outline"}
                onClick={() => setNisabStandard("silver")}
              >
                Silver
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Silver standard results in a lower threshold and is the more
              conservative choice.
            </p>
          </Card>

          <div className="flex justify-between mt-6">
            <Button variant="outline" onClick={prevStep}>
              Back
            </Button>
            <Button onClick={calculate}>Calculate Zakat</Button>
          </div>
        </StepWrapper>
      )}
    </>
  );
}
