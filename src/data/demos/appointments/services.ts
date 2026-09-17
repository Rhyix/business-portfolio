import type { Service } from './types'

export const initialServices: Service[] = [
  { id: 'SVC-301', name: 'Initial Consultation', category: 'Consultation', durationMinutes: 30, price: 1500, assignedStaffIds: ['STF-101', 'STF-103'], status: 'Active' },
  { id: 'SVC-302', name: 'Comprehensive Assessment', category: 'Consultation', durationMinutes: 60, price: 3200, assignedStaffIds: ['STF-101'], status: 'Active' },
  { id: 'SVC-303', name: 'Follow-up Session', category: 'Consultation', durationMinutes: 30, price: 1200, assignedStaffIds: ['STF-101', 'STF-103'], status: 'Active' },
  { id: 'SVC-304', name: 'Routine Maintenance', category: 'Maintenance', durationMinutes: 45, price: 2500, assignedStaffIds: ['STF-102', 'STF-104'], status: 'Active' },
  { id: 'SVC-305', name: 'Emergency Maintenance', category: 'Maintenance', durationMinutes: 60, price: 4200, assignedStaffIds: ['STF-102'], status: 'Active' },
  { id: 'SVC-306', name: 'Equipment Installation', category: 'Installation', durationMinutes: 90, price: 5800, assignedStaffIds: ['STF-102', 'STF-104'], status: 'Active' },
  { id: 'SVC-307', name: 'Staff Training Session', category: 'Training', durationMinutes: 120, price: 8000, assignedStaffIds: ['STF-105'], status: 'Active' },
  { id: 'SVC-308', name: 'Product Demo', category: 'Consultation', durationMinutes: 45, price: 1800, assignedStaffIds: ['STF-103'], status: 'Inactive' },
]
