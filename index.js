const http = require('http')
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const cors = require('cors')
const mongoose = require('mongoose')
const blogsRouter = require('./controllers/blogs')

app.use(cors())
app.use(bodyParser.json())

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const MONGO_USER = process.env.MONGO_USER
const MONGO_PASS = process.env.MONGO_PASS

// Production: MONGO_DB = ds253783.mlab.com:53783/persons
// Development: MONGO_DB = ds111370.mlab.com:11370/markus-db
const MONGO_DB = process.env.MONGO_DB

const mongoUrl = `mongodb://${MONGO_USER}:${MONGO_PASS}@${MONGO_DB}`

mongoose
  .connect(mongoUrl, { useNewUrlParser: true })
  .then( () => {
    console.log('connected to database', MONGO_DB)
  })
  .catch( err => {
    console.log(err)
  })

app.use('/api/blogs', blogsRouter)

const PORT = 3003
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})