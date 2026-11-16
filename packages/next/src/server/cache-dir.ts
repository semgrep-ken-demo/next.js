import path from 'path'
import isDockerFunction from 'next/dist/compiled/is-docker'

export function getStorageDirectory(distDir: string): string | undefined {
  const isLikelyEphemeral = isDockerFunction()

  if (isLikelyEphemeral) {
    return undefined
  }

  const resolvedBase = path.resolve(distDir)
  const cachePath = path.join(resolvedBase, 'cache')

  if (!cachePath.startsWith(resolvedBase + path.sep)) {
    return undefined
  }

  return cachePath
}
