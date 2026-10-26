import { buildDataRoute } from './build-data-route'

describe('buildDataRoute', () => {
  it('should build a dynamic data route', () => {
    const dataRoute = buildDataRoute('/[...slug]', '123')
    expect(dataRoute.page).toBe('/[...slug]')
    expect(dataRoute.dataRouteRegex).toBe('^/_next/data/123/(.+?)\\.json$')
    expect(dataRoute.namedDataRouteRegex).toBe(
      '^/_next/data/123/(?<nxtPslug>.+?)\\.json$'
    )
    expect(dataRoute.routeKeys).toEqual({ nxtPslug: 'nxtPslug' })
    expect(dataRoute.dataRouteRe).toBeInstanceOf(RegExp)
    expect(dataRoute.dataRouteRe.test('/_next/data/123/foo/bar.json')).toBe(
      true
    )
    expect(dataRoute.i18nDataRouteRe).toBeInstanceOf(RegExp)
    expect(
      dataRoute.i18nDataRouteRe.test('/_next/data/123/en/foo/bar.json')
    ).toBe(true)
  })

  it('should build a static data route', () => {
    const dataRoute = buildDataRoute('/about', '123')
    expect(dataRoute.page).toBe('/about')
    expect(dataRoute.dataRouteRegex).toBe('^/_next/data/123/about\\.json$')
    expect(dataRoute.namedDataRouteRegex).toBeUndefined()
    expect(dataRoute.routeKeys).toBeUndefined()
    expect(dataRoute.dataRouteRe).toBeInstanceOf(RegExp)
    expect(dataRoute.dataRouteRe.test('/_next/data/123/about.json')).toBe(true)
    expect(dataRoute.i18nDataRouteRe).toBeInstanceOf(RegExp)
    expect(
      dataRoute.i18nDataRouteRe.test('/_next/data/123/en/about.json')
    ).toBe(true)
  })
})
