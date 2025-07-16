import { apiClient } from '@/shared/api/apiClient'
import type { User, UpdateUserData } from '../model/types'

export const userApi = {
  // Получить всех пользователей
  getAll: (): Promise<User[]> => {
    return apiClient.get('/users')
  },

  // Получить пользователя по ID
  getById: (id: number): Promise<User | null> => {
    return apiClient.get(`/users/${id}`)
  },

  // Обновить пользователя
  update: (id: number, data: UpdateUserData): Promise<User> => {
    return apiClient.patch(`/users/${id}`, data)
  },

  // Удалить пользователя
  delete: (id: number): Promise<User> => {
    return apiClient.delete(`/users/${id}`)
  }
} 