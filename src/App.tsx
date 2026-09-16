import { LazyMotion, domAnimation } from 'motion/react'
import { Home } from './pages/Home'
import { SiteLayout } from './components/layout/SiteLayout'
import { BusinessManagementSystem } from './pages/demos/business-management-system/BusinessManagementSystem'
import { useRouter } from './lib/useRouter'

const DEMO_BASE_PATH = '/solutions/business-management-system'

function App() {
  const { path } = useRouter()
  const isDemoRoute = path === DEMO_BASE_PATH || path.startsWith(`${DEMO_BASE_PATH}/`)

  return (
    <LazyMotion features={domAnimation}>
      {isDemoRoute ? (
        <BusinessManagementSystem />
      ) : (
        <SiteLayout>
          <Home />
        </SiteLayout>
      )}
    </LazyMotion>
  )
}

export default App