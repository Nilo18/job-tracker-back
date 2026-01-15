const express = require('express')
const { getAppliedJobs, addAppliedJob, 
    editJobApplication, deleteJobApplication } = require('../controllers/jobApplicationController.js')
const jobApplicationRouter = express.Router()

jobApplicationRouter.get('/', getAppliedJobs)
jobApplicationRouter.post('/', addAppliedJob)
jobApplicationRouter.patch('/', editJobApplication)
jobApplicationRouter.delete('/:id', deleteJobApplication)

module.exports = jobApplicationRouter