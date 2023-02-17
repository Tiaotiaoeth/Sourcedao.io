import React from 'react'

import {
  Box,
  Button,
  Card,
  CardContent,
  Divider,
  List,
  Typography,
  useTheme,
} from '@mui/material'

import langHook from '@hooks/localHook'
import { examLang, Lang } from '@langs/index'

import { ExamJson } from '../Take'

import { Palette } from '@utils/theme'
interface NavigateProps {
  answers: number[]
  setCurrentExam: (num: number) => void
  leftText?: Lang
  leftColor?: Palette
  rightText?: Lang
  rightColor?: Palette
  exam?: Array<null | ExamJson>
}

export default ({
  answers,
  setCurrentExam,
  leftText = examLang.tbc,
  leftColor = 'navLeft',
  rightText = examLang.completed,
  rightColor = 'navRight',
  exam,
}: NavigateProps): JSX.Element => {
  const theme = useTheme()

  const local = langHook()

  return (
    <Card sx={{ mb: 6 }}>
      <CardContent>
        <List
          sx={{
            display: 'flex',
            flexDirection: 'row',
            flexWrap: 'wrap',
          }}
        >
          {answers.map((answer, index) => {
            const btnColor = exam
              ? exam[index]?.standard === answer
                ? leftColor
                : rightColor
              : answer > 0
                ? leftColor
                : rightColor
            return (
              <Button
                sx={{
                  minWidth: 24,
                  height: 24,
                  p: 0,
                  m: 0.55,
                }}
                color={btnColor}
                key={index}
                variant='contained'
                onClick={() => setCurrentExam(index)}
              >
                {index + 1}
              </Button>
            )
          })}
        </List>
        <Divider component="li" sx={{ mb: 2 }} />
        <Box
          sx={{
            width: '100%',
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-around',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
            }}
          >
            <Box
              sx={{
                width: 22,
                height: 22,
                m: 0.55,
                backgroundColor: theme.palette[leftColor].main,
                borderRadius: 1,
              }}
            ></Box>
            <Typography>{local(leftText)}</Typography>
          </Box>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
            }}
          >
            <Box
              sx={{
                width: 24,
                height: 24,
                m: 0.55,
                backgroundColor: theme.palette[rightColor].main,
                borderRadius: 1,
              }}
            ></Box>
            <Typography>{local(rightText)}</Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  )
}
