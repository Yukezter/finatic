/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-nested-ternary */
/* eslint-disable react/jsx-props-no-spreading */
import React from 'react'
import { styled } from '@mui/material/styles'
import { AxiosResponse } from 'axios'
import { useQuery } from 'react-query'
import Grid from '@mui/material/Grid'
import Divider from '@mui/material/Divider'
import Typography from '@mui/material/Typography'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import Container from '@mui/material/Container'
import Hidden from '@mui/material/Hidden'
import Skeleton from '@mui/material/Skeleton'
import Stack from '@mui/material/Stack'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardMedia from '@mui/material/CardMedia'
import CardContent from '@mui/material/CardContent'

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

const RelatedSymbols = ({ symbols = '' }: { symbols: string }) => (
  <Stack direction='row' spacing={0.75} sx={{ my: 1 }}>
    {symbols
      .split(',')
      .slice(0, 4)
      .map((symbol: string) => (
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

const ArticleCard = ({ article, index }: { article: any; index: number }) => (
  <Grid item xs={12} sm={4}>
    <Card sx={{ background: theme => theme.palette.secondary.dark }}>
      {/* <CardHeader
        title={new Date(article.datetime).toDateString()}
        titleTypographyProps={{ variant: 'caption', color: 'textSecondary' }}
      /> */}
      <CardMedia
        component='img'
        height='200'
        image={`https://picsum.photos/400?random=${index}`}
        alt='random image'
      />
      <CardContent>
        <RelatedSymbols symbols={article.related} />
        <Typography component='h4' variant='h6' gutterBottom>
          {article.headline.length > 80
            ? article.headline.slice(0, 77).concat('...')
            : article.headline}
        </Typography>
        <Typography
          variant='caption'
          gutterBottom
          noWrap
          sx={{ color: theme => theme.palette.text.disabled }}
        >
          {new Date(article.datetime).toDateString()}
          <span className={classes.dot} />
          By {article.source}
        </Typography>
      </CardContent>
    </Card>
  </Grid>
)

const Article = ({ isLoading, article, index }: any) => {
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
              {article.summary.length > 350
                ? article.summary.slice(0, 347).concat('...')
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

const loadMoreGroupSize = 4

const News = () => {
  const { isSuccess, data } = useQuery<AxiosResponse<any[]>, Error>('/news')
  // const isSuccess = a && !!''

  const [count, setCount] = React.useState(1)

  const handleLoadMore = React.useCallback(() => {
    if (data!.data.length - count * loadMoreGroupSize > 0) {
      setCount(prevCount => prevCount + 1)
    }
  }, [data])

  return (
    <Root>
      <Grid container>
        <Grid item xs={12}>
          <Container disableGutters>
            <List>
              {(!isSuccess
                ? Array.from(Array(10))
                : data!.data.slice(0, loadMoreGroupSize * count)
              ).map((article: any = {}, index: number) => (
                <Article
                  key={!isSuccess ? index : article.subkey}
                  isLoading={!isSuccess}
                  article={!isSuccess ? {} : article}
                  index={index}
                />
              ))}
            </List>
            <div style={{ display: 'flex', justifyContent: 'center', padding: 32 }}>
              <Button
                variant='outlined'
                color='primary'
                onClick={handleLoadMore}
                disabled={!isSuccess || count * loadMoreGroupSize >= data!.data.length}
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
