import { ReactComponent as ArrowIcon } from '../icons/arrow.svg'

const Arrow = ({ up, style = {} }) => (
  <ArrowIcon
    style={{
      minWidth: 12,
      height: 12,
      width: 12,
      transform: `rotate(${up ? 0 : 180}deg)`,
      fill: up ? '#5fd435' : '#ed0000',
      ...style,
    }}
  />
)

export default Arrow
