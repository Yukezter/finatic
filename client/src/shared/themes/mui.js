import {
  unstable_createMuiStrictModeTheme as createMuiTheme,
  responsiveFontSizes,
} from '@material-ui/core/styles'
// import { sizes } from '../utils/styles'
import './fonts.css'

const theme = {
  breakpoints: {
    values: {
      xs: 320,
      sm: 640,
      md: 768,
      lg: 1024,
      xl: 1180,
    },
  },
  typography: {
    fontFamily: "'Roboto Condensed', sans-serif",
    // h1: {
    //   fontFamily: "'Roboto Condensed', sans-serif",
    //   fontWeight: 400,
    // },
    // h2: {
    //   fontFamily: "'Roboto Condensed', sans-serif",
    //   fontWeight: 400,
    // },
    // h3: {
    //   fontFamily: "'Roboto Condensed', sans-serif",
    //   fontWeight: 400,
    // },
    // h4: {
    //   fontFamily: "'Roboto Condensed', sans-serif",
    //   fontWeight: 400,
    // },
    // h5: {
    //   fontFamily: "'Roboto Condensed', sans-serif",
    //   fontWeight: 400,
    // },
    // h6: {
    //   fontFamily: "'Roboto Condensed', sans-serif",
    //   fontWeight: 400,
    // },
  },
  props: {
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
    MuiButton: {
      root: {
        borderRadius: 0,
        minWidth: 'auto',
        '&&:hover': {
          background: 'initial',
        },
      },
    },
  },
}

const lightTheme = createMuiTheme({
  ...theme,
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
      secondary: 'rgba(8, 7, 8, 0.75)',
    },
  },
})

export default responsiveFontSizes(lightTheme)
