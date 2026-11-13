"use client";

import { useState, useEffect } from "react";
import { useZakatCalculator } from "@/hooks/useZakatCalculator";
import { StepWrapper } from "@/components/calculator/StepWrapper";
import { AssetInput } from "@/components/calculator/AssetInput";
import { ZakatSummary } from "@/components/calculator/ZakatSummary";
import { InvestmentSelector } from "@/components/calculator/InvestmentSelector";
import { GoldSilverInput } from "@/components/calculator/GoldSilverInput";
import { ZakatTracker } from "@/components/calculator/ZakatTracker";
import { StepTrail } from "@/components/calculator/StepTrail";
import { TopNav } from "@/components/TopNav";
import { NisabStandard, Madhhab, PassiveStockRate, RetirementMethodRate } from "@/types/zakat.types";
import { useCalculatorStore } from "@/store/calculatorStore";

const FOREST = "#1E3F20";
const TEXT_DARK = "#141414";
const SUBTLE = "#6E6E6E";
const BORDER = "#E2E2D8";
const BG_LINEN = "#F5F5F0";
const CARD_BG = "#FFFFFF";

const MADHHAB_OPTIONS: {
  id: Madhhab;
  name: string;
  tag?: string;
  regionHint?: string;
  summary: string;
  defaultsNote: string;
}[] = [
  {
    id: "general",
    name: "General / Not Sure",
    tag: "Recommended",
    summary: "I just want the standard mainstream calculation. Personal jewelry worn daily is exempt.",
    defaultsNote: "Worn Jewelry Exempt · Gold Nisab · 30% Long-Term ETFs · 60% Net 401(k)",
  },
  {
    id: "hanafi",
    name: "Hanafi",
    regionHint: "Common in South Asia, Turkey & Central Asia",
    summary: "Counts all gold & silver jewelry (even worn daily) and uses the lower Silver threshold.",
    defaultsNote: "All Jewelry Included · Silver Nisab · 30% Long-Term ETFs · 60% Net 401(k)",
  },
  {
    id: "shafii_maliki_hanbali",
    name: "Shafi'i, Maliki & Hanbali",
    regionHint: "Common in the Arab World, Africa & SE Asia",
    summary: "Personal jewelry worn regularly is exempt—only gold or silver kept as savings counts.",
    defaultsNote: "Worn Jewelry Exempt · Gold Nisab · 30% Long-Term ETFs · 60% Net 401(k)",
  },
];

const items = [
  {
    title: "Bank & Cash",
    desc: "Checking, savings balances & cash on hand",
  },
  {
    title: "Investments",
    desc: "Stocks, crypto, 401k/IRA — most recent statement",
  },
  {
    title: "Gold & Silver",
    desc: "Weight (grams & karat purity) or USD value of gold/silver",
  },
  {
    title: "Money Owed To You",
    desc: "Loans you've given out that are likely to be repaid",
  },
  {
    title: "Short-Term Debts",
    desc: "Credit card balances & bills due in the next 30 days",
  },
];

function IntroPage({
  onStart,
}: {
  onStart: () => void;
}) {
  const madhhab = useCalculatorStore((s) => s.madhhab);
  const setMadhhab = useCalculatorStore((s) => s.setMadhhab);
  const [activeTooltipId, setActiveTooltipId] = useState<Madhhab | null>(null);

  useEffect(() => {
    if (!activeTooltipId) return;
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest?.("[data-tooltip-container]")) {
        setActiveTooltipId(null);
      }
    };
    window.addEventListener("click", handleClickOutside);
    return () => window.removeEventListener("click", handleClickOutside);
  }, [activeTooltipId]);

  return (
    <>
      <TopNav />
      <div
        style={{
          minHeight: "100vh",
          paddingTop: "clamp(75px, 8vw, 83px)",
          background: BG_LINEN,
          fontFamily: "Open Sans, -apple-system, BlinkMacSystemFont, sans-serif",
          color: TEXT_DARK,
        }}
      >
        {/* ── HERO ── */}
        <div
          style={{
            padding: "clamp(44px, 6vw, 68px) 24px clamp(24px, 3vw, 32px)",
            maxWidth: 720,
            margin: "0 auto",
            textAlign: "center",
          }}
        >
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              background: "#EBEBE5",
              border: "1px solid #DCDCD4",
              borderRadius: 4,
              padding: "5px 12px",
              marginBottom: 20,
            }}
          >
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: FOREST }} />
            <span
              style={{
                fontSize: 11,
                letterSpacing: 1.8,
                color: FOREST,
                textTransform: "uppercase",
                fontWeight: 800,
              }}
            >
              Personalized Scholarly Assessment
            </span>
          </div>

          <h1
            style={{
              fontSize: "clamp(34px, 5.2vw, 52px)",
              fontWeight: 900,
              letterSpacing: "-1.4px",
              lineHeight: 1.08,
              marginBottom: 14,
              color: TEXT_DARK,
            }}
          >
            Know what you owe.
            <br />
            <span style={{ color: FOREST }}>Give with clarity.</span>
          </h1>

          <p
            style={{
              fontSize: 16,
              color: SUBTLE,
              lineHeight: 1.7,
              maxWidth: 540,
              margin: "0 auto",
            }}
          >
            Select the calculation preference you follow below. We&apos;ll pre-configure all rulings across jewelry, Nisab, stocks, and retirement automatically.
          </p>
        </div>

        {/* ── SCHOOL OF THOUGHT SELECTOR + CHECKLIST ── */}
        <div
          style={{
            maxWidth: 660,
            margin: "0 auto",
            padding: "0 24px 72px",
          }}
        >
          {/* Step 1: Choose School of Thought (Compact with Hover Tooltip) */}
          <div
            style={{
              background: CARD_BG,
              border: `1.5px solid ${BORDER}`,
              borderRadius: 16,
              padding: "20px 22px",
              marginBottom: 28,
              boxShadow: "0 8px 24px rgba(20,20,20,0.03)",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 14,
                flexWrap: "wrap",
                gap: 8,
              }}
            >
              <span
                style={{
                  fontSize: 12,
                  fontWeight: 800,
                  color: FOREST,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                }}
              >
                1. Choose Your Calculation Preference
              </span>
              <span style={{ fontSize: 12, color: SUBTLE }}>
                Click ⓘ for details · Can be switched anytime
              </span>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
                gap: 10,
              }}
            >
              {MADHHAB_OPTIONS.map((opt, index) => {
                const isSelected = madhhab === opt.id;
                const isTooltipOpen = activeTooltipId === opt.id;

                // Tooltip positioning for 3-card single row:
                // Left card aligns left, middle card centers, right card aligns right
                const tooltipPosStyle: React.CSSProperties =
                  index === 0
                    ? { left: 0, right: "auto" }
                    : index === 1
                    ? { left: "50%", transform: "translateX(-50%)" }
                    : { left: "auto", right: 0 };

                return (
                  <div
                    key={opt.id}
                    data-tooltip-container="true"
                    style={{ position: "relative", height: "100%" }}
                  >
                    <button
                      type="button"
                      onClick={() => setMadhhab(opt.id)}
                      style={{
                        width: "100%",
                        height: "100%",
                        minHeight: 56,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        gap: 6,
                        padding: "10px 12px",
                        borderRadius: 12,
                        border: isSelected ? `2px solid ${FOREST}` : `1px solid ${BORDER}`,
                        background: isSelected ? "#F4F7F4" : "#FFFFFF",
                        textAlign: "left",
                        cursor: "pointer",
                        transition: "all 0.15s ease",
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: 5, minWidth: 0, flex: 1 }}>
                        <span
                          style={{
                            fontSize: 13,
                            fontWeight: 800,
                            color: isSelected ? FOREST : TEXT_DARK,
                            lineHeight: 1.25,
                            wordBreak: "break-word",
                          }}
                        >
                          {opt.name}
                        </span>
                        <span
                          role="button"
                          tabIndex={0}
                          aria-label={`View ${opt.name} calculation details`}
                          title="Click for details"
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveTooltipId((prev) => (prev === opt.id ? null : opt.id));
                          }}
                          onKeyDown={(e) => {
                            if (e.key === "Enter" || e.key === " ") {
                              e.stopPropagation();
                              e.preventDefault();
                              setActiveTooltipId((prev) => (prev === opt.id ? null : opt.id));
                            }
                          }}
                          style={{
                            width: 17,
                            height: 17,
                            borderRadius: "50%",
                            background: isTooltipOpen
                              ? FOREST
                              : isSelected
                              ? "rgba(30,63,32,0.14)"
                              : "#EFECE4",
                            color: isTooltipOpen ? "#FFFFFF" : isSelected ? FOREST : SUBTLE,
                            fontSize: 10,
                            fontWeight: 800,
                            display: "inline-flex",
                            alignItems: "center",
                            justifyContent: "center",
                            flexShrink: 0,
                            cursor: "pointer",
                            transition: "all 0.15s ease",
                          }}
                        >
                          i
                        </span>
                      </div>

                      <div
                        style={{
                          width: 18,
                          height: 18,
                          borderRadius: "50%",
                          border: isSelected ? `2px solid ${FOREST}` : `2px solid #CFCFCF`,
                          background: isSelected ? FOREST : "transparent",
                          color: "#FFFFFF",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: 10,
                          fontWeight: 800,
                          flexShrink: 0,
                        }}
                      >
                        {isSelected ? "✓" : ""}
                      </div>
                    </button>

                    {/* Click-to-Open Tooltip with Regional Info + Active Defaults */}
                    {isTooltipOpen && (
                      <div
                        style={{
                          position: "absolute",
                          bottom: "calc(100% + 10px)",
                          ...tooltipPosStyle,
                          width: "min(320px, calc(100vw - 56px))",
                          zIndex: 50,
                          background: "#102417",
                          color: "#FFFFFF",
                          borderRadius: 12,
                          padding: "14px 16px",
                          boxShadow: "0 16px 36px rgba(0,0,0,0.28)",
                          border: "1px solid rgba(197, 160, 89, 0.4)",
                          pointerEvents: "auto",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "flex-start",
                            marginBottom: 6,
                            gap: 8,
                          }}
                        >
                          {opt.tag ? (
                            <div
                              style={{
                                display: "inline-block",
                                background: "#C5A059",
                                color: "#102417",
                                fontSize: 10,
                                fontWeight: 800,
                                textTransform: "uppercase",
                                letterSpacing: 0.6,
                                padding: "2px 7px",
                                borderRadius: 4,
                              }}
                            >
                              {opt.tag}
                            </div>
                          ) : (
                            <div />
                          )}
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setActiveTooltipId(null);
                            }}
                            style={{
                              background: "transparent",
                              border: "none",
                              color: "rgba(255,255,255,0.6)",
                              fontSize: 18,
                              lineHeight: 1,
                              cursor: "pointer",
                              padding: "0 4px",
                              marginTop: -2,
                            }}
                            aria-label="Close details"
                            title="Close"
                          >
                            ×
                          </button>
                        </div>
                        {opt.regionHint && (
                          <div
                            style={{
                              fontSize: 11,
                              fontWeight: 700,
                              color: "#C5A059",
                              marginBottom: 5,
                            }}
                          >
                            {opt.regionHint}
                          </div>
                        )}
                        <div
                          style={{
                            fontSize: 12.5,
                            color: "rgba(255,255,255,0.9)",
                            lineHeight: 1.5,
                            marginBottom: 10,
                          }}
                        >
                          {opt.summary}
                        </div>
                        <div
                          style={{
                            borderTop: "1px solid rgba(255,255,255,0.14)",
                            paddingTop: 8,
                            fontSize: 11,
                            lineHeight: 1.45,
                            color: "rgba(255,255,255,0.7)",
                          }}
                        >
                          <strong style={{ color: "#86EFAC" }}>Active Defaults: </strong>
                          {opt.defaultsNote}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Section label */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 14,
              marginBottom: 20,
            }}
          >
            <div
              style={{
                flex: 1,
                height: 1,
                background: BORDER,
              }}
            />
            <span
              style={{
                fontSize: 11,
                fontWeight: 800,
                color: SUBTLE,
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                whiteSpace: "nowrap",
              }}
            >
              Have these ready
            </span>
            <div
              style={{
                flex: 1,
                height: 1,
                background: BORDER,
              }}
            />
          </div>

          {/* 2-column grid, last item spans full width */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 12,
              marginBottom: 28,
            }}
          >
            {items.map((item, i) => (
              <div
                key={item.title}
                style={{
                  background: CARD_BG,
                  borderRadius: 12,
                  padding: "18px 20px",
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 14,
                  border: `1px solid ${BORDER}`,
                  boxShadow: "0 2px 10px rgba(20,20,20,0.02)",
                  gridColumn: i === items.length - 1 ? "span 2" : undefined,
                }}
              >
                <div
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: 8,
                    background: FOREST,
                    flexShrink: 0,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <span
                    style={{
                      fontSize: 13,
                      fontWeight: 800,
                      color: "#FFFFFF",
                    }}
                  >
                    {i + 1}
                  </span>
                </div>
                <div style={{ paddingTop: 1 }}>
                  <div
                    style={{
                      fontSize: 14,
                      fontWeight: 700,
                      color: TEXT_DARK,
                      marginBottom: 3,
                    }}
                  >
                    {item.title}
                  </div>
                  <div
                    style={{
                      fontSize: 12,
                      color: SUBTLE,
                      lineHeight: 1.5,
                    }}
                  >
                    {item.desc}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* CTA button */}
          <button
            onClick={onStart}
            style={{
              width: "100%",
              background: FOREST,
              color: "#FFFFFF",
              border: "none",
              borderRadius: 10,
              padding: "0 24px",
              height: 56,
              fontSize: 15,
              fontWeight: 700,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              boxShadow: "0 4px 16px rgba(30,63,32,0.22)",
              transition: "transform 0.15s ease",
            }}
          >
            <span />
            <span>I&apos;m ready — let&apos;s calculate</span>
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: "50%",
                background: "rgba(255,255,255,0.18)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 16,
              }}
            >
              →
            </div>
          </button>

          {/* Privacy note */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 7,
              marginTop: 18,
            }}
          >
            <svg
              width="13"
              height="13"
              viewBox="0 0 24 24"
              fill="none"
              stroke={SUBTLE}
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="3" y="11" width="18" height="11" rx="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
            <span style={{ fontSize: 12, color: SUBTLE }}>
              No account needed · Your data stays private on your device
            </span>
          </div>
        </div>
      </div>
    </>
  );
}

const liabilityCategories = [
  {
    title: "Housing",
    desc: "Upcoming rent or mortgage payment",
  },
  {
    title: "Insurance",
    desc: "Upcoming home, auto, or medical insurance payment",
  },
  {
    title: "Utilities",
    desc: "Upcoming energy, water, and internet bills",
  },
  {
    title: "Transportation",
    desc: "Upcoming car payment or lease",
  },
  {
    title: "Credit Cards & Loans",
    desc: "Minimum payment due on credit cards, personal or student loans",
  },
];

function JewelryExplainer() {
  const madhhab = useCalculatorStore((s) => s.madhhab);
  const includeWornJewelry = useCalculatorStore((s) => s.includeWornJewelry);
  const setIncludeWornJewelry = useCalculatorStore((s) => s.setIncludeWornJewelry);
  const [open, setOpen] = useState(false);

  const schoolName =
    MADHHAB_OPTIONS.find((m) => m.id === madhhab)?.name ?? "Hanafi";

  return (
    <div
      style={{
        background: "#FAF9F5",
        border: `1px solid ${BORDER}`,
        borderRadius: 12,
        padding: "13px 16px",
        marginBottom: 8,
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 12,
          flexWrap: "wrap",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13 }}>
          <span
            style={{
              background: "#EDF3EE",
              color: FOREST,
              fontWeight: 800,
              fontSize: 11,
              padding: "3px 8px",
              borderRadius: 6,
              textTransform: "uppercase",
              letterSpacing: 0.4,
            }}
          >
            {schoolName} Default
          </span>
          <span style={{ color: TEXT_DARK, fontWeight: 600 }}>
            {includeWornJewelry
              ? "Include all gold & silver (including worn personal jewelry)"
              : "Worn personal jewelry is exempt (enter only bullion/coins/savings)"}
          </span>
        </div>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          style={{
            background: "none",
            border: "none",
            padding: 0,
            color: FOREST,
            fontSize: 12.5,
            fontWeight: 700,
            cursor: "pointer",
            whiteSpace: "nowrap",
          }}
        >
          {open ? "Hide ▲" : "Change / Details ▾"}
        </button>
      </div>

      {open && (
        <div
          style={{
            marginTop: 12,
            paddingTop: 12,
            borderTop: `1px solid ${BORDER}`,
            fontSize: 12.5,
            color: SUBTLE,
            lineHeight: 1.6,
          }}
        >
          <div style={{ display: "flex", gap: 8, marginBottom: 10 }}>
            <button
              type="button"
              onClick={() => setIncludeWornJewelry(true)}
              style={{
                flex: 1,
                padding: "8px 12px",
                borderRadius: 8,
                border: includeWornJewelry ? `2px solid ${FOREST}` : `1px solid ${BORDER}`,
                background: includeWornJewelry ? FOREST : "#FFFFFF",
                color: includeWornJewelry ? "#FFFFFF" : TEXT_DARK,
                fontSize: 12,
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              Include Worn Jewelry (Hanafi)
            </button>
            <button
              type="button"
              onClick={() => setIncludeWornJewelry(false)}
              style={{
                flex: 1,
                padding: "8px 12px",
                borderRadius: 8,
                border: !includeWornJewelry ? `2px solid ${FOREST}` : `1px solid ${BORDER}`,
                background: !includeWornJewelry ? FOREST : "#FFFFFF",
                color: !includeWornJewelry ? "#FFFFFF" : TEXT_DARK,
                fontSize: 12,
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              Exempt Worn Jewelry (Shafi&apos;i / Majority)
            </button>
          </div>
          <p style={{ margin: 0 }}>
            <strong>Hanafi:</strong> All gold &amp; silver jewelry is zakatable.{" "}
            <strong>Shafi&apos;i, Maliki &amp; Hanbali:</strong> Permissible jewelry worn regularly for personal adornment is exempt; only bullion, coins, or investment jewelry is zakatable.
          </p>
        </div>
      )}
    </div>
  );
}

function LiabilitiesExplainer() {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ marginBottom: 8 }}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        style={{
          background: "none",
          border: "none",
          padding: 0,
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          gap: 6,
          color: FOREST,
          fontSize: 13,
          fontWeight: 700,
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
            background: "#FFFFFF",
            border: `1px solid ${BORDER}`,
            borderRadius: 14,
            padding: "20px 20px 16px",
          }}
        >
          <p
            style={{
              fontSize: 11,
              fontWeight: 800,
              color: FOREST,
              letterSpacing: 1.5,
              textTransform: "uppercase",
              marginBottom: 12,
            }}
          >
            Examples of expenses
          </p>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 10,
              marginBottom: 20,
            }}
          >
            {liabilityCategories.map((cat) => (
              <div
                key={cat.title}
                style={{ display: "flex", alignItems: "flex-start", gap: 10 }}
              >
                <div
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: "50%",
                    background: FOREST,
                    marginTop: 6,
                    flexShrink: 0,
                  }}
                />
                <div>
                  <div
                    style={{ fontSize: 13, fontWeight: 700, color: TEXT_DARK }}
                  >
                    {cat.title}
                  </div>
                  <div style={{ fontSize: 12, color: SUBTLE, lineHeight: 1.5 }}>
                    {cat.desc}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div
            style={{
              borderTop: `1px solid ${BORDER}`,
              paddingTop: 14,
            }}
          >
            <p
              style={{
                fontSize: 13,
                fontWeight: 700,
                color: TEXT_DARK,
                marginBottom: 6,
              }}
            >
              Your next upcoming payment is what gets deducted
            </p>
            <p
              style={{
                fontSize: 13,
                color: SUBTLE,
                lineHeight: 1.6,
                margin: 0,
              }}
            >
              Only deduct what is <strong>immediately due</strong> — meaning
              your next single payment, not the full outstanding multi-year
              mortgage or student loan balance.
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
  rate: PassiveStockRate;
  onChange: (rate: PassiveStockRate) => void;
}) {
  const madhhab = useCalculatorStore((s) => s.madhhab);
  const [open, setOpen] = useState(false);
  const schoolName =
    MADHHAB_OPTIONS.find((m) => m.id === madhhab)?.name ?? "Hanafi";

  return (
    <div
      style={{
        background: "#FAF9F5",
        border: `1px solid ${BORDER}`,
        borderRadius: 12,
        padding: "13px 16px",
        marginBottom: 8,
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 12,
          flexWrap: "wrap",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13 }}>
          <span
            style={{
              background: "#EDF3EE",
              color: FOREST,
              fontWeight: 800,
              fontSize: 11,
              padding: "3px 8px",
              borderRadius: 6,
              textTransform: "uppercase",
              letterSpacing: 0.4,
            }}
          >
            {schoolName} Default
          </span>
          <span style={{ color: TEXT_DARK, fontWeight: 600 }}>
            {rate === 0.3
              ? "30% Scholarly Liquid Asset Proxy applied to passive ETFs"
              : "100% Full Market Value applied to passive ETFs"}
          </span>
        </div>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          style={{
            background: "none",
            border: "none",
            padding: 0,
            color: FOREST,
            fontSize: 12.5,
            fontWeight: 700,
            cursor: "pointer",
            whiteSpace: "nowrap",
          }}
        >
          {open ? "Hide ▲" : "Change ▾"}
        </button>
      </div>

      {open && (
        <div
          style={{
            marginTop: 12,
            paddingTop: 12,
            borderTop: `1px solid ${BORDER}`,
          }}
        >
          <p
            style={{
              fontSize: 12.5,
              color: SUBTLE,
              lineHeight: 1.6,
              marginBottom: 12,
            }}
          >
            By default we apply <strong>30%</strong> of the market value as zakatable for long-term index funds/ETFs (AAOIFI &amp; Sh. Joe Bradford consensus), which assesses the liquid assets held by the underlying companies.
          </p>

          <div style={{ display: "flex", gap: 8 }}>
            <button
              type="button"
              onClick={() => onChange(0.3)}
              style={{
                flex: 1,
                padding: "9px 12px",
                borderRadius: 8,
                border: rate === 0.3 ? `2px solid ${FOREST}` : `1px solid ${BORDER}`,
                background: rate === 0.3 ? FOREST : "#FFFFFF",
                color: rate === 0.3 ? "#FFFFFF" : TEXT_DARK,
                fontSize: 12.5,
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              30% — Scholar Proxy (Default)
            </button>
            <button
              type="button"
              onClick={() => onChange(1.0)}
              style={{
                flex: 1,
                padding: "9px 12px",
                borderRadius: 8,
                border: rate === 1.0 ? `2px solid ${FOREST}` : `1px solid ${BORDER}`,
                background: rate === 1.0 ? FOREST : "#FFFFFF",
                color: rate === 1.0 ? "#FFFFFF" : TEXT_DARK,
                fontSize: 12.5,
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              100% — Full Value
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function RetirementMethodToggle({
  rate,
  onChange,
}: {
  rate: RetirementMethodRate;
  onChange: (rate: RetirementMethodRate) => void;
}) {
  const madhhab = useCalculatorStore((s) => s.madhhab);
  const [open, setOpen] = useState(false);
  const schoolName =
    MADHHAB_OPTIONS.find((m) => m.id === madhhab)?.name ?? "Hanafi";

  const options: { value: RetirementMethodRate; label: string; sub: string }[] =
    [
      {
        value: 0.6,
        label: "60% — Net Accessible (Default)",
        sub: "Deducts ~30% income tax + 10% early withdrawal penalty",
      },
      {
        value: 0.3,
        label: "30% — Equity Proxy",
        sub: "Applies 30% underlying liquid asset rule for equity funds",
      },
      {
        value: 1.0,
        label: "100% — Full Balance",
        sub: "No deduction for taxes, penalties, or illiquid holdings",
      },
    ];

  return (
    <div
      style={{
        background: "#FAF9F5",
        border: `1px solid ${BORDER}`,
        borderRadius: 12,
        padding: "13px 16px",
        marginBottom: 8,
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 12,
          flexWrap: "wrap",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13 }}>
          <span
            style={{
              background: "#EDF3EE",
              color: FOREST,
              fontWeight: 800,
              fontSize: 11,
              padding: "3px 8px",
              borderRadius: 6,
              textTransform: "uppercase",
              letterSpacing: 0.4,
            }}
          >
            {schoolName} Default
          </span>
          <span style={{ color: TEXT_DARK, fontWeight: 600 }}>
            {rate === 0.6
              ? "60% Net Accessible (deducts estimated taxes & 10% early penalty)"
              : rate === 0.3
              ? "30% Underlying Equity Liquid Asset Proxy"
              : "100% Full Gross Balance"}
          </span>
        </div>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          style={{
            background: "none",
            border: "none",
            padding: 0,
            color: FOREST,
            fontSize: 12.5,
            fontWeight: 700,
            cursor: "pointer",
            whiteSpace: "nowrap",
          }}
        >
          {open ? "Hide ▲" : "Change ▾"}
        </button>
      </div>

      {open && (
        <div
          style={{
            marginTop: 12,
            paddingTop: 12,
            borderTop: `1px solid ${BORDER}`,
            display: "flex",
            flexDirection: "column",
            gap: 8,
          }}
        >
          {options.map((opt) => {
            const active = rate === opt.value;
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => onChange(opt.value)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "10px 14px",
                  borderRadius: 10,
                  border: active ? `2px solid ${FOREST}` : `1px solid ${BORDER}`,
                  background: active ? FOREST : "#FFFFFF",
                  color: active ? "#FFFFFF" : TEXT_DARK,
                  textAlign: "left",
                  cursor: "pointer",
                  fontFamily: "Open Sans, sans-serif",
                }}
              >
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700 }}>{opt.label}</div>
                  <div
                    style={{
                      fontSize: 11,
                      color: active ? "rgba(255,255,255,0.85)" : SUBTLE,
                      marginTop: 2,
                    }}
                  >
                    {opt.sub}
                  </div>
                </div>
                <div
                  style={{
                    width: 18,
                    height: 18,
                    borderRadius: "50%",
                    border: active ? "2px solid white" : `2px solid ${BORDER}`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  {active && (
                    <div
                      style={{
                        width: 8,
                        height: 8,
                        borderRadius: "50%",
                        background: "white",
                      }}
                    />
                  )}
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default function CalculatorPage() {
  const [started, setStarted] = useState(false);
  const {
    currentStep,
    currentStepName,
    totalSteps,
    assets,
    result,
    nisabData,
    nisabStandard,
    passiveInvestmentRate,
    setPassiveInvestmentRate,
    retirementRate,
    setRetirementRate,
    selectedInvestments,
    isEditing,
    visitedSteps,
    skipIntro,
    isLoading,
    isError,
    nextStep,
    prevStep,
    calculate,
    goToStep,
    editFromSummary,
    backToSummary,
    updateAssets,
    setNisabStandard,
    setSelectedInvestments,
    reset,
  } = useZakatCalculator();

  if (!started && !skipIntro) {
    return (
      <IntroPage
        onStart={() => setStarted(true)}
      />
    );
  }

  if (isLoading) {
    return (
      <>
        <TopNav />
        <div
          className="min-h-screen flex items-center justify-center"
          style={{ background: BG_LINEN, paddingTop: "clamp(75px, 8vw, 83px)" }}
        >
          <p style={{ color: FOREST, fontSize: 16, fontWeight: 600 }}>
            Fetching current gold &amp; silver prices...
          </p>
        </div>
      </>
    );
  }

  if (isError) {
    return (
      <>
        <TopNav />
        <div
          className="min-h-screen flex flex-col items-center justify-center gap-4"
          style={{ background: BG_LINEN, paddingTop: "clamp(75px, 8vw, 83px)" }}
        >
          <p style={{ color: SUBTLE, fontSize: 16 }}>
            Could not fetch live prices. Using fallback values.
          </p>
          <button
            onClick={nextStep}
            style={{
              background: FOREST,
              color: "#FFFFFF",
              padding: "12px 24px",
              borderRadius: 8,
              fontSize: 14,
              fontWeight: 700,
              border: "none",
              cursor: "pointer",
            }}
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
        <div style={{ paddingTop: "clamp(75px, 8vw, 83px)" }}>
          <ZakatSummary
            result={result}
            onReset={reset}
            onBack={prevStep}
            onEdit={editFromSummary}
          />
        </div>
      </>
    );
  }

  const navButtons = (onNext: () => void, isFirstStep = false) => (
    <div style={{ marginTop: 28, borderTop: `1px solid ${BORDER}`, paddingTop: 22 }}>
      <div className="flex justify-between items-center gap-3 flex-wrap">
        {!isFirstStep ? (
          <button
            type="button"
            onClick={prevStep}
            className="calc-nav-btn font-semibold transition-colors"
            style={{
              background: "#FFFFFF",
              border: `1px solid ${BORDER}`,
              color: TEXT_DARK,
              borderRadius: 10,
              padding: "12px 24px",
              cursor: "pointer",
            }}
          >
            ← Previous
          </button>
        ) : (
          <div />
        )}

        <div className="flex items-center gap-3">
          {isEditing && (
            <button
              type="button"
              onClick={backToSummary}
              className="calc-nav-btn font-semibold transition-colors"
              style={{
                background: TEXT_DARK,
                color: "#FFFFFF",
                border: "none",
                borderRadius: 10,
                padding: "12px 24px",
                cursor: "pointer",
              }}
            >
              Save &amp; Return to Results →
            </button>
          )}
          <button
            type="button"
            onClick={onNext}
            className="calc-nav-btn text-white font-semibold transition-colors"
            style={{
              background: FOREST,
              borderRadius: 10,
              padding: "12px 28px",
              cursor: "pointer",
              boxShadow: "0 2px 10px rgba(30,63,32,0.2)",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "#28522A")}
            onMouseLeave={(e) => (e.currentTarget.style.background = FOREST)}
          >
            Next →
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <TopNav />
      <div
        className="min-h-screen flex flex-col"
        style={{
          background: BG_LINEN,
          paddingTop: "clamp(92px, 10vw, 112px)",
          paddingBottom: "clamp(48px, 6vw, 72px)",
          paddingLeft: "clamp(14px, 3vw, 24px)",
          paddingRight: "clamp(14px, 3vw, 24px)",
        }}
      >
        <div
          className="calc-rail-shell"
          style={{
            display: "grid",
            gridTemplateColumns: "280px 1fr",
            minHeight: 580,
            maxWidth: 1140,
            width: "100%",
            margin: "0 auto",
            background: "#FFFFFF",
            borderRadius: 22,
            border: `1px solid ${BORDER}`,
            overflow: "hidden",
            boxShadow: "0 24px 60px rgba(18, 22, 20, 0.07)",
          }}
        >
          {/* Left Vertical Assessment Progress & Live Zakat Rail */}
          <StepTrail
            currentStepName={currentStepName}
            visitedSteps={visitedSteps}
            onGoToStep={goToStep}
            assets={assets}
            nisabData={nisabData ?? null}
            passiveInvestmentRate={passiveInvestmentRate}
            retirementRate={retirementRate}
          />

          {/* Right Main Form Canvas */}
          <div className="flex-1 flex flex-col" style={{ minWidth: 0 }}>
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
                    tooltip="Include physical cash on hand and all personal checking/savings bank accounts."
                    value={assets.cash}
                    onChange={(val) => updateAssets({ cash: val })}
                    onEnter={nextStep}
                    itemPlaceholders={[
                      "e.g. Checking account",
                      "e.g. High-yield savings",
                    ]}
                  />
                  {navButtons(nextStep, true)}
                </StepWrapper>
              )}

              {currentStepName === "goldsilver" && (
                <StepWrapper
                  currentStep={currentStep}
                  totalSteps={totalSteps}
                  title="Gold & Silver"
                  description="Enter current value or weight in grams. Spot prices update automatically."
                  headerBadge={
                    <span
                      style={{
                        background: "#F4EFE4",
                        color: "#8C6D2F",
                        padding: "6px 12px",
                        borderRadius: 8,
                        fontSize: 12,
                        fontWeight: 700,
                        whiteSpace: "nowrap",
                      }}
                    >
                      24K Spot: ${(nisabData?.goldPriceUSD ?? 161.9).toFixed(2)}/g
                    </span>
                  }
                  onEnter={nextStep}
                >
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns:
                        "repeat(auto-fit, minmax(min(100%, 240px), 1fr))",
                      gap: 20,
                      marginBottom: 20,
                    }}
                  >
                    <GoldSilverInput
                      id="gold"
                      label="Gold Holdings"
                      pricePerGram={nisabData?.goldPriceUSD ?? 161.9}
                      value={assets.gold}
                      onChange={(val) => updateAssets({ gold: val })}
                      onEnter={nextStep}
                    />
                    <GoldSilverInput
                      id="silver"
                      label="Silver Holdings"
                      pricePerGram={nisabData?.silverPriceUSD ?? 2.68}
                      value={assets.silver}
                      onChange={(val) => updateAssets({ silver: val })}
                      onEnter={nextStep}
                    />
                  </div>
                  <JewelryExplainer />
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
                description="Enter the value of your stock and ETF investments."
                onEnter={nextStep}
              >
                <AssetInput
                  id="stocks"
                  label="Active stocks — intention to trade within 12 months"
                  tooltip="Treat short-term trading portfolios like cash. Enter 100% of current market value."
                  value={assets.stocks}
                  onChange={(val) => updateAssets({ stocks: val })}
                  onEnter={nextStep}
                  itemPlaceholders={[
                    "e.g. Individual trading stocks",
                    "e.g. Brokerage cash & swing trades",
                  ]}
                />
                <AssetInput
                  id="passiveStocks"
                  label="Passive stocks — long-term ETFs & index holdings"
                  value={assets.passiveStocks}
                  onChange={(val) => updateAssets({ passiveStocks: val })}
                  onEnter={nextStep}
                  itemPlaceholders={[
                    "e.g. S&P 500 / Halal ETF",
                    "e.g. Long-term brokerage account",
                  ]}
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
                description="Zakat is due on the current market value of your liquid crypto holdings."
                onEnter={nextStep}
              >
                <AssetInput
                  id="crypto"
                  label="What is your total crypto portfolio worth?"
                  tooltip="Enter the current USD value of all your crypto holdings combined."
                  value={assets.crypto}
                  onChange={(val) => updateAssets({ crypto: val })}
                  onEnter={nextStep}
                  itemPlaceholders={["e.g. Bitcoin (BTC)", "e.g. Ethereum (ETH)"]}
                />
                {navButtons(nextStep)}
              </StepWrapper>
            )}

            {currentStepName === "retirement" && (
              <StepWrapper
                currentStep={currentStep}
                totalSteps={totalSteps}
                title="Pension & Retirement"
                description="Enter the balance of vested retirement accounts (401k, IRA) you can access."
                onEnter={nextStep}
              >
                <AssetInput
                  id="retirementAccounts"
                  label="What is the gross vested value of your retirement accounts?"
                  tooltip="Include vested 401(k), Traditional/Roth IRA, or defined-contribution accounts."
                  value={assets.retirementAccounts}
                  onChange={(val) => updateAssets({ retirementAccounts: val })}
                  onEnter={nextStep}
                  itemPlaceholders={["e.g. Employer 401(k)", "e.g. Roth / Trad IRA"]}
                />
                <RetirementMethodToggle
                  rate={retirementRate}
                  onChange={setRetirementRate}
                />
                {navButtons(nextStep)}
              </StepWrapper>
            )}

            {currentStepName === "business" && (
              <StepWrapper
                currentStep={currentStep}
                totalSteps={totalSteps}
                title="Business Inventory"
                description="Enter the value of goods held for sale and liquid business cash."
                onEnter={nextStep}
              >
                <AssetInput
                  id="businessInventory"
                  label="What is your business inventory & cash worth?"
                  tooltip="Include sellable inventory, work-in-progress goods, and business bank balances. Exclude fixed equipment/furniture."
                  value={assets.businessInventory}
                  onChange={(val) => updateAssets({ businessInventory: val })}
                  onEnter={nextStep}
                  itemPlaceholders={[
                    "e.g. Unsold inventory",
                    "e.g. Business bank balance",
                  ]}
                />
                {navButtons(nextStep)}
              </StepWrapper>
            )}

            {currentStepName === "receivables" && (
              <StepWrapper
                currentStep={currentStep}
                totalSteps={totalSteps}
                title="Money Owed to You"
                description="Include personal loans or invoices owed to you that you confidently expect to be repaid."
                onEnter={nextStep}
              >
                <AssetInput
                  id="moneyOwed"
                  label="How much is owed to you in total?"
                  tooltip="Strong debts (dayn qawi) such as personal loans to solvent borrowers or due client invoices."
                  value={assets.moneyOwed}
                  onChange={(val) => updateAssets({ moneyOwed: val })}
                  onEnter={nextStep}
                  itemPlaceholders={[
                    "e.g. Personal loan to family/friend",
                    "e.g. Due client invoice",
                  ]}
                />
                {navButtons(nextStep)}
              </StepWrapper>
            )}

            {currentStepName === "debts" && (
              <StepWrapper
                currentStep={currentStep}
                totalSteps={totalSteps}
                title="Liabilities"
                description="Enter the total of your immediately due expenses and short-term debts."
                onEnter={calculate}
              >
                <AssetInput
                  id="liabilities"
                  label="How much do you owe in immediate bills & short-term debt?"
                  value={assets.liabilities}
                  onChange={(val) => updateAssets({ liabilities: val })}
                  onEnter={calculate}
                  itemPlaceholders={[
                    "e.g. Next month's rent / mortgage",
                    "e.g. Credit card statement balance",
                  ]}
                />
                <LiabilitiesExplainer />

                <div className="mt-6">
                  <div className="flex justify-between items-center">
                    <button
                      type="button"
                      onClick={prevStep}
                      className="calc-nav-btn font-semibold transition-colors"
                      style={{
                        background: "#FFFFFF",
                        border: `1px solid ${BORDER}`,
                        color: TEXT_DARK,
                        borderRadius: 10,
                        padding: "12px 24px",
                        cursor: "pointer",
                      }}
                    >
                      ← Previous
                    </button>
                    <button
                      type="button"
                      onClick={calculate}
                      className="calc-nav-btn text-white font-semibold transition-colors"
                      style={{
                        background: FOREST,
                        borderRadius: 10,
                        padding: "12px 28px",
                        cursor: "pointer",
                        boxShadow: "0 2px 10px rgba(30,63,32,0.2)",
                      }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.background = "#28522A")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.background = FOREST)
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
      </div>
    </>
  );
}
