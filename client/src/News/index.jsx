import React, { useMemo } from 'react'
import { useQuery } from 'react-query'
import { makeStyles } from '@material-ui/core/'
// import Grid from '@material-ui/core/Grid'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import Container from '@material-ui/core/Container'
import Skeleton from '@material-ui/lab/Skeleton'

const useStyles = makeStyles(({ breakpoints, spacing, palette }) => ({
  root: {
    '& a': {
      textDecoration: 'none',
      textDecorationColor: 'inherit',
      color: 'inherit',
    },
    '& .dot': {
      display: 'inline-block',
      width: 2,
      height: 2,
      margin: 4,
      background: palette.grey[500],
      borderRadius: 1,
    },
    '& .headline': {
      fontWeight: 600,
    },
    '& .datetime': {
      color: palette.grey[500],
    },
    '& .skeleton-img, .featured-img, .thumbnail-img': {
      borderRadius: spacing(0.75),
    },
    '& .featured-img, .thumbnail-img': {
      width: '100%',
    },
  },
  featured: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    marginBottom: spacing(1),
    '& .skeleton-img': {
      height: 260,
      width: '100%',
      marginLeft: 'auto',
      marginBottom: spacing(2),
    },
    '& > .featured-img-paper': {
      width: '100%',
      marginBottom: spacing(2),
    },
    '& > .featured-content': {
      width: '100%',
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
      '& .skeleton-img': {
        height: 400,
      },
      '& > .featured-img-paper': {
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
      '& > .featured-img-paper': {
        minWidth: spacing(70),
      },
    },
  },
  articles: {
    borderTop: `1px solid ${palette.divider}`,
  },
  article: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    paddingTop: spacing(2),
    paddingBottom: spacing(2),
    '& .thumbnail': {
      display: 'none',
      float: 'left',
      marginRight: spacing(2),
      '& > .thumbnail-img': {
        height: spacing(17.5),
        width: spacing(17.5),
        objectFit: 'cover',
      },
    },
    '& .skeletons': {
      display: 'flex',
      '& .skeleton-img': {
        display: 'none',
        height: spacing(17.5),
        width: spacing(17.5),
        marginRight: spacing(2),
        flexShrink: 0,
      },
    },
    '&:hover .headline': {
      textDecoration: 'underline',
      textDecorationColor: palette.primary.main,
    },
    [breakpoints.up('sm')]: {
      flexDirection: 'row',
      paddingTop: spacing(3),
      paddingBottom: spacing(3),
      '& .thumbnail': {
        display: 'flex',
      },
      '& .skeleton-img': {
        display: 'initial',
      },
    },
  },
}))

const SkeletonArticle = () => (
  <Container className='skeletons' disableGutters>
    <Skeleton className='skeleton-img' variant='rect' />
    <Container disableGutters>
      <Typography variant='caption' gutterBottom>
        <Skeleton width='20%' />
      </Typography>
      <Typography variant='h6' gutterBottom>
        <Skeleton width='60%' />
      </Typography>
      <Typography variant='body2' gutterBottom>
        <Skeleton />
        <Skeleton />
        <Skeleton width='40%' />
      </Typography>
    </Container>
  </Container>
)

const FeaturedArticle = ({ classes, showSkeleton, article }) => {
  return (
    <div className={classes.featured}>
      {showSkeleton ? (
        <Skeleton className='skeleton-img' variant='rect' />
      ) : (
        <Paper
          className='featured-img-paper'
          elevation={0}
          square
          component='a'
          href={article.url}
          target='_blank'
          rel='noopener noreferrer'
        >
          <img className='featured-img' src={article.image} alt={article.headline} />
        </Paper>
      )}
      <div className='featured-content'>
        <Typography className='ticker' variant='caption' component='p'>
          {showSkeleton ? <Skeleton width='10%' /> : article.category}
        </Typography>
        <Typography className='headline' component='h1' variant='h5' gutterBottom>
          <a href={article.url} target='_blank' rel='noopener noreferrer'>
            {showSkeleton ? <Skeleton width='80%' /> : article.headline}
          </a>
        </Typography>
        <Typography className='datetime' variant='caption' component='p' gutterBottom>
          {showSkeleton ? (
            <>
              <Skeleton width='100%' />
              <Skeleton width='100%' />
              <Skeleton width='30%' />
            </>
          ) : (
            <>
              {new Date(article.datetime * 1000).toDateString()}
              <span className='dot'></span>
              By {article.source}
            </>
          )}
        </Typography>
      </div>
    </div>
  )
}

const Article = ({ classes, showSkeleton, article }) => {
  return (
    <ListItem className={classes.article} divider disableGutters>
      {showSkeleton ? (
        <SkeletonArticle />
      ) : (
        <Container disableGutters component='a' href={article.url} target='_blank' rel='noopener noreferrer'>
          <div className='thumbnail'>
            <img className='thumbnail-img' src={article.image} alt={article.headline} />
          </div>
          <Typography className='datetime' variant='caption' component='p' gutterBottom>
            {new Date(article.datetime * 1000).toDateString()}
            <span className='dot'></span>
            By {article.source}
          </Typography>
          <Typography className='headline' variant='h6' component='h2' gutterBottom>
            {article.headline}
          </Typography>
          <Typography className='summary' variant='body2' color='textSecondary' component='p' gutterBottom>
            {article.summary.length > 400 ? article.summary.slice(0, 397).concat('...') : article.summary}
          </Typography>
        </Container>
      )}
    </ListItem>
  )
}

const News = () => {
  const classes = useStyles()

  const placeholderData = useMemo(() => new Array(10).fill({}), [])
  const { data, isPlaceholderData, isError } = useQuery('/news?category=general', {
    placeholderData,
  })

  const showSkeleton = isPlaceholderData || isError

  return (
    <div className={classes.root}>
      <Container disableGutters>
        <FeaturedArticle classes={classes} showSkeleton={showSkeleton} article={data[0]} />
      </Container>
      <Container disableGutters>
        <List className={classes.articles}>
          {(showSkeleton ? placeholderData : data.slice(1, 51)).map((article, index) => (
            <Article key={index} classes={classes} showSkeleton={showSkeleton} article={article} />
          ))}
        </List>
      </Container>
    </div>
  )
}

export default News
