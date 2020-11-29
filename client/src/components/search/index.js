import React, { useState, useEffect } from 'react'
import TextField from '@material-ui/core/TextField';
import Post from '../posts';


export default function Search() {

    const [posts, setPosts] = useState([])

    const debounce = React.useCallback((func, wait) => {
        let timeout
        return function(...args) {
          clearTimeout(timeout)
          timeout = setTimeout(() => func.apply(args), wait)
        }
      }, [])

    const search = React.useCallback(debounce(async (query) => {
        if(query.length > 0){
            fetch(`/api/search/${query}`)
            .then(res => res.json())
            .then(res => setPosts(res))
            .catch(err => console.log(err))
        }  
    }, 1000), [debounce])

    useEffect(() => {
        search('a')
    }, [search])

    return (
        <>
            <TextField id="filled-search" label="Search field" type="search" variant="outlined" 
            onChange={(e) => search(e.target.value)}/>

            {posts.length > 0 &&
                posts.map(post => {
                    return <Post
                        post={post}
                    />
                })
            }
        </>
    )
}
