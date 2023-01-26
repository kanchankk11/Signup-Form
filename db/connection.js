const mongoose = require('mongoose');

const dbURL = "mongodb://127.0.0.1:27017/students";
mongoose.set('strictQuery', false);
mongoose.connect(dbURL).then(()=>{
    console.log("Connection to DB successful");
}).catch((err)=>{
    console.log(err);
})