// BASIC LIB IMPORT
const express = require("express")
const router = require('./src/route/api')
const app = new express()
const bodyParser = require('body-parser')

// SECURITY MIDDLEWARE LIB IMPORT
const cors = require('cors')
const helmet = require('helmet')
const hpp = require('hpp')
const mongoSanitize = require('express-mongo-sanitize')
const rateLimit = require('express-rate-limit')
const xss = require('xss-clean')
const mongoose = require("mongoose")

// SECURITY MIDDLEWARE IMPLEMENT

app.use(cors({
    credentials:true,
    origin: "http://localhost:3000"
}))

app.use(helmet())
app.use(hpp())
app.use(mongoSanitize())
app.use(xss())

app.use(express.json({limit: '500mb'}))
app.use(express.urlencoded({extended: true}))

// BODY-PARSER IMPLEMENT
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))

// REQUEST RATE LIMIT
const limiter = rateLimit({windowMs: 15*60*1000, max: 30000})

app.use(limiter)

// MONGOOSE DATABASE CONNECTION
mongoose.connect('mongodb+srv://prodhanr72:CJxxNvDwnQPOJ4B2@cluster0.lrnr8rb.mongodb.net/temporary').then((res) => {
    console.log('MongoDB connected')
}).catch((e) => {
    console.log('MongoDB connection failed')
})

// ROUTING IMPLEMENT
app.use('/api/v1', router)


// UNDEFINE ROUTING IMPLEMENT
app.use('*', (req, res) => {
    res.status(404).json({status: 'Null', data: 'Data not found'})
})


// EXPORTS APP
module.exports = app