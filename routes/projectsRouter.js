import express from 'express'
import { createProjects } from '../controllers/projectsController.js'

const ProjectRouter = express.Router()

ProjectRouter.post("/",createProjects)

export default ProjectRouter
