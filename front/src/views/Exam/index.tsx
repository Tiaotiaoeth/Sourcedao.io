import React, {
  ChangeEvent,
  useEffect,
  useState,
  useCallback,
  useRef,
} from 'react'
import { findDOMNode } from 'react-dom'

import { useParams, useLocation, useNavigate } from 'react-router-dom'

import { Box } from '@mui/material'

import html2canvas from 'html2canvas'

import { useAppSelector } from '@store/index'

import { examApi, workflowApi, rewardApi, centerApi } from '@api/index'

// import { dataURLtoFile } from '@utils/index'
// import { add } from '@utils/ipfs'

import { CSTSCORELEVEL, CSTLEVEL } from '@constants/exam'

import Title from '@components/Exam/Title'
import Take, { ExamJson } from '@components/Exam/Take'
import CountDown from '@components/Exam/CountDown'
import Navigate from '@components/Exam/Navigate'
import Submit from '@components/Exam/Submit'
import Dialog from './Dialog'
import SBT, { SBTProps } from '@components/SBT'

import type { CertificateProps } from '@components/Certificate'

type State = {
  type: number
  level: keyof typeof CSTLEVEL
  name: string
  org: string
}

export default (): JSX.Element => {
  const { id = '' } = useParams()

  const { state } = useLocation()

  const navigate = useNavigate()

  const { accountAddress } = useAppSelector((store) => store.wallet)

  const beforeunload = (event: BeforeUnloadEvent) => {
    event.returnValue = ''
  }

  const [exam, setExam] = useState<Array<null | ExamJson>>([])

  const [answers, setAnswers] = useState<number[]>([])

  const [duration, setDuration] = useState(-1)

  const [currentExam, setCurrentExam] = useState(0)

  const [timeout, setTimeout] = useState(false)

  const [open, setOpen] = useState(false)

  const [sbtData, setSbtData] = useState<SBTProps>()

  const [sbt, setSbt] = useState<CertificateProps>()

  const sbtRef = useRef<HTMLDivElement | null>(null)

  const [routerState, setRouterState] = useState<State | undefined>()

  const handleChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>, index: number) => {
      const _answers = [...answers]
      _answers.splice(index, 1, parseInt(event.target.value))
      setAnswers(_answers)
    },
    [answers]
  )

  const submit = async () => {
    setOpen(true)
    const score = getScore()
    const { org, name, level } = routerState!
    setSbtData({ score, org, name, level: (level as unknown) as number })
  }

  const init = async () => {
    if (!state) return navigate('/certificationCenter')

    setRouterState(state)

    addEventListener('beforeunload', beforeunload)

    document.onkeydown = (e) => {
      if (e.keyCode === 116) return false
    }
    document.oncontextmenu = () => false

    const cids = await examApi.getExam(id)

    const _duration = await examApi.getExaminationDuration(
      state.type,
      state.level
    )

    // dev code
    setDuration(_duration)

    setExam(new Array(cids.length).fill(null))
    setAnswers(new Array(cids.length).fill(0))

    // const exams = await cat<ExamJson>(cids)
    const exams = await centerApi.exams(cids)

    setExam(exams)
  }

  const getScore = () => {
    let totalScore = 0
    let userScore = 0
    exam.forEach((item, index) => {
      if (!item) return
      totalScore += CSTSCORELEVEL[item.level]
      if (item.standard === answers[index])
        userScore += CSTSCORELEVEL[item.level]
    })
    const score = (userScore / totalScore) * 100
    return Math.round(score * 100) / 100
  }

  useEffect(() => {
    init()
    return () => {
      removeEventListener('beforeunload', beforeunload)
      document.onkeydown = (e) => {
        if (e.keyCode === 116) return true
      }
      document.oncontextmenu = () => true
    }
  }, [])

  useEffect(() => {
    if (!sbtData) return
    const dom = findDOMNode(sbtRef.current) as HTMLElement
    let hash = 'null'
    const canvas = document.createElement('canvas')
    const width = 300
    const height = 400
    canvas.width = width * 2
    canvas.height = height * 2
    // 设定 canvas css宽高为 DOM 节点宽高
    canvas.style.width = `${width}px`
    canvas.style.height = `${height}px`
    // 获取画笔
    html2canvas(dom, { canvas, scale: 2 }).then(async (canvas) => {
      const dataURI = canvas.toDataURL('image/png')
      const { score } = sbtData
      // const file = dataURLtoFile(dataURI)
      // hash = await add(file)
      const resImg = await centerApi.uploadImage(dataURI)
      hash = resImg.hash
      

      
      const res = await workflowApi.submit(
        accountAddress,
        id,
        Math.floor(score),
        answers,
        hash
      )
      await res.wait()
      const data = await rewardApi.getPreSBTMetaByExam(id)

      setSbt({ sbt: dataURI, data })
    })
  }, [sbtData])

  useEffect(() => {
    // if (state) navigate('.', { state: null }) 
  }, [navigate])

  return (
    <>
      {routerState && duration > -1 && (
        <>
          <Box sx={{ display: 'flex' }}>
            <Box sx={{ flex: 1, mr: 6 }}>
              <Title
                {...routerState}
                duration={duration}
                total={exam.length.toString()}
              />
              <Take
                exam={exam}
                currentExam={currentExam}
                handleChange={handleChange}
              />
            </Box>
            <Box sx={{ width: 360 }}>
              <CountDown duration={duration} setTimeout={setTimeout} />
              <Navigate answers={answers} setCurrentExam={setCurrentExam} />
              <Submit answers={answers} timeout={timeout} submit={submit} />
            </Box>
          </Box>
          <Dialog open={open} sbt={sbt} />
          {sbtData && <SBT {...sbtData} ref={sbtRef} />}
        </>
      )}
    </>
  )
}
