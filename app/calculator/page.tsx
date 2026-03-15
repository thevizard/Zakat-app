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

const GOLD = "#c9a96e";

function IntroPage({ onStart }: { onStart: () => void }) {
  return (
    <>
      <TopNav />
      <div style={{ minHeight: "100vh", paddingTop: 64, background: "#f2f7f4", fontFamily: "Open Sans, sans-serif" }}>

        {/* ── HERO ── */}
        <div style={{ background: DARK, position: "relative", overflow: "hidden", padding: "clamp(56px,8vw,96px) 24px clamp(52px,7vw,88px)" }}>

          {/* Gold top line */}
          <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg, transparent, ${GOLD} 25%, ${GOLD} 75%, transparent)` }} />

          {/* Islamic geometric SVG tile */}
          <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: 0.045, pointerEvents: "none" }} xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="islamic-geo" x="0" y="0" width="72" height="72" patternUnits="userSpaceOnUse">
                <rect x="0" y="0" width="72" height="72" fill="none" />
                {/* Outer square rotated 45° */}
                <rect x="12" y="12" width="48" height="48" fill="none" stroke="white" strokeWidth="0.6" transform="rotate(45 36 36)" />
                {/* Inner square */}
                <rect x="20" y="20" width="32" height="32" fill="none" stroke="white" strokeWidth="0.4" />
                {/* Center circle */}
                <circle cx="36" cy="36" r="10" fill="none" stroke="white" strokeWidth="0.4" />
                {/* Corner dots */}
                <circle cx="0"  cy="0"  r="2.5" fill="white" />
                <circle cx="72" cy="0"  r="2.5" fill="white" />
                <circle cx="0"  cy="72" r="2.5" fill="white" />
                <circle cx="72" cy="72" r="2.5" fill="white" />
                {/* Mid-edge dots */}
                <circle cx="36" cy="0"  r="1.2" fill="white" />
                <circle cx="0"  cy="36" r="1.2" fill="white" />
                <circle cx="72" cy="36" r="1.2" fill="white" />
                <circle cx="36" cy="72" r="1.2" fill="white" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#islamic-geo)" />
          </svg>

          {/* Radial glow */}
          <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 70% 100% at 50% 50%, rgba(45,122,79,0.22) 0%, transparent 70%)", pointerEvents: "none" }} />

          {/* Decorative star — right side */}
          <svg style={{ position: "absolute", right: "5%", top: "50%", transform: "translateY(-50%)", opacity: 0.07, pointerEvents: "none" }} width="280" height="280" viewBox="0 0 100 100">
            <polygon points="50,4 61,35 95,35 68,56 79,90 50,69 21,90 32,56 5,35 39,35" fill="none" stroke="white" strokeWidth="1.2" />
            <polygon points="50,16 58,38 82,38 63,52 70,75 50,62 30,75 37,52 18,38 42,38" fill="none" stroke="white" strokeWidth="0.6" />
            <circle cx="50" cy="50" r="14" fill="none" stroke="white" strokeWidth="0.5" />
          </svg>

          {/* Hero text */}
          <div style={{ maxWidth: 620, margin: "0 auto", position: "relative", zIndex: 1 }}>
            {/* Badge */}
            <div style={{ display: "inline-flex", alignItems: "center", gap: 10, background: "rgba(201,169,110,0.1)", border: "1px solid rgba(201,169,110,0.22)", borderRadius: 50, padding: "5px 16px 5px 8px", marginBottom: 36 }}>
              <div style={{ width: 22, height: 22, borderRadius: "50%", background: "rgba(201,169,110,0.18)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <div style={{ width: 7, height: 7, borderRadius: "50%", background: GOLD }} />
              </div>
              <span style={{ fontSize: 11, color: GOLD, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase" }}>Takes about 5 minutes</span>
            </div>

            <h1 style={{ fontSize: "clamp(34px,5.5vw,58px)", fontWeight: 800, color: "white", lineHeight: 1.12, marginBottom: 22, letterSpacing: "-0.5px" }}>
              Know what you owe.<br />
              <span style={{ color: LIGHT_GREEN }}>Give with clarity.</span>
            </h1>

            <p style={{ fontSize: 16, color: "rgba(255,255,255,0.52)", lineHeight: 1.85, maxWidth: 440 }}>
              A few numbers is all it takes. Zakatly handles the calculation — built on contemporary scholarly guidance, not guesswork.
            </p>
          </div>
        </div>

        {/* ── CHECKLIST ── */}
        <div style={{ maxWidth: 620, margin: "0 auto", padding: "clamp(36px,5vw,56px) 24px 48px" }}>

          {/* Section label */}
          <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 22 }}>
            <div style={{ flex: 1, height: 1, background: "linear-gradient(90deg, #c8ddd0, transparent)" }} />
            <span style={{ fontSize: 10, fontWeight: 800, color: "#7aaa8a", letterSpacing: "0.22em", textTransform: "uppercase", whiteSpace: "nowrap" }}>Have these ready</span>
            <div style={{ flex: 1, height: 1, background: "linear-gradient(270deg, #c8ddd0, transparent)" }} />
          </div>

          {/* 2-column grid, last item spans full width */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 32 }}>
            {items.map((item, i) => (
              <div key={item.title} style={{
                background: "white",
                borderRadius: 16,
                padding: "18px 20px",
                display: "flex", alignItems: "flex-start", gap: 14,
                border: "1px solid #e2efe8",
                boxShadow: "0 2px 16px rgba(15,36,25,0.05)",
                gridColumn: i === items.length - 1 ? "span 2" : undefined,
              }}>
                {/* Number badge */}
                <div style={{
                  width: 34, height: 34, borderRadius: 10,
                  background: DARK, flexShrink: 0,
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  <span style={{ fontSize: 13, fontWeight: 800, color: LIGHT_GREEN }}>{i + 1}</span>
                </div>
                <div style={{ paddingTop: 1 }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: DARK, marginBottom: 4 }}>{item.title}</div>
                  <div style={{ fontSize: 12, color: "#8a9e93", lineHeight: 1.55 }}>{item.desc}</div>
                </div>
              </div>
            ))}
          </div>

          {/* CTA button */}
          <button
            onClick={onStart}
            style={{
              width: "100%", background: GREEN, color: "white", border: "none",
              borderRadius: 14, padding: "0 24px", height: 60,
              fontSize: 16, fontWeight: 700, cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "space-between",
              transition: "background 0.2s",
            }}
            onMouseEnter={e => (e.currentTarget.style.background = "#246040")}
            onMouseLeave={e => (e.currentTarget.style.background = GREEN)}
          >
            <span />
            <span>I'm ready — let's calculate</span>
            <div style={{ width: 36, height: 36, borderRadius: "50%", background: "rgba(255,255,255,0.14)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 17 }}>→</div>
          </button>

          {/* Privacy note */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 7, marginTop: 18 }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#b0bfb6" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
            <span style={{ fontSize: 12, color: "#b0bfb6" }}>No account needed · Your data never leaves this device</span>
          </div>

        </div>
      </div>
    </>
  );
}

const liabilityCategories = [
  {
    icon: "🏠",
    title: "Housing",
    desc: "Upcoming rent or mortgage payment",
  },
  {
    icon: "🛡️",
    title: "Insurance",
    desc: "Upcoming home, auto, or medical insurance payment",
  },
  {
    icon: "💡",
    title: "Utilities",
    desc: "Upcoming energy, water, and internet bills",
  },
  {
    icon: "🚗",
    title: "Transportation",
    desc: "Upcoming car payment or lease",
  },
  {
    icon: "💳",
    title: "Credit Cards & Loans",
    desc: "Minimum payment due on credit cards, personal or student loans",
  },
];

function LiabilitiesExplainer() {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ marginBottom: 8 }}>
      <button
        onClick={() => setOpen((v) => !v)}
        style={{
          background: "none",
          border: "none",
          padding: 0,
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          gap: 6,
          color: "#2d7a4f",
          fontSize: 13,
          fontWeight: 600,
          fontFamily: "Open Sans, sans-serif",
        }}
      >
        <span
          style={{
            display: "inline-block",
            transition: "transform 0.2s",
            transform: open ? "rotate(90deg)" : "rotate(0deg)",
            fontSize: 11,
          }}
        >
          ▶
        </span>
        What can I include as a liability?
      </button>

      {open && (
        <div
          style={{
            marginTop: 12,
            background: "#f7fdf9",
            border: "1px solid #e0f0e8",
            borderRadius: 16,
            padding: "20px 20px 16px",
          }}
        >
          {/* Categories */}
          <p style={{ fontSize: 12, fontWeight: 700, color: "#2d7a4f", letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 12 }}>
            Examples of expenses
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 20 }}>
            {liabilityCategories.map((cat) => (
              <div key={cat.title} style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
                <span style={{ fontSize: 18, flexShrink: 0, marginTop: 1 }}>{cat.icon}</span>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: "#0f2419" }}>{cat.title}</div>
                  <div style={{ fontSize: 13, color: "#666", lineHeight: 1.5 }}>{cat.desc}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Rule */}
          <div
            style={{
              borderTop: "1px solid #e0f0e8",
              paddingTop: 14,
            }}
          >
            <p style={{ fontSize: 13, fontWeight: 700, color: "#0f2419", marginBottom: 6 }}>
              Your next upcoming payment is what gets deducted
            </p>
            <p style={{ fontSize: 13, color: "#666", lineHeight: 1.6, margin: 0 }}>
              Only deduct what is <strong>immediately due</strong> — meaning your next single payment, not the full outstanding balance. For example, if you pay car insurance monthly, deduct one month's premium, not the full year.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

function PassiveInvestmentToggle({
  rate,
  onChange,
}: {
  rate: 0.3 | 1.0
  onChange: (rate: 0.3 | 1.0) => void
}) {
  return (
    <div
      style={{
        background: "#f7fdf9",
        border: "1px solid #e0f0e8",
        borderRadius: 16,
        padding: "16px 18px",
        marginBottom: 8,
      }}
    >
      {/* Scholarly basis */}
      <p style={{ fontSize: 13, color: "#555", lineHeight: 1.6, marginBottom: 14 }}>
        By default we apply <strong>30%</strong> of the market value as zakatable —
        based on the methodology of{" "}
        <a
          href="https://joebradford.net/zakat-on-stocks-and-investments-a-complete-guide-for-brokerage-accounts/"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: "#2d7a4f", fontWeight: 600, textDecoration: "underline" }}
        >
          Sh. Joe Bradford
        </a>
        , who calculates Zakat on the zakatable assets held by the underlying company rather than the full market value.
      </p>

      {/* Toggle */}
      <div style={{ display: "flex", gap: 8, marginBottom: rate === 1.0 ? 12 : 0 }}>
        <button
          onClick={() => onChange(0.3)}
          style={{
            flex: 1,
            padding: "9px 0",
            borderRadius: 10,
            border: rate === 0.3 ? "2px solid #2d7a4f" : "2px solid #e5e7eb",
            background: rate === 0.3 ? "#2d7a4f" : "white",
            color: rate === 0.3 ? "white" : "#666",
            fontSize: 13,
            fontWeight: 700,
            cursor: "pointer",
            fontFamily: "Open Sans, sans-serif",
          }}
        >
          30% — Scholar method
        </button>
        <button
          onClick={() => onChange(1.0)}
          style={{
            flex: 1,
            padding: "9px 0",
            borderRadius: 10,
            border: rate === 1.0 ? "2px solid #2d7a4f" : "2px solid #e5e7eb",
            background: rate === 1.0 ? "#2d7a4f" : "white",
            color: rate === 1.0 ? "white" : "#666",
            fontSize: 13,
            fontWeight: 700,
            cursor: "pointer",
            fontFamily: "Open Sans, sans-serif",
          }}
        >
          100% — Full value
        </button>
      </div>

      {/* Disclaimer when 100% selected */}
      {rate === 1.0 && (
        <p style={{ fontSize: 12, color: "#888", lineHeight: 1.6, margin: 0 }}>
          ⚠️ Paying on 100% is the more cautious approach and is valid. However, most contemporary scholars consider it an overpayment for passive investments. This is your choice and both are acceptable.
        </p>
      )}
    </div>
  )
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
    passiveInvestmentRate,
    setPassiveInvestmentRate,
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
          className="calc-nav-btn border border-gray-200 text-gray-600 rounded-2xl font-semibold hover:bg-gray-50 transition-colors"
        >
          ← Previous
        </button>
        <button
          onClick={onNext}
          className="calc-nav-btn text-white rounded-2xl font-semibold transition-colors"
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
            <AssetInput
              id="cash"
              label="How much do you have in total?"
              tooltip="Include cash on hand and all bank accounts."
              value={assets.cash}
              onChange={(val) => updateAssets({ cash: val })}
              onEnter={nextStep}
            />
            <div className="mt-8">
              <div className="flex justify-end">
                <button
                  onClick={nextStep}
                  className="calc-nav-btn"
                  style={{
                    background: '#2d7a4f', color: 'white',
                    borderRadius: 50, fontWeight: 600, border: 'none',
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
              value={assets.passiveStocks}
              onChange={(val) => updateAssets({ passiveStocks: val })}
              onEnter={nextStep}
            />
            <PassiveInvestmentToggle
              rate={passiveInvestmentRate}
              onChange={setPassiveInvestmentRate}
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
              tooltip="Only include funds you can withdraw, even if a penalty applies."
              value={assets.retirementAccounts}
              onChange={(val) => updateAssets({ retirementAccounts: val })}
              onEnter={nextStep}
            />
            <PassiveInvestmentToggle
              rate={passiveInvestmentRate}
              onChange={setPassiveInvestmentRate}
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
            description="Enter the total of your immediately due expenses and debts."
            onEnter={calculate}
          >
            <AssetInput
              id="liabilities"
              label="How much do you owe in total?"
              value={assets.liabilities}
              onChange={(val) => updateAssets({ liabilities: val })}
              onEnter={calculate}
            />
            <LiabilitiesExplainer />

            <div className="mt-6">
              <div className="flex justify-between">
                <button
                  onClick={prevStep}
                  className="calc-nav-btn border border-gray-200 text-gray-600 rounded-2xl font-semibold hover:bg-gray-50 transition-colors"
                >
                  ← Previous
                </button>
                <button
                  onClick={calculate}
                  className="calc-nav-btn text-white rounded-2xl font-semibold transition-colors"
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
