import {
  getBotType,
  HTML_LIMITED_BOT_UA_RE,
} from '../../shared/lib/router/utils/is-bot'
import type { BaseNextRequest } from '../base-http'

let cachedPattern: string | undefined
let cachedRegex: RegExp | undefined

export function getHtmlLimitedBotsRegex(
  htmlLimitedBots: string | undefined
): RegExp {
  if (!htmlLimitedBots) {
    return HTML_LIMITED_BOT_UA_RE
  }
  if (cachedPattern !== htmlLimitedBots) {
    cachedPattern = htmlLimitedBots
    cachedRegex = new RegExp(htmlLimitedBots, 'i') // nosemgrep: javascript.lang.security.audit.detect-non-literal-regexp.detect-non-literal-regexp
  }
  return cachedRegex!
}

export function shouldServeStreamingMetadata(
  userAgent: string,
  htmlLimitedBotsRegex: RegExp
): boolean {
  if (userAgent && htmlLimitedBotsRegex.test(userAgent)) {
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
