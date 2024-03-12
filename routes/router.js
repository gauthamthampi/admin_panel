const express = require("express");
const session = require("express-session");
const collection = require("../models/config");
const router = express.Router();
const nocache = require("nocache")
router.use(nocache())
router.use(session({
    secret: "mysecret",
    resave: false,
    saveUninitialized: true
}));

const adminpass = {
    username:"admin@gmail.com",
    password:"admin123"
}


router.get("/adminlog",(req,res)=>{
    if(req.session.user){
        collection.find({}).exec()
        .then(users =>{
            res.render("admin",{
                users:users
            })    
        })
        .catch(err=>{
            res.send(err)
        })
   }else{
    res.render("adminlog")
   }
})
 router.post("/adminlog",(req,res)=>{
    if(req.body.email===adminpass.username && req.body.password===adminpass.password){
    req.session.user = req.body.email;
    collection.find({}).exec()
        .then(users =>{
            res.render("admin",{
                users:users
            })
        })
        .catch(err=>{
            res.send(err)
        })
        
    }else{
        res.send("Invalid details")
    }
})
router.get("/adduser",(req,res)=>{
    res.render("adduser")
})
router.post("/adduser",async(req,res)=>{
    const newdata = {
        name:req.body.email,
        password:req.body.password
    }
    const userexists = await collection.findOne({name:newdata.name});
    if(userexists){
        res.render("adduser",{
            already:"User already exists"
        })
    }else{
    const newd = await collection.insertMany(newdata)
    console.log(newdata);
    res.render("adduser",{
        success:"User added successfully!"
    })
    }
})

router.get("/edituser/:id",(req,res)=>{
    let id = req.params.id;
    collection.findById(id).exec()
    .then(users=>{
        res.render("edituser",{
            users:users,
            
        })
    })
    .catch(err => {
        console.log(err);
    })
})

router.post("/edituser/:id",(req,res)=>{
    let id = req.params.id;
    collection.findByIdAndUpdate(id,{
        name:req.body.email,
        password:req.body.password
    }).exec()
    .then(users=>{
        res.render("edituser",{
            users:users,
            already:"User updated"
        })
    })
    .catch(err => {
        console.log(err);
    })

})

router.get("/deleteuser/:id",(req,res)=>{
    let id = req.params.id;
    collection.findByIdAndDelete(id).exec()
    .then(users=>{
        collection.find({}).exec()
        .then(users=>{
            res.render("admin",{
                users:users,
                success:"User deleted sucessfully!!"
        })
        })
    })
    .catch(err=>{
        console.log(err);
    })
})

router.get("/admlogout",(req,res)=>{
    req.session.destroy(function(err){
        if(err){
            res.send("Error");
        }else{
            res.render("adminlog");
        }
    })
})
module.exports = router;