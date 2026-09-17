import type { Approval } from './types'

function daysAgo(days: number): string {
  const date = new Date()
  date.setDate(date.getDate() - days)
  return date.toISOString().slice(0, 10)
}

export const initialApprovals: Approval[] = [
  { id: 'REQ-1001', type: 'Purchase Request', requester: 'Ramon Cruz', department: 'Operations', dateSubmitted: daysAgo(1), status: 'Pending', details: 'Replacement forklift battery, ₱42,000.' },
  { id: 'REQ-1002', type: 'Leave Request', requester: 'Bianca Reyes', department: 'Human Resources', dateSubmitted: daysAgo(4), status: 'Approved', details: '5-day annual leave, Oct 5–9.', decisionDate: daysAgo(3) },
  { id: 'REQ-1003', type: 'Budget Request', requester: 'Teodoro Lim', department: 'Finance', dateSubmitted: daysAgo(2), status: 'Pending', details: 'Additional ₱180,000 for Q4 audit preparation.' },
  { id: 'REQ-1004', type: 'Administrative Request', requester: 'Corazon Santos', department: 'Administration', dateSubmitted: daysAgo(6), status: 'Approved', details: 'New signage for the reception area.', decisionDate: daysAgo(5) },
  { id: 'REQ-1005', type: 'Purchase Request', requester: 'Miguel Torres', department: 'IT', dateSubmitted: daysAgo(1), status: 'Pending', details: '12 replacement laptops, ₱540,000.' },
  { id: 'REQ-1006', type: 'Leave Request', requester: 'Patricia Gomez', department: 'Sales', dateSubmitted: daysAgo(5), status: 'Rejected', details: '10-day leave overlapping quarter close.', decisionDate: daysAgo(4) },
  { id: 'REQ-1007', type: 'Budget Request', requester: 'Enrico Villanueva', department: 'Operations', dateSubmitted: daysAgo(0), status: 'Pending', details: 'Warehouse safety equipment upgrade, ₱95,000.' },
  { id: 'REQ-1008', type: 'Administrative Request', requester: 'Angela Reyes', department: 'Human Resources', dateSubmitted: daysAgo(1), status: 'Pending', details: 'Update the employee handbook policy section.' },
  { id: 'REQ-1009', type: 'Purchase Request', requester: 'Jonathan Cruz', department: 'Sales', dateSubmitted: daysAgo(8), status: 'Approved', details: 'CRM software renewal, ₱210,000.', decisionDate: daysAgo(7) },
  { id: 'REQ-1010', type: 'Leave Request', requester: 'Karen Bautista', department: 'Finance', dateSubmitted: daysAgo(3), status: 'Approved', details: '3-day sick leave.', decisionDate: daysAgo(3) },
  { id: 'REQ-1011', type: 'Budget Request', requester: 'Paolo Mercado', department: 'IT', dateSubmitted: daysAgo(6), status: 'Rejected', details: 'Additional cloud budget beyond the approved cap.', decisionDate: daysAgo(5) },
  { id: 'REQ-1012', type: 'Purchase Request', requester: 'Liza Fernandez', department: 'Administration', dateSubmitted: daysAgo(0), status: 'Pending', details: 'Office furniture replacement, ₱68,000.' },
  { id: 'REQ-1013', type: 'Administrative Request', requester: 'Samantha Uy', department: 'Operations', dateSubmitted: daysAgo(9), status: 'Approved', details: 'Update the department organisation chart.', decisionDate: daysAgo(8) },
  { id: 'REQ-1014', type: 'Leave Request', requester: 'Diego Ramirez', department: 'IT', dateSubmitted: daysAgo(1), status: 'Pending', details: '4-day annual leave.' },
]
