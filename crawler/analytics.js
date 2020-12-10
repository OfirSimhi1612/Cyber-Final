const Sentiment = require('sentiment');
const sentiment = new Sentiment(); 
const axios = require('axios')

const nerHost = process.env.NER_HOST || 'localhost'
const nerPort = process.env.NER_PORT || '9000'



function regAuthor(author){
    let reg_author = author.replace(/(\r\n|\n|\r)/gm, '').replace(/(\r\t|\t|\r)/gm, '')

    if(['Unknwon', 'Anonymous', 'Guest', ''].includes(author)){
        reg_author = 'Anonymous'
    } 

    return reg_author
}



async function contentAnalys(content){
    try{
        const {data: entities} = await axios.post(`http://${nerHost}:${nerPort}/`, {text: content})
        const SentimentAnalysis = sentiment.analyze(content);
        return {
            score: SentimentAnalysis.comparative, 
            entities: entities
        }
    } catch(error){
        console.log(error)
    }   
}



module.exports = {
    regAuthor,
    contentAnalys
}
