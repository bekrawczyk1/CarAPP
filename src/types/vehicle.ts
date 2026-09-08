export type Vehicle = {
  id: number
  make: string
  model: string
  year: number
  price: number | null
}

export type Range = {
  min: number
  max: number
}

export type SortDirection = 'asc' | 'desc'
