import mongoose from "mongoose";

const skillSchema = mongoose.Schema({
    userId: {
      type : String,
      required: true
    },
    cvId : {
      type : String,
      required : true
    },
    skills: [
      {
        category: { type: String, required: true },
        items: { type: [String], required: true }
      }
    ]
  });
const Skills = mongoose.model("skills",skillSchema)
export default Skills