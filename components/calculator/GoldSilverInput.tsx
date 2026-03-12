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
  const [grams, setGrams] = useState("");

  function handleGramsChange(e: React.ChangeEvent<HTMLInputElement>) {
    const raw = e.target.value.replace(/,/g, "");
    setGrams(raw);
    const g = parseFloat(raw);
    if (!isNaN(g)) {
      onChange(parseFloat((g * pricePerGram).toFixed(2)));
    } else {
      onChange(0);
    }
  }

  function handleUsdChange(e: React.ChangeEvent<HTMLInputElement>) {
    const raw = e.target.value.replace(/,/g, "");
    const num = parseFloat(raw);
    onChange(isNaN(num) ? 0 : num);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" && onEnter) {
      e.preventDefault();
      onEnter();
    }
  }

  const usdFormatted = value ? value.toLocaleString("en-US") : "";

  return (
    <div className="mb-6">
      <p className="text-base font-bold text-gray-800 mb-3">{label}</p>

      {/* Toggle */}
      <div className="flex gap-2 mb-3">
        <button
          onClick={() => setMode("usd")}
          className={`px-4 py-1.5 rounded-xl text-sm font-semibold transition-colors ${
            mode === "usd"
              ? "bg-black text-white"
              : "bg-gray-100 text-gray-500 hover:bg-gray-200"
          }`}
        >
          USD Value
        </button>
        <button
          onClick={() => setMode("grams")}
          className={`px-4 py-1.5 rounded-xl text-sm font-semibold transition-colors ${
            mode === "grams"
              ? "bg-black text-white"
              : "bg-gray-100 text-gray-500 hover:bg-gray-200"
          }`}
        >
          Weight (grams)
        </button>
      </div>

      {mode === "usd" ? (
        <div className="flex items-center gap-3 bg-gray-100 rounded-2xl px-5 py-4 focus-within:ring-2 focus-within:ring-[#2d7a4f] transition-all">
          <span className="text-xl font-medium text-gray-400">$</span>
          <input
            id={id}
            type="text"
            inputMode="numeric"
            value={usdFormatted}
            placeholder="0"
            onChange={handleUsdChange}
            onKeyDown={handleKeyDown}
            className="flex-1 text-xl font-semibold text-gray-900 placeholder:text-gray-400 focus:outline-none bg-transparent"
          />
        </div>
      ) : (
        <div className="flex items-center gap-3 bg-gray-100 rounded-2xl px-5 py-4 focus-within:ring-2 focus-within:ring-[#2d7a4f] transition-all">
          <input
            id={`${id}-grams`}
            type="text"
            inputMode="numeric"
            value={grams}
            placeholder="0"
            onChange={handleGramsChange}
            onKeyDown={handleKeyDown}
            className="flex-1 text-xl font-semibold text-gray-900 placeholder:text-gray-400 focus:outline-none bg-transparent"
          />
          <span className="text-xl font-medium text-gray-400">g</span>
        </div>
      )}

      {mode === "grams" && value > 0 && (
        <p className="text-sm text-gray-400 mt-2 ml-1">
          ≈{" "}
          <span className="text-[#2d7a4f] font-semibold">
            ${value.toLocaleString("en-US")}
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
