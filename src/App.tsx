import { useEffect, useMemo, useState } from 'react'
import './App.css'

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
        #e2e8f0 0%,
        #e2e8f0 ${minPercent}%,
        #2563eb ${minPercent}%,
        #2563eb ${maxPercent}%,
        #e2e8f0 ${maxPercent}%,
        #e2e8f0 100%
      )`,
    }
  }

  return (
    <main className="vehicle-app">
      <section className="vehicle-panel">
        <div className="filter-section">
          <div className="filter-group">
            <label htmlFor="vehicle-filter">Search</label>
            <input
              id="vehicle-filter"
              type="text"
              value={filterText}
              onChange={(event) => setFilterText(event.target.value)}
              placeholder="Search make, model, year, or price"
              aria-label="Search vehicles"
            />
          </div>

          <div className="filter-group">
            <p className="section-title">Available makes</p>
            <div className="make-list">
              {availableMakes.map((make) => {
                const isSelected = selectedMakes.includes(make)

                return (
                  <button
                    key={make}
                    type="button"
                    className={`make-chip ${isSelected ? 'selected' : ''}`}
                    onClick={() => toggleMake(make)}
                  >
                    {make}
                  </button>
                )
              })}
            </div>
          </div>

          <div className="filter-group">
            <p className="section-title">Year</p>
            <div className="year-range">
              <div className="year-range-readout">
                <span>From {yearRange.min}</span>
                <span>To {yearRange.max}</span>
              </div>

              <div
                className="dual-range-wrap"
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
                  className="range min-range"
                />
                <input
                  type="range"
                  min={minYear}
                  max={maxYear}
                  value={yearRange.max}
                  onChange={(event) =>
                    handleYearRangeChange('max', Number(event.target.value))
                  }
                  className="range max-range"
                />
              </div>
            </div>
          </div>

          <div className="filter-group">
            <p className="section-title">Price</p>
            <div className="year-range">
              <div className="year-range-readout">
                <span>From ${priceRange.min.toLocaleString()}</span>
                <span>To ${priceRange.max.toLocaleString()}</span>
              </div>

              <div
                className="dual-range-wrap"
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
                  className="range min-range"
                />
                <input
                  type="range"
                  min={minPrice}
                  max={maxPrice}
                  value={priceRange.max}
                  onChange={(event) =>
                    handlePriceRangeChange('max', Number(event.target.value))
                  }
                  className="range max-range"
                />
              </div>
            </div>
          </div>

          <div className="filter-actions">
            <button type="button" className="secondary-button" onClick={clearFilters}>
              Clear filters
            </button>
          </div>
        </div>

        <div className="table-header">
          <span>Make</span>
          <span>Model</span>
          <span>Year</span>
          <span className="price-column">
            <button
              type="button"
              className="sort-button"
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
          <div className="loading-state" aria-live="polite">
            <div className="loading-spinner" aria-hidden="true" />
            <div className="loading-copy">
              <strong>Loading vehicles</strong>
              <span>Searching available cars…</span>
            </div>
          </div>
        ) : visibleVehicles.length === 0 ? (
          <div className="status">No vehicles match your filter.</div>
        ) : (
          <ul className="vehicle-list">
            {visibleVehicles.map((vehicle) => (
              <li key={vehicle.id} className="vehicle-row">
                <span>{vehicle.make}</span>
                <span>{vehicle.model}</span>
                <span>{vehicle.year}</span>
                <span className="price-cell">
                  {editingVehicleId === vehicle.id ? (
                    <div className="price-editor">
                      <input
                        type="number"
                        min="0"
                        step="1"
                        value={draftPrice}
                        onChange={(event) => setDraftPrice(event.target.value)}
                        aria-label={`Edit price for ${vehicle.make} ${vehicle.model}`}
                      />
                      <button type="button" onClick={() => handleSavePrice(vehicle.id)}>
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
                    <button type="button" onClick={() => handleEditStart(vehicle)}>
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
