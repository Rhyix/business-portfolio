import { About } from '../sections/about/About'
import { CallToAction } from '../sections/cta/CallToAction'
import { Contact } from '../sections/contact/Contact'
import { Hero } from '../sections/hero/Hero'
import { Process } from '../sections/process/Process'
import { Projects } from '../sections/projects/Projects'
import { Services } from '../sections/services/Services'
import { Technology } from '../sections/technology/Technology'
import { ValueProps } from '../sections/values/ValueProps'

/** Landing page composition, in the order the navigation expects. */
export function Home() {
  return (
    <>
      <Hero />
      <ValueProps />
      <Services />
      <Projects />
      <About />
      <Process />
      <Technology />
      <CallToAction />
      <Contact />
    </>
  )
}

