import { Compass, MessagesSquare, ShieldCheck, Waypoints } from 'lucide-react'
import type { ValueProp } from '../types/content'

/** What the team focuses on through a project, shown beside the about copy. */
export const aboutFocusAreas: ValueProp[] = [
  {
    icon: MessagesSquare,
    title: 'Understanding requirements',
    description: 'We start from the process you run today and the problems you need solved.',
  },
  {
    icon: Compass,
    title: 'Designing intuitive systems',
    description: 'Screens and workflows shaped around the people who use them daily.',
  },
  {
    icon: ShieldCheck,
    title: 'Building reliable software',
    description: 'Clear data rules, validation and predictable behaviour in everyday use.',
  },
  {
    icon: Waypoints,
    title: 'Delivering maintainable solutions',
    description: 'Structured, documented code your team or ours can extend later.',
  },
]