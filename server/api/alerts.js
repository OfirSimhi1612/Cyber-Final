const { Router } = require('express')
const axios = require('axios')

const router = Router()

const alertsHost = process.env.ALERTS_HOST || 'localhost'
const alertsPort = process.env.ALERTS_PORT || '3001'

const alertsURL = (entry) =>  `http://${alertsHost}:${alertsPort}/alerts/${entry}`

router.get('/count/:user', async (req, res) => {
    try{
        const {data: count} = await axios.get(alertsURL(`count/${req.params.user}`))
        
        res.send(count)
    } catch(err){
        console.log(err)
        res.send(false)
    }
})

router.get('/keywords/:user', async (req, res) => {
    try{
        const {data: keywords} = await axios.get(alertsURL(`keywords/${req.params.user}`))
        
        res.send(keywords)
    } catch(err){
        console.log(err)
        res.status(500).send('error')
    }
})

router.get('/:user', async (req, res) => {
    try{
        const {data: alerts} = await axios.get(alertsURL(req.params.user))
        
        res.send(alerts)
    } catch(err){
        console.log(err)
        res.status(500).send('error')
    }
})

router.post('/read/:_id', async (req, res) => {
    try{
        const {data: alerts} = await axios.post(alertsURL(`read/${req.params._id}`))
        
        res.send(alerts)
    } catch(err){
        console.log(err)
        res.status(500).send('error')
    }
})

router.post('/keywords', async (req, res) => {
    try{
        const {data: keywords} = await axios.post(alertsURL('keywords'), {
            ...req.body
        })
        
        res.send(keywords)
    } catch(err){
        console.log(err)
        res.status(500).send(false)
    }
})

router.delete('/keywords', async (req, res) => {
    try{
        const {data: keywords} = await axios.delete(alertsURL('keywords'), {
            data: {
                ...req.body
              }
        })
        
        res.send(keywords)
    } catch(err){
        console.log(err)
        res.status(500).send(false)
    }
})

router.delete('/:_id', async (req, res) => {
    try{
        const {data: alerts} = await axios.delete(alertsURL(req.params._id))
        
        res.send(alerts)
    } catch(err){
        console.log(err)
        res.status(500).send('error')
    }
})


module.exports = router