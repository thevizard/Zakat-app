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
    <div className="mb-6">
      <p className="text-base font-bold text-gray-800 mb-3">{label}</p>

      <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => switchMode("usd")}
            className={`px-4 py-1.5 rounded-xl text-sm font-semibold transition-colors ${
              mode === "usd"
                ? "bg-black text-white"
                : "bg-gray-100 text-gray-500 hover:bg-gray-200"
            }`}
          >
            USD Value
          </button>
          <button
            type="button"
            onClick={() => switchMode("grams")}
            className={`px-4 py-1.5 rounded-xl text-sm font-semibold transition-colors ${
              mode === "grams"
                ? "bg-black text-white"
                : "bg-gray-100 text-gray-500 hover:bg-gray-200"
            }`}
          >
            Weight (grams)
          </button>
        </div>

        {id === "gold" && mode === "grams" && (
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-semibold text-gray-500 mr-1">
              Purity:
            </span>
            {KARAT_OPTIONS.map((opt) => (
              <button
                key={opt.karat}
                type="button"
                onClick={() => handleKaratChange(opt.karat)}
                title={opt.purity}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-colors ${
                  karat === opt.karat
                    ? "bg-[#2d7a4f] text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="flex items-center gap-3 bg-gray-100 rounded-2xl px-5 py-4 focus-within:ring-2 focus-within:ring-[#2d7a4f] transition-all">
        {mode === "usd" && (
          <span className="text-xl font-medium text-gray-400">$</span>
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
          className="flex-1 text-xl font-semibold text-gray-900 placeholder:text-gray-400 focus:outline-none bg-transparent"
        />
        {mode === "grams" && (
          <span className="text-xl font-medium text-gray-400">
            g {id === "gold" ? `(${karat}K)` : ""}
          </span>
        )}
      </div>

      {mode === "grams" &&
        gramsEntered !== null &&
        !isNaN(gramsEntered) &&
        gramsEntered > 0 && (
          <p className="text-sm text-gray-500 mt-2 ml-1">
            ≈{" "}
            <span className="text-[#2d7a4f] font-semibold">
              $
              {(gramsEntered * effectivePricePerGram).toLocaleString("en-US", {
                maximumFractionDigits: 2,
              })}
            </span>{" "}
            USD{" "}
            {id === "gold" && karat !== 24
              ? `(adjusted for ${karat}K purity — ${((karat / 24) * 100).toFixed(1)}% fine gold)`
              : ""}
          </p>
        )}

      <p className="text-xs text-gray-400 mt-2 ml-1">
        Current 24K spot rate: ${pricePerGram.toFixed(2)} / gram
        {id === "gold" && mode === "grams" && karat !== 24
          ? ` · ${karat}K rate: $${effectivePricePerGram.toFixed(2)} / gram`
          : ""}
      </p>
    </div>
  );
}
