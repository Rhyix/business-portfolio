import type { AdminActivityItem } from './types'

function daysAgo(days: number): string {
  const date = new Date()
  date.setDate(date.getDate() - days)
  return date.toISOString().slice(0, 10)
}

export const initialActivity: AdminActivityItem[] = [
  { id: 'aact-1', type: 'approval.approved', message: 'Approved leave request REQ-1002 from Bianca Reyes.', timestamp: daysAgo(3) },
  { id: 'aact-2', type: 'approval.rejected', message: 'Rejected leave request REQ-1006 from Patricia Gomez.', timestamp: daysAgo(4) },
  { id: 'aact-3', type: 'kpi.updated', message: 'Customer Satisfaction was updated to 92%.', timestamp: daysAgo(2) },
  { id: 'aact-4', type: 'department.updated', message: 'IT department performance score was updated.', timestamp: daysAgo(3) },
  { id: 'aact-5', type: 'data.record_updated', message: 'Annual Compliance Filing was flagged for review.', timestamp: daysAgo(1) },
  { id: 'aact-6', type: 'approval.approved', message: 'Approved purchase request REQ-1009 from Jonathan Cruz.', timestamp: daysAgo(7) },
  { id: 'aact-7', type: 'kpi.updated', message: 'Open Support Tickets rose above target.', timestamp: daysAgo(1) },
]
