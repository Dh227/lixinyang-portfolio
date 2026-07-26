import { mkdir, writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'

const serverDirectory = resolve('dist/server')
const workerEntry = resolve(serverDirectory, 'index.js')

const workerSource = `const worker = {
  async fetch(request, env) {
    const response = await env.ASSETS.fetch(request)

    if (response.status !== 404 || request.method !== 'GET') {
      return response
    }

    const acceptsHtml = request.headers.get('accept')?.includes('text/html')
    if (!acceptsHtml) {
      return response
    }

    const indexRequest = new Request(new URL('/index.html', request.url), request)
    return env.ASSETS.fetch(indexRequest)
  },
}

export default worker
`

await mkdir(serverDirectory, { recursive: true })
await writeFile(workerEntry, workerSource)
