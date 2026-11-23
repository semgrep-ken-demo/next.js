import {
  getBotType,
  HTML_LIMITED_BOT_UA_RE,
} from '../../shared/lib/router/utils/is-bot'
import type { BaseNextRequest } from '../base-http'

let cachedPattern: string | undefined
let cachedRegex: RegExp | undefined

function buildRegExp(pattern: string): RegExp {
  try {
    // nosemgrep: javascript.lang.security.audit.detect-non-literal-regexp.detect-non-literal-regexp
    return new RegExp(pattern, 'i')
  } catch {
    return HTML_LIMITED_BOT_UA_RE
  }
}

export function shouldServeStreamingMetadata(
  userAgent: string,
  htmlLimitedBots: string | undefined
): boolean {
  if (!htmlLimitedBots) {
    if (userAgent && HTML_LIMITED_BOT_UA_RE.test(userAgent)) {
      return false
    }
    return true
  }
  if (cachedPattern !== htmlLimitedBots) {
    cachedPattern = htmlLimitedBots
    cachedRegex = buildRegExp(htmlLimitedBots)
  }
  // Only block metadata for HTML-limited bots
  if (userAgent && cachedRegex!.test(userAgent)) {
    return false
  }
  return true
}

// When the request UA is a html-limited bot, we should do a dynamic render.
// In this case, postpone state is not sent.
export function isHtmlBotRequest(req: {
  headers: BaseNextRequest['headers']
}): boolean {
  const ua = req.headers['user-agent'] || ''
  const botType = getBotType(ua)

  return botType === 'html'
}
