import {
  Boxes,
  ShoppingCart,
  UsersRound,
  BarChart3,
  UserRound,
  Briefcase,
  ClipboardCheck,
  LayoutDashboard,
  Workflow,
  Link2,
  ShieldCheck,
} from 'lucide-react'
import type { IconComponent, ValueProp } from '../types/content'

/** Route to the flagship interactive demo, reused by the homepage showcase and the project card. */
export const featuredPlatformHref = '/solutions/integrated-business-management-platform'

export interface CapabilityGroup {
  title: string
  icon: IconComponent
  items: string[]
}

/** The three capability groups shown under the platform preview. */
export const platformCapabilities: CapabilityGroup[] = [
  {
    title: 'Business Operations',
    icon: ShoppingCart,
    items: ['Customers', 'Orders', 'Products', 'Inventory', 'Invoices'],
  },
  {
    title: 'People & HR',
    icon: UsersRound,
    items: ['Employees', 'Attendance', 'Leave Requests', 'Recruitment', 'Documents'],
  },
  {
    title: 'Analytics & Control',
    icon: BarChart3,
    items: ['Reports', 'Dashboards', 'Settings', 'Activity'],
  },
]

export interface PlatformFlow {
  label: string
  steps: string[]
}

/** Short workflow chains shown in the integration story, illustrating how modules connect. */
export const platformFlows: PlatformFlow[] = [
  {
    label: 'Order fulfilment',
    steps: ['Customer', 'Order', 'Inventory', 'Invoice'],
  },
  {
    label: 'Hiring workflow',
    steps: ['Applicant', 'Hired', 'Employee', 'Attendance / Leave'],
  },
]

/** Why the integrated approach matters, reusing the same shape as the homepage ValueProps. */
export const platformHighlights: ValueProp[] = [
  {
    title: 'One workspace',
    description: 'Every module lives in a single interface instead of separate, disconnected tools.',
    icon: LayoutDashboard,
  },
  {
    title: 'Connected workflows',
    description: 'An action in one area — like hiring or placing an order — is reflected where it matters elsewhere.',
    icon: Workflow,
  },
  {
    title: 'Centralised information',
    description: 'Customers, stock levels and workforce data stay consistent across every screen.',
    icon: Link2,
  },
  {
    title: 'Built-in reporting',
    description: 'Dashboards and reports read from the same live data as the rest of the platform.',
    icon: BarChart3,
  },
  {
    title: 'Maintainable architecture',
    description: 'A clear separation between interface, logic and data keeps the system easy to extend.',
    icon: ShieldCheck,
  },
]

export interface ArchitectureStep {
  label: string
  icon: IconComponent
}

/** Conceptual system layers, kept high-level and non-technical. */
export const platformArchitecture: ArchitectureStep[] = [
  { label: 'Frontend interface', icon: UserRound },
  { label: 'Application logic', icon: Briefcase },
  { label: 'Shared business data', icon: Boxes },
  { label: 'Reports & workflows', icon: ClipboardCheck },
]
