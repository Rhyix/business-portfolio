import { Hero } from '../sections/hero/Hero'
import { ValueProps } from '../sections/values/ValueProps'

/** Landing page composition. Sections are added here as stages are built. */
export function Home() {
  return (
    <>
      <Hero />
      <ValueProps />
    </>
  )
}

