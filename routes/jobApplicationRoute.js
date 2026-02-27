const express = require('express')
const { getAppliedJobs, addAppliedJob, 
    editJobApplication, deleteJobApplication } = require('../controllers/jobApplicationController.js')
const jobApplicationRouter = express.Router()
    
jobApplicationRouter.get('/:userId', getAppliedJobs)
jobApplicationRouter.post('/', addAppliedJob)
jobApplicationRouter.put('/', editJobApplication)
jobApplicationRouter.delete('/', deleteJobApplication)

module.exports = jobApplicationRouter