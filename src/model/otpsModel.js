const mongoose = require('mongoose')

const dataSchema = mongoose.Schema({

    email: {type: String},
    OTP: {type: String},
    status: {type: Number, default: '0'},
    createdDate: {type: Date, default: Date.now()}

}, {versionKey: false})

const OTPModel = mongoose.model('otps', dataSchema)
module.exports = OTPModel