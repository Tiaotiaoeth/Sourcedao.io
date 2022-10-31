import React from 'react'

import { Outlet } from 'react-router-dom'

export default (): JSX.Element => {
  return (
    <>
      <Outlet />
    </>
  )
}
