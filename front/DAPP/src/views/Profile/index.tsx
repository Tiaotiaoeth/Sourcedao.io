import React, { lazy, Suspense } from 'react'

import { useAppSelector } from '@store/index'

import NotConnected from './NotConnected'

const Connected = lazy(() => import('./Connected'))

export default (): JSX.Element => {
  const { accountAddress } = useAppSelector((state) => state.wallet)

  return (
    <>
      {accountAddress ? (
        <Suspense>
          <Connected />
        </Suspense>
      ) : (
        <NotConnected />
      )}
    </>
  )
}
