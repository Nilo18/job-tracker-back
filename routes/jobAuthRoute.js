const express = require('express')
const jobAuthRouter = express.Router()
const { login } = require('../controllers/jobAuthController.js')

jobAuthRouter.post('/login', login)

module.exports = jobAuthRouter