import {
  // unstable_createMuiStrictModeTheme as createTheme,
  createTheme,
  responsiveFontSizes,
  ThemeOptions,
} from '@material-ui/core/styles'

const fonts = {
  primary: "'Dosis', sans-serif",
}

const colors = {
  white: '#fbfbfb',
  black: '#000000',
  primary: '#ffc800',
  secondary: '#1b374c',
  red: '#ff0000',
  green: '#18dc6b',
}

const themeOptions: ThemeOptions = {
  breakpoints: {
    values: {
      xs: 0,
      sm: 640,
      md: 960,
      lg: 1280,
      xl: 1920,
    },
  },
  palette: {
    background: {
      // default: colors.secondary,
      // paper: colors.secondary,
    },
    common: {
      white: colors.white,
      black: colors.black,
    },
    primary: {
      main: colors.primary,
    },
    secondary: {
      main: colors.secondary,
    },
    warning: {
      main: colors.red,
    },
    success: {
      main: colors.green,
    },
  },
  typography: {
    fontSize: 15,
    h1: {
      fontFamily: fonts.primary,
      fontWeight: 600,
      fontSize: '3.583rem',
      lineHeight: 1.2,
      letterSpacing: 0,
    },
    h2: {
      fontFamily: fonts.primary,
      fontWeight: 600,
      fontSize: '2.986rem',
      lineHeight: 1.2,
      letterSpacing: 0,
    },
    h3: {
      fontFamily: fonts.primary,
      fontWeight: 600,
      fontSize: '2.488rem',
      lineHeight: 1.2,
      letterSpacing: 0,
    },
    h4: {
      fontFamily: fonts.primary,
      fontWeight: 600,
      fontSize: '2.074rem',
      lineHeight: 1.2,
      letterSpacing: 0,
    },
    h5: {
      fontFamily: fonts.primary,
      fontWeight: 600,
      lineHeight: 1.2,
      letterSpacing: 0,
    },
    h6: {
      fontFamily: fonts.primary,
      fontWeight: 600,
      lineHeight: 1.2,
      letterSpacing: 0,
    },
  },
  overrides: {
    MuiCssBaseline: {
      '@global': {
        ':root': {
          '--white': colors.white,
          '--black': colors.black,
          '--primary': colors.primary,
          '--secondary': colors.secondary,
          '--red': colors.red,
          '--green': colors.green,
        },
        '::selection': {
          background: 'var(--primary)',
        },
        a: {
          textDecorationColor: 'inherit',
          color: 'inherit',
        },
      },
    },
  },
  props: {
    MuiUseMediaQuery: {
      noSsr: true,
    },
    MuiButtonBase: {
      disableRipple: true,
      disableTouchRipple: true,
    },
    MuiButton: {
      disableElevation: true,
    },
    MuiLink: {
      underline: 'none',
    },
    MuiPaper: {
      color: 'inherit',
    },
  },
}

export const light = responsiveFontSizes(createTheme(themeOptions))

themeOptions.palette!.type = 'dark'
themeOptions.palette!.background!.default = colors.secondary

export const dark = responsiveFontSizes(createTheme(themeOptions))
