import express from "express";
import { 
    getAllCompanies, 
    getCompanyById, 
    createCompany, 
    updateCompany, 
    deleteCompany
} from "../controllers/companyController.js";
import { verifyToken, isAdmin } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Public routes
router.get("/get", getAllCompanies);
router.get("/get/:id", getCompanyById);

// Admin routes
router.use(verifyToken);
router.use(isAdmin);
router.post("/create", createCompany);
router.put("/update/:id", updateCompany);
router.delete("/delete/:id", deleteCompany);

export default router; 