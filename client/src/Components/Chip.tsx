/* eslint-disable react/jsx-props-no-spreading */
import { withStyles, createStyles, Theme, ChipProps } from '@material-ui/core'
import Chip from '@material-ui/core/Chip'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default withStyles((theme: Theme) =>
  createStyles({
    root: {
      marginRight: 4,
      marginBottom: 6,
    },
  })
)((props: ChipProps) => <Chip variant='outlined' size='small' {...props} />)
