import path from 'path'
import { pathToFileURL, fileURLToPath } from 'url'

/**
 * Converts a cache handler path to a filesystem path.
 * ESM's import.meta.resolve() returns file:// URLs which break when concatenated
 * with .next/ or used with path.join/path.relative.
 * @param filePath - Absolute path, relative path, or file:// URL (e.g. from import.meta.resolve)
 * @returns A filesystem path suitable for path operations
 */
export function resolveCacheHandlerPathToFilesystem(filePath: string): string {
  if (filePath.startsWith('file://')) {
    return fileURLToPath(filePath)
  }
  return filePath
}

/**
 * The path for a dynamic route must be URLs with a valid scheme.
 *
 * When an absolute Windows path is passed to it, it interprets the beginning of the path as a protocol (`C:`).
 * Therefore, it is important to always construct a complete path.
 * @param dir File directory
 * @param filePath Absolute or relative path, or file:// URL (e.g. from import.meta.resolve)
 */
export function validateRelativePath(userPath: string): string {
  const normalized = path.normalize(userPath)
  if (path.isAbsolute(normalized) || normalized.startsWith('..')) {
    throw new Error(
      `Path "${userPath}" must be relative and cannot traverse above its base directory`
    )
  }
  return normalized
}

export const formatDynamicImportPath = (dir: string, filePath: string) => {
  const resolvedFilePath = resolveCacheHandlerPathToFilesystem(filePath)

  let absoluteFilePath: string
  if (path.isAbsolute(resolvedFilePath)) {
    absoluteFilePath = resolvedFilePath
  } else {
    const safePath = validateRelativePath(resolvedFilePath)
    absoluteFilePath = path.normalize(dir + path.sep + safePath)
  }

  const formattedFilePath = pathToFileURL(absoluteFilePath).toString()

  return formattedFilePath
}
