import { http, HttpResponse } from 'msw'
import { setupServer } from 'msw/node'
import { buildEmployeeList, buildFilterOptions } from './factories'

export const server = setupServer(
  http.get('/api/employees', () => HttpResponse.json(buildEmployeeList([]))),
  http.get('/api/filter_options', () => HttpResponse.json(buildFilterOptions())),
)
