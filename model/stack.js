const mongoose = require('mongoose')


const stackSchema = mongoose.Schema({
    name:String,
    startingDate:{type:Date,default: Date.now()},
    matureDate:Date,
    cost:Number,
    return:Number,
    isActive:Boolean,
    isMatured:Boolean
})
//

module.exports =mongoose.model("Stack",stackSchema)