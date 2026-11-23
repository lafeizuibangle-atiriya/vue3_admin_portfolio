import type { ApiResult } from '../src/types'
import { db } from './db'

export interface MockResponse {
  status: number
  data: ApiResult<unknown>
}

function ok<T>(data: T, message = 'success'): MockResponse {
  return { status: 200, data: { code: 0, message, data } }
}

function fail(status: number, message: string): MockResponse {
  return { status, data: { code: status, message, data: null } }
}

function toNumber(value: unknown, fallback: number): number {
  const parsed = Number(value)
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback
}

export function mockRequest(
  method: string,
  path: string,
  body: Record<string, unknown> = {},
  query: Record<string, unknown> = {}
): MockResponse {
  const verb = method.toUpperCase()

  if (path === '/auth/login' && verb === 'POST') {
    const username = String(body.username ?? '')
    const password = String(body.password ?? '')
    if (username === 'admin' && password === '123456') {
      return ok({ token: 'mock-token-admin', userInfo: { name: '系统管理员', role: '超级管理员' } })
    }
    return fail(401, '账号或密码错误，演示账号：admin / 123456')
  }

  if (path === '/auth/profile' && verb === 'GET') {
    return ok({ name: '系统管理员', role: '超级管理员' })
  }

  if (path === '/users' && verb === 'GET') {
    const page = toNumber(query.page, 1)
    const pageSize = toNumber(query.pageSize, 10)
    const keyword = String(query.keyword ?? '')
    const status = query.status === undefined || query.status === '' || query.status === null
      ? undefined
      : Number(query.status)
    return ok(db.listUsers(keyword, status, page, pageSize))
  }

  if (path === '/users' && verb === 'POST') {
    return ok(db.createUser(body), '新增成功')
  }

  const idMatch = path.match(/^\/users\/(\d+)$/)
  if (idMatch) {
    const id = Number(idMatch[1])
    if (verb === 'PUT') {
      const updated = db.updateUser(id, body)
      return updated ? ok(updated, '更新成功') : fail(404, '用户不存在')
    }
    if (verb === 'DELETE') {
      return db.deleteUser(id) ? ok(null, '删除成功') : fail(404, '用户不存在')
    }
  }

  if (path === '/dashboard/stats' && verb === 'GET') {
    return ok(db.stats())
  }

  if (path === '/charts/overview' && verb === 'GET') {
    return ok(db.charts())
  }

  return fail(404, `未找到接口：${verb} ${path}`)
}
