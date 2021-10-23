/* eslint-disable react/jsx-props-no-spreading */
import React from 'react'
import List, { ListProps } from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemText from '@mui/material/ListItemText'
import Skeleton from '@mui/material/Skeleton'

interface Props extends ListProps {
  list?: any[]
  isLoading: boolean
  numOfSkeletonRows: number
  render: (listItem: any) => JSX.Element
}

export default ({ list, isLoading = true, numOfSkeletonRows = 5, render }: Props) => {
  const renderedSkeletons = React.useMemo(
    () =>
      new Array(numOfSkeletonRows).fill(null).map(() => (
        <ListItem disableGutters divider>
          <ListItemText
            primary={<Skeleton width={80} />}
            secondary={<Skeleton width={60} />}
          />
          <ListItemText primary={<Skeleton />} />
        </ListItem>
      )),
    []
  )

  return <List dense>{isLoading ? renderedSkeletons : list && list.map(render)}</List>
}
