import { screen, within } from '@testing-library/react'
import { http, HttpResponse } from 'msw'
import { describe, expect, it } from 'vitest'
import { renderRoute } from '../../test/renderRoute'
import { server } from '../../test/server'

describe('OverviewPage', () => {
  it('shows pay per country in its local currency', async () => {
    renderRoute('/insights')

    const india = await screen.findByRole('row', { name: /India/ })
    expect(within(india).getByText('₹1,400,000')).toBeInTheDocument()
    expect(within(screen.getByRole('row', { name: /United States/ })).getByText('$85,600')).toBeInTheDocument()
  })

  it('summarises the whole organisation', async () => {
    renderRoute('/insights')

    expect(await screen.findByText('3 employees across 2 countries')).toBeInTheDocument()
  })

  it('shows headcount per department', async () => {
    renderRoute('/insights')

    const engineering = await screen.findByRole('row', { name: /Engineering/ })
    expect(engineering).toHaveTextContent('2')
  })

  it('opens the insights for a country', async () => {
    const { user, router } = renderRoute('/insights')

    await user.click(await screen.findByRole('link', { name: 'India' }))

    expect(await screen.findByRole('heading', { name: /India/ })).toBeInTheDocument()
    expect(router.state.location.pathname).toBe('/insights/IN')
  })

  it('explains when the overview cannot be loaded', async () => {
    server.use(http.get('/api/insights/overview', () => new HttpResponse(null, { status: 500 })))

    renderRoute('/insights')

    expect(await screen.findByText('Could not load pay insights')).toBeInTheDocument()
  })
})
