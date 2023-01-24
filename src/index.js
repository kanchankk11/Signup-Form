const express = require('express');
const path = require('path');

const port = process.env.PORT || 3000;
const app = express();
const templatePath = path.join(__dirname,"../template/views");
const staticpath = path.join(__dirname,"../public")

console.log(staticpath);
app.set("view engine", "hbs");
app.set("views", templatePath);
app.use(express.static(staticpath));
app.get("/",(req,res) => {
    res.render("index");
})

app.listen(port, (err) => {
    if(err){
        console.log(err);
    }
    else{
        console.log(`Listening at port ${port}`);
    }
})