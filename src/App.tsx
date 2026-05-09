import { Link, Route, Routes } from 'react-router-dom'
import ProductListPage from './pages/ProductListPage/ProductListPage'
import CartPage from './pages/CartPage/CartPage'

function App() {
  return (
    <>
      <nav style={{ display: 'flex', gap: 16, padding: 16, borderBottom: '1px solid #ddd' }}>
        <Link to="/">Products</Link>
        <Link to="/cart">Cart</Link>
      </nav>
      <Routes>
        <Route path="/" element={<ProductListPage />} />
        <Route path="/cart" element={<CartPage />} />
      </Routes>
    </>
  )
}

export default App
