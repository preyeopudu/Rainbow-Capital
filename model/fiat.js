const mongoose = require('mongoose')

const fiatSchema = mongoose.Schema({
    accountName:String,
    amount:Number,
    accountNumber:String,
    bank:String,
    user:String,
    ip:String
})

module.exports =mongoose.model("Fiat",fiatSchema)