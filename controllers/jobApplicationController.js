const JobApplication = require('../models/jobApplication.model.js')

async function getAppliedJobs(req, res, next) {
    try {
        const jobApplications = await JobApplication.find({})
        // console.log(jobApplications)
        return res.status(200).json({status: 200, jobs: jobApplications})
    } catch (error) {
        console.log("Couldn't get job applications: ", error)
        return res.status(500).json({status: 500, message: error.message})
    }
}

module.exports = { getAppliedJobs }