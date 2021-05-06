import clsx from 'clsx'
import { makeStyles } from '@material-ui/core'

const useStyles = makeStyles(({ spacing }) => ({
  root: ({ padding }) => ({
    padding: padding ? padding : spacing(1),
  }),
  icon: ({ height, width, display }) => ({
    height: height ? height : spacing(2.5),
    width: width ? width : spacing(2.5),
    display: display ? display : 'block',
    fill: 'currentColor',
    color: 'rgba(0, 0, 0, 0.54)',
  }),
}))

const Icon = ({ Icon, classes: { root, icon } = {}, ...props }) => {
  const defaultClasses = useStyles(props)

  return (
    <div className={clsx(defaultClasses.root, root && root)}>
      <Icon className={clsx(defaultClasses.icon, icon && icon)} {...props} />
    </div>
  )
}

export default Icon
