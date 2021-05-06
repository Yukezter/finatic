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
      // xs: 320,
      // sm: 640,
      // md: 992,
      // lg: 1180,
      // xl: 1312,
    },
  },
  typography: {
    fontSize: 13,
    fontFamily: "'Dosis', sans-serif",
    h1: {
      lineHeight: 1,
    },
    h2: {
      lineHeight: 1,
    },
    h3: {
      lineHeight: 1,
    },
    h4: {
      lineHeight: 1.2,
    },
    h5: {
      lineHeight: 1.2,
    },
    h6: {
      lineHeight: 1.2,
    },
    body1: {
      fontFamily: "'Open Sans', sans-serif",
      lineHeight: 1.65,
    },
    body2: {
      fontFamily: "'Open Sans', sans-serif",
      lineHeight: 1.65,
    },
    subtitle1: {
      fontFamily: "'Open Sans', sans-serif",
      lineHeight: 1.65,
    },
    subtitle2: {
      fontFamily: "'Open Sans', sans-serif",
      lineHeight: 1.65,
    },
    caption: {
      fontFamily: "'Open Sans', sans-serif",
      lineHeight: 1.65,
    },
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
    MuiCssBaseline: {
      '@global': {
        '::selection': {
          background: '#fdc600',
        },
      },
    },
    MuiButton: {
      root: {
        borderRadius: 0,
        minWidth: 'auto',
        '&&&:hover': {
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
      // main: '#b2b6bd',
      main: '#d2d4d9',
    },
    text: {
      primary: '#080708',
      secondary: 'rgba(8, 7, 8, 0.75)',
    },
  },
})

export default responsiveFontSizes(lightTheme)
