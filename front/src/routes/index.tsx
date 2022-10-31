import React from 'react'
import { Navigate, RouteObject } from 'react-router-dom'
import ExplorerRoutes from '@components/ExplorerRoutes'
import Layout from '@components/Layout'

import { routes as common } from './common'

const router: RouteObject[] = [
  {
    path: '/',
    element: <ExplorerRoutes children={<Layout />} />,
    children: [
      ...common,
      {
        path: '*',
        element: <Navigate to='/' />,
      },
    ]
  }
]

export default router