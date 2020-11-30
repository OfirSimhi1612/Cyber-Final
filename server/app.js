const express = require('express')
const morgan = require('morgan')
const {updateDataBase} = require('./elastic-search')

const app = express()

app.use(express.json())
app.use(morgan('dev'))

app.use('/api', require('./api'))

setInterval(updateDataBase, 30000);

module.exports = app
