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
const INITIAL_STATE: CartState = { items: [] }

function loadInitialState(): CartState {
  if (typeof window === 'undefined') return INITIAL_STATE;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return INITIAL_STATE;
    const parsed = JSON.parse(raw) as CartState
    if (!parsed || !Array.isArray(parsed.items)) return INITIAL_STATE;
    return { items: parsed.items }
  } catch {
    return INITIAL_STATE
  }
}

interface CartState {
  items: CartItem[]
}

type CartAction =
  | { type: 'ADD'; product: Product }
  | { type: 'REMOVE'; id: number }
  | { type: 'INCREMENT'; id: number }
  | { type: 'DECREMENT'; id: number }
  | { type: 'CLEAR' }


function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'ADD': {
      const existing = state.items.find((i) => i.id === action.product.id)
      if (existing) {
        return {
          items: state.items.map((i) =>
            i.id === action.product.id ? { ...i, quantity: i.quantity + 1 } : i,
          ),
        }
      }
      return { items: [...state.items, productToCartItem(action.product, 1)] }
    }

    case 'INCREMENT':
      return {
        items: state.items.map((i) =>
          i.id === action.id ? { ...i, quantity: i.quantity + 1 } : i,
        ),
      }

    case 'DECREMENT':
      return {
        items: state.items
          .map((i) =>
            i.id === action.id ? { ...i, quantity: i.quantity - 1 } : i,
          )
          .filter((i) => i.quantity > 0),
      }

    case 'REMOVE':
      return { items: state.items.filter((i) => i.id !== action.id) }

    case 'CLEAR':
      return INITIAL_STATE

    default:
      return state
  }
}

interface CartContextValue {
  items: CartItem[]
  itemCount: number
  totalAmount: number
  addToCart: (product: Product) => void
  incrementQty: (id: number) => void
  decrementQty: (id: number) => void
  removeFromCart: (id: number) => void
  clearCart: () => void
}

const CartContext = createContext<CartContextValue | undefined>(undefined)

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, undefined, loadInitialState)

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
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
      addToCart: (product) => dispatch({ type: 'ADD', product }),
      incrementQty: (id) => dispatch({ type: 'INCREMENT', id }),
      decrementQty: (id) => dispatch({ type: 'DECREMENT', id }),
      removeFromCart: (id) => dispatch({ type: 'REMOVE', id }),
      clearCart: () => dispatch({ type: 'CLEAR' }),
    }
  }, [state])

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within a CartProvider')
  return ctx
}
