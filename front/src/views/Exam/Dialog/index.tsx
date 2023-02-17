import React from 'react'

import { useNavigate } from 'react-router-dom'

import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  Slide,
  Typography,
} from '@mui/material'

import { TransitionProps } from '@mui/material/transitions'

import langHook from '@hooks/localHook'
import { examLang } from '@langs/index'

import Certificate, { CertificateProps } from '@components/Certificate'

import { CheckBox } from '@mui/icons-material'

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />
})

interface DialogProps {
  open: boolean
  sbt: CertificateProps | undefined
}

export default ({ open, sbt }: DialogProps): JSX.Element => {
  const navigate = useNavigate()

  const local = langHook()

  const handle = () => navigate('/')

  return (
    <div>
      <Dialog fullScreen open={open} TransitionComponent={Transition}>
        <Box
          sx={{
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          {sbt ? (
            <>
              <CheckBox
                sx={{
                  mb: 1,
                }}
              />
              <Typography variant="h6" component="h6" sx={{ mb: 4 }}>
                {local(examLang.congratulations)}
              </Typography>
              <Certificate {...sbt} />
              <Button
                variant="outlined"
                sx={{
                  mt: 4,
                  width: 260,
                }}
                onClick={handle}
              >
                {local(examLang.confirm)}
              </Button>
            </>
          ) : (
            <>
              <CircularProgress />
              <Typography sx={{ mt: 6 }}>
                {local(examLang.examResult)}
              </Typography>
            </>
          )}
        </Box>
      </Dialog>
    </div>
  )
}
