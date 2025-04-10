import express from 'express'
import { createProjects, getAllProjects } from '../controllers/projectsController.js'

const ProjectRouter = express.Router()

ProjectRouter.post("/",createProjects)
ProjectRouter.get("/:userId",getAllProjects)
export default ProjectRouter
