import { makeStyles } from '@material-ui/core'
import { css, sizes, durations } from '../../shared/utils/styles'

export default makeStyles(({ palette, spacing, breakpoints }) => ({
  root: {
    '&::after': {
      ...css.borderBottom(palette.divider),
    },
    '& .container': {
      width: '100%',
      margin: '0 auto',
      maxWidth: breakpoints.values.xl,
    },
    '& .menu-item': {
      height: sizes.headerHeight,
      '&:hover': {
        color: palette.primary.main,
      },
      '&.brand': {
        marginRight: 'auto',
      },
      '& > .link, > .search-button': {
        height: sizes.headerHeight,
        padding: `${spacing(1.5)}px ${spacing(1)}px`,
      },
      '& > .link': {
        display: 'flex',
        alignItems: 'center',
      },
    },

    // CssTransition - Header

    // Enter
    '& .header-enter-active a, .header-enter-active button': {
      animation: `$show-item ${durations.header.enter}ms ${durations.modal.exit}ms both`,
    },
    // Exit
    '& .header-exit-active a, .header-exit-active button': {
      animation: `$hide-item ${durations.header.enter}ms both`,
    },
    '& .header-exit-done a, .header-exit-done button': {
      visibility: 'hidden',
    },
  },
  modal: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    outline: 0,

    // CssTransition - Modal

    // Enter
    '&.modal-enter': {
      '& .search-content': {
        opacity: 0,
        pointerEvents: 'none',
      },
    },
    '&.modal-enter-active': {
      '& .search-content': {
        animation: `$fade ${durations.header.exit}ms ${durations.header.exit}ms both`,
        pointerEvents: 'none',
      },
      '& .search-content > div': {
        animation: `$input-slide ${durations.modal.enter}ms ${durations.header.exit}ms both`,
      },
      '& .search-content #search-autocomplete': {
        opacity: 0,
      },
      '& .close-modal-button': {
        animation: `$button-slide ${durations.modal.enter}ms ${durations.header.exit}ms both, 
        $fade ${durations.header.exit}ms ${durations.header.exit}ms both`,
      },
    },
    '&.modal-enter-done': {
      '& .search-content': {
        pointerEvents: 'auto',
      },
      '& .search-content #search-autocomplete': {
        opacity: 1,
        transition: 'opacity 200ms',
      },
    },
    // Exit
    '&.modal-exit-active': {
      animation: `$hide ${durations.modal.exit}ms both`,
    },
  },

  // Animations
  '@keyframes hide-item': {
    '0%': {
      opacity: 1,
      transform: 'none',
      animationTimingFunction: 'cubic-bezier(0.2727, 0.0986, 0.8333, 1)',
    },
    '40%': {
      opacity: 1,
    },
    '100%': {
      opacity: 0,
      transform: 'scale(0.7)',
    },
  },
  '@keyframes show-item': {
    '0%': {
      opacity: 0,
      transform: 'scale(0.7)',
    },
    '60%': {
      opacity: 1,
    },
    '100%': {
      opacity: 1,
      transform: 'none',
      animationTimingFunction: 'cubic-bezier(0.2727, 0.0986, 0.8333, 1)',
    },
  },
  '@keyframes fade': {
    '0%': {
      opacity: 0,
      animationTimingFunction: 'cubic-bezier(0.67, 0, 0.33, 1)',
    },
    '100%': {
      opacity: 1,
    },
  },
  '@keyframes input-slide': {
    '0%': {
      transform: 'translate3d(100px, 0, 0)',
      animationTimingFunction: 'cubic-bezier(0.12, 0.87, 0.15, 1)',
    },
    '100%': {
      transform: 'translateZ(0)',
    },
  },
  '@keyframes button-slide': {
    '0%': {
      transform: 'translate3d(10px, 0, 0)',
      animationTimingFunction: 'cubic-bezier(0.12, 0.87, 0.15, 1)',
    },
    '100%': {
      transform: 'translateZ(0)',
    },
  },
  '@keyframes hide': {
    '0%': {
      opacity: 1,
      animationTimingFunction: 'ease',
    },
    '100%': {
      opacity: 0,
    },
  },
}))
