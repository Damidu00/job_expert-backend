import mongoose from "mongoose";

const certificationsSchema = mongoose.Schema({
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
    certificates : [
        {
            instituteName : {
                type : String,
                required : true
            },
            certificateName : {
                type : String,
                required : true
            },
            Link : {
                type : String
            }
        }
    ]
})

const Certificates = mongoose.model("certificates",certificationsSchema)
export default Certificates