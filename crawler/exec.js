const fs = require('fs');
const yaml = require('js-yaml');
const crawler = require('./crawler')

try {
    let fileContents = fs.readFileSync('./config.yml', 'utf8');
    let config = yaml.safeLoadAll(fileContents);

    config.forEach(async (site) => {
        const pastes = await crawler(site)
    })

} catch (e) {
    console.log(e);
}


