const express = require('express')
const { getAppliedJobs, addAppliedJob, deleteJobApplication } = require('../controllers/jobApplicationController.js')
const jobApplicationRouter = express.Router()

jobApplicationRouter.get('/', getAppliedJobs)
jobApplicationRouter.post('/', addAppliedJob)
jobApplicationRouter.delete('/:id', deleteJobApplication)

module.exports = jobApplicationRouter