const { LRUCache } = require('lru-cache')
const apiURL = 'https://findwork.dev/api/jobs/'
const { findCachedQueryKey, queryIsStable, removeShorterCacheKeys } = require('../services/jobSearchService.js')

const options = {
    max: 50000,
    ttl: 60 * 1000 * 1
}

const cache = new LRUCache(options)

async function search(req, res, next) {
    try {
        const { keyword } = req.query
        
        if (!keyword) {
            return res.status(400).json({status: 400, message: "Please provide a keyword."})
        }

        // Enforce at least 3 characters for keyword to improve storing queries in the cache
        if (keyword.length < 3) {
            return res.status(200).json({status: 200, data: [], cached: false})
        }

        // Make the keyword lowercase and remove unnecessary spaces
        const normalizedKeyword = keyword.toLowerCase().trim().replace(/\s+/g, ' ')
        const cachedKey = findCachedQueryKey(cache, normalizedKeyword)
        if (cachedKey) {
            const cached = cache.get(cachedKey)
            return res.status(200).json({status: 200, data: cached, cached: true})
        }

        const results = await fetch(`${apiURL}?search=${normalizedKeyword}`, {
            headers: {
                "Authorization": process.env.FINDWORK_API_TOKEN
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
}

module.exports = search