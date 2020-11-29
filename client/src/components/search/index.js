import React, { useState } from 'react'
import TextField from '@material-ui/core/TextField';


export default function Search() {

    const [posts, setPosts] = useState()

    const search = React.useCallback(async (query) => {
        fetch(`/api/search/${query}`).then(res => res.json()).then(res => console.log(res))
    }, [])

    return (
        <>
            <TextField id="filled-search" label="Search field" type="search" variant="outlined" 
            onChange={(e) => search(e.target.value)}/>

        </>
    )
}
