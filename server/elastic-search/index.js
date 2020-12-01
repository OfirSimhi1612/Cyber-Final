const { Client } = require('@elastic/elasticsearch')
const client = new Client({ node: process.env.ELS_URL || 'http://localhost:9200' })
const fs = require('fs')
// const bulkPost = require('../../crawler')

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

async function getLatest(){
    const { body: {count : indexCount }  }  = await client.count({index: 'posts'})

    try{
        const results = await client.search({
           index: 'posts',
            sort: { "date" : "desc"},
            size: indexCount
        })
        return results.body.hits.hits.map(post => post._source)
    } catch(error){
        console.log(error.meta.body.error) 
    }
}

// async function writeAll(){
//     try{
//         const { body: {count : indexCount }  }  = await client.count({index: 'posts'})

//         let results = await client.search({
//            index: 'posts',
//            size: indexCount
//         })
//         const result =  results.body.hits.hits.map(post => post._source)
//         console.log(result)
//         await fs.writeFile('C:\Users\ofirs\Documents\GitHub\Cyber-Final\allPost.json', JSON.stringify(result, null, 2))

//     } catch(error){
//         console.log(error) 
//     }
// }

// async function updateAll(){
//     const posts = JSON.parse(await fs.readFile('C:\Users\ofirs\Documents\GitHub\Cyber-Final\allPost.json'))

//     let newPosts = posts.map(async (element) => {
//         return {
//             ...element,
//             analysis: await contentAnalys(element.content)
//         }
//     });

//     newPosts = await Promise.all(newPosts)

//     console.log(newPosts)

//     await fs.writeFile('C:\\Users\\ofirs\\Documents\\GitHub\\Cyber-Final\\test.json', JSON.stringify(newPosts, null, 2))
// }

// const all = JSON.parse(fs.readFileSync('C:\\Users\\ofirs\\Documents\\GitHub\\Cyber-Final\\test.json'))

// bulkPost(all)

module.exports = {
    searchPosts,
    getLatest
}
