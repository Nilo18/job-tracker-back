const express = require('express')
const cors = require('cors')
const app = express()
const port = 3000
const apiURL = 'https://findwork.dev/api/jobs/?location=london'

app.use(cors({
    origin: ['http://localhost:4200']
}))
app.use(express.json())

app.get('/api/search', async (req, res, next) => {
    try {
        const { keyword } = req.query
        
        if (!keyword) {
            return res.status(401).json({status: 401, message: "Please provide a keyword."})
        }

        const results = await fetch(`${apiURL}&search=${keyword}`, {
            headers: {
                "Authorization": "Token 62d7c90c86f4ee0faeea6ffb94d8d1d77cd58a98"
            }
        })
        
        const data = await results.json()
        // console.log(data)

        if (!results.ok) {
            return res.status(results.status).json({status: results.status, message: "No result found for this search."})
        }

        return res.status(200).json({status: 200, data})
    } catch (error) {
        console.log("Couldn't get jobs: ", error)
        return res.status(500).json({status: 500, message: error.message})
    }
})

app.listen(port, () => {
    console.log(`App listening on port ${port}`)
})
