import React, { ReactNode, Suspense } from 'react'

import { routeMap, RouterMapItem } from '@routes/index'

export const lazyLoad = (children: ReactNode): ReactNode => {
  return <Suspense fallback={<></>}>{children}</Suspense>
}

export const findRouterRule = (path: string): RouterMapItem | undefined => {
  if (path in routeMap) return routeMap[path]
  const paths = path.split('/')
  paths.pop()
  while (paths.length > 0) {
    const pathName = paths.join('/')
    if (pathName in routeMap) {
      const { name } = routeMap[pathName]
      if (name.split('/').length === path.split('/').length) return routeMap[pathName]
    }
    paths.pop()
  }
} 