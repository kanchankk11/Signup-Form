require('dotenv').config();
const mongoose = require('mongoose');

const dbURL = process.env.DB_URL + process.env.DB_NAME;
mongoose.set('strictQuery', false);
mongoose.connect(dbURL).then(()=>{
    console.log("Connection to DB successful");
}).catch((err)=>{
    console.log(err);
})