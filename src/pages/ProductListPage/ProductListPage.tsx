import { useMemo, useState } from 'react'
import { useProducts } from '../../context/ProductsContext'
import ProductCard from '../../components/ProductCard/ProductCard'
import SearchBar from '../../components/SearchBar/SearchBar'
import { matchesSearch } from '../../utils/searchMatch'
import './ProductListPage.css'

export default function ProductListPage() {
  const { products, loading, error, refetch } = useProducts()
  const [searchQuery, setSearchQuery] = useState('')

  const visibleProducts = useMemo(
    () => products.filter((p) => matchesSearch(p, searchQuery)),
    [products, searchQuery],
  )

  return (
    <main className="container page">
      <h1 className="product-list__title">Products</h1>
      <p className="product-list__subtitle">
        Browse our catalogue.
      </p>

      <div className="product-list__toolbar">
        <SearchBar value={searchQuery} onSearch={setSearchQuery} />
      </div>

      {loading && (
        <div className="product-list__state" role="status" aria-live="polite">
          Loading products…
        </div>
      )}

      {!loading && error && (
        <div
          className="product-list__state product-list__state--error"
          role="alert"
        >
          <p>{error}</p>
          <button
            type="button"
            className="product-list__retry"
            onClick={refetch}
          >
            Try again
          </button>
        </div>
      )}

      {!loading && !error && products.length === 0 && (
        <div className="product-list__state">No products available.</div>
      )}

      {!loading &&
        !error &&
        products.length > 0 &&
        visibleProducts.length === 0 && (
          <div className="product-list__state">
            No products match <strong>"{searchQuery}"</strong>.
          </div>
        )}

      {!loading && !error && visibleProducts.length > 0 && (
        <div className="product-list__grid">
          {visibleProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </main>
  )
}
