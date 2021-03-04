const mongoose = require('mongoose')


const otpSchema = mongoose.Schema({
    code:String
})
//

module.exports =mongoose.model("OTP",otpSchema)