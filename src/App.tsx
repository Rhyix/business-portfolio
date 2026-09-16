import { LazyMotion, domAnimation } from 'motion/react'
import { Home } from './pages/Home'
import { SiteLayout } from './components/layout/SiteLayout'
import { BusinessManagementSystem } from './pages/demos/business-management-system/BusinessManagementSystem'
import { HumanResourceManagement } from './pages/demos/human-resource-management/HumanResourceManagement'
import { basePath as bmsBasePath } from './data/demos/business-management/navigation'
import { basePath as hrmsBasePath } from './data/demos/human-resources/navigation'
import { useRouter } from './lib/useRouter'
import type { ComponentType } from 'react'

const demoApps: { basePath: string; Component: ComponentType }[] = [
  { basePath: bmsBasePath, Component: BusinessManagementSystem },
  { basePath: hrmsBasePath, Component: HumanResourceManagement },
]

function App() {
  const { path } = useRouter()
  const activeDemo = demoApps.find(
    (app) => path === app.basePath || path.startsWith(`${app.basePath}/`),
  )

  return (
    <LazyMotion features={domAnimation}>
      {activeDemo ? (
        <activeDemo.Component />
      ) : (
        <SiteLayout>
          <Home />
        </SiteLayout>
      )}
    </LazyMotion>
  )
}

export default App