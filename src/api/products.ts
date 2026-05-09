import type { Product } from '../types/product'

const PRODUCTS_ENDPOINT =
  'https://my-json-server.typicode.com/Gulzeesh/demo/products'

export async function fetchProducts(): Promise<Product[]> {
  const response = await fetch(PRODUCTS_ENDPOINT)

  if (!response.ok) {
    throw new Error(
      `Failed to load products: ${response.status} ${response.statusText}`,
    )
  }

  const data = (await response.json()) as Product[]

  if (!Array.isArray(data)) {
    throw new Error('Unexpected products response: not an array')
  }

  return data
}
