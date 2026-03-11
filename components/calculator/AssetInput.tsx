"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface AssetInputProps {
  id: string;
  label: string;
  tooltip?: string;
  value: number;
  onChange: (value: number) => void;
}

export function AssetInput({
  id,
  label,
  tooltip,
  value,
  onChange,
}: AssetInputProps) {
  return (
    <div className="mb-4">
      <Label htmlFor={id} className="mb-1 block">
        {label}
      </Label>
      {tooltip && (
        <p className="text-sm text-muted-foreground mb-1">{tooltip}</p>
      )}
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
          $
        </span>
        <Input
          id={id}
          type="number"
          min={0}
          value={value || ""}
          placeholder="0.00"
          className="pl-7"
          onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
        />
      </div>
    </div>
  );
}
