import { api } from '../../../lib/api'
import type { Branch, CreateBranchData, UpdateBranchData } from '../model/types'

export const branchApi = {
  // Получить все ветки
  getAll: (): Promise<Branch[]> => {
    return api.get('/branches')
  },

  // Получить ветку по ID
  getById: (id: number): Promise<Branch | null> => {
    return api.get(`/branches/${id}`)
  },

  // Создать новую ветку
  create: (data: CreateBranchData): Promise<Branch> => {
    return api.post('/branches', data)
  },

  // Обновить ветку
  update: (id: number, data: UpdateBranchData): Promise<Branch> => {
    return api.patch(`/branches/${id}`, data)
  },

  // Удалить ветку
  delete: (id: number): Promise<Branch> => {
    return api.delete(`/branches/${id}`)
  }
} 