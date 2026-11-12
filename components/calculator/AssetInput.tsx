"use client";

import { useState, useEffect } from "react";
import { useCalculatorStore } from "@/store/calculatorStore";
import { LineItem } from "@/types/zakat.types";

interface AssetInputProps {
  id: string;
  label: string;
  tooltip?: string;
  value: number;
  onChange: (value: number) => void;
  onEnter?: () => void;
  itemPlaceholders?: [string, string];
}

export function AssetInput({
  id,
  label,
  tooltip,
  value,
  onChange,
  onEnter,
  itemPlaceholders = ["e.g. Checking account", "e.g. Savings account"],
}: AssetInputProps) {
  const storedItems = useCalculatorStore((s) => s.lineItems[id]);
  const setStoredItems = useCalculatorStore((s) => s.setLineItems);

  const [isItemized, setIsItemized] = useState<boolean>(
    Boolean(storedItems && storedItems.length > 0)
  );
  const [display, setDisplay] = useState(
    value ? value.toLocaleString("en-US") : ""
  );

  useEffect(() => {
    if (value === 0 && (!storedItems || storedItems.length === 0)) {
      setDisplay("");
    } else if (value > 0 && isItemized) {
      setDisplay(
        value.toLocaleString("en-US", {
          minimumFractionDigits: 0,
          maximumFractionDigits: 2,
        })
      );
    }
  }, [value, isItemized, storedItems]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const raw = e.target.value;

    // Allow digits, commas, and one decimal point
    if (!/^[\d,]*\.?\d*$/.test(raw)) return;

    setDisplay(raw);

    const numeric = parseFloat(raw.replace(/,/g, ""));
    onChange(isNaN(numeric) ? 0 : numeric);
  }

  function handleBlur() {
    const numeric = parseFloat(display.replace(/,/g, ""));
    if (!isNaN(numeric)) {
      setDisplay(
        numeric.toLocaleString("en-US", {
          minimumFractionDigits: display.includes(".") ? 2 : 0,
          maximumFractionDigits: 2,
        })
      );
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" && onEnter) {
      e.preventDefault();
      e.stopPropagation();
      onEnter();
    }
  }

  function enableItemized() {
    setIsItemized(true);
    if (!storedItems || storedItems.length === 0) {
      const initial: LineItem[] = [
        {
          id: `${id}-1`,
          label: "",
          amount: value > 0 ? value : 0,
        },
        {
          id: `${id}-2`,
          label: "",
          amount: 0,
        },
      ];
      setStoredItems(id, initial);
    }
  }

  function collapseToSingleTotal() {
    setIsItemized(false);
    setStoredItems(id, []);
    setDisplay(
      value > 0
        ? value.toLocaleString("en-US", {
            minimumFractionDigits: 0,
            maximumFractionDigits: 2,
          })
        : ""
    );
  }

  function updateLineItem(index: number, patch: Partial<LineItem>) {
    const items = [...(storedItems || [])];
    items[index] = { ...items[index], ...patch };
    setStoredItems(id, items);
    const sum = items.reduce((acc, item) => acc + (item.amount || 0), 0);
    onChange(parseFloat(sum.toFixed(2)));
  }

  function addLineItem() {
    const items = [
      ...(storedItems || []),
      { id: `${id}-${Date.now()}`, label: "", amount: 0 },
    ];
    setStoredItems(id, items);
  }

  function removeLineItem(index: number) {
    const items = (storedItems || []).filter((_, i) => i !== index);
    if (items.length === 0) {
      collapseToSingleTotal();
      onChange(0);
      return;
    }
    setStoredItems(id, items);
    const sum = items.reduce((acc, item) => acc + (item.amount || 0), 0);
    onChange(parseFloat(sum.toFixed(2)));
  }

  return (
    <div
      className="mb-6"
      style={{ fontFamily: "var(--font-body), Open Sans, sans-serif" }}
    >
      <div className="flex items-center justify-between gap-2 mb-3 flex-wrap">
        <p className="text-base font-bold text-gray-800">{label}</p>
        {!isItemized ? (
          <button
            type="button"
            onClick={enableItemized}
            style={{
              background: "none",
              border: "none",
              padding: 0,
              color: "#2d7a4f",
              fontSize: 13,
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            + Itemize multiple accounts / entries
          </button>
        ) : (
          <button
            type="button"
            onClick={collapseToSingleTotal}
            style={{
              background: "none",
              border: "none",
              padding: 0,
              color: "#6b7280",
              fontSize: 12,
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Switch to single total
          </button>
        )}
      </div>

      {!isItemized ? (
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
      ) : (
        <div
          style={{
            background: "#f8fbf9",
            border: "1px solid #dceee3",
            borderRadius: 18,
            padding: "16px",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {(storedItems || []).map((item, idx) => (
              <div
                key={item.id}
                style={{ display: "flex", gap: 8, alignItems: "center" }}
              >
                <input
                  type="text"
                  value={item.label}
                  onChange={(e) =>
                    updateLineItem(idx, { label: e.target.value })
                  }
                  placeholder={
                    itemPlaceholders[idx] || `Entry #${idx + 1} (optional)`
                  }
                  style={{
                    flex: "1 1 50%",
                    background: "white",
                    border: "1px solid #e2e8f0",
                    borderRadius: 12,
                    padding: "10px 12px",
                    fontSize: 14,
                    color: "#1f2937",
                    outline: "none",
                  }}
                />
                <div
                  style={{
                    flex: "1 1 42%",
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    background: "white",
                    border: "1px solid #e2e8f0",
                    borderRadius: 12,
                    padding: "10px 12px",
                  }}
                >
                  <span style={{ color: "#9ca3af", fontWeight: 600 }}>$</span>
                  <input
                    type="number"
                    min="0"
                    step="any"
                    value={item.amount === 0 ? "" : item.amount}
                    placeholder="0"
                    onChange={(e) => {
                      const val = parseFloat(e.target.value);
                      updateLineItem(idx, {
                        amount: isNaN(val) || val < 0 ? 0 : val,
                      });
                    }}
                    onKeyDown={handleKeyDown}
                    style={{
                      width: "100%",
                      border: "none",
                      outline: "none",
                      fontSize: 15,
                      fontWeight: 600,
                      color: "#111827",
                      background: "transparent",
                    }}
                  />
                </div>
                <button
                  type="button"
                  onClick={() => removeLineItem(idx)}
                  title="Remove item"
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: 8,
                    border: "none",
                    background: "transparent",
                    color: "#9ca3af",
                    cursor: "pointer",
                    fontSize: 18,
                    lineHeight: 1,
                    flexShrink: 0,
                  }}
                >
                  ×
                </button>
              </div>
            ))}
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginTop: 14,
              paddingTop: 12,
              borderTop: "1px solid #e2efe7",
            }}
          >
            <button
              type="button"
              onClick={addLineItem}
              style={{
                background: "white",
                border: "1px solid #2d7a4f",
                color: "#2d7a4f",
                borderRadius: 10,
                padding: "6px 12px",
                fontSize: 13,
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              + Add another row
            </button>
            <div style={{ fontSize: 14, color: "#4b5563" }}>
              Total:{" "}
              <strong style={{ color: "#0f2419", fontSize: 16 }}>
                $
                {value.toLocaleString("en-US", {
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 2,
                })}
              </strong>
            </div>
          </div>
        </div>
      )}

      {tooltip && (
        <p className="text-sm text-gray-400 mt-2 ml-1 leading-relaxed">
          {tooltip}
        </p>
      )}
    </div>
  );
}
