const mongoose = require('mongoose')
const passportLocalMongoose=require('passport-local-mongoose')
const Receipt = require('./receipt')
const Stack= require('./stack')

const userSchema=new mongoose.Schema({
    
    username:String,
    name:String,
    secret:String,
    referee:String,
    bonus:{type:Boolean,default:false},
    message:Boolean,
    withdrawble:{type:Number,default:0},
    deposit:{type:Number,default:0},
    stack:[Stack.schema],
    receipt:[Receipt.schema],
    notice:{type:Boolean,default:true}
})


userSchema.plugin(passportLocalMongoose)
module.exports =mongoose.model("User",userSchema)