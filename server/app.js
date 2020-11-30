const { static } = require('express')
const express = require('express')
const morgan = require('morgan')

const app = express()

app.use(static('./build'))
app.use(express.json())
app.use(morgan('dev'))

app.use('/api', require('./api'))

module.exports = app
