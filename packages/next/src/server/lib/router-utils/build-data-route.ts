import path from '../../../shared/lib/isomorphic/path'
import { normalizePagePath } from '../../../shared/lib/page-path/normalize-page-path'
import { isDynamicRoute } from '../../../shared/lib/router/utils/is-dynamic'
import { getNamedRouteRegex } from '../../../shared/lib/router/utils/route-regex'
import { normalizeRouteRegex } from '../../../lib/load-custom-routes'
import { escapeStringRegexp } from '../../../shared/lib/escape-regexp'

export function buildDataRoute(page: string, buildId: string) {
  const pagePath = normalizePagePath(page)
  const dataRoute = path.posix.join('/_next/data', buildId, `${pagePath}.json`)

  let dataRouteRegex: string
  let dataRouteRe: RegExp
  let namedDataRouteRegex: string | undefined
  let routeKeys: { [named: string]: string } | undefined

  const escapedBuildId = escapeStringRegexp(buildId)

  if (isDynamicRoute(page)) {
    const routeRegex = getNamedRouteRegex(dataRoute, {
      prefixRouteKeys: true,
      includeSuffix: true,
      excludeOptionalTrailingSlash: true,
    })

    dataRouteRegex = normalizeRouteRegex(routeRegex.re.source)
    // nosemgrep: javascript.lang.security.audit.detect-non-literal-regexp.detect-non-literal-regexp
    dataRouteRe = new RegExp(dataRouteRegex)
    namedDataRouteRegex = routeRegex.namedRegex
    routeKeys = routeRegex.routeKeys
  } else {
    const re = new RegExp(
      `^${path.posix.join(
        '/_next/data',
        escapedBuildId,
        `${pagePath}\\.json`
      )}$`
    )
    dataRouteRegex = normalizeRouteRegex(re.source)
    // nosemgrep: javascript.lang.security.audit.detect-non-literal-regexp.detect-non-literal-regexp
    dataRouteRe = new RegExp(dataRouteRegex)
  }

  // Pre-compiled regex with i18n locale group inserted after the buildId segment
  // nosemgrep: javascript.lang.security.audit.detect-non-literal-regexp.detect-non-literal-regexp
  const dataRouteI18nRe = new RegExp(
    dataRouteRe.source.replace(
      `/${escapedBuildId}/`,
      `/${escapedBuildId}/(?<nextLocale>[^/]+?)/`
    )
  )

  return {
    page,
    routeKeys,
    dataRouteRegex,
    dataRouteRe,
    dataRouteI18nRe,
    namedDataRouteRegex,
  }
}
