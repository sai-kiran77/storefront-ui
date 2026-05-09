import type { Product } from './product'

export interface CartItem {
  id: number
  name: string
  imageURL: string
  price: number
  currency: string
  stock: number // to enforce limits
  quantity: number
}

export function productToCartItem(product: Product, quantity = 1): CartItem {
  return {
    id: product.id,
    name: product.name,
    imageURL: product.imageURL,
    price: product.price,
    currency: product.currency,
    stock: product.quantity,
    quantity,
  }
}
