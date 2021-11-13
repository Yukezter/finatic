/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react'
import { useHistory } from 'react-router-dom'
import { AxiosResponse } from 'axios'
import { useQuery } from 'react-query'
import { styled } from '@mui/material'
// import createStyles from '@mui/styles/createStyles'
import Skeleton from '@mui/material/Skeleton'
import Grid from '@mui/material/Grid'
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardActionArea from '@mui/material/CardActionArea'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import ChevronLeft from '@mui/icons-material/ChevronLeft'
import ChevronRight from '@mui/icons-material/ChevronRight'

import { percent } from '../../Utils/numberFormats'
import { useEventSource, useQuotes } from '../../Hooks'
import { IconButton } from '../../Components'

const PREFIX = 'Related'

const classes = {
  root: `${PREFIX}-root`,
  cards: `${PREFIX}-cards`,
  card: `${PREFIX}-card`,
  cardSize: `${PREFIX}-cardSize`,
  cardContent: `${PREFIX}-cardContent`,
}

const Root = styled('div')(({ theme }) => ({
  [`&.${classes.root}`]: {
    display: 'flex',
    alignItems: 'center',
  },
  [`& .${classes.cards}`]: {
    width: '100%',
    display: 'flex',
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
    // scrollBehavior: 'smooth',
    /* Hide scrollbar for IE, Edge and Firefox */
    msOverflowStyle: 'none' /* IE and Edge */,
    scrollbarWidth: 'none' /* Firefox */,
    /* Hide scrollbar for Chrome, Safari and Opera */
    '&::-webkit-scrollbar': {
      display: 'none',
    },
  },
  [`& .${classes.card}`]: {
    flexShrink: 0,
    marginRight: theme.spacing(2),
    '&:last-of-type': {
      marginRight: 0,
    },
  },
  [`& .${classes.cardSize}`]: {
    width: 150,
    height: 190,
  },
  [`& .${classes.cardContent}`]: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
}))

const RelatedSymbolCard = ({ history, quote }: { history: any; quote: any }) => {
  return (
    <Card className={classes.card} variant='outlined'>
      <CardActionArea onClick={() => history.push(`/company/${quote.symbol}`)}>
        <CardContent className={`${classes.cardSize} ${classes.cardContent}`}>
          <Typography variant='body1' paragraph>
            {quote.companyName}
          </Typography>
          <Typography variant='body1' noWrap>
            {percent(quote.changePercent)}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  )
}

const RelatedSymbolCardContainer = ({
  skeletonCards,
  setCardsLoading,
  symbols,
}: {
  skeletonCards: JSX.Element
  setCardsLoading: React.Dispatch<React.SetStateAction<boolean>>
  symbols: string[]
}) => {
  const history = useHistory()
  const { isLoading, data } = useQuotes(
    `/sse/stock/quote?symbols=${symbols.join(',')}`,
    symbols
  )

  React.useEffect(() => {
    if (!isLoading) {
      setCardsLoading(false)
    }
  }, [isLoading])

  return (
    <>
      {isLoading
        ? skeletonCards
        : data.map(symbolData => (
            <RelatedSymbolCard
              key={symbolData.symbol}
              history={history}
              quote={symbolData.quote}
            />
          ))}
    </>
  )
}

export default ({ symbol }: { symbol: string }) => {
  const { isSuccess, data } = useQuery<AxiosResponse<any>, Error>(`/stock/${symbol}/peers`)

  const [cardsLoading, setCardsLoading] = React.useState(true)

  const cardsRef = React.useRef<HTMLDivElement>(null)
  const isScrolling = React.useRef(false)

  const scroll = React.useCallback((scrollOffset: number) => {
    cardsRef.current!.scrollLeft += scrollOffset
  }, [])

  const handleOnMouseDown = React.useCallback((scrollOffset: number) => {
    isScrolling.current = true
    const scrollInterval = setInterval(() => {
      console.log('scrolling')
      if (isScrolling.current) {
        scroll(scrollOffset)
      } else {
        clearInterval(scrollInterval)
      }
    }, 100)
  }, [])

  const handleOnMouseUp = React.useCallback(() => {
    isScrolling.current = false
  }, [])

  const skeletonCards = React.useMemo(
    () => (
      <>
        <Card className={classes.card} variant='outlined'>
          <Skeleton className={classes.cardSize} variant='rectangular' />
        </Card>
        <Card className={classes.card} variant='outlined'>
          <Skeleton className={classes.cardSize} variant='rectangular' />
        </Card>
        <Card className={classes.card} variant='outlined'>
          <Skeleton className={classes.cardSize} variant='rectangular' />
        </Card>
        <Card className={classes.card} variant='outlined'>
          <Skeleton className={classes.cardSize} variant='rectangular' />
        </Card>
        <Card className={classes.card} variant='outlined'>
          <Skeleton className={classes.cardSize} variant='rectangular' />
        </Card>
      </>
    ),
    []
  )

  return (
    <section>
      <Typography variant='h5' component='h4' paragraph>
        Related
      </Typography>
      <Root className={classes.root}>
        <IconButton
          size='large'
          sx={{
            display: { xs: 'none', sm: 'flex' },
            marginRight: 1,
          }}
          onMouseDown={() => handleOnMouseDown(-50)}
          onMouseUp={handleOnMouseUp}
          disabled={!isSuccess || cardsLoading}
        >
          <ChevronLeft />
        </IconButton>
        <div
          ref={cardsRef}
          className={classes.cards}
          style={{ overflowX: !isSuccess || cardsLoading ? 'hidden' : 'scroll' }}
        >
          {!isSuccess ? (
            skeletonCards
          ) : (
            <RelatedSymbolCardContainer
              skeletonCards={skeletonCards}
              setCardsLoading={setCardsLoading}
              // symbols={data!.data}
              symbols={['AAPL', 'NVDA', 'F', 'CLNE', 'OCGN', 'SOFI']}
            />
          )}
        </div>
        <IconButton
          size='large'
          sx={{
            display: { xs: 'none', sm: 'flex' },
            marginLeft: 1,
          }}
          onMouseDown={() => handleOnMouseDown(50)}
          onMouseUp={handleOnMouseUp}
          disabled={!isSuccess || cardsLoading}
        >
          <ChevronRight />
        </IconButton>
      </Root>
    </section>
  )
}
