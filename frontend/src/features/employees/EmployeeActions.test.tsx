import { screen, waitFor, within } from '@testing-library/react'
import { http, HttpResponse } from 'msw'
import { beforeEach, describe, expect, it } from 'vitest'
import { buildEmployee, buildEmployeeList } from '../../test/factories'
import { renderRoute } from '../../test/renderRoute'
import { server } from '../../test/server'

type Body = { employee: Record<string, unknown> }

const asha = buildEmployee({ id: 7, full_name: 'Asha Rao', email: 'asha@acme.example', salary: 1800000 })

describe('employee actions', () => {
  beforeEach(() => {
    server.use(http.get('/api/employees', () => HttpResponse.json(buildEmployeeList([asha]))))
  })

  it('adds an employee', async () => {
    let sent: Body | undefined
    server.use(
      http.post('/api/employees', async ({ request }) => {
        sent = (await request.json()) as Body
        return HttpResponse.json(buildEmployee({ id: 8, full_name: 'Ravi Kumar' }), { status: 201 })
      }),
    )
    const { user } = renderRoute('/employees')

    await user.click(await screen.findByRole('button', { name: /Add employee/ }))
    const form = await screen.findByRole('dialog')
    await user.type(within(form).getByLabelText('Full name'), 'Ravi Kumar')
    await user.type(within(form).getByLabelText('Email'), 'ravi@acme.example')
    await user.type(within(form).getByLabelText('Job title'), 'Data Analyst')
    await user.type(within(form).getByLabelText('Department'), 'Data')
    await user.click(within(form).getByLabelText('Country'))
    await user.click(await screen.findByTitle('India'))
    await user.type(within(form).getByLabelText('Salary'), '1200000')
    await user.click(within(form).getByRole('button', { name: 'Add employee' }))

    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument())
    expect(sent).toEqual({
      employee: {
        full_name: 'Ravi Kumar',
        email: 'ravi@acme.example',
        job_title: 'Data Analyst',
        department: 'Data',
        country_code: 'IN',
        salary: 1200000,
      },
    })
    expect(await screen.findByText('Employee added')).toBeInTheDocument()
  })

  it('checks required fields before sending', async () => {
    let posted = false
    server.use(http.post('/api/employees', () => {
      posted = true
      return HttpResponse.json({}, { status: 201 })
    }))
    const { user } = renderRoute('/employees')

    await user.click(await screen.findByRole('button', { name: /Add employee/ }))
    const form = await screen.findByRole('dialog')
    await user.click(within(form).getByRole('button', { name: 'Add employee' }))

    expect(await within(form).findByText('Please enter the full name')).toBeInTheDocument()
    expect(within(form).getByText('Please enter the salary')).toBeInTheDocument()
    expect(posted).toBe(false)
  })

  it('shows server validation errors next to the field', async () => {
    server.use(
      http.post('/api/employees', () =>
        HttpResponse.json({ errors: { email: ['has already been taken'] } }, { status: 422 }),
      ),
    )
    const { user } = renderRoute('/employees')

    await user.click(await screen.findByRole('button', { name: /Add employee/ }))
    const form = await screen.findByRole('dialog')
    await user.type(within(form).getByLabelText('Full name'), 'Asha Rao')
    await user.type(within(form).getByLabelText('Email'), 'asha@acme.example')
    await user.type(within(form).getByLabelText('Job title'), 'Engineer')
    await user.type(within(form).getByLabelText('Department'), 'Engineering')
    await user.click(within(form).getByLabelText('Country'))
    await user.click(await screen.findByTitle('India'))
    await user.type(within(form).getByLabelText('Salary'), '100')
    await user.click(within(form).getByRole('button', { name: 'Add employee' }))

    expect(await within(form).findByText('Email has already been taken')).toBeInTheDocument()
    expect(screen.getByRole('dialog')).toBeInTheDocument()
  })

  it('edits an employee', async () => {
    let sent: Body | undefined
    server.use(
      http.patch('/api/employees/7', async ({ request }) => {
        sent = (await request.json()) as Body
        return HttpResponse.json({ ...asha, salary: 2000000 })
      }),
    )
    const { user } = renderRoute('/employees')

    const row = await screen.findByRole('row', { name: /Asha Rao/ })
    await user.click(within(row).getByRole('button', { name: 'Edit' }))
    const form = await screen.findByRole('dialog')
    expect(within(form).getByText('Edit employee')).toBeInTheDocument()
    expect(within(form).getByLabelText('Full name')).toHaveValue('Asha Rao')
    const salary = within(form).getByLabelText('Salary')
    await user.clear(salary)
    await user.type(salary, '2000000')
    await user.click(within(form).getByRole('button', { name: 'Save changes' }))

    await waitFor(() => expect(sent?.employee.salary).toBe(2000000))
    expect(sent?.employee.email).toBe('asha@acme.example')
    expect(await screen.findByText('Changes saved')).toBeInTheDocument()
  })


  it('deletes an employee after confirmation', async () => {
    let deleted = false
    server.use(http.delete('/api/employees/7', () => {
      deleted = true
      return new HttpResponse(null, { status: 204 })
    }))
    const { user } = renderRoute('/employees')

    const row = await screen.findByRole('row', { name: /Asha Rao/ })
    await user.click(within(row).getByRole('button', { name: 'Delete' }))
    expect(deleted).toBe(false)
    await user.click(await screen.findByRole('button', { name: 'Delete employee' }))

    await waitFor(() => expect(deleted).toBe(true))
    expect(await screen.findByText('Asha Rao deleted')).toBeInTheDocument()
  })
})
