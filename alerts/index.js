const express = require('express')
const morgan = require('morgan')
const { processPosts, saveError, getKeywords, addKeyword, removeKeyword } = require('./mongo')
const { Alert } = require('./schmas');

const app = express()

app.use(express.json())
app.use(morgan('dev'))

app.get('/alerts/keywords/:user', async (req, res) => {
    try{
        const keywords = await getKeywords(req.params.user)

        res.send(keywords)
    } catch(err){
        console.log(err)
        res.status(500).send(false)
    }
})

app.get('/alerts/:user', async (req, res) => {
    try{
        const alerts = await Alert.find({user: req.params.user})

        res.send(alerts)
    } catch(err){
        console.log(err)
        res.status(500).send(false)
    }
})

app.post('/alerts/keywords', async (req, res) => {
    try{
        console.log(req.body)
        const updated = addKeyword(req.body.keyword, req.body.user)
        res.send(Boolean(updated))
    } catch(err){
        console.log(err)
        res.status(500).send(false)
    }
})

app.post('/alerts/error', async (req, res) => {
    try{
        const isSaved = await saveError(req.body.error)
        res.send(Boolean(isSaved))
    } catch(err){
        console.log(err)
        res.status(500).send(false)
    }
})

app.post('/alerts/post', async (req, res) => {
    try{
        const isSaved = await processPosts(req.body.posts)
        res.send(isSaved)
    } catch(err){
        console.log(err)
        res.status(500).send(false)
    }
})

app.post('/alerts/read/:_id', async (req, res) => {
    try{
        const updated = await Alert.update({_id: req.params._id}, {read: true})

        res.send(updated)
    } catch(err){
        console.log(err)
        res.status(500).send(false)
    }
})

app.delete('/alerts/keywords', async (req, res) => {
    try{
        console.log(req.body)
        const updated = removeKeyword(req.body.keyword, req.body.user)
        res.send(Boolean(updated))
    } catch(err){
        console.log(err)
        res.status(500).send(false)
    }
})

app.delete('/alerts/:_id', async (req, res) => {
    try{
        const deleted = await Alert.deleteOne({_id: req.params._id})

        res.send(deleted)
    } catch(err){
        console.log(err)
        res.status(500).send(false)
    }
})


app.listen(3001, () => console.log('Listening on port 3001'))

