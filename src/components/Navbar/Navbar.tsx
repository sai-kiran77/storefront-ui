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
            <i
              className="fa-solid fa-cart-shopping navbar__cart-icon"
              aria-hidden="true"
            />

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
