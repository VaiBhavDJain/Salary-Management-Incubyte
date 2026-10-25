import { render } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { createMemoryRouter, RouterProvider } from 'react-router'
import { routes } from '../routes'

export function renderRoute(path: string) {
  const router = createMemoryRouter(routes, { initialEntries: [path] })

  return { user: userEvent.setup(), ...render(<RouterProvider router={router} />) }
}
