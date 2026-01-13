const express = require('express')
const { getAppliedJobs } = require('../controllers/jobApplicationController.js')
const jobApplicationRouter = express.Router()

jobApplicationRouter.get('/', getAppliedJobs)

module.exports = jobApplicationRouter