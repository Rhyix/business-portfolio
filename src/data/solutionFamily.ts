import type { DemoNavItem } from '../components/demo/types'
import { demoNavItems as integratedModules, demoNavGroups as integratedGroups } from './demos/integrated/navigation'
import { demoNavItems as businessManagementModules } from './demos/business-management/navigation'
import { demoNavItems as humanResourcesModules } from './demos/human-resources/navigation'
import { demoNavItems as recruitmentModules } from './demos/recruitment/navigation'
import { demoNavItems as inventoryModules } from './demos/inventory/navigation'
import { demoNavItems as appointmentsModules } from './demos/appointments/navigation'
import { demoNavItems as adminDashboardModules } from './demos/admin-dashboard/navigation'
import { solutions } from './projects'
import { featuredPlatformHref } from './platform'

/**
 * The relationship between the seven demos, derived from the demos themselves.
 *
 * Every demo already declares its own modules in src/data/demos/<app>/navigation.ts,
 * which is the running application's source of truth for its sidebar. This file
 * reads those manifests and works out how the systems relate, rather than
 * restating it as prose that could drift out of step with the apps:
 *
 *   - The Integrated Business Management Platform's domain modules are exactly
 *     the union of the Business Management System's and the Human Resource
 *     Management System's. Those two are the platform's two halves, and that is
 *     computed below (`tier === 'half'`), not asserted.
 *   - The remaining four each take a single module the platform exposes and
 *     expand it into a whole system. Which module that is, is the one piece of
 *     editorial judgement here — see `EXPANDED_MODULE_KEY`.
 *
 * Nothing in this file invents a capability. Every label rendered on the page
 * comes from a manifest a visitor can go and see for themselves in the demo.
 */

/**
 * Shell routes every demo ships regardless of what it does, so they say nothing
 * about a system's purpose and are left out of every count and comparison.
 */
const CHROME_KEYS = new Set(['dashboard', 'settings'])

const domainModules = (items: DemoNavItem[]) => items.filter((item) => !CHROME_KEYS.has(item.key))

const flagshipModules = domainModules(integratedModules)
const flagshipKeys = new Set(flagshipModules.map((module) => module.key))

/**
 * The single platform module each specialist system opens up. The platform
 * treats these as one entry each; the standalone system treats the same ground
 * as its entire subject.
 */
const EXPANDED_MODULE_KEY: Record<string, string> = {
  recruitment: 'recruitment',
  inventory: 'inventory',
  appointments: 'customers',
  'administrative-dashboard': 'reports',
}

/** Solution id -> that demo's own module manifest. */
const MODULE_MANIFESTS: Record<string, DemoNavItem[]> = {
  'business-management': businessManagementModules,
  'hr-management': humanResourcesModules,
  recruitment: recruitmentModules,
  inventory: inventoryModules,
  appointments: appointmentsModules,
  'administrative-dashboard': adminDashboardModules,
}

/**
 * "half"  — every one of this system's modules is also in the platform, so it
 *           is a standalone slice of the flagship.
 * "depth" — this system goes further in one area than the platform does.
 */
export type SolutionTier = 'half' | 'depth'

export interface SolutionSystem {
  id: string
  title: string
  description: string
  demoHref: string
  /** This demo's own modules, shell routes excluded. */
  modules: DemoNavItem[]
  /** Modules that also exist in the flagship platform. */
  sharedModules: DemoNavItem[]
  tier: SolutionTier
  /** For a "depth" system: the one platform module it expands. */
  expands?: DemoNavItem
}

export interface FlagshipSystem {
  title: string
  description: string
  demoHref: string
  modules: DemoNavItem[]
  /** Domain group names from the platform's own sidebar, e.g. "Operations". */
  groupLabels: string[]
}

/**
 * The platform's own sidebar groupings, minus the ones that only hold shell
 * routes — this is how the running app describes its own shape.
 */
const flagshipGroupLabels = integratedGroups
  .filter((group) => group.keys.some((key) => !CHROME_KEYS.has(key)))
  .map((group) => group.label)

const flagshipSolution = solutions.find((solution) => solution.featured)

if (!flagshipSolution) {
  throw new Error('solutionFamily: no solution is marked featured — the architecture has no root.')
}

export const flagship: FlagshipSystem = {
  title: flagshipSolution.title,
  description: flagshipSolution.description,
  demoHref: flagshipSolution.demoHref ?? featuredPlatformHref,
  modules: flagshipModules,
  groupLabels: flagshipGroupLabels,
}

/**
 * The six non-flagship systems, in the order they appear in `solutions`, each
 * carrying its measured relationship to the platform.
 */
export const solutionSystems: SolutionSystem[] = solutions
  .filter((solution) => !solution.featured)
  .map((solution) => {
    const modules = domainModules(MODULE_MANIFESTS[solution.id] ?? [])
    const sharedModules = modules.filter((module) => flagshipKeys.has(module.key))
    // Containment is the test: a system whose every module the platform also
    // has is a slice of it, however many modules that happens to be.
    const tier: SolutionTier =
      modules.length > 0 && sharedModules.length === modules.length ? 'half' : 'depth'
    const expandsKey = EXPANDED_MODULE_KEY[solution.id]

    return {
      id: solution.id,
      title: solution.title,
      description: solution.description,
      demoHref: solution.demoHref ?? featuredPlatformHref,
      modules,
      sharedModules,
      tier,
      expands: expandsKey ? flagshipModules.find((module) => module.key === expandsKey) : undefined,
    }
  })

/** The platform's two standalone halves. */
export const platformHalves = solutionSystems.filter((system) => system.tier === 'half')

/** Systems that go deeper in one area than the platform does. */
export const specialistSystems = solutionSystems.filter((system) => system.tier === 'depth')
