require('dotenv').config();
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const Students = require('../models/students');

const auth = async (req, res, next) => {
    try {
        //* fetching the cookie
        const token = req.cookies.stdToken;

        //* Validating the cookie
        const verifyUser = jwt.verify(token, process.env.SECRET_KEY);

        //*Finding data against the cookie i.e token
        const user = await Students.findOne({_id : verifyUser._id});

        req.token = token;
        req.user = user;
        console.log(user);        
        next();
        //console.log(verifyUser);
    } catch (error) {
        //res.status(401).send(error);
        res.render("login");
    }
}

module.exports = auth;