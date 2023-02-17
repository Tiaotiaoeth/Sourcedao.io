import React from 'react'

import { Box, Button, Paper, Typography } from '@mui/material'

import Jazzicon, { jsNumberForAddress } from 'react-jazzicon'

import { useSnackbar } from 'notistack'

import { useAppSelector } from '@store/index'

import langHook from '@hooks/localHook'

import { profileLang, headerLang } from '@langs/index'

import ContentCopyIcon from '@mui/icons-material/ContentCopy'

export default (): JSX.Element => {

  const { enqueueSnackbar } = useSnackbar()

  const { accountAddress } = useAppSelector(state => state.wallet)

  const local = langHook()

  const handleCopy = () => {
    navigator.clipboard.writeText(accountAddress)
    enqueueSnackbar(
      local(headerLang.copied),
      {
        variant: 'success',
      })
  }

  return (
    <Paper
      sx={{
        padding: 2,
        display: 'flex',
        mb:10,
      }}>
      <Jazzicon diameter={80} seed={jsNumberForAddress(accountAddress)} />
      <Box
        sx={{
          ml: 6,
        }}>
        <Typography variant="body1" sx={{mb: 2}}>
          {accountAddress}
        </Typography>
        <Button
          variant="outlined"
          startIcon={<ContentCopyIcon />}
          onClick={handleCopy}
        >
          {local(profileLang.copy)}
        </Button>
      </Box>
    </Paper>
  )
}