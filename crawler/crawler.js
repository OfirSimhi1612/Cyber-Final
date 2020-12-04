const { regAuthor, contentAnalys } = require('./analytics')
const axios = require('axios')
const tor_axios = require('tor-axios');
const cheerio = require('cheerio');
const dateParser = require('./helpers/DateCovert')
 

const torHost = process.env.TOR_HOST || 'localhost'
const torPort = process.env.TOR_PORT || '9050'

const alertsHost = process.env.ALERTS_HOST || 'localhost'
const alertsPort = process.env.ALERTS_PORT || '3001'

const tor = tor_axios.torSetup({
  ip: torHost,
  port: torPort,
})

function rTN(str){
  return str.replace(/(\r\n|\n|\r)/gm, '').replace(/(\r\t|\t|\r)/gm, '')
}

function cSlice(text, start, end){
  start = start ? typeof start === 'number' ? start : text.indexOf(start) + start.length: 0
  end = end ? typeof end === 'number' ? end : text.indexOf(end) : end
  return end ? text.slice(start, end) : text.slice(start)
}

function getContainerContent(element, config, posts){
  const $ = cheerio.load(element)

  const title = $(config.pathes.title.selector).text()
  const content = $(config.pathes.content.selector).text()
  const date = config.pathes.date ? $(config.pathes.date.selector).text() : null
  const author = config.pathes.author ? $(config.pathes.author.selector).text() : null

  const datePosition = config.pathes.date && config.pathes.date.position 
  const authorPosition = config.pathes.author && config.pathes.author.position
   
  // console.log(rTN(title))

  if(title.length > 0 && content.length > 0){
    posts.push({
      title: rTN(title),
      content: content,
      author: author ?  cSlice(rTN(author), authorPosition.start, authorPosition.end) : 'Anonymous',
      date: date ? dateParser(cSlice(rTN(date), datePosition.start, datePosition.end)) : 0
    })
  }
}

async function getContainerFromLink(link, config){
  const fetch = config.network === 'tor' ? tor.get : axios.get
  const { data: page } = await fetch(link)
  const $ = cheerio.load(page)
  return config.navigation['inner-container'] ? $(config.navigation['inner-container']) : page
}

async function crawler(config) {
  
  const fetch = config.network === 'tor' ? tor.get : axios.get

  let posts = [];

  try{
    const { data: page } = await fetch(config.url)
    const $ = cheerio.load(page)
    const list = $(config.pathes.list)
    const containers = list.find(config.pathes.container)

    for(let i = 0; i < containers.length; i++){
      let container = containers[i];
        if(config.navigation){
          const a = cheerio.load(container)(config.navigation.link)
          const link = a.attr('href')
          container = await getContainerFromLink(config.navigation.relative ? config.navigation.relative + link : link, config) 
        }
        getContainerContent(container, config, posts)
    }

    // for(let post of posts){
    //   post.analysis = await contentAnalys(post.content)
    // }

    // if(config.pagination){
    //   const container = $(config.pagination.container)
      
    // }
  } catch(err){
    axios.post(`http://${alertsHost}:${alertsPort}/alerts/error`, { error: `${config.name}: ${err.message}` })
    console.log(err.message)
  }

  // console.log(posts[0])
  return posts

}


module.exports = crawler
