const Sentiment = require('sentiment');
const sentiment = new Sentiment(); 
const NER = require('ner');
const util = require('util');


const ner = new NER({
    port:9191,
    host:'localhost'
})

const getEntities = util.promisify(ner.get).bind(ner)


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
        const entities = await getEntities(content)
        const SentimentAnalysis = sentiment.analyze(content);
        return {
            score: SentimentAnalysis.comparative, 
            neg_words: SentimentAnalysis.negative,
            pos_words: SentimentAnalysis.positive,
            entities: entities.entities
        }
    } catch(error){
        console.log(error)
    }   
}



module.exports = {
    regAuthor,
    contentAnalys
}
