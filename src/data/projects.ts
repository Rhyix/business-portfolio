import type { Solution } from '../types/content'

/**
 * Label shown on every solution card. These entries describe system types we
 * can build — they are not client case studies, so they stay clearly marked.
 */
export const solutionLabel = 'Sample solution'

export const solutions: Solution[] = [
  {
    id: 'integrated-platform',
    category: 'Platform',
    title: 'Integrated Business Management Platform',
    description:
      'An integrated platform combining business operations, workforce management and reporting in one workspace.',
    technologies: ['React', 'Laravel', 'MySQL'],
    mockup: 'chart',
    demoHref: '/solutions/integrated-business-management-platform',
    featured: true,
  },
  {
    id: 'business-management',
    category: 'Operations',
    title: 'Business Management System',
    description:
      'Centralised records, approvals and reporting for day-to-day operations across departments.',
    technologies: ['Laravel', 'MySQL', 'JavaScript'],
    mockup: 'table',
    demoHref: '/solutions/business-management-system',
  },
  {
    id: 'hr-management',
    category: 'People',
    title: 'Human Resource Management System',
    description:
      'Employee records, leave requests, attendance and document tracking in a single system.',
    technologies: ['PHP', 'MySQL', 'React'],
    mockup: 'people',
    demoHref: '/solutions/human-resource-management',
  },
  {
    id: 'recruitment',
    category: 'People / Recruitment',
    title: 'Recruitment Management System',
    description:
      'Job postings, applicant pipelines, interview scheduling and evaluation records.',
    technologies: ['Django', 'MySQL', 'React'],
    mockup: 'board',
    demoHref: '/solutions/recruitment-management',
  },
  {
    id: 'inventory',
    category: 'Operations',
    title: 'Inventory Management System',
    description:
      'Stock levels, movement history, reorder thresholds and supplier records with clear audit trails.',
    technologies: ['Laravel', 'MySQL', 'JavaScript'],
    mockup: 'stock',
    demoHref: '/solutions/inventory-management',
  },
  {
    id: 'appointments',
    category: 'Service delivery',
    title: 'Appointment & Scheduling System',
    description:
      'Availability rules, booking workflows, reminders and rescheduling for service teams.',
    technologies: ['React', 'PHP', 'MySQL'],
    mockup: 'schedule',
  },
  {
    id: 'administrative-dashboard',
    category: 'Reporting',
    title: 'Custom Administrative Dashboard',
    description:
      'Role-based access, consolidated figures and exports built for administrative teams.',
    technologies: ['React', 'Python', 'MySQL'],
    mockup: 'chart',
  },
]