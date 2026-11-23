import type { ChartData, DashboardStats, UserItem } from '../src/types'

let users: UserItem[] = [
  { id: 1, username: 'admin', name: '系统管理员', email: 'admin@example.com', phone: '13800000001', role: '超级管理员', status: 1, createdAt: '2026-01-12' },
  { id: 2, username: 'lisi', name: '李四', email: 'lisi@example.com', phone: '13800000002', role: '编辑', status: 1, createdAt: '2026-02-03' },
  { id: 3, username: 'wangwu', name: '王五', email: 'wangwu@example.com', phone: '13800000003', role: '访客', status: 0, createdAt: '2026-02-18' },
  { id: 4, username: 'zhaoliu', name: '赵六', email: 'zhaoliu@example.com', phone: '13800000004', role: '编辑', status: 1, createdAt: '2026-03-06' },
  { id: 5, username: 'sunqi', name: '孙七', email: 'sunqi@example.com', phone: '13800000005', role: '访客', status: 1, createdAt: '2026-03-21' },
  { id: 6, username: 'zhouba', name: '周八', email: 'zhouba@example.com', phone: '13800000006', role: '编辑', status: 0, createdAt: '2026-04-02' },
  { id: 7, username: 'wujiu', name: '吴九', email: 'wujiu@example.com', phone: '13800000007', role: '访客', status: 1, createdAt: '2026-04-15' },
  { id: 8, username: 'zhengshi', name: '郑十', email: 'zhengshi@example.com', phone: '13800000008', role: '编辑', status: 1, createdAt: '2026-05-08' },
  { id: 9, username: 'qianyi', name: '钱一', email: 'qianyi@example.com', phone: '13800000009', role: '访客', status: 0, createdAt: '2026-05-19' },
  { id: 10, username: 'konger', name: '孔二', email: 'konger@example.com', phone: '13800000010', role: '编辑', status: 1, createdAt: '2026-06-01' },
  { id: 11, username: 'caosan', name: '曹三', email: 'caosan@example.com', phone: '13800000011', role: '访客', status: 1, createdAt: '2026-06-14' },
  { id: 12, username: 'yansi', name: '严四', email: 'yansi@example.com', phone: '13800000012', role: '编辑', status: 1, createdAt: '2026-07-02' }
]

let nextId = users.length + 1

function today(): string {
  const now = new Date()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  return `${now.getFullYear()}-${month}-${day}`
}

export const db = {
  listUsers(keyword: string, status: number | undefined, page: number, pageSize: number) {
    const kw = keyword.trim().toLowerCase()
    const filtered = users.filter((item) => {
      const matchKeyword = !kw || [item.username, item.name, item.email, item.phone].some((v) => v.toLowerCase().includes(kw))
      const matchStatus = status === undefined || status === null || item.status === status
      return matchKeyword && matchStatus
    })
    const start = (page - 1) * pageSize
    return {
      list: filtered.slice(start, start + pageSize),
      total: filtered.length,
      page,
      pageSize
    }
  },

  findUser(id: number) {
    return users.find((item) => item.id === id)
  },

  createUser(payload: Partial<UserItem>): UserItem {
    const created: UserItem = {
      id: nextId++,
      username: payload.username || `user${nextId - 1}`,
      name: payload.name || '未命名',
      email: payload.email || '',
      phone: payload.phone || '',
      role: payload.role || '访客',
      status: payload.status === 0 ? 0 : 1,
      createdAt: today()
    }
    users.unshift(created)
    return created
  },

  updateUser(id: number, payload: Partial<UserItem>): UserItem | undefined {
    const target = db.findUser(id)
    if (!target) return undefined
    Object.assign(target, payload)
    target.id = id
    return target
  },

  deleteUser(id: number): boolean {
    const index = users.findIndex((item) => item.id === id)
    if (index < 0) return false
    users.splice(index, 1)
    return true
  },

  stats(): DashboardStats {
    return {
      users: users.length,
      orders: 1286,
      sales: 86420,
      growth: 12.8
    }
  },

  charts(): ChartData {
    return {
      line: {
        categories: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
        values: [820, 932, 901, 1340, 1130, 1520, 1420]
      },
      bar: {
        categories: ['手机', '平板', '手表', '音箱', '灯光', '门锁'],
        values: [320, 240, 180, 275, 410, 195]
      },
      pie: [
        { name: '直接访问', value: 335 },
        { name: '搜索引擎', value: 486 },
        { name: '社交推荐', value: 298 },
        { name: '其他来源', value: 154 }
      ]
    }
  }
}
