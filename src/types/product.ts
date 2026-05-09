/**
 * Shape of a single product as returned by the catalogue API.
 * Endpoint: GET https://my-json-server.typicode.com/Gulzeesh/demo/products
 */
export interface Product {
  id: number
  imageURL: string
  name: string
  type: string
  price: number
  currency: string
  color: string
  gender: string
  quantity: number
}
