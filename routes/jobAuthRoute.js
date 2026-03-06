const express = require('express')
const jobAuthRouter = express.Router()
const passport = require('passport')
const { login } = require('../controllers/jobAuthController.js')

jobAuthRouter.post('/login', login)
jobAuthRouter.get('/facebook', passport.authenticate('facebook', {scope: ['email']}))
jobAuthRouter.get('/facebook/callback', passport.authenticate('facebook', { failureRedirect: '/login' }))

module.exports = jobAuthRouter