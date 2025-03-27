import express from "express";
import { createSkills, getSkills } from "../controllers/skillsController.js";

const skillsRoutes = express.Router()

skillsRoutes.post("/",createSkills)
skillsRoutes.get("/:userId",getSkills)

export default skillsRoutes