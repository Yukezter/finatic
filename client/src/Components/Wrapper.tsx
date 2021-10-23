/* eslint-disable @typescript-eslint/no-unused-vars */
import { createStyles, styled } from '@mui/material'
import Container, { ContainerProps } from '@mui/material/Container'

const StyledContainer = styled(Container)(({ theme }) =>
  createStyles({
    // overflow: 'hidden',
    [theme.breakpoints.up('sm')]: {
      maxWidth: theme.breakpoints.values.sm + 80,
    },
    [theme.breakpoints.up('lg')]: {
      maxWidth: theme.breakpoints.values.md,
    },
  })
)

export default ({ children, ...props }: ContainerProps) => (
  // eslint-disable-next-line react/jsx-props-no-spreading
  <StyledContainer maxWidth='md' disableGutters {...props}>
    {children}
  </StyledContainer>
)
