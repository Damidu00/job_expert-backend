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