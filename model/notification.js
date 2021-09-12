const mongoose = require('mongoose')

const notificationSchema=mongoose.Schema({
    title:String,
    text:String,
    date:{type:Date,default:Date.now()}
})

module.exports =mongoose.model("Notification",notificationSchema)