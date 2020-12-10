import React from 'react'
import { useHistory } from 'react-router-dom'
import { CSSTransition } from 'react-transition-group'
import { makeStyles } from '@material-ui/core'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import Container from '@material-ui/core/Container'
import Modal from '@material-ui/core/Modal'
import Backdrop from '@material-ui/core/Backdrop'

import NavLink from '../../shared/components/NavLink'
import Button from '../../shared/components/Button'
import Autocomplete from './Autocomplete'

import { ReactComponent as LogoIcon } from '../../shared/icons/013-eye.svg'
import { ReactComponent as SearchIcon } from '../../shared/icons/loupe.svg'

const useStyles = makeStyles(({ palette, spacing }) => ({
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

  // CssTransition - Header
  headerInner: {
    '&.header-enter-active > div': {
      '& div, a, button': {
        animation: `$show-item 400ms 200ms both`,
      },
    },
    '&.header-exit-active > div': {
      '& div, a, button': {
        animation: `$hide-item 400ms both`,
      },
    },
    '&.header-exit-done > div': {
      '& div, a, button': {
        visibility: 'hidden',
      },
    },
  },

  // CssTransition - Modal
  modal: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    outline: 0,
    '&.modal-enter': {
      '& .search-content': {
        opacity: 0,
        pointerEvents: 'none',
      },
    },
    '&.modal-enter-active': {
      '& .search-content': {
        animation: `$fade 400ms 400ms both`,
        pointerEvents: 'none',
      },
      '& .search-content > div': {
        animation: `$input-slide 1000ms 400ms both`,
      },
      '& .search-content #search-autocomplete': {
        opacity: 0,
      },
      '& .close-modal-button': {
        animation: `$button-slide 1000ms 400ms both, 
        $fade 400ms 400ms both`,
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
    '&.modal-exit-active': {
      animation: `$hide 200ms both`,
    },
  },

  // Styles
  root: {
    backgroundColor: palette.background.default,
  },
  headerLogo: {
    padding: spacing(1),
    '& > svg': {
      display: 'block',
      height: spacing(4),
      width: spacing(4),
    },
  },
  brandName: {
    marginLeft: spacing(1),
    marginRight: 'auto',
    '& > h3': {
      cursor: 'default',
      fontWeight: 700,
    },
  },
  navLink: {
    marginLeft: spacing(0.5),
    marginRight: spacing(0.5),
    '& > span': {},
  },
  activeNavLink: {
    '& > span': {
      fontWeight: 700,
      borderBottom: `2px solid ${palette.text.primary}`,
    },
  },
  searchButton: {
    padding: spacing(1.5),
    '& svg': {
      display: 'block',
      height: spacing(3),
      width: spacing(3),
    },
  },
}))

const Header = () => {
  const classes = useStyles()
  const history = useHistory()

  const headerInnerRef = React.useRef(null)
  const searchModalRef = React.useRef(null)
  const autocompleteRef = React.useRef(null)

  const [isModalOpen, setIsModalOpen] = React.useState(false)

  const openModal = () => setIsModalOpen(true)
  const closeModal = () => setIsModalOpen(false)

  return (
    <AppBar className={classes.root} elevation={1} position="fixed">
      <CSSTransition
        nodeRef={headerInnerRef}
        classNames="header"
        in={!isModalOpen}
        timeout={{
          enter: 400,
          exit: 400,
        }}
      >
        <Container ref={headerInnerRef} className={classes.headerInner} maxWidth="xl">
          <Toolbar variant="dense">
            <div className={classes.headerLogo}>
              <LogoIcon />
            </div>
            <div className={classes.brandName}>
              <Typography variant="h5" component="h3">
                FINATIC
              </Typography>
            </div>
            <NavLink
              to="/market"
              className={classes.navLink}
              activeClassName={classes.activeNavLink}
            >
              <Typography variant="body1" component="span">
                MARKET
              </Typography>
            </NavLink>
            <NavLink
              to="/news"
              className={classes.navLink}
              activeClassName={classes.activeNavLink}
            >
              <Typography variant="body1" component="span">
                NEWS
              </Typography>
            </NavLink>
            <Button className={classes.searchButton} onClick={openModal}>
              <SearchIcon />
            </Button>
          </Toolbar>
        </Container>
      </CSSTransition>
      <Modal
        disablePortal
        open={isModalOpen}
        onClose={closeModal}
        keepMounted
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{ invisible: true }}
      >
        <CSSTransition
          nodeRef={searchModalRef}
          classNames="modal"
          in={isModalOpen}
          appear
          mountOnEnter
          unmountOnExit
          timeout={{
            enter: 1250,
            exit: 200,
          }}
          onEntered={() => {
            autocompleteRef.current.focus()
          }}
        >
          <Toolbar ref={searchModalRef} className={classes.modal}>
            <Autocomplete
              ref={autocompleteRef}
              history={history}
              closeModal={closeModal}
            />
          </Toolbar>
        </CSSTransition>
      </Modal>
    </AppBar>
  )
}

export default Header
