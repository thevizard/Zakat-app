"use client";

import { useState } from "react";

interface GoldSilverInputProps {
  id: string;
  label: string;
  pricePerGram: number;
  value: number;
  onChange: (value: number) => void;
  onEnter?: () => void;
}

export function GoldSilverInput({
  id,
  label,
  pricePerGram,
  value,
  onChange,
  onEnter,
}: GoldSilverInputProps) {
  const [mode, setMode] = useState<"usd" | "grams">("usd");
  const [display, setDisplay] = useState(
    value ? value.toLocaleString("en-US") : "",
  );

  function switchMode(newMode: "usd" | "grams") {
    setMode(newMode);
    setDisplay("");
    onChange(0);
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const raw = e.target.value;
    if (!/^[\d,]*\.?\d*$/.test(raw)) return;
    setDisplay(raw);

    const num = parseFloat(raw.replace(/,/g, ""));
    if (isNaN(num)) {
      onChange(0);
    } else {
      onChange(
        mode === "grams" ? parseFloat((num * pricePerGram).toFixed(2)) : num,
      );
    }
  }

  function handleBlur() {
    const numeric = parseFloat(display.replace(/,/g, ""));
    if (!isNaN(numeric)) {
      setDisplay(
        numeric.toLocaleString("en-US", {
          minimumFractionDigits: display.includes(".") ? 2 : 0,
          maximumFractionDigits: 2,
        }),
      );
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" && onEnter) {
      e.preventDefault();
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

      <div className="flex gap-2 mb-3">
        <button
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
          <span className="text-xl font-medium text-gray-400">g</span>
        )}
      </div>

      {mode === "grams" &&
        gramsEntered !== null &&
        !isNaN(gramsEntered) &&
        gramsEntered > 0 && (
          <p className="text-sm text-gray-400 mt-2 ml-1">
            ≈{" "}
            <span className="text-[#2d7a4f] font-semibold">
              $
              {(gramsEntered * pricePerGram).toLocaleString("en-US", {
                maximumFractionDigits: 2,
              })}
            </span>{" "}
            USD
          </p>
        )}

      <p className="text-xs text-gray-400 mt-2 ml-1">
        Current price: ${pricePerGram.toFixed(2)} per gram
      </p>
    </div>
  );
}
