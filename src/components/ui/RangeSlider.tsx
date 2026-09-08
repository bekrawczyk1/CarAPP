import type { CSSProperties } from 'react'
import type { Range } from '../../types/vehicle'

export type RangeSliderChange = (type: 'min' | 'max', value: number) => void

export type RangeSliderProps = {
  label: string
  value: Range
  min: number
  max: number
  step?: number
  formatValue?: (value: number) => string
  className?: string
  onChange: RangeSliderChange
}

function getTrackStyle(value: Range, min: number, max: number): CSSProperties {
  const minPercent = ((value.min - min) / (max - min || 1)) * 100
  const maxPercent = ((value.max - min) / (max - min || 1)) * 100

  return {
    background: `linear-gradient(
      to right,
      #d6d3c8 0%,
      #d6d3c8 ${minPercent}%,
      #166534 ${minPercent}%,
      #166534 ${maxPercent}%,
      #d6d3c8 ${maxPercent}%,
      #d6d3c8 100%
    )`,
  }
}

export function RangeSlider({
  label,
  value,
  min,
  max,
  step = 1,
  formatValue = String,
  className = '',
  onChange,
}: RangeSliderProps) {
  return (
    <fieldset className={`rounded-2xl border border-stone-200 bg-stone-50/80 p-4 ${className}`}>
      <legend className="mb-3 text-sm font-semibold uppercase tracking-[0.08em] text-stone-700">
        {label}
      </legend>
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between text-sm font-medium text-stone-600">
          <span>From {formatValue(value.min)}</span>
          <span>To {formatValue(value.max)}</span>
        </div>

        <div
          className="relative h-0.5 overflow-visible rounded-full"
          style={getTrackStyle(value, min, max)}
        >
          {(['min', 'max'] as const).map((type) => (
            <input
              key={type}
              type="range"
              min={min}
              max={max}
              step={step}
              value={value[type]}
              onChange={(event) => onChange(type, Number(event.target.value))}
              className={`range-slider ${type}-range`}
              aria-label={`${label} ${type}`}
              aria-valuetext={formatValue(value[type])}
            />
          ))}
        </div>
      </div>
    </fieldset>
  )
}