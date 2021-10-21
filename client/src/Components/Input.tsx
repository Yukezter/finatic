/* eslint-disable react/jsx-props-no-spreading */
import classNames from 'classnames'
import { makeStyles, createStyles, Theme, OutlinedInputProps } from '@material-ui/core'
import OutlinedInput from '@material-ui/core/OutlinedInput'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      height: 36,
    },
  })
)

export default (props: OutlinedInputProps) => {
  const { className, ...rest } = props
  const classes = useStyles()

  return (
    <OutlinedInput className={classNames(className, classes.root)} fullWidth {...rest} />
  )
}
