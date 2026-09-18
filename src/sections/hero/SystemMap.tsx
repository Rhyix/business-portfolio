import { useMemo } from 'react'
import type { CSSProperties } from 'react'
import { m } from 'motion/react'
import { useRevealEnabled } from '../../components/ui/useRevealEnabled'
import { Rail } from '../../components/ui/Rail'
import { drawLineX, fadeInUpItem, popNode, staggerContainer } from '../../lib/motion'
import { NODE_HALO_LIGHT, NODE_IDLE, NODE_MARK } from '../../lib/systemMarks'
import { SYSTEM_MAP_VIEW, systemMapCore, systemMapNodes } from '../../data/systemMap'
import { cn } from '../../lib/cn'

function pctX(x: number): number {
  return (x / SYSTEM_MAP_VIEW.width) * 100
}

function pctY(y: number): number {
  return (y / SYSTEM_MAP_VIEW.height) * 100
}

const connectors = systemMapNodes.map((node) => {
  const dx = node.x - systemMapCore.x
  const dy = node.y - systemMapCore.y
  return {
    id: node.id,
    length: (Math.hypot(dx, dy) / SYSTEM_MAP_VIEW.width) * 100,
    angle: (Math.atan2(dy, dx) * 180) / Math.PI,
  }
})

const corePosition: CSSProperties = { left: `${pctX(systemMapCore.x)}%`, top: `${pctY(systemMapCore.y)}%` }

/**
 * Hero visual: a small "AETEX / shared business data" core connected to six
 * module nodes — a restrained system map built entirely from HTML/CSS
 * transforms in a fixed 560x400 coordinate space (see src/data/systemMap.ts),
 * so connector geometry stays correct at every viewport width. Draws in once
 * on scroll-into-view; nothing loops afterward.
 */
export function SystemMap() {
  const revealEnabled = useRevealEnabled()
  const containerVariants = useMemo(() => staggerContainer(0.05, 0.1), [])

  return (
    // `system-map-recede` lets the map step back while the System Dial is being
    // operated — the map is what AETEX builds, the dial is where you are.
    <div aria-hidden="true" className="system-map-recede relative mx-auto w-full max-w-[36rem] lg:max-w-none">
      <div className="relative hidden aspect-[7/5] w-full sm:block">
        {revealEnabled ? (
          <m.div
            className="absolute inset-0"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            variants={containerVariants}
          >
            <AnimatedMap />
          </m.div>
        ) : (
          <div className="absolute inset-0">
            <StaticMap />
          </div>
        )}
      </div>

      {/* Sub-640px fallback: the existing decorative Rail plus a hairline label grid — the same "caption row instead of geometry" pattern the site already uses for compact annotations. */}
      <div className="sm:hidden">
        <div className="flex items-center gap-4 rounded-xl border border-ink-200 bg-white p-5">
          <span className={cn(NODE_MARK, NODE_HALO_LIGHT, 'shrink-0')} />
          <div>
            <p className="text-sm font-semibold text-ink-900">{systemMapCore.label}</p>
            <p className="label-mono mt-0.5 text-ink-400">{systemMapCore.sublabel}</p>
          </div>
        </div>
        <div className="mt-4 flex gap-4">
          <Rail orientation="vertical" nodes={systemMapNodes.length} className="h-auto shrink-0 py-1" />
          <ul className="grid flex-1 grid-cols-2 gap-x-4 gap-y-3">
            {systemMapNodes.map((node) => (
              <li key={node.id} className="text-xs font-medium text-ink-600">
                {node.label}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}

function connectorClassName(active: boolean): string {
  return cn(
    'absolute h-px origin-left transition-colors duration-200 ease-out-expo',
    active ? 'bg-accent-500/70' : 'bg-ink-200 group-hover/node:bg-accent-500/70',
  )
}

function connectorStyle(connector: (typeof connectors)[number]): CSSProperties {
  return {
    ...corePosition,
    width: `${connector.length}%`,
    transform: `rotate(${connector.angle}deg)`,
  }
}

function nodeDotClassName(active: boolean | undefined): string {
  return cn(
    'block rounded-full transition-all duration-200 ease-out-expo',
    // The active node matches the section rail's active mark exactly, so the
    // hero teaches the vocabulary the rail then speaks.
    active ? 'size-2.5 bg-accent-500' : `${NODE_IDLE} group-hover/node:size-2.5 group-hover/node:bg-accent-500`,
    NODE_HALO_LIGHT,
  )
}

function labelClassName(side: 'left' | 'right'): string {
  return cn(
    'absolute top-1/2 -translate-y-1/2 text-nowrap',
    side === 'right' ? 'translate-x-3' : '-translate-x-full -ml-3',
  )
}

function nodeLabelClassName(active: boolean | undefined): string {
  return cn(
    'label-mono transition-colors duration-200 ease-out-expo',
    active ? 'text-ink-900' : 'text-ink-500 group-hover/node:text-ink-900',
  )
}

function CorePlate() {
  return (
    <span className="relative flex flex-col items-center rounded-lg border border-ink-200 bg-white px-4 py-3 shadow-card">
      <span aria-hidden="true" className="absolute -top-1.5 -left-1.5 size-1.5 rounded-full bg-accent-500 ring-4 ring-white" />
      <span aria-hidden="true" className="absolute -top-1.5 -right-1.5 size-1.5 rounded-full bg-accent-500 ring-4 ring-white" />
      <span aria-hidden="true" className="absolute -bottom-1.5 -left-1.5 size-1.5 rounded-full bg-accent-500 ring-4 ring-white" />
      <span aria-hidden="true" className="absolute -right-1.5 -bottom-1.5 size-1.5 rounded-full bg-accent-500 ring-4 ring-white" />
      <span className="text-sm font-semibold text-ink-900">{systemMapCore.label}</span>
      <span className="label-mono mt-1 text-ink-400">{systemMapCore.sublabel}</span>
    </span>
  )
}

/** Draws in once, gated by the caller's whileInView container. */
function AnimatedMap() {
  return (
    <>
      {systemMapNodes.map((node, index) => {
        const connector = connectors[index]
        return (
          // One hover group per module: the wrapper spans the whole map but is
          // click-through, so only the small dot is hoverable and hovering it
          // lights that module's connector, node and label together.
          <m.span key={node.id} className="group/node pointer-events-none absolute inset-0">
            <m.span
              className={connectorClassName(node.active === true)}
              style={connectorStyle(connector)}
              variants={drawLineX(0.15 + index * 0.05)}
            />

            <m.span
              className="pointer-events-auto absolute -m-2 -translate-x-1/2 -translate-y-1/2 p-2"
              style={{ left: `${pctX(node.x)}%`, top: `${pctY(node.y)}%` }}
              variants={popNode(0.15 + index * 0.05 + 0.3)}
            >
              <span className={nodeDotClassName(node.active)} />
            </m.span>

            <m.span
              className={labelClassName(node.side)}
              style={{ left: `${pctX(node.x)}%`, top: `${pctY(node.y)}%` }}
              variants={fadeInUpItem()}
            >
              <span className={nodeLabelClassName(node.active)}>{node.label}</span>
            </m.span>
          </m.span>
        )
      })}

      <m.span className="absolute -translate-x-1/2 -translate-y-1/2" style={corePosition} variants={popNode(0)}>
        <CorePlate />
      </m.span>
    </>
  )
}

/** Fully-drawn, non-animated fallback for reduced motion / no IntersectionObserver. */
function StaticMap() {
  return (
    <>
      {systemMapNodes.map((node, index) => (
        <span key={node.id} className="group/node pointer-events-none absolute inset-0">
          <span
            className={connectorClassName(node.active === true)}
            style={connectorStyle(connectors[index])}
          />

          <span
            className="pointer-events-auto absolute -m-2 -translate-x-1/2 -translate-y-1/2 p-2"
            style={{ left: `${pctX(node.x)}%`, top: `${pctY(node.y)}%` }}
          >
            <span className={nodeDotClassName(node.active)} />
          </span>

          <span className={labelClassName(node.side)} style={{ left: `${pctX(node.x)}%`, top: `${pctY(node.y)}%` }}>
            <span className={nodeLabelClassName(node.active)}>{node.label}</span>
          </span>
        </span>
      ))}

      <span className="absolute -translate-x-1/2 -translate-y-1/2" style={corePosition}>
        <CorePlate />
      </span>
    </>
  )
}
