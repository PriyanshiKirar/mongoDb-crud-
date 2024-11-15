const mongoose=require("mongoose");

const selSchema=mongoose.Schema({
    product:String,
    prize:Number,
    email:String
})
module.exports=mongoose.model("sel",selSchema);