const JobApplication = require('../models/jobApplication.model.js')

async function getAppliedJobs(req, res, next) {
    try {
        const { userId } = req.params

        if (!userId) {
            return res.status(400).json({status: 400, message: "Please provide a user id."})
        }

        const jobApplications = await JobApplication.find({userId: userId})
        
        const acceptedCount = jobApplications.filter(job => job.status === 'Accepted').length
        const rejectedCount = jobApplications.filter(job => job.status === 'Rejected').length
        const pendingCount = jobApplications.filter(job => job.status === 'Pending').length

        return res.status(200).json({
            status: 200,
            jobs: jobApplications, 
            accepted: acceptedCount,
            rejected: rejectedCount, 
            pending: pendingCount
        })
    } catch (error) {
        console.log("Couldn't get job applications: ", error)
        return res.status(500).json({status: 500, message: error.message})
    }
}

async function addAppliedJob(req, res, next) {
    try {
        const { userId, company_name, date_sent, status } = req.body

        if (!userId) {
            return res.status(400).json({status: 400, message: 'Please provide a userId.'})
        }

        if (!company_name) {
            return res.status(400).json({status: 400, message: 'Please provide company name.'})
        }

        if (!date_sent) {
            return res.status(400).json({status: 400, message: 'Please provide the date on which the application was sent.'})
        }

        if (!status) {
            return res.status(400).json({status: 400    , message: 'Please provide the current status of the application.'})
        }

        const newJobApp = await JobApplication.create({
            userId: userId,
            company_name: company_name,
            date_sent: date_sent,
            status: status
        })
        console.log(newJobApp)

        return res.status(200).json({status: 200, jobApp: newJobApp})
    } catch (error) {
        console.log("Couldn't add the job application: ", error)
        return res.status(500).json({status: 500, message: error.message})
    }
}

const allowedStatuses = ['Pending', 'Accepted', 'Rejected']
async function editJobApplication(req, res, next) {
    try {
        const {id, newObject } = req.body

        if (!id) {
            return res.status(400).json({status: 400, message: 'Please provide a job application id.'})
        }

        if (!newObject) {
            return res.status(400).json({status: 400, message: 'Please provide a valid job application'})
        }

        // console.log(`Changing '${field}' with '${newValue}'...`)
        const updatedDocument = await JobApplication.findOneAndUpdate(
            { _id: id, userId: newObject.userId },
            newObject,
            { new: true, runValidators: true }
        );

        if (!updatedDocument) {
            return res.status(404).json({status: 404, message: "A job application with the given id couldn't be found"})
        }

        return res.status(200).json({status: 200, jobApp: updatedDocument})
    } catch (error) {
        console.log("Couldn't edit job application: ", error)
        return res.status(500).json({status: 500, message: error.message})
    }
}

async function deleteJobApplication(req, res, next) {
    try {
        const { userId, id } = req.body

        if (!userId) {
            return res.status(400).json({status: 400, message: "Please provide a user id."})
        }

        if (!id) {
            return res.status(400).json({status: 400, message: 'Please provide the id of the job application.'})
        }

        const deletedApplication = await JobApplication.findOneAndDelete({_id: id, userId: userId})
        console.log(deletedApplication)

        return res.status(200).json({status: 200, jobApp: deletedApplication})
    } catch (error) {
        console.log("Couldn't add the job application: ", error)
        return res.status(500).json({status: 500, message: error.message})        
    }
}

module.exports = { getAppliedJobs, addAppliedJob, editJobApplication, deleteJobApplication }