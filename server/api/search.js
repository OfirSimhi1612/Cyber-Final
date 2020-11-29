const { Router } = require('express')
const { searchPosts } = require('../elastic-search')

const router = Router()

router.get('/:query', async (req, res) => {
    try{
        const searchResults = await searchPosts(req.params.query) 

        res.send(searchResults)
    } catch(rrr){
        console.log(err)
        res.status(500).send('internal server error')
    }
})

module.exports = router