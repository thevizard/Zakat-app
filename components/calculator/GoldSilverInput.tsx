"use client";

import { useState, useEffect } from "react";
import { useCalculatorStore } from "@/store/calculatorStore";
import { GoldKarat } from "@/types/zakat.types";

interface GoldSilverInputProps {
  id: "gold" | "silver";
  label: string;
  pricePerGram: number;
  value: number;
  onChange: (value: number) => void;
  onEnter?: () => void;
}

const KARAT_OPTIONS: { karat: GoldKarat; label: string; purity: string }[] = [
  { karat: 24, label: "24K", purity: "100% pure" },
  { karat: 22, label: "22K", purity: "91.7%" },
  { karat: 21, label: "21K", purity: "87.5%" },
  { karat: 18, label: "18K", purity: "75.0%" },
  { karat: 14, label: "14K", purity: "58.3%" },
];

export function GoldSilverInput({
  id,
  label,
  pricePerGram,
  value,
  onChange,
  onEnter,
}: GoldSilverInputProps) {
  const meta = useCalculatorStore((s) => s.metalMeta[id]);
  const setMetalMeta = useCalculatorStore((s) => s.setMetalMeta);

  const mode = meta?.mode ?? "usd";
  const karat: GoldKarat = meta?.karat ?? 24;

  const [display, setDisplay] = useState<string>(() => {
    if (meta?.rawInput !== undefined && meta.rawInput !== "") {
      return meta.rawInput;
    }
    return value ? value.toLocaleString("en-US") : "";
  });

  useEffect(() => {
    if (value === 0 && (!meta?.rawInput || meta.rawInput === "")) {
      setDisplay("");
    }
  }, [value, meta?.rawInput]);

  const effectivePricePerGram =
    id === "gold" && mode === "grams"
      ? pricePerGram * (karat / 24)
      : pricePerGram;

  function switchMode(newMode: "usd" | "grams") {
    if (newMode === mode) return;
    const numeric = parseFloat(display.replace(/,/g, ""));
    if (!isNaN(numeric) && numeric > 0) {
      if (newMode === "grams") {
        // Convert existing USD value to grams at current karat price
        const rate = id === "gold" ? pricePerGram * (karat / 24) : pricePerGram;
        const grams = parseFloat((numeric / rate).toFixed(2));
        const raw = grams.toString();
        setDisplay(raw);
        setMetalMeta(id, { mode: "grams", rawInput: raw });
      } else {
        // Convert existing grams to USD value
        const usd = parseFloat((numeric * effectivePricePerGram).toFixed(2));
        const raw = usd.toLocaleString("en-US", { maximumFractionDigits: 2 });
        setDisplay(raw);
        setMetalMeta(id, { mode: "usd", rawInput: raw });
        onChange(usd);
      }
    } else {
      setDisplay("");
      setMetalMeta(id, { mode: newMode, rawInput: "" });
      onChange(0);
    }
  }

  function handleKaratChange(newKarat: GoldKarat) {
    setMetalMeta(id, { karat: newKarat });
    const numeric = parseFloat(display.replace(/,/g, ""));
    if (!isNaN(numeric) && numeric > 0 && mode === "grams") {
      const newRate = pricePerGram * (newKarat / 24);
      onChange(parseFloat((numeric * newRate).toFixed(2)));
    }
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const raw = e.target.value;
    if (!/^[\d,]*\.?\d*$/.test(raw)) return;
    setDisplay(raw);
    setMetalMeta(id, { rawInput: raw });

    const num = parseFloat(raw.replace(/,/g, ""));
    if (isNaN(num)) {
      onChange(0);
    } else {
      onChange(
        mode === "grams"
          ? parseFloat((num * effectivePricePerGram).toFixed(2))
          : num
      );
    }
  }

  function handleBlur() {
    const numeric = parseFloat(display.replace(/,/g, ""));
    if (!isNaN(numeric)) {
      const formatted = numeric.toLocaleString("en-US", {
        minimumFractionDigits: display.includes(".") ? 2 : 0,
        maximumFractionDigits: 2,
      });
      setDisplay(formatted);
      setMetalMeta(id, { rawInput: formatted });
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" && onEnter) {
      e.preventDefault();
      e.stopPropagation();
      onEnter();
    }
  }

  const gramsEntered =
    mode === "grams" && display !== ""
      ? parseFloat(display.replace(/,/g, ""))
      : null;

  return (
    <div
      style={{
        border: "1.5px solid #E2DFD5",
        borderRadius: 16,
        padding: 22,
        background: "#FFFFFF",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
      <div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 8,
            marginBottom: 14,
            flexWrap: "wrap",
          }}
        >
          <span style={{ fontSize: 15.5, fontWeight: 800, color: "#121614" }}>
            {id === "gold" ? "Gold Holdings" : "Silver Holdings"}
          </span>

          <div style={{ display: "flex", gap: 4 }}>
            <button
              type="button"
              onClick={() => switchMode("usd")}
              style={{
                padding: "5px 11px",
                fontSize: 11,
                fontWeight: 800,
                borderRadius: 6,
                border: "none",
                background: mode === "usd" ? "#16351F" : "#EAE6DC",
                color: mode === "usd" ? "#FFFFFF" : "#121614",
                cursor: "pointer",
                transition: "all 0.15s ease",
              }}
            >
              USD
            </button>
            <button
              type="button"
              onClick={() => switchMode("grams")}
              style={{
                padding: "5px 11px",
                fontSize: 11,
                fontWeight: 800,
                borderRadius: 6,
                border: "none",
                background: mode === "grams" ? "#16351F" : "#EAE6DC",
                color: mode === "grams" ? "#FFFFFF" : "#121614",
                cursor: "pointer",
                transition: "all 0.15s ease",
              }}
            >
              GRAMS
            </button>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            background: "#F7F5EF",
            border: "1px solid #E2DFD5",
            borderRadius: 12,
            padding: "13px 16px",
          }}
        >
          {mode === "usd" && (
            <span
              style={{
                fontSize: 19,
                fontWeight: 800,
                color: "#5A625D",
                marginRight: 8,
              }}
            >
              $
            </span>
          )}
          <input
            id={id}
            type="text"
            inputMode="decimal"
            value={display}
            placeholder="0"
            onChange={handleChange}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            style={{
              width: "100%",
              border: "none",
              outline: "none",
              background: "transparent",
              fontSize: 22,
              fontWeight: 800,
              color: "#121614",
            }}
          />
          {mode === "grams" && (
            <span
              style={{
                fontSize: 15,
                fontWeight: 700,
                color: "#5A625D",
                marginLeft: 8,
                whiteSpace: "nowrap",
              }}
            >
              g {id === "gold" ? `(${karat}K)` : ""}
            </span>
          )}
        </div>

        {id === "gold" && mode === "grams" && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 6,
              marginTop: 12,
              flexWrap: "wrap",
            }}
          >
            <span style={{ fontSize: 11, fontWeight: 700, color: "#5A625D" }}>
              PURITY:
            </span>
            <div style={{ display: "flex", gap: 4 }}>
              {KARAT_OPTIONS.map((opt) => (
                <button
                  key={opt.karat}
                  type="button"
                  onClick={() => handleKaratChange(opt.karat)}
                  title={opt.purity}
                  style={{
                    padding: "3px 8px",
                    borderRadius: 6,
                    fontSize: 11,
                    fontWeight: 800,
                    border:
                      karat === opt.karat
                        ? "1px solid #C5A059"
                        : "1px solid #E2DFD5",
                    background: karat === opt.karat ? "#C5A059" : "#FFFFFF",
                    color: karat === opt.karat ? "#102417" : "#5A625D",
                    cursor: "pointer",
                  }}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {mode === "grams" &&
          gramsEntered !== null &&
          !isNaN(gramsEntered) &&
          gramsEntered > 0 && (
            <p
              style={{
                fontSize: 12.5,
                color: "#5A625D",
                marginTop: 10,
                marginBottom: 0,
              }}
            >
              ≈{" "}
              <strong style={{ color: "#16351F" }}>
                $
                {(gramsEntered * effectivePricePerGram).toLocaleString("en-US", {
                  maximumFractionDigits: 2,
                })}
              </strong>{" "}
              USD
              {id === "gold" && karat !== 24
                ? ` (${karat}K purity)`
                : ""}
            </p>
          )}
      </div>

      <p
        style={{
          fontSize: 11.5,
          color: "#7A827D",
          marginTop: 12,
          marginBottom: 0,
        }}
      >
        Spot rate: ${pricePerGram.toFixed(2)}/g
        {id === "gold" && mode === "grams" && karat !== 24
          ? ` · ${karat}K: $${effectivePricePerGram.toFixed(2)}/g`
          : ""}
      </p>
    </div>
  );
}
