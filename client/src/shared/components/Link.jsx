import { Link } from 'react-router-dom'
import { styled } from '@material-ui/core/styles'

const MyLink = styled(Link)({
  textDecoration: 'none',
  color: 'inherit',
})

const StyledLink = props => {
  return <MyLink {...props} />
}

export default StyledLink
