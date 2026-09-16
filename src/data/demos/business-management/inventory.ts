import type { StockMovement } from './types'

/** Fictional recent stock movement log for the Business Management System. */
export const stockMovements: StockMovement[] = [
  { id: 'MOV-9001', productName: 'Wireless Optical Mouse', type: 'Restock', quantity: 80, date: '2026-09-10' },
  { id: 'MOV-9002', productName: 'Mechanical Keyboard, Tenkeyless', type: 'Sale', quantity: -6, date: '2026-09-11' },
  { id: 'MOV-9003', productName: 'Adjustable Standing Desk', type: 'Sale', quantity: -3, date: '2026-09-05' },
  { id: 'MOV-9004', productName: 'A4 Copy Paper, 80gsm (Ream)', type: 'Restock', quantity: 200, date: '2026-09-12' },
  { id: 'MOV-9005', productName: 'Packing Tape, Clear (6-pack)', type: 'Sale', quantity: -15, date: '2026-09-10' },
  { id: 'MOV-9006', productName: 'Lever Arch File, A4', type: 'Adjustment', quantity: -12, date: '2026-09-02' },
  { id: 'MOV-9007', productName: '27" IPS Monitor', type: 'Sale', quantity: -2, date: '2026-09-08' },
  { id: 'MOV-9008', productName: 'Corrugated Shipping Box, Medium', type: 'Restock', quantity: 1000, date: '2026-09-09' },
]
