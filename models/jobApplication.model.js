const mongoose = require('mongoose')

const JobApplicationSchema = mongoose.Schema({
    userId: {
        required: true,
        type: String
    },

    company_name: {
        required: true,
        type: String
    },

    date_sent: {
        required: true,
        type: Date,
        default: Date.now,
    },

    status: {
        required: true,
        type: String,
        enum: ['pending', 'rejected', 'accepted']
    }
})

const JobApplication = mongoose.model('JobApplication', JobApplicationSchema)
module.exports = JobApplication