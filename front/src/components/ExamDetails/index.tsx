import React, { useState, useEffect } from 'react'

import { useLocation } from 'react-router-dom'

import {
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Slide,
  Button,
} from '@mui/material'

import { TransitionProps } from '@mui/material/transitions'

import { examApi, checkApi } from '@api/index'

import { useAppSelector, useAppDispatch } from '@store/index'
import { setExamDetails } from '@store/modules/dialog'

import langHook from '@hooks/localHook'
import { examLang } from '@langs/index'

import { dateTimeConversion } from '@utils/index'
import { cat } from '@utils/ipfs'

import Title from '@components/Exam/Title'
import Take, { ExamJson } from '@components/Exam/Take'
import ScoreGrade from '@components/Exam/ScoreGrade'
import Navigate from '@components/Exam/Navigate'
import Blockchain from '@components/Exam/Blockchain'
import CertificateDialog from '@components/Certificate/Dialog'
import Introduce from '@components/Introduce'

import { Close } from '@mui/icons-material'

import type { SourceDaoRes } from '@views/Profile/Connected'

interface DialogProps {
  record: SourceDaoRes
}

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />
})

export default ({ record }: DialogProps): JSX.Element => {
  const { pathname } = useLocation()

  const { examDetails } = useAppSelector((store) => store.dialog)

  const dispatch = useAppDispatch()

  const local = langHook()

  const [exam, setExam] = useState<Array<null | ExamJson>>([])

  const [answers, setAnswers] = useState<number[]>([])

  const [currentExam, setCurrentExam] = useState(0)

  const [cOpen, setCOpen] = useState(false)

  const [iOpen, setIOpen] = useState(false)

  const openIntroduce = pathname !== '/'

  const init = async () => {
    if (!examDetails) return

    const cids = await examApi.getExam(record.examId)

    setExam(new Array(cids.length).fill(null))

    try {
      const _answers = await checkApi.getAnswers(record.examId)
      setAnswers(_answers)
    } catch (error) {
      setAnswers(new Array(cids.length).fill(0))
    }

    const exams = await cat<ExamJson>(cids)

    setExam(exams)
  }

  const handleExamination = () => {
    if (openIntroduce) {
      dispatch(setExamDetails(false))
    }else {
      setIOpen(true)
    }
  }

  useEffect(() => {
    init()
    return () => {
      setExam([])
      setAnswers([])
    }
  }, [examDetails])

  return (
    <>
      <Dialog fullScreen open={examDetails} TransitionComponent={Transition}>
        <DialogTitle
          sx={{
            display: 'flex',
            justifyContent: 'end',
            pt: 0,
            pb: 0,
            backgroundColor: '#f0f2f5',
          }}
        >
          <IconButton
            edge="end"
            color="inherit"
            onClick={() => dispatch(setExamDetails(false))}
            aria-label="close"
          >
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent
          sx={{
            pt: 0,
            backgroundColor: '#f0f2f5',
          }}
        >
          {record && (
            <Box sx={{ display: 'flex' }}>
              <Box sx={{ flex: 1, mr: 6 }}>
                <Title
                  name={record.typeName}
                  level={record.qlevel}
                  time={dateTimeConversion(
                    parseInt(record.time.toString()) * 1000,
                    'YYYY-MM-DD HH:mm:ss'
                  )}
                  lowCost={record.lowCost}
                  costUnit={record.costUnit}
                />
                <Take exam={exam} currentExam={currentExam} initVal={answers} />
              </Box>
              <Box sx={{ width: 360 }}>
                <ScoreGrade
                  score={record.score}
                  setOpen={setCOpen}
                  picContent={record.picContent}
                />
                <Navigate
                  answers={answers}
                  setCurrentExam={setCurrentExam}
                  leftText={examLang.correct}
                  rightText={examLang.wrong}
                  exam={exam}
                />
                <Blockchain chain={record.chain} />
                <Button
                  variant="contained"
                  size="large"
                  fullWidth
                  onClick={handleExamination}
                >
                  {local(examLang.reExam)}
                </Button>
              </Box>
            </Box>
          )}
        </DialogContent>
      </Dialog>
      <CertificateDialog
        open={cOpen}
        setOpen={setCOpen}
        examId={record.examId}
      />
      <Introduce
        open={iOpen}
        setOpen={setIOpen}
        typeId={record.qtype}
        name={record.typeName}
        examedId={record.examId}
      />
    </>
  )
}
