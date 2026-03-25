const JobApplication = require('../models/jobApplication.model.js')

const allowedStatuses = ['All status', 'Pending', 'Accepted', 'Rejected']
async function getAppliedJobs(req, res, next) {
    try {
        const { userId } = req.params
        const { keyword, filter } = req.query
        
        if (!userId) {
            return res.status(400).json({status: 400, message: "Please provide a user id."})
        }

        const query = { userId }

        if (filter && allowedStatuses.includes(filter)) {
            query.status = filter
        }

        if (keyword) {
            query.$or = [
                { company_name: { $regex: keyword, $options: "i" } },
                { position: { $regex: keyword, $options: "i" } },
                { location: { $regex: keyword, $options: "i" } }
            ]
        }

        const jobApplications = await JobApplication.find(query)

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
        return res.status(500).json({status: 500, message: error.message})
    }
}

async function addAppliedJob(req, res, next) {
    try {
        const { userId, company_name, position, date_sent, location, min_salary, max_salary, status } = req.body

        if (!userId) {
            return res.status(400).json({status: 400, message: 'Please provide a userId.'})
        }

        if (!company_name) {
            return res.status(400).json({status: 400, message: 'Please provide company name.'})
        }

        if (!position) {
            return res.status(400).json({status: 400, message: 'Please provide position.'})
        }

        if (!date_sent) {
            return res.status(400).json({status: 400, message: 'Please provide the date on which the application was sent.'})
        }

        if (!position) {
            return res.status(400).json({status: 400, message: 'Please provide location.'})
        }

        if (!status) {
            return res.status(400).json({status: 400    , message: 'Please provide the current status of the application.'})
        }

        const newJobApp = await JobApplication.create({
            userId: userId,
            company_name: company_name,
            position: position,
            date_sent: date_sent,
            location: location,
            min_salary: min_salary || null,
            max_salary: max_salary || null,
            status: status
        })

        return res.status(200).json({status: 200, jobApp: newJobApp})
    } catch (error) {
        return res.status(500).json({status: 500, message: error.message})
    }
}

async function editJobApplication(req, res, next) {
    try {
        const {id, newObject } = req.body

        if (!id) {
            return res.status(400).json({status: 400, message: 'Please provide a job application id.'})
        }

        if (!newObject) {
            return res.status(400).json({status: 400, message: 'Please provide a valid job application'})
        }

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

        return res.status(200).json({status: 200, jobApp: deletedApplication})
    } catch (error) {
        return res.status(500).json({status: 500, message: error.message})        
    }
}

module.exports = { getAppliedJobs, addAppliedJob, editJobApplication, deleteJobApplication }