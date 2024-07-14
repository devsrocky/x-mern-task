const jwt = require('jsonwebtoken')

module.exports = (req, res, next) => {
    
    let token = req.headers["token"]
    if(!token){
        token = req.cookies['token']
    }

    let decoded = jwt.verify(token, 'loCkker%9875&69Raw')

    if(decoded){

        let email = decoded['data']
        req.headers['email'] = email
        next()
        
    }else{
        res.status(401).json({status: 'Expired', message: 'It seems to be the token is expired'})
    }

} 