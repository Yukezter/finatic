import { NavLink } from 'react-router-dom'
import { styled } from '@material-ui/core/styles'

const MyNavLink = styled(NavLink)({
  textDecoration: 'none',
  color: 'inherit',
})

const StyledNavLink = props => {
  return <MyNavLink {...props} />
}

export default StyledNavLink
