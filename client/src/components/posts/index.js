import React from 'react'
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';


const useStyles = makeStyles({
    root: {
      minWidth: 500,
      width: '47%',
      backgroundColor: '#1C1E24',
      border: '1px solid #969AA3',
      borderTop: props => props.score >=  0 ? `4px solid #1FAD58` : `4px solid #9d0208`,
      padding: '10px',
      display: 'flex',
      flexDirection: 'column',
      gap: '5px'
    },
    title: {
      color: '#D56B1B',
      fontSize: '18px'
    },
    content: {
      marginBottom: 12,
      color: '#D3D6DA'
    },
    author:{
      color: '#CBB202',
      fontSize: '12px'
    },
    date: {
      color: '#487CD7',
      width: 'fit-content',
      marginLeft: 'auto',
      marginTop: 'auto'
    }
  });

export default function Post({post}) {

    const props = {
      score: post.analysis.score
    }

    const classes = useStyles(props);

    return (
        <Paper className={classes.root} square>
        <Typography  color="textSecondary" gutterBottom>
          <span className={classes.title}>{post.header}</span>  <span class={classes.author}>{post.author}</span>
        </Typography>
        <Typography className={classes.content} color="textSecondary">
          {post.content}
        </Typography>
        <Typography className={classes.date}>
          {new Date(post.date).toUTCString()}
        </Typography>
    </Paper>
    )
}
