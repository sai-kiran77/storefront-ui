export interface Filters {
  genders: string[]
  colours: string[]
  types: string[]
  minPrice: number | null
  maxPrice: number | null
}

export const EMPTY_FILTERS: Filters = {
  genders: [],
  colours: [],
  types: [],
  minPrice: null,
  maxPrice: null,
}

// equivalent to EMPTY_FILTERS.
export function isEmptyFilters(f: Filters): boolean {
  return (
    f.genders.length === 0 &&
    f.colours.length === 0 &&
    f.types.length === 0 &&
    f.minPrice === null &&
    f.maxPrice === null
  )
}
