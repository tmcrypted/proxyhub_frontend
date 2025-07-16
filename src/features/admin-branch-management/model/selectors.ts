import { useBranchStore } from './store'

export const useBranches = () => useBranchStore((state) => state.branches)
export const useLoading = () => useBranchStore((state) => state.loading)
export const useError = () => useBranchStore((state) => state.error)