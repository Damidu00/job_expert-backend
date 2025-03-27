import mongoose from "mongoose";

const RefereeSchema = mongoose.Schema({
    userId : {
        type : String,
        required : true
    },
    cvId : {
        type : String,
        required : true
    },
    referees : [
        {
            refType : {
                type : String,
                enum: ["male", "female"],
                required : true
            },
            FirstName : {
                type : String,
                required : true
            },
            LastName : {
                type : String,
                required : true
            },
            position : {
                type : String,
                required : true
            },
            workingPlace : {
                type : String,
                required : true
            },
            location : {
                type : String,
                required : true
            },
            phone : {
                type : String,
                required : true
            }
        }
    ],
    

})

const Referees = mongoose.model("referees",RefereeSchema)
export default Referees