const express = require('express')
const cors = require('cors')
const app = express()
require('dotenv').config()
const port = 3000
const mongoose = require('mongoose')
const mongoURI = process.env.MONGO_URI
const jobApplicationRouter = require('./routes/jobApplicationRoute.js')
const jobSearchRouter = require('./routes/jobSearchRoute.js')
const jobAuthRouter = require('./routes/jobAuthRoute.js')
const session = require('express-session')
const { Strategy } = require('passport-facebook')

app.use(cors({
    origin: ['http://localhost:4200', 'https://job-tracker-sage-mu-39.vercel.app']
}))
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.json())
app.use('/api/search', jobSearchRouter)
app.use('/api/auth', jobAuthRouter)
app.use('/api/jobs', jobApplicationRouter)

app.get('/', (req, res, next) => {
  try {
    return res.json({status: 200, message: 'The server is running.'})
  } catch (error) {
    return res.status(error.status).json({status: error.status, message: 'Failed to connect to the server'})
  }
})

app.get('/ping', (req, res, next) => {
  try {
    return res.json({status: 200, message: 'Pinged successfully.'})
  } catch (error) {
    return res.status(error.status).json({status: error.status, message: 'Failed to ping the server'})
  }
})

app.listen(port, () => {
    console.log(`App listening on port ${port}`)
})

async function connect() {
    try {
        await mongoose.connect(mongoURI)   
        console.log('Connected to the database.')     
    } catch (error) {   
        console.error("Database connection error:", error)
    }
}

connect()