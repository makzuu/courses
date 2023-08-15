const logger = require('./utils/logger')
const config = require('./utils/config')
const middleware = require('./utils/middleware')

const mongoose = require('mongoose')
const express = require('express')
const cors = require('cors')

const blogsRouter = require('./controllers/blogs')

const app = express()

logger.info('connecting to ', config.MONGODB_URI)

mongoose.connect(config.MONGODB_URI)
    .then(() => logger.info('connected to MongoDB'))
    .catch(error => logger.error('error connecting to MongoDB: ', error.message))

app.use(cors())
app.use(express.json())

app.use(middleware.logs)

app.use('/api/blogs', blogsRouter)

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app