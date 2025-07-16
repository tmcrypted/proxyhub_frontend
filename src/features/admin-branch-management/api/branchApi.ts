import { apiClient } from '@/shared/api/apiClient'
import type { Branch, CreateBranchData, UpdateBranchData } from '../model/types'

export const branchApi = {
  // Получить все ветки
  getAll: (): Promise<Branch[]> => {
    return apiClient.get('/branches')
  },

  // Получить ветку по ID
  getById: (id: number): Promise<Branch | null> => {
    return apiClient.get(`/branches/${id}`)
  },

  // Создать новую ветку
  create: (data: CreateBranchData): Promise<Branch> => {
    return apiClient.post('/branches', data)
  },

  // Обновить ветку
  update: (id: number, data: UpdateBranchData): Promise<Branch> => {
    return apiClient.patch(`/branches/${id}`, data)
  },

  // Удалить ветку
  delete: (id: number): Promise<Branch> => {
    return apiClient.delete(`/branches/${id}`)
  }
} 