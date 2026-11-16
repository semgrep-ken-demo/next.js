import fs from 'fs'
import path from 'path'

export function findDir(dir: string, name: 'pages' | 'app'): string | null {
  const resolvedDir = path.resolve(dir)

  // prioritize ./${name} over ./src/${name}
  let curDir = path.resolve(resolvedDir, name)
  if (!curDir.startsWith(resolvedDir + path.sep)) return null
  if (fs.existsSync(curDir)) return curDir

  curDir = path.resolve(resolvedDir, 'src', name)
  if (!curDir.startsWith(resolvedDir + path.sep)) return null
  if (fs.existsSync(curDir)) return curDir

  return null
}

export function findPagesDir(dir: string): {
  pagesDir: string | undefined
  appDir: string | undefined
} {
  const pagesDir = findDir(dir, 'pages') || undefined
  const appDir = findDir(dir, 'app') || undefined

  if (appDir == null && pagesDir == null) {
    throw new Error(
      "> Couldn't find any `pages` or `app` directory. Please create one under the project root"
    )
  }

  if (pagesDir && appDir) {
    const pagesParent = path.dirname(pagesDir)
    const appParent = path.dirname(appDir)
    if (pagesParent !== appParent) {
      throw new Error(
        '> `pages` and `app` directories should be under the same folder'
      )
    }
  }

  return {
    pagesDir,
    appDir,
  }
}
