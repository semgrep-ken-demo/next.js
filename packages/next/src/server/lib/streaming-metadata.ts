import {
  getBotType,
  HTML_LIMITED_BOT_UA_RE,
  HTML_LIMITED_BOT_UA_RE_STRING,
} from '../../shared/lib/router/utils/is-bot'
import type { BaseNextRequest } from '../base-http'

let cachedPattern: string | undefined
let cachedRegex: RegExp | undefined

export function shouldServeStreamingMetadata(
  userAgent: string,
  htmlLimitedBots: string | undefined
): boolean {
  const pattern = htmlLimitedBots || HTML_LIMITED_BOT_UA_RE_STRING
  if (cachedPattern !== pattern) {
    cachedPattern = pattern
    if (!htmlLimitedBots) {
      cachedRegex = HTML_LIMITED_BOT_UA_RE
    } else {
      try {
        // htmlLimitedBots is developer-controlled via next.config.js, not end-user input.
        // nosemgrep: javascript.lang.security.audit.detect-non-literal-regexp.detect-non-literal-regexp
        cachedRegex = new RegExp(htmlLimitedBots, 'i')
      } catch {
        cachedPattern = HTML_LIMITED_BOT_UA_RE_STRING
        cachedRegex = HTML_LIMITED_BOT_UA_RE
      }
    }
  }
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
