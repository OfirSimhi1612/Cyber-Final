const Sentiment = require('sentiment');
const sentiment = new Sentiment(); 
const NER = require('ner');


const ner = new NER({
    port:9191,
    host:'localhost'
})

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
        const entities = await new Promise((resolve, reject) => {
            ner.get(content, (err, res) => {
                if(err){
                    reject(err)
                }
                resolve(res)
            })
        })
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
