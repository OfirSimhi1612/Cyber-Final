require('dotenv').config()
const mongoose = require('mongoose')

mongoose.connect(`mongodb+srv://OfirSimhi1612:${process.env.MONGO_PASS}@crawler.gzjbg.mongodb.net/alerts?retryWrites=true&w=majority`, {useNewUrlParser: true});


const db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log('connected to mongoDB')
});

const alertSchema = new mongoose.Schema({
    notification: String,
    post: Object,
    user: String,
    read: Boolean,
    reason: String
});

const Alert = mongoose.model('Alert', alertSchema);

const keywordSchema = new mongoose.Schema({
    user: String,
    keywords: Array
});

const Keyword = mongoose.model('Keyword', keywordSchema);

module.exports = {
    Keyword,
    Alert
}
 