const mongoose=require("mongoose");

const userSchema=mongoose.Schema({
    name:String,
    firstName:String,
    email:String,
    password:String,
    age:Number,
})
module.exports=mongoose.model("user",userSchema);