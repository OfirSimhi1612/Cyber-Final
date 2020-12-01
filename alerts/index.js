const express = require('express')
const morgan = require('morgan')
const { processPosts, saveError } = require('./mongo')

const app = express()

app.use(express.json())
app.use(morgan('dev'))

app.post('/error', async (req, res) => {
    try{
        const isSaved = await saveError(req.body.error)
        res.send(Boolean(isSaved))
    } catch(err){
        console.log(err)
        res.status(500).send(false)
    }
})

app.post('/post', async (req, res) => {
    try{
        const isSaved = await processPosts(req.body.posts)
        res.send(isSaved)
    } catch(err){
        console.log(err)
        res.status(500).send(false)
    }
})


app.listen(3001, () => console.log('Listening on port 3001'))

