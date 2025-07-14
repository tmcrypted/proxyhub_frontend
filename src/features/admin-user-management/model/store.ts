import { create } from 'zustand'
import { userApi } from '../api/userApi'
import type { User, UpdateUserData } from './types'

interface UserState {
  // State
  users: User[]
  loading: boolean
  error: string | null
  
  // Actions
  fetchUsers: () => Promise<void>
  updateUser: (id: number, data: UpdateUserData) => Promise<void>
  deleteUser: (id: number) => Promise<void>
  clearError: () => void
}

export const useUserStore = create<UserState>((set, get) => ({
  // Initial state
  users: [],
  loading: false,
  error: null,

  // Actions
  fetchUsers: async () => {
    try {
      set({ loading: true, error: null })
      const data = await userApi.getAll()
      set({ users: data, loading: false })
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch users'
      set({ error: errorMessage, loading: false })
      console.error('Error fetching users:', error)
    }
  },

  updateUser: async (id: number, data: UpdateUserData) => {
    try {
      set({ loading: true, error: null })
      await userApi.update(id, data)
      await get().fetchUsers()
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update user'
      set({ error: errorMessage, loading: false })
      console.error('Error updating user:', error)
      throw error
    }
  },

  deleteUser: async (id: number) => {
    try {
      set({ loading: true, error: null })
      await userApi.delete(id)
      await get().fetchUsers()
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete user'
      set({ error: errorMessage, loading: false })
      console.error('Error deleting user:', error)
      throw error
    }
  },

  clearError: () => {
    set({ error: null })
  }
})) 