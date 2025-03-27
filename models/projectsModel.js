import mongoose from "mongoose";

const projectSchema = mongoose.Schema({
    userId : {
        type : String,
        required : true
    },
    cvId : {
        type : String,
        required : true
    },
    date : {
        type : Date,
        default : Date.now
    },
    projects: [
        {
          title: { 
            type: String, 
            required: true, 
            trim: true 
        }, 
          description: { 
            type: String, 
            required: true, 
            trim: true 
        }, 
          githubLink: { 
            type: String, 
            required: true, 
            trim: true 
        }, 
          liveDemo: { 
            type: String, 
            trim: true 
        }, 
          techStack: [{ 
            type: String, 
            trim: true 
        }], 
          createdAt: { 
            type: Date, 
            default: Date.now 
        }
        }
      ]
    
})

const Projects = mongoose.model("projects",projectSchema)
export default Projects