/* eslint-disable react/jsx-props-no-spreading */
import React from 'react'
import List, { ListProps } from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import Skeleton from '@material-ui/lab/Skeleton'

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
