/**
 * MCP tool for getting the path to the Next.js development log file.
 *
 * This tool returns the path to the {nextConfig.distDir}/logs/next-development.log file
 * that contains browser console logs and other development information.
 */
import type { McpServer } from 'next/dist/compiled/@modelcontextprotocol/sdk/server/mcp'
import { stat } from 'fs/promises'
import { join, resolve } from 'path'
import { mcpTelemetryTracker } from '../mcp-telemetry-tracker'

export function registerGetLogsTool(server: McpServer, distDir: string) {
  server.registerTool(
    'get_logs',
    {
      description:
        'Get the path to the Next.js development log file. Returns the file path so the agent can read the logs directly.',
    },
    async () => {
      // Track telemetry
      mcpTelemetryTracker.recordToolCall('mcp/get_logs')

      try {
        const resolvedDistDir = resolve(distDir)
        const logFilePath = join(resolvedDistDir, 'logs', 'next-development.log')

        if (!logFilePath.startsWith(resolvedDistDir)) {
          return {
            content: [
              {
                type: 'text' as const,
                text: JSON.stringify({
                  error: 'Invalid distDir path.',
                }),
              },
            ],
          }
        }

        // Check if the log file exists
        try {
          await stat(logFilePath)
        } catch (error) {
          return {
            content: [
              {
                type: 'text',
                text: JSON.stringify({
                  error: `Log file not found at ${logFilePath}.`,
                }),
              },
            ],
          }
        }

        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({
                logFilePath,
              }),
            },
          ],
        }
      } catch (error) {
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({
                error: `Error getting log file path: ${error instanceof Error ? error.message : String(error)}`,
              }),
            },
          ],
        }
      }
    }
  )
}
