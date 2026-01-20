const express = require('express')
const jobSearchRoute = express.Router()
const search = require('../controllers/jobSearchController.js')

jobSearchRoute.get('/', search)

module.exports = jobSearchRoute