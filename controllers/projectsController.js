import Projects from "../models/projectsModel.js";

export async function createProjects(req,res){
    try {
        const details = req.body; 
        const projects = new Projects(details)
        await projects.save()

        res.json({
            message : "projects Created"
        })
    } catch (error) {
        res.json({
            message : "error to create projects",
            error : error.message
        })
    }
    
}

export async function getAllProjects(req,res) {
    try {
        const userId = req.params.userId
        const allprojects = await Projects.findOne({userId : userId})
        res.json(allprojects)
    } catch (error) {
        res.status(500).json({
            error : error.message,
            message : "cannot fetch projects"
        })
    }
}