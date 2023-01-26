const mongoose = require('mongoose');
const validator = require('validator');
const stdSchema = mongoose.Schema({
    name : {
        type : String,
        required : true
    },
    email : {
        type : String,
        required : true,
        unique : [true, "Email ID already exists"],
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error("Not a Valid mail")
            }
        }
    },
    phone : {
        type : String,
        required : true,
        unique : [true, "Phone number already exists"]
    },
    password : {
        type : String,
        required : true
    }
});

const Students = mongoose.model("student", stdSchema);

module.exports = Students;