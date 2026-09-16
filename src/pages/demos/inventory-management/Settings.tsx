import { useId, useState } from 'react'
import { Bell, Building2, SlidersHorizontal, Warehouse } from 'lucide-react'
import { FormField } from '../../../sections/contact/FormField'
import { demoControlStyles } from '../../../components/demo/formControlStyles'
import { DemoNotice } from '../../../components/demo/DemoNotice'
import { Button } from '../../../components/ui/Button'
import { cn } from '../../../lib/cn'
import { useInventoryData } from '../../../data/demos/inventory/context'

type SettingsTab = 'general' | 'rules' | 'notifications' | 'warehouses'

const tabs: { key: SettingsTab; label: string; icon: typeof Building2 }[] = [
  { key: 'general', label: 'General', icon: Building2 },
  { key: 'rules', label: 'Inventory Rules', icon: SlidersHorizontal },
  { key: 'notifications', label: 'Notifications', icon: Bell },
  { key: 'warehouses', label: 'Warehouses', icon: Warehouse },
]

interface ToggleRowProps {
  label: string
  description: string
  checked: boolean
  onChange: (checked: boolean) => void
}

function ToggleRow({ label, description, checked, onChange }: ToggleRowProps) {
  return (
    <label className="flex items-start justify-between gap-4 rounded-xl border border-ink-200/80 bg-white p-4">
      <span>
        <span className="block text-sm font-medium text-ink-900">{label}</span>
        <span className="block text-xs text-ink-500">{description}</span>
      </span>
      <span className="relative inline-flex shrink-0 items-center">
        <input type="checkbox" checked={checked} onChange={(event) => onChange(event.target.checked)} className="peer sr-only" />
        <span
          aria-hidden="true"
          className="h-6 w-11 rounded-full bg-ink-200 transition-colors duration-200 peer-checked:bg-accent-600 peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-accent-600"
        />
        <span
          aria-hidden="true"
          className="absolute top-0.5 left-0.5 size-5 rounded-full bg-white shadow-soft transition-transform duration-200 peer-checked:translate-x-5"
        />
      </span>
    </label>
  )
}

/** Settings page: demo-only general, inventory-rule, notification and warehouse-preference panels, backed by local state. */
export function Settings() {
  const { warehouses } = useInventoryData()
  const [activeTab, setActiveTab] = useState<SettingsTab>('general')
  const tabListId = useId()

  const [teamName, setTeamName] = useState('AETEX Inventory Operations')
  const [contactEmail, setContactEmail] = useState('inventory@demo-aetex.example')
  const [timezone, setTimezone] = useState('Asia/Manila')
  const [savedNotice, setSavedNotice] = useState(false)

  const [defaultReorderBehavior, setDefaultReorderBehavior] = useState('Notify only')
  const [lowStockThreshold, setLowStockThreshold] = useState('50')
  const [autoDiscontinueOutOfStock, setAutoDiscontinueOutOfStock] = useState(false)
  const [requireApprovalOverAmount, setRequireApprovalOverAmount] = useState(true)

  const [lowStockAlerts, setLowStockAlerts] = useState(true)
  const [poReceivedAlerts, setPoReceivedAlerts] = useState(true)
  const [supplierUpdateAlerts, setSupplierUpdateAlerts] = useState(false)

  const [defaultWarehouseId, setDefaultWarehouseId] = useState(warehouses[0]?.id ?? '')

  const handleSaveGeneral = () => {
    setSavedNotice(true)
    window.setTimeout(() => setSavedNotice(false), 2000)
  }

  return (
    <div className="max-w-3xl space-y-6">
      <DemoNotice variant="inline" />

      <div role="tablist" aria-label="Settings sections" id={tabListId} className="flex flex-wrap gap-2">
        {tabs.map((tab) => {
          const Icon = tab.icon
          const isActive = tab.key === activeTab

          return (
            <button
              key={tab.key}
              type="button"
              role="tab"
              id={`${tabListId}-${tab.key}-tab`}
              aria-selected={isActive}
              aria-controls={`${tabListId}-${tab.key}-panel`}
              onClick={() => setActiveTab(tab.key)}
              className={cn(
                'inline-flex items-center gap-2 rounded-lg px-3.5 py-2.5 text-sm font-medium transition-colors duration-200',
                isActive ? 'bg-ink-950 text-white' : 'border border-ink-200 bg-white text-ink-600 hover:bg-ink-50',
              )}
            >
              <Icon className="size-4" aria-hidden="true" />
              {tab.label}
            </button>
          )
        })}
      </div>

      {activeTab === 'general' ? (
        <div
          role="tabpanel"
          id={`${tabListId}-general-panel`}
          aria-labelledby={`${tabListId}-general-tab`}
          className="space-y-4 rounded-2xl border border-ink-200/80 bg-white p-5 sm:p-6"
        >
          <p className="text-xs text-ink-500">
            Demo inventory-team details for this sample workspace — unrelated to AETEX Tech Solution's own information.
          </p>
          <FormField id="settings-team-name" label="Team name">
            <input id="settings-team-name" value={teamName} onChange={(event) => setTeamName(event.target.value)} className={demoControlStyles} />
          </FormField>
          <FormField id="settings-contact-email" label="Inventory contact email">
            <input
              id="settings-contact-email"
              type="email"
              value={contactEmail}
              onChange={(event) => setContactEmail(event.target.value)}
              className={demoControlStyles}
            />
          </FormField>
          <FormField id="settings-timezone" label="Timezone">
            <select id="settings-timezone" value={timezone} onChange={(event) => setTimezone(event.target.value)} className={demoControlStyles}>
              <option value="Asia/Manila">Asia/Manila (GMT+8)</option>
              <option value="Asia/Singapore">Asia/Singapore (GMT+8)</option>
              <option value="UTC">UTC</option>
            </select>
          </FormField>
          <div className="flex items-center justify-end gap-3 pt-2">
            {savedNotice ? (
              <span role="status" className="text-xs font-medium text-emerald-600">
                Saved (demo only)
              </span>
            ) : null}
            <Button type="button" size="md" onClick={handleSaveGeneral}>
              Save changes
            </Button>
          </div>
        </div>
      ) : null}

      {activeTab === 'rules' ? (
        <div
          role="tabpanel"
          id={`${tabListId}-rules-panel`}
          aria-labelledby={`${tabListId}-rules-tab`}
          className="space-y-4 rounded-2xl border border-ink-200/80 bg-white p-5 sm:p-6"
        >
          <FormField id="settings-reorder-behavior" label="Default reorder behaviour">
            <select
              id="settings-reorder-behavior"
              value={defaultReorderBehavior}
              onChange={(event) => setDefaultReorderBehavior(event.target.value)}
              className={demoControlStyles}
            >
              <option value="Notify only">Notify only</option>
              <option value="Suggest purchase order">Suggest purchase order</option>
              <option value="Do nothing">Do nothing</option>
            </select>
          </FormField>
          <FormField id="settings-low-stock-threshold" label="Low-stock threshold (% of reorder level)">
            <input
              id="settings-low-stock-threshold"
              type="number"
              min={0}
              max={100}
              value={lowStockThreshold}
              onChange={(event) => setLowStockThreshold(event.target.value)}
              className={demoControlStyles}
            />
          </FormField>
          <ToggleRow
            label="Auto-discontinue out-of-stock products"
            description="Mark a product discontinued automatically once it has been out of stock for an extended period."
            checked={autoDiscontinueOutOfStock}
            onChange={setAutoDiscontinueOutOfStock}
          />
          <ToggleRow
            label="Require approval over a set amount"
            description="Large purchase orders need a second approval before they can be marked Ordered."
            checked={requireApprovalOverAmount}
            onChange={setRequireApprovalOverAmount}
          />
        </div>
      ) : null}

      {activeTab === 'notifications' ? (
        <div role="tabpanel" id={`${tabListId}-notifications-panel`} aria-labelledby={`${tabListId}-notifications-tab`} className="space-y-3">
          <ToggleRow
            label="Low stock alerts"
            description="Notify the inventory team when a product reaches its reorder level."
            checked={lowStockAlerts}
            onChange={setLowStockAlerts}
          />
          <ToggleRow
            label="Purchase order received alerts"
            description="Notify the inventory team when a purchase order is fully or partially received."
            checked={poReceivedAlerts}
            onChange={setPoReceivedAlerts}
          />
          <ToggleRow
            label="Supplier update alerts"
            description="Notify the inventory team when a supplier's details change."
            checked={supplierUpdateAlerts}
            onChange={setSupplierUpdateAlerts}
          />
        </div>
      ) : null}

      {activeTab === 'warehouses' ? (
        <div
          role="tabpanel"
          id={`${tabListId}-warehouses-panel`}
          aria-labelledby={`${tabListId}-warehouses-tab`}
          className="space-y-4 rounded-2xl border border-ink-200/80 bg-white p-5 sm:p-6"
        >
          <p className="text-xs text-ink-500">
            Preferences for how warehouses behave across this workspace — manage the warehouses themselves from the Warehouses page.
          </p>
          <FormField id="settings-default-warehouse" label="Default warehouse for new products and purchase orders">
            <select
              id="settings-default-warehouse"
              value={defaultWarehouseId}
              onChange={(event) => setDefaultWarehouseId(event.target.value)}
              className={demoControlStyles}
            >
              {warehouses.map((warehouse) => (
                <option key={warehouse.id} value={warehouse.id}>
                  {warehouse.name}
                </option>
              ))}
            </select>
          </FormField>
        </div>
      ) : null}
    </div>
  )
}
