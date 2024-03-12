const express = require("express");
const session = require('express-session');
const app = express();
//const bcrypt = require("bcrypt");
const path = require('path');
const PORT = 3000;
const collection = require("./models/config");
const router = require("./routes/router")
const nocache = require("nocache");


app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.set('view engine', 'ejs');
app.use("/static", express.static('public'));

app.use(router);

// session middleware
app.use(nocache());
app.use(session({
    secret: "mysecret",
    resave: false,
    saveUninitialized: true
}));


app.get('/login', (req, res) => {
    if(req.session.user){
        res.render("home",{
            userid:req.session.user
        })
    }else{
    res.render("login");
    console.log("Login: Active");
    }
});

app.get('/signup', (req, res) => {
    res.render("signup");
    console.log("Signup: Active");
});

app.post('/login', async (req, res) => {
    const logdata = {
        name: req.body.email,
        password: req.body.password
    };

    const check = await collection.findOne({ name: logdata.name });

    if (check) {
        const passcheck = await collection.findOne({ password: logdata.password });

        if (passcheck) {
            // Set session variable
            req.session.user = logdata.name;

            res.render("home", {
                userid: logdata.name
            });
        } else {
            res.render("login",{
                incorrect:"Incorrect Password"
            });
        }
    } else {
        res.send("Invalid details");
    }
});

app.post("/signup", async (req, res) => {
    const data = {
        name: req.body.email,
        password: req.body.password
    };

    const userexists = await collection.findOne({ name: data.name });

    if (userexists) {
        res.send("User already exists.");
    } else {
        const userdata = await collection.insertMany(data);
        console.log(userdata);
        res.render("login");
    }
});

app.get('/logout', (req, res) => {
    // Destroy the session
    req.session.destroy(function (err) {
        if (err) {
            res.send("Error");
        } else {
            res.render('login',{
                logout:"Logout Succesfully!!!"
            });
        }
    });
});

app.listen(PORT, () => {
    console.log(`Server Deployed at http://localhost:${PORT}/login`);
});
