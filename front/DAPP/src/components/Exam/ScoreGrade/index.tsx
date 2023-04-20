import React from 'react'

import { Card, CardContent, Typography } from '@mui/material'

import langHook from '@hooks/localHook'
import { examLang } from '@langs/index'

import { scoreGrade } from '@utils/index'

interface ScoreGradeProps {
  score: number
  picContent: string
  setOpen?: (state: boolean) => void
}

export default ({
  score,
  picContent,
  setOpen,
}: ScoreGradeProps): JSX.Element => {
  const local = langHook()

  const handleSetOpen = () => {
    if (picContent.length === 0) return
    setOpen && setOpen(true)
  }
  return (
    <Card
      sx={{ mb: 6, cursor: picContent.length > 0 ? 'pointer' : 'auto' }}
      onClick={handleSetOpen}
    >
      <CardContent>
        <Typography sx={{ fontSize: 14 }} color="text.secondary">
          {local(examLang.results)}
        </Typography>
        <Typography
          variant="h3"
          sx={{
            textAlign: 'center',
            fontWeight: 700,
          }}
        >
          {scoreGrade(score)}
        </Typography>
      </CardContent>
    </Card>
  )
}
