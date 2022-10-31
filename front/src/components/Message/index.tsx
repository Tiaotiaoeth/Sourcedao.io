import React, { useState } from 'react'

import { createRoot } from 'react-dom/client'

import { Snackbar, Alert, Slide } from '@mui/material'

type MessageType = 'success' | 'error' | 'warning' | 'info'

interface MessageProps {
  content: string
  duration: number
  type: MessageType
}

interface Message {
  success: (content: string, duration?: number) => void
  error: (content: string, duration?: number) => void
  warning: (content: string, duration?: number) => void
  info: (content: string, duration?: number) => void
  base: (content: string, duration: number, type: MessageType) => void
}

const Message = ({ content, duration, type }: MessageProps) => {
  const [open, setOpen] = useState(true)
  const handleClose = () => setOpen(false)
  return (
    <Snackbar
      open={open}
      autoHideDuration={duration}
      anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      TransitionComponent={props => <Slide {...props} direction="down" />}
      onClose={handleClose}>
      <Alert severity={type} variant="standard" onClose={handleClose}>
        {content}
      </Alert>
    </Snackbar>
  )
}

const message: Message = {
  success(content, duration = 2000) {
    this.base(content, duration, 'success')
  },
  error(content, duration = 2000) {
    this.base(content, duration, 'error')
  },
  warning(content, duration = 2000) {
    this.base(content, duration, 'warning')
  },
  info(content, duration = 2000) {
    this.base(content, duration, 'info')
  },
  base(content, duration, type) {
    const dom = document.createElement('div')
    const JSXdom = <Message content={content} duration={duration} type={type}></Message>
    createRoot(dom).render(JSXdom)
    document.body.appendChild(dom)
    setTimeout(() => {
      document.body.removeChild(dom)
    }, duration)
  },
}

export default message