const fs = require('fs');
const yaml = require('js-yaml');
const crawler = require('./crawler')
const axios = require('axios')

async function crawl(resURL){
    try {
        let fileContents = fs.readFileSync('./config.yml', 'utf8');
        let config = yaml.safeLoadAll(fileContents);
    
        let posts = []
    
        for(let i = 0; i < config.length; i++){
            console.log('Site: ', config[i].name)
            console.log('-------------------------------------')
            const newPosts = await crawler(config[i])
            posts = [...posts, ...newPosts]
        }
    
        console.log(posts.length)

        axios.post(resURL, { posts })

        console.log('sent response to api')
    } catch (e) {
        console.log(e);
    }
} 

module.exports = crawl