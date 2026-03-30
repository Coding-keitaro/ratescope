'use client';

import { SliderRowProps } from '@/types';

export default function SliderRow({
  label,
  min,
  max,
  step,
  value,
  unit,
  formatter,
  onChange,
}: SliderRowProps) {
  const displayValue = formatter ? formatter(value) : `${value}${unit}`;

  return (
    <div className="mb-4">
      <div className="flex justify-between items-center mb-1">
        <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
          {label}
        </label>
        <span className="text-sm font-bold text-blue-600 dark:text-blue-400 min-w-[80px] text-right">
          {displayValue}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        aria-label={label}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="w-full h-2 bg-slate-200 dark:bg-slate-600 rounded-lg appearance-none cursor-pointer accent-blue-500"
      />
      <div className="flex justify-between text-xs text-slate-400 dark:text-slate-500 mt-1">
        <span>
          {min}
          {unit}
        </span>
        <span>
          {max}
          {unit}
        </span>
      </div>
    </div>
  );
}
