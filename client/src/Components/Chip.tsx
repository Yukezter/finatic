/* eslint-disable react/jsx-props-no-spreading */
import Chip, { ChipProps } from '@mui/material/Chip'

// import Link from './Link'

export default <C extends React.ElementType>(props: ChipProps<C, { component: C }>) => (
  <Chip variant='outlined' size='small' {...props} />
)
