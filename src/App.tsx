import { useEffect, useMemo, useState } from 'react'

type Vehicle = {
  id: number
  make: string
  model: string
  year: number
  price: number | null
}

type YearRange = {
  min: number
  max: number
}

type PriceRange = {
  min: number
  max: number
}

const vehicles: Vehicle[] = [
  { id: 1, make: 'Toyota', model: 'Corolla', year: 2015, price: null },
  { id: 2, make: 'Jeep', model: 'Wrangler', year: 2019, price: 30000 },
  { id: 3, make: 'Audi', model: 'A4', year: 2017, price: 25000 },
  { id: 4, make: 'Jeep', model: 'Cherokee', year: 2020, price: null },
  { id: 5, make: 'BMW', model: 'X3', year: 2018, price: 37000 },
]

const fetchVehicles = () =>
  new Promise<Vehicle[]>((resolve) => {
    setTimeout(() => resolve(vehicles), 1000)
  })

function App() {
  const [allVehicles, setAllVehicles] = useState<Vehicle[]>([])
  const [filterText, setFilterText] = useState('')
  const [selectedMakes, setSelectedMakes] = useState<string[]>([])
  const [yearRange, setYearRange] = useState<YearRange>({ min: 2015, max: 2020 })
  const [priceRange, setPriceRange] = useState<PriceRange>({ min: 0, max: 37000 })
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc')
  const [editingVehicleId, setEditingVehicleId] = useState<number | null>(null)
  const [draftPrice, setDraftPrice] = useState('')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let isMounted = true

    fetchVehicles().then((data) => {
      if (isMounted) {
        setAllVehicles(data)

        const years = data.map((vehicle) => vehicle.year)
        const minYear = Math.min(...years)
        const maxYear = Math.max(...years)
        const prices = data
          .map((vehicle) => vehicle.price)
          .filter((price): price is number => price !== null)

        const minPrice = Math.min(...prices)
        const maxPrice = Math.max(...prices)

        setYearRange({ min: minYear, max: maxYear })
        setPriceRange({ min: minPrice, max: maxPrice })
        setIsLoading(false)
      }
    })

    return () => {
      isMounted = false
    }
  }, [])

  const availableMakes = useMemo(
    () => [...new Set(allVehicles.map((vehicle) => vehicle.make))].sort(),
    [allVehicles],
  )

  const visibleVehicles = useMemo(() => {
    const term = filterText.trim().toLowerCase()

    const filtered = allVehicles.filter((vehicle) => {
      const textMatch =
        !term ||
        [
          vehicle.make,
          vehicle.model,
          String(vehicle.year),
          vehicle.price === null ? 'n/a' : `\$${vehicle.price}`,
          vehicle.price === null ? 'null' : String(vehicle.price),
        ].some((value) => value.toLowerCase().includes(term))

      const makeMatch =
        selectedMakes.length === 0 || selectedMakes.includes(vehicle.make)

      const yearMatch =
        vehicle.year >= yearRange.min && vehicle.year <= yearRange.max

      const vehiclePrice = vehicle.price ?? 0
      const priceMatch =
        vehiclePrice >= priceRange.min && vehiclePrice <= priceRange.max

      return textMatch && makeMatch && yearMatch && priceMatch
    })

    return [...filtered].sort((a, b) => {
      const aPrice = a.price ?? Number.POSITIVE_INFINITY
      const bPrice = b.price ?? Number.POSITIVE_INFINITY

      if (sortDirection === 'asc') {
        return aPrice - bPrice
      }

      return bPrice - aPrice
    })
  }, [allVehicles, filterText, selectedMakes, sortDirection, yearRange, priceRange])

  const handleEditStart = (vehicle: Vehicle) => {
    setEditingVehicleId(vehicle.id)
    setDraftPrice(vehicle.price === null ? '' : String(vehicle.price))
  }

  const handleSavePrice = (vehicleId: number) => {
    const parsedValue = draftPrice.trim()
    const nextPrice = parsedValue === '' ? null : Number(parsedValue)

    if (parsedValue !== '' && (!Number.isFinite(nextPrice) || Number(nextPrice) < 0)) {
      return
    }

    setAllVehicles((currentVehicles) =>
      currentVehicles.map((vehicle) =>
        vehicle.id === vehicleId ? { ...vehicle, price: nextPrice } : vehicle,
      ),
    )

    setEditingVehicleId(null)
    setDraftPrice('')
  }

  const toggleMake = (make: string) => {
    setSelectedMakes((currentSelected) =>
      currentSelected.includes(make)
        ? currentSelected.filter((item) => item !== make)
        : [...currentSelected, make],
    )
  }

  const clearFilters = () => {
    setFilterText('')
    setSelectedMakes([])
    setYearRange({
      min: Math.min(...allVehicles.map((vehicle) => vehicle.year)),
      max: Math.max(...allVehicles.map((vehicle) => vehicle.year)),
    })
    setPriceRange({
      min: Math.min(...allVehicles.map((vehicle) => vehicle.price ?? 0)),
      max: Math.max(...allVehicles.map((vehicle) => vehicle.price ?? 0)),
    })
  }

  const minYear = Math.min(...allVehicles.map((vehicle) => vehicle.year))
  const maxYear = Math.max(...allVehicles.map((vehicle) => vehicle.year))
  const minPrice = Math.min(...allVehicles.map((vehicle) => vehicle.price ?? 0))
  const maxPrice = Math.max(...allVehicles.map((vehicle) => vehicle.price ?? 0))

  const handleYearRangeChange = (type: 'min' | 'max', value: number) => {
    setYearRange((currentRange) => {
      if (type === 'min') {
        return { min: Math.min(value, currentRange.max), max: currentRange.max }
      }

      return { min: currentRange.min, max: Math.max(value, currentRange.min) }
    })
  }

  const handlePriceRangeChange = (type: 'min' | 'max', value: number) => {
    setPriceRange((currentRange) => {
      if (type === 'min') {
        return { min: Math.min(value, currentRange.max), max: currentRange.max }
      }

      return { min: currentRange.min, max: Math.max(value, currentRange.min) }
    })
  }

  const getRangeTrackStyle = (
    currentMin: number,
    currentMax: number,
    absoluteMin: number,
    absoluteMax: number,
  ) => {
    const minPercent = ((currentMin - absoluteMin) / (absoluteMax - absoluteMin || 1)) * 100
    const maxPercent = ((currentMax - absoluteMin) / (absoluteMax - absoluteMin || 1)) * 100

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

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(245,158,11,0.14),transparent_30%),linear-gradient(180deg,#fffdf7_0%,#f1f7ef_100%)] px-4 py-10 sm:px-6 lg:px-8">
      <section className="mx-auto w-full max-w-5xl rounded-[28px] border border-stone-200/80 bg-[#fffdf9]/85 p-5 shadow-[0_24px_80px_rgba(54,65,47,0.1)] backdrop-blur-sm sm:p-8">
        <div className="mb-6 flex flex-col gap-4">
          <div className="rounded-2xl border border-stone-200 bg-stone-50/80 p-4 shadow-inner shadow-white/80">
            <label htmlFor="vehicle-filter" className="mb-2 block text-sm font-semibold text-stone-800">
              Search
            </label>
            <input
              id="vehicle-filter"
              type="text"
              value={filterText}
              onChange={(event) => setFilterText(event.target.value)}
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
                    onClick={() => toggleMake(make)}
                  >
                    {make}
                  </button>
                )
              })}
            </div>
          </div>

          <div className="rounded-2xl border border-stone-200 bg-stone-50/80 p-4">
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.08em] text-stone-700">
              Year
            </p>
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between text-sm font-medium text-stone-600">
                <span>From {yearRange.min}</span>
                <span>To {yearRange.max}</span>
              </div>

              <div
                className="relative h-6 overflow-visible rounded-full bg-stone-200"
                style={getRangeTrackStyle(yearRange.min, yearRange.max, minYear, maxYear)}
              >
                <input
                  type="range"
                  min={minYear}
                  max={maxYear}
                  value={yearRange.min}
                  onChange={(event) =>
                    handleYearRangeChange('min', Number(event.target.value))
                  }
                  className="range-slider min-range"
                />
                <input
                  type="range"
                  min={minYear}
                  max={maxYear}
                  value={yearRange.max}
                  onChange={(event) =>
                    handleYearRangeChange('max', Number(event.target.value))
                  }
                  className="range-slider max-range"
                />
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-stone-200 bg-stone-50/80 p-4">
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.08em] text-stone-700">
              Price
            </p>
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between text-sm font-medium text-stone-600">
                <span>From ${priceRange.min.toLocaleString()}</span>
                <span>To ${priceRange.max.toLocaleString()}</span>
              </div>

              <div
                className="relative h-6 overflow-visible rounded-full bg-stone-200"
                style={getRangeTrackStyle(priceRange.min, priceRange.max, minPrice, maxPrice)}
              >
                <input
                  type="range"
                  min={minPrice}
                  max={maxPrice}
                  value={priceRange.min}
                  onChange={(event) =>
                    handlePriceRangeChange('min', Number(event.target.value))
                  }
                  className="range-slider min-range"
                />
                <input
                  type="range"
                  min={minPrice}
                  max={maxPrice}
                  value={priceRange.max}
                  onChange={(event) =>
                    handlePriceRangeChange('max', Number(event.target.value))
                  }
                  className="range-slider max-range"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="button"
              className="rounded-xl border border-stone-200 bg-stone-100 px-4 py-2.5 text-sm font-semibold text-stone-700 transition hover:bg-amber-100"
              onClick={clearFilters}
            >
              Clear filters
            </button>
          </div>
        </div>

        <div className="hidden grid-cols-[1.4fr_1.4fr_0.8fr_1.5fr_0.7fr] items-center gap-3 rounded-t-2xl border border-stone-200 bg-stone-50/90 px-4 py-3 text-sm font-semibold text-stone-600 sm:grid">
          <span>Make</span>
          <span>Model</span>
          <span>Year</span>
          <span>
            <button
              type="button"
              className="font-semibold text-stone-700 transition hover:text-emerald-800"
              onClick={() =>
                setSortDirection((currentSort) =>
                  currentSort === 'asc' ? 'desc' : 'asc',
                )
              }
            >
              Sort by Price {sortDirection === 'asc' ? '↑' : '↓'}
            </button>
          </span>
          <span>Edit</span>
        </div>

        {isLoading ? (
          <div
            className="flex items-center justify-center gap-4 rounded-b-2xl border border-stone-200 bg-gradient-to-r from-stone-50 to-amber-50 px-5 py-8 text-stone-600"
            aria-live="polite"
          >
            <div className="h-7 w-7 animate-spin rounded-full border-3 border-amber-200 border-t-emerald-700" aria-hidden="true" />
            <div className="flex flex-col gap-1">
              <strong className="text-base font-semibold text-stone-800">Loading vehicles</strong>
              <span className="text-sm text-stone-500">Searching available cars…</span>
            </div>
          </div>
        ) : visibleVehicles.length === 0 ? (
          <div className="rounded-b-2xl border border-stone-200 bg-stone-50 px-4 py-5 text-sm text-stone-600">
            No vehicles match your filter.
          </div>
        ) : (
          <ul className="divide-y divide-stone-200 overflow-hidden rounded-b-2xl border border-stone-200 bg-white">
            {visibleVehicles.map((vehicle) => (
              <li
                key={vehicle.id}
                className="grid gap-3 px-4 py-4 sm:grid-cols-[1.4fr_1.4fr_0.8fr_1.5fr_0.7fr] sm:items-center"
              >
                <span className="text-sm font-medium text-stone-700">{vehicle.make}</span>
                <span className="text-sm font-medium text-stone-700">{vehicle.model}</span>
                <span className="text-sm text-stone-600">{vehicle.year}</span>
                <span className="text-sm text-stone-700">
                  {editingVehicleId === vehicle.id ? (
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        min="0"
                        step="1"
                        value={draftPrice}
                        onChange={(event) => setDraftPrice(event.target.value)}
                        aria-label={`Edit price for ${vehicle.make} ${vehicle.model}`}
                        className="w-24 rounded-lg border border-stone-200 bg-white px-2.5 py-2 text-sm text-stone-700 outline-none transition focus:border-emerald-600 focus:ring-4 focus:ring-amber-100"
                      />
                      <button
                        type="button"
                        className="rounded-lg bg-emerald-700 px-2.5 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-emerald-800"
                        onClick={() => handleSavePrice(vehicle.id)}
                      >
                        Save
                      </button>
                    </div>
                  ) : vehicle.price === null ? (
                    'N/A'
                  ) : (
                    `$${vehicle.price.toLocaleString()}`
                  )}
                </span>
                <span>
                  {editingVehicleId === vehicle.id ? null : (
                    <button
                      type="button"
                      className="rounded-lg bg-emerald-700 px-2.5 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-emerald-800"
                      onClick={() => handleEditStart(vehicle)}
                    >
                      Edit
                    </button>
                  )}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  )
}

export default App
