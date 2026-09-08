import { useEffect, useMemo, useState } from 'react'
import { FilterPanel } from './components/FilterPanel'
import { VehicleTable } from './components/VehicleTable'
import { fetchVehicles } from './data/vehicles'
import type { Range, SortDirection, Vehicle } from './types/vehicle'

function App() {
  const [allVehicles, setAllVehicles] = useState<Vehicle[]>([])
  const [filterText, setFilterText] = useState('')
  const [selectedMakes, setSelectedMakes] = useState<string[]>([])
  const [yearRange, setYearRange] = useState<Range>({ min: 2015, max: 2020 })
  const [priceRange, setPriceRange] = useState<Range>({ min: 0, max: 37000 })
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc')
  const [editingVehicleId, setEditingVehicleId] = useState<number | null>(null)
  const [draftPrice, setDraftPrice] = useState('')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let isMounted = true

    fetchVehicles().then((data) => {
      if (!isMounted) return

      setAllVehicles(data)
      setYearRange(getYearRange(data))
      setPriceRange(getPriceRange(data))
      setIsLoading(false)
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

    return [...allVehicles]
      .filter((vehicle) => matchesFilters(vehicle, term, selectedMakes, yearRange, priceRange))
      .sort((a, b) => compareByPrice(a, b, sortDirection))
  }, [allVehicles, filterText, selectedMakes, sortDirection, yearRange, priceRange])

  const minYear = getMinimum(allVehicles.map((vehicle) => vehicle.year))
  const maxYear = getMaximum(allVehicles.map((vehicle) => vehicle.year))
  const minPrice = getMinimum(allVehicles.map((vehicle) => vehicle.price ?? 0))
  const maxPrice = getMaximum(allVehicles.map((vehicle) => vehicle.price ?? 0))

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

  const handleYearRangeChange = (type: 'min' | 'max', value: number) => {
    setYearRange((currentRange) => updateRange(currentRange, type, value))
  }

  const handlePriceRangeChange = (type: 'min' | 'max', value: number) => {
    setPriceRange((currentRange) => updateRange(currentRange, type, value))
  }

  const clearFilters = () => {
    setFilterText('')
    setSelectedMakes([])
    setYearRange(getYearRange(allVehicles))
    setPriceRange(getPriceRange(allVehicles))
  }

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(245,158,11,0.14),transparent_30%),linear-gradient(180deg,#fffdf7_0%,#f1f7ef_100%)] px-4 py-10 sm:px-6 lg:px-8">
      <section className="mx-auto w-full max-w-5xl rounded-[28px] border border-stone-200/80 bg-[#fffdf9]/85 p-5 shadow-[0_24px_80px_rgba(54,65,47,0.1)] backdrop-blur-sm sm:p-8">
        <FilterPanel
          filterText={filterText}
          selectedMakes={selectedMakes}
          availableMakes={availableMakes}
          yearRange={yearRange}
          priceRange={priceRange}
          minYear={minYear}
          maxYear={maxYear}
          minPrice={minPrice}
          maxPrice={maxPrice}
          onFilterTextChange={setFilterText}
          onToggleMake={(make) => {
            setSelectedMakes((currentSelected) =>
              currentSelected.includes(make)
                ? currentSelected.filter((item) => item !== make)
                : [...currentSelected, make],
            )
          }}
          onYearRangeChange={handleYearRangeChange}
          onPriceRangeChange={handlePriceRangeChange}
          onClearFilters={clearFilters}
        />

        <VehicleTable
          vehicles={visibleVehicles}
          isLoading={isLoading}
          sortDirection={sortDirection}
          editingVehicleId={editingVehicleId}
          draftPrice={draftPrice}
          onToggleSort={() =>
            setSortDirection((currentSort) => (currentSort === 'asc' ? 'desc' : 'asc'))
          }
          onEditStart={handleEditStart}
          onDraftPriceChange={setDraftPrice}
          onSavePrice={handleSavePrice}
        />
      </section>
    </main>
  )
}

function matchesFilters(
  vehicle: Vehicle,
  term: string,
  selectedMakes: string[],
  yearRange: Range,
  priceRange: Range,
) {
  const searchableValues = [
    vehicle.make,
    vehicle.model,
    String(vehicle.year),
    vehicle.price === null ? 'n/a' : `$${vehicle.price}`,
    vehicle.price === null ? 'null' : String(vehicle.price),
  ]
  const textMatch = !term || searchableValues.some((value) => value.toLowerCase().includes(term))
  const makeMatch = selectedMakes.length === 0 || selectedMakes.includes(vehicle.make)
  const yearMatch = vehicle.year >= yearRange.min && vehicle.year <= yearRange.max
  const vehiclePrice = vehicle.price ?? 0
  const priceMatch = vehiclePrice >= priceRange.min && vehiclePrice <= priceRange.max

  return textMatch && makeMatch && yearMatch && priceMatch
}

function compareByPrice(a: Vehicle, b: Vehicle, direction: SortDirection) {
  const aPrice = a.price ?? Number.POSITIVE_INFINITY
  const bPrice = b.price ?? Number.POSITIVE_INFINITY
  return direction === 'asc' ? aPrice - bPrice : bPrice - aPrice
}

function updateRange(range: Range, type: 'min' | 'max', value: number): Range {
  if (type === 'min') {
    return { min: Math.min(value, range.max), max: range.max }
  }

  return { min: range.min, max: Math.max(value, range.min) }
}

function getYearRange(vehicles: Vehicle[]): Range {
  const years = vehicles.map((vehicle) => vehicle.year)
  return { min: getMinimum(years), max: getMaximum(years) }
}

function getPriceRange(vehicles: Vehicle[]): Range {
  const prices = vehicles.map((vehicle) => vehicle.price ?? 0)
  return { min: getMinimum(prices), max: getMaximum(prices) }
}

function getMinimum(values: number[]) {
  return values.length > 0 ? Math.min(...values) : 0
}

function getMaximum(values: number[]) {
  return values.length > 0 ? Math.max(...values) : 0
}

export default App
