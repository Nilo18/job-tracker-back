const express = require('express')
const { getAppliedJobs, addAppliedJob } = require('../controllers/jobApplicationController.js')
const jobApplicationRouter = express.Router()

jobApplicationRouter.get('/', getAppliedJobs)
jobApplicationRouter.post('/', addAppliedJob)

module.exports = jobApplicationRouter