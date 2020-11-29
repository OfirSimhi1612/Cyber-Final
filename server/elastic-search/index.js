const { Client } = require('@elastic/elasticsearch')
const client = new Client({ node: process.env.ELS_URL || 'http://localhost:9200' })
const crawler = require('../../crawler')
const compare = require('./compare')


async function initialElastic(){
    if(!(await client.indices.exists({index:'posts'})).body){
        await client.indices.create({
            index: 'posts',
        })
        console.log('added index: posts')
    }
    return
}

async function postDoc(post){
    try{
        await initialElastic()
        await client.index({
            index: 'posts',
            body: post
        })
    return
    } catch (error){
        throw error
    }
}

async function bulkPost(posts){
    await initialElastic()
    posts = await compare(posts)
    const body = posts.flatMap(doc => [{ index: { _index: 'posts' } }, doc])
    if(body.length > 0){
        try{
            await client.bulk({
                index: 'posts-test',
                body: body
            })
        } catch(err){
            console.log(err.body.error)
        }
    }
    
}

async function updateDataBase(){
    const posts = await crawler()
    bulkPost(posts)
}

async function searchPosts(query){
    try{
        const { body: {count : indexCount }  }  = await client.count({index: 'posts'})

        const results = await client.search({
           index: 'posts',
           body: {
                query: {
                    multi_match : {
                        query : `/.*${query}.*/gi`,
                        fields: ["header","content", "author"],
                        fuzziness: 1
                    }
                }
            },
            sort: ['_score'],
            size: indexCount
        })
        return results.body.hits.hits.map(post => post._source)
    } catch(error){
        console.log(error.meta.body.error) 
    }
}


module.exports = {
    updateDataBase,
    searchPosts
}