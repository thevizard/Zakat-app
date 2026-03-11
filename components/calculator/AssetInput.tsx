"use client";

interface AssetInputProps {
  id: string;
  label: string;
  tooltip?: string;
  value: number;
  onChange: (value: number) => void;
  onEnter?: () => void;
}

export function AssetInput({
  id,
  label,
  tooltip,
  value,
  onChange,
  onEnter,
}: AssetInputProps) {
  const formatted = value ? value.toLocaleString("en-US") : "";

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
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
          inputMode="numeric"
          value={formatted}
          placeholder="0"
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          className="flex-1 text-xl font-semibold text-gray-900 placeholder:text-gray-300 focus:outline-none bg-transparent"
          style={{ fontFamily: "var(--font-body), Open Sans, sans-serif" }}
        />
      </div>
      {tooltip && (
        <p className="text-sm text-gray-400 mt-2 ml-1 leading-relaxed">
          {tooltip}
        </p>
      )}
    </div>
  );
}
