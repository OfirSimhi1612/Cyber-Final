import React, {useEffect, useState} from 'react'
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

const useStyles = makeStyles((theme) => ({
    root: {
      '& > *': {
        margin: theme.spacing(1),
        width: '25ch',
      },
    },
  }));

export default function Keywords() {

    const [keywords, setKeywords] = useState([])
    const [input, setInput] = useState()

    const classes = useStyles();

    const get = React.useCallback(() => {
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
        }).then(res => get())
    }, [input])

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
        }).then(res => get())
    }, [keywords])

    useEffect(get, [])

    return (
        <>
            <h2>This Are Youre Keywords</h2>
            
            {keywords.length > 0 &&
                <ul>
                    {
                        keywords.map(key => 
                        <li>
                            {key}
                            <Button 
                                variant="contained" 
                                id={key}
                                onClick={(e) => removeKeyword(e.target.id)} 
                                size='sm'>
                                    Del
                                </Button>
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
