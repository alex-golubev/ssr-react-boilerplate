import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'
import { readdir, readFile } from 'node:fs/promises'
import express from 'express'
import { createServer as createViteServer } from 'vite'
import compression from 'compression'
import serveStatic from 'serve-static'
import type { NextFunction, Request, Response } from 'express'

const isTest = (process.env.NODE_ENV === 'test') || !(process.env.VITE_TEST_BUILD === undefined)

const filename = fileURLToPath(import.meta.url)
const directory = dirname(filename)

const resolvePath = (dir: string): string => resolve(directory, dir)

/**
 * Retrieves stylesheets from the public directory and returns them as a string.
 * @async
 * @function getStyleSheets
 * @returns {Promise<string>} - A Promise that resolves to a string containing all the stylesheets.
 * @throws {Error} - If any error occurs during the process.
 */
const getStyleSheets = async (): Promise<string> => {
  try {
    const assetPath = resolvePath('public')
    const files: string[] = await readdir(assetPath)
    const cssAssets: string[] = files.filter(f => f.endsWith('.css'))
    const allContent: string[] = []
    for (const file of cssAssets) {
      const content: string = await readFile(resolve(assetPath, file), 'utf8')
      allContent.push(`<style>${content}</style>`)
    }
    return allContent.join('\n')
  } catch {
    return ''
  }
}

/**
 * Create an express server instance with Vite integration.
 * @param {boolean} [isProduction=true] - Indicates whether the server is in production mode
 * @return {Promise<void>}
 */
async function createServer (isProduction: boolean = process.env.NODE_ENV === 'production'): Promise<void> {
  const app = express()

  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: 'custom',
    logLevel: isTest ? 'error' : 'info',
    root: isProduction ? 'dist' : '',
    optimizeDeps: { include: [] }
  })

  app.use(vite.middlewares)
  const assetsDir = resolvePath('public')
  const requestHandler = express.static(assetsDir)
  app.use('/public', requestHandler)

  if (isProduction) {
    app.use(compression())
    app.use(
      serveStatic(resolvePath('client'), {
        index: false
      })
    )
  }

  const baseTemplatePath = isProduction ? resolvePath('client/index.html') : resolvePath('index.html')
  const baseTemplate = await readFile(baseTemplatePath, 'utf8')
  const productionBuildPath = resolve(directory, 'server/entry-server.js')
  const developmentBuildPath = resolve(directory, 'src/client/entry-server.tsx')
  const buildMode = isProduction ? productionBuildPath : developmentBuildPath
  const { render } = await vite.ssrLoadModule(buildMode)

  app.use('*', (req: Request, res: Response, next: NextFunction) => {
    const url = req.originalUrl

    const performAsyncTasks = async (): Promise<void> => {
      try {
        const template = await vite.transformIndexHtml(url, baseTemplate)
        const renderedHtml: string = await render(url)
        const css = await getStyleSheets()
        const html = template.replace('<!--app-html-->', renderedHtml).replace('<!--head-->', css)
        res.status(200).set('Content-Type', 'text/html').end(html)
      } catch (e: unknown) {
        !isProduction && vite.ssrFixStacktrace(e as Error)
        console.error((e as Error).stack)
        vite.ssrFixStacktrace(e as Error)
        next(e)
      }
    }
    void performAsyncTasks()
  })

  const port = process.env.PORT ?? 3000
  app.listen(Number(port), '0.0.0.0', () => {
    console.log(`Server running at http://localhost:${port}`)
  })
}

void createServer()
