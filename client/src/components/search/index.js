import React, { useState, useEffect } from 'react'
import TextField from '@material-ui/core/TextField';
import Post from '../posts';
import { makeStyles } from '@material-ui/core/styles';




const useStyles = makeStyles({
    search: {
        color: 'white',
        border: '0.5px solid white',
        height: '40px',
        width: '400px',
        alignSelf: 'center'
    },
    postsContainer: {
        display: 'flex',
        flexWrap: 'wrap',
        gap: '10px',
        marginTop: '10px'
    }
  });


export default function Search() {

    const [posts, setPosts] = useState([])

    const debounce = React.useCallback((func, wait) => {
        let timeout
        return function(...args) {
          clearTimeout(timeout)
          timeout = setTimeout(() => func(args), wait)
        }
      }, [])

    const search = React.useCallback(debounce(async (query) => {
        if(query.length > 0){
            fetch(`/api/search/${query}`)
            .then(res => res.json())
            .then(res => setPosts(res))
            .catch(err => console.log(err))
        } else {
            fetch(`/api/search/a`)
            .then(res => res.json())
            .then(res => setPosts(res))
            .catch(err => console.log(err))
        } 
    }, 1000), [debounce])

    useEffect(() => {
        search('a')
    }, [search])

    const classes = useStyles()

    return (
    
        <>
            <TextField id="filled-search"           
                defaultValue="Search"
                variant="outlined" 
                size="small"
                className={classes.search}
                onChange={(e) => search(e.target.value)}
            />
            <div className={classes.postsContainer}>
                {posts.length > 0 &&
                    posts.map(post => {
                        return <Post
                            post={post}
                        />
                    })
                }
            </div>
        </>
    )
}
