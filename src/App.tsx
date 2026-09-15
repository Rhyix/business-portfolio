import { LazyMotion, domAnimation } from 'motion/react'
import { Home } from './pages/Home'
import { SiteLayout } from './components/layout/SiteLayout'

function App() {
  return (
    <LazyMotion features={domAnimation}>
      <SiteLayout>
        <Home />
      </SiteLayout>
    </LazyMotion>
  )
}

export default App