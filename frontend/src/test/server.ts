import { http, HttpResponse } from 'msw'
import { setupServer } from 'msw/node'
import { buildEmployeeList } from './factories'

export const server = setupServer(
  http.get('/api/employees', () => HttpResponse.json(buildEmployeeList([]))),
)
