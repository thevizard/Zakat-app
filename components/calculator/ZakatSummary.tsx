"use client";

import { ZakatResult, NisabStandard } from "@/types/zakat.types";

interface ZakatSummaryProps {
  result: ZakatResult;
  nisabStandard: NisabStandard;
  onReset: () => void;
}

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
}

export function ZakatSummary({
  result,
  nisabStandard,
  onReset,
}: ZakatSummaryProps) {
  return (
    <div className="min-h-screen bg-[#68BA7F]/20 flex flex-col items-center justify-center px-6 py-12">
      <div className="w-full max-w-lg">
        {/* Header card */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 mb-4 text-center">
          {result.meetsNisab ? (
            <>
              <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                <svg
                  width="32"
                  height="32"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#2d7a4f"
                  strokeWidth="2"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
              <p className="text-sm font-semibold text-gray-400 uppercase tracking-widest mb-1">
                Zakat Due
              </p>
              <p className="text-6xl font-bold text-gray-900 mb-1">
                {formatCurrency(result.zakatDue)}
              </p>
              <p className="text-sm text-gray-400">
                2.5% of your zakatable wealth
              </p>
            </>
          ) : (
            <>
              <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
                <svg
                  width="32"
                  height="32"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#888"
                  strokeWidth="2"
                >
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
              </div>
              <p className="text-sm font-semibold text-gray-400 uppercase tracking-widest mb-1">
                No Zakat Due
              </p>
              <p className="text-3xl font-bold text-gray-900 mb-2">
                Below Nisab
              </p>
              <p className="text-sm text-gray-400 leading-relaxed">
                Your zakatable wealth of{" "}
                {formatCurrency(result.zakatableWealth)} is below the nisab
                threshold of {formatCurrency(result.nisabThreshold)}.
              </p>
            </>
          )}
        </div>

        {/* Assets breakdown card */}
        <div className="bg-white rounded-3xl shadow-2xl p-6 mb-4">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">
            Assets Breakdown
          </p>
          <div className="space-y-3">
            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-sm text-gray-600">Total Assets</span>
              <span className="text-sm font-semibold text-gray-900">
                {formatCurrency(result.totalAssets)}
              </span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-sm text-gray-600">Total Liabilities</span>
              <span className="text-sm font-semibold text-red-500">
                − {formatCurrency(result.totalLiabilities)}
              </span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-sm font-bold text-gray-900">
                Zakatable Wealth
              </span>
              <span className="text-sm font-bold text-gray-900">
                {formatCurrency(result.zakatableWealth)}
              </span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-sm text-gray-500">
                Nisab Threshold ({nisabStandard === "gold" ? "Gold" : "Silver"})
              </span>
              <span className="text-sm text-gray-500">
                {formatCurrency(result.nisabThreshold)}
              </span>
            </div>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="bg-yellow-50 border border-yellow-100 rounded-2xl p-4 mb-6">
          <p className="text-xs text-yellow-700 leading-relaxed">
            <span className="font-bold">Note:</span> This is an estimate. Please
            consult a qualified Islamic scholar for your specific situation.
          </p>
        </div>

        {/* Buttons */}
        <div className="flex gap-3">
          <button
            onClick={onReset}
            className="flex-1 bg-white text-gray-900 py-4 rounded-2xl text-base font-semibold hover:bg-gray-50 transition-colors shadow-lg"
          >
            Recalculate
          </button>
          <button className="flex-1 bg-black text-white py-4 rounded-2xl text-base font-semibold hover:bg-gray-800 transition-colors shadow-lg">
            Donate Zakat →
          </button>
        </div>
      </div>
    </div>
  );
}
