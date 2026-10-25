import type { ComponentType } from 'react'
import { Navigate, type RouteObject } from 'react-router'
import AppLayout from './layout/AppLayout'
import PageLoader from './layout/PageLoader'
import NotFoundPage from './pages/NotFoundPage'

const lazyPage = (load: () => Promise<{ default: ComponentType }>) => async () => ({
  Component: (await load()).default,
})

export const routes: RouteObject[] = [
  {
    element: <AppLayout />,
    hydrateFallbackElement: <PageLoader />,
    children: [
      { index: true, element: <Navigate to="/employees" replace /> },
      { path: 'employees', lazy: lazyPage(() => import('./features/employees/EmployeesPage')) },
      { path: 'insights', lazy: lazyPage(() => import('./features/insights/OverviewPage')) },
      { path: 'insights/:countryCode', lazy: lazyPage(() => import('./features/insights/CountryInsightsPage')) },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
]
