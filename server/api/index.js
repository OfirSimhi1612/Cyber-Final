const { Router } = require('express')

const router = Router()

router.use('/search', require('./search'))
router.use('/alerts', require('./alerts'))

module.exports = router