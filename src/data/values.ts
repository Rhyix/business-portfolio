import { Blocks, Compass, Cpu, Layers, LifeBuoy } from 'lucide-react'
import type { ValueProp } from '../types/content'

/** Trust points shown directly below the hero section. */
export const valueProps: ValueProp[] = [
  {
    icon: Blocks,
    title: 'Custom-built solutions',
    description: 'Software shaped around how your organisation actually works, not a rigid template.',
  },
  {
    icon: Cpu,
    title: 'Modern technology',
    description: 'Built on current, well-supported tools and practices that stay maintainable.',
  },
  {
    icon: Layers,
    title: 'Scalable architecture',
    description: 'Clear data structures that let the system grow with your requirements.',
  },
  {
    icon: Compass,
    title: 'User-focused design',
    description: 'Interfaces designed around the people who use the system every day.',
  },
  {
    icon: LifeBuoy,
    title: 'Reliable support',
    description: 'Documentation, handover and ongoing maintenance after the system goes live.',
  },
]