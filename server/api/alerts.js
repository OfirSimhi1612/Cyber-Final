const { Router } = require('express')

const router = Router()

const alertsHost = process.env.ALERTS_HOST || 'localhost'
const alertsPort = process.env.ALERTS_PORT || '3001'

router.get('/:user', async (req, res) => {
    try{
        
        
        res.send(alerts)
    } catch(err){
        console.log(err)
        res.status(500).send('error')
    }
})

router.post('/read', async (req, res) => {

})

router.delete('/', async (req, res) => {

})

module.exports = router