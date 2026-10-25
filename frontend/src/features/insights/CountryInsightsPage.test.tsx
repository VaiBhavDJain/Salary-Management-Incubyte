import { screen, waitFor, within } from '@testing-library/react'
import { http, HttpResponse } from 'msw'
import { describe, expect, it } from 'vitest'
import { buildCountryInsights, buildPayFigures } from '../../test/factories'
import { renderRoute } from '../../test/renderRoute'
import { server } from '../../test/server'

describe('CountryInsightsPage', () => {
  it('shows headcount and salary figures for the country', async () => {
    renderRoute('/insights/IN')

    expect(await screen.findByRole('heading', { name: /India/ })).toBeInTheDocument()
    expect(await screen.findByText('3 employees · salaries in INR')).toBeInTheDocument()
    expect(screen.getByText('₹1,100,000')).toBeInTheDocument()
    expect(screen.getByText('₹1,266,666.67')).toBeInTheDocument()
    expect(screen.getByText('₹800,000 – ₹2,000,000')).toBeInTheDocument()
  })

  it('breaks pay down by job title', async () => {
    renderRoute('/insights/IN')

    const row = await screen.findByRole('row', { name: /Software Engineer/ })
    expect(within(row).getByText('₹1,450,000')).toBeInTheDocument()
  })

  it('links a job title to the matching employees', async () => {
    const { user, router } = renderRoute('/insights/IN')

    const row = await screen.findByRole('row', { name: /Software Engineer/ })
    await user.click(within(row).getByRole('link', { name: 'View employees' }))

    await waitFor(() => expect(router.state.location.pathname).toBe('/employees'))
    expect(new URLSearchParams(router.state.location.search).get('job_title')).toBe('Software Engineer')
    expect(new URLSearchParams(router.state.location.search).get('country_code')).toBe('IN')
  })

  it('switches to another country', async () => {
    const { user, router } = renderRoute('/insights/IN')

    await user.click(await screen.findByRole('combobox', { name: 'Country' }))
    await user.click(await screen.findByTitle('United States'))

    await waitFor(() => expect(router.state.location.pathname).toBe('/insights/US'))
  })

  it('says when a country has no employees yet', async () => {
    server.use(
      http.get('/api/insights/countries/:code', () =>
        HttpResponse.json(
          buildCountryInsights({
            summary: buildPayFigures({ headcount: 0, min_salary: null, max_salary: null, average_salary: null, median_salary: null }),
            job_titles: [],
          }),
        ),
      ),
    )

    renderRoute('/insights/IN')

    expect(await screen.findByText('No employees in this country yet')).toBeInTheDocument()
  })

  it('explains when a country is not supported', async () => {
    server.use(
      http.get('/api/insights/countries/:code', () => HttpResponse.json({ error: 'Country not found' }, { status: 404 })),
    )

    renderRoute('/insights/XX')

    expect(await screen.findByText('Country not found')).toBeInTheDocument()
  })
})
