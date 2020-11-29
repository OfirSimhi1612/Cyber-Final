const { Router } = require('express')

const router = Router()

router.use('/search', require('./search'))

module.exports = router