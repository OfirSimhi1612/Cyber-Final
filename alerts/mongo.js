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

function createAlert(post, keyword,  user = 'root'){
    const alert = new Alert({
        notification: `One of your keywords (${keyword}), appeared in a new post!`,
        post,
        user,
        read: false
    })

    return alert
}

function checkKeywords(posts, keyword){
    const searcher = new FuzzySearch(posts, ['title', 'author', 'content'], {
        caseSensitive: false,
      });

    const result = searcher.search(keyword);

    return result
}

async function processPosts(newPosts){
    // should do the following process for all the users
    try{
        const keywords = await getKeywords() 
        if(keywords){
            keywords.forEach(keyword => {
                const matchingPosts = checkKeywords(newPosts, keyword)
                if(matchingPosts.length > 0){
                    matchingPosts.forEach(async (post) => {
                        const alert = createAlert(post, keyword)
                        console.group(alert)
                        await saveAlert(alert)
                    })
                }
            })
        }
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
            reason: error,
            user: 'root'
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