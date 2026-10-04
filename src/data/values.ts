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
    description: 'Your way of working predates the software, and the product expects a different order.',
  },
  {
    icon: ClipboardList,
    title: 'Spreadsheets fill the gaps',
    description: 'The system covers most of the work. The rest lives in spreadsheets, inboxes and memory.',
  },
  {
    icon: Waypoints,
    title: 'One record, many tools',
    description: 'The same customer or order is entered twice, and keeping the copies in sync is a job of its own.',
  },
  {
    icon: Plug,
    title: 'The exceptions are the point',
    description: "Approvals, edge cases and local rules are what the product can't express, and what matters most.",
  },
  {
    icon: ShieldCheck,
    title: 'It has to keep changing',
    description: 'Your process keeps moving, so the system must grow without waiting on a vendor.',
  },
]
