/**
 * Format a numeric amount with its currency code.
 * Falls back to "<code> <amount>" if Intl can't handle the currency.
 */
export function formatPrice(amount: number, currency: string): string {
  try {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency,
      maximumFractionDigits: 0,
    }).format(amount)
  } catch {
    return `${currency} ${amount}`
  }
}
