"use client";

import { useZakatCalculator } from "@/hooks/useZakatCalculator";
import { StepWrapper } from "@/components/calculator/StepWrapper";
import { AssetInput } from "@/components/calculator/AssetInput";
import { ZakatSummary } from "@/components/calculator/ZakatSummary";

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
      <div className="min-h-screen bg-[#eef7f2] flex items-center justify-center">
        <p className="text-[#2d7a4f] text-lg font-medium">
          Fetching current gold & silver prices...
        </p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-[#eef7f2] flex flex-col items-center justify-center gap-4">
        <p className="text-gray-500 text-lg">
          Could not fetch live prices. Using fallback values.
        </p>
        <button
          onClick={nextStep}
          className="bg-black text-white px-8 py-4 rounded-2xl text-base font-semibold hover:bg-gray-600 transition-colors"
        >
          Continue Anyway
        </button>
      </div>
    );
  }

  if (result && currentStep === totalSteps) {
    return (
      <ZakatSummary
        result={result}
        nisabStandard={nisabStandard}
        onReset={reset}
      />
    );
  }

  return (
    <>
      {currentStep === 1 && (
        <StepWrapper
          currentStep={1}
          totalSteps={totalSteps}
          title="Cash & Bank Accounts"
          description={
            <>
              Enter the total amount of money you have in <strong>cash</strong>,{" "}
              <strong>checking</strong>, and <strong>savings accounts</strong>.
            </>
          }
          onEnter={nextStep}
        >
          <AssetInput
            id="cash"
            label="How much do you have in total?"
            tooltip="Include cash on hand and all bank accounts."
            value={assets.cash}
            onChange={(val) => updateAssets({ cash: val })}
            onEnter={nextStep}
          />
          <div className="flex justify-between mt-6">
            <div />
            <button
              onClick={nextStep}
              className="bg-black text-white px-8 py-3.5 rounded-2xl text-base font-semibold hover:bg-gray-600 transition-colors flex items-center gap-2"
            >
              Next →
            </button>
          </div>
        </StepWrapper>
      )}

      {currentStep === 2 && (
        <StepWrapper
          currentStep={2}
          totalSteps={totalSteps}
          title="Investments & Business"
          description="Enter the value of your stocks, retirement accounts, gold, silver, and business inventory."
          onEnter={nextStep}
        >
          <AssetInput
            id="stocks"
            label="Stocks & Active Investments (USD)"
            tooltip="Current market value of stocks, mutual funds, and crypto held as investments."
            value={assets.stocks}
            onChange={(val) => updateAssets({ stocks: val })}
            onEnter={nextStep}
          />
          <AssetInput
            id="retirementAccounts"
            label="Retirement Accounts — 401k, IRA (USD)"
            tooltip="We apply 60% of the balance as zakatable wealth — a middle-ground ruling accounting for early withdrawal penalties and taxes."
            value={assets.retirementAccounts}
            onChange={(val) => updateAssets({ retirementAccounts: val })}
            onEnter={nextStep}
          />
          <AssetInput
            id="gold"
            label="Gold (USD value)"
            tooltip="Investment gold only. Personal jewelry ruling is debated — include if unsure."
            value={assets.gold}
            onChange={(val) => updateAssets({ gold: val })}
            onEnter={nextStep}
          />
          <AssetInput
            id="silver"
            label="Silver (USD value)"
            value={assets.silver}
            onChange={(val) => updateAssets({ silver: val })}
            onEnter={nextStep}
          />
          <AssetInput
            id="businessInventory"
            label="Business Inventory (USD)"
            tooltip="Market value of goods held for sale."
            value={assets.businessInventory}
            onChange={(val) => updateAssets({ businessInventory: val })}
            onEnter={nextStep}
          />
          <div className="flex justify-between mt-6">
            <button
              onClick={prevStep}
              className="border border-gray-200 text-gray-600 px-8 py-3.5 rounded-2xl text-base font-semibold hover:bg-gray-50 transition-colors flex items-center gap-2"
            >
              ← Previous
            </button>
            <button
              onClick={nextStep}
              className="bg-black text-white px-8 py-3.5 rounded-2xl text-base font-semibold hover:bg-gray-600 transition-colors flex items-center gap-2"
            >
              Next →
            </button>
          </div>
        </StepWrapper>
      )}

      {currentStep === 3 && (
        <StepWrapper
          currentStep={3}
          totalSteps={totalSteps}
          title="Debts & Other Assets"
          description="Enter any remaining assets and debts you owe."
          onEnter={calculate}
        >
          <AssetInput
            id="moneyOwed"
            label="Money Owed To You (USD)"
            tooltip="Loans you have given out that are likely to be repaid."
            value={assets.moneyOwed}
            onChange={(val) => updateAssets({ moneyOwed: val })}
            onEnter={calculate}
          />
          <AssetInput
            id="otherAssets"
            label="Other Assets (USD)"
            value={assets.otherAssets}
            onChange={(val) => updateAssets({ otherAssets: val })}
            onEnter={calculate}
          />
          <AssetInput
            id="liabilities"
            label="Debts & Liabilities (USD)"
            tooltip="Money you owe others — loans, credit card balances, etc."
            value={assets.liabilities}
            onChange={(val) => updateAssets({ liabilities: val })}
            onEnter={calculate}
          />

          <div className="mt-6 p-5 bg-gray-50 rounded-2xl border border-gray-100">
            <p className="text-base font-bold text-gray-800 mb-3">
              Nisab Standard
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setNisabStandard("gold")}
                className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                  nisabStandard === "gold"
                    ? "bg-black text-white"
                    : "bg-white text-gray-600 border border-gray-200 hover:border-gray-400"
                }`}
              >
                Gold
              </button>
              <button
                onClick={() => setNisabStandard("silver")}
                className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                  nisabStandard === "silver"
                    ? "bg-black text-white"
                    : "bg-white text-gray-600 border border-gray-200 hover:border-gray-400"
                }`}
              >
                Silver
              </button>
            </div>
            <p className="text-xs text-gray-400 mt-2 leading-relaxed">
              Silver standard results in a lower threshold and is the more
              conservative choice.
            </p>
          </div>

          <div className="flex justify-between mt-6">
            <button
              onClick={prevStep}
              className="border border-gray-200 text-gray-600 px-8 py-3.5 rounded-2xl text-base font-semibold hover:bg-gray-50 transition-colors flex items-center gap-2"
            >
              ← Previous
            </button>
            <button
              onClick={calculate}
              className="bg-black text-white px-8 py-3.5 rounded-2xl text-base font-semibold hover:bg-gray-600 transition-colors flex items-center gap-2"
            >
              Calculate Zakat →
            </button>
          </div>
        </StepWrapper>
      )}
    </>
  );
}
