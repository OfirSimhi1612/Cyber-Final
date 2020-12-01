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

const posts = [
    {
        "header": "Hack instagram( Free tst)",
        "author": "Anonymous",
        "content": [
          "Hi,",
          " ",
          "Lately i have found a security bug in instagram that if you use it You can get access of 80% of instagram accounts.",
          " ",
          "This bug is from the instagram server not with simple tricks like Phishing, Rat and etc."
        ],
        "date": 1606683025000,
        "analysis": {
          "score": 0.05,
          "neg_words": [],
          "pos_words": [
            "like"
          ]
        }
      },
      {
        "header": "New Instagram hack",
        "author": "Anonymous",
        "content": [
          "Hi,",
          " ",
          "Lately i have found a security bug in instagram that if you use it You can get access of 80% of instagram accounts.",
          " ",
          "This bug is from the instagram server not with simple tricks like Phishing, Rat and etc."
        ],
        "date": 1606684653000,
        "analysis": {
          "score": 0.05,
          "neg_words": [],
          "pos_words": [
            "like"
          ]
        }
      },
      {
        "header": "Hack instagram 2021",
        "author": "Anonymous",
        "content": [
          "Hello I am an Instagram hacker, contact me to hack the desired screw!",
          " ",
          "Email:arthub35@gmail.com",
          "T.me/Qargh"
        ],
        "date": 1606684739000,
        "analysis": {
          "score": 0.10526315789473684,
          "neg_words": [],
          "pos_words": [
            "desired"
          ]
        }
      },
      {
        "header": "FORBIDDEN VIDEO STUDIO",
        "author": "Anonymous",
        "content": [
          "636Gb VIDEOS ",
          " ",
          "http://dvstskgd6plwl7tg.onion"
        ],
        "date": 1606573934000,
        "analysis": {
          "score": 0,
          "neg_words": [],
          "pos_words": []
        }
      },
      {
        "header": "FORBIDDEN VIDEO STUDIO",
        "author": "Anonymous",
        "content": [
          "636Gb VIDEOS ",
          " ",
          "http://dvstskgd6plwl7tg.onion"
        ],
        "date": 1606662614000,
        "analysis": {
          "score": 0,
          "neg_words": [],
          "pos_words": []
        }
      },
      {
        "header": "Paste#pajofwvhv",
        "author": "Anonymous",
        "content": [
          "здарова пидар"
        ],
        "date": 1606685887000,
        "analysis": {
          "score": 0,
          "neg_words": [],
          "pos_words": []
        }
      },
      {
        "header": "shahar",
        "author": "Anonymous",
        "content": [
          "my name is enigo montoya"
        ],
        "date": 1606674137000,
        "analysis": {
          "score": 0,
          "neg_words": [],
          "pos_words": []
        }
      }
]

posts.forEach(post => contentAnalys(post.content).then(res => console.log(res)))

module.exports = {
    regAuthor,
    contentAnalys
}
