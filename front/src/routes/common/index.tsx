import React, { lazy } from 'react'
import { RouteObject } from 'react-router-dom'

import { lazyLoad } from '@utils/routes'

const Home = lazy(() => import('@views/Home/index'))

export const routes: RouteObject[] = [
  {
    index: true,
    element: lazyLoad(<Home />),
  }
]