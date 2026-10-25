import { screen, within } from '@testing-library/react'
import { http, HttpResponse } from 'msw'
import { describe, expect, it } from 'vitest'
import { buildEmployee, buildEmployeeList } from '../../test/factories'
import { renderRoute } from '../../test/renderRoute'
import { server } from '../../test/server'

function servePages(totalPages: number) {
  server.use(
    http.get('/api/employees', ({ request }) => {
      const page = Number(new URL(request.url).searchParams.get('page'))
      const employees = page <= totalPages ? [buildEmployee({ id: page, full_name: `Employee on page ${page}` })] : []

      return HttpResponse.json(buildEmployeeList(employees, { page, total_count: totalPages * 25, total_pages: totalPages }))
    }),
  )
}

describe('EmployeesPage', () => {
  it('lists employees with their salary in local currency', async () => {
    server.use(
      http.get('/api/employees', () =>
        HttpResponse.json(
          buildEmployeeList([
            buildEmployee({ id: 1, full_name: 'Asha Rao', job_title: 'Software Engineer', salary: 1800000, currency: 'INR' }),
            buildEmployee({ id: 2, full_name: 'James Smith', country_code: 'US', salary: 91728, currency: 'USD' }),
          ]),
        ),
      ),
    )

    renderRoute('/employees')

    const ashaRow = await screen.findByRole('row', { name: /Asha Rao/ })
    expect(within(ashaRow).getByText('Software Engineer')).toBeInTheDocument()
    expect(within(ashaRow).getByText('₹1,800,000')).toBeInTheDocument()
    expect(screen.getByRole('row', { name: /James Smith/ })).toHaveTextContent('$91,728')
  })

  it('shows how many employees there are in total', async () => {
    server.use(
      http.get('/api/employees', () => HttpResponse.json(buildEmployeeList([buildEmployee()], { total_count: 10000 }))),
    )

    renderRoute('/employees')

    expect(await screen.findByText('10,000 employees')).toBeInTheDocument()
  })

  it('loads the next page when paging forward', async () => {
    servePages(2)
    const { user, router } = renderRoute('/employees')
    await screen.findByText('Employee on page 1')

    await user.click(screen.getByTitle('2'))

    expect(await screen.findByText('Employee on page 2')).toBeInTheDocument()
    expect(router.state.location.search).toBe('?page=2')
  })

  it('opens the page given in the address', async () => {
    servePages(3)

    renderRoute('/employees?page=3')

    expect(await screen.findByText('Employee on page 3')).toBeInTheDocument()
  })

  it('moves to the last page when the address points past the end', async () => {
    servePages(2)

    const { router } = renderRoute('/employees?page=9')

    expect(await screen.findByText('Employee on page 2')).toBeInTheDocument()
    expect(router.state.location.search).toBe('?page=2')
  })

  it('explains when the list cannot be loaded', async () => {
    server.use(http.get('/api/employees', () => new HttpResponse(null, { status: 500 })))

    renderRoute('/employees')

    expect(await screen.findByText('Could not load employees')).toBeInTheDocument()
  })
})
