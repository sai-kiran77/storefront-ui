import type { Product } from '../types/product'

/**
 * Tokenise a text query on whitespace, lowercased.
 */
export function tokenize(query: string): string[] {
  return query.trim().toLowerCase().split(" ").filter(Boolean)
}

/**
 * Does the product match the search query?
 *
 * Rules:
 * - Empty query matches all products.
 * - Query is split into whitespace-separated tokens.
 * - Each token must appear (case-insensitive substring) in at least
 *   one of: name, colour, type.  (AND across tokens, OR across fields.)
 *
 * Example: "green polo" matches a "Green Polo" product because
 *   - "green" is in `color: "Green"`
 *   - "polo"  is in `type: "Polo"`
 */
export function matchesSearch(product: Product, query: string): boolean {
  const tokens = tokenize(query)
  if (tokens.length === 0) return true
  const haystack = `${product.name} ${product.color} ${product.type}`.toLowerCase()
  return tokens.every((token) => haystack.includes(token))
}
