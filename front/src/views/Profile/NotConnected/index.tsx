import React from 'react'

import {
  Box,
  Typography,
  Grid,
  Paper,
  Button,
} from '@mui/material'

import { useAppDispatch } from '@store/index'
import { setDialogOpen } from '@store/modules/wallet'

import langHook from '@hooks/localHook'

import { profileLang, headerLang } from '@langs/index'


export default (): JSX.Element => {

  const dispatch = useAppDispatch()

  const local = langHook()

  const list = [
    {
      title: profileLang.certification,
      subTitle: profileLang.finishSBT,
    },
    {
      title: profileLang.contribution,
      subTitle: profileLang.rewards,
    },
    {
      title: profileLang.more,
      subTitle: profileLang.relations,
    },
  ]

  return (
    <Box sx={{
      margin: 'auto',
      pt: 10,
      textAlign: 'center'
    }}>
      {/* title */}
      <Typography
        variant="h3"
        sx={{
          mb: 2,
        }}
      >
        SourceDAO
      </Typography>
      {/* subTitle */}
      <Typography
        variant="h6"
        sx={{
          mb: 4,
        }}
      >
        {local(profileLang.subTitle)}
      </Typography>
      {/* list */}
      <Box sx={{
        ml: 15,
        mr: 15,
        mb: 10,
      }}>
        <Grid container spacing={4}>
          {
            list.map((item, index) => {
              return (
                <Grid item xs={4} key={index}>
                  <Paper sx={{
                    textAlign: 'center',
                    pt: 6,
                    pb: 8,
                  }}>
                    <Typography
                      variant="body1"
                      sx={{
                        mb: 4,
                      }}
                    >
                      {local(item.title)}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        color: '#999',
                      }}
                    >
                      {local(item.subTitle)}
                    </Typography>
                  </Paper>
                </Grid>
              )
            })
          }
        </Grid>
      </Box>
      {/* button */}
      <Button
        variant="contained"
        sx={{
          width: 200,
          height: 60,
        }}
        onClick={() => dispatch(setDialogOpen(true))}
      >
        {local(headerLang.wallet)}
      </Button>
    </Box>
  )
}