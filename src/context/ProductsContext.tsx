import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react'
import { fetchProducts } from '../api/products'
import type { Product } from '../types/product'

interface ProductsContextValue {
  products: Product[]
  loading: boolean
  error: string | null
  refetch: () => void
}

const ProductsContext = createContext<ProductsContextValue | undefined>(
  undefined,
)

export function ProductsProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [reloadKey, setReloadKey] = useState(0)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError(null)

    fetchProducts()
      .then((data) => {
        if (!cancelled) setProducts(data)
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Failed to load products')
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [reloadKey])

  const refetch = () => setReloadKey((k) => k + 1)

  return (
    <ProductsContext.Provider value={{ products, loading, error, refetch }}>
      {children}
    </ProductsContext.Provider>
  )
}

export function useProducts(): ProductsContextValue {
  const ctx = useContext(ProductsContext)
  if (!ctx) {
    throw new Error('useProducts must be used within a ProductsProvider')
  }
  return ctx
}
