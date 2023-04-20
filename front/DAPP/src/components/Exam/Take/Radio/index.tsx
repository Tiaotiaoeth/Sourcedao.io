import React, { ChangeEvent } from 'react'

import { FormControlLabel, Radio, RadioGroup, useTheme } from '@mui/material'

import { ExamJson } from '../index'

interface RadioProps {
  index: number
  exam: ExamJson
  initVal?: number[]
  handleChange?: (e: React.ChangeEvent<HTMLInputElement>, i: number) => void
}

export default ({
  exam,
  index,
  initVal,
  handleChange,
}: RadioProps): JSX.Element => {
  const theme = useTheme()

  const mainColor = theme.palette.primary.main
  const rightColor = theme.palette.navLeft.main
  const errorColor = theme.palette.navRight.main

  const _handleChange = (
    event: ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    if (handleChange) handleChange(event, index)
  }

  return (
    <RadioGroup
      defaultValue={initVal ? initVal[index] + '' : '0'}
      onChange={(e) => _handleChange(e, index)}
    >
      {exam.options.map((o, i) => {
        const value = i + 1
        const color = initVal
          ? exam.standard === value
            ? rightColor
            : initVal[index] === value
              ? errorColor
              : mainColor
          : mainColor
        return (
          <FormControlLabel
            key={i}
            value={value}
            control={
              initVal ? (
                <Radio
                  sx={{
                    color: color,
                    '&.Mui-checked': {
                      color: color,
                    },
                  }}
                  checked={initVal[index] === value}
                />
              ) : (
                <Radio />
              )
            }
            label={o}
            sx={{
              color,
            }}
          />
        )
      })}
    </RadioGroup>
  )
}
