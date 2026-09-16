import { useState } from 'react'
import type { ChangeEvent, FormEvent } from 'react'
import { Modal } from '../../../components/demo/Modal'
import { FormField } from '../../../sections/contact/FormField'
import { demoControlStyles } from '../../../components/demo/formControlStyles'
import { Button } from '../../../components/ui/Button'
import { cn } from '../../../lib/cn'
import type { Product, ProductCategory, ProductInput, Warehouse } from '../../../data/demos/inventory/types'

const categoryOptions: ProductCategory[] = ['Electronics', 'Furniture', 'Office Supplies', 'Packaging', 'Raw Materials', 'Safety Equipment']

type FieldErrors = Partial<Record<'name' | 'sku' | 'warehouseId' | 'price' | 'stock' | 'reorderLevel', string>>

interface ProductFormModalProps {
  open: boolean
  onClose: () => void
  onSubmit: (values: ProductInput) => void
  editingProduct: Product | null
  warehouses: Warehouse[]
}

/** Add/edit dialog for a single product. No backend — state lives in the shared inventory store. */
export function ProductFormModal({ open, onClose, onSubmit, editingProduct, warehouses }: ProductFormModalProps) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      title={editingProduct ? 'Edit product' : 'Add product'}
      description={editingProduct ? `Update details for ${editingProduct.name}.` : 'Register a new product in the catalogue.'}
    >
      {open ? (
        <ProductForm onClose={onClose} onSubmit={onSubmit} editingProduct={editingProduct} warehouses={warehouses} />
      ) : null}
    </Modal>
  )
}

interface ProductFormFieldsProps {
  onClose: () => void
  onSubmit: (values: ProductInput) => void
  editingProduct: Product | null
  warehouses: Warehouse[]
}

function ProductForm({ onClose, onSubmit, editingProduct, warehouses }: ProductFormFieldsProps) {
  const [name, setName] = useState(editingProduct?.name ?? '')
  const [sku, setSku] = useState(editingProduct?.sku ?? '')
  const [category, setCategory] = useState<ProductCategory>(editingProduct?.category ?? categoryOptions[0])
  const [warehouseId, setWarehouseId] = useState(editingProduct?.warehouseId ?? warehouses[0]?.id ?? '')
  const [price, setPrice] = useState(editingProduct ? String(editingProduct.price) : '')
  const [stock, setStock] = useState(editingProduct ? String(editingProduct.stock) : '0')
  const [reorderLevel, setReorderLevel] = useState(editingProduct ? String(editingProduct.reorderLevel) : '')
  const [discontinued, setDiscontinued] = useState(editingProduct?.discontinued ?? false)
  const [errors, setErrors] = useState<FieldErrors>({})

  const handleTextChange = (setter: (value: string) => void, field: keyof FieldErrors) => (event: ChangeEvent<HTMLInputElement>) => {
    setter(event.target.value)
    setErrors((current) => ({ ...current, [field]: undefined }))
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const nextErrors: FieldErrors = {}
    if (!name.trim()) nextErrors.name = 'Enter a product name.'
    if (!sku.trim()) nextErrors.sku = 'Enter a SKU.'
    if (!warehouseId) nextErrors.warehouseId = 'Select a warehouse.'
    if (!price.trim() || Number(price) < 0) nextErrors.price = 'Enter a valid price.'
    if (!stock.trim() || Number(stock) < 0) nextErrors.stock = 'Enter a valid stock quantity.'
    if (!reorderLevel.trim() || Number(reorderLevel) < 0) nextErrors.reorderLevel = 'Enter a valid reorder level.'

    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return

    onSubmit({
      name,
      sku,
      category,
      warehouseId,
      price: Number(price),
      stock: Number(stock),
      reorderLevel: Number(reorderLevel),
      discontinued,
    })
  }

  return (
    <form noValidate onSubmit={handleSubmit} className="space-y-4">
      <FormField id="product-name" label="Product name" error={errors.name}>
        <input
          id="product-name"
          type="text"
          value={name}
          onChange={handleTextChange(setName, 'name')}
          aria-invalid={errors.name ? true : undefined}
          className={cn(demoControlStyles, errors.name && 'border-red-300')}
        />
      </FormField>

      <div className="grid grid-cols-2 gap-4">
        <FormField id="product-sku" label="SKU" error={errors.sku}>
          <input
            id="product-sku"
            type="text"
            value={sku}
            onChange={handleTextChange(setSku, 'sku')}
            aria-invalid={errors.sku ? true : undefined}
            className={cn(demoControlStyles, errors.sku && 'border-red-300')}
          />
        </FormField>
        <FormField id="product-category" label="Category">
          <select
            id="product-category"
            value={category}
            onChange={(event) => setCategory(event.target.value as ProductCategory)}
            className={demoControlStyles}
          >
            {categoryOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </FormField>
      </div>

      <FormField id="product-warehouse" label="Warehouse" error={errors.warehouseId}>
        <select
          id="product-warehouse"
          value={warehouseId}
          onChange={(event) => {
            setWarehouseId(event.target.value)
            setErrors((current) => ({ ...current, warehouseId: undefined }))
          }}
          aria-invalid={errors.warehouseId ? true : undefined}
          className={cn(demoControlStyles, errors.warehouseId && 'border-red-300')}
        >
          {warehouses.map((warehouse) => (
            <option key={warehouse.id} value={warehouse.id}>
              {warehouse.name}
            </option>
          ))}
        </select>
      </FormField>

      <div className="grid grid-cols-3 gap-4">
        <FormField id="product-price" label="Price" error={errors.price}>
          <input
            id="product-price"
            type="number"
            min={0}
            step="0.01"
            value={price}
            onChange={handleTextChange(setPrice, 'price')}
            aria-invalid={errors.price ? true : undefined}
            className={cn(demoControlStyles, errors.price && 'border-red-300')}
          />
        </FormField>
        <FormField id="product-stock" label={editingProduct ? 'Stock' : 'Initial stock'} error={errors.stock}>
          <input
            id="product-stock"
            type="number"
            min={0}
            value={stock}
            onChange={handleTextChange(setStock, 'stock')}
            aria-invalid={errors.stock ? true : undefined}
            className={cn(demoControlStyles, errors.stock && 'border-red-300')}
          />
        </FormField>
        <FormField id="product-reorder" label="Reorder level" error={errors.reorderLevel}>
          <input
            id="product-reorder"
            type="number"
            min={0}
            value={reorderLevel}
            onChange={handleTextChange(setReorderLevel, 'reorderLevel')}
            aria-invalid={errors.reorderLevel ? true : undefined}
            className={cn(demoControlStyles, errors.reorderLevel && 'border-red-300')}
          />
        </FormField>
      </div>

      <label className="flex items-center gap-2.5 text-sm text-ink-700">
        <input
          type="checkbox"
          checked={discontinued}
          onChange={(event) => setDiscontinued(event.target.checked)}
          className="size-4 rounded border-ink-300 text-accent-600 focus:ring-2 focus:ring-accent-100"
        />
        Mark as discontinued
      </label>

      <div className="flex justify-end gap-3 pt-2">
        <Button type="button" variant="secondary" size="md" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit" size="md">
          {editingProduct ? 'Save changes' : 'Add product'}
        </Button>
      </div>
    </form>
  )
}
