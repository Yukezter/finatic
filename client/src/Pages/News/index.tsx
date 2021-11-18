import React from 'react'
import { styled } from '@mui/material/styles'
import { useQuery } from 'react-query'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import Container from '@mui/material/Container'
import Hidden from '@mui/material/Hidden'
import Skeleton from '@mui/material/Skeleton'
import Stack from '@mui/material/Stack'

import { GlobalContext } from '../../Context/Global'
import { Chip, Button, RouterLink, Link } from '../../Components'

const PREFIX = 'News'

const classes = {
  root: `${PREFIX}-root`,
  dot: `${PREFIX}-dot`,
  thumbnail: `${PREFIX}-thumbnail`,
}

const Root = styled('div')(({ theme }) => ({
  width: '100%',
  '& img': {
    height: '100%',
    width: '100%',
    objectFit: 'cover',
    borderRadius: theme.spacing(0.75),
  },

  [`& .${classes.dot}`]: {
    display: 'inline-block',
    width: 2,
    height: 2,
    margin: 4,
    background: theme.palette.text.disabled,
    borderRadius: '50%',
  },

  [`& .${classes.thumbnail}`]: {
    display: 'flex',
    flexShrink: 0,
    float: 'right',
    height: theme.spacing(12),
    width: theme.spacing(12),
    marginLeft: theme.spacing(2),
    marginBottom: theme.spacing(0.5),
  },
}))

const RelatedSymbols = ({ symbols: unvalidatedSymbols }: { symbols: string }) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { refSymbolsMap } = React.useContext(GlobalContext)

  const symbols = React.useMemo(() => {
    return (
      unvalidatedSymbols
        .split(',')
        // .filter(symbol => symbol && symbol !== '-')
        .filter(symbol => symbol && refSymbolsMap.has(symbol))
        .slice(0, 5)
    )
  }, [unvalidatedSymbols])

  return (
    <Stack direction='row' spacing={0.75} sx={{ my: 1 }}>
      {symbols.map((symbol: string) => (
        <Chip
          key={symbol}
          label={symbol}
          color='primary'
          clickable
          component={RouterLink}
          to={`/company/${symbol}`}
          underline='none'
        />
      ))}
    </Stack>
  )
}

type ArticleProps = {
  isLoading: boolean
  article: { [key: string]: any }
  index: number
}

const Article = ({ isLoading, article = {}, index }: ArticleProps) => {
  return (
    <ListItem
      divider
      disableGutters
      sx={{ flexDirection: { xs: 'column', sm: 'row' }, alignItems: 'flex-start', py: 2 }}
    >
      <Hidden lgDown>
        <Typography
          variant='caption'
          gutterBottom
          sx={{ color: theme => theme.palette.text.disabled, mt: 0.75, minWidth: 130 }}
        >
          {isLoading ? (
            <Skeleton width='80%' style={{ maxWidth: 130 }} />
          ) : (
            new Date(article.datetime).toDateString()
          )}
        </Typography>
      </Hidden>
      <Container maxWidth={false} disableGutters>
        {!isLoading && (
          <Hidden lgDown>
            <Link className={classes.thumbnail} href={article.url} targetBlank>
              <img src={`https://picsum.photos/100?random=${index}`} alt={article.headline} />
            </Link>
          </Hidden>
        )}
        {!isLoading && <RelatedSymbols symbols={article.related} />}
        <Typography variant='h6' component='h3' gutterBottom>
          {isLoading ? (
            <>
              <Skeleton />
              <Skeleton />
              <Skeleton width='60%' />
            </>
          ) : (
            <Link
              href={article.url}
              targetBlank
              sx={{
                ':hover': theme => ({
                  textDecorationColor: theme.palette.primary.main,
                }),
              }}
            >
              {article.headline}
            </Link>
          )}
        </Typography>
        {!isLoading && (
          <Typography variant='body2' color='textSecondary' paragraph>
            <Link href={article.url} underline='none' targetBlank>
              {article.summary.length > 320
                ? article.summary.slice(0, 317).concat('...')
                : article.summary}
            </Link>
          </Typography>
        )}
        <Typography
          variant='caption'
          gutterBottom
          sx={{ color: theme => theme.palette.text.disabled }}
        >
          {isLoading ? (
            <Skeleton width='10%' />
          ) : (
            <>
              <Hidden lgUp>
                {new Date(article.datetime).toDateString()}
                <span className={classes.dot} />
              </Hidden>
              {`By ${article.source}`}
            </>
          )}
        </Typography>
      </Container>
      {isLoading && (
        <Hidden lgDown>
          <Skeleton className={classes.thumbnail} variant='rectangular' />
        </Hidden>
      )}
    </ListItem>
  )
}

const loadMoreGroupSize = 5

const News = () => {
  const { isSuccess, data } = useQuery<any[], Error>('/market/news')

  const [count, setCount] = React.useState(1)

  const handleLoadMore = React.useCallback(() => {
    if ((data as any[]).length - count * loadMoreGroupSize > 0) {
      setCount(prevCount => prevCount + 1)
    }
  }, [data])

  return (
    <Root>
      <Grid container>
        <Grid item xs={12}>
          <Container disableGutters>
            <List disablePadding>
              {(!isSuccess
                ? Array.from(Array(10))
                : (data as any[]).slice(0, loadMoreGroupSize * count)
              ).map((article, index: number) => (
                <Article
                  // eslint-disable-next-line react/no-array-index-key
                  key={index}
                  isLoading={!isSuccess}
                  article={article}
                  index={index}
                />
              ))}
            </List>
            <div style={{ display: 'flex', justifyContent: 'center', padding: 32 }}>
              <Button
                variant='outlined'
                color='primary'
                onClick={handleLoadMore}
                disabled={!isSuccess || count * loadMoreGroupSize >= (data as any[]).length}
              >
                More Articles
              </Button>
            </div>
          </Container>
        </Grid>
      </Grid>
    </Root>
  )
}

export default News

// const ArticleCard = ({ article, index }: { article: any; index: number }) => (
//   <Grid item xs={12} sm={4}>
//     <Card sx={{ background: theme => theme.palette.secondary.dark }}>
//       {/* <CardHeader
//         title={new Date(article.datetime).toDateString()}
//         titleTypographyProps={{ variant: 'caption', color: 'textSecondary' }}
//       /> */}
//       <CardMedia
//         component='img'
//         height='200'
//         image={`https://picsum.photos/400?random=${index}`}
//         alt='random image'
//       />
//       <CardContent>
//         <RelatedSymbols symbols={article.related} />
//         <Typography component='h4' variant='h6' gutterBottom>
//           {article.headline.length > 80
//             ? article.headline.slice(0, 77).concat('...')
//             : article.headline}
//         </Typography>
//         <Typography
//           variant='caption'
//           gutterBottom
//           noWrap
//           sx={{ color: theme => theme.palette.text.disabled }}
//         >
//           {new Date(article.datetime).toDateString()}
//           <span className={classes.dot} />
//           By {article.source}
//         </Typography>
//       </CardContent>
//     </Card>
//   </Grid>
// )
