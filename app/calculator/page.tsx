"use client";

import { useState } from "react";
import { useZakatCalculator } from "@/hooks/useZakatCalculator";
import { StepWrapper } from "@/components/calculator/StepWrapper";
import { AssetInput } from "@/components/calculator/AssetInput";
import { ZakatSummary } from "@/components/calculator/ZakatSummary";
import { InvestmentSelector } from "@/components/calculator/InvestmentSelector";
import { GoldSilverInput } from "@/components/calculator/GoldSilverInput";
import { ZakatTracker } from "@/components/calculator/ZakatTracker";
import { CalculatorNav } from "@/components/calculator/CalculatorNav";
import { StepTrail } from "@/components/calculator/StepTrail";
import { MultiAssetInput } from "@/components/calculator/MultiAssetInput";
import { TopNav } from "@/components/TopNav";

const GREEN = "#2d7a4f";
const LIGHT_GREEN = "#68BA7F";
const DARK = "#0f2419";

const items = [
  {
    icon: "🏦",
    title: "Bank & Cash",
    desc: "Checking, savings balances & cash on hand",
  },
  {
    icon: "📈",
    title: "Investments",
    desc: "Stocks, crypto, 401k/IRA — most recent statement",
  },
  {
    icon: "🥇",
    title: "Gold & Silver",
    desc: "Weight or USD value of any gold/silver you own",
  },
  {
    icon: "🤝",
    title: "Money Owed To You",
    desc: "Loans you've given out that are likely to be repaid",
  },
  {
    icon: "💳",
    title: "Short-Term Debts",
    desc: "Credit card balances & loans due in the next 30 days",
  },
];

function IntroPage({ onStart }: { onStart: () => void }) {
  return (
    <>
      <TopNav />
      <div
        style={{
          minHeight: "100vh",
          paddingTop: 72,
          background: "#f7fdf9",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "100px 24px 60px",
        }}
      >
        <div style={{ maxWidth: 560, width: "100%" }}>

          {/* Header */}
          <div style={{ textAlign: "center", marginBottom: 40 }}>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                background: `${LIGHT_GREEN}22`,
                border: `1px solid ${LIGHT_GREEN}44`,
                borderRadius: 50,
                padding: "6px 16px",
                marginBottom: 20,
              }}
            >
              <span style={{ fontSize: 13, color: LIGHT_GREEN, fontWeight: 600 }}>
                Takes about 5 minutes
              </span>
            </div>
            <h1
              style={{
                fontSize: "clamp(26px, 4vw, 36px)",
                fontWeight: 700,
                color: DARK,
                lineHeight: 1.2,
                marginBottom: 14,
              }}
            >
              Before you begin
            </h1>
            <p
              style={{
                fontSize: 16,
                color: "#666",
                lineHeight: 1.7,
                maxWidth: 420,
                margin: "0 auto",
              }}
            >
              Having a few numbers handy will help you get the most accurate result.
              Don't worry — estimates are perfectly fine.
            </p>
          </div>

          {/* Items */}
          <div
            style={{
              background: "white",
              borderRadius: 20,
              border: "1px solid #e8f5ed",
              overflow: "hidden",
              marginBottom: 28,
            }}
          >
            {items.map((item, i) => (
              <div
                key={item.title}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 16,
                  padding: "16px 24px",
                  borderBottom: i < items.length - 1 ? "1px solid #f0f7f3" : "none",
                }}
              >
                <div
                  style={{
                    width: 44,
                    height: 44,
                    background: `${LIGHT_GREEN}18`,
                    borderRadius: 12,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 22,
                    flexShrink: 0,
                  }}
                >
                  {item.icon}
                </div>
                <div>
                  <div style={{ fontSize: 15, fontWeight: 600, color: DARK, marginBottom: 2 }}>
                    {item.title}
                  </div>
                  <div style={{ fontSize: 13, color: "#888", lineHeight: 1.5 }}>
                    {item.desc}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* CTA */}
          <button
            onClick={onStart}
            style={{
              width: "100%",
              background: GREEN,
              color: "white",
              border: "none",
              borderRadius: 16,
              padding: "18px 24px",
              fontSize: 16,
              fontWeight: 700,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 10,
              transition: "background 0.2s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = LIGHT_GREEN)}
            onMouseLeave={(e) => (e.currentTarget.style.background = GREEN)}
          >
            I'm ready — let's calculate
            <span style={{ fontSize: 18 }}>→</span>
          </button>

          <p style={{ textAlign: "center", fontSize: 13, color: "#aaa", marginTop: 16 }}>
            No account required. Your data never leaves your device.
          </p>

        </div>
      </div>
    </>
  );
}

export default function CalculatorPage() {
  const [started, setStarted] = useState(false);
  const {
    currentStep,
    currentStepName,
    totalSteps,
    steps,
    assets,
    result,
    nisabData,
    nisabStandard,
    selectedInvestments,
    isEditing,
    hasCompletedOnce,
    visitedSteps,
    isLoading,
    isError,
    nextStep,
    prevStep,
    calculate,
    skipToEnd,
    goToStep,
    backToSummary,
    updateAssets,
    setNisabStandard,
    setSelectedInvestments,
    reset,
  } = useZakatCalculator();

  if (!started) {
    return <IntroPage onStart={() => setStarted(true)} />;
  }

  if (isLoading) {
    return (
      <>
        <TopNav />
        <div className="min-h-screen pt-[72px] bg-[#68BA7F]/20 flex items-center justify-center">
          <p className="text-[#2d7a4f] text-lg font-medium">
            Fetching current gold & silver prices...
          </p>
        </div>
      </>
    );
  }

  if (isError) {
    return (
      <>
        <TopNav />
        <div className="min-h-screen pt-[72px] bg-[#68BA7F]/20 flex flex-col items-center justify-center gap-4">
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
      </>
    );
  }

  if (currentStepName === "results" && result) {
    return (
      <>
        <TopNav />
        <div className="pt-[72px]">
          <ZakatSummary
            result={result}
            nisabStandard={nisabStandard}
            onReset={reset}
            onBack={prevStep}
            onEdit={goToStep}
          />
        </div>
      </>
    );
  }

  const navButtons = (onNext: () => void) => (
    <div className="mt-6">
      <div className="flex justify-between">
        <button
          onClick={prevStep}
          className="border border-gray-200 text-gray-600 px-8 py-3.5 rounded-2xl text-base font-semibold hover:bg-gray-50 transition-colors"
        >
          ← Previous
        </button>
        <button
          onClick={onNext}
          className="text-white px-8 py-3.5 rounded-2xl text-base font-semibold transition-colors"
          style={{ background: "#2d7a4f" }}
          onMouseEnter={(e) => (e.currentTarget.style.background = "#68BA7F")}
          onMouseLeave={(e) => (e.currentTarget.style.background = "#2d7a4f")}
        >
          Next →
        </button>
      </div>
    </div>
  );

  return (
    <>
    <TopNav />
    <div className="min-h-screen pt-[72px] flex flex-col" style={{ background: '#f7fdf9' }}>
      {/* Tracker bar — directly below TopNav */}
      <div style={{
        background: '#1a3a2a',
        borderBottom: '1px solid rgba(255,255,255,0.08)',
        boxShadow: '0 2px 16px rgba(0,0,0,0.18)',
        height: 68,
        flexShrink: 0,
      }}>
        <ZakatTracker
          assets={assets}
          nisabData={nisabData ?? null}
          nisabStandard={nisabStandard}
        />
      </div>

      <StepTrail
        currentStepName={currentStepName}
        visitedSteps={visitedSteps}
        onGoToStep={goToStep}
      />

      <div className="flex-1 flex flex-col">
      <>
        {currentStepName === "cash" && (
          <StepWrapper
            currentStep={currentStep}
            totalSteps={totalSteps}
            title="Cash & Bank Accounts"
            description={
              <>
                Enter the total amount of money you have in{" "}
                <strong>cash</strong>, <strong>checking</strong>, and{" "}
                <strong>savings accounts</strong>.
              </>
            }
            onEnter={nextStep}
          >
            <MultiAssetInput
              legend="Cash & Bank Accounts"
              tooltip="Include cash on hand and all bank accounts."
              placeholder="e.g. Chase Checking"
              onChange={(val) => updateAssets({ cash: val })}
            />
            <div className="mt-8">
              <div className="flex justify-end">
                <button
                  onClick={nextStep}
                  style={{
                    background: '#2d7a4f', color: 'white',
                    padding: '12px 32px', borderRadius: 50,
                    fontSize: 15, fontWeight: 600, border: 'none',
                    cursor: 'pointer', fontFamily: 'Open Sans, sans-serif',
                    transition: 'background 0.2s',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "#68BA7F")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "#2d7a4f")}
                >
                  Next →
                </button>
              </div>
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
            <MultiAssetInput
              legend="Active stocks — intention to sell within 12 months"
              tooltip="Treat this like cash. Enter the full market value."
              placeholder="e.g. Fidelity, Robinhood"
              onChange={(val) => updateAssets({ stocks: val })}
            />
            <MultiAssetInput
              legend="Passive stocks — long-term holdings"
              tooltip="We apply 30% of the market value as the zakatable portion."
              placeholder="e.g. Vanguard 401k, Schwab"
              onChange={(val) => updateAssets({ passiveStocks: val })}
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
              tooltip="We apply 30% of the balance as zakatable — based on contemporary scholarly consensus including Sh. Joe Bradford. Only include funds you can withdraw, even if a penalty applies."
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
              tooltip="List the value of your sellable inventory, but exclude business equipment and real estate."
              value={assets.businessInventory}
              onChange={(val) => updateAssets({ businessInventory: val })}
              onEnter={nextStep}
            />
            {navButtons(nextStep)}
          </StepWrapper>
        )}
        {currentStepName === "receivables" && (
          <StepWrapper
            currentStep={currentStep}
            totalSteps={totalSteps}
            title="Money Owed to You"
            description="Include any money that others owe you that is likely to be repaid."
            onEnter={nextStep}

          >
            <AssetInput
              id="moneyOwed"
              label="How much is owed to you in total?"
              tooltip="Loans you have given out, IOUs, or any money you expect to receive back."
              value={assets.moneyOwed}
              onChange={(val) => updateAssets({ moneyOwed: val })}
              onEnter={nextStep}
            />
            {navButtons(nextStep)}
          </StepWrapper>
        )}
        {currentStepName === "debts" && (
          <StepWrapper
            currentStep={currentStep}
            totalSteps={totalSteps}
            title="Liabilities"
            description="Enter any debts and liabilities you owe."
            onEnter={calculate}

          >
            <AssetInput
              id="liabilities"
              label="How much do you owe in total?"
              tooltip="Money you owe others — loans, credit card balances, etc. Include full credit card balances."
              value={assets.liabilities}
              onChange={(val) => updateAssets({ liabilities: val })}
              onEnter={calculate}
            />

            <div className="mt-6">
              <div className="flex justify-between">
                <button
                  onClick={prevStep}
                  className="border border-gray-200 text-gray-600 px-8 py-3.5 rounded-2xl text-base font-semibold hover:bg-gray-50 transition-colors"
                >
                  ← Previous
                </button>
                <button
                  onClick={calculate}
                  className="text-white px-8 py-3.5 rounded-2xl text-base font-semibold transition-colors"
                  style={{ background: "#2d7a4f" }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.background = "#68BA7F")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.background = "#2d7a4f")
                  }
                >
                  Calculate Zakat →
                </button>
              </div>
            </div>
          </StepWrapper>
        )}
      </>
      </div>

    </div>
    </>
  );
}
