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

async function addAppliedJob(req, res, next) {
    try {
        const { company_name, date_sent, status } = req.body

        if (!company_name) {
            return res.status(401).json({status: 401, message: 'Please provide company name.'})
        }

        if (!date_sent) {
            return res.status(401).json({status: 401, message: 'Please provide the date on which the application was sent.'})
        }

        if (!status) {
            return res.status(401).json({status: 401, message: 'Please provide the current status of the application.'})
        }

        const newJobApp = await JobApplication.create({
            userId: '12fgXGh',
            company_name: company_name,
            date_sent: date_sent,
            status: status
        })

        return res.status(200).json({status: 200, jobApp: newJobApp})
    } catch (error) {
        console.log("Couldn't add the job application: ", error)
        return res.status(500).json({status: 500, message: error.message})
    }
}

module.exports = { getAppliedJobs, addAppliedJob }