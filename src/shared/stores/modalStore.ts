import { create } from 'zustand'

interface ModalData {
  orderId?: number
  totalPrice?: number
  orderDetails?: {
    country: string
    quantity: number
    pricePerProxy: number
    totalPrice: number
  }
}

interface ModalState {
  isOpen: boolean
  type: 'success' | 'error' | 'confirm'
  title: string
  message: string
  data?: ModalData
  onConfirm?: () => void
  onCancel?: () => void
  isLoading?: boolean
}

interface ModalStore {
  modal: ModalState
  showModal: (config: {
    type: 'success' | 'error' | 'confirm'
    title: string
    message: string
    data?: ModalData
    onConfirm?: () => void
    onCancel?: () => void
    isLoading?: boolean
  }) => void
  closeModal: () => void
  setLoading: (isLoading: boolean) => void
}

export const useModalStore = create<ModalStore>((set) => ({
  modal: {
    isOpen: false,
    type: 'success',
    title: '',
    message: '',
    data: undefined,
    isLoading: false
  },
  showModal: (config) => set({
    modal: {
      isOpen: true,
      isLoading: false,
      ...config
    }
  }),
  closeModal: () => set((state) => ({
    modal: {
      ...state.modal,
      isOpen: false
    }
  })),
  setLoading: (isLoading) => set((state) => ({
    modal: {
      ...state.modal,
      isLoading
    }
  }))
})) 