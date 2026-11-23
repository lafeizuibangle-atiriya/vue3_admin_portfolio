import type { Router } from 'vue-router'
import { getToken } from '@/utils/auth'

const whiteList = ['/login']

export function setupPermission(router: Router): void {
  router.beforeEach((to, _from, next) => {
    const hasToken = Boolean(getToken())

    if (hasToken) {
      if (to.path === '/login') {
        next({ path: '/' })
      } else {
        next()
      }
      return
    }

    if (whiteList.includes(to.path)) {
      next()
    } else {
      next({ path: '/login', query: { redirect: to.fullPath } })
    }
  })

  router.afterEach((to) => {
    const title = to.meta.title as string | undefined
    document.title = title ? `${title} · Vue3 Admin` : 'Vue3 Admin · 后台管理系统'
  })
}
