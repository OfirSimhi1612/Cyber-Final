import React from 'react'
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';


const useStyles = makeStyles({
    root: {
      minWidth: 500,
      maxWidth: 800,
      backgroundColor: 'grey',
      border: '1px solid black'
    },
    bullet: {
      display: 'inline-block',
      margin: '0 2px',
      transform: 'scale(0.8)',
    },
    title: {
      fontSize: 14,
    },
    pos: {
      marginBottom: 12,
    },
  });

export default function Post({post}) {

    const classes = useStyles();

    return (
        <Card className={classes.root}>
      <CardContent>
        <Typography className={classes.title} color="textSecondary" gutterBottom>
          {post.header}, by {post.author}
        </Typography>
        <Typography className={classes.pos} color="textSecondary">
          {post.content}
        </Typography>
        <Typography variant="body2" component="p">
          {new Date(post.date).toUTCString}
        </Typography>
      </CardContent>
    </Card>
    )
}
