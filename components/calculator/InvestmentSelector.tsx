"use client";

import { InvestmentType } from "@/types/zakat.types";

interface InvestmentSelectorProps {
  selected: InvestmentType[];
  onChange: (types: InvestmentType[]) => void;
}

const INVESTMENT_OPTIONS: {
  type: InvestmentType;
  label: string;
  description: string;
}[] = [
  {
    type: "stocks",
    label: "Shares & Stocks",
    description: "Active or passive stock investments",
  },
  {
    type: "crypto",
    label: "Cryptocurrencies",
    description: "Bitcoin, Ethereum, and other crypto",
  },
  {
    type: "retirement",
    label: "Pension & Retirement",
    description: "401k, IRA, and pension funds",
  },
  {
    type: "property",
    label: "Investment Property",
    description: "Property intended for resale",
  },
  {
    type: "business",
    label: "Business Inventory",
    description: "Goods and assets held for sale",
  },
];

export function InvestmentSelector({
  selected = [],
  onChange,
}: InvestmentSelectorProps) {
  function toggle(type: InvestmentType) {
    if (selected.includes(type)) {
      onChange(selected.filter((t) => t !== type));
    } else {
      onChange([...selected, type]);
    }
  }

  return (
    <div className="space-y-3">
      
      {INVESTMENT_OPTIONS.map((option) => {
        const isSelected = selected.includes(option.type);
        return (
          <button
            key={option.type}
            onClick={() => toggle(option.type)}
            className={`w-full flex items-center justify-between px-5 py-4 rounded-2xl border-2 transition-all duration-150 text-left ${
              isSelected
                ? "border-[#2d7a4f] bg-[#f0faf4]"
                : "border-gray-100 bg-gray-50 hover:border-gray-200"
            }`}
          >
            <div>
              <p
                className={`text-base font-semibold ${isSelected ? "text-[#2d7a4f]" : "text-gray-800"}`}
              >
                {option.label}
              </p>
              <p className="text-sm text-gray-400 mt-0.5">
                {option.description}
              </p>
            </div>
            <div
              className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                isSelected ? "border-[#2d7a4f] bg-[#2d7a4f]" : "border-gray-300"
              }`}
            >
              {isSelected && (
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="white"
                  strokeWidth="3"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              )}
            </div>
          </button>
        );
      })}
    </div>
  );
}
