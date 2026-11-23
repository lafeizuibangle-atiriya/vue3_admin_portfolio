export interface ApiResult<T = unknown> {
  code: number
  message: string
  data: T
}

export interface UserItem {
  id: number
  username: string
  name: string
  email: string
  phone: string
  role: string
  status: 0 | 1
  createdAt: string
}

export interface PageResult<T> {
  list: T[]
  total: number
  page: number
  pageSize: number
}

export interface LoginResult {
  token: string
  userInfo: {
    name: string
    role: string
  }
}

export interface DashboardStats {
  users: number
  orders: number
  sales: number
  growth: number
}

export interface ChartData {
  line: { categories: string[]; values: number[] }
  bar: { categories: string[]; values: number[] }
  pie: { name: string; value: number }[]
}
