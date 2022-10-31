import React from 'react'

import { useRoutes } from 'react-router-dom'

import router from '@routes/index' // 路由

export default (): JSX.Element => {
  return (
    <>
      {useRoutes(router)}
    </>
  )
}
