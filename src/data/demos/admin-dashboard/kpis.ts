import type { Kpi } from './types'

function daysAgo(days: number): string {
  const date = new Date()
  date.setDate(date.getDate() - days)
  return date.toISOString().slice(0, 10)
}

export const initialKpis: Kpi[] = [
  { id: 'KPI-1', metric: 'Monthly Revenue', category: 'Financial', currentValue: 1850000, target: 2000000, unit: 'currency', changePct: 4.2, status: 'Attention', updatedDate: daysAgo(1) },
  { id: 'KPI-2', metric: 'Operating Margin', category: 'Financial', currentValue: 18, target: 20, unit: 'percent', changePct: -1.1, status: 'Attention', updatedDate: daysAgo(1) },
  { id: 'KPI-3', metric: 'Budget Variance', category: 'Financial', currentValue: 3, target: 5, unit: 'percent', changePct: -0.6, status: 'On Track', updatedDate: daysAgo(3) },
  { id: 'KPI-4', metric: 'Customer Satisfaction', category: 'Customer', currentValue: 92, target: 90, unit: 'percent', changePct: 1.5, status: 'On Track', updatedDate: daysAgo(2) },
  { id: 'KPI-5', metric: 'New Customer Growth', category: 'Customer', currentValue: 142, target: 120, unit: 'number', changePct: 12.3, status: 'On Track', updatedDate: daysAgo(2) },
  { id: 'KPI-6', metric: 'Open Support Tickets', category: 'Operational', currentValue: 34, target: 25, unit: 'number', changePct: -6.0, status: 'Below Target', updatedDate: daysAgo(1) },
  { id: 'KPI-7', metric: 'On-Time Delivery', category: 'Operational', currentValue: 96, target: 95, unit: 'percent', changePct: 0.4, status: 'On Track', updatedDate: daysAgo(4) },
  { id: 'KPI-8', metric: 'Employee Attrition', category: 'Workforce', currentValue: 9, target: 8, unit: 'percent', changePct: 0.8, status: 'Below Target', updatedDate: daysAgo(5) },
  { id: 'KPI-9', metric: 'Headcount Utilization', category: 'Workforce', currentValue: 81, target: 85, unit: 'percent', changePct: 1.2, status: 'Attention', updatedDate: daysAgo(3) },
  { id: 'KPI-10', metric: 'Compliance Audit Score', category: 'Compliance', currentValue: 88, target: 90, unit: 'percent', changePct: -0.5, status: 'Attention', updatedDate: daysAgo(6) },
]
