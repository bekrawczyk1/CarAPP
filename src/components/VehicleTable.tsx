import { Button } from './ui/Button'
import type { SortDirection, Vehicle } from '../types/vehicle'

type VehicleTableProps = {
  vehicles: Vehicle[]
  isLoading: boolean
  sortDirection: SortDirection
  editingVehicleId: number | null
  draftPrice: string
  onToggleSort: () => void
  onEditStart: (vehicle: Vehicle) => void
  onDraftPriceChange: (value: string) => void
  onSavePrice: (vehicleId: number) => void
}

export function VehicleTable({
  vehicles,
  isLoading,
  sortDirection,
  editingVehicleId,
  draftPrice,
  onToggleSort,
  onEditStart,
  onDraftPriceChange,
  onSavePrice,
}: VehicleTableProps) {
  if (isLoading) {
    return (
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
    )
  }

  return (
    <>
      <div className="hidden grid-cols-[1.4fr_1.4fr_0.8fr_1.5fr_0.7fr] items-center gap-3 rounded-t-2xl border border-stone-200 bg-stone-50/90 px-4 py-3 text-sm font-semibold text-stone-600 sm:grid">
        <span>Make</span>
        <span>Model</span>
        <span>Year</span>
        <span>
          <Button type="button" variant="ghost" className="p-0 text-sm" onClick={onToggleSort}>
            Sort by Price {sortDirection === 'asc' ? '↑' : '↓'}
          </Button>
        </span>
        <span>Edit</span>
      </div>

      {vehicles.length === 0 ? (
        <div className="rounded-b-2xl border border-stone-200 bg-stone-50 px-4 py-5 text-sm text-stone-600">
          No vehicles match your filter.
        </div>
      ) : (
        <ul className="divide-y divide-stone-200 overflow-hidden rounded-b-2xl border border-stone-200 bg-white">
          {vehicles.map((vehicle) => (
            <VehicleRow
              key={vehicle.id}
              vehicle={vehicle}
              isEditing={editingVehicleId === vehicle.id}
              draftPrice={draftPrice}
              onEditStart={onEditStart}
              onDraftPriceChange={onDraftPriceChange}
              onSavePrice={onSavePrice}
            />
          ))}
        </ul>
      )}
    </>
  )
}

type VehicleRowProps = {
  vehicle: Vehicle
  isEditing: boolean
  draftPrice: string
  onEditStart: (vehicle: Vehicle) => void
  onDraftPriceChange: (value: string) => void
  onSavePrice: (vehicleId: number) => void
}

function VehicleRow({
  vehicle,
  isEditing,
  draftPrice,
  onEditStart,
  onDraftPriceChange,
  onSavePrice,
}: VehicleRowProps) {
  return (
    <li className="grid gap-3 px-4 py-4 sm:grid-cols-[1.4fr_1.4fr_0.8fr_1.5fr_0.7fr] sm:items-center">
      <span className="text-sm font-medium text-stone-700">{vehicle.make}</span>
      <span className="text-sm font-medium text-stone-700">{vehicle.model}</span>
      <span className="text-sm text-stone-600">{vehicle.year}</span>
      <span className="text-sm text-stone-700">
        {isEditing ? (
          <div className="flex items-center gap-2">
            <input
              type="number"
              min="0"
              step="1"
              value={draftPrice}
              onChange={(event) => onDraftPriceChange(event.target.value)}
              aria-label={`Edit price for ${vehicle.make} ${vehicle.model}`}
              className="w-24 rounded-lg border border-stone-200 bg-white px-2.5 py-2 text-sm text-stone-700 outline-none transition focus:border-emerald-600 focus:ring-4 focus:ring-amber-100"
            />
            <Button type="button" onClick={() => onSavePrice(vehicle.id)}>
              Save
            </Button>
          </div>
        ) : vehicle.price === null ? (
          'N/A'
        ) : (
          `$${vehicle.price.toLocaleString()}`
        )}
      </span>
      <span>
        {isEditing ? null : (
          <Button type="button" onClick={() => onEditStart(vehicle)}>
            Edit
          </Button>
        )}
      </span>
    </li>
  )
}
