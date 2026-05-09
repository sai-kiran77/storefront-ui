import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './styles/global.css'
import App from './App.tsx'
import { ProductsProvider } from './context/ProductsContext'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <ProductsProvider>
        <App />
      </ProductsProvider>
    </BrowserRouter>
  </StrictMode>,
)
