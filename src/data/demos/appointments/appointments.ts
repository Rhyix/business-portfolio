import { initialCustomers } from './customers'
import { initialServices } from './services'
import { initialStaff } from './staff'
import { addDaysISO, todayISO } from './types'
import type { Appointment, AppointmentStatus } from './types'

function customerById(id: string) {
  const found = initialCustomers.find((customer) => customer.id === id)
  if (!found) throw new Error(`Unknown seed customer id: ${id}`)
  return found
}

function serviceById(id: string) {
  const found = initialServices.find((service) => service.id === id)
  if (!found) throw new Error(`Unknown seed service id: ${id}`)
  return found
}

function staffById(id: string) {
  const found = initialStaff.find((staff) => staff.id === id)
  if (!found) throw new Error(`Unknown seed staff id: ${id}`)
  return found
}

interface SeedAppointment {
  id: string
  customerId: string
  serviceId: string
  staffId: string
  /** Days from "today" (at demo load time) — keeps the seed data evergreen instead of aging as fixed dates. */
  dayOffset: number
  time: string
  status: AppointmentStatus
  notes?: string
  createdOffset: number
}

const seeds: SeedAppointment[] = [
  { id: 'APT-5001', customerId: 'CUST-2006', serviceId: 'SVC-304', staffId: 'STF-104', dayOffset: -6, time: '09:00', status: 'Cancelled', createdOffset: -10 },
  { id: 'APT-5002', customerId: 'CUST-2001', serviceId: 'SVC-301', staffId: 'STF-101', dayOffset: -5, time: '09:00', status: 'Completed', createdOffset: -9 },
  { id: 'APT-5003', customerId: 'CUST-2002', serviceId: 'SVC-304', staffId: 'STF-102', dayOffset: -4, time: '10:00', status: 'Completed', createdOffset: -8 },
  { id: 'APT-5004', customerId: 'CUST-2003', serviceId: 'SVC-303', staffId: 'STF-101', dayOffset: -3, time: '14:00', status: 'No Show', createdOffset: -7 },
  { id: 'APT-5005', customerId: 'CUST-2004', serviceId: 'SVC-307', staffId: 'STF-105', dayOffset: -3, time: '10:00', status: 'Completed', createdOffset: -7 },
  { id: 'APT-5006', customerId: 'CUST-2005', serviceId: 'SVC-301', staffId: 'STF-103', dayOffset: -2, time: '09:30', status: 'Completed', createdOffset: -6 },
  { id: 'APT-5007', customerId: 'CUST-2007', serviceId: 'SVC-305', staffId: 'STF-102', dayOffset: -2, time: '11:00', status: 'Cancelled', createdOffset: -6 },
  { id: 'APT-5008', customerId: 'CUST-2008', serviceId: 'SVC-302', staffId: 'STF-101', dayOffset: -1, time: '09:00', status: 'Completed', createdOffset: -5 },
  { id: 'APT-5009', customerId: 'CUST-2009', serviceId: 'SVC-306', staffId: 'STF-104', dayOffset: -1, time: '13:00', status: 'Completed', createdOffset: -5 },
  { id: 'APT-5010', customerId: 'CUST-2001', serviceId: 'SVC-301', staffId: 'STF-101', dayOffset: 0, time: '09:00', status: 'Confirmed', createdOffset: -4 },
  { id: 'APT-5011', customerId: 'CUST-2010', serviceId: 'SVC-303', staffId: 'STF-101', dayOffset: 0, time: '11:00', status: 'Pending', createdOffset: -1 },
  { id: 'APT-5012', customerId: 'CUST-2002', serviceId: 'SVC-304', staffId: 'STF-102', dayOffset: 0, time: '09:00', status: 'Confirmed', createdOffset: -3 },
  { id: 'APT-5013', customerId: 'CUST-2003', serviceId: 'SVC-301', staffId: 'STF-103', dayOffset: 0, time: '10:00', status: 'Confirmed', createdOffset: -3 },
  { id: 'APT-5014', customerId: 'CUST-2004', serviceId: 'SVC-307', staffId: 'STF-105', dayOffset: 0, time: '14:00', status: 'Pending', createdOffset: -1 },
  { id: 'APT-5015', customerId: 'CUST-2005', serviceId: 'SVC-302', staffId: 'STF-101', dayOffset: 1, time: '10:00', status: 'Confirmed', createdOffset: -3 },
  { id: 'APT-5016', customerId: 'CUST-2007', serviceId: 'SVC-303', staffId: 'STF-103', dayOffset: 1, time: '09:00', status: 'Pending', createdOffset: -1 },
  { id: 'APT-5017', customerId: 'CUST-2008', serviceId: 'SVC-304', staffId: 'STF-102', dayOffset: 2, time: '09:00', status: 'Confirmed', createdOffset: -2 },
  {
    id: 'APT-5018',
    customerId: 'CUST-2009',
    serviceId: 'SVC-301',
    staffId: 'STF-101',
    dayOffset: 2,
    time: '15:00',
    status: 'Rescheduled',
    notes: 'Moved from an earlier date at the customer’s request.',
    createdOffset: -8,
  },
  { id: 'APT-5019', customerId: 'CUST-2001', serviceId: 'SVC-307', staffId: 'STF-105', dayOffset: 3, time: '10:00', status: 'Pending', createdOffset: -1 },
  { id: 'APT-5020', customerId: 'CUST-2002', serviceId: 'SVC-301', staffId: 'STF-103', dayOffset: 5, time: '09:00', status: 'Confirmed', createdOffset: -2 },
  { id: 'APT-5021', customerId: 'CUST-2003', serviceId: 'SVC-306', staffId: 'STF-102', dayOffset: 7, time: '09:00', status: 'Pending', createdOffset: -1 },
  { id: 'APT-5022', customerId: 'CUST-2004', serviceId: 'SVC-301', staffId: 'STF-103', dayOffset: 9, time: '09:00', status: 'Confirmed', createdOffset: -1 },
]

export const initialAppointments: Appointment[] = seeds.map((seed) => {
  const customer = customerById(seed.customerId)
  const service = serviceById(seed.serviceId)
  const staffMember = staffById(seed.staffId)

  return {
    id: seed.id,
    customerId: customer.id,
    customerName: customer.name,
    serviceId: service.id,
    serviceName: service.name,
    staffId: staffMember.id,
    staffName: staffMember.name,
    date: addDaysISO(todayISO(), seed.dayOffset),
    time: seed.time,
    durationMinutes: service.durationMinutes,
    price: service.price,
    status: seed.status,
    notes: seed.notes,
    createdDate: addDaysISO(todayISO(), seed.createdOffset),
  }
})
