import { Route, Routes } from 'react-router-dom'
import Navbar from './components/Navbar/Navbar'
import ProductListPage from './pages/ProductListPage/ProductListPage'
import CartPage from './pages/CartPage/CartPage'

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<ProductListPage />} />
        <Route path="/cart" element={<CartPage />} />
      </Routes>
    </>
  )
}

export default App
