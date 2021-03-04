const mongoose = require('mongoose')
const passportLocalMongoose=require('passport-local-mongoose')
const Receipt = require('./receipt')
const Stack= require('./stack')

const userSchema=new mongoose.Schema({
    
    username:String,
    name:String,
    referee:String,//User who referred you


    withdrawble:{type:Number,default:0},
    deposit:{type:Number,default:0},
    lockedFund:{type:Number,default:0},
    referalAmount:{type:Number,default:0},//amount gained from referal

    adPoint:{type:Number,default:0},
    bonus:{type:Boolean,default:false},//referal bonus


    stack:[Stack.schema],
    receipt:[Receipt.schema],
    people:[Object],//array of people referred


    message:Boolean,
    referal:{type:Number,default:0},//amount of people reffered
    notice:{type:Boolean,default:true},
    shared:{type:Boolean,default:false},



    ip:String,//ip address of user
    previous:{type:Number,default:0},//previous user plan
    secretCode:String//
    
    

    
    
})


userSchema.plugin(passportLocalMongoose)
module.exports =mongoose.model("User",userSchema)