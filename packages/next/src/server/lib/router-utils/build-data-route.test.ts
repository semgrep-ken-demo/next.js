import { buildDataRoute } from './build-data-route'

describe('buildDataRoute', () => {
  it('should build a dynamic data route', () => {
    const dataRoute = buildDataRoute('/[...slug]', '123')
    expect(dataRoute.dataRouteRegex).toBe('^/_next/data/123/(.+?)\\.json$')
    expect(dataRoute.namedDataRouteRegex).toBe(
      '^/_next/data/123/(?<nxtPslug>.+?)\\.json$'
    )
    expect(dataRoute.page).toBe('/[...slug]')
    expect(dataRoute.routeKeys).toEqual({ nxtPslug: 'nxtPslug' })
    expect(dataRoute.dataRouteRe).toBeInstanceOf(RegExp)
    expect(dataRoute.dataRouteRe.source).toBe(dataRoute.dataRouteRegex)
    expect(dataRoute.dataRouteI18nRe).toBeInstanceOf(RegExp)
    expect(dataRoute.dataRouteI18nRe.source).toBe(
      '^/_next/data/123/(?<nextLocale>[^/]+?)/(.+?)\\.json$'
    )
  })

  it('should build a static data route', () => {
    const dataRoute = buildDataRoute('/about', '123')
    expect(dataRoute.dataRouteRegex).toBe('^/_next/data/123/about\\.json$')
    expect(dataRoute.namedDataRouteRegex).toBeUndefined()
    expect(dataRoute.page).toBe('/about')
    expect(dataRoute.routeKeys).toBeUndefined()
    expect(dataRoute.dataRouteRe).toBeInstanceOf(RegExp)
    expect(dataRoute.dataRouteRe.source).toBe(dataRoute.dataRouteRegex)
    expect(dataRoute.dataRouteI18nRe).toBeInstanceOf(RegExp)
    expect(dataRoute.dataRouteI18nRe.source).toBe(
      '^/_next/data/123/(?<nextLocale>[^/]+?)/about\\.json$'
    )
  })
})
