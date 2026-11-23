import type { Plugin } from 'vite'
import { mockRequest } from './handlers'

export function mockServer(): Plugin {
  return {
    name: 'local-mock-api',
    configureServer(server) {
      server.middlewares.use('/api', (req, res) => {
        const rawUrl = req.url || '/'
        const [path, search = ''] = rawUrl.split('?')
        const query = Object.fromEntries(new URLSearchParams(search))
        const method = req.method || 'GET'
        let raw = ''

        req.on('data', (chunk) => {
          raw += String(chunk)
        })

        req.on('end', () => {
          let body: Record<string, unknown> = {}
          if (raw) {
            try {
              body = JSON.parse(raw) as Record<string, unknown>
            } catch {
              body = {}
            }
          }
          const result = mockRequest(method, path, body, query)
          setTimeout(() => {
            res.statusCode = result.status
            res.setHeader('Content-Type', 'application/json; charset=utf-8')
            res.end(JSON.stringify(result.data))
          }, 180)
        })
      })
    }
  }
}
