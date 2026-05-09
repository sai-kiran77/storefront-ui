import { Link } from 'react-router-dom'
import { useCart } from '../../context/CartContext'
import { formatPrice } from '../../utils/formatPrice'
import './CartPage.css'

export default function CartPage() {
  const {
    items,
    itemCount,
    totalAmount,
    incrementQty,
    decrementQty,
    removeFromCart,
    clearCart,
  } = useCart()

  if (items.length === 0) {
    return (
      <main className="container page">
        <h1 className="cart-page__title">Your Cart</h1>
        <div className="cart-page__empty">
          <p className="text-muted">Your cart is empty.</p>
          <Link to="/" className="cart-page__cta">
            Browse products
          </Link>
        </div>
      </main>
    )
  }

  const currency = items[0].currency

  return (
    <main className="container page">
      <div className="cart-page__header">
        <h1 className="cart-page__title">
          Your Cart <span className="cart-page__count">({itemCount})</span>
        </h1>
        <button
          type="button"
          className="cart-page__clear"
          onClick={clearCart}
        >
          Clear cart
        </button>
      </div>

      <ul className="cart-page__list">
        {items.map((item) => {
          const atLimit = item.quantity >= item.stock
          const lineTotal = item.price * item.quantity
          return (
            <li key={item.id} className="cart-item">
              <img
                src={item.imageURL}
                alt={item.name}
                className="cart-item__image"
              />
              <div className="cart-item__info">
                <h3 className="cart-item__name">{item.name}</h3>
                <p className="cart-item__price">
                  {formatPrice(item.price, item.currency)}
                </p>
                <p className="cart-item__stock text-muted">
                  {item.stock} in stock
                </p>
              </div>

              <div className="cart-item__qty" role="group" aria-label={`Quantity for ${item.name}`}>
                <button
                  type="button"
                  className="cart-item__qty-btn"
                  onClick={() => decrementQty(item.id)}
                  aria-label="Decrease quantity"
                >
                  <i className="fa-solid fa-minus" aria-hidden="true" />
                </button>
                <span className="cart-item__qty-value" aria-live="polite">
                  {item.quantity}
                </span>
                <button
                  type="button"
                  className="cart-item__qty-btn"
                  onClick={() => incrementQty(item.id)}
                  disabled={atLimit}
                  aria-label="Increase quantity"
                  title={atLimit ? `Only ${item.stock} in stock` : undefined}
                >
                  <i className="fa-solid fa-plus" aria-hidden="true" />
                </button>
              </div>

              <div className="cart-item__line-total">
                {formatPrice(lineTotal, item.currency)}
              </div>

              <button
                type="button"
                className="cart-item__remove"
                onClick={() => removeFromCart(item.id)}
                aria-label={`Remove ${item.name} from cart`}
              >
                ×
              </button>
            </li>
          )
        })}
      </ul>

      <div className="cart-page__summary">
        <span className="cart-page__summary-label">Total</span>
        <span className="cart-page__summary-total">
          {formatPrice(totalAmount, currency)}
        </span>
      </div>
    </main>
  )
}
