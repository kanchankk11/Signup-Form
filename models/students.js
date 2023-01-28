const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');

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
    },
    tokens : [{
        token : {
            type : String,
            required : true
        }
    }]
});

stdSchema.methods.generateAuthToken = async function(){
    try {
        const generatedToken = jwt.sign({_id : this._id},"ASDFGHJKLPOIUYTREWQZXCVMNB");
        //* Adding the generated token to our db
        this.tokens = this.tokens.concat({token : generatedToken});
        await this.save();
        
        return generatedToken;
    } catch (error) {
        console.log(error);
    }
}
const Students = mongoose.model("student", stdSchema);

module.exports = Students;