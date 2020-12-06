const fs = require('fs');
const yaml = require('js-yaml');
const crawler = require('./crawler')
const axios = require('axios')

async function crawl(resURL){
    try {
        console.log('crawling...')
        let fileContents = fs.readFileSync('./config.yml', 'utf8');
        let config = yaml.safeLoadAll(fileContents);
    
        let posts = []
    
        for(let i = 0; i < config.length; i++){
            const newPosts = await crawler(config[i])
            posts = [...posts, ...newPosts]
        }
        console.log('finished')
        axios.post(resURL, { posts })
    } catch (e) {
        console.log(e);
    }
} 

module.exports = crawl