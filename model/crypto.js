const mongoose = require('mongoose')

const cryptoSchema = mongoose.Schema({
    wallet:String,
    amount:Number,
    type:String,
    user:String,
    facebook:String,
    ip:String,
    date:{type:Date,default:Date.now()},
})

module.exports =mongoose.model("Crypto",cryptoSchema)