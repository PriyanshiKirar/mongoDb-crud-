const mongoose=require("mongoose");

const selSchema=mongoose.Schema({
    product:String,
    prize:Number,
})
module.exports=mongoose.model("sel",selSchema);