import { request } from './request'
import type { PageResult, UserItem } from '@/types'

export interface UserQuery {
  page: number
  pageSize: number
  keyword?: string
  status?: number | null
}

export function fetchUsers(params: UserQuery): Promise<PageResult<UserItem>> {
  return request<PageResult<UserItem>>({ url: '/users', method: 'get', params })
}

export function createUser(data: Partial<UserItem>): Promise<UserItem> {
  return request<UserItem>({ url: '/users', method: 'post', data })
}

export function updateUser(id: number, data: Partial<UserItem>): Promise<UserItem> {
  return request<UserItem>({ url: `/users/${id}`, method: 'put', data })
}

export function deleteUser(id: number): Promise<null> {
  return request<null>({ url: `/users/${id}`, method: 'delete' })
}
