import { useEffect } from 'react'
import { useModalStore } from '@/shared/stores/modalStore'

export function Modal() {
  const { modal, closeModal, setLoading } = useModalStore()

  // Закрытие модалки по ESC
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && modal.isOpen) {
        closeModal()
      }
    }

    if (modal.isOpen) {
      document.addEventListener('keydown', handleEscape)
      return () => document.removeEventListener('keydown', handleEscape)
    }
  }, [modal.isOpen, closeModal])

  if (!modal.isOpen) return null

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={closeModal}
    >
      <div 
        className="bg-white dark:bg-gray-800 rounded-lg max-w-md w-full p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center mb-4">
          {modal.type === 'success' ? (
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
              <svg className="w-6 h-6 text-green-600 dark:text-green-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          ) : modal.type === 'confirm' ? (
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
              <svg className="w-6 h-6 text-blue-600 dark:text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          ) : (
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-red-100 dark:bg-red-900 flex items-center justify-center">
              <svg className="w-6 h-6 text-red-600 dark:text-red-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
          )}
          <h3 className="ml-3 text-lg font-medium text-gray-900 dark:text-gray-100">
            {modal.title}
          </h3>
        </div>
        
        <p className="text-gray-600 dark:text-gray-300 mb-4">
          {modal.message}
        </p>
        
        {modal.type === 'success' && modal.data?.orderId && modal.data?.totalPrice && (
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Order ID:</span>
              <span className="text-sm text-gray-900 dark:text-gray-100">#{modal.data.orderId}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Total Price:</span>
              <span className="text-sm font-bold text-green-600 dark:text-green-400">${modal.data.totalPrice.toFixed(2)}</span>
            </div>
          </div>
        )}

        {modal.type === 'confirm' && modal.data?.orderDetails && (
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-4">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Country:</span>
                <span className="text-sm text-gray-900 dark:text-gray-100">{modal.data.orderDetails.country}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Quantity:</span>
                <span className="text-sm text-gray-900 dark:text-gray-100">{modal.data.orderDetails.quantity} proxies</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Price per proxy:</span>
                <span className="text-sm text-gray-900 dark:text-gray-100">${modal.data.orderDetails.pricePerProxy.toFixed(2)}</span>
              </div>
              <div className="border-t border-gray-200 dark:border-gray-600 pt-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-bold text-gray-700 dark:text-gray-300">Total Price:</span>
                  <span className="text-sm font-bold text-blue-600 dark:text-blue-400">${modal.data.orderDetails.totalPrice.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        )}
        
        <div className="flex justify-end space-x-3">
          {modal.type === 'confirm' ? (
            <>
              <button
                onClick={() => {
                  if (modal.onCancel) {
                    modal.onCancel()
                  } else {
                    closeModal()
                  }
                }}
                disabled={modal.isLoading}
                className="px-4 py-2 rounded-lg font-medium transition-colors bg-gray-300 hover:bg-gray-400 text-gray-700 dark:bg-gray-600 dark:hover:bg-gray-500 dark:text-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  if (modal.onConfirm) {
                    setLoading(true)
                    try {
                      await modal.onConfirm()
                    } catch (error) {
                      console.error('Error in modal onConfirm:', error)
                      // Ошибка будет обработана в onConfirm функции
                    } finally {
                      setLoading(false)
                    }
                  }
                }}
                disabled={modal.isLoading}
                className="px-4 py-2 rounded-lg font-medium transition-colors bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {modal.isLoading && (
                  <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                )}
                {modal.isLoading ? 'Processing...' : 'Confirm Purchase'}
              </button>
            </>
          ) : (
            <button
              onClick={closeModal}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                modal.type === 'success'
                  ? 'bg-green-600 hover:bg-green-700 text-white'
                  : 'bg-red-600 hover:bg-red-700 text-white'
              }`}
            >
              {modal.type === 'success' ? 'Continue Shopping' : 'Try Again'}
            </button>
          )}
        </div>
      </div>
    </div>
  )
} 