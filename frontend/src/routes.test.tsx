import { screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { renderRoute } from './test/renderRoute'

describe('app navigation', () => {
  it('opens the employee directory by default', async () => {
    renderRoute('/')

    expect(await screen.findByRole('heading', { name: 'Employees' })).toBeInTheDocument()
  })

  it('navigates to pay insights from the menu', async () => {
    const { user } = renderRoute('/employees')

    await user.click(await screen.findByRole('link', { name: 'Pay insights' }))

    expect(await screen.findByRole('heading', { name: 'Pay overview' })).toBeInTheDocument()
  })

  it('shows a not found page for unknown addresses', async () => {
    renderRoute('/unknown')

    expect(await screen.findByText('Page not found')).toBeInTheDocument()
  })
})
