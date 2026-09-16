const currencyFormatter = new Intl.NumberFormat('en-PH', {
  style: 'currency',
  currency: 'PHP',
  maximumFractionDigits: 0,
})

const numberFormatter = new Intl.NumberFormat('en-PH')

const dateFormatter = new Intl.DateTimeFormat('en-PH', {
  month: 'short',
  day: 'numeric',
  year: 'numeric',
})

/** Formats a plain number as demo Philippine-peso currency, e.g. "₱1,284,500". */
export function formatCurrency(amount: number): string {
  return currencyFormatter.format(amount)
}

/** Formats a plain number with thousands separators, e.g. "1,248". */
export function formatNumber(value: number): string {
  return numberFormatter.format(value)
}

/** Formats an ISO date string for display, e.g. "Mar 5, 2026". */
export function formatDate(isoDate: string): string {
  return dateFormatter.format(new Date(isoDate))
}
