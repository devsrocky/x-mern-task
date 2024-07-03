const express = require('express')
const router = express.Router()

// AUTH-VERIFY MIDDLEWARE
const AuthVerify = require('../middleware/AuthVerify')

// CONTROLLER'S
const usersController = require("../controller/usersController")
const tasksController = require('../controller/tasksController')

// USER'S || path specified
router.post('/registration', usersController.registration)
router.post('/login', usersController.login)
router.post('/updateUser', AuthVerify, usersController.updateUser)

// TASKS || path specified
router.post('/createTask', AuthVerify, tasksController.createTask)
router.post('/updateTask/:id/:status', AuthVerify, tasksController.updateTask)
router.get('/deleteTask/:id', AuthVerify, tasksController.deleteTask)

router.get('/TaskListByStatus/:status', AuthVerify, tasksController.TaskListByStatus)
router.get('/TaskStatusCount', AuthVerify, tasksController.TaskStatusCount)


// MODULE EXPORT
module.exports = router;