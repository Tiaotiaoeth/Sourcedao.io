import React, { ReactNode } from 'react'

interface IProps {
  children: ReactNode
}

export default ({ children }: IProps): JSX.Element => {
  return (
    <>{children} </>
  )
}
