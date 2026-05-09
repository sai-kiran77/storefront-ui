import { NavLink } from 'react-router-dom'
import './Navbar.css'

export default function Navbar() {
  const linkClass = ({ isActive }: { isActive: boolean }) =>
    isActive ? 'navbar__link navbar__link--active' : 'navbar__link'

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
          <NavLink to="/cart" className={linkClass}>
            Cart
          </NavLink>
        </nav>
      </div>
    </header>
  )
}
