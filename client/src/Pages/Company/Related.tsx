import React from 'react'
import { AxiosResponse } from 'axios'
import { useQuery } from 'react-query'
import { styled } from '@mui/material'
// import createStyles from '@mui/styles/createStyles'
import Skeleton from '@mui/material/Skeleton'
import Card from '@mui/material/Card'
import CardActionArea from '@mui/material/CardActionArea'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'

import { percent } from '../../Utils/numberFormats'
import { useEventSource } from '../../Hooks'

const PREFIX = 'Related'

const classes = {
  root: `${PREFIX}-root`,
}

const Root = styled('div')(() => ({
  [`&.${classes.root}`]: {},
}))

const RelatedSymbolCard = ({ quote }: { quote: any }) => {
  return (
    <Card>
      <CardActionArea>
        <CardContent>
          <Typography variant='body1'>{quote.companyName}</Typography>
          <Typography variant='body1' noWrap>
            {percent(quote.change)}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  )
}

const RelatedSymbolCardContainer = ({
  skeletons,
  symbols,
}: {
  skeletons: JSX.Element
  symbols: string[]
}) => {
  const symbolsData = React.useMemo(() => symbols.map(symbol => ({ symbol })), [])

  const { isLoading, data } = useEventSource(
    `http://localhost:8001/sse/stock/quote?symbols=${symbols.join(',')}`,
    symbolsData
  )

  return (
    <>
      {isLoading
        ? skeletons
        : data.map(stock => <RelatedSymbolCard quote={stock.data} />)}
    </>
  )
}

export default ({ symbol }: { symbol: string }) => {
  const { isSuccess, data } = useQuery<AxiosResponse<any>, Error>(
    `/stock/${symbol}/peers`
  )

  const skeletons = React.useMemo(
    () => (
      <>
        <Card>
          <Skeleton variant='rectangular' />
        </Card>
        <Card>
          <Skeleton variant='rectangular' />
        </Card>
        <Card>
          <Skeleton variant='rectangular' />
        </Card>
      </>
    ),
    []
  )

  return (
    <Root>
      {!isSuccess ? (
        skeletons
      ) : (
        <RelatedSymbolCardContainer skeletons={skeletons} symbols={data!.data} />
      )}
    </Root>
  )
}
