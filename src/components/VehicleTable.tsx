import { Button } from './ui/Button'
import type { SortDirection, Vehicle } from '../types/vehicle'

type VehicleTableProps = {
  vehicles: Vehicle[]
  isLoading: boolean
  sortDirection: SortDirection
  editingPriceVehicleId: number | null
  draftPrice: string
  onToggleSort: () => void
  onEditPriceStart: (vehicle: Vehicle) => void
  onDraftPriceChange: (value: string) => void
  onSavePrice: (vehicleId: number) => void
}

export function VehicleTable({
  vehicles,
  isLoading,
  sortDirection,
  editingPriceVehicleId,
  draftPrice,
  onToggleSort,
  onEditPriceStart,
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
      <div className="hidden grid-cols-[minmax(0,1.4fr)_minmax(0,1.4fr)_minmax(0,0.8fr)_minmax(0,1.5fr)_minmax(0,0.7fr)] items-center gap-3 rounded-t-2xl border border-stone-200 bg-stone-50/90 px-4 py-3 text-sm font-semibold text-stone-600 sm:grid">
        <span>Make</span>
        <span>Model</span>
        <span>Year</span>
        <span className="flex justify-end pr-3 text-right sm:pr-4">
          <Button
            type="button"
            variant="ghost"
            className="whitespace-nowrap p-0 text-sm"
            onClick={onToggleSort}
          >
            Sort by Price {sortDirection === 'asc' ? '↑' : '↓'}
          </Button>
        </span>
        <span>Edit price</span>
      </div>

      <div className="min-h-[20rem] sm:min-h-[18rem]">
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
                isEditing={editingPriceVehicleId === vehicle.id}
                draftPrice={draftPrice}
                onEditPriceStart={onEditPriceStart}
                onDraftPriceChange={onDraftPriceChange}
                onSavePrice={onSavePrice}
              />
            ))}
          </ul>
        )}
      </div>
    </>
  )
}

type VehicleRowProps = {
  vehicle: Vehicle
  isEditing: boolean
  draftPrice: string
  onEditPriceStart: (vehicle: Vehicle) => void
  onDraftPriceChange: (value: string) => void
  onSavePrice: (vehicleId: number) => void
}

function VehicleRow({
  vehicle,
  isEditing,
  draftPrice,
  onEditPriceStart,
  onDraftPriceChange,
  onSavePrice,
}: VehicleRowProps) {
  return (
    <li className="grid min-w-0 grid-cols-2 gap-x-4 gap-y-3 px-4 py-4 transition-colors duration-150 hover:bg-amber-50/60 sm:grid-cols-[minmax(0,1.4fr)_minmax(0,1.4fr)_minmax(0,0.8fr)_minmax(0,1.5fr)_minmax(0,0.7fr)] sm:items-center">
      <span className="flex min-w-0 flex-col gap-1 text-sm font-medium text-stone-700">
        <span className="text-[0.65rem] font-bold uppercase tracking-[0.08em] text-stone-500 sm:hidden">
          Make
        </span>
        {vehicle.make}
      </span>
      <span className="flex min-w-0 flex-col gap-1 text-sm font-medium text-stone-700">
        <span className="text-[0.65rem] font-bold uppercase tracking-[0.08em] text-stone-500 sm:hidden">
          Model
        </span>
        {vehicle.model}
      </span>
      <span className="flex min-w-0 flex-col gap-1 text-sm text-stone-600">
        <span className="text-[0.65rem] font-bold uppercase tracking-[0.08em] text-stone-500 sm:hidden">
          Year
        </span>
        {vehicle.year}
      </span>
      <span className={`min-w-0 pr-3 text-sm text-stone-700 sm:pr-4 sm:text-right ${isEditing ? 'sm:col-span-2' : ''}`}>
        {isEditing ? (
          <div className="flex min-w-0 max-w-full flex-wrap items-center justify-end gap-2 rounded-xl border border-amber-300 bg-amber-50 px-2.5 py-2 shadow-sm">
            <span className="w-full max-w-full whitespace-normal text-center text-xs font-bold uppercase tracking-[0.06em] text-amber-800 sm:w-auto sm:whitespace-nowrap sm:text-left">
              Editing price
            </span>
            <input
              type="number"
              min="0"
              step="1"
              value={draftPrice}
              onChange={(event) => onDraftPriceChange(event.target.value)}
              aria-label={`Edit price for ${vehicle.make} ${vehicle.model}`}
              className="w-20 max-w-full rounded-lg border-2 border-amber-300 bg-white px-2.5 py-2 text-right text-sm font-semibold text-stone-700 outline-none transition focus:border-emerald-600 focus:ring-4 focus:ring-amber-100 sm:w-24"
            />
            <Button type="button" className="w-full sm:w-auto" onClick={() => onSavePrice(vehicle.id)}>
              Save price
            </Button>
          </div>
        ) : vehicle.price === null ? (
          <span className="flex flex-col gap-1 sm:items-end">
            <span className="text-[0.65rem] font-bold uppercase tracking-[0.08em] text-stone-500 sm:hidden">
              Price
            </span>
            N/A
          </span>
        ) : (
          <span className="flex flex-col gap-1 sm:items-end">
            <span className="text-[0.65rem] font-bold uppercase tracking-[0.08em] text-stone-500 sm:hidden">
              Price
            </span>
            {`$${vehicle.price.toLocaleString()}`}
          </span>
        )}
      </span>
      {!isEditing && (
        <span className="col-span-2 flex min-w-0 justify-end sm:col-span-1 sm:justify-start">
          <Button
            type="button"
            className="w-full whitespace-nowrap sm:w-auto"
            onClick={() => onEditPriceStart(vehicle)}
          >
            Edit price
          </Button>
        </span>
      )}
    </li>
  )
}
