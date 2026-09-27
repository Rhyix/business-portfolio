import { useState } from 'react'
import { RotateCcw } from 'lucide-react'
import { Modal } from './Modal'
import { Button } from '../ui/Button'
import { clearDemoSystem } from '../../lib/demoPersistence'
import type { DemoSystem } from '../../lib/demoPersistence'

interface DemoDataResetProps {
  system: DemoSystem
  /** How this workspace refers to itself, e.g. "Inventory Management System". */
  appName: string
}

/**
 * Restores a demo's sample records.
 *
 * Changes now persist in the browser, which is what makes these demos feel
 * real — but it also means a visitor can edit or delete their way to a state
 * they did not intend and, without this, would have no way back short of
 * clearing site data. Reset is the honest counterpart to persistence rather
 * than an extra feature.
 *
 * A full reload follows the clear so every store re-seeds from its own
 * defaults, which is simpler and more reliable than asking each store to
 * re-initialise itself in place.
 */
export function DemoDataReset({ system, appName }: DemoDataResetProps) {
  const [confirming, setConfirming] = useState(false)

  const handleReset = () => {
    clearDemoSystem(system)
    window.location.reload()
  }

  return (
    <div className="rounded-2xl border border-ink-200/80 bg-white p-5 sm:p-6">
      <h3 className="text-sm font-semibold text-ink-900">Sample data</h3>
      <p className="mt-1.5 text-sm text-ink-500">
        Anything you change in this demo is saved in this browser only — never sent anywhere. Resetting
        restores the original sample records and discards the changes you have made here.
      </p>
      <div className="mt-4">
        <Button type="button" variant="secondary" size="md" onClick={() => setConfirming(true)}>
          <RotateCcw className="size-4" aria-hidden="true" />
          Reset sample data
        </Button>
      </div>

      <Modal
        open={confirming}
        onClose={() => setConfirming(false)}
        title="Reset sample data?"
        description={`Every change you have made in the ${appName} demo will be discarded and the original sample records restored.`}
      >
        <div className="flex justify-end gap-3">
          <Button type="button" variant="secondary" size="md" onClick={() => setConfirming(false)}>
            Keep my changes
          </Button>
          <Button type="button" size="md" onClick={handleReset}>
            Reset sample data
          </Button>
        </div>
      </Modal>
    </div>
  )
}
