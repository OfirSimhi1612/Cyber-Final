const puppeteer = require('puppeteer')
const { regAuthor, contentAnalys } = require('./analytics')
const { Client } = require('@elastic/elasticsearch')
const client = new Client({ node: process.env.ELS_URL || 'http://127.0.0.1:9200' })


const compare = require('./compare')

const host = process.env.TOR_HOST || 'localhost'
const port = process.env.TOR_PORT || '9050' 

async function crawler() {
  const args = [`--proxy-server=socks5://${host}:9050`, "--no-sandbox"];

  const browser = await puppeteer.launch({
    headless: true,
    args
  });

  const page = await browser.newPage();
  
  try{
    await page.goto('http://nzxj65x32vh2fkhk.onion/all'); 
  } catch(err){
    console.log(err)
  }

    let headers = await page.$$eval('#list > div > div > div.pre-info.pre-header > div > div.col-sm-5 > h4',
     h => h.map(header => (header.textContent)));
    
    headers = headers.map(h => h)

    const contents =[]
    for(let i = 0; i < headers.length + 2; i++ ){
      contents.push(await page.$$eval(`#list > div:nth-child(${i}) > div > div.well.well-sm.well-white.pre > div > ol > li`,
       posts => posts.map(post =>  post.textContent)));
    }
    contents.splice(0, 2)

    let footers = await page.$$eval('#list > div > div > div.pre-info.pre-footer > div > div:nth-child(1)',
     options => options.map(option => (option.textContent).replace(/[\\n]+[\\t]+/g, '')));

    let allPosts = headers.map((header, index) => {
      try{
        const f = footers[index].toString().replace(/(\r\n|\n|\r)/gm, '').replace(/(\r\t|\t|\r)/gm, '')
        return {
          header: header.toString().replace(/(\r\n|\n|\r)/gm, '').replace(/(\r\t|\t|\r)/gm, ''),
          author: regAuthor(f.slice(0, f.indexOf(' at ')).replace('Posted by ', '')),
          content: contents[index],
          date: new Date(f.slice(f.indexOf(' at ') + 4)).getTime(),
        }
      } catch(err){
        console.log(err)
      }
    })

    // for(let i = 0; i < allPosts.length; i++){
    //   allPosts[i].analysis = await contentAnalys(allPosts[i].content)
    // }

    browser.close()
    return allPosts
}

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
        }
    }
  } catch(err){
    console.log(err.body)
  }
    
    
}

async function updateDataBase(){
  try{
    const posts = await crawler()
    bulkPost(posts)
  } catch(err){
    console.log(err)
  }
}


setInterval(updateDataBase, 30000)

// module.exports = bulkPost