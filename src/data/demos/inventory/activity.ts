import type { InventoryActivityItem } from './types'

export const initialActivity: InventoryActivityItem[] = [
  { id: 'iact-1', type: 'stock.received', message: 'Received 20 units of Mechanical Keyboard, Tenkeyless against PO-401.', timestamp: '2026-09-05' },
  { id: 'iact-2', type: 'stock.received', message: 'Received 10 units of 27" IPS Monitor against PO-401.', timestamp: '2026-09-05' },
  { id: 'iact-3', type: 'product.low_stock', message: 'Cold-Rolled Steel Sheet Roll is approaching its reorder level.', timestamp: '2026-09-07' },
  { id: 'iact-4', type: 'stock.received', message: 'Received 8 of 15 units of Adjustable Standing Desk against PO-402.', timestamp: '2026-09-09' },
  { id: 'iact-5', type: 'stock.adjusted', message: 'Safety Helmet, ANSI-Rated adjusted by -2 units (damaged in storage).', timestamp: '2026-09-09' },
  { id: 'iact-6', type: 'po.created', message: 'PO-410 created for Tahanan Packaging Corp.', timestamp: '2026-09-12' },
  { id: 'iact-7', type: 'stock.adjusted', message: 'Ballpoint Pens, Black (Box of 50) adjusted by +5 units (cycle count correction).', timestamp: '2026-09-13' },
]
