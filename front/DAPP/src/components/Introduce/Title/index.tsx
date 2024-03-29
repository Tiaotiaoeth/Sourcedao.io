import React from 'react'

import {
  DialogTitle,
  IconButton,
} from '@mui/material'

import CloseIcon from '@mui/icons-material/Close'

interface DialogTitleProps {
  children?: React.ReactNode;
  onClose: () => void;
}

export default (props: DialogTitleProps): JSX.Element => {

  const { children, onClose, ...other } = props

  return (
    <DialogTitle sx={{ m: 0, p: 3 }} {...other}>
      {children}
      {onClose ? (
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </DialogTitle>
  )
}