"use client";

import { useState } from "react";

interface Row {
  id: number;
  label: string;
  amount: string;
}

interface MultiAssetInputProps {
  legend: string;
  tooltip?: string;
  placeholder?: string; // account name placeholder
  onChange: (total: number) => void;
}

let nextId = 1;

function parseAmount(raw: string): number {
  const n = parseFloat(raw.replace(/,/g, ""));
  return isNaN(n) || n < 0 ? 0 : n;
}

function fmt(n: number) {
  return n.toLocaleString("en-US", { maximumFractionDigits: 2 });
}

export function MultiAssetInput({
  legend,
  tooltip,
  placeholder = "e.g. Chase Checking",
  onChange,
}: MultiAssetInputProps) {
  const [rows, setRows] = useState<Row[]>([{ id: nextId++, label: "", amount: "" }]);

  function update(updated: Row[]) {
    setRows(updated);
    const total = updated.reduce((sum, r) => sum + parseAmount(r.amount), 0);
    onChange(total);
  }

  function setLabel(id: number, label: string) {
    update(rows.map((r) => (r.id === id ? { ...r, label } : r)));
  }

  function setAmount(id: number, raw: string) {
    if (!/^[\d,.\s+\-]*$/.test(raw)) return;
    update(rows.map((r) => (r.id === id ? { ...r, amount: raw } : r)));
  }

  function blurAmount(id: number) {
    update(
      rows.map((r) => {
        if (r.id !== id) return r;
        const n = parseAmount(r.amount);
        return { ...r, amount: n > 0 ? fmt(n) : "" };
      })
    );
  }

  function addRow() {
    update([...rows, { id: nextId++, label: "", amount: "" }]);
  }

  function removeRow(id: number) {
    const updated = rows.filter((r) => r.id !== id);
    update(updated.length ? updated : [{ id: nextId++, label: "", amount: "" }]);
  }

  const total = rows.reduce((sum, r) => sum + parseAmount(r.amount), 0);

  return (
    <div className="mb-6" style={{ fontFamily: "Open Sans, sans-serif" }}>
      <p className="text-base font-bold text-gray-800 mb-3">{legend}</p>

      <div className="flex flex-col gap-2">
        {rows.map((row, i) => (
          <div key={row.id} className="flex items-center gap-2">
            {/* Account label */}
            <input
              type="text"
              value={row.label}
              onChange={(e) => setLabel(row.id, e.target.value)}
              placeholder={placeholder}
              className="flex-1 min-w-0 bg-gray-100 rounded-xl px-3 py-3 text-sm text-gray-700 placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-[#2d7a4f]"
              style={{ fontFamily: "Open Sans, sans-serif" }}
            />
            {/* Amount */}
            <div className="flex items-center gap-1 bg-gray-100 rounded-xl px-3 py-3 focus-within:ring-2 focus-within:ring-[#2d7a4f] w-36 flex-shrink-0">
              <span className="text-gray-400 text-sm font-medium">$</span>
              <input
                type="text"
                inputMode="decimal"
                value={row.amount}
                onChange={(e) => setAmount(row.id, e.target.value)}
                onBlur={() => blurAmount(row.id)}
                placeholder="0"
                className="flex-1 text-sm font-semibold text-gray-900 placeholder:text-gray-300 focus:outline-none bg-transparent w-full"
                style={{ fontFamily: "Open Sans, sans-serif" }}
              />
            </div>
            {/* Remove */}
            <button
              onClick={() => removeRow(row.id)}
              className="text-gray-300 hover:text-red-400 transition-colors text-lg leading-none flex-shrink-0 w-6 text-center"
              title="Remove"
            >
              ×
            </button>
          </div>
        ))}
      </div>

      {/* Add row */}
      <button
        onClick={addRow}
        className="mt-3 text-sm font-semibold flex items-center gap-1 transition-colors"
        style={{ color: "#2d7a4f" }}
        onMouseEnter={(e) => (e.currentTarget.style.color = "#68BA7F")}
        onMouseLeave={(e) => (e.currentTarget.style.color = "#2d7a4f")}
      >
        <span className="text-base leading-none">+</span> Add another account
      </button>

      {/* Total */}
      {rows.length > 1 && (
        <div className="mt-4 flex justify-between items-center border-t border-gray-100 pt-3">
          <span className="text-sm text-gray-500 font-medium">Total</span>
          <span className="text-lg font-bold" style={{ color: "#0f2419" }}>
            ${fmt(total)}
          </span>
        </div>
      )}

      {tooltip && (
        <p className="text-sm text-gray-400 mt-2 ml-1 leading-relaxed">{tooltip}</p>
      )}
    </div>
  );
}
