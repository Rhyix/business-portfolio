import { ClipboardList, Plug, ShieldCheck, Waypoints, Workflow } from 'lucide-react'
import type { ValueProp } from '../types/content'

/**
 * The situations in which a custom system is worth building.
 *
 * This section used to list general qualities — modern technology, scalable
 * architecture, user-focused design — which described any software company and
 * repeated what About already says about how we work. It now answers the
 * question the rest of the page assumes but never addresses: when does building
 * something make more sense than buying it.
 *
 * These are conditions a reader recognises in their own organisation, not
 * arguments against off-the-shelf products. Most organisations should buy
 * software; these are the cases where buying stops working.
 */
export const valueProps: ValueProp[] = [
  {
    icon: Workflow,
    title: 'The process came first',
    description:
      'The way your organisation works was settled long before the software was chosen, and the product expects a different sequence.',
  },
  {
    icon: ClipboardList,
    title: 'Spreadsheets fill the gaps',
    description:
      'The system covers most of the work, and the rest lives in spreadsheets, email threads and steps someone has to remember.',
  },
  {
    icon: Waypoints,
    title: 'The same record lives in several tools',
    description:
      'A customer, an order or an employee is entered more than once, and keeping the copies in agreement becomes its own task.',
  },
  {
    icon: Plug,
    title: 'The exceptions are the point',
    description:
      'Approvals, edge cases and local rules are what the product cannot express, and they are the part that actually matters.',
  },
  {
    icon: ShieldCheck,
    title: 'You need to keep changing it',
    description:
      'The process will keep moving, so the system has to be something your team or ours can extend without waiting on a vendor.',
  },
]
