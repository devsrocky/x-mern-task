const userModel = require('../model/usersModel')
const OTPModel = require('../model/otpsModel')
const jwt = require('jsonwebtoken');
const SendEmailUtility = require('../utility/SendEmail');

exports.registration = async (req, res) => {
    try{
        let postBody = req.body;
        let user = await userModel.create(postBody)
        res.status(200).json({status: 'success', data: user})
    }catch(e){
        res.status(200).json({status: 'failed', data: e.toString()})
    }
}

exports.login = async (req, res) => {
    try{

        let reqbody = req.body;
        let userCount = await userModel.aggregate([
            {$match: reqbody}
        ])
        if(userCount.length> 0){
            let payload = {exp: Math.floor(Date.now() / 1000) + (24*60*60), data: userCount[0]['email']}
            let token = jwt.sign(payload, 'loCkker%9875&69Raw')

            res.cookie('token', token)

            res.status(200).json({status: 'success', token: token, data: userCount[0]})
        }else{
            res.status(200).json({status: 'Unauthorized', message: 'Enter correct email & password!'})
        }

    }catch(e){
        res.status(401).json({status: 'Unauthorized', message: 'It seems to be you are unauthorized user', data: e.toString()})
    }
}

exports.updateUser = async (req, res) => {
    try{

        let email = req.headers['email']
        let reqBody = req.body;
        let userUPdate = await userModel.updateOne({email:email}, {$set: reqBody})
        res.status(201).json({status: 'success', message: 'Profile update success', data: userUPdate})

    }catch(e){
        res.status(401).json({status: 'failed', data: e.toString()})
    }
}

exports.profileDetails = async (req, res) => {
    try{
        let email = req.headers['email']
        let MatchStage = {$match: {email:email}}
        let data = await userModel.aggregate([
            MatchStage
        ])
        res.status(200).json({status: 'success', data: data})

    }catch(e){
        res.status(200).json({status: 'failed', data: e.toString()})
    }
}


// ------ Password recovary step-1 --------
exports.sendOTP = async (req, res) => {

    try{

        let email = req.params.email
        let OTP = Math.floor(100000 + Math.random() * 900000)

        // Email Query
        let userCount = await userModel.aggregate([{$match: {email: email}}], {$count: 'count'})
        if(userCount.length>0){

            // OTP Insert
            let CreateOTP = await OTPModel.create({email:email, OTP:OTP})
            // Email Sent
            SendEmailUtility(email, 'Task Manager Password Recovary Code', `You Email verification code is ${OTP}`)

            res.status(200).json({status: 'success', message: 'We\'ve been sent email verification code.'})
        }else{
            res.status(200).json({status: 'Unauthorized', message: 'User didn\'t find with this email.'})
        }


    }catch(err){
        res.status(401).json({status: 'failed', data: err.toString()})
    }
}



// ------ Password recovary step-2 --------
exports.verifyOTP = async (req, res) => {
    try{

        let email = req.params.email;
        let OTP = req.params.otp;
        let status = 0;
        let statusUpdate = 1;

        let OTPCount = await OTPModel.aggregate([{$match: {email:email, OTP: OTP, status: status}}, {$count: 'count'}])
        if(OTPCount.length>0){
            let OTPUpdate = await OTPModel.updateOne({email:email, OTP: OTP, status: status}, {email:email, OTP: OTP, status: statusUpdate})
            res.status(200).json({status: 'success', message: 'OTP Verification success', data: OTPUpdate})
        }else{
            res.status(401).json({status: 'failed', message: 'Invalid OTP code'})
        }
    }catch(e){
        res.status(401).json({status: 'failed', data: e.toString()})
    }
}


// ------ Password recovary step-3 --------
exports.resetPassword = async (req, res) => {
    try{

        let email = req.body['email']
        let OTP = req.body['OTP']
        let newPass = req.body['password']
        let statusUpdate = 1

        let OTPUsedCount = await OTPModel.aggregate([{$match: {email:email, OTP:OTP, status: statusUpdate}}, {$count: 'count'}])
        if(OTPUsedCount.length === 1){
            let update = await userModel.updateOne({email:email}, {password: newPass})
            await OTPModel.deleteOne({email:email, OTP:OTP})
            res.status(200).json({status: 'Bah', data: update})
        }
        res.status(200).json({status: OTPUsedCount , message: 'OTP Code isn\'t verified'})


    }catch(e){
        res.status(400).json({status: 'failed', data: e.toString()})
    }
}