import { unstable_createMuiStrictModeTheme as createMuiTheme } from '@material-ui/core'
import { sizes } from '../utils/styles'

import '../assets/css/fonts.css'

const fonts = {
  primary: "'Lato', open-sans",
  secondary: "'Montserrat', open-sans",
}

const lightTheme = createMuiTheme({
  breakpoints: {
    values: {
      xs: 320,
      sm: 640,
      md: 768,
      lg: 1024, // or 1000
      xl: 1280,
    },
  },
  palette: {
    background: {
      default: '#f7f4f3',
      paper: '#f7f4f3',
    },
    common: {
      white: '#f7f4f3',
      black: '#080708',
    },
    primary: {
      main: '#fdc600',
    },
    secondary: {
      main: '#b2b6bd',
    },
    text: {
      primary: '#080708',
      secondary: 'rgba(8, 7, 8, 0.5)',
    },
  },
  typography: {
    fontFamily: fonts.primary,
    h1: {
      fontFamily: fonts.secondary,
    },
    h2: {
      fontFamily: fonts.secondary,
    },
    h3: {
      fontFamily: fonts.secondary,
    },
    h4: {
      fontFamily: fonts.secondary,
    },
    h5: {
      fontFamily: fonts.secondary,
    },
    h6: {
      fontFamily: fonts.secondary,
    },
  },
  props: {
    MuiToolbar: {
      variant: 'dense',
    },
    MuiButtonBase: {
      disableRipple: true,
      disableTouchRipple: true,
    },
    MuiButton: {
      disableRipple: true,
      disableFocusRipple: true,
      disableTouchRipple: true,
      disableElevation: true,
    },
  },
  overrides: {
    MuiToolbar: {
      root: {
        height: sizes.headerHeight,
      },
    },
    MuiIconButton: {
      root: {
        borderRadius: 0,
        '&&:hover': {
          background: 'initial',
        },
      },
    },
  },
})

export { lightTheme }
