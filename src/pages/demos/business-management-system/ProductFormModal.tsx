import { useState } from 'react'
import type { ChangeEvent, FormEvent } from 'react'
import { Modal } from '../../../components/demo/Modal'
import { FormField } from '../../../sections/contact/FormField'
import { demoControlStyles } from '../../../components/demo/formControlStyles'
import { Button } from '../../../components/ui/Button'
import { cn } from '../../../lib/cn'
import type { Product, ProductStatus } from '../../../data/demos/business-management/types'

export interface ProductFormValues {
  name: string
  sku: string
  category: string
  price: number
  stock: number
  reorderLevel: number
  status: ProductStatus
}

const emptyValues: ProductFormValues = {
  name: '',
  sku: '',
  category: '',
  price: 0,
  stock: 0,
  reorderLevel: 10,
  status: 'Active',
}

const statusOptions: ProductStatus[] = ['Active', 'Draft', 'Discontinued']

type FieldErrors = Partial<Record<keyof ProductFormValues, string>>

interface ProductFormModalProps {
  open: boolean
  onClose: () => void
  onSubmit: (values: ProductFormValues) => void
  editingProduct: Product | null
}

/**
 * Add/edit dialog for a single product record. No backend — state lives in
 * the parent page. The form fields live in a child component that Modal only
 * mounts while open, so each open cycle starts from fresh initial values
 * without needing an effect to resynchronise them.
 */
export function ProductFormModal({ open, onClose, onSubmit, editingProduct }: ProductFormModalProps) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      title={editingProduct ? 'Edit product' : 'Add product'}
      description={
        editingProduct
          ? `Update details for ${editingProduct.name}.`
          : 'Create a new demo product record.'
      }
    >
      {open ? (
        <ProductForm onClose={onClose} onSubmit={onSubmit} editingProduct={editingProduct} />
      ) : null}
    </Modal>
  )
}

interface ProductFormFieldsProps {
  onClose: () => void
  onSubmit: (values: ProductFormValues) => void
  editingProduct: Product | null
}

function ProductForm({ onClose, onSubmit, editingProduct }: ProductFormFieldsProps) {
  const [values, setValues] = useState<ProductFormValues>(() =>
    editingProduct
      ? {
          name: editingProduct.name,
          sku: editingProduct.sku,
          category: editingProduct.category,
          price: editingProduct.price,
          stock: editingProduct.stock,
          reorderLevel: editingProduct.reorderLevel,
          status: editingProduct.status,
        }
      : emptyValues,
  )
  const [errors, setErrors] = useState<FieldErrors>({})

  const handleTextChange =
    (field: 'name' | 'sku' | 'category') => (event: ChangeEvent<HTMLInputElement>) => {
      setValues((current) => ({ ...current, [field]: event.target.value }))
      setErrors((current) => ({ ...current, [field]: undefined }))
    }

  const handleNumberChange =
    (field: 'price' | 'stock' | 'reorderLevel') => (event: ChangeEvent<HTMLInputElement>) => {
      const parsed = Number(event.target.value)
      setValues((current) => ({ ...current, [field]: Number.isNaN(parsed) ? 0 : parsed }))
      setErrors((current) => ({ ...current, [field]: undefined }))
    }

  const handleStatusChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setValues((current) => ({ ...current, status: event.target.value as ProductStatus }))
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const nextErrors: FieldErrors = {}
    if (!values.name.trim()) nextErrors.name = 'Enter a product name.'
    if (!values.sku.trim()) nextErrors.sku = 'Enter a SKU.'
    if (!values.category.trim()) nextErrors.category = 'Enter a category.'
    if (values.price < 0) nextErrors.price = 'Price cannot be negative.'
    if (values.stock < 0) nextErrors.stock = 'Stock cannot be negative.'

    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return

    onSubmit(values)
  }

  return (
    <form noValidate onSubmit={handleSubmit} className="space-y-4">
      <FormField id="product-name" label="Product name" error={errors.name}>
        <input
          id="product-name"
          name="name"
          type="text"
          value={values.name}
          onChange={handleTextChange('name')}
          aria-invalid={errors.name ? true : undefined}
          className={cn(demoControlStyles, errors.name && 'border-red-300')}
        />
      </FormField>

      <div className="grid grid-cols-2 gap-4">
        <FormField id="product-sku" label="SKU" error={errors.sku}>
          <input
            id="product-sku"
            name="sku"
            type="text"
            value={values.sku}
            onChange={handleTextChange('sku')}
            aria-invalid={errors.sku ? true : undefined}
            className={cn(demoControlStyles, errors.sku && 'border-red-300')}
          />
        </FormField>

        <FormField id="product-category" label="Category" error={errors.category}>
          <input
            id="product-category"
            name="category"
            type="text"
            value={values.category}
            onChange={handleTextChange('category')}
            aria-invalid={errors.category ? true : undefined}
            className={cn(demoControlStyles, errors.category && 'border-red-300')}
          />
        </FormField>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <FormField id="product-price" label="Price (₱)" error={errors.price}>
          <input
            id="product-price"
            name="price"
            type="number"
            min={0}
            step={1}
            value={values.price}
            onChange={handleNumberChange('price')}
            aria-invalid={errors.price ? true : undefined}
            className={cn(demoControlStyles, errors.price && 'border-red-300')}
          />
        </FormField>

        <FormField id="product-stock" label="Stock" error={errors.stock}>
          <input
            id="product-stock"
            name="stock"
            type="number"
            min={0}
            step={1}
            value={values.stock}
            onChange={handleNumberChange('stock')}
            aria-invalid={errors.stock ? true : undefined}
            className={cn(demoControlStyles, errors.stock && 'border-red-300')}
          />
        </FormField>

        <FormField id="product-reorder" label="Reorder at">
          <input
            id="product-reorder"
            name="reorderLevel"
            type="number"
            min={0}
            step={1}
            value={values.reorderLevel}
            onChange={handleNumberChange('reorderLevel')}
            className={demoControlStyles}
          />
        </FormField>
      </div>

      <FormField id="product-status" label="Status">
        <select
          id="product-status"
          name="status"
          value={values.status}
          onChange={handleStatusChange}
          className={demoControlStyles}
        >
          {statusOptions.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>
      </FormField>

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
