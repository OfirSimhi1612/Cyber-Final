const { Client } = require('@elastic/elasticsearch')
const client = new Client({ node: process.env.ELS_URL || 'http://127.0.0.1:9200' })
const axios = require('axios')
const compare = require('./compare')

const alertsHost = process.env.ALERTS_HOST || 'localhost'
const alertsPort = process.env.ALERTS_PORT || '3001'

const crawlerHost = process.env.CRAWLER_HOST || 'localhost'
const crawlerPort = process.env.CRAWLER_PORT || '4001'

async function initialElastic(){
    try{
      if(!(await client.indices.exists({index:'posts'})).body){
          await client.indices.create({
              index: 'posts',
          })
          console.log('added index: posts')
          console.log('here')
          return true
      }
       return false
    } catch(err){
      console.log(err.body)
    }
  }
  
async function bulkPost(posts){
try{
    const isNew = await initialElastic()
    if(!isNew){
    posts = await compare(posts)
    }
    const body = posts.flatMap(doc => [{ index: { _index: 'posts' } }, doc])
    if(body.length > 0){
        try{
            await client.bulk({
                index: 'posts',
                body: body
            })
        } catch(err){
            console.log(err.body.error)
            await axios.post(`http://${alertsHost}:${alertsPort}/alerts/error`, { error: err.message })
        }
    }
    if(posts.length > 0){
    await axios.post(`http://${alertsHost}:3001/alerts/post`, { posts: posts })
    }

} catch(err){
    console.log(err.body)
    await axios.post(`http://${alertsHost}:${alertsPort}/alerts/error`, { error: err.message })
}
    
    
}

async function updateDataBase(){
try{
    const { data } = await axios.get(`http://${crawlerHost}:${crawlerPort}/crawl`)
    bulkPost(data)
} catch(err){
    console.log(err.message)
    await axios.post(`http://${alertsHost}:${alertsPort}/alerts/error`, { error: err.message })
}
}


module.exports = updateDataBase