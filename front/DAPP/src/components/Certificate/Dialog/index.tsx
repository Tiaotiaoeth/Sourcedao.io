import React, { useState, useEffect } from 'react'

import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  CircularProgress,
  Box,
} from '@mui/material'

import { rewardApi } from '@api/index'

import Certificate from '..'

import type { SourceDaoReward } from '@api/reward'

import { Close } from '@mui/icons-material'

interface DialogProps {
  open: boolean
  setOpen: (state: boolean) => void
  examId: string
}

export default ({ open, setOpen, examId }: DialogProps): JSX.Element => {
  const [data, setData] = useState<SourceDaoReward>()
  const handleClose = () => {
    setOpen(false)
  }

  useEffect(() => {
    if (!open) return setData(undefined)
    rewardApi.getPreSBTMetaByExam(examId).then((res) => setData(res))
  }, [examId, open])

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="xl">
      <DialogTitle sx={{ pb: 4 }}>
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
          <Close />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        {data ? (
          <Certificate data={data} />
        ) : (
          <Box
            sx={{
              width: 980,
              height: 560,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <CircularProgress />
          </Box>
        )}
      </DialogContent>
    </Dialog>
  )
}
