import { NavLink } from 'react-router-dom'
import { useCart } from '../../context/CartContext'
import './Navbar.css'

export default function Navbar() {
  const { items } = useCart()
  const productCount = items.length

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    isActive ? 'navbar__link navbar__link--active' : 'navbar__link'

  const cartClass = ({ isActive }: { isActive: boolean }) =>
    isActive ? 'navbar__cart navbar__cart--active' : 'navbar__cart'

  return (
    <header className="navbar">
      <div className="container navbar__inner">
        <NavLink to="/" className="navbar__brand">
          StoreFront
        </NavLink>
        <nav className="navbar__links" aria-label="Primary">
          <NavLink to="/" end className={linkClass}>
            Products
          </NavLink>
          <NavLink
            to="/cart"
            className={cartClass}
            aria-label={`Cart, ${productCount} product${productCount === 1 ? '' : 's'}`}
          >
            <svg
              className="navbar__cart-icon"
              viewBox="0 0 24 24"
              width="22"
              height="22"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <circle cx="9" cy="20" r="1.5" />
              <circle cx="17" cy="20" r="1.5" />
              <path d="M3 4h2l2.4 11.2a2 2 0 0 0 2 1.6h7.7a2 2 0 0 0 2-1.5L21 8H6" />
            </svg>
            {productCount > 0 && (
              <span className="navbar__cart-badge" aria-hidden="true">
                {productCount > 99 ? '99+' : productCount}
              </span>
            )}
          </NavLink>
        </nav>
      </div>
    </header>
  )
}
