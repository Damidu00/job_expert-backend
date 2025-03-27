import { Job } from "../models/jobModel.js";

// Get all jobs
export const getAllJobs = async (req, res) => {
    try {
        const jobs = await Job.find()
            .populate('company', 'name industry location logo')
            .sort({ createdAt: -1 });
        
        return res.status(200).json(jobs);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Error retrieving jobs", error: error.message });
    }
};

// Get jobs created by admin
export const getAdminJobs = async (req, res) => {
    try {
        const adminId = req.user.id; // Assuming middleware sets req.user
        const jobs = await Job.find({ createdBy: adminId })
            .populate('company', 'name industry location logo')
            .sort({ createdAt: -1 });
        
        return res.status(200).json(jobs);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Error retrieving admin jobs", error: error.message });
    }
};

// Get job by ID
export const getJobById = async (req, res) => {
    try {
        const job = await Job.findById(req.params.id)
            .populate('company', 'name description industry location website logo contactEmail contactPhone')
            .populate('reviews.user', 'fullname email');
        
        if (!job) {
            return res.status(404).json({ message: "Job not found" });
        }
        
        return res.status(200).json(job);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Error retrieving job", error: error.message });
    }
};

// Create a new job
export const postJob = async (req, res) => {
    try {
        const { 
            title, description, requirements, salary, location, 
            jobType, experienceLevel, numberOfPositions, company, applicationDeadline 
        } = req.body;
        
        // Validation
        if (!title || !description || !requirements || !salary || !location || 
            !jobType || !experienceLevel || !company || !applicationDeadline) {
            return res.status(400).json({ message: "All fields are required" });
        }
        
        const newJob = new Job({
            title,
            description,
            requirements,
            salary,
            location,
            jobType,
            experienceLevel,
            numberOfPositions: numberOfPositions || 1,
            company,
            applicationDeadline,
            createdBy: req.user.id, // Assuming middleware sets req.user
            status: 'Pending'
        });
        
        const savedJob = await newJob.save();
        
        return res.status(201).json({
            message: "Job posted successfully",
            job: savedJob
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Error posting job", error: error.message });
    }
};

// Update a job
export const editJob = async (req, res) => {
    try {
        const jobId = req.params.id;
        const updates = req.body;
        
        const job = await Job.findById(jobId);
        
        if (!job) {
            return res.status(404).json({ message: "Job not found" });
        }
        
        // Check if the user is the creator or has admin rights
        if (job.createdBy.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ message: "Unauthorized: You can only edit jobs you created" });
        }
        
        const updatedJob = await Job.findByIdAndUpdate(
            jobId,
            { $set: updates },
            { new: true }
        );
        
        return res.status(200).json({
            message: "Job updated successfully",
            job: updatedJob
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Error updating job", error: error.message });
    }
};

// Delete a job
export const deleteJob = async (req, res) => {
    try {
        const jobId = req.params.id;
        
        const job = await Job.findById(jobId);
        
        if (!job) {
            return res.status(404).json({ message: "Job not found" });
        }
        
        // Check if the user is the creator or has admin rights
        if (job.createdBy.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ message: "Unauthorized: You can only delete jobs you created" });
        }
        
        await Job.findByIdAndDelete(jobId);
        
        return res.status(200).json({ message: "Job deleted successfully" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Error deleting job", error: error.message });
    }
};

// Add a review to a job
export const reviewJob = async (req, res) => {
    try {
        const { decision, comment } = req.body;
        const jobId = req.params.id;
        const userId = req.user.id; // Assuming middleware sets req.user
        
        if (!decision || !['Approved', 'Rejected'].includes(decision)) {
            return res.status(400).json({ message: "Valid decision (Approved or Rejected) is required" });
        }
        
        const job = await Job.findById(jobId);
        
        if (!job) {
            return res.status(404).json({ message: "Job not found" });
        }
        
        // Check if user has already reviewed this job
        const existingReview = job.reviews.find(review => 
            review.user && review.user.toString() === userId);
            
        if (existingReview) {
            // Update existing review
            existingReview.decision = decision;
            existingReview.comment = comment;
            existingReview.date = new Date();
        } else {
            // Add new review
            job.reviews.push({
                user: userId,
                decision,
                comment,
                date: new Date()
            });
        }
        
        // Calculate if majority approved
        const approvedCount = job.reviews.filter(r => r.decision === 'Approved').length;
        const rejectedCount = job.reviews.filter(r => r.decision === 'Rejected').length;
        
        // Update job status based on reviews (optional logic - can be customized)
        if (approvedCount > rejectedCount && job.reviews.length >= 3) {
            job.status = 'Approved';
        } else if (rejectedCount > approvedCount && job.reviews.length >= 3) {
            job.status = 'Rejected';
        }
        
        await job.save();
        
        return res.status(200).json({
            message: "Job review submitted successfully",
            job
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Error reviewing job", error: error.message });
    }
};

// Apply for a job
export const applyForJob = async (req, res) => {
    try {
        const jobId = req.params.id;
        const userId = req.user.id; // From auth middleware
        const { coverLetter, resume } = req.body;
        
        // Find the job
        const job = await Job.findById(jobId);
        
        if (!job) {
            return res.status(404).json({ message: "Job not found" });
        }
        
        // Check if job is approved
        if (job.status !== 'Approved') {
            return res.status(400).json({ message: "Cannot apply to jobs that are not approved" });
        }
        
        // Check application deadline
        if (new Date(job.applicationDeadline) < new Date()) {
            return res.status(400).json({ message: "Application deadline has passed" });
        }
        
        // Check if all positions are filled
        if (job.positionsFilled >= job.numberOfPositions) {
            return res.status(400).json({ message: "All positions for this job have been filled" });
        }
        
        // Check if user has already applied
        const existingApplication = job.applications.find(app => 
            app.user && app.user.toString() === userId);
            
        if (existingApplication) {
            return res.status(400).json({ message: "You have already applied for this job" });
        }
        
        // Add application
        job.applications.push({
            user: userId,
            coverLetter,
            resume,
            appliedDate: new Date()
        });
        
        await job.save();
        
        return res.status(200).json({
            message: "Application submitted successfully",
            applicationId: job.applications[job.applications.length - 1]._id
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Error applying for job", error: error.message });
    }
};

// Update application status (for admin)
export const updateApplicationStatus = async (req, res) => {
    try {
        const { jobId, applicationId } = req.params;
        const { status } = req.body;
        
        if (!status || !['Pending', 'Accepted', 'Rejected'].includes(status)) {
            return res.status(400).json({ message: "Valid status (Pending, Accepted, or Rejected) is required" });
        }
        
        // Find the job
        const job = await Job.findById(jobId);
        
        if (!job) {
            return res.status(404).json({ message: "Job not found" });
        }
        
        // Check if the user is the creator or has admin rights
        if (job.createdBy.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ message: "Unauthorized: You can only update applications for jobs you created" });
        }
        
        // Find the application
        const application = job.applications.id(applicationId);
        
        if (!application) {
            return res.status(404).json({ message: "Application not found" });
        }
        
        // If status is changing to Accepted and positions are already filled
        if (status === 'Accepted' && application.status !== 'Accepted') {
            // Check if we still have positions available
            if (job.positionsFilled >= job.numberOfPositions) {
                return res.status(400).json({ message: "All positions for this job have been filled" });
            }
            
            // Increment positionsFilled if accepting
            job.positionsFilled += 1;
        }
        
        // If status is changing from Accepted to something else, decrement positions filled
        if (application.status === 'Accepted' && status !== 'Accepted') {
            job.positionsFilled = Math.max(0, job.positionsFilled - 1);
        }
        
        // Update status
        application.status = status;
        
        await job.save();
        
        return res.status(200).json({
            message: "Application status updated successfully",
            positionsFilled: job.positionsFilled,
            totalPositions: job.numberOfPositions
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Error updating application status", error: error.message });
    }
};

// Accept a job
export const acceptJob = async (req, res) => {
    try {
        const jobId = req.params.id;
        const userId = req.user.id; // From auth middleware
        
        // Find the job
        const job = await Job.findById(jobId);
        
        if (!job) {
            return res.status(404).json({
                message: "Job not found",
                success: false
            });
        }
        
        // Check if job is already filled
        if (job.positionsFilled >= job.numberOfPositions) {
            return res.status(400).json({
                message: "All positions for this job are already filled",
                success: false
            });
        }
        
        // Check if user has already accepted this job
        const userAlreadyAccepted = job.acceptedBy && job.acceptedBy.some(id => id.toString() === userId);
        
        if (userAlreadyAccepted) {
            return res.status(400).json({
                message: "You have already accepted this job",
                success: false
            });
        }
        
        // Add user to acceptedBy array and increment positionsFilled
        if (!job.acceptedBy) {
            job.acceptedBy = [];
        }
        
        job.acceptedBy.push(userId);
        job.positionsFilled = (job.positionsFilled || 0) + 1;
        
        // Update job status if all positions are filled
        if (job.positionsFilled >= job.numberOfPositions) {
            job.status = 'Filled';
        }
        
        await job.save();
        
        return res.status(200).json({
            message: "Job accepted successfully",
            success: true,
            job: {
                _id: job._id,
                title: job.title,
                positionsFilled: job.positionsFilled,
                numberOfPositions: job.numberOfPositions,
                status: job.status
            }
        });
    } catch (error) {
        console.error("Error accepting job:", error);
        return res.status(500).json({
            message: "Error accepting job",
            success: false,
            error: error.message
        });
    }
};

// Reject a job
export const rejectJob = async (req, res) => {
    try {
        const jobId = req.params.id;
        const userId = req.user.id; // From auth middleware
        
        // Find the job
        const job = await Job.findById(jobId);
        
        if (!job) {
            return res.status(404).json({
                message: "Job not found",
                success: false
            });
        }
        
        // Check if user has already rejected this job
        const userAlreadyRejected = job.rejectedBy && job.rejectedBy.some(id => id.toString() === userId);
        
        if (userAlreadyRejected) {
            return res.status(400).json({
                message: "You have already rejected this job",
                success: false
            });
        }
        
        // Add user to rejectedBy array
        if (!job.rejectedBy) {
            job.rejectedBy = [];
        }
        
        job.rejectedBy.push(userId);
        await job.save();
        
        return res.status(200).json({
            message: "Job rejected successfully",
            success: true,
            job: {
                _id: job._id,
                title: job.title,
                status: job.status
            }
        });
    } catch (error) {
        console.error("Error rejecting job:", error);
        return res.status(500).json({
            message: "Error rejecting job",
            success: false,
            error: error.message
        });
    }
}; 