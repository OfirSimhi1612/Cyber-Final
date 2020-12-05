const { Client } = require('@elastic/elasticsearch')
const client = new Client({ node: process.env.ELS_URL || 'http://localhost:9200' })
const fs = require('fs')

async function searchPosts(query){
    try{
        const { body: {count : indexCount }  }  = await client.count({index: 'posts'})

        const results = await client.search({
           index: 'posts_test',
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

async function getLatest(){

    try{
        const results = await client.search({
           index: 'posts_test',
            sort: { "date" : "desc"},
            size: 100
        })
        return results.body.hits.hits.map(post => post._source)
    } catch(error){
        console.log(error.meta.body.error) 
    }
}

module.exports = {
    searchPosts,
    getLatest
}
