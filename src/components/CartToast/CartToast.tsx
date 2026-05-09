import { useEffect } from 'react'
import { useCart } from '../../context/CartContext'
import './CartToast.css'

const AUTO_DISMISS_MS = 4000

export default function CartToast() {
  const { error, clearError } = useCart()

  useEffect(() => {
    if (!error) return
    const id = window.setTimeout(clearError, AUTO_DISMISS_MS)
    return () => window.clearTimeout(id)
  }, [error, clearError])

  if (!error) return null

  return (
    <div className="cart-toast" role="alert" aria-live="assertive">
      <span className="cart-toast__message">{error}</span>
      <button
        type="button"
        className="cart-toast__dismiss"
        onClick={clearError}
        aria-label="Dismiss"
      >
        ×
      </button>
    </div>
  )
}
