import { api } from '../../../lib/api'
import type { User, UpdateUserData } from '../model/types'

export const userApi = {
  // Получить всех пользователей
  getAll: (): Promise<User[]> => {
    return api.get('/users')
  },

  // Получить пользователя по ID
  getById: (id: number): Promise<User | null> => {
    return api.get(`/users/${id}`)
  },

  // Обновить пользователя
  update: (id: number, data: UpdateUserData): Promise<User> => {
    return api.patch(`/users/${id}`, data)
  },

  // Удалить пользователя
  delete: (id: number): Promise<User> => {
    return api.delete(`/users/${id}`)
  }
} 