import type { Product } from '../../types/product'
import { formatPrice } from '../../utils/formatPrice'
import './ProductCard.css'

interface ProductCardProps {
  product: Product
}

export default function ProductCard({ product }: ProductCardProps) {
  const outOfStock = product.quantity === 0

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
      </div>
    </article>
  )
}
