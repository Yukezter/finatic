import React from 'react'
import _ from 'lodash'
import { makeStyles } from '@material-ui/core/'
// import Grid from '@material-ui/core/Grid'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import Container from '@material-ui/core/Container'

import _IMAGES from './images'

import api from '../shared/hooks/api'

import Loading from '../shared/components/Loading'
import Link from '../shared/components/Link'
// import Button from '../shared/components/Button'

const IMAGES = _.shuffle(_IMAGES)

const useStyles = makeStyles(({ breakpoints, spacing, palette }) => ({
  root: {
    '& a': {
      textDecoration: 'none',
      textDecorationColor: 'inherit',
      color: 'inherit',
    },
    '& .headline': {
      fontWeight: 600,
    },
    '& .datetime': {
      color: palette.grey[500],
      '& span': {
        display: 'inline-block',
        width: 2,
        height: 2,
        margin: 4,
        background: palette.grey[500],
        borderRadius: 1,
      },
    },
    '& img': {
      width: '100%',
      borderRadius: spacing(0.5),
    },
  },
  featured: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    borderBottom: `1px solid ${palette.divider}`,
    '& > .featured-image': {
      width: '100%',
      marginBottom: spacing(2),
    },
    '& > .featured-content': {
      paddingLeft: 0,
      marginBottom: spacing(2),
      '& > .ticker': {
        color: palette.primary.main,
        fontWeight: 600,
      },
      '& > .headline': {
        fontWeight: 700,
        '&:hover': {
          textDecoration: 'underline',
          textDecorationColor: palette.primary.main,
        },
      },
    },
    [breakpoints.up('md')]: {
      flexDirection: 'row-reverse',
      alignItems: 'center',

      paddingTop: spacing(4),
      paddingBottom: spacing(4),
      borderTop: `2px solid ${palette.primary.main}`,

      '& > .featured-image': {
        minWidth: spacing(50),
        marginBottom: 0,
      },
      '& > .featured-content': {
        paddingRight: spacing(2),
      },
    },
    [breakpoints.up('lg')]: {
      paddingTop: spacing(5),
      paddingBottom: spacing(5),
      '& > .featured-image': {
        minWidth: spacing(70),
      },
    },
  },
  articles: {},
  article: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    paddingTop: spacing(2),
    paddingBottom: spacing(2),
    '& .thumbnail': {
      display: 'none',
      float: 'left',
      marginRight: spacing(2),
      '& > img': {
        height: spacing(17.5),
        width: spacing(17.5),
        objectFit: 'cover',
      },
    },
    '&:hover': {
      '& > div > .headline': {
        textDecoration: 'underline',
        textDecorationColor: palette.primary.main,
      },
    },
    [breakpoints.up('sm')]: {
      flexDirection: 'row',
      paddingTop: spacing(3),
      paddingBottom: spacing(3),
      '& .thumbnail': {
        display: 'flex',
      },
    },
  },
}))

const renderDatetime = datetime => new Date(datetime).toDateString()

const News = () => {
  const classes = useStyles()

  const [isLoadingImages, setIsLoadingImages] = React.useState(true)

  const { data, isLoading, isError } = api.get('/news/', {
    refetchOnWindowFocus: false,
    staleTime: 60 * 60 * 1000,
    cacheTime: 60 * 60 * 1000,
  })

  React.useEffect(() => {
    const loadImage = url => {
      return new Promise((resolve, reject) => {
        const img = new Image()
        img.src = url
        img.onload = () => {
          resolve(url)
        }
      })
    }

    Promise.all(IMAGES.map(url => loadImage(url)))
      .then(() => setIsLoadingImages(false))
      .catch(err => console.log(err))

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (isLoading || isLoadingImages) {
    return <Loading />
  }

  if (isError) {
    return <div>Error</div>
  }

  return (
    <div className={classes.root}>
      <Container disableGutters>
        <div className={classes.featured}>
          <Paper
            className='featured-image'
            elevation={0}
            square
            component='a'
            href={data[0].url}
            target='_blank'
            rel='noopener noreferrer'
          >
            <img src={IMAGES[0]} alt={data[0].headline} />
          </Paper>
          <div className='featured-content'>
            <Typography className='ticker' variant='caption' component='p'>
              <Link to={`/company/${data[0].key}`}>{data[0].key}</Link>
            </Typography>
            <Typography
              className='headline'
              component='h1'
              variant='h5'
              gutterBottom
            >
              <a href={data[0].url} target='_blank' rel='noopener noreferrer'>
                {data[0].headline}
              </a>
            </Typography>
            <Typography
              className='datetime'
              variant='caption'
              component='p'
              gutterBottom
            >
              {renderDatetime(data[0].datetime)}
              <span></span>
              By {data[0].source}
            </Typography>
          </div>
        </div>
      </Container>
      <Container disableGutters>
        <List className={classes.articles}>
          {data.slice(1).map((article, index, array) => {
            const summary =
              article.summary.length > 400
                ? article.summary.slice(0, 397).concat('...')
                : article.summary
            return (
              <ListItem
                key={index}
                className={classes.article}
                divider={index !== array.length - 1}
                disableGutters
                component='a'
                href={article.url}
                target='_blank'
                rel='noopener noreferrer'
              >
                <Container disableGutters>
                  <div className='thumbnail'>
                    <img src={IMAGES[index + 1]} alt={article.headline} />
                  </div>
                  <Typography
                    className='datetime'
                    variant='caption'
                    component='p'
                    gutterBottom
                  >
                    {renderDatetime(article.datetime)}
                    <span></span>
                    By {article.source}
                  </Typography>
                  <Typography
                    className='headline'
                    variant='h6'
                    component='h2'
                    gutterBottom
                  >
                    {article.headline}
                  </Typography>
                  <Typography
                    className='summary'
                    variant='body2'
                    color='textSecondary'
                    component='p'
                    gutterBottom
                  >
                    {summary}
                  </Typography>
                </Container>
              </ListItem>
            )
          })}
        </List>
      </Container>
    </div>
  )
}

export default News
