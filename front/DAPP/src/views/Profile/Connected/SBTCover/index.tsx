import React, { useState, useCallback } from 'react'

import { Box, Divider, Paper, Typography } from '@mui/material'

import langHook from '@hooks/localHook'
import { profileLang } from '@langs/index'

import CertificateDialog from '@components/Certificate/Dialog'
import Cover from './Cover'

import type { SourceDaoReward } from '@api/reward'

import './index.less'

interface SBTCoverProps {
  sbts: SourceDaoReward[]
}

export default ({ sbts }: SBTCoverProps): JSX.Element => {
  const local = langHook()

  const [open, setOpen] = useState(false)
  const [examId, setExamId] = useState('')

  const handleCLickSBT = useCallback((examId: string) => {
    setOpen(true)
    setExamId(examId)
  }, [])

  const currentTime = new Date().getTime()

  const isExpired = (time: number, qduration: number): boolean => {
    const thousand = 1000
    time = parseInt(time.toString()) * thousand
    qduration = parseInt(qduration.toString()) * 30 * 24 * 60 * 60 * thousand

    return time + qduration < currentTime
  }

  return (
    <Box sx={{ mb: 10 }}>
      <Paper>
        <Typography component="h6" variant="h6" sx={{ p: 2 }}>
          {local(profileLang.myCertification)}
        </Typography>
        <Divider light />
        <Box
          sx={{
            minHeight: '228px',
            display: 'flex',
            flexWrap: 'wrap',
            p: 4,
            pt: 2,
            pb: 0,
          }}
        >
          {sbts.map((sbt, index) => (
            <div className="row_box" key={index}>
              <Cover
                examId={sbt.examId}
                picContent={sbt.picContent}
                handleCLickSBT={handleCLickSBT}
              />
              {isExpired(sbt.time, sbt.qduration) && (
                <div className="row_box_sticker">
                  {local(profileLang.expired)}
                </div>
              )}
            </div>
          ))}
        </Box>
      </Paper>
      <CertificateDialog open={open} setOpen={setOpen} examId={examId} />
    </Box>
  )
}
