import type { Product } from '../../types/product'
import { useCart } from '../../context/CartContext'
import { formatPrice } from '../../utils/formatPrice'
import './ProductCard.css'

interface ProductCardProps {
  product: Product
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart, items } = useCart()
  const inCartQty = items.find((i) => i.id === product.id)?.quantity ?? 0
  const outOfStock = product.quantity === 0
  const atStockLimit = !outOfStock && inCartQty >= product.quantity

  return (
    <article className="product-card" aria-label={product.name}>
      <div className="product-card__media">
        <img
          src={product.imageURL}
          alt={product.name}
          loading="lazy"
          className="product-card__image"
        />
        {outOfStock && (
          <span className="product-card__badge">Out of stock</span>
        )}
      </div>
      <div className="product-card__body">
        <h3 className="product-card__name">{product.name}</h3>
        <p className="product-card__meta">
          {product.gender} · {product.type}
        </p>
        <p className="product-card__price">
          {formatPrice(product.price, product.currency)}
        </p>
        <button
          type="button"
          className="product-card__add"
          onClick={() => addToCart(product)}
          disabled={outOfStock || atStockLimit}
        >
          {outOfStock
            ? 'Out of stock'
            : atStockLimit
              ? `Max ${product.quantity} reached`
              : inCartQty > 0
                ? `Add another (${inCartQty} in cart)`
                : 'Add to cart'}
        </button>
      </div>
    </article>
  )
}
