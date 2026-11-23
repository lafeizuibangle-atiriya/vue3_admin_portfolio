import axios, { type AxiosAdapter, type AxiosRequestConfig, type InternalAxiosRequestConfig } from 'axios'
import { ElMessage } from 'element-plus'
import router from '@/router'
import { getToken, removeToken } from '@/utils/auth'
import { mockRequest } from '../../mock/handlers'

interface BackendResult {
  code: number
  message: string
  data: unknown
}

const service = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 10000
})

const useBrowserMock = import.meta.env.PROD && import.meta.env.VITE_USE_MOCK === 'true'

if (useBrowserMock) {
  const browserAdapter: AxiosAdapter = async (config) => {
    const method = (config.method || 'get').toUpperCase()
    const base = import.meta.env.VITE_API_BASE_URL || ''
    let path = config.url || ''
    if (base && path.startsWith(base)) path = path.slice(base.length)

    let body: Record<string, unknown> = {}
    if (config.data) {
      try {
        body = typeof config.data === 'string'
          ? JSON.parse(config.data) as Record<string, unknown>
          : config.data as Record<string, unknown>
      } catch {
        body = {}
      }
    }

    const result = mockRequest(method, path, body, (config.params || {}) as Record<string, unknown>)
    await new Promise((resolve) => setTimeout(resolve, 180))
    return {
      data: result.data,
      status: result.status,
      statusText: '',
      headers: {} as never,
      config
    }
  }
  service.defaults.adapter = browserAdapter
}

service.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = getToken()
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

service.interceptors.response.use(
  (response) => {
    const result = response.data as BackendResult
    if (result.code === 0) return result.data as never

    if (result.code === 401 || response.status === 401) {
      removeToken()
      void router.push('/login')
    }
    const message = result.message || '请求失败'
    ElMessage.error(message)
    return Promise.reject(new Error(message))
  },
  (error) => {
    const status = error.response?.status as number | undefined
    if (status === 401) {
      removeToken()
      void router.push('/login')
    }
    const message = error.response?.data?.message || error.message || '网络异常'
    ElMessage.error(message)
    return Promise.reject(error)
  }
)

export function request<T>(config: AxiosRequestConfig): Promise<T> {
  return service.request(config) as unknown as Promise<T>
}

export default service
