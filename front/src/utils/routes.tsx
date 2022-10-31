import React, { ReactNode, Suspense } from 'react'

export const lazyLoad = (children: ReactNode): ReactNode => {
  return <Suspense fallback={<></>}>{children}</Suspense>
}