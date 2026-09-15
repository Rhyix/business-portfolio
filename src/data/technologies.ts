import { Database, Monitor, Server, Terminal } from 'lucide-react'
import type { TechnologyGroup } from '../types/content'

/**
 * Technologies the business works with.
 * Deliberately limited to the confirmed stack — add entries only when the tool
 * is genuinely used.
 */
export const technologyGroups: TechnologyGroup[] = [
  {
    icon: Monitor,
    title: 'Frontend',
    description: 'Interfaces, component structure and browser behaviour.',
    technologies: ['HTML', 'CSS', 'JavaScript', 'React'],
  },
  {
    icon: Server,
    title: 'Backend',
    description: 'Application logic, APIs and business rules.',
    technologies: ['PHP', 'Laravel', 'Python', 'Django'],
  },
  {
    icon: Database,
    title: 'Database',
    description: 'Relational data modelling, migrations and queries.',
    technologies: ['MySQL'],
  },
  {
    icon: Terminal,
    title: 'Tools & Infrastructure',
    description: 'Source control, servers and release management.',
    technologies: ['Git', 'Linux', 'Ubuntu', 'Server Deployment'],
  },
]