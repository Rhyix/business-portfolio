import { CloudUpload, CodeXml, FlaskConical, ListChecks, Palette, Search } from 'lucide-react'
import type { ProcessStep } from '../types/content'

/** The six phases shown in the development process section. */
export const processSteps: ProcessStep[] = [
  {
    icon: Search,
    title: 'Discovery',
    description: 'Understand the requirements, the current workflow and the business problem.',
  },
  {
    icon: ListChecks,
    title: 'Planning',
    description: 'Define system architecture, features, timeline and technical requirements.',
  },
  {
    icon: Palette,
    title: 'Design',
    description: 'Create the UI/UX, screen structure and the experience around the system.',
  },
  {
    icon: CodeXml,
    title: 'Development',
    description: 'Build the frontend, backend, database and any required integrations.',
  },
  {
    icon: FlaskConical,
    title: 'Testing',
    description: 'Test functionality, usability, security and performance before handover.',
  },
  {
    icon: CloudUpload,
    title: 'Deployment',
    description: 'Deploy the system, then provide maintenance and ongoing support.',
  },
]