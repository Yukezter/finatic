import { styled } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'

const MyButton = styled(Button)({
  padding: 0
})

const StyledButton = props => {
  return <MyButton {...props} />
}

export default StyledButton
