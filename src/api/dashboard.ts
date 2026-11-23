import { request } from './request'
import type { ChartData, DashboardStats } from '@/types'

export function fetchStats(): Promise<DashboardStats> {
  return request<DashboardStats>({ url: '/dashboard/stats', method: 'get' })
}

export function fetchCharts(): Promise<ChartData> {
  return request<ChartData>({ url: '/charts/overview', method: 'get' })
}
