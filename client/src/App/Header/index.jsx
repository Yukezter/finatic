import React from 'react'
import { useHistory } from 'react-router-dom'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import IconButton from '@material-ui/core/IconButton'
import Modal from '@material-ui/core/Modal'
import Backdrop from '@material-ui/core/Backdrop'
import Container from '@material-ui/core/Container'
import { CSSTransition } from 'react-transition-group'

import { ReactComponent as MarketIcon } from '../../shared/assets/icons/money-bag.svg'
import { ReactComponent as NewsIcon } from '../../shared/assets/icons/glasses.svg'
import { ReactComponent as SearchIcon } from '../../shared/assets/icons/magnifying-glass.svg'
import Link from '../../shared/components/Link'
import Icon from '../../shared/components/Icon'
import Autocomplete from './Autocomplete'

import { durations } from '../../shared/utils/styles'
import useStyles from './styles'

const Header = () => {
  const classes = useStyles()
  const history = useHistory()

  const headerRef = React.useRef(null)
  const searchRef = React.useRef(null)
  const autocompleteRef = React.useRef(null)

  const [isModalOpen, setIsModalOpen] = React.useState(false)

  const openModal = () => setIsModalOpen(true)
  const closeModal = () => setIsModalOpen(false)

  console.log('Header')

  return (
    <AppBar
      className={classes.root}
      color='inherit'
      position='fixed'
      elevation={0}
    >
      <CSSTransition
        nodeRef={headerRef}
        classNames='header'
        in={!isModalOpen}
        timeout={durations.header}
      >
        <Container ref={headerRef} maxWidth='lg' disableGutters>
          <Toolbar>
            <div className='menu-item brand'>
              <Link className='link brand' to='/'>
                <Typography variant='h5'>FINATIC</Typography>
              </Link>
            </div>
            <div className='menu-item'>
              <Link className='link' to='/market'>
                <Icon icon={MarketIcon} />
              </Link>
            </div>
            <div className='menu-item'>
              <Link className='link' to='/news'>
                <Icon icon={NewsIcon} />
              </Link>
            </div>
            <div className='menu-item'>
              <IconButton
                classes={{ root: 'search-button' }}
                color='inherit'
                onClick={openModal}
              >
                <Icon icon={SearchIcon} />
              </IconButton>
            </div>
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
          nodeRef={searchRef}
          classNames='modal'
          in={isModalOpen}
          timeout={durations.modal}
          appear
          mountOnEnter
          unmountOnExit
          onEntered={() => autocompleteRef.current.focus()}
        >
          <Toolbar ref={searchRef} className={classes.modal}>
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
