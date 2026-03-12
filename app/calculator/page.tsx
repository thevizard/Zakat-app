"use client";

import { useZakatCalculator } from "@/hooks/useZakatCalculator";
import { StepWrapper } from "@/components/calculator/StepWrapper";
import { AssetInput } from "@/components/calculator/AssetInput";
import { ZakatSummary } from "@/components/calculator/ZakatSummary";
import { InvestmentSelector } from "@/components/calculator/InvestmentSelector";

export default function CalculatorPage() {
  const {
    currentStep,
    totalSteps,
    assets,
    result,
    nisabStandard,
    selectedInvestments,
    isLoading,
    isError,
    nextStep,
    prevStep,
    calculate,
    updateAssets,
    setNisabStandard,
    setSelectedInvestments,
    reset,
  } = useZakatCalculator();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#68BA7F]/20 flex items-center justify-center">
        <p className="text-[#2d7a4f] text-lg font-medium">
          Fetching current gold & silver prices...
        </p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-[#68BA7F]/20 flex flex-col items-center justify-center gap-4">
        <p className="text-gray-500 text-lg">
          Could not fetch live prices. Using fallback values.
        </p>
        <button
          onClick={nextStep}
          className="bg-black text-white px-8 py-4 rounded-2xl text-base font-semibold hover:bg-gray-800 transition-colors"
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
      {/* Step 1 — Cash */}
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
          <div className="flex justify-end mt-6">
            <button
              onClick={nextStep}
              className="bg-black text-white px-8 py-3.5 rounded-2xl text-base font-semibold hover:bg-gray-800 transition-colors"
            >
              Next →
            </button>
          </div>
        </StepWrapper>
      )}

      {/* Step 2 — Gold & Silver */}
      {currentStep === 2 && (
        <StepWrapper
          currentStep={2}
          totalSteps={totalSteps}
          title="Gold & Silver"
          description="Enter the current USD value of any gold or silver you own."
          onEnter={nextStep}
        >
          <AssetInput
            id="gold"
            label="How much is your gold worth?"
            tooltip="Investment gold only. Personal jewelry is debated — include if unsure."
            value={assets.gold}
            onChange={(val) => updateAssets({ gold: val })}
            onEnter={nextStep}
          />
          <AssetInput
            id="silver"
            label="How much is your silver worth?"
            value={assets.silver}
            onChange={(val) => updateAssets({ silver: val })}
            onEnter={nextStep}
          />
          <div className="flex justify-between mt-6">
            <button
              onClick={prevStep}
              className="border border-gray-200 text-gray-600 px-8 py-3.5 rounded-2xl text-base font-semibold hover:bg-gray-50 transition-colors"
            >
              ← Previous
            </button>
            <button
              onClick={nextStep}
              className="bg-black text-white px-8 py-3.5 rounded-2xl text-base font-semibold hover:bg-gray-800 transition-colors"
            >
              Next →
            </button>
          </div>
        </StepWrapper>
      )}

      {/* Step 3 — Investment selector */}
      {currentStep === 3 && (
        <StepWrapper
          currentStep={3}
          totalSteps={totalSteps}
          title="Investments"
          description="Which of the following investments do you have? Select all that apply."
        >
          <InvestmentSelector
            selected={selectedInvestments}
            onChange={setSelectedInvestments}
          />
          <div className="flex justify-between mt-8">
            <button
              onClick={prevStep}
              className="border border-gray-200 text-gray-600 px-8 py-3.5 rounded-2xl text-base font-semibold hover:bg-gray-50 transition-colors"
            >
              ← Previous
            </button>
            <button
              onClick={nextStep}
              className="bg-black text-white px-8 py-3.5 rounded-2xl text-base font-semibold hover:bg-gray-800 transition-colors"
            >
              Next →
            </button>
          </div>
        </StepWrapper>
      )}

      {/* Step 4 — Investment details based on selection */}
      {currentStep === 4 && (
        <StepWrapper
          currentStep={4}
          totalSteps={totalSteps}
          title="Investment Details"
          description="Enter the value of each investment you selected."
          onEnter={nextStep}
        >
          {selectedInvestments.includes("stocks") && (
            <>
              <AssetInput
                id="stocks"
                label="Active stocks & shares (USD)"
                tooltip="Stocks bought with intention to sell within 12 months. Enter full market value."
                value={assets.stocks}
                onChange={(val) => updateAssets({ stocks: val })}
                onEnter={nextStep}
              />
              <AssetInput
                id="passiveStocks"
                label="Passive stocks & shares (USD)"
                tooltip="Long-term holdings. We apply 25% of market value as the zakatable portion."
                value={assets.passiveStocks}
                onChange={(val) => updateAssets({ passiveStocks: val })}
                onEnter={nextStep}
              />
            </>
          )}
          {selectedInvestments.includes("crypto") && (
            <AssetInput
              id="crypto"
              label="Cryptocurrency (USD value)"
              tooltip="Enter the current total market value of all your crypto holdings."
              value={assets.crypto}
              onChange={(val) => updateAssets({ crypto: val })}
              onEnter={nextStep}
            />
          )}
          {selectedInvestments.includes("retirement") && (
            <AssetInput
              id="retirementAccounts"
              label="Pension & retirement accounts (USD)"
              tooltip="We apply 60% of the balance as zakatable — accounting for early withdrawal penalties and taxes."
              value={assets.retirementAccounts}
              onChange={(val) => updateAssets({ retirementAccounts: val })}
              onEnter={nextStep}
            />
          )}
          {selectedInvestments.includes("property") && (
            <AssetInput
              id="investmentProperty"
              label="Investment property market value (USD)"
              tooltip="Only include property purchased with the intention of resale. Your primary home is exempt."
              value={assets.investmentProperty}
              onChange={(val) => updateAssets({ investmentProperty: val })}
              onEnter={nextStep}
            />
          )}
          {selectedInvestments.includes("business") && (
            <AssetInput
              id="businessInventory"
              label="Business inventory (USD)"
              tooltip="Market value of goods and assets held for sale."
              value={assets.businessInventory}
              onChange={(val) => updateAssets({ businessInventory: val })}
              onEnter={nextStep}
            />
          )}
          {selectedInvestments.length === 0 && (
            <p className="text-gray-400 text-base py-4">
              No investments selected. Click Next to continue.
            </p>
          )}
          <div className="flex justify-between mt-6">
            <button
              onClick={prevStep}
              className="border border-gray-200 text-gray-600 px-8 py-3.5 rounded-2xl text-base font-semibold hover:bg-gray-50 transition-colors"
            >
              ← Previous
            </button>
            <button
              onClick={nextStep}
              className="bg-black text-white px-8 py-3.5 rounded-2xl text-base font-semibold hover:bg-gray-800 transition-colors"
            >
              Next →
            </button>
          </div>
        </StepWrapper>
      )}

      {/* Step 5 — Debts & Other Assets */}
      {currentStep === 5 && (
        <StepWrapper
          currentStep={5}
          totalSteps={totalSteps}
          title="Debts & Other Assets"
          description="Enter any remaining assets and debts you owe."
          onEnter={calculate}
        >
          <AssetInput
            id="moneyOwed"
            label="Does anyone owe you money?"
            tooltip="Loans you have given out that are likely to be repaid."
            value={assets.moneyOwed}
            onChange={(val) => updateAssets({ moneyOwed: val })}
            onEnter={calculate}
          />
          <AssetInput
            id="otherAssets"
            label="Any other assets?"
            value={assets.otherAssets}
            onChange={(val) => updateAssets({ otherAssets: val })}
            onEnter={calculate}
          />
          <AssetInput
            id="liabilities"
            label="How much do you owe in total?"
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
              className="border border-gray-200 text-gray-600 px-8 py-3.5 rounded-2xl text-base font-semibold hover:bg-gray-50 transition-colors"
            >
              ← Previous
            </button>
            <button
              onClick={calculate}
              className="bg-black text-white px-8 py-3.5 rounded-2xl text-base font-semibold hover:bg-gray-800 transition-colors"
            >
              Calculate Zakat →
            </button>
          </div>
        </StepWrapper>
      )}
    </>
  );
}
