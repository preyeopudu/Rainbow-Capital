const mongoose = require('mongoose')

const couponSchema=mongoose.Schema({
    value:Number,
    code:String,
    date:{type:Date,default:Date.now()}
})

module.exports =mongoose.model("Coupon",couponSchema)