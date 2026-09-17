import { lazy, Suspense } from 'react'
import type { ComponentType } from 'react'
import { LazyMotion, domAnimation } from 'motion/react'
import { Home } from './pages/Home'
import { SiteLayout } from './components/layout/SiteLayout'
import { basePath as integratedBasePath } from './data/demos/integrated/navigation'
import { basePath as bmsBasePath } from './data/demos/business-management/navigation'
import { basePath as hrmsBasePath } from './data/demos/human-resources/navigation'
import { basePath as recruitmentBasePath } from './data/demos/recruitment/navigation'
import { basePath as inventoryBasePath } from './data/demos/inventory/navigation'
import { basePath as appointmentsBasePath } from './data/demos/appointments/navigation'
import { useRouter } from './lib/useRouter'

// Code-split each demo app: a visitor on the marketing site never needs any
// of this bundled up front, and the three demos together are the largest
// part of the app.
const IntegratedBusinessManagementPlatform = lazy(() =>
  import('./pages/demos/integrated-platform/IntegratedBusinessManagementPlatform').then((module) => ({
    default: module.IntegratedBusinessManagementPlatform,
  })),
)
const BusinessManagementSystem = lazy(() =>
  import('./pages/demos/business-management-system/BusinessManagementSystem').then((module) => ({
    default: module.BusinessManagementSystem,
  })),
)
const HumanResourceManagement = lazy(() =>
  import('./pages/demos/human-resource-management/HumanResourceManagement').then((module) => ({
    default: module.HumanResourceManagement,
  })),
)
const RecruitmentManagementSystem = lazy(() =>
  import('./pages/demos/recruitment-management/RecruitmentManagementSystem').then((module) => ({
    default: module.RecruitmentManagementSystem,
  })),
)
const InventoryManagementSystem = lazy(() =>
  import('./pages/demos/inventory-management/InventoryManagementSystem').then((module) => ({
    default: module.InventoryManagementSystem,
  })),
)
const AppointmentSchedulingSystem = lazy(() =>
  import('./pages/demos/appointment-scheduling/AppointmentSchedulingSystem').then((module) => ({
    default: module.AppointmentSchedulingSystem,
  })),
)

const demoApps: { basePath: string; Component: ComponentType }[] = [
  { basePath: integratedBasePath, Component: IntegratedBusinessManagementPlatform },
  { basePath: bmsBasePath, Component: BusinessManagementSystem },
  { basePath: hrmsBasePath, Component: HumanResourceManagement },
  { basePath: recruitmentBasePath, Component: RecruitmentManagementSystem },
  { basePath: inventoryBasePath, Component: InventoryManagementSystem },
  { basePath: appointmentsBasePath, Component: AppointmentSchedulingSystem },
]

function DemoLoadingFallback() {
  return (
    <div className="flex h-svh items-center justify-center bg-ink-50/40">
      <p className="text-sm text-ink-500">Loading demo…</p>
    </div>
  )
}

function App() {
  const { path } = useRouter()
  const activeDemo = demoApps.find(
    (app) => path === app.basePath || path.startsWith(`${app.basePath}/`),
  )

  return (
    <LazyMotion features={domAnimation}>
      {activeDemo ? (
        <Suspense fallback={<DemoLoadingFallback />}>
          <activeDemo.Component />
        </Suspense>
      ) : (
        <SiteLayout>
          <Home />
        </SiteLayout>
      )}
    </LazyMotion>
  )
}

export default App