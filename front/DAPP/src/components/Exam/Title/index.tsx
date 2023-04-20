import React from 'react'

import { utils } from 'ethers'

import { Box, Card, CardContent, Typography } from '@mui/material'

import langHook from '@hooks/localHook'
import { examLang, introduceLang, profileLang } from '@langs/index'

import { CSTLEVEL } from '@constants/exam'

export interface TitleProps {
  name: string
  level: keyof typeof CSTLEVEL
  duration?: number
  total?: string
  time?: string
  lowCost?: number
  costUnit?: string
}

export default ({
  name,
  duration,
  total,
  level,
  time,
  lowCost,
  costUnit,
}: TitleProps): JSX.Element => {
  const local = langHook()

  const examSubtitle = (
    <Box>
      <Typography component="span" sx={{ mr: 4 }}>
        {local(introduceLang.duration)}
      </Typography>
      <Typography component="span" sx={{ mr: 12 }}>
        {duration + local(introduceLang.mins)}
      </Typography>
      <Typography component="span" sx={{ mr: 4 }}>
        {local(introduceLang.noq)}
      </Typography>
      <Typography component="span">
        {total + local(introduceLang.question)}
      </Typography>
    </Box>
  )

  const examDetailsSubtitle = (
    <Box>
      <Typography component="span" sx={{ mr: 4 }}>
        {local(profileLang.submittedTime)}
      </Typography>
      <Typography component="span" sx={{ mr: 12 }}>
        {time}
      </Typography>
      <Typography component="span" sx={{ mr: 4 }}>
        {local(profileLang.fee)}
      </Typography>
      {lowCost && (
        <Typography component="span">
          {utils.formatEther(lowCost!) + costUnit!}
        </Typography>
      )}
    </Box>
  )

  return (
    <Card sx={{ mb: 6 }}>
      <CardContent>
        <Box
          sx={{
            display: 'flex',
            mb: 3.6,
            alignItems: 'center',
          }}
        >
          <Typography>{name}</Typography>
          <Box
            sx={{
              ml: 2,
              p: 0.5,
              pl: 1.5,
              pr: 1.5,
              backgroundColor: '#ccc',
              fontSize: 12,
            }}
          >
            {local(
              examLang[(CSTLEVEL[level] as unknown) as keyof typeof examLang]
            )}
          </Box>
        </Box>
        {duration && total ? examSubtitle : examDetailsSubtitle}
      </CardContent>
    </Card>
  )
}
