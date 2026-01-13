const express = require('express')
const cors = require('cors')
const app = express()
require('dotenv').config()
const port = 3000
const apiURL = 'https://findwork.dev/api/jobs/'
const { LRUCache } = require('lru-cache')
const mongoose = require('mongoose')
const mongoURI = process.env.MONGO_URI
// const JobApplication = require('./models/jobApplication.model.js')
const jobApplicationRouter = require('./routes/jobApplicationRoute.js')

app.use(cors({
    origin: ['http://localhost:4200']
}))
app.use(express.json())
app.use('/api/jobs', jobApplicationRouter)

const options = {
    max: 50000,
    ttl: 60 * 1000 * 1
}

const cache = new LRUCache(options)

function findCachedQueryKey(query) {
    for (key of cache.keys()) {
        if (key.startsWith(query) && key.length >= query.length) {
            return key;
        }
    }    
    return null
}

function queryIsStable(query) {
    const queryTokens = query.split(' ')
    return (
        queryTokens.length >= 2 &&
        queryTokens.every(w => w.length > 3)
    )
}

function removeShorterCacheKeys(keyword, cache) {
    for (let key of cache.keys()) {
        if (keyword.startsWith(key) && keyword.length >= key.length) {
            cache.delete(key)
        }
    }
}

app.get('/api/search', async (req, res, next) => {
    try {
        const { keyword } = req.query
        
        if (!keyword) {
            return res.status(401).json({status: 400, message: "Please provide a keyword."})
        }

        // Enforce at least 3 characters for keyword to improve storing queries in the cache
        if (keyword.length < 3) {
            return res.status(200).json({status: 200, data: [], cached: false})
        }

        // Make the keyword lowercase and remove unnecessary spaces
        const normalizedKeyword = keyword.toLowerCase().trim().replace(/\s+/g, ' ')
        const cachedKey = findCachedQueryKey(normalizedKeyword)
        if (cachedKey) {
            const cached = cache.get(cachedKey)
            return res.status(200).json({status: 200, data: cached, cached: true})
        }

        const results = await fetch(`${apiURL}?search=${normalizedKeyword}`, {
            headers: {
                "Authorization": "Token 62d7c90c86f4ee0faeea6ffb94d8d1d77cd58a98"
            }
        })
        
        const data = await results.json().then(json => json.results.map(job => ({
            id: job.id,
            role: job.role,
            company_name: job.company_name
        })))

        if (!results.ok) {
            return res.status(results.status).json({status: results.status, message: "No result found for this search."})
        }

        if (queryIsStable(normalizedKeyword)) {
            removeShorterCacheKeys(normalizedKeyword, cache)
            cache.set(normalizedKeyword, data)
        }
        return res.status(200).json({status: 200, data, cached: false})
    } catch (error) {
        console.log("Couldn't get jobs: ", error)
        return res.status(500).json({status: 500, message: error.message})
    }
})

app.listen(port, () => {
    console.log(`App listening on port ${port}`)
})


async function connect() {
    try {
        await mongoose.connect(mongoURI)   
        // await JobApplication.create({
        //     userId: '12fgXGh',
        //     company_name: 'Google',
        //     status: 'pending',
        //     date_sent: new Date()
        // })

        console.log('Connected to the database.')     
    } catch (error) {
        console.log("Couldn't connect to the databse: ", error)
    }
}

connect()