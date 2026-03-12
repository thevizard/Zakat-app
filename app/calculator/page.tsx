"use client";

import { useZakatCalculator } from "@/hooks/useZakatCalculator";
import { StepWrapper } from "@/components/calculator/StepWrapper";
import { AssetInput } from "@/components/calculator/AssetInput";
import { ZakatSummary } from "@/components/calculator/ZakatSummary";
import { InvestmentSelector } from "@/components/calculator/InvestmentSelector";
import { GoldSilverInput } from "@/components/calculator/GoldSilverInput";

export default function CalculatorPage() {
  const {
    currentStep,
    currentStepName,
    totalSteps,
    assets,
    result,
    nisabData,
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

  if (currentStepName === "results" && result) {
    return (
      <ZakatSummary
        result={result}
        nisabStandard={nisabStandard}
        onReset={reset}
      />
    );
  }

  const navButtons = (onNext: () => void) => (
    <div className="flex justify-between mt-6">
      <button
        onClick={prevStep}
        className="border border-gray-200 text-gray-600 px-8 py-3.5 rounded-2xl text-base font-semibold hover:bg-gray-50 transition-colors"
      >
        ← Previous
      </button>
      <button
        onClick={onNext}
        className="bg-black text-white px-8 py-3.5 rounded-2xl text-base font-semibold hover:bg-gray-800 transition-colors"
      >
        Next →
      </button>
    </div>
  );

  return (
    <>
      {currentStepName === "cash" && (
        <StepWrapper
          currentStep={currentStep}
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

      {currentStepName === "goldsilver" && (
        <StepWrapper
          currentStep={currentStep}
          totalSteps={totalSteps}
          title="Gold & Silver"
          description="Enter the current value of any gold or silver you own."
          onEnter={nextStep}
        >
          <GoldSilverInput
            id="gold"
            label="How much gold do you own?"
            pricePerGram={nisabData?.goldPriceUSD ?? 85}
            value={assets.gold}
            onChange={(val) => updateAssets({ gold: val })}
            onEnter={nextStep}
          />
          <GoldSilverInput
            id="silver"
            label="How much silver do you own?"
            pricePerGram={nisabData?.silverPriceUSD ?? 1.05}
            value={assets.silver}
            onChange={(val) => updateAssets({ silver: val })}
            onEnter={nextStep}
          />
          {navButtons(nextStep)}
        </StepWrapper>
      )}

      {currentStepName === "investment-selector" && (
        <StepWrapper
          currentStep={currentStep}
          totalSteps={totalSteps}
          title="Investments"
          description="Which of the following investments do you have? Select all that apply."
        >
          <InvestmentSelector
            selected={selectedInvestments}
            onChange={setSelectedInvestments}
          />
          {navButtons(nextStep)}
        </StepWrapper>
      )}

      {currentStepName === "stocks" && (
        <StepWrapper
          currentStep={currentStep}
          totalSteps={totalSteps}
          title="Shares & Stocks"
          description="Enter the value of your stock investments."
          onEnter={nextStep}
        >
          <AssetInput
            id="stocks"
            label="Active stocks — intention to sell within 12 months"
            tooltip="Treat this like cash. Enter the full market value."
            value={assets.stocks}
            onChange={(val) => updateAssets({ stocks: val })}
            onEnter={nextStep}
          />
          <AssetInput
            id="passiveStocks"
            label="Passive stocks — long-term holdings"
            tooltip="We apply 25% of the market value as the zakatable portion."
            value={assets.passiveStocks}
            onChange={(val) => updateAssets({ passiveStocks: val })}
            onEnter={nextStep}
          />
          {navButtons(nextStep)}
        </StepWrapper>
      )}

      {currentStepName === "crypto" && (
        <StepWrapper
          currentStep={currentStep}
          totalSteps={totalSteps}
          title="Cryptocurrencies"
          description="Zakat is due on the current market value of your crypto."
          onEnter={nextStep}
        >
          <AssetInput
            id="crypto"
            label="What is your total crypto portfolio worth?"
            tooltip="Enter the current USD value of all your crypto holdings combined."
            value={assets.crypto}
            onChange={(val) => updateAssets({ crypto: val })}
            onEnter={nextStep}
          />
          {navButtons(nextStep)}
        </StepWrapper>
      )}

      {currentStepName === "retirement" && (
        <StepWrapper
          currentStep={currentStep}
          totalSteps={totalSteps}
          title="Pension & Retirement"
          description="If you have access to these funds, Zakat is payable on them."
          onEnter={nextStep}
        >
          <AssetInput
            id="retirementAccounts"
            label="What is the total value of your retirement accounts?"
            tooltip="We apply 30% of the market value as zakatable — scholars including Sh. Joe Bradford have allowed this approximation to represent the zakatable assets within the company (cash, inventory, etc.). Enter your full portfolio value and we handle the rest."
            value={assets.retirementAccounts}
            onChange={(val) => updateAssets({ retirementAccounts: val })}
            onEnter={nextStep}
          />
          {navButtons(nextStep)}
        </StepWrapper>
      )}

      {currentStepName === "property" && (
        <StepWrapper
          currentStep={currentStep}
          totalSteps={totalSteps}
          title="Investment Property"
          description="If you live in the property, Zakat is not due on it."
          onEnter={nextStep}
        >
          <AssetInput
            id="investmentProperty"
            label="What is the market value of your investment property?"
            tooltip="Only include property purchased with the intention of resale. Your primary home is exempt."
            value={assets.investmentProperty}
            onChange={(val) => updateAssets({ investmentProperty: val })}
            onEnter={nextStep}
          />
          {navButtons(nextStep)}
        </StepWrapper>
      )}

      {currentStepName === "business" && (
        <StepWrapper
          currentStep={currentStep}
          totalSteps={totalSteps}
          title="Business Inventory"
          description="Enter the value of goods and assets held for sale."
          onEnter={nextStep}
        >
          <AssetInput
            id="businessInventory"
            label="What is your business inventory worth?"
            tooltip="Market value of all goods, products, and liquid business assets held for sale."
            value={assets.businessInventory}
            onChange={(val) => updateAssets({ businessInventory: val })}
            onEnter={nextStep}
          />
          {navButtons(nextStep)}
        </StepWrapper>
      )}

      {currentStepName === "debts" && (
        <StepWrapper
          currentStep={currentStep}
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
