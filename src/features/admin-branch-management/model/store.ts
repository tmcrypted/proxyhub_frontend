import { create } from 'zustand'
import { branchApi } from '../api/branchApi'
import type { Branch, CreateBranchData, UpdateBranchData } from './types'

interface BranchState {
  // State
  branches: Branch[]
  loading: boolean
  error: string | null
  
  // Actions
  fetchBranches: () => Promise<void>
  createBranch: (data: CreateBranchData) => Promise<void>
  updateBranch: (id: number, data: UpdateBranchData) => Promise<void>
  deleteBranch: (id: number) => Promise<void>
  clearError: () => void
}

export const useBranchStore = create<BranchState>((set, get) => ({
  // Initial state
  branches: [],
  loading: false,
  error: null,

  // Actions
  fetchBranches: async () => {
    try {
      set({ loading: true, error: null })
      const data = await branchApi.getAll()
      set({ branches: data, loading: false })
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch branches'
      set({ error: errorMessage, loading: false })
      console.error('Error fetching branches:', error)
    }
  },

  createBranch: async (data: CreateBranchData) => {
    try {
      set({ loading: true, error: null })
      await branchApi.create(data)
      await get().fetchBranches()
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to create branch'
      set({ error: errorMessage, loading: false })
      console.error('Error creating branch:', error)
      throw error
    }
  },

  updateBranch: async (id: number, data: UpdateBranchData) => {
    try {
      set({ loading: true, error: null })
      await branchApi.update(id, data)
      await get().fetchBranches()
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update branch'
      set({ error: errorMessage, loading: false })
      console.error('Error updating branch:', error)
      throw error
    }
  },

  deleteBranch: async (id: number) => {
    try {
      set({ loading: true, error: null })
      await branchApi.delete(id)
      await get().fetchBranches()
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete branch'
      set({ error: errorMessage, loading: false })
      console.error('Error deleting branch:', error)
      throw error
    }
  },

  clearError: () => {
    set({ error: null })
  }
})) 