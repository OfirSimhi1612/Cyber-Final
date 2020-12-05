const { Client } = require('@elastic/elasticsearch')
const client = new Client({ node: process.env.ELS_URL || 'http://127.0.0.1:9200' })
const axios = require('axios')
const compare = require('./compare')

const alertsHost = process.env.ALERTS_HOST || 'localhost'
const alertsPort = process.env.ALERTS_PORT || '3001'

const crawlerHost = process.env.CRAWLER_HOST || 'localhost'
const crawlerPort = process.env.CRAWLER_PORT || '4001'

const selHost = process.env.SELF_HOST || 'localhost'
const selfPort = process.env.SELF_PORT || '8080'

async function initialElastic(){
    try{
      if(!(await client.indices.exists({index:'posts_test'})).body){
          await client.indices.create({
              index: 'posts_test',
          })
          console.log('added index: posts_test')
          return true
      }
       return false
    } catch(err){
      console.log(err.body)
    }
  }
  
async function bulkPost(posts){
try{
    await initialElastic()
    console.log('recived ' + posts.length + ' posts!')
    const body = posts.flatMap(doc => [{ index: { _index: 'posts_test', _id: doc.id} }, doc])
    if(body.length > 0){
        try{
            await client.bulk({
                index: 'posts_test',
                body: body
            })
        } catch(err){
            console.log(err.body)
            await axios.post(`http://${alertsHost}:${alertsPort}/alerts/error`, { error: err.message })
        }
    }
    // if(posts.length > 0){
    //     await axios.post(`http://${alertsHost}:3001/alerts/post`, { posts: posts })
    // }

} catch(err){
    console.log(err.body)
    await axios.post(`http://${alertsHost}:${alertsPort}/alerts/error`, { error: err.message })
}
    
    
}

async function updateDataBase(){
try{
    axios.get(`http://${crawlerHost}:${crawlerPort}/crawl`, {
        params: {
            resURL: `http://${selHost}:${selfPort}/api/search/updateDB`
        }
    })
} catch(err){
    console.log(err.message)
    await axios.post(`http://${alertsHost}:${alertsPort}/alerts/error`, { error: err.message })
}
}

module.exports = {
    updateDataBase,
    bulkPost
}