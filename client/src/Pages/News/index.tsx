/* eslint-disable no-nested-ternary */
/* eslint-disable react/jsx-props-no-spreading */
import React from 'react'
import { styled } from '@mui/material/styles'
import { withRouter, RouteComponentProps } from 'react-router-dom'
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

import { Chip, Button } from '../../Components'

const PREFIX = 'News'

const classes = {
  root: `${PREFIX}-root`,
  datetime: `${PREFIX}-datetime`,
  dot: `${PREFIX}-dot`,
  divider: `${PREFIX}-divider`,
  thumbnail: `${PREFIX}-thumbnail`,
  featuredArticle: `${PREFIX}-featuredArticle`,
  featuredArticleImageContainer: `${PREFIX}-featuredArticleImageContainer`,
  marginLeftAutoSmUp: `${PREFIX}-marginLeftAutoSmUp`,
  articles: `${PREFIX}-articles`,
  article: `${PREFIX}-article`,
  hoverUnderline: `${PREFIX}-hoverUnderline`,
}

// TODO jss-to-styled codemod: The Fragment root was replaced by div. Change the tag if needed.
const Root = styled('div')(({ theme }) => ({
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

  [`& .${classes.datetime}`]: {
    color: theme.palette.text.disabled,
  },

  [`& .${classes.dot}`]: {
    display: 'inline-block',
    width: 2,
    height: 2,
    margin: 4,
    background: theme.palette.text.disabled,
    borderRadius: '50%',
  },

  [`& .${classes.divider}`]: {
    marginTop: theme.spacing(4),
    [theme.breakpoints.up('sm')]: {
      marginTop: theme.spacing(5),
    },
  },

  [`& .${classes.thumbnail}`]: {
    display: 'flex',
    flexShrink: 0,
    float: 'right',
    height: theme.spacing(12),
    width: theme.spacing(12),
    marginLeft: theme.spacing(3),
    marginBottom: theme.spacing(0.5),
  },

  [`& .${classes.featuredArticle}`]: {
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

  [`& .${classes.featuredArticleImageContainer}`]: {
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

  [`& .${classes.marginLeftAutoSmUp}`]: {
    [theme.breakpoints.up('sm')]: {
      marginLeft: 'auto',
    },
  },

  [`& .${classes.articles}`]: {
    paddingTop: 0,
    paddingBottom: 0,
  },

  [`& .${classes.article}`]: {
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

  [`& .${classes.hoverUnderline}`]: {
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

const FeaturedArticle = ({ isLoading, article }: any) => (
  <div className={classes.featuredArticle}>
    <Grid container spacing={4} direction='row-reverse'>
      <Grid item xs={12}>
        <div className={classes.featuredArticleImageContainer}>
          {isLoading ? (
            <Skeleton variant='rectangular' height='100%' width='100%' />
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
              <Root>
                <Skeleton className={classes.marginLeftAutoSmUp} />
                <Skeleton className={classes.marginLeftAutoSmUp} />
                <Skeleton className={classes.marginLeftAutoSmUp} width='60%' />
              </Root>
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
    </Grid>
  </div>
)

const Article = ({ isLoading, article }: any) => {
  return (
    <ListItem className={classes.article} disableGutters>
      <div>
        <Hidden lgDown>
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
            <Hidden lgDown>
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
          <Hidden lgDown>
            <Skeleton className={classes.thumbnail} variant='rectangular' />
          </Hidden>
        )}
      </div>
    </ListItem>
  )
}

const loadMoreGroupSize = 2

const News = () => {
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
    <Root>
      <Typography variant='h2' component='h1' paragraph>
        News
      </Typography>
      <Grid container>
        <Grid item xs={12}>
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
    </Root>
  )
}

export default News
