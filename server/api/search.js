const { Router } = require('express')
const { searchPosts, getLatest } = require('../elastic-search')
const { bulkPost, updateDataBase } = require('../elastic-search/crawler')

const router = Router()


router.get('/latest', async (req, res) => {
    try{
        const latest_posts = await getLatest()
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

router.post('/updateDB', async (req, res) => {
    try{
        await bulkPost(req.body.posts)
        res.send(true)
    } catch(err){
        console.log(err)
        res.status(500).send('Internal server error')      
    }
})


module.exports = router