import mongoose from "mongoose";

const educationSchema = mongoose.Schema({
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
    details : [
        {
            eduLevel : {
                type : String,
                required : true
            },
            school : {
                type : String,
                required : true
            },
            degree : {
                type : String
            },
            startDate : {
                type : Date,
                required : true
            },
            endDate : {
                type : Date
            },
            description :{
                type : String
            }
        }
    ]
})
const Education = mongoose.model("education",educationSchema)
export default Education