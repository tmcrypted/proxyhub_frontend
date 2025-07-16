export interface Branch {
  id: number
  comment?: string
  createdAt: string
  updatedAt: string
}

export interface CreateBranchData {
  comment?: string
}

export interface UpdateBranchData {
  comment?: string
} 