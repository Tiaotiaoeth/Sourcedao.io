import React, { useState, useEffect } from 'react'

import { useNavigate } from 'react-router-dom'

import {
  Box,
  Typography,
  ImageListItem,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Button,
} from '@mui/material'

import AccountBoxIcon from '@mui/icons-material/AccountBox'
import AssuredWorkloadIcon from '@mui/icons-material/AssuredWorkload'
import AutoStoriesIcon from '@mui/icons-material/AutoStories'
import AssignmentIcon from '@mui/icons-material/Assignment'

import langHook from '@hooks/localHook'

import { siderLang } from '@langs/index'

import { useAppSelector, useAppDispatch } from '@store/index'

import { disconnectWallet, setDialogOpen } from '@store/modules/wallet'

import LinkOffIcon from '@mui/icons-material/LinkOff'

import logoImg from '@images/sider/logo.png'


export default (): JSX.Element => {

  const [selectedIndex, setSelectedIndex] = useState(-1)

  const local = langHook()

  const { name } = useAppSelector((state) => state.router)
  const { currentWallet, accountAddress } = useAppSelector((state) => state.wallet)

  const dispatch = useAppDispatch()

  const menus = [
    {
      text: local(siderLang.profile),
      icon: <AccountBoxIcon />,
      pathName: '/',
      isConnect: false,
    },
    {
      text: local(siderLang.certification),
      icon: <AssuredWorkloadIcon />,
      pathName: '/certificationCenter',
      isConnect: true,
    },
    {
      text: local(siderLang.academy),
      icon: <AutoStoriesIcon />,
      pathName: '',
      isConnect: true,
    },
    {
      text: local(siderLang.task),
      icon: <AssignmentIcon />,
      pathName: '',
      isConnect: true,
    },
  ]

  const navigate = useNavigate()

  useEffect(() => {
    setSelectedIndex(menus.findIndex(menu => menu.pathName === name))
  }, [name])

  const handleListItemClick = (index: number) => {
    const { pathName, isConnect } = menus[index]
    if (isConnect && !accountAddress) {
      dispatch(setDialogOpen(true))
    } else {
      if (name !== pathName) navigate(pathName)
    }
  }

  return (
    <Box
      sx={{
        width: 300,
        height: '100vh',
        pt: 3,
        backgroundColor: '#fff',
        boxSizing: 'border-box',
        borderRight: '1px solid rgba(0, 0, 0, 0.12)',
        position: 'relative'
      }}
    >
      {/* title */}
      <Box sx={{
        display: 'flex',
        alignItems: 'center',
        mb: 6,
        pl: 2.4,
      }}>
        <ImageListItem sx={{
          width: 40,
          height: 40,
          mr: 1.2,
        }}>
          <img src={logoImg} alt="" />
        </ImageListItem>
        <Typography
          sx={{
            marginBottom: 0,
            fontWeight: 700,
          }}
          variant="h4">
          SourceDAO
        </Typography>

      </Box>
      {/* menu */}
      <Box sx={{ width: '100%', bgcolor: 'background.paper' }}>
        <List component="nav" aria-label="main mailbox folders">
          {
            menus.map((menu, index) => {
              return (
                <ListItemButton
                  key={index}
                  sx={{
                    pt: 2,
                    pb: 2,
                  }}
                  selected={selectedIndex === index}
                  onClick={() => handleListItemClick(index)}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: '38px',
                    }}>
                    {menu.icon}
                  </ListItemIcon>
                  <ListItemText primary={menu.text} />
                </ListItemButton>
              )
            })
          }
        </List>
      </Box>
      {/* disconnect */}
      {
        currentWallet && <Box
          sx={{
            position: 'absolute',
            bottom: 50,
            left: 0,
            right: 0,
          }}
        >
          <Button
            size="large"
            color="inherit"
            sx={{ width: '100%', height: 64 }}
            startIcon={<LinkOffIcon />}
            onClick={() => dispatch(disconnectWallet())}
          >{local(siderLang.disconnect)}</Button>
        </Box>
      }
    </Box>
  )
}