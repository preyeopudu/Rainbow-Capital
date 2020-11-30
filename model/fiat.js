const mongoose = require('mongoose')

const fiatSchema = mongoose.Schema({
    accountName:String,
    amount:Number,
    accountNumber:String,
    bank:String
})

module.exports =mongoose.model("Fiat",fiatSchema)