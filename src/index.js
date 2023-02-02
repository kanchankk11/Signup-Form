require('dotenv').config();
const exp = require('constants');
const express = require('express');
require('./db/connection');
const Students = require('./models/students');
const bcrypt = require('bcrypt');
const path = require('path');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const auth = require('./middleware/auth');

const port = process.env.PORT || 8000;
const app = express(); 
const templatePath = path.join(__dirname,"../template/views");
const staticpath = path.join(__dirname,"../public")

app.set("view engine", "hbs");
app.set("views", templatePath);
app.use(express.static(staticpath));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({extended : false}));

const securePass = async (password) => {
    const secpass = await bcrypt.hash(password, 10);
    return secpass;
}

app.get("/",(req,res) => {
    res.render("index");
});

app.get("/register", (req,res) => {
    res.render("register");
})

app.get("/login", auth, async (req,res) => {
    
    //* Clearing the token from DB

    req.user.tokens = req.user.tokens.filter((eachToken) => {
        return eachToken.token != req.token;
    })

    await req.user.save();
    //! If the user is already logged in then he/she will be redirected to 'private' page
    //? Else the auth will redirect it to login page and the below code will not execute
    //* That is why below code is redirecting to 'private' page.

    res.render("private");
})

app.get('/private', auth, (req,res) => {
    res.render("private");
})

app.post("/register", async (req, res) =>{
    try {
        
            const password = req.body.password;
            const repassword = req.body.repassword;
            const secpass = await securePass(password);
            
        if(password != repassword){
            res.send("Password mismatch")
        }
        else{
            const std = new Students({
                name : req.body.name,
                email : req.body.email,
                phone : req.body.phone,
                password : secpass
            });

            const token = await std.generateAuthToken();
            //console.log(token);

            const result = await std.save();
            res.status(201).render("index");
        }
    } catch (error) {
        res.json(error)
        console.log(error);
    }
});

app.post("/login", async (req, res) => {
    const email = req.body.email;
    const pass = req.body.password;
    securePass(pass);

    try {
        const result = await Students.findOne({email});
        
        if(result == null ){
            res.status(400).send("Incorrent credentials")
        }
        else {
            const match = await bcrypt.compare(pass, result.password);
            
           // console.log(token);
            if (match) {
                
                const token = await result.generateAuthToken();
                //*Storing the token in cookie
                res.cookie("stdToken",token, {
                    expires : new Date(Date.now() + 120000),
                    httpOnly : true
                });

                res.status(200).render("private");
            } else {
                res.status(400).send("Incorrent credentials")
            }
        }
    } catch (error) {
        console.log(error);
    }
});

app.get('/logout', auth,  async (req, res) => {
    try {
        res.clearCookie("stdToken");
        res.render("index");
    } catch (error) {
        res.status(500).send(error);
    }
})

app.listen(port, (err) => {
    if(err){
        console.log(err);
    }
    else{
        console.log(`Listening at port ${port}`);
    }
})