/* eslint-disable no-nested-ternary */
/* eslint-disable react/jsx-props-no-spreading */
import React from 'react'
import { withRouter, RouteComponentProps } from 'react-router-dom'
import { AxiosResponse } from 'axios'
import { useQuery } from 'react-query'
import { makeStyles } from '@material-ui/core'
import Grid from '@material-ui/core/Grid'
import Divider from '@material-ui/core/Divider'
import Typography from '@material-ui/core/Typography'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import Container from '@material-ui/core/Container'
import Hidden from '@material-ui/core/Hidden'
import Skeleton from '@material-ui/lab/Skeleton'

import { Chip, Button, Grid as MyGrid } from '../../Components'

const useStyles = makeStyles(theme => ({
  root: {
    '& img': {
      height: '100%',
      width: '100%',
      objectFit: 'cover',
      borderRadius: theme.spacing(0.75),
    },
    '& a': {
      textDecoration: 'none',
      textDecorationColor: 'inherit',
    },
  },
  datetime: {
    color: theme.palette.text.hint,
  },
  dot: {
    display: 'inline-block',
    width: 2,
    height: 2,
    margin: 4,
    background: theme.palette.text.hint,
    borderRadius: '50%',
  },
  divider: {
    marginTop: theme.spacing(4),
    [theme.breakpoints.up('sm')]: {
      marginTop: theme.spacing(5),
    },
  },
  thumbnail: {
    display: 'flex',
    flexShrink: 0,
    float: 'right',
    height: theme.spacing(12),
    width: theme.spacing(12),
    marginLeft: theme.spacing(3),
    marginBottom: theme.spacing(0.5),
  },
  featuredArticle: {
    overflow: 'hidden',
    '& .content': {
      height: '100%',
      width: '100%',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
    },
    '& .headline:hover': {
      textDecoration: 'underline',
      textDecorationColor: theme.palette.primary.main,
    },
    [theme.breakpoints.up('lg')]: {
      textAlign: 'right',
    },
  },
  featuredArticleImageContainer: {
    overflow: 'hidden',
    height: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 300,
    // maxHeight: 400,
    borderRadius: 4,
    '& > a': {
      height: '100%',
    },
    [theme.breakpoints.down('xl')]: {
      paddingBottom: theme.spacing(3),
    },
  },
  marginLeftAutoSmUp: {
    [theme.breakpoints.up('sm')]: {
      marginLeft: 'auto',
    },
  },
  articles: {
    paddingTop: 0,
    paddingBottom: 0,
  },
  article: {
    paddingTop: 0,
    paddingBottom: 0,
    '& > div': {
      display: 'flex',
      flexDirection: 'column',
      width: '100%',
      paddingTop: theme.spacing(3),
      paddingBottom: theme.spacing(3),
      borderBottom: `1px solid ${theme.palette.divider}`,
    },
    [theme.breakpoints.up('lg')]: {
      '& > div': {
        flexDirection: 'row',
      },
    },
  },
  hoverUnderline: {
    '&:hover': {
      textDecoration: 'underline',
      textDecorationColor: theme.palette.primary.main,
    },
  },
}))

// const img =
//   'https://images.pexels.com/photos/414974/pexels-photo-414974.jpeg?auto=compress&cs=tinysrgb&dpr=3&h=750&w=1260'

interface RelatedSymbolsProps extends RouteComponentProps {
  symbols?: string
}

const RelatedSymbols = withRouter(({ symbols = '', history }: RelatedSymbolsProps) => (
  <div style={{ marginBottom: 4 }}>
    {symbols
      .split(',')
      .slice(0, 5)
      .map((symbol: string) => (
        <Chip
          key={symbol}
          label={symbol}
          color='primary'
          clickable
          onClick={() => {
            history.push(`/company/${symbol}`)
          }}
        />
      ))}
  </div>
))

const FeaturedArticle = ({ classes, isLoading, article }: any) => (
  <div className={classes.featuredArticle}>
    <MyGrid container spacing={4} size='lg' direction='row-reverse'>
      <Grid item xs={12}>
        <div className={classes.featuredArticleImageContainer}>
          {isLoading ? (
            <Skeleton variant='rect' height='100%' width='100%' />
          ) : (
            <a href={article.url} target='_blank' rel='noopener noreferrer'>
              <img src={article.image} alt={article.headline} />
            </a>
          )}
        </div>
      </Grid>
      <Grid item xs={12}>
        <div className='content'>
          {!isLoading && <RelatedSymbols symbols={article.related} />}
          <Typography className='headline' component='h2' variant='h5' gutterBottom>
            {isLoading ? (
              <>
                <Skeleton className={classes.marginLeftAutoSmUp} />
                <Skeleton className={classes.marginLeftAutoSmUp} />
                <Skeleton className={classes.marginLeftAutoSmUp} width='60%' />
              </>
            ) : (
              <a href={article.qmUrl} target='_blank' rel='noopener noreferrer'>
                {article.headline}
              </a>
            )}
          </Typography>
          <Typography className={classes.datetime} variant='caption' gutterBottom>
            {isLoading ? (
              <Skeleton className={classes.marginLeftAutoSmUp} width='20%' />
            ) : (
              <>
                {new Date(article.datetime).toDateString()}
                <span className={classes.dot} />
                By {article.source}
              </>
            )}
          </Typography>
        </div>
      </Grid>
    </MyGrid>
  </div>
)

const Article = ({ classes, isLoading, article }: any) => {
  return (
    <ListItem className={classes.article} disableGutters>
      <div>
        <Hidden mdDown>
          <div style={{ minWidth: 130 }}>
            <Typography className={classes.datetime} variant='caption' gutterBottom>
              {isLoading ? (
                <Skeleton width='80%' style={{ maxWidth: 130 }} />
              ) : (
                new Date(article.datetime).toDateString()
              )}
            </Typography>
          </div>
        </Hidden>
        <Container maxWidth={false} disableGutters>
          {!isLoading && (
            <Hidden mdDown>
              <a
                className={classes.thumbnail}
                href={article.url}
                target='_blank'
                rel='noopener noreferrer'
              >
                <img src={article.image} alt={article.headline} />
              </a>
            </Hidden>
          )}
          {!isLoading && <RelatedSymbols symbols={article.related} />}
          <Typography className='headline' variant='h6' component='h3' gutterBottom>
            {isLoading ? (
              <>
                <Skeleton />
                <Skeleton />
                <Skeleton width='60%' />
              </>
            ) : (
              <a
                className={classes.hoverUnderline}
                href={article.url}
                target='_blank'
                rel='noopener noreferrer'
              >
                {article.headline}
              </a>
            )}
          </Typography>

          {!isLoading && (
            <Typography variant='body2' color='textSecondary' paragraph>
              <a href={article.url} target='_blank' rel='noopener noreferrer'>
                {article.summary.length > 400
                  ? article.summary.slice(0, 397).concat('...')
                  : article.summary}
              </a>
            </Typography>
          )}
          <Typography className={classes.datetime} variant='caption' gutterBottom>
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
          <Hidden mdDown>
            <Skeleton className={classes.thumbnail} variant='rect' />
          </Hidden>
        )}
      </div>
    </ListItem>
  )
}

const loadMoreGroupSize = 2

const News = () => {
  const classes = useStyles()

  const { isSuccess, data } = useQuery<AxiosResponse<any>, Error>('/news')
  // const isSuccess = a && !!''

  const articles = React.useMemo(() => {
    if (isSuccess) {
      return data!.data
    }

    return [...new Array(5)]
  }, [isSuccess])

  const featuredArticle = React.useMemo(() => {
    if (isSuccess) {
      return articles.shift()
    }

    return {}
  }, [articles])

  const [count, setCount] = React.useState(1)

  const handleLoadMore = React.useCallback(() => {
    if (articles.length - count * loadMoreGroupSize > 0) {
      setCount(prevCount => prevCount + 1)
    }
  }, [])

  return (
    <>
      <Typography variant='h2' component='h1' paragraph>
        News
      </Typography>
      <Grid className={classes.root} container>
        <Grid className={classes.root} item xs={12}>
          <FeaturedArticle
            classes={classes}
            isLoading={!isSuccess}
            article={featuredArticle}
          />
          <Divider className={classes.divider} />
          <Container disableGutters>
            <List className={classes.articles}>
              {articles
                .slice(0, loadMoreGroupSize * count)
                .map((article: any = {}, index: number) => (
                  <Article
                    key={!isSuccess ? index : article.subkey}
                    classes={classes}
                    isLoading={!isSuccess}
                    article={!isSuccess ? {} : article}
                  />
                ))}
            </List>
            <div style={{ display: 'flex', justifyContent: 'center', padding: 32 }}>
              <Button
                variant='outlined'
                color='primary'
                onClick={handleLoadMore}
                disabled={!isSuccess || count * loadMoreGroupSize >= articles.length}
              >
                More Articles
              </Button>
            </div>
          </Container>
        </Grid>
      </Grid>
    </>
  )
}

export default News
