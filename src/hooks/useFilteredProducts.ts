import { useMemo } from 'react'
import type { Product } from '../types/product'
import type { Filters } from '../types/filters'
import { matchesSearch } from '../utils/searchMatch'

/**
 * Compose a free-text search and structured filters into a single
 * filtered product list. Each predicate is independent and ANDed together:
 *
 *   product passes IFF
 *     matchesSearch(product, query)
 *     AND (filters.genders is empty OR includes product.gender)
 *     AND (filters.colours is empty OR includes product.color)
 *     AND (filters.types   is empty OR includes product.type)
 *     AND (filters.minPrice is null  OR product.price >= minPrice)
 *     AND (filters.maxPrice is null  OR product.price <= maxPrice)
 *
 * Memoised on (products, query, filters).
 */
export function useFilteredProducts(
  products: Product[],
  query: string,
  filters: Filters,
): Product[] {
  return useMemo(() => {
    return products.filter((product) => {
      if (!matchesSearch(product, query)) return false

      if (
        filters.genders.length > 0 &&
        !filters.genders.includes(product.gender)
      ) {
        return false
      }

      if (
        filters.colours.length > 0 &&
        !filters.colours.includes(product.color)
      ) {
        return false
      }

      if (filters.types.length > 0 && !filters.types.includes(product.type)) {
        return false
      }

      if (filters.minPrice !== null && product.price < filters.minPrice) {
        return false
      }

      if (filters.maxPrice !== null && product.price > filters.maxPrice) {
        return false
      }

      return true
    })
  }, [products, query, filters])
}
