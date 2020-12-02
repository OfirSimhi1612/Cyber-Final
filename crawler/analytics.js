const Sentiment = require('sentiment');
const sentiment = new Sentiment(); 
const axios = require('axios')

const nerHost = process.env.NER_HOST || 'localhost'
const nerPort = process.env.NER_PORT || '9000'



function regAuthor(author){
    let reg_author = author

    if(['Unknwon', 'Anonymous', 'Guest', ''].includes(author)){
        reg_author = 'Anonymous'
    } 

    return reg_author
}

async function contentAnalys(content){
    content = content.join(', ')
    try{
        const {data: entities} = await axios.post(`http://${nerHost}:${nerPort}`, {text: content})
        const SentimentAnalysis = sentiment.analyze(content);
        return {
            score: SentimentAnalysis.comparative, 
            neg_words: SentimentAnalysis.negative,
            pos_words: SentimentAnalysis.positive,
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
