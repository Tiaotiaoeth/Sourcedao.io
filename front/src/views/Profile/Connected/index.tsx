import React, { useState, useEffect, useCallback } from 'react'

import { useAppSelector, useAppDispatch } from '@store/index'
import { setExamedType } from '@store/modules/user'
import { setExamDetails } from '@store/modules/dialog'

import { examApi, rewardApi } from '@api/index'

import MyAddress from './MyAddress'
import SBTCover from './SBTCover'
import TestRecord from './TestRecord'
import Dialog from '@components/ExamDetails'

import type { SourceDaoReward } from '@api/reward'

export type SourceDaoRes = SourceDaoReward & { typeName: string }

export default (): JSX.Element => {
  const { accountAddress } = useAppSelector((state) => state.wallet)
  const { examedType } = useAppSelector((state) => state.user)

  const dispatch = useAppDispatch()

  const [sbts, setSbts] = useState<SourceDaoReward[]>([])
  const [rows, setRows] = useState<SourceDaoRes[]>([])

  const [currentRecord, setCurrentRecord] = useState<SourceDaoRes>()

  const handleRecord = useCallback((_currentRecord: SourceDaoRes) => {
    setCurrentRecord(_currentRecord)
    dispatch(setExamDetails(true))
  }, [])

  const init = async () => {
    const promiseSbt: Promise<SourceDaoReward>[] = []

    const promiseRow: Promise<SourceDaoRes>[] = []

    const _sbts = await rewardApi.getTokensByUser(accountAddress)

    const _rows = await examApi.getExamsByUser(accountAddress)

    _sbts.forEach((sbt) => {
      promiseSbt.push(rewardApi.getSBTMeta(parseInt(sbt.toString())))
    })

    const sbts = await Promise.all(promiseSbt)

    setSbts(sbts)

    if (examedType.index < sbts.length) {
      const sbtsCopy = [...sbts]
      const _sbts = sbtsCopy.splice(examedType.index)
      dispatch(setExamedType(_sbts))
    }

    _rows.forEach((row) => {
      promiseRow.push(
        new Promise(async (resolve) => {
          const res = await rewardApi.getPreSBTMetaByExam(row)
          const typeName = await examApi.getTypeName(res.qtype)
          resolve({ ...res, typeName })
        })
      )
    })

    const rows = await Promise.all(promiseRow)

    setRows(rows)
  }

  useEffect(() => {
    init()
  }, [])

  return (
    <>
      <MyAddress />
      <SBTCover sbts={sbts} />
      <TestRecord rows={rows} handleRecord={handleRecord} />
      {currentRecord && <Dialog record={currentRecord} />}
    </>
  )
}
