const mongoose = require('mongoose')

const pointSchema = mongoose.Schema({
    username:String,
    amount:Number,
    accountName:String
})

module.exports =mongoose.model("Point",pointSchema)