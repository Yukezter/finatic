/* eslint-disable react/jsx-props-no-spreading */
import { styled, createStyles } from '@mui/material/styles'
import Chip, { ChipProps } from '@mui/material/Chip'

const PREFIX = 'Chip'

const classes = {
  root: `${PREFIX}-root`,
}

const StyledChip = styled(Chip)(() =>
  createStyles({
    [`.${classes.root}`]: {
      marginRight: 4,
      marginBottom: 6,
    },
  })
)

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default (props: ChipProps) => (
  <StyledChip variant='outlined' size='small' {...props} />
)
