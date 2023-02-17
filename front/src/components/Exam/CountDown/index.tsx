import React, { useState, useEffect } from 'react'

import { Card, CardContent, Typography } from '@mui/material'

import langHook from '@hooks/localHook'

import { examLang } from '@langs/index'

interface CountDownProps {
  duration: number
  setTimeout: (timeout: boolean) => void
}

let countDown: undefined | NodeJS.Timeout = undefined

export default ({ duration, setTimeout }: CountDownProps): JSX.Element => {

  const local = langHook()

  const [count, setCount] = useState(duration * 60)

  useEffect(() => {
    countDown = setInterval(() => {
      setCount((count) => {
        if (count === 0) {
          setTimeout(true)
          clearInterval(countDown)
        }
        return count > 0 ? count - 1 : 0
      })
    }, 1000)
    return () => clearInterval(countDown)
  }, [])

  const _count = (() => {
    const _m = Math.floor(count / 60)
    const _s = count % 60
    const m = _m < 10 ? `0${_m}` : _m
    const s = _s < 10 ? `0${_s}` : _s
    if (m === '00' && s === '00') {
      return '00:00'
    } else {
      return `${m}:${s}`
    }
  })()

  return (
    <Card sx={{ mb: 6 }}>
      <CardContent>
        <Typography sx={{ fontSize: 14 }} color="text.secondary">
          {local(examLang.timeRemaining)}
        </Typography>
        <Typography variant="h3" sx={{
          textAlign: 'center',
          fontWeight: 700,
        }} >
          {_count}
        </Typography>
      </CardContent>
    </Card>
  )
}