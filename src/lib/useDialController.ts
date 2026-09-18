import { useCallback, useRef, useState } from 'react'
import type { KeyboardEvent, PointerEvent as ReactPointerEvent } from 'react'
import { STEP_DEG, pointerAngle, shortestAngleDelta } from './dialGeometry'
import type { DialGeometry } from './dialGeometry'

export type DialMode = 'idle' | 'scrubbing'

/** Pixels of pointer travel before a press counts as a turn rather than a tap. */
const DRAG_THRESHOLD_PX = 6
/** Fraction of a detent the dial must pass before the selection advances. */
const HYSTERESIS = 0.6

interface DragState {
  pointerId: number
  startX: number
  startY: number
  startIndex: number
  lastAngle: number
  accumDeg: number
  offset: number
  hasMoved: boolean
}

interface UseDialControllerOptions {
  itemCount: number
  /** Section currently crossing the viewport middle — what the dial reads while closed. */
  activeIndex: number
  /** The open circle. Turning only happens while open, so this is always the right one. */
  geometry: DialGeometry
  /** Applies a continuous position to the DOM. Called synchronously while turning. */
  onFloatChange: (float: number, animate: boolean) => void
  onCommit: (index: number) => void
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value))
}

/**
 * Pointer capture keeps a turn alive when the pointer leaves the dial, but it
 * is only an enhancement — and it throws for a pointer the browser no longer
 * considers active. Letting that propagate would abort the handler before the
 * dial ever opened, so a failure degrades to "works, minus the tracking".
 */
function capturePointer(element: Element, pointerId: number, capture: boolean): void {
  try {
    if (capture) element.setPointerCapture(pointerId)
    else if (element.hasPointerCapture(pointerId)) element.releasePointerCapture(pointerId)
  } catch {
    /* no active pointer with this id — carry on without capture */
  }
}

/**
 * The dial is permanently open, so the only states are resting and being
 * turned. Pointerdown starts a turn directly; releasing after meaningful
 * movement commits and scrolls, and releasing without it does nothing at all.
 * While resting, the selection simply mirrors where the page is.
 */
export function useDialController({
  itemCount,
  activeIndex,
  geometry,
  onFloatChange,
  onCommit,
}: UseDialControllerOptions) {
  const [mode, setMode] = useState<DialMode>('idle')
  const [pendingIndex, setPendingIndex] = useState<number | null>(null)
  const dragRef = useRef<DragState | null>(null)

  // Derived, not stored: at rest the dial simply reports where the page is,
  // so scroll observation has no state to fight.
  const selectedIndex = mode === 'scrubbing' ? (pendingIndex ?? activeIndex) : activeIndex

  /** Abandons a turn in progress. The dial itself never goes away. */
  const cancel = useCallback(() => {
    dragRef.current = null
    setPendingIndex(null)
    setMode('idle')
  }, [])

  const commit = useCallback(
    (index: number) => {
      dragRef.current = null
      setPendingIndex(null)
      setMode('idle')
      onCommit(index)
    },
    [onCommit],
  )

  /** Keyboard selection without a pointer — the dial is already open. */
  const beginKeyboardTurn = useCallback(() => {
    setPendingIndex(activeIndex)
    setMode('scrubbing')
  }, [activeIndex])

  const handlePointerDown = useCallback(
    (event: ReactPointerEvent<HTMLElement>) => {
      if (event.button !== 0) return
      capturePointer(event.currentTarget, event.pointerId, true)
      setPendingIndex(selectedIndex)
      setMode('scrubbing')
      dragRef.current = {
        pointerId: event.pointerId,
        startX: event.clientX,
        startY: event.clientY,
        startIndex: selectedIndex,
        lastAngle: pointerAngle(
          event.clientX,
          event.clientY,
          geometry,
          document.documentElement.clientWidth,
          window.innerHeight,
        ),
        accumDeg: 0,
        offset: 0,
        hasMoved: false,
      }
    },
    [selectedIndex, geometry],
  )

  const handlePointerMove = useCallback(
    (event: ReactPointerEvent<HTMLElement>) => {
      const drag = dragRef.current
      if (!drag || drag.pointerId !== event.pointerId) return

      if (!drag.hasMoved) {
        const travel = Math.hypot(event.clientX - drag.startX, event.clientY - drag.startY)
        if (travel < DRAG_THRESHOLD_PX) return
        drag.hasMoved = true
      }

      const angle = pointerAngle(
        event.clientX,
        event.clientY,
        geometry,
        document.documentElement.clientWidth,
        window.innerHeight,
      )
      drag.accumDeg += shortestAngleDelta(drag.lastAngle, angle)
      drag.lastAngle = angle

      // Moving the pointer up raises the accumulated angle, and item angles
      // rise with the selection — so up carries the dial face upward and
      // brings the *later* section into focus. Down reverses it.
      const rawOffset = drag.accumDeg / STEP_DEG
      while (rawOffset > drag.offset + HYSTERESIS) drag.offset += 1
      while (rawOffset < drag.offset - HYSTERESIS) drag.offset -= 1

      const nextIndex = clamp(drag.startIndex + drag.offset, 0, itemCount - 1)
      setPendingIndex((current) => (current === nextIndex ? current : nextIndex))
      onFloatChange(clamp(drag.startIndex + rawOffset, 0, itemCount - 1), false)
    },
    [itemCount, onFloatChange, geometry],
  )

  const endDrag = useCallback(
    (event: ReactPointerEvent<HTMLElement>, cancelled: boolean) => {
      const drag = dragRef.current
      if (!drag || drag.pointerId !== event.pointerId) return
      capturePointer(event.currentTarget, event.pointerId, false)
      const turned = drag.hasMoved
      const target = clamp(drag.startIndex + drag.offset, 0, itemCount - 1)
      dragRef.current = null

      if (turned && !cancelled) {
        commit(target)
        return
      }
      // A click, or an aborted gesture: the dial stays exactly as it was and
      // nothing navigates.
      cancel()
    },
    [commit, cancel, itemCount],
  )

  const handlePointerUp = useCallback(
    (event: ReactPointerEvent<HTMLElement>) => endDrag(event, false),
    [endDrag],
  )

  const handlePointerCancel = useCallback(
    (event: ReactPointerEvent<HTMLElement>) => endDrag(event, true),
    [endDrag],
  )

  const handleKeyDown = useCallback(
    (event: KeyboardEvent<HTMLElement>) => {
      const step = (delta: number) => {
        event.preventDefault()
        if (mode !== 'scrubbing') beginKeyboardTurn()
        setPendingIndex(clamp(selectedIndex + delta, 0, itemCount - 1))
      }

      switch (event.key) {
        // Forward and backward match the pointer mapping: up is later.
        case 'ArrowUp':
        case 'ArrowRight':
          step(1)
          break
        case 'ArrowDown':
        case 'ArrowLeft':
          step(-1)
          break
        case 'Home':
          event.preventDefault()
          if (mode !== 'scrubbing') beginKeyboardTurn()
          setPendingIndex(0)
          break
        case 'End':
          event.preventDefault()
          if (mode !== 'scrubbing') beginKeyboardTurn()
          setPendingIndex(itemCount - 1)
          break
        case 'Enter':
        case ' ':
          event.preventDefault()
          commit(selectedIndex)
          break
        case 'Escape':
          event.preventDefault()
          cancel()
          break
        default:
          break
      }
    },
    [mode, itemCount, selectedIndex, commit, cancel, beginKeyboardTurn],
  )

  return {
    mode,
    selectedIndex,
    cancel,
    surfaceProps: {
      onPointerDown: handlePointerDown,
      onPointerMove: handlePointerMove,
      onPointerUp: handlePointerUp,
      onPointerCancel: handlePointerCancel,
    },
    onKeyDown: handleKeyDown,
  }
}
