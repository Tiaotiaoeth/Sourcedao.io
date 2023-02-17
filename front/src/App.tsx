import React, { useRef, useEffect } from 'react'

import { useRoutes } from 'react-router-dom'

import { IconButton } from '@mui/material'

import { SnackbarProvider } from 'notistack'

import { useAppDispatch } from '@store/index'

import { initWallet } from '@store/modules/wallet'

import routers from '@routes/index'

import CloseIcon from '@mui/icons-material/Close'



export default (): JSX.Element => {

  const snackbarRef = useRef<SnackbarProvider>(null)

  const dispatch = useAppDispatch()

  useEffect(() => {
    dispatch(initWallet())
  }, [])

  return (
    <SnackbarProvider
      ref={snackbarRef}
      maxSnack={3}
      anchorOrigin={{ vertical: "top", horizontal: "center" }}
      preventDuplicate={true}
      autoHideDuration={2000}
      action={(snackbarId) => (
        <IconButton color="inherit" onClick={() => snackbarRef.current?.closeSnackbar(snackbarId)}>
          <CloseIcon />
        </IconButton>
      )}
    >
      {useRoutes(routers)}
    </SnackbarProvider>
  )
}
