import type { Product } from '../api/products'

interface DeleteConfirmProps {
  product: Product
  onConfirm: () => void
  onCancel: () => void
  isLoading: boolean
}

export function DeleteConfirm({ product, onConfirm, onCancel, isLoading }: DeleteConfirmProps) {
  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-800 mb-6">Delete Product</h2>
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6 max-w-lg">
        <p className="text-gray-700 mb-2">
          Are you sure you want to delete{' '}
          <span className="font-semibold">{product.name}</span>?
        </p>
        <p className="text-sm text-gray-500 mb-6">This action cannot be undone.</p>
        <div className="flex gap-3">
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 disabled:opacity-50 transition-colors text-sm font-medium"
          >
            {isLoading ? 'Deleting…' : 'Delete'}
          </button>
          <button
            onClick={onCancel}
            disabled={isLoading}
            className="border border-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-50 transition-colors text-sm font-medium"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}
