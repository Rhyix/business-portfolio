import type { Warehouse } from './types'

export const initialWarehouses: Warehouse[] = [
  {
    id: 'WH-101',
    name: 'Main Distribution Center',
    location: 'Quezon City, Metro Manila',
    manager: 'Ramon Villafuerte',
    capacity: 20000,
    status: 'Active',
  },
  {
    id: 'WH-102',
    name: 'North Warehouse',
    location: 'Valenzuela, Metro Manila',
    manager: 'Corazon Dimaandal',
    capacity: 12000,
    status: 'Active',
  },
  {
    id: 'WH-103',
    name: 'South Warehouse',
    location: 'Biñan, Laguna',
    manager: 'Teodoro Malabanan',
    capacity: 9000,
    status: 'Active',
  },
  {
    id: 'WH-104',
    name: 'Overflow Storage',
    location: 'Cabuyao, Laguna',
    manager: 'Marivic Concepcion',
    capacity: 5000,
    status: 'Inactive',
  },
]
