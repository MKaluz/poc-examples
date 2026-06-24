import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { productsApi, type Product } from '../api/products'
import { ProductForm } from './ProductForm'
import { DeleteConfirm } from './DeleteConfirm'

type View = 'list' | 'create' | 'edit' | 'delete'

export function ProductsPage() {
  const queryClient = useQueryClient()
  const [view, setView] = useState<View>('list')
  const [selected, setSelected] = useState<Product | null>(null)

  const { data: products = [], isLoading, isError } = useQuery({
    queryKey: ['products'],
    queryFn: productsApi.list,
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => productsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] })
      setView('list')
      setSelected(null)
    },
  })

  function handleEdit(product: Product) {
    setSelected(product)
    setView('edit')
  }

  function handleDeleteClick(product: Product) {
    setSelected(product)
    setView('delete')
  }

  function handleCancel() {
    setView('list')
    setSelected(null)
  }

  function handleFormSuccess() {
    queryClient.invalidateQueries({ queryKey: ['products'] })
    setView('list')
    setSelected(null)
  }

  if (view === 'create') {
    return <ProductForm onSuccess={handleFormSuccess} onCancel={handleCancel} />
  }

  if (view === 'edit' && selected) {
    return (
      <ProductForm
        product={selected}
        onSuccess={handleFormSuccess}
        onCancel={handleCancel}
      />
    )
  }

  if (view === 'delete' && selected) {
    return (
      <DeleteConfirm
        product={selected}
        onConfirm={() => deleteMutation.mutate(selected.id)}
        onCancel={handleCancel}
        isLoading={deleteMutation.isPending}
      />
    )
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-800">Products</h2>
        <button
          onClick={() => setView('create')}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
        >
          Add Product
        </button>
      </div>

      {isLoading && (
        <p className="text-gray-500 text-center py-8">Loading products…</p>
      )}

      {isError && (
        <p className="text-red-600 text-center py-8">
          Failed to load products. Is the API running?
        </p>
      )}

      {!isLoading && !isError && products.length === 0 && (
        <p className="text-gray-500 text-center py-8">
          No products yet. Add one to get started.
        </p>
      )}

      {products.length > 0 && (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Name</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Category</th>
                <th className="px-4 py-3 text-right text-sm font-medium text-gray-600">Price</th>
                <th className="px-4 py-3 text-right text-sm font-medium text-gray-600">Stock</th>
                <th className="px-4 py-3 text-right text-sm font-medium text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {products.map((p) => (
                <tr key={p.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm text-gray-900">{p.name}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{p.category}</td>
                  <td className="px-4 py-3 text-sm text-gray-900 text-right">
                    ${p.price.toFixed(2)}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900 text-right">{p.stockCount}</td>
                  <td className="px-4 py-3 text-right space-x-2">
                    <button
                      onClick={() => handleEdit(p)}
                      className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteClick(p)}
                      className="text-red-600 hover:text-red-800 text-sm font-medium"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
