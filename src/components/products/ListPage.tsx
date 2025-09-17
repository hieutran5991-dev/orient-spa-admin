'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import ComponentCard from '../common/ComponentCard'
import DataTable, { Column } from '../tables/DataTable'
import { Product } from '@/types/product'
import { deleteProduct, updateFeaturedOrder } from '@/api/product'
import { useAlert } from '@/context/AlertContext'
import { AlertMessages, AlertConfigs } from '@/lib/alertMessages'
import { HTTP_CODES } from '@/constants/http-codes'
import PencilIcon from '@/icons/pencil.svg'
import TrashIcon from '@/icons/trash.svg'
import { CategoryOption } from '@/types/category'
import { LANGUAGES } from '@/constants/languages'
import { formatPriceWithCurrency } from '@/lib/currency'
import InputField from '../form/input/InputField'

export default function ListPage({
  products,
  categories,
  isError
}: {
  products: Product[]
  categories: CategoryOption[]
  isError: boolean
}) {
  const { showSuccess, showError, showWarning } = useAlert()

  // State for featured products management
  const [isFeaturedMode, setIsFeaturedMode] = useState(false)
  const [featuredOrders, setFeaturedOrders] = useState<Record<number, number>>({})
  const [isUpdatingOrder, setIsUpdatingOrder] = useState(false)
  const [validationErrors, setValidationErrors] = useState<Record<number, string>>({})

  // Filter products based on mode
  const filteredProducts = useMemo(() => {
    if (isFeaturedMode) {
      return products
        .filter((product) => product.is_featured)
        .sort((a, b) => {
          const aOrder = a.featured_no || 0
          const bOrder = b.featured_no || 0
          return aOrder - bOrder
        })
    }
    return products
  }, [products, isFeaturedMode])

  // Initialize featured orders when entering featured mode
  const initializeFeaturedOrders = () => {
    const featuredProducts = products
      .filter((p) => p.is_featured)
      .sort((a, b) => {
        const aOrder = a.featured_no || 0
        const bOrder = b.featured_no || 0
        return aOrder - bOrder
      })

    const orders: Record<number, number> = {}
    featuredProducts.forEach((product, index) => {
      orders[product.id] = product.featured_no || index + 1
    })
    setFeaturedOrders(orders)
  }

  // Handle featured mode toggle
  const handleFeaturedModeToggle = () => {
    if (!isFeaturedMode) {
      initializeFeaturedOrders()
    }
    setIsFeaturedMode(!isFeaturedMode)
  }

  // Handle order change
  const handleOrderChange = (productId: number, newOrder: string) => {
    // Only allow numbers
    const numericValue = newOrder.replace(/[^0-9]/g, '')

    // Clear validation error when user starts typing
    if (validationErrors[productId]) {
      setValidationErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[productId]
        return newErrors
      })
    }

    // If empty, clear the value
    if (numericValue === '') {
      const currentOrders = { ...featuredOrders }
      delete currentOrders[productId]
      setFeaturedOrders(currentOrders)
      return
    }

    const orderValue = parseInt(numericValue)

    // Validation
    if (isNaN(orderValue) || orderValue < 1 || orderValue > 1000) {
      return
    }

    // Check for duplicates and swap if needed
    const currentOrders = { ...featuredOrders }
    const existingProductId = Object.keys(currentOrders).find(
      (id) => parseInt(id) !== productId && currentOrders[parseInt(id)] === orderValue
    )

    if (existingProductId) {
      // Swap orders
      const oldOrder = currentOrders[productId]
      currentOrders[parseInt(existingProductId)] = oldOrder
    }

    currentOrders[productId] = orderValue
    setFeaturedOrders(currentOrders)
  }

  // Handle key down to prevent non-numeric input
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Allow: backspace, delete, tab, escape, enter, home, end, left, right, up, down
    if (
      [8, 9, 27, 13, 46, 35, 36, 37, 38, 39, 40].indexOf(e.keyCode) !== -1 ||
      // Allow: Ctrl+A, Ctrl+C, Ctrl+V, Ctrl+X
      (e.keyCode === 65 && e.ctrlKey === true) ||
      (e.keyCode === 67 && e.ctrlKey === true) ||
      (e.keyCode === 86 && e.ctrlKey === true) ||
      (e.keyCode === 88 && e.ctrlKey === true)
    ) {
      return
    }
    // Ensure that it is a number and stop the keypress
    if ((e.shiftKey || e.keyCode < 48 || e.keyCode > 57) && (e.keyCode < 96 || e.keyCode > 105)) {
      e.preventDefault()
    }
  }

  // Handle order update
  const handleUpdateOrder = async () => {
    // Clear previous validation errors
    setValidationErrors({})

    // Validate that all featured products have order numbers
    const featuredProductIds = filteredProducts.map((product) => product.id)
    const missingOrders = featuredProductIds.filter((id) => !featuredOrders[id] || featuredOrders[id] === 0)

    if (missingOrders.length > 0) {
      const errors: Record<number, string> = {}
      missingOrders.forEach((id) => {
        errors[id] = 'Order number is required'
      })
      setValidationErrors(errors)

      showError(
        AlertMessages.ERROR.VALIDATION_ERROR.title,
        'Please enter order numbers for all featured products before updating.',
        AlertConfigs.ERROR
      )
      return
    }

    // Validate that all order numbers are within valid range
    const invalidOrders = Object.entries(featuredOrders).filter(([, order]) => order < 1 || order > 1000)

    if (invalidOrders.length > 0) {
      const errors: Record<number, string> = {}
      invalidOrders.forEach(([id]) => {
        errors[parseInt(id)] = 'Order must be between 1 and 1000'
      })
      setValidationErrors(errors)

      showError(
        AlertMessages.ERROR.VALIDATION_ERROR.title,
        'Order numbers must be between 1 and 1000.',
        AlertConfigs.ERROR
      )
      return
    }

    setIsUpdatingOrder(true)
    try {
      // Sort products by their current order numbers to reflect the display order
      const sortedProducts = [...filteredProducts].sort((a, b) => {
        const aOrder = featuredOrders[a.id] || 0
        const bOrder = featuredOrders[b.id] || 0
        return aOrder - bOrder
      })

      // Get product IDs in the correct order
      const productIds = sortedProducts.map((product) => product.id)

      const response = await updateFeaturedOrder({
        product_ids: productIds
      })

      if (response.status === HTTP_CODES.SUCCESS) {
        showSuccess(
          AlertMessages.SUCCESS.FEATURED_ORDER_UPDATED.title,
          AlertMessages.SUCCESS.FEATURED_ORDER_UPDATED.message,
          AlertConfigs.SUCCESS
        )
        // Stay on the same screen, no reload needed
      } else {
        showError(
          AlertMessages.ERROR.FEATURED_ORDER_UPDATE_FAILED.title,
          AlertMessages.ERROR.FEATURED_ORDER_UPDATE_FAILED.message,
          AlertConfigs.ERROR
        )
        // Reload to get latest data on error
        window.location.reload()
      }
    } catch (error) {
      console.error('Error updating featured order:', error)
      showError(AlertMessages.ERROR.NETWORK_ERROR.title, AlertMessages.ERROR.NETWORK_ERROR.message, AlertConfigs.ERROR)
      // Reload to get latest data on error
      window.location.reload()
    } finally {
      setIsUpdatingOrder(false)
    }
  }

  // Define table columns
  const columns: Column[] = isError
    ? []
    : [
        {
          key: 'name',
          header: 'Product Name',
          sortable: true,
          width: '25%',
          render: (value: unknown, row: Record<string, unknown>) => {
            const product = row as unknown as Product
            return (
              <div className='space-y-1'>
                <div className='font-medium text-gray-900 dark:text-white'>{product.name}</div>
                {product.translations && product.translations.length > 0 && (
                  <div className='text-xs text-gray-500 dark:text-gray-400 space-y-0.5'>
                    {product.translations
                      .filter((t) => t.language_code !== LANGUAGES.EN)
                      .map((translation, index) => (
                        <div key={index} className='flex items-center space-x-1'>
                          <span className='text-xs font-medium'>{translation.language_code.toUpperCase()}:</span>
                          <span>{translation.name}</span>
                        </div>
                      ))}
                  </div>
                )}
              </div>
            )
          }
        },
        {
          key: 'category_id',
          header: 'Category',
          sortable: true,
          width: '20%',
          render: (value: unknown) => (
            <span className='font-medium text-gray-700 dark:text-gray-300'>
              {categories.find((category) => category.id === value)?.name}
            </span>
          )
        },
        {
          key: 'duration',
          header: 'Duration (minutes)',
          sortable: true,
          width: '8%',
          render: (value: unknown) => <span className='font-medium text-green-600'>{String(value)}</span>
        },
        {
          key: 'price',
          header: 'Price',
          sortable: true,
          width: '15%',
          render: (value: unknown, row: Record<string, unknown>) => {
            const product = row as unknown as Product
            return (
              <div className='space-y-1'>
                {Object.entries(product.prices).map(([currencyCode, price]) => (
                  <div key={currencyCode} className='flex items-center text-gray-900 dark:text-white'>
                    {currencyCode.toUpperCase()}: {formatPriceWithCurrency(price, currencyCode)}
                  </div>
                ))}
              </div>
            )
          }
        },
        {
          key: 'is_featured',
          header: 'Featured',
          sortable: true,
          width: '8%',
          render: (value: unknown) => (
            <span
              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                value
                  ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                  : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
              }`}
            >
              {value ? 'Yes' : 'No'}
            </span>
          )
        },
        ...(isFeaturedMode
          ? [
              {
                key: 'featured_order',
                header: 'Order',
                sortable: false,
                width: '10%',
                render: (value: unknown, row: Record<string, unknown>) => {
                  const product = row as unknown as Product
                  return (
                    <div className='w-20'>
                      <InputField
                        type='text'
                        value={featuredOrders[product.id]?.toString() || ''}
                        onChange={(e) => handleOrderChange(product.id, e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder='Order'
                        className='text-center'
                        inputMode='numeric'
                        pattern='[0-9]*'
                        error={!!validationErrors[product.id]}
                        hint={validationErrors[product.id] || ''}
                      />
                    </div>
                  )
                }
              }
            ]
          : [
              {
                key: 'actions',
                header: 'Actions',
                sortable: false,
                width: '12%',
                render: (value: unknown, row: Record<string, unknown>) => (
                  <div className='flex items-center space-x-2'>
                    <Link
                      href={`/products/${row.id}/edit`}
                      className='p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors'
                      title='Edit Product'
                    >
                      <PencilIcon className='w-5 h-5 fill-current' />
                    </Link>
                    <button
                      onClick={() => handleDeleteProduct(row.id as number)}
                      className='p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors'
                      title='Delete Product'
                    >
                      <TrashIcon className='w-5 h-5 fill-current' />
                    </button>
                  </div>
                )
              }
            ])
      ]

  // Handle delete product
  const handleDeleteProduct = async (id: number) => {
    // Show warning confirmation
    showWarning(
      AlertMessages.WARNING.PRODUCT_DELETE_WARNING.title,
      AlertMessages.WARNING.PRODUCT_DELETE_WARNING.message,
      { persistent: true }
    )

    // For now, we'll use a simple confirm dialog
    // In a real app, you might want to create a custom confirmation modal
    if (confirm('Are you sure you want to delete this product? This will affect all future bookings.')) {
      try {
        const response = await deleteProduct(id)

        if (response.status === HTTP_CODES.SUCCESS) {
          showSuccess(
            AlertMessages.SUCCESS.PRODUCT_DELETED.title,
            AlertMessages.SUCCESS.PRODUCT_DELETED.message,
            AlertConfigs.SUCCESS
          )
          // Refresh the page to show updated data
          window.location.reload()
        } else {
          showError(
            AlertMessages.ERROR.DELETE_ERROR.title,
            AlertMessages.ERROR.DELETE_ERROR.message,
            AlertConfigs.ERROR
          )
        }
      } catch (error) {
        console.error('Error deleting product:', error)
        showError(
          AlertMessages.ERROR.NETWORK_ERROR.title,
          AlertMessages.ERROR.NETWORK_ERROR.message,
          AlertConfigs.ERROR
        )
      }
    }
  }

  return (
    <div className='space-y-6'>
      <div className='flex justify-between items-center'>
        <h1 className='text-2xl font-bold text-gray-900 dark:text-white'>
          {isFeaturedMode ? 'Featured Products Order' : 'Products List'}
        </h1>
        <div className='flex items-center space-x-3'>
          <button
            onClick={handleFeaturedModeToggle}
            className={`px-4 py-2 rounded-lg transition-colors ${
              isFeaturedMode ? 'bg-gray-600 text-white hover:bg-gray-700' : 'bg-green-600 text-white hover:bg-green-700'
            }`}
          >
            {isFeaturedMode ? 'Back to All Products' : 'Featured Products'}
          </button>
          {isFeaturedMode && (
            <button
              onClick={handleUpdateOrder}
              disabled={isUpdatingOrder}
              className='px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
            >
              {isUpdatingOrder ? 'Updating...' : 'Update Order'}
            </button>
          )}
          <Link
            href='/products/create'
            className='px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors'
          >
            Add New Product
          </Link>
        </div>
      </div>

      <ComponentCard title={isFeaturedMode ? 'Featured Products Order' : 'Products'}>
        <DataTable
          data={filteredProducts as unknown as Record<string, unknown>[]}
          columns={columns}
          itemsPerPage={isFeaturedMode ? filteredProducts.length : 10}
          searchable={!isFeaturedMode}
          sortable={!isFeaturedMode}
          emptyMessage={
            isError
              ? 'Failed to load products. Please try again later.'
              : isFeaturedMode
              ? 'No featured products found. Mark some products as featured first.'
              : 'No products found. Create your first product to get started.'
          }
        />
      </ComponentCard>
    </div>
  )
}
