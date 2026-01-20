const express = require('express')
const cors = require('cors')
const app = express()
require('dotenv').config()
const port = 3000
const mongoose = require('mongoose')
const mongoURI = process.env.MONGO_URI
const jobApplicationRouter = require('./routes/jobApplicationRoute.js')
const jobSearchRouter = require('./routes/jobSearchRoute.js')

app.use(cors({
    origin: ['http://localhost:4200']
}))
app.use(express.json())
app.use('/api/search', jobSearchRouter)
app.use('/api/jobs', jobApplicationRouter)

app.listen(port, () => {
    console.log(`App listening on port ${port}`)
})


async function connect() {
    try {
        await mongoose.connect(mongoURI)   
        console.log('Connected to the database.')     
    } catch (error) {
        console.log("Couldn't connect to the databse: ", error)
    }
}

connect()