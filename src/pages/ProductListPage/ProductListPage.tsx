import { useProducts } from '../../context/ProductsContext'
import ProductCard from '../../components/ProductCard/ProductCard'
import './ProductListPage.css'

export default function ProductListPage() {
  const { products, loading, error, refetch } = useProducts()

  return (
    <main className="container page">
      <h1 className="product-list__title">Products</h1>
      <p className="product-list__subtitle">
        Browse our t-shirt catalogue.
      </p>

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

      {!loading && !error && products.length > 0 && (
        <div className="product-list__grid">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </main>
  )
}
