const { Client } = require('@elastic/elasticsearch')
const client = new Client({ node: process.env.ELS_URL || 'http://localhost:9200' })
const crawler = require('../../crawler');


async function initialElastic(){
    if(!(await client.indices.exists('posts')).body){
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
    const body = posts.flatMap(doc => [{ index: { _index: 'posts' } }, doc])
    try{
        await initialElastic()
        client.bulk({
            index: 'posts-test',
            body
        })
    } catch(err){
        console.log(err)
    }
}




module.exports = {
    index: postDoc,
    buklIndex: bulkPost
}