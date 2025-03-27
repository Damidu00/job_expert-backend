import express from "express";
import { createExperiences, getAllExperiences } from "../controllers/experienceController.js";

const ExperienceRoutes = express.Router()

ExperienceRoutes.post("/",createExperiences)
ExperienceRoutes.get("/:userId",getAllExperiences)


export default ExperienceRoutes