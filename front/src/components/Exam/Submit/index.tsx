import React, { useEffect, useState } from 'react'

import { Button, Dialog, DialogTitle, DialogActions } from '@mui/material'

import langHook from '@hooks/localHook'

import { examLang } from '@langs/index'


interface SubmitProps {
  answers: number[]
  timeout: boolean
  submit: () => void
}

const buttonStyle = {
  width: 200
}

export default ({ answers, timeout, submit }: SubmitProps): JSX.Element => {

  const local = langHook()

  const [open, setOpen] = useState(false)

  const [title, setTitle] = useState('')

  const handleClose = () => {
    setOpen(false)
  }

  const handleConfim = async () => {
    handleClose()
    submit()
  }

  useEffect(() => {
    if (!timeout) return

    setTitle(local(examLang.over))

    setOpen(true)
  }, [timeout])

  const handleSubmit = async () => {

    const index = answers.findIndex(answer => answer === 0)

    if (index > -1) {
      setTitle(local(examLang.undone))
    } else {
      setTitle(local(examLang.done))
    }

    setOpen(true)
  }

  return (
    <>
      <Button
        variant="contained"
        size="large"
        fullWidth
        onClick={handleSubmit}
      >
        {local(examLang.submitted)}
      </Button>

      <Dialog
        open={open}
        onClose={timeout ? () => null : handleClose}
        maxWidth="md"
        fullWidth={true}
      >
        <DialogTitle
          sx={{
            p: 20,
            pb: 16,
            textAlign: 'center',
            fontSize: 36,
            fontWeight: 700,
          }}
        >
          {title}
        </DialogTitle>
        <DialogActions
          sx={{
            display: 'flex',
            justifyContent: 'space-around',
            mb: 6,
          }}
        >
          {
            !timeout && <Button variant="outlined" sx={buttonStyle} onClick={handleClose}>
              {local(examLang.cancel)}
            </Button>
          }
          <Button variant="contained" sx={buttonStyle} onClick={handleConfim} autoFocus>
            {local(examLang.confirm)}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}