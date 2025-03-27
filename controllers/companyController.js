import { Company } from "../models/companyModel.js";

// Get all companies
export const getAllCompanies = async (req, res) => {
    try {
        const companies = await Company.find().sort({ name: 1 });
        return res.status(200).json(companies);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Error retrieving companies", error: error.message });
    }
};

// Get company by ID
export const getCompanyById = async (req, res) => {
    try {
        const company = await Company.findById(req.params.id);
        
        if (!company) {
            return res.status(404).json({ message: "Company not found" });
        }
        
        return res.status(200).json(company);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Error retrieving company", error: error.message });
    }
};

// Create a new company
export const createCompany = async (req, res) => {
    try {
        const { 
            name, description, industry, location,
            website, logo, contactEmail, contactPhone
        } = req.body;
        
        // Validation
        if (!name || !description || !industry || !location || !contactEmail) {
            return res.status(400).json({ message: "Required fields missing" });
        }
        
        // Check if company with same name already exists
        const existingCompany = await Company.findOne({ name });
        if (existingCompany) {
            return res.status(400).json({ message: "A company with this name already exists" });
        }
        
        const newCompany = new Company({
            name,
            description,
            industry,
            location,
            website,
            logo,
            contactEmail,
            contactPhone,
            createdBy: req.user.id // Assuming middleware sets req.user
        });
        
        const savedCompany = await newCompany.save();
        
        return res.status(201).json({
            message: "Company created successfully",
            company: savedCompany
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Error creating company", error: error.message });
    }
};

// Update a company
export const updateCompany = async (req, res) => {
    try {
        const companyId = req.params.id;
        const updates = req.body;
        
        const company = await Company.findById(companyId);
        
        if (!company) {
            return res.status(404).json({ message: "Company not found" });
        }
        
        // Check if user has permission (admin or creator)
        if (company.createdBy.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ message: "Unauthorized: You cannot update this company" });
        }
        
        const updatedCompany = await Company.findByIdAndUpdate(
            companyId,
            { $set: updates },
            { new: true }
        );
        
        return res.status(200).json({
            message: "Company updated successfully",
            company: updatedCompany
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Error updating company", error: error.message });
    }
};

// Delete a company
export const deleteCompany = async (req, res) => {
    try {
        const companyId = req.params.id;
        
        const company = await Company.findById(companyId);
        
        if (!company) {
            return res.status(404).json({ message: "Company not found" });
        }
        
        // Check if user has permission (admin or creator)
        if (company.createdBy.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ message: "Unauthorized: You cannot delete this company" });
        }
        
        await Company.findByIdAndDelete(companyId);
        
        return res.status(200).json({ message: "Company deleted successfully" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Error deleting company", error: error.message });
    }
}; 