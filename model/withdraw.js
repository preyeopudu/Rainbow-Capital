const mongoose = require('mongoose')


const withdrawSchema = mongoose.Schema({
    paymentType:String,
    paymentDate:Date,
    amount:Number,
    address:String
})
//

module.exports =mongoose.model("Withdraw",withdrawSchema)