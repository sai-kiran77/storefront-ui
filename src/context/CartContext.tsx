import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  type ReactNode,
} from 'react'
import type { Product } from '../types/product'
import { productToCartItem, type CartItem } from '../types/cart'

const STORAGE_KEY = 'storefront.cart.v1'
const INITIAL_STATE: CartState = { items: [], error: null }

function loadInitialState(): CartState {
  if (typeof window === 'undefined') return INITIAL_STATE;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return INITIAL_STATE;
    const parsed = JSON.parse(raw) as CartState
    if (!parsed || !Array.isArray(parsed.items)) return INITIAL_STATE;
    return { items: parsed.items, error: null }
  } catch {
    return INITIAL_STATE
  }
}

interface CartState {
  items: CartItem[]
  /** Last user-facing error message (e.g. stock exceeded). Cleared on next successful action. */
  error: string | null
}

type CartAction =
  | { type: 'ADD'; product: Product }
  | { type: 'REMOVE'; id: number }
  | { type: 'INCREMENT'; id: number }
  | { type: 'DECREMENT'; id: number }
  | { type: 'CLEAR' }
  | { type: 'CLEAR_ERROR' }


function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'ADD': {
      const product = action.product
      if (product.quantity <= 0) {
        return { ...state, error: `"${product.name}" is out of stock.` }
      }
      const existing = state.items.find((i) => i.id === product.id)
      if (existing) {
        if (existing.quantity + 1 > existing.stock) {
          return {
            ...state,
            error: `Only ${existing.stock} of "${existing.name}" in stock.`,
          }
        }
        return {
          error: null,
          items: state.items.map((i) =>
            i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i,
          ),
        }
      }
      return {
        error: null,
        items: [...state.items, productToCartItem(product, 1)],
      }
    }

    case 'INCREMENT': {
      const item = state.items.find((i) => i.id === action.id)
      if (!item) return state
      if (item.quantity + 1 > item.stock) {
        return {
          ...state,
          error: `Only ${item.stock} of "${item.name}" in stock.`,
        }
      }
      return {
        error: null,
        items: state.items.map((i) =>
          i.id === action.id ? { ...i, quantity: i.quantity + 1 } : i,
        ),
      }
    }

    case 'DECREMENT':
      return {
        error: null,
        items: state.items
          .map((i) =>
            i.id === action.id ? { ...i, quantity: i.quantity - 1 } : i,
          )
          .filter((i) => i.quantity > 0),
      }

    case 'REMOVE':
      return {
        error: null,
        items: state.items.filter((i) => i.id !== action.id),
      }

    case 'CLEAR':
      return INITIAL_STATE

    case 'CLEAR_ERROR':
      return state.error === null ? state : { ...state, error: null }

    default:
      return state
  }
}

interface CartContextValue {
  items: CartItem[]
  itemCount: number
  totalAmount: number
  error: string | null
  addToCart: (product: Product) => void
  incrementQty: (id: number) => void
  decrementQty: (id: number) => void
  removeFromCart: (id: number) => void
  clearCart: () => void
  clearError: () => void
}

const CartContext = createContext<CartContextValue | undefined>(undefined)

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, undefined, loadInitialState)

  useEffect(() => {
    try {
      // Persist only items; error is transient.
      window.localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ items: state.items }),
      )
    } catch {

    }
  }, [state])

  const value = useMemo<CartContextValue>(() => {
    const itemCount = state.items.reduce((sum, i) => sum + i.quantity, 0)
    const totalAmount = state.items.reduce(
      (sum, i) => sum + i.quantity * i.price,
      0,
    )
    return {
      items: state.items,
      itemCount,
      totalAmount,
      error: state.error,
      addToCart: (product) => dispatch({ type: 'ADD', product }),
      incrementQty: (id) => dispatch({ type: 'INCREMENT', id }),
      decrementQty: (id) => dispatch({ type: 'DECREMENT', id }),
      removeFromCart: (id) => dispatch({ type: 'REMOVE', id }),
      clearCart: () => dispatch({ type: 'CLEAR' }),
      clearError: () => dispatch({ type: 'CLEAR_ERROR' }),
    }
  }, [state])

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within a CartProvider')
  return ctx
}
