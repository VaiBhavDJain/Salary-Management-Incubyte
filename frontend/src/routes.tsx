import { Navigate, type RouteObject } from 'react-router'
import EmployeesPage from './features/employees/EmployeesPage'
import OverviewPage from './features/insights/OverviewPage'
import AppLayout from './layout/AppLayout'
import NotFoundPage from './pages/NotFoundPage'

export const routes: RouteObject[] = [
  {
    element: <AppLayout />,
    children: [
      { index: true, element: <Navigate to="/employees" replace /> },
      { path: 'employees', element: <EmployeesPage /> },
      { path: 'insights', element: <OverviewPage /> },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
]
