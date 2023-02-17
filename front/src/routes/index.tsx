import React from 'react'
import { Navigate, RouteObject } from 'react-router-dom'
import Layout from '@components/Layout'
import ExplorerRoutes from '@components/ExplorerRoutes'

import { routes as common, routeMap as commonMap } from './common'

interface Rules {
  isConnected: boolean
}

export const routerRules: Record<string, Rules> = {
  '/proposal': {
    isConnected: true,
  },
}

export interface RouterMapItem {
  name: string
  isConnect: boolean
  isHeader: boolean
  isSider: boolean
}

export type RouterMap = Record<string, RouterMapItem>

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

export const routeMap: RouterMap = {
  ...commonMap
}

export default router