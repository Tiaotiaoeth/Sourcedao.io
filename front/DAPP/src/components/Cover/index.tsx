import React from 'react'

import { Box, Typography } from '@mui/material'

interface CoverProps {
  name: string
  typeId: number
  handleClick?: (name: string, typeId: number) => void
  scale?: number
}

export default ({
  name,
  typeId,
  handleClick,
  scale = 1,
}: CoverProps): JSX.Element => {
  return (
    <Box
      sx={{
        width: 166,
        height: 210,
        backgroundColor: '#000',
        borderRadius: 2,
        boxSizing: 'border-box',
        pt: 4,
        pl: 1,
        pr: 1,
        cursor: handleClick ? 'pointer' : 'auto',
        transform: `scale(${scale})`,
        transformOrigin: 'left top',
      }}
      onClick={() => handleClick && handleClick(name, typeId)}
    >
      <Typography
        sx={{
          textAlign: 'center',
          color: '#fff',
          fontSize: '12px',
          fontFamily: 'Alfa Slab One',
        }}
      >
        {name}
      </Typography>
    </Box>
  )
}
