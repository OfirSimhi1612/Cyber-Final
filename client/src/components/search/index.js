import React, { useState, useEffect } from 'react'
import TextField from '@material-ui/core/TextField';
import Post from '../posts';


export default function Search() {

    const [posts, setPosts] = useState([])

    const debouce = (func, query) => {
        let timeout
        clearTimeout(timeout)
        timeout = setTimeout(() => func.apply(query), 1000)
      }

    const search = React.useCallback(async (query) => {
        if(query.length > 0){
            const fetchData = () => {
                fetch(`/api/search/${query}`)
                .then(res => res.json())
                .then(res => setPosts(res))
                .catch(err => console.log(err))
            }
            debouce(fetchData, query)
        }  
    }, [])

    useEffect(() => {
        search('a')
    }, [])

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
