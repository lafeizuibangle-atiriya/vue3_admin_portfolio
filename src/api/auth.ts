import { request } from './request'
import type { LoginResult } from '@/types'

export function login(data: { username: string; password: string }): Promise<LoginResult> {
  return request<LoginResult>({ url: '/auth/login', method: 'post', data })
}

export function getProfile(): Promise<{ name: string; role: string }> {
  return request<{ name: string; role: string }>({ url: '/auth/profile', method: 'get' })
}
