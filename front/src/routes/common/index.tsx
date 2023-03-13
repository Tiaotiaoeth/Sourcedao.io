import React, { lazy } from 'react'
import { RouteObject } from 'react-router-dom'

import { lazyLoad } from '@utils/routes'

const Profile = lazy(() => import('@views/Profile/index'))
const Certification = lazy(() => import('@views/Certification/index'))
const Exam = lazy(() => import('@views/Exam/index'))

export const routeMap = {
  '/': {
    name: '/',
    isConnect: false,
    isHeader: true,
    isSider: true,
  },
  '/certificationCenter': {
    name: '/certificationCenter',
    isConnect: true,
    isHeader: true,
    isSider: true,
  },
  '/exam': {
    name: '/exam',
    isConnect: true,
    isHeader: false,
    isSider: false,
  },
}

export const routes: RouteObject[] = [
  {
    index: true,
    element: lazyLoad(<Profile />),
  },
  {
    path: '/certificationCenter',
    element: lazyLoad(<Certification />),
  },
  {
    path: '/exam',
    element: lazyLoad(<Exam />),
  },
]