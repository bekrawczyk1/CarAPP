import { Button } from './ui/Button'
import { RangeSlider, type RangeSliderChange } from './ui/RangeSlider'
import type { Range } from '../types/vehicle'

type FilterPanelProps = {
  filterText: string
  selectedMakes: string[]
  availableMakes: string[]
  yearRange: Range
  priceRange: Range
  minYear: number
  maxYear: number
  minPrice: number
  maxPrice: number
  onFilterTextChange: (value: string) => void
  onToggleMake: (make: string) => void
  onYearRangeChange: RangeSliderChange
  onPriceRangeChange: RangeSliderChange
  onClearFilters: () => void
}

export function FilterPanel({
  filterText,
  selectedMakes,
  availableMakes,
  yearRange,
  priceRange,
  minYear,
  maxYear,
  minPrice,
  maxPrice,
  onFilterTextChange,
  onToggleMake,
  onYearRangeChange,
  onPriceRangeChange,
  onClearFilters,
}: FilterPanelProps) {
  return (
    <div className="mb-6 flex flex-col gap-4">
      <div className="rounded-2xl border border-stone-200 bg-stone-50/80 p-4 shadow-inner shadow-white/80">
        <label htmlFor="vehicle-filter" className="mb-2 block text-sm font-semibold text-stone-800">
          Search
        </label>
        <input
          id="vehicle-filter"
          type="text"
          value={filterText}
          onChange={(event) => onFilterTextChange(event.target.value)}
          placeholder="Search make, model, year, or price"
          aria-label="Search vehicles"
          className="w-full rounded-xl border border-stone-200 bg-white px-3.5 py-3 text-base text-stone-900 outline-none transition focus:border-emerald-600 focus:ring-4 focus:ring-amber-100"
        />
      </div>

      <div className="rounded-2xl border border-stone-200 bg-stone-50/80 p-4">
        <p className="mb-3 text-sm font-semibold uppercase tracking-[0.08em] text-stone-700">
          Available makes
        </p>
        <div className="flex flex-wrap gap-2.5">
          {availableMakes.map((make) => {
            const isSelected = selectedMakes.includes(make)

            return (
              <button
                key={make}
                type="button"
                className={`rounded-full border px-3 py-2 text-sm font-medium transition-all ${
                  isSelected
                    ? 'border-emerald-200 bg-emerald-100 text-emerald-800 shadow-[0_8px_18px_rgba(22,101,52,0.14)]'
                    : 'border-stone-200 bg-white text-stone-700 hover:border-amber-300 hover:bg-amber-50'
                }`}
                onClick={() => onToggleMake(make)}
              >
                {make}
              </button>
            )
          })}
        </div>
      </div>

      <RangeSlider
        label="Year"
        value={yearRange}
        min={minYear}
        max={maxYear}
        onChange={onYearRangeChange}
      />
      <RangeSlider
        label="Price"
        value={priceRange}
        min={minPrice}
        max={maxPrice}
        formatValue={(value) => `$${value.toLocaleString()}`}
        onChange={onPriceRangeChange}
      />

      <div className="flex justify-end">
        <Button type="button" variant="secondary" className="rounded-xl px-4 py-2.5 text-sm" onClick={onClearFilters}>
          Clear filters
        </Button>
      </div>
    </div>
  )
}
