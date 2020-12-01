import React, {useEffect, useState} from 'react'
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';


export default function Keywords() {

    const [keywords, setKeywords] = useState([])
    const [input, setInput] = useState()


    const fetchKeywords = React.useCallback(() => {
        fetch('/api/alerts/keywords/root')
        .then(res => res.json())
        .then(res => setKeywords(res))
        .catch(err => console.log(err))
    }, [])

    const addKeyword = React.useCallback(() => {
        fetch(`/api/alerts/keywords`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              user: 'root',
              keyword: input
            })
        }).then(res => fetchKeywords())
    }, [input, fetchKeywords])

    const removeKeyword = React.useCallback((keyword) => {
        fetch(`/api/alerts/keywords`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              user: 'root',
              keyword: keyword
            })
        }).then(res => fetchKeywords())
    }, [keywords, fetchKeywords])

    useEffect(fetchKeywords, [fetchKeywords])

    return (
        <>
            <h2>This Are Youre Keywords</h2>
            
            {keywords.length > 0 &&
                <ul>
                    {
                        keywords.map(key => 
                        <li>
                            {key}
                            <IconButton 
                                aria-label="delete" 
                                id={key}
                                onClick={(e) => removeKeyword(key)} 
                                >
                                    <DeleteIcon fontSize="small" />
                            </IconButton>
                        </li>)
                    }
                </ul>
            }
            <br></br>
            <br></br>
            <h3>Add new keyword</h3>
            <div><TextField id="standard-basic" label="KeyWord" size='sm' 
                onChange={(e) => setInput(e.target.value)}/></div>
            <br></br>
            <Button variant="contained" onClick={addKeyword}>Add</Button>
        </>
    )
}
