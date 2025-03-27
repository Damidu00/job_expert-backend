import mongoose from "mongoose";

const jobSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    requirements: {
        type: String,
        required: true
    },
    salary: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    jobType: {
        type: String,
        required: true,
        enum: ['Full-time', 'Part-time', 'Contract', 'Internship', 'Remote']
    },
    experienceLevel: {
        type: String,
        required: true,
        enum: ['Entry level', 'Mid level', 'Senior', 'Executive']
    },
    numberOfPositions: {
        type: Number,
        required: true,
        default: 1
    },
    company: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Company',
        required: true
    },
    status: {
        type: String,
        enum: ['Pending', 'Approved', 'Rejected', 'Filled'],
        default: 'Pending'
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    applicationDeadline: {
        type: Date,
        required: true
    },
    positionsFilled: {
        type: Number,
        default: 0
    },
    acceptedBy: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    rejectedBy: [{
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User'
    }],
    applications: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        status: {
            type: String,
            enum: ['Pending', 'Accepted', 'Rejected'],
            default: 'Pending'
        },
        resume: {
            type: String
        },
        coverLetter: {
            type: String
        },
        appliedDate: {
            type: Date,
            default: Date.now
        }
    }],
    reviews: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        decision: {
            type: String,
            enum: ['Approved', 'Rejected']
        },
        comment: {
            type: String
        },
        date: {
            type: Date,
            default: Date.now
        }
    }]
}, {timestamps: true});

export const Job = mongoose.model('Job', jobSchema); 