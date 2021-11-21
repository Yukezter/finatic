/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react'
import { useHistory } from 'react-router-dom'
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
import { GlobalState } from '../../Context/Global'

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
    // paddingTop: theme.spacing(1),
    // paddingBottom: theme.spacing(1),
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
    '&:first-of-type': {
      marginLeft: 2,
    },
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

type RelatedSymbolsCardProps = {
  history: any
  peer: string
  quote: { [key: string]: any } | undefined
}

const RelatedSymbolCard = ({ history, peer, quote }: RelatedSymbolsCardProps) => {
  return (
    <Box p={1}>
      <Card className={classes.card} elevation={2}>
        <CardActionArea onClick={() => history.push(`/company/${peer}`)}>
          <CardContent className={`${classes.cardSize} ${classes.cardContent}`}>
            <Typography variant='body1' paragraph>
              {peer}
            </Typography>
            <Typography variant='body1' color='primary' fontWeight='600' noWrap>
              {!quote || !!'' ? (
                <Skeleton variant='rectangular' />
              ) : (
                percent(quote.changePercent)
              )}
            </Typography>
          </CardContent>
        </CardActionArea>
      </Card>
    </Box>
  )
}

const fallbackSymbols = ['AAPL', 'NVDA', 'F', 'CLNE', 'OCGN', 'SOFI', 'PSFE', 'MSFT', 'UEC']

export default ({ globalState, symbol }: { globalState: GlobalState; symbol: string }) => {
  const history = useHistory()
  const { refSymbolsMap } = globalState

  const [peerQuotes, setPeerQuotes] = React.useState<
    { peer: string; quote: { [key: string]: any } | undefined }[]
  >([])

  const { isSuccess, data: peers } = useQuery<any>(`/stock/${symbol}/peers`, {
    notifyOnChangeProps: 'tracked',
    select: data => {
      // return data.filter((peer: string) => refSymbolsMap.has(peer))
      return fallbackSymbols
    },
  })

  React.useEffect(() => {
    if (peers) {
      setPeerQuotes(
        peers.map((peer: string) => {
          return { peer, quote: undefined }
        })
      )
    }
  }, [peers])

  React.useEffect(() => {
    let es: EventSource

    if (peers) {
      es = new EventSource(`/sse/stock/quote?symbols=${peers.join(',')}`)

      es.onmessage = event => {
        const quote = (JSON.parse(event.data) || [])[0]

        if (quote) {
          setPeerQuotes(prevPeerQuotes => {
            return prevPeerQuotes.map(peerQuote => {
              if (peerQuote.peer === quote.symbol) {
                peerQuote.quote = quote
              }

              return peerQuote
            })
          })
        }
      }
    }

    return () => {
      if (es) {
        es.close()
      }
    }
  }, [peers])

  const cardsContainerRef = React.useRef<HTMLDivElement>(null)

  const getVisibleCards = React.useCallback((container: HTMLDivElement) => {
    const containerWidth = container.offsetWidth
    const containerLeft = container.scrollLeft
    const containerRight = containerLeft + containerWidth

    const cards = Array.from(container.children) as HTMLDivElement[]
    const visibleCards: HTMLDivElement[] = []

    cards.forEach(card => {
      const cardWidth = card.offsetWidth
      const cardLeft = card.offsetLeft - container.offsetLeft
      const cardRight = cardLeft + cardWidth

      if (cardLeft >= containerLeft && cardRight - 4 <= containerRight) {
        visibleCards.push(card)
      }
    })

    return visibleCards
  }, [])

  const scrollElementIntoView = React.useCallback((element: Element) => {
    element.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest',
      inline: 'center',
    })
  }, [])

  const handlePrev = React.useCallback(() => {
    if (cardsContainerRef.current) {
      const visibleCards = getVisibleCards(cardsContainerRef.current)

      if (visibleCards.length) {
        const firstVisibleCard = visibleCards[0]
        if (firstVisibleCard.previousElementSibling) {
          scrollElementIntoView(firstVisibleCard.previousElementSibling)
        }
      }
    }
  }, [])

  const handleNext = React.useCallback(() => {
    if (cardsContainerRef.current) {
      const visibleCards = getVisibleCards(cardsContainerRef.current)

      if (visibleCards.length) {
        const lastVisibleCard = visibleCards[visibleCards.length - 1]
        if (lastVisibleCard.nextElementSibling) {
          scrollElementIntoView(lastVisibleCard.nextElementSibling)
        }
      }
    }
  }, [])

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
          onClick={handlePrev}
          disabled={!isSuccess}
        >
          <ChevronLeft />
        </IconButton>
        <div
          ref={cardsContainerRef}
          className={classes.cards}
          style={{ overflowX: !isSuccess ? 'hidden' : 'scroll' }}
        >
          {!isSuccess || !peerQuotes.length
            ? Array.from(new Array(5)).map((_, index) => (
                // eslint-disable-next-line react/no-array-index-key
                <Box key={index} p={1}>
                  <Card className={classes.card} elevation={2}>
                    <Skeleton className={classes.cardSize} variant='rectangular' />
                  </Card>
                </Box>
              ))
            : peerQuotes.map(({ peer, quote }) => (
                <RelatedSymbolCard key={peer} history={history} peer={peer} quote={quote} />
              ))}
        </div>
        <IconButton
          size='large'
          sx={{
            display: { xs: 'none', sm: 'flex' },
            marginLeft: 1,
          }}
          onClick={handleNext}
          disabled={!isSuccess}
        >
          <ChevronRight />
        </IconButton>
      </Root>
    </section>
  )
}

/* eslint-disable @typescript-eslint/no-unused-vars */
// import React from 'react'
// import { useHistory } from 'react-router-dom'
// import { useQuery } from 'react-query'
// import { styled } from '@mui/material'
// // import createStyles from '@mui/styles/createStyles'
// import Skeleton from '@mui/material/Skeleton'
// import Grid from '@mui/material/Grid'
// import Box from '@mui/material/Box'
// import Card from '@mui/material/Card'
// import CardActionArea from '@mui/material/CardActionArea'
// import CardContent from '@mui/material/CardContent'
// import Typography from '@mui/material/Typography'
// import ChevronLeft from '@mui/icons-material/ChevronLeft'
// import ChevronRight from '@mui/icons-material/ChevronRight'

// import { percent } from '../../Utils/numberFormats'
// import { useEventSource, useQuotes } from '../../Hooks'
// import { IconButton } from '../../Components'
// import { GlobalState } from '../../Context/Global'

// const PREFIX = 'Related'

// const classes = {
//   root: `${PREFIX}-root`,
//   cards: `${PREFIX}-cards`,
//   card: `${PREFIX}-card`,
//   cardSize: `${PREFIX}-cardSize`,
//   cardContent: `${PREFIX}-cardContent`,
// }

// const Root = styled('div')(({ theme }) => ({
//   [`&.${classes.root}`]: {
//     display: 'flex',
//     alignItems: 'center',
//   },
//   [`& .${classes.cards}`]: {
//     width: '100%',
//     display: 'flex',
//     padding: `${theme.spacing(1)} 2px`,
//     // scrollBehavior: 'smooth',
//     /* Hide scrollbar for IE, Edge and Firefox */
//     msOverflowStyle: 'none' /* IE and Edge */,
//     scrollbarWidth: 'none' /* Firefox */,
//     /* Hide scrollbar for Chrome, Safari and Opera */
//     '&::-webkit-scrollbar': {
//       display: 'none',
//     },
//   },
//   [`& .${classes.card}`]: {
//     flexShrink: 0,
//     marginRight: theme.spacing(2),
//     '&:last-of-type': {
//       marginRight: 0,
//     },
//   },
//   [`& .${classes.cardSize}`]: {
//     width: 150,
//     height: 190,
//   },
//   [`& .${classes.cardContent}`]: {
//     display: 'flex',
//     flexDirection: 'column',
//     justifyContent: 'space-between',
//   },
// }))

// const RelatedSymbolCard = ({
//   history,
//   quote = {},
// }: {
//   history: ReturnType<typeof useHistory>
//   quote: any
// }) => {
//   return (
//     <Card className={classes.card} elevation={2}>
//       <CardActionArea
//         disabled={!quote.symbol}
//         onClick={() => history.push(`/company/${quote.symbol}`)}
//       >
//         <CardContent className={`${classes.cardSize} ${classes.cardContent}`}>
//           <Typography variant='body1' paragraph>
//             {quote.companyName}
//           </Typography>
//           <Typography variant='body1' color='primary' fontWeight='600' noWrap>
//             {percent(quote.changePercent)}
//           </Typography>
//         </CardContent>
//       </CardActionArea>
//     </Card>
//   )
// }

// const RelatedSymbolCardContainer = ({
//   skeletonCards,
//   setCardsLoading,
//   symbols,
// }: {
//   skeletonCards: JSX.Element
//   setCardsLoading: React.Dispatch<React.SetStateAction<boolean>>
//   symbols: string[]
// }) => {
//   const history = useHistory()
//   const { isLoading, data } = useQuotes(
//     `/stock/quote`,
//     symbols.map(symbol => ({ symbol }))
//   )

//   React.useEffect(() => {
//     if (!isLoading) {
//       setCardsLoading(false)
//     }
//   }, [isLoading])

//   // const messageEventCallback = React.useCallback((event: MessageEvent) => {
//   //   const { quote } = (JSON.parse(event.data) || [])[0] || {}

//   //   if (quote) {

//   //   }
//   // }, [])

//   // useEventSource(`/stock/quote?symbols=${symbols.join}`, messageEventCallback)

//   return (
//     <>
//       {isLoading
//         ? skeletonCards
//         : data.map(symbolData => (
//             <RelatedSymbolCard
//               key={symbolData.symbol}
//               history={history}
//               quote={symbolData.data}
//             />
//           ))}
//     </>
//   )
// }

// const fallbackSymbols = ['AAPL', 'NVDA', 'F', 'CLNE', 'OCGN', 'SOFI']

// export default ({ globalState, symbol }: { globalState: GlobalState; symbol: string }) => {
//   const { refSymbolsMap } = globalState
//   const { isSuccess, data } = useQuery<any>(`/stock/${symbol}/peers`)

//   const [cardsLoading, setCardsLoading] = React.useState(true)

//   const cardsRef = React.useRef<HTMLDivElement>(null)
//   const isScrolling = React.useRef(false)

//   const scroll = React.useCallback((scrollOffset: number) => {
//     cardsRef.current!.scrollLeft += scrollOffset
//   }, [])

//   const cardsContainerRef = React.useRef<HTMLDivElement>()
//   const observerRef = React.useRef<IntersectionObserver>()

//   const setCardsContainerRef: React.RefCallback<HTMLDivElement> = React.useCallback(
//     cardsContainer => {
//       if (cardsContainer) {
//         cardsContainerRef.current = cardsContainer

//         const observer = new IntersectionObserver(
//           entries => {
//             console.log(entries)
//           },
//           { root: cardsContainer }
//         )

//         observerRef.current = observer
//         ;[...cardsContainerRef.current.children].forEach(card => {
//           console.log('child')
//           observer.observe(card)
//         })
//       } else if (cardsContainerRef.current && observerRef.current) {
//         observerRef.current.unobserve(cardsContainerRef.current)
//       }
//     },
//     []
//   )

//   const handleOnMouseDown = React.useCallback((scrollOffset: number) => {
//     isScrolling.current = true
//     const scrollInterval = setInterval(() => {
//       console.log('scrolling')
//       if (isScrolling.current) {
//         scroll(scrollOffset)
//       } else {
//         clearInterval(scrollInterval)
//       }
//     }, 100)
//   }, [])

//   const handleOnMouseUp = React.useCallback(() => {
//     isScrolling.current = false
//   }, [])

//   const skeletonCards = React.useMemo(
//     () => (
//       <>
//         {Array.from(new Array(5)).map((_, index) => (
//           // eslint-disable-next-line react/no-array-index-key
//           <Card key={index} className={classes.card} variant='outlined'>
//             <Skeleton className={classes.cardSize} variant='rectangular' />
//           </Card>
//         ))}
//       </>
//     ),
//     []
//   )

//   const symbols = React.useMemo(() => {
//     if (!data) return []
//     // eslint-disable-next-line @typescript-eslint/no-shadow
//     const validated = data.filter((symbol: any) => refSymbolsMap.has(symbol))
//     return validated.length < 4 ? [...validated, ...fallbackSymbols] : data
//   }, [data, refSymbolsMap])

//   return (
//     <section>
//       <Typography variant='h5' component='h4' paragraph>
//         Related
//       </Typography>
//       <Root className={classes.root}>
//         <IconButton
//           size='large'
//           sx={{
//             display: { xs: 'none', sm: 'flex' },
//             marginRight: 1,
//           }}
//           onMouseDown={() => handleOnMouseDown(-50)}
//           onMouseUp={handleOnMouseUp}
//           disabled={!isSuccess || cardsLoading}
//         >
//           <ChevronLeft />
//         </IconButton>
//         <div
//           ref={setCardsContainerRef}
//           className={classes.cards}
//           style={{ overflowX: !isSuccess || cardsLoading ? 'hidden' : 'scroll' }}
//         >
//           <RelatedSymbolCardContainer
//               skeletonCards={skeletonCards}
//               setCardsLoading={setCardsLoading}
//               symbols={symbols}
//             />
//         </div>
//         <IconButton
//           size='large'
//           sx={{
//             display: { xs: 'none', sm: 'flex' },
//             marginLeft: 1,
//           }}
//           onMouseDown={() => handleOnMouseDown(50)}
//           onMouseUp={handleOnMouseUp}
//           disabled={!isSuccess || cardsLoading}
//         >
//           <ChevronRight />
//         </IconButton>
//       </Root>
//     </section>
//   )
// }
