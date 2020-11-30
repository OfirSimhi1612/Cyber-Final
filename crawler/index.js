const puppeteer = require('puppeteer')
const { regAuthor, contentAnalys } = require('./analytics')

async function crawler() {
    
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--proxy-server=socks5://127.0.0.1:9050']
  });

  const page = await browser.newPage();

  await page.goto('http://nzxj65x32vh2fkhk.onion/all');  
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

    const allPosts = headers.map((header, index) => {
      try{
        const f = footers[index].toString().replace(/(\r\n|\n|\r)/gm, '').replace(/(\r\t|\t|\r)/gm, '')
        // contentAnalys(contents[index])
        return {
          header: header.toString().replace(/(\r\n|\n|\r)/gm, '').replace(/(\r\t|\t|\r)/gm, ''),
          author: regAuthor(f.slice(0, f.indexOf(' at ')).replace('Posted by ', '')),
          content: contents[index],
          date: new Date(f.slice(f.indexOf(' at ') + 4)).getTime(),
          // content_analys: content_analys
        }
      } catch(err){
        console.log(err)
      }
    })

    browser.close()
    
    return allPosts
  }


module.exports = crawler