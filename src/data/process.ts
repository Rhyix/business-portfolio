import { CloudUpload, CodeXml, FlaskConical, ListChecks, Palette, Search } from 'lucide-react'
import type { ProcessStep } from '../types/content'

/**
 * The six phases shown in the development process section.
 *
 * Discovery, Planning, Design and Testing each name what the client supplies,
 * because the section heading promises the visitor will know "what is expected
 * from both sides" and the steps previously only described our half.
 */
export const processSteps: ProcessStep[] = [
  {
    icon: Search,
    title: 'Discovery',
    description:
      'Understand the requirements, the current workflow and the business problem. You walk us through how the work runs today, including the spreadsheets and manual steps around it.',
  },
  {
    icon: ListChecks,
    title: 'Planning',
    description:
      'Define system architecture, features, timeline and technical requirements. You confirm what is in scope and decide what the first version has to cover.',
  },
  {
    icon: Palette,
    title: 'Design',
    description:
      'Create the UI/UX, screen structure and the experience around the system, with your feedback on the screens before they are built.',
  },
  {
    icon: CodeXml,
    title: 'Development',
    description: 'Build the frontend, backend, database and any required integrations.',
  },
  {
    icon: FlaskConical,
    title: 'Testing',
    description:
      'Test functionality, usability, security and performance before handover. Your team tries it against real cases, including the exceptions.',
  },
  {
    icon: CloudUpload,
    title: 'Deployment',
    description: 'Deploy the system, then provide maintenance and ongoing support.',
  },
]