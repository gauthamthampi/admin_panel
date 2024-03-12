const mongoose = require("mongoose");
const connect = mongoose.connect("mongodb://localhost:27017/Login");

connect.then(()=>{
    console.log("Database Connected Succesfully.");
}).catch(()=>{
    console.log("Oops!! DB coudn't connect.");
});

const LoginSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    password:{
        type: String,
        required: true
    }
});

const collection = new mongoose.model("Users",LoginSchema);

module.exports = collection;