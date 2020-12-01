const {Client} = require('@elastic/elasticsearch')
const client = new Client({node: process.env.ELS_URL || 'http://localhost:9200'})
