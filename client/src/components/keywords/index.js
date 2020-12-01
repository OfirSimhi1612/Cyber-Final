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

    const addKeyword = React.useCallback(() => {
        // fetch(`/api/alerts/keywords`, {
        //     method: 'POST',
        //     body: {
        //       user: 'root',
        //       keyword: input
        //     }
        // })
        console.log(input)
    }, [input])

    const get = React.useCallback(() => {
        fetch('/api/alerts/keywords/root')
        .then(res => res.json())
        .then(res => setKeywords(res))
        .catch(err => console.log(err))
    }, [])

    useEffect(get, [])

    return (
        <>
            <h2>This Are Youre Keywords</h2>
            
            {keywords.length > 0 &&
                <ul>
                    {
                        keywords.map(key => <li>{key}</li>)
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
