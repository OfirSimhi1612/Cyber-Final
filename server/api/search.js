const { Router } = require('express')
const { searchPosts, getLatest } = require('../elastic-search')
// const bulkPost = require('../../crawler')
// const fs = require('fs')

const router = Router()


router.get('/latest', async (req, res) => {
    try{
        const latest_posts = await getLatest()
        console.log(latest_posts)
        res.send(latest_posts)
    } catch(err){
        console.log(err)
        res.status(500).send('internal server error')
    }
})


router.get('/:query', async (req, res) => {
    try{
        const searchResults = await searchPosts(req.params.query) 

        res.send(searchResults)
    } catch(rrr){
        console.log(err)
        res.status(500).send('internal server error')
    }
})

// const all = JSON.parse(fs.readFileSync('../../test.json'))

// bulkPost(all)


module.exports = router