const mongoose = require('mongoose')

const receiptSchema=mongoose.Schema({
    text:String,
    date:{type:Date,default:Date.now()},
    postBalance:String,
    details:String
})

module.exports =mongoose.model("Receipt",receiptSchema)