import { http, HttpResponse } from 'msw'
import { setupServer } from 'msw/node'
import { buildCountryInsights, buildEmployeeList, buildFilterOptions, buildOverview } from './factories'

export const server = setupServer(
  http.get('/api/employees', () => HttpResponse.json(buildEmployeeList([]))),
  http.get('/api/filter_options', () => HttpResponse.json(buildFilterOptions())),
  http.get('/api/insights/overview', () => HttpResponse.json(buildOverview())),
  http.get('/api/insights/countries/:code', () => HttpResponse.json(buildCountryInsights())),
)
