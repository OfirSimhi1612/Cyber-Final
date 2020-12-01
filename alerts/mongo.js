const { Keyword, Alert } = require('./schmas')
const FuzzySearch = require('fuzzy-search');

async function getKeywords(user = 'root'){
    try{
        const keywords = await Keyword.findOne({user: user}).exec()
        if(!keywords){
            return false
        }
        return keywords.keywords
    } catch(err){
        console.log(err)
    }
    
}

async function saveAlert(alert){
    alert.save((err, res) => {
        if(err){
            console.log(err)
        } else {
            return res
        }
    })
}

function createAlert(post, keywords,  user = 'root'){
    const alert = new Alert({
        notification: `Some of your keywords (${keywords.join(', ')}), appeared in a new post!`,
        post,
        user,
        read: false
    })

    return alert
}

function checkKeywords(post, keywords){
    const searcher = new FuzzySearch(post, ['title', 'author', 'content', 'analysis'], {
        caseSensitive: false,
      });

    const matching = []

    for(let keyword of keywords){
        const result = searcher.search(keyword);
        if(result){
            matching.push(keyword)
        }
    }

    if(matching.length > 0){
        return matching
    } 

    return false
}

async function processPosts(newPosts){
    // should do the following process for all the users
    try{
        newPosts.forEach(async (post) => {
            const keywords = await getKeywords() 
            const matching = checkKeywords(post, keywords)
            if(matching){
                const alert = createAlert(post, keywords)
                console.group(alert)
                await saveAlert(alert)
            }
        })
        return true
    } catch(err){
        console.log(err)
        return false
    }
}

async function saveError(error){
    try{
        const errAlert = new Alert({
            notification: 'The crawler has failed!',
            reason: error
        })
        await saveAlert(errAlert)
        return true
    } catch(err){
        console.log(err)
        return false
    }
}

module.exports = {
    processPosts,
    saveError
}