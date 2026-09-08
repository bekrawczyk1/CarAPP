import type { Vehicle } from '../types/vehicle'

const vehicles: Vehicle[] = [
  { id: 1, make: 'Toyota', model: 'Corolla', year: 2015, price: null },
  { id: 2, make: 'Jeep', model: 'Wrangler', year: 2019, price: 30000 },
  { id: 3, make: 'Audi', model: 'A4', year: 2017, price: 25000 },
  { id: 4, make: 'Jeep', model: 'Cherokee', year: 2020, price: null },
  { id: 5, make: 'BMW', model: 'X3', year: 2018, price: 37000 },
]

let vehiclesCache: Vehicle[] | null = null
let vehiclesRequest: Promise<Vehicle[]> | null = null

export const fetchVehicles = () => {
  if (vehiclesCache) {
    return Promise.resolve(vehiclesCache)
  }

  if (!vehiclesRequest) {
    vehiclesRequest = new Promise<Vehicle[]>((resolve) => {
      setTimeout(() => resolve(vehicles), 1000)
    }).then((data) => {
      vehiclesCache = data
      vehiclesRequest = null
      return data
    })
  }

  return vehiclesRequest
}
