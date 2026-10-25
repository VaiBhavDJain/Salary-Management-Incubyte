import { screen, waitFor, within } from '@testing-library/react'
import { http, HttpResponse } from 'msw'
import { describe, expect, it } from 'vitest'
import { buildEmployee, buildEmployeeList } from '../../test/factories'
import { renderRoute } from '../../test/renderRoute'
import { server } from '../../test/server'

function recordEmployeeRequests() {
  const requests: URLSearchParams[] = []
  server.use(
    http.get('/api/employees', ({ request }) => {
      requests.push(new URL(request.url).searchParams)
      return HttpResponse.json(buildEmployeeList([buildEmployee()], { total_count: 125, total_pages: 5 }))
    }),
  )
  return {
    some: (expected: Record<string, string>) =>
      requests.some((params) => Object.entries(expected).every(([key, value]) => params.get(key) === value)),
  }
}

describe('employee list controls', () => {
  it('shows country names instead of codes', async () => {
    recordEmployeeRequests()
    renderRoute('/employees')

    const row = await screen.findByRole('row', { name: /Asha Rao/ })
    expect(await within(row).findByText('India')).toBeInTheDocument()
  })

  it('searches by name or email and starts again from page 1', async () => {
    const requests = recordEmployeeRequests()
    const { user, router } = renderRoute('/employees?page=3')

    await user.type(await screen.findByRole('searchbox', { name: 'Search employees' }), 'asha')

    await waitFor(() => expect(requests.some({ q: 'asha', page: '1' })).toBe(true))
    expect(router.state.location.search).toBe('?q=asha')
  })

  it('filters by country', async () => {
    const requests = recordEmployeeRequests()
    const { user } = renderRoute('/employees')

    await user.click(await screen.findByRole('combobox', { name: 'Country' }))
    await user.click(await screen.findByTitle('India'))

    await waitFor(() => expect(requests.some({ country_code: 'IN', page: '1' })).toBe(true))
  })

  it('restores search and filters from the address', async () => {
    const requests = recordEmployeeRequests()

    renderRoute('/employees?q=rao&department=Sales')

    await waitFor(() => expect(requests.some({ q: 'rao', department: 'Sales' })).toBe(true))
    expect(await screen.findByRole('searchbox', { name: 'Search employees' })).toHaveValue('rao')
  })

  it('clears search and filters', async () => {
    const { user, router } = renderRoute('/employees?q=rao&country_code=IN')

    await user.click(await screen.findByRole('button', { name: 'Clear filters' }))

    await waitFor(() => expect(router.state.location.search).toBe(''))
    expect(screen.getByRole('searchbox', { name: 'Search employees' })).toHaveValue('')
  })

  it('sorts by salary, highest first', async () => {
    const requests = recordEmployeeRequests()
    const { user } = renderRoute('/employees')

    await user.click(await screen.findByRole('columnheader', { name: /Salary/ }))

    await waitFor(() => expect(requests.some({ sort: 'salary', direction: 'desc', page: '1' })).toBe(true))
  })

  it('suggests a country filter when salaries in different currencies are sorted together', async () => {
    const { user } = renderRoute('/employees?sort=salary&direction=desc')

    expect(await screen.findByText(/local currency/)).toBeInTheDocument()

    await user.click(screen.getByRole('combobox', { name: 'Country' }))
    await user.click(await screen.findByTitle('India'))

    await waitFor(() => expect(screen.queryByText(/local currency/)).not.toBeInTheDocument())
  })
})
