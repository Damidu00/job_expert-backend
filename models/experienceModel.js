import mongoose from "mongoose";

const experinceSchema = mongoose.Schema({
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
    experiences: [
        {
            company: { 
                type: String,
                required: true,
                trim: true 
            },
            jobTitle: { 
                type: String, 
                required: true, 
                trim: true 
            },
          startDate: { 
                type: Date, 
                required: true 
            },
          endDate: { 
                type: Date 
            },
          description: { 
                type: String 
            },
        }
      ]
})

const Experience = mongoose.model("experience",experinceSchema)
export default Experience