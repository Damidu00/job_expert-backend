import express from "express";
import { createEducation, getAllEducation } from "../controllers/EducationControllers.js";

const educationRoutes = express.Router()

educationRoutes.post("/",createEducation)
educationRoutes.get("/:userId",getAllEducation)

export default educationRoutes