import React from 'react'

import {
  Dialog,
  DialogTitle,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  IconButton,
} from '@mui/material'

import { styled } from '@mui/material/styles'

import CloseIcon from '@mui/icons-material/Close'

import { useSnackbar } from 'notistack'

import langHook from '@hooks/localHook'

import { walletLang } from '@langs/index'

import { useAppSelector, useAppDispatch } from '@store/index'

import { setDialogOpen, connectWallet, setConnecting, WalletState } from '@store/modules/wallet'

import { getEthereumWallet } from '@utils/wallets'


import metamaskIcon from '@images/wallte/metamaskIcon.svg'


interface Wallte {
  icon: string
  text: string
}

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiPaper-root': {
    paddingLeft: theme.spacing(4),
    paddingRight: theme.spacing(4),
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(4),
  }
}))


export default (): JSX.Element => {

  const { enqueueSnackbar } = useSnackbar()

  const { dialogOpen, connecting } = useAppSelector((state) => state.wallet)

  const dispatch = useAppDispatch()

  const local = langHook()

  const walltes: Wallte[] = [
    {
      icon: '',
      text: 'MetaMask'
    },
  ]

  const handleClose = () => {
    if (connecting) return
    dispatch(setDialogOpen(false))
  }

  const handleListItemClick = async (wallte: Wallte) => {
    if (connecting) return

    const { text } = wallte

    dispatch(setConnecting(true))


    const isConnected = await getEthereumWallet(text)

    if (isConnected) {
      const { payload } = await dispatch(connectWallet(text))

      if ((payload as WalletState).accountAddress) enqueueSnackbar(local(walletLang.connected), { variant: 'success' })

    } else {
      window.open('https://metamask.io/download/')
      dispatch(setConnecting(false))
    }
  }

  return (
    <BootstrapDialog onClose={handleClose} open={dialogOpen}>
      <DialogTitle
        sx={{
          pl: 0,
          pb: 5,
        }}
      >
        {local(walletLang.wallet)}
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <List sx={{ pt: 0 }}>
        {walltes.map((wallte, index) => (
          <ListItem
            disabled={connecting}
            button
            onClick={() => handleListItemClick(wallte)}
            key={index}
            sx={{
              border: '1px solid rgba(0, 0, 0, 0.12)',
              borderRadius: 4,
              width: 360,
            }}
          >
            <ListItemAvatar>
              <Avatar variant="rounded" src={metamaskIcon} />
            </ListItemAvatar>
            <ListItemText primary={wallte.text} />
            <ListItemText
              primary={local(connecting ? walletLang.connecting : walletLang.connect)}
              sx={{
                flexGrow: 0
              }}
            />
          </ListItem>
        ))}
      </List>
    </BootstrapDialog>
  )
}