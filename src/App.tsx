import { useEffect, useMemo, useState } from 'react'
import './App.css'

type Vehicle = {
  id: number
  make: string
  model: string
  year: number
  price: number | null
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
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc')
  const [editingVehicleId, setEditingVehicleId] = useState<number | null>(null)
  const [draftPrice, setDraftPrice] = useState('')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let isMounted = true

    fetchVehicles().then((data) => {
      if (isMounted) {
        setAllVehicles(data)
        setIsLoading(false)
      }
    })

    return () => {
      isMounted = false
    }
  }, [])

  const visibleVehicles = useMemo(() => {
    const term = filterText.trim().toLowerCase()

    const filtered = allVehicles.filter((vehicle) => {
      if (!term) return true

      const searchableValues = [
        vehicle.make,
        vehicle.model,
        String(vehicle.year),
        vehicle.price === null ? 'n/a' : `$${vehicle.price}`,
        vehicle.price === null ? 'null' : String(vehicle.price),
      ]

      return searchableValues.some((value) => value.toLowerCase().includes(term))
    })

    return [...filtered].sort((a, b) => {
      const aPrice = a.price ?? Number.POSITIVE_INFINITY
      const bPrice = b.price ?? Number.POSITIVE_INFINITY

      if (sortDirection === 'asc') {
        return aPrice - bPrice
      }

      return bPrice - aPrice
    })
  }, [allVehicles, filterText, sortDirection])

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

  return (
    <main className="vehicle-app">
      <section className="vehicle-panel">
        <div className="toolbar">
          <label className="filter-label" htmlFor="vehicle-filter">
            Filter
          </label>
          <input
            id="vehicle-filter"
            type="text"
            value={filterText}
            onChange={(event) => setFilterText(event.target.value)}
            placeholder="Search make, model, year, or price"
            aria-label="Filter vehicles"
          />
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
          <div className="status">Loading vehicles...</div>
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
