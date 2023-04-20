import React, { useState, useEffect, useCallback } from 'react'

import { Paper, Stack } from '@mui/material'

import { examApi, rewardApi } from '@api/index'
import { ExamType } from '@api/exam'

import { useAppSelector, useAppDispatch } from '@store/index'
import { setExamedType } from '@store/modules/user'

import Cover from '@components/Cover'
import Introduce from '@components/Introduce'

import type { SourceDaoReward } from '@api/reward'

export default (): JSX.Element => {
  const { accountAddress } = useAppSelector((state) => state.wallet)
  const { examedType } = useAppSelector((store) => store.user)

  const dispatch = useAppDispatch()

  const [exams, setExams] = useState<ExamType[]>([])
  const [open, setOpen] = useState(false)
  const [typeId, setTypeId] = useState(0)
  const [name, setName] = useState('')
  const [examedId, setExamedId] = useState<string | undefined>()
  const [sbts, setSbts] = useState<string[]>([])

  const setSbtsInfo = async (_sbts: string[]) => {
    const promiseSbt: Promise<SourceDaoReward>[] = []
    _sbts.forEach((sbt) => {
      promiseSbt.push(rewardApi.getSBTMeta(parseInt(sbt.toString())))
    })
    const sbts = await Promise.all(promiseSbt)
    dispatch(setExamedType(sbts))
  }

  const handleCLickCover = useCallback(
    (name: string, typeId: number) => {

      const keys = Object.keys(examedType.examedTypes)
      const key = keys.find((key) => parseInt(key) === typeId)

      if (key) setExamedId(examedType.examedTypes[parseInt(key)])

      setOpen(true)
      setTypeId(typeId)
      setName(name)
    },
    [examedType]
  )

  useEffect(() => {
    examApi.listTypes().then((res) => setExams(res))
    rewardApi.getTokensByUser(accountAddress).then((res) => setSbts(res))
  }, [])

  useEffect(() => {
    if (examedType.index < sbts.length) {
      const _sbts = sbts.splice(examedType.index)
      setSbtsInfo(_sbts)
    }
  }, [sbts])

  return (
    <>
      <Paper
        sx={{
          p: 2,
          minHeight: '196px',
        }}
      >
        <Stack direction="row" spacing={8}>
          {exams.map((exam) => (
            <Cover key={exam.typeId} {...exam} handleClick={handleCLickCover} />
          ))}
        </Stack>
      </Paper>
      <Introduce
        open={open}
        setOpen={setOpen}
        typeId={typeId}
        name={name}
        examedId={examedId}
      />
    </>
  )
}
