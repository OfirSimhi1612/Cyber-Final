const { Client } = require('@elastic/elasticsearch')
const client = new Client({ node: process.env.ELS_URL || 'http://localhost:9200' })

async function compare(posts){
    try{
        const { body: {count : indexCount }  }  = await client.count({index: 'posts'})
        if(indexCount > 0){
            const results = await client.search({
                index: 'posts', 
                size: indexCount,
                sort: "date" 
            })
            
            const oldPosts = results.body.hits.hits.map(post => post._source)
            
            lastDate = new Date(oldPosts[oldPosts.length - 1].date)
            
            newPosts = posts.filter(post => new Date(post.date) > lastDate)
            console.log(newPosts.length + ' new posts!')
            return newPosts
        } else {
            return posts
        }
        
    } catch(err){
        console.log(err.meta.body.error)
    }
    
}

module.exports = compare