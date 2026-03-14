"use client";

import { useState, useEffect } from "react";

interface AssetInputProps {
  id: string;
  label: string;
  tooltip?: string;
  value: number;
  onChange: (value: number) => void;
  onEnter?: () => void;
}

// Safely evaluates simple addition/subtraction expressions like "4200 + 12000 - 500"
function evalExpression(raw: string): number | null {
  const cleaned = raw.replace(/,/g, "").trim();
  if (!cleaned) return null;
  // Only allow digits, spaces, dots, + and -
  if (!/^[\d\s.+\-]+$/.test(cleaned)) return null;
  const parts = cleaned.split(/(?=[+\-])/).map((p) => parseFloat(p.trim()));
  if (parts.some(isNaN)) return null;
  const result = parts.reduce((a, b) => a + b, 0);
  return result < 0 ? 0 : result;
}

export function AssetInput({
  id,
  label,
  tooltip,
  value,
  onChange,
  onEnter,
}: AssetInputProps) {
  const [display, setDisplay] = useState(
    value ? value.toLocaleString("en-US") : "",
  );
  const [preview, setPreview] = useState<number | null>(null);

  useEffect(() => {
    if (value === 0) setDisplay("");
  }, [value]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const raw = e.target.value;
    // Allow digits, commas, decimal, +, -, spaces
    if (!/^[\d,.\s+\-]*$/.test(raw)) return;
    setDisplay(raw);

    const hasOperator = /[+\-]/.test(raw.replace(/^-/, "")); // ignore leading minus
    if (hasOperator) {
      const result = evalExpression(raw);
      setPreview(result);
      if (result !== null) onChange(result);
    } else {
      setPreview(null);
      const numeric = parseFloat(raw.replace(/,/g, ""));
      onChange(isNaN(numeric) ? 0 : numeric);
    }
  }

  function handleBlur() {
    const result = evalExpression(display);
    if (result !== null) {
      setDisplay(
        result.toLocaleString("en-US", { maximumFractionDigits: 2 }),
      );
      setPreview(null);
      onChange(result);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" && onEnter) {
      e.preventDefault();
      onEnter();
    }
  }

  return (
    <div
      className="mb-6"
      style={{ fontFamily: "var(--font-body), Open Sans, sans-serif" }}
    >
      <p className="text-base font-bold text-gray-800 mb-3">{label}</p>
      <div className="flex items-center gap-3 bg-gray-100 rounded-2xl px-5 py-4 focus-within:ring-2 focus-within:ring-[#2d7a4f] transition-all">
        <span className="text-xl font-medium text-gray-400">$</span>
        <input
          id={id}
          type="text"
          inputMode="decimal"
          value={display}
          placeholder="0"
          onChange={handleChange}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          className="flex-1 text-xl font-semibold text-gray-900 placeholder:text-gray-300 focus:outline-none bg-transparent"
          style={{ fontFamily: "var(--font-body), Open Sans, sans-serif" }}
        />
      </div>
      {preview !== null && (
        <p className="text-sm font-semibold mt-2 ml-1" style={{ color: "#2d7a4f" }}>
          = ${preview.toLocaleString("en-US", { maximumFractionDigits: 2 })}
        </p>
      )}
      {tooltip && (
        <p className="text-sm text-gray-400 mt-2 ml-1 leading-relaxed">
          {tooltip}
        </p>
      )}
    </div>
  );
}
