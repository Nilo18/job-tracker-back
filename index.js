const express = require('express')
const cors = require('cors')
const app = express()
const port = 3000
const apiURL = 'https://findwork.dev/api/jobs/'
const { LRUCache } = require('lru-cache')

app.use(cors({
    origin: ['http://localhost:4200']
}))
app.use(express.json())

const options = {
    max: 50000,
    ttl: 60 * 1000 * 1
}

const cache = new LRUCache(options)

// const pendingRequests = new Map()

function findCachedQueryKey(query) {
    // console.log(`Checking for query ${query} inside the findCachedQueryKey`)
    for (key of cache.keys()) {
        // console.log("Cache key: ", key)
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
        console.log("The normalized keyword is:", normalizedKeyword)

        
        for (const value of cache.keys()) {
            console.log("All cache keys: ", value);
        }

        const cachedKey = findCachedQueryKey(normalizedKeyword)
        console.log("The cached key is: ", cachedKey)
        if (cachedKey) {
            const cached = cache.get(cachedKey)
            // console.log("The cached data is: ", cached)
            console.log("Cached query detected, using cache and avoiding a request to the API...")
            // for (const value of cache.keys()) {
            //     console.log("All cache keys: ", value);
            // }
            // const filteredData = cached.filter(job => job.role.includes(normalizedKeyword))
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
        // console.log(data)

        // if (!cachedKey) {
        // console.log("Caching the results...")
        if (queryIsStable(normalizedKeyword)) {
            removeShorterCacheKeys(normalizedKeyword, cache)
            cache.set(normalizedKeyword, data)
        }
        
        // }

        // console.log(data)

        return res.status(200).json({status: 200, data, cached: false})
    } catch (error) {
        console.log("Couldn't get jobs: ", error)
        return res.status(500).json({status: 500, message: error.message})
    }
})

app.listen(port, () => {
    console.log(`App listening on port ${port}`)
})
