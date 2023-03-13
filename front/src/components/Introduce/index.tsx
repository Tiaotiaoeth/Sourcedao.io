import React, { ChangeEvent, useState, useEffect } from 'react'

import { useNavigate, useLocation } from 'react-router-dom'

import {
  Dialog,
  DialogContent,
  DialogActions,
  Box,
  RadioGroup,
  FormControlLabel,
  Radio,
  Typography,
  Button,
} from '@mui/material'

import LoadingButton from '@mui/lab/LoadingButton'

// import { useSnackbar } from 'notistack'

import { useAppSelector, useAppDispatch } from '@store/index'
import { setExamDetails } from '@store/modules/dialog'

import { workflowApi, examApi, rewardApi } from '@api/index'

import { randomExamId } from '@utils/index'

import langHook from '@hooks/localHook'
import { examLang } from '@langs/index'

import { CSTLEVEL, LEVEL } from '@constants/exam'

import Title from './Title'
import Cover from '@components/Cover'
import Meta from './Meta'
import CertificateDialog from '@components/Certificate/Dialog'
import ExamDetailsDialog from '@components/ExamDetails'

import type { ExamLevel } from '@api/exam'
import type { SourceDaoRes } from '@views/Profile/Connected'

interface IntroduceDialogProps {
  open: boolean
  setOpen: (state: boolean) => void
  typeId: number
  name: string
  examedId?: string
}

export default ({
  open,
  setOpen,
  typeId,
  name,
  examedId,
}: IntroduceDialogProps): JSX.Element => {
  const navigate = useNavigate()

  const { pathname } = useLocation()

  // const { enqueueSnackbar } = useSnackbar()

  const { accountAddress } = useAppSelector((store) => store.wallet)
  const { examDetails } = useAppSelector((store) => store.dialog)

  const dispatch = useAppDispatch()

  const local = langHook()

  const [levels, setLevels] = useState<ExamLevel[]>([])
  const [level, setLevel] = useState(1)

  const [examSBTMeta, setExamSBTMeta] = useState<string[]>([])

  const [introduction, setIntroduction] = useState('')

  const [loading, setLoading] = useState(false)

  const [cOpen, setCOpen] = useState(false)

  const [currentRecord, setCurrentRecord] = useState<SourceDaoRes>()

  const openExamDetails = pathname !== '/'

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setExamSBTMeta([])
    setLevel(parseInt(event.target.value))
  }

  const handleClose = () => {
    if (loading) return
    setOpen(false)
  }

  const handleStart = async () => {
    const examId = randomExamId()

    setLoading(true)

    try {
      const type = 1
      const exam = await workflowApi.prepare(
        accountAddress,
        examId,
        type,
        level
      )
      await exam.wait()
      navigate(`/exam`, {
        state: {
          examId,
          type,
          level,
          name,
          org: examSBTMeta[0],
        },
      })
    } catch (error) {
      // enqueueSnackbar(JSON.stringify(error), {
      //   variant: 'error',
      // })
      setLoading(false)
    }
  }

  const init = async () => {
    if (levels.length === 0) {
      const _levels = await examApi.listLevels()
      setLevels(_levels)
    }

    getPreExamSBTMeta()
    getIntroduction()

    if (examedId) getPreSBTMetaByExam()
  }

  const getPreExamSBTMeta = async () => {
    const _examSBTMeta = await rewardApi.getPreExamSBTMeta(typeId, level)
    setExamSBTMeta(_examSBTMeta)
  }

  const getIntroduction = async () => {
    const _introduction = await workflowApi.getIntroduction(typeId)
    setIntroduction(_introduction)
  }

  const getPreSBTMetaByExam = async () => {
    const recode = await rewardApi.getPreSBTMetaByExam(examedId!)
    const typeName = await examApi.getTypeName(recode.qtype)
    setCurrentRecord({ ...recode, typeName })
  }

  const leave = () => {
    setLevel(1)
    setExamSBTMeta([])
    setIntroduction('')
  }

  const handleExamDetails = () => {
    if (openExamDetails && !examDetails) {
      dispatch(setExamDetails(true))
    }else {
      setOpen(false)
    }
  }

  useEffect(() => {
    open ? init() : leave()
  }, [open])

  useEffect(() => {
    if (!open) return
    getPreExamSBTMeta()
  }, [level])

  const examed = !!examedId

  return (
    <>
      <Dialog onClose={handleClose} open={open} maxWidth="md" fullWidth={true}>
        <Title onClose={handleClose}>{name}</Title>

        <DialogContent
          sx={{
            display: 'flex',
            height: 275,
          }}
        >
          <Box
            sx={{
              width: 210,
              mr: 10,
            }}
          >
            <Cover name={name} typeId={typeId} scale={1.3} />
          </Box>
          <Box
            sx={{
              height: '100%',
              overflowY: 'auto',
              overflowX: 'hidden',
            }}
          >
            <RadioGroup
              aria-labelledby="demo-radio-buttons-group-label"
              name="radio-buttons-group"
              value={level}
              onChange={handleChange}
              row
              sx={{ height: 42, mb: 2 }}
            >
              {levels.map((item, index) => (
                <FormControlLabel
                  key={item.levelId}
                  value={item.levelId}
                  control={<Radio />}
                  disabled={loading || index > 0}
                  label={local(
                    examLang[
                      (CSTLEVEL[
                        (item.levelId as unknown) as LEVEL
                      ] as unknown) as keyof typeof examLang
                    ]
                  )}
                />
              ))}
            </RadioGroup>
            <Meta examSBTMeta={examSBTMeta} />
            <Typography sx={{ fontSize: '12px', width: 580 }}>
              {introduction}
            </Typography>
          </Box>
        </DialogContent>

        <DialogActions
          sx={{
            display: 'flex',
            justifyContent: examed ? 'space-around' : 'center',
            mb: 2,
          }}
        >
          {examed && (
            <>
              <Button
                sx={{
                  width: 200,
                }}
                autoFocus
                variant="outlined"
                disabled={!currentRecord?.picContent}
                onClick={() => setCOpen(true)}
              >
                {local(examLang.cd)}
              </Button>
              <Button
                sx={{
                  width: 200,
                }}
                autoFocus
                disabled={!currentRecord}
                variant="outlined"
                onClick={handleExamDetails}
              >
                {local(examLang.ed)}
              </Button>
            </>
          )}
          <LoadingButton
            sx={{
              width: 200,
            }}
            autoFocus
            loading={loading}
            variant="outlined"
            onClick={handleStart}
          >
            {local(examed ? examLang.reExam : examLang.startNow)}
          </LoadingButton>
        </DialogActions>
      </Dialog>
      <CertificateDialog open={cOpen} setOpen={setCOpen} examId={examedId!} />
      {currentRecord && openExamDetails && <ExamDetailsDialog record={currentRecord} />}
    </>
  )
}
