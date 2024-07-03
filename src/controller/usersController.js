const userModel = require('../model/usersModel')
const jwt = require('jsonwebtoken')

exports.registration = async (req, res) => {
    try{
        let postBody = req.body;
        let user = await userModel.create(postBody)
        res.status(201).json({status: 'success', data: user})
    }catch(e){
        res.status(400).json({status: 'failed', data: e.toString()})
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