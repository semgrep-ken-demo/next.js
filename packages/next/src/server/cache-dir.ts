import path from 'path'
import isDockerFunction from 'next/dist/compiled/is-docker'

export function getStorageDirectory(distDir: string): string | undefined {
  const isLikelyEphemeral = isDockerFunction()

  if (isLikelyEphemeral) {
    return undefined
  }
  const resolvedDistDir = path.resolve(distDir)
  const cacheDir = path.join(resolvedDistDir, 'cache')
  if (!cacheDir.startsWith(resolvedDistDir + path.sep)) {
    return undefined
  }
  return cacheDir
}
