import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useMutation } from '@tanstack/react-query'
import { isAxiosError } from 'axios'
import { productsApi, type Product, type ValidationProblem } from '../api/products'

const schema = z.object({
  name: z.string().min(1, 'Name is required'),
  price: z.coerce.number().min(0, 'Price must be zero or greater'),
  category: z.string().min(1, 'Category is required'),
  stockCount: z.coerce.number().int('Stock count must be a whole number').min(0, 'Stock count must be zero or greater'),
})

type FormValues = z.infer<typeof schema>

interface ProductFormProps {
  product?: Product
  onSuccess: () => void
  onCancel: () => void
}

export function ProductForm({ product, onSuccess, onCancel }: ProductFormProps) {
  const isEdit = product !== undefined

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: product
      ? {
          name: product.name,
          price: product.price,
          category: product.category,
          stockCount: product.stockCount,
        }
      : undefined,
  })

  const mutation = useMutation({
    mutationFn: (data: FormValues) =>
      isEdit
        ? productsApi.update(product.id, data)
        : productsApi.create(data),
    onSuccess,
    onError(error) {
      if (isAxiosError(error) && error.response?.status === 422) {
        const problem = error.response.data as ValidationProblem
        for (const [field, messages] of Object.entries(problem.errors ?? {})) {
          // API returns camelCase keys that match form field names directly.
          setError(field as keyof FormValues, { message: messages[0] })
        }
      }
    },
  })

  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-800 mb-6">
        {isEdit ? 'Edit Product' : 'Add Product'}
      </h2>

      <form
        onSubmit={handleSubmit((data) => mutation.mutate(data))}
        className="bg-white border border-gray-200 rounded-lg shadow-sm p-6 max-w-lg space-y-5"
      >
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
          <input
            {...register('name')}
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Product name"
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Price</label>
          <input
            {...register('price')}
            type="number"
            step="0.01"
            min="0"
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="0.00"
          />
          {errors.price && (
            <p className="mt-1 text-sm text-red-600">{errors.price.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
          <input
            {...register('category')}
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Category"
          />
          {errors.category && (
            <p className="mt-1 text-sm text-red-600">{errors.category.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Stock Count</label>
          <input
            {...register('stockCount')}
            type="number"
            min="0"
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="0"
          />
          {errors.stockCount && (
            <p className="mt-1 text-sm text-red-600">{errors.stockCount.message}</p>
          )}
        </div>

        {mutation.isError && !isAxiosError(mutation.error) && (
          <p className="text-sm text-red-600">An unexpected error occurred. Please try again.</p>
        )}

        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            disabled={isSubmitting || mutation.isPending}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 transition-colors text-sm font-medium"
          >
            {mutation.isPending ? 'Saving…' : isEdit ? 'Save Changes' : 'Create Product'}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="border border-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-50 transition-colors text-sm font-medium"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}
