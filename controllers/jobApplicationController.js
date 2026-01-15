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
            return res.status(400).json({status: 400, message: 'Please provide company name.'})
        }

        if (!date_sent) {
            return res.status(400).json({status: 400, message: 'Please provide the date on which the application was sent.'})
        }

        if (!status) {
            return res.status(400).json({status: 400    , message: 'Please provide the current status of the application.'})
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

const allowedStatuses = ['Pending', 'Accepted', 'Rejected']
async function editJobApplication(req, res, next) {
    try {
        const { id, field, newValue } = req.body

        if (!id) {
            return res.status(400).json({status: 400, message: 'Please provide a job application id.'})
        }

        if (!field) {
            return res.status(400).json({status: 400, message: 'Please provide a field which you want to edit.'})
        }

        if (!newValue) {
            return res.status(400).json({status: 400, message: 'Please provide the new value for the field.'})
        }

        if (field.trim() === 'status' && !allowedStatuses.includes(newValue)) {
            return res.status(400).json({status: 400, message: 'Please provide a valid status value.'})
        }

        console.log(`Changing '${field}' with '${newValue}'...`)
        const updatedDocument = await JobApplication.findByIdAndUpdate(
            id,
            {$set: {[field]: newValue}},
            {new: true},
            {runValidators: true}
        )

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
        const { id } = req.params

        if (!id) {
            return res.status(400).json({status: 400, message: 'Please provide the id of the job application.'})
        }

        const deletedApplication = await JobApplication.findByIdAndDelete(id)
        console.log(deletedApplication)

        return res.status(200).json({status: 200, jobApp: deletedApplication})
    } catch (error) {
        console.log("Couldn't add the job application: ", error)
        return res.status(500).json({status: 500, message: error.message})        
    }
}

module.exports = { getAppliedJobs, addAppliedJob, editJobApplication, deleteJobApplication }