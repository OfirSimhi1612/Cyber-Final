const express = require('express')
const morgan = require('morgan')
const crawl = require('./exec')

const app = express()

app.use(express.json())
// app.use(morgan('dev'))


app.get('/crawl', async (req, res) => {
    try{
        const resURL = req.query.resURL
        crawl(resURL)

        res.send(true)
    } catch(err){
        console.log(err)
        res.status(500).send(err.message)
    }
})


app.listen(4001, () => console.log('listening on 4001'))