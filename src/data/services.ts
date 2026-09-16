import { CodeXml, Database, LayoutDashboard, Palette, Plug, Server, Wrench } from 'lucide-react'
import type { Service } from '../types/content'

/**
 * Services offered by the business.
 * Consumed by the footer list now and by the services section in the next stage.
 */
export const services: Service[] = [
  {
    icon: CodeXml,
    title: 'Custom Web Application Development',
    description: 'Purpose-built web applications designed around a specific business process.',
  },
  {
    icon: LayoutDashboard,
    title: 'Business Management Systems',
    description:
      'A central system for records, approvals and reporting, so day-to-day operations do not depend on spreadsheets and email.',
  },
  {
    icon: Database,
    title: 'Database Development',
    description:
      'The data layer behind your application — modelled, migrated and queried so your records and reports stay accurate as the system grows.',
  },
  {
    icon: Palette,
    title: 'UI/UX Design',
    description: 'Clear, consistent interfaces and workflows that reduce training and errors.',
  },
  {
    icon: Plug,
    title: 'System Integration',
    description: 'Connecting new systems with the tools and data sources you already use.',
  },
  {
    icon: Server,
    title: 'Deployment & Server Management',
    description: 'Environment setup, releases and configuration on servers you control.',
  },
  {
    icon: Wrench,
    title: 'System Maintenance & Support',
    description: 'Fixes, improvements and ongoing technical support after launch.',
  },
]