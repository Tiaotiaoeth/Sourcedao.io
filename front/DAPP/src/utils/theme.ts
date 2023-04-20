
import { createTheme } from '@mui/material/styles'

declare module '@mui/material/styles' {
  interface Palette {
    navLeft: Palette['primary']
    navRight: Palette['primary']
  }

  // allow configuration using `createTheme`
  interface PaletteOptions {
    navLeft?: PaletteOptions['primary']
    navRight?: PaletteOptions['primary']
  }
}

// Update the Button's color prop options
declare module '@mui/material/Button' {
  interface ButtonPropsColorOverrides {
    navLeft: true
    navRight: true
  }
}

export type Palette = 'navLeft' | 'navRight'

export default createTheme({
  palette: {
    primary: {
      main: '#000000'
    },
    navLeft: {
      main: '#2e7d32',
      contrastText: '#fff',
    },
    navRight: {
      main: '#d32f2f',
      contrastText: '#fff',
    }
  },
  typography: {
    fontFamily: [
      'Space Grotesk',
      'Hiragino Sans GB'
    ].join(','),
    body1: {
      // lineHeight: 2,
    }
  }
})