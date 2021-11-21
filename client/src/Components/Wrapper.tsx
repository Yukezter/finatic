/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react'
import { createStyles, styled } from '@mui/material'
import Container, { ContainerProps } from '@mui/material/Container'

const StyledContainer = styled(Container)(({ theme }) =>
  createStyles({
    display: 'flex',
    [theme.breakpoints.up('sm')]: {
      maxWidth: theme.breakpoints.values.sm,
    },
    [theme.breakpoints.up('lg')]: {
      maxWidth: theme.breakpoints.values.md,
    },
  })
)

export default React.forwardRef(({ children, ...props }: ContainerProps, ref) => (
  <Container ref={ref as React.Ref<HTMLDivElement>} maxWidth={false} {...props}>
    <StyledContainer maxWidth='md' disableGutters>
      {children}
    </StyledContainer>
  </Container>
))
