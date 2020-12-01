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
        notification: `One of your keywords (${keywords.join(', ')}), appeared in a new post!`,
        post,
        user,
        read: false
    })

    return alert
}

function checkKeywords(posts, keyword){
    posts.forEach(post => post.content = post.content.join(', '))
    const searcher = new FuzzySearch(posts, ['title', 'author', 'content'], {
        caseSensitive: false,
      });

    const result = searcher.search(posts);

    return result
}

async function processPosts(newPosts){
    // should do the following process for all the users
    try{
        const keywords = await getKeywords() 
        keywords.forEach(keyword => {
            const matchingPosts = checkKeywords(newPosts, keyword)
            if(matchingPosts.length > 0){
                matchingPosts.forEach(post => {
                    const alert = createAlert(post, keyword)
                    console.group(alert)
                    await saveAlert(alert)
                })
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