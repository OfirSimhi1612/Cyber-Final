const { static } = require('express')
const express = require('express')
const morgan = require('morgan')
const { updateDataBase } = require('./elastic-search/crawler')

const app = express()

app.use(static('./build'))
app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({limit: '50mb', extended: true}));
// app.use(morgan('dev'))

app.use('/api', require('./api'))

setTimeout(updateDataBase, 60000)
setInterval(updateDataBase, 600000)

module.exports = app
