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
  start = typeof start === 'number' ? start : text.indexOf(start) + start.length
  end = end ? typeof end === 'number' ? end : text.indexOf(end) : end
  return end ? text.slice(start, end) : text.slice(start)
}

function getContainerContent(element, config, posts){
  const $ = cheerio.load(element)
  const title = $(config.pathes.title.selector).text()
  const content = $(config.pathes.content.selector).text()
  let date = $(config.pathes.date.selector).text()
  const author = $(config.pathes.author.selector).text()

  // date = cSlice(rTN(date), config.pathes.date.position.start, config.pathes.date.position.end)
  // console.log(new Date(wordsToDate(date)))
  // console.log({
  //   title: rTN(title),
  //   content: rTN(content),
  //   author: cSlice(rTN(author), config.pathes.author.position.start, config.pathes.author.position.end),
  //   date: new Date(cSlice(rTN(date), config.pathes.date.position.start, config.pathes.date.position.end)).getTime(),
  // })

  const dateStart = config.pathes.date.position.start
  const dateEnd = config.pathes.date.position.end
  const authorStart = config.pathes.author.position.start
  const authorEnd = config.pathes.author.position.end

  console.log(content)

  if(title.length > 0 && content.length > 0){
    posts.push({
      title: rTN(title),
      content: content,
      author: cSlice(rTN(author), authorStart, authorEnd),
      date: dateParser(cSlice(rTN(date), dateStart, dateEnd)),
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
  console.log('Site: ', config.name)
  
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
          container = await getContainerFromLink(link, config) 
        }
        getContainerContent(container, config, posts)
    }

    // for(let post of posts){
    //   post.analysis = await contentAnalys(post.content)
    // }
  } catch(err){
    axios.post(`http://${alertsHost}:${alertsPort}/alerts/error`, { error: `${config.name}: ${err.message}` })
    console.log(err)
  }

  console.log(posts)
  return posts

}



module.exports = crawler


// const args =  [`--proxy-server=socks5://${torHost}:${torPort}`, "--no-sandbox"];

  // const browser = await puppeteer.launch({
  //   headless: false,
  //   args: config.network === 'tor' ? args : []
  // });

  // const page = await browser.newPage();
  
  // try{
  //   await page.goto(config.url); 
  // } catch(err){
  //   console.log(err)
  // }

// let headers = await page.$$eval('#list > div > div > div.pre-info.pre-header > div > div.col-sm-5 > h4',
    //  h => h.map(header => (header.textContent)));
    
    // headers = headers.map(h => h)

    // const contents =[]
    // for(let i = 0; i < headers.length + 2; i++ ){
    //   contents.push(await page.$$eval(`#list > div:nth-child(${i}) > div > div.well.well-sm.well-white.pre > div > ol > li`,
    //    posts => posts.map(post =>  post.textContent)));
    // }
    // contents.splice(0, 2)

    // let footers = await page.$$eval('#list > div > div > div.pre-info.pre-footer > div > div:nth-child(1)',
    //  options => options.map(option => (option.textContent).replace(/[\\n]+[\\t]+/g, '')));

    // let allPosts = headers.map((header, index) => {
    //   try{
    //     const f = footers[index].toString().replace(/(\r\n|\n|\r)/gm, '').replace(/(\r\t|\t|\r)/gm, '')
    //     return {
    //       header: header.toString().replace(/(\r\n|\n|\r)/gm, '').replace(/(\r\t|\t|\r)/gm, ''),
    //       author: regAuthor(f.slice(0, f.indexOf(' at ')).replace('Posted by ', '')),
    //       content: contents[index],
    //       date: new Date(f.slice(f.indexOf(' at ') + 4)).getTime(),
    //     }
    //   } catch(err){
    //     console.log(err)
    //     axios.post(`http://${alertsHost}:${alertsPort}/alerts/error`, { error: err.message })
    //   }
    // })

    // for(let i = 0; i < allPosts.length; i++){
    //   allPosts[i].analysis = await contentAnalys(allPosts[i].content)
    // }

    // browser.close()
    // return allPosts