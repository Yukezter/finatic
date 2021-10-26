import {
  // unstable_createMuiStrictModeTheme as createTheme,
  createTheme,
  responsiveFontSizes,
  ThemeOptions,
} from '@mui/material/styles'

// declare module '@mui/material/styles' {
//   interface BreakpointOverrides {
//     xs: false; // removes the `xs` breakpoint
//     sm: false;
//     md: false;
//     lg: false;
//     xl: false;
//     mobile: true; // adds the `mobile` breakpoint
//     tablet: true;
//     laptop: true;
//     desktop: true;
//   }

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
      md: 1024,
      lg: 1200,
      xl: 1536,
      // mobile: 0,
      // tablet: 640,
      // laptop: 1024,
      // desktop: 1200,
    },
  },
  palette: {
    background: {},
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
  components: {
    MuiCssBaseline: {
      styleOverrides: {
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
        // html: {
        //   scrollBehavior: 'smooth',
        // },
        a: {
          textDecorationColor: 'inherit',
          color: 'inherit',
        },
      },
    },
    MuiUseMediaQuery: {
      defaultProps: {
        noSsr: true,
      },
    },
    MuiButtonBase: {
      defaultProps: {
        disableRipple: true,
        disableTouchRipple: true,
      },
    },
    MuiButton: {
      defaultProps: {
        disableElevation: true,
      },
    },
    MuiLink: {
      defaultProps: {
        underline: 'none',
      },
    },
    MuiPaper: {
      defaultProps: {
        color: 'inherit',
      },
    },
  },
}

export const light = responsiveFontSizes(createTheme(themeOptions))

themeOptions.palette!.mode = 'dark'
themeOptions.palette!.background!.default = colors.secondary
themeOptions.palette!.background!.paper = light.palette.secondary.dark

export const dark = responsiveFontSizes(createTheme(themeOptions))
