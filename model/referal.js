const mongoose = require('mongoose')

const referalSchema=mongoose.Schema({
    userName:String,
    date:{type:Date,default:Date.now()},
    amount:Number
})

module.exports =mongoose.model("Referal",referalSchema)