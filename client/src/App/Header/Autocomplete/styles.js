import { makeStyles } from '@material-ui/core'
import { sizes } from '../../../shared/utils/styles'

const useStyles = makeStyles(({ palette, spacing }) => ({
  root: {
    width: '100%',
    maxWidth: sizes.searchBarWidth,
    position: 'relative',
    display: 'flex',
    margin: '0 auto',
    alignSelf: 'flex-start',
  },
  Input: {
    height: sizes.headerHeight,
  },
  underline: {
    '&&&::before, :hover::before, &&&::after': {
      borderBottom: 'none',
    },
  },
  paper: {
    width: '100%',
    position: 'absolute',
    top: sizes.headerHeight - 1,
    overflow: 'hidden',
    zIndex: 1,
    border: `1px solid ${palette.divider}`,
  },
  listbox: {
    width: '100%',
    listStyle: 'none',
    overflow: 'auto',
    maxHeight: 280,
    margin: 0,
    padding: `${spacing(1)}px 0`,
    boxSizing: 'border-box',
    '& > li': {
      display: 'flex',
      outline: 0,
      minHeight: 48,
      cursor: 'pointer',
      alignItems: 'center',
      paddingTop: 6,
      paddingLeft: 16,
      paddingRight: 16,
      paddingBottom: 6,
    },
    '& > li[data-focus="true"]': {
      backgroundColor: 'rgba(0, 0, 0, 0.04)',
    },
    '& > li:active': {
      backgroundColor: 'rgba(0, 0, 0, 0.08)',
    },
  },
  loading: {
    color: 'rgba(8, 7, 8, 0.5)',
    padding: '14px 16px',
  },
}))

export default useStyles
