import React, { useState, lazy, Suspense } from 'react'

import {
  Box,
  AppBar,
  Toolbar,
  IconButton,
  Menu,
  MenuItem,
  Button,
} from '@mui/material'

import LanguageIcon from '@mui/icons-material/Language'

import Jazzicon, { jsNumberForAddress } from 'react-jazzicon'

import { useSnackbar } from 'notistack'

import LOCAL from '@constants/local'

import langHook from '@hooks/localHook'

import { headerLang } from '@langs/index'

import { useAppSelector, useAppDispatch } from '@store/index'

import { setLocal } from '@store/modules/local'
import { setDialogOpen } from '@store/modules/wallet'

import { truncateMiddle } from '@utils/index'

const WallteDialog = lazy(() => import('@components/WallteDialog'))


export default (): JSX.Element => {

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)


  const open = !!anchorEl

  const { accountAddress } = useAppSelector(state => state.wallet)

  const dispatch = useAppDispatch()

  const local = langHook()

  const { enqueueSnackbar } = useSnackbar()

  const handleLocal = (lang: LOCAL) => {
    setAnchorEl(null)
    dispatch(setLocal(lang))
  }


  const handleCopy = () => {
    navigator.clipboard.writeText(accountAddress)
    enqueueSnackbar(
      local(headerLang.copied),
      {
        variant: 'success',
      })
  }

  return (
    <Box>
      {/* AppBar */}
      <AppBar position="static">
        <Toolbar>
          <Box sx={{ flexGrow: 1 }} />
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
            onClick={event => setAnchorEl(event.currentTarget)}
          >
            <LanguageIcon />
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={open}
            onClose={() => setAnchorEl(null)}
          >
            <MenuItem onClick={() => handleLocal(LOCAL.zh_cn)}>简体中文</MenuItem>
            <MenuItem onClick={() => handleLocal(LOCAL.en_us)}>English</MenuItem>
          </Menu>
          {
            accountAddress
              ? <Button color="inherit"
                startIcon={<Jazzicon diameter={20} seed={jsNumberForAddress(accountAddress)} />}
                onClick={handleCopy}
              >
                {truncateMiddle(accountAddress)}
              </Button>
              : <Button color="inherit" onClick={() => dispatch(setDialogOpen(true))}>{local(headerLang.wallet)}</Button>
          }

        </Toolbar>
      </AppBar>
      {/* WallteDialog */}
      <Suspense>
        <WallteDialog />
      </Suspense>
    </Box>
  )
}
