import express from "express";
import { 
    getAllJobs, 
    getAdminJobs, 
    getJobById, 
    postJob, 
    editJob, 
    deleteJob,
    reviewJob,
    applyForJob,
    updateApplicationStatus,
    acceptJob,
    rejectJob
} from "../controllers/jobController.js";
import { verifyToken, isAdmin } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Public routes
router.get("/get", getAllJobs);
router.get("/get/:id", getJobById);

// Protected routes (require login)
router.use(verifyToken);
router.post("/review/:id", reviewJob); // For users to review jobs
router.post("/apply/:id", applyForJob); // For users to apply for jobs
router.post("/accept/:id", acceptJob); // For users to accept jobs
router.post("/reject/:id", rejectJob); // For users to reject jobs

// Admin routes
router.use(isAdmin);
router.get("/admin", getAdminJobs);
router.post("/create", postJob);
router.put("/edit/:id", editJob);
router.delete("/delete/:id", deleteJob);
router.patch("/applications/:jobId/:applicationId", updateApplicationStatus);

export default router; 