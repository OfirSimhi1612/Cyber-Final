const { regAuthor, contentAnalys } = require('./analytics')
const axios = require('axios')
const tor_axios = require('tor-axios');
const cheerio = require('cheerio');
const dateParser = require('./helpers/DateCovert')
const md5 = require('md5'); 

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

function dateSignature(date){
  return new Date(date).toJSON().slice(0, 10)
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
   
  if(title.length > 0 && content.length > 0){
    const post = {
      host: config.name,
      title: rTN(title),
      content: content,
      author: author ?  regAuthor(cSlice(rTN(author), authorPosition.start, authorPosition.end)) : 'Anonymous',
      date: date ? dateParser(cSlice(rTN(date), datePosition.start, datePosition.end)) : 0
    }
  
    post.id = md5(JSON.stringify(post.title + post.content + post.author)) +  dateSignature(post.date)//change hashig to 128
    posts.push(post)
  }
}

async function getContainerFromLink(link, config){
  const fetch = config.network === 'tor' ? tor.get : axios.get
  const { data: page } = await fetch(link)
  const $ = cheerio.load(page)
  return config.navigation['inner-container'] ? $(config.navigation['inner-container']) : page
}

async function crawler(config) {
  console.log(config.url)
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

    // if(config.pagination){
    //   let next
    //   if(config.pagination.isChild){
    //     next = $(config.pagination.current).closest(config.pagination.parent).next().find(config.pagination.link).attr('href')
    //   } else {
    //     next = $(config.pagination.current).next().attr('href')
    //   }
  
    //   if(next){
    //     return posts + await crawler({...config, url: config.pagination.relative ? config.pagination.base + next : next})
    //   } else {
    //     console.log('finished')
    //     return posts
    //   }
    // } else{
    //   return posts
    // }

    return posts
    
      
  } catch(err){
    axios.post(`http://${alertsHost}:${alertsPort}/alerts/error`, { error: `${config.name}: ${err.message}` })
    console.log(err.message)
  }
}


module.exports = crawler
